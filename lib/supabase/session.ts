import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "./server";
import { ORG_COOKIE, isPortalConfigured } from "./config";
import type { MemberRole, Organization, Profile } from "@/lib/portal/types";

export type OrgAccess = Organization & {
  /** "staff" = global agency staff without an explicit membership in this org */
  role: MemberRole | "staff";
};

export type PortalContext = {
  supabase: SupabaseClient;
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

/**
 * Loads the signed-in user, their organizations and the one they are viewing. Cached per
 * request. Redirects to /login when there is no session.
 */
export const getPortalContext = cache(async (): Promise<PortalContext> => {
  const supabase = await createSupabaseServerClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  const claims = claimsData?.claims;
  if (!claims?.sub) redirect("/login");
  const userId = claims.sub;
  const email = typeof claims.email === "string" ? claims.email : null;

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("id, email, full_name, avatar_url, is_staff")
    .eq("id", userId)
    .maybeSingle();
  const profile = (profileRow as Profile | null) ?? null;
  const isStaff = Boolean(profile?.is_staff);

  let memberships = await loadMemberships(supabase, userId);
  if (memberships.length === 0 && !isStaff) {
    // Invited after the account already existed: pick up pending invites now.
    const { data: joined } = await supabase.rpc("claim_invites");
    if (typeof joined === "number" && joined > 0) memberships = await loadMemberships(supabase, userId);
  }

  const roleByOrg = new Map(memberships.map((m) => [m.org_id, m.role]));
  let orgs: OrgAccess[];
  if (isStaff) {
    const { data } = await supabase.from("organizations").select("*").order("name");
    orgs = ((data ?? []) as Organization[]).map((o) => ({ ...o, role: roleByOrg.get(o.id) ?? "staff" }));
  } else {
    orgs = memberships
      .filter((m) => m.organization)
      .map((m) => ({ ...(m.organization as Organization), role: m.role }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const cookieStore = await cookies();
  const wanted = cookieStore.get(ORG_COOKIE)?.value;
  const currentOrg = orgs.find((o) => o.id === wanted) ?? orgs[0] ?? null;
  const isAdmin = Boolean(currentOrg && (isStaff || currentOrg.role === "admin"));
  const canAdmin = isStaff || orgs.some((o) => o.role === "admin");

  return { supabase, userId, email, profile, isStaff, orgs, currentOrg, isAdmin, canAdmin };
});

type MembershipRow = { org_id: string; role: MemberRole; organization: Organization | null };

async function loadMemberships(supabase: SupabaseClient, userId: string): Promise<MembershipRow[]> {
  const { data } = await supabase
    .from("memberships")
    .select("org_id, role, organization:organizations(*)")
    .eq("user_id", userId);
  return (data ?? []) as unknown as MembershipRow[];
}

/**
 * For client pages: null when the portal is not configured (the layout already shows that
 * state), otherwise the context plus the org being viewed (null = user has no workspace).
 */
export async function getOrgPage(): Promise<{ ctx: PortalContext; org: OrgAccess | null } | null> {
  if (!isPortalConfigured()) return null;
  const ctx = await getPortalContext();
  return { ctx, org: ctx.currentOrg };
}

/** Admin pages: the org must exist and the user must be staff or an admin member of it. */
export async function requireOrgAdmin(orgId: string): Promise<{ ctx: PortalContext; org: OrgAccess }> {
  const ctx = await getPortalContext();
  const org = ctx.orgs.find((o) => o.id === orgId);
  if (!org || !(ctx.isStaff || org.role === "admin")) redirect("/dashboard/admin");
  return { ctx, org };
}

/** Display name for the signed-in user. */
export function displayName(ctx: PortalContext): string {
  return ctx.profile?.full_name?.trim() || ctx.email || "Signed in";
}
