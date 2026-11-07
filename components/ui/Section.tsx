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
    <div className={`mb-12 max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="mb-3 text-xs uppercase tracking-widest text-moon">{eyebrow}</p>
      <RevealText
        text={title}
        highlight={highlight}
        className="text-3xl sm:text-4xl font-semibold tracking-tight leading-[1.1]"
      />
      {intro && (
        <Reveal delay={0.15}>
          <p className="mt-4 text-muted leading-relaxed">{intro}</p>
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
