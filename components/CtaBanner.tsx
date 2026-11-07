"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Magnetic } from "./ui/Magnetic";
import { RevealText } from "./ui/RevealText";
import { Moonrise } from "./Moonrise";

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
  const moonY = useTransform(scrollYProgress, [0, 1], ["40%", "0%"]);

  return (
    <section ref={ref} className="relative overflow-hidden">
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-32 pb-[min(30vw,420px)] text-center">
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

      <Moonrise rise={moonY} />
    </section>
  );
}
