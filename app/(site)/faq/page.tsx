import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Accordion } from "@/components/ui/Accordion";
import { Reveal } from "@/components/ui/Section";
import { faqs } from "@/lib/content/company";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about pricing, timelines, data security and what happens after an automation goes live.",
};

export default function FaqPage() {
  // FAQPage structured data for search results.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.flatMap((g) =>
      g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } }))
    ),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHeader
        eyebrow="FAQ"
        title="Questions we get asked a lot."
        intro="Pricing, timelines, data security and what happens when something breaks. If yours isn't here, ask us."
      />
      <section className="mx-auto max-w-4xl px-6 pb-24 space-y-14">
        {faqs.map((g, i) => (
          <Reveal key={g.group} delay={i * 0.05}>
            <div className="grid gap-6 md:grid-cols-[200px_1fr]">
              <h2 className="pt-5 text-xs uppercase tracking-widest text-moon">{g.group}</h2>
              <Accordion items={g.items} />
            </div>
          </Reveal>
        ))}
      </section>
      <CtaBanner title="Still have a question?" body="Ask it in a free 30-minute audit — we'll answer it and show you what you could automate." />
    </>
  );
}
