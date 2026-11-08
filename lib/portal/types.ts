// Row shapes for the client portal. They mirror supabase/migrations/0001_portal.sql.
// Keep the two in sync when the schema changes.

export type MemberRole = "client" | "admin";
export type OrgPlan = "none" | "crescent" | "half_moon" | "full_moon" | "custom";
export type ProjectStatus = "active" | "on_hold" | "completed" | "cancelled";
export type StageKey = "audit" | "design" | "build" | "test" | "live";
export type StageStatus = "pending" | "active" | "done";
export type AutomationStatus = "healthy" | "warning" | "failing" | "paused";
export type RunStatus = "success" | "failed" | "running";
export type RequestStatus = "open" | "in_progress" | "waiting" | "resolved" | "closed";
export type RequestPriority = "low" | "normal" | "high" | "urgent";
export type InvoiceStatus = "draft" | "open" | "paid" | "overdue" | "void";

export type Organization = {
  id: string;
  name: string;
  plan: OrgPlan;
  plan_started_on: string | null;
  created_at: string;
};

export type Profile = {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_staff: boolean;
};

/** Minimal author info joined onto updates, requests and comments. */
export type PersonRef = Pick<Profile, "id" | "email" | "full_name" | "is_staff"> | null;

export type Membership = {
  user_id: string;
  org_id: string;
  role: MemberRole;
  created_at: string;
};

export type MemberWithProfile = Membership & { profile: PersonRef };

export type Invite = {
  id: string;
  org_id: string;
  email: string;
  role: MemberRole;
  created_at: string;
  accepted_at: string | null;
};

export type Project = {
  id: string;
  org_id: string;
  name: string;
  summary: string | null;
  status: ProjectStatus;
  started_on: string | null;
  target_on: string | null;
  created_at: string;
  updated_at: string;
};

export type ProjectStage = {
  id: string;
  project_id: string;
  org_id: string;
  stage: StageKey;
  status: StageStatus;
  started_on: string | null;
  due_on: string | null;
  completed_on: string | null;
  notes: string | null;
};

export type ProjectMilestone = {
  id: string;
  project_id: string;
  org_id: string;
  stage: StageKey | null;
  title: string;
  done: boolean;
  due_on: string | null;
  position: number;
};

export type ProjectUpdate = {
  id: string;
  project_id: string;
  org_id: string;
  title: string;
  body: string | null;
  created_at: string;
  author: PersonRef;
};

export type ProjectWithStages = Project & { stages: ProjectStage[] };

export type Automation = {
  id: string;
  org_id: string;
  project_id: string | null;
  name: string;
  description: string | null;
  trigger_label: string | null;
  status: AutomationStatus;
  minutes_saved_per_run: number;
  last_run_at: string | null;
  created_at: string;
};

export type AutomationRun = {
  id: string;
  automation_id: string;
  org_id: string;
  status: RunStatus;
  started_at: string;
  duration_ms: number | null;
  items_processed: number | null;
  minutes_saved: number;
  message: string | null;
};

export type AutomationWithStats = Automation & {
  runs7d: number;
  success7d: number;
  /** null when there were no finished runs in the window */
  successRate7d: number | null;
};

export type PortalRequest = {
  id: string;
  org_id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  priority: RequestPriority;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  author: PersonRef;
};

export type RequestComment = {
  id: string;
  request_id: string;
  body: string;
  created_at: string;
  author: PersonRef;
};

export type PortalFile = {
  id: string;
  org_id: string;
  project_id: string | null;
  name: string;
  storage_path: string;
  size_bytes: number | null;
  content_type: string | null;
  created_at: string;
  project: { id: string; name: string } | null;
};

export type Invoice = {
  id: string;
  org_id: string;
  number: string;
  issued_on: string;
  due_on: string | null;
  amount_cents: number;
  currency: string;
  status: InvoiceStatus;
  url: string | null;
  notes: string | null;
};

export type ActivityItem = {
  id: string;
  kind: "update" | "request" | "comment" | "run_failed" | "file" | "invoice";
  title: string;
  detail?: string;
  at: string;
  href?: string;
};

/** Returned by every portal server action and read by useActionState forms. */
export type ActionState = {
  ok: boolean;
  message?: string;
};
