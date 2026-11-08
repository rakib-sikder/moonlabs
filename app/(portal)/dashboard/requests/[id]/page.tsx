import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrgPage } from "@/lib/portal/access";
import { getRequest } from "@/lib/portal/queries";
import { isUuid } from "@/lib/portal/validate";
import { NoWorkspace, PageHeader } from "../../../_components/ui";
import { RequestThread } from "../../../_components/request-thread";

export const metadata: Metadata = { title: "Request" };

export default async function RequestPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;
  if (!isUuid(id)) notFound();

  const data = await getRequest(ctx, org.id, id);
  if (!data) notFound();

  return (
    <>
      <PageHeader back={{ href: "/dashboard/requests", label: "Requests" }} title={data.request.title} />
      <RequestThread {...data} isAdmin={ctx.isAdmin} />
    </>
  );
}
