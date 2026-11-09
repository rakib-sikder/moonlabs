import type { PortalRequest, RequestComment, RequestStatus } from "@/lib/portal/types";
import {
  formatDate,
  formatDateTime,
  initials,
  personName,
  priorityTone,
  requestPriorityLabel,
  requestStatusLabel,
  requestTone,
} from "@/lib/portal/format";
import { addComment, setRequestStatus } from "../actions";
import { ActionForm } from "./action-form";
import { Badge, Panel } from "./ui";

const STATUSES: RequestStatus[] = ["open", "in_progress", "waiting", "resolved", "closed"];

/** Request body, comment thread and reply form. Admins also get the status control. */
export function RequestThread({
  request,
  comments,
  projectName,
  isAdmin,
}: {
  request: PortalRequest;
  comments: RequestComment[];
  projectName: string | null;
  isAdmin: boolean;
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Panel title="Description">
          {request.description ? (
            <p className="pt-prose">{request.description}</p>
          ) : (
            <p className="text-muted">No description.</p>
          )}
        </Panel>

        <Panel title={`Conversation (${comments.length})`} bodyClassName={null}>
          {comments.length === 0 ? (
            <p className="px-4 py-6 text-center text-muted">No replies yet. We usually answer within one business day.</p>
          ) : (
            <ol className="divide-y divide-border">
              {comments.map((c) => {
                const name = personName(c.author);
                const staff = Boolean(c.author?.is_staff) || !c.author;
                return (
                  <li key={c.id} className="flex gap-3 px-4 py-4">
                    <span
                      aria-hidden
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ring-1 ring-border"
                      style={{ background: staff ? "var(--accent-soft)" : "var(--surface-2)", color: staff ? "var(--accent)" : "var(--foreground)" }}
                    >
                      {initials(name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-baseline gap-x-2">
                        <span className="font-medium">{name}</span>
                        {staff && <span className="text-[12px] text-moon">Moonlab</span>}
                        <time dateTime={c.created_at} className="text-[12px] text-muted tabular-nums">
                          {formatDateTime(c.created_at)}
                        </time>
                      </p>
                      <p className="pt-prose mt-1">{c.body}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <div className="border-t border-border p-4">
            <ActionForm action={addComment} submitLabel="Post reply" pendingLabel="Posting…" resetOnSuccess>
              <input type="hidden" name="request_id" value={request.id} />
              <label htmlFor="comment-body" className="pt-label">
                Reply
              </label>
              <textarea
                id="comment-body"
                name="body"
                required
                maxLength={10000}
                rows={4}
                className="pt-textarea"
                placeholder="Add details, answer a question, or share a link…"
              />
            </ActionForm>
          </div>
        </Panel>
      </div>

      <aside className="space-y-6">
        <Panel title="Details">
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 text-[13px]">
            <dt className="text-muted">Status</dt>
            <dd>
              <Badge tone={requestTone[request.status]}>{requestStatusLabel[request.status]}</Badge>
            </dd>
            <dt className="text-muted">Priority</dt>
            <dd>
              <Badge tone={priorityTone[request.priority]}>{requestPriorityLabel[request.priority]}</Badge>
            </dd>
            <dt className="text-muted">Opened by</dt>
            <dd className="truncate">{personName(request.author)}</dd>
            <dt className="text-muted">Opened</dt>
            <dd>{formatDate(request.created_at)}</dd>
            <dt className="text-muted">Updated</dt>
            <dd>{formatDate(request.updated_at)}</dd>
            {projectName && (
              <>
                <dt className="text-muted">Project</dt>
                <dd className="truncate">{projectName}</dd>
              </>
            )}
          </dl>
        </Panel>

        {isAdmin && (
          <Panel title="Staff: status">
            <ActionForm action={setRequestStatus} submitLabel="Update status" variant="default" inline>
              <input type="hidden" name="request_id" value={request.id} />
              <input type="hidden" name="org_id" value={request.org_id} />
              <div className="min-w-[10rem] flex-1">
                <label htmlFor="request-status" className="pt-label">
                  Status
                </label>
                <select id="request-status" name="status" defaultValue={request.status} className="pt-select">
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {requestStatusLabel[s]}
                    </option>
                  ))}
                </select>
              </div>
            </ActionForm>
          </Panel>
        )}
      </aside>
    </div>
  );
}
