import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/portal/env";
import { safeNext } from "@/lib/portal/action-utils";
import { findSignup } from "@/lib/portal/signup";
import { NotConfigured } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { AuthCard } from "../../../_components/auth-card";
import { confirmSignup } from "../../actions";

export const metadata: Metadata = { title: "Confirm your account", referrer: "no-referrer" };

// The account is created by the button (a POST), not by opening the link, so email link
// scanners that open links on their own cannot use up the confirmation.
export default async function ConfirmSignupPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { token } = await params;
  const query = await searchParams;
  const next = safeNext(typeof query.next === "string" ? query.next : undefined);
  const db = await getDb();
  if (!db) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <NotConfigured />
      </main>
    );
  }

  const signup = await findSignup(db, token);
  if (!signup) {
    return (
      <AuthCard title="This link does not work" description="It may have been used already, or it expired (links last 24 hours).">
        <p className="mt-4 text-[13.5px]">If you already confirmed, just sign in. Otherwise sign up again for a new link.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/login" className="pt-btn" data-variant="primary">
            Sign in
          </Link>
          <Link href="/signup" className="pt-btn" data-variant="ghost">
            Sign up again
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Confirm your account" description="One click and your client portal is ready.">
      <p className="mt-4 rounded-md border border-border bg-surface-2 px-3 py-2 text-[13px]">
        Account for <span className="font-medium">{signup.email}</span>
      </p>
      <ActionForm action={confirmSignup} submitLabel="Confirm and open my portal" pendingLabel="Creating…" className="mt-6 [&_button]:w-full" hasVisibleFields={false}>
        <input type="hidden" name="token" value={token} />
        <input type="hidden" name="next" value={next} />
      </ActionForm>
    </AuthCard>
  );
}
