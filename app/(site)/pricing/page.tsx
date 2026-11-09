import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { Check, Reveal, SectionHeading } from "@/components/ui/Section";
import { comparison, faqs, planMatrix, plans } from "@/lib/content/company";
import { Check as CheckIcon, Minus } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "A free audit, then a fixed-price project or a monthly plan. We don't bill by the hour.",
};

const phases = ["Crescent", "Half Moon", "Full Moon"];

function MoonPhase({ phase }: { phase: number }) {
  // 0 = crescent, 1 = half, 2 = full — a lit disc with a shadow disc offset over it.
  const offset = [9, 12, 40][phase];
  return (
    <svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden>
      <defs>
        <mask id={`phase-${phase}`}>
          <rect width="24" height="24" fill="white" />
          {phase < 2 && (phase === 1 ? <rect x="12" y="0" width="12" height="24" fill="black" /> : <circle cx={12 + offset} cy="12" r="10" fill="black" />)}
        </mask>
      </defs>
      <circle cx="12" cy="12" r="10" fill="none" stroke="var(--border)" />
      <circle cx="12" cy="12" r="10" fill="var(--moon)" mask={`url(#phase-${phase})`} />
    </svg>
  );
}

export default function PricingPage() {
  const pricingFaq = faqs.find((g) => g.group === "Pricing & timeline")!.items;

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Plans and prices"
        intro="Every project starts with a free audit. After that you choose a fixed-price project or a monthly plan, and you see the price before any work starts."
      />

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-border bg-surface/60 p-6 backdrop-blur-sm sm:flex-row sm:items-center">
            <div>
              <p className="font-medium">Free automation audit</p>
              <p className="text-sm text-muted">30 minutes · a list of what to automate · no obligation</p>
            </div>
            <Link href="/contact" className="rounded-full border border-border px-5 py-2 text-sm transition-colors hover:border-muted">
              Book it, free
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-5 lg:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.name} delay={i * 0.08}>
            <div
              className={`relative flex h-full flex-col rounded-3xl border p-8 backdrop-blur-sm ${
                p.featured ? "border-accent/60 bg-surface-2/90" : "border-border bg-surface/80"
              }`}
              style={p.featured ? { boxShadow: "0 0 80px -20px var(--accent)" } : undefined}
            >
              {p.featured && (
                <span className="absolute -top-3 left-8 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-ink">
                  Recommended
                </span>
              )}
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">{p.name}</h2>
                <MoonPhase phase={phases.indexOf(p.name)} />
              </div>
              <p className="mt-1 text-sm text-muted">{p.tagline}</p>
              <p className="mt-8">
                <span className="text-5xl font-semibold tracking-tight">{p.price}</span>
                <span className="ml-2 text-sm text-muted">{p.unit}</span>
              </p>
              <ul className="mt-8 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <Check className="mt-0.5" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href="/contact"
                className={`mt-10 rounded-full px-6 py-3 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
                  p.featured ? "bg-accent text-accent-ink" : "border border-border hover:border-muted"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="Compare plans" title="What each plan includes." />
        <div className="overflow-x-auto rounded-2xl border border-border bg-surface/80 backdrop-blur-sm">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="p-4 font-normal text-muted sm:px-6" />
                {plans.map((p) => (
                  <th key={p.name} className="p-4 sm:px-6">
                    <span className={`block font-medium ${p.featured ? "text-accent" : ""}`}>{p.name}</span>
                    <span className="block font-mono text-xs font-normal text-muted">
                      {p.price} {p.unit.replace(", from", "")}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            {planMatrix.map((g) => (
              <tbody key={g.group}>
                <tr className="border-b border-border bg-surface-2/50">
                  <th colSpan={4} className="px-4 py-2 font-mono text-xs font-normal uppercase tracking-wider text-moon sm:px-6">
                    {g.group}
                  </th>
                </tr>
                {g.rows.map((r) => (
                  <tr key={r.label} className="border-b border-border last:border-0">
                    <td className="p-4 text-muted sm:px-6">{r.label}</td>
                    {r.values.map((v, i) => (
                      <td key={i} className="p-4 sm:px-6">
                        {v === true ? (
                          <CheckIcon aria-label="Included" className="h-4 w-4 text-accent" />
                        ) : v === false ? (
                          <Minus aria-label="Not included" className="h-4 w-4 text-muted/50" />
                        ) : (
                          v
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-2xl border border-border bg-surface/80 p-8 backdrop-blur-sm md:flex-row md:items-center md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-widest text-moon mb-2">Websites, apps, design &amp; marketing</p>
              <p className="text-lg font-medium">Quoted per project, as a fixed price.</p>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                Development, data, design and growth work varies too much for one price list. After a short call you get a written
                scope and a fixed quote. It can be combined with any automation plan above.
              </p>
            </div>
            <Link
              href="/contact"
              className="shrink-0 rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted"
            >
              Get a quote →
            </Link>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="Compare" title="Moonlab vs. hiring vs. freelancers." />
        <Reveal>
          <div className="overflow-x-auto rounded-2xl border border-border bg-surface/80 backdrop-blur-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-5 font-normal text-muted" />
                  <th className="p-5 font-medium text-moon">Moonlab</th>
                  <th className="p-5 font-medium">In-house hire</th>
                  <th className="p-5 font-medium">Freelancer</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map((r) => (
                  <tr key={r.row} className="border-b border-border last:border-0">
                    <td className="p-5 text-muted">{r.row}</td>
                    <td className="p-5">{r.values[0]}</td>
                    <td className="p-5 text-muted">{r.values[1]}</td>
                    <td className="p-5 text-muted">{r.values[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-12">
        <SectionHeading eyebrow="Pricing questions" title="Good to know." center />
        <Accordion items={pricingFaq} />
        <p className="mt-6 text-center text-sm text-muted">
          Want to estimate your return first? Try the{" "}
          <Link href="/roi-calculator" className="text-accent hover:underline underline-offset-4">
            ROI calculator
          </Link>
          .
        </p>
      </section>

      <CtaBanner />
    </>
  );
}
