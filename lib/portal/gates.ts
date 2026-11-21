// Approval-gate rules shared by the admin and client actions. Not a "use server" file.

import { GATE_KINDS, gateKindLabel, gateUnlocks } from "./format";
import type { GateKind, StageKey } from "./types";

/**
 * The gate that keeps a stage from starting, if any: the newest gate (not withdrawn) that
 * unlocks this stage and is not approved. A stage no gate unlocks is never blocked, and a
 * project without gates works exactly as before.
 */
export async function blockingGate(
  db: D1Database,
  orgId: string,
  projectId: string,
  stage: StageKey,
): Promise<{ kind: GateKind; title: string; status: string } | null> {
  const kind = GATE_KINDS.find((k) => gateUnlocks[k] === stage);
  if (!kind) return null;
  const row = await db
    .prepare(
      `SELECT kind, title, status FROM project_gates
        WHERE org_id = ? AND project_id = ? AND kind = ? AND status <> 'cancelled'
        ORDER BY created_at DESC LIMIT 1`,
    )
    .bind(orgId, projectId, kind)
    .first<{ kind: GateKind; title: string; status: string }>();
  if (!row || row.status === "approved") return null;
  return { kind: row.kind, title: String(row.title), status: String(row.status) };
}

export function blockedMessage(stageName: string, gate: { kind: GateKind; title: string; status: string }): string {
  return gate.status === "waiting"
    ? `${stageName} cannot start yet: the client has not approved the ${gateKindLabel[gate.kind].toLowerCase()} "${gate.title}".`
    : `${stageName} cannot start yet: the client asked for changes to the ${gateKindLabel[gate.kind].toLowerCase()} "${gate.title}". Send a new version for approval first.`;
}
