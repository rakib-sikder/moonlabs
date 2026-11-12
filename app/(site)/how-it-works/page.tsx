import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Diorama } from "@/components/ui/Diorama";
import { CtaBanner } from "@/components/CtaBanner";
import { Check, Reveal, SectionHeading } from "@/components/ui/Section";
import { processStages } from "@/lib/content/company";

export const metadata: Metadata = pageMeta(
  "/how-it-works",
  "How it works",
  "How we go from a free 30-minute audit to automations that run on their own. Five stages with a fixed price agreed up front.", "process-path",
);

const principles = [
  { title: "Humans approve the risky parts", body: "Anything customer-facing or costly waits for your approval, until you decide it no longer needs it." },
  { title: "Built in your accounts", body: "Workflows, code and data live in tools you own. Nothing is locked inside our systems." },
  { title: "Every action is logged", body: "You can see what ran, when it ran and why, so problems are easy to trace." },
  { title: "Start with one workflow", body: "We build one workflow and check the results before suggesting the next." },
];

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From first call to running on its own."
        intro="Five stages and a fixed price agreed before we start. Simple automations can be running within a week or two."
      />

      <div className="mx-auto max-w-5xl px-6 pb-14">
        <Diorama name="process-path" eager />
      </div>

      <section className="mx-auto max-w-5xl px-6 pb-24">
        <ol className="relative space-y-6">
          <div aria-hidden className="absolute left-[27px] top-6 bottom-6 hidden w-px bg-gradient-to-b from-accent via-moon/40 to-transparent sm:block" />
          {processStages.map((s, i) => (
            <Reveal key={s.n} delay={0.05 * i}>
              <li className="relative grid gap-6 rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm sm:grid-cols-[56px_1fr] sm:p-8">
                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-border bg-background font-mono text-moon">
                  {s.n}
                </div>
                <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-2xl font-medium">{s.title}</h2>
                      <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted">{s.when}</span>
                    </div>
                    <p className="mt-3 text-muted leading-relaxed">{s.body}</p>
                    <p className="mt-4 text-sm">
                      <span className="text-moon">What we need from you: </span>
                      <span className="text-muted">{s.youGive}</span>
                    </p>
                  </div>
                  <div className="rounded-xl border border-border bg-background/40 p-5">
                    <p className="mb-3 font-mono text-xs uppercase tracking-widest text-moon">You get</p>
                    <ul className="space-y-2 text-sm">
                      {s.youGet.map((g) => (
                        <li key={g} className="flex gap-2.5">
                          <Check className="mt-0.5" />
                          {g}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="Principles" title="Rules we follow on every build." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm">
                <h3 className="mb-2 font-medium">{p.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <p className="mt-10 text-sm text-muted">
          Questions about data and access? Read our{" "}
          <Link href="/security" className="text-accent hover:underline underline-offset-4">
            security approach
          </Link>{" "}
          or the{" "}
          <Link href="/faq" className="text-accent hover:underline underline-offset-4">
            FAQ
          </Link>
          .
        </p>
      </section>

      <CtaBanner title="The first stage is free." />
    </>
  );
}
