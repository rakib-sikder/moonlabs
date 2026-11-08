import { processStages } from "@/lib/content/company";
import { SectionHead } from "./SectionHead";

/** Home: the five stages as one compact row — the detail lives on /how-it-works. */
export function ProcessStrip() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead
        eyebrow="How we work"
        title="A fixed price before we start. Working software within weeks."
        link={{ href: "/how-it-works", label: "The full process" }}
      />
      <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
        {processStages.map((s, i) => (
          <li key={s.n} className={`bg-surface p-6 ${i === processStages.length - 1 ? "sm:col-span-2 lg:col-span-1" : ""}`}>
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-moon">{s.n}</span>
              <span className="font-mono text-[11px] text-muted">{s.when}</span>
            </div>
            <h3 className="mt-4 font-medium">{s.title}</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
