import { Hero } from "@/components/hero/Hero";
import { Integrations } from "@/components/Integrations";
import { MissionControl } from "@/components/MissionControl";
import { HowItWorks } from "@/components/HowItWorks";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CtaBanner } from "@/components/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <Integrations />
      <ServicesGrid />
      <MissionControl />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
