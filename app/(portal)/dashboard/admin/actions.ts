"use server";

// Admin mutations. Each action checks, through lib/portal/access.ts, that the caller is
// agency staff or an admin member of the organization, and every write is scoped by org_id
// so a forged id from another organization matches nothing.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin, assertStaff, getPortalContext, type PortalContext } from "@/lib/portal/access";
import { INVITE_DAYS, RESET_HOURS, isoIn, requestOrigin } from "@/lib/portal/auth";
import { randomToken, sha256Hex } from "@/lib/portal/crypto";
import { getFilesBucket } from "@/lib/portal/env";
import { resettableUsers } from "@/lib/portal/queries";
import { guarded } from "@/lib/portal/action-utils";
import {
  ValidationError,
  cents,
  checkbox,
  email as readEmail,
  int,
  oneOf,
  optionalDate,
  optionalDateTime,
  optionalInt,
  optionalText,
  optionalUrl,
  optionalUuid,
  text,
  uuid,
} from "@/lib/portal/validate";
import { GATE_KINDS, STAGES, gateKindLabel, gateUnlocks, stageLabel } from "@/lib/portal/format";
import { blockedMessage, blockingGate } from "@/lib/portal/gates";
import { plans } from "@/lib/content/company";
import { sendAccountMail } from "@/lib/portal/mail";
import { projectInsertStatements } from "@/lib/portal/projects";
import type {
  ActionState,
  AutomationStatus,
  GateKind,
  InvoiceStatus,
  MemberRole,
  OrgPlan,
  ProjectStatus,
  RunStatus,
  StageKey,
  StageStatus,
} from "@/lib/portal/types";

const PLANS: OrgPlan[] = ["none", "crescent", "half_moon", "full_moon", "custom"];
const ROLES: MemberRole[] = ["client", "admin"];
const PROJECT_STATUSES: ProjectStatus[] = ["active", "on_hold", "completed", "cancelled"];
const STAGE_STATUSES: StageStatus[] = ["pending", "active", "done"];
const AUTOMATION_STATUSES: AutomationStatus[] = ["healthy", "warning", "failing", "paused"];
const RUN_STATUSES: RunStatus[] = ["success", "failed", "running"];
const INVOICE_STATUSES: InvoiceStatus[] = ["draft", "open", "paid", "overdue", "void"];

async function adminFor(formData: FormData): Promise<{ ctx: PortalContext; orgId: string }> {
  const orgId = uuid(formData, "org_id", "Organization");
  const ctx = await getPortalContext();
  assertAdmin(ctx, orgId);
  return { ctx, orgId };
}

function done(message: string): ActionState {
  revalidatePath("/dashboard", "layout");
  return { ok: true, message };
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Checks that a project id belongs to the organization (or is null). */
async function projectInOrg(ctx: PortalContext, orgId: string, projectId: string | null): Promise<void> {
  if (!projectId) return;
  const row = await ctx.db.prepare("SELECT 1 AS ok FROM projects WHERE id = ? AND org_id = ?").bind(projectId, orgId).first();
  if (!row) throw new ValidationError("That project was not found in this organization.");
}

// ---------------------------------------------------------------------------
// Organizations and people
// ---------------------------------------------------------------------------
export async function createOrganization(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const name = text(formData, "name", { label: "Name", max: 120 });
    const plan = oneOf(formData, "plan", PLANS, "Plan");
    const planStarted = optionalDate(formData, "plan_started_on", "Plan start");
    const ctx = await getPortalContext();
    assertStaff(ctx);

    const id = crypto.randomUUID();
    await ctx.db.prepare("INSERT INTO organizations (id, name, plan, plan_started_on) VALUES (?, ?, ?, ?)").bind(id, name, plan, planStarted).run();
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${id}`);
  });
}

export async function updateOrganization(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const name = text(formData, "name", { label: "Name", max: 120 });
    const plan = oneOf(formData, "plan", PLANS, "Plan");
    const planStarted = optionalDate(formData, "plan_started_on", "Plan start");
    await ctx.db.prepare("UPDATE organizations SET name = ?, plan = ?, plan_started_on = ? WHERE id = ?").bind(name, plan, planStarted, orgId).run();
    return done("Organization saved.");
  });
}

/**
 * Creates a one-time invite link (valid 7 days) for this email and organization. Any older
 * unused invite for the same email and org is replaced. Only staff may invite staff.
 */
export async function inviteMember(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const address = readEmail(formData, "email");
    const role = oneOf(formData, "role", ROLES, "Role");
    const makeStaff = checkbox(formData, "is_staff");
    if (makeStaff) assertStaff(ctx);

    const token = randomToken(32);
    await ctx.db.batch([
      ctx.db.prepare("DELETE FROM invites WHERE org_id = ? AND email = ? AND used_at IS NULL").bind(orgId, address),
      ctx.db
        .prepare(
          "INSERT INTO invites (id, token_hash, email, org_id, role, is_staff, expires_at, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        )
        .bind(crypto.randomUUID(), await sha256Hex(token), address, orgId, role, makeStaff ? 1 : 0, isoIn(INVITE_DAYS * DAY_MS), ctx.userId),
    ]);
    revalidatePath("/dashboard", "layout");
    return {
      ok: true,
      message: `Invite link for ${address} (valid ${INVITE_DAYS} days, works once). Send it to them yourself; it is not shown again.`,
      link: `${await requestOrigin()}/invite/${token}`,
    };
  });
}

export async function revokeInvite(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "invite_id", "Invite");
    await ctx.db.prepare("DELETE FROM invites WHERE id = ? AND org_id = ? AND used_at IS NULL").bind(id, orgId).run();
    return done("Invite revoked.");
  });
}

/**
 * One-time password reset link (valid 24 hours) for a member. Staff can reset anyone; an org
 * admin only people who are not staff and whose organizations they all administer.
 */
export async function createPasswordReset(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const userId = uuid(formData, "user_id", "Member");
    const member = await ctx.db
      .prepare("SELECT u.email FROM memberships m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND m.user_id = ?")
      .bind(orgId, userId)
      .first<{ email: string }>();
    if (!member) return { ok: false, message: "That person is not a member of this organization." };
    if (!(await resettableUsers(ctx, [userId])).has(userId)) {
      return { ok: false, message: "Only Moonlab staff can reset this person's password." };
    }

    const token = randomToken(32);
    await ctx.db.batch([
      ctx.db.prepare("DELETE FROM password_resets WHERE user_id = ? AND used_at IS NULL").bind(userId),
      ctx.db
        .prepare("INSERT INTO password_resets (token_hash, user_id, expires_at, created_by) VALUES (?, ?, ?, ?)")
        .bind(await sha256Hex(token), userId, isoIn(RESET_HOURS * 60 * 60 * 1000), ctx.userId),
    ]);
    return {
      ok: true,
      message: `Password reset link for ${member.email} (valid ${RESET_HOURS} hours, works once). It is not shown again.`,
      link: `${await requestOrigin()}/reset/${token}`,
    };
  });
}

export async function updateMemberRole(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const userId = uuid(formData, "user_id", "Member");
    const role = oneOf(formData, "role", ROLES, "Role");
    await ctx.db.prepare("UPDATE memberships SET role = ? WHERE org_id = ? AND user_id = ?").bind(role, orgId, userId).run();
    return done("Role updated.");
  });
}

export async function removeMember(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const userId = uuid(formData, "user_id", "Member");
    if (userId === ctx.userId) return { ok: false, message: "You cannot remove yourself." };
    await ctx.db.prepare("DELETE FROM memberships WHERE org_id = ? AND user_id = ?").bind(orgId, userId).run();
    return done("Member removed.");
  });
}

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
function projectFields(formData: FormData) {
  return {
    name: text(formData, "name", { label: "Name", max: 160 }),
    summary: optionalText(formData, "summary", { label: "Summary", max: 4000 }),
    status: oneOf(formData, "status", PROJECT_STATUSES, "Status"),
    started_on: optionalDate(formData, "started_on", "Start date"),
    target_on: optionalDate(formData, "target_on", "Target date"),
  };
}

export async function createProject(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const f = projectFields(formData);
    const id = crypto.randomUUID();
    await ctx.db.batch(
      projectInsertStatements(ctx.db, { id, orgId, name: f.name, summary: f.summary, status: f.status, startedOn: f.started_on, targetOn: f.target_on }),
    );
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}/projects/${id}`);
  });
}

/**
 * Starts a project from a client's brief: creates the project with its stages, links the brief
 * to it (the brief text is never changed) and emails the organization's members.
 */
export async function startProjectFromBrief(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const briefId = uuid(formData, "brief_id", "Brief");
    const f = projectFields(formData);
    const note = optionalText(formData, "staff_note", { label: "Note for the client", max: 4000 });
    const brief = await ctx.db
      .prepare("SELECT title, status FROM project_briefs WHERE id = ? AND org_id = ?")
      .bind(briefId, orgId)
      .first<{ title: string; status: string }>();
    if (!brief) return { ok: false, message: "That brief was not found." };
    if (brief.status !== "submitted") return { ok: false, message: "This brief has already been answered." };

    const id = crypto.randomUUID();
    await ctx.db.batch([
      ...projectInsertStatements(ctx.db, { id, orgId, name: f.name, summary: f.summary, status: f.status, startedOn: f.started_on, targetOn: f.target_on }),
      ctx.db
        .prepare(
          "UPDATE project_briefs SET status = 'accepted', project_id = ?, staff_note = ?, decided_by = ?, decided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND org_id = ?",
        )
        .bind(id, note, ctx.userId, briefId, orgId),
    ]);

    const origin = await requestOrigin();
    for (const to of await memberEmails(ctx, orgId)) {
      await sendAccountMail({
        to,
        subject: `Your project has started: ${f.name}`,
        greeting: "Hi,",
        lines: [
          `We read your brief "${brief.title}" and started the project ${f.name}.`,
          ...(note ? [note] : []),
          "You can follow every stage, milestone and update in your portal.",
        ],
        button: { label: "Open the project", href: `${origin}/dashboard/projects/${id}` },
        footer: "Questions? Reply to this email or send a request from the project page.",
      });
    }
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}/projects/${id}`);
  });
}

/** Declines a brief with a note the client sees, and emails the organization's members. */
export async function declineBrief(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const briefId = uuid(formData, "brief_id", "Brief");
    const note = text(formData, "staff_note", { label: "Reason for the client", max: 4000 });
    const brief = await ctx.db
      .prepare("SELECT title FROM project_briefs WHERE id = ? AND org_id = ? AND status = 'submitted'")
      .bind(briefId, orgId)
      .first<{ title: string }>();
    if (!brief) return { ok: false, message: "This brief has already been answered." };
    await ctx.db
      .prepare(
        "UPDATE project_briefs SET status = 'declined', staff_note = ?, decided_by = ?, decided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND org_id = ? AND status = 'submitted'",
      )
      .bind(note, ctx.userId, briefId, orgId)
      .run();

    const origin = await requestOrigin();
    for (const to of await memberEmails(ctx, orgId)) {
      await sendAccountMail({
        to,
        subject: `About your brief: ${brief.title}`,
        greeting: "Hi,",
        lines: [`Thank you for your brief "${brief.title}". We are not able to take it on as it is.`, note],
        button: { label: "View the brief", href: `${origin}/dashboard/projects/briefs/${briefId}` },
        footer: "If something changes, send us a new brief or reply to this email.",
      });
    }
    return done("Brief declined and the client was emailed.");
  });
}

export async function updateProject(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const f = projectFields(formData);
    await ctx.db
      .prepare("UPDATE projects SET name = ?, summary = ?, status = ?, started_on = ?, target_on = ? WHERE id = ? AND org_id = ?")
      .bind(f.name, f.summary, f.status, f.started_on, f.target_on, projectId, orgId)
      .run();
    return done("Project saved.");
  });
}

export async function deleteProject(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    await ctx.db.prepare("DELETE FROM projects WHERE id = ? AND org_id = ?").bind(projectId, orgId).run();
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}?tab=projects`);
  });
}

export async function updateStage(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const stage = oneOf<StageKey>(formData, "stage", STAGES, "Stage");
    const status = oneOf(formData, "status", STAGE_STATUSES, "Status");
    const startedOn = optionalDate(formData, "started_on", "Start date");
    const dueOn = optionalDate(formData, "due_on", "Due date");
    const completedOn = optionalDate(formData, "completed_on", "Completed date");
    const notes = optionalText(formData, "notes", { label: "Notes", max: 1000 });
    await projectInOrg(ctx, orgId, projectId);
    if (status !== "pending") {
      const gate = await blockingGate(ctx.db, orgId, projectId, stage);
      if (gate) return { ok: false, message: blockedMessage(stageLabel[stage], gate) };
    }
    // Upsert so projects created outside the portal (missing stage rows) still work.
    await ctx.db
      .prepare(
        `INSERT INTO project_stages (id, project_id, org_id, stage, status, started_on, due_on, completed_on, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT (project_id, stage) DO UPDATE SET
           status = excluded.status, started_on = excluded.started_on, due_on = excluded.due_on,
           completed_on = excluded.completed_on, notes = excluded.notes`,
      )
      .bind(crypto.randomUUID(), projectId, orgId, stage, status, startedOn, dueOn, completedOn, notes)
      .run();
    return done("Stage saved.");
  });
}

/**
 * Asks the client to approve a spec, mockup or release. Emails the organization's client
 * members. Only one gate of a kind can wait at a time; a new version after "changes requested"
 * is simply a new gate, so every decision stays on record.
 */
export async function requestApproval(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const kind = oneOf<GateKind>(formData, "kind", GATE_KINDS, "Type");
    const title = text(formData, "title", { label: "Title", min: 3, max: 200 });
    const details = optionalText(formData, "details", { label: "What to check", max: 10000 });
    const link = optionalUrl(formData, "link_url", "Link");
    const project = await ctx.db.prepare("SELECT name FROM projects WHERE id = ? AND org_id = ?").bind(projectId, orgId).first<{ name: string }>();
    if (!project) return { ok: false, message: "That project was not found." };
    const waiting = await ctx.db
      .prepare("SELECT 1 AS x FROM project_gates WHERE project_id = ? AND org_id = ? AND kind = ? AND status = 'waiting'")
      .bind(projectId, orgId, kind)
      .first();
    if (waiting) return { ok: false, message: `A ${gateKindLabel[kind].toLowerCase()} is already waiting for approval. Withdraw it first to send a new one.` };

    await ctx.db
      .prepare("INSERT INTO project_gates (id, project_id, org_id, kind, title, details, link_url, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), projectId, orgId, kind, title, details, link, ctx.userId)
      .run();

    const origin = await requestOrigin();
    const approvers = await approverEmails(ctx, orgId);
    for (const to of approvers) {
      await sendAccountMail({
        to,
        subject: `Please review: ${title} (${project.name})`,
        greeting: "Hi,",
        lines: [
          `The ${gateKindLabel[kind].toLowerCase()} for ${project.name} is ready for your review: ${title}.`,
          `Approve it, or tell us what to change. We start ${stageLabel[gateUnlocks[kind]]} once you approve.`,
        ],
        button: { label: "Review and approve", href: `${origin}/dashboard/projects/${projectId}#approvals` },
        footer: "Questions? Reply to this email.",
      });
    }
    return done(
      approvers.length
        ? `Sent for approval. ${approvers.length} client member${approvers.length === 1 ? " was" : "s were"} emailed.`
        : "Saved, but this organization has no client members to approve it yet. Invite one first.",
    );
  });
}

/** Withdraws a gate that is still waiting (e.g. sent by mistake or replaced). */
export async function withdrawApproval(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const gateId = uuid(formData, "gate_id", "Approval");
    const res = await ctx.db
      .prepare("UPDATE project_gates SET status = 'cancelled', decided_by = ?, decided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND org_id = ? AND status = 'waiting'")
      .bind(ctx.userId, gateId, orgId)
      .run();
    if (!res.meta.changes) return { ok: false, message: "Only a waiting approval can be withdrawn." };
    return done("Approval request withdrawn.");
  });
}

/** Client members who can approve: role client, not Moonlab staff. */
async function approverEmails(ctx: PortalContext, orgId: string): Promise<string[]> {
  const { results } = await ctx.db
    .prepare("SELECT u.email FROM memberships m JOIN users u ON u.id = m.user_id WHERE m.org_id = ? AND m.role = 'client' AND u.is_staff = 0")
    .bind(orgId)
    .all<{ email: string }>();
  return results.map((r) => String(r.email));
}

export async function addMilestone(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const stage = formData.get("stage") ? oneOf<StageKey>(formData, "stage", STAGES, "Stage") : null;
    const title = text(formData, "title", { label: "Title", max: 200 });
    const dueOn = optionalDate(formData, "due_on", "Due date");
    const position = int(formData, "position", { label: "Order", min: 0, max: 10000, fallback: 0 });
    await projectInOrg(ctx, orgId, projectId);
    await ctx.db
      .prepare("INSERT INTO project_milestones (id, project_id, org_id, stage, title, due_on, position) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), projectId, orgId, stage, title, dueOn, position)
      .run();
    return done("Milestone added.");
  });
}

export async function setMilestoneDone(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "milestone_id", "Milestone");
    await ctx.db
      .prepare("UPDATE project_milestones SET done = ? WHERE id = ? AND org_id = ?")
      .bind(checkbox(formData, "done") ? 1 : 0, id, orgId)
      .run();
    return done("Milestone updated.");
  });
}

export async function deleteMilestone(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "milestone_id", "Milestone");
    await ctx.db.prepare("DELETE FROM project_milestones WHERE id = ? AND org_id = ?").bind(id, orgId).run();
    return done("Milestone deleted.");
  });
}

export async function postUpdate(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const title = text(formData, "title", { label: "Title", max: 200 });
    const body = optionalText(formData, "body", { label: "Body", max: 10000 });
    await projectInOrg(ctx, orgId, projectId);
    await ctx.db
      .prepare("INSERT INTO project_updates (id, project_id, org_id, author_id, title, body) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), projectId, orgId, ctx.userId, title, body)
      .run();
    return done("Update posted.");
  });
}

export async function deleteUpdate(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "update_id", "Update");
    await ctx.db.prepare("DELETE FROM project_updates WHERE id = ? AND org_id = ?").bind(id, orgId).run();
    return done("Update deleted.");
  });
}

// ---------------------------------------------------------------------------
// Automations and runs
// ---------------------------------------------------------------------------
function automationFields(formData: FormData) {
  return {
    name: text(formData, "name", { label: "Name", max: 160 }),
    description: optionalText(formData, "description", { label: "Description", max: 4000 }),
    trigger_label: optionalText(formData, "trigger_label", { label: "Trigger", max: 160 }),
    status: oneOf(formData, "status", AUTOMATION_STATUSES, "Status"),
    minutes_saved_per_run: int(formData, "minutes_saved_per_run", { label: "Minutes saved per run", min: 0, max: 100000, fallback: 0 }),
    project_id: optionalUuid(formData, "project_id", "Project"),
  };
}

export async function createAutomation(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const f = automationFields(formData);
    await projectInOrg(ctx, orgId, f.project_id);
    const id = crypto.randomUUID();
    await ctx.db
      .prepare(
        "INSERT INTO automations (id, org_id, project_id, name, description, trigger_label, status, minutes_saved_per_run) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      )
      .bind(id, orgId, f.project_id, f.name, f.description, f.trigger_label, f.status, f.minutes_saved_per_run)
      .run();
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}/automations/${id}`);
  });
}

export async function updateAutomation(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "automation_id", "Automation");
    const f = automationFields(formData);
    await projectInOrg(ctx, orgId, f.project_id);
    await ctx.db
      .prepare(
        "UPDATE automations SET project_id = ?, name = ?, description = ?, trigger_label = ?, status = ?, minutes_saved_per_run = ? WHERE id = ? AND org_id = ?",
      )
      .bind(f.project_id, f.name, f.description, f.trigger_label, f.status, f.minutes_saved_per_run, id, orgId)
      .run();
    return done("Automation saved.");
  });
}

export async function deleteAutomation(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "automation_id", "Automation");
    await ctx.db.prepare("DELETE FROM automations WHERE id = ? AND org_id = ?").bind(id, orgId).run();
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}?tab=automations`);
  });
}

export async function logRun(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const automationId = uuid(formData, "automation_id", "Automation");
    const status = oneOf(formData, "status", RUN_STATUSES, "Status");
    const startedAt = optionalDateTime(formData, "started_at", "Start time") ?? new Date().toISOString();
    const durationMs = optionalInt(formData, "duration_ms", { label: "Duration", min: 0, max: 86_400_000 });
    const items = optionalInt(formData, "items_processed", { label: "Items", min: 0, max: 10_000_000 });
    const minutes = optionalInt(formData, "minutes_saved", { label: "Minutes saved", min: 0, max: 100000 });
    const message = optionalText(formData, "message", { label: "Message", max: 2000 });

    const automation = await ctx.db
      .prepare("SELECT minutes_saved_per_run FROM automations WHERE id = ? AND org_id = ?")
      .bind(automationId, orgId)
      .first<{ minutes_saved_per_run: number }>();
    if (!automation) return { ok: false, message: "Automation not found." };

    await ctx.db
      .prepare(
        `INSERT INTO automation_runs (id, automation_id, org_id, status, started_at, duration_ms, items_processed, minutes_saved, message)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        crypto.randomUUID(),
        automationId,
        orgId,
        status,
        startedAt,
        durationMs,
        items,
        minutes ?? (status === "success" ? automation.minutes_saved_per_run : 0),
        message,
      )
      .run();
    return done("Run logged.");
  });
}

// ---------------------------------------------------------------------------
// Files. Uploads go through the /dashboard/files/upload route (R2); links are added here.
// ---------------------------------------------------------------------------
export async function addFileLink(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const name = text(formData, "name", { label: "Name", max: 255 });
    const url = optionalUrl(formData, "url", "Link");
    if (!url) return { ok: false, message: "Link is required." };
    if (!url.startsWith("https://")) return { ok: false, message: "Use an https:// link." };
    const projectId = optionalUuid(formData, "project_id", "Project");
    await projectInOrg(ctx, orgId, projectId);
    await ctx.db
      .prepare("INSERT INTO files (id, org_id, project_id, name, external_url, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), orgId, projectId, name, url, ctx.userId)
      .run();
    return done("Link shared with the client.");
  });
}

export async function deleteFile(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "file_id", "File");
    const file = await ctx.db.prepare("SELECT r2_key FROM files WHERE id = ? AND org_id = ?").bind(id, orgId).first<{ r2_key: string | null }>();
    if (!file) return { ok: false, message: "File not found." };
    if (file.r2_key) {
      const bucket = await getFilesBucket();
      if (bucket) await bucket.delete(file.r2_key);
    }
    await ctx.db.prepare("DELETE FROM files WHERE id = ? AND org_id = ?").bind(id, orgId).run();
    return done("File deleted.");
  });
}

// ---------------------------------------------------------------------------
// Invoices
// ---------------------------------------------------------------------------
export async function createInvoice(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const currency = text(formData, "currency", { label: "Currency", max: 3, min: 3 }).toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) return { ok: false, message: "Currency must be a 3-letter code like USD." };
    const number = text(formData, "number", { label: "Invoice number", max: 40 });
    const issuedOn = optionalDate(formData, "issued_on", "Issue date") ?? new Date().toISOString().slice(0, 10);
    const dueOn = optionalDate(formData, "due_on", "Due date");
    const amount = cents(formData, "amount", "Amount");
    const status = oneOf(formData, "status", INVOICE_STATUSES, "Status");
    const url = optionalUrl(formData, "url", "Invoice link");
    const notes = optionalText(formData, "notes", { label: "Notes", max: 2000 });

    const exists = await ctx.db.prepare("SELECT 1 AS ok FROM invoices WHERE org_id = ? AND number = ?").bind(orgId, number).first();
    if (exists) return { ok: false, message: "That invoice number already exists." };
    await ctx.db
      .prepare(
        `INSERT INTO invoices (id, org_id, number, issued_on, due_on, amount_cents, currency, status, url, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(crypto.randomUUID(), orgId, number, issuedOn, dueOn, amount, currency, status, url, notes)
      .run();
    return done("Invoice added.");
  });
}

export async function setInvoiceStatus(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "invoice_id", "Invoice");
    const status = oneOf(formData, "status", INVOICE_STATUSES, "Status");
    await ctx.db.prepare("UPDATE invoices SET status = ? WHERE id = ? AND org_id = ?").bind(status, id, orgId).run();

    // An invoice that belongs to a pending plan order: paid switches the plan on, void cancels the order.
    const order = await ctx.db
      .prepare("SELECT id, plan FROM plan_orders WHERE invoice_id = ? AND org_id = ? AND status = 'pending'")
      .bind(id, orgId)
      .first<{ id: string; plan: OrgPlan }>();
    if (order && status === "paid") {
      await ctx.db.batch([
        ctx.db.prepare("UPDATE plan_orders SET status = 'paid' WHERE id = ?").bind(order.id),
        ctx.db.prepare("UPDATE organizations SET plan = ?, plan_started_on = ? WHERE id = ?").bind(order.plan, new Date().toISOString().slice(0, 10), orgId),
      ]);
      const label = plans.find((p) => p.key === order.plan)?.name ?? order.plan;
      for (const to of await memberEmails(ctx, orgId)) {
        await sendAccountMail({
          to,
          subject: `Payment received: ${label} is active`,
          greeting: "Hi,",
          lines: [`Thank you. We received your payment and your ${label} plan is now active.`, "Send your first request from the portal and we will get started."],
          button: { label: "Open your portal", href: `${await requestOrigin()}/dashboard` },
          footer: "Questions? Reply to this email.",
        });
      }
      return done(`Invoice paid. ${label} plan is now active and the client was emailed.`);
    }
    if (order && status === "void") {
      await ctx.db.prepare("UPDATE plan_orders SET status = 'cancelled' WHERE id = ?").bind(order.id).run();
      return done("Invoice voided and the plan order cancelled.");
    }
    return done("Invoice updated.");
  });
}

async function memberEmails(ctx: PortalContext, orgId: string): Promise<string[]> {
  const { results } = await ctx.db
    .prepare("SELECT u.email FROM memberships m JOIN users u ON u.id = m.user_id WHERE m.org_id = ?")
    .bind(orgId)
    .all<{ email: string }>();
  return results.map((r) => r.email);
}

/** Adds or changes the payment link on an invoice (e.g. a Payoneer request) and can email it to the client. */
export async function setInvoiceLink(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "invoice_id", "Invoice");
    const url = optionalUrl(formData, "url", "Payment link");
    if (!url) return { ok: false, message: "Paste the payment link first." };
    const invoice = await ctx.db
      .prepare("SELECT number, amount_cents, currency, status FROM invoices WHERE id = ? AND org_id = ?")
      .bind(id, orgId)
      .first<{ number: string; amount_cents: number; currency: string; status: InvoiceStatus }>();
    if (!invoice) return { ok: false, message: "That invoice was not found." };
    await ctx.db
      .prepare("UPDATE invoices SET url = ?, status = CASE WHEN status = 'draft' THEN 'open' ELSE status END WHERE id = ? AND org_id = ?")
      .bind(url, id, orgId)
      .run();

    if (!checkbox(formData, "email_client")) return done("Payment link saved.");
    const amount = new Intl.NumberFormat("en-US", { style: "currency", currency: invoice.currency }).format(invoice.amount_cents / 100);
    const recipients = await memberEmails(ctx, orgId);
    let sent = 0;
    for (const to of recipients) {
      const ok = await sendAccountMail({
        to,
        subject: `Payment link for invoice ${invoice.number} (${amount})`,
        greeting: "Hi,",
        lines: [`Your invoice ${invoice.number} for ${amount} is ready.`, "Use the secure link below to pay by card or bank transfer. It is also on the Billing page of your portal."],
        button: { label: `Pay ${amount}`, href: url },
        footer: "Questions? Reply to this email.",
      });
      if (ok) sent++;
    }
    return done(`Payment link saved and emailed to ${sent} of ${recipients.length} member${recipients.length === 1 ? "" : "s"}.`);
  });
}
