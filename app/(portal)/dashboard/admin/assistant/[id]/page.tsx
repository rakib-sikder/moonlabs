import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { getPortalContext } from "@/lib/portal/access";
import { isUuid } from "@/lib/portal/validate";
import { formatDateTime, formatNumber } from "@/lib/portal/format";
import { getTranscript } from "@/lib/ai/usage";
import type { BriefDraft } from "@/lib/ai/assistant";
import { Badge, PageHeader, Panel } from "../../../../_components/ui";

export const metadata: Metadata = { title: "Assistant conversation" };

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isPortalConfigured())) return null;
  const ctx = await getPortalContext();
  if (!ctx.isStaff) redirect("/dashboard");
  const { id } = await params;
  if (!isUuid(id)) notFound();
  const data = await getTranscript(ctx.db, id);
  if (!data) notFound();
  const { conv, items } = data;
  const draft = data.draft ? (JSON.parse(data.draft) as BriefDraft) : null;

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/admin/assistant", label: "AI assistant" }}
        title={conv.user_name ?? conv.user_email}
        description={`${conv.org_name ?? "No workspace"} · started ${formatDateTime(conv.created_at)} · ${conv.turns} messages · ${formatNumber(conv.input_tokens + conv.output_tokens)} tokens`}
        actions={
          <>
            {conv.org_id && (
              <Link href={`/dashboard/admin/${conv.org_id}`} className="pt-btn">
                Open organization
              </Link>
            )}
            {conv.brief_id && conv.org_id && (
              <Link href={`/dashboard/admin/${conv.org_id}/briefs/${conv.brief_id}`} className="pt-btn" data-variant="primary">
                Open the brief
              </Link>
            )}
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Transcript" className="lg:col-span-2">
          <ol className="space-y-3 text-[13.5px]">
            {items.map((it, i) => (
              <li key={i}>
                {it.kind === "tool" ? (
                  <p className="rounded-md border border-dashed border-border px-3 py-1.5 font-mono text-[11.5px] text-muted">
                    <b>{it.name}</b> {it.summary}
                  </p>
                ) : (
                  <div className={`max-w-[85%] rounded-lg px-3 py-2 ${it.kind === "user" ? "ml-auto bg-accent-soft" : "bg-surface-2"}`}>
                    <p className="mb-0.5 text-[11px] text-muted">
                      {it.kind === "user" ? "Client" : "Assistant"} · {formatDateTime(it.at)}
                    </p>
                    <p className="whitespace-pre-wrap break-words">{it.text}</p>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Brief">
          {draft ? (
            <div className="space-y-2 text-[13px]">
              <Badge tone={conv.brief_id ? "ok" : "warn"}>{conv.brief_id ? "Sent by the client" : "Drafted, not sent"}</Badge>
              <p className="font-semibold">{draft.title}</p>
              <p className="whitespace-pre-wrap">{draft.goal}</p>
              {draft.features && <p className="whitespace-pre-wrap text-muted">{draft.features}</p>}
              <p>
                <span className="text-muted">Estimate shown: </span>
                {draft.estimate_summary || "-"}
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-muted">No brief drafted in this conversation.</p>
          )}
        </Panel>
      </div>
    </>
  );
}
