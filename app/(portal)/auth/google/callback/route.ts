import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getDb, getGoogleConfig } from "@/lib/portal/env";
import { applyInviteStatements, nowIso, startSession, type InviteRow } from "@/lib/portal/auth";
import { safeNext } from "@/lib/portal/action-utils";
import { GOOGLE_STATE_COOKIE, fetchGoogleProfile, googleRedirectUri } from "@/lib/portal/google";

function fail(reason: string): never {
  redirect(`/login?error=${reason}`);
}

/**
 * Google redirects here. Signs in only when the verified Google email already has a portal
 * account or an open invite; it never creates accounts for strangers. Open invites for that
 * email are applied (the Google account proves the address).
 */
export async function GET(request: NextRequest) {
  const [db, google] = await Promise.all([getDb(), getGoogleConfig()]);
  if (!db || !google) redirect("/login");

  const store = await cookies();
  const raw = store.get(GOOGLE_STATE_COOKIE)?.value;
  store.set(GOOGLE_STATE_COOKIE, "", { path: "/auth/google", maxAge: 0 });

  let saved: { state?: string; verifier?: string; next?: string } = {};
  try {
    saved = raw ? (JSON.parse(raw) as typeof saved) : {};
  } catch {
    saved = {};
  }
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  if (params.get("error") || !code || !saved.state || !saved.verifier || params.get("state") !== saved.state) fail("google");

  const profile = await fetchGoogleProfile({
    code,
    verifier: saved.verifier,
    redirectUri: googleRedirectUri(request),
    clientId: google.clientId,
    clientSecret: google.clientSecret,
  }).catch(() => null);
  if (!profile) fail("google");
  if (!profile.emailVerified) fail("google_unverified");

  const [user, invites] = await Promise.all([
    db.prepare("SELECT id FROM users WHERE email = ?").bind(profile.email).first<{ id: string }>(),
    db
      .prepare("SELECT id, email, org_id, role, is_staff, expires_at, used_at, NULL AS org_name FROM invites WHERE email = ? AND used_at IS NULL AND expires_at > ?")
      .bind(profile.email, nowIso())
      .all<InviteRow>(),
  ]);

  let userId = user?.id;
  if (!userId) {
    if (invites.results.length === 0) fail("google_no_account");
    userId = crypto.randomUUID();
    const staff = invites.results.some((i) => i.is_staff === 1) ? 1 : 0;
    await db.batch([
      db.prepare("INSERT INTO users (id, email, name, password_hash, is_staff) VALUES (?, ?, ?, NULL, ?)").bind(userId, profile.email, profile.name, staff),
      ...applyInviteStatements(db, userId, invites.results),
    ]);
  } else if (invites.results.length > 0) {
    await db.batch(applyInviteStatements(db, userId, invites.results));
  }

  await startSession(db, userId);
  redirect(safeNext(saved.next));
}
