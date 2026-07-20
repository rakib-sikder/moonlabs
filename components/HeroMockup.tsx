"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const rows = [
  { label: "New lead — Northgate Logistics", width: 72 },
  { label: "Ticket stalled 2h — #4471", width: 58 },
  { label: "Invoice overdue — Fieldworks Co.", width: 66 },
];

export function HeroMockup() {
  const scope = useRef<HTMLDivElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<Array<HTMLDivElement | null>>([]);
  const fillRefs = useRef<Array<HTMLDivElement | null>>([]);
  const dotRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const checkRefs = useRef<Array<SVGSVGElement | null>>([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({ repeat: -1, repeatDelay: 0.9, defaults: { ease: "power2.inOut" } });

      rows.forEach((_, i) => {
        const row = rowRefs.current[i];
        const fill = fillRefs.current[i];
        const dot = dotRefs.current[i];
        const check = checkRefs.current[i];
        if (!row || !fill || !dot || !check) return;

        tl.to(cursor.current, {
          x: () => row.offsetLeft + row.offsetWidth - 22,
          y: () => row.offsetTop + row.offsetHeight / 2 - 7,
          duration: 0.55,
        }, i === 0 ? 0.3 : "+=0.15")
          .to(cursor.current, { scale: 0.8, duration: 0.12, yoyo: true, repeat: 1 })
          .to(dot, { backgroundColor: "var(--accent)", duration: 0.2 }, "<")
          .to(fill, { scaleX: 1, duration: 0.7, ease: "power1.inOut" }, "<")
          .to(dot, { backgroundColor: "var(--accent-2)", duration: 0.2 })
          .to(check, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(3)" }, "<-0.1");
      });

      tl.to({}, { duration: 0.8 })
        .to([cursor.current], { x: 18, y: 18, duration: 0.4 })
        .to(
          fillRefs.current,
          { scaleX: 0, duration: 0.3 },
          "<"
        )
        .to(dotRefs.current, { backgroundColor: "rgba(255,255,255,0.15)", duration: 0.3 }, "<")
        .to(checkRefs.current, { opacity: 0, scale: 0, duration: 0.25 }, "<");
    },
    { scope }
  );

  return (
    <div
      ref={scope}
      className="relative rounded-2xl border border-border bg-[#0d0e15] shadow-2xl shadow-black/50 p-6 overflow-hidden"
    >
      <div className="flex gap-1.5 mb-5">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
      </div>

      <div className="space-y-3">
        {rows.map((row, i) => (
          <div
            key={row.label}
            ref={(el) => {
              rowRefs.current[i] = el;
            }}
            className="relative flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.015] px-3 py-3"
          >
            <span
              ref={(el) => {
                dotRefs.current[i] = el;
              }}
              className="h-2 w-2 shrink-0 rounded-full bg-white/15"
            />
            <div className="min-w-0 flex-1">
              <p className="mb-1.5 truncate text-[11px] text-white/40">{row.label}</p>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                <div
                  ref={(el) => {
                    fillRefs.current[i] = el;
                  }}
                  className="h-full w-full origin-left scale-x-0 rounded-full bg-accent"
                />
              </div>
            </div>
            <svg
              ref={(el) => {
                checkRefs.current[i] = el;
              }}
              viewBox="0 0 24 24"
              className="h-4 w-4 shrink-0 scale-0 text-accent-2 opacity-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 12.5 9.5 18 20 6" />
            </svg>
          </div>
        ))}
      </div>

      <div
        ref={cursor}
        className="pointer-events-none absolute top-0 left-0 h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_0_5px_rgba(255,255,255,0.08)]"
      />
    </div>
  );
}
