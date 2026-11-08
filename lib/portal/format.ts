// Display helpers for the client portal. All dates render in UTC with a fixed locale so
// server and client output match (no hydration drift) regardless of the viewer's machine.

import type {
  AutomationStatus,
  InvoiceStatus,
  OrgPlan,
  ProjectStatus,
  RequestPriority,
  RequestStatus,
  RunStatus,
  StageKey,
  StageStatus,
} from "./types";

const LOCALE = "en-US";

const dateFmt = new Intl.DateTimeFormat(LOCALE, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const shortDateFmt = new Intl.DateTimeFormat(LOCALE, { month: "short", day: "numeric", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat(LOCALE, {
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

function toDate(value: string | Date): Date {
  if (value instanceof Date) return value;
  // Bare dates (YYYY-MM-DD) are calendar days; pin them to UTC midnight.
  return /^\d{4}-\d{2}-\d{2}$/.test(value) ? new Date(`${value}T00:00:00Z`) : new Date(value);
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "-";
  return dateFmt.format(toDate(value));
}

export function formatShortDate(value: string | Date | null | undefined): string {
  if (!value) return "-";
  return shortDateFmt.format(toDate(value));
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return "-";
  return `${dateTimeFmt.format(toDate(value))} UTC`;
}

/** "3h ago", "2d ago". `now` is passed in so callers render deterministically. */
export function formatRelative(value: string | null | undefined, now: number): string {
  if (!value) return "Never";
  const diff = Math.max(0, now - toDate(value).getTime());
  const min = Math.round(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 48) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 60) return `${d}d ago`;
  return formatDate(value);
}

export function formatMoney(cents: number, currency = "USD"): string {
  return new Intl.NumberFormat(LOCALE, { style: "currency", currency, minimumFractionDigits: 2 }).format(cents / 100);
}

export function formatNumber(n: number, digits = 0): string {
  return new Intl.NumberFormat(LOCALE, { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
}

export function formatPercent(ratio: number | null): string {
  if (ratio === null) return "-";
  return `${formatNumber(ratio * 100, ratio === 1 || ratio === 0 ? 0 : 1)}%`;
}

export function formatDuration(ms: number | null): string {
  if (ms === null) return "-";
  if (ms < 1000) return `${ms} ms`;
  const s = ms / 1000;
  if (s < 60) return `${formatNumber(s, 1)} s`;
  return `${Math.floor(s / 60)}m ${Math.round(s % 60)}s`;
}

export function formatBytes(bytes: number | null): string {
  if (bytes === null) return "-";
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let v = bytes / 1024;
  let i = 0;
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024;
    i++;
  }
  return `${formatNumber(v, v < 10 ? 1 : 0)} ${units[i]}`;
}

export function personName(p: { full_name: string | null; email: string | null; is_staff?: boolean } | null): string {
  if (!p) return "Moonlabs team";
  return p.full_name?.trim() || p.email || "Unknown";
}

export function initials(name: string): string {
  const parts = name.replace(/@.*/, "").split(/[\s._-]+/).filter(Boolean);
  return ((parts[0]?.[0] ?? "?") + (parts[1]?.[0] ?? "")).toUpperCase();
}

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
export const STAGES: StageKey[] = ["audit", "design", "build", "test", "live"];

export const stageLabel: Record<StageKey, string> = {
  audit: "Audit",
  design: "Design",
  build: "Build",
  test: "Test",
  live: "Live",
};

export const stageStatusLabel: Record<StageStatus, string> = { pending: "Pending", active: "In progress", done: "Done" };

export const projectStatusLabel: Record<ProjectStatus, string> = {
  active: "Active",
  on_hold: "On hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

export const automationStatusLabel: Record<AutomationStatus, string> = {
  healthy: "Healthy",
  warning: "Warning",
  failing: "Failing",
  paused: "Paused",
};

export const runStatusLabel: Record<RunStatus, string> = { success: "Success", failed: "Failed", running: "Running" };

export const requestStatusLabel: Record<RequestStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  waiting: "Waiting on you",
  resolved: "Resolved",
  closed: "Closed",
};

export const requestPriorityLabel: Record<RequestPriority, string> = {
  low: "Low",
  normal: "Normal",
  high: "High",
  urgent: "Urgent",
};

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  draft: "Draft",
  open: "Open",
  paid: "Paid",
  overdue: "Overdue",
  void: "Void",
};

export const planLabel: Record<OrgPlan, string> = {
  none: "No plan",
  crescent: "Crescent",
  half_moon: "Half Moon",
  full_moon: "Full Moon",
  custom: "Custom",
};

export const OPEN_REQUEST_STATUSES: RequestStatus[] = ["open", "in_progress", "waiting"];

/** Visual tone for status badges; maps to .pt-badge[data-tone] in portal.css. */
export type Tone = "ok" | "warn" | "bad" | "info" | "neutral";

export const automationTone: Record<AutomationStatus, Tone> = {
  healthy: "ok",
  warning: "warn",
  failing: "bad",
  paused: "neutral",
};
export const runTone: Record<RunStatus, Tone> = { success: "ok", failed: "bad", running: "info" };
export const requestTone: Record<RequestStatus, Tone> = {
  open: "info",
  in_progress: "info",
  waiting: "warn",
  resolved: "ok",
  closed: "neutral",
};
export const priorityTone: Record<RequestPriority, Tone> = { low: "neutral", normal: "neutral", high: "warn", urgent: "bad" };
export const invoiceTone: Record<InvoiceStatus, Tone> = {
  draft: "neutral",
  open: "info",
  paid: "ok",
  overdue: "bad",
  void: "neutral",
};
export const projectTone: Record<ProjectStatus, Tone> = {
  active: "info",
  on_hold: "warn",
  completed: "ok",
  cancelled: "neutral",
};
