import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Reveal, SectionHeading } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Security & privacy",
  description: "How Moonlabs handles access, data and AI safely: least-privilege access, your own accounts, human approval and full logs.",
};

const practices = [
  { title: "Your accounts, not ours", body: "Automations run in tools you own. We work through invited access you can revoke at any time." },
  { title: "Least privilege", body: "We ask only for the permissions a workflow needs — read-only wherever possible." },
  { title: "No silent data hoarding", body: "Data passes through workflows to where it belongs. We don't copy your customer data to our own systems." },
  { title: "Secrets kept secret", body: "API keys live in the platform's secure credential store, never in spreadsheets, chats or code repositories." },
  { title: "Human approval for risk", body: "Customer-facing messages, payments and deletions wait for a person until you decide otherwise." },
  { title: "Everything logged", body: "Each run records what happened and why, so any action can be traced and reversed." },
];

const ai = [
  "AI only answers from content you approve, and says when it doesn't know.",
  "We use AI providers' business APIs, which do not train models on your data by default.",
  "Sensitive fields can be masked before any text is sent to an AI model.",
  "We never use AI to get around security checks such as captchas or account verifications.",
];

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Security & privacy"
        title="Automation you can trust with real data."
        intro="Automation touches your inbox, your CRM and your customers. Here is exactly how we keep that safe."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {practices.map((p, i) => (
            <Reveal key={p.title} delay={(i % 3) * 0.06}>
              <div className="h-full rounded-2xl border border-border bg-surface/80 p-7 backdrop-blur-sm">
                <span className="font-mono text-xs text-moon">0{i + 1}</span>
                <h2 className="mt-4 mb-2 text-lg font-medium">{p.title}</h2>
                <p className="text-sm text-muted leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 pb-24 grid gap-10 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow="AI safety" title="How we use AI responsibly." />
          <ul className="space-y-3">
            {ai.map((a) => (
              <li key={a} className="flex gap-3 rounded-xl border border-border bg-surface/80 px-5 py-4 text-sm backdrop-blur-sm">
                <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {a}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <SectionHeading eyebrow="Your website data" title="This site, too." />
          <div className="space-y-4 text-muted leading-relaxed">
            <p>
              When you contact us, we receive your name, email, company and message — only to reply to you. We don&apos;t sell or share
              it, and we delete enquiries that don&apos;t become projects within 12 months.
            </p>
            <p>This website uses no advertising trackers. Ask us any time to see or delete what we hold about you.</p>
            <p>Need an NDA or a data processing agreement before an audit? We&apos;re happy to sign one.</p>
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
