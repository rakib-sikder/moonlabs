import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isPortalConfigured, getDb } from "@/lib/portal/env";
import { getPortalContext } from "@/lib/portal/access";
import { formatDateTime } from "@/lib/portal/format";
import { REVIEW_STATUSES, type Review, type ReviewStatus } from "@/lib/reviews";
import { Badge, EmptyState, PageHeader, Panel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { setReviewStatus } from "./actions";

export const metadata: Metadata = { title: "Client reviews" };

const tone: Record<ReviewStatus, "ok" | "warn" | "bad"> = { pending: "warn", approved: "ok", rejected: "bad" };

export default async function ReviewsAdminPage() {
  if (!(await isPortalConfigured())) return null;
  const ctx = await getPortalContext();
  if (!ctx.isStaff) redirect("/dashboard");

  const db = await getDb();
  const rows = db
    ? ((await db.prepare("SELECT * FROM reviews ORDER BY status = 'pending' DESC, created_at DESC LIMIT 200").all<Review>()).results ?? [])
    : [];
  const waiting = rows.filter((r) => r.status === "pending").length;

  return (
    <>
      <PageHeader
        title="Client reviews"
        description={`Sent through moonlab.space/review. Only approved reviews appear on the site. ${waiting} waiting.`}
      />
      <Panel title={`Latest ${rows.length}`} bodyClassName={null}>
        {rows.length === 0 ? (
          <EmptyState title="No reviews yet">
            Send clients the link moonlab.space/review after a project. Their reviews land here for you to approve.
          </EmptyState>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="grid gap-4 p-5 lg:grid-cols-[1.6fr_1fr]">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium">{r.name}</p>
                    <Badge tone={tone[r.status]}>{r.status}</Badge>
                    <span className="font-mono text-sm">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <span className="pt-kbd-muted">{formatDateTime(r.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    <a href={`mailto:${r.email}`} className="text-accent hover:underline">
                      {r.email}
                    </a>
                    {r.role || r.company ? <span className="text-muted"> · {[r.role, r.company].filter(Boolean).join(", ")}</span> : null}
                    {r.website ? (
                      <a href={r.website} target="_blank" rel="noopener noreferrer" className="ml-2 text-muted hover:underline">
                        {r.website}
                      </a>
                    ) : null}
                  </p>
                  {r.project && <p className="mt-2 text-sm text-muted">Project: {r.project}</p>}
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">{r.quote}</p>
                </div>
                <div className="text-sm">
                  <ActionForm action={setReviewStatus} submitLabel="Update" pendingLabel="Saving…" variant="default">
                    <input type="hidden" name="id" value={r.id} />
                    <label className="sr-only" htmlFor={`status-${r.id}`}>
                      Status
                    </label>
                    <select id={`status-${r.id}`} name="status" defaultValue={r.status} className="pt-select">
                      {REVIEW_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </ActionForm>
                  <p className="mt-2 text-xs text-muted">Check the person really worked with you before approving.</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
