// Tools we connect — a factual capability list, not client logos.
const rowA = ["Gmail", "Google Sheets", "Slack", "Telegram", "WhatsApp", "HubSpot", "GoHighLevel", "Shopify", "WooCommerce", "Airtable"];
const rowB = ["Notion", "QuickBooks", "Xero", "Stripe", "Calendly", "Zapier", "Make", "n8n", "OpenAI", "Claude"];

function Row({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div className="flex w-max">
      <div className={`flex ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}>
        {doubled.map((name, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length}
            className="mx-2 inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface/70 px-4 py-2 text-sm text-muted backdrop-blur transition-colors hover:border-accent/50 hover:text-foreground select-none"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-moon/60" />
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Integrations() {
  return (
    <section className="marquee-pause relative py-16 overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-muted mb-8">
        Connects with the tools you already use
      </p>
      <div className="space-y-3 [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
        <Row items={rowA} />
        <Row items={rowB} reverse />
      </div>
    </section>
  );
}
