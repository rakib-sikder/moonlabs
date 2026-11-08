import { NextResponse, type NextRequest } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";
import { isPortalConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { safeNext } from "@/lib/portal/action-utils";

const OTP_TYPES: EmailOtpType[] = ["magiclink", "email", "signup", "invite", "recovery", "email_change"];

/**
 * Lands here after Google OAuth (?code=) or an email link. Email links work both with the
 * default template (?code=, same browser only) and with the recommended token-hash template
 * (?token_hash=&type=, works on any device) described in docs/PORTAL.md.
 */
export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const next = safeNext(url.searchParams.get("next"));
  const fail = (reason: string) => {
    const to = new URL("/login", url.origin);
    to.searchParams.set("error", reason);
    if (next !== "/dashboard") to.searchParams.set("next", next);
    return NextResponse.redirect(to);
  };

  if (!isPortalConfigured()) return NextResponse.redirect(new URL("/login", url.origin));

  const providerError = url.searchParams.get("error_description") ?? url.searchParams.get("error");
  if (providerError) return fail("provider");

  const supabase = await createSupabaseServerClient();
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as EmailOtpType | null;

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) return fail("link");
  } else if (tokenHash && type && OTP_TYPES.includes(type)) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
    if (error) return fail("link");
  } else {
    return fail("link");
  }

  // Join any organizations this email was invited to.
  await supabase.rpc("claim_invites");

  return NextResponse.redirect(new URL(next, url.origin));
}
