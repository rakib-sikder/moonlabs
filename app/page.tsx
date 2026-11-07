import { Hero } from "@/components/Hero";
import { Integrations } from "@/components/Integrations";
import { HowItWorks } from "@/components/HowItWorks";
import { ServicesGrid } from "@/components/ServicesGrid";
import { CtaBanner } from "@/components/CtaBanner";

export default function Home() {
  return (
    <>
      <Hero />
      <Integrations />
      <ServicesGrid />
      <HowItWorks />
      <CtaBanner />
    </>
  );
}
