// Sign-in for the client portal: sessions, password checks, rate limiting and the one-time
// links (invites, password resets). No external auth service is involved.
//
// Sessions: a random 32-byte token lives in an httpOnly cookie; only its SHA-256 hash is
// stored in `sessions`. Sessions last 30 days and slide forward while the user is active.

import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getDb } from "./env";
import { hashPassword, randomToken, sha256Hex, verifyPassword } from "./crypto";

export const SESSION_COOKIE = "ml_session";
const DAY_MS = 24 * 60 * 60 * 1000;
export const SESSION_DAYS = 30;
/** Extend a session at most once per this interval (keeps writes rare). */
const SESSION_REFRESH_MS = DAY_MS;
export const INVITE_DAYS = 7;
export const RESET_HOURS = 24;

/** Failed attempts allowed per email + IP, and per IP across all emails, in the window. */
const MAX_FAILURES_PER_EMAIL_IP = 5;
const MAX_FAILURES_PER_IP = 30;
const FAILURE_WINDOW_MS = 15 * 60 * 1000;

export const MIN_PASSWORD_LENGTH = 10;
export const MAX_PASSWORD_LENGTH = 200;

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  isStaff: boolean;
  hasPassword: boolean;
};

type UserRow = { id: string; email: string; name: string | null; is_staff: number; password_hash: string | null };

export function nowIso(): string {
  return new Date().toISOString();
}

export function isoIn(ms: number): string {
  return new Date(Date.now() + ms).toISOString();
}

const LOCAL_HOST = /^(localhost|127\.0\.0\.1)(:\d+)?$/;

/** Secure cookies everywhere except plain-http localhost (`next dev` / `wrangler dev`). */
async function secureCookies(): Promise<boolean> {
  const h = await headers();
  return !LOCAL_HOST.test(h.get("host") ?? "");
}

export async function cookieOptions(maxAgeSeconds: number) {
  return {
    path: "/",
    httpOnly: true,
    sameSite: "lax" as const,
    secure: await secureCookies(),
    maxAge: maxAgeSeconds,
  };
}

/** Client IP from Cloudflare (falls back to forwarded headers locally). */
export async function clientIp(): Promise<string> {
  const h = await headers();
  return (
    h.get("cf-connecting-ip") ??
    h.get("x-real-ip") ??
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Sessions
// ---------------------------------------------------------------------------

/**
 * Creates a session row and sets the cookie. Only call from a Server Action or Route
 * Handler (cookies are read-only while rendering).
 */
export async function startSession(db: D1Database, userId: string): Promise<void> {
  const token = randomToken(32);
  const h = await headers();
  const ua = (h.get("user-agent") ?? "").slice(0, 300) || null;
  await db
    .prepare("INSERT INTO sessions (token_hash, user_id, expires_at, user_agent) VALUES (?, ?, ?, ?)")
    .bind(await sha256Hex(token), userId, isoIn(SESSION_DAYS * DAY_MS), ua)
    .run();
  const store = await cookies();
  store.set(SESSION_COOKIE, token, await cookieOptions(SESSION_DAYS * 24 * 60 * 60));
  // Opportunistic cleanup of expired sessions.
  await db.prepare("DELETE FROM sessions WHERE expires_at < ?").bind(nowIso()).run();
}

/** Deletes the current session row and clears the cookie. */
export async function endSession(): Promise<void> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  const db = await getDb();
  if (token && db) {
    await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(await sha256Hex(token)).run();
  }
  store.delete(SESSION_COOKIE);
}

/**
 * The signed-in user for this request, or null. Cached per request. Slides the session
 * expiry forward (at most once a day) and re-sets the cookie when the response allows it.
 */
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const db = await getDb();
  if (!db) return null;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token || token.length > 200) return null;

  const tokenHash = await sha256Hex(token);
  const row = await db
    .prepare(
      `SELECT s.expires_at, u.id, u.email, u.name, u.is_staff, u.password_hash
         FROM sessions s JOIN users u ON u.id = s.user_id
        WHERE s.token_hash = ?`,
    )
    .bind(tokenHash)
    .first<UserRow & { expires_at: string }>();
  if (!row) return null;

  const expiresMs = Date.parse(row.expires_at);
  if (!(expiresMs > Date.now())) {
    await db.prepare("DELETE FROM sessions WHERE token_hash = ?").bind(tokenHash).run();
    return null;
  }

  const fullMs = SESSION_DAYS * DAY_MS;
  if (expiresMs - Date.now() < fullMs - SESSION_REFRESH_MS) {
    await db.prepare("UPDATE sessions SET expires_at = ? WHERE token_hash = ?").bind(isoIn(fullMs), tokenHash).run();
    try {
      store.set(SESSION_COOKIE, token, await cookieOptions(SESSION_DAYS * 24 * 60 * 60));
    } catch {
      // Rendering a Server Component: cookies are read-only. The cookie is refreshed by the
      // next Server Action or Route Handler; the database row is already extended.
    }
  }

  return {
    id: row.id,
    email: row.email,
    name: row.name,
    isStaff: row.is_staff === 1,
    hasPassword: Boolean(row.password_hash),
  };
});

/** For pages and actions that need a signed-in user: redirects to /login otherwise. */
export async function requireUser(next?: string): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect(next ? `/login?next=${encodeURIComponent(next)}` : "/login");
  return user;
}

// ---------------------------------------------------------------------------
// Passwords and rate limiting
// ---------------------------------------------------------------------------

export function passwordProblem(password: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) return `Use at least ${MIN_PASSWORD_LENGTH} characters.`;
  if (password.length > MAX_PASSWORD_LENGTH) return `Use at most ${MAX_PASSWORD_LENGTH} characters.`;
  return null;
}

export { hashPassword };

/** True when this email + IP (or this IP overall) has too many recent failures. */
export async function isRateLimited(db: D1Database, email: string, ip: string): Promise<boolean> {
  const since = new Date(Date.now() - FAILURE_WINDOW_MS).toISOString();
  const row = await db
    .prepare(
      `SELECT
         (SELECT count(*) FROM login_attempts WHERE email = ?1 AND ip = ?2 AND created_at > ?3) AS pair,
         (SELECT count(*) FROM login_attempts WHERE ip = ?2 AND created_at > ?3) AS ip_total`,
    )
    .bind(email, ip, since)
    .first<{ pair: number; ip_total: number }>();
  return (row?.pair ?? 0) >= MAX_FAILURES_PER_EMAIL_IP || (row?.ip_total ?? 0) >= MAX_FAILURES_PER_IP;
}

export async function recordFailure(db: D1Database, email: string, ip: string): Promise<void> {
  const dayAgo = new Date(Date.now() - DAY_MS).toISOString();
  await db.batch([
    db.prepare("INSERT INTO login_attempts (email, ip) VALUES (?, ?)").bind(email, ip),
    db.prepare("DELETE FROM login_attempts WHERE created_at < ?").bind(dayAgo),
  ]);
}

export async function clearFailures(db: D1Database, email: string, ip: string): Promise<void> {
  await db.prepare("DELETE FROM login_attempts WHERE email = ? AND ip = ?").bind(email, ip).run();
}

export const RATE_LIMIT_MESSAGE = "Too many failed attempts. Wait 15 minutes and try again.";

export type PasswordCheck =
  | { ok: true; user: SessionUser }
  | { ok: false; reason: "rate_limited" | "invalid" };

/** Rate-limited email + password check. Records failures; clears them on success. */
export async function checkPassword(db: D1Database, email: string, password: string): Promise<PasswordCheck> {
  const ip = await clientIp();
  if (await isRateLimited(db, email, ip)) return { ok: false, reason: "rate_limited" };
  const row = await db
    .prepare("SELECT id, email, name, is_staff, password_hash FROM users WHERE email = ?")
    .bind(email)
    .first<UserRow>();
  // verifyPassword runs the full hash even without a user, so timing does not leak accounts.
  const valid = await verifyPassword(password, row?.password_hash ?? null);
  if (!row || !valid) {
    await recordFailure(db, email, ip);
    return { ok: false, reason: "invalid" };
  }
  await clearFailures(db, email, ip);
  return {
    ok: true,
    user: { id: row.id, email: row.email, name: row.name, isStaff: row.is_staff === 1, hasPassword: true },
  };
}

// ---------------------------------------------------------------------------
// One-time links
// ---------------------------------------------------------------------------

export type InviteRow = {
  id: string;
  email: string;
  org_id: string | null;
  role: "client" | "admin";
  is_staff: number;
  expires_at: string;
  used_at: string | null;
  org_name: string | null;
};

/** Looks up a usable (unused, unexpired) invite by its raw token. */
export async function findInvite(db: D1Database, token: string): Promise<InviteRow | null> {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return null;
  const row = await db
    .prepare(
      `SELECT i.id, i.email, i.org_id, i.role, i.is_staff, i.expires_at, i.used_at, o.name AS org_name
         FROM invites i LEFT JOIN organizations o ON o.id = i.org_id
        WHERE i.token_hash = ?`,
    )
    .bind(await sha256Hex(token))
    .first<InviteRow>();
  if (!row || row.used_at || !(Date.parse(row.expires_at) > Date.now())) return null;
  return row;
}

/**
 * Applies invites to an existing user: adds memberships, sets is_staff for staff invites and
 * marks them used. `inviteIds` must already be validated as usable and for this user's email.
 */
export function applyInviteStatements(db: D1Database, userId: string, invites: Pick<InviteRow, "id" | "org_id" | "role" | "is_staff">[]): D1PreparedStatement[] {
  const now = nowIso();
  const out: D1PreparedStatement[] = [];
  for (const inv of invites) {
    if (inv.org_id) {
      out.push(
        db
          .prepare("INSERT INTO memberships (user_id, org_id, role) VALUES (?, ?, ?) ON CONFLICT (user_id, org_id) DO NOTHING")
          .bind(userId, inv.org_id, inv.role),
      );
    }
    if (inv.is_staff === 1) out.push(db.prepare("UPDATE users SET is_staff = 1 WHERE id = ?").bind(userId));
    out.push(db.prepare("UPDATE invites SET used_at = ? WHERE id = ? AND used_at IS NULL").bind(now, inv.id));
  }
  return out;
}

export type ResetRow = { token_hash: string; user_id: string; email: string; name: string | null };

export async function findPasswordReset(db: D1Database, token: string): Promise<ResetRow | null> {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return null;
  const row = await db
    .prepare(
      `SELECT r.token_hash, r.user_id, r.expires_at, r.used_at, u.email, u.name
         FROM password_resets r JOIN users u ON u.id = r.user_id
        WHERE r.token_hash = ?`,
    )
    .bind(await sha256Hex(token))
    .first<ResetRow & { expires_at: string; used_at: string | null }>();
  if (!row || row.used_at || !(Date.parse(row.expires_at) > Date.now())) return null;
  return { token_hash: row.token_hash, user_id: row.user_id, email: row.email, name: row.name };
}

/** Absolute origin of the current request, for links shown to admins. */
export async function requestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (host) {
    const local = LOCAL_HOST.test(host);
    const proto = h.get("x-forwarded-proto") ?? (local ? "http" : "https");
    return `${proto}://${host}`;
  }
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://moonlab.space";
}
