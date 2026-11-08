"use client";

import { useRef, useState, useTransition } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { DELIVERABLES_BUCKET } from "@/lib/supabase/config";
import type { ActionState } from "@/lib/portal/types";

const MAX_BYTES = 50 * 1024 * 1024; // matches the bucket limit in the migration

/**
 * Uploads straight from the browser to the private Storage bucket (as the signed-in admin,
 * so storage RLS applies), then records the file through a server action. Going direct
 * avoids pushing large files through a server action's body-size limit.
 */
export function FileUploader({
  orgId,
  projects,
  register,
}: {
  orgId: string;
  projects: { id: string; name: string }[];
  register: (formData: FormData) => Promise<ActionState>;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<ActionState | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("file") as HTMLInputElement | null;
    const file = input?.files?.[0];
    if (!file) {
      setState({ ok: false, message: "Choose a file first." });
      return;
    }
    if (file.size > MAX_BYTES) {
      setState({ ok: false, message: "Files must be 50 MB or smaller." });
      return;
    }
    const projectId = (form.elements.namedItem("project_id") as HTMLSelectElement | null)?.value ?? "";
    const displayName = ((form.elements.namedItem("name") as HTMLInputElement | null)?.value ?? "").trim() || file.name;

    startTransition(async () => {
      const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-120) || "file";
      const path = `${orgId}/${crypto.randomUUID()}-${safe}`;
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.storage
        .from(DELIVERABLES_BUCKET)
        .upload(path, file, { contentType: file.type || "application/octet-stream", upsert: false });
      if (error) {
        startTransition(() => setState({ ok: false, message: `Upload failed: ${error.message}` }));
        return;
      }
      const fd = new FormData();
      fd.set("org_id", orgId);
      fd.set("storage_path", path);
      fd.set("name", displayName);
      fd.set("size_bytes", String(file.size));
      fd.set("content_type", file.type);
      if (projectId) fd.set("project_id", projectId);
      const result = await register(fd);
      startTransition(() => {
        setState(result);
        if (result.ok) formRef.current?.reset();
      });
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} aria-busy={pending} className="space-y-4">
      <div>
        <label htmlFor="upload-file" className="pt-label">
          File (max 50 MB)
        </label>
        <input id="upload-file" name="file" type="file" required className="pt-input" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="upload-name" className="pt-label">
            Display name (optional)
          </label>
          <input id="upload-name" name="name" maxLength={255} className="pt-input" placeholder="Defaults to the file name" />
        </div>
        <div>
          <label htmlFor="upload-project" className="pt-label">
            Project
          </label>
          <select id="upload-project" name="project_id" className="pt-select" defaultValue="">
            <option value="">None</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" className="pt-btn" data-variant="primary" disabled={pending}>
          {pending ? "Uploading…" : "Upload and share"}
        </button>
        {state?.message && (
          <p role={state.ok ? "status" : "alert"} className="text-[12.5px]" style={{ color: state.ok ? "var(--muted)" : "var(--pt-bad)" }}>
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
