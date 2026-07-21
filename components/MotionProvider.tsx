"use client";

import { MotionConfig } from "framer-motion";

// reducedMotion="user" makes every framer-motion animation respect the
// OS-level prefers-reduced-motion setting; CSS/GSAP pieces are guarded separately.
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
