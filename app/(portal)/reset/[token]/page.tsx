import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/portal/env";
import { MIN_PASSWORD_LENGTH, findPasswordReset } from "@/lib/portal/auth";
import { NotConfigured } from "../../_components/ui";
import { ActionForm } from "../../_components/action-form";
import { AuthCard } from "../../_components/auth-card";
import { resetPassword } from "./actions";

export const metadata: Metadata = { title: "Choose a new password", referrer: "no-referrer" };

export default async function ResetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = await getDb();
  if (!db) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <NotConfigured />
      </main>
    );
  }

  const reset = await findPasswordReset(db, token);
  if (!reset) {
    return (
      <AuthCard title="This reset link does not work" description="It may have been used already, or it expired (links last 24 hours).">
        <p className="mt-4 text-[13.5px]">Ask your Moonlab contact for a new password reset link.</p>
        <div className="mt-6">
          <Link href="/login" className="pt-btn" data-variant="primary">
            Back to sign in
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Choose a new password" description={<>For {reset.email}. You will be signed out everywhere else.</>}>
      <ActionForm action={resetPassword} submitLabel="Save password and sign in" pendingLabel="Saving…" className="mt-6 [&_button]:w-full">
        <input type="hidden" name="token" value={token} />
        <input type="email" name="username" value={reset.email} autoComplete="username" readOnly hidden />
        <div className="space-y-4">
          <div>
            <label className="pt-label" htmlFor="password">
              New password
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
