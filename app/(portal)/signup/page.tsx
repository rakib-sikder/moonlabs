import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { MIN_PASSWORD_LENGTH, getSessionUser } from "@/lib/portal/auth";
import { safeNext } from "@/lib/portal/action-utils";
import { NotConfigured } from "../_components/ui";
import { ActionForm } from "../_components/action-form";
import { AuthCard } from "../_components/auth-card";
import { startSignup } from "./actions";

export const metadata: Metadata = { title: "Create an account" };

export default async function SignupPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
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
  const loginHref = next !== "/dashboard" ? `/login?next=${encodeURIComponent(next)}` : "/login";

  return (
    <AuthCard
      title="Create your client account"
      description="Pick a plan, send requests and follow your automations in one place."
      footer={
        <>
          Already have an account?{" "}
          <Link href={loginHref} className="pt-link">
            Sign in
          </Link>
        </>
      }
    >
      <ActionForm action={startSignup} submitLabel="Create account" pendingLabel="Sending…" className="mt-6 [&_button]:w-full" resetOnSuccess>
        <input type="hidden" name="next" value={next} />
        {/* Honeypot for bots: hidden from people and screen readers. */}
        <div aria-hidden style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
          <label htmlFor="website">Website</label>
          <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
        </div>
        <div className="space-y-4">
          <div>
            <label className="pt-label" htmlFor="name">
              Your name
            </label>
            <input id="name" name="name" required maxLength={120} autoComplete="name" className="pt-input" />
          </div>
          <div>
            <label className="pt-label" htmlFor="company">
              Company <span className="text-muted">(optional)</span>
            </label>
            <input id="company" name="company" maxLength={120} autoComplete="organization" className="pt-input" />
          </div>
          <div>
            <label className="pt-label" htmlFor="email">
              Work email
            </label>
            <input id="email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder="you@company.com" className="pt-input" />
          </div>
          <div>
            <label className="pt-label" htmlFor="password">
              Choose a password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD_LENGTH}
              maxLength={200}
              className="pt-input"
              aria-describedby="password-hint"
            />
            <p id="password-hint" className="mt-1 text-[12px] text-muted">
              At least {MIN_PASSWORD_LENGTH} characters.
            </p>
          </div>
          <div>
            <label className="pt-label" htmlFor="confirm">
              Repeat password
            </label>
            <input id="confirm" name="confirm" type="password" autoComplete="new-password" required maxLength={200} className="pt-input" />
          </div>
        </div>
      </ActionForm>
    </AuthCard>
  );
}
