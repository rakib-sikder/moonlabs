"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, LayoutDashboard } from "lucide-react";
import {
  mainNav,
  primaryCta,
  resourceLinks,
  serviceCategories,
  servicesIn,
  signIn,
  type NavItem,
} from "@/lib/site";
import { industryDetails } from "@/lib/content/industries";
import { caseStudies } from "@/lib/content/company";
import { categoryIcons, fallbackIcon, industryIcons, resourceIcons, serviceIcons } from "@/lib/icons";
import { Logo } from "./Logo";

type MenuId = NonNullable<NavItem["menu"]>;

/* ---------- Mega-menu panels ---------- */

function ServicesPanel() {
  const [core, ...others] = serviceCategories;
  return (
    <div className="grid grid-cols-[1.35fr_2fr]">
      <div className="border-r border-border p-5">
        <Link href={`/services#${core.id}`} className="mb-3 flex items-center justify-between text-xs uppercase tracking-widest text-moon hover:text-foreground">
          Automation &amp; AI · core
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <ul className="grid grid-cols-1 gap-0.5">
          {servicesIn(core.id).map((s) => {
            const Icon = serviceIcons[s.slug];
            return (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="group flex gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2">
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted group-hover:text-accent" strokeWidth={1.6} />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-5">{s.name}</span>
                    <span className="block text-xs leading-snug text-muted">{s.short}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 p-5">
        {others.map((c) => {
          const CatIcon = categoryIcons[c.id];
          return (
            <div key={c.id}>
              <Link href={`/services#${c.id}`} className="mb-2 flex items-center gap-2 text-xs uppercase tracking-widest text-moon hover:text-foreground">
                <CatIcon className="h-3.5 w-3.5" strokeWidth={1.6} />
                {c.name}
              </Link>
              <ul className="space-y-0.5">
                {servicesIn(c.id).map((s) => {
                  const Icon = serviceIcons[s.slug] ?? fallbackIcon;
                  return (
                    <li key={s.slug}>
                      <Link href={`/services/${s.slug}`} className="group flex gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-surface-2">
                        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted group-hover:text-accent" strokeWidth={1.6} />
                        <span className="min-w-0">
                          <span className="block text-sm font-medium leading-5">{s.name}</span>
                          <span className="block text-xs leading-snug text-muted">{s.short}</span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SolutionsPanel() {
  const featured = caseStudies[0];
  return (
    <div className="grid grid-cols-[2fr_1fr]">
      <ul className="grid grid-cols-2 gap-0.5 p-5">
        {industryDetails.map((ind) => {
          const Icon = industryIcons[ind.slug];
          return (
            <li key={ind.slug}>
              <Link href={`/industries/${ind.slug}`} className="group flex gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted group-hover:text-accent" strokeWidth={1.6} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-5">{ind.name}</span>
                  <span className="block text-xs leading-snug text-muted">{ind.headline}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href={`/work/${featured.slug}`} className="group m-3 flex flex-col justify-between rounded-xl border border-border bg-surface-2/60 p-5 transition-colors hover:border-accent/40">
        <div>
          <p className="text-xs uppercase tracking-widest text-moon">Case study</p>
          <p className="mt-2 font-medium">{featured.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">{featured.summary}</p>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs text-accent">
          Read it <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}

function ResourcesPanel() {
  return (
    <div className="grid grid-cols-[2fr_1fr]">
      <ul className="grid grid-cols-2 gap-0.5 p-5">
        {resourceLinks.map((l) => {
          const Icon = resourceIcons[l.href] ?? fallbackIcon;
          return (
            <li key={l.href}>
              <Link href={l.href} className="group flex gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-2">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted group-hover:text-accent" strokeWidth={1.6} />
                <span className="min-w-0">
                  <span className="block text-sm font-medium leading-5">{l.label}</span>
                  <span className="block text-xs leading-snug text-muted">{l.desc}</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link href={signIn.href} className="group m-3 flex flex-col justify-between rounded-xl border border-border bg-surface-2/60 p-5 transition-colors hover:border-accent/40">
        <div>
          <LayoutDashboard className="h-5 w-5 text-accent" strokeWidth={1.6} />
          <p className="mt-3 font-medium">Client portal</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Clients sign in to follow their projects, automation runs, requests and invoices.
          </p>
        </div>
        <span className="mt-4 inline-flex items-center gap-1 text-xs text-accent">
          Sign in <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </Link>
    </div>
  );
}

const panels: Record<MenuId, { width: string; render: () => React.ReactNode }> = {
  services: { width: "max-w-[1040px]", render: () => <ServicesPanel /> },
  solutions: { width: "max-w-[860px]", render: () => <SolutionsPanel /> },
  resources: { width: "max-w-[760px]", render: () => <ResourcesPanel /> },
};

/* ---------- Mobile menu sections ---------- */

function mobileLinks(menu: MenuId): { href: string; label: string }[] {
  if (menu === "services")
    return serviceCategories.map((c) => ({ href: `/services#${c.id}`, label: c.name }));
  if (menu === "solutions") return industryDetails.map((i) => ({ href: `/industries/${i.slug}`, label: i.name }));
  return resourceLinks;
}

export function Nav() {
  const pathname = usePathname();
  // Both menus remember the page they were opened on, so navigating closes them
  // without a state update inside an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);

  const [active, setActive] = useState<{ id: MenuId; on: string } | null>(null);
  const activeMenu = active && active.on === pathname ? active.id : null;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMenu = (id: MenuId) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActive({ id, on: pathname });
  };
  const closeMenuSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setActive(null), 160);
  };

  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <motion.nav className="fixed top-0 inset-x-0 z-50" onMouseLeave={closeMenuSoon}>
        <motion.div
          style={{ opacity: activeMenu ? 1 : borderOpacity }}
          className="absolute inset-0 bg-background/85 backdrop-blur-md"
        />
        <motion.div style={{ opacity: borderOpacity }} className="absolute bottom-0 inset-x-0 h-px bg-border" />
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-10">
            <Link href="/" aria-label="Moonlabs home">
              <Logo />
            </Link>
            <ul className="hidden items-center gap-1 text-sm md:flex">
              {mainNav.map((l) => {
                const current = isActive(l.href) || (l.menu === "resources" && resourceLinks.some((r) => isActive(r.href)));
                const expanded = l.menu ? activeMenu === l.menu : undefined;
                return (
                  <li
                    key={l.href}
                    onMouseEnter={() => (l.menu ? openMenu(l.menu) : closeMenuSoon())}
                    onFocus={() => l.menu && openMenu(l.menu)}
                    onKeyDown={(e) => e.key === "Escape" && setActive(null)}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setActive(null)}
                      aria-current={isActive(l.href) ? "page" : undefined}
                      aria-expanded={expanded}
                      className={`flex h-16 items-center gap-1 px-3 transition-colors ${
                        current || expanded ? "text-foreground" : "text-muted hover:text-foreground"
                      }`}
                    >
                      {l.label}
                      {l.menu && (
                        <ChevronDown
                          aria-hidden
                          className={`h-3.5 w-3.5 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="flex items-center gap-1" onMouseEnter={closeMenuSoon}>
            <Link
              href={signIn.href}
              className="hidden rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground sm:inline-block"
            >
              {signIn.label}
            </Link>
            <Link
              href={primaryCta.href}
              className="hidden rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 sm:inline-block"
            >
              {primaryCta.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative -mr-2 flex h-11 w-11 items-center justify-center md:hidden"
            >
              <span className={`absolute h-px w-5 bg-foreground transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-px w-5 bg-foreground transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </div>

        {/* Desktop mega menu */}
        <AnimatePresence>
          {activeMenu && (
            <motion.div
              key={activeMenu}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4, transition: { duration: 0.12 } }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => openMenu(activeMenu)}
              onClick={() => setActive(null)}
              className="absolute inset-x-0 top-full hidden px-6 md:block"
            >
              <div
                className={`mx-auto ${panels[activeMenu].width} overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]`}
              >
                {panels[activeMenu].render()}
                <div className="flex items-center justify-between border-t border-border bg-surface-2/50 px-5 py-3 text-xs text-muted">
                  <span>Not sure where to start? A free 30-minute audit maps it out.</span>
                  <Link href={primaryCta.href} className="inline-flex items-center gap-1 font-medium text-accent">
                    Book a free audit <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-background/97 px-6 pb-10 pt-20 backdrop-blur-lg md:hidden"
          >
            <ul className="divide-y divide-border border-y border-border">
              {mainNav.map((l) =>
                l.menu ? (
                  <li key={l.href}>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-medium">
                        {l.label}
                        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="pb-4">
                        <li>
                          <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-accent">
                            All {l.label.toLowerCase()} →
                          </Link>
                        </li>
                        {mobileLinks(l.menu).map((m) => (
                          <li key={m.href}>
                            <Link href={m.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted">
                              {m.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setOpen(false)} className="block py-4 text-lg font-medium">
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link href={signIn.href} onClick={() => setOpen(false)} className="rounded-full border border-border py-3 text-center text-sm font-medium">
                {signIn.label}
              </Link>
              <Link href={primaryCta.href} onClick={() => setOpen(false)} className="rounded-full bg-accent py-3 text-center text-sm font-medium text-accent-ink">
                {primaryCta.label}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
