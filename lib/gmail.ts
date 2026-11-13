// Sends one email through Gmail's SMTP server straight from the Worker, over a TLS socket.
// Used for enquiry alerts to the owner's own inbox. Needs two Worker secrets:
//   GMAIL_USER          the Gmail address that sends (and receives) the alert
//   GMAIL_APP_PASSWORD  a Google "app password" for that account, never the normal password
// Only runs on Cloudflare (it uses cloudflare:sockets); anywhere else it reports failure.

type Mail = { to: string; replyTo?: { email: string; name: string }; subject: string; text: string; html: string };

const utf8 = new TextEncoder();

function b64(s: string): string {
  const bytes = utf8.encode(s);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

/** Base64 body, wrapped at 76 characters as mail servers expect. */
const b64Body = (s: string) => (b64(s).match(/.{1,76}/g) ?? []).join("\r\n");

/** Header values must stay on one line, or a visitor could inject headers of their own. */
const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

/** Non-ASCII header text (names, subjects) as an RFC 2047 encoded word. */
const word = (s: string) => `=?UTF-8?B?${b64(oneLine(s))}?=`;

export async function sendViaGmail(user: string, appPassword: string, mail: Mail): Promise<boolean> {
  let socket: { readable: ReadableStream<Uint8Array>; writable: WritableStream<Uint8Array>; close(): Promise<void> } | undefined;
  try {
    // Named through a variable so the Next.js bundler leaves this Cloudflare-only module alone.
    const mod = "cloudflare:sockets";
    const { connect } = await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ mod);
    socket = connect({ hostname: "smtp.gmail.com", port: 465 }, { secureTransport: "on", allowHalfOpen: false });
    const reader = socket!.readable.getReader();
    const writer = socket!.writable.getWriter();
    const decoder = new TextDecoder();
    let buffer = "";

    // One full server reply: lines "250-..." continue, a line "250 ..." ends it.
    const reply = async (): Promise<string> => {
      for (;;) {
        const lines = buffer.split("\r\n");
        for (let i = 0; i < lines.length - 1; i++) {
          if (/^\d{3} /.test(lines[i])) {
            buffer = lines.slice(i + 1).join("\r\n");
            return lines[i];
          }
        }
        const { value, done } = await reader.read();
        if (done) throw new Error("connection closed");
        buffer += decoder.decode(value, { stream: true });
      }
    };
    const expect = async (code: string, step: string) => {
      const line = await reply();
      if (!line.startsWith(code)) throw new Error(`${step}: ${line.slice(0, 120)}`);
    };
    const send = (line: string) => writer.write(utf8.encode(line + "\r\n"));

    await expect("220", "greeting");
    await send("EHLO moonlab.space");
    await expect("250", "EHLO");
    await send("AUTH LOGIN");
    await expect("334", "AUTH");
    await send(b64(user));
    await expect("334", "user");
    await send(b64(appPassword.replace(/\s+/g, "")));
    await expect("235", "sign-in");
    await send(`MAIL FROM:<${user}>`);
    await expect("250", "MAIL FROM");
    await send(`RCPT TO:<${oneLine(mail.to)}>`);
    await expect("250", "RCPT TO");
    await send("DATA");
    await expect("354", "DATA");

    const boundary = `mb-${crypto.randomUUID()}`;
    const headers = [
      `From: ${word("Moonlab website")} <${user}>`,
      `To: <${oneLine(mail.to)}>`,
      ...(mail.replyTo ? [`Reply-To: ${word(mail.replyTo.name)} <${oneLine(mail.replyTo.email)}>`] : []),
      `Subject: ${word(mail.subject)}`,
      `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
      `Message-ID: <${crypto.randomUUID()}@moonlab.space>`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ];
    const part = (type: string, body: string) =>
      [`--${boundary}`, `Content-Type: ${type}; charset=UTF-8`, "Content-Transfer-Encoding: base64", "", b64Body(body)].join("\r\n");
    const message = [...headers, "", part("text/plain", mail.text), part("text/html", mail.html), `--${boundary}--`].join("\r\n");
    await send(message + "\r\n.");
    await expect("250", "message");
    await send("QUIT");
    return true;
  } catch (err) {
    console.error("[notify] Gmail send failed:", err instanceof Error ? err.message : err);
    return false;
  } finally {
    await socket?.close().catch(() => {});
  }
}
