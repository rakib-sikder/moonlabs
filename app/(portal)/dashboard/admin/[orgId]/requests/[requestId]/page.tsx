import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPortalConfigured } from "@/lib/supabase/config";
import { requireOrgAdmin } from "@/lib/supabase/session";
import { getRequest } from "@/lib/supabase/queries";
import { isUuid } from "@/lib/portal/validate";
import { PageHeader } from "../../../../../_components/ui";
import { RequestThread } from "../../../../../_components/request-thread";

export const metadata: Metadata = { title: "Request" };

export default async function AdminRequestPage({ params }: { params: Promise<{ orgId: string; requestId: string }> }) {
  const { orgId, requestId } = await params;
  if (!isPortalConfigured()) return null;
  if (!isUuid(orgId) || !isUuid(requestId)) notFound();
  const { ctx, org } = await requireOrgAdmin(orgId);
  const data = await getRequest(ctx.supabase, org.id, requestId);
  if (!data) notFound();

  return (
    <>
      <PageHeader back={{ href: `/dashboard/admin/${org.id}?tab=requests`, label: `${org.name} · Requests` }} title={data.request.title} />
      <RequestThread {...data} isAdmin />
    </>
  );
}
