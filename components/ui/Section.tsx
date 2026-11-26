"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { RevealText } from "./RevealText";

/** Fades and lifts its children into view once. */
export function Reveal({
  children,
  delay = 0,
  className = "",
  y = 20,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Eyebrow + revealing title + optional intro, used to open every content section. */
export function SectionHeading({
  eyebrow,
  title,
  intro,
  highlight,
  center = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  highlight?: string[];
  center?: boolean;
}) {
  return (
    <div className={`mb-14 max-w-3xl sm:mb-16 ${center ? "mx-auto text-center" : ""}`}>
      <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-moon">
        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
        {eyebrow}
      </p>
      <RevealText
        text={title}
        highlight={highlight}
        className="font-display text-balance text-[2.1rem] font-bold leading-[1.04] tracking-[-0.035em] sm:text-5xl lg:text-[3.6rem]"
      />
      {intro && (
        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-[1.2rem]">{intro}</p>
        </Reveal>
      )}
    </div>
  );
}

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2/70 px-2.5 py-1 text-xs text-muted">
      {color && <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />}
      {children}
    </span>
  );
}

export function Check({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-4 w-4 shrink-0 text-moon ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M4 12.5 9.5 18 20 6" />
    </svg>
  );
}
