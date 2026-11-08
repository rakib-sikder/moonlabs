"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPortalContext } from "@/lib/supabase/session";
import { ORG_COOKIE, isPortalConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { dbFailure, guarded } from "@/lib/portal/action-utils";
import { oneOf, optionalText, optionalUuid, text, uuid } from "@/lib/portal/validate";
import type { ActionState, RequestPriority, RequestStatus } from "@/lib/portal/types";

const PRIORITIES: RequestPriority[] = ["low", "normal", "high", "urgent"];
const STATUSES: RequestStatus[] = ["open", "in_progress", "waiting", "resolved", "closed"];

export async function signOut(): Promise<void> {
  if (isPortalConfigured()) {
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  const cookieStore = await cookies();
  cookieStore.delete(ORG_COOKIE);
  redirect("/login");
}

export async function switchOrg(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const ctx = await getPortalContext();
    if (!ctx.orgs.some((o) => o.id === orgId)) return { ok: false, message: "You do not have access to that organization." };
    const cookieStore = await cookies();
    cookieStore.set(ORG_COOKIE, orgId, { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 60 * 60 * 24 * 365 });
    redirect("/dashboard");
  });
}

export async function createRequest(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const title = text(formData, "title", { label: "Title", max: 200, min: 3 });
    const description = optionalText(formData, "description", { label: "Description", max: 10000 });
    const priority = oneOf(formData, "priority", PRIORITIES, "Priority");
    const projectId = optionalUuid(formData, "project_id", "Project");

    const ctx = await getPortalContext();
    if (!ctx.orgs.some((o) => o.id === orgId)) return { ok: false, message: "You do not have access to that organization." };

    const { data, error } = await ctx.supabase
      .from("requests")
      .insert({ org_id: orgId, created_by: ctx.userId, title, description, priority, project_id: projectId })
      .select("id")
      .single();
    if (error || !data) return dbFailure(error, "Could not create the request.");
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/requests/${data.id}`);
  });
}

export async function addComment(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const requestId = uuid(formData, "request_id", "Request");
    const body = text(formData, "body", { label: "Comment", max: 10000 });
    const ctx = await getPortalContext();

    const { error } = await ctx.supabase
      .from("request_comments")
      .insert({ request_id: requestId, author_id: ctx.userId, body });
    if (error) return dbFailure(error, "Could not post the comment.");
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Comment posted." };
  });
}

/** Admins only (RLS enforces it too). Lives here because the request thread is shared. */
export async function setRequestStatus(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const requestId = uuid(formData, "request_id", "Request");
    const orgId = uuid(formData, "org_id", "Organization");
    const status = oneOf(formData, "status", STATUSES, "Status");
    const ctx = await getPortalContext();
    const org = ctx.orgs.find((o) => o.id === orgId);
    if (!org || !(ctx.isStaff || org.role === "admin")) return { ok: false, message: "Only Moonlabs staff can change the status." };

    const { error } = await ctx.supabase.from("requests").update({ status }).eq("id", requestId).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not update the status.");
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Status updated." };
  });
}
