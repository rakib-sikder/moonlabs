import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isPortalConfigured, getDb } from "@/lib/portal/env";
import { getPortalContext } from "@/lib/portal/access";
import { formatDateTime } from "@/lib/portal/format";
import { ENQUIRY_STATUSES, enquiryTone, type Enquiry } from "@/lib/portal/enquiries";
import { Badge, EmptyState, PageHeader, Panel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { setEnquiryStatus } from "./actions";

export const metadata: Metadata = { title: "Website enquiries" };

export default async function EnquiriesPage() {
  if (!(await isPortalConfigured())) return null;
  const ctx = await getPortalContext();
  if (!ctx.isStaff) redirect("/dashboard");

  const db = await getDb();
  const rows = db
    ? ((await db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 200").all<Enquiry>()).results ?? [])
    : [];
  const fresh = rows.filter((r) => r.status === "new").length;

  return (
    <>
      <PageHeader
        title="Website enquiries"
        description={`Messages sent through the contact form on moonlab.space. ${fresh} new.`}
      />
      <Panel title={`Latest ${rows.length}`} bodyClassName={null}>
        {rows.length === 0 ? (
          <EmptyState title="No enquiries yet">When someone sends the contact form, it shows up here.</EmptyState>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((e) => (
              <li key={e.id} className="grid gap-4 p-5 lg:grid-cols-[1.6fr_1fr]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{e.name}</p>
                    <Badge tone={enquiryTone[e.status]}>{e.status}</Badge>
                    <span className="pt-kbd-muted">{formatDateTime(e.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    <a href={`mailto:${e.email}`} className="text-accent hover:underline">
                      {e.email}
                    </a>
                    {e.company ? <span className="text-muted"> · {e.company}</span> : null}
                  </p>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{e.message}</p>
                </div>
                <div className="space-y-3 text-sm">
                  <dl className="grid grid-cols-[6rem_1fr] gap-x-3 gap-y-1">
                    <dt className="text-muted">Services</dt>
                    <dd>{e.services || "-"}</dd>
                    <dt className="text-muted">Budget</dt>
                    <dd>{e.budget || "-"}</dd>
                    <dt className="text-muted">Timeline</dt>
                    <dd>{e.timeline || "-"}</dd>
                  </dl>
                  <ActionForm action={setEnquiryStatus} submitLabel="Update" pendingLabel="Saving…" variant="default">
                    <input type="hidden" name="id" value={e.id} />
                    <label className="sr-only" htmlFor={`status-${e.id}`}>
                      Status
                    </label>
                    <select id={`status-${e.id}`} name="status" defaultValue={e.status} className="pt-select">
                      {ENQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </ActionForm>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
