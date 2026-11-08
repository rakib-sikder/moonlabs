// Shared bits for the optional Google sign-in routes (/auth/google, /auth/google/callback).

import type { NextRequest } from "next/server";

export const GOOGLE_STATE_COOKIE = "ml_google_oauth";

/** Must match an "Authorized redirect URI" on the Google OAuth client exactly. */
export function googleRedirectUri(request: NextRequest): string {
  return new URL("/auth/google/callback", request.nextUrl.origin).toString();
}

export type GoogleProfile = { email: string; emailVerified: boolean; name: string | null };

/** Exchanges the authorization code (with the PKCE verifier) and reads the user's profile. */
export async function fetchGoogleProfile(opts: {
  code: string;
  verifier: string;
  redirectUri: string;
  clientId: string;
  clientSecret: string;
}): Promise<GoogleProfile | null> {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: opts.code,
      code_verifier: opts.verifier,
      redirect_uri: opts.redirectUri,
      client_id: opts.clientId,
      client_secret: opts.clientSecret,
    }),
  });
  if (!tokenRes.ok) return null;
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) return null;

  const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
    headers: { Authorization: `Bearer ${token.access_token}` },
  });
  if (!infoRes.ok) return null;
  const info = (await infoRes.json()) as { email?: string; email_verified?: boolean; name?: string };
  if (!info.email) return null;
  return {
    email: info.email.trim().toLowerCase(),
    emailVerified: info.email_verified === true,
    name: info.name?.trim().slice(0, 120) || null,
  };
}
