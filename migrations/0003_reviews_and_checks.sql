-- Client reviews, sent through /review. Every review waits as 'pending' until staff approve it
-- in the portal admin; only approved reviews are ever shown on the site.
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT,
  company TEXT,
  website TEXT,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  quote TEXT NOT NULL,
  project TEXT,
  consent INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TEXT NOT NULL,
  reviewed_at TEXT
);
CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status, created_at DESC);

-- Website checker (/website-checker). One row per check: the result is cached for a day per
-- address, and the rows double as a log of which sites were checked (and by how many IPs).
CREATE TABLE IF NOT EXISTS site_checks (
  id TEXT PRIMARY KEY,
  url_key TEXT NOT NULL,
  url TEXT NOT NULL,
  result TEXT NOT NULL,
  ip_hash TEXT,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS site_checks_url_idx ON site_checks (url_key, created_at DESC);
CREATE INDEX IF NOT EXISTS site_checks_ip_idx ON site_checks (ip_hash, created_at DESC);
