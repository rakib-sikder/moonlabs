// Model layer: the rest of the app calls chat() and never names a provider. The provider and model
// come from config (AI_PROVIDER, AI_MODEL, GEMINI_API_KEY), so swapping models is a setting.
// "mock" is a scripted stand-in for local tests without a key.

import { getPortalEnv } from "@/lib/portal/env";

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

export type AiConfig = { provider: "gemini" | "mock"; model: string; apiKey: string | null };

export class AiError extends Error {}

const clean = (v?: string) => v?.replace(/^﻿/, "").trim() || undefined;

export async function getAiConfig(): Promise<AiConfig | null> {
  const env = (await getPortalEnv()) as Record<string, string | undefined>;
  const read = (k: string) => clean(env[k] ?? process.env[k]);
  const provider = (read("AI_PROVIDER") ?? "gemini") as AiConfig["provider"];
  if (provider === "mock") return { provider, model: "mock", apiKey: null };
  if (provider !== "gemini") return null;
  const apiKey = read("GEMINI_API_KEY") ?? null;
  if (!apiKey) return null;
  return { provider, model: read("AI_MODEL") ?? "gemini-2.5-flash", apiKey };
}

export async function chat(cfg: AiConfig, system: string, messages: ChatMessage[], tools: ToolSpec[]): Promise<Completion> {
  return cfg.provider === "mock" ? mockChat(messages) : geminiChat(cfg, system, messages, tools);
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
    const status = body?.error?.status ?? String(res.status);
    throw new AiError(status === "RESOURCE_EXHAUSTED" || res.status === 429 ? "busy" : `provider error ${status}`);
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
