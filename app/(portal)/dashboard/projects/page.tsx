import type { Metadata } from "next";
import Link from "next/link";
import { getOrgPage } from "@/lib/portal/access";
import { listBriefs, listProjects, waitingGateCounts } from "@/lib/portal/queries";
import { briefStatusLabel, briefTone, formatShortDate, projectStatusLabel, projectTone } from "@/lib/portal/format";
import { Badge, EmptyState, NoWorkspace, PageHeader, Panel, StageTracker, currentStageLabel } from "../../_components/ui";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const [projects, briefs, waiting] = await Promise.all([listProjects(ctx, org.id), listBriefs(ctx, org.id, true), waitingGateCounts(ctx, org.id)]);
  const newButton = (
    <Link href="/dashboard/projects/new" className="pt-btn" data-variant="primary">
      Start a new project
    </Link>
  );

  return (
    <>
      <PageHeader title="Projects" description="Every build we are doing for you, stage by stage." actions={newButton} />

      {briefs.length > 0 && (
        <Panel title="Your briefs" className="mb-6" bodyClassName={null}>
          <ul className="divide-y divide-border">
            {briefs.map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <Link href={`/dashboard/projects/briefs/${b.id}`} className="pt-row-link">
                    {b.title}
                  </Link>
                  <p className="text-[12.5px] text-muted">Sent {formatShortDate(b.created_at)}</p>
                </div>
                <Badge tone={briefTone[b.status]}>{briefStatusLabel[b.status]}</Badge>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      <Panel bodyClassName={null}>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet" action={newButton}>
            Tell us what you want built. Once we start, each project appears here with its stages and dates.
          </EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Status</th>
                  <th scope="col">Stage</th>
                  <th scope="col" className="min-w-[220px]">
                    Progress
                  </th>
                  <th scope="col">Target</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td className="max-w-[320px]">
                      <Link href={`/dashboard/projects/${p.id}`} className="pt-row-link">
                        {p.name}
                      </Link>
                      {p.summary && <p className="truncate text-[12.5px] text-muted">{p.summary}</p>}
                    </td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        <Badge tone={projectTone[p.status]}>{projectStatusLabel[p.status]}</Badge>
                        {waiting[p.id] ? (
                          <Link href={`/dashboard/projects/${p.id}#approvals`}>
                            <Badge tone="warn">Needs your approval</Badge>
                          </Link>
                        ) : null}
                      </div>
                    </td>
                    <td className="whitespace-nowrap">{currentStageLabel(p.stages)}</td>
                    <td>
                      <StageTracker stages={p.stages} compact />
                    </td>
                    <td className="pt-kbd-muted whitespace-nowrap">{formatShortDate(p.target_on)}</td>
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
