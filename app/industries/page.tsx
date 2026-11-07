import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";
import { industries } from "@/lib/site";

export const metadata: Metadata = {
  title: "Industries",
  description: "Automation built around how your industry actually works.",
};

export default function IndustriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Industries"
        title="Automation shaped around your industry."
        intro="Every business has its own busywork. These are the industries we know best."
      />
      <section className="mx-auto max-w-6xl px-6 pb-12">
        <ul className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => (
            <li key={ind.slug} className="rounded-xl border border-border bg-surface/80 backdrop-blur-sm p-5 font-medium">
              {ind.name}
            </li>
          ))}
        </ul>
      </section>
      <ComingSoon note="Detailed pages for each industry — the common problems and the automations that fix them — are on the way." />
      <CtaBanner />
    </>
  );
}
