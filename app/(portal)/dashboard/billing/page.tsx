import type { Metadata } from "next";
import Link from "next/link";
import { getOrgPage } from "@/lib/supabase/session";
import { listInvoices } from "@/lib/supabase/queries";
import { plans } from "@/lib/content/company";
import { formatDate, formatMoney, invoiceStatusLabel, invoiceTone, planLabel } from "@/lib/portal/format";
import { Badge, EmptyState, NoWorkspace, PageHeader, Panel } from "../../_components/ui";
import { IconExternal } from "../../_components/icons";

export const metadata: Metadata = { title: "Billing" };

export default async function BillingPage() {
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const invoices = await listInvoices(ctx.supabase, org.id);
  const plan = plans.find((p) => p.name === planLabel[org.plan]);
  const outstanding = invoices.filter((i) => i.status === "open" || i.status === "overdue");
  const outstandingByCurrency = new Map<string, number>();
  for (const i of outstanding) outstandingByCurrency.set(i.currency, (outstandingByCurrency.get(i.currency) ?? 0) + i.amount_cents);

  return (
    <>
      <PageHeader title="Billing" description="Your plan and invoices." />

      <div className="mb-6 grid gap-6 lg:grid-cols-3">
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
          <p className="mt-4 text-[12.5px] text-muted">
            To change or cancel your plan,{" "}
            <Link href="/dashboard/requests/new" className="pt-link">
              open a request
            </Link>
            .
          </p>
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

      <Panel title="Invoices" bodyClassName={null}>
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
                        <a href={i.url} target="_blank" rel="noopener noreferrer" className="pt-btn" data-size="sm" aria-label={`View invoice ${i.number} (opens in a new tab)`}>
                          View
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
