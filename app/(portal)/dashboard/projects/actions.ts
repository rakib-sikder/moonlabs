"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertMember, getPortalContext } from "@/lib/portal/access";
import { requestOrigin } from "@/lib/portal/auth";
import { guarded } from "@/lib/portal/action-utils";
import { optionalDate, optionalText, text, uuid } from "@/lib/portal/validate";
import { alertMail, emailOwner } from "@/lib/notify";
import { sendAccountMail } from "@/lib/portal/mail";
import { formatDate } from "@/lib/portal/format";
import type { ActionState } from "@/lib/portal/types";

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
