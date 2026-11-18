import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Diorama, pictureFor } from "@/components/ui/Diorama";
import { CtaBanner } from "@/components/CtaBanner";
import { guideCategories, guides } from "@/lib/content/guides";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "/guides",
  "Guides",
  "Practical guides for small business owners on AI automation, lead follow-up, invoicing, websites, SEO and choosing the right tools.", "page-guides",
);

const slugify = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
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
      <nav aria-label="Guide topics" className="mx-auto flex max-w-6xl flex-wrap gap-2 px-6 pb-10">
        {guideCategories.map((c) => (
          <a key={c} href={`#${slugify(c)}`} className="rounded-full border border-border px-4 py-1.5 text-sm text-muted transition-colors hover:border-accent/40 hover:text-foreground">
            {c} <span className="font-mono text-xs">({guides.filter((g) => g.category === c).length})</span>
          </a>
        ))}
      </nav>
      {guideCategories.map((c) => {
        const list = guides.filter((g) => g.category === c);
        if (!list.length) return null;
        return (
          <section key={c} id={slugify(c)} className="mx-auto max-w-6xl scroll-mt-28 px-6 pb-20">
            <h2 className="mb-6 text-2xl font-semibold tracking-tight">{c}</h2>
            <ul className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-2">
              {list.map((g) => (
                <li key={g.slug} className="bg-surface">
                  <Link href={`/guides/${g.slug}`} className="group flex h-full flex-col p-7 transition-colors hover:bg-surface-2/60">
                    {pictureFor(`guide-${g.slug}`) && (
                      <Diorama name={pictureFor(`guide-${g.slug}`)!} ratio="16 / 9" decorative className="mb-6" />
                    )}
                    <p className="font-mono text-xs text-muted">
                      {fmt(g.published)} · {g.readMinutes} min read
                    </p>
                    <h3 className="mt-3 text-xl font-semibold tracking-tight">{g.title}</h3>
                    <p className="mt-2 flex-1 leading-relaxed text-muted">{g.description}</p>
                    <span className="mt-5 inline-flex items-center gap-1 text-sm text-accent">
                      Read the guide <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <CtaBanner />
    </>
  );
}
