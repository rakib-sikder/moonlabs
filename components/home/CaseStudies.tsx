import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "@/lib/content/company";
import { SectionHead } from "./SectionHead";

/** Home: case studies as rows — problem, what we built, stack, results. */
export function CaseStudies() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead
        eyebrow="Case studies"
        title="Systems we built and still run."
        intro="We automate our own operations first, so the methods we offer clients are already running in production."
        link={{ href: "/work", label: "All case studies" }}
      />
      <div className="overflow-hidden rounded-2xl border border-border bg-surface/70 backdrop-blur-sm">
        {caseStudies.map((c, i) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            className={`group grid gap-6 p-6 transition-colors hover:bg-surface-2/50 sm:p-8 lg:grid-cols-[1fr_1.4fr_1fr] ${
              i > 0 ? "border-t border-border" : ""
            }`}
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-muted">{c.kind}</p>
              <h3 className="mt-2 text-lg font-semibold">{c.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{c.problem}</p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium text-foreground">What it does</p>
              <ul className="space-y-1.5 text-sm text-muted">
                {c.solution.slice(0, 3).map((s) => (
                  <li key={s} className="flex gap-2">
                    <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-moon" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-medium text-foreground">Result</p>
                <p className="text-sm leading-relaxed text-muted">{c.outcomes[0]}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {c.stack.slice(0, 4).map((t) => (
                    <span key={t} className="rounded border border-border px-1.5 py-0.5 font-mono text-xs text-muted">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-sm text-accent">
                Read case study <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
