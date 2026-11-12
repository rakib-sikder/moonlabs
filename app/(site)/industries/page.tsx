import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Diorama, pictureFor } from "@/components/ui/Diorama";
import { CtaBanner } from "@/components/CtaBanner";
import { Reveal } from "@/components/ui/Section";
import { industryDetails } from "@/lib/content/industries";
import { services } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "/industries",
  "Solutions by industry",
  "Automation for real estate, clinics, restaurants, e-commerce, agencies, law firms, education and logistics.", "page-industries",
);

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Solutions"
        title="Automation by industry."
        image="page-industries"
        intro="Each industry has its own repetitive work. Pick yours to see the problems we usually find and the automations we build for them."
      />
      <section className="mx-auto max-w-6xl px-6 pb-28 grid gap-5 sm:grid-cols-2">
        {industryDetails.map((ind, i) => (
          <Reveal key={ind.slug} delay={(i % 2) * 0.08}>
            <Link
              href={`/industries/${ind.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              {pictureFor(`industry-${ind.slug}`) && (
                <Diorama name={pictureFor(`industry-${ind.slug}`)!} ratio="3 / 2" decorative className="rounded-none border-0 border-b" />
              )}
              <div className="flex flex-1 flex-col p-7">
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
              </div>
            </Link>
          </Reveal>
        ))}
      </section>
      <CtaBanner title="Your industry isn't listed?" body="Leads, support, paperwork and reporting look much the same in most businesses. Book a free audit and we'll go through yours." />
    </>
  );
}
