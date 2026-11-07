import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "How it works",
  description: "We start small, prove the hours saved, and grow from there.",
};

export default function HowItWorksPage() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title="From first call to running on its own."
        intro="We start small, prove the hours saved, and grow from there."
      />
      <ComingSoon note="The full launch sequence — audit, plan, build, launch and ongoing support — with timelines and what you need to provide." />
      <CtaBanner />
    </>
  );
}
