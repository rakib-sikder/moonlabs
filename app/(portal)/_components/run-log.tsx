import type { AutomationRun } from "@/lib/portal/types";
import { formatDateTime, formatDuration, formatNumber, runStatusLabel, runTone } from "@/lib/portal/format";
import { Badge, EmptyState } from "./ui";

export function RunLog({ runs }: { runs: AutomationRun[] }) {
  if (runs.length === 0) return <EmptyState title="No runs logged yet">Runs appear here as soon as the automation starts working.</EmptyState>;
  return (
    <div className="pt-table-wrap">
      <table className="pt-table">
        <thead>
          <tr>
            <th scope="col">Started</th>
            <th scope="col">Status</th>
            <th scope="col" className="pt-num">
              Duration
            </th>
            <th scope="col" className="pt-num">
              Items
            </th>
            <th scope="col" className="pt-num">
              Min saved
            </th>
            <th scope="col">Message</th>
          </tr>
        </thead>
        <tbody>
          {runs.map((r) => (
            <tr key={r.id}>
              <td className="whitespace-nowrap tabular-nums">
                <time dateTime={r.started_at}>{formatDateTime(r.started_at)}</time>
              </td>
              <td>
                <Badge tone={runTone[r.status]}>{runStatusLabel[r.status]}</Badge>
              </td>
              <td className="pt-num pt-kbd-muted">{formatDuration(r.duration_ms)}</td>
              <td className="pt-num pt-kbd-muted">{r.items_processed === null ? "—" : formatNumber(r.items_processed)}</td>
              <td className="pt-num pt-kbd-muted">{formatNumber(r.minutes_saved)}</td>
              <td className="max-w-[360px] text-[12.5px] text-muted">
                <span className="line-clamp-2">{r.message ?? ""}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
