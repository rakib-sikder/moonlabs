"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => `${prefix}${Math.round(v).toLocaleString("en-US")}${suffix}`);
  useEffect(() => {
    const c = animate(mv, value, { duration: 0.6, ease: [0.16, 1, 0.3, 1] });
    return c.stop;
  }, [value, mv]);
  return <motion.span>{text}</motion.span>;
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  format: (v: number) => string;
  hint?: string;
}) {
  const id = label.toLowerCase().replace(/\W+/g, "-");
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
        <span className="font-mono text-sm text-moon">{format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-[var(--accent)]"
        style={{ background: `linear-gradient(to right, var(--accent) ${pct}%, var(--border) ${pct}%)` }}
      />
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
}

const WEEKS_PER_MONTH = 4.33;

export function RoiCalculator() {
  const [people, setPeople] = useState(5);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(20);
  const [share, setShare] = useState(60);

  const hoursSavedMonth = people * hours * WEEKS_PER_MONTH * (share / 100);
  const savedMonth = hoursSavedMonth * rate;
  const savedYear = savedMonth * 12;
  const fte = hoursSavedMonth / 160;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <div className="space-y-8 rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-sm">
        <Slider label="People doing repetitive work" value={people} min={1} max={50} step={1} onChange={setPeople} format={(v) => `${v}`} />
        <Slider
          label="Hours each spends on it per week"
          value={hours}
          min={1}
          max={30}
          step={1}
          onChange={setHours}
          format={(v) => `${v} h`}
          hint="Data entry, copy-paste, chasing, reporting, answering the same questions."
        />
        <Slider label="Cost of an hour of their time" value={rate} min={3} max={150} step={1} onChange={setRate} format={(v) => `$${v}`} hint="Salary plus overheads, divided by hours worked." />
        <Slider
          label="Share that can realistically be automated"
          value={share}
          min={10}
          max={90}
          step={5}
          onChange={setShare}
          format={(v) => `${v}%`}
          hint="Pick a cautious figure. The free audit gives you a measured one."
        />
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-accent/40 bg-surface-2/90 p-8 backdrop-blur-sm" style={{ boxShadow: "0 0 80px -30px var(--accent)" }}>
        <p className="font-mono text-xs uppercase tracking-widest text-moon">Your estimate</p>
        <div className="mt-6">
          <p className="text-sm text-muted">Saved every year</p>
          <p className="text-5xl font-semibold tracking-tight sm:text-6xl text-moonlight">
            <AnimatedNumber value={savedYear} prefix="$" />
          </p>
        </div>
        <dl className="mt-8 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-border bg-background/40 p-4">
            <dt className="text-xs text-muted">Hours back per month</dt>
            <dd className="mt-1 text-2xl font-semibold">
              <AnimatedNumber value={hoursSavedMonth} />
            </dd>
          </div>
          <div className="rounded-2xl border border-border bg-background/40 p-4">
            <dt className="text-xs text-muted">Saved per month</dt>
            <dd className="mt-1 text-2xl font-semibold">
              <AnimatedNumber value={savedMonth} prefix="$" />
            </dd>
          </div>
          <div className="col-span-2 rounded-2xl border border-border bg-background/40 p-4">
            <dt className="text-xs text-muted">Equivalent to</dt>
            <dd className="mt-1 text-lg">
              <span className="font-semibold">{fte.toFixed(1)}</span> full-time employees
            </dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-muted leading-relaxed">
          Estimate only: people × hours per week × {WEEKS_PER_MONTH} weeks × automatable share × hourly cost. Your audit
          replaces these guesses with measured numbers.
        </p>
        <Link
          href="/contact"
          className="mt-6 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
        >
          Book a free audit for real numbers
        </Link>
      </div>
    </div>
  );
}
