// Email notifications through Brevo's transactional API (works from Cloudflare Workers via fetch).
// Needs the Worker secret BREVO_API_KEY. NOTIFY_EMAIL (who receives alerts) and
// NOTIFY_FROM (a sender verified in Brevo) are optional and have sensible defaults.

import { getCloudflareContext } from "@opennextjs/cloudflare";

type NotifyEnv = { BREVO_API_KEY?: string; NOTIFY_EMAIL?: string; NOTIFY_FROM?: string };

async function env(): Promise<NotifyEnv> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as unknown as NotifyEnv;
  } catch {
    return {};
  }
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

/** Emails a new website enquiry to the owner. Returns true when Brevo accepted it. */
export async function emailEnquiry(e: EnquiryMail): Promise<boolean> {
  const { BREVO_API_KEY, NOTIFY_EMAIL, NOTIFY_FROM } = await env();
  if (!BREVO_API_KEY) return false;
  const to = NOTIFY_EMAIL || "sikdersmail@gmail.com";
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

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": BREVO_API_KEY, "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        sender: { name: "Moonlab website", email: from },
        to: [{ email: to }],
        replyTo: { email: e.email, name: e.name },
        subject: `New enquiry: ${e.name}${e.company ? ` (${e.company})` : ""}`,
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
