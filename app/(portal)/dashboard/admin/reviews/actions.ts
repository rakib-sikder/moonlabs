"use server";

import { revalidatePath } from "next/cache";
import { assertStaff, getPortalContext } from "@/lib/portal/access";
import { getDb } from "@/lib/portal/env";
import { guarded } from "@/lib/portal/action-utils";
import { oneOf, uuid } from "@/lib/portal/validate";
import type { ActionState } from "@/lib/portal/types";
import { REVIEW_STATUSES } from "@/lib/reviews";

/** Staff only: approve a review (it then shows on the site) or reject it. */
export async function setReviewStatus(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await getPortalContext();
    assertStaff(ctx);
    const id = uuid(formData, "id", "Review");
    const status = oneOf(formData, "status", REVIEW_STATUSES, "Status");
    const db = await getDb();
    if (!db) return { ok: false, message: "The portal database is not available." };
    await db
      .prepare("UPDATE reviews SET status = ?, reviewed_at = ? WHERE id = ?")
      .bind(status, status === "pending" ? null : new Date().toISOString(), id)
      .run();
    revalidatePath("/dashboard/admin/reviews");
    return { ok: true, message: status === "approved" ? "Approved. It shows on the site within a few minutes." : "Saved." };
  });
}
