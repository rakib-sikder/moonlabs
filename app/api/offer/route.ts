// The live seasonal offer, for static marketing pages (they cannot read the database at build time).
import { getDb } from "@/lib/portal/env";
import { getLiveOffer, offerUntil } from "@/lib/portal/offers";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const offer = db ? await getLiveOffer(db) : null;
  const body = offer
    ? { offer: { name: offer.name, headline: offer.headline, discount: offer.discount_percent, plans: offer.plans, until: offerUntil(offer) } }
    : { offer: null };
  return Response.json(body, { headers: { "Cache-Control": "public, max-age=300" } });
}
