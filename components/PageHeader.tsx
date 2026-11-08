"use client";

import { motion } from "framer-motion";
import { RevealText } from "./ui/RevealText";
import { MoonImage } from "./ui/MoonImage";

/** Shared header for inner pages, with a slowly turning orbit system on the right. */
export function PageHeader({
  eyebrow,
  title,
  intro,
  accentColor,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  /** Planet colour for service pages; defaults to the brand accent. */
  accentColor?: string;
}) {
  const planet = accentColor ?? "var(--accent)";
  return (
    <header className="relative mb-14 overflow-hidden border-b border-border px-6 pt-32 pb-14">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-10%] h-[560px] w-[560px] rounded-full blur-3xl"
        style={{ opacity: "var(--glow-strength)", background: `radial-gradient(circle, ${planet} 0%, transparent 70%)` }}
      />

      {/* Orbit rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-180px] top-6 hidden h-[480px] w-[480px] md:block lg:right-[-60px] [mask-image:linear-gradient(to_bottom,black_55%,transparent_92%)]"
      >
        {[1, 0.74, 0.5].map((s, i) => (
          <div
            key={s}
            className="orbit-spin absolute left-1/2 top-1/2 rounded-full border border-foreground/10"
            style={{
              width: `${s * 100}%`,
              height: `${s * 100}%`,
              marginLeft: `${-s * 50}%`,
              marginTop: `${-s * 50}%`,
              ["--orbit-speed" as string]: `${28 - i * 7}s`,
              animationDirection: i % 2 ? "reverse" : "normal",
            }}
          >
            {/* Small shaded planet riding the ring */}
            <span
              className="absolute left-1/2 -translate-x-1/2 rounded-full"
              style={{
                width: [14, 9, 7][i],
                height: [14, 9, 7][i],
                top: -[7, 4.5, 3.5][i],
                background: `radial-gradient(circle at 32% 30%, color-mix(in srgb, ${[planet, "#5ee0d0", "#ffc76b"][i]} 45%, white), ${[planet, "#5ee0d0", "#ffc76b"][i]} 55%, color-mix(in srgb, ${[planet, "#5ee0d0", "#ffc76b"][i]} 35%, black))`,
                boxShadow: `0 0 14px 2px color-mix(in srgb, ${[planet, "#5ee0d0", "#ffc76b"][i]} 45%, transparent)`,
              }}
            />
          </div>
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <MoonImage size={120} glow={planet} />
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xs uppercase tracking-widest text-moon mb-4"
        >
          {eyebrow}
        </motion.p>
        <RevealText
          as="h1"
          text={title}
          className="max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08]"
        />
        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 max-w-2xl text-lg text-muted leading-relaxed"
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  );
}
