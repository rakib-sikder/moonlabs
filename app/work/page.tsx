import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Work",
  description: "Real projects, real numbers — no invented case studies.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title="Automations we have built and run."
        intro="Real projects, real numbers — no invented case studies."
      />
      <ComingSoon note="Case studies with before-and-after numbers are being written up now." />
      <CtaBanner />
    </>
  );
}
