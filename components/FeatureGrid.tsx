"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const features: { title: string; body: string; icon: ReactNode }[] = [
  {
    title: "Smart triage",
    body: "Every inbound item is scored and routed before a human ever sees it.",
    icon: <path d="M3 5h18M6 12h12M10 19h4" />,
  },
  {
    title: "Drafts, not decisions",
    body: "Orbit writes the reply. A person always approves what goes out.",
    icon: <path d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />,
  },
  {
    title: "Full audit trail",
    body: "Every action the agent takes is logged, reversible, and explainable.",
    icon: <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2m-5 8 2 2 4-4" />,
  },
  {
    title: "Works with what you have",
    body: "Gmail, Slack, HubSpot, Zendesk — no rip-and-replace required.",
    icon: <path d="M4 8h4V4H4zM16 8h4V4h-4zM4 20h4v-4H4zM14 14h6v6h-6zM8 6h8M6 8v8M18 8v3" />,
  },
  {
    title: "Cost-aware by design",
    body: "Cheap checks run first; expensive reasoning only happens when it matters.",
    icon: <path d="M12 14 15 9M4 14a8 8 0 1 1 16 0" />,
  },
  {
    title: "Human escalation",
    body: "Anything ambiguous lands in front of a person automatically, no dropped balls.",
    icon: <path d="M20 21a8 8 0 0 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />,
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function FeatureCard({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 300, damping: 25 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(280px circle at ${x} ${y}, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)`
  );

  return (
    <motion.div
      variants={item}
      style={{ perspective: 800 }}
      className="group relative"
    >
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative overflow-hidden rounded-2xl border border-border bg-[#0d0e15] p-6 transition-colors duration-300 group-hover:border-accent/40"
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBackground }}
        />
        <div
          style={{ transform: "translateZ(30px)" }}
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-accent-2"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4.5 w-4.5"
          >
            {icon}
          </svg>
        </div>
        <h3 style={{ transform: "translateZ(20px)" }} className="relative mt-4 mb-2 font-medium">
          {title}
        </h3>
        <p style={{ transform: "translateZ(20px)" }} className="relative text-sm text-muted">
          {body}
        </p>
      </motion.div>
    </motion.div>
  );
}

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mb-16"
      >
        <p className="text-xs uppercase tracking-widest text-accent-2 mb-3">Features</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Built for teams who don&apos;t trust black boxes.
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </motion.div>
    </section>
  );
}
