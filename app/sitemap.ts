import type { MetadataRoute } from "next";
import { services, site } from "@/lib/site";
import { industryDetails } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/company";
import { guides } from "@/lib/content/guides";

type Entry = { path: string; priority: number; freq: "weekly" | "monthly" | "yearly"; modified?: string };

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: Entry[] = [
    { path: "", priority: 1, freq: "weekly" },
    { path: "/services", priority: 0.9, freq: "monthly" },
    { path: "/pricing", priority: 0.9, freq: "monthly" },
    { path: "/contact", priority: 0.8, freq: "yearly" },
    { path: "/guides", priority: 0.8, freq: "weekly" },
    { path: "/industries", priority: 0.7, freq: "monthly" },
    { path: "/how-it-works", priority: 0.7, freq: "monthly" },
    { path: "/work", priority: 0.7, freq: "monthly" },
    { path: "/integrations", priority: 0.6, freq: "monthly" },
    { path: "/roi-calculator", priority: 0.6, freq: "yearly" },
    { path: "/sample-audit", priority: 0.6, freq: "yearly" },
    { path: "/about", priority: 0.6, freq: "yearly" },
    { path: "/faq", priority: 0.6, freq: "monthly" },
    { path: "/security", priority: 0.4, freq: "yearly" },
    { path: "/privacy", priority: 0.2, freq: "yearly" },
    { path: "/terms", priority: 0.2, freq: "yearly" },
    ...services.map((s) => ({ path: `/services/${s.slug}`, priority: s.category === "automation" ? 0.8 : 0.7, freq: "monthly" as const })),
    ...industryDetails.map((i) => ({ path: `/industries/${i.slug}`, priority: 0.6, freq: "monthly" as const })),
    ...caseStudies.map((c) => ({ path: `/work/${c.slug}`, priority: 0.6, freq: "yearly" as const })),
    ...guides.map((g) => ({ path: `/guides/${g.slug}`, priority: 0.7, freq: "monthly" as const, modified: g.published })),
  ];
  return entries.map((e) => ({
    url: `${site.url}${e.path}`,
    lastModified: e.modified ? new Date(e.modified) : now,
    changeFrequency: e.freq,
    priority: e.priority,
  }));
}
