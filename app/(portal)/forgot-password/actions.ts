"use server";

import { getDb } from "@/lib/portal/env";
import { RESET_HOURS, clientIp, isRateLimited, isoIn, recordFailure, requestOrigin } from "@/lib/portal/auth";
import { randomToken, sha256Hex } from "@/lib/portal/crypto";
import { guarded } from "@/lib/portal/action-utils";
import { email as readEmail } from "@/lib/portal/validate";
import { sendAccountMail } from "@/lib/portal/mail";
import type { ActionState } from "@/lib/portal/types";

const SENT = "If that email has an account, a reset link is on its way. Check your inbox (and spam). The link works once, for 24 hours.";

/**
 * Emails a one-time password reset link. The reply is the same whether or not the account
 * exists, so the form cannot be used to find out who has an account. Each request counts
 * toward the same rate limit as failed sign-ins (5 per email and IP, 30 per IP, 15 minutes).
 */
export async function requestPasswordReset(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const db = await getDb();
    if (!db) return { ok: false, message: "The client portal is not configured yet." };
    const address = readEmail(formData, "email");
    const ip = await clientIp();
    const key = `reset:${address}`;
    if (await isRateLimited(db, key, ip)) return { ok: false, message: "Too many requests. Wait 15 minutes and try again." };
    await recordFailure(db, key, ip);

    const user = await db.prepare("SELECT id, name FROM users WHERE email = ?").bind(address).first<{ id: string; name: string | null }>();
    if (!user) return { ok: true, message: SENT };

    const token = randomToken(32);
    await db.batch([
      db.prepare("DELETE FROM password_resets WHERE user_id = ? AND used_at IS NULL").bind(user.id),
      db
        .prepare("INSERT INTO password_resets (token_hash, user_id, expires_at) VALUES (?, ?, ?)")
        .bind(await sha256Hex(token), user.id, isoIn(RESET_HOURS * 60 * 60 * 1000)),
    ]);

    const sent = await sendAccountMail({
      to: address,
      subject: "Reset your Moonlab password",
      greeting: user.name ? `Hi ${user.name.split(" ")[0]},` : "Hi,",
      lines: ["Someone (hopefully you) asked to reset the password for your Moonlab client portal account.", `The link below works once and expires in ${RESET_HOURS} hours.`],
      button: { label: "Choose a new password", href: `${await requestOrigin()}/reset/${token}` },
      footer: "If you did not ask for this, ignore this email. Your password stays the same.",
    });
    if (!sent) return { ok: false, message: "We could not send the email right now. Try again in a few minutes, or contact us." };
    return { ok: true, message: SENT };
  });
}
