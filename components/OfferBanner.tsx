"use client";

import { useEffect, useState } from "react";

type LiveOffer = { name: string; headline: string; discount: number; plans: string[] | "all"; until: string };

/** Shows the live seasonal offer, if there is one. Renders nothing otherwise. */
export function OfferBanner() {
  const [offer, setOffer] = useState<LiveOffer | null>(null);
  useEffect(() => {
    let alive = true;
    fetch("/api/offer")
      .then((r) => (r.ok ? (r.json() as Promise<{ offer: LiveOffer | null }>) : null))
      .then((d: { offer: LiveOffer | null } | null) => {
        if (alive) setOffer(d?.offer ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  if (!offer) return null;
  return (
    <div role="status" className="mb-6 flex flex-col items-start justify-between gap-2 rounded-2xl border border-accent/50 bg-accent-soft px-6 py-4 sm:flex-row sm:items-center">
      <p className="font-medium">{offer.headline}</p>
      <p className="text-sm text-muted">Applied automatically when you order. Ends {offer.until}.</p>
    </div>
  );
}
