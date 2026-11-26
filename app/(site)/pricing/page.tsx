import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { Check, Reveal, SectionHeading } from "@/components/ui/Section";
import { OfferBanner } from "@/components/OfferBanner";
import { comparison, faqs, planMatrix, plans } from "@/lib/content/company";
import { Check as CheckIcon, Minus } from "lucide-react";

export const metadata: Metadata = pageMeta(
  "/pricing",
  "Pricing: AI Automation Plans for Small Business",
  "Simple pricing for AI automation and web projects: a free audit, then a fixed-price project or a monthly plan. One automation from $349, no hourly billing.", "page-pricing",
);

const engagements: { kicker: string; name: string; body: string; rows: [string, string][]; cta: string; href: string }[] = [
  {
    kicker: "Monthly retainer",
    name: "Automation plans",
    body: "New automations and care for the ones you run, on a monthly plan. See the plans above.",
    rows: [
      ["Half Moon: care for up to 5", "$199 / month"],
      ["Full Moon: 1 new automation a month", "$399 / month"],
      ["Crescent: one automation, one-time", "from $349"],
    ],
    cta: "Compare plans",
    href: "#plans",
  },
  {
    kicker: "Fixed price",
    name: "Projects",
    body: "Websites, apps, chatbots and CRM work. A written scope and one fixed price, paid 30% to start, 40% at the halfway demo and 30% at launch, with 60 days of fixes.",
    rows: [] as [string, string][], // filled from projectPrices below
    cta: "Get a quote",
    href: "/contact",
  },
  {
    kicker: "Time and materials",
    name: "Hourly",
    body: "For open-ended work, small changes outside a plan, or extra hands on your existing project. Billed weekly, in one-hour blocks, with a timesheet.",
    rows: [
      ["Developer or designer", "$35 / hour"],
      ["Minimum", "1 hour"],
      ["Billing", "Weekly, with a timesheet"],
    ],
    cta: "Book hours",
    href: "/contact",
  },
  {
    kicker: "Dedicated",
    name: "Developer or team",
    body: "Developers who work only on your product, in your tools, with a weekly report. Monthly, with 30 days' notice.",
    rows: [
      ["Part-time developer (80 h / month)", "$2,400 / month"],
      ["Full-time developer (160 h / month)", "$4,200 / month"],
      ["Team: developers, designer, project manager", "Custom quote"],
    ],
    cta: "Talk to us",
    href: "/contact",
  },
];

const projectPrices: [string, string][] = [
  ["Website", "$900"],
  ["Online shop", "$1,500"],
  ["AI chatbot", "$800"],
  ["CRM setup", "$700"],
  ["Web or booking app", "$7,000"],
  ["Mobile app", "$18,000"],
];

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

engagements[1].rows = projectPrices.map(([what, from]) => [what, `from ${from}`]);

export default function PricingPage() {
  const pricingFaq = faqs.find((g) => g.group === "Pricing & timeline")!.items;

  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Plans and prices" image="page-pricing"
        intro="Every project starts with a free audit. After that you choose a fixed-price project or a monthly plan, and you see the price before any work starts."
      />

      <section className="mx-auto max-w-6xl px-6 pb-10">
        <OfferBanner />
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

      <section id="plans" className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-24 grid gap-8 lg:grid-cols-3 lg:gap-5">
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
                href={`/signup?next=${encodeURIComponent(`/dashboard/billing?plan=${p.key}`)}`}
                className={`mt-10 rounded-full px-6 py-3 text-center text-sm font-medium transition-opacity hover:opacity-90 ${
                  p.featured ? "bg-accent text-accent-ink" : "border border-border hover:border-muted"
                }`}
              >
                {p.cta}
              </Link>
              <Link href="/contact" className="mt-3 text-center text-xs text-muted hover:text-foreground">
                Not sure yet? Book a free audit first
              </Link>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="Compare plans" title="What each plan includes." />
        <p className="mb-2 text-xs text-muted sm:hidden">Swipe sideways to see every column →</p>
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
        <SectionHeading
          eyebrow="Engagement models"
          title="Four ways to work with us."
          intro="Pick the one that fits the work. Plans for automations, fixed prices for projects, hours for open-ended work, or a developer who works only on your product."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {engagements.map((e, i) => (
            <Reveal key={e.name} delay={(i % 2) * 0.08}>
              <div className="flex h-full flex-col rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-sm">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-moon">{e.kicker}</p>
                <h3 className="mt-3 font-display text-2xl font-bold tracking-[-0.02em]">{e.name}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{e.body}</p>
                <ul className="mt-5 flex-1 space-y-2 text-sm">
                  {e.rows.map(([what, price]) => (
                    <li key={what} className="flex justify-between gap-4 border-b border-border/60 pb-2">
                      <span className="text-muted">{what}</span>
                      <span className="whitespace-nowrap font-medium">{price}</span>
                    </li>
                  ))}
                </ul>
                <Link href={e.href} className="mt-6 self-start rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted">
                  {e.cta} →
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-6 text-xs text-muted">
          Tool subscriptions, hosting, SMS and AI usage are paid by you directly, at the provider&apos;s price. Prices in USD.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="Compare" title="Moonlab vs. hiring vs. freelancers." />
        <Reveal>
          <p className="mb-2 text-xs text-muted sm:hidden">Swipe sideways to see every column →</p>
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
