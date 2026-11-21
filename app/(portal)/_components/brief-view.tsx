import { formatDate, personName } from "@/lib/portal/format";
import type { ProjectBrief } from "@/lib/portal/types";

/** The client's brief, shown exactly as they wrote it. */
export function BriefView({ brief }: { brief: ProjectBrief }) {
  const sections: [string, string | null][] = [
    ["What they want built", brief.goal],
    ["Who will use it", brief.audience],
    ["Must-have features", brief.features],
    ["Examples and links", brief.examples],
  ];
  return (
    <div className="space-y-5">
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-[13.5px] sm:grid-cols-4">
        <div>
          <dt className="text-[12px] text-muted">Sent by</dt>
          <dd>{personName(brief.author)}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-muted">Sent on</dt>
          <dd>{formatDate(brief.created_at)}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-muted">Budget</dt>
          <dd>{brief.budget || "Not given"}</dd>
        </div>
        <div>
          <dt className="text-[12px] text-muted">Deadline</dt>
          <dd>{brief.deadline ? formatDate(brief.deadline) : "Not given"}</dd>
        </div>
      </dl>
      {brief.source === "assistant" && (
        <p className="rounded-md bg-surface-2 px-3 py-2 text-[12.5px]">
          Written with the Moonlab assistant.
          {brief.estimate && (
            <>
              {" "}
              Estimate shown: <b>{brief.estimate}</b> (not a quote).
            </>
          )}
        </p>
      )}
      {sections
        .filter(([, v]) => v)
        .map(([label, value]) => (
          <section key={label}>
            <h3 className="mb-1 text-[12.5px] font-medium text-muted">{label}</h3>
            <p className="pt-prose whitespace-pre-wrap break-words">{value}</p>
          </section>
        ))}
    </div>
  );
}
