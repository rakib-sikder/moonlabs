import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Pricing",
  description: "One-time projects, monthly retainers, or a done-for-you subscription.",
};

export default function PricingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Pricing"
        title="Simple plans, no surprises."
        intro="One-time projects, monthly retainers, or a done-for-you subscription."
      />
      <ComingSoon note="Crescent, Half Moon and Full Moon plans with clear prices are coming soon." />
      <CtaBanner />
    </>
  );
}
