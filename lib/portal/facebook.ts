// Shared bits for the optional Facebook sign-in routes (/auth/facebook, /auth/facebook/callback).

import type { NextRequest } from "next/server";

export const FACEBOOK_STATE_COOKIE = "ml_facebook_oauth";
export const GRAPH = "https://graph.facebook.com/v21.0";

/** Must match a "Valid OAuth Redirect URI" in the Facebook app's Facebook Login settings. */
export function facebookRedirectUri(request: NextRequest): string {
  return new URL("/auth/facebook/callback", request.nextUrl.origin).toString();
}

async function hmacHex(key: string, message: string): Promise<string> {
  const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", k, new TextEncoder().encode(message));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export type FacebookProfile = { email: string | null; name: string | null };

/** Exchanges the code and reads name + email. Facebook only returns a confirmed primary email. */
export async function fetchFacebookProfile(opts: { code: string; redirectUri: string; appId: string; appSecret: string }): Promise<FacebookProfile | null> {
  const tokenUrl = new URL(`${GRAPH}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", opts.appId);
  tokenUrl.searchParams.set("client_secret", opts.appSecret);
  tokenUrl.searchParams.set("redirect_uri", opts.redirectUri);
  tokenUrl.searchParams.set("code", opts.code);
  const tokenRes = await fetch(tokenUrl);
  if (!tokenRes.ok) return null;
  const token = (await tokenRes.json()) as { access_token?: string };
  if (!token.access_token) return null;

  const me = new URL(`${GRAPH}/me`);
  me.searchParams.set("fields", "name,email");
  me.searchParams.set("access_token", token.access_token);
  me.searchParams.set("appsecret_proof", await hmacHex(opts.appSecret, token.access_token));
  const infoRes = await fetch(me);
  if (!infoRes.ok) return null;
  const info = (await infoRes.json()) as { email?: string; name?: string };
  return {
    email: info.email ? info.email.trim().toLowerCase() : null,
    name: info.name?.trim().slice(0, 120) || null,
  };
}
