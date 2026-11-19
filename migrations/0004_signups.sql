-- Self-service sign-up. A sign-up is held here until the person clicks the confirmation link
-- in their email; only then are the user, their organization and the membership created.
-- Only the SHA-256 hash of the link token is stored.
CREATE TABLE IF NOT EXISTS signup_requests (
  token_hash TEXT PRIMARY KEY,
  email TEXT NOT NULL CHECK (email = lower(email) AND instr(email, '@') > 1),
  name TEXT NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  company TEXT CHECK (company IS NULL OR length(company) <= 120),
  password_hash TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  used_at TEXT,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS signup_requests_email_idx ON signup_requests (email);
