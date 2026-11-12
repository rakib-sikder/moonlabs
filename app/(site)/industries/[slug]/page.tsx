import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { pictureFor } from "@/components/ui/Diorama";
import { CtaBanner } from "@/components/CtaBanner";
import { Reveal, SectionHeading } from "@/components/ui/Section";
import { IconTile } from "@/components/ui/IconTile";
import { industryDetails } from "@/lib/content/industries";
import { services } from "@/lib/site";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";
import { caseStudies } from "@/lib/content/company";
import { WorkflowPipeline } from "@/components/ui/WorkflowPipeline";

export const dynamicParams = false;

export function generateStaticParams() {
  return industryDetails.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryDetails.find((i) => i.slug === slug);
  if (!ind) return {};
  return pageMeta(`/industries/${ind.slug}`, `Automation for ${ind.name.toLowerCase()}`, ind.intro, pictureFor(`industry-${ind.slug}`));
}

export default async function IndustryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ind = industryDetails.find((i) => i.slug === slug);
  if (!ind) notFound();
  const study = caseStudies.find((c) => c.slug === ind.caseStudy);
  const related = ind.services.map((s) => services.find((x) => x.slug === s)!).filter(Boolean);

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Solutions", path: "/industries" },
          { name: ind.name, path: `/industries/${ind.slug}` },
        ])}
      />
      <PageHeader eyebrow={`Solutions · ${ind.name}`} title={ind.headline} intro={ind.intro} image={pictureFor(`industry-${ind.slug}`)} />

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
        <SectionHeading eyebrow="What we automate" title="Four automations we usually start with." />
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

      <section className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 lg:grid-cols-[1fr_1.2fr] lg:items-start">
        <div>
          <SectionHeading
            eyebrow="A typical first project"
            title="One workflow from start to finish."
            intro="A sensible place to start. It affects revenue directly and usually goes live in a couple of weeks."
          />
          {study && (
            <Link
              href={`/work/${study.slug}`}
              className="group block rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <p className="font-mono text-xs uppercase tracking-widest text-muted">Related case study</p>
              <p className="mt-2 font-medium">{study.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">{study.summary}</p>
              <span className="mt-3 inline-block text-sm text-accent">
                Read it <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          )}
        </div>
        <WorkflowPipeline {...ind.workflow} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <SectionHeading eyebrow="Related services" title="The services behind it." />
        <div className="grid gap-4 md:grid-cols-2">
          {related.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <IconTile slug={s.slug} size={40} />
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
