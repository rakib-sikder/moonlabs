"use client";

import { useState, useTransition } from "react";
import type { ActionState } from "@/lib/portal/types";

type Props = {
  action: (formData: FormData) => Promise<ActionState>;
  children?: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  variant?: "primary" | "default" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
  /** Clear the fields after a successful submit (create forms). Off for edit forms. */
  resetOnSuccess?: boolean;
  /** Ask before submitting (deletes). */
  confirm?: string;
  /** Lay the submit button inline with the fields instead of on its own row. */
  inline?: boolean;
  /** Accessible name when the visible label is ambiguous (e.g. "Delete" in a table). */
  submitAriaLabel?: string;
  /** Set false for button-only forms (hidden inputs only) to drop the gap above the button. */
  hasVisibleFields?: boolean;
};

/**
 * Form wrapper for portal server actions: shows pending state and the action's message.
 * Fields are kept on error (unlike a bare <form action>, which always resets).
 */
export function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel,
  variant = "primary",
  size = "md",
  className = "",
  resetOnSuccess = false,
  confirm,
  inline = false,
  submitAriaLabel,
  hasVisibleFields = true,
}: Props) {
  const [pending, startTransition] = useTransition();
  const [state, setState] = useState<ActionState | null>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (confirm && !window.confirm(confirm)) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      const result = await action(data);
      startTransition(() => {
        setState(result ?? null);
        if (result?.ok && resetOnSuccess) form.reset();
      });
    });
  }

  const message = state?.message ? (
    <p
      role={state.ok ? "status" : "alert"}
      className="text-[12.5px]"
      style={{ color: state.ok ? "var(--muted)" : "var(--pt-bad)" }}
    >
      {state.message}
    </p>
  ) : null;

  const button = (
    <button
      type="submit"
      className="pt-btn"
      data-variant={variant === "default" ? undefined : variant}
      data-size={size === "sm" ? "sm" : undefined}
      disabled={pending}
      aria-label={submitAriaLabel}
    >
      {pending ? (pendingLabel ?? "Saving…") : submitLabel}
    </button>
  );

  if (inline) {
    return (
      <form onSubmit={onSubmit} className={className} aria-busy={pending}>
        <div className="flex flex-wrap items-end gap-2">
          {children}
          {button}
        </div>
        {message && <div className="mt-2">{message}</div>}
      </form>
    );
  }

  return (
    <form onSubmit={onSubmit} className={className} aria-busy={pending}>
      {children}
      <div className={`flex flex-wrap items-center gap-3 ${size === "md" && hasVisibleFields ? "mt-4" : ""}`}>
        {button}
        {message}
      </div>
    </form>
  );
}
