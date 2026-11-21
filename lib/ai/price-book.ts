// Price book for the AI assistant. The model never invents prices: it picks project types and
// add-ons from these lists and estimatePrice() does the arithmetic. Source: docs/PRICING_RESEARCH.md.
// Edit the numbers here to change every estimate.

export type ProjectType = {
  key: string;
  label: string;
  low: number;
  high: number;
  weeks: [number, number];
  /** Monthly fee that usually comes with it (care, hosting of the bot, etc.). */
  monthly?: [number, number];
  /** Counts toward a monthly automation plan instead of a project quote. */
  automation?: boolean;
};

export const PROJECT_TYPES: ProjectType[] = [
  { key: "automation_simple", label: "Simple automation (1 trigger, up to 3 tools)", low: 349, high: 900, weeks: [1, 1], automation: true },
  { key: "automation_multi", label: "Multi-step automation", low: 1000, high: 2500, weeks: [1, 3], automation: true },
  { key: "automation_ai", label: "Automation with an AI step", low: 1500, high: 3500, weeks: [2, 3], automation: true },
  { key: "chatbot_faq", label: "Website chatbot (FAQ / knowledge base)", low: 800, high: 1500, weeks: [2, 3], monthly: [99, 299] },
  { key: "chatbot_leads", label: "Chatbot with lead qualification and CRM", low: 1500, high: 2500, weeks: [3, 4], monthly: [99, 299] },
  { key: "missed_call", label: "Missed-call text-back", low: 297, high: 597, weeks: [1, 1], monthly: [99, 199] },
  { key: "lead_capture", label: "Lead capture system (pipeline, forms, follow-up)", low: 800, high: 1800, weeks: [1, 2], monthly: [199, 399] },
  { key: "crm_setup", label: "CRM setup", low: 700, high: 1800, weeks: [1, 3] },
  { key: "crm_migration", label: "CRM setup with data migration and integrations", low: 1800, high: 3500, weeks: [2, 4] },
  { key: "website_small", label: "Website, about 5 pages", low: 900, high: 1800, weeks: [2, 3] },
  { key: "website_medium", label: "Website, 8-10 pages", low: 1800, high: 3500, weeks: [3, 4] },
  { key: "online_shop", label: "Online shop (Shopify / WooCommerce)", low: 1500, high: 4000, weeks: [3, 5] },
  { key: "web_app", label: "Web app MVP (login, dashboard, data, one payment)", low: 8000, high: 22000, weeks: [6, 10] },
  { key: "booking_app", label: "Booking app (payments and SMS reminders)", low: 7000, high: 18000, weeks: [5, 9] },
  { key: "dashboard", label: "Internal dashboard or reporting tool", low: 5000, high: 15000, weeks: [3, 6] },
  { key: "mobile_app", label: "Cross-platform mobile app MVP", low: 18000, high: 45000, weeks: [10, 16] },
  { key: "api_one_way", label: "Integration between two systems, one-way", low: 1500, high: 5000, weeks: [1, 3] },
  { key: "api_two_way", label: "Integration between two systems, two-way", low: 5000, high: 15000, weeks: [3, 8] },
];

export type AddOn = { key: string; label: string; low: number; high: number };

export const ADD_ONS: AddOn[] = [
  { key: "extra_payment", label: "Extra payment gateway or split payments", low: 1500, high: 5000 },
  { key: "user_roles", label: "User roles and permissions", low: 1500, high: 6000 },
  { key: "ai_feature", label: "AI feature (drafting, sorting, chat)", low: 2000, high: 10000 },
  { key: "extra_language", label: "Each extra language", low: 1000, high: 3000 },
  { key: "admin_panel", label: "Admin panel", low: 2000, high: 6000 },
];

/** Above this, or for the risk flags below, the assistant hands over to a person. */
export const HANDOFF_FROM = 15000;

export type EstimateInput = {
  items: { type: string; quantity?: number }[];
  addons?: { key: string; quantity?: number }[];
  /** Requirements are still vague: widen the range. */
  vague?: boolean;
  /** Needed in less than about two thirds of the normal time. */
  rush?: boolean;
  /** Health, finance or other regulated data. */
  sensitive_data?: boolean;
  /** Number of separate systems that must be connected. */
  systems?: number;
  /** A system without an API (desktop software, legacy database, scraping). */
  no_api?: boolean;
};

export type Estimate = {
  lines: { label: string; low: number; high: number }[];
  low: number;
  high: number;
  weeks: [number, number];
  monthly: [number, number] | null;
  handoff: boolean;
  handoff_reasons: string[];
  plan_hint: string | null;
  unknown: string[];
  notes: string[];
};

const round = (n: number) => (n >= 1000 ? Math.round(n / 100) * 100 : Number.isInteger(n) ? n : Math.round(n / 10) * 10);
const clampQty = (q: unknown) => Math.min(20, Math.max(1, Math.floor(Number(q) || 1)));

export function estimatePrice(input: EstimateInput): Estimate {
  const lines: Estimate["lines"] = [];
  const unknown: string[] = [];
  let weeks: [number, number] = [0, 0];
  let monthly: [number, number] | null = null;
  let automations = 0;
  let aiAutomation = false;
  let nonAutomation = false;

  for (const it of input.items ?? []) {
    const t = PROJECT_TYPES.find((p) => p.key === it.type);
    if (!t) {
      unknown.push(String(it.type));
      continue;
    }
    const q = clampQty(it.quantity);
    lines.push({ label: q > 1 ? `${t.label} x${q}` : t.label, low: t.low * q, high: t.high * q });
    weeks = [Math.max(weeks[0], t.weeks[0]), Math.max(weeks[1], t.weeks[1]) + (q > 1 ? Math.ceil((q - 1) / 2) : 0)];
    if (t.monthly) monthly = monthly ? [monthly[0] + t.monthly[0], monthly[1] + t.monthly[1]] : [...t.monthly];
    if (t.automation) {
      automations += q;
      if (t.key === "automation_ai") aiAutomation = true;
    } else nonAutomation = true;
  }
  for (const a of input.addons ?? []) {
    const add = ADD_ONS.find((x) => x.key === a.key);
    if (!add) {
      unknown.push(String(a.key));
      continue;
    }
    const q = clampQty(a.quantity);
    lines.push({ label: q > 1 ? `${add.label} x${q}` : add.label, low: add.low * q, high: add.high * q });
  }

  let low = lines.reduce((s, l) => s + l.low, 0);
  let high = lines.reduce((s, l) => s + l.high, 0);
  const notes: string[] = [];
  if (lines.length > 1) {
    // Shared setup, design and testing overlap when several parts ship together.
    low *= 0.9;
    notes.push("Several parts built together share setup and testing.");
  }
  if (input.vague) {
    low *= 0.85;
    high *= 1.4;
    notes.push("The range is wide because some requirements are still open.");
  }
  if (input.rush) {
    low *= 1.25;
    high *= 1.5;
    weeks = [Math.max(1, Math.ceil(weeks[0] * 0.67)), Math.max(1, Math.ceil(weeks[1] * 0.67))];
    notes.push("Includes a rush fee for the shorter timeline.");
  }
  low = round(low);
  high = round(high);

  const reasons: string[] = [];
  if (low >= HANDOFF_FROM) reasons.push(`starts at $${HANDOFF_FROM.toLocaleString("en-US")} or more`);
  if (input.sensitive_data) reasons.push("involves health, finance or other regulated data");
  if ((input.systems ?? 0) > 3) reasons.push("connects more than 3 systems");
  if (input.no_api) reasons.push("includes a system without an API");
  if (unknown.length) reasons.push("includes work outside our standard list");
  if (low > 0 && high > low * 3) reasons.push("the scope is still too open for a useful range");

  let plan_hint: string | null = null;
  if (automations > 0 && !nonAutomation) {
    plan_hint =
      automations === 1 && !aiAutomation
        ? "One standard automation fits Crescent ($349 one-time), with Half Moon ($199/month) if they want it monitored and fixed afterwards."
        : aiAutomation || automations >= 3
          ? "Several automations or AI steps fit Full Moon ($399/month: one new automation every month, AI steps, care for up to 15)."
          : "Two or three automations over time fit Full Moon ($399/month, one new every month), or Crescent ($349 each) plus Half Moon ($199/month) for care.";
  }
  notes.push("Not included: hosting, tool subscriptions (for example Zapier, n8n, GoHighLevel), SMS and AI usage, paid directly by the client.");

  return { lines, low, high, weeks, monthly, handoff: reasons.length > 0, handoff_reasons: reasons, plan_hint, unknown, notes };
}
