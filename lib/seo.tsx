// Structured data (schema.org JSON-LD) and canonical helpers for search engines.
import type { Metadata } from "next";
import { site, type Service } from "./site";

const abs = (path: string) => new URL(path, site.url).toString();

/** Page metadata with a canonical URL and matching Open Graph URL. */
export function pageMeta(path: string, title: string, description: string, extra: Metadata = {}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} · ${site.name}`, description, url: abs(path), siteName: site.name, type: "website" },
    ...extra,
  };
}

export const organizationLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": `${site.url}/#organization`,
  name: site.name,
  url: site.url,
  logo: abs("/icon.svg"),
  image: abs("/opengraph-image"),
  description: site.description,
  founder: { "@type": "Person", name: site.founder },
  ...(site.email ? { email: site.email } : {}),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressCountry: site.address.countryCode,
  },
  areaServed: [
    { "@type": "Country", name: "Bangladesh" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: [
    "Business process automation",
    "AI agents",
    "Workflow automation",
    "WhatsApp automation",
    "Website development",
    "Mobile app development",
    "SEO",
  ],
};

export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${site.url}/#website`,
  name: site.name,
  url: site.url,
  publisher: { "@id": `${site.url}/#organization` },
};

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function serviceLd(service: Service, title: string, faqs: { q: string; a: string }[]) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      serviceType: service.name,
      description: service.short,
      url: abs(`/services/${service.slug}`),
      provider: { "@id": `${site.url}/#organization` },
      areaServed: ["Bangladesh", "United States"],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: title,
        itemListElement: service.items.map((it) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name: it } })),
      },
    },
    faqLd(faqs),
  ];
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

/** Renders one or more JSON-LD objects. `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
