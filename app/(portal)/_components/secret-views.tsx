import { formatDate, personName } from "@/lib/portal/format";
import type { ProjectSecret } from "@/lib/portal/types";
import { ActionForm } from "./action-form";
import { Badge, Panel } from "./ui";
import { provideSecret, removeSecret } from "../dashboard/projects/actions";
import { deleteSecretAdmin, revealSecret } from "../dashboard/admin/actions";

const VALUE_PROPS = {
  name: "value",
  required: true,
  maxLength: 10000,
  rows: 2,
  autoComplete: "off",
  spellCheck: false,
  className: "pt-textarea font-mono text-[12.5px]",
} as const;

/** Client side: fill requested items, replace or remove saved ones, add new ones. Values are never shown. */
export function ClientSecretsPanel({ orgId, projectId, secrets }: { orgId: string; projectId: string; secrets: ProjectSecret[] }) {
  const ids = (
    <>
      <input type="hidden" name="org_id" value={orgId} />
      <input type="hidden" name="project_id" value={projectId} />
    </>
  );
  const needed = secrets.filter((s) => s.status === "requested").length;
  return (
    <Panel id="access" title={needed ? `Access and keys (${needed} needed)` : "Access and keys"} className="mt-6" bodyClassName={null}>
      <p className="border-b border-border px-4 py-3 text-[12.5px] text-muted">
        Share passwords and API keys here, never by email or chat. They are encrypted, only the Moonlab team can open them, every view is logged,
        and everything here is deleted when the project ends. Once saved, a value is not shown again, even to you.
      </p>
      {secrets.length > 0 && (
        <ul className="divide-y divide-border">
          {secrets.map((s) => (
            <li key={s.id} className="px-4 py-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium">{s.label}</p>
                  {s.hint && <p className="text-[12.5px] text-muted">{s.hint}</p>}
                </div>
                {s.status === "provided" ? <Badge tone="ok">Saved {formatDate(s.provided_at)}</Badge> : <Badge tone="warn">Needed</Badge>}
              </div>
              {s.status === "requested" ? (
                <ActionForm action={provideSecret} submitLabel="Save securely" size="sm" className="mt-2">
                  {ids}
                  <input type="hidden" name="secret_id" value={s.id} />
                  <label htmlFor={`v-${s.id}`} className="sr-only">
                    Value for {s.label}
                  </label>
                  <textarea id={`v-${s.id}`} {...VALUE_PROPS} />
                </ActionForm>
              ) : (
                <div className="mt-2 flex flex-wrap items-start gap-3">
                  <details className="min-w-[16rem] flex-1">
                    <summary className="cursor-pointer text-[12.5px] text-muted">Replace the value</summary>
                    <ActionForm action={provideSecret} submitLabel="Save new value" size="sm" className="mt-2">
                      {ids}
                      <input type="hidden" name="secret_id" value={s.id} />
                      <label htmlFor={`r-${s.id}`} className="sr-only">
                        New value for {s.label}
                      </label>
                      <textarea id={`r-${s.id}`} {...VALUE_PROPS} />
                    </ActionForm>
                  </details>
                  <ActionForm action={removeSecret} submitLabel="Remove" size="sm" variant="ghost" hasVisibleFields={false} confirm={`Remove the saved value for ${s.label}?`}>
                    <input type="hidden" name="org_id" value={orgId} />
                    <input type="hidden" name="secret_id" value={s.id} />
                  </ActionForm>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      <details className="border-t border-border px-4 py-3">
        <summary className="cursor-pointer text-[13px]">Add something else</summary>
        <ActionForm action={provideSecret} submitLabel="Save securely" size="sm" className="mt-3" resetOnSuccess>
          {ids}
          <div className="space-y-2">
            <div>
              <label htmlFor="new-label" className="pt-label">
                What is it?
              </label>
              <input id="new-label" name="label" required minLength={2} maxLength={120} placeholder="e.g. Hosting login" className="pt-input" />
            </div>
            <div>
              <label htmlFor="new-value" className="pt-label">
                Value
              </label>
              <textarea id="new-value" {...VALUE_PROPS} />
            </div>
          </div>
        </ActionForm>
      </details>
    </Panel>
  );
}

/** Moonlab side: what was asked, what was saved, reveal (logged) and delete. */
export function AdminSecretList({ orgId, secrets }: { orgId: string; secrets: ProjectSecret[] }) {
  if (secrets.length === 0) return null;
  return (
    <ul className="divide-y divide-border">
      {secrets.map((s) => (
        <li key={s.id} className="px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="font-medium">{s.label}</p>
              <p className="text-[12.5px] text-muted">
                {s.status === "provided" ? `Saved ${formatDate(s.provided_at)} by ${personName(s.provider)}` : `Asked ${formatDate(s.created_at)}`}
                {s.hint && ` · ${s.hint}`}
                {s.reveal_count > 0 && ` · Revealed ${s.reveal_count}×, last ${formatDate(s.last_revealed_at)}`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {s.status === "provided" ? <Badge tone="ok">Saved</Badge> : <Badge tone="warn">Waiting for client</Badge>}
              <ActionForm action={deleteSecretAdmin} submitLabel="Delete" size="sm" variant="ghost" hasVisibleFields={false} confirm={`Delete ${s.label}?`} submitAriaLabel={`Delete ${s.label}`}>
                <input type="hidden" name="org_id" value={orgId} />
                <input type="hidden" name="secret_id" value={s.id} />
              </ActionForm>
            </div>
          </div>
          {s.status === "provided" && (
            <ActionForm action={revealSecret} submitLabel="Reveal" size="sm" variant="default" hasVisibleFields={false} className="mt-2" submitAriaLabel={`Reveal ${s.label}`}>
              <input type="hidden" name="org_id" value={orgId} />
              <input type="hidden" name="secret_id" value={s.id} />
            </ActionForm>
          )}
        </li>
      ))}
    </ul>
  );
}
