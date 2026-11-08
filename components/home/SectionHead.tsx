import Link from "next/link";
import { ArrowRight } from "lucide-react";

/** Compact section opener: eyebrow, title, optional intro, optional "see all" link on the right. */
export function SectionHead({
  eyebrow,
  title,
  intro,
  link,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-moon">{eyebrow}</p>
        <h2 className="text-2xl font-semibold tracking-tight sm:text-[2rem] sm:leading-tight">{title}</h2>
        {intro && <p className="mt-3 leading-relaxed text-muted">{intro}</p>}
      </div>
      {link && (
        <Link href={link.href} className="group inline-flex shrink-0 items-center gap-1 text-sm text-muted transition-colors hover:text-foreground">
          {link.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
