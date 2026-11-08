import type { Metadata } from "next";
import Link from "next/link";
import { getOrgPage } from "@/lib/portal/access";
import { getOverview, requestNow } from "@/lib/portal/queries";
import type { ActivityItem } from "@/lib/portal/types";
import {
  formatNumber,
  formatPercent,
  formatRelative,
  formatShortDate,
  planLabel,
  projectStatusLabel,
  projectTone,
} from "@/lib/portal/format";
import { Badge, EmptyState, KpiTile, NoWorkspace, PageHeader, Panel, StageTracker, currentStageLabel } from "../_components/ui";

export const metadata: Metadata = { title: "Overview" };

const KIND_LABEL: Record<ActivityItem["kind"], string> = {
  update: "Project update",
  request: "Request",
  comment: "Comment",
  run_failed: "Failed run",
  file: "File",
  invoice: "Invoice",
};

const KIND_COLOR: Record<ActivityItem["kind"], string> = {
  update: "var(--accent)",
  request: "var(--pt-info)",
  comment: "var(--muted)",
  run_failed: "var(--pt-bad)",
  file: "var(--pt-ok)",
  invoice: "var(--moon)",
};

export default async function OverviewPage() {
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const now = requestNow();
  const data = await getOverview(ctx, org.id, now);
  const monthName = new Intl.DateTimeFormat("en-US", { month: "long", timeZone: "UTC" }).format(now);

  return (
    <>
      <PageHeader
        title="Overview"
        description={
          <>
            {org.name}
            {org.plan !== "none" && <> · {planLabel[org.plan]} plan</>}
          </>
        }
        actions={
          <Link href="/dashboard/requests/new" className="pt-btn" data-variant="primary">
            New request
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile
          label="Active automations"
          value={formatNumber(data.activeAutomations)}
          sub={
            data.attention > 0 ? (
              <span style={{ color: "var(--pt-warn)" }}>{data.attention} need attention</span>
            ) : data.totalAutomations > 0 ? (
              "All healthy"
            ) : (
              "None yet"
            )
          }
          href="/dashboard/automations"
        />
        <KpiTile
          label="Runs, last 7 days"
          value={formatNumber(data.runs7d)}
          sub={data.successRate7d === null ? "No finished runs" : `${formatPercent(data.successRate7d)} succeeded`}
          href="/dashboard/automations"
        />
        <KpiTile label={`Hours saved in ${monthName}`} value={formatNumber(data.hoursSavedMonth, 1)} sub="From successful runs" />
        <KpiTile
          label="Open requests"
          value={formatNumber(data.openRequests)}
          sub={data.waitingOnClient > 0 ? `${data.waitingOnClient} waiting on you` : "Nothing waiting on you"}
          href="/dashboard/requests"
        />
      </div>

      <div className="mt-6 grid items-start grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel
          title="Projects in progress"
          className="lg:col-span-2"
          bodyClassName={null}
          actions={
            <Link href="/dashboard/projects" className="pt-link text-[13px]">
              All projects
            </Link>
          }
        >
          {data.projects.length === 0 ? (
            <EmptyState title="No active projects">Projects appear here once work starts.</EmptyState>
          ) : (
            <ul className="divide-y divide-border">
              {data.projects.map((p) => (
                <li key={p.id} className="px-4 py-4">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <Link href={`/dashboard/projects/${p.id}`} className="font-medium hover:text-accent">
                      {p.name}
                    </Link>
                    <div className="flex items-center gap-2 text-[12.5px] text-muted">
                      <span>{currentStageLabel(p.stages)}</span>
                      {p.target_on && <span>· Target {formatShortDate(p.target_on)}</span>}
                      {p.status !== "active" && <Badge tone={projectTone[p.status]}>{projectStatusLabel[p.status]}</Badge>}
                    </div>
                  </div>
                  <StageTracker stages={p.stages} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel title="Recent activity" bodyClassName={null}>
          {data.activity.length === 0 ? (
            <EmptyState title="Nothing yet">Updates, requests and deliveries will show up here.</EmptyState>
          ) : (
            <ol className="divide-y divide-border">
              {data.activity.map((a) => (
                <li key={a.id} className="flex gap-3 px-4 py-3">
                  <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: KIND_COLOR[a.kind] }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] leading-snug">
                      <span className="sr-only">{KIND_LABEL[a.kind]}: </span>
                      {a.href ? (
                        <Link href={a.href} className="hover:text-accent">
                          {a.title}
                        </Link>
                      ) : (
                        a.title
                      )}
                    </p>
                    {a.detail && <p className="truncate text-[12.5px] text-muted">{a.detail}</p>}
                  </div>
                  <time dateTime={a.at} className="shrink-0 text-[12px] text-muted tabular-nums">
                    {formatRelative(a.at, now)}
                  </time>
                </li>
              ))}
            </ol>
          )}
        </Panel>
      </div>
    </>
  );
}
