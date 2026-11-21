// Creating a project brief, shared by the "Start a new project" form and the AI assistant.
// Not a "use server" file.

import type { PortalContext } from "./access";
import { requestOrigin } from "./auth";
import { formatDate } from "./format";
import { sendAccountMail } from "./mail";
import { alertMail, emailOwner } from "@/lib/notify";

/** Open briefs an organization may have waiting at once, so a loop cannot flood the inbox. */
export const MAX_OPEN_BRIEFS = 5;

export type BriefFields = {
  title: string;
  goal: string;
  audience: string | null;
  features: string | null;
  examples: string | null;
  budget: string | null;
  deadline: string | null;
};

/** Inserts the brief, emails Moonlab the whole brief and the client a receipt. Returns the id, or an error message. */
export async function createBrief(
  ctx: PortalContext,
  orgId: string,
  f: BriefFields,
  opts: { source: "form" | "assistant"; estimate?: string | null } = { source: "form" },
): Promise<{ id: string } | { error: string }> {
  const open = await ctx.db
    .prepare("SELECT COUNT(*) AS n FROM project_briefs WHERE org_id = ? AND status = 'submitted'")
    .bind(orgId)
    .first<{ n: number }>();
  if ((open?.n ?? 0) >= MAX_OPEN_BRIEFS) {
    return { error: `You already have ${MAX_OPEN_BRIEFS} briefs waiting for review. We will answer those first.` };
  }

  const id = crypto.randomUUID();
  const estimate = opts.estimate?.trim() || null;
  await ctx.db
    .prepare(
      `INSERT INTO project_briefs (id, org_id, created_by, title, goal, audience, features, examples, budget, deadline, source, estimate)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(id, orgId, ctx.userId, f.title, f.goal, f.audience, f.features, f.examples, f.budget, f.deadline, opts.source, estimate)
    .run();

  const origin = await requestOrigin();
  const org = ctx.orgs.find((o) => o.id === orgId);
  const who = ctx.profile?.full_name || ctx.email || "A client";
  const sections = [
    ["What they want built", f.goal],
    ["Who will use it", f.audience],
    ["Must-have features", f.features],
    ["Examples and links", f.examples],
  ]
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}:\n${v}`)
    .join("\n\n");
  const mail = alertMail(
    opts.source === "assistant" ? "New project brief (from the AI assistant)" : "New project brief",
    [
      ["Project", f.title],
      ["From", `${who}${ctx.email && who !== ctx.email ? ` (${ctx.email})` : ""}`],
      ["Organization", org?.name ?? "-"],
      ["Budget", f.budget || "-"],
      ["Deadline", f.deadline ? formatDate(f.deadline) : "-"],
      ...(estimate ? ([["Estimate shown to the client", estimate]] as [string, string][]) : []),
    ],
    sections,
    { text: "Start a project from it or decline it in the admin.", href: `${origin}/dashboard/admin/${orgId}/briefs/${id}`, label: "Open the brief" },
  );
  await emailOwner({
    subject: `New project brief: ${f.title}${org ? ` (${org.name})` : ""}`,
    ...mail,
    ...(ctx.email ? { replyTo: { email: ctx.email, name: who } } : {}),
  });
  if (ctx.email) {
    await sendAccountMail({
      to: ctx.email,
      subject: `We got your brief: ${f.title}`,
      greeting: ctx.profile?.full_name ? `Hi ${ctx.profile.full_name.split(" ")[0]},` : "Hi,",
      lines: [
        `Thanks for telling us about ${f.title}.`,
        "We will read it and reply within one business day, either with questions or with a proposed plan and a fixed price.",
      ],
      button: { label: "View your brief", href: `${origin}/dashboard/projects/briefs/${id}` },
      footer: "Want to add something? Open the brief in your portal and send us a request.",
    });
  }
  return { id };
}
