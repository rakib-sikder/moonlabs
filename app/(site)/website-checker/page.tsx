import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { SiteChecker } from "@/components/SiteChecker";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "/website-checker",
  "Free website checker",
  "Check your site's speed, mobile experience and SEO with Google's own data, in plain English. Free, no sign-up, results in under a minute.",
);

const how = [
  { t: "Google's real-visitor data", d: "How the site behaved for actual visitors on phones over the last 28 days, from the Chrome UX Report." },
  { t: "A fresh phone test", d: "Google's PageSpeed test loads the page on a simulated phone and scores speed, SEO, accessibility and best practices." },
  { t: "Plain-English fixes", d: "Each problem comes with what it costs you, so you know what's worth fixing first." },
];

export default function WebsiteCheckerPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Website checker", path: "/website-checker" },
        ])}
      />
      <PageHeader
        eyebrow="Free tool"
        title="How does your website look to Google, and to customers on their phones?"
        intro="Paste your address. You get speed, mobile and SEO results from Google's own data, and a plain list of what to fix. Free, no sign-up."
      />
      <section className="mx-auto max-w-4xl px-6 pb-20">
        <SiteChecker />
      </section>
      <section className="mx-auto max-w-4xl px-6 pb-28">
        <h2 className="mb-6 text-xl font-semibold tracking-tight">Where the results come from</h2>
        <ul className="grid gap-4 sm:grid-cols-3">
          {how.map((h) => (
            <li key={h.t} className="rounded-2xl border border-border bg-surface/80 p-5">
              <p className="font-medium">{h.t}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">{h.d}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-muted">
          We keep the address you check and the result for a day, so a shared link opens instantly. We don&apos;t store anything else
          unless you ask us to email you.
        </p>
      </section>
    </>
  );
}
