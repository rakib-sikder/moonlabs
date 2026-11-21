import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { getPortalContext } from "@/lib/portal/access";
import { formatDateTime, formatNumber } from "@/lib/portal/format";
import { getAiConfig } from "@/lib/ai/llm";
import { costUsd, getAssistantSettings } from "@/lib/ai/settings";
import { listConversations, usageByClient, usageByDay, usageTotals } from "@/lib/ai/usage";
import { Badge, EmptyState, Field, KpiTile, PageHeader, Panel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { saveAssistantSettings } from "./actions";

export const metadata: Metadata = { title: "AI assistant" };

const PAGE = 50;
const isoDay = (msAgo: number) => new Date(Date.now() - msAgo).toISOString().slice(0, 10);
const DAY = 86400000;

export default async function AssistantAdminPage({ searchParams }: { searchParams: Promise<{ page?: string; briefs?: string }> }) {
  if (!(await isPortalConfigured())) return null;
  const ctx = await getPortalContext();
  if (!ctx.isStaff) redirect("/dashboard");
  const { page: pageParam, briefs } = await searchParams;
  const page = Math.max(1, Math.floor(Number(pageParam) || 1));
  const withBrief = briefs === "1";

  const today = isoDay(0);
  const monthStart = `${today.slice(0, 7)}-01`;
  const [cfg, settings, tToday, t7, tMonth, days, clients, convs] = await Promise.all([
    getAiConfig(),
    getAssistantSettings(ctx.db),
    usageTotals(ctx.db, today),
    usageTotals(ctx.db, isoDay(6 * DAY)),
    usageTotals(ctx.db, monthStart),
    usageByDay(ctx.db, isoDay(13 * DAY)),
    usageByClient(ctx.db, isoDay(29 * DAY)),
    listConversations(ctx.db, { limit: PAGE + 1, offset: (page - 1) * PAGE, withBrief }),
  ]);
  const more = convs.length > PAGE;
  const rows = convs.slice(0, PAGE);

  const tokens = (t: { input: number; output: number }) => formatNumber(t.input + t.output);
  const money = (input: number, output: number) => {
    const c = costUsd(settings, input, output);
    return c === null ? null : `$${c.toFixed(c < 1 ? 3 : 2)}`;
  };
  const budgetUsed = settings.monthlyTokenBudget ? (tMonth.input + tMonth.output) / settings.monthlyTokenBudget : null;
  const live = Boolean(cfg) && settings.enabled;

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/admin", label: "Admin" }}
        title="AI assistant"
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone={live ? "ok" : "neutral"}>{live ? "On for clients" : "Off"}</Badge>
            <span>{cfg ? `${cfg.provider} · ${cfg.model}` : "No model configured (set GEMINI_API_KEY)"}</span>
          </span>
        }
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiTile label="Messages today" value={formatNumber(tToday.turns)} sub={`${tToday.people} ${tToday.people === 1 ? "person" : "people"} · ${tokens(tToday)} tokens`} />
        <KpiTile label="Messages, last 7 days" value={formatNumber(t7.turns)} sub={`${t7.people} ${t7.people === 1 ? "person" : "people"} · ${tokens(t7)} tokens`} />
        <KpiTile
          label="Tokens this month"
          value={tokens(tMonth)}
          sub={
            budgetUsed === null ? (
              "No monthly cap"
            ) : (
              <span style={{ color: budgetUsed >= 0.9 ? "var(--pt-bad)" : undefined }}>
                {Math.round(budgetUsed * 100)}% of {formatNumber(settings.monthlyTokenBudget)}
              </span>
            )
          }
        />
        <KpiTile label="Cost this month" value={money(tMonth.input, tMonth.output) ?? "$0"} sub={money(tMonth.input, tMonth.output) ? "Estimate from your token prices" : "Free tier, or prices not set"} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Panel title="Settings">
          <ActionForm action={saveAssistantSettings} submitLabel="Save settings">
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-[13.5px]">
                <input type="checkbox" name="enabled" defaultChecked={settings.enabled} className="h-4 w-4" />
                Assistant is on for clients
              </label>
              <Field label="Messages per person per day" htmlFor="s-daily">
                <input id="s-daily" name="daily_limit" type="number" min={1} max={1000} defaultValue={settings.dailyLimit} className="pt-input" />
              </Field>
              <Field label="Monthly token cap (0 = none)" htmlFor="s-budget" hint="When everyone together passes this, the assistant pauses until next month.">
                <input id="s-budget" name="monthly_token_budget" type="number" min={0} step={1000} defaultValue={settings.monthlyTokenBudget} className="pt-input" />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="USD per 1M input tokens" htmlFor="s-pin">
                  <input id="s-pin" name="price_in_per_m" type="number" min={0} step="0.01" defaultValue={settings.priceInPerM} className="pt-input" />
                </Field>
                <Field label="USD per 1M output tokens" htmlFor="s-pout">
                  <input id="s-pout" name="price_out_per_m" type="number" min={0} step="0.01" defaultValue={settings.priceOutPerM} className="pt-input" />
                </Field>
              </div>
              <p className="text-[12px] text-muted">Leave prices at 0 on the free tier. Take them from your provider&apos;s price page when you switch to a paid key.</p>
            </div>
          </ActionForm>
        </Panel>

        <Panel title="Last 14 days" className="lg:col-span-2" bodyClassName={null}>
          {days.length === 0 ? (
            <EmptyState title="No usage yet" />
          ) : (
            <div className="pt-table-wrap">
              <table className="pt-table">
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col" className="text-right">Messages</th>
                    <th scope="col" className="text-right">Input tokens</th>
                    <th scope="col" className="text-right">Output tokens</th>
                    <th scope="col" className="text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {days.map((d) => (
                    <tr key={d.day}>
                      <td>{d.day}</td>
                      <td className="text-right tabular-nums">{formatNumber(d.turns)}</td>
                      <td className="text-right tabular-nums">{formatNumber(d.input)}</td>
                      <td className="text-right tabular-nums">{formatNumber(d.output)}</td>
                      <td className="text-right tabular-nums">{money(d.input, d.output) ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>

      {clients.length > 0 && (
        <Panel title="Who used it most, last 30 days" className="mb-6" bodyClassName={null}>
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Person</th>
                  <th scope="col">Organization</th>
                  <th scope="col" className="text-right">Messages</th>
                  <th scope="col" className="text-right">Tokens</th>
                  <th scope="col" className="text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((c) => (
                  <tr key={c.email}>
                    <td>
                      <p className="font-medium">{c.name ?? c.email}</p>
                      {c.name && <p className="text-[12px] text-muted">{c.email}</p>}
                    </td>
                    <td>{c.org ?? "-"}</td>
                    <td className="text-right tabular-nums">{formatNumber(c.turns)}</td>
                    <td className="text-right tabular-nums">{formatNumber(c.input + c.output)}</td>
                    <td className="text-right tabular-nums">{money(c.input, c.output) ?? "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Panel
        title="Conversations"
        actions={
          <Link href={withBrief ? "/dashboard/admin/assistant" : "/dashboard/admin/assistant?briefs=1"} className="text-[12.5px] text-accent">
            {withBrief ? "Show all" : "Only those that sent a brief"}
          </Link>
        }
        bodyClassName={null}
      >
        {rows.length === 0 ? (
          <EmptyState title="No conversations yet">Every chat a client has with the assistant appears here.</EmptyState>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((c) => (
              <li key={c.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <Link href={`/dashboard/admin/assistant/${c.id}`} className="pt-row-link">
                    {c.first_message ? (c.first_message.length > 110 ? `${c.first_message.slice(0, 110)}…` : c.first_message) : "(no message)"}
                  </Link>
                  <p className="text-[12.5px] text-muted">
                    {c.user_name ?? c.user_email} · {c.org_name ?? "no workspace"} · {formatDateTime(c.updated_at)} · {c.turns} messages ·{" "}
                    {formatNumber(c.input_tokens + c.output_tokens)} tokens
                  </p>
                </div>
                {c.brief_id ? (
                  <Badge tone="ok">Brief sent</Badge>
                ) : c.has_draft ? (
                  <Badge tone="warn">Brief drafted, not sent</Badge>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        {(page > 1 || more) && (
          <div className="flex justify-between border-t border-border px-4 py-3 text-[13px]">
            {page > 1 ? (
              <Link href={`/dashboard/admin/assistant?page=${page - 1}${withBrief ? "&briefs=1" : ""}`} className="pt-link">
                ← Newer
              </Link>
            ) : (
              <span />
            )}
            {more && (
              <Link href={`/dashboard/admin/assistant?page=${page + 1}${withBrief ? "&briefs=1" : ""}`} className="pt-link">
                Older →
              </Link>
            )}
          </div>
        )}
      </Panel>
    </>
  );
}
