"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { loadMoonMaps, MOON_COLOR_2K, MOON_COLOR_4K, renderMoonSphere } from "@/lib/moonTexture";
import { services } from "@/lib/site";

const ORBITERS = [
  { color: services[0].color, size: 12, speed: 0.22, phase: 0.4, rx: 0.56, ry: 0.11 },
  { color: services[2].color, size: 8, speed: 0.31, phase: 2.6, rx: 0.5, ry: 0.08 },
  { color: services[3].color, size: 10, speed: 0.17, phase: 4.4, rx: 0.62, ry: 0.13 },
];

/** A planet circling the moon's horizon: in front of the moon on the near half, hidden behind it on the far half. */
function Orbiter({ o, t, width }: { o: (typeof ORBITERS)[number]; t: MotionValue<number>; width: number }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const z = useMotionValue(1);
  const s = useMotionValue(1);
  useAnimationFrame(() => {
    const a = t.get() * o.speed + o.phase;
    x.set(Math.cos(a) * o.rx * width);
    y.set(Math.sin(a) * o.ry * width);
    const front = Math.sin(a) > 0;
    z.set(front ? 3 : 0);
    s.set(0.75 + 0.25 * (Math.sin(a) + 1) / 2);
  });
  return (
    <motion.span
      aria-hidden
      className="absolute left-1/2 top-0 rounded-full"
      style={{
        x,
        y,
        zIndex: z,
        scale: s,
        width: o.size,
        height: o.size,
        marginLeft: -o.size / 2,
        marginTop: -o.size / 2,
        background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${o.color} 50%, white), ${o.color} 60%)`,
        boxShadow: `0 0 16px 3px color-mix(in srgb, ${o.color} 55%, transparent)`,
      }}
    />
  );
}

export function Moonrise({ rise }: { rise: MotionValue<string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [src, setSrc] = useState<string | null>(null);
  const [width, setWidth] = useState(1200);
  const reduced = useReducedMotion();
  const t = useMotionValue(0);

  useAnimationFrame((time) => {
    if (!reduced) t.set(time / 1000);
  });

  // Render the moon once, shortly before the section scrolls into view.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(el.offsetWidth);
    measure();
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const size = Math.min(1800, Math.round(el.offsetWidth * Math.min(window.devicePixelRatio || 1, 1.5)));
        // Phones get the 2k map; larger screens the 4k one for a crisp horizon.
        loadMoonMaps(el.offsetWidth < 900 ? MOON_COLOR_2K : MOON_COLOR_4K)
          .then((maps) => {
            const canvas = renderMoonSphere(maps, size, { portion: 0.27, light: [-0.35, 0.9, 0.3], ambient: 0.02 });
            setSrc(canvas.toDataURL("image/png"));
          })
          .catch(() => {
            /* keep the gradient fallback */
          });
      },
      { rootMargin: "800px" }
    );
    io.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      io.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      aria-hidden
      style={{ y: rise }}
      className="pointer-events-none absolute left-1/2 bottom-0 w-[min(150vw,1500px)] -translate-x-1/2"
    >
      {/* Atmosphere: a bright rim hugging the limb, fading into a soft accent haze */}
      <div
        className="absolute left-0 top-0 aspect-square w-full rounded-full"
        style={{
          boxShadow:
            "0 -2px 30px 2px color-mix(in srgb, var(--moon) 45%, transparent), 0 -20px 90px 10px color-mix(in srgb, var(--accent) 35%, transparent)",
        }}
      />
      <div className="relative" style={{ aspectRatio: `1 / 0.27` }}>
        {src ? (
          <motion.img
            src={src}
            alt=""
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 h-full w-full"
            style={{ zIndex: 1, maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)" }}
          />
        ) : (
          <div
            className="absolute inset-0 rounded-t-full"
            style={{
              background: "radial-gradient(ellipse at 50% 0%, #c9ccd6 0%, #5c5f6e 45%, transparent 85%)",
              zIndex: 1,
              maskImage: "linear-gradient(to bottom, black 35%, transparent 95%)",
            }}
          />
        )}
        {/* Orbit paths and planets circling the horizon */}
        <div className="absolute left-1/2 top-[22%] h-0 w-0">
          {ORBITERS.map((o, i) => (
            <span
              key={i}
              className="absolute rounded-[50%] border border-foreground/10"
              style={{
                zIndex: 0,
                width: o.rx * 2 * width,
                height: o.ry * 2 * width,
                left: -o.rx * width,
                top: -o.ry * width,
              }}
            />
          ))}
          {ORBITERS.map((o, i) => (
            <Orbiter key={i} o={o} t={t} width={width} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
