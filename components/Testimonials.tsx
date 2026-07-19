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

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % quotes.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="testimonials" className="mx-auto max-w-3xl px-6 py-28 text-center">
      <p className="text-xs uppercase tracking-widest text-accent-2 mb-10">Customers</p>
      <div className="relative h-56 sm:h-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
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
            onClick={() => setIndex(i)}
            aria-label={`Show testimonial ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-accent" : "w-1.5 bg-border"}`}
          />
        ))}
      </div>
    </section>
  );
}
