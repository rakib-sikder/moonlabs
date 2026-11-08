import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isPortalConfigured } from "@/lib/supabase/config";
import { requireOrgAdmin } from "@/lib/supabase/session";
import {
  listAutomations,
  listFiles,
  listInvoices,
  listMembers,
  listProjectOptions,
  listProjects,
  listRequests,
  requestNow,
} from "@/lib/supabase/queries";
import { isUuid } from "@/lib/portal/validate";
import {
  automationStatusLabel,
  automationTone,
  formatBytes,
  formatDate,
  formatMoney,
  formatPercent,
  formatRelative,
  formatShortDate,
  invoiceStatusLabel,
  personName,
  planLabel,
  priorityTone,
  projectStatusLabel,
  projectTone,
  requestPriorityLabel,
  requestStatusLabel,
  requestTone,
} from "@/lib/portal/format";
import type { AutomationStatus, InvoiceStatus, OrgPlan, ProjectStatus } from "@/lib/portal/types";
import type { OrgAccess, PortalContext } from "@/lib/supabase/session";
import { Badge, EmptyState, Field, PageHeader, Panel, currentStageLabel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { FileUploader } from "../../../_components/file-uploader";
import {
  createAutomation,
  createInvoice,
  createProject,
  deleteFile,
  inviteMember,
  registerFile,
  removeMember,
  revokeInvite,
  setInvoiceStatus,
  updateMemberRole,
  updateOrganization,
} from "../actions";

export const metadata: Metadata = { title: "Manage organization" };

const TABS = [
  { key: "settings", label: "Settings & people" },
  { key: "projects", label: "Projects" },
  { key: "automations", label: "Automations" },
  { key: "requests", label: "Requests" },
  { key: "files", label: "Files" },
  { key: "invoices", label: "Invoices" },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const PLANS: OrgPlan[] = ["none", "crescent", "half_moon", "full_moon", "custom"];
const PROJECT_STATUSES: ProjectStatus[] = ["active", "on_hold", "completed", "cancelled"];
const AUTOMATION_STATUSES: AutomationStatus[] = ["healthy", "warning", "failing", "paused"];
const INVOICE_STATUSES: InvoiceStatus[] = ["draft", "open", "paid", "overdue", "void"];

type TabProps = { ctx: PortalContext; org: OrgAccess };

export default async function AdminOrgPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgId: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const [{ orgId }, { tab: tabParam }] = await Promise.all([params, searchParams]);
  if (!isPortalConfigured()) return null;
  if (!isUuid(orgId)) notFound();
  const { ctx, org } = await requireOrgAdmin(orgId);
  const tab: TabKey = TABS.some((t) => t.key === tabParam) ? (tabParam as TabKey) : "settings";

  return (
    <>
      <PageHeader back={{ href: "/dashboard/admin", label: "Admin" }} title={org.name} description={`${planLabel[org.plan]} · Organization ID ${org.id}`} />

      <nav aria-label="Admin sections" className="-mx-4 mb-6 overflow-x-auto border-b border-border px-4 sm:mx-0 sm:px-0">
        <ul className="flex gap-1">
          {TABS.map((t) => (
            <li key={t.key}>
              <Link
                href={t.key === "settings" ? `/dashboard/admin/${org.id}` : `/dashboard/admin/${org.id}?tab=${t.key}`}
                aria-current={t.key === tab ? "page" : undefined}
                className={`-mb-px block whitespace-nowrap border-b-2 px-3 py-2 text-[13.5px] ${
                  t.key === tab ? "border-accent font-medium text-foreground" : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {t.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {tab === "settings" && <SettingsTab ctx={ctx} org={org} />}
      {tab === "projects" && <ProjectsTab ctx={ctx} org={org} />}
      {tab === "automations" && <AutomationsTab ctx={ctx} org={org} />}
      {tab === "requests" && <RequestsTab ctx={ctx} org={org} />}
      {tab === "files" && <FilesTab ctx={ctx} org={org} />}
      {tab === "invoices" && <InvoicesTab ctx={ctx} org={org} />}
    </>
  );
}

// ---------------------------------------------------------------------------
async function SettingsTab({ ctx, org }: TabProps) {
  const { members, invites } = await listMembers(ctx.supabase, org.id);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <Panel title={`Members (${members.length})`} bodyClassName={null}>
          {members.length === 0 ? (
            <EmptyState title="No members yet">Invite the client below. They join when they first sign in.</EmptyState>
          ) : (
            <div className="pt-table-wrap">
              <table className="pt-table">
                <thead>
                  <tr>
                    <th scope="col">Person</th>
                    <th scope="col">Role</th>
                    <th scope="col">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m) => (
                    <tr key={m.user_id}>
                      <td className="max-w-[280px]">
                        <p className="truncate font-medium">{personName(m.profile)}</p>
                        <p className="truncate text-[12.5px] text-muted">{m.profile?.email}</p>
                      </td>
                      <td>
                        <ActionForm action={updateMemberRole} submitLabel="Save" size="sm" variant="default" inline submitAriaLabel={`Save role for ${personName(m.profile)}`}>
                          <input type="hidden" name="org_id" value={org.id} />
                          <input type="hidden" name="user_id" value={m.user_id} />
                          <label className="sr-only" htmlFor={`role-${m.user_id}`}>
                            Role
                          </label>
                          <select id={`role-${m.user_id}`} name="role" defaultValue={m.role} className="pt-select h-7 w-28 text-[12.5px]">
                            <option value="client">Client</option>
                            <option value="admin">Admin</option>
                          </select>
                        </ActionForm>
                      </td>
                      <td className="text-right">
                        {m.user_id !== ctx.userId && (
                          <ActionForm
                            action={removeMember}
                            submitLabel="Remove"
                            size="sm"
                            variant="danger"
                            confirm={`Remove ${personName(m.profile)} from ${org.name}?`}
                            submitAriaLabel={`Remove ${personName(m.profile)}`}
                          >
                            <input type="hidden" name="org_id" value={org.id} />
                            <input type="hidden" name="user_id" value={m.user_id} />
                          </ActionForm>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        <Panel title="Invite someone">
          <ActionForm action={inviteMember} submitLabel="Save invite" resetOnSuccess>
            <input type="hidden" name="org_id" value={org.id} />
            <div className="grid gap-4 sm:grid-cols-[1fr_160px]">
              <Field label="Email" htmlFor="invite-email" hint="They join this organization automatically the first time they sign in with this address.">
                <input id="invite-email" name="email" type="email" required className="pt-input" />
              </Field>
              <Field label="Role" htmlFor="invite-role">
                <select id="invite-role" name="role" defaultValue="client" className="pt-select">
                  <option value="client">Client</option>
                  <option value="admin">Admin (Moonlabs)</option>
                </select>
              </Field>
            </div>
          </ActionForm>
          {invites.length > 0 && (
            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-2 text-[12px] font-medium text-muted">Pending invites</p>
              <ul className="divide-y divide-border">
                {invites.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
                    <span>
                      {i.email} <span className="text-[12.5px] text-muted">· {i.role} · {formatShortDate(i.created_at)}</span>
                    </span>
                    <ActionForm action={revokeInvite} submitLabel="Revoke" size="sm" variant="ghost" submitAriaLabel={`Revoke invite for ${i.email}`}>
                      <input type="hidden" name="org_id" value={org.id} />
                      <input type="hidden" name="invite_id" value={i.id} />
                    </ActionForm>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Panel>
      </div>

      <Panel title="Organization">
        <ActionForm action={updateOrganization} submitLabel="Save">
          <input type="hidden" name="org_id" value={org.id} />
          <div className="space-y-4">
            <Field label="Name" htmlFor="org-name">
              <input id="org-name" name="name" required maxLength={120} defaultValue={org.name} className="pt-input" />
            </Field>
            <Field label="Plan" htmlFor="org-plan">
              <select id="org-plan" name="plan" defaultValue={org.plan} className="pt-select">
                {PLANS.map((p) => (
                  <option key={p} value={p}>
                    {planLabel[p]}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Plan start" htmlFor="org-plan-start">
              <input id="org-plan-start" name="plan_started_on" type="date" defaultValue={org.plan_started_on ?? ""} className="pt-input" />
            </Field>
          </div>
        </ActionForm>
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
async function ProjectsTab({ ctx, org }: TabProps) {
  const projects = await listProjects(ctx.supabase, org.id);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Panel title={`Projects (${projects.length})`} className="lg:col-span-2" bodyClassName={null}>
        {projects.length === 0 ? (
          <EmptyState title="No projects yet">Create one on the right. Its five stages are added automatically.</EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Project</th>
                  <th scope="col">Status</th>
                  <th scope="col">Stage</th>
                  <th scope="col">Target</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/dashboard/admin/${org.id}/projects/${p.id}`} className="pt-row-link">
                        {p.name}
                      </Link>
                    </td>
                    <td>
                      <Badge tone={projectTone[p.status]}>{projectStatusLabel[p.status]}</Badge>
                    </td>
                    <td>{currentStageLabel(p.stages)}</td>
                    <td className="pt-kbd-muted">{formatShortDate(p.target_on)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel title="New project">
        <ActionForm action={createProject} submitLabel="Create project" pendingLabel="Creating…">
          <input type="hidden" name="org_id" value={org.id} />
          <div className="space-y-4">
            <Field label="Name" htmlFor="p-name">
              <input id="p-name" name="name" required maxLength={160} className="pt-input" />
            </Field>
            <Field label="Summary" htmlFor="p-summary">
              <textarea id="p-summary" name="summary" rows={3} maxLength={4000} className="pt-textarea" />
            </Field>
            <Field label="Status" htmlFor="p-status">
              <select id="p-status" name="status" defaultValue="active" className="pt-select">
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {projectStatusLabel[s]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Start" htmlFor="p-start">
                <input id="p-start" name="started_on" type="date" className="pt-input" />
              </Field>
              <Field label="Target" htmlFor="p-target">
                <input id="p-target" name="target_on" type="date" className="pt-input" />
              </Field>
            </div>
          </div>
        </ActionForm>
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
async function AutomationsTab({ ctx, org }: TabProps) {
  const now = requestNow();
  const [automations, projects] = await Promise.all([listAutomations(ctx.supabase, org.id, now), listProjectOptions(ctx.supabase, org.id)]);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Panel title={`Automations (${automations.length})`} className="lg:col-span-2" bodyClassName={null}>
        {automations.length === 0 ? (
          <EmptyState title="No automations yet">Add one on the right, then log runs from its page.</EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Status</th>
                  <th scope="col">Last run</th>
                  <th scope="col" className="pt-num">
                    Success 7d
                  </th>
                </tr>
              </thead>
              <tbody>
                {automations.map((a) => (
                  <tr key={a.id}>
                    <td>
                      <Link href={`/dashboard/admin/${org.id}/automations/${a.id}`} className="pt-row-link">
                        {a.name}
                      </Link>
                    </td>
                    <td>
                      <Badge tone={automationTone[a.status]}>{automationStatusLabel[a.status]}</Badge>
                    </td>
                    <td className="pt-kbd-muted">{formatRelative(a.last_run_at, now)}</td>
                    <td className="pt-num">{formatPercent(a.successRate7d)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel title="New automation">
        <ActionForm action={createAutomation} submitLabel="Create automation" pendingLabel="Creating…">
          <input type="hidden" name="org_id" value={org.id} />
          <div className="space-y-4">
            <Field label="Name" htmlFor="a-name">
              <input id="a-name" name="name" required maxLength={160} className="pt-input" />
            </Field>
            <Field label="Trigger" htmlFor="a-trigger" hint="e.g. “Every 30 minutes” or “Webhook: new order”.">
              <input id="a-trigger" name="trigger_label" maxLength={160} className="pt-input" />
            </Field>
            <Field label="Description" htmlFor="a-desc">
              <textarea id="a-desc" name="description" rows={3} maxLength={4000} className="pt-textarea" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Status" htmlFor="a-status">
                <select id="a-status" name="status" defaultValue="healthy" className="pt-select">
                  {AUTOMATION_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {automationStatusLabel[s]}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Min saved / run" htmlFor="a-min">
                <input id="a-min" name="minutes_saved_per_run" type="number" min={0} max={100000} defaultValue={0} className="pt-input" />
              </Field>
            </div>
            <Field label="Project" htmlFor="a-project">
              <select id="a-project" name="project_id" defaultValue="" className="pt-select">
                <option value="">None</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </ActionForm>
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
async function RequestsTab({ ctx, org }: TabProps) {
  const requests = await listRequests(ctx.supabase, org.id);
  return (
    <Panel title={`Requests (${requests.length})`} bodyClassName={null}>
      {requests.length === 0 ? (
        <EmptyState title="No requests from this client yet" />
      ) : (
        <div className="pt-table-wrap">
          <table className="pt-table">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Status</th>
                <th scope="col">Priority</th>
                <th scope="col">Opened by</th>
                <th scope="col">Updated</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id}>
                  <td className="max-w-[360px]">
                    <Link href={`/dashboard/admin/${org.id}/requests/${r.id}`} className="pt-row-link line-clamp-1">
                      {r.title}
                    </Link>
                  </td>
                  <td>
                    <Badge tone={requestTone[r.status]}>{requestStatusLabel[r.status]}</Badge>
                  </td>
                  <td>
                    <Badge tone={priorityTone[r.priority]}>{requestPriorityLabel[r.priority]}</Badge>
                  </td>
                  <td className="text-muted">{personName(r.author)}</td>
                  <td className="pt-kbd-muted">{formatShortDate(r.updated_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  );
}

// ---------------------------------------------------------------------------
async function FilesTab({ ctx, org }: TabProps) {
  const [files, projects] = await Promise.all([listFiles(ctx.supabase, org.id), listProjectOptions(ctx.supabase, org.id)]);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Panel title={`Files (${files.length})`} className="lg:col-span-2" bodyClassName={null}>
        {files.length === 0 ? (
          <EmptyState title="No files shared yet" />
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Project</th>
                  <th scope="col">Uploaded</th>
                  <th scope="col" className="pt-num">
                    Size
                  </th>
                  <th scope="col">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f.id}>
                    <td className="max-w-[260px]">
                      <a href={`/dashboard/files/${f.id}/download`} className="pt-row-link line-clamp-1 break-all">
                        {f.name}
                      </a>
                    </td>
                    <td className="text-muted">{f.project?.name ?? "-"}</td>
                    <td className="pt-kbd-muted whitespace-nowrap">{formatDate(f.created_at)}</td>
                    <td className="pt-num pt-kbd-muted">{formatBytes(f.size_bytes)}</td>
                    <td className="text-right">
                      <ActionForm action={deleteFile} submitLabel="Delete" size="sm" variant="danger" confirm={`Delete ${f.name}? The client loses access.`} submitAriaLabel={`Delete ${f.name}`}>
                        <input type="hidden" name="org_id" value={org.id} />
                        <input type="hidden" name="file_id" value={f.id} />
                      </ActionForm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel title="Upload a deliverable">
        <FileUploader orgId={org.id} projects={projects} register={registerFile} />
      </Panel>
    </div>
  );
}

// ---------------------------------------------------------------------------
async function InvoicesTab({ ctx, org }: TabProps) {
  const invoices = await listInvoices(ctx.supabase, org.id);
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Panel title={`Invoices (${invoices.length})`} className="lg:col-span-2" bodyClassName={null}>
        {invoices.length === 0 ? (
          <EmptyState title="No invoices yet">Drafts are hidden from the client until you change their status.</EmptyState>
        ) : (
          <div className="pt-table-wrap">
            <table className="pt-table">
              <thead>
                <tr>
                  <th scope="col">Number</th>
                  <th scope="col">Issued</th>
                  <th scope="col" className="pt-num">
                    Amount
                  </th>
                  <th scope="col">Visible</th>
                  <th scope="col">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((i) => (
                  <tr key={i.id}>
                    <td className="font-medium">
                      {i.url ? (
                        <a href={i.url} target="_blank" rel="noopener noreferrer" className="pt-row-link">
                          {i.number}
                        </a>
                      ) : (
                        i.number
                      )}
                    </td>
                    <td className="pt-kbd-muted whitespace-nowrap">{formatShortDate(i.issued_on)}</td>
                    <td className="pt-num">{formatMoney(i.amount_cents, i.currency)}</td>
                    <td>
                      <Badge tone={i.status === "draft" ? "neutral" : "info"}>{i.status === "draft" ? "Hidden" : "Client sees"}</Badge>
                    </td>
                    <td>
                      <ActionForm action={setInvoiceStatus} submitLabel="Set" size="sm" variant="default" inline submitAriaLabel={`Set status of invoice ${i.number}`}>
                        <input type="hidden" name="org_id" value={org.id} />
                        <input type="hidden" name="invoice_id" value={i.id} />
                        <label className="sr-only" htmlFor={`inv-status-${i.id}`}>
                          Status for {i.number}
                        </label>
                        <select id={`inv-status-${i.id}`} name="status" defaultValue={i.status} className="pt-select h-7 w-28 text-[12.5px]">
                          {INVOICE_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {invoiceStatusLabel[s]}
                            </option>
                          ))}
                        </select>
                      </ActionForm>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>
      <Panel title="Add invoice">
        <ActionForm action={createInvoice} submitLabel="Add invoice" resetOnSuccess>
          <input type="hidden" name="org_id" value={org.id} />
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Number" htmlFor="i-number">
                <input id="i-number" name="number" required maxLength={40} className="pt-input" placeholder="ML-0001" />
              </Field>
              <Field label="Status" htmlFor="i-status">
                <select id="i-status" name="status" defaultValue="open" className="pt-select">
                  {INVOICE_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {invoiceStatusLabel[s]}
                    </option>
                  ))}
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-[1fr_88px] gap-3">
              <Field label="Amount" htmlFor="i-amount">
                <input id="i-amount" name="amount" required inputMode="decimal" className="pt-input" placeholder="490.00" />
              </Field>
              <Field label="Currency" htmlFor="i-currency">
                <input id="i-currency" name="currency" required defaultValue="USD" maxLength={3} className="pt-input uppercase" />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Issued" htmlFor="i-issued">
                <input id="i-issued" name="issued_on" type="date" className="pt-input" />
              </Field>
              <Field label="Due" htmlFor="i-due">
                <input id="i-due" name="due_on" type="date" className="pt-input" />
              </Field>
            </div>
            <Field label="Link (Stripe, PDF…)" htmlFor="i-url">
              <input id="i-url" name="url" type="url" className="pt-input" placeholder="https://" />
            </Field>
            <Field label="Notes" htmlFor="i-notes">
              <input id="i-notes" name="notes" maxLength={2000} className="pt-input" />
            </Field>
          </div>
        </ActionForm>
      </Panel>
    </div>
  );
}
