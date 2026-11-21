-- A milestone can be marked blocked: who it is waiting on and why. Cleared when unblocked or done.
ALTER TABLE project_milestones ADD COLUMN blocked_on TEXT CHECK (blocked_on IS NULL OR blocked_on IN ('client', 'moonlab', 'third_party'));
ALTER TABLE project_milestones ADD COLUMN blocked_reason TEXT;
ALTER TABLE project_milestones ADD COLUMN blocked_since TEXT;
CREATE INDEX IF NOT EXISTS project_milestones_blocked_idx ON project_milestones (org_id, blocked_on);
