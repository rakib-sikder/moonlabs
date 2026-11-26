"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
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
import { Logo } from "./Logo";
import { AccountMenu, useNavUser } from "./AccountMenu";

type MenuId = NonNullable<NavItem["menu"]>;

/* ---------- Mega-menu panels ---------- */

type MenuLink = { href: string; label: string };

/** One column of plain links, with an optional small heading. */
function MenuColumn({ title, titleHref, links }: { title?: string; titleHref?: string; links: MenuLink[] }) {
  return (
    <div className="min-w-0">
      {title &&
        (titleHref ? (
          <Link href={titleHref} className="mb-2 block px-3 text-[12.5px] text-muted transition-colors hover:text-foreground">
            {title}
          </Link>
        ) : (
          <p className="mb-2 px-3 text-[12.5px] text-muted">{title}</p>
        ))}
      <ul className="space-y-0.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="block rounded-lg px-3 py-2 text-[14.5px] font-medium text-foreground/85 transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Picture card on the right of a menu. */
function FeatureCard({ href, img, title, tag }: { href: string; img: string; title: string; tag: string }) {
  return (
    <Link href={href} className="group m-3 flex flex-col rounded-xl border border-border bg-surface-2/50 p-3 transition-colors hover:border-accent/40">
      <span className="block aspect-[16/10] overflow-hidden rounded-lg bg-surface-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
      </span>
      <span className="mt-3 block px-1 text-[15px] font-semibold leading-snug">{title}</span>
      <span className="mt-1 inline-flex items-center gap-1 px-1 text-[12.5px] text-muted">
        {tag}
        <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}

/** Shared frame: label, link columns and footer row on the left, the picture card on the right. */
function MenuShell({
  label,
  columns,
  footer,
  feature,
  cols = 3,
}: {
  label: string;
  columns: React.ReactNode;
  footer: [MenuLink, MenuLink];
  feature: React.ReactNode;
  cols?: 2 | 3;
}) {
  return (
    <div className="grid grid-cols-[1fr_280px]">
      <div className="flex flex-col">
        <p className="px-6 pt-5 text-[13px] text-muted">{label}</p>
        <div className={`grid gap-x-2 gap-y-4 px-3 pb-4 pt-3 ${cols === 3 ? "grid-cols-3" : "grid-cols-2"}`}>{columns}</div>
        <div className="mt-auto flex items-center justify-between border-t border-border px-6 py-3.5">
          {footer.map((f, i) => (
            <Link key={f.href} href={f.href} className={`group inline-flex items-center gap-1.5 text-[13.5px] font-semibold ${i === 1 ? "text-accent" : ""}`}>
              {f.label}
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>
      <div className="border-l border-border">{feature}</div>
    </div>
  );
}

const svcLinks = (id: Parameters<typeof servicesIn>[0]) => servicesIn(id).map((x) => ({ href: `/services/${x.slug}`, label: x.name }));

function ServicesPanel() {
  const [core, ...others] = serviceCategories;
  const pairs = [others.slice(0, 2), others.slice(2)];
  return (
    <MenuShell
      label="Explore our services"
      columns={
        <>
          <MenuColumn title={`${core.name} · our core`} titleHref={`/services#${core.id}`} links={svcLinks(core.id)} />
          {pairs.map((group, i) => (
            <div key={i} className="space-y-4">
              {group.map((c) => (
                <MenuColumn key={c.id} title={c.name} titleHref={`/services#${c.id}`} links={svcLinks(c.id)} />
              ))}
            </div>
          ))}
        </>
      }
      footer={[
        { href: "/services", label: "Browse all services" },
        { href: "/pricing", label: "See pricing" },
      ]}
      feature={<FeatureCard href="/services#automation" img="/images/service-automation.webp" title="Automation & AI: the work we do most" tag="Automation" />}
    />
  );
}

function SolutionsPanel() {
  const featured = caseStudies[0];
  const links = industryDetails.map((i) => ({ href: `/industries/${i.slug}`, label: i.name }));
  const half = Math.ceil(links.length / 2);
  return (
    <MenuShell
      label="Explore by industry"
      cols={2}
      columns={
        <>
          <MenuColumn links={links.slice(0, half)} />
          <MenuColumn links={links.slice(half)} />
        </>
      }
      footer={[
        { href: "/industries", label: "Browse all industries" },
        { href: "/contact", label: "Book a free audit" },
      ]}
      feature={<FeatureCard href={`/work/${featured.slug}`} img={`/images/work-${featured.slug}.webp`} title={featured.name} tag="Case study" />}
    />
  );
}

function ResourcesPanel() {
  const half = Math.ceil(resourceLinks.length / 2);
  return (
    <MenuShell
      label="Learn and plan"
      cols={2}
      columns={
        <>
          <MenuColumn links={resourceLinks.slice(0, half).map((l) => ({ href: l.href, label: l.label }))} />
          <MenuColumn links={resourceLinks.slice(half).map((l) => ({ href: l.href, label: l.label }))} />
        </>
      }
      footer={[
        { href: signIn.href, label: "Client portal sign in" },
        { href: "/guides", label: "All guides" },
      ]}
      feature={
        <FeatureCard
          href="/guides/ai-automation-for-small-business"
          img="/images/guide-ai-automation-for-small-business.webp"
          title="AI automation for small business: where to start"
          tag="Guide"
        />
      }
    />
  );
}

const panels: Record<MenuId, { width: string; render: () => React.ReactNode }> = {
  services: { width: "max-w-[1040px]", render: () => <ServicesPanel /> },
  solutions: { width: "max-w-[720px]", render: () => <SolutionsPanel /> },
  resources: { width: "max-w-[700px]", render: () => <ResourcesPanel /> },
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

  const user = useNavUser();
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
            <Link href="/" aria-label="Moonlab home">
              <Logo />
            </Link>
            <ul className="hidden items-center gap-1 text-sm lg:flex">
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
            {user ? (
              <div className="mr-2 hidden sm:block">
                <AccountMenu user={user} />
              </div>
            ) : (
              <Link
                href={signIn.href}
                className={`hidden whitespace-nowrap rounded-full px-4 py-2 text-sm text-muted transition-colors hover:text-foreground sm:inline-block ${
                  user === undefined ? "invisible" : ""
                }`}
              >
                {signIn.label}
              </Link>
            )}
            <Link
              href={primaryCta.href}
              className="hidden whitespace-nowrap rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 sm:inline-block"
            >
              {primaryCta.label}
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
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
              className="absolute inset-x-0 top-full hidden px-6 lg:block"
            >
              <div
                className={`mx-auto ${panels[activeMenu].width} overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]`}
              >
                {panels[activeMenu].render()}
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
            className="fixed inset-0 z-40 overflow-y-auto bg-background/97 px-6 pb-10 pt-20 backdrop-blur-lg lg:hidden"
          >
            <ul className="divide-y divide-border border-y border-border">
              {mainNav.map((l) =>
                l.menu ? (
                  <li key={l.href}>
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-lg font-medium transition-colors hover:text-accent">
                        {l.label}
                        <ChevronDown className="h-4 w-4 text-muted transition-transform group-open:rotate-180" />
                      </summary>
                      <ul className="pb-4">
                        <li>
                          <Link href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-accent hover:underline">
                            All {l.label.toLowerCase()} →
                          </Link>
                        </li>
                        {mobileLinks(l.menu).map((m) => (
                          <li key={m.href}>
                            <Link href={m.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-muted transition-colors hover:text-foreground">
                              {m.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ) : (
                  <li key={l.href}>
                    <Link href={l.href} onClick={() => setOpen(false)} className="block py-4 text-lg font-medium transition-colors hover:text-accent">
                      {l.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
            <div className="mt-8 grid grid-cols-2 gap-3">
              <Link
                href={user ? "/dashboard" : signIn.href}
                onClick={() => setOpen(false)}
                className="rounded-full border border-border py-3 text-center text-sm font-medium transition-colors hover:border-muted"
              >
                {user ? "Dashboard" : signIn.label}
              </Link>
              <Link href={primaryCta.href} onClick={() => setOpen(false)} className="rounded-full bg-accent py-3 text-center text-sm font-medium text-accent-ink transition-opacity hover:opacity-90">
                {primaryCta.label}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
