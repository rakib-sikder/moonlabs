// Worker secrets and variables, read the same way everywhere on the server.
// They can arrive on the Cloudflare env object or on process.env depending on the runtime,
// so both are read. Secrets pasted through some shells carry a BOM or a trailing newline.

import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function readSecret(name: string): Promise<string | undefined> {
  let cf: Record<string, unknown> = {};
  try {
    cf = (await getCloudflareContext({ async: true })).env as unknown as Record<string, unknown>;
  } catch {
    // Not running on Cloudflare (plain `next dev`).
  }
  const v = cf[name] ?? process.env[name];
  return typeof v === "string" && v ? v.replace(/^﻿/, "").trim() : undefined;
}

/** A short, one-way fingerprint of the visitor's IP, for rate limits without storing the address. */
export async function ipHash(request: Request): Promise<string> {
  const ip =
    request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`moonlab:${ip}`));
  return Array.from(new Uint8Array(digest).slice(0, 12), (b) => b.toString(16).padStart(2, "0")).join("");
}
