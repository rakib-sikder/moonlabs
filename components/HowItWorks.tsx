"use client";

import { cloneElement, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "Connect your tools",
    body: "Point Orbit at your inbox, CRM, and ticket queue. No migrations, no CSV exports.",
    icon: (
      <path d="M9 2v4M15 2v4M7 6h10a1 1 0 0 1 1 1v4a5 5 0 0 1-5 5v3a2 2 0 0 1-2 2v0a2 2 0 0 1-2-2v-3a5 5 0 0 1-5-5V7a1 1 0 0 1 1-1z" />
    ),
  },
  {
    n: "02",
    title: "Set the triggers",
    body: "Describe what should happen when a lead comes in, a ticket stalls, or an invoice is late.",
    icon: <path d="M13 2 4 14h7l-1 8 10-12h-7l1-8z" />,
  },
  {
    n: "03",
    title: "Let the agent work",
    body: "Orbit classifies, drafts, and routes — pausing only for the calls that actually need a human.",
    icon: null,
  },
  {
    n: "04",
    title: "Review & ship",
    body: "Approve in one tap from a daily digest, or let low-risk actions run automatically.",
    icon: <path d="M4 12.5 9.5 18 20 6" />,
  },
];

export function HowItWorks() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const watermark = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!track.current || !container.current) return;

      const getDistance = () => track.current!.scrollWidth - window.innerWidth;

      const scrollTween = gsap.to(track.current, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: container.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(progress.current, { scaleX: self.progress });
          },
        },
      });

      if (watermark.current) {
        gsap.to(watermark.current, {
          xPercent: -18,
          ease: "none",
          scrollTrigger: {
            trigger: container.current,
            containerAnimation: scrollTween,
            start: "left left",
            end: "right right",
            scrub: true,
          },
        });
      }

      const panels = gsap.utils.toArray<HTMLElement>(".panel", track.current);

      panels.forEach((panel) => {
        gsap.fromTo(
          panel,
          { scale: 0.86, opacity: 0.3, filter: "blur(6px)" },
          {
            scale: 1,
            opacity: 1,
            filter: "blur(0px)",
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "left 82%",
              end: "left 42%",
              scrub: true,
            },
          }
        );

        gsap.fromTo(
          panel,
          { opacity: 1, scale: 1 },
          {
            opacity: 0.3,
            scale: 0.9,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "right 58%",
              end: "right 10%",
              scrub: true,
            },
          }
        );

        const num = panel.querySelector<HTMLElement>(".step-num");
        if (num) {
          gsap.fromTo(
            num,
            { color: "#54545f" },
            {
              color: "var(--accent-2)",
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left 74%",
                end: "left 48%",
                scrub: true,
              },
            }
          );
        }

        const drawn = panel.querySelectorAll<SVGGeometryElement>(".icon-draw");
        drawn.forEach((el) => {
          const len = el.getTotalLength();
          gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(el, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "left 76%",
              end: "left 40%",
              scrub: true,
            },
          });
        });

        const satellite = panel.querySelector<HTMLElement>(".icon-satellite");
        if (satellite) {
          gsap.fromTo(
            satellite,
            { opacity: 0, scale: 0 },
            {
              opacity: 1,
              scale: 1,
              transformOrigin: "center",
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left 55%",
                end: "left 40%",
                scrub: true,
              },
            }
          );
        }
      });
    },
    { scope: container }
  );

  return (
    <section id="how" ref={container} className="relative h-screen overflow-hidden bg-[#0b0c12]">
      <div
        ref={watermark}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="text-[26vw] font-bold tracking-tighter text-white/[0.025] whitespace-nowrap">
          ORBIT ORBIT
        </span>
      </div>

      <div ref={track} className="relative flex h-full items-center gap-8 px-[8vw] w-max">
        <div className="w-[42vw] max-w-md shrink-0">
          <p className="text-xs uppercase tracking-widest text-accent-2 mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Four steps.
            <br />
            Zero babysitting.
          </h2>
          <p className="mt-4 text-sm text-muted max-w-xs hidden sm:block">
            Keep scrolling — each step comes into focus as it reaches the center of the screen.
          </p>
        </div>
        {steps.map((step) => (
          <div
            key={step.n}
            className="panel w-[80vw] sm:w-[420px] shrink-0 rounded-2xl border border-border bg-[#111219] p-8 h-[60vh] max-h-[420px] flex flex-col justify-between will-change-transform"
          >
            <div className="flex items-center justify-between">
              <span className="step-num font-mono text-sm">{step.n}</span>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-white/[0.03]">
                {step.icon ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-accent-2"
                  >
                    {cloneElement(step.icon, { className: "icon-draw" } as object)}
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-accent-2">
                    <circle
                      className="icon-draw"
                      cx="12"
                      cy="12"
                      r="8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    />
                    <circle className="icon-satellite" cx="20" cy="12" r="2" fill="currentColor" />
                  </svg>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-medium mb-3">{step.title}</h3>
              <p className="text-muted">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-[2px] w-[min(60vw,480px)] overflow-hidden rounded-full bg-white/10">
        <div
          ref={progress}
          className="h-full w-full origin-left bg-accent-2"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
