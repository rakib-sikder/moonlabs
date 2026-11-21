"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertMember, getPortalContext } from "@/lib/portal/access";
import { requestOrigin } from "@/lib/portal/auth";
import { guarded } from "@/lib/portal/action-utils";
import { oneOf, optionalDate, optionalText, optionalUuid, text, uuid } from "@/lib/portal/validate";
import { getVaultKey, sealSecret } from "@/lib/portal/vault";
import { alertMail, emailOwner } from "@/lib/notify";
import { sendAccountMail } from "@/lib/portal/mail";
import { STAGES, formatDate, gateKindLabel, gateUnlocks, stageLabel } from "@/lib/portal/format";
import type { ActionState, GateKind } from "@/lib/portal/types";

/** Open briefs an organization may have waiting at once, so a loop cannot flood the inbox. */
const MAX_OPEN_BRIEFS = 5;

/**
 * A member describes a new project. The text is stored exactly as written, Moonlab is emailed
 * the whole brief, and the client gets a receipt. Moonlab then starts a project from it or
 * declines it from the admin.
 */
export async function submitBrief(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const title = text(formData, "title", { label: "Project name", min: 3, max: 160 });
    const goal = text(formData, "goal", { label: "What you want built", min: 20, max: 10000 });
    const audience = optionalText(formData, "audience", { label: "Who will use it", max: 4000 });
    const features = optionalText(formData, "features", { label: "Must-have features", max: 10000 });
    const examples = optionalText(formData, "examples", { label: "Examples and links", max: 4000 });
    const budget = optionalText(formData, "budget", { label: "Budget", max: 200 });
    const deadline = optionalDate(formData, "deadline", "Deadline");

    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    const open = await ctx.db
      .prepare("SELECT COUNT(*) AS n FROM project_briefs WHERE org_id = ? AND status = 'submitted'")
      .bind(orgId)
      .first<{ n: number }>();
    if ((open?.n ?? 0) >= MAX_OPEN_BRIEFS) {
      return { ok: false, message: `You already have ${MAX_OPEN_BRIEFS} briefs waiting for review. We will answer those first.` };
    }

    const id = crypto.randomUUID();
    await ctx.db
      .prepare(
        `INSERT INTO project_briefs (id, org_id, created_by, title, goal, audience, features, examples, budget, deadline)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(id, orgId, ctx.userId, title, goal, audience, features, examples, budget, deadline)
      .run();

    const origin = await requestOrigin();
    const org = ctx.orgs.find((o) => o.id === orgId);
    const who = ctx.profile?.full_name || ctx.email || "A client";
    const sections = [
      ["What they want built", goal],
      ["Who will use it", audience],
      ["Must-have features", features],
      ["Examples and links", examples],
    ]
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}:\n${v}`)
      .join("\n\n");
    const mail = alertMail(
      "New project brief",
      [
        ["Project", title],
        ["From", `${who}${ctx.email && who !== ctx.email ? ` (${ctx.email})` : ""}`],
        ["Organization", org?.name ?? "-"],
        ["Budget", budget || "-"],
        ["Deadline", deadline ? formatDate(deadline) : "-"],
      ],
      sections,
      { text: "Start a project from it or decline it in the admin.", href: `${origin}/dashboard/admin/${orgId}/briefs/${id}`, label: "Open the brief" },
    );
    await emailOwner({
      subject: `New project brief: ${title}${org ? ` (${org.name})` : ""}`,
      ...mail,
      ...(ctx.email ? { replyTo: { email: ctx.email, name: who } } : {}),
    });
    if (ctx.email) {
      await sendAccountMail({
        to: ctx.email,
        subject: `We got your brief: ${title}`,
        greeting: ctx.profile?.full_name ? `Hi ${ctx.profile.full_name.split(" ")[0]},` : "Hi,",
        lines: [
          `Thanks for telling us about ${title}.`,
          "We will read it and reply within one business day, either with questions or with a proposed plan.",
        ],
        button: { label: "View your brief", href: `${origin}/dashboard/projects/briefs/${id}` },
        footer: "Want to add something? Open the brief in your portal and send us a request.",
      });
    }

    revalidatePath("/dashboard", "layout");
    redirect(`/dashboard/projects/briefs/${id}`);
  });
}

/**
 * A client member approves a gate or asks for changes (a reason is required). Approving
 * finishes the stage before the unlocked one and starts the unlocked stage. Moonlab staff
 * cannot decide for the client. Moonlab is emailed either way.
 */
export async function decideGate(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const gateId = uuid(formData, "gate_id", "Approval");
    const decision = oneOf(formData, "decision", ["approved", "changes_requested"] as const, "Decision");
    const note =
      decision === "changes_requested"
        ? text(formData, "client_note", { label: "What should change", min: 3, max: 4000 })
        : optionalText(formData, "client_note", { label: "Comment", max: 4000 });

    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    const membership = ctx.orgs.find((o) => o.id === orgId);
    if (ctx.isStaff || membership?.role !== "client") {
      return { ok: false, message: "Only the client can approve or ask for changes." };
    }

    const gate = await ctx.db
      .prepare(
        `SELECT g.project_id, g.kind, g.title, p.name AS project_name FROM project_gates g JOIN projects p ON p.id = g.project_id
          WHERE g.id = ? AND g.org_id = ? AND g.status = 'waiting'`,
      )
      .bind(gateId, orgId)
      .first<{ project_id: string; kind: GateKind; title: string; project_name: string }>();
    if (!gate) return { ok: false, message: "This approval was already answered or withdrawn." };

    const today = new Date().toISOString().slice(0, 10);
    const statements = [
      ctx.db
        .prepare(
          "UPDATE project_gates SET status = ?, client_note = ?, decided_by = ?, decided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND org_id = ? AND status = 'waiting'",
        )
        .bind(decision, note, ctx.userId, gateId, orgId),
    ];
    const unlocked = gateUnlocks[gate.kind];
    if (decision === "approved") {
      const previous = STAGES[STAGES.indexOf(unlocked) - 1];
      statements.push(
        ctx.db
          .prepare("UPDATE project_stages SET status = 'done', completed_on = COALESCE(completed_on, ?) WHERE project_id = ? AND org_id = ? AND stage = ? AND status <> 'done'")
          .bind(today, gate.project_id, orgId, previous),
        ctx.db
          .prepare("UPDATE project_stages SET status = 'active', started_on = COALESCE(started_on, ?) WHERE project_id = ? AND org_id = ? AND stage = ? AND status = 'pending'")
          .bind(today, gate.project_id, orgId, unlocked),
      );
    }
    await ctx.db.batch(statements);

    const origin = await requestOrigin();
    const who = ctx.profile?.full_name || ctx.email || "The client";
    const verdict = decision === "approved" ? "approved" : "asked for changes to";
    const mail = alertMail(
      `${who} ${verdict} the ${gateKindLabel[gate.kind].toLowerCase()}`,
      [
        ["Project", gate.project_name],
        [gateKindLabel[gate.kind], gate.title],
        ["Decision", decision === "approved" ? `Approved. ${stageLabel[unlocked]} has started.` : "Changes requested"],
      ],
      note || "No comment.",
      { text: "Open the project in the admin.", href: `${origin}/dashboard/admin/${orgId}/projects/${gate.project_id}`, label: "Open the project" },
    );
    await emailOwner({
      subject: `${decision === "approved" ? "Approved" : "Changes requested"}: ${gate.title} (${gate.project_name})`,
      ...mail,
      ...(ctx.email ? { replyTo: { email: ctx.email, name: who } } : {}),
    });

    revalidatePath("/dashboard", "layout");
    // The answered item leaves the list, so the confirmation is shown by the page instead.
    redirect(`/dashboard/projects/${gate.project_id}?decided=${decision === "approved" ? gate.kind : "changes"}`);
  });
}

/**
 * A member saves a secret: fills a requested item (or replaces its value), or adds a new item.
 * The value is encrypted before it reaches the database and is never shown back to the client.
 * Moonlab is emailed the item name only.
 */
export async function provideSecret(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const projectId = uuid(formData, "project_id", "Project");
    const secretId = optionalUuid(formData, "secret_id", "Item");
    const value = String(formData.get("value") ?? "");
    if (!value.trim()) return { ok: false, message: "Paste the value first." };
    if (value.length > 10000) return { ok: false, message: "That value is too long (10,000 characters at most)." };

    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    const key = await getVaultKey();
    if (!key) return { ok: false, message: "Secure storage is not available right now. Please try again later." };
    const project = await ctx.db
      .prepare("SELECT name, status FROM projects WHERE id = ? AND org_id = ?")
      .bind(projectId, orgId)
      .first<{ name: string; status: string }>();
    if (!project) return { ok: false, message: "That project was not found." };
    if (project.status === "completed" || project.status === "cancelled") return { ok: false, message: "This project has ended, so nothing new can be stored." };

    let id: string;
    let label: string;
    if (secretId) {
      const row = await ctx.db
        .prepare("SELECT label FROM project_secrets WHERE id = ? AND project_id = ? AND org_id = ?")
        .bind(secretId, projectId, orgId)
        .first<{ label: string }>();
      if (!row) return { ok: false, message: "That item was not found." };
      id = secretId;
      label = String(row.label);
    } else {
      id = crypto.randomUUID();
      label = text(formData, "label", { label: "Name", min: 2, max: 120 });
      await ctx.db
        .prepare("INSERT INTO project_secrets (id, project_id, org_id, label) VALUES (?, ?, ?, ?)")
        .bind(id, projectId, orgId, label)
        .run();
    }
    const sealed = await sealSecret(key, id, value);
    await ctx.db
      .prepare(
        `UPDATE project_secrets SET status = 'provided', ciphertext = ?, iv = ?, provided_by = ?,
                provided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND org_id = ?`,
      )
      .bind(sealed.ciphertext, sealed.iv, ctx.userId, id, orgId)
      .run();

    if (!ctx.isStaff) {
      const origin = await requestOrigin();
      const who = ctx.profile?.full_name || ctx.email || "The client";
      const mail = alertMail(
        "A client saved a secret",
        [
          ["Project", project.name],
          ["Item", label],
          ["By", who],
        ],
        "The value is encrypted in the portal. Open the project to reveal it.",
        { text: "Every reveal is logged on the item.", href: `${origin}/dashboard/admin/${orgId}/projects/${projectId}#access`, label: "Open the project" },
      );
      await emailOwner({ subject: `Secret saved: ${label} (${project.name})`, ...mail });
    }
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: `${label} saved securely.` };
  });
}

/**
 * Removes a saved value. An item Moonlab asked for goes back to "needed"; an item the client
 * added is deleted.
 */
export async function removeSecret(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const secretId = uuid(formData, "secret_id", "Item");
    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    await ctx.db.batch([
      ctx.db.prepare("DELETE FROM project_secrets WHERE id = ? AND org_id = ? AND requested_by IS NULL").bind(secretId, orgId),
      ctx.db
        .prepare(
          "UPDATE project_secrets SET status = 'requested', ciphertext = NULL, iv = NULL, provided_by = NULL, provided_at = NULL WHERE id = ? AND org_id = ? AND requested_by IS NOT NULL",
        )
        .bind(secretId, orgId),
    ]);
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Removed." };
  });
}

/** Withdraws a brief that Moonlab has not answered yet. */
export async function withdrawBrief(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const briefId = uuid(formData, "brief_id", "Brief");
    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    const res = await ctx.db
      .prepare("UPDATE project_briefs SET status = 'withdrawn', decided_by = ?, decided_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = ? AND org_id = ? AND status = 'submitted'")
      .bind(ctx.userId, briefId, orgId)
      .run();
    if (!res.meta.changes) return { ok: false, message: "This brief can no longer be withdrawn." };
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Brief withdrawn." };
  });
}
