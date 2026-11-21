import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isPortalConfigured } from "@/lib/portal/env";
import { getPortalContext } from "@/lib/portal/access";
import { formatDateTime, formatNumber } from "@/lib/portal/format";
import { getAiConfig } from "@/lib/ai/llm";
import { costUsd, getAssistantSettings } from "@/lib/ai/settings";
import { listAiKeys, listConversations, usageByClient, usageByDay, usageTotals } from "@/lib/ai/usage";
import { PROVIDERS, PROVIDER_INFO } from "@/lib/ai/llm";
import { Badge, EmptyState, Field, KpiTile, PageHeader, Panel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { addAiKey, deleteAiKey, saveAssistantSettings, testAiKey, updateAiKey } from "./actions";

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
  const [cfg, settings, tToday, t7, tMonth, days, clients, convs, keys] = await Promise.all([
    getAiConfig(),
    getAssistantSettings(ctx.db),
    usageTotals(ctx.db, today),
    usageTotals(ctx.db, isoDay(6 * DAY)),
    usageTotals(ctx.db, monthStart),
    usageByDay(ctx.db, isoDay(13 * DAY)),
    usageByClient(ctx.db, isoDay(29 * DAY)),
    listConversations(ctx.db, { limit: PAGE + 1, offset: (page - 1) * PAGE, withBrief }),
    listAiKeys(ctx.db),
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
        title="Moon, the AI assistant"
        description={
          <span className="flex flex-wrap items-center gap-2">
            <Badge tone={live ? "ok" : "neutral"}>{live ? "On for clients" : "Off"}</Badge>
            <span>{cfg ? `Answering with ${cfg.label ?? cfg.provider} · ${cfg.model}` : "No working key yet. Add one under API keys."}</span>
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

      <Panel id="keys" title="API keys" className="mb-6" bodyClassName={null}>
        <p className="border-b border-border px-4 py-3 text-[12.5px] text-muted">
          Moon uses the first working key in this order (lowest number first). If a key fails, is rate limited or the provider is down, it tries
          the next one. Keys are stored encrypted and never shown again; only the last 4 characters are visible.
        </p>
        {keys.length === 0 ? (
          <EmptyState title="No keys yet">Add one below. Groq and Gemini both have free tiers.</EmptyState>
        ) : (
          <ul className="divide-y divide-border">
            {keys.map((k) => (
              <li key={k.id} className="px-4 py-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium">
                      {k.label} <span className="font-mono text-[12px] text-muted">…{k.hint}</span>
                    </p>
                    <p className="text-[12.5px] text-muted">
                      {PROVIDER_INFO[k.provider as keyof typeof PROVIDER_INFO]?.label ?? k.provider} · {k.model}
                      {k.last_checked_at && ` · checked ${formatDateTime(k.last_checked_at)}`}
                    </p>
                    {k.last_status === "failing" && k.last_error && (
                      <p className="mt-1 break-words text-[12px]" style={{ color: "var(--pt-bad)" }}>
                        {k.last_error}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge tone={!k.enabled ? "neutral" : k.last_status === "ok" ? "ok" : k.last_status === "failing" ? "bad" : "info"}>
                      {!k.enabled ? "Off" : k.last_status === "ok" ? "Working" : k.last_status === "failing" ? "Failing" : "Not tested"}
                    </Badge>
                    <ActionForm action={testAiKey} submitLabel="Test" size="sm" variant="default" hasVisibleFields={false} submitAriaLabel={`Test ${k.label}`}>
                      <input type="hidden" name="key_id" value={k.id} />
                    </ActionForm>
                    <ActionForm action={deleteAiKey} submitLabel="Delete" size="sm" variant="ghost" hasVisibleFields={false} confirm={`Delete the key ${k.label}?`} submitAriaLabel={`Delete ${k.label}`}>
                      <input type="hidden" name="key_id" value={k.id} />
                    </ActionForm>
                  </div>
                </div>
                <details className="mt-2">
                  <summary className="cursor-pointer text-[12px] text-muted">Edit model, order, on/off</summary>
                  <ActionForm action={updateAiKey} submitLabel="Save" size="sm" variant="default" inline className="mt-2">
                    <input type="hidden" name="key_id" value={k.id} />
                    <div className="min-w-[14rem] flex-1">
                      <label className="pt-label" htmlFor={`m-${k.id}`}>
                        Model
                      </label>
                      <input id={`m-${k.id}`} name="model" required maxLength={120} defaultValue={k.model} className="pt-input" />
                    </div>
                    <div className="w-24">
                      <label className="pt-label" htmlFor={`p-${k.id}`}>
                        Order
                      </label>
                      <input id={`p-${k.id}`} name="priority" type="number" min={0} max={999} defaultValue={k.priority} className="pt-input" />
                    </div>
                    <label className="flex h-9 items-center gap-2 text-[13px]">
                      <input type="checkbox" name="enabled" defaultChecked={k.enabled} className="h-4 w-4" />
                      On
                    </label>
                  </ActionForm>
                </details>
              </li>
            ))}
          </ul>
        )}
        <div className="border-t border-border p-4">
          <p className="mb-3 text-[13px] font-medium">Add a key</p>
          <ActionForm action={addAiKey} submitLabel="Save and test" pendingLabel="Testing…" resetOnSuccess>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[160px_1fr_1fr_1.4fr_90px]">
              <Field label="Provider" htmlFor="k-provider">
                <select id="k-provider" name="provider" className="pt-select">
                  {PROVIDERS.map((p) => (
                    <option key={p} value={p}>
                      {PROVIDER_INFO[p].label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Name" htmlFor="k-label">
                <input id="k-label" name="label" required maxLength={80} placeholder="e.g. Groq free" className="pt-input" />
              </Field>
              <Field label="Model (blank = default)" htmlFor="k-model">
                <input id="k-model" name="model" maxLength={120} placeholder="openai/gpt-oss-120b" className="pt-input" />
              </Field>
              <Field label="API key" htmlFor="k-key">
                <input id="k-key" name="api_key" type="password" required autoComplete="off" spellCheck={false} className="pt-input font-mono" />
              </Field>
              <Field label="Order" htmlFor="k-priority">
                <input id="k-priority" name="priority" type="number" min={0} max={999} defaultValue={keys.length ? keys[keys.length - 1].priority + 10 : 10} className="pt-input" />
              </Field>
            </div>
            <p className="mt-2 text-[12px] text-muted">
              Defaults: Groq {PROVIDER_INFO.groq.defaultModel}, Gemini {PROVIDER_INFO.gemini.defaultModel}. For OpenAI or OpenRouter, enter the model
              name. Free tiers may use conversations to improve their models; check each provider&apos;s terms before real client chats.
            </p>
          </ActionForm>
        </div>
      </Panel>

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
