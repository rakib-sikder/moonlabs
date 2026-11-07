// Crescent mark: a moon disc with an offset cut-out, plus the wordmark.
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden>
        <defs>
          <mask id="crescent-mask">
            <rect width="24" height="24" fill="white" />
            <circle cx="16" cy="9" r="8" fill="black" />
          </mask>
        </defs>
        <circle cx="12" cy="12" r="9" fill="var(--moon)" mask="url(#crescent-mask)" />
        <circle cx="19" cy="5" r="1.4" fill="var(--accent)" />
      </svg>
      <span className="font-semibold tracking-tight">moonlabs</span>
    </span>
  );
}
