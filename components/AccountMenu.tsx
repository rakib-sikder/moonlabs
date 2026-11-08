"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, LogOut, Shield } from "lucide-react";
import { signOut } from "@/app/(portal)/actions";

export type NavUser = { name: string | null; email: string; isStaff: boolean };

/** Reads the signed-in user once per page load (marketing pages are static). */
export function useNavUser() {
  const [user, setUser] = useState<NavUser | null | undefined>(undefined);
  useEffect(() => {
    let alive = true;
    fetch("/api/me", { cache: "no-store", credentials: "same-origin" })
      .then((r) => (r.ok ? (r.json() as Promise<{ user: NavUser | null }>) : { user: null }))
      .then((d) => {
        if (alive) setUser(d.user);
      })
      .catch(() => {
        if (alive) setUser(null);
      });
    return () => {
      alive = false;
    };
  }, []);
  return user; // undefined while loading
}

export function initialsOf(u: NavUser) {
  const base = (u.name || u.email.replace(/@.*/, "")).trim();
  const parts = base.split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** Avatar button with a small menu: dashboard, admin (staff), sign out. */
export function AccountMenu({ user }: { user: NavUser }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={`Account menu for ${user.name || user.email}`}
        className="flex items-center gap-2 rounded-full border border-border bg-surface/60 py-1 pl-1 pr-3 text-sm transition-colors hover:border-muted"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-ink">
          {initialsOf(user)}
        </span>
        <span className="max-w-[9rem] truncate">{user.name || user.email}</span>
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-border bg-surface shadow-[0_24px_60px_-20px_rgba(0,0,0,0.45)]">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium">{user.name || "Signed in"}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <div className="p-1.5">
            <Link role="menuitem" href="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-surface-2">
              <LayoutDashboard className="h-4 w-4 text-muted" strokeWidth={1.6} /> Dashboard
            </Link>
            {user.isStaff && (
              <Link role="menuitem" href="/dashboard/admin" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-surface-2">
                <Shield className="h-4 w-4 text-muted" strokeWidth={1.6} /> Admin
              </Link>
            )}
            <form action={signOut}>
              <button role="menuitem" type="submit" className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm hover:bg-surface-2">
                <LogOut className="h-4 w-4 text-muted" strokeWidth={1.6} /> Sign out
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
