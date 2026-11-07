"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { HeroMockup } from "./HeroMockup";

const words = "We automate the work your team keeps putting off.".split(" ");

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
  const reduced = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 140, damping: 18, mass: 0.4 });
  const sy = useSpring(my, { stiffness: 140, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [0, 1], [-7, 7]);
  const rotateX = useTransform(sy, [0, 1], [6, -6]);

  function handleTilt(e: React.MouseEvent<HTMLDivElement>) {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  }

  function resetTilt() {
    mx.set(0.5);
    my.set(0.5);
  }

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
        className="text-sm text-moon font-mono mb-6 tracking-wide"
      >
        AUTOMATION AGENCY
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
        Moonlabs builds AI agents, workflows and integrations that handle your leads, support,
        invoices and data entry — so your people do the work only people can do.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.85 }}
        className="mt-9 flex items-center gap-4"
      >
        <Link href="/contact" className="rounded-full bg-accent text-accent-ink text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity">
          Book a free audit
        </Link>
        <Link href="/services" className="rounded-full border border-border text-sm font-medium px-6 py-3 hover:border-muted transition-colors">
          See services
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleTilt}
        onMouseLeave={resetTilt}
        className="relative mt-20 w-full max-w-3xl [perspective:1200px]"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div style={{ rotateX, rotateY }} className="[transform-style:preserve-3d]">
            <HeroMockup />
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
