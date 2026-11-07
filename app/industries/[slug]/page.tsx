import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Reveal, SectionHeading } from "@/components/ui/Section";
import { MiniOrbit } from "@/components/ui/MiniOrbit";
import { industryDetails } from "@/lib/content/industries";
import { services } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return industryDetails.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryDetails.find((i) => i.slug === slug);
  if (!ind) return {};
  return { title: `Automation for ${ind.name.toLowerCase()}`, description: ind.intro };
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industryDetails.find((i) => i.slug === slug);
  if (!ind) notFound();
  const related = ind.services.map((s) => services.find((x) => x.slug === s)!).filter(Boolean);

  return (
    <>
      <PageHeader eyebrow={`Industries · ${ind.name}`} title={ind.headline} intro={ind.intro} />

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="What we usually find" title="Where the hours go." />
        <div className="grid gap-4 md:grid-cols-3">
          {ind.pains.map((p, i) => (
            <Reveal key={p} delay={i * 0.08}>
              <div className="flex h-full items-start gap-4 rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm">
                <span className="font-mono text-xs text-moon">0{i + 1}</span>
                <p>{p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="What we automate" title="Four automations that pay for themselves first." />
        <div className="grid gap-5 sm:grid-cols-2">
          {ind.automations.map((a, i) => (
            <Reveal key={a.title} delay={(i % 2) * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-surface/80 p-7 backdrop-blur-sm">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-surface-2 font-mono text-sm text-moon">
                  {i + 1}
                </div>
                <h3 className="mb-2 text-lg font-medium">{a.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{a.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <SectionHeading eyebrow="Related services" title="The services behind it." />
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <MiniOrbit color={s.color} size={40} />
              <div className="flex-1">
                <p className="font-medium">{s.name}</p>
                <p className="text-xs text-muted">{s.short}</p>
              </div>
              <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBanner title={`Automation for ${ind.name.toLowerCase()}, mapped in 30 minutes.`} />
    </>
  );
}
