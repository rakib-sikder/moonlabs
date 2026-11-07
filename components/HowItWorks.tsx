"use client";

import { cloneElement, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    n: "01",
    title: "Free audit",
    body: "A 30-minute call where we map the repetitive work in your business and spot what can run on its own.",
    icon: <path d="M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4" />,
  },
  {
    n: "02",
    title: "Automation plan",
    body: "A short written plan: what we automate, which tools connect, what it costs, and the hours it saves.",
    icon: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 13h6M9 17h4" />,
  },
  {
    n: "03",
    title: "Build",
    body: "We build and test against your real data, with a human approval step anywhere a mistake would cost you.",
    icon: <path d="M13 2 4 14h7l-1 8 10-12h-7l1-8z" />,
  },
  {
    n: "04",
    title: "Launch",
    body: "We switch it on, train your team in one session, and watch the first runs closely.",
    icon: <path d="M4 12.5 9.5 18 20 6" />,
  },
  {
    n: "05",
    title: "Orbit",
    body: "Ongoing monitoring and fixes, plus new automations as your business grows — on a simple monthly plan.",
    icon: null,
  },
];

export function HowItWorks() {
  const container = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const progress = useRef<HTMLDivElement>(null);
  const watermark = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLDivElement>(null);
  const comet = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!track.current || !container.current) return;

      const getDistance = () => track.current!.scrollWidth - window.innerWidth;
      // GSAP can't interpolate var(), so resolve the tokens to real colours.
      const cs = getComputedStyle(document.documentElement);
      const dimColor = cs.getPropertyValue("--border").trim();
      const litColor = cs.getPropertyValue("--moon").trim();

      // The lit trail ends under a glowing comet that stays at the centre of the screen.
      const placeComet = (p: number) => {
        const px = p * getDistance() + window.innerWidth * 0.5;
        gsap.set(trail.current, { width: px });
        gsap.set(comet.current, { x: px });
      };
      placeComet(0);

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
            placeComet(self.progress);
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
            { color: dimColor },
            {
              color: litColor,
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
    <section id="how" ref={container} className="relative h-screen overflow-hidden bg-gradient-to-b from-transparent via-surface/70 to-transparent">
      <div
        ref={watermark}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span className="text-[20vw] font-bold tracking-tighter text-foreground/[0.035] whitespace-nowrap">
          MOONLABS
        </span>
      </div>

      <div ref={track} className="relative flex h-full items-center gap-8 px-[8vw] w-max">
        {/* Orbit path running behind the panels, lit up to the comet as you scroll. */}
        <div aria-hidden className="pointer-events-none absolute left-0 right-0 top-1/2 h-px bg-border" />
        <div
          ref={trail}
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 h-px -translate-y-px"
          style={{ background: "linear-gradient(to right, transparent, var(--accent) 60%, var(--moon))", height: 2 }}
        />
        <div
          ref={comet}
          aria-hidden
          className="pointer-events-none absolute left-0 top-1/2 z-20 -ml-2.5 -mt-2.5 h-5 w-5 rounded-full bg-moon"
          style={{ boxShadow: "0 0 20px 6px var(--accent), 0 0 60px 18px color-mix(in srgb, var(--accent) 40%, transparent)" }}
        />
        <div className="relative z-10 w-[80vw] sm:w-[42vw] max-w-md shrink-0 rounded-2xl bg-background/60 p-6 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-widest text-moon mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Five stages.
            <br />
            One launch.
          </h2>
          <p className="mt-4 text-sm text-muted max-w-xs hidden sm:block">
            Keep scrolling — each step comes into focus as it reaches the center of the screen.
          </p>
        </div>
        {steps.map((step) => (
          <div
            key={step.n}
            className="panel relative z-10 w-[80vw] sm:w-[420px] shrink-0 rounded-2xl border border-border bg-surface-2/90 backdrop-blur-sm p-8 h-[60vh] max-h-[420px] flex flex-col justify-between will-change-transform"
          >
            <div className="flex items-center justify-between">
              <span className="step-num font-mono text-sm">{step.n}</span>
              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-foreground/[0.03]">
                {step.icon ? (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-moon"
                  >
                    {cloneElement(step.icon, { className: "icon-draw" } as object)}
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-6 w-6 text-moon">
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

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 h-[2px] w-[min(60vw,480px)] overflow-hidden rounded-full bg-foreground/10">
        <div
          ref={progress}
          className="h-full w-full origin-left bg-moon"
          style={{ transform: "scaleX(0)" }}
        />
      </div>
    </section>
  );
}
