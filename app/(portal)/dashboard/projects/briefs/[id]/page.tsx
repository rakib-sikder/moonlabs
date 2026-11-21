import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrgPage } from "@/lib/portal/access";
import { getBrief } from "@/lib/portal/queries";
import { isUuid } from "@/lib/portal/validate";
import { briefStatusLabel, briefTone } from "@/lib/portal/format";
import { Badge, NoWorkspace, PageHeader, Panel } from "../../../../_components/ui";
import { ActionForm } from "../../../../_components/action-form";
import { BriefView } from "../../../../_components/brief-view";
import { withdrawBrief } from "../../actions";

export const metadata: Metadata = { title: "Project brief" };

export default async function BriefPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;
  if (!isUuid(id)) notFound();
  const brief = await getBrief(ctx, org.id, id);
  if (!brief) notFound();

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/projects", label: "Projects" }}
        title={brief.title}
        description={<Badge tone={briefTone[brief.status]}>{briefStatusLabel[brief.status]}</Badge>}
        actions={
          brief.status === "accepted" && brief.project_id ? (
            <Link href={`/dashboard/projects/${brief.project_id}`} className="pt-btn" data-variant="primary">
              Open the project
            </Link>
          ) : undefined
        }
      />

      {brief.status === "submitted" && (
        <p className="mb-6 max-w-3xl text-[13.5px] text-muted">
          We are reading your brief and will reply within one business day. Want to add something?{" "}
          <Link href="/dashboard/requests/new" className="pt-link">
            Send us a request
          </Link>
          .
        </p>
      )}
      {brief.staff_note && brief.status !== "submitted" && (
        <Panel title="Note from Moonlab" className="mb-6 max-w-3xl">
          <p className="pt-prose whitespace-pre-wrap">{brief.staff_note}</p>
        </Panel>
      )}

      <Panel title="Your brief" className="max-w-3xl">
        <BriefView brief={brief} />
      </Panel>

      {brief.status === "submitted" && (
        <div className="mt-6 max-w-3xl">
          <ActionForm
            action={withdrawBrief}
            submitLabel="Withdraw this brief"
            variant="ghost"
            size="sm"
            hasVisibleFields={false}
            confirm="Withdraw this brief? We will stop reviewing it."
          >
            <input type="hidden" name="org_id" value={org.id} />
            <input type="hidden" name="brief_id" value={brief.id} />
          </ActionForm>
        </div>
      )}
    </>
  );
}
