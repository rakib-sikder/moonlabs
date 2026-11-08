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
  const link = state?.ok && state.link ? <CopyLink key={state.link} link={state.link} /> : null;

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
        {link}
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
      {link}
    </form>
  );
}

/** A one-time link returned by an action (invite, password reset) with a Copy button. */
export function CopyLink({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-border bg-surface-2 p-2">
      <input
        readOnly
        value={link}
        aria-label="One-time link"
        className="pt-input h-8 min-w-0 flex-1 font-mono text-[12px]"
        onFocus={(e) => e.currentTarget.select()}
      />
      <button type="button" className="pt-btn" data-size="sm" onClick={copy}>
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
