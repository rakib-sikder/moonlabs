"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "Connect your tools",
    body: "Point Orbit at your inbox, CRM, and ticket queue. No migrations, no CSV exports.",
  },
  {
    n: "02",
    title: "Set the triggers",
    body: "Describe what should happen when a lead comes in, a ticket stalls, or an invoice is late.",
  },
  {
    n: "03",
    title: "Let the agent work",
    body: "Orbit classifies, drafts, and routes — pausing only for the calls that actually need a human.",
  },
  {
    n: "04",
    title: "Review & ship",
    body: "Approve in one tap from a daily digest, or let low-risk actions run automatically.",
  },
];

export function HowItWorks() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!track.current || !container.current) return;

      const getDistance = () => track.current!.scrollWidth - window.innerWidth;

      gsap.to(track.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: container }
  );

  return (
    <section id="how" ref={container} className="relative h-screen overflow-hidden bg-[#0b0c12]">
      <div ref={track} className="flex h-full items-center gap-8 px-[8vw] w-max">
        <div className="w-[42vw] max-w-md shrink-0">
          <p className="text-xs uppercase tracking-widest text-accent-2 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Four steps.
            <br />
            Zero babysitting.
          </h2>
        </div>
        {steps.map((step) => (
          <div
            key={step.n}
            className="panel w-[80vw] sm:w-[420px] shrink-0 rounded-2xl border border-border bg-[#111219] p-8 h-[60vh] max-h-[420px] flex flex-col justify-between"
          >
            <span className="font-mono text-accent text-sm">{step.n}</span>
            <div>
              <h3 className="text-2xl font-medium mb-3">{step.title}</h3>
              <p className="text-muted">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
