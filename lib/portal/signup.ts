import { sha256Hex } from "./crypto";

type SignupRow = { token_hash: string; email: string; name: string; company: string | null; password_hash: string; expires_at: string; used_at: string | null };

/** The pending sign-up for a raw token, if it is unused and not expired. */
export async function findSignup(db: D1Database, token: string): Promise<SignupRow | null> {
  if (!/^[A-Za-z0-9_-]{20,100}$/.test(token)) return null;
  const row = await db.prepare("SELECT * FROM signup_requests WHERE token_hash = ?").bind(await sha256Hex(token)).first<SignupRow>();
  if (!row || row.used_at || !(Date.parse(row.expires_at) > Date.now())) return null;
  return row;
}

/**
 * Statements that create a self-service account: the user, their own workspace (named after
 * the company, or "<first name>'s workspace") and a client membership in it.
 */
export function newAccountStatements(
  db: D1Database,
  a: { userId: string; orgId: string; email: string; name: string | null; company: string | null; passwordHash: string | null },
): D1PreparedStatement[] {
  const first = (a.name ?? a.email.split("@")[0]).split(" ")[0];
  const orgName = (a.company || `${first}'s workspace`).slice(0, 120);
  return [
    db.prepare("INSERT INTO users (id, email, name, password_hash, is_staff) VALUES (?, ?, ?, ?, 0)").bind(a.userId, a.email, a.name, a.passwordHash),
    db.prepare("INSERT INTO organizations (id, name) VALUES (?, ?)").bind(a.orgId, orgName),
    db.prepare("INSERT INTO memberships (user_id, org_id, role) VALUES (?, ?, 'client')").bind(a.userId, a.orgId),
  ];
}
