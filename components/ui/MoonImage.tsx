"use client";

import { useEffect, useState } from "react";
import { loadMoonMaps, MOON_COLOR_2K, renderMoonSphere } from "@/lib/moonTexture";

/**
 * A small, real moon (NASA imagery) rendered once to an image, lit from the upper left.
 * Shows a soft gradient disc until the render is ready.
 */
export function MoonImage({ size, className = "", glow = "var(--accent)" }: { size: number; className?: string; glow?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    const px = Math.round(size * Math.min(window.devicePixelRatio || 1, 2));
    loadMoonMaps(MOON_COLOR_2K)
      .then((maps) => {
        if (!alive) return;
        const c = renderMoonSphere(maps, px, { upright: true, light: [-0.55, 0.45, 0.7], ambient: 0.025 });
        setSrc(c.toDataURL("image/png"));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [size]);

  return (
    <div
      aria-hidden
      className={`relative rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 ${size * 0.5}px ${size * 0.06}px color-mix(in srgb, ${glow} 35%, transparent)`,
      }}
    >
      <div
        className="absolute inset-0 rounded-full transition-opacity duration-700"
        style={{
          opacity: src ? 0 : 1,
          background: "radial-gradient(circle at 35% 32%, #d9dbe3, #8d909c 45%, #2a2c36 80%)",
        }}
      />
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- runtime-rendered data URL, nothing to optimise
        <img src={src} alt="" className="absolute inset-0 h-full w-full animate-[fadein_0.8s_ease-out]" />
      )}
      {/* Thin lit rim on the sunward edge */}
      <div
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{ boxShadow: "inset 2px 2px 6px -2px rgba(255,255,255,0.35)" }}
      />
    </div>
  );
}
