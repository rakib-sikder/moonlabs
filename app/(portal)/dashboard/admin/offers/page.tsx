import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { getPortalContext } from "@/lib/portal/access";
import { listOffers, offerStatus, today, type Offer } from "@/lib/portal/offers";
import { plans } from "@/lib/content/company";
import { Badge, Field, PageHeader, Panel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { createOffer, deleteOffer, saveOffer } from "./actions";

export const metadata: Metadata = { title: "Offers" };

const STATUS = {
  live: { label: "Live now", tone: "ok" },
  upcoming: { label: "Upcoming", tone: "info" },
  ended: { label: "Ended", tone: "neutral" },
  off: { label: "Off", tone: "neutral" },
} as const;

function OfferFields({ o, idPrefix }: { o?: Offer; idPrefix: string }) {
  const has = (k: string) => !o || o.plans === "all" || o.plans.includes(k);
  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_2fr]">
        <Field label="Name" htmlFor={`${idPrefix}-name`}>
          <input id={`${idPrefix}-name`} name="name" required minLength={2} maxLength={80} defaultValue={o?.name} className="pt-input" />
        </Field>
        <Field label="Headline (shown to clients)" htmlFor={`${idPrefix}-headline`}>
          <input id={`${idPrefix}-headline`} name="headline" required minLength={5} maxLength={200} defaultValue={o?.headline} className="pt-input" />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_120px]">
        <Field label="Starts" htmlFor={`${idPrefix}-start`}>
          <input id={`${idPrefix}-start`} name="starts_on" type="date" required defaultValue={o?.starts_on} className="pt-input" />
        </Field>
        <Field label="Ends (last day)" htmlFor={`${idPrefix}-end`}>
          <input id={`${idPrefix}-end`} name="ends_on" type="date" required defaultValue={o?.ends_on} className="pt-input" />
        </Field>
        <Field label="% off" htmlFor={`${idPrefix}-pct`}>
          <input id={`${idPrefix}-pct`} name="discount_percent" type="number" min={1} max={90} required defaultValue={o?.discount_percent ?? 15} className="pt-input" />
        </Field>
      </div>
      <fieldset className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px]">
        <legend className="pt-label">Plans</legend>
        {plans.map((p) => (
          <label key={p.key} className="flex items-center gap-1.5">
            <input type="checkbox" name={`plan_${p.key}`} defaultChecked={has(p.key)} className="h-4 w-4" />
            {p.name}
          </label>
        ))}
        <label className="ml-auto flex items-center gap-1.5 font-medium">
          <input type="checkbox" name="enabled" defaultChecked={o ? o.enabled : true} className="h-4 w-4" />
          On
        </label>
      </fieldset>
    </div>
  );
}

export default async function OffersPage() {
  if (!(await isPortalConfigured())) return null;
  const ctx = await getPortalContext();
  if (!ctx.isStaff) redirect("/dashboard");
  const offers = await listOffers(ctx.db);
  const day = today();
  const live = offers.filter((o) => offerStatus(o, day) === "live").sort((a, b) => b.discount_percent - a.discount_percent)[0];
  const visible = offers.filter((o) => offerStatus(o, day) !== "ended");
  const ended = offers.filter((o) => offerStatus(o, day) === "ended");

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/admin", label: "Admin" }}
        title="Offers"
        description={
          live ? (
            <span>
              Live now: <b>{live.name}</b>, {live.discount_percent}% off the first payment.
            </span>
          ) : (
            "No offer is live today."
          )
        }
      />
      <p className="-mt-2 mb-6 max-w-3xl text-[13px] text-muted">
        Offers switch on and off by themselves on their dates. A live offer shows on the pricing page and in Billing, is applied to the first
        invoice of a plan order, and Moon mentions it. If two overlap, the bigger discount wins. Ramadan and Eid dates are estimates; check them
        a few weeks before.
      </p>

      <Panel title={`Calendar (${visible.length})`} className="mb-6" bodyClassName={null}>
        <ul className="divide-y divide-border">
          {visible.map((o) => {
            const st = STATUS[offerStatus(o, day)];
            return (
              <li key={o.id} className="px-4 py-3">
                <details>
                  <summary className="flex cursor-pointer flex-wrap items-center justify-between gap-2">
                    <span>
                      <span className="font-medium">{o.name}</span>
                      <span className="text-[12.5px] text-muted">
                        {" "}
                        · {o.starts_on} to {o.ends_on} · {o.discount_percent}% off · {o.plans === "all" ? "all plans" : o.plans.join(", ")}
                      </span>
                    </span>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </summary>
                  <div className="mt-3 rounded-md border border-border p-3">
                    <ActionForm action={saveOffer} submitLabel="Save offer" size="sm">
                      <input type="hidden" name="offer_id" value={o.id} />
                      <OfferFields o={o} idPrefix={o.id} />
                    </ActionForm>
                    {o.source === "custom" && (
                      <ActionForm action={deleteOffer} submitLabel="Delete" size="sm" variant="ghost" hasVisibleFields={false} className="mt-2" confirm={`Delete ${o.name}?`}>
                        <input type="hidden" name="offer_id" value={o.id} />
                      </ActionForm>
                    )}
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </Panel>

      <Panel title="Add an offer" className="mb-6">
        <ActionForm action={createOffer} submitLabel="Add offer" resetOnSuccess>
          <OfferFields idPrefix="new" />
        </ActionForm>
      </Panel>

      {ended.length > 0 && (
        <Panel title={`Ended (${ended.length})`} bodyClassName={null}>
          <ul className="divide-y divide-border text-[13px]">
            {ended.map((o) => (
              <li key={o.id} className="px-4 py-2 text-muted">
                {o.name} · {o.starts_on} to {o.ends_on} · {o.discount_percent}%
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
