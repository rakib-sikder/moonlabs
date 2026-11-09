import type { Metadata } from "next";
import Link from "next/link";
import { getOrgPage } from "@/lib/portal/access";
import { listRequests } from "@/lib/portal/queries";
import {
  OPEN_REQUEST_STATUSES,
  formatShortDate,
  personName,
  priorityTone,
  requestPriorityLabel,
  requestStatusLabel,
  requestTone,
} from "@/lib/portal/format";
import { Badge, EmptyState, NoWorkspace, PageHeader, Panel } from "../../_components/ui";

export const metadata: Metadata = { title: "Requests" };

export default async function RequestsPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  const { show } = await searchParams;
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const all = await listRequests(ctx, org.id);
  const showAll = show === "all";
  const openCount = all.filter((r) => OPEN_REQUEST_STATUSES.includes(r.status)).length;
  const rows = showAll ? all : all.filter((r) => OPEN_REQUEST_STATUSES.includes(r.status));

  return (
    <>
      <PageHeader
        title="Requests"
        description="Changes, fixes and questions for the Moonlab team."
        actions={
          <Link href="/dashboard/requests/new" className="pt-btn" data-variant="primary">
            New request
          </Link>
        }
      />
      <Panel
        bodyClassName={null}
        title={
          <span className="flex gap-1" role="group" aria-label="Filter requests">
            <Link href="/dashboard/requests" className="pt-btn" data-size="sm" data-variant={showAll ? "ghost" : undefined} aria-current={showAll ? undefined : "page"}>
              Open ({openCount})
            </Link>
            <Link href="/dashboard/requests?show=all" className="pt-btn" data-size="sm" data-variant={showAll ? undefined : "ghost"} aria-current={showAll ? "page" : undefined}>
              All ({all.length})
            </Link>
          </span>
        }
      >
        {rows.length === 0 ? (
          <EmptyState
            title={showAll ? "No requests yet" : "No open requests"}
            action={
              <Link href="/dashboard/requests/new" className="pt-btn">
                Open a request
              </Link>
            }
          >
            Need a change, a fix, or a new automation? Open a request and we will reply here.
          </EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Status</th>
                  <th scope="col">Priority</th>
                  <th scope="col">Opened by</th>
                  <th scope="col">Updated</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id}>
                    <td className="max-w-[380px]">
                      <Link href={`/dashboard/requests/${r.id}`} className="pt-row-link line-clamp-1">
                        {r.title}
                      </Link>
                    </td>
                    <td>
                      <Badge tone={requestTone[r.status]}>{requestStatusLabel[r.status]}</Badge>
                    </td>
                    <td>
                      <Badge tone={priorityTone[r.priority]}>{requestPriorityLabel[r.priority]}</Badge>
                    </td>
                    <td className="max-w-[200px] truncate text-muted">{personName(r.author)}</td>
                    <td className="pt-kbd-muted whitespace-nowrap">{formatShortDate(r.updated_at)}</td>
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
