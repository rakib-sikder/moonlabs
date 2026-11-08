"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarCheck, FileCheck2, KeyRound } from "lucide-react";
import { Magnetic } from "./ui/Magnetic";

const assurances = [
  { icon: CalendarCheck, text: "30-minute call, free" },
  { icon: FileCheck2, text: "Fixed price before any work" },
  { icon: KeyRound, text: "Everything built in your accounts" },
];

/** Closing call to action: a quiet panel with the grid showing through and a warm glow at the top edge. */
export function CtaBanner({
  title = "Find out what you can automate.",
  body = "Book a free 30-minute audit. We go through a normal week with you, list the work that can run on its own, and estimate the hours it would save.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-6 pt-12 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border bg-surface"
      >
        {/* Grid texture and a warm light along the top edge */}
        <div aria-hidden className="grid-bg pointer-events-none absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-72 w-[46rem] -translate-x-1/2 rounded-full blur-3xl"
          style={{ background: "var(--accent)", opacity: "var(--glow-strength)" }}
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />

        <div className="relative grid gap-10 px-6 py-14 sm:px-12 sm:py-16 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">{body}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link
                  href="/contact"
                  className="inline-flex rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
                >
                  Book a free audit
                </Link>
              </Magnetic>
              <Link href="/pricing" className="inline-flex rounded-full px-5 py-3 text-sm font-medium text-muted transition-colors hover:text-foreground">
                See pricing →
              </Link>
            </div>
          </div>
          <ul className="divide-y divide-border rounded-2xl border border-border bg-background/50">
            {assurances.map((a) => (
              <li key={a.text} className="flex items-center gap-3 px-5 py-4 text-[15px]">
                <a.icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} />
                {a.text}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}
