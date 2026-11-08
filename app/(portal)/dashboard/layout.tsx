import Link from "next/link";
import { Logo } from "@/components/Logo";
import { isPortalConfigured } from "@/lib/supabase/config";
import { displayName, getPortalContext } from "@/lib/supabase/session";
import { NotConfigured } from "../_components/ui";
import { MobileNav, NavLinks, OrgSwitcher } from "../_components/shell";
import { UserMenu } from "../_components/user-menu";

/** Signed-in portal shell: compact top bar, sidebar on desktop, drawer on smaller screens. */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (!isPortalConfigured()) {
    return (
      <main className="flex min-h-dvh items-center justify-center">
        <NotConfigured />
      </main>
    );
  }

  const ctx = await getPortalContext();
  const orgOptions = ctx.orgs.map((o) => ({ id: o.id, name: o.name }));

  return (
    <div className="min-h-dvh">
      <a
        href="#portal-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <header className="sticky top-0 z-30 flex h-12 items-center gap-2 border-b border-border bg-background px-3 sm:px-4">
        <MobileNav canAdmin={ctx.canAdmin} orgName={ctx.currentOrg?.name ?? null} />
        <Link href="/dashboard" className="flex shrink-0 items-center text-[14px]" aria-label="Portal overview">
          <Logo />
        </Link>
        <span aria-hidden className="mx-1 hidden text-border sm:inline">
          /
        </span>
        <div className="hidden min-w-0 sm:flex">
          <OrgSwitcher key={ctx.currentOrg?.id ?? "none"} orgs={orgOptions} currentId={ctx.currentOrg?.id ?? null} />
        </div>
        <div className="ml-auto">
          <UserMenu name={displayName(ctx)} email={ctx.email} staff={ctx.isStaff} />
        </div>
      </header>

      <div className="flex">
        <aside className="sticky top-12 hidden h-[calc(100dvh-3rem)] w-56 shrink-0 overflow-y-auto border-r border-border p-3 lg:block">
          <NavLinks canAdmin={ctx.canAdmin} />
        </aside>
        <main id="portal-main" tabIndex={-1} className="min-w-0 flex-1 px-4 pb-16 pt-6 outline-none sm:px-6 lg:px-8">
          {orgOptions.length > 1 && (
            <div className="mb-4 sm:hidden">
              <OrgSwitcher id="org-switcher-mobile" key={ctx.currentOrg?.id ?? "none"} orgs={orgOptions} currentId={ctx.currentOrg?.id ?? null} />
            </div>
          )}
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
