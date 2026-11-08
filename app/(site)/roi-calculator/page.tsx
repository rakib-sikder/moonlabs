import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { RoiCalculator } from "@/components/RoiCalculator";

export const metadata: Metadata = {
  title: "ROI calculator",
  description: "Estimate the hours and money automation could give back to your team in under a minute.",
};

export default function RoiCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="ROI calculator"
        title="How much is the busywork costing you?"
        intro="Move the sliders. The numbers update as you go — then book a free audit to replace the guesses with real ones."
      />
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <RoiCalculator />
      </section>
      <CtaBanner />
    </>
  );
}
