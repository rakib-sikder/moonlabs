-- Secrets a client hands over for a project (API keys, logins). Moonlab lists what it needs
-- (status 'requested'), the client fills each one in ('provided'). Only AES-GCM ciphertext is
-- stored; the key is the Worker secret SECRETS_KEY. Rows are deleted when the client removes
-- them, when staff delete them, and when the project is completed or cancelled.
CREATE TABLE IF NOT EXISTS project_secrets (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL REFERENCES projects (id) ON DELETE CASCADE,
  org_id TEXT NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  label TEXT NOT NULL CHECK (length(label) BETWEEN 2 AND 120),
  hint TEXT,
  status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested', 'provided')),
  ciphertext TEXT,
  iv TEXT,
  requested_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  provided_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  provided_at TEXT,
  reveal_count INTEGER NOT NULL DEFAULT 0,
  last_revealed_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  last_revealed_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK ((status = 'provided') = (ciphertext IS NOT NULL AND iv IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS project_secrets_project_idx ON project_secrets (project_id, created_at);
