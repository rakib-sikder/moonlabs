-- A client describing a new project in their own words. Moonlab reads it, then either starts a
-- project from it (the brief stays linked and is shown on the project) or declines with a note.
-- The client's text is stored exactly as written and never edited by staff.
CREATE TABLE IF NOT EXISTS project_briefs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  project_id TEXT REFERENCES projects (id) ON DELETE SET NULL,
  created_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (length(title) BETWEEN 3 AND 160),
  goal TEXT NOT NULL,
  audience TEXT,
  features TEXT,
  examples TEXT,
  budget TEXT,
  deadline TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'accepted', 'declined', 'withdrawn')),
  staff_note TEXT,
  decided_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  decided_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS project_briefs_org_idx ON project_briefs (org_id, status, created_at);
CREATE INDEX IF NOT EXISTS project_briefs_project_idx ON project_briefs (project_id);
