import Link from "next/link";
import { Reveal, SectionHeading } from "./ui/Section";
import { MiniOrbit } from "./ui/MiniOrbit";
import { caseStudies } from "@/lib/content/company";
import { industryDetails } from "@/lib/content/industries";

/** Home: grid of industries linking to their pages. */
export function IndustriesStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow="Industries" title="Built for how your industry works." highlight={["industry"]} />
        <Link href="/industries" className="mb-12 shrink-0 text-sm text-muted transition-colors hover:text-foreground">
          All industries →
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {industryDetails.map((ind, i) => (
          <Reveal key={ind.slug} delay={(i % 4) * 0.05} y={12}>
            <Link
              href={`/industries/${ind.slug}`}
              className="group flex h-full flex-col justify-between gap-6 rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <span className="font-mono text-xs text-moon">{String(i + 1).padStart(2, "0")}</span>
              <span className="flex items-center justify-between gap-2 font-medium">
                {ind.name}
                <span className="text-accent opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Home: the three case studies as compact cards. */
export function WorkPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-24">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading
          eyebrow="Work"
          title="Systems we built — and still run."
          intro="We automate our own business first. These run in production every day."
        />
        <Link href="/work" className="mb-12 shrink-0 text-sm text-muted transition-colors hover:text-foreground">
          All case studies →
        </Link>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {caseStudies.map((c, i) => (
          <Reveal key={c.slug} delay={i * 0.08}>
            <Link
              href={`/work/${c.slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface/80 p-7 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <MiniOrbit color={c.color} size={48} speed={10 + i * 3} />
              <p className="mt-6 font-mono text-[11px] uppercase tracking-widest text-muted">{c.kind}</p>
              <h3 className="mt-2 text-xl font-medium">{c.name}</h3>
              <p className="mt-2 flex-1 text-sm text-muted leading-relaxed">{c.summary}</p>
              <span className="mt-6 text-sm text-accent">
                Read case study <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
