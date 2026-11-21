"use server";

import { revalidatePath } from "next/cache";
import { assertStaff, getPortalContext } from "@/lib/portal/access";
import { guarded } from "@/lib/portal/action-utils";
import { checkbox, oneOf, optionalText, text, uuid, ValidationError } from "@/lib/portal/validate";
import { getVaultKey, openSecret, sealSecret } from "@/lib/portal/vault";
import { PROVIDERS, PROVIDER_INFO, testModel, type AiConfig, type Provider } from "@/lib/ai/llm";
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

// ---------------------------------------------------------------------------
// API keys
// ---------------------------------------------------------------------------
async function staffCtx() {
  const ctx = await getPortalContext();
  assertStaff(ctx);
  return ctx;
}

async function recordTest(db: D1Database, id: string, cfg: AiConfig): Promise<ActionState> {
  const res = await testModel(cfg);
  await db
    .prepare("UPDATE ai_keys SET last_status = ?, last_error = ?, last_checked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
    .bind(res.ok ? "ok" : "failing", res.ok ? null : res.error.slice(0, 300), id)
    .run();
  revalidatePath("/dashboard", "layout");
  return res.ok ? { ok: true, message: `Works. ${cfg.model} replied: ${res.reply}` } : { ok: false, message: `Failed: ${res.error}` };
}

/** Adds a provider key (stored encrypted), then tests it straight away. */
export async function addAiKey(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await staffCtx();
    const provider = oneOf(formData, "provider", PROVIDERS, "Provider");
    const label = text(formData, "label", { label: "Name", max: 80 });
    const model = (optionalText(formData, "model", { label: "Model", max: 120 }) ?? PROVIDER_INFO[provider].defaultModel).trim();
    if (!model) return { ok: false, message: `Enter the model name for ${PROVIDER_INFO[provider].label}.` };
    const apiKey = String(formData.get("api_key") ?? "").replace(/^\uFEFF/, "").trim();
    if (apiKey.length < 16 || /\s/.test(apiKey)) return { ok: false, message: "That does not look like an API key." };
    const priority = num(formData, "priority", "Order", 999);
    const vault = await getVaultKey();
    if (!vault) return { ok: false, message: "Secure storage is not set up: SECRETS_KEY is missing." };

    const id = crypto.randomUUID();
    const sealed = await sealSecret(vault, id, apiKey);
    await ctx.db
      .prepare("INSERT INTO ai_keys (id, provider, label, model, ciphertext, iv, hint, priority, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(id, provider, label, model, sealed.ciphertext, sealed.iv, apiKey.slice(-4), priority, ctx.userId)
      .run();
    const tested = await recordTest(ctx.db, id, { provider, model, apiKey, keyId: id, label });
    return tested.ok ? { ok: true, message: `Key saved. ${tested.message}` } : { ok: false, message: `Key saved, but the test ${tested.message?.toLowerCase()}` };
  });
}

export async function testAiKey(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await staffCtx();
    const id = uuid(formData, "key_id", "Key");
    const row = await ctx.db
      .prepare("SELECT provider, model, label, ciphertext, iv FROM ai_keys WHERE id = ?")
      .bind(id)
      .first<{ provider: Provider; model: string; label: string; ciphertext: string; iv: string }>();
    if (!row) return { ok: false, message: "Key not found." };
    const vault = await getVaultKey();
    if (!vault) return { ok: false, message: "SECRETS_KEY is missing." };
    let apiKey: string;
    try {
      apiKey = await openSecret(vault, id, { ciphertext: row.ciphertext, iv: row.iv });
    } catch {
      return { ok: false, message: "This key cannot be decrypted (SECRETS_KEY changed). Delete it and add it again." };
    }
    return recordTest(ctx.db, id, { provider: row.provider, model: row.model, apiKey, keyId: id, label: row.label });
  });
}

/** Turns a key on or off, changes its model, or its place in the fallback order. */
export async function updateAiKey(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await staffCtx();
    const id = uuid(formData, "key_id", "Key");
    const model = text(formData, "model", { label: "Model", max: 120 });
    const priority = num(formData, "priority", "Order", 999);
    const enabled = checkbox(formData, "enabled") ? 1 : 0;
    await ctx.db.prepare("UPDATE ai_keys SET model = ?, priority = ?, enabled = ? WHERE id = ?").bind(model, priority, enabled, id).run();
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: enabled ? "Saved." : "Saved. This key is switched off." };
  });
}

export async function deleteAiKey(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const ctx = await staffCtx();
    const id = uuid(formData, "key_id", "Key");
    await ctx.db.prepare("DELETE FROM ai_keys WHERE id = ?").bind(id).run();
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Key deleted." };
  });
}
