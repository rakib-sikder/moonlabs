"use server";

import { revalidatePath } from "next/cache";
import { assertStaff, getPortalContext } from "@/lib/portal/access";
import { guarded } from "@/lib/portal/action-utils";
import { checkbox, text, ValidationError } from "@/lib/portal/validate";
import { plans } from "@/lib/content/company";
import type { ActionState } from "@/lib/portal/types";

const DATE = /^\d{4}-\d{2}-\d{2}$/;

function fields(fd: FormData) {
  const name = text(fd, "name", { label: "Name", min: 2, max: 80 });
  const headline = text(fd, "headline", { label: "Headline", min: 5, max: 200 });
  const starts = String(fd.get("starts_on") ?? "");
  const ends = String(fd.get("ends_on") ?? "");
  if (!DATE.test(starts) || !DATE.test(ends)) throw new ValidationError("Pick a start and an end date.");
  if (ends < starts) throw new ValidationError("The end date is before the start date.");
  const discount = Number(fd.get("discount_percent"));
  if (!Number.isInteger(discount) || discount < 1 || discount > 90) throw new ValidationError("Discount must be a whole number from 1 to 90.");
  const chosen = plans.map((p) => p.key).filter((k) => checkbox(fd, `plan_${k}`));
  if (chosen.length === 0) throw new ValidationError("Choose at least one plan.");
  return { name, headline, starts, ends, discount, plans: chosen.length === plans.length ? "all" : chosen.join(","), enabled: checkbox(fd, "enabled") ? 1 : 0 };
}

async function staff() {
  const ctx = await getPortalContext();
  assertStaff(ctx);
  return ctx;
}

function done(message: string): ActionState {
  revalidatePath("/dashboard", "layout");
  revalidatePath("/api/offer");
  return { ok: true, message };
}

export async function saveOffer(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await staff();
    const id = String(formData.get("offer_id") ?? "");
    if (!/^[a-z0-9-]{3,64}$/.test(id)) return { ok: false, message: "Offer not found." };
    const f = fields(formData);
    const res = await ctx.db
      .prepare(
        "UPDATE offers SET name = ?, headline = ?, starts_on = ?, ends_on = ?, discount_percent = ?, plans = ?, enabled = ?, updated_by = ? WHERE id = ?",
      )
      .bind(f.name, f.headline, f.starts, f.ends, f.discount, f.plans, f.enabled, ctx.userId, id)
      .run();
    if (!res.meta.changes) return { ok: false, message: "Offer not found." };
    return done(f.enabled ? "Saved." : "Saved. This offer is switched off.");
  });
}

export async function createOffer(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await staff();
    const f = fields(formData);
    await ctx.db
      .prepare(
        "INSERT INTO offers (id, name, headline, starts_on, ends_on, discount_percent, plans, enabled, source, updated_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'custom', ?)",
      )
      .bind(`custom-${crypto.randomUUID().slice(0, 8)}`, f.name, f.headline, f.starts, f.ends, f.discount, f.plans, f.enabled, ctx.userId)
      .run();
    return done("Offer added.");
  });
}

export async function deleteOffer(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await staff();
    const id = String(formData.get("offer_id") ?? "");
    await ctx.db.prepare("DELETE FROM offers WHERE id = ?").bind(id).run();
    return done("Offer deleted.");
  });
}
