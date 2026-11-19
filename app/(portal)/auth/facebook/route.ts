import { NextResponse, type NextRequest } from "next/server";
import { getFacebookConfig } from "@/lib/portal/env";
import { randomToken } from "@/lib/portal/crypto";
import { safeNext } from "@/lib/portal/action-utils";
import { FACEBOOK_STATE_COOKIE, facebookRedirectUri } from "@/lib/portal/facebook";

/**
 * Starts Facebook sign-in. Only active when FACEBOOK_APP_ID and FACEBOOK_APP_SECRET are set.
 * State and the post-login path are kept in a short-lived httpOnly cookie.
 */
export async function GET(request: NextRequest) {
  const fb = await getFacebookConfig();
  if (!fb) return NextResponse.redirect(new URL("/login", request.url));

  const state = randomToken(24);
  const next = safeNext(request.nextUrl.searchParams.get("next"));

  const auth = new URL("https://www.facebook.com/v21.0/dialog/oauth");
  auth.searchParams.set("client_id", fb.appId);
  auth.searchParams.set("redirect_uri", facebookRedirectUri(request));
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", "email,public_profile");
  auth.searchParams.set("state", state);

  const response = NextResponse.redirect(auth);
  response.cookies.set(FACEBOOK_STATE_COOKIE, JSON.stringify({ state, next }), {
    path: "/auth/facebook",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    maxAge: 10 * 60,
  });
  return response;
}
