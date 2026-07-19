# Orbit — Animation Showcase Landing Page

A fictional SaaS landing page built purely to showcase motion/interaction design: staggered
text reveals, a GSAP ScrollTrigger pinned horizontal-scroll section, scroll-aware nav,
animated stat counters, and an autoplaying testimonial carousel. No backend — this project
is a pure frontend/animation piece, separate from the AI projects and the portfolio itself.

## Highlights

- **`components/HowItWorks.tsx`** — the flagship piece: a vertically-pinned section where
  scroll progress drives a horizontal panel track via GSAP's `ScrollTrigger` (`scrub` + `pin`),
  using the official `@gsap/react` `useGSAP` hook for React-safe setup/cleanup.
- **`components/Hero.tsx`** — per-word staggered headline reveal (Framer Motion `variants` +
  `staggerChildren`) with a floating mockup card.
- **`components/Stats.tsx`** — numbers count up from 0 once scrolled into view, using
  `useInView` + `animate()` on a `MotionValue` (no re-renders per frame).
- **`components/Nav.tsx`** — background/border fade in as you scroll, driven by
  `useScroll` + `useTransform`.
- **`components/Testimonials.tsx`** — autoplaying `AnimatePresence` crossfade carousel.

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger + `@gsap/react`
· Framer Motion

## Getting started

```bash
npm install
npm run dev
```

No environment variables needed — this is a static frontend piece.
