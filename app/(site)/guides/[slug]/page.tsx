import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { pictureFor } from "@/components/ui/Diorama";
import { CtaBanner } from "@/components/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { IconTile } from "@/components/ui/IconTile";
import { guides } from "@/lib/content/guides";
import { services, site } from "@/lib/site";
import { JsonLd, breadcrumbLd, faqLd, pageMeta, shareImage } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) return {};
  const meta = pageMeta(`/guides/${g.slug}`, g.title, g.description, pictureFor(`guide-${g.slug}`), {
    absoluteTitle: true,
    keywords: g.keywords,
  });
  return { ...meta, openGraph: { ...meta.openGraph, type: "article", publishedTime: g.published, authors: [site.founder] } };
}

const fmt = (d: string) => new Date(d + "T12:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
// Turn internal paths written in the text ("/pricing", "/services/seo") into real links.
const PATH_RE = /(\/(?:pricing|contact|services\/[a-z0-9-]+|guides\/[a-z0-9-]+))/g;
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(PATH_RE).map((part, i) =>
        i % 2 === 1 ? (
          <Link key={i} href={part} className="text-accent underline underline-offset-4 hover:no-underline">
            moonlab.space{part}
          </Link>
        ) : (
          part
        ),
      )}
    </>
  );
}

const anchor = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = guides.find((x) => x.slug === slug);
  if (!g) notFound();
  const related = g.services.map((s) => services.find((x) => x.slug === s)).filter((s): s is (typeof services)[number] => Boolean(s));
  const others = guides.filter((x) => x.slug !== g.slug).slice(0, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: g.title,
    description: g.description,
    image: new URL(shareImage(pictureFor(`guide-${g.slug}`))[0].url, site.url).toString(),
    datePublished: g.published,
    dateModified: g.published,
    author: { "@type": "Person", name: site.founder },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: `${site.url}/guides/${g.slug}`,
    keywords: g.keywords.join(", "),
  };

  return (
    <>
      <JsonLd
        data={[
          articleLd,
          faqLd(g.faqs),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: g.title, path: `/guides/${g.slug}` },
          ]),
        ]}
      />
      <PageHeader eyebrow={`Guide · ${fmt(g.published)} · ${g.readMinutes} min read`} title={g.title} intro={g.description} image={pictureFor(`guide-${g.slug}`)} />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-20 lg:grid-cols-[220px_minmax(0,1fr)]">
        <nav aria-label="On this page" className="hidden lg:block">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted">On this page</p>
          <ol className="sticky top-28 space-y-1 text-sm">
            {g.sections.map((s) => (
              <li key={s.heading}>
                <a href={`#${anchor(s.heading)}`} className="block rounded-md px-2 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
                  {s.heading}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="max-w-[46rem] text-[17px] leading-[1.75]">
          <p className="mb-8 text-sm text-muted">By {site.founder}, {site.name}</p>
          {g.intro.map((p) => (
            <p key={p} className="mb-5">
              <Rich text={p} />
            </p>
          ))}
          {g.sections.map((s) => (
            <section key={s.heading} id={anchor(s.heading)} className="scroll-mt-28">
              <h2 className="mt-12 mb-4 text-2xl font-semibold tracking-tight">{s.heading}</h2>
              {s.paragraphs.map((p) => (
                <p key={p} className="mb-5 text-foreground/90">
                  <Rich text={p} />
                </p>
              ))}
              {s.bullets && (
                <ul className="mb-6 space-y-2 pl-5">
                  {s.bullets.map((b) => (
                    <li key={b} className="list-disc marker:text-accent">
                      <Rich text={b} />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <h2 className="mt-14 mb-5 text-2xl font-semibold tracking-tight">Common questions</h2>
          <Accordion items={g.faqs} />

          {related.length > 0 && (
            <>
              <h2 className="mt-14 mb-5 text-2xl font-semibold tracking-tight">Related services</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {related.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-surface/80 p-4 transition-colors hover:border-accent/40"
                  >
                    <IconTile slug={s.slug} size={40} />
                    <span className="min-w-0">
                      <span className="block font-medium">{s.name}</span>
                      <span className="block text-sm text-muted">{s.short}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </article>
      </div>

      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-12">
          <p className="mb-4 font-mono text-xs uppercase tracking-widest text-moon">More guides</p>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <Link key={o.slug} href={`/guides/${o.slug}`} className="rounded-2xl border border-border bg-surface/80 p-5 transition-colors hover:border-accent/40">
                <p className="font-medium">{o.title}</p>
                <p className="mt-1 text-sm text-muted">{o.readMinutes} min read</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <CtaBanner />
    </>
  );
}
