import Link from "next/link";

// Closing call-to-action used at the bottom of every page.
export function CtaBanner({
  title = "Find out what you can automate.",
  body = "Book a free 30-minute automation audit. We map your busywork and show you what can run on its own — no obligation.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="relative overflow-hidden border-t border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 h-[420px] w-[720px] max-w-full rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-3xl px-6 py-28 text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{title}</h2>
        <p className="mt-4 text-muted leading-relaxed">{body}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-full bg-accent text-accent-ink text-sm font-medium px-7 py-3 hover:opacity-90 transition-opacity"
          >
            Book a free audit
          </Link>
          <Link
            href="/services"
            className="rounded-full border border-border text-sm font-medium px-7 py-3 hover:border-muted transition-colors"
          >
            Browse services
          </Link>
        </div>
      </div>
    </section>
  );
}
