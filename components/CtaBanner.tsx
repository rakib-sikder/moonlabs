"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "./ui/Magnetic";
import { RevealText } from "./ui/RevealText";

/** Closing call-to-action: a huge moon rises over the horizon as the section scrolls in. */
export function CtaBanner({
  title = "Find out what you can automate.",
  body = "Book a free 30-minute automation audit. We map your busywork and show you what can run on its own — no obligation.",
}: {
  title?: string;
  body?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const moonY = useTransform(scrollYProgress, [0, 1], ["35%", "0%"]);
  const glow = useTransform(scrollYProgress, [0.3, 1], [0, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-[min(52vw,420px)] text-center">
        <RevealText text={title} className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08]" />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 text-muted leading-relaxed"
        >
          {body}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Magnetic>
            <Link
              href="/contact"
              className="inline-flex rounded-full bg-accent text-accent-ink text-sm font-medium px-7 py-3 hover:opacity-90 transition-opacity"
            >
              Book a free audit
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/services"
              className="inline-flex rounded-full border border-border bg-surface/60 backdrop-blur text-sm font-medium px-7 py-3 hover:border-muted transition-colors"
            >
              Browse services
            </Link>
          </Magnetic>
        </motion.div>
      </div>

      {/* Moonrise */}
      <motion.div
        aria-hidden
        style={{ y: moonY }}
        className="pointer-events-none absolute left-1/2 bottom-0 w-[min(140vw,1400px)] -translate-x-1/2 translate-y-[76%]"
      >
        <motion.div
          style={{ opacity: glow }}
          className="absolute inset-[-12%] rounded-full blur-3xl"
        >
          <div
            className="h-full w-full rounded-full"
            style={{ background: "radial-gradient(circle, color-mix(in srgb, var(--accent) 35%, transparent) 40%, transparent 62%)" }}
          />
        </motion.div>
        <div
          className="relative aspect-square w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--moon) 30%, var(--surface)) 0%, var(--surface-2) 22%, var(--background) 60%)",
            boxShadow:
              "inset 0 2px 0 0 color-mix(in srgb, var(--moon) 70%, transparent), 0 -10px 60px -10px color-mix(in srgb, var(--accent) 60%, transparent)",
          }}
        />
      </motion.div>
    </section>
  );
}
