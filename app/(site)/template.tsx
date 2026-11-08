"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// The very first page load skips the warp so the hero intro plays on its own.
const session = { loaded: false };

/** Warp-speed streaks on every page change, then the page eases in from a blur. */
export default function Template({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  // Captured once per mount: has the site already loaded once?
  const [warp] = useState(() => session.loaded);
  useEffect(() => {
    session.loaded = true;
  }, []);

  const streaks = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        angle: (i / 36) * 360 + ((i * 53) % 10),
        delay: ((i * 37) % 10) / 60,
        length: 30 + ((i * 29) % 40),
      })),
    []
  );

  const play = warp && !reduced;

  return (
    <>
      {play && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.35, delay: 0.45 }}
        >
          <motion.div
            className="absolute inset-0 bg-background"
            initial={{ opacity: 0.85 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          {streaks.map((s, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 h-px origin-left"
              style={{ transform: `rotate(${s.angle}deg)`, width: "75vmax" }}
            >
              <motion.span
                className="absolute left-0 top-0 h-px rounded-full"
                style={{
                  width: `${s.length}%`,
                  background: "linear-gradient(to right, transparent, var(--moon))",
                }}
                initial={{ x: "5%", opacity: 0 }}
                animate={{ x: "160%", opacity: [0, 1, 0] }}
                transition={{ duration: 0.6, delay: s.delay, ease: [0.5, 0, 0.75, 0] }}
              />
            </div>
          ))}
        </motion.div>
      )}
      {/* A lingering transform/filter would break position:fixed (GSAP pinning) inside the
          page, so both are cleared once the entrance finishes; first load gets no wrapper. */}
      {play ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.985, filter: "blur(6px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transitionEnd: { filter: "none", transform: "none" } }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      ) : (
        children
      )}
    </>
  );
}
