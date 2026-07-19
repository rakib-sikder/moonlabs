"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, { duration: 1.6, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [inView, to, count]);

  return (
    <span className="inline-flex">
      <motion.span ref={ref}>{rounded}</motion.span>
      {suffix}
    </span>
  );
}

const stats = [
  { to: 42000, suffix: "+", label: "Leads triaged monthly" },
  { to: 96, suffix: "%", label: "Routed without a human touch" },
  { to: 3, suffix: "min", label: "Median time to first reply" },
  { to: 180, suffix: "+", label: "Teams running Orbit" },
];

export function Stats() {
  return (
    <section className="border-y border-border">
      <div className="mx-auto max-w-6xl px-6 py-20 grid grid-cols-2 lg:grid-cols-4 gap-10">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-accent-2">
              <Counter to={s.to} suffix={s.suffix} />
            </div>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
