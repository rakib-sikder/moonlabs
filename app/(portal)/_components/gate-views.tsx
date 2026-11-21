import { formatDate, gateKindLabel, gateStatusLabel, gateTone, personName } from "@/lib/portal/format";
import type { ProjectGate } from "@/lib/portal/types";
import { Badge } from "./ui";

/** What the client is asked to check: details and the link to the work. */
export function GateBody({ gate }: { gate: ProjectGate }) {
  return (
    <>
      {gate.details && <p className="pt-prose mt-2 whitespace-pre-wrap break-words">{gate.details}</p>}
      {gate.link_url && (
        <p className="mt-2">
          <a href={gate.link_url} target="_blank" rel="noopener noreferrer" className="pt-link break-all">
            Open the {gateKindLabel[gate.kind].toLowerCase()}
          </a>
        </p>
      )}
    </>
  );
}

/** Every answered or withdrawn gate, newest first: the record of what was approved and when. */
export function GateHistory({ gates }: { gates: ProjectGate[] }) {
  if (gates.length === 0) return null;
  return (
    <ul className="divide-y divide-border">
      {gates.map((g) => (
        <li key={g.id} className="px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="min-w-0 font-medium">
              <span className="text-muted">{gateKindLabel[g.kind]}:</span> {g.title}
            </p>
            <Badge tone={gateTone[g.status]}>{gateStatusLabel[g.status]}</Badge>
          </div>
          <p className="text-[12.5px] text-muted">
            Sent {formatDate(g.created_at)}
            {g.decided_at && g.status !== "cancelled" && ` · ${g.status === "approved" ? "Approved" : "Answered"} ${formatDate(g.decided_at)} by ${personName(g.decider)}`}
          </p>
          {g.link_url && (
            <a href={g.link_url} target="_blank" rel="noopener noreferrer" className="pt-link text-[12.5px] break-all">
              {g.link_url}
            </a>
          )}
          {g.client_note && <p className="pt-prose mt-1 whitespace-pre-wrap text-[13px]">“{g.client_note}”</p>}
        </li>
      ))}
    </ul>
  );
}
