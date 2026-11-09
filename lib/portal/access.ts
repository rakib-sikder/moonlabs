// Authorization for the client portal. There is no row-level security in D1, so every page,
// action and route goes through these helpers. The rules mirror the old Supabase policies:
//
//   * Staff (users.is_staff = 1) can read and manage every organization.
//   * Members of an organization can read its rows (clients never see draft invoices).
//   * Org admins (membership role 'admin') and staff manage everything in that org.
//   * Clients may create requests and comments only as themselves, always with status 'open'.
//   * Only staff can create organizations and grant is_staff.
//
// Ids that arrive from the browser are never trusted on their own: every query that takes an
// org id first checks it with assertMember / assertAdmin, and child rows are always matched
// on both their own id and org_id.

import { cache } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { ORG_COOKIE, getDb } from "./env";
import { getSessionUser } from "./auth";
import type { MemberRole, Organization, Profile } from "./types";

export type OrgAccess = Organization & {
  /** "staff" = global agency staff without an explicit membership in this org */
  role: MemberRole | "staff";
};

export type PortalContext = {
  db: D1Database;
  userId: string;
  email: string | null;
  profile: Profile | null;
  isStaff: boolean;
  orgs: OrgAccess[];
  currentOrg: OrgAccess | null;
  /** Can administer the current org (staff, or membership role admin). */
  isAdmin: boolean;
  /** Can open the admin area at all. */
  canAdmin: boolean;
};

/** Thrown by assert helpers; actions turn it into a friendly message. */
export class AccessError extends Error {}

type OrgRow = Organization & { role: MemberRole | null };

/**
 * Loads the signed-in user, their organizations and the one they are viewing. Cached per
 * request. Redirects to /login when there is no valid session. Callers check
 * isPortalConfigured() first (the layout shows the "not configured" screen).
 */
export const getPortalContext = cache(async (): Promise<PortalContext> => {
  const db = await getDb();
  if (!db) redirect("/login");
  const user = await getSessionUser();
  if (!user) redirect("/login");

  const rows = user.isStaff
    ? await db
        .prepare(
          `SELECT o.id, o.name, o.plan, o.plan_started_on, o.created_at, m.role
             FROM organizations o
             LEFT JOIN memberships m ON m.org_id = o.id AND m.user_id = ?
            ORDER BY o.name COLLATE NOCASE`,
        )
        .bind(user.id)
        .all<OrgRow>()
    : await db
        .prepare(
          `SELECT o.id, o.name, o.plan, o.plan_started_on, o.created_at, m.role
             FROM memberships m JOIN organizations o ON o.id = m.org_id
            WHERE m.user_id = ?
            ORDER BY o.name COLLATE NOCASE`,
        )
        .bind(user.id)
        .all<OrgRow>();

  const orgs: OrgAccess[] = rows.results.map((o) => ({
    id: o.id,
    name: o.name,
    plan: o.plan,
    plan_started_on: o.plan_started_on,
    created_at: o.created_at,
    role: o.role ?? "staff",
  }));

  const cookieStore = await cookies();
  const wanted = cookieStore.get(ORG_COOKIE)?.value;
  const currentOrg = orgs.find((o) => o.id === wanted) ?? orgs[0] ?? null;
  const isAdmin = Boolean(currentOrg && (user.isStaff || currentOrg.role === "admin"));
  const canAdmin = user.isStaff || orgs.some((o) => o.role === "admin");

  return {
    db,
    userId: user.id,
    email: user.email,
    profile: { id: user.id, email: user.email, full_name: user.name, is_staff: user.isStaff },
    isStaff: user.isStaff,
    orgs,
    currentOrg,
    isAdmin,
    canAdmin,
  };
});

/** True when the user can read this org's rows. */
export function canRead(ctx: PortalContext, orgId: string): boolean {
  return ctx.isStaff || ctx.orgs.some((o) => o.id === orgId);
}

/** True when the user can change this org's rows. */
export function canManage(ctx: PortalContext, orgId: string): boolean {
  if (ctx.isStaff) return true;
  return ctx.orgs.some((o) => o.id === orgId && o.role === "admin");
}

export function assertMember(ctx: PortalContext, orgId: string): void {
  if (!canRead(ctx, orgId)) throw new AccessError("You do not have access to that organization.");
}

export function assertAdmin(ctx: PortalContext, orgId: string): void {
  if (!canManage(ctx, orgId)) throw new AccessError("You are not an admin of this organization.");
}

export function assertStaff(ctx: PortalContext): void {
  if (!ctx.isStaff) throw new AccessError("Only Moonlab staff can do that.");
}

/**
 * For client pages: null when the portal is not configured (the layout already shows that
 * state), otherwise the context plus the org being viewed (null = user has no workspace).
 */
export async function getOrgPage(): Promise<{ ctx: PortalContext; org: OrgAccess | null } | null> {
  if (!(await getDb())) return null;
  const ctx = await getPortalContext();
  return { ctx, org: ctx.currentOrg };
}

/** Admin pages: the org must exist and the user must be staff or an admin member of it. */
export async function requireOrgAdmin(orgId: string): Promise<{ ctx: PortalContext; org: OrgAccess }> {
  const ctx = await getPortalContext();
  const org = ctx.orgs.find((o) => o.id === orgId);
  if (!org) notFound();
  if (!canManage(ctx, org.id)) redirect("/dashboard/admin");
  return { ctx, org };
}

/** Display name for the signed-in user. */
export function displayName(ctx: PortalContext): string {
  return ctx.profile?.full_name?.trim() || ctx.email || "Signed in";
}
