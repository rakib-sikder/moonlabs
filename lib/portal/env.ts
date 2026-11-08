// Cloudflare bindings for the client portal. The portal is optional: without the D1 binding
// `DB` the marketing site still builds and runs, and /login + /dashboard show a
// "not configured yet" screen instead of crashing.

import { getCloudflareContext } from "@opennextjs/cloudflare";

/** Bindings and secrets the portal reads. FILES and the Google secrets are optional. */
export type PortalEnv = {
  DB?: D1Database;
  FILES?: R2Bucket;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

/** Name of the cookie remembering which organization the user is looking at. */
export const ORG_COOKIE = "ml_portal_org";

export async function getPortalEnv(): Promise<PortalEnv> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return env as unknown as PortalEnv;
  } catch {
    // Outside a Workers request (e.g. some build steps): behave as "not configured".
    return {};
  }
}

/** The portal database, or null when the DB binding is missing. */
export async function getDb(): Promise<D1Database | null> {
  const env = await getPortalEnv();
  return env.DB ?? null;
}

export async function isPortalConfigured(): Promise<boolean> {
  return (await getDb()) !== null;
}

/** R2 bucket for uploaded deliverables, or null (then deliverables are shared as links). */
export async function getFilesBucket(): Promise<R2Bucket | null> {
  const env = await getPortalEnv();
  return env.FILES ?? null;
}

export type GoogleConfig = { clientId: string; clientSecret: string };

/** Google sign-in is offered only when both secrets are set. */
export async function getGoogleConfig(): Promise<GoogleConfig | null> {
  const env = await getPortalEnv();
  const clientId = (env.GOOGLE_CLIENT_ID ?? process.env.GOOGLE_CLIENT_ID)?.trim();
  const clientSecret = (env.GOOGLE_CLIENT_SECRET ?? process.env.GOOGLE_CLIENT_SECRET)?.trim();
  if (!clientId || !clientSecret) return null;
  return { clientId, clientSecret };
}
