import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "./config";

/** Browser client (anon key + session cookie). Used only for direct-to-storage uploads. */
export function createSupabaseBrowserClient() {
  const env = getSupabaseEnv();
  if (!env) throw new Error("Supabase is not configured.");
  return createBrowserClient(env.url, env.anonKey);
}
