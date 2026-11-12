"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroPile } from "./HeroPile";

const lines = [
  { words: ["We", "automate", "the", "work"] },
  { words: ["your", "team", "keeps"] },
  { words: ["putting", "off."], highlight: true },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  let wordIndex = 0;

  return (
    <section className="relative overflow-hidden">
      {/* Warm glow behind the pile */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-12%] left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full blur-3xl md:bottom-auto md:left-auto md:right-[-8%] md:top-[10%] md:translate-x-0"
        style={{
          opacity: "var(--glow-strength)",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
        }}
      />

      {/* Phones: copy, then the pile underneath. Tablet and up: side by side. */}
      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-28 md:min-h-[100svh] md:grid-cols-[1.08fr_1fr] md:gap-6 md:pb-12 md:pt-24 lg:gap-12">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 font-mono text-xs tracking-wide text-moon backdrop-blur"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          AUTOMATION AGENCY · NOW BOOKING
        </motion.p>

        <h1 className="text-[2rem] leading-[1.06] sm:text-5xl md:text-[2.5rem] lg:text-5xl xl:text-[3.4rem] font-semibold tracking-tight">
          {lines.map((line, li) => (
            <span key={li} className="sm:block md:inline">
              {line.words.map((w) => {
                const i = wordIndex++;
                return (
                  <span key={w + i} className="inline-block overflow-hidden pb-[0.08em] mx-[0.12em] align-top md:ml-0 md:mr-[0.24em]">
                    <motion.span
                      className={`inline-block ${line.highlight ? "text-moonlight" : ""}`}
                      initial={{ y: "105%", opacity: 0, filter: "blur(10px)" }}
                      animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.9, delay: 0.25 + i * 0.06, ease }}
                    >
                      {w}
                    </motion.span>
                  </span>
                );
              })}
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.0, ease }}
          className="mt-7 max-w-xl text-lg text-muted leading-relaxed"
        >
          We build AI agents and workflows that answer leads, sort support email, chase invoices and
          enter data. Your team gets those hours back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15, ease }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3 md:justify-start"
        >
          <Magnetic>
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden whitespace-nowrap rounded-full bg-accent px-6 py-3 md:max-lg:px-5 text-sm font-medium text-accent-ink"
            >
              <span
                aria-hidden
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
              />
              Book a free audit
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </Magnetic>
          <Magnetic>
            <Link
              href="/services"
              className="inline-flex whitespace-nowrap rounded-full border border-border bg-surface/50 px-6 py-3 md:max-lg:px-5 text-sm font-medium backdrop-blur transition-colors hover:border-muted"
            >
              Explore services
            </Link>
          </Magnetic>
        </motion.div>

        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
          className="mx-auto w-full max-w-[560px]"
        >
          <HeroPile className="w-full" />
        </motion.div>
      </div>
    </section>
  );
}
