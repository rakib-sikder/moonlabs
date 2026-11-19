// Account emails for the client portal (password reset, sign-up confirmation).
// Sent through lib/notify.ts: the owner's Gmail first, Brevo as the fallback.

import { sendMail } from "@/lib/notify";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type AccountMail = {
  to: string;
  subject: string;
  greeting: string;
  lines: string[];
  button?: { label: string; href: string };
  footer: string;
};

/** One plain, button-led email. Returns true when a mail server accepted it. */
export function sendAccountMail(m: AccountMail): Promise<boolean> {
  const text = [
    m.greeting,
    "",
    ...m.lines,
    ...(m.button ? ["", `${m.button.label}: ${m.button.href}`] : []),
    "",
    m.footer,
    "",
    "Moonlab",
    "https://moonlab.space",
  ].join("\n");

  const html = `<div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;font-size:15px;line-height:1.55;color:#14161a;max-width:520px">
<p style="margin:0 0 14px">${esc(m.greeting)}</p>
${m.lines.map((l) => `<p style="margin:0 0 14px">${esc(l)}</p>`).join("\n")}
${
  m.button
    ? `<p style="margin:22px 0"><a href="${esc(m.button.href)}" style="display:inline-block;background:#14161a;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:8px;font-weight:600">${esc(m.button.label)}</a></p>
<p style="margin:0 0 14px;font-size:13px;color:#5b6070">If the button does not work, paste this link into your browser:<br><a href="${esc(m.button.href)}" style="color:#5b6070;word-break:break-all">${esc(m.button.href)}</a></p>`
    : ""
}
<p style="margin:18px 0 0;font-size:13px;color:#5b6070">${esc(m.footer)}</p>
<p style="margin:18px 0 0;font-size:13px;color:#5b6070">Moonlab · <a href="https://moonlab.space" style="color:#5b6070">moonlab.space</a></p>
</div>`;

  return sendMail(m.to, { subject: m.subject, text, html, fromName: "Moonlab" });
}
