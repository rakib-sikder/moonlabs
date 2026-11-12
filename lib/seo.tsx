// Structured data (schema.org JSON-LD) and canonical helpers for search engines.
import type { Metadata } from "next";
import { site, type Service } from "./site";
import type { Picture } from "@/components/ui/Diorama";

const abs = (path: string) => new URL(path, site.url).toString();

/** The 1200x630 link-preview image for a picture, or the site's default share card. */
export const shareImage = (picture?: Picture) => [
  { url: picture ? `/og/${picture}.jpg` : "/opengraph-image.jpg", width: 1200, height: 630, alt: `${site.name}, an automation agency` },
];

/**
 * Page metadata: title, description, canonical URL and a matching link-preview card.
 * Without this a page inherits the home page's card, so every shared link would look the same.
 * `absoluteTitle` skips the " · Moonlab" suffix for titles that are already long.
 */
export function pageMeta(
  path: string,
  title: string,
  description: string,
  picture?: Picture,
  { absoluteTitle = false, ...extra }: Metadata & { absoluteTitle?: boolean } = {},
): Metadata {
  const full = absoluteTitle ? title : `${title} · ${site.name}`;
  const images = shareImage(picture);
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { title: full, description, url: abs(path), siteName: site.name, type: "website", images },
    twitter: { card: "summary_large_image", title: full, description, images },
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
  image: abs("/opengraph-image.jpg"),
  description: site.description,
  founder: { "@type": "Person", name: site.founder },
  ...(site.email ? { email: site.email } : {}),
  telephone: `+${site.phone.e164}`,
  sameAs: site.social.map((s) => s.href),
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
