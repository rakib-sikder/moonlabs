import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";
import { industryDetails } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/company";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const paths = [
    "",
    "/services",
    "/industries",
    "/how-it-works",
    "/work",
    "/pricing",
    "/roi-calculator",
    "/about",
    "/contact",
    "/faq",
    "/security",
    ...services.map((s) => `/services/${s.slug}`),
    ...industryDetails.map((i) => `/industries/${i.slug}`),
    ...caseStudies.map((c) => `/work/${c.slug}`),
  ];
  return paths.map((p) => ({
    url: `${site.url}${p}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: p === "" ? 1 : p.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
