import type { Metadata } from "next";
import Link from "next/link";
import { getDb } from "@/lib/portal/env";
import { MIN_PASSWORD_LENGTH, findInvite, getSessionUser } from "@/lib/portal/auth";
import { NotConfigured } from "../../_components/ui";
import { ActionForm } from "../../_components/action-form";
import { AuthCard } from "../../_components/auth-card";
import { acceptInvite } from "./actions";

export const metadata: Metadata = { title: "Accept invite", referrer: "no-referrer" };

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const db = await getDb();
  if (!db) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <NotConfigured />
      </main>
    );
  }

  const invite = await findInvite(db, token);
  if (!invite) {
    return (
      <AuthCard title="This invite link does not work" description="It may have been used already, revoked, or it expired (links last 7 days).">
        <p className="mt-4 text-[13.5px]">Ask your Moonlab contact for a new invite link.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/login" className="pt-btn" data-variant="primary">
            Sign in
          </Link>
          <Link href="/contact" className="pt-btn" data-variant="ghost">
            Contact Moonlab
          </Link>
        </div>
      </AuthCard>
    );
  }

  const [current, existing] = await Promise.all([
    getSessionUser(),
    db.prepare("SELECT id, password_hash FROM users WHERE email = ?").bind(invite.email).first<{ id: string; password_hash: string | null }>(),
  ]);
  const where = invite.org_name ? `the ${invite.org_name} workspace` : "the Moonlab portal as staff";
  const signedInAsInvitee = Boolean(current && existing && current.id === existing.id);

  return (
    <AuthCard title="Join the Moonlab client portal" description={<>You were invited to {where}.</>}>
      <p className="mt-4 rounded-md border border-border bg-surface-2 px-3 py-2 text-[13px]">
        Invite for <span className="font-medium">{invite.email}</span>
      </p>

      {signedInAsInvitee ? (
        <ActionForm action={acceptInvite} submitLabel="Accept invite" pendingLabel="Joining…" className="mt-6 [&_button]:w-full" hasVisibleFields={false}>
          <input type="hidden" name="token" value={token} />
        </ActionForm>
      ) : existing ? (
        <ActionForm action={acceptInvite} submitLabel="Accept and sign in" pendingLabel="Signing in…" className="mt-6 [&_button]:w-full">
          <input type="hidden" name="token" value={token} />
          <p className="mb-4 text-[13px] text-muted">You already have an account. Enter its password to accept.</p>
          <label className="pt-label" htmlFor="password">
            Password
          </label>
          <input id="password" name="password" type="password" autoComplete="current-password" required className="pt-input" />
          <p className="mt-2 text-[12.5px]">
            <Link href="/forgot-password" className="pt-link">
              Forgot password?
            </Link>
          </p>
        </ActionForm>
      ) : (
        <ActionForm action={acceptInvite} submitLabel="Create account" pendingLabel="Creating…" className="mt-6 [&_button]:w-full">
          <input type="hidden" name="token" value={token} />
          {/* Lets password managers save the right username. */}
          <input type="email" name="username" value={invite.email} autoComplete="username" readOnly hidden />
          <div className="space-y-4">
            <div>
              <label className="pt-label" htmlFor="name">
                Your name
              </label>
              <input id="name" name="name" required maxLength={120} autoComplete="name" className="pt-input" />
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
      )}
    </AuthCard>
  );
}
