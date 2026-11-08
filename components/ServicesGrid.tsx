"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { automationServices, serviceCategories, servicesIn, type Service } from "@/lib/site";
import { MiniOrbit } from "./ui/MiniOrbit";
import { serviceDetails } from "@/lib/content/service-details";
import { RevealText } from "./ui/RevealText";

// Client-side navigation with motion props on the same element.
const MotionLink = motion.create(Link);

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
};

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 25 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 25 });
  const glowX = useTransform(mx, [-0.5, 0.5], ["0%", "100%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["0%", "100%"]);
  const glowBackground = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(280px circle at ${x} ${y}, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%)`
  );

  function onMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <motion.div variants={item} style={{ perspective: 800 }} className="group relative">
      <MotionLink
        ref={ref}
        href={`/services/${service.slug}`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-sm p-6 transition-colors duration-300 group-hover:border-accent/40"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: `linear-gradient(to right, transparent, ${service.color}, transparent)` }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glowBackground }}
        />
        <div style={{ transform: "translateZ(30px)" }} className="relative flex items-start justify-between">
          <MiniOrbit color={service.color} speed={8 + index * 1.5} />
          <span className="font-mono text-xs text-moon">{String(index + 1).padStart(2, "0")}</span>
        </div>
        <h3 style={{ transform: "translateZ(20px)" }} className="relative mt-6 mb-2 text-lg font-medium">
          {service.name}
        </h3>
        <p style={{ transform: "translateZ(20px)" }} className="relative text-sm text-muted leading-relaxed flex-1">
          {service.short}
        </p>
        <div style={{ transform: "translateZ(15px)" }} className="relative mt-5 flex flex-wrap gap-1.5">
          {serviceDetails[service.slug].tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-border bg-background/50 px-2 py-0.5 text-[11px] text-muted transition-colors group-hover:border-foreground/15"
            >
              {t}
            </span>
          ))}
        </div>
        <div className="relative mt-5 flex items-center justify-between border-t border-border pt-4 text-xs text-muted">
          <span>Live in {serviceDetails[service.slug].setup}</span>
          <span>
          {service.items.length} automations
          <span className="ml-2 inline-block text-accent transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </div>
      </MotionLink>
    </motion.div>
  );
}

export function ServicesGrid() {
  return (
    <section id="services" className="mx-auto max-w-6xl px-6 py-28">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-14"
      >
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-widest text-moon mb-3">Automation · our core</p>
          <RevealText
            text="If your team does it twice a week, we can automate it."
            highlight={["automate", "it."]}
            className="text-3xl sm:text-4xl font-semibold tracking-tight"
          />
        </div>
        <Link href="/services" className="text-sm text-muted hover:text-foreground transition-colors shrink-0">
          All services →
        </Link>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {automationServices.map((s, i) => (
          <ServiceCard key={s.slug} service={s} index={i} />
        ))}
      </motion.div>

      {/* Everything around the automation, from the same team. */}
      <div className="mt-20 mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-widest text-moon mb-3">Beyond automation</p>
          <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">The website, app and marketing around it — same team.</h3>
        </div>
      </div>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {serviceCategories
          .filter((c) => !c.core)
          .map((c) => (
            <motion.div key={c.id} variants={item} className="h-full">
              <Link
                href={`/services#${c.id}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface/60 p-6 backdrop-blur-sm transition-colors hover:border-accent/40"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl opacity-20 transition-opacity duration-500 group-hover:opacity-40"
                  style={{ background: c.color }}
                />
                <p className="relative font-medium">{c.name}</p>
                <ul className="relative mt-4 flex-1 space-y-1.5 text-sm text-muted">
                  {servicesIn(c.id).map((s) => (
                    <li key={s.slug} className="flex items-center gap-2.5">
                      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: s.color }} />
                      {s.name}
                    </li>
                  ))}
                </ul>
                <span className="relative mt-5 text-xs text-accent">
                  Explore
                  <span className="ml-1 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </motion.div>
          ))}
      </motion.div>
    </section>
  );
}
