const names = ["Northgate", "Fieldworks", "BrightLoop", "Vantage", "Haven Labs", "Circuit", "Meridian", "Alto"];

export function LogoMarquee() {
  const items = [...names, ...names];

  return (
    <div className="marquee-pause relative py-14 border-y border-border overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-muted mb-8">
        Trusted by teams shipping fast
      </p>
      <div className="flex w-max animate-marquee">
        {items.map((name, i) => (
          <span
            key={i}
            className="mx-8 text-xl font-medium text-muted/60 whitespace-nowrap select-none"
          >
            {name}
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
