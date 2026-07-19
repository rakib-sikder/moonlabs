"use client";

import { motion } from "framer-motion";

const words = "Automate the busywork your team keeps putting off.".split(" ");

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.045, delayChildren: 0.15 },
  },
};

const word = {
  hidden: { y: "110%" },
  show: { y: "0%", transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const } },
};

export function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[560px] w-[560px] rounded-full opacity-25 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-sm text-accent-2 font-mono mb-6 tracking-wide"
      >
        NOW WITH AGENT WORKFLOWS
      </motion.p>

      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-4xl text-center text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]"
      >
        {words.map((w, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.28em] align-top">
            <motion.span variants={word} className="inline-block">
              {w}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.7 }}
        className="mt-6 max-w-xl text-center text-muted"
      >
        Orbit watches your workflows, drafts the replies, and files the paperwork — so your
        team ships instead of triaging.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="mt-9 flex items-center gap-4"
      >
        <a href="#cta" className="rounded-full bg-accent text-white text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity">
          Start free trial
        </a>
        <a href="#how" className="rounded-full border border-border text-sm font-medium px-6 py-3 hover:border-muted transition-colors">
          See how it works
        </a>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-20 w-full max-w-3xl"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-2xl border border-border bg-[#0d0e15] shadow-2xl shadow-black/50 p-6"
        >
          <div className="flex gap-1.5 mb-4">
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
          </div>
          <div className="space-y-2.5">
            {[92, 68, 84, 45].map((w, i) => (
              <div key={i} className="h-3 rounded bg-white/[0.06]" style={{ width: `${w}%` }} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
