import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Chip, Reveal } from "@/components/ui/Section";
import { MiniOrbit } from "@/components/ui/MiniOrbit";
import { caseStudies } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "Case studies",
  description: "Automation systems we have built and run, including lead generation, inbox automation and a multi-profile browser tool.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Case studies"
        title="Systems we built and still run."
        intro="We automate our own business first. These are systems we designed and built, and we still use them every day."
      />
      <section className="mx-auto max-w-6xl px-6 pb-28 space-y-6">
        {caseStudies.map((c, i) => (
          <Reveal key={c.slug} delay={0.05 * i}>
            <Link
              href={`/work/${c.slug}`}
              className="group grid gap-8 rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-sm transition-colors hover:border-accent/40 md:grid-cols-[1fr_1.3fr] sm:p-10"
            >
              <div className="flex flex-col justify-between gap-8">
                <div>
                  <div className="flex items-center gap-4">
                    <MiniOrbit color={c.color} size={48} />
                    <span className="font-mono text-xs uppercase tracking-widest text-muted">{c.kind}</span>
                  </div>
                  <h2 className="mt-6 text-3xl font-semibold tracking-tight">{c.name}</h2>
                  <p className="mt-3 text-muted leading-relaxed">{c.summary}</p>
                </div>
                <span className="text-sm text-accent">
                  Read the case study <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
              <div className="rounded-2xl border border-border bg-background/40 p-6">
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-moon">Outcomes</p>
                <ul className="space-y-3">
                  {c.outcomes.map((o) => (
                    <li key={o} className="flex gap-3 text-sm">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: c.color }} />
                      {o}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                  {c.stack.map((t) => (
                    <Chip key={t}>{t}</Chip>
                  ))}
                </div>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
      <CtaBanner title="Let's talk about yours." />
    </>
  );
}
