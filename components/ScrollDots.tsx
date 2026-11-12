"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/useTheme";

/**
 * Page position, shown as a column of dots on the right edge: one dot per section,
 * the current one stretched into a pill. Click a dot to jump to that section.
 * Only on wide screens, where the edge is empty; hidden on short pages.
 */
export function ScrollDots() {
  const pathname = usePathname();
  const sections = useRef<HTMLElement[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const line = window.innerHeight * 0.4;
      let current = 0;
      sections.current.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= line) current = i;
      });
      setActive(current);
    };
    const collect = () => {
      sections.current = [...document.querySelectorAll<HTMLElement>("main section")].filter(
        (s) => !s.parentElement?.closest("section") && s.offsetHeight > 200,
      );
      setLabels(
        sections.current.map((s, i) => s.querySelector("h1, h2")?.textContent?.trim().slice(0, 60) || `Section ${i + 1}`),
      );
      update();
    };
    const frame = requestAnimationFrame(collect);
    // Sections that render late (after data or fonts load) change the list.
    const late = setTimeout(collect, 1500);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", collect);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(late);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", collect);
    };
  }, [pathname]);

  if (labels.length < 3) return null;

  return (
    <nav
      aria-label="Sections on this page"
      className="fixed right-3 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end xl:flex"
    >
      {labels.map((label, i) => (
        <button
          key={i}
          type="button"
          aria-label={`Go to: ${label}`}
          aria-current={i === active ? "true" : undefined}
          onClick={() =>
            sections.current[i]?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" })
          }
          className="group relative flex h-5 w-6 items-center justify-center"
        >
          <span
            className={`w-1.5 rounded-full transition-all duration-300 ${
              i === active ? "h-4 bg-accent" : "h-1.5 bg-muted/40 group-hover:bg-muted"
            }`}
          />
          <span className="pointer-events-none absolute right-full mr-2 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            {label}
          </span>
        </button>
      ))}
    </nav>
  );
}
