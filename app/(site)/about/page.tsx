import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Chip, Reveal, SectionHeading } from "@/components/ui/Section";
import Image from "next/image";
import { caseStudies } from "@/lib/content/company";
import { founders } from "@/lib/content/proof";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About",
  description: "Moonlab is a small automation agency that builds AI agents, workflows and integrations for small and mid-sized businesses.",
};

const values = [
  { title: "Honest numbers", body: "We measure hours saved before and after. If something isn't worth automating, we say so in the audit." },
  { title: "People stay in charge", body: "Automation handles the repetitive part. Anything important still needs a person to approve it." },
  { title: "You own everything", body: "Built in your accounts, documented, and handed over. No lock-in." },
  { title: "Built to last", body: "Monitoring, alerts and fallbacks are included in every build from the start." },
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
        title="A small team that automates routine work."
        intro="Moonlab started by automating our own business: finding leads, replying to them, and running servers that switch to a backup on their own when something fails. Now we build the same kind of systems for other teams."
      />

      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <div className="space-y-5 text-lg leading-relaxed">
            <p>
              Most businesses don&apos;t need more software. They need the software they already pay for to share data, and someone
              to take the copy-paste out of the week.
            </p>
            <p className="text-muted">
              That&apos;s what we do. We sit with your team, find the work that repeats, and build automations that run in the background.
              Where a mistake would be costly, we add checks and approvals.
            </p>
            <p className="text-muted">
              The name comes from the idea of work that keeps running overnight while you sleep.
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
              <p className="border-b border-border px-6 py-3 font-mono text-xs uppercase tracking-widest text-muted">
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
        <SectionHeading eyebrow="What we believe" title="How we work with clients." />
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
        <SectionHeading eyebrow="Toolbox" title="What we build with." intro="We pick the simplest tool that will still be reliable in a year. That means no-code where it fits and custom code where it doesn't." />
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
