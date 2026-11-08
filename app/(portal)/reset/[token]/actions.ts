"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/portal/env";
import { endSession, findPasswordReset, hashPassword, nowIso, passwordProblem, startSession } from "@/lib/portal/auth";
import { guarded } from "@/lib/portal/action-utils";
import { ValidationError } from "@/lib/portal/validate";
import type { ActionState } from "@/lib/portal/types";

/** Sets a new password from a one-time reset link, signs out every other session, signs in. */
export async function resetPassword(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const db = await getDb();
    if (!db) return { ok: false, message: "The client portal is not configured yet." };
    const token = String(formData.get("token") ?? "");
    const reset = await findPasswordReset(db, token);
    if (!reset) return { ok: false, message: "This reset link is invalid, used or expired. Ask for a new one." };

    const password = String(formData.get("password") ?? "");
    const problem = passwordProblem(password);
    if (problem) throw new ValidationError(problem);
    if (password !== String(formData.get("confirm") ?? "")) throw new ValidationError("The two passwords do not match.");

    const claimed = await db
      .prepare("UPDATE password_resets SET used_at = ? WHERE token_hash = ? AND used_at IS NULL")
      .bind(nowIso(), reset.token_hash)
      .run();
    if (claimed.meta.changes !== 1) return { ok: false, message: "This reset link was just used. Ask for a new one." };

    await db.batch([
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(await hashPassword(password), reset.user_id),
      db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(reset.user_id),
      db.prepare("DELETE FROM login_attempts WHERE email = ?").bind(reset.email),
    ]);
    await endSession();
    await startSession(db, reset.user_id);
    redirect("/dashboard");
  });
}
