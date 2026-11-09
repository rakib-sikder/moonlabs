"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import { switchOrg } from "../actions";
import {
  IconAdmin,
  IconAutomations,
  IconBilling,
  IconClose,
  IconFiles,
  IconMenu,
  IconOverview,
  IconProjects,
  IconRequests,
} from "./icons";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: IconOverview, exact: true },
  { href: "/dashboard/projects", label: "Projects", icon: IconProjects },
  { href: "/dashboard/automations", label: "Automations", icon: IconAutomations },
  { href: "/dashboard/requests", label: "Requests", icon: IconRequests },
  { href: "/dashboard/files", label: "Files", icon: IconFiles },
  { href: "/dashboard/billing", label: "Billing", icon: IconBilling },
];

const ADMIN = { href: "/dashboard/admin", label: "Admin", icon: IconAdmin };

function isActive(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLinks({ canAdmin, onNavigate }: { canAdmin: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Portal">
      <ul className="space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <li key={href}>
            <Link
              href={href}
              className="pt-nav-link"
              aria-current={isActive(pathname, href, exact) ? "page" : undefined}
              onClick={onNavigate}
            >
              <Icon />
              {label}
            </Link>
          </li>
        ))}
      </ul>
      {canAdmin && (
        <>
          <p className="mb-1 mt-6 px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted">Moonlab staff</p>
          <ul>
            <li>
              <Link
                href={ADMIN.href}
                className="pt-nav-link"
                aria-current={isActive(pathname, ADMIN.href) ? "page" : undefined}
                onClick={onNavigate}
              >
                <ADMIN.icon />
                {ADMIN.label}
              </Link>
            </li>
          </ul>
        </>
      )}
    </nav>
  );
}

/** Mobile/tablet navigation: a menu button that opens a modal drawer (native <dialog>). */
export function MobileNav({ canAdmin, orgName }: { canAdmin: boolean; orgName: string | null }) {
  const ref = useRef<HTMLDialogElement>(null);
  const close = () => ref.current?.close();
  return (
    <>
      <button
        type="button"
        className="pt-btn lg:hidden"
        data-variant="ghost"
        data-size="sm"
        aria-label="Open navigation"
        aria-haspopup="dialog"
        onClick={() => ref.current?.showModal()}
      >
        <IconMenu />
      </button>
      <dialog
        ref={ref}
        aria-label="Navigation"
        className="m-0 h-dvh max-h-none w-72 max-w-[85vw] border-r border-border bg-surface p-0 text-foreground backdrop:bg-black/50"
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        <div className="flex h-12 items-center justify-between border-b border-border px-3">
          <span className="truncate text-[13.5px] font-medium">{orgName ?? "Client portal"}</span>
          <button type="button" className="pt-btn" data-variant="ghost" data-size="sm" aria-label="Close navigation" onClick={close}>
            <IconClose />
          </button>
        </div>
        <div className="p-3">
          <NavLinks canAdmin={canAdmin} onNavigate={close} />
        </div>
      </dialog>
    </>
  );
}

export function OrgSwitcher({
  orgs,
  currentId,
  id = "org-switcher",
}: {
  orgs: { id: string; name: string }[];
  currentId: string | null;
  id?: string;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  if (orgs.length <= 1) {
    return <span className="truncate text-[13.5px] font-medium">{orgs[0]?.name ?? "No workspace"}</span>;
  }
  return (
    <div className="flex min-w-0 items-center gap-2">
      <label htmlFor={id} className="sr-only">
        Organization
      </label>
      <select
        id={id}
        className="pt-select h-8 max-w-[14rem] truncate py-0 text-[13px] font-medium"
        defaultValue={currentId ?? undefined}
        disabled={pending}
        onChange={(e) => {
          const fd = new FormData();
          fd.set("org_id", e.target.value);
          startTransition(async () => {
            const res = await switchOrg(fd);
            if (res && !res.ok) startTransition(() => setError(res.message ?? "Could not switch."));
          });
        }}
      >
        {orgs.map((o) => (
          <option key={o.id} value={o.id}>
            {o.name}
          </option>
        ))}
      </select>
      {error && (
        <span role="alert" className="text-[12px]" style={{ color: "var(--pt-bad)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
