// Shared project writes, used by the admin "New project" form and by starting a project from a
// client's brief. Not a "use server" file, so it can export plain helpers.

import { STAGES } from "./format";
import type { ProjectStatus } from "./types";

export type NewProject = {
  id: string;
  orgId: string;
  name: string;
  summary: string | null;
  status: ProjectStatus;
  startedOn: string | null;
  targetOn: string | null;
};

/** The project row plus its five stages; the first stage starts when the project is active. */
export function projectInsertStatements(db: D1Database, p: NewProject): D1PreparedStatement[] {
  return [
    db
      .prepare("INSERT INTO projects (id, org_id, name, summary, status, started_on, target_on) VALUES (?, ?, ?, ?, ?, ?, ?)")
      .bind(p.id, p.orgId, p.name, p.summary, p.status, p.startedOn, p.targetOn),
    ...STAGES.map((stage, i) => {
      const first = i === 0 && p.status === "active";
      return db
        .prepare("INSERT INTO project_stages (id, project_id, org_id, stage, status, started_on) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(crypto.randomUUID(), p.id, p.orgId, stage, first ? "active" : "pending", first ? p.startedOn : null);
    }),
  ];
}
