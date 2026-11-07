"use client";

import { useEffect, useRef } from "react";
import { useThemeColors, prefersReducedMotion } from "@/lib/useTheme";

type P = { x: number; y: number; life: number; size: number };

/** A short glowing comet tail that follows the mouse. Mouse/trackpad only, never on touch. */
export function CometCursor() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const { accent } = useThemeColors();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches || prefersReducedMotion()) return;
    const el = canvas.current;
    const ctx = el?.getContext("2d");
    if (!el || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const parts: P[] = [];
    let raf = 0;
    let last: { x: number; y: number } | null = null;

    const resize = () => {
      el.width = window.innerWidth * dpr;
      el.height = window.innerHeight * dpr;
      el.style.width = `${window.innerWidth}px`;
      el.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const onMove = (e: PointerEvent) => {
      const p = { x: e.clientX, y: e.clientY };
      // Fill gaps on fast moves so the tail stays continuous.
      if (last) {
        const dx = p.x - last.x;
        const dy = p.y - last.y;
        const steps = Math.min(8, Math.floor(Math.hypot(dx, dy) / 6));
        for (let i = 1; i <= steps; i++)
          parts.push({ x: last.x + (dx * i) / steps, y: last.y + (dy * i) / steps, life: 1, size: 2.6 });
      }
      parts.push({ ...p, life: 1, size: 3 });
      last = p;
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.globalCompositeOperation = "lighter";
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life -= 0.045;
        if (p.life <= 0) {
          parts.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life * 0.55;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [accent]);

  return <canvas ref={canvas} aria-hidden className="pointer-events-none fixed inset-0 z-[70]" />;
}
