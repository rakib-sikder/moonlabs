import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Reveal } from "@/components/ui/Section";
import { industryDetails } from "@/lib/content/industries";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries",
  description: "Automation for real estate, clinics, restaurants, e-commerce, agencies, law firms, education and logistics.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Automation shaped around your industry."
        intro="Every business has its own busywork. Pick yours to see the problems we usually find — and the automations that fix them."
      />
      <section className="mx-auto max-w-6xl px-6 pb-28 grid gap-5 sm:grid-cols-2">
        {industryDetails.map((ind, i) => (
          <Reveal key={ind.slug} delay={(i % 2) * 0.08}>
            <Link
              href={`/industries/${ind.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface/80 p-7 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="text-xl font-medium">{ind.name}</h2>
                <span className="font-mono text-xs text-moon">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="mt-2 text-muted">{ind.headline}</p>
              <ul className="mt-5 flex-1 space-y-1.5 text-sm text-muted">
                {ind.pains.map((p) => (
                  <li key={p} className="flex gap-2.5">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-moon" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
                <div className="flex -space-x-1">
                  {ind.services.map((slug) => {
                    const s = services.find((x) => x.slug === slug);
                    return s ? (
                      <span key={slug} title={s.name} className="h-3 w-3 rounded-full ring-2 ring-surface" style={{ background: s.color }} />
                    ) : null;
                  })}
                </div>
                <span className="text-sm text-accent">
                  See automations <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
      <CtaBanner title="Don't see your industry?" body="Most of what we automate — leads, support, paperwork, reporting — exists in every business. Book a free audit and we'll map yours." />
    </>
  );
}
