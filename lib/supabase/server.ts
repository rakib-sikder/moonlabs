import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "./config";

/**
 * Supabase client for Server Components, Server Actions and Route Handlers. Runs as the
 * signed-in user (anon key + their session cookie), so row-level security applies.
 * Throws if the portal is not configured; callers check isPortalConfigured() first.
 */
export async function createSupabaseServerClient() {
  const env = getSupabaseEnv();
  if (!env) throw new Error("Supabase is not configured (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).");
  const cookieStore = await cookies();

  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) cookieStore.set(name, value, options);
        } catch {
          // Called from a Server Component, where cookies are read-only. proxy.ts refreshes
          // the session on every portal request, so this is safe to ignore.
        }
      },
    },
  });
}
