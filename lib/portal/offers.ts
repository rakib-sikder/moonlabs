// Seasonal offers: which one is live today and what it does to a plan's first payment.
// Not a "use server" file.

export type Offer = {
  id: string;
  name: string;
  headline: string;
  starts_on: string;
  ends_on: string;
  discount_percent: number;
  plans: string[] | "all";
  enabled: boolean;
  source: "calendar" | "custom";
};

export const today = () => new Date().toISOString().slice(0, 10);

function toOffer(r: Record<string, unknown>): Offer {
  const plans = String(r.plans ?? "all");
  return {
    id: String(r.id),
    name: String(r.name),
    headline: String(r.headline),
    starts_on: String(r.starts_on),
    ends_on: String(r.ends_on),
    discount_percent: Number(r.discount_percent),
    plans: plans === "all" ? "all" : plans.split(",").map((p) => p.trim()).filter(Boolean),
    enabled: Number(r.enabled) === 1,
    source: r.source === "calendar" ? "calendar" : "custom",
  };
}

export async function listOffers(db: D1Database): Promise<Offer[]> {
  const { results } = await db.prepare("SELECT * FROM offers ORDER BY starts_on, name").all<Record<string, unknown>>();
  return results.map(toOffer);
}

/** The live offer with the largest discount, or null. */
export async function getLiveOffer(db: D1Database, day = today()): Promise<Offer | null> {
  const row = await db
    .prepare("SELECT * FROM offers WHERE enabled = 1 AND starts_on <= ? AND ends_on >= ? ORDER BY discount_percent DESC, ends_on LIMIT 1")
    .bind(day, day)
    .first<Record<string, unknown>>()
    .catch(() => null);
  return row ? toOffer(row) : null;
}

export function offerApplies(offer: Offer | null, planKey: string): boolean {
  return Boolean(offer && (offer.plans === "all" || offer.plans.includes(planKey)));
}

/** First-payment amount after the offer, rounded down to whole dollars. */
export function discounted(amountCents: number, offer: Offer | null, planKey: string): number {
  if (!offer || !offerApplies(offer, planKey)) return amountCents;
  return Math.floor((amountCents * (100 - offer.discount_percent)) / 100 / 100) * 100;
}

export function offerStatus(o: Offer, day = today()): "live" | "upcoming" | "ended" | "off" {
  if (!o.enabled) return "off";
  if (o.ends_on < day) return "ended";
  if (o.starts_on > day) return "upcoming";
  return "live";
}

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
export const offerUntil = (o: Offer) => fmt.format(new Date(`${o.ends_on}T00:00:00Z`));
