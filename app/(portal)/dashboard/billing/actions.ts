"use server";

import { revalidatePath } from "next/cache";
import { assertMember, getPortalContext } from "@/lib/portal/access";
import { requestOrigin } from "@/lib/portal/auth";
import { guarded } from "@/lib/portal/action-utils";
import { oneOf, uuid } from "@/lib/portal/validate";
import { plans } from "@/lib/content/company";
import { emailOwner } from "@/lib/notify";
import { sendAccountMail } from "@/lib/portal/mail";
import { discounted, getLiveOffer, offerApplies } from "@/lib/portal/offers";
import type { ActionState } from "@/lib/portal/types";

const PLAN_KEYS = plans.map((p) => p.key);
const DUE_DAYS = 7;

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/**
 * A member of an organization orders a plan. Creates an open invoice for the first payment and
 * a pending plan order, then emails Moonlab (to add the payment link) and the client (receipt
 * of the order). One pending order per organization at a time.
 */
export async function orderPlan(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    const key = oneOf(formData, "plan", PLAN_KEYS, "Plan");
    const plan = plans.find((p) => p.key === key)!;
    const org = ctx.orgs.find((o) => o.id === orgId);

    const pending = await ctx.db
      .prepare("SELECT plan FROM plan_orders WHERE org_id = ? AND status = 'pending'")
      .bind(orgId)
      .first<{ plan: string }>();
    if (pending) return { ok: false, message: "You already have a plan order waiting for payment. Cancel it first to choose a different plan." };
    if (org?.plan === key) return { ok: false, message: `You are already on ${plan.name}.` };

    const offer = await getLiveOffer(ctx.db);
    const applied = offerApplies(offer, key) ? offer : null;
    const amount = discounted(plan.amountCents, applied, key);
    const offerNote = applied ? ` ${applied.name}: ${applied.discount_percent}% off this first payment.` : "";
    const today = new Date();
    const issuedOn = today.toISOString().slice(0, 10);
    const dueOn = new Date(today.getTime() + DUE_DAYS * 86400000).toISOString().slice(0, 10);
    const number = `ML-${issuedOn.replace(/-/g, "").slice(2)}-${crypto.randomUUID().slice(0, 4).toUpperCase()}`;
    const invoiceId = crypto.randomUUID();
    const first = plan.unit.includes("month") ? "first month" : "one-time";
    await ctx.db.batch([
      ctx.db
        .prepare(
          `INSERT INTO invoices (id, org_id, number, issued_on, due_on, amount_cents, currency, status, url, notes)
           VALUES (?, ?, ?, ?, ?, ?, 'USD', 'open', NULL, ?)`,
        )
        .bind(invoiceId, orgId, number, issuedOn, dueOn, amount, `${plan.name} plan (${first}).${offerNote} A secure payment link will be added here and emailed to you.`),
      ctx.db
        .prepare("INSERT INTO plan_orders (id, org_id, plan, invoice_id, created_by, offer_id, discount_percent) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .bind(crypto.randomUUID(), orgId, key, invoiceId, ctx.userId, applied?.id ?? null, applied?.discount_percent ?? null),
    ]);

    const origin = await requestOrigin();
    const who = ctx.email ?? "a client";
    const orgName = org?.name ?? "their workspace";
    await emailOwner({
      subject: `New plan order: ${plan.name} for ${orgName}`,
      text: `${who} ordered ${plan.name} (${plan.price} ${plan.unit}) for ${orgName}.${offerNote}\nInvoice ${number} is open for $${(amount / 100).toFixed(2)}.\n\nNext: create a Payoneer payment request for $${(amount / 100).toFixed(2)}, then paste the link on the invoice:\n${origin}/dashboard/admin/${orgId}?tab=invoices`,
      html: `<div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.5"><p><b>${esc(who)}</b> ordered <b>${esc(plan.name)}</b> (${esc(plan.price)} ${esc(plan.unit)}) for <b>${esc(orgName)}</b>.</p><p>Invoice ${esc(number)} is open for <b>$${(amount / 100).toFixed(2)}</b>.${esc(offerNote)}</p><p>Next: create a Payoneer payment request for that amount, then paste the link on the invoice.</p><p><a href="${origin}/dashboard/admin/${orgId}?tab=invoices">Open the invoice in the admin</a></p></div>`,
      ...(ctx.email ? { replyTo: { email: ctx.email, name: ctx.profile?.full_name ?? ctx.email } } : {}),
    });
    if (ctx.email) {
      await sendAccountMail({
        to: ctx.email,
        subject: `Your ${plan.name} order (${number})`,
        greeting: ctx.profile?.full_name ? `Hi ${ctx.profile.full_name.split(" ")[0]},` : "Hi,",
        lines: [
          `Thanks for choosing ${plan.name} (${plan.price} ${plan.unit}).${offerNote}`,
          "We will send you a secure payment link within one business day. You can pay by card or bank transfer. The plan starts as soon as the payment arrives.",
        ],
        button: { label: "View billing", href: `${origin}/dashboard/billing` },
        footer: "Questions? Reply to this email or open a request in your portal.",
      });
    }

    revalidatePath("/dashboard", "layout");
    return { ok: true, message: `${plan.name} ordered. Invoice ${number} is open, and we will email you a payment link within one business day.` };
  });
}

/** Cancels this organization's pending plan order and voids its unpaid invoice. */
export async function cancelPlanOrder(formData: FormData): Promise<ActionState> {
  return guarded(async () => {
    const orgId = uuid(formData, "org_id", "Organization");
    const ctx = await getPortalContext();
    assertMember(ctx, orgId);
    const order = await ctx.db
      .prepare("SELECT id, invoice_id FROM plan_orders WHERE org_id = ? AND status = 'pending'")
      .bind(orgId)
      .first<{ id: string; invoice_id: string | null }>();
    if (!order) return { ok: false, message: "There is no pending order to cancel." };
    await ctx.db.batch([
      ctx.db.prepare("UPDATE plan_orders SET status = 'cancelled' WHERE id = ? AND status = 'pending'").bind(order.id),
      ctx.db.prepare("UPDATE invoices SET status = 'void' WHERE id = ? AND org_id = ? AND status IN ('open', 'overdue', 'draft')").bind(order.invoice_id, orgId),
    ]);
    revalidatePath("/dashboard", "layout");
    return { ok: true, message: "Order cancelled." };
  });
}
