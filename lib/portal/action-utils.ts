import type { ActionState } from "./types";
import { ValidationError } from "./validate";
import { AccessError } from "./access";

/** Runs an action body, turning validation and access errors into a friendly { ok: false }
 *  result. Anything else (including Next's redirect/notFound signals) is rethrown. */
export async function guarded(fn: () => Promise<ActionState>): Promise<ActionState> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ValidationError || error instanceof AccessError) return { ok: false, message: error.message };
    const failure = dbErrorKind(error);
    if (failure) return dbFailure(error);
    throw error;
  }
}

type DbErrorKind = "unique" | "check" | "foreign_key";

function dbErrorKind(error: unknown): DbErrorKind | null {
  const message = error instanceof Error ? error.message : "";
  if (/UNIQUE constraint failed/i.test(message)) return "unique";
  if (/CHECK constraint failed/i.test(message)) return "check";
  if (/FOREIGN KEY constraint failed/i.test(message)) return "foreign_key";
  return null;
}

/** Maps a D1/SQLite error to a message that is safe to show. */
export function dbFailure(error: unknown, fallback = "Something went wrong. Please try again."): ActionState {
  const kind = dbErrorKind(error);
  if (kind === "unique") return { ok: false, message: "That already exists." };
  if (kind === "check") return { ok: false, message: "Some values are out of range. Check the form and try again." };
  if (kind === "foreign_key") return { ok: false, message: "A linked item no longer exists. Reload the page and try again." };
  if (error) console.error("[portal] database error", error instanceof Error ? error.message : error);
  return { ok: false, message: fallback };
}

/** Only allow same-site relative paths as post-login destinations. */
export function safeNext(value: unknown, fallback = "/dashboard"): string {
  if (typeof value !== "string") return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback;
  return value;
}
