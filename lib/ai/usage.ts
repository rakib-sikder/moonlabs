// Read-only queries for the admin assistant page. Staff only; callers check that.

export type UsageTotals = { turns: number; input: number; output: number; people: number };
export type DayUsage = { day: string; turns: number; input: number; output: number };
export type ClientUsage = { name: string | null; email: string; org: string | null; turns: number; input: number; output: number };
export type ConversationRow = {
  id: string;
  created_at: string;
  updated_at: string;
  turns: number;
  input_tokens: number;
  output_tokens: number;
  brief_id: string | null;
  brief_title: string | null;
  org_id: string | null;
  org_name: string | null;
  user_name: string | null;
  user_email: string;
  first_message: string | null;
  has_draft: number;
};

const n = (v: unknown) => Number(v ?? 0);

export async function usageTotals(db: D1Database, fromDay: string): Promise<UsageTotals> {
  const r = await db
    .prepare(
      `SELECT COALESCE(SUM(turns),0) AS turns, COALESCE(SUM(input_tokens),0) AS input, COALESCE(SUM(output_tokens),0) AS output,
              COUNT(DISTINCT user_id) AS people FROM ai_usage WHERE day >= ?`,
    )
    .bind(fromDay)
    .first<Record<string, number>>();
  return { turns: n(r?.turns), input: n(r?.input), output: n(r?.output), people: n(r?.people) };
}

export async function usageByDay(db: D1Database, fromDay: string): Promise<DayUsage[]> {
  const { results } = await db
    .prepare(
      `SELECT day, SUM(turns) AS turns, SUM(input_tokens) AS input, SUM(output_tokens) AS output
         FROM ai_usage WHERE day >= ? GROUP BY day ORDER BY day DESC`,
    )
    .bind(fromDay)
    .all<Record<string, unknown>>();
  return results.map((r) => ({ day: String(r.day), turns: n(r.turns), input: n(r.input), output: n(r.output) }));
}

export async function usageByClient(db: D1Database, fromDay: string): Promise<ClientUsage[]> {
  const { results } = await db
    .prepare(
      `SELECT u.name, u.email, o.name AS org, SUM(a.turns) AS turns, SUM(a.input_tokens) AS input, SUM(a.output_tokens) AS output
         FROM ai_usage a JOIN users u ON u.id = a.user_id LEFT JOIN organizations o ON o.id = a.org_id
        WHERE a.day >= ? GROUP BY a.user_id ORDER BY (SUM(a.input_tokens) + SUM(a.output_tokens)) DESC LIMIT 20`,
    )
    .bind(fromDay)
    .all<Record<string, unknown>>();
  return results.map((r) => ({
    name: r.name == null ? null : String(r.name),
    email: String(r.email),
    org: r.org == null ? null : String(r.org),
    turns: n(r.turns),
    input: n(r.input),
    output: n(r.output),
  }));
}

export async function listConversations(db: D1Database, opts: { limit: number; offset: number; orgId?: string | null; withBrief?: boolean; id?: string }): Promise<ConversationRow[]> {
  const where: string[] = [];
  const binds: unknown[] = [];
  if (opts.orgId) {
    where.push("c.org_id = ?");
    binds.push(opts.orgId);
  }
  if (opts.withBrief) where.push("c.brief_id IS NOT NULL");
  if (opts.id) {
    where.push("c.id = ?");
    binds.push(opts.id);
  }
  const { results } = await db
    .prepare(
      `SELECT c.id, c.created_at, c.updated_at, c.turns, c.input_tokens, c.output_tokens, c.brief_id, c.org_id,
              b.title AS brief_title, o.name AS org_name, u.name AS user_name, u.email AS user_email,
              (c.draft_json IS NOT NULL) AS has_draft,
              (SELECT json_extract(m.content, '$.text') FROM ai_messages m WHERE m.conversation_id = c.id AND m.role = 'user' ORDER BY m.id LIMIT 1) AS first_message
         FROM ai_conversations c
         JOIN users u ON u.id = c.user_id
         LEFT JOIN organizations o ON o.id = c.org_id
         LEFT JOIN project_briefs b ON b.id = c.brief_id
        ${where.length ? `WHERE ${where.join(" AND ")}` : ""}
        ORDER BY c.updated_at DESC LIMIT ? OFFSET ?`,
    )
    .bind(...binds, opts.limit, opts.offset)
    .all<Record<string, unknown>>();
  const s = (v: unknown) => (v == null ? null : String(v));
  return results.map((r) => ({
    id: String(r.id),
    created_at: String(r.created_at),
    updated_at: String(r.updated_at),
    turns: n(r.turns),
    input_tokens: n(r.input_tokens),
    output_tokens: n(r.output_tokens),
    brief_id: s(r.brief_id),
    brief_title: s(r.brief_title),
    org_id: s(r.org_id),
    org_name: s(r.org_name),
    user_name: s(r.user_name),
    user_email: String(r.user_email),
    first_message: s(r.first_message),
    has_draft: n(r.has_draft),
  }));
}

export type TranscriptItem =
  | { kind: "user"; text: string; at: string }
  | { kind: "assistant"; text: string; at: string }
  | { kind: "tool"; name: string; summary: string; at: string };

/** A conversation as staff see it: messages plus a one-line summary of every tool call. */
export async function getTranscript(db: D1Database, id: string): Promise<{ conv: ConversationRow; items: TranscriptItem[]; draft: string | null } | null> {
  const conv = (await listConversations(db, { limit: 1, offset: 0, id }))[0];
  if (!conv) return null;
  const draftRow = await db.prepare("SELECT draft_json FROM ai_conversations WHERE id = ?").bind(id).first<{ draft_json: string | null }>();
  const { results } = await db.prepare("SELECT role, content, created_at FROM ai_messages WHERE conversation_id = ? ORDER BY id").bind(id).all<{ role: string; content: string; created_at: string }>();
  const items: TranscriptItem[] = [];
  for (const r of results) {
    const m = JSON.parse(r.content) as {
      role: string;
      text?: string;
      toolCalls?: { name: string; args: unknown }[];
      results?: { name: string; result: Record<string, unknown> }[];
    };
    const at = String(r.created_at);
    if (m.role === "user") items.push({ kind: "user", text: m.text ?? "", at });
    else if (m.role === "assistant") {
      if (m.text) items.push({ kind: "assistant", text: m.text, at });
      for (const c of m.toolCalls ?? []) items.push({ kind: "tool", name: `${c.name} (request)`, summary: JSON.stringify(c.args), at });
    } else if (m.role === "tool") {
      for (const t of m.results ?? []) {
        const res = t.result ?? {};
        const summary =
          t.name === "estimate_price"
            ? `$${n(res.low).toLocaleString("en-US")}-$${n(res.high).toLocaleString("en-US")}, ${(res.weeks as number[] | undefined)?.join("-") ?? "?"} weeks${
                res.handoff ? `, HANDOFF: ${(res.handoff_reasons as string[]).join("; ")}` : ""
              }`
            : JSON.stringify(res);
        items.push({ kind: "tool", name: `${t.name} (result)`, summary, at });
      }
    }
  }
  return { conv, items, draft: draftRow?.draft_json ?? null };
}

export type AiKeyRow = {
  id: string;
  provider: string;
  label: string;
  model: string;
  hint: string;
  priority: number;
  enabled: boolean;
  last_status: "untested" | "ok" | "failing";
  last_error: string | null;
  last_checked_at: string | null;
};

/** Key metadata for the admin. Never selects the ciphertext. */
export async function listAiKeys(db: D1Database): Promise<AiKeyRow[]> {
  const { results } = await db
    .prepare("SELECT id, provider, label, model, hint, priority, enabled, last_status, last_error, last_checked_at FROM ai_keys ORDER BY enabled DESC, priority, created_at")
    .all<Record<string, unknown>>();
  return results.map((r) => ({
    id: String(r.id),
    provider: String(r.provider),
    label: String(r.label),
    model: String(r.model),
    hint: String(r.hint),
    priority: Number(r.priority),
    enabled: Number(r.enabled) === 1,
    last_status: String(r.last_status) as AiKeyRow["last_status"],
    last_error: r.last_error == null ? null : String(r.last_error),
    last_checked_at: r.last_checked_at == null ? null : String(r.last_checked_at),
  }));
}
