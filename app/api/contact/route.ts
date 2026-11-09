import { budgetOptions, timelineOptions, validateContact, type ContactPayload } from "@/lib/contact";
import { services } from "@/lib/site";
import { getDb } from "@/lib/portal/env";

// Best-effort in-memory rate limit: 5 submissions per IP per 10 minutes, per server instance.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return Response.json({ ok: false, error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Bots fill every field; pretend success so they don't retry.
  if (body.website) return Response.json({ ok: true });

  const errors = validateContact(body);
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 422 });

  const validServices = new Set(services.map((s) => s.name));
  const picked = (Array.isArray(body.services) ? body.services : []).filter((s) => validServices.has(s));
  const budget = budgetOptions.includes(body.budget as (typeof budgetOptions)[number]) ? body.budget! : "-";
  const timeline = timelineOptions.includes(body.timeline as (typeof timelineOptions)[number]) ? body.timeline! : "-";

  const name = body.name!.trim();
  const email = body.email!.trim();
  const company = body.company?.trim() || null;
  const message = body.message!.trim();

  // 1. Store it. This is the source of truth; staff read enquiries in the portal admin.
  let stored = false;
  const id = crypto.randomUUID();
  const db = await getDb();
  if (db) {
    try {
      await db
        .prepare(
          `INSERT INTO enquiries (id, name, email, company, services, budget, timeline, message, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        )
        .bind(id, name, email, company, picked.join(", ") || null, budget, timeline, message, new Date().toISOString())
        .run();
      stored = true;
    } catch (err) {
      console.error("[contact] could not store enquiry:", err);
    }
  }

  // 2. Notify on Telegram when configured (best effort).
  let notified = false;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    const text = [
      "🌙 <b>New Moonlab enquiry</b>",
      "",
      `<b>Name:</b> ${esc(name)}`,
      `<b>Email:</b> ${esc(email)}`,
      company ? `<b>Company:</b> ${esc(company)}` : null,
      `<b>Interested in:</b> ${picked.length ? esc(picked.join(", ")) : "-"}`,
      `<b>Budget:</b> ${esc(budget)}`,
      `<b>Timeline:</b> ${esc(timeline)}`,
      "",
      esc(message),
    ]
      .filter((l) => l !== null)
      .join("\n");
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
      });
      notified = res.ok;
      if (!res.ok) console.error(`[contact] Telegram responded ${res.status}`);
    } catch (err) {
      console.error("[contact] Telegram delivery failed:", err);
    }
    if (stored && notified && db) {
      await db.prepare("UPDATE enquiries SET notified = 1 WHERE id = ?").bind(id).run().catch(() => {});
    }
  }

  if (!stored && !notified) {
    return Response.json(
      { ok: false, error: "We couldn't send your message just now. Please try again in a few minutes." },
      { status: 503 },
    );
  }
  return Response.json({ ok: true });
}
