import type { Metadata } from "next";
import { getOrgPage } from "@/lib/portal/access";
import { Field, NoWorkspace, PageHeader, Panel } from "../../../_components/ui";
import { ActionForm } from "../../../_components/action-form";
import { submitBrief } from "../actions";

export const metadata: Metadata = { title: "Start a new project" };

export default async function NewProjectPage() {
  const page = await getOrgPage();
  if (!page) return null;
  const { ctx, org } = page;
  if (!org) return <NoWorkspace canAdmin={ctx.canAdmin} />;

  return (
    <>
      <PageHeader
        back={{ href: "/dashboard/projects", label: "Projects" }}
        title="Start a new project"
        description="Tell us in your own words. We read every brief and reply within one business day."
      />
      <Panel className="max-w-2xl">
        <ActionForm action={submitBrief} submitLabel="Send brief" pendingLabel="Sending…">
          <input type="hidden" name="org_id" value={org.id} />
          <div className="space-y-5">
            <Field label="Project name" htmlFor="title" hint="A short name, e.g. “Online booking for the salon”.">
              <input id="title" name="title" required minLength={3} maxLength={160} className="pt-input" autoFocus />
            </Field>
            <Field label="What do you want built?" htmlFor="goal" hint="The problem it should solve and what a good result looks like. Plain words are best.">
              <textarea id="goal" name="goal" required minLength={20} maxLength={10000} rows={7} className="pt-textarea" />
            </Field>
            <Field label="Who will use it? (optional)" htmlFor="audience" hint="Your staff, your customers, both? Roughly how many?">
              <textarea id="audience" name="audience" maxLength={4000} rows={3} className="pt-textarea" />
            </Field>
            <Field label="Must-have features (optional)" htmlFor="features" hint="One per line. Say which ones matter most.">
              <textarea id="features" name="features" maxLength={10000} rows={5} className="pt-textarea" />
            </Field>
            <Field label="Examples or links (optional)" htmlFor="examples" hint="Apps or sites you like, your current tools, or files you can share later.">
              <textarea id="examples" name="examples" maxLength={4000} rows={3} className="pt-textarea" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Budget (optional)" htmlFor="budget" hint="A range is fine.">
                <input id="budget" name="budget" maxLength={200} placeholder="e.g. $1,000 to $3,000" className="pt-input" />
              </Field>
              <Field label="Deadline (optional)" htmlFor="deadline">
                <input id="deadline" name="deadline" type="date" className="pt-input" />
              </Field>
            </div>
          </div>
        </ActionForm>
      </Panel>
    </>
  );
}
