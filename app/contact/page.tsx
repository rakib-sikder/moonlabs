import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { ComingSoon } from "@/components/ComingSoon";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us what eats your team’s week. We’ll reply within one working day.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Book a free automation audit."
        intro="Tell us what eats your team’s week. We’ll reply within one working day."
      />
      <ComingSoon note="The booking form and calendar are being connected." />
      <CtaBanner />
    </>
  );
}
