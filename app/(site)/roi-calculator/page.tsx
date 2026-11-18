import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { RoiCalculator } from "@/components/RoiCalculator";

export const metadata: Metadata = pageMeta(
  "/roi-calculator",
  "Automation ROI Calculator",
  "Free automation ROI calculator: estimate the hours and money automation could give back to your team each month, and how fast a project pays for itself.", "page-roi-calculator",
);

export default function RoiCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="ROI calculator"
        title="Estimate what manual work costs you." image="page-roi-calculator"
        intro="Move the sliders and the numbers update as you go. A free audit replaces these guesses with measured figures."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <RoiCalculator />
      </section>
      <CtaBanner />
    </>
  );
}
