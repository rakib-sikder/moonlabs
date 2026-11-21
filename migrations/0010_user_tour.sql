-- When the user finished or skipped the portal guide. NULL = show it automatically once.
ALTER TABLE users ADD COLUMN tour_done_at TEXT;
