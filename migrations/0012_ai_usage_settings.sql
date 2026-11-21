-- Daily AI consumption per person and model, for the admin usage page and the monthly budget.
CREATE TABLE IF NOT EXISTS ai_usage (
  day TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  org_id TEXT REFERENCES organizations (id) ON DELETE SET NULL,
  model TEXT NOT NULL,
  turns INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, user_id, model)
);
CREATE INDEX IF NOT EXISTS ai_usage_day_idx ON ai_usage (day);

-- Small runtime settings that staff change from the admin without a deploy.
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
