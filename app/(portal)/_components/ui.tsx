import Link from "next/link";
import type { ProjectStage, StageStatus } from "@/lib/portal/types";
import { STAGES, formatShortDate, stageLabel, stageStatusLabel, type Tone } from "@/lib/portal/format";
import { IconArrowLeft } from "./icons";

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: React.ReactNode }) {
  return (
    <span className="pt-badge" data-tone={tone}>
      {children}
    </span>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  back,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  back?: { href: string; label: string };
}) {
  return (
    <header className="mb-6">
      {back && (
        <Link href={back.href} className="mb-2 inline-flex items-center gap-1 text-[13px] text-muted hover:text-foreground">
          <IconArrowLeft className="h-3.5 w-3.5" />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
          {description && <div className="mt-1 text-[13.5px] text-muted">{description}</div>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}

export function Panel({
  title,
  actions,
  children,
  className = "",
  bodyClassName,
  id,
}: {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** null = no padding wrapper (for tables) */
  bodyClassName?: string | null;
  id?: string;
}) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section className={`pt-panel ${className}`} aria-labelledby={title ? headingId : undefined} id={id}>
      {title && (
        <div className="pt-panel-head">
          <h2 className="pt-panel-title" id={headingId}>
            {title}
          </h2>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {bodyClassName === null ? children : <div className={bodyClassName ?? "pt-panel-body"}>{children}</div>}
    </section>
  );
}

export function EmptyState({ title, children, action }: { title: string; children?: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
      <p className="text-[14px] font-medium">{title}</p>
      {children && <div className="mt-1 max-w-sm text-[13px] text-muted">{children}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function KpiTile({
  label,
  value,
  sub,
  href,
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  href?: string;
}) {
  const body = (
    <>
      <p className="text-[12px] font-medium text-muted">{label}</p>
      <p className="mt-2 text-[26px] font-semibold leading-none tracking-tight tabular-nums">{value}</p>
      {sub && <p className="mt-2 text-[12.5px] text-muted">{sub}</p>}
    </>
  );
  return href ? (
    <Link href={href} className="pt-panel block p-4 transition-colors hover:border-muted">
      {body}
    </Link>
  ) : (
    <div className="pt-panel p-4">{body}</div>
  );
}

/** Audit -> Design -> Build -> Test -> Live, with dates under each step. */
export function StageTracker({ stages, compact = false }: { stages: ProjectStage[]; compact?: boolean }) {
  const byKey = new Map(stages.map((s) => [s.stage, s]));
  return (
    <ol className="pt-stages" aria-label="Project stages">
      {STAGES.map((key) => {
        const s = byKey.get(key);
        const status: StageStatus = s?.status ?? "pending";
        const date =
          status === "done" ? s?.completed_on : status === "active" ? (s?.due_on ?? s?.started_on) : s?.due_on;
        const datePrefix = status === "done" ? "" : status === "active" ? (s?.due_on ? "Due " : "Since ") : s?.due_on ? "Due " : "";
        return (
          <li key={key} className="pt-stage min-w-0" data-status={status}>
            <div className="pt-stage-bar" />
            <p className={`mt-2 truncate text-[12.5px] ${status === "pending" ? "text-muted" : "font-medium"}`}>
              {stageLabel[key]}
              <span className="sr-only">: {stageStatusLabel[status]}</span>
            </p>
            {!compact && (
              <p className="truncate text-[12px] text-muted tabular-nums">
                {date ? `${datePrefix}${formatShortDate(date)}` : status === "active" ? "In progress" : " "}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/** Index of the furthest stage that is active or done, for "current stage" labels. */
export function currentStageLabel(stages: ProjectStage[]): string {
  const active = stages.find((s) => s.status === "active");
  if (active) return stageLabel[active.stage];
  const done = stages.filter((s) => s.status === "done");
  if (done.length === STAGES.length) return "Live";
  if (done.length) return `${stageLabel[done[done.length - 1].stage]} done`;
  return "Not started";
}

export function NotConfigured({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`mx-auto w-full max-w-md ${compact ? "" : "py-24"} px-4`}>
      <div className="pt-panel p-6">
        <p className="text-[12px] font-medium uppercase tracking-wider text-muted">Client portal</p>
        <h1 className="mt-2 text-lg font-semibold">Client portal not configured yet</h1>
        <p className="mt-2 text-muted">
          Sign-in is not switched on for this site yet. If you are a Moonlab client, your project lead can share
          updates with you directly in the meantime.
        </p>
        <p className="mt-4 text-[12.5px] text-muted">
          Site owner: add the D1 database binding <code className="font-mono">DB</code> in{" "}
          <code className="font-mono">wrangler.jsonc</code>, apply the migrations, then redeploy. See{" "}
          <code className="font-mono">docs/PORTAL.md</code>.
        </p>
        <div className="mt-6 flex gap-2">
          <Link href="/" className="pt-btn">
            Back to site
          </Link>
          <Link href="/contact" className="pt-btn" data-variant="ghost">
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}

/** Signed in, but not a member of any organization yet. */
export function NoWorkspace({ canAdmin }: { canAdmin: boolean }) {
  return (
    <div className="pt-panel mx-auto mt-8 max-w-lg">
      <EmptyState
        title={canAdmin ? "No client organizations yet" : "Your workspace is not set up yet"}
        action={
          canAdmin ? (
            <Link href="/dashboard/admin" className="pt-btn" data-variant="primary">
              Create an organization
            </Link>
          ) : (
            <Link href="/contact" className="pt-btn">
              Contact Moonlab
            </Link>
          )
        }
      >
        {canAdmin
          ? "Create the first client organization in the admin area, then send the client an invite link."
          : "You are signed in, but your account is not linked to a client organization yet. Ask your Moonlab contact for an invite link."}
      </EmptyState>
    </div>
  );
}

/** Label + control wrapper used by every portal form. */
export function Field({
  label,
  htmlFor,
  hint,
  children,
  className = "",
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="pt-label" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {hint && <p className="mt-1 text-[12px] text-muted">{hint}</p>}
    </div>
  );
}
