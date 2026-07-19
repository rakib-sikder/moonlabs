"use client";

import { motion } from "framer-motion";

export function CTAFooter() {
  return (
    <section id="cta" className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6 }}
          className="text-3xl sm:text-4xl font-semibold tracking-tight"
        >
          Stop triaging by hand.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-4 text-muted"
        >
          Set up your first workflow in an afternoon. No credit card required.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8"
        >
          <a href="#" className="inline-block rounded-full bg-accent text-white text-sm font-medium px-7 py-3 hover:opacity-90 transition-opacity">
            Start free trial
          </a>
        </motion.div>
      </div>

      <footer className="relative border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <span>orbit — animation showcase build</span>
          <span>Built with Next.js, GSAP ScrollTrigger &amp; Framer Motion</span>
        </div>
      </footer>
    </section>
  );
}
