import type { Metadata } from "next";
import Link from "next/link";
import { AuthCard } from "../_components/auth-card";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthCard
      title="Forgot your password?"
      description="We do not send reset emails yet."
      footer={
        <Link href="/login" className="pt-link">
          Back to sign in
        </Link>
      }
    >
      <div className="pt-prose mt-4 space-y-3 text-[13.5px]">
        <p>Ask your Moonlabs contact for a password reset link. They can create one for you in a minute.</p>
        <p>The link works once and expires after 24 hours. Open it, choose a new password, and you are signed in.</p>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/contact" className="pt-btn" data-variant="primary">
          Contact Moonlabs
        </Link>
        <Link href="/login" className="pt-btn" data-variant="ghost">
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
