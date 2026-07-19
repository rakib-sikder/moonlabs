"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export function Nav() {
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 120], ["rgba(8,9,13,0)", "rgba(8,9,13,0.8)"]);
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  return (
    <motion.nav
      style={{ background }}
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md"
    >
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 inset-x-0 h-px bg-border"
      />
      <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <span className="font-semibold tracking-tight">orbit</span>
        <div className="hidden sm:flex items-center gap-8 text-sm text-muted">
          <a href="#how" className="hover:text-foreground transition-colors">How it works</a>
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#testimonials" className="hover:text-foreground transition-colors">Customers</a>
        </div>
        <a
          href="#cta"
          className="rounded-full bg-accent text-white text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
        >
          Get started
        </a>
      </div>
    </motion.nav>
  );
}
