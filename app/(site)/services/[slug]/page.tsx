import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { WorkflowPipeline } from "@/components/ui/WorkflowPipeline";
import { Check, Chip, Reveal, SectionHeading } from "@/components/ui/Section";
import { IconTile } from "@/components/ui/IconTile";
import { categoryOf, services, serviceTitle } from "@/lib/site";
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
    title: serviceTitle(service),
    description: `${service.short} ${service.items.slice(0, 3).join(", ")}.`,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = services.findIndex((s) => s.slug === slug);
  if (index === -1) notFound();
  const service = services[index];
  const detail = serviceDetails[slug];
  const category = categoryOf(service);
  const isAutomation = category.id === "automation";
  // "Next" stays inside the same sector so the reader keeps browsing related work.
  const siblings = services.filter((s) => s.category === service.category);
  const position = siblings.indexOf(service);
  const next = siblings[(position + 1) % siblings.length];
  const relatedIndustries = industryDetails.filter((i) => i.services.includes(slug));

  return (
    <>
      <PageHeader
        eyebrow={`${category.name} · ${isAutomation ? "Live in" : "Timeline"} ${detail.setup}`}
        title={serviceTitle(service)}
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
          <SectionHeading
            eyebrow={category.itemsLabel}
            title={isAutomation ? `${service.items.length} things that can run on their own.` : `${service.items.length} ways we can help.`}
          />
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
          <WorkflowPipeline {...detail.workflow} color={service.color} project={!isAutomation} />
        </div>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="rounded-2xl border border-border bg-surface/80 p-8 backdrop-blur-sm sm:p-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-5">
                <IconTile slug={service.slug} size={52} />
                <div>
                  <p className="text-xs uppercase tracking-widest text-moon mb-1">{isAutomation ? "Tools we connect" : "Tools we use"}</p>
                  <p className="text-muted text-sm">
                    {isAutomation
                      ? "Plus almost anything with an API — and your existing spreadsheets."
                      : "And everything we build can hook into your automations."}
                  </p>
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
            <IconTile slug={next.slug} size={44} />
            <div>
              <p className="text-xs uppercase tracking-widest text-muted mb-1">Next in {category.name}</p>
              <p className="text-2xl font-medium">{next.name}</p>
            </div>
          </div>
          <span className="text-2xl text-accent transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </section>

      {isAutomation ? (
        <CtaBanner title={`Put ${service.name.toLowerCase()} on autopilot.`} />
      ) : (
        <CtaBanner
          title={`Let's talk about your ${service.name.toLowerCase()} project.`}
          body="Book a free 30-minute call. We'll scope it with you and send a fixed quote — no obligation."
        />
      )}
    </>
  );
}
