"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ORG_COOKIE, getDb } from "@/lib/portal/env";
import {
  clientIp,
  cookieOptions,
  endSession,
  getSessionUser,
  hashPassword,
  isRateLimited,
  isoIn,
  nowIso,
  passwordProblem,
  recordFailure,
  requestOrigin,
  startSession,
} from "@/lib/portal/auth";
import { randomToken, sha256Hex } from "@/lib/portal/crypto";
import { guarded, safeNext } from "@/lib/portal/action-utils";
import { ValidationError, email as readEmail, optionalText, text } from "@/lib/portal/validate";
import { sendAccountMail } from "@/lib/portal/mail";
import { findSignup } from "@/lib/portal/signup";
import type { ActionState } from "@/lib/portal/types";

const SIGNUP_HOURS = 24;

const SENT =
  "Almost done. We sent a confirmation link to your email. Open it to finish creating your account (check spam too). The link works for 24 hours.";

function readPassword(formData: FormData, name: string): string {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw : "";
}

/** Where to go after confirming: only the billing page or the dashboard. */
function afterConfirm(value: unknown): string {
  const next = safeNext(value);
  return next.startsWith("/dashboard") ? next : "/dashboard";
}

/**
 * Step 1 of sign-up: checks the form and emails a confirmation link. Nothing is created until
 * the link is opened. If the email already has an account we email a sign-in reminder instead,
 * and the reply on screen is the same either way, so the form does not reveal who has an account.
 */
export async function startSignup(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const db = await getDb();
    if (!db) return { ok: false, message: "The client portal is not configured yet." };

    // Honeypot: real people never see or fill this field.
    if (readPassword(formData, "website")) return { ok: true, message: SENT };

    const name = text(formData, "name", { label: "Name", max: 120 });
    const company = optionalText(formData, "company", { label: "Company", max: 120 });
    const address = readEmail(formData, "email");
    const password = readPassword(formData, "password");
    const problem = passwordProblem(password);
    if (problem) throw new ValidationError(problem);
    if (password !== readPassword(formData, "confirm")) throw new ValidationError("The two passwords do not match.");
    const next = afterConfirm(formData.get("next"));

    const ip = await clientIp();
    const key = `signup:${address}`;
    if (await isRateLimited(db, key, ip)) return { ok: false, message: "Too many sign-up attempts. Wait 15 minutes and try again." };
    await recordFailure(db, key, ip);

    const origin = await requestOrigin();
    const existing = await db.prepare("SELECT id FROM users WHERE email = ?").bind(address).first<{ id: string }>();
    if (existing) {
      await sendAccountMail({
        to: address,
        subject: "You already have a Moonlab account",
        greeting: `Hi ${name.split(" ")[0]},`,
        lines: ["Someone tried to create a Moonlab client portal account with this email, but you already have one.", "Sign in with your existing password. If you forgot it, you can reset it from the sign-in page."],
        button: { label: "Sign in", href: `${origin}/login` },
        footer: "If this was not you, you can ignore this email. Nothing has changed.",
      });
      return { ok: true, message: SENT };
    }

    const token = randomToken(32);
    await db.batch([
      db.prepare("DELETE FROM signup_requests WHERE email = ? AND used_at IS NULL").bind(address),
      db.prepare("DELETE FROM signup_requests WHERE expires_at < ?").bind(nowIso()),
      db
        .prepare("INSERT INTO signup_requests (token_hash, email, name, company, password_hash, expires_at) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(await sha256Hex(token), address, name, company, await hashPassword(password), isoIn(SIGNUP_HOURS * 60 * 60 * 1000)),
    ]);

    const link = `${origin}/signup/confirm/${token}${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`;
    const sent = await sendAccountMail({
      to: address,
      subject: "Confirm your Moonlab account",
      greeting: `Hi ${name.split(" ")[0]},`,
      lines: ["Thanks for signing up for the Moonlab client portal.", `Confirm your email to finish creating your account. The link works once and expires in ${SIGNUP_HOURS} hours.`],
      button: { label: "Confirm my email", href: link },
      footer: "If you did not sign up, ignore this email and no account will be created.",
    });
    if (!sent) return { ok: false, message: "We could not send the confirmation email right now. Try again in a few minutes." };
    return { ok: true, message: SENT };
  });
}

/** Step 2: the person clicked the link and pressed Confirm. Creates user, workspace and membership. */
export async function confirmSignup(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const db = await getDb();
    if (!db) return { ok: false, message: "The client portal is not configured yet." };
    const signup = await findSignup(db, String(formData.get("token") ?? ""));
    if (!signup) return { ok: false, message: "This confirmation link is invalid, used or expired. Sign up again to get a new one." };

    const claimed = await db
      .prepare("UPDATE signup_requests SET used_at = ? WHERE token_hash = ? AND used_at IS NULL")
      .bind(nowIso(), signup.token_hash)
      .run();
    if (claimed.meta.changes !== 1) return { ok: false, message: "This link was just used. Try signing in." };

    const taken = await db.prepare("SELECT id FROM users WHERE email = ?").bind(signup.email).first<{ id: string }>();
    if (taken) return { ok: false, message: "An account with this email already exists. Sign in instead." };

    const userId = crypto.randomUUID();
    const orgId = crypto.randomUUID();
    const orgName = signup.company || `${signup.name.split(" ")[0]}'s workspace`.slice(0, 120);
    await db.batch([
      db.prepare("INSERT INTO users (id, email, name, password_hash, is_staff) VALUES (?, ?, ?, ?, 0)").bind(userId, signup.email, signup.name, signup.password_hash),
      db.prepare("INSERT INTO organizations (id, name) VALUES (?, ?)").bind(orgId, orgName),
      db.prepare("INSERT INTO memberships (user_id, org_id, role) VALUES (?, ?, 'client')").bind(userId, orgId),
      db.prepare("DELETE FROM signup_requests WHERE email = ?").bind(signup.email),
    ]);

    if (await getSessionUser()) await endSession();
    await startSession(db, userId);
    (await cookies()).set(ORG_COOKIE, orgId, await cookieOptions(60 * 60 * 24 * 365));
    redirect(afterConfirm(formData.get("next")));
  });
}
