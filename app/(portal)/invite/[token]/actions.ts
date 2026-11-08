"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ORG_COOKIE, getDb } from "@/lib/portal/env";
import {
  RATE_LIMIT_MESSAGE,
  applyInviteStatements,
  checkPassword,
  cookieOptions,
  endSession,
  findInvite,
  getSessionUser,
  hashPassword,
  nowIso,
  passwordProblem,
  startSession,
  type InviteRow,
} from "@/lib/portal/auth";
import { guarded } from "@/lib/portal/action-utils";
import { ValidationError, text } from "@/lib/portal/validate";
import type { ActionState } from "@/lib/portal/types";

function readPassword(formData: FormData, name: string): string {
  const raw = formData.get(name);
  return typeof raw === "string" ? raw : "";
}

/** Marks the invite used. Returns false if someone else used it a moment ago. */
async function claim(db: D1Database, invite: InviteRow): Promise<boolean> {
  const res = await db.prepare("UPDATE invites SET used_at = ? WHERE id = ? AND used_at IS NULL").bind(nowIso(), invite.id).run();
  return res.meta.changes === 1;
}

async function finish(db: D1Database, userId: string, invite: InviteRow, switchUser: boolean): Promise<never> {
  if (switchUser) await endSession();
  await startSession(db, userId);
  if (invite.org_id) (await cookies()).set(ORG_COOKIE, invite.org_id, await cookieOptions(60 * 60 * 24 * 365));
  redirect(invite.org_id ? "/dashboard" : "/dashboard/admin");
}

/**
 * Accepts an invite. Three cases, decided on the server from the invite's email:
 *   * signed in as that email already: just join;
 *   * an account with that email exists: confirm its current password (rate limited);
 *   * no account yet: create one with the name and password from the form.
 * An invite never changes the password of an existing account.
 */
export async function acceptInvite(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const db = await getDb();
    if (!db) return { ok: false, message: "The client portal is not configured yet." };
    const token = String(formData.get("token") ?? "");
    const invite = await findInvite(db, token);
    if (!invite) return { ok: false, message: "This invite link is invalid, used or expired. Ask for a new one." };

    const current = await getSessionUser();
    const existing = await db
      .prepare("SELECT id, password_hash FROM users WHERE email = ?")
      .bind(invite.email)
      .first<{ id: string; password_hash: string | null }>();

    if (existing) {
      if (!(current && current.id === existing.id)) {
        if (!existing.password_hash) {
          return { ok: false, message: "This account signs in with Google. Sign in with Google first, then open this link again." };
        }
        const check = await checkPassword(db, invite.email, readPassword(formData, "password"));
        if (!check.ok) return { ok: false, message: check.reason === "rate_limited" ? RATE_LIMIT_MESSAGE : "Wrong password for this account." };
      }
      if (!(await claim(db, invite))) return { ok: false, message: "This invite link was just used. Ask for a new one." };
      await db.batch(applyInviteStatements(db, existing.id, [invite]));
      return finish(db, existing.id, invite, Boolean(current && current.id !== existing.id));
    }

    const name = text(formData, "name", { label: "Name", max: 120 });
    const password = readPassword(formData, "password");
    const problem = passwordProblem(password);
    if (problem) throw new ValidationError(problem);
    if (password !== readPassword(formData, "confirm")) throw new ValidationError("The two passwords do not match.");

    if (!(await claim(db, invite))) return { ok: false, message: "This invite link was just used. Ask for a new one." };
    const userId = crypto.randomUUID();
    await db.batch([
      db
        .prepare("INSERT INTO users (id, email, name, password_hash, is_staff) VALUES (?, ?, ?, ?, ?)")
        .bind(userId, invite.email, name, await hashPassword(password), invite.is_staff === 1 ? 1 : 0),
      ...applyInviteStatements(db, userId, [invite]),
    ]);
    return finish(db, userId, invite, Boolean(current));
  });
}
