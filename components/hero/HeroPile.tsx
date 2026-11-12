"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/useTheme";

/**
 * Hero visual: the pile of chores a team keeps putting off, clearing itself.
 * A light lands on one note at a time, the chore is crossed out and stamped with
 * the hour it was handled, then the note drops into the "done" tray. When the pile
 * is empty it says so, and a fresh pile arrives.
 */
const chores = [
  { task: "Reply to the website lead", late: "waiting 3 days", at: "2:14 am", left: 2, top: 4, tilt: -5 },
  { task: "Chase invoice #1042", late: "14 days overdue", at: "2:15 am", left: 51, top: 9, tilt: 4 },
  { task: "Update the CRM", late: "2 weeks behind", at: "2:17 am", left: 8, top: 34, tilt: 3 },
  { task: "Send the weekly report", late: "skipped twice", at: "2:20 am", left: 55, top: 38, tilt: -3 },
  { task: "Ask happy customers for a review", late: "never done", at: "2:21 am", left: 0, top: 62, tilt: -2 },
  { task: "Sort the support inbox", late: "47 unread", at: "2:24 am", left: 47, top: 58, tilt: 5 },
];

// Where a finished note flies to: the tray in the bottom-right corner.
const TRAY = { left: 72, top: 84 };

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function HeroPile({ className = "" }: { className?: string }) {
  const [lit, setLit] = useState(-1);
  const [done, setDone] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let alive = true;
    (async () => {
      await wait(1400);
      while (alive) {
        for (let i = 0; i < chores.length && alive; i++) {
          setLit(i);
          await wait(1100);
          if (!alive) return;
          setDone(i + 1);
          await wait(600);
        }
        await wait(3200);
        if (!alive) return;
        setLit(-1);
        setDone(0);
        await wait(1500);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const cleared = done === chores.length;

  return (
    <div
      role="img"
      aria-label="A pile of overdue chores, such as replying to a lead, chasing an invoice and updating the CRM, being handled one by one overnight until none are left."
      className={`relative ${className}`}
      style={{ aspectRatio: "560 / 420" }}
    >
      <div aria-hidden className="absolute inset-0">
        {chores.map((c, i) => {
          const gone = i < done;
          const hit = gone || i === lit;
          return (
            <div
              key={c.task}
              className={`absolute w-[41%] rounded-[10px] border bg-surface-2 px-2.5 py-2 text-[11px] leading-snug shadow-[0_12px_30px_rgba(0,0,0,0.3)] transition-[left,top,transform,opacity,border-color,box-shadow] duration-[900ms] ease-[cubic-bezier(0.5,0,0.2,1)] sm:px-3.5 sm:py-3 sm:text-sm ${
                hit ? "border-accent" : "border-border"
              }`}
              style={{
                left: `${gone ? TRAY.left : c.left}%`,
                top: `${gone ? TRAY.top : c.top}%`,
                transform: gone ? "scale(0.25)" : `rotate(${c.tilt}deg)`,
                opacity: gone ? 0 : 1,
                boxShadow: hit && !gone ? "0 0 0 4px var(--accent-soft), 0 0 50px var(--accent-soft)" : undefined,
              }}
            >
              <span
                className={`font-medium transition-colors ${hit ? "text-muted line-through decoration-accent decoration-2" : ""}`}
              >
                {c.task}
              </span>
              <span
                className="mt-1 block font-mono text-[9.5px] sm:mt-1.5 sm:text-[11.5px]"
                style={{ color: hit ? "var(--ok)" : "var(--late)" }}
              >
                {hit ? `handled, ${c.at}` : c.late}
              </span>
            </div>
          );
        })}

        <p
          className={`absolute inset-x-0 top-[38%] text-center text-lg font-semibold transition-opacity duration-500 sm:text-2xl ${
            cleared ? "opacity-100" : "opacity-0"
          }`}
        >
          Nothing left to put off.
          <span className="mt-1 block text-xs font-normal text-muted sm:text-sm">The morning starts clean.</span>
        </p>

        <div className="absolute bottom-0 right-0 rounded-xl border border-dashed border-border bg-surface/80 px-3 py-1.5 text-[10px] text-muted sm:px-4 sm:py-2.5 sm:text-[13px]">
          <strong className="block text-lg leading-tight text-accent sm:text-[26px]">{done}</strong>
          handled without anyone
        </div>
      </div>
    </div>
  );
}
