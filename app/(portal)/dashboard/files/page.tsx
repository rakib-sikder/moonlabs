import type { Metadata } from "next";
import { getOrgPage } from "@/lib/supabase/session";
import { listFiles } from "@/lib/supabase/queries";
import { formatBytes, formatDate } from "@/lib/portal/format";
import { EmptyState, NoWorkspace, PageHeader, Panel } from "../../_components/ui";
import { IconDownload } from "../../_components/icons";

export const metadata: Metadata = { title: "Files" };

export default async function FilesPage() {
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  const files = await listFiles(ctx.supabase, org.id);

  return (
    <>
      <PageHeader title="Files" description="Deliverables, documentation and handover material. Download links are private and expire after a few minutes." />
      <Panel bodyClassName={null}>
        {files.length === 0 ? (
          <EmptyState title="No files yet">Docs, diagrams and handover material will be shared here.</EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Project</th>
                  <th scope="col">Uploaded</th>
                  <th scope="col" className="pt-num">
                    Size
                  </th>
                  <th scope="col">
                    <span className="sr-only">Download</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.id}>
                    <td className="max-w-[360px] font-medium">
                      <span className="line-clamp-1 break-all">{f.name}</span>
                    </td>
                    <td className="text-muted">{f.project?.name ?? "—"}</td>
                    <td className="pt-kbd-muted whitespace-nowrap">{formatDate(f.created_at)}</td>
                    <td className="pt-num pt-kbd-muted">{formatBytes(f.size_bytes)}</td>
                    <td className="text-right">
                      {/* A route handler signs a fresh short-lived URL on click. */}
                      <a href={`/dashboard/files/${f.id}/download`} className="pt-btn" data-size="sm" aria-label={`Download ${f.name}`}>
                        <IconDownload className="h-3.5 w-3.5" />
                        Download
                      </a>
                    </td>
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
