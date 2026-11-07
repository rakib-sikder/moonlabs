import { budgetOptions, timelineOptions, validateContact, type ContactPayload } from "@/lib/contact";
import { services } from "@/lib/site";

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
    return Response.json({ ok: false, error: "Too many messages — please try again in a few minutes." }, { status: 429 });
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
  const budget = budgetOptions.includes(body.budget as (typeof budgetOptions)[number]) ? body.budget! : "—";
  const timeline = timelineOptions.includes(body.timeline as (typeof timelineOptions)[number]) ? body.timeline! : "—";

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.error("[contact] TELEGRAM_BOT_TOKEN / TELEGRAM_CHAT_ID not set — message not delivered");
    return Response.json(
      { ok: false, error: "Our form is temporarily unavailable — please try again shortly." },
      { status: 503 }
    );
  }

  const text = [
    "🌙 <b>New Moonlabs enquiry</b>",
    "",
    `<b>Name:</b> ${esc(body.name!.trim())}`,
    `<b>Email:</b> ${esc(body.email!.trim())}`,
    body.company?.trim() ? `<b>Company:</b> ${esc(body.company.trim())}` : null,
    `<b>Interested in:</b> ${picked.length ? esc(picked.join(", ")) : "—"}`,
    `<b>Budget:</b> ${esc(budget)}`,
    `<b>Timeline:</b> ${esc(timeline)}`,
    "",
    esc(body.message!.trim()),
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    if (!res.ok) throw new Error(`Telegram responded ${res.status}`);
  } catch (err) {
    console.error("[contact] delivery failed:", err);
    return Response.json({ ok: false, error: "We couldn't send your message just now. Please try again or email us." }, { status: 502 });
  }

  return Response.json({ ok: true });
}
