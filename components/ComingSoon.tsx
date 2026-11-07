import Link from "next/link";

// Temporary body for pages whose content lands in a later build stage.
export function ComingSoon({ note }: { note: string }) {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-28">
      <div className="rounded-2xl border border-dashed border-border bg-surface p-10 text-center">
        <p className="text-moon font-mono text-xs uppercase tracking-widest mb-3">In orbit soon</p>
        <p className="text-muted max-w-md mx-auto">{note}</p>
        <Link href="/contact" className="mt-6 inline-block text-sm text-accent hover:underline underline-offset-4">
          Talk to us in the meantime →
        </Link>
      </div>
    </section>
  );
}
