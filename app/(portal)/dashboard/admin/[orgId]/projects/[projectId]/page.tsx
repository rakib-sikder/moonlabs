import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { requireOrgAdmin } from "@/lib/portal/access";
import { getProject, getProjectBrief, listGates } from "@/lib/portal/queries";
import { BriefView } from "../../../../../_components/brief-view";
import { GateBody, GateHistory } from "../../../../../_components/gate-views";
import { isUuid } from "@/lib/portal/validate";
import {
  GATE_KINDS,
  STAGES,
  formatDate,
  formatShortDate,
  gateKindLabel,
  gateUnlocks,
  projectStatusLabel,
  stageLabel,
  stageStatusLabel,
} from "@/lib/portal/format";
import type { ProjectStatus, StageStatus } from "@/lib/portal/types";
import { EmptyState, Field, PageHeader, Panel, StageTracker } from "../../../../../_components/ui";
import { ActionForm } from "../../../../../_components/action-form";
import {
  addMilestone,
  deleteMilestone,
  deleteProject,
  deleteUpdate,
  postUpdate,
  requestApproval,
  setMilestoneDone,
  withdrawApproval,
  updateProject,
  updateStage,
} from "../../../actions";

export const metadata: Metadata = { title: "Edit project" };

const PROJECT_STATUSES: ProjectStatus[] = ["active", "on_hold", "completed", "cancelled"];
const STAGE_STATUSES: StageStatus[] = ["pending", "active", "done"];

export default async function AdminProjectPage({ params }: { params: Promise<{ orgId: string; projectId: string }> }) {
  const { orgId, projectId } = await params;
  if (!(await isPortalConfigured())) return null;
  if (!isUuid(orgId) || !isUuid(projectId)) notFound();
  const { ctx, org } = await requireOrgAdmin(orgId);
  const [data, brief, gates] = await Promise.all([
    getProject(ctx, org.id, projectId),
    getProjectBrief(ctx, org.id, projectId),
    listGates(ctx, org.id, projectId),
  ]);
  if (!data) notFound();
  // Suggest the first gate kind not approved yet.
  const nextGate = GATE_KINDS.find((k) => !gates.some((g) => g.kind === k && g.status === "approved")) ?? "release";
  const { project, stages, milestones, updates } = data;
  const stageByKey = new Map(stages.map((s) => [s.stage, s]));
  const hidden = (
    <>
      <input type="hidden" name="org_id" value={org.id} />
      <input type="hidden" name="project_id" value={project.id} />
    </>
  );

  return (
    <>
      <PageHeader
        back={{ href: `/dashboard/admin/${org.id}?tab=projects`, label: `${org.name} · Projects` }}
        title={project.name}
        description="Changes are visible to the client immediately."
        actions={
          ctx.currentOrg?.id === org.id ? (
            <Link href={`/dashboard/projects/${project.id}`} className="pt-btn">
              View as client
            </Link>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Stages" bodyClassName={null}>
            <div className="px-4 pb-2 pt-4">
              <StageTracker stages={stages} />
            </div>
            <ul className="divide-y divide-border border-t border-border">
              {STAGES.map((key) => {
                const s = stageByKey.get(key);
                const id = `stage-${key}`;
                return (
                  <li key={key} className="px-4 py-4">
                    <h3 className="mb-2 font-medium">{stageLabel[key]}</h3>
                    <ActionForm action={updateStage} submitLabel="Save" size="sm" variant="default" inline submitAriaLabel={`Save ${stageLabel[key]} stage`}>
                      {hidden}
                      <input type="hidden" name="stage" value={key} />
                      <div className="w-32">
                        <label htmlFor={`${id}-status`} className="pt-label">
                          Status
                        </label>
                        <select id={`${id}-status`} name="status" defaultValue={s?.status ?? "pending"} className="pt-select">
                          {STAGE_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {stageStatusLabel[st]}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="w-36">
                        <label htmlFor={`${id}-start`} className="pt-label">
                          Started
                        </label>
                        <input id={`${id}-start`} name="started_on" type="date" defaultValue={s?.started_on ?? ""} className="pt-input" />
                      </div>
                      <div className="w-36">
                        <label htmlFor={`${id}-due`} className="pt-label">
                          Due
                        </label>
                        <input id={`${id}-due`} name="due_on" type="date" defaultValue={s?.due_on ?? ""} className="pt-input" />
                      </div>
                      <div className="w-36">
                        <label htmlFor={`${id}-done`} className="pt-label">
                          Completed
                        </label>
                        <input id={`${id}-done`} name="completed_on" type="date" defaultValue={s?.completed_on ?? ""} className="pt-input" />
                      </div>
                      <div className="min-w-[12rem] flex-1">
                        <label htmlFor={`${id}-notes`} className="pt-label">
                          Note for client
                        </label>
                        <input id={`${id}-notes`} name="notes" maxLength={1000} defaultValue={s?.notes ?? ""} className="pt-input" />
                      </div>
                    </ActionForm>
                  </li>
                );
              })}
            </ul>
          </Panel>

          <Panel id="approvals" title="Client approvals" bodyClassName={null}>
            <div className="border-b border-border p-4">
              <ActionForm action={requestApproval} submitLabel="Send for approval" resetOnSuccess>
                {hidden}
                <div className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-[220px_1fr]">
                    <Field label="Type" htmlFor="g-kind">
                      <select id="g-kind" name="kind" defaultValue={nextGate} className="pt-select">
                        {GATE_KINDS.map((k) => (
                          <option key={k} value={k}>
                            {gateKindLabel[k]} (unlocks {stageLabel[gateUnlocks[k]]})
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Title" htmlFor="g-title">
                      <input id="g-title" name="title" required minLength={3} maxLength={200} placeholder="e.g. Spec v1: booking and payments" className="pt-input" />
                    </Field>
                  </div>
                  <Field label="Link to the work" htmlFor="g-link" hint="A doc, Figma, preview site or a file from the Files tab.">
                    <input id="g-link" name="link_url" type="url" maxLength={2000} placeholder="https://" className="pt-input" />
                  </Field>
                  <Field label="What to check" htmlFor="g-details">
                    <textarea id="g-details" name="details" rows={3} maxLength={10000} className="pt-textarea" />
                  </Field>
                </div>
              </ActionForm>
              <p className="mt-2 text-[12.5px] text-muted">
                The client&apos;s members are emailed. Until they approve, the stage it unlocks cannot be started. Approving finishes the stage before it and starts it.
              </p>
            </div>
            {gates.length === 0 ? (
              <EmptyState title="No approvals asked yet" />
            ) : (
              <>
                {gates
                  .filter((g) => g.status === "waiting")
                  .map((g) => (
                    <div key={g.id} className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium">
                          <span className="text-muted">{gateKindLabel[g.kind]}:</span> {g.title}
                        </p>
                        <p className="text-[12.5px] text-muted">Waiting since {formatDate(g.created_at)}</p>
                        <GateBody gate={g} />
                      </div>
                      <ActionForm action={withdrawApproval} submitLabel="Withdraw" size="sm" variant="ghost" hasVisibleFields={false} confirm="Withdraw this approval request?">
                        <input type="hidden" name="org_id" value={org.id} />
                        <input type="hidden" name="gate_id" value={g.id} />
                      </ActionForm>
                    </div>
                  ))}
                <GateHistory gates={gates.filter((g) => g.status !== "waiting")} />
              </>
            )}
          </Panel>

          {brief && (
            <Panel title="Client's brief">
              <details>
                <summary className="cursor-pointer text-[13.5px] text-muted">As the client wrote it</summary>
                <div className="mt-4">
                  <BriefView brief={brief} />
                </div>
              </details>
            </Panel>
          )}

          <Panel title="Updates" bodyClassName={null}>
            <div className="border-b border-border p-4">
              <ActionForm action={postUpdate} submitLabel="Post update" resetOnSuccess>
                {hidden}
                <div className="space-y-3">
                  <Field label="Title" htmlFor="u-title">
                    <input id="u-title" name="title" required maxLength={200} className="pt-input" />
                  </Field>
                  <Field label="Body" htmlFor="u-body">
                    <textarea id="u-body" name="body" rows={4} maxLength={10000} className="pt-textarea" />
                  </Field>
                </div>
              </ActionForm>
            </div>
            {updates.length === 0 ? (
              <EmptyState title="No updates posted yet" />
            ) : (
              <ul className="divide-y divide-border">
                {updates.map((u) => (
                  <li key={u.id} className="flex items-start justify-between gap-4 px-4 py-3">
                    <div className="min-w-0">
                      <p className="font-medium">{u.title}</p>
                      <p className="text-[12px] text-muted">{formatDate(u.created_at)}</p>
                    </div>
                    <ActionForm action={deleteUpdate} submitLabel="Delete" size="sm" variant="ghost" confirm="Delete this update?" submitAriaLabel={`Delete update ${u.title}`}>
                      <input type="hidden" name="org_id" value={org.id} />
                      <input type="hidden" name="update_id" value={u.id} />
                    </ActionForm>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Project">
            <ActionForm action={updateProject} submitLabel="Save project">
              {hidden}
              <div className="space-y-4">
                <Field label="Name" htmlFor="p-name">
                  <input id="p-name" name="name" required maxLength={160} defaultValue={project.name} className="pt-input" />
                </Field>
                <Field label="Summary" htmlFor="p-summary">
                  <textarea id="p-summary" name="summary" rows={4} maxLength={4000} defaultValue={project.summary ?? ""} className="pt-textarea" />
                </Field>
                <Field label="Status" htmlFor="p-status">
                  <select id="p-status" name="status" defaultValue={project.status} className="pt-select">
                    {PROJECT_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {projectStatusLabel[s]}
                      </option>
                    ))}
                  </select>
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Start" htmlFor="p-start">
                    <input id="p-start" name="started_on" type="date" defaultValue={project.started_on ?? ""} className="pt-input" />
                  </Field>
                  <Field label="Target" htmlFor="p-target">
                    <input id="p-target" name="target_on" type="date" defaultValue={project.target_on ?? ""} className="pt-input" />
                  </Field>
                </div>
              </div>
            </ActionForm>
          </Panel>

          <Panel title={`Milestones (${milestones.filter((m) => m.done).length}/${milestones.length})`} bodyClassName={null}>
            {milestones.length > 0 && (
              <ul className="divide-y divide-border">
                {milestones.map((m) => (
                  <li key={m.id} className="flex items-center gap-2 px-4 py-2">
                    <div className="min-w-0 flex-1">
                      <p className={m.done ? "text-muted line-through" : ""}>{m.title}</p>
                      <p className="text-[12px] text-muted">
                        {m.stage ? stageLabel[m.stage] : "No stage"}
                        {m.due_on && ` · Due ${formatShortDate(m.due_on)}`}
                      </p>
                    </div>
                    <ActionForm action={setMilestoneDone} submitLabel={m.done ? "Reopen" : "Done"} size="sm" variant="default" submitAriaLabel={`${m.done ? "Reopen" : "Mark done"}: ${m.title}`}>
                      <input type="hidden" name="org_id" value={org.id} />
                      <input type="hidden" name="milestone_id" value={m.id} />
                      <input type="hidden" name="done" value={m.done ? "false" : "true"} />
                    </ActionForm>
                    <ActionForm action={deleteMilestone} submitLabel="✕" size="sm" variant="ghost" confirm={`Delete “${m.title}”?`} submitAriaLabel={`Delete milestone ${m.title}`}>
                      <input type="hidden" name="org_id" value={org.id} />
                      <input type="hidden" name="milestone_id" value={m.id} />
                    </ActionForm>
                  </li>
                ))}
              </ul>
            )}
            <div className={`p-4 ${milestones.length > 0 ? "border-t border-border" : ""}`}>
              <ActionForm action={addMilestone} submitLabel="Add milestone" resetOnSuccess variant="default">
                {hidden}
                <input type="hidden" name="position" value={milestones.length + 1} />
                <div className="space-y-3">
                  <Field label="Title" htmlFor="m-title">
                    <input id="m-title" name="title" required maxLength={200} className="pt-input" />
                  </Field>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Stage" htmlFor="m-stage">
                      <select id="m-stage" name="stage" defaultValue="" className="pt-select">
                        <option value="">None</option>
                        {STAGES.map((k) => (
                          <option key={k} value={k}>
                            {stageLabel[k]}
                          </option>
                        ))}
                      </select>
                    </Field>
                    <Field label="Due" htmlFor="m-due">
                      <input id="m-due" name="due_on" type="date" className="pt-input" />
                    </Field>
                  </div>
                </div>
              </ActionForm>
            </div>
          </Panel>

          <Panel title="Danger zone">
            <ActionForm
              action={deleteProject}
              submitLabel="Delete project"
              hasVisibleFields={false}
              variant="danger"
              confirm={`Delete “${project.name}” with all its stages, milestones and updates? This cannot be undone.`}
            >
              {hidden}
            </ActionForm>
          </Panel>
        </div>
      </div>
    </>
  );
}
