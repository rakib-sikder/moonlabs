-- AI provider keys managed from the admin. Only AES-GCM ciphertext is stored (SECRETS_KEY), bound
-- to the row id; `hint` keeps the last 4 characters so staff can tell keys apart. Enabled keys are
-- tried in priority order (lowest first); a failing key falls through to the next one.
CREATE TABLE IF NOT EXISTS ai_keys (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('groq', 'gemini', 'openai', 'openrouter')),
  label TEXT NOT NULL CHECK (length(label) BETWEEN 1 AND 80),
  model TEXT NOT NULL CHECK (length(model) BETWEEN 1 AND 120),
  ciphertext TEXT NOT NULL,
  iv TEXT NOT NULL,
  hint TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 10,
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  last_status TEXT NOT NULL DEFAULT 'untested' CHECK (last_status IN ('untested', 'ok', 'failing')),
  last_error TEXT,
  last_checked_at TEXT,
  created_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS ai_keys_order_idx ON ai_keys (enabled, priority);
