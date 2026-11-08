"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Trigger → steps → outcome, drawn as a vertical pipeline. The connecting line fills as
 * you scroll through it and each node lights up in turn.
 */
export function WorkflowPipeline({
  name,
  trigger,
  steps,
  outcome,
  color = "var(--accent)",
  project = false,
}: {
  name: string;
  trigger: string;
  steps: string[];
  outcome: string;
  color?: string;
  /** Show it as how a project runs (kick-off → delivered) rather than an automation. */
  project?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const nodes = [
    { label: project ? "Kick-off" : "Trigger", text: trigger },
    ...steps.map((s, i) => ({ label: `Step ${i + 1}`, text: s })),
    { label: project ? "Delivered" : "Result", text: outcome },
  ];

  return (
    <div ref={ref} className="relative rounded-2xl border border-border bg-surface/80 p-6 backdrop-blur-sm sm:p-10">
      <div className="mb-8 flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: color }} />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ background: color }} />
        </span>
        <p className="font-mono text-xs uppercase tracking-widest text-muted">{project ? "How a project runs" : "Example workflow"} · {name}</p>
      </div>

      <div className="relative">
        <div aria-hidden className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />
        <motion.div
          aria-hidden
          className="absolute left-[11px] top-2 bottom-2 w-px origin-top"
          style={{ scaleY: fill, background: `linear-gradient(to bottom, ${color}, var(--moon))` }}
        />
        <ol className="space-y-7">
          {nodes.map((n, i) => {
            const last = i === nodes.length - 1;
            return (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.8 }}
                transition={{ duration: 0.5, delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex gap-5"
              >
                <span
                  className={`relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    last ? "border-transparent" : "border-border bg-background"
                  }`}
                  style={last ? { background: color, boxShadow: `0 0 18px 2px ${color}` } : undefined}
                >
                  {last ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-background" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path d="M4 12.5 9.5 18 20 6" />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? color : "var(--moon)" }} />
                  )}
                </span>
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-widest text-muted">{n.label}</p>
                  <p className={`mt-1 ${last ? "text-lg font-medium" : ""}`}>{n.text}</p>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
