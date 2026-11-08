import type { ProjectMilestone, ProjectStage, ProjectUpdate } from "@/lib/portal/types";
import {
  STAGES,
  formatDate,
  formatShortDate,
  personName,
  stageLabel,
  stageStatusLabel,
} from "@/lib/portal/format";
import { Badge, EmptyState } from "./ui";
import { IconCheck } from "./icons";

/** Stage-by-stage table with start, due and completion dates. */
export function StageTable({ stages }: { stages: ProjectStage[] }) {
  const byKey = new Map(stages.map((s) => [s.stage, s]));
  return (
    <div className="pt-table-wrap">
      <table className="pt-table">
        <thead>
          <tr>
            <th scope="col">Stage</th>
            <th scope="col">Status</th>
            <th scope="col">Started</th>
            <th scope="col">Due</th>
            <th scope="col">Completed</th>
          </tr>
        </thead>
        <tbody>
          {STAGES.map((key) => {
            const s = byKey.get(key);
            const status = s?.status ?? "pending";
            return (
              <tr key={key}>
                <td className="font-medium">
                  {stageLabel[key]}
                  {s?.notes && <p className="text-[12.5px] font-normal text-muted">{s.notes}</p>}
                </td>
                <td>
                  <Badge tone={status === "done" ? "ok" : status === "active" ? "info" : "neutral"}>{stageStatusLabel[status]}</Badge>
                </td>
                <td className="pt-kbd-muted">{formatShortDate(s?.started_on)}</td>
                <td className="pt-kbd-muted">{formatShortDate(s?.due_on)}</td>
                <td className="pt-kbd-muted">{formatShortDate(s?.completed_on)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function MilestoneList({ milestones }: { milestones: ProjectMilestone[] }) {
  if (milestones.length === 0) return <EmptyState title="No milestones yet">The checklist fills in as the project is planned.</EmptyState>;
  const done = milestones.filter((m) => m.done).length;
  return (
    <>
      <p className="px-4 pt-3 text-[12.5px] text-muted">
        {done} of {milestones.length} complete
      </p>
      <ul className="divide-y divide-border">
        {milestones.map((m) => (
          <li key={m.id} className="flex items-start gap-3 px-4 py-2.5">
            <span
              aria-hidden
              className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border"
              style={{
                borderColor: m.done ? "var(--pt-ok)" : "var(--border)",
                background: m.done ? "var(--pt-ok-soft)" : "transparent",
                color: "var(--pt-ok)",
              }}
            >
              {m.done && <IconCheck className="h-3 w-3" />}
            </span>
            <div className="min-w-0 flex-1">
              <p className={m.done ? "text-muted line-through decoration-border" : ""}>
                <span className="sr-only">{m.done ? "Done: " : "To do: "}</span>
                {m.title}
              </p>
              <p className="text-[12px] text-muted">
                {m.stage && stageLabel[m.stage]}
                {m.stage && m.due_on && " · "}
                {m.due_on && `Due ${formatShortDate(m.due_on)}`}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function UpdatesTimeline({ updates }: { updates: ProjectUpdate[] }) {
  if (updates.length === 0) return <EmptyState title="No updates yet">Your project lead posts progress notes here.</EmptyState>;
  return (
    <ol className="relative px-4 py-4">
      {updates.map((u, i) => (
        <li key={u.id} className="relative flex gap-4 pb-6 last:pb-0">
          {i < updates.length - 1 && <span aria-hidden className="absolute left-[3px] top-3 h-full w-px bg-border" />}
          <span aria-hidden className="relative mt-1.5 h-[7px] w-[7px] shrink-0 rounded-full bg-accent" />
          <article className="min-w-0 flex-1">
            <header className="flex flex-wrap items-baseline justify-between gap-x-3">
              <h3 className="font-medium">{u.title}</h3>
              <time dateTime={u.created_at} className="text-[12px] text-muted tabular-nums">
                {formatDate(u.created_at)}
              </time>
            </header>
            {u.body && <p className="pt-prose mt-1 text-muted">{u.body}</p>}
            <p className="mt-1 text-[12px] text-muted">{personName(u.author)}</p>
          </article>
        </li>
      ))}
    </ol>
  );
}
