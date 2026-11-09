"use server";

import { revalidatePath } from "next/cache";
import { assertStaff, getPortalContext } from "@/lib/portal/access";
import { getDb } from "@/lib/portal/env";
import { guarded } from "@/lib/portal/action-utils";
import { oneOf, uuid } from "@/lib/portal/validate";
import type { ActionState } from "@/lib/portal/types";
import { ENQUIRY_STATUSES } from "@/lib/portal/enquiries";

/** Staff only: move a website enquiry through new → contacted → won/lost (or spam). */
export async function setEnquiryStatus(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await getPortalContext();
    assertStaff(ctx);
    const id = uuid(formData, "id", "Enquiry");
    const status = oneOf(formData, "status", ENQUIRY_STATUSES, "Status");
    const db = await getDb();
    if (!db) return { ok: false, message: "The portal database is not available." };
    await db.prepare("UPDATE enquiries SET status = ? WHERE id = ?").bind(status, id).run();
    revalidatePath("/dashboard/admin/enquiries");
    return { ok: true, message: "Status updated." };
  });
}
