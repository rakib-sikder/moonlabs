# Moonlabs — Automation agency website

Marketing site for Moonlabs, an agency that automates repetitive business work: leads,
support, invoices, data entry, custom AI agents and more. Space/moon themed, motion-heavy.

(Formerly the "Orbit" animation showcase — the GSAP and Framer Motion work carries over.)

## Pages

Home, Services (+ one page per service), Industries, How it works, Work, Pricing,
ROI calculator, About, Contact, FAQ. Brand, navigation, services and industries all live in
[`lib/site.ts`](lib/site.ts) — edit copy there, not in components.

## Build stages

1. ✅ Rebrand, palette tokens, multi-page structure, mobile menu, footer, fake data removed
2. Space visuals — starfield, 3D moon + service planets hero, warp transitions, mobile fallback
3. Services, How it works and Work pages in full
4. Pricing, ROI calculator, About
5. Contact form → Telegram, Cal.com booking
6. SEO, performance, deploy

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger + `@gsap/react` ·
Framer Motion

## Getting started

```bash
npm install
npm run dev
```
