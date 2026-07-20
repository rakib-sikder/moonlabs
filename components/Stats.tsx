"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";

function Counter({ to, suffix = "", delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, to, { duration: 1.4, delay, ease: [0.16, 1, 0.3, 1] });
    return controls.stop;
  }, [inView, to, count, delay]);

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

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Stats() {
  return (
    <section className="border-y border-border">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.5 }}
        className="mx-auto max-w-6xl px-6 py-20 grid grid-cols-2 lg:grid-cols-4 gap-10"
      >
        {stats.map((s, i) => (
          <motion.div key={s.label} variants={item} className="relative text-center group">
            <div className="mx-auto mb-4 h-px w-8 bg-border transition-all duration-500 group-hover:w-12 group-hover:bg-accent-2" />
            <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-accent-2">
              <Counter to={s.to} suffix={s.suffix} delay={i * 0.1} />
            </div>
            <p className="mt-2 text-sm text-muted">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
