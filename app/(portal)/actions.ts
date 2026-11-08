"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ORG_COOKIE } from "@/lib/portal/env";
import { endSession } from "@/lib/portal/auth";
import { assertAdmin, assertMember, getPortalContext } from "@/lib/portal/access";
import { guarded } from "@/lib/portal/action-utils";
import { oneOf, optionalText, optionalUuid, text, uuid } from "@/lib/portal/validate";
import type { ActionState, RequestPriority, RequestStatus } from "@/lib/portal/types";

const PRIORITIES: RequestPriority[] = ["low", "normal", "high", "urgent"];
const STATUSES: RequestStatus[] = ["open", "in_progress", "waiting", "resolved", "closed"];

export async function signOut(): Promise<void> {
  await endSession();
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

/** Any member may open a request, always as themselves and always with status 'open'. */
export async function createRequest(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const title = text(formData, "title", { label: "Title", max: 200, min: 3 });
    const description = optionalText(formData, "description", { label: "Description", max: 10000 });
    const priority = oneOf(formData, "priority", PRIORITIES, "Priority");
    const projectId = optionalUuid(formData, "project_id", "Project");

    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    if (projectId) {
      const project = await ctx.db.prepare("SELECT 1 AS ok FROM projects WHERE id = ? AND org_id = ?").bind(projectId, orgId).first();
      if (!project) return { ok: false, message: "That project was not found." };
    }

    const id = crypto.randomUUID();
    await ctx.db
      .prepare(
        "INSERT INTO requests (id, org_id, project_id, created_by, title, description, priority, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'open')",
      )
      .bind(id, orgId, projectId, ctx.userId, title, description, priority)
      .run();
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/requests/${id}`);
  });
}

/** Any member of the request's organization may comment, always as themselves. */
export async function addComment(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const requestId = uuid(formData, "request_id", "Request");
    const body = text(formData, "body", { label: "Comment", max: 10000 });
    const ctx = await getPortalContext();

    const request = await ctx.db.prepare("SELECT org_id FROM requests WHERE id = ?").bind(requestId).first<{ org_id: string }>();
    if (!request) return { ok: false, message: "That request was not found." };
    assertMember(ctx, request.org_id);

    await ctx.db
      .prepare("INSERT INTO request_comments (id, request_id, org_id, author_id, body) VALUES (?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), requestId, request.org_id, ctx.userId, body)
      .run();
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Comment posted." };
  });
}

/** Org admins and staff only. Lives here because the request thread is shared. */
export async function setRequestStatus(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const requestId = uuid(formData, "request_id", "Request");
    const orgId = uuid(formData, "org_id", "Organization");
    const status = oneOf(formData, "status", STATUSES, "Status");
    const ctx = await getPortalContext();
    assertAdmin(ctx, orgId);

    const res = await ctx.db.prepare("UPDATE requests SET status = ? WHERE id = ? AND org_id = ?").bind(status, requestId, orgId).run();
    if (!res.meta.changes) return { ok: false, message: "That request was not found." };
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Status updated." };
  });
}
