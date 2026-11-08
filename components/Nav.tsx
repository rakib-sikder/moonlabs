"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { mainNav, primaryCta, serviceCategories, servicesIn } from "@/lib/site";
import { Logo } from "./Logo";

export function Nav() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so navigating away closes it
  // without a state update inside an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  // Services panel: opens on mouse enter (with a short grace period on leave so the
  // pointer can travel into it), on keyboard focus, and closes on navigation.
  const [menuOn, setMenuOn] = useState<string | null>(null);
  const menuOpen = menuOn === pathname;
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openMenu = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setMenuOn(pathname);
  };
  const closeMenuSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOn(null), 180);
  };
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  // Lock page scroll and allow Escape while the mobile menu is open.
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
      <motion.nav className="fixed top-0 inset-x-0 z-50">
        <motion.div style={{ opacity: borderOpacity }} className="absolute inset-0 bg-background/75 backdrop-blur-md" />
        <motion.div style={{ opacity: borderOpacity }} className="absolute bottom-0 inset-x-0 h-px bg-border" />
        <div className="relative mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Moonlabs home">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {mainNav.map((l) => {
              const link = (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={
                    isActive(l.href)
                      ? "text-foreground"
                      : "text-muted hover:text-foreground transition-colors"
                  }
                >
                  {l.label}
                </Link>
              );
              if (l.href !== "/services") return link;
              // Services opens a panel of every sector on hover or keyboard focus.
              return (
                <div
                  key={l.href}
                  onMouseEnter={openMenu}
                  onMouseLeave={closeMenuSoon}
                  onFocus={openMenu}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenuOn(null);
                  }}
                  onKeyDown={(e) => e.key === "Escape" && setMenuOn(null)}
                  onClick={() => setMenuOn(null)}
                >
                  <div className="flex h-16 items-center gap-1">
                    {link}
                    <svg aria-hidden viewBox="0 0 12 12" className={`h-3 w-3 text-muted transition-transform ${menuOpen ? "rotate-180" : ""}`}>
                      <path d="M3 4.5 6 7.5 9 4.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                    </svg>
                  </div>
                  <div className={`absolute inset-x-6 top-full -mt-2 pt-3 transition-[opacity,visibility,translate] duration-200 ${
                      menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
                    }`}>
                    <div className="grid grid-cols-5 gap-6 rounded-2xl border border-border bg-surface/95 p-6 shadow-2xl backdrop-blur-xl">
                      {serviceCategories.map((c) => (
                        <div key={c.id}>
                          <Link href={`/services#${c.id}`} className="mb-3 flex items-center gap-2 text-xs uppercase tracking-widest text-moon hover:text-foreground">
                            <span className="h-1.5 w-1.5 rounded-full" style={{ background: c.color }} />
                            {c.core ? "Automation" : c.name}
                          </Link>
                          <ul className="space-y-1">
                            {servicesIn(c.id).map((sv) => (
                              <li key={sv.slug}>
                                <Link
                                  href={`/services/${sv.slug}`}
                                  className="block rounded-md py-1 text-[13px] text-muted transition-colors hover:text-foreground"
                                >
                                  {sv.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={primaryCta.href}
              className="hidden sm:inline-block rounded-full bg-accent text-accent-ink text-sm font-medium px-4 py-2 hover:opacity-90 transition-opacity"
            >
              {primaryCta.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="md:hidden relative h-11 w-11 -mr-2 flex items-center justify-center"
            >
              <span
                className={`absolute h-px w-5 bg-foreground transition-transform duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`}
              />
              <span
                className={`absolute h-px w-5 bg-foreground transition-transform duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`}
              />
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
              className="flex h-full flex-col justify-center gap-2 px-6"
            >
              {[...mainNav, { href: "/about", label: "About" }, primaryCta].map((l) => (
                <motion.li
                  key={l.href}
                  variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                >
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block py-2 text-3xl font-semibold tracking-tight ${
                      isActive(l.href) ? "text-moon" : "text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
