// Model layer: the rest of the app calls chatWithFallback() and never names a provider. Keys,
// providers and models come from the admin key list (ai_keys, encrypted with SECRETS_KEY), tried
// in priority order, with GEMINI_API_KEY / AI_PROVIDER from the environment as a last resort.
// "mock" is a scripted stand-in for local tests without a key.

import { getDb, getPortalEnv } from "@/lib/portal/env";
import { getVaultKey, openSecret } from "@/lib/portal/vault";

export type ToolSpec = { name: string; description: string; parameters: Record<string, unknown> };
export type ToolCall = { id: string; name: string; args: Record<string, unknown> };

export type ChatMessage =
  | { role: "user"; text: string }
  /** `raw` keeps the provider's own message so it can be sent back unchanged (Gemini signatures). */
  | { role: "assistant"; text: string; toolCalls: ToolCall[]; raw?: unknown }
  | { role: "tool"; results: { id: string; name: string; result: unknown }[] };

export type Completion = {
  text: string;
  toolCalls: ToolCall[];
  raw: unknown;
  usage: { input: number; output: number };
};

export const PROVIDERS = ["groq", "gemini", "openai", "openrouter"] as const;
export type Provider = (typeof PROVIDERS)[number] | "mock";

export const PROVIDER_INFO: Record<(typeof PROVIDERS)[number], { label: string; defaultModel: string; keyHint: string }> = {
  groq: { label: "Groq", defaultModel: "openai/gpt-oss-120b", keyHint: "gsk_…" },
  gemini: { label: "Google Gemini", defaultModel: "gemini-2.5-flash", keyHint: "AIza…" },
  openai: { label: "OpenAI", defaultModel: "", keyHint: "sk-…" },
  openrouter: { label: "OpenRouter", defaultModel: "", keyHint: "sk-or-…" },
};

const OPENAI_BASE: Record<string, string> = {
  groq: "https://api.groq.com/openai/v1",
  openai: "https://api.openai.com/v1",
  openrouter: "https://openrouter.ai/api/v1",
};

export type AiConfig = { provider: Provider; model: string; apiKey: string | null; keyId?: string; label?: string };

/** `kind` tells the fallback what happened: try the next key for anything but a bad request. */
export class AiError extends Error {
  constructor(
    message: string,
    public kind: "busy" | "auth" | "provider" | "bad_request" = "provider",
  ) {
    super(message);
  }
}

const clean = (v?: string) => v?.replace(/^\uFEFF/, "").trim() || undefined;

async function envConfig(): Promise<AiConfig | null> {
  const env = (await getPortalEnv()) as Record<string, string | undefined>;
  const read = (k: string) => clean(env[k] ?? process.env[k]);
  const provider = read("AI_PROVIDER") ?? "gemini";
  if (provider === "mock") return { provider: "mock", model: "mock", apiKey: null, label: "mock" };
  const apiKey = read("GEMINI_API_KEY");
  if (provider !== "gemini" || !apiKey) return null;
  return { provider: "gemini", model: read("AI_MODEL") ?? PROVIDER_INFO.gemini.defaultModel, apiKey, label: "GEMINI_API_KEY (env)" };
}

/** Every usable model, best first: enabled admin keys by priority, then the environment fallback. */
export async function getAiChain(): Promise<AiConfig[]> {
  const chain: AiConfig[] = [];
  const db = await getDb();
  const vault = await getVaultKey();
  if (db && vault) {
    const { results } = await db
      .prepare("SELECT id, provider, label, model, ciphertext, iv FROM ai_keys WHERE enabled = 1 ORDER BY priority, created_at")
      .all<{ id: string; provider: Provider; label: string; model: string; ciphertext: string; iv: string }>()
      .catch(() => ({ results: [] as never[] }));
    for (const r of results) {
      try {
        const apiKey = await openSecret(vault, String(r.id), { ciphertext: String(r.ciphertext), iv: String(r.iv) });
        chain.push({ provider: r.provider, model: String(r.model), apiKey, keyId: String(r.id), label: String(r.label) });
      } catch {
        /* unreadable after a SECRETS_KEY change: skipped, shown as failing in the admin */
      }
    }
  }
  const env = await envConfig();
  if (env) chain.push(env);
  return chain;
}

/** The first model in the chain, or null when none is configured. */
export async function getAiConfig(): Promise<AiConfig | null> {
  return (await getAiChain())[0] ?? null;
}

export async function chat(cfg: AiConfig, system: string, messages: ChatMessage[], tools: ToolSpec[]): Promise<Completion> {
  if (cfg.provider === "mock") return mockChat(messages);
  if (cfg.provider === "gemini") return geminiChat(cfg, system, messages, tools);
  return openAiChat(cfg, system, messages, tools);
}

/**
 * Tries each model in turn. Outages, rate limits and rejected keys move to the next one; a bad
 * request (our fault) stops, since another provider would fail the same way. Failures are noted
 * on the key so the admin shows which one is broken.
 */
export async function chatWithFallback(
  chain: AiConfig[],
  system: string,
  messages: ChatMessage[],
  tools: ToolSpec[],
): Promise<Completion & { used: AiConfig }> {
  let last: unknown = new AiError("no model configured", "provider");
  for (const cfg of chain) {
    try {
      const out = await chat(cfg, system, messages, tools);
      return { ...out, used: cfg };
    } catch (e) {
      last = e;
      await noteKeyFailure(cfg, e);
      if (e instanceof AiError && e.kind === "bad_request") break;
    }
  }
  throw last;
}

async function noteKeyFailure(cfg: AiConfig, e: unknown) {
  if (!cfg.keyId) return;
  const db = await getDb();
  if (!db) return;
  const msg = e instanceof Error ? e.message.slice(0, 300) : "error";
  await db
    .prepare("UPDATE ai_keys SET last_status = 'failing', last_error = ?, last_checked_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?")
    .bind(msg, cfg.keyId)
    .run()
    .catch(() => {});
}

/** One tiny request to see whether a key and model answer. */
export async function testModel(cfg: AiConfig): Promise<{ ok: true; reply: string } | { ok: false; error: string }> {
  try {
    const out = await chat(cfg, "Reply with the single word OK.", [{ role: "user", text: "Say OK." }], []);
    return { ok: true, reply: out.text.slice(0, 60) || "(empty reply)" };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "error" };
  }
}

function classify(status: number, code?: string): AiError["kind"] {
  if (status === 429 || status === 503 || status === 529 || code === "RESOURCE_EXHAUSTED" || code === "UNAVAILABLE") return "busy";
  if (status === 401 || status === 403 || code === "PERMISSION_DENIED" || code === "UNAUTHENTICATED") return "auth";
  if (status === 400 || status === 404 || status === 422) return "bad_request";
  return "provider";
}

// ---------------------------------------------------------------------------
// Gemini (Generative Language API, generateContent with function calling)
// ---------------------------------------------------------------------------
type GeminiPart = { text?: string; functionCall?: { name: string; args?: Record<string, unknown> }; thought?: boolean };
type GeminiContent = { role: "user" | "model"; parts: GeminiPart[] };

function toGemini(messages: ChatMessage[]): GeminiContent[] {
  return messages.map((m): GeminiContent => {
    if (m.role === "user") return { role: "user", parts: [{ text: m.text }] };
    if (m.role === "tool") {
      return { role: "user", parts: m.results.map((r) => ({ functionResponse: { name: r.name, response: { result: r.result } } }) as GeminiPart) };
    }
    if (m.raw) return m.raw as GeminiContent;
    const parts: GeminiPart[] = [];
    if (m.text) parts.push({ text: m.text });
    for (const c of m.toolCalls) parts.push({ functionCall: { name: c.name, args: c.args } });
    return { role: "model", parts };
  });
}

async function geminiChat(cfg: AiConfig, system: string, messages: ChatMessage[], tools: ToolSpec[]): Promise<Completion> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(cfg.model)}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": cfg.apiKey ?? "" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: toGemini(messages),
      tools: tools.length ? [{ functionDeclarations: tools }] : undefined,
      generationConfig: { temperature: 0.4, maxOutputTokens: 1500 },
    }),
  });
  const body = (await res.json().catch(() => null)) as {
    candidates?: { content?: GeminiContent; finishReason?: string }[];
    usageMetadata?: { promptTokenCount?: number; candidatesTokenCount?: number };
    error?: { message?: string; status?: string };
  } | null;
  if (!res.ok || !body) {
    const code = body?.error?.status;
    throw new AiError(`gemini ${res.status} ${code ?? ""}: ${body?.error?.message ?? "no body"}`.slice(0, 300), classify(res.status, code));
  }
  const content = body.candidates?.[0]?.content ?? { role: "model", parts: [] };
  const parts = content.parts ?? [];
  const text = parts
    .filter((p) => p.text && !p.thought)
    .map((p) => p.text)
    .join("")
    .trim();
  const toolCalls = parts
    .filter((p) => p.functionCall)
    .map((p, i) => ({ id: `call_${i}`, name: p.functionCall!.name, args: p.functionCall!.args ?? {} }));
  return {
    text,
    toolCalls,
    raw: { role: "model", parts },
    usage: { input: body.usageMetadata?.promptTokenCount ?? 0, output: body.usageMetadata?.candidatesTokenCount ?? 0 },
  };
}

// ---------------------------------------------------------------------------
// OpenAI-compatible chat completions (Groq, OpenAI, OpenRouter)
// ---------------------------------------------------------------------------
type OaMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: { id: string; type: "function"; function: { name: string; arguments: string } }[] }
  | { role: "tool"; tool_call_id: string; content: string };

function toOpenAi(system: string, messages: ChatMessage[]): OaMessage[] {
  const out: OaMessage[] = [{ role: "system", content: system }];
  for (const m of messages) {
    if (m.role === "user") out.push({ role: "user", content: m.text });
    else if (m.role === "assistant") {
      out.push({
        role: "assistant",
        content: m.text || null,
        ...(m.toolCalls.length
          ? { tool_calls: m.toolCalls.map((c) => ({ id: c.id, type: "function" as const, function: { name: c.name, arguments: JSON.stringify(c.args) } })) }
          : {}),
      });
    } else for (const r of m.results) out.push({ role: "tool", tool_call_id: r.id, content: JSON.stringify(r.result) });
  }
  return out;
}

async function openAiChat(cfg: AiConfig, system: string, messages: ChatMessage[], tools: ToolSpec[]): Promise<Completion> {
  const base = OPENAI_BASE[cfg.provider];
  if (!base) throw new AiError(`unknown provider ${cfg.provider}`, "bad_request");
  const reasoning = cfg.provider === "groq" && cfg.model.startsWith("openai/gpt-oss");
  const res = await fetch(`${base}/chat/completions`, {
    method: "POST",
    headers: { "content-type": "application/json", authorization: `Bearer ${cfg.apiKey ?? ""}`, "user-agent": "Moonlab-Portal/1.0" },
    body: JSON.stringify({
      model: cfg.model,
      messages: toOpenAi(system, messages),
      tools: tools.length ? tools.map((t) => ({ type: "function", function: t })) : undefined,
      temperature: 0.4,
      max_tokens: 2000,
      ...(reasoning ? { reasoning_effort: "low" } : {}),
    }),
  });
  const body = (await res.json().catch(() => null)) as {
    choices?: { message?: { content?: string | null; tool_calls?: { id: string; function: { name: string; arguments: string } }[] } }[];
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    error?: { message?: string; code?: string };
  } | null;
  if (!res.ok || !body) {
    throw new AiError(`${cfg.provider} ${res.status}: ${body?.error?.message ?? "no body"}`.slice(0, 300), classify(res.status, body?.error?.code));
  }
  const msg = body.choices?.[0]?.message ?? {};
  const toolCalls = (msg.tool_calls ?? []).map((c, i) => {
    let args: Record<string, unknown> = {};
    try {
      args = JSON.parse(c.function.arguments || "{}") as Record<string, unknown>;
    } catch {
      args = {};
    }
    return { id: c.id || `call_${i}`, name: c.function.name, args };
  });
  return {
    text: (msg.content ?? "").trim(),
    toolCalls,
    raw: null,
    usage: { input: body.usage?.prompt_tokens ?? 0, output: body.usage?.completion_tokens ?? 0 },
  };
}

// ---------------------------------------------------------------------------
// Mock: enough behaviour to exercise the chat, the price tool and the brief card in tests.
// ---------------------------------------------------------------------------
function mockChat(messages: ChatMessage[]): Completion {
  const last = messages[messages.length - 1];
  const reply = (text: string, toolCalls: ToolCall[] = []): Completion => ({ text, toolCalls, raw: null, usage: { input: 0, output: 0 } });
  if (last.role === "tool") {
    const r = last.results[0];
    if (r.name === "estimate_price") {
      const e = r.result as { low: number; high: number; weeks: [number, number] };
      return reply(`A booking app like this usually costs $${e.low.toLocaleString("en-US")} to $${e.high.toLocaleString("en-US")} and takes ${e.weeks[0]}-${e.weeks[1]} weeks. Shall I send this to Moonlab as a brief?`);
    }
    return reply("Here is the summary. Press “Send to Moonlab” if it looks right.");
  }
  const said = last.role === "user" ? last.text.toLowerCase() : "";
  if (/\b(send|yes|haan|ha)\b/.test(said)) {
    return reply("", [
      {
        id: "call_0",
        name: "propose_brief",
        args: {
          title: "Salon booking app",
          goal: "Customers book a stylist and time online and pay a deposit.",
          audience: "3 stylists and about 200 customers a month",
          features: "Booking calendar\nDeposit payment\nSMS reminders",
          budget: "",
          deadline: "",
          estimate_summary: "$7,000 to $18,000, 5-9 weeks",
        },
      },
    ]);
  }
  if (said.includes("booking")) return reply("", [{ id: "call_0", name: "estimate_price", args: { items: [{ type: "booking_app" }] } }]);
  return reply("Hi! I can explain the portal or help you plan a project. What would you like to build?");
}
