import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getFacebookConfig, getGoogleConfig, isPortalConfigured } from "@/lib/portal/env";
import { getSessionUser } from "@/lib/portal/auth";
import { safeNext } from "@/lib/portal/action-utils";
import { NotConfigured } from "../_components/ui";
import { ActionForm } from "../_components/action-form";
import { AuthCard } from "../_components/auth-card";
import { SocialButtons } from "../_components/social-buttons";
import { signInWithPassword } from "./actions";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  google: "Google sign-in was cancelled or failed. Try again.",
    google_unverified: "That Google address is not verified. Use email and password instead.",
  facebook: "Facebook sign-in was cancelled or failed. Try again.",
  facebook_no_email: "Your Facebook account has no email address we can use. Sign in with Google or email instead.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!(await isPortalConfigured())) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <NotConfigured />
      </main>
    );
  }

  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : undefined);
  if (await getSessionUser()) redirect(next);
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;
  const social = (await getGoogleConfig()) || (await getFacebookConfig());

  return (
    <AuthCard title="Sign in to your client portal" description="Track projects, automations, requests and invoices." footer={
      <>
        New here?{" "}
        <Link href={next !== "/dashboard" ? `/signup?next=${encodeURIComponent(next)}` : "/signup"} className="pt-link">
          Create an account
        </Link>
      </>
    }>
      {error && (
        <p role="alert" className="mt-4 rounded-md border px-3 py-2 text-[13px]" style={{ borderColor: "var(--pt-bad)", color: "var(--pt-bad)" }}>
          {error}
        </p>
      )}

      <SocialButtons next={next} />

      <ActionForm action={signInWithPassword} submitLabel="Sign in" pendingLabel="Signing in…" className={`${social ? "" : "mt-6 "}[&_button]:w-full`}>
        <input type="hidden" name="next" value={next} />
        <div className="space-y-4">
          <div>
            <label className="pt-label" htmlFor="email">
              Email
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="pt-input" />
          </div>
          <div>
            <div className="flex items-baseline justify-between gap-2">
              <label className="pt-label" htmlFor="password">
                Password
              </label>
              <Link href="/forgot-password" className="pt-link text-[12.5px]">
                Forgot password?
              </Link>
            </div>
            <input id="password" name="password" type="password" autoComplete="current-password" required className="pt-input" />
          </div>
        </div>
      </ActionForm>
    </AuthCard>
  );
}
