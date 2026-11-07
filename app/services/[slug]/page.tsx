import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { WorkflowPipeline } from "@/components/ui/WorkflowPipeline";
import { Check, Chip, Reveal, SectionHeading } from "@/components/ui/Section";
import { MiniOrbit } from "@/components/ui/MiniOrbit";
import { services } from "@/lib/site";
import { serviceDetails } from "@/lib/content/service-details";
import { industryDetails } from "@/lib/content/industries";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: `${service.name} automation`,
    description: `${service.short} ${service.items.slice(0, 3).join(", ")}.`,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const service = services[index];
  const detail = serviceDetails[slug];
  const next = services[(index + 1) % services.length];
  const relatedIndustries = industryDetails.filter((i) => i.services.includes(slug));

  return (
    <>
      <PageHeader
        eyebrow={`Service ${String(index + 1).padStart(2, "0")} · Live in ${detail.setup}`}
        title={`${service.name} automation`}
        intro={service.short}
        accentColor={service.color}
      />

      {/* Problems */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="Sound familiar?" title="The problems we take off your plate." />
        <div className="grid gap-5 md:grid-cols-3">
          {detail.pains.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm">
                <span className="font-mono text-xs" style={{ color: service.color }}>
                  0{i + 1}
                </span>
                <h3 className="mt-4 mb-2 text-lg font-medium">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What we automate + workflow */}
      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-12 lg:grid-cols-2 lg:items-start">
        <div>
          <SectionHeading eyebrow="What we automate" title={`${service.items.length} things that can run on their own.`} />
          <ul className="space-y-3">
            {service.items.map((item, i) => (
              <Reveal key={item} delay={i * 0.04} y={10}>
                <li className="flex gap-3 rounded-xl border border-border bg-surface/80 px-4 py-3.5 backdrop-blur-sm">
                  <Check className="mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
        <div className="lg:sticky lg:top-28">
          <WorkflowPipeline {...detail.workflow} color={service.color} />
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface/80 p-8 backdrop-blur-sm sm:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <MiniOrbit color={service.color} size={56} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-moon mb-1">Tools we connect</p>
                  <p className="text-muted text-sm">Plus almost anything with an API — and your existing spreadsheets.</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 md:max-w-md md:justify-end">
                {detail.tools.map((t) => (
                  <Chip key={t}>{t}</Chip>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ + industries */}
      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <SectionHeading eyebrow="Questions" title="Before you ask." />
          <Accordion items={detail.faqs} />
        </div>
        {relatedIndustries.length > 0 && (
          <div>
            <SectionHeading eyebrow="Popular with" title="Industries." />
            <ul className="space-y-3">
              {relatedIndustries.map((ind) => (
                <li key={ind.slug}>
                  <Link
                    href={`/industries/${ind.slug}`}
                    className="group flex items-center justify-between rounded-xl border border-border bg-surface/80 px-5 py-4 backdrop-blur-sm transition-colors hover:border-accent/40"
                  >
                    {ind.name}
                    <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <Link
          href={`/services/${next.slug}`}
          className="group flex items-center justify-between rounded-2xl border border-border bg-surface/60 p-8 backdrop-blur-sm transition-colors hover:border-accent/40"
        >
          <div className="flex items-center gap-5">
            <MiniOrbit color={next.color} />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">Next service</p>
              <p className="text-2xl font-medium">{next.name}</p>
            </div>
          </div>
          <span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>

      <CtaBanner title={`Put ${service.name.toLowerCase()} on autopilot.`} />
    </>
  );
}
