"use server";

// Staff-only mutations. Each action re-checks that the caller administers the organization
// (agency staff or a membership with role 'admin'); row-level security enforces the same
// rule in the database, so a forged request cannot reach another client's data.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPortalContext, type PortalContext } from "@/lib/supabase/session";
import { DELIVERABLES_BUCKET } from "@/lib/supabase/config";
import { dbFailure, guarded } from "@/lib/portal/action-utils";
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
import { STAGES } from "@/lib/portal/format";
import type {
  ActionState,
  AutomationStatus,
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
  const org = ctx.orgs.find((o) => o.id === orgId);
  if (!org || !(ctx.isStaff || org.role === "admin")) throw new ValidationError("You are not an admin of this organization.");
  return { ctx, orgId };
}

function done(message: string): ActionState {
  revalidatePath("/dashboard", "layout");
  return { ok: true, message };
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
    if (!ctx.isStaff) return { ok: false, message: "Only Moonlabs staff can create organizations." };

    const { data, error } = await ctx.supabase
      .from("organizations")
      .insert({ name, plan, plan_started_on: planStarted })
      .select("id")
      .single();
    if (error || !data) return dbFailure(error, "Could not create the organization.");
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${data.id}`);
  });
}

export async function updateOrganization(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const name = text(formData, "name", { label: "Name", max: 120 });
    const plan = oneOf(formData, "plan", PLANS, "Plan");
    const planStarted = optionalDate(formData, "plan_started_on", "Plan start");
    const { error } = await ctx.supabase.from("organizations").update({ name, plan, plan_started_on: planStarted }).eq("id", orgId);
    if (error) return dbFailure(error, "Could not save the organization.");
    return done("Organization saved.");
  });
}

export async function inviteMember(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const address = readEmail(formData, "email");
    const role = oneOf(formData, "role", ROLES, "Role");
    const { error } = await ctx.supabase
      .from("invites")
      .upsert({ org_id: orgId, email: address, role, invited_by: ctx.userId, accepted_at: null }, { onConflict: "org_id,email" });
    if (error) return dbFailure(error, "Could not save the invite.");
    return done(`Invite saved. Ask ${address} to sign in at /login with this email; they join automatically.`);
  });
}

export async function revokeInvite(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "invite_id", "Invite");
    const { error } = await ctx.supabase.from("invites").delete().eq("id", id).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not revoke the invite.");
    return done("Invite revoked.");
  });
}

export async function updateMemberRole(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const userId = uuid(formData, "user_id", "Member");
    const role = oneOf(formData, "role", ROLES, "Role");
    const { error } = await ctx.supabase.from("memberships").update({ role }).eq("org_id", orgId).eq("user_id", userId);
    if (error) return dbFailure(error, "Could not change the role.");
    return done("Role updated.");
  });
}

export async function removeMember(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const userId = uuid(formData, "user_id", "Member");
    if (userId === ctx.userId) return { ok: false, message: "You cannot remove yourself." };
    const { error } = await ctx.supabase.from("memberships").delete().eq("org_id", orgId).eq("user_id", userId);
    if (error) return dbFailure(error, "Could not remove the member.");
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
    const fields = projectFields(formData);
    const { data, error } = await ctx.supabase.from("projects").insert({ org_id: orgId, ...fields }).select("id").single();
    if (error || !data) return dbFailure(error, "Could not create the project.");

    const stages = STAGES.map((stage, i) => ({
      project_id: data.id,
      org_id: orgId,
      stage,
      status: i === 0 && fields.status === "active" ? "active" : "pending",
      started_on: i === 0 && fields.status === "active" ? fields.started_on : null,
    }));
    const { error: stageError } = await ctx.supabase.from("project_stages").insert(stages);
    if (stageError) return dbFailure(stageError, "Project created, but its stages could not be added.");
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}/projects/${data.id}`);
  });
}

export async function updateProject(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const { error } = await ctx.supabase.from("projects").update(projectFields(formData)).eq("id", projectId).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not save the project.");
    return done("Project saved.");
  });
}

export async function deleteProject(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const { error } = await ctx.supabase.from("projects").delete().eq("id", projectId).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not delete the project.");
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}?tab=projects`);
  });
}

export async function updateStage(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const stage = oneOf<StageKey>(formData, "stage", STAGES, "Stage");
    const row = {
      project_id: projectId,
      org_id: orgId,
      stage,
      status: oneOf(formData, "status", STAGE_STATUSES, "Status"),
      started_on: optionalDate(formData, "started_on", "Start date"),
      due_on: optionalDate(formData, "due_on", "Due date"),
      completed_on: optionalDate(formData, "completed_on", "Completed date"),
      notes: optionalText(formData, "notes", { label: "Notes", max: 1000 }),
    };
    // Upsert so projects created outside the portal (missing stage rows) still work.
    const { error } = await ctx.supabase.from("project_stages").upsert(row, { onConflict: "project_id,stage" });
    if (error) return dbFailure(error, "Could not save the stage.");
    return done("Stage saved.");
  });
}

export async function addMilestone(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const projectId = uuid(formData, "project_id", "Project");
    const stageRaw = formData.get("stage");
    const stage = stageRaw ? oneOf<StageKey>(formData, "stage", STAGES, "Stage") : null;
    const { error } = await ctx.supabase.from("project_milestones").insert({
      project_id: projectId,
      org_id: orgId,
      title: text(formData, "title", { label: "Title", max: 200 }),
      stage,
      due_on: optionalDate(formData, "due_on", "Due date"),
      position: int(formData, "position", { label: "Order", min: 0, max: 10000, fallback: 0 }),
    });
    if (error) return dbFailure(error, "Could not add the milestone.");
    return done("Milestone added.");
  });
}

export async function setMilestoneDone(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "milestone_id", "Milestone");
    const { error } = await ctx.supabase
      .from("project_milestones")
      .update({ done: checkbox(formData, "done") })
      .eq("id", id)
      .eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not update the milestone.");
    return done("Milestone updated.");
  });
}

export async function deleteMilestone(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "milestone_id", "Milestone");
    const { error } = await ctx.supabase.from("project_milestones").delete().eq("id", id).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not delete the milestone.");
    return done("Milestone deleted.");
  });
}

export async function postUpdate(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const { error } = await ctx.supabase.from("project_updates").insert({
      project_id: uuid(formData, "project_id", "Project"),
      org_id: orgId,
      author_id: ctx.userId,
      title: text(formData, "title", { label: "Title", max: 200 }),
      body: optionalText(formData, "body", { label: "Body", max: 10000 }),
    });
    if (error) return dbFailure(error, "Could not post the update.");
    return done("Update posted.");
  });
}

export async function deleteUpdate(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "update_id", "Update");
    const { error } = await ctx.supabase.from("project_updates").delete().eq("id", id).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not delete the update.");
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
    const { data, error } = await ctx.supabase
      .from("automations")
      .insert({ org_id: orgId, ...automationFields(formData) })
      .select("id")
      .single();
    if (error || !data) return dbFailure(error, "Could not create the automation.");
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}/automations/${data.id}`);
  });
}

export async function updateAutomation(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "automation_id", "Automation");
    const { error } = await ctx.supabase.from("automations").update(automationFields(formData)).eq("id", id).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not save the automation.");
    return done("Automation saved.");
  });
}

export async function deleteAutomation(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "automation_id", "Automation");
    const { error } = await ctx.supabase.from("automations").delete().eq("id", id).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not delete the automation.");
    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/admin/${orgId}?tab=automations`);
  });
}

export async function logRun(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const automationId = uuid(formData, "automation_id", "Automation");
    const status = oneOf(formData, "status", RUN_STATUSES, "Status");
    const { data: automation } = await ctx.supabase
      .from("automations")
      .select("minutes_saved_per_run")
      .eq("id", automationId)
      .eq("org_id", orgId)
      .maybeSingle();
    if (!automation) return { ok: false, message: "Automation not found." };

    const minutes = optionalInt(formData, "minutes_saved", { label: "Minutes saved", min: 0, max: 100000 });
    const { error } = await ctx.supabase.from("automation_runs").insert({
      automation_id: automationId,
      org_id: orgId,
      status,
      started_at: optionalDateTime(formData, "started_at", "Start time") ?? new Date().toISOString(),
      duration_ms: optionalInt(formData, "duration_ms", { label: "Duration", min: 0, max: 86_400_000 }),
      items_processed: optionalInt(formData, "items_processed", { label: "Items", min: 0, max: 10_000_000 }),
      minutes_saved: minutes ?? (status === "success" ? (automation.minutes_saved_per_run as number) : 0),
      message: optionalText(formData, "message", { label: "Message", max: 2000 }),
    });
    if (error) return dbFailure(error, "Could not log the run.");
    return done("Run logged.");
  });
}

// ---------------------------------------------------------------------------
// Files (bytes are uploaded from the browser straight to Storage; this records them)
// ---------------------------------------------------------------------------
export async function registerFile(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const storagePath = text(formData, "storage_path", { label: "Storage path", max: 600 });
    if (!storagePath.startsWith(`${orgId}/`) || storagePath.includes("..")) {
      return { ok: false, message: "Invalid storage path." };
    }
    const { error } = await ctx.supabase.from("files").insert({
      org_id: orgId,
      project_id: optionalUuid(formData, "project_id", "Project"),
      name: text(formData, "name", { label: "File name", max: 255 }),
      storage_path: storagePath,
      size_bytes: optionalInt(formData, "size_bytes", { label: "Size", min: 0, max: Number.MAX_SAFE_INTEGER }),
      content_type: optionalText(formData, "content_type", { label: "Type", max: 200 }),
      uploaded_by: ctx.userId,
    });
    if (error) {
      // Do not leave an orphaned object behind.
      await ctx.supabase.storage.from(DELIVERABLES_BUCKET).remove([storagePath]);
      return dbFailure(error, "Could not save the file record.");
    }
    return done("File shared with the client.");
  });
}

export async function deleteFile(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "file_id", "File");
    const { data: file } = await ctx.supabase.from("files").select("storage_path").eq("id", id).eq("org_id", orgId).maybeSingle();
    if (!file) return { ok: false, message: "File not found." };
    const { error: storageError } = await ctx.supabase.storage.from(DELIVERABLES_BUCKET).remove([file.storage_path as string]);
    if (storageError) return dbFailure(null, "Could not delete the stored file.");
    const { error } = await ctx.supabase.from("files").delete().eq("id", id).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not delete the file record.");
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
    const { error } = await ctx.supabase.from("invoices").insert({
      org_id: orgId,
      number: text(formData, "number", { label: "Invoice number", max: 40 }),
      issued_on: optionalDate(formData, "issued_on", "Issue date") ?? new Date().toISOString().slice(0, 10),
      due_on: optionalDate(formData, "due_on", "Due date"),
      amount_cents: cents(formData, "amount", "Amount"),
      currency,
      status: oneOf(formData, "status", INVOICE_STATUSES, "Status"),
      url: optionalUrl(formData, "url", "Invoice link"),
      notes: optionalText(formData, "notes", { label: "Notes", max: 2000 }),
    });
    if (error) return dbFailure(error, error.code === "23505" ? "That invoice number already exists." : "Could not add the invoice.");
    return done("Invoice added.");
  });
}

export async function setInvoiceStatus(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const { ctx, orgId } = await adminFor(formData);
    const id = uuid(formData, "invoice_id", "Invoice");
    const status = oneOf(formData, "status", INVOICE_STATUSES, "Status");
    const { error } = await ctx.supabase.from("invoices").update({ status }).eq("id", id).eq("org_id", orgId);
    if (error) return dbFailure(error, "Could not update the invoice.");
    return done("Invoice updated.");
  });
}
