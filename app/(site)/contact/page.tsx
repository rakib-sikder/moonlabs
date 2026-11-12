import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { ContactForm } from "@/components/ContactForm";
import { Reveal } from "@/components/ui/Section";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMeta(
  "/contact",
  "Contact and free audit",
  "Tell us which tasks take up your team's week. We reply within one working day with times for a free 30-minute automation audit.", "contact-desk",
);

const next = [
  { t: "We read it", d: "One of us reads your message and prepares a few questions, usually the same day." },
  { t: "30-minute audit", d: "A video call to walk through a normal week and list what can be automated." },
  { t: "Your plan", d: "Within 3 days you get a written plan with a fixed price. You're under no obligation." },
];

export default function ContactPage() {
  const calLink = process.env.NEXT_PUBLIC_CAL_LINK || site.calLink;
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Book a free automation audit."
        image="contact-desk"
        intro="Tell us which tasks take up your team's week. We reply within one working day."
      />
      <section className="mx-auto max-w-6xl px-6 pb-28 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-start">
        <Reveal>
          <div className="space-y-6">
          <ContactForm fallbackEmail={site.email || undefined} />
          {calLink && (
            <a
              href={calLink}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-between rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-sm transition-colors hover:border-accent/40"
            >
              <div>
                <p className="font-medium">Prefer to skip the form? Pick a time yourself</p>
                <p className="text-sm text-muted">Book the free 30-minute audit straight into our calendar.</p>
              </div>
              <span className="text-accent transition-transform group-hover:translate-x-1">→</span>
            </a>
          )}
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <aside className="space-y-6">
            <address className="not-italic rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-sm">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-moon">Office</p>
              <p className="font-medium">{site.name}</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {site.address.street}
                <br />
                {site.address.locality}, {site.address.country}
              </p>
              {site.email && (
                <a href={`mailto:${site.email}`} className="mt-3 inline-block text-sm text-accent hover:underline">
                  {site.email}
                </a>
              )}
              <p className="mt-2 text-sm">
                <a href={`https://wa.me/${site.phone.e164}`} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  WhatsApp
                </a>
                <span className="text-muted"> or call </span>
                <a href={`tel:+${site.phone.e164}`} className="text-accent hover:underline">
                  {site.phone.display}
                </a>
              </p>
              <p className="mt-3 text-sm text-muted">We work with clients online across Bangladesh and the US.</p>
            </address>
            <div className="rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-sm">
              <p className="mb-6 font-mono text-xs uppercase tracking-widest text-moon">What happens next</p>
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
              <Link href="/sample-audit" className="group mt-6 inline-flex items-center gap-1 text-sm text-accent">
                See a sample report <span className="transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
            <p className="px-2 text-xs text-muted leading-relaxed">
              We only use your details to reply to you. See our{" "}
              <Link href="/security" className="underline underline-offset-4 transition-colors hover:text-accent">
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
