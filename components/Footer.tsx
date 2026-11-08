import Link from "next/link";
import { footerNav, primaryCta, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface/40">
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-muted">{site.description}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            {site.email && (
              <a href={`mailto:${site.email}`} className="text-sm text-muted transition-colors hover:text-foreground">
                {site.email}
              </a>
            )}
            <Link
              href={primaryCta.href}
              className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
            >
              Book a free audit
            </Link>
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 sm:grid-cols-3 lg:grid-cols-5">
          {footerNav.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-medium uppercase tracking-widest text-foreground">{col.title}</p>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-muted transition-colors hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-5 text-xs text-muted sm:flex-row">
          <span>© {new Date().getFullYear()} Moonlabs. All rights reserved.</span>
          <span>Moon imagery: NASA Scientific Visualization Studio</span>
        </div>
      </div>
    </footer>
  );
}
