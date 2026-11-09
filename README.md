# Moonlab — Automation agency website

Marketing site for Moonlab, an agency that automates repetitive business work: leads,
support, invoices, data entry, custom AI agents and more. Space/moon themed, motion-heavy.

(Formerly the "Orbit" animation showcase — the GSAP and Framer Motion work carries over.)

## Pages

Home, Services (+ one page per service), Industries, How it works, Work, Pricing,
ROI calculator, About, Contact, FAQ. Brand, navigation, services and industries all live in
[`lib/site.ts`](lib/site.ts) — edit copy there, not in components.

## Build stages

1. ✅ Rebrand, palette tokens, multi-page structure, mobile menu, footer, fake data removed
2. ✅ Space visuals — 3D moon + service-planet hero, grid + starfield backdrop, comet cursor,
   smooth scroll, warp page transitions, auto light/dark (OS setting), no-WebGL fallback
3. ✅ Full content: 8 service pages, 8 industry pages, how it works, 3 case studies, pricing,
   working ROI calculator, about, FAQ, security
4. ✅ Contact form → Telegram (validation, honeypot, rate limit), optional Cal.com link
5. ✅ SEO: metadata, sitemap.xml, robots.txt, generated Open Graph image, FAQ structured data
6. Deploy (set the env vars in `.env.example` on the host)

## Stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · GSAP + ScrollTrigger + `@gsap/react` ·
Framer Motion · Three.js (React Three Fiber + drei) · Lenis

## Environment

Copy `.env.example` to `.env.local`. The contact form needs `TELEGRAM_BOT_TOKEN` and
`TELEGRAM_CHAT_ID`; without them it shows a friendly "temporarily unavailable" message.
Prices live in `lib/content/company.ts`.

## Getting started

```bash
npm install
npm run dev
```
