"use server";

import { redirect } from "next/navigation";
import { isPortalConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { guarded, requestOrigin, safeNext } from "@/lib/portal/action-utils";
import { email as readEmail } from "@/lib/portal/validate";
import type { ActionState } from "@/lib/portal/types";

function callbackUrl(origin: string, next: string): string {
  const url = new URL("/auth/callback", origin);
  if (next !== "/dashboard") url.searchParams.set("next", next);
  return url.toString();
}

export async function sendMagicLink(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    if (!isPortalConfigured()) return { ok: false, message: "The client portal is not configured yet." };
    const address = readEmail(formData, "email");
    const next = safeNext(formData.get("next"));
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: address,
      options: { emailRedirectTo: callbackUrl(await requestOrigin(), next), shouldCreateUser: true },
    });
    if (error) {
      console.error("[portal] magic link failed", error.status, error.message);
      if (error.status === 429) return { ok: false, message: "Too many sign-in emails. Wait a minute and try again." };
      return { ok: false, message: "We could not send the sign-in email. Check the address and try again." };
    }
    return { ok: true, message: `Check ${address} for a sign-in link. It expires in one hour.` };
  });
}

export async function signInWithGoogle(formData: FormData): Promise<ActionState> {
  if (!isPortalConfigured()) return { ok: false, message: "The client portal is not configured yet." };
  const next = safeNext(formData.get("next"));
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl(await requestOrigin(), next) },
  });
  if (error || !data.url) {
    console.error("[portal] google sign-in failed", error?.message);
    return { ok: false, message: "Google sign-in is not available right now. Use the email link instead." };
  }
  redirect(data.url);
}
