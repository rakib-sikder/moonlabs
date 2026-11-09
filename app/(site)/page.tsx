import type { Metadata } from "next";
import { Hero } from "@/components/hero/Hero";
import { Integrations } from "@/components/Integrations";
import { MissionControl } from "@/components/MissionControl";
import { CtaBanner } from "@/components/CtaBanner";
import { ServiceDirectory } from "@/components/home/ServiceDirectory";
import { ProcessStrip } from "@/components/home/ProcessStrip";
import { CaseStudies } from "@/components/home/CaseStudies";
import { PortalPreview } from "@/components/home/PortalPreview";
import { ClientLogos, StatsRow, Testimonials } from "@/components/home/Proof";
import { HomeFaq, Solutions } from "@/components/home/SolutionsAndFaq";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export default function Home() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <Integrations />
      <ServiceDirectory />
      <MissionControl />
      <StatsRow />
      <CaseStudies />
      <Testimonials />
      <ProcessStrip />
      <Solutions />
      <PortalPreview />
      <HomeFaq />
      <CtaBanner />
    </>
  );
}
