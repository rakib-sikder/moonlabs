import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { getDb, getFacebookConfig } from "@/lib/portal/env";
import { FACEBOOK_STATE_COOKIE, facebookRedirectUri, fetchFacebookProfile } from "@/lib/portal/facebook";
import { finishSocialSignIn } from "@/lib/portal/social";

function fail(reason: string): never {
  redirect(`/login?error=${reason}`);
}

/** Facebook redirects here. Needs an email on the Facebook account (some sign up by phone only). */
export async function GET(request: NextRequest) {
  const [db, fb] = await Promise.all([getDb(), getFacebookConfig()]);
  if (!db || !fb) redirect("/login");

  const store = await cookies();
  const raw = store.get(FACEBOOK_STATE_COOKIE)?.value;
  store.set(FACEBOOK_STATE_COOKIE, "", { path: "/auth/facebook", maxAge: 0 });

  let saved: { state?: string; next?: string } = {};
  try {
    saved = raw ? (JSON.parse(raw) as typeof saved) : {};
  } catch {
    saved = {};
  }
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  if (params.get("error") || !code || !saved.state || params.get("state") !== saved.state) fail("facebook");

  const profile = await fetchFacebookProfile({ code, redirectUri: facebookRedirectUri(request), appId: fb.appId, appSecret: fb.appSecret }).catch(() => null);
  if (!profile) fail("facebook");
  if (!profile.email) fail("facebook_no_email");

  await finishSocialSignIn(db, { email: profile.email, name: profile.name }, saved.next);
}
