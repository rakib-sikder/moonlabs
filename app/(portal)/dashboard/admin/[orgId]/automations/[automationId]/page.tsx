import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { requireOrgAdmin } from "@/lib/portal/access";
import { getAutomation, listProjectOptions, requestNow } from "@/lib/portal/queries";
import { isUuid } from "@/lib/portal/validate";
import { automationStatusLabel, formatPercent, formatRelative, runStatusLabel } from "@/lib/portal/format";
import type { AutomationStatus, RunStatus } from "@/lib/portal/types";
import { Field, PageHeader, Panel } from "../../../../../_components/ui";
import { ActionForm } from "../../../../../_components/action-form";
import { RunLog } from "../../../../../_components/run-log";
import { deleteAutomation, logRun, updateAutomation } from "../../../actions";

export const metadata: Metadata = { title: "Manage automation" };

const AUTOMATION_STATUSES: AutomationStatus[] = ["healthy", "warning", "failing", "paused"];
const RUN_STATUSES: RunStatus[] = ["success", "failed", "running"];

export default async function AdminAutomationPage({ params }: { params: Promise<{ orgId: string; automationId: string }> }) {
  const { orgId, automationId } = await params;
  if (!(await isPortalConfigured())) return null;
  if (!isUuid(orgId) || !isUuid(automationId)) notFound();
  const { ctx, org } = await requireOrgAdmin(orgId);
  const now = requestNow();
  const [data, projects] = await Promise.all([
    getAutomation(ctx, org.id, automationId, now),
    listProjectOptions(ctx, org.id),
  ]);
  if (!data) notFound();
  const { automation: a, runs } = data;
  const hidden = (
    <>
      <input type="hidden" name="org_id" value={org.id} />
      <input type="hidden" name="automation_id" value={a.id} />
    </>
  );

  return (
    <>
      <PageHeader
        back={{ href: `/dashboard/admin/${org.id}?tab=automations`, label: `${org.name} · Automations` }}
        title={a.name}
        description={`Last run ${formatRelative(a.last_run_at, now)} · ${a.runs7d} runs in 7 days · ${formatPercent(a.successRate7d)} success`}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Log a run">
            <ActionForm action={logRun} submitLabel="Log run" resetOnSuccess>
              {hidden}
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Status" htmlFor="r-status">
                  <select id="r-status" name="status" defaultValue="success" className="pt-select">
                    {RUN_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {runStatusLabel[s]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Started (UTC)" htmlFor="r-start" hint="Blank = now">
                  <input id="r-start" name="started_at" type="datetime-local" className="pt-input" />
                </Field>
                <Field label="Duration (ms)" htmlFor="r-dur">
                  <input id="r-dur" name="duration_ms" type="number" min={0} className="pt-input" />
                </Field>
                <Field label="Items processed" htmlFor="r-items">
                  <input id="r-items" name="items_processed" type="number" min={0} className="pt-input" />
                </Field>
                <Field label="Minutes saved" htmlFor="r-min" hint={`Blank = ${a.minutes_saved_per_run} on success, 0 otherwise`}>
                  <input id="r-min" name="minutes_saved" type="number" min={0} className="pt-input" />
                </Field>
                <Field label="Message" htmlFor="r-msg" className="sm:col-span-3">
                  <input id="r-msg" name="message" maxLength={2000} className="pt-input" placeholder="Optional, e.g. the error text" />
                </Field>
              </div>
            </ActionForm>
          </Panel>

          <Panel title="Recent runs" bodyClassName={null}>
            <RunLog runs={runs} />
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Automation">
            <ActionForm action={updateAutomation} submitLabel="Save automation">
              {hidden}
              <div className="space-y-4">
                <Field label="Name" htmlFor="a-name">
                  <input id="a-name" name="name" required maxLength={160} defaultValue={a.name} className="pt-input" />
                </Field>
                <Field label="Trigger" htmlFor="a-trigger">
                  <input id="a-trigger" name="trigger_label" maxLength={160} defaultValue={a.trigger_label ?? ""} className="pt-input" />
                </Field>
                <Field label="Description" htmlFor="a-desc">
                  <textarea id="a-desc" name="description" rows={3} maxLength={4000} defaultValue={a.description ?? ""} className="pt-textarea" />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Status" htmlFor="a-status">
                    <select id="a-status" name="status" defaultValue={a.status} className="pt-select">
                      {AUTOMATION_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {automationStatusLabel[s]}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Min saved / run" htmlFor="a-min">
                    <input id="a-min" name="minutes_saved_per_run" type="number" min={0} defaultValue={a.minutes_saved_per_run} className="pt-input" />
                  </Field>
                </div>
                <Field label="Project" htmlFor="a-project">
                  <select id="a-project" name="project_id" defaultValue={a.project_id ?? ""} className="pt-select">
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </ActionForm>
          </Panel>
          <Panel title="Danger zone">
            <ActionForm
              action={deleteAutomation}
              submitLabel="Delete automation"
              variant="danger"
              hasVisibleFields={false}
              confirm={`Delete “${a.name}” and its whole run history? This cannot be undone.`}
            >
              {hidden}
            </ActionForm>
          </Panel>
        </div>
      </div>
    </>
  );
}
