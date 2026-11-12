"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroPile } from "./HeroPile";

const lines = [
  { words: ["We", "automate", "the", "work"] },
  { words: ["your", "team", "keeps"] },
  { words: ["putting", "off."], highlight: true },
];

const ease = [0.16, 1, 0.3, 1] as const;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduced = !!useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const sceneY = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  const sceneScale = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.9], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  let wordIndex = 0;

  return (
    <section ref={ref} className="relative min-h-[100svh] overflow-hidden">
      {/* Warm glow behind the pile */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[8%] right-[-10%] lg:right-[2%] h-[680px] w-[680px] rounded-full blur-3xl"
        style={{
          opacity: "var(--glow-strength)",
          background: "radial-gradient(circle, var(--accent) 0%, transparent 65%)",
        }}
      />

      <motion.div
        style={{ y: sceneY, scale: sceneScale, opacity: sceneOpacity }}
        className="absolute inset-0"
      >
        {/* Stacked above the copy on small screens, beside it from xl up. */}
        <div className="absolute left-0 right-0 top-[13svh] px-4 xl:left-[55%] xl:top-1/2 xl:-translate-y-1/2 xl:pl-0 xl:pr-[3%]">
          <HeroPile className="mx-auto w-full max-w-[560px]" />
        </div>
      </motion.div>

      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="hero-copy pointer-events-none relative z-10 mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-6 pb-20 pt-[52svh] xl:justify-center xl:pt-24 xl:pb-0"
      >
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

        <h1 className="text-[2.45rem] leading-[1.04] sm:text-6xl xl:text-[3.6rem] font-semibold tracking-tight">
          {lines.map((line, li) => (
            <span key={li} className="block">
              {line.words.map((w) => {
                const i = wordIndex++;
                return (
                  <span key={w + i} className="inline-block overflow-hidden pb-[0.08em] mr-[0.24em] align-top">
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
          className="mt-7 max-w-md text-lg text-muted leading-relaxed"
        >
          We build AI agents and workflows that answer leads, sort support email, chase invoices and
          enter data. Your team gets those hours back.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.15, ease }}
          className="pointer-events-auto mt-9 flex flex-wrap items-center gap-3"
        >
          <Magnetic>
            <Link
              href="/contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink"
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
              className="inline-flex rounded-full border border-border bg-surface/50 px-6 py-3 text-sm font-medium backdrop-blur transition-colors hover:border-muted"
            >
              Explore services
            </Link>
          </Magnetic>
        </motion.div>

      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 lg:block"
        aria-hidden
      >
        <div className="flex h-9 w-5 justify-center rounded-full border border-border pt-1.5">
          <motion.span
            className="h-1.5 w-1 rounded-full bg-muted"
            animate={reduced ? undefined : { y: [0, 12, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </motion.div>
    </section>
  );
}
