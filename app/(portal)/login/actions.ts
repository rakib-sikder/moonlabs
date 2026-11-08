"use server";

import { redirect } from "next/navigation";
import { getDb } from "@/lib/portal/env";
import { RATE_LIMIT_MESSAGE, checkPassword, startSession } from "@/lib/portal/auth";
import { guarded, safeNext } from "@/lib/portal/action-utils";
import { email as readEmail } from "@/lib/portal/validate";
import type { ActionState } from "@/lib/portal/types";

export async function signInWithPassword(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const db = await getDb();
    if (!db) return { ok: false, message: "The client portal is not configured yet." };
    const address = readEmail(formData, "email");
    const raw = formData.get("password");
    const password = typeof raw === "string" ? raw : "";
    if (!password || password.length > 200) return { ok: false, message: "Wrong email or password." };
    const next = safeNext(formData.get("next"));

    const result = await checkPassword(db, address, password);
    if (!result.ok) {
      return { ok: false, message: result.reason === "rate_limited" ? RATE_LIMIT_MESSAGE : "Wrong email or password." };
    }
    await startSession(db, result.user.id);
    redirect(next);
  });
}
