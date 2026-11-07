import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Pricing, timelines, data security and what happens when something breaks.",
};

export default function FaqPage() {
  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Questions we get asked a lot."
        intro="Pricing, timelines, data security and what happens when something breaks."
      />
      <ComingSoon note="Answers are being written up." />
      <CtaBanner />
    </>
  );
}
