import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrgPage } from "@/lib/portal/access";
import { getProject } from "@/lib/portal/queries";
import { isUuid } from "@/lib/portal/validate";
import { formatDate, projectStatusLabel, projectTone } from "@/lib/portal/format";
import { Badge, NoWorkspace, PageHeader, Panel, StageTracker } from "../../../_components/ui";
import { MilestoneList, StageTable, UpdatesTimeline } from "../../../_components/project-views";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;
  if (!isUuid(id)) notFound();

  const data = await getProject(ctx, org.id, id);
  if (!data) notFound();
  const { project, stages, milestones, updates } = data;

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/projects", label: "Projects" }}
        title={project.name}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Badge tone={projectTone[project.status]}>{projectStatusLabel[project.status]}</Badge>
            <span>Started {formatDate(project.started_on)}</span>
            <span>Target {formatDate(project.target_on)}</span>
          </span>
        }
        actions={
          ctx.isAdmin ? (
            <Link href={`/dashboard/admin/${org.id}/projects/${project.id}`} className="pt-btn">
              Edit project
            </Link>
          ) : (
            <Link href={`/dashboard/requests/new?project=${project.id}`} className="pt-btn">
              Ask a question
            </Link>
          )
        }
      />

      {project.summary && <p className="pt-prose -mt-2 mb-6 max-w-3xl text-muted">{project.summary}</p>}

      <Panel title="Stages" className="mb-6" bodyClassName={null}>
        <div className="px-4 pb-2 pt-4">
          <StageTracker stages={stages} />
        </div>
        <StageTable stages={stages} />
      </Panel>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel title="Updates" className="lg:col-span-3" bodyClassName={null}>
          <UpdatesTimeline updates={updates} />
        </Panel>
        <Panel title="Milestones" className="lg:col-span-2" bodyClassName={null}>
          <MilestoneList milestones={milestones} />
        </Panel>
      </div>
    </>
  );
}
