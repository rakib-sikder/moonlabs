import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "ROI calculator",
  description: "Enter a few numbers about your team and see the hours and money automation could give back.",
};

export default function RoiCalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="ROI calculator"
        title="How much is the busywork costing you?"
        intro="Enter a few numbers about your team and see the hours and money automation could give back."
      />
      <ComingSoon note="The interactive calculator is being built." />
      <CtaBanner />
    </>
  );
}
