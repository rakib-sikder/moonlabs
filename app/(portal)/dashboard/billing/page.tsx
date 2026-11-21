import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getOrgPage } from "@/lib/portal/access";
import { getSessionUser } from "@/lib/portal/auth";
import { getPendingPlanOrder, listInvoices } from "@/lib/portal/queries";
import { plans } from "@/lib/content/company";
import { formatDate, formatMoney, invoiceStatusLabel, invoiceTone, planLabel } from "@/lib/portal/format";
import { Badge, EmptyState, NoWorkspace, PageHeader, Panel } from "../../_components/ui";
import { IconExternal } from "../../_components/icons";
import { ActionForm } from "../../_components/action-form";
import { cancelPlanOrder, orderPlan } from "./actions";
import { discounted, getLiveOffer, offerApplies, offerUntil } from "@/lib/portal/offers";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = await searchParams;
  const wanted = typeof query.plan === "string" ? plans.find((p) => p.key === query.plan)?.key : undefined;
  if (!(await getSessionUser())) {
    const next = wanted ? `/dashboard/billing?plan=${wanted}` : "/dashboard/billing";
    redirect(`/signup?next=${encodeURIComponent(next)}`);
  }
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const [invoices, pendingOrder, offer] = await Promise.all([listInvoices(ctx, org.id), getPendingPlanOrder(ctx, org.id), getLiveOffer(ctx.db)]);
  const pendingPlan = pendingOrder ? plans.find((p) => p.key === pendingOrder.plan) : undefined;
  const plan = plans.find((p) => p.name === planLabel[org.plan]);
  const outstanding = invoices.filter((i) => i.status === "open" || i.status === "overdue");
  const outstandingByCurrency = new Map<string, number>();
  for (const i of outstanding) outstandingByCurrency.set(i.currency, (outstandingByCurrency.get(i.currency) ?? 0) + i.amount_cents);

  return (
    <>
      <PageHeader title="Billing" description="Your plan and invoices." />

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Current plan" className="lg:col-span-2">
          {org.plan === "none" ? (
            <p className="text-muted">No plan on file. Project work is billed per invoice below.</p>
          ) : (
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-[18px] font-semibold">{planLabel[org.plan]}</p>
                {plan && <p className="text-muted">{plan.tagline}</p>}
                {org.plan_started_on && <p className="mt-1 text-[12.5px] text-muted">Since {formatDate(org.plan_started_on)}</p>}
              </div>
              {plan && (
                <p className="text-right">
                  <span className="text-[18px] font-semibold tabular-nums">{plan.price}</span>
                  <span className="block text-[12.5px] text-muted">{plan.unit}</span>
                </p>
              )}
              {plan && (
                <ul className="w-full space-y-1 border-t border-border pt-3 text-[13px] text-muted">
                  {plan.features.map((f) => (
                    <li key={f}>· {f}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {org.plan !== "none" && (
            <p className="mt-4 text-[12.5px] text-muted">
              To cancel your plan,{" "}
              <Link href="/dashboard/requests/new" className="pt-link">
                open a request
              </Link>
              .
            </p>
          )}
        </Panel>
        <Panel title="Outstanding">
          {outstanding.length === 0 ? (
            <p className="text-muted">Nothing due. Thank you.</p>
          ) : (
            <>
              {[...outstandingByCurrency].map(([cur, total]) => (
                <p key={cur} className="text-[22px] font-semibold tabular-nums">
                  {formatMoney(total, cur)}
                </p>
              ))}
              <p className="mt-1 text-[12.5px] text-muted">
                {outstanding.length} unpaid invoice{outstanding.length === 1 ? "" : "s"}
              </p>
            </>
          )}
        </Panel>
      </div>

      {pendingOrder ? (
        <Panel title="Your plan order" className="mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold">
                {pendingPlan?.name ?? pendingOrder.plan} {pendingPlan && <span className="font-normal text-muted">· {pendingPlan.price} {pendingPlan.unit}</span>}
              </p>
              <p className="mt-1 text-[13px] text-muted">
                {pendingOrder.url
                  ? `Invoice ${pendingOrder.number ?? ""} is ready. Pay by card or bank transfer; the plan starts when the payment arrives.`
                  : `Invoice ${pendingOrder.number ?? ""} is open. We will add a secure payment link here and email it to you within one business day.`}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {pendingOrder.url && (
                <a href={pendingOrder.url} target="_blank" rel="noopener noreferrer" className="pt-btn" data-variant="primary">
                  Pay now
                  <IconExternal className="h-3.5 w-3.5" />
                </a>
              )}
              <ActionForm action={cancelPlanOrder} submitLabel="Cancel order" variant="ghost" size="sm" hasVisibleFields={false} confirm="Cancel this plan order?">
                <input type="hidden" name="org_id" value={org.id} />
              </ActionForm>
            </div>
          </div>
        </Panel>
      ) : (
        <section id="plans" className="mb-6" aria-labelledby="plans-title" data-tour="billing-plans">
          <h2 id="plans-title" className="mb-3 text-[15px] font-semibold">
            {org.plan === "none" ? "Choose a plan" : "Change plan"}
          </h2>
          {offer && (
            <p role="status" className="mb-3 rounded-lg border px-4 py-3 text-[13.5px]" style={{ borderColor: "var(--accent)", background: "var(--pt-warn-soft)" }}>
              <b>{offer.headline}</b> Applied automatically to your first payment. Ends {offerUntil(offer)}.
            </p>
          )}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {plans.map((p) => {
              const current = org.plan === p.key;
              const highlighted = wanted ? wanted === p.key : p.featured;
              return (
                <div
                  key={p.key}
                  className="flex flex-col rounded-lg border bg-surface p-5"
                  style={{ borderColor: highlighted ? "var(--accent)" : "var(--border)", boxShadow: highlighted ? "0 0 0 1px var(--accent)" : undefined }}
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-[13px] text-muted">{p.tagline}</p>
                  <p className="mt-3">
                    {offerApplies(offer, p.key) ? (
                      <>
                        <span className="mr-2 text-[15px] text-muted line-through tabular-nums">{p.price}</span>
                        <span className="text-[22px] font-semibold tabular-nums">{formatMoney(discounted(p.amountCents, offer, p.key)).replace(/\.00$/, "")}</span>
                        <span className="ml-1 text-[12.5px] text-muted">{p.unit.startsWith("per") ? "first month" : p.unit}</span>
                      </>
                    ) : (
                      <>
                        <span className="text-[22px] font-semibold tabular-nums">{p.price}</span>
                        <span className="ml-1 text-[12.5px] text-muted">{p.unit}</span>
                      </>
                    )}
                  </p>
                  {offerApplies(offer, p.key) && p.unit.startsWith("per") && (
                    <p className="text-[12px] text-muted">
                      then {p.price} {p.unit}
                    </p>
                  )}
                  <ul className="mt-3 flex-1 space-y-1 text-[13px] text-muted">
                    {p.features.map((f) => (
                      <li key={f}>· {f}</li>
                    ))}
                  </ul>
                  {current ? (
                    <p className="mt-4 text-[13px] font-medium">Your current plan</p>
                  ) : (
                    <ActionForm
                      action={orderPlan}
                      submitLabel={`Choose ${p.name}`}
                      pendingLabel="Ordering…"
                      variant={highlighted ? "primary" : "default"}
                      className="mt-4 [&_button]:w-full"
                      hasVisibleFields={false}
                    >
                      <input type="hidden" name="org_id" value={org.id} />
                      <input type="hidden" name="plan" value={p.key} />
                    </ActionForm>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 text-[12.5px] text-muted">
            After you choose, we email you a secure payment link (card or bank transfer). Nothing is charged until you pay it.
          </p>
        </section>
      )}

      <Panel title="Invoices" bodyClassName={null} tour="billing-invoices">
        {invoices.length === 0 ? (
          <EmptyState title="No invoices yet">Invoices appear here as soon as they are issued.</EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Issued</th>
                  <th scope="col">Due</th>
                  <th scope="col" className="pt-num">
                    Amount
                  </th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="sr-only">Link</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="font-medium tabular-nums">{i.number}</td>
                    <td className="pt-kbd-muted whitespace-nowrap">{formatDate(i.issued_on)}</td>
                    <td className="pt-kbd-muted whitespace-nowrap">{formatDate(i.due_on)}</td>
                    <td className="pt-num">{formatMoney(i.amount_cents, i.currency)}</td>
                    <td>
                      <Badge tone={invoiceTone[i.status]}>{invoiceStatusLabel[i.status]}</Badge>
                    </td>
                    <td className="text-right">
                      {i.url ? (
                        <a href={i.url} target="_blank" rel="noopener noreferrer" className="pt-btn" data-size="sm" aria-label={`${i.status === "open" || i.status === "overdue" ? "Pay" : "View"} invoice ${i.number} (opens in a new tab)`}>
                          {i.status === "open" || i.status === "overdue" ? "Pay" : "View"}
                          <IconExternal className="h-3.5 w-3.5" />
                        </a>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
    </>
  );
}
