import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { pictureFor } from "@/components/ui/Diorama";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";
import { CtaBanner } from "@/components/CtaBanner";
import { Check, Chip, Reveal, SectionHeading } from "@/components/ui/Section";
import { caseStudies } from "@/lib/content/company";

export const dynamicParams = false;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = caseStudies.find((x) => x.slug === slug);
  if (!c) return {};
  return pageMeta(`/work/${c.slug}`, `${c.name} case study`, c.summary, pictureFor(`work-${c.slug}`));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = caseStudies.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const c = caseStudies[index];
  const next = caseStudies[(index + 1) % caseStudies.length];

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Case studies", path: "/work" },
          { name: c.name, path: `/work/${c.slug}` },
        ])}
      />
      <PageHeader eyebrow={`Case study · ${c.kind}`} title={c.name} intro={c.summary} accentColor={c.color} image={pictureFor(`work-${c.slug}`)} />

      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
        <Reveal>
          <div className="h-full rounded-2xl border border-border bg-surface/80 p-8 backdrop-blur-sm">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-moon">The problem</p>
            <p className="text-lg leading-relaxed">{c.problem}</p>
          </div>
        </Reveal>
        <Reveal delay={0.08}>
          <div className="h-full rounded-2xl border border-border bg-surface/80 p-8 backdrop-blur-sm">
            <p className="mb-4 font-mono text-xs uppercase tracking-widest text-moon">What we built</p>
            <ol className="space-y-4">
              {c.solution.map((s, i) => (
                <li key={s} className="flex gap-4">
                  <span className="font-mono text-xs text-muted mt-1">{String(i + 1).padStart(2, "0")}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="Outcomes" title="What changed." />
        <div className="grid gap-5 md:grid-cols-3">
          {c.outcomes.map((o, i) => (
            <Reveal key={o} delay={i * 0.08}>
              <div className="flex h-full gap-3 rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm">
                <Check className="mt-1" />
                <p>{o}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap items-center gap-2">
          <span className="mr-2 text-xs uppercase tracking-widest text-muted">Stack</span>
          {c.stack.map((t) => (
            <Chip key={t} color={c.color}>
              {t}
            </Chip>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Link
          href={`/work/${next.slug}`}
          className="group flex items-center justify-between rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-sm transition-colors hover:border-accent/40"
        >
          <div>
            <p className="text-xs uppercase tracking-widest text-muted mb-1">Next case study</p>
            <p className="text-2xl font-medium">{next.name}</p>
          </div>
          <span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>

      <CtaBanner title="We can build one for you." />
    </>
  );
}
