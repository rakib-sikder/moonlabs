// Tools we connect — a factual capability list, not client logos.
const tools = [
  "Gmail",
  "Google Sheets",
  "Slack",
  "Telegram",
  "WhatsApp",
  "HubSpot",
  "GoHighLevel",
  "Shopify",
  "WooCommerce",
  "Airtable",
  "Notion",
  "QuickBooks",
  "Xero",
  "Stripe",
  "Calendly",
  "Zapier",
  "Make",
  "n8n",
  "OpenAI",
  "Claude",
];

export function Integrations() {
  const items = [...tools, ...tools];

  return (
    <div className="marquee-pause relative py-14 border-y border-border overflow-hidden">
      <p className="text-center text-xs uppercase tracking-widest text-muted mb-8">
        Connects with the tools you already use
      </p>
      <div className="flex w-max animate-marquee">
        {items.map((name, i) => (
          <span
            key={i}
            aria-hidden={i >= tools.length}
            className="mx-7 text-lg font-medium text-muted/70 whitespace-nowrap select-none"
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
