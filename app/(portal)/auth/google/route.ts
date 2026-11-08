import { NextResponse, type NextRequest } from "next/server";
import { getGoogleConfig } from "@/lib/portal/env";
import { randomToken, sha256Base64Url } from "@/lib/portal/crypto";
import { safeNext } from "@/lib/portal/action-utils";
import { GOOGLE_STATE_COOKIE, googleRedirectUri } from "@/lib/portal/google";

/**
 * Starts Google sign-in (authorization code + PKCE). Only active when GOOGLE_CLIENT_ID and
 * GOOGLE_CLIENT_SECRET are set. State, PKCE verifier and the post-login path are kept in a
 * short-lived httpOnly cookie and checked in /auth/google/callback.
 */
export async function GET(request: NextRequest) {
  const google = await getGoogleConfig();
  if (!google) return NextResponse.redirect(new URL("/login", request.url));

  const state = randomToken(24);
  const verifier = randomToken(48);
  const next = safeNext(request.nextUrl.searchParams.get("next"));

  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.searchParams.set("client_id", google.clientId);
  auth.searchParams.set("redirect_uri", googleRedirectUri(request));
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", "openid email profile");
  auth.searchParams.set("state", state);
  auth.searchParams.set("code_challenge", await sha256Base64Url(verifier));
  auth.searchParams.set("code_challenge_method", "S256");
  auth.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(auth);
  response.cookies.set(GOOGLE_STATE_COOKIE, JSON.stringify({ state, verifier, next }), {
    path: "/auth/google",
    httpOnly: true,
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
    maxAge: 10 * 60,
  });
  return response;
}
