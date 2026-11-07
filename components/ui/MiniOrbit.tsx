// Small decorative planet with a moon circling it — echoes the hero scene on cards.
export function MiniOrbit({ color, speed = 10, size = 44 }: { color: string; speed?: number; size?: number }) {
  return (
    <span aria-hidden className="relative inline-block" style={{ width: size, height: size }}>
      <span className="absolute inset-0 rounded-full border border-foreground/10" />
      <span
        className="absolute left-1/2 top-1/2 h-[38%] w-[38%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: `radial-gradient(circle at 35% 30%, color-mix(in srgb, ${color} 55%, white), ${color} 55%, color-mix(in srgb, ${color} 50%, black))`,
          boxShadow: `0 0 16px 2px color-mix(in srgb, ${color} 45%, transparent)`,
        }}
      />
      <span className="orbit-spin absolute inset-0" style={{ ["--orbit-speed" as string]: `${speed}s` }}>
        <span className="absolute left-1/2 -top-[3px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-moon" />
      </span>
    </span>
  );
}
