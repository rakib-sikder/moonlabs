import { headers } from "next/headers";
import type { ActionState } from "./types";
import { ValidationError } from "./validate";

/** Runs an action body, turning validation errors into a friendly { ok: false } result.
 *  Anything else (including Next's redirect/notFound signals) is rethrown. */
export async function guarded(fn: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ValidationError) return { ok: false, message: error.message };
    throw error;
  }
}

/** Maps a Supabase/PostgREST error to a message that is safe to show. */
export function dbFailure(error: { code?: string; message: string } | null, fallback = "Something went wrong. Please try again."): ActionState {
  if (!error) return { ok: false, message: fallback };
  if (error.code === "42501") return { ok: false, message: "You do not have permission to do that." };
  if (error.code === "23505") return { ok: false, message: "That already exists." };
  if (error.code === "23514") return { ok: false, message: "Some values are out of range. Check the form and try again." };
  console.error("[portal] database error", error.code, error.message);
  return { ok: false, message: fallback };
}

/** Absolute origin of the current request, for auth redirect URLs. */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const origin = h.get("origin");
  if (origin && /^https?:\/\//.test(origin)) return origin;
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

/** Only allow same-site relative paths as post-login destinations. */
export function safeNext(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
