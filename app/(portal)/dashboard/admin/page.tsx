import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isPortalConfigured } from "@/lib/supabase/config";
import { getPortalContext } from "@/lib/supabase/session";
import { formatDate, planLabel } from "@/lib/portal/format";
import type { OrgPlan } from "@/lib/portal/types";
import { EmptyState, Field, PageHeader, Panel } from "../../_components/ui";
import { ActionForm } from "../../_components/action-form";
import { createOrganization } from "./actions";

export const metadata: Metadata = { title: "Admin" };

const PLANS: OrgPlan[] = ["none", "crescent", "half_moon", "full_moon", "custom"];

export default async function AdminPage() {
  if (!isPortalConfigured()) return null;
  const ctx = await getPortalContext();
  if (!ctx.canAdmin) redirect("/dashboard");
  const orgs = ctx.orgs.filter((o) => ctx.isStaff || o.role === "admin");

  return (
    <>
      <PageHeader title="Admin" description="Pick a client organization to manage its projects, automations, requests, files and invoices." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title={`Organizations (${orgs.length})`} className="lg:col-span-2" bodyClassName={null}>
          {orgs.length === 0 ? (
            <EmptyState title="No organizations yet">Create the first client organization to get started.</EmptyState>
          ) : (
            <div className="pt-table-wrap">
              <table className="pt-table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Plan</th>
                    <th scope="col">Your access</th>
                    <th scope="col">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orgs.map((o) => (
                    <tr key={o.id}>
                      <td>
                        <Link href={`/dashboard/admin/${o.id}`} className="pt-row-link">
                          {o.name}
                        </Link>
                      </td>
                      <td>{planLabel[o.plan]}</td>
                      <td className="text-muted">{o.role === "staff" ? "Staff" : o.role === "admin" ? "Admin" : "Client"}</td>
                      <td className="pt-kbd-muted whitespace-nowrap">{formatDate(o.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>

        {ctx.isStaff ? (
          <Panel title="New organization">
            <ActionForm action={createOrganization} submitLabel="Create organization" pendingLabel="Creating…">
              <div className="space-y-4">
                <Field label="Company name" htmlFor="org-name">
                  <input id="org-name" name="name" required maxLength={120} className="pt-input" />
                </Field>
                <Field label="Plan" htmlFor="org-plan">
                  <select id="org-plan" name="plan" defaultValue="none" className="pt-select">
                    {PLANS.map((p) => (
                      <option key={p} value={p}>
                        {planLabel[p]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Plan start (optional)" htmlFor="org-plan-start">
                  <input id="org-plan-start" name="plan_started_on" type="date" className="pt-input" />
                </Field>
              </div>
            </ActionForm>
          </Panel>
        ) : (
          <Panel title="New organization">
            <p className="text-muted">Only global staff (profiles.is_staff) can create organizations.</p>
          </Panel>
        )}
      </div>
    </>
  );
}
