import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "About",
  description: "Moonlabs builds automations for businesses that would rather grow than do data entry.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title="A small team that automates the boring parts."
        intro="Moonlabs builds automations for businesses that would rather grow than do data entry."
      />
      <ComingSoon note="The full story, the team and the tools we use are coming soon." />
      <CtaBanner />
    </>
  );
}
