"use server";

import { revalidatePath } from "next/cache";
import { assertStaff, getPortalContext } from "@/lib/portal/access";
import { guarded } from "@/lib/portal/action-utils";
import { checkbox, ValidationError } from "@/lib/portal/validate";
import { settingStatements } from "@/lib/ai/settings";
import type { ActionState } from "@/lib/portal/types";

function num(fd: FormData, name: string, label: string, max: number, integer = true): number {
  const raw = String(fd.get(name) ?? "").trim();
  const v = raw === "" ? 0 : Number(raw);
  if (!Number.isFinite(v) || v < 0 || v > max || (integer && !Number.isInteger(v))) throw new ValidationError(`${label} must be a number from 0 to ${max.toLocaleString("en-US")}.`);
  return v;
}

/** Staff only: switch the assistant on or off and set its limits and token prices. */
export async function saveAssistantSettings(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await getPortalContext();
    assertStaff(ctx);
    const settings = {
      enabled: checkbox(formData, "enabled"),
      dailyLimit: num(formData, "daily_limit", "Daily limit", 1000),
      monthlyTokenBudget: num(formData, "monthly_token_budget", "Monthly token budget", 1_000_000_000),
      priceInPerM: num(formData, "price_in_per_m", "Input price", 1000, false),
      priceOutPerM: num(formData, "price_out_per_m", "Output price", 1000, false),
    };
    if (settings.dailyLimit < 1) return { ok: false, message: "Daily limit must be at least 1. Use the switch to turn the assistant off." };
    await ctx.db.batch(settingStatements(ctx.db, settings, ctx.userId));
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: settings.enabled ? "Saved. The assistant is on." : "Saved. The assistant is off for every client." };
  });
}
