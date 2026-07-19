"use client";

import { motion } from "framer-motion";

const features = [
  { title: "Smart triage", body: "Every inbound item is scored and routed before a human ever sees it." },
  { title: "Drafts, not decisions", body: "Orbit writes the reply. A person always approves what goes out." },
  { title: "Full audit trail", body: "Every action the agent takes is logged, reversible, and explainable." },
  { title: "Works with what you have", body: "Gmail, Slack, HubSpot, Zendesk — no rip-and-replace required." },
  { title: "Cost-aware by design", body: "Cheap checks run first; expensive reasoning only happens when it matters." },
  { title: "Human escalation", body: "Anything ambiguous lands in front of a person automatically, no dropped balls." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

export function FeatureGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl mb-16"
      >
        <p className="text-xs uppercase tracking-widest text-accent-2 mb-3">Features</p>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
          Built for teams who don&apos;t trust black boxes.
        </h2>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -4 }}
            className="rounded-2xl border border-border bg-[#0d0e15] p-6 transition-colors hover:border-accent/40"
          >
            <h3 className="font-medium mb-2">{f.title}</h3>
            <p className="text-sm text-muted">{f.body}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
