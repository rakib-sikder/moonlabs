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
    <div className="mb-14 flex flex-col gap-6 sm:mb-16 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-moon">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {eyebrow}
        </p>
        <h2 className="font-display text-balance text-[2.1rem] font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-[3.4rem]">{title}</h2>
        {intro && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-[1.2rem]">{intro}</p>}
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
