"use server";

import { revalidatePath } from "next/cache";
import { getPortalContext } from "@/lib/portal/access";
import { createBrief } from "@/lib/portal/briefs";
import { planLabel } from "@/lib/portal/format";
import { isUuid } from "@/lib/portal/validate";
import { AiError, getAiChain, type ChatMessage } from "@/lib/ai/llm";
import { runTurn, type BriefDraft } from "@/lib/ai/assistant";
import { getAssistantSettings } from "@/lib/ai/settings";

export type ChatLine = { role: "user" | "assistant"; text: string };
export type AssistantState = {
  ok: boolean;
  error?: string;
  conversationId?: string;
  lines?: ChatLine[];
  draft?: BriefDraft | null;
  briefId?: string | null;
};

const MAX_TEXT = 2000;
const MAX_TURNS_PER_CONVERSATION = 30;

type Row = { role: "user" | "assistant" | "tool"; content: string };

function toLines(rows: Row[]): ChatLine[] {
  const lines: ChatLine[] = [];
  for (const r of rows) {
    const m = JSON.parse(r.content) as ChatMessage;
    if (m.role === "user") lines.push({ role: "user", text: m.text });
    else if (m.role === "assistant" && m.text) lines.push({ role: "assistant", text: m.text });
  }
  return lines;
}

async function loadConversation(db: D1Database, userId: string, id: string) {
  const conv = await db
    .prepare("SELECT id, turns, draft_json, brief_id FROM ai_conversations WHERE id = ? AND user_id = ?")
    .bind(id, userId)
    .first<{ id: string; turns: number; draft_json: string | null; brief_id: string | null }>();
  if (!conv) return null;
  const { results } = await db.prepare("SELECT role, content FROM ai_messages WHERE conversation_id = ? ORDER BY id").bind(id).all<Row>();
  return { conv, rows: results };
}

/** Restores a conversation when the panel opens again. */
export async function getAssistantConversation(conversationId: string): Promise<AssistantState> {
  if (!isUuid(conversationId)) return { ok: false };
  const ctx = await getPortalContext();
  const data = await loadConversation(ctx.db, ctx.userId, conversationId);
  if (!data) return { ok: false };
  return {
    ok: true,
    conversationId,
    lines: toLines(data.rows),
    draft: data.conv.draft_json ? (JSON.parse(data.conv.draft_json) as BriefDraft) : null,
    briefId: data.conv.brief_id,
  };
}

/** One client message to the assistant. Returns the whole conversation for display. */
export async function askAssistant(conversationId: string | null, text: string): Promise<AssistantState> {
  const message = String(text ?? "").trim();
  if (!message) return { ok: false, error: "Type a message first." };
  if (message.length > MAX_TEXT) return { ok: false, error: `Please keep messages under ${MAX_TEXT} characters.` };

  const ctx = await getPortalContext();
  const org = ctx.currentOrg;
  if (!org) return { ok: false, error: "Open a workspace first." };
  const chain = await getAiChain();
  if (chain.length === 0) return { ok: false, error: "Moon is not switched on yet." };

  const settings = await getAssistantSettings(ctx.db);
  if (!settings.enabled) return { ok: false, error: "The assistant is paused right now. Send us a request instead, and a person will answer." };
  const day = new Date().toISOString().slice(0, 10);
  const [today, month] = await Promise.all([
    ctx.db.prepare("SELECT COALESCE(SUM(turns), 0) AS n FROM ai_usage WHERE user_id = ? AND day = ?").bind(ctx.userId, day).first<{ n: number }>(),
    settings.monthlyTokenBudget
      ? ctx.db
          .prepare("SELECT COALESCE(SUM(input_tokens + output_tokens), 0) AS n FROM ai_usage WHERE day >= ?")
          .bind(`${day.slice(0, 7)}-01`)
          .first<{ n: number }>()
      : Promise.resolve({ n: 0 }),
  ]);
  if ((today?.n ?? 0) >= settings.dailyLimit) return { ok: false, error: "You have reached today's limit for the assistant. Send us a request instead, and a person will answer." };
  if (settings.monthlyTokenBudget && (month?.n ?? 0) >= settings.monthlyTokenBudget) {
    return { ok: false, error: "The assistant is resting for now. Send us a request instead, and a person will answer." };
  }

  let id = conversationId && isUuid(conversationId) ? conversationId : null;
  let rows: Row[] = [];
  if (id) {
    const data = await loadConversation(ctx.db, ctx.userId, id);
    if (!data) id = null;
    else {
      if (data.conv.turns >= MAX_TURNS_PER_CONVERSATION) return { ok: false, error: "This conversation is long. Start a new one to continue." };
      rows = data.rows;
    }
  }
  if (!id) {
    id = crypto.randomUUID();
    await ctx.db.prepare("INSERT INTO ai_conversations (id, user_id, org_id) VALUES (?, ?, ?)").bind(id, ctx.userId, org.id).run();
  }

  const history = rows.map((r) => JSON.parse(r.content) as ChatMessage);
  const userMsg: ChatMessage = { role: "user", text: message };
  let turn;
  try {
    turn = await runTurn(chain, { orgName: org.name, plan: planLabel[org.plan], firstName: ctx.profile?.full_name?.split(" ")[0] ?? null }, [...history, userMsg]);
  } catch (e) {
    const busy = e instanceof AiError && e.kind === "busy";
    return { ok: false, conversationId: id, error: busy ? "The assistant is busy right now. Try again in a minute." : "The assistant could not answer. Please try again." };
  }

  const toStore = [userMsg, ...turn.added];
  await ctx.db.batch([
    ...toStore.map((m) => ctx.db.prepare("INSERT INTO ai_messages (conversation_id, role, content) VALUES (?, ?, ?)").bind(id, m.role, JSON.stringify(m))),
    ctx.db
      .prepare(
        `UPDATE ai_conversations SET turns = turns + 1, input_tokens = input_tokens + ?, output_tokens = output_tokens + ?,
                draft_json = COALESCE(?, draft_json), updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ?`,
      )
      .bind(turn.usage.input, turn.usage.output, turn.draft ? JSON.stringify(turn.draft) : null, id),
    ctx.db
      .prepare(
        `INSERT INTO ai_usage (day, user_id, org_id, model, turns, input_tokens, output_tokens) VALUES (?, ?, ?, ?, 1, ?, ?)
         ON CONFLICT (day, user_id, model) DO UPDATE SET turns = turns + 1, input_tokens = input_tokens + excluded.input_tokens,
           output_tokens = output_tokens + excluded.output_tokens, org_id = excluded.org_id`,
      )
      .bind(day, ctx.userId, org.id, turn.model, turn.usage.input, turn.usage.output),
  ]);

  return getAssistantConversation(id);
}

/** The client's "Send to Moonlab" on the brief card: creates the brief from the stored draft. */
export async function sendAssistantBrief(conversationId: string): Promise<AssistantState> {
  if (!isUuid(conversationId)) return { ok: false, error: "Conversation not found." };
  const ctx = await getPortalContext();
  const org = ctx.currentOrg;
  if (!org) return { ok: false, error: "Open a workspace first." };
  const conv = await ctx.db
    .prepare("SELECT draft_json, brief_id FROM ai_conversations WHERE id = ? AND user_id = ?")
    .bind(conversationId, ctx.userId)
    .first<{ draft_json: string | null; brief_id: string | null }>();
  if (!conv?.draft_json) return { ok: false, error: "There is no brief to send yet." };
  if (conv.brief_id) return { ok: true, conversationId, briefId: conv.brief_id };

  const d = JSON.parse(conv.draft_json) as BriefDraft;
  if (d.title.length < 3 || d.goal.length < 20) return { ok: false, error: "The brief is too short. Tell the assistant a little more first." };
  const res = await createBrief(
    ctx,
    org.id,
    {
      title: d.title,
      goal: d.goal,
      audience: d.audience || null,
      features: d.features || null,
      examples: d.examples || null,
      budget: d.budget || null,
      deadline: d.deadline || null,
    },
    { source: "assistant", estimate: d.estimate_summary },
  );
  if ("error" in res) return { ok: false, error: res.error };
  await ctx.db.prepare("UPDATE ai_conversations SET brief_id = ? WHERE id = ? AND user_id = ?").bind(res.id, conversationId, ctx.userId).run();
  revalidatePath("/dashboard", "layout");
  return { ok: true, conversationId, briefId: res.id };
}
