import type { Metadata } from "next";
import Link from "next/link";
import { getOrgPage } from "@/lib/supabase/session";
import { listAutomations, requestNow } from "@/lib/supabase/queries";
import { automationStatusLabel, automationTone, formatNumber, formatPercent, formatRelative } from "@/lib/portal/format";
import { Badge, EmptyState, NoWorkspace, PageHeader, Panel } from "../../_components/ui";

export const metadata: Metadata = { title: "Automations" };

export default async function AutomationsPage() {
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const now = requestNow();
  const automations = await listAutomations(ctx.supabase, org.id, now);
  const order = { failing: 0, warning: 1, healthy: 2, paused: 3 } as const;
  const sorted = [...automations].sort((a, b) => order[a.status] - order[b.status] || a.name.localeCompare(b.name));

  return (
    <>
      <PageHeader title="Automations" description="Health and activity of everything running for you. Times are UTC." />
      <Panel bodyClassName={null}>
        {sorted.length === 0 ? (
          <EmptyState title="No automations yet">Once an automation goes live, its runs and health show up here.</EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last run</th>
                  <th scope="col" className="pt-num">
                    Runs 7d
                  </th>
                  <th scope="col" className="pt-num">
                    Success 7d
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((a) => (
                  <tr key={a.id}>
                    <td className="max-w-[360px]">
                      <Link href={`/dashboard/automations/${a.id}`} className="pt-row-link">
                        {a.name}
                      </Link>
                      {a.trigger_label && <p className="truncate text-[12.5px] text-muted">{a.trigger_label}</p>}
                    </td>
                    <td>
                      <Badge tone={automationTone[a.status]}>{automationStatusLabel[a.status]}</Badge>
                    </td>
                    <td className="pt-kbd-muted whitespace-nowrap">
                      {a.last_run_at ? <time dateTime={a.last_run_at}>{formatRelative(a.last_run_at, now)}</time> : "Never"}
                    </td>
                    <td className="pt-num">{formatNumber(a.runs7d)}</td>
                    <td className="pt-num">{formatPercent(a.successRate7d)}</td>
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
