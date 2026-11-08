// Typed read queries for the client portal (D1). Every function takes the PortalContext and
// checks access to the organization before touching the database, then filters every query
// by that org id. Child rows are always matched on org_id as well as their own id, so an id
// from another organization simply returns nothing.

import { cache } from "react";
import type {
  ActivityItem,
  Automation,
  AutomationRun,
  AutomationWithStats,
  Invite,
  Invoice,
  MemberRole,
  MemberWithProfile,
  PersonRef,
  PortalFile,
  PortalRequest,
  Project,
  ProjectMilestone,
  ProjectStage,
  ProjectUpdate,
  ProjectWithStages,
  RequestComment,
} from "./types";
import { OPEN_REQUEST_STATUSES, STAGES, personName, runStatusLabel } from "./format";
import { assertAdmin, assertMember, canManage, type PortalContext } from "./access";

const DAY = 24 * 60 * 60 * 1000;

/** Request timestamp used for "last 7 days" windows and relative times. */
export function requestNow(): number {
  return Date.now();
}

function sortStages(stages: ProjectStage[]): ProjectStage[] {
  return [...stages].sort((a, b) => STAGES.indexOf(a.stage) - STAGES.indexOf(b.stage));
}

// ---------------------------------------------------------------------------
// People
// ---------------------------------------------------------------------------
type PersonCols = { a_id: string | null; a_email: string | null; a_name: string | null; a_is_staff: number | null };

/** SELECT list for a user joined as alias `a`. */
const PERSON_COLS = "a.id AS a_id, a.email AS a_email, a.name AS a_name, a.is_staff AS a_is_staff";

/**
 * Users the viewer may see by name: themselves, staff, and anyone who shares an organization
 * with them (same rule as the old profiles policy). Staff see everyone. Cached per request.
 */
const visiblePeople = cache(async (db: D1Database, userId: string): Promise<Set<string>> => {
  const { results } = await db
    .prepare(
      `SELECT DISTINCT pm.user_id AS id
         FROM memberships pm JOIN memberships mine ON mine.org_id = pm.org_id
        WHERE mine.user_id = ?`,
    )
    .bind(userId)
    .all<{ id: string }>();
  return new Set(results.map((r) => r.id));
});

async function personResolver(ctx: PortalContext): Promise<(row: PersonCols) => PersonRef> {
  const shared = ctx.isStaff ? null : await visiblePeople(ctx.db, ctx.userId);
  return (row) => {
    if (!row.a_id) return null;
    const staff = row.a_is_staff === 1;
    const visible = !shared || staff || row.a_id === ctx.userId || shared.has(row.a_id);
    if (!visible) return null;
    return { id: row.a_id, email: row.a_email, full_name: row.a_name, is_staff: staff };
  };
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
type StageRow = ProjectStage;

async function stagesFor(db: D1Database, orgId: string, projectIds: string[] | null): Promise<ProjectStage[]> {
  const { results } = await db
    .prepare("SELECT * FROM project_stages WHERE org_id = ?")
    .bind(orgId)
    .all<StageRow>();
  return projectIds ? results.filter((s) => projectIds.includes(s.project_id)) : results;
}

const PROJECT_ORDER = `CASE status WHEN 'active' THEN 0 WHEN 'on_hold' THEN 1 WHEN 'completed' THEN 2 ELSE 3 END, created_at DESC`;

export async function listProjects(ctx: PortalContext, orgId: string): Promise<ProjectWithStages[]> {
  assertMember(ctx, orgId);
  const [{ results: projects }, stages] = await Promise.all([
    ctx.db.prepare(`SELECT * FROM projects WHERE org_id = ? ORDER BY ${PROJECT_ORDER}`).bind(orgId).all<Project>(),
    stagesFor(ctx.db, orgId, null),
  ]);
  return projects.map((p) => ({ ...p, stages: sortStages(stages.filter((s) => s.project_id === p.id)) }));
}

export async function getProject(
  ctx: PortalContext,
  orgId: string,
  projectId: string,
): Promise<{
  project: Project;
  stages: ProjectStage[];
  milestones: ProjectMilestone[];
  updates: ProjectUpdate[];
} | null> {
  assertMember(ctx, orgId);
  const project = await ctx.db.prepare("SELECT * FROM projects WHERE id = ? AND org_id = ?").bind(projectId, orgId).first<Project>();
  if (!project) return null;

  const [stages, milestones, updates, person] = await Promise.all([
    ctx.db.prepare("SELECT * FROM project_stages WHERE project_id = ? AND org_id = ?").bind(projectId, orgId).all<ProjectStage>(),
    ctx.db
      .prepare("SELECT * FROM project_milestones WHERE project_id = ? AND org_id = ? ORDER BY position, created_at")
      .bind(projectId, orgId)
      .all<Omit<ProjectMilestone, "done"> & { done: number }>(),
    ctx.db
      .prepare(
        `SELECT u.id, u.project_id, u.org_id, u.title, u.body, u.created_at, ${PERSON_COLS}
           FROM project_updates u LEFT JOIN users a ON a.id = u.author_id
          WHERE u.project_id = ? AND u.org_id = ?
          ORDER BY u.created_at DESC`,
      )
      .bind(projectId, orgId)
      .all<Omit<ProjectUpdate, "author"> & PersonCols>(),
    personResolver(ctx),
  ]);

  return {
    project,
    stages: sortStages(stages.results),
    milestones: milestones.results.map((m) => ({ ...m, done: m.done === 1 })),
    updates: updates.results.map((u) => ({
      id: u.id,
      project_id: u.project_id,
      org_id: u.org_id,
      title: u.title,
      body: u.body,
      created_at: u.created_at,
      author: person(u),
    })),
  };
}

// ---------------------------------------------------------------------------
// Automations
// ---------------------------------------------------------------------------
type RunLite = Pick<AutomationRun, "automation_id" | "status" | "started_at" | "minutes_saved">;

async function runsSince(db: D1Database, orgId: string, sinceIso: string): Promise<RunLite[]> {
  const { results } = await db
    .prepare(
      `SELECT automation_id, status, started_at, minutes_saved FROM automation_runs
        WHERE org_id = ? AND started_at >= ? ORDER BY started_at DESC LIMIT 10000`,
    )
    .bind(orgId, sinceIso)
    .all<RunLite>();
  return results;
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

export async function listAutomations(ctx: PortalContext, orgId: string, now: number): Promise<AutomationWithStats[]> {
  assertMember(ctx, orgId);
  const [{ results }, runs] = await Promise.all([
    ctx.db.prepare("SELECT * FROM automations WHERE org_id = ? ORDER BY name COLLATE NOCASE").bind(orgId).all<Automation>(),
    runsSince(ctx.db, orgId, new Date(now - 7 * DAY).toISOString()),
  ]);
  return withStats(results, runs);
}

export async function getAutomation(
  ctx: PortalContext,
  orgId: string,
  automationId: string,
  now: number,
): Promise<{ automation: AutomationWithStats; runs: AutomationRun[]; projectName: string | null } | null> {
  assertMember(ctx, orgId);
  const row = await ctx.db
    .prepare(
      `SELECT a.*, p.name AS project_name FROM automations a
         LEFT JOIN projects p ON p.id = a.project_id AND p.org_id = a.org_id
        WHERE a.id = ? AND a.org_id = ?`,
    )
    .bind(automationId, orgId)
    .first<Automation & { project_name: string | null }>();
  if (!row) return null;

  const [{ results: runs }, recent] = await Promise.all([
    ctx.db
      .prepare("SELECT * FROM automation_runs WHERE automation_id = ? AND org_id = ? ORDER BY started_at DESC LIMIT 100")
      .bind(automationId, orgId)
      .all<AutomationRun>(),
    runsSince(ctx.db, orgId, new Date(now - 7 * DAY).toISOString()),
  ]);
  const { project_name, ...automation } = row;
  return { automation: withStats([automation], recent)[0], runs, projectName: project_name };
}

// ---------------------------------------------------------------------------
// Requests
// ---------------------------------------------------------------------------
type RequestRow = Omit<PortalRequest, "author"> & PersonCols;

function toRequest(r: RequestRow, person: (row: PersonCols) => PersonRef): PortalRequest {
  return {
    id: r.id,
    org_id: r.org_id,
    project_id: r.project_id,
    title: r.title,
    description: r.description,
    priority: r.priority,
    status: r.status,
    created_at: r.created_at,
    updated_at: r.updated_at,
    author: person(r),
  };
}

const REQUEST_COLS = `r.id, r.org_id, r.project_id, r.title, r.description, r.priority, r.status, r.created_at, r.updated_at, ${PERSON_COLS}`;

export async function listRequests(ctx: PortalContext, orgId: string): Promise<PortalRequest[]> {
  assertMember(ctx, orgId);
  const [{ results }, person] = await Promise.all([
    ctx.db
      .prepare(
        `SELECT ${REQUEST_COLS} FROM requests r LEFT JOIN users a ON a.id = r.created_by
          WHERE r.org_id = ? ORDER BY r.updated_at DESC LIMIT 500`,
      )
      .bind(orgId)
      .all<RequestRow>(),
    personResolver(ctx),
  ]);
  return results.map((r) => toRequest(r, person));
}

export async function getRequest(
  ctx: PortalContext,
  orgId: string,
  requestId: string,
): Promise<{ request: PortalRequest; comments: RequestComment[]; projectName: string | null } | null> {
  assertMember(ctx, orgId);
  const [row, person] = await Promise.all([
    ctx.db
      .prepare(
        `SELECT ${REQUEST_COLS}, p.name AS project_name
           FROM requests r
           LEFT JOIN users a ON a.id = r.created_by
           LEFT JOIN projects p ON p.id = r.project_id AND p.org_id = r.org_id
          WHERE r.id = ? AND r.org_id = ?`,
      )
      .bind(requestId, orgId)
      .first<RequestRow & { project_name: string | null }>(),
    personResolver(ctx),
  ]);
  if (!row) return null;

  const { results: comments } = await ctx.db
    .prepare(
      `SELECT c.id, c.request_id, c.body, c.created_at, ${PERSON_COLS}
         FROM request_comments c LEFT JOIN users a ON a.id = c.author_id
        WHERE c.request_id = ? AND c.org_id = ?
        ORDER BY c.created_at`,
    )
    .bind(requestId, orgId)
    .all<Omit<RequestComment, "author"> & PersonCols>();

  return {
    request: toRequest(row, person),
    comments: comments.map((c) => ({ id: c.id, request_id: c.request_id, body: c.body, created_at: c.created_at, author: person(c) })),
    projectName: row.project_name,
  };
}

// ---------------------------------------------------------------------------
// Files and invoices
// ---------------------------------------------------------------------------
export async function listFiles(ctx: PortalContext, orgId: string): Promise<PortalFile[]> {
  assertMember(ctx, orgId);
  const { results } = await ctx.db
    .prepare(
      `SELECT f.id, f.org_id, f.project_id, f.name, f.r2_key, f.external_url, f.size_bytes, f.content_type, f.created_at,
              p.name AS project_name
         FROM files f LEFT JOIN projects p ON p.id = f.project_id AND p.org_id = f.org_id
        WHERE f.org_id = ? ORDER BY f.created_at DESC`,
    )
    .bind(orgId)
    .all<Omit<PortalFile, "project"> & { project_name: string | null }>();
  return results.map(({ project_name, ...f }) => ({
    ...f,
    project: f.project_id && project_name ? { id: f.project_id, name: project_name } : null,
  }));
}

/** Clients never see draft invoices; org admins and staff see everything. */
export async function listInvoices(ctx: PortalContext, orgId: string): Promise<Invoice[]> {
  assertMember(ctx, orgId);
  const hideDrafts = canManage(ctx, orgId) ? 0 : 1;
  const { results } = await ctx.db
    .prepare(
      `SELECT id, org_id, number, issued_on, due_on, amount_cents, currency, status, url, notes FROM invoices
        WHERE org_id = ? AND (? = 0 OR status <> 'draft')
        ORDER BY issued_on DESC, created_at DESC`,
    )
    .bind(orgId, hideDrafts)
    .all<Invoice>();
  return results;
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

export async function getOverview(ctx: PortalContext, orgId: string, now: number): Promise<Overview> {
  assertMember(ctx, orgId);
  const db = ctx.db;
  const nowDate = new Date(now);
  const monthStart = new Date(Date.UTC(nowDate.getUTCFullYear(), nowDate.getUTCMonth(), 1)).toISOString();
  const weekAgo = new Date(now - 7 * DAY).toISOString();
  const windowStart = monthStart < weekAgo ? monthStart : weekAgo;

  const [automations, runs, requests, projects, updates, comments, failedRuns, files, invoices, person] = await Promise.all([
    db.prepare("SELECT id, name, status FROM automations WHERE org_id = ?").bind(orgId).all<Pick<Automation, "id" | "name" | "status">>(),
    runsSince(db, orgId, windowStart),
    db
      .prepare("SELECT id, title, status, created_at FROM requests WHERE org_id = ? ORDER BY created_at DESC LIMIT 200")
      .bind(orgId)
      .all<Pick<PortalRequest, "id" | "title" | "status" | "created_at">>(),
    listProjects(ctx, orgId),
    db
      .prepare(
        `SELECT u.id, u.project_id, u.title, u.created_at, p.name AS project_name
           FROM project_updates u LEFT JOIN projects p ON p.id = u.project_id
          WHERE u.org_id = ? ORDER BY u.created_at DESC LIMIT 8`,
      )
      .bind(orgId)
      .all<{ id: string; project_id: string; title: string; created_at: string; project_name: string | null }>(),
    db
      .prepare(
        `SELECT c.id, c.request_id, c.created_at, r.title AS request_title, ${PERSON_COLS}
           FROM request_comments c
           LEFT JOIN users a ON a.id = c.author_id
           LEFT JOIN requests r ON r.id = c.request_id
          WHERE c.org_id = ? ORDER BY c.created_at DESC LIMIT 8`,
      )
      .bind(orgId)
      .all<{ id: string; request_id: string; created_at: string; request_title: string | null } & PersonCols>(),
    db
      .prepare(
        `SELECT r.id, r.automation_id, r.started_at, r.message, a.name AS automation_name
           FROM automation_runs r LEFT JOIN automations a ON a.id = r.automation_id
          WHERE r.org_id = ? AND r.status = 'failed' ORDER BY r.started_at DESC LIMIT 5`,
      )
      .bind(orgId)
      .all<{ id: string; automation_id: string; started_at: string; message: string | null; automation_name: string | null }>(),
    db
      .prepare("SELECT id, name, created_at FROM files WHERE org_id = ? ORDER BY created_at DESC LIMIT 5")
      .bind(orgId)
      .all<{ id: string; name: string; created_at: string }>(),
    db
      .prepare("SELECT id, number, status, issued_on FROM invoices WHERE org_id = ? AND status <> 'draft' ORDER BY issued_on DESC LIMIT 3")
      .bind(orgId)
      .all<Pick<Invoice, "id" | "number" | "status" | "issued_on">>(),
    personResolver(ctx),
  ]);

  const autos = automations.results;
  const weekAgoMs = now - 7 * DAY;
  const monthStartMs = Date.parse(monthStart);
  const week = runs.filter((r) => Date.parse(r.started_at) >= weekAgoMs);
  const finished = week.filter((r) => r.status !== "running");
  const success = finished.filter((r) => r.status === "success").length;
  const minutesMonth = runs
    .filter((r) => Date.parse(r.started_at) >= monthStartMs && r.status === "success")
    .reduce((sum, r) => sum + (r.minutes_saved ?? 0), 0);
  const reqs = requests.results;

  const activity: ActivityItem[] = [];
  for (const u of updates.results) {
    activity.push({
      id: `u-${u.id}`,
      kind: "update",
      title: u.title,
      detail: u.project_name ?? undefined,
      at: u.created_at,
      href: `/dashboard/projects/${u.project_id}`,
    });
  }
  for (const r of reqs.slice(0, 8)) {
    activity.push({ id: `r-${r.id}`, kind: "request", title: `Request opened: ${r.title}`, at: r.created_at, href: `/dashboard/requests/${r.id}` });
  }
  for (const c of comments.results) {
    activity.push({
      id: `c-${c.id}`,
      kind: "comment",
      title: `${personName(person(c))} commented`,
      detail: c.request_title ?? undefined,
      at: c.created_at,
      href: `/dashboard/requests/${c.request_id}`,
    });
  }
  for (const f of failedRuns.results) {
    activity.push({
      id: `f-${f.id}`,
      kind: "run_failed",
      title: `${runStatusLabel.failed} run: ${f.automation_name ?? "Automation"}`,
      detail: f.message ?? undefined,
      at: f.started_at,
      href: `/dashboard/automations/${f.automation_id}`,
    });
  }
  for (const f of files.results) {
    activity.push({ id: `d-${f.id}`, kind: "file", title: `File delivered: ${f.name}`, at: f.created_at, href: "/dashboard/files" });
  }
  for (const i of invoices.results) {
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
export type MemberRow = MemberWithProfile & {
  /** The admin may generate a password reset link for this person. */
  canReset: boolean;
};

export async function listMembers(ctx: PortalContext, orgId: string): Promise<{ members: MemberRow[]; invites: Invite[] }> {
  assertAdmin(ctx, orgId);
  const [members, invites] = await Promise.all([
    ctx.db
      .prepare(
        `SELECT m.user_id, m.org_id, m.role, m.created_at, ${PERSON_COLS}
           FROM memberships m JOIN users a ON a.id = m.user_id
          WHERE m.org_id = ? ORDER BY m.created_at`,
      )
      .bind(orgId)
      .all<{ user_id: string; org_id: string; role: MemberRole; created_at: string } & PersonCols>(),
    ctx.db
      .prepare(
        `SELECT id, org_id, email, role, is_staff, created_at, expires_at, used_at FROM invites
          WHERE org_id = ? AND used_at IS NULL AND expires_at > ? ORDER BY created_at DESC`,
      )
      .bind(orgId, new Date().toISOString())
      .all<Omit<Invite, "is_staff"> & { is_staff: number }>(),
  ]);

  const resettable = await resettableUsers(ctx, members.results.map((m) => m.user_id));
  return {
    members: members.results.map((m) => ({
      user_id: m.user_id,
      org_id: m.org_id,
      role: m.role,
      created_at: m.created_at,
      profile: { id: m.user_id, email: m.a_email, full_name: m.a_name, is_staff: m.a_is_staff === 1 },
      canReset: resettable.has(m.user_id),
    })),
    invites: invites.results.map((i) => ({ ...i, is_staff: i.is_staff === 1 })),
  };
}

/**
 * Users whose password this admin may reset. Staff can reset anyone. An org admin can reset
 * a non-staff user only when they administer every organization that user belongs to, so a
 * reset link can never be used to take over access the admin does not already have.
 */
export async function resettableUsers(ctx: PortalContext, userIds: string[]): Promise<Set<string>> {
  const out = new Set<string>();
  if (userIds.length === 0) return out;
  if (ctx.isStaff) {
    for (const id of userIds) out.add(id);
    return out;
  }
  const placeholders = userIds.map(() => "?").join(", ");
  const { results } = await ctx.db
    .prepare(
      `SELECT u.id, u.is_staff, group_concat(m.org_id) AS org_ids
         FROM users u LEFT JOIN memberships m ON m.user_id = u.id
        WHERE u.id IN (${placeholders})
        GROUP BY u.id`,
    )
    .bind(...userIds)
    .all<{ id: string; is_staff: number; org_ids: string | null }>();
  for (const r of results) {
    if (r.is_staff === 1 || r.id === ctx.userId) continue;
    const orgs = (r.org_ids ?? "").split(",").filter(Boolean);
    if (orgs.length > 0 && orgs.every((o) => canManage(ctx, o))) out.add(r.id);
  }
  return out;
}

export async function listProjectOptions(ctx: PortalContext, orgId: string): Promise<{ id: string; name: string }[]> {
  assertMember(ctx, orgId);
  const { results } = await ctx.db
    .prepare("SELECT id, name FROM projects WHERE org_id = ? ORDER BY name COLLATE NOCASE")
    .bind(orgId)
    .all<{ id: string; name: string }>();
  return results;
}
