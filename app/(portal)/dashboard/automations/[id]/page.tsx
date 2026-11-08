import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrgPage } from "@/lib/supabase/session";
import { getAutomation, requestNow } from "@/lib/supabase/queries";
import { isUuid } from "@/lib/portal/validate";
import { automationStatusLabel, automationTone, formatNumber, formatPercent, formatRelative } from "@/lib/portal/format";
import { Badge, KpiTile, NoWorkspace, PageHeader, Panel } from "../../../_components/ui";
import { RunLog } from "../../../_components/run-log";

export const metadata: Metadata = { title: "Automation" };

export default async function AutomationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;
  if (!isUuid(id)) notFound();

  const now = requestNow();
  const data = await getAutomation(ctx.supabase, org.id, id, now);
  if (!data) notFound();
  const { automation: a, runs, projectName } = data;

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/automations", label: "Automations" }}
        title={a.name}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Badge tone={automationTone[a.status]}>{automationStatusLabel[a.status]}</Badge>
            {a.trigger_label && <span>{a.trigger_label}</span>}
            {projectName && a.project_id && (
              <Link href={`/dashboard/projects/${a.project_id}`} className="pt-link">
                {projectName}
              </Link>
            )}
          </span>
        }
        actions={
          ctx.isAdmin ? (
            <Link href={`/dashboard/admin/${org.id}/automations/${a.id}`} className="pt-btn">
              Manage
            </Link>
          ) : (
            <Link href="/dashboard/requests/new" className="pt-btn">
              Report a problem
            </Link>
          )
        }
      />
      {a.description && <p className="pt-prose -mt-2 mb-6 max-w-3xl text-muted">{a.description}</p>}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Last run" value={<span className="text-[20px]">{formatRelative(a.last_run_at, now)}</span>} />
        <KpiTile label="Runs, last 7 days" value={formatNumber(a.runs7d)} />
        <KpiTile label="Success rate, 7 days" value={formatPercent(a.successRate7d)} sub={`${formatNumber(a.success7d)} succeeded`} />
        <KpiTile label="Saves per run" value={`${formatNumber(a.minutes_saved_per_run)} min`} />
      </div>

      <Panel title="Run log" actions={<span className="text-[12px] text-muted">Latest 100 · UTC</span>} bodyClassName={null}>
        <RunLog runs={runs} />
      </Panel>
    </>
  );
}
