-- Client approval gates. Moonlab asks the client to approve a spec, a mockup or a release; the
-- client approves or asks for changes with a reason. While the latest gate for a stage is not
-- approved, that stage cannot be started. Rows are kept as the record of every decision.
CREATE TABLE IF NOT EXISTS project_gates (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  kind TEXT NOT NULL CHECK (kind IN ('spec', 'mockup', 'release')),
  title TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 200),
  details TEXT,
  link_url TEXT,
  status TEXT NOT NULL DEFAULT 'waiting' CHECK (status IN ('waiting', 'approved', 'changes_requested', 'cancelled')),
  client_note TEXT,
  created_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  decided_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  decided_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS project_gates_project_idx ON project_gates (project_id, kind, created_at);
CREATE INDEX IF NOT EXISTS project_gates_org_idx ON project_gates (org_id, status);
