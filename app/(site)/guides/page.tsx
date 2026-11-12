import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Diorama, pictureFor } from "@/components/ui/Diorama";
import { CtaBanner } from "@/components/CtaBanner";
import { guides } from "@/lib/content/guides";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "/guides",
  "Guides",
  "Practical guides on business automation, WhatsApp automation, online booking and fixing small business websites.", "page-guides",
);

const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Guides", path: "/guides" }])} />
      <PageHeader
        eyebrow="Guides"
        title="Practical guides for small business owners."
        image="page-guides"
        intro="What to automate, how to fix the website problems we see most often, and how to tell whether a project is worth it."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
          {guides.map((g) => (
            <li key={g.slug} className="bg-surface">
              <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col p-7 transition-colors hover:bg-surface-2/60">
                {pictureFor(`guide-${g.slug}`) && (
                  <Diorama name={pictureFor(`guide-${g.slug}`)!} ratio="16 / 9" decorative className="mb-6" />
                )}
                <p className="font-mono text-xs text-muted">
                  {fmt(g.published)} · {g.readMinutes} min read
                </p>
                <h2 className="mt-3 text-xl font-semibold tracking-tight">{g.title}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{g.description}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm text-accent">
                  Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBanner />
    </>
  );
}
