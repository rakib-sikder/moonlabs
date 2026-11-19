import type { Metadata } from "next";
import Link from "next/link";
import { isPortalConfigured } from "@/lib/portal/env";
import { NotConfigured } from "../_components/ui";
import { ActionForm } from "../_components/action-form";
import { AuthCard } from "../_components/auth-card";
import { requestPasswordReset } from "./actions";

export const metadata: Metadata = { title: "Forgot password" };

export default async function ForgotPasswordPage() {
  if (!(await isPortalConfigured())) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <NotConfigured />
      </main>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      description="Enter your email and we will send you a link to choose a new one."
      footer={
        <Link href="/login" className="pt-link">
          Back to sign in
        </Link>
      }
    >
      <ActionForm action={requestPasswordReset} submitLabel="Send reset link" pendingLabel="Sending…" className="mt-6 [&_button]:w-full">
        <label className="pt-label" htmlFor="email">
          Email
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" className="pt-input" />
      </ActionForm>
    </AuthCard>
  );
}
