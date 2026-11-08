import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { isPortalConfigured } from "@/lib/supabase/config";
import { safeNext } from "@/lib/portal/action-utils";
import { NotConfigured } from "../_components/ui";
import { ActionForm } from "../_components/action-form";
import { sendMagicLink, signInWithGoogle } from "./actions";

export const metadata: Metadata = { title: "Sign in" };

const ERRORS: Record<string, string> = {
  link: "That sign-in link is invalid or has expired. Request a new one below.",
  provider: "Sign-in was cancelled or failed. Try again.",
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  if (!isPortalConfigured()) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <NotConfigured />
      </main>
    );
  }

  const params = await searchParams;
  const next = safeNext(typeof params.next === "string" ? params.next : undefined);
  const error = typeof params.error === "string" ? ERRORS[params.error] : undefined;

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-[15px]" aria-label="Moonlabs home">
        <Logo />
      </Link>
      <div className="pt-panel w-full max-w-sm p-6">
        <h1 className="text-lg font-semibold">Sign in to your client portal</h1>
        <p className="mt-1 text-muted">Track projects, automations, requests and invoices.</p>

        {error && (
          <p role="alert" className="mt-4 rounded-md border px-3 py-2 text-[13px]" style={{ borderColor: "var(--pt-bad)", color: "var(--pt-bad)" }}>
            {error}
          </p>
        )}

        <ActionForm action={signInWithGoogle} submitLabel="Continue with Google" pendingLabel="Redirecting…" variant="default" className="mt-6 [&_button]:w-full" hasVisibleFields={false}>
          <input type="hidden" name="next" value={next} />
        </ActionForm>

        <div className="my-6 flex items-center gap-3 text-[12px] text-muted" aria-hidden>
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <ActionForm action={sendMagicLink} submitLabel="Email me a sign-in link" pendingLabel="Sending…" className="[&_button]:w-full">
          <input type="hidden" name="next" value={next} />
          <label className="pt-label" htmlFor="email">
            Work email
          </label>
          <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="pt-input" />
        </ActionForm>
      </div>
      <p className="mt-6 text-[13px] text-muted">
        Not a client yet?{" "}
        <Link href="/pricing" className="pt-link">
          See plans
        </Link>
      </p>
    </main>
  );
}
