// Typed read queries for the client portal. Every query runs through the user's own
// Supabase client, so row-level security limits results to organizations they belong to;
// the explicit org filters keep results scoped to the org they are currently viewing.

import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ActivityItem,
  Automation,
  AutomationRun,
  AutomationWithStats,
  Invite,
  Invoice,
  MemberWithProfile,
  PortalFile,
  PortalRequest,
  Project,
  ProjectMilestone,
  ProjectStage,
  ProjectUpdate,
  ProjectWithStages,
  RequestComment,
} from "@/lib/portal/types";
import { OPEN_REQUEST_STATUSES, STAGES, personName, runStatusLabel } from "@/lib/portal/format";

type DB = SupabaseClient;

const PERSON = "id, email, full_name, is_staff";
const DAY = 24 * 60 * 60 * 1000;

/** Request timestamp used for "last 7 days" windows and relative times. */
export function requestNow(): number {
  return Date.now();
}

function fail(error: { message: string } | null, what: string): void {
  if (error) throw new Error(`Could not load ${what}: ${error.message}`);
}

function sortStages(stages: ProjectStage[]): ProjectStage[] {
  return [...stages].sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage));
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export async function listProjects(db: DB, orgId: string): Promise<ProjectWithStages[]> {
  const { data, error } = await db
    .from("projects")
    .select("*, stages:project_stages(*)")
    .eq("org_id", orgId)
    .order("status")
    .order("created_at", { ascending: false });
  fail(error, "projects");
  return ((data ?? []) as ProjectWithStages[]).map((p) => ({ ...p, stages: sortStages(p.stages ?? []) }));
}

export async function getProject(
  db: DB,
  orgId: string,
  projectId: string,
): Promise<{
  project: Project;
  stages: ProjectStage[];
  milestones: ProjectMilestone[];
  updates: ProjectUpdate[];
} | null> {
  const { data: project, error } = await db
    .from("projects")
    .select("*")
    .eq("org_id", orgId)
    .eq("id", projectId)
    .maybeSingle();
  fail(error, "project");
  if (!project) return null;

  const [stages, milestones, updates] = await Promise.all([
    db.from("project_stages").select("*").eq("project_id", projectId),
    db.from("project_milestones").select("*").eq("project_id", projectId).order("position").order("created_at"),
    db
      .from("project_updates")
      .select(`id, project_id, org_id, title, body, created_at, author:profiles(${PERSON})`)
      .eq("project_id", projectId)
      .order("created_at", { ascending: false }),
  ]);
  fail(stages.error, "project stages");
  fail(milestones.error, "milestones");
  fail(updates.error, "project updates");

  return {
    project: project as Project,
    stages: sortStages((stages.data ?? []) as ProjectStage[]),
    milestones: (milestones.data ?? []) as ProjectMilestone[],
    updates: (updates.data ?? []) as unknown as ProjectUpdate[],
  };
}

// ---------------------------------------------------------------------------
// Automations
// ---------------------------------------------------------------------------
type RunLite = Pick<AutomationRun, "automation_id" | "status" | "started_at" | "minutes_saved">;

async function runsSince(db: DB, orgId: string, sinceIso: string): Promise<RunLite[]> {
  const { data, error } = await db
    .from("automation_runs")
    .select("automation_id, status, started_at, minutes_saved")
    .eq("org_id", orgId)
    .gte("started_at", sinceIso)
    .order("started_at", { ascending: false })
    .limit(10000);
  fail(error, "automation runs");
  return (data ?? []) as RunLite[];
}

function withStats(automations: Automation[], runs: RunLite[]): AutomationWithStats[] {
  return automations.map((a) => {
    const mine = runs.filter((r) => r.automation_id === a.id);
    const finished = mine.filter((r) => r.status !== "running");
    const success = finished.filter((r) => r.status === "success").length;
    return {
      ...a,
      runs7d: mine.length,
      success7d: success,
      successRate7d: finished.length ? success / finished.length : null,
    };
  });
}

export async function listAutomations(db: DB, orgId: string, now: number): Promise<AutomationWithStats[]> {
  const [{ data, error }, runs] = await Promise.all([
    db.from("automations").select("*").eq("org_id", orgId).order("name"),
    runsSince(db, orgId, new Date(now - 7 * DAY).toISOString()),
  ]);
  fail(error, "automations");
  return withStats((data ?? []) as Automation[], runs);
}

export async function getAutomation(
  db: DB,
  orgId: string,
  automationId: string,
  now: number,
): Promise<{ automation: AutomationWithStats; runs: AutomationRun[]; projectName: string | null } | null> {
  const { data, error } = await db
    .from("automations")
    .select("*, project:projects(name)")
    .eq("org_id", orgId)
    .eq("id", automationId)
    .maybeSingle();
  fail(error, "automation");
  if (!data) return null;

  const [{ data: runs, error: runsError }, recent] = await Promise.all([
    db
      .from("automation_runs")
      .select("*")
      .eq("automation_id", automationId)
      .order("started_at", { ascending: false })
      .limit(100),
    runsSince(db, orgId, new Date(now - 7 * DAY).toISOString()),
  ]);
  fail(runsError, "run log");
  const { project, ...automation } = data as Automation & { project: { name: string } | null };
  return {
    automation: withStats([automation], recent)[0],
    runs: (runs ?? []) as AutomationRun[],
    projectName: project?.name ?? null,
  };
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------
const REQUEST_COLS = `id, org_id, project_id, title, description, priority, status, created_at, updated_at, author:profiles(${PERSON})`;

export async function listRequests(db: DB, orgId: string): Promise<PortalRequest[]> {
  const { data, error } = await db
    .from("requests")
    .select(REQUEST_COLS)
    .eq("org_id", orgId)
    .order("updated_at", { ascending: false })
    .limit(500);
  fail(error, "requests");
  return (data ?? []) as unknown as PortalRequest[];
}

export async function getRequest(
  db: DB,
  orgId: string,
  requestId: string,
): Promise<{ request: PortalRequest; comments: RequestComment[]; projectName: string | null } | null> {
  const { data, error } = await db
    .from("requests")
    .select(`${REQUEST_COLS}, project:projects(name)`)
    .eq("org_id", orgId)
    .eq("id", requestId)
    .maybeSingle();
  fail(error, "request");
  if (!data) return null;

  const { data: comments, error: cErr } = await db
    .from("request_comments")
    .select(`id, request_id, body, created_at, author:profiles(${PERSON})`)
    .eq("request_id", requestId)
    .order("created_at");
  fail(cErr, "comments");
  const { project, ...request } = data as unknown as PortalRequest & { project: { name: string } | null };
  return { request, comments: (comments ?? []) as unknown as RequestComment[], projectName: project?.name ?? null };
}

// ---------------------------------------------------------------------------
// Files and invoices
// ---------------------------------------------------------------------------
export async function listFiles(db: DB, orgId: string): Promise<PortalFile[]> {
  const { data, error } = await db
    .from("files")
    .select("*, project:projects(id, name)")
    .eq("org_id", orgId)
    .order("created_at", { ascending: false });
  fail(error, "files");
  return (data ?? []) as unknown as PortalFile[];
}

export async function listInvoices(db: DB, orgId: string): Promise<Invoice[]> {
  const { data, error } = await db
    .from("invoices")
    .select("*")
    .eq("org_id", orgId)
    .order("issued_on", { ascending: false });
  fail(error, "invoices");
  return (data ?? []) as Invoice[];
}

// ---------------------------------------------------------------------------
// Overview
// ---------------------------------------------------------------------------
export type Overview = {
  activeAutomations: number;
  totalAutomations: number;
  attention: number;
  runs7d: number;
  successRate7d: number | null;
  hoursSavedMonth: number;
  openRequests: number;
  waitingOnClient: number;
  projects: ProjectWithStages[];
  activity: ActivityItem[];
};

export async function getOverview(db: DB, orgId: string, now: number): Promise<Overview> {
  const nowDate = new Date(now);
  const monthStart = new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), 1)).toISOString();
  const weekAgo = new Date(now - 7 * DAY).toISOString();
  const windowStart = monthStart < weekAgo ? monthStart : weekAgo;

  const [automations, runs, requests, projects, updates, comments, failedRuns, files, invoices] = await Promise.all([
    db.from("automations").select("id, name, status").eq("org_id", orgId),
    runsSince(db, orgId, windowStart),
    db.from("requests").select("id, title, status, created_at").eq("org_id", orgId).order("created_at", { ascending: false }).limit(200),
    listProjects(db, orgId),
    db
      .from("project_updates")
      .select("id, project_id, title, created_at, project:projects(name)")
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("request_comments")
      .select(`id, request_id, created_at, author:profiles(${PERSON}), request:requests(title)`)
      .eq("org_id", orgId)
      .order("created_at", { ascending: false })
      .limit(8),
    db
      .from("automation_runs")
      .select("id, automation_id, started_at, message, automation:automations(name)")
      .eq("org_id", orgId)
      .eq("status", "failed")
      .order("started_at", { ascending: false })
      .limit(5),
    db.from("files").select("id, name, created_at").eq("org_id", orgId).order("created_at", { ascending: false }).limit(5),
    db
      .from("invoices")
      .select("id, number, status, issued_on")
      .eq("org_id", orgId)
      .neq("status", "draft")
      .order("issued_on", { ascending: false })
      .limit(3),
  ]);
  fail(automations.error, "automations");
  fail(requests.error, "requests");
  fail(updates.error, "updates");
  fail(comments.error, "comments");
  fail(failedRuns.error, "failed runs");
  fail(files.error, "files");
  fail(invoices.error, "invoices");

  const autos = (automations.data ?? []) as Pick<Automation, "id" | "name" | "status">[];
  const weekAgoMs = now - 7 * DAY;
  const monthStartMs = Date.parse(monthStart);
  const week = runs.filter((r) => Date.parse(r.started_at) >= weekAgoMs);
  const finished = week.filter((r) => r.status !== "running");
  const success = finished.filter((r) => r.status === "success").length;
  const minutesMonth = runs
    .filter((r) => Date.parse(r.started_at) >= monthStartMs && r.status === "success")
    .reduce((sum, r) => sum + (r.minutes_saved ?? 0), 0);
  const reqs = (requests.data ?? []) as Pick<PortalRequest, "id" | "title" | "status" | "created_at">[];

  const activity: ActivityItem[] = [];
  for (const u of (updates.data ?? []) as unknown as { id: string; project_id: string; title: string; created_at: string; project: { name: string } | null }[]) {
    activity.push({
      id: `u-${u.id}`,
      kind: "update",
      title: u.title,
      detail: u.project?.name,
      at: u.created_at,
      href: `/dashboard/projects/${u.project_id}`,
    });
  }
  for (const r of reqs.slice(0, 8)) {
    activity.push({ id: `r-${r.id}`, kind: "request", title: `Request opened: ${r.title}`, at: r.created_at, href: `/dashboard/requests/${r.id}` });
  }
  for (const c of (comments.data ?? []) as unknown as {
    id: string;
    request_id: string;
    created_at: string;
    author: RequestComment["author"];
    request: { title: string } | null;
  }[]) {
    activity.push({
      id: `c-${c.id}`,
      kind: "comment",
      title: `${personName(c.author)} commented`,
      detail: c.request?.title,
      at: c.created_at,
      href: `/dashboard/requests/${c.request_id}`,
    });
  }
  for (const f of (failedRuns.data ?? []) as unknown as {
    id: string;
    automation_id: string;
    started_at: string;
    message: string | null;
    automation: { name: string } | null;
  }[]) {
    activity.push({
      id: `f-${f.id}`,
      kind: "run_failed",
      title: `${runStatusLabel.failed} run: ${f.automation?.name ?? "Automation"}`,
      detail: f.message ?? undefined,
      at: f.started_at,
      href: `/dashboard/automations/${f.automation_id}`,
    });
  }
  for (const f of (files.data ?? []) as { id: string; name: string; created_at: string }[]) {
    activity.push({ id: `d-${f.id}`, kind: "file", title: `File delivered: ${f.name}`, at: f.created_at, href: "/dashboard/files" });
  }
  for (const i of (invoices.data ?? []) as Pick<Invoice, "id" | "number" | "status" | "issued_on">[]) {
    activity.push({ id: `i-${i.id}`, kind: "invoice", title: `Invoice ${i.number} issued`, at: i.issued_on, href: "/dashboard/billing" });
  }
  activity.sort((a, b) => Date.parse(b.at) - Date.parse(a.at));

  return {
    activeAutomations: autos.filter((a) => a.status !== "paused").length,
    totalAutomations: autos.length,
    attention: autos.filter((a) => a.status === "warning" || a.status === "failing").length,
    runs7d: week.length,
    successRate7d: finished.length ? success / finished.length : null,
    hoursSavedMonth: minutesMonth / 60,
    openRequests: reqs.filter((r) => OPEN_REQUEST_STATUSES.includes(r.status)).length,
    waitingOnClient: reqs.filter((r) => r.status === "waiting").length,
    projects: projects.filter((p) => p.status === "active" || p.status === "on_hold"),
    activity: activity.slice(0, 12),
  };
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------
export async function listMembers(db: DB, orgId: string): Promise<{ members: MemberWithProfile[]; invites: Invite[] }> {
  const [members, invites] = await Promise.all([
    db.from("memberships").select(`user_id, org_id, role, created_at, profile:profiles(${PERSON})`).eq("org_id", orgId).order("created_at"),
    db.from("invites").select("*").eq("org_id", orgId).is("accepted_at", null).order("created_at", { ascending: false }),
  ]);
  fail(members.error, "members");
  fail(invites.error, "invites");
  return {
    members: (members.data ?? []) as unknown as MemberWithProfile[],
    invites: (invites.data ?? []) as Invite[],
  };
}

export async function listProjectOptions(db: DB, orgId: string): Promise<{ id: string; name: string }[]> {
  const { data, error } = await db.from("projects").select("id, name").eq("org_id", orgId).order("name");
  fail(error, "projects");
  return (data ?? []) as { id: string; name: string }[];
}
