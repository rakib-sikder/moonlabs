import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { requireOrgAdmin } from "@/lib/portal/access";
import { getBrief } from "@/lib/portal/queries";
import { isUuid } from "@/lib/portal/validate";
import { briefStatusLabel, briefTone, formatDate } from "@/lib/portal/format";
import { Badge, Field, PageHeader, Panel } from "../../../../../_components/ui";
import { ActionForm } from "../../../../../_components/action-form";
import { BriefView } from "../../../../../_components/brief-view";
import { declineBrief, startProjectFromBrief } from "../../../actions";

export const metadata: Metadata = { title: "Project brief" };

export default async function AdminBriefPage({ params }: { params: Promise<{ orgId: string; briefId: string }> }) {
  const { orgId, briefId } = await params;
  if (!(await isPortalConfigured())) return null;
  if (!isUuid(orgId) || !isUuid(briefId)) notFound();
  const { ctx, org } = await requireOrgAdmin(orgId);
  const brief = await getBrief(ctx, org.id, briefId);
  if (!brief) notFound();
  const today = new Date().toISOString().slice(0, 10);
  const hidden = (
    <>
      <input type="hidden" name="org_id" value={org.id} />
      <input type="hidden" name="brief_id" value={brief.id} />
    </>
  );

  return (
    <>
      <PageHeader
        back={{ href: `/dashboard/admin/${org.id}?tab=projects`, label: `${org.name} · Projects` }}
        title={brief.title}
        description={
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Badge tone={briefTone[brief.status]}>{briefStatusLabel[brief.status]}</Badge>
            {brief.decided_at && <span>Answered {formatDate(brief.decided_at)}</span>}
          </span>
        }
        actions={
          brief.project_id ? (
            <Link href={`/dashboard/admin/${org.id}/projects/${brief.project_id}`} className="pt-btn">
              Open the project
            </Link>
          ) : undefined
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="The client's brief" className="lg:col-span-2">
          <BriefView brief={brief} />
        </Panel>

        <div className="space-y-6">
          {brief.status === "submitted" ? (
            <>
              <Panel title="Start a project">
                <ActionForm action={startProjectFromBrief} submitLabel="Start project" pendingLabel="Starting…">
                  {hidden}
                  <input type="hidden" name="status" value="active" />
                  <div className="space-y-4">
                    <Field label="Project name" htmlFor="p-name">
                      <input id="p-name" name="name" required maxLength={160} defaultValue={brief.title} className="pt-input" />
                    </Field>
                    <Field label="Summary" htmlFor="p-summary" hint="Shown on the project. The brief itself stays as the client wrote it.">
                      <textarea id="p-summary" name="summary" rows={4} maxLength={4000} defaultValue={brief.goal.slice(0, 600)} className="pt-textarea" />
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Start" htmlFor="p-start">
                        <input id="p-start" name="started_on" type="date" defaultValue={today} className="pt-input" />
                      </Field>
                      <Field label="Target" htmlFor="p-target">
                        <input id="p-target" name="target_on" type="date" defaultValue={brief.deadline ?? ""} className="pt-input" />
                      </Field>
                    </div>
                    <Field label="Note for the client (optional)" htmlFor="p-note" hint="Goes into the email, e.g. what happens next.">
                      <textarea id="p-note" name="staff_note" rows={3} maxLength={4000} className="pt-textarea" />
                    </Field>
                  </div>
                </ActionForm>
              </Panel>
              <Panel title="Decline">
                <ActionForm action={declineBrief} submitLabel="Decline brief" variant="danger" confirm="Decline this brief? The client is emailed your reason.">
                  {hidden}
                  <Field label="Reason for the client" htmlFor="d-note">
                    <textarea id="d-note" name="staff_note" required rows={3} maxLength={4000} className="pt-textarea" />
                  </Field>
                </ActionForm>
              </Panel>
            </>
          ) : (
            brief.staff_note && (
              <Panel title="Note sent to the client">
                <p className="pt-prose whitespace-pre-wrap">{brief.staff_note}</p>
              </Panel>
            )
          )}
        </div>
      </div>
    </>
  );
}
