import Link from "next/link";
import { Logo } from "@/components/Logo";

/** Centred card used by the signed-out pages (sign in, invite, password reset). */
export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8 text-[15px]" aria-label="Moonlabs home">
        <Logo />
      </Link>
      <div className="pt-panel w-full max-w-sm p-6">
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && <p className="mt-1 text-muted">{description}</p>}
        {children}
      </div>
      {footer && <p className="mt-6 text-[13px] text-muted">{footer}</p>}
    </main>
  );
}
