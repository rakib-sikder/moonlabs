// The portal is optional: without these env vars the marketing site still builds and runs,
// and /login + /dashboard show a "not configured yet" state instead of crashing.

export type SupabaseEnv = { url: string; anonKey: string };

export function getSupabaseEnv(): SupabaseEnv | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !anonKey) return null;
  return { url, anonKey };
}

export function isPortalConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

/** Name of the cookie remembering which organization the user is looking at. */
export const ORG_COOKIE = "ml_portal_org";

/** Private storage bucket for deliverables (created by the migration). */
export const DELIVERABLES_BUCKET = "deliverables";
