"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const quotes = [
  {
    quote:
      "We went from a 2-day lead response time to under 10 minutes. Orbit drafts the reply; my team just approves it.",
    name: "Priya Nair",
    role: "Head of Growth, BrightLoop",
  },
  {
    quote:
      "The audit trail is what sold our compliance team. Every automated action is logged and reversible.",
    name: "Daniel Osei",
    role: "Ops Lead, Northgate Logistics",
  },
  {
    quote:
      "It only escalates the genuinely ambiguous cases. That restraint is rarer than the automation itself.",
    name: "Marcus Webb",
    role: "Founder, Fieldworks Co.",
  },
];

const variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 40, filter: "blur(6px)", scale: 0.97 }),
  center: { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -40, filter: "blur(6px)", scale: 0.97 }),
};

export function Testimonials() {
  const [[index, direction], setIndex] = useState<[number, number]>([0, 1]);

  function go(next: number, dir: number) {
    setIndex([(next + quotes.length) % quotes.length, dir]);
  }

  useEffect(() => {
    const id = setInterval(() => go(index + 1, 1), 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  return (
    <section id="testimonials" className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="text-xs uppercase tracking-widest text-accent-2 mb-10">Customers</p>
      <div className="relative h-64 sm:h-40 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            drag="x"
            dragSnapToOrigin
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) go(index + 1, 1);
              else if (info.offset.x > 60) go(index - 1, -1);
            }}
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
          >
            <p className="text-xl sm:text-2xl font-medium leading-snug">&ldquo;{quotes[index].quote}&rdquo;</p>
            <p className="mt-6 text-sm text-muted">
              {quotes[index].name} · {quotes[index].role}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-center gap-2 mt-6">
        {quotes.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i, i > index ? 1 : -1)}
            aria-label={`Show testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted"}`}
          />
        ))}
      </div>
    </section>
  );
}
