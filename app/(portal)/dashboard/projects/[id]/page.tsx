import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrgPage } from "@/lib/portal/access";
import { getProject, getProjectBrief, listGates, listSecrets } from "@/lib/portal/queries";
import { isVaultConfigured } from "@/lib/portal/vault";
import { ClientSecretsPanel } from "../../../_components/secret-views";
import { BriefView } from "../../../_components/brief-view";
import { GateBody, GateHistory } from "../../../_components/gate-views";
import { ActionForm } from "../../../_components/action-form";
import { decideGate } from "../actions";
import { isUuid } from "@/lib/portal/validate";
import { GATE_KINDS, formatDate, gateKindLabel, gateUnlocks, projectStatusLabel, projectTone, stageLabel } from "@/lib/portal/format";
import { Badge, NoWorkspace, PageHeader, Panel, StageTracker } from "../../../_components/ui";
import { MilestoneList, StageTable, UpdatesTimeline } from "../../../_components/project-views";

export const metadata: Metadata = { title: "Project" };

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ decided?: string }>;
}) {
  const [{ id }, { decided }] = await Promise.all([params, searchParams]);
  const approvedKind = GATE_KINDS.find((k) => k === decided);
  const confirmation = approvedKind
    ? `Approved. We are starting ${stageLabel[gateUnlocks[approvedKind]]}.`
    : decided === "changes"
      ? "Thanks. We will make the changes and send you a new version to approve."
      : null;
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;
  if (!isUuid(id)) notFound();

  const [data, brief, gates, secrets, vault] = await Promise.all([
    getProject(ctx, org.id, id),
    getProjectBrief(ctx, org.id, id),
    listGates(ctx, org.id, id),
    listSecrets(ctx, org.id, id),
    isVaultConfigured(),
  ]);
  if (!data) notFound();
  const waiting = gates.filter((g) => g.status === "waiting");
  const answered = gates.filter((g) => g.status !== "waiting");
  const canDecide = !ctx.isStaff && org.role === "client";
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

      {confirmation && (
        <p role="status" className="mb-6 rounded-lg border px-4 py-3 text-[13.5px]" style={{ borderColor: "var(--pt-ok)", background: "var(--pt-ok-soft)" }}>
          {confirmation}
        </p>
      )}

      {project.summary && <p className="pt-prose -mt-2 mb-6 max-w-3xl text-muted">{project.summary}</p>}

      {waiting.length > 0 && (
        <Panel id="approvals" title="Waiting for your approval" className="mb-6 border-[color:var(--pt-warn)]" bodyClassName={null}>
          <ul className="divide-y divide-border">
            {waiting.map((g) => (
              <li key={g.id} className="px-4 py-4">
                <p className="font-medium">
                  <span className="text-muted">{gateKindLabel[g.kind]}:</span> {g.title}
                </p>
                <p className="text-[12.5px] text-muted">
                  Sent {formatDate(g.created_at)}. We start {stageLabel[gateUnlocks[g.kind]]} once you approve.
                </p>
                <GateBody gate={g} />
                {canDecide ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr] md:items-start">
                    <ActionForm action={decideGate} submitLabel="Approve" hasVisibleFields={false} confirm={`Approve the ${gateKindLabel[g.kind].toLowerCase()} "${g.title}"?`}>
                      <input type="hidden" name="org_id" value={org.id} />
                      <input type="hidden" name="gate_id" value={g.id} />
                      <input type="hidden" name="decision" value="approved" />
                    </ActionForm>
                    <ActionForm action={decideGate} submitLabel="Request changes" variant="default">
                      <input type="hidden" name="org_id" value={org.id} />
                      <input type="hidden" name="gate_id" value={g.id} />
                      <input type="hidden" name="decision" value="changes_requested" />
                      <label htmlFor={`note-${g.id}`} className="pt-label">
                        Or tell us what to change
                      </label>
                      <textarea id={`note-${g.id}`} name="client_note" required minLength={3} maxLength={4000} rows={2} className="pt-textarea" />
                    </ActionForm>
                  </div>
                ) : (
                  <p className="mt-3 text-[12.5px] text-muted">Only the client&apos;s team can approve this.</p>
                )}
              </li>
            ))}
          </ul>
        </Panel>
      )}

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

      {vault && project.status !== "completed" && project.status !== "cancelled" && (
        <ClientSecretsPanel orgId={org.id} projectId={project.id} secrets={secrets} />
      )}

      {answered.length > 0 && (
        <Panel title="Approvals" className="mt-6" bodyClassName={null}>
          <GateHistory gates={answered} />
        </Panel>
      )}

      {brief && (
        <Panel title="Your brief" className="mt-6">
          <details>
            <summary className="cursor-pointer text-[13.5px] text-muted">What you asked for, as you wrote it</summary>
            <div className="mt-4">
              <BriefView brief={brief} />
            </div>
          </details>
        </Panel>
      )}
    </>
  );
}
