// Shared header for inner pages: eyebrow, title, intro, with the same moon glow as the hero.
export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="relative overflow-hidden px-6 pt-36 pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 left-1/2 -translate-x-1/2 h-[480px] w-[480px] rounded-full opacity-20 blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent) 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-widest text-moon mb-4">{eyebrow}</p>
        <h1 className="max-w-3xl text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08]">
          {title}
        </h1>
        {intro && <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">{intro}</p>}
      </div>
    </header>
  );
}
