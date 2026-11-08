import Link from "next/link";
import { initials } from "@/lib/portal/format";
import { signOut } from "../actions";
import { IconChevron } from "./icons";

/** Account dropdown built on <details> so it works without client JS. */
export function UserMenu({ name, email, staff }: { name: string; email: string | null; staff: boolean }) {
  return (
    <details className="group relative">
      <summary
        className="flex h-8 cursor-pointer list-none items-center gap-2 rounded-md px-1.5 text-[13px] hover:bg-surface-2 [&::-webkit-details-marker]:hidden"
        aria-label="Account menu"
      >
        <span
          aria-hidden
          className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-[11px] font-semibold text-moon ring-1 ring-border"
        >
          {initials(name)}
        </span>
        <span className="hidden max-w-[12rem] truncate sm:inline">{name}</span>
        <IconChevron className="h-3.5 w-3.5 text-muted transition-transform group-open:rotate-180" />
      </summary>
      <div className="pt-panel absolute right-0 top-10 z-40 w-64 p-1 shadow-lg shadow-black/20">
        <div className="border-b border-border px-3 py-2">
          <p className="truncate font-medium">{name}</p>
          {email && <p className="truncate text-[12.5px] text-muted">{email}</p>}
          {staff && <p className="mt-1 text-[12px] text-moon">Moonlabs staff</p>}
        </div>
        <Link href="/" className="pt-nav-link mt-1">
          Back to moonlabs site
        </Link>
        <form action={signOut}>
          <button type="submit" className="pt-nav-link w-full text-left">
            Sign out
          </button>
        </form>
      </div>
    </details>
  );
}
