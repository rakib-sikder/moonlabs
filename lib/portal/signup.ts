import { sha256Hex } from "./crypto";

type SignupRow = { token_hash: string; email: string; name: string; company: string | null; password_hash: string; expires_at: string; used_at: string | null };

/** The pending sign-up for a raw token, if it is unused and not expired. */
export async function findSignup(db: D1Database, token: string): Promise<SignupRow | null> {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return null;
  const row = await db.prepare("SELECT * FROM signup_requests WHERE token_hash = ?").bind(await sha256Hex(token)).first<SignupRow>();
  if (!row || row.used_at || !(Date.parse(row.expires_at) > Date.now())) return null;
  return row;
}
