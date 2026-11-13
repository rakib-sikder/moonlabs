// Email alerts for new website enquiries.
// First choice: the owner's own Gmail (Worker secrets GMAIL_USER and GMAIL_APP_PASSWORD), see lib/gmail.ts.
// Fallback: Brevo's transactional API (BREVO_API_KEY), used only when the Gmail secrets are not set.
// NOTIFY_EMAIL (who receives alerts) and NOTIFY_FROM (a Brevo-verified sender) are optional.

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { sendViaGmail } from "./gmail";

type NotifyEnv = { BREVO_API_KEY?: string; NOTIFY_EMAIL?: string; NOTIFY_FROM?: string; GMAIL_USER?: string; GMAIL_APP_PASSWORD?: string };

const KEYS = ["BREVO_API_KEY", "NOTIFY_EMAIL", "NOTIFY_FROM", "GMAIL_USER", "GMAIL_APP_PASSWORD"] as const;

/** Secrets can arrive on the Cloudflare env object or on process.env, depending on the runtime; read both. */
async function env(): Promise<NotifyEnv> {
  let cf: Record<string, unknown> = {};
  try {
    cf = (await getCloudflareContext({ async: true })).env as unknown as Record<string, unknown>;
  } catch {
    // Not running on Cloudflare (plain `next dev`).
  }
  const out: NotifyEnv = {};
  for (const k of KEYS) {
    const v = cf[k] ?? process.env[k];
    if (typeof v === "string" && v) out[k] = v;
  }
  return out;
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export type EnquiryMail = {
  name: string;
  email: string;
  company: string | null;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
};

/** Emails a new website enquiry to the owner. Returns true when the mail server accepted it. */
export async function emailEnquiry(e: EnquiryMail): Promise<boolean> {
  const { BREVO_API_KEY: rawKey, NOTIFY_EMAIL, NOTIFY_FROM, GMAIL_USER, GMAIL_APP_PASSWORD } = await env();
  // Secrets pasted through some shells arrive with a byte-order mark or a trailing newline.
  const clean = (v?: string) => v?.replace(/^\uFEFF/, "").trim();
  const BREVO_API_KEY = clean(rawKey);
  const gmailUser = clean(GMAIL_USER);
  const gmailPass = clean(GMAIL_APP_PASSWORD);
  if (!BREVO_API_KEY && !(gmailUser && gmailPass)) return false;
  const to = NOTIFY_EMAIL || gmailUser || "sikdersmail@gmail.com";
  const from = NOTIFY_FROM || "rakib@moonlab.space";

  const rows: [string, string][] = [
    ["Name", e.name],
    ["Email", e.email],
    ["Company", e.company || "-"],
    ["Interested in", e.services.length ? e.services.join(", ") : "-"],
    ["Budget", e.budget],
    ["Timeline", e.timeline],
  ];
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${e.message}\n\nReply to this email to answer ${e.name} directly.\nAll enquiries: https://moonlab.space/dashboard/admin/enquiries`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p style="margin:0 0 12px"><b>New enquiry from moonlab.space</b></p>
<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:3px 16px 3px 0;color:#666">${k}</td><td style="padding:3px 0">${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="white-space:pre-wrap;margin:16px 0;padding:12px;background:#f5f5f2;border-radius:8px">${esc(e.message)}</p>
<p style="color:#666;font-size:13px">Reply to this email to answer ${esc(e.name)} directly.<br>
<a href="https://moonlab.space/dashboard/admin/enquiries">All enquiries in the admin</a></p></div>`;

  const subject = `New enquiry: ${e.name}${e.company ? ` (${e.company})` : ""}`;
  if (gmailUser && gmailPass) {
    const sent = await sendViaGmail(gmailUser, gmailPass, { to, replyTo: { email: e.email, name: e.name }, subject, text, html });
    if (sent || !BREVO_API_KEY) return sent;
  }
  if (!BREVO_API_KEY) return false;

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Moonlab website", email: from },
        to: [{ email: to }],
        replyTo: { email: e.email, name: e.name },
        subject,
        textContent: text,
        htmlContent: html,
      }),
    });
    if (!res.ok) console.error("[notify] Brevo responded", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("[notify] Brevo request failed:", err);
    return false;
  }
}
