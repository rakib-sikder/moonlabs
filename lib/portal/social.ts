// Shared end of Google and Facebook sign-in: find or create the account, start the session.

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ORG_COOKIE } from "./env";
import { applyInviteStatements, cookieOptions, nowIso, startSession, type InviteRow } from "./auth";
import { safeNext } from "./action-utils";
import { newAccountStatements } from "./signup";

export type SocialProfile = { email: string; name: string | null };

/**
 * Signs the person in with an email address the provider has confirmed. Existing account:
 * sign in (open invites for that email are applied). No account: create one with its own
 * workspace, exactly like a confirmed email sign-up, or join through an open invite.
 */
export async function finishSocialSignIn(db: D1Database, profile: SocialProfile, next: unknown): Promise<never> {
  const [user, invites] = await Promise.all([
    db.prepare("SELECT id FROM users WHERE email = ?").bind(profile.email).first<{ id: string }>(),
    db
      .prepare("SELECT id, email, org_id, role, is_staff, expires_at, used_at, NULL AS org_name FROM invites WHERE email = ? AND used_at IS NULL AND expires_at > ?")
      .bind(profile.email, nowIso())
      .all<InviteRow>(),
  ]);

  let userId = user?.id;
  let newOrgId: string | null = null;
  if (!userId) {
    userId = crypto.randomUUID();
    if (invites.results.length > 0) {
      const staff = invites.results.some((i) => i.is_staff === 1) ? 1 : 0;
      await db.batch([
        db.prepare("INSERT INTO users (id, email, name, password_hash, is_staff) VALUES (?, ?, ?, NULL, ?)").bind(userId, profile.email, profile.name, staff),
        ...applyInviteStatements(db, userId, invites.results),
      ]);
    } else {
      newOrgId = crypto.randomUUID();
      await db.batch(newAccountStatements(db, { userId, orgId: newOrgId, email: profile.email, name: profile.name, company: null, passwordHash: null }));
    }
  } else if (invites.results.length > 0) {
    await db.batch(applyInviteStatements(db, userId, invites.results));
  }

  await startSession(db, userId);
  if (newOrgId) (await cookies()).set(ORG_COOKIE, newOrgId, await cookieOptions(60 * 60 * 24 * 365));
  redirect(safeNext(next));
}
