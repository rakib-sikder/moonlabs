import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Services",
  description: "Eight areas of your business we automate — from lead generation to custom AI agents.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Eight orbits of automation, one team behind them."
        intro="Pick the area that hurts most. Most clients start with one workflow, see the hours come back, and add the next."
      />
      <section className="mx-auto max-w-6xl px-6 pb-28 grid gap-5 md:grid-cols-2">
        {services.map((s, i) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group rounded-2xl border border-border bg-surface p-8 transition-colors hover:border-accent/40"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-xl font-medium">{s.name}</h2>
              <span className="font-mono text-xs text-moon">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <p className="mt-2 text-muted">{s.short}</p>
            <ul className="mt-6 space-y-2 text-sm text-muted">
              {s.items.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-3">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-moon" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-accent">
              {s.items.length > 3 ? `+${s.items.length - 3} more · ` : ""}View details
              <span className="ml-1 inline-block transition-transform group-hover:translate-x-1">→</span>
            </p>
          </Link>
        ))}
      </section>
      <CtaBanner />
    </>
  );
}
