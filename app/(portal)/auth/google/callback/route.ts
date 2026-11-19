import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getDb, getGoogleConfig } from "@/lib/portal/env";
import { finishSocialSignIn } from "@/lib/portal/social";
import { GOOGLE_STATE_COOKIE, fetchGoogleProfile, googleRedirectUri } from "@/lib/portal/google";

function fail(reason: string): never {
  redirect(`/login?error=${reason}`);
}

/**
 * Google redirects here. A verified Google email signs in to its account, or creates one
 * with its own workspace (the same as a confirmed email sign-up). Open invites are applied.
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

  await finishSocialSignIn(db, profile, saved.next);
}
