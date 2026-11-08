-- Moonlabs client portal: schema, helper functions, row-level security and storage.
--
-- Access model
--   * Every client company is an `organization`. People belong to organizations through
--     `memberships` with role 'client' or 'admin'.
--   * Agency staff are either admins of a specific organization (membership role 'admin')
--     or global staff (`profiles.is_staff = true`, set by hand in the SQL editor).
--   * Clients can READ their own organization's rows and CREATE requests and request
--     comments. Everything else is written by admins/staff.
--   * No service-role key is needed by the app: every query runs as the signed-in user and
--     these policies decide what they can see and change.
--
-- Run once in the Supabase SQL editor (or `supabase db push`). Safe to read top to bottom.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.member_role as enum ('client', 'admin');
create type public.org_plan as enum ('none', 'crescent', 'half_moon', 'full_moon', 'custom');
create type public.project_status as enum ('active', 'on_hold', 'completed', 'cancelled');
create type public.stage_key as enum ('audit', 'design', 'build', 'test', 'live');
create type public.stage_status as enum ('pending', 'active', 'done');
create type public.automation_status as enum ('healthy', 'warning', 'failing', 'paused');
create type public.run_status as enum ('success', 'failed', 'running');
create type public.request_status as enum ('open', 'in_progress', 'waiting', 'resolved', 'closed');
create type public.request_priority as enum ('low', 'normal', 'high', 'urgent');
create type public.invoice_status as enum ('draft', 'open', 'paid', 'overdue', 'void');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 120),
  plan public.org_plan not null default 'none',
  plan_started_on date,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  is_staff boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.memberships (
  user_id uuid not null references public.profiles (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  role public.member_role not null default 'client',
  created_at timestamptz not null default now(),
  primary key (user_id, org_id)
);
create index memberships_org_idx on public.memberships (org_id);

-- Pending invitations. When someone signs in with an invited email address they are added
-- to the organization automatically (see handle_new_user / claim_invites below).
create table public.invites (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  email text not null check (email = lower(email) and position('@' in email) > 1),
  role public.member_role not null default 'client',
  invited_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  unique (org_id, email)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  name text not null check (char_length(name) between 1 and 160),
  summary text,
  status public.project_status not null default 'active',
  started_on date,
  target_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index projects_org_idx on public.projects (org_id);

-- One row per stage per project (Audit -> Design -> Build -> Test -> Live).
create table public.project_stages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  stage public.stage_key not null,
  status public.stage_status not null default 'pending',
  started_on date,
  due_on date,
  completed_on date,
  notes text,
  unique (project_id, stage)
);
create index project_stages_org_idx on public.project_stages (org_id);

-- Checklist items inside a project, optionally tied to a stage.
create table public.project_milestones (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  stage public.stage_key,
  title text not null check (char_length(title) between 1 and 200),
  done boolean not null default false,
  due_on date,
  position integer not null default 0,
  created_at timestamptz not null default now()
);
create index project_milestones_project_idx on public.project_milestones (project_id);

create table public.project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  body text,
  created_at timestamptz not null default now()
);
create index project_updates_org_idx on public.project_updates (org_id, created_at desc);

create table public.automations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  name text not null check (char_length(name) between 1 and 160),
  description text,
  trigger_label text,
  status public.automation_status not null default 'healthy',
  minutes_saved_per_run integer not null default 0 check (minutes_saved_per_run >= 0),
  last_run_at timestamptz,
  created_at timestamptz not null default now()
);
create index automations_org_idx on public.automations (org_id);

create table public.automation_runs (
  id uuid primary key default gen_random_uuid(),
  automation_id uuid not null references public.automations (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  status public.run_status not null,
  started_at timestamptz not null default now(),
  duration_ms integer check (duration_ms >= 0),
  items_processed integer check (items_processed >= 0),
  minutes_saved integer not null default 0 check (minutes_saved >= 0),
  message text,
  created_at timestamptz not null default now()
);
create index automation_runs_org_started_idx on public.automation_runs (org_id, started_at desc);
create index automation_runs_automation_idx on public.automation_runs (automation_id, started_at desc);

create table public.requests (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  title text not null check (char_length(title) between 1 and 200),
  description text check (char_length(description) <= 10000),
  priority public.request_priority not null default 'normal',
  status public.request_status not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index requests_org_idx on public.requests (org_id, updated_at desc);

create table public.request_comments (
  id uuid primary key default gen_random_uuid(),
  request_id uuid not null references public.requests (id) on delete cascade,
  org_id uuid not null references public.organizations (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  body text not null check (char_length(body) between 1 and 10000),
  created_at timestamptz not null default now()
);
create index request_comments_request_idx on public.request_comments (request_id, created_at);

-- Deliverables. The bytes live in the private `deliverables` storage bucket under
-- `<org_id>/<random>-<filename>`; this table is the catalogue.
create table public.files (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  name text not null check (char_length(name) between 1 and 255),
  storage_path text not null unique,
  size_bytes bigint check (size_bytes >= 0),
  content_type text,
  uploaded_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);
create index files_org_idx on public.files (org_id, created_at desc);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations (id) on delete cascade,
  number text not null check (char_length(number) between 1 and 40),
  issued_on date not null default current_date,
  due_on date,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  status public.invoice_status not null default 'open',
  url text check (url is null or url ~* '^https?://'),
  notes text,
  created_at timestamptz not null default now(),
  unique (org_id, number)
);
create index invoices_org_idx on public.invoices (org_id, issued_on desc);

-- ---------------------------------------------------------------------------
-- Helper functions (SECURITY DEFINER so policies can call them without recursion)
-- ---------------------------------------------------------------------------
create or replace function public.is_staff()
returns boolean
language sql stable security definer set search_path = ''
as $$
  select coalesce((select p.is_staff from public.profiles p where p.id = auth.uid()), false);
$$;

create or replace function public.is_org_member(target_org uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.is_staff() or exists (
    select 1 from public.memberships m
    where m.org_id = target_org and m.user_id = auth.uid()
  );
$$;

create or replace function public.is_org_admin(target_org uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select public.is_staff() or exists (
    select 1 from public.memberships m
    where m.org_id = target_org and m.user_id = auth.uid() and m.role = 'admin'
  );
$$;

-- True when the current user and `other` share at least one organization (used so clients
-- can see the names of teammates and of the agency people answering their requests).
create or replace function public.shares_org_with(other uuid)
returns boolean
language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1
    from public.memberships mine
    join public.memberships theirs on theirs.org_id = mine.org_id
    where mine.user_id = auth.uid() and theirs.user_id = other
  ) or exists (select 1 from public.profiles p where p.id = other and p.is_staff);
$$;

-- Parses a uuid without throwing (storage object paths are user-supplied text).
create or replace function public.try_uuid(value text)
returns uuid
language plpgsql immutable
set search_path = ''
as $$
begin
  return value::uuid;
exception when others then
  return null;
end;
$$;

-- Child rows copy org_id from their parent so RLS can check one column.
create or replace function public.set_org_from_project()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  select p.org_id into new.org_id from public.projects p where p.id = new.project_id;
  if new.org_id is null then
    raise exception 'project % not found', new.project_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_org_from_automation()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  select a.org_id into new.org_id from public.automations a where a.id = new.automation_id;
  if new.org_id is null then
    raise exception 'automation % not found', new.automation_id;
  end if;
  return new;
end;
$$;

create or replace function public.set_org_from_request()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  select r.org_id into new.org_id from public.requests r where r.id = new.request_id;
  if new.org_id is null then
    raise exception 'request % not found', new.request_id;
  end if;
  return new;
end;
$$;

create trigger project_stages_org before insert or update of project_id on public.project_stages
  for each row execute function public.set_org_from_project();
create trigger project_milestones_org before insert or update of project_id on public.project_milestones
  for each row execute function public.set_org_from_project();
create trigger project_updates_org before insert or update of project_id on public.project_updates
  for each row execute function public.set_org_from_project();
create trigger automation_runs_org before insert or update of automation_id on public.automation_runs
  for each row execute function public.set_org_from_automation();
create trigger request_comments_org before insert or update of request_id on public.request_comments
  for each row execute function public.set_org_from_request();

-- Keep automations.last_run_at current when runs are logged.
create or replace function public.touch_automation_last_run()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.automations
     set last_run_at = greatest(coalesce(last_run_at, new.started_at), new.started_at)
   where id = new.automation_id;
  return new;
end;
$$;
create trigger automation_runs_touch after insert on public.automation_runs
  for each row execute function public.touch_automation_last_run();

-- Bump requests.updated_at on every new comment (clients cannot update requests directly).
create or replace function public.touch_request()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  update public.requests set updated_at = now() where id = new.request_id;
  return new;
end;
$$;
create trigger request_comments_touch after insert on public.request_comments
  for each row execute function public.touch_request();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
create trigger projects_updated_at before update on public.projects
  for each row execute function public.touch_updated_at();
create trigger requests_updated_at before update on public.requests
  for each row execute function public.touch_updated_at();

-- New auth user -> profile row, plus memberships for any pending invites for that email.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do nothing;

  if new.email is not null then
    insert into public.memberships (user_id, org_id, role)
    select new.id, i.org_id, i.role
    from public.invites i
    where i.email = lower(new.email) and i.accepted_at is null
    on conflict (user_id, org_id) do nothing;

    update public.invites
       set accepted_at = now()
     where email = lower(new.email) and accepted_at is null;
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- For people who already had an account when they were invited: the app calls this after
-- every sign-in. Returns the number of organizations joined.
create or replace function public.claim_invites()
returns integer
language plpgsql security definer set search_path = ''
as $$
declare
  user_email text;
  joined integer;
begin
  if auth.uid() is null then
    return 0;
  end if;
  select lower(u.email) into user_email from auth.users u where u.id = auth.uid();
  if user_email is null then
    return 0;
  end if;

  insert into public.profiles (id, email) values (auth.uid(), user_email)
  on conflict (id) do nothing;

  insert into public.memberships (user_id, org_id, role)
  select auth.uid(), i.org_id, i.role
  from public.invites i
  where i.email = user_email and i.accepted_at is null
  on conflict (user_id, org_id) do nothing;
  get diagnostics joined = row_count;

  update public.invites set accepted_at = now()
   where email = user_email and accepted_at is null;
  return joined;
end;
$$;

revoke execute on function public.claim_invites() from public, anon;
grant execute on function public.claim_invites() to authenticated;

-- ---------------------------------------------------------------------------
-- Row-level security
-- ---------------------------------------------------------------------------
alter table public.organizations enable row level security;
alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.invites enable row level security;
alter table public.projects enable row level security;
alter table public.project_stages enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_updates enable row level security;
alter table public.automations enable row level security;
alter table public.automation_runs enable row level security;
alter table public.requests enable row level security;
alter table public.request_comments enable row level security;
alter table public.files enable row level security;
alter table public.invoices enable row level security;

-- Organizations
create policy "orgs: members read" on public.organizations
  for select to authenticated using (public.is_org_member(id));
create policy "orgs: staff create" on public.organizations
  for insert to authenticated with check (public.is_staff());
create policy "orgs: admins update" on public.organizations
  for update to authenticated using (public.is_org_admin(id)) with check (public.is_org_admin(id));
create policy "orgs: staff delete" on public.organizations
  for delete to authenticated using (public.is_staff());

-- Profiles: read yourself, teammates and agency staff; edit only your own name/avatar.
create policy "profiles: read related" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_staff() or public.shares_org_with(id));
create policy "profiles: update own" on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
revoke insert, update, delete on public.profiles from anon, authenticated;
grant update (full_name, avatar_url) on public.profiles to authenticated;

-- Memberships
create policy "memberships: read own or as admin" on public.memberships
  for select to authenticated using (user_id = auth.uid() or public.is_org_admin(org_id));
create policy "memberships: admins manage" on public.memberships
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- Invites (admins only)
create policy "invites: admins manage" on public.invites
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- Org-scoped content: members read, admins write.
create policy "projects: members read" on public.projects
  for select to authenticated using (public.is_org_member(org_id));
create policy "projects: admins manage" on public.projects
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "stages: members read" on public.project_stages
  for select to authenticated using (public.is_org_member(org_id));
create policy "stages: admins manage" on public.project_stages
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "milestones: members read" on public.project_milestones
  for select to authenticated using (public.is_org_member(org_id));
create policy "milestones: admins manage" on public.project_milestones
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "updates: members read" on public.project_updates
  for select to authenticated using (public.is_org_member(org_id));
create policy "updates: admins manage" on public.project_updates
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "automations: members read" on public.automations
  for select to authenticated using (public.is_org_member(org_id));
create policy "automations: admins manage" on public.automations
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "runs: members read" on public.automation_runs
  for select to authenticated using (public.is_org_member(org_id));
create policy "runs: admins manage" on public.automation_runs
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- Requests: members read and open new ones (always as themselves, always 'open').
create policy "requests: members read" on public.requests
  for select to authenticated using (public.is_org_member(org_id));
create policy "requests: members create" on public.requests
  for insert to authenticated
  with check (
    public.is_org_member(org_id)
    and created_by = auth.uid()
    and status = 'open'
    and (
      project_id is null
      or exists (select 1 from public.projects p where p.id = project_id and p.org_id = requests.org_id)
    )
  );
create policy "requests: admins manage" on public.requests
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "comments: members read" on public.request_comments
  for select to authenticated using (public.is_org_member(org_id));
create policy "comments: members create" on public.request_comments
  for insert to authenticated
  with check (public.is_org_member(org_id) and author_id = auth.uid());
create policy "comments: admins manage" on public.request_comments
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

create policy "files: members read" on public.files
  for select to authenticated using (public.is_org_member(org_id));
create policy "files: admins manage" on public.files
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- Invoices: clients never see drafts.
create policy "invoices: members read" on public.invoices
  for select to authenticated
  using (public.is_org_admin(org_id) or (public.is_org_member(org_id) and status <> 'draft'));
create policy "invoices: admins manage" on public.invoices
  for all to authenticated using (public.is_org_admin(org_id)) with check (public.is_org_admin(org_id));

-- ---------------------------------------------------------------------------
-- Storage: private `deliverables` bucket, first path segment = organization id.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit)
values ('deliverables', 'deliverables', false, 52428800) -- 50 MB per file
on conflict (id) do nothing;

create policy "deliverables: members read" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'deliverables'
    and public.is_org_member(public.try_uuid((storage.foldername(name))[1]))
  );
create policy "deliverables: admins upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'deliverables'
    and public.is_org_admin(public.try_uuid((storage.foldername(name))[1]))
  );
create policy "deliverables: admins update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'deliverables'
    and public.is_org_admin(public.try_uuid((storage.foldername(name))[1]))
  );
create policy "deliverables: admins delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'deliverables'
    and public.is_org_admin(public.try_uuid((storage.foldername(name))[1]))
  );
