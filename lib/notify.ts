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

type OwnerMail = { subject: string; text: string; html: string; replyTo?: { email: string; name: string } };

/** Sends one alert to the owner's inbox: Gmail first, Brevo as the fallback. True when accepted. */
export async function emailOwner(mail: OwnerMail): Promise<boolean> {
  const { BREVO_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM, GMAIL_USER, GMAIL_APP_PASSWORD } = await env();
  // Secrets pasted through some shells arrive with a byte-order mark or a trailing newline.
  const clean = (v?: string) => v?.replace(/^﻿/, "").trim();
  const brevoKey = clean(BREVO_API_KEY);
  const gmailUser = clean(GMAIL_USER);
  const gmailPass = clean(GMAIL_APP_PASSWORD);
  if (!brevoKey && !(gmailUser && gmailPass)) return false;
  const to = NOTIFY_EMAIL || gmailUser || "sikdersmail@gmail.com";
  const from = NOTIFY_FROM || "rakib@moonlab.space";

  if (gmailUser && gmailPass) {
    const sent = await sendViaGmail(gmailUser, gmailPass, { to, ...mail });
    if (sent || !brevoKey) return sent;
  }
  if (!brevoKey) return false;
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": brevoKey, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Moonlab website", email: from },
        to: [{ email: to }],
        ...(mail.replyTo ? { replyTo: mail.replyTo } : {}),
        subject: mail.subject,
        textContent: mail.text,
        htmlContent: mail.html,
      }),
    });
    if (!res.ok) console.error("[notify] Brevo responded", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("[notify] Brevo request failed:", err);
    return false;
  }
}

/** A labelled table, a highlighted message and a footer link: the shape of every owner alert. */
function alertMail(heading: string, rows: [string, string][], message: string, footer: { text: string; href: string; label: string }) {
  const text = `${rows.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${message}\n\n${footer.text}\n${footer.label}: ${footer.href}`;
  const html = `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5;color:#111">
<p style="margin:0 0 12px"><b>${esc(heading)}</b></p>
<table style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="padding:3px 16px 3px 0;color:#666">${esc(k)}</td><td style="padding:3px 0">${esc(v)}</td></tr>`)
    .join("")}</table>
<p style="white-space:pre-wrap;margin:16px 0;padding:12px;background:#f5f5f2;border-radius:8px">${esc(message)}</p>
<p style="color:#666;font-size:13px">${esc(footer.text)}<br><a href="${footer.href}">${esc(footer.label)}</a></p></div>`;
  return { text, html };
}

/** Emails a new website enquiry to the owner. Returns true when the mail server accepted it. */
export async function emailEnquiry(e: EnquiryMail): Promise<boolean> {
  const { text, html } = alertMail(
    "New enquiry from moonlab.space",
    [
      ["Name", e.name],
      ["Email", e.email],
      ["Company", e.company || "-"],
      ["Interested in", e.services.length ? e.services.join(", ") : "-"],
      ["Budget", e.budget],
      ["Timeline", e.timeline],
    ],
    e.message,
    { text: `Reply to this email to answer ${e.name} directly.`, href: "https://moonlab.space/dashboard/admin/enquiries", label: "All enquiries in the admin" },
  );
  return emailOwner({
    subject: `New enquiry: ${e.name}${e.company ? ` (${e.company})` : ""}`,
    text,
    html,
    replyTo: { email: e.email, name: e.name },
  });
}

export type ReviewMail = { name: string; email: string; role: string | null; company: string | null; rating: number; quote: string; project: string | null };

/** Tells the owner a review is waiting for approval. */
export async function emailReview(r: ReviewMail): Promise<boolean> {
  const { text, html } = alertMail(
    "New review waiting for approval",
    [
      ["Name", r.name],
      ["Email", r.email],
      ["Role", [r.role, r.company].filter(Boolean).join(", ") || "-"],
      ["Rating", `${r.rating} / 5`],
      ["Project", r.project || "-"],
    ],
    r.quote,
    { text: "Nothing shows on the site until you approve it.", href: "https://moonlab.space/dashboard/admin/reviews", label: "Approve or reject in the admin" },
  );
  return emailOwner({ subject: `New review (${r.rating}/5): ${r.name}`, text, html, replyTo: { email: r.email, name: r.name } });
}
