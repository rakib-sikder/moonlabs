import { fallbackIcon, serviceIcons } from "@/lib/icons";

/** Bordered square holding a service's icon; turns accent on the parent's hover (needs `group`). */
export function IconTile({ slug, size = 36 }: { slug: string; size?: number }) {
  const Icon = serviceIcons[slug] ?? fallbackIcon;
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-lg border border-border bg-background/60 text-muted transition-colors group-hover:border-accent/40 group-hover:text-accent"
      style={{ width: size, height: size }}
    >
      <Icon style={{ width: size / 2, height: size / 2 }} strokeWidth={1.6} />
    </span>
  );
}
