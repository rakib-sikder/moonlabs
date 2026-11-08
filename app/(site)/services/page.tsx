import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { serviceCategories, servicesIn, type Service } from "@/lib/site";
import { serviceDetails } from "@/lib/content/service-details";
import { MiniOrbit } from "@/components/ui/MiniOrbit";
import { Reveal } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Automation and AI first — plus websites, mobile apps, web apps, databases, cloud, UI/UX design, SEO and marketing from the same team.",
};

function ServiceCard({ service, compact = false }: { service: Service; compact?: boolean }) {
  const detail = serviceDetails[service.slug];
  const shown = compact ? 3 : 4;
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm transition-colors hover:border-accent/40"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: `linear-gradient(to right, transparent, ${service.color}, transparent)` }}
      />
      <div className="flex items-center gap-4">
        <MiniOrbit color={service.color} size={40} />
        <h3 className="text-lg font-medium">{service.name}</h3>
      </div>
      <p className="mt-3 text-sm text-muted leading-relaxed">{service.short}</p>
      <ul className="mt-5 flex-1 space-y-2 text-sm text-muted">
        {service.items.slice(0, shown).map((item) => (
          <li key={item} className="flex gap-3">
            <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full" style={{ background: service.color }} />
            {item}
          </li>
        ))}
        {service.items.length > shown && <li className="pl-4 text-xs">+{service.items.length - shown} more</li>}
      </ul>
      <div className="mt-6 flex items-center justify-between gap-3 border-t border-border pt-4 text-xs text-muted">
        <span>{detail.setup}</span>
        <span className="shrink-0 text-accent">
          Details
          <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
        </span>
      </div>
    </Link>
  );
}

export default function ServicesPage() {
  const [core, ...others] = serviceCategories;
  const total = serviceCategories.reduce((n, c) => n + servicesIn(c.id).length, 0);

  return (
    <>
      <PageHeader
        eyebrow={`Services · ${total} across ${serviceCategories.length} sectors`}
        title="Automation first. Everything around it, too."
        intro="Automation is what we do best — and the website, app, data and marketing it connects to can come from the same team, built to work together from day one."
      />

      {/* Sector jump links */}
      <nav aria-label="Service sectors" className="sticky top-16 z-30 mb-14 border-y border-border bg-background/80 backdrop-blur-md">
        <ul className="mx-auto flex max-w-6xl gap-2 overflow-x-auto px-6 py-3 text-sm [scrollbar-width:none]">
          {serviceCategories.map((c) => (
            <li key={c.id} className="shrink-0">
              <a
                href={`#${c.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3.5 py-1.5 text-muted transition-colors hover:border-muted hover:text-foreground"
              >
                <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
                {c.name}
                {c.core && <span className="font-mono text-[10px] uppercase tracking-widest text-moon">Core</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Core: automation */}
      <section id={core.id} className="mx-auto max-w-6xl scroll-mt-36 px-6 pb-24">
        <Reveal>
          <div className="relative mb-10 overflow-hidden rounded-3xl border border-accent/30 bg-surface/80 p-8 backdrop-blur-sm sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full blur-3xl"
              style={{ background: core.color, opacity: 0.18 }}
            />
            <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  Our core focus
                </span>
                <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">{core.name}</h2>
                <p className="mt-3 text-lg text-muted leading-relaxed">{core.short}</p>
              </div>
              <p className="font-mono text-sm text-moon md:text-right">
                {servicesIn(core.id).length} areas
                <br />
                <span className="text-muted">most of our work</span>
              </p>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicesIn(core.id).map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 0.06} className="h-full">
              <ServiceCard service={s} compact />
            </Reveal>
          ))}
        </div>
      </section>

      {/* The other sectors */}
      {others.map((c, ci) => {
        const list = servicesIn(c.id);
        return (
          <section key={c.id} id={c.id} className="mx-auto max-w-6xl scroll-mt-36 px-6 pb-24">
            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)]">
              <Reveal>
                <div className="lg:sticky lg:top-36">
                  <span className="font-mono text-xs text-moon">0{ci + 2}</span>
                  <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{c.name}</h2>
                  <p className="mt-3 text-muted leading-relaxed">{c.short}</p>
                  <div aria-hidden className="mt-6 h-px w-24" style={{ background: `linear-gradient(to right, ${c.color}, transparent)` }} />
                </div>
              </Reveal>
              <div className={`grid gap-5 ${list.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
                {list.map((s, i) => (
                  <Reveal key={s.slug} delay={i * 0.06} className="h-full">
                    <ServiceCard service={s} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <CtaBanner />
    </>
  );
}
