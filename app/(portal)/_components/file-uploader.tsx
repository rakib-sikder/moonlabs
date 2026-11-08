"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ActionState } from "@/lib/portal/types";

const MAX_BYTES = 50 * 1024 * 1024; // matches the limit in /dashboard/files/upload

/**
 * Sends the file as the raw request body to /dashboard/files/upload, which checks that the
 * caller administers the organization and streams it into the R2 bucket. Only rendered when
 * the FILES binding exists.
 */
export function FileUploader({ orgId, projects }: { orgId: string; projects: { id: string; name: string }[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();
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
      const params = new URLSearchParams({ org_id: orgId, name: displayName });
      if (projectId) params.set("project_id", projectId);
      let result: ActionState;
      try {
        const res = await fetch(`/dashboard/files/upload?${params}`, {
          method: "POST",
          body: file,
          headers: { "Content-Type": file.type || "application/octet-stream" },
        });
        result = ((await res.json().catch(() => null)) as ActionState | null) ?? { ok: false, message: `Upload failed (${res.status}).` };
      } catch {
        result = { ok: false, message: "Upload failed. Check your connection and try again." };
      }
      startTransition(() => {
        setState(result);
        if (result.ok) {
          formRef.current?.reset();
          router.refresh();
        }
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
