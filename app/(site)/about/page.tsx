import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Chip, Reveal, SectionHeading } from "@/components/ui/Section";
import Image from "next/image";
import { caseStudies } from "@/lib/content/company";
import { founders } from "@/lib/content/proof";

export const metadata: Metadata = {
  title: "About",
  description: "Moonlabs is a small automation studio that builds AI agents, workflows and integrations for growing businesses.",
};

const values = [
  { title: "Honest numbers", body: "We measure hours saved before and after. If something isn't worth automating, we say so in the audit." },
  { title: "People stay in charge", body: "Automation handles the repetitive part; anything important still gets a human yes." },
  { title: "You own everything", body: "Built in your accounts, documented, and handed over. No lock-in." },
  { title: "Built to last", body: "Monitoring, alerts and fallbacks are part of the build, not an afterthought." },
];

const stack = [
  "Python", "Node.js", "TypeScript", "Playwright", "n8n", "Make", "Zapier", "OpenAI", "Claude",
  "Supabase", "PostgreSQL", "Google Workspace", "Telegram", "Slack", "Linux servers", "Cloudflare",
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A small studio that automates the boring parts."
        intro="Moonlabs started by automating our own business — finding leads, answering them, running servers that fail over by themselves at 3am. Now we build the same kind of systems for other teams."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              Most businesses don&apos;t need more software. They need the software they already pay for to talk to each other —
              and someone to take the copy-paste out of the week.
            </p>
            <p className="text-muted">
              That&apos;s what we do. We sit with your team, find the work that repeats, and build automations that run quietly in the
              background: careful where mistakes are costly, fast where they aren&apos;t.
            </p>
            <p className="text-muted">
              The name is a reminder of the goal: work that keeps running while you sleep.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          {founders.length > 0 ? (
            <ul className="space-y-4">
              {founders.map((f) => (
                <li key={f.name} className="flex gap-4 rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-sm">
                  {f.photo && <Image src={f.photo} alt="" width={64} height={64} className="h-16 w-16 rounded-full object-cover" />}
                  <div>
                    <p className="font-medium">{f.name}</p>
                    <p className="text-sm text-moon">{f.role}</p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.bio}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm">
              <p className="border-b border-border px-6 py-3 font-mono text-[11px] uppercase tracking-widest text-muted">
                Systems we run for ourselves
              </p>
              <ul className="divide-y divide-border">
                {caseStudies.map((c) => (
                  <li key={c.slug}>
                    <Link href={`/work/${c.slug}`} className="group block px-6 py-4 transition-colors hover:bg-surface-2/50">
                      <span className="flex items-center justify-between font-medium">
                        {c.name}
                        <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
                      </span>
                      <span className="mt-1 block text-sm text-muted">{c.kind}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <SectionHeading eyebrow="What we believe" title="Four rules we don't bend." />
        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={(i % 2) * 0.08}>
              <div className="h-full rounded-2xl border border-border bg-surface/80 p-7 backdrop-blur-sm">
                <span className="font-mono text-xs text-moon">0{i + 1}</span>
                <h3 className="mt-4 mb-2 text-lg font-medium">{v.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{v.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <SectionHeading eyebrow="Toolbox" title="What we build with." intro="We pick the simplest tool that will still be reliable in a year — no-code when it fits, real code when it doesn't." />
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {stack.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
        </Reveal>
        <p className="mt-10 text-sm text-muted">
          See what we&apos;ve built on the{" "}
          <Link href="/work" className="text-accent hover:underline underline-offset-4">
            work page
          </Link>
          .
        </p>
      </section>

      <CtaBanner />
    </>
  );
}
