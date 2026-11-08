import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceCategories, servicesIn } from "@/lib/site";
import { serviceDetails } from "@/lib/content/service-details";
import { categoryIcons, serviceIcons } from "@/lib/icons";
import { SectionHead } from "./SectionHead";

/**
 * Every service on one screen, Cloudflare-directory style: automation (the core) as a
 * two-column list with timelines, the other four sectors stacked beside it.
 */
export function ServiceDirectory() {
  const [core, ...others] = serviceCategories;
  const coreServices = servicesIn(core.id);

  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead
        eyebrow="Services"
        title="Automation at the core. Everything around it, from one team."
        intro="Most clients come to us to automate something — then ask us for the website, app, dashboard or campaign it connects to."
        link={{ href: "/services", label: "All services" }}
      />

      <div className="grid overflow-hidden rounded-2xl border border-border bg-surface/70 backdrop-blur-sm lg:grid-cols-[1.5fr_1fr]">
        {/* Core: automation */}
        <div className="border-b border-border p-6 lg:border-b-0 lg:border-r sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-[11px] font-medium text-accent">
                Core focus
              </span>
              <h3 className="mt-3 text-xl font-semibold">{core.name}</h3>
              <p className="mt-1 max-w-md text-sm text-muted">{core.short}</p>
            </div>
            <Link href={`/services#${core.id}`} className="hidden shrink-0 text-sm text-accent hover:underline sm:block">
              View all
            </Link>
          </div>
          <ul className="grid gap-x-6 sm:grid-cols-2">
            {coreServices.map((s) => {
              const Icon = serviceIcons[s.slug];
              return (
                <li key={s.slug} className="border-t border-border">
                  <Link href={`/services/${s.slug}`} className="group flex gap-3 py-3.5">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent">
                      <Icon className="h-4 w-4" strokeWidth={1.6} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center justify-between gap-2 text-sm font-medium">
                        {s.name}
                        <span className="font-mono text-[11px] font-normal text-muted">{serviceDetails[s.slug].setup}</span>
                      </span>
                      <span className="mt-0.5 block text-[13px] leading-snug text-muted">{s.short}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Other sectors */}
        <div className="divide-y divide-border">
          {others.map((c) => {
            const CatIcon = categoryIcons[c.id];
            return (
              <div key={c.id} className="p-6 sm:px-8">
                <Link href={`/services#${c.id}`} className="group flex items-center justify-between gap-3">
                  <span className="flex items-center gap-2.5 text-sm font-semibold">
                    <CatIcon className="h-4 w-4 text-muted" strokeWidth={1.6} />
                    {c.name}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted transition-all group-hover:translate-x-0.5 group-hover:text-accent" />
                </Link>
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {servicesIn(c.id).map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="inline-block rounded-full border border-border px-2.5 py-1 text-[12px] text-muted transition-colors hover:border-accent/40 hover:text-foreground"
                      >
                        {s.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
