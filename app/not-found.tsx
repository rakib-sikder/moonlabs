import Link from "next/link";
import { Diorama } from "@/components/ui/Diorama";
import SiteLayout from "./(site)/layout";

export default function NotFound() {
  return (
    <SiteLayout>
      <section className="min-h-[70vh] flex flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
        <Diorama name="not-found" className="mb-10 w-full max-w-sm" />
        <p className="font-mono text-xs uppercase tracking-widest text-moon mb-4">
          404 · Page not found
        </p>
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          This note slipped off the desk.
        </h1>
        <p className="mt-4 text-muted">
          The link may be old, or the page has moved.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-accent text-accent-ink text-sm font-medium px-6 py-3 hover:opacity-90 transition-opacity"
        >
          Back to home
        </Link>
      </section>
    </SiteLayout>
  );
}
