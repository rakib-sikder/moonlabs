import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact — book a free audit",
  description: "Tell us what eats your team's week. We reply within one working day with times for a free 30-minute automation audit.",
};

const next = [
  { t: "We read it", d: "A real person reads your message and prepares questions — usually the same day." },
  { t: "30-minute audit", d: "A video call to walk through a normal week and list what can be automated." },
  { t: "Your plan", d: "Within 3 days: a written plan with a fixed price. No obligation." },
];

export default function ContactPage() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK;
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Book a free automation audit."
        intro="Tell us what eats your team's week. We reply within one working day."
      />
      <section className="mx-auto max-w-6xl px-6 pb-28 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <Reveal>
          <ContactForm fallbackEmail={site.email || undefined} />
        </Reveal>
        <Reveal delay={0.1}>
          <aside className="space-y-6">
            <div className="rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-sm">
              <p className="mb-6 font-mono text-[11px] uppercase tracking-widest text-moon">What happens next</p>
              <ol className="space-y-6">
                {next.map((n, i) => (
                  <li key={n.t} className="flex gap-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border font-mono text-xs text-moon">
                      {i + 1}
                    </span>
                    <div>
                      <p className="font-medium">{n.t}</p>
                      <p className="text-sm text-muted">{n.d}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            {calLink && (
              <a
                href={calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-sm transition-colors hover:border-accent/40"
              >
                <div>
                  <p className="font-medium">Prefer to pick a time?</p>
                  <p className="text-sm text-muted">Book the audit straight into our calendar.</p>
                </div>
                <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
              </a>
            )}
            {site.email && (
              <div className="rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-sm">
                <p className="text-sm text-muted">Or email us directly</p>
                <a href={`mailto:${site.email}`} className="mt-1 block font-medium hover:text-moon">
                  {site.email}
                </a>
              </div>
            )}
            <p className="px-2 text-xs text-muted leading-relaxed">
              We only use your details to reply to you. See our{" "}
              <Link href="/security" className="underline underline-offset-4">
                security &amp; privacy approach
              </Link>
              .
            </p>
          </aside>
        </Reveal>
      </section>
    </>
  );
}
