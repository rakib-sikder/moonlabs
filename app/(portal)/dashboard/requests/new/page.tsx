import type { Metadata } from "next";
import { getOrgPage } from "@/lib/supabase/session";
import { listProjectOptions } from "@/lib/supabase/queries";
import { isUuid } from "@/lib/portal/validate";
import { requestPriorityLabel } from "@/lib/portal/format";
import type { RequestPriority } from "@/lib/portal/types";
import { Field, NoWorkspace, PageHeader, Panel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { createRequest } from "../../../actions";

export const metadata: Metadata = { title: "New request" };

const PRIORITIES: RequestPriority[] = ["low", "normal", "high", "urgent"];

export default async function NewRequestPage({ searchParams }: { searchParams: Promise<{ project?: string }> }) {
  const { project } = await searchParams;
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const projects = await listProjectOptions(ctx.supabase, org.id);
  const preselect = isUuid(project) && projects.some((p) => p.id === project) ? project : "";

  return (
    <>
      <PageHeader back={{ href: "/dashboard/requests", label: "Requests" }} title="New request" description={`For ${org.name}`} />
      <Panel className="max-w-2xl">
        <ActionForm action={createRequest} submitLabel="Submit request" pendingLabel="Submitting…">
          <input type="hidden" name="org_id" value={org.id} />
          <div className="space-y-4">
            <Field label="Title" htmlFor="title" hint="One line, e.g. “Add catering orders to the kitchen board”.">
              <input id="title" name="title" required minLength={3} maxLength={200} className="pt-input" autoFocus />
            </Field>
            <Field label="Description" htmlFor="description" hint="What should change, and why? Links and examples help.">
              <textarea id="description" name="description" maxLength={10000} rows={7} className="pt-textarea" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Priority" htmlFor="priority" hint="Urgent = something is broken right now.">
                <select id="priority" name="priority" defaultValue="normal" className="pt-select">
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {requestPriorityLabel[p]}
                    </option>
                  ))}
                </select>
              </Field>
              {projects.length > 0 && (
                <Field label="Related project (optional)" htmlFor="project_id">
                  <select id="project_id" name="project_id" defaultValue={preselect} className="pt-select">
                    <option value="">None</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </Field>
              )}
            </div>
          </div>
        </ActionForm>
      </Panel>
    </>
  );
}
