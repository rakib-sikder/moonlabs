import type { Metadata } from "next";
import Link from "next/link";
import { getOrgPage } from "@/lib/portal/access";
import { listProjects } from "@/lib/portal/queries";
import { formatShortDate, projectStatusLabel, projectTone } from "@/lib/portal/format";
import { Badge, EmptyState, NoWorkspace, PageHeader, Panel, StageTracker, currentStageLabel } from "../../_components/ui";

export const metadata: Metadata = { title: "Projects" };

export default async function ProjectsPage() {
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const projects = await listProjects(ctx, org.id);

  return (
    <>
      <PageHeader title="Projects" description="Every build we are doing for you, stage by stage." />
      <Panel bodyClassName={null}>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet">When we start building for you, each project appears here with its stages and dates.</EmptyState>
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
                      <Badge tone={projectTone[p.status]}>{projectStatusLabel[p.status]}</Badge>
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
