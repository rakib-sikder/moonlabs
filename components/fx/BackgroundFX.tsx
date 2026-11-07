"use client";

import { useEffect, useRef } from "react";
import { useThemeColors, prefersReducedMotion } from "@/lib/useTheme";

type Star = { x: number; y: number; r: number; base: number; speed: number; phase: number; depth: number };
type Shooting = { x: number; y: number; vx: number; vy: number; life: number };

/**
 * Fixed backdrop behind every page: a faint grid, a brighter grid revealed around the
 * cursor, and (in dark mode) a twinkling starfield with the odd shooting star.
 */
export function BackgroundFX() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const theme = useThemeColors();

  // Cursor position → CSS vars that drive the grid spotlight mask.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let raf = 0;
    let x = -999;
    let y = -999;
    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          document.documentElement.style.setProperty("--mx", `${x}px`);
          document.documentElement.style.setProperty("--my", `${y}px`);
        });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Starfield.
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    const shooting: Shooting[] = [];
    let raf = 0;
    let visible = true;

    const starRGB = theme.isDark ? "207,216,255" : "59,63,154";
    const maxAlpha = theme.isDark ? 0.9 : 0.35;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      el.width = w * dpr;
      el.height = h * dpr;
      el.style.width = `${w}px`;
      el.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((w * h) / 9000) * (theme.isDark ? 1 : 0.35));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.1 + 0.2,
        base: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 1.5 + 0.4,
        phase: Math.random() * Math.PI * 2,
        depth: Math.random() * 0.6 + 0.1,
      }));
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      // Stars drift slightly with scroll for depth.
      const scroll = window.scrollY;
      for (const s of stars) {
        const tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(t * 0.001 * s.speed + s.phase);
        const y = (((s.y - scroll * s.depth * 0.15) % h) + h) % h;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${starRGB},${(s.base * tw * maxAlpha).toFixed(3)})`;
        ctx.fill();
      }
      if (!reduced && theme.isDark) {
        if (Math.random() < 0.0025 && shooting.length < 2) {
          shooting.push({
            x: Math.random() * w * 0.8 + w * 0.2,
            y: Math.random() * h * 0.4,
            vx: -(Math.random() * 6 + 7),
            vy: Math.random() * 3 + 2.5,
            life: 1,
          });
        }
        for (let i = shooting.length - 1; i >= 0; i--) {
          const m = shooting[i];
          const tail = 14;
          const g = ctx.createLinearGradient(m.x, m.y, m.x - m.vx * tail, m.y - m.vy * tail);
          g.addColorStop(0, `rgba(${starRGB},${0.9 * m.life})`);
          g.addColorStop(1, `rgba(${starRGB},0)`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(m.x, m.y);
          ctx.lineTo(m.x - m.vx * tail, m.y - m.vy * tail);
          ctx.stroke();
          m.x += m.vx;
          m.y += m.vy;
          m.life -= 0.012;
          if (m.life <= 0 || m.x < -200 || m.y > h + 200) shooting.splice(i, 1);
        }
      }
    };

    const loop = (t: number) => {
      draw(t);
      if (!reduced && visible) raf = requestAnimationFrame(loop);
    };

    const onVis = () => {
      visible = document.visibilityState === "visible";
      cancelAnimationFrame(raf);
      if (visible) raf = requestAnimationFrame(loop);
    };

    resize();
    raf = requestAnimationFrame(loop);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [theme.isDark]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <canvas ref={canvas} className="absolute inset-0" />
      <div className="grid-bg absolute inset-0" />
      <div className="grid-glow absolute inset-0" />
    </div>
  );
}
