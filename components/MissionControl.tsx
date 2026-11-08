"use client";

import { useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { HeroMockup } from "./HeroMockup";
import { RevealText } from "./ui/RevealText";

const points = [
  { k: "Watches", v: "Your inbox, forms, CRM and invoices — around the clock." },
  { k: "Acts", v: "Enriches the lead, drafts the reply, sends the reminder." },
  { k: "Asks", v: "Anything risky waits for a one-tap human approval." },
];

/** "Watch it work" — the animated workflow mockup, tilting toward the cursor. */
export function MissionControl() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 140, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [0, 1], [-8, 8]);
  const rotateX = useTransform(sy, [0, 1], [7, -7]);

  // The panel swings up from a tilted, recessed angle as the section scrolls in.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const enterRotate = useTransform(scrollYProgress, [0, 1], [28, 0]);
  const enterScale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);

  return (
    <section ref={ref} className="relative mx-auto max-w-6xl px-6 py-20 grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:items-center">
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-moon mb-3">How an automation runs</p>
        <RevealText
          text="Watch the busywork disappear."
          className="text-2xl sm:text-[2rem] font-semibold tracking-tight leading-tight"
        />
        <ul className="mt-10 space-y-6">
          {points.map((p, i) => (
            <motion.li
              key={p.k}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="flex gap-4"
            >
              <span className="mt-1 font-mono text-xs text-moon">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <p className="font-medium">{p.k}</p>
                <p className="text-sm text-muted">{p.v}</p>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>

      <motion.div
        style={reduced ? undefined : { rotateX: enterRotate, scale: enterScale, transformPerspective: 1200 }}
        onMouseMove={(e) => {
          if (reduced) return;
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width);
          my.set((e.clientY - r.top) / r.height);
        }}
        onMouseLeave={() => {
          mx.set(0.5);
          my.set(0.5);
        }}
        className="relative [perspective:1200px]"
      >
        <div
          aria-hidden
          className="absolute -inset-10 rounded-full blur-3xl"
          style={{ opacity: "var(--glow-strength)", background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
        />
        <motion.div style={{ rotateX, rotateY }} className="relative [transform-style:preserve-3d]">
          <HeroMockup />
        </motion.div>
      </motion.div>
    </section>
  );
}
