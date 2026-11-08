import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getGoogleConfig, isPortalConfigured } from "@/lib/portal/env";
import { getSessionUser } from "@/lib/portal/auth";
import { safeNext } from "@/lib/portal/action-utils";
import { NotConfigured } from "../_components/ui";
import { ActionForm } from "../_components/action-form";
import { AuthCard } from "../_components/auth-card";
import { signInWithPassword } from "./actions";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  google: "Google sign-in was cancelled or failed. Try again.",
  google_no_account: "There is no portal account or open invite for that Google address. Ask your Moonlabs contact for an invite.",
  google_unverified: "That Google address is not verified. Use email and password instead.",
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
  const google = await getGoogleConfig();

  return (
    <AuthCard title="Sign in to your client portal" description="Track projects, automations, requests and invoices." footer={
      <>
        Not a client yet?{" "}
        <Link href="/pricing" className="pt-link">
          See plans
        </Link>
      </>
    }>
      {error && (
        <p role="alert" className="mt-4 rounded-md border px-3 py-2 text-[13px]" style={{ borderColor: "var(--pt-bad)", color: "var(--pt-bad)" }}>
          {error}
        </p>
      )}

      {google && (
        <>
          <a href={`/auth/google${next !== "/dashboard" ? `?next=${encodeURIComponent(next)}` : ""}`} className="pt-btn mt-6 w-full">
            Continue with Google
          </a>
          <div className="my-6 flex items-center gap-3 text-[12px] text-muted" aria-hidden>
            <span className="h-px flex-1 bg-border" />
            or
            <span className="h-px flex-1 bg-border" />
          </div>
        </>
      )}

      <ActionForm action={signInWithPassword} submitLabel="Sign in" pendingLabel="Signing in…" className={`${google ? "" : "mt-6 "}[&_button]:w-full`}>
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
