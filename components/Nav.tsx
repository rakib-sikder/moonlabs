"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { mainNav, primaryCta } from "@/lib/site";
import { Logo } from "./Logo";

export function Nav() {
  const pathname = usePathname();
  // The menu remembers which page it was opened on, so navigating away closes it
  // without a state update inside an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const { scrollY } = useScroll();
  const background = useTransform(scrollY, [0, 120], ["rgba(7,8,15,0)", "rgba(7,8,15,0.82)"]);
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
      <motion.nav style={{ background }} className="fixed top-0 inset-x-0 z-50 backdrop-blur-md">
        <motion.div style={{ opacity: borderOpacity }} className="absolute bottom-0 inset-x-0 h-px bg-border" />
        <div className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Moonlabs home">
            <Logo />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm">
            {mainNav.map((l) => (
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
            ))}
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
