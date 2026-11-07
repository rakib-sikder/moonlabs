import Link from "next/link";
import { footerNav, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 grid gap-12 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-4 text-sm text-muted leading-relaxed">{site.description}</p>
        </div>
        {footerNav.map((col) => (
          <div key={col.title}>
            <p className="text-xs uppercase tracking-widest text-moon mb-4">{col.title}</p>
            <ul className="space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted">
          <span>© {new Date().getFullYear()} Moonlabs. All rights reserved.</span>
          <span>Work that runs itself, while you sleep.</span>
        </div>
      </div>
    </footer>
  );
}
