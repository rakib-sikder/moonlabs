"use client";

import { useEffect, useState } from "react";

export type ThemeColors = {
  isDark: boolean;
  accent: string;
  moon: string;
  foreground: string;
  muted: string;
  border: string;
};

const FALLBACK: ThemeColors = {
  isDark: true,
  accent: "#f5b24e",
  moon: "#ece6d8",
  foreground: "#eef0f7",
  muted: "#a9adb6",
  border: "#1d2135",
};

function read(): ThemeColors {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string, f: string) => cs.getPropertyValue(n).trim() || f;
  return {
    isDark: !window.matchMedia("(prefers-color-scheme: light)").matches,
    accent: v("--accent", FALLBACK.accent),
    moon: v("--moon", FALLBACK.moon),
    foreground: v("--foreground", FALLBACK.foreground),
    muted: v("--muted", FALLBACK.muted),
    border: v("--border", FALLBACK.border),
  };
}

/** Palette tokens for canvas/WebGL code, kept in sync with the OS light/dark setting. */
export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(FALLBACK);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const update = () => setColors(read());
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return colors;
}

/** True when the user asked the OS for reduced motion. */
export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
