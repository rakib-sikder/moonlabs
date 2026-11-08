-- DEMO DATA FOR LOCAL TESTING ONLY. Every name, number and email here is made up.
-- Do not run this against the production project.
--
-- It creates one fake client organization with a project, automations, runs, requests,
-- invoices and a pending invite for demo-client@example.com. Sign in with that address
-- (local Supabase shows the magic-link email in Inbucket/Mailpit) to see the client view.
-- Dates are relative to now() so the dashboard always looks recent.

insert into public.organizations (id, name, plan, plan_started_on) values
  ('00000000-0000-4000-a000-000000000001', 'Demo Bakery Co. (DEMO)', 'half_moon', current_date - 75)
on conflict (id) do nothing;

insert into public.invites (org_id, email, role) values
  ('00000000-0000-4000-a000-000000000001', 'demo-client@example.com', 'client')
on conflict (org_id, email) do nothing;

insert into public.projects (id, org_id, name, summary, status, started_on, target_on) values
  ('00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001',
   'Order intake automation',
   'Web and email orders land in one sheet, get confirmed automatically and reach the kitchen board.',
   'active', current_date - 40, current_date + 10),
  ('00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001',
   'Supplier invoice capture',
   'Read supplier PDFs from the shared inbox and push line items into the accounting tool.',
   'completed', current_date - 120, current_date - 70)
on conflict (id) do nothing;

insert into public.project_stages (project_id, stage, status, started_on, due_on, completed_on) values
  ('00000000-0000-4000-b000-000000000001', 'audit',  'done',    current_date - 40, current_date - 35, current_date - 34),
  ('00000000-0000-4000-b000-000000000001', 'design', 'done',    current_date - 34, current_date - 26, current_date - 25),
  ('00000000-0000-4000-b000-000000000001', 'build',  'active',  current_date - 25, current_date + 2,  null),
  ('00000000-0000-4000-b000-000000000001', 'test',   'pending', null,              current_date + 7,  null),
  ('00000000-0000-4000-b000-000000000001', 'live',   'pending', null,              current_date + 10, null),
  ('00000000-0000-4000-b000-000000000002', 'audit',  'done',    current_date - 120, null, current_date - 115),
  ('00000000-0000-4000-b000-000000000002', 'design', 'done',    current_date - 115, null, current_date - 105),
  ('00000000-0000-4000-b000-000000000002', 'build',  'done',    current_date - 105, null, current_date - 85),
  ('00000000-0000-4000-b000-000000000002', 'test',   'done',    current_date - 85,  null, current_date - 75),
  ('00000000-0000-4000-b000-000000000002', 'live',   'done',    current_date - 75,  null, current_date - 70)
on conflict (project_id, stage) do nothing;

insert into public.project_milestones (project_id, stage, title, done, due_on, position) values
  ('00000000-0000-4000-b000-000000000001', 'audit',  'Map current order sources', true,  current_date - 36, 1),
  ('00000000-0000-4000-b000-000000000001', 'design', 'Agree on confirmation email copy', true, current_date - 27, 2),
  ('00000000-0000-4000-b000-000000000001', 'build',  'Connect web shop webhook', true,  current_date - 15, 3),
  ('00000000-0000-4000-b000-000000000001', 'build',  'Parse emailed orders', false, current_date + 1, 4),
  ('00000000-0000-4000-b000-000000000001', 'test',   'Two-day parallel run with manual process', false, current_date + 6, 5),
  ('00000000-0000-4000-b000-000000000001', 'live',   'Team walkthrough and handover docs', false, current_date + 10, 6);

insert into public.project_updates (project_id, title, body, created_at) values
  ('00000000-0000-4000-b000-000000000001', 'Kickoff and audit done',
   'We mapped four order sources and agreed the kitchen board is the single source of truth.', now() - interval '34 days'),
  ('00000000-0000-4000-b000-000000000001', 'Design approved',
   'Flow diagram and confirmation email signed off. Starting the build.', now() - interval '25 days'),
  ('00000000-0000-4000-b000-000000000001', 'Web shop orders flowing',
   'Web orders now reach the sheet within a minute. Email parsing is next.', now() - interval '3 days');

insert into public.automations (id, org_id, project_id, name, description, trigger_label, status, minutes_saved_per_run) values
  ('00000000-0000-4000-c000-000000000001', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-b000-000000000001',
   'Web order to kitchen board', 'Copies each paid web order into the sheet and posts it to the kitchen board.',
   'Webhook: new paid order', 'healthy', 4),
  ('00000000-0000-4000-c000-000000000002', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-b000-000000000002',
   'Supplier invoice capture', 'Reads supplier PDFs and creates draft bills in accounting.',
   'Every 30 minutes', 'warning', 6),
  ('00000000-0000-4000-c000-000000000003', '00000000-0000-4000-a000-000000000001', null,
   'Weekly sales digest', 'Monday summary of last week''s sales sent to the owners.',
   'Mondays 08:00', 'paused', 20)
on conflict (id) do nothing;

-- ~10 days of runs: web orders several times a day, invoice capture with a few failures.
insert into public.automation_runs (automation_id, status, started_at, duration_ms, items_processed, minutes_saved, message)
select '00000000-0000-4000-c000-000000000001', 'success',
       now() - (g * interval '5 hours'), 1200 + (g * 37) % 900, 1, 4, null
from generate_series(1, 48) as g;

insert into public.automation_runs (automation_id, status, started_at, duration_ms, items_processed, minutes_saved, message)
select '00000000-0000-4000-c000-000000000002',
       case when g % 9 = 0 then 'failed'::public.run_status else 'success'::public.run_status end,
       now() - (g * interval '7 hours'), 4000 + (g * 53) % 3000,
       case when g % 9 = 0 then 0 else 1 + g % 3 end,
       case when g % 9 = 0 then 0 else 6 end,
       case when g % 9 = 0 then 'Supplier PDF had no readable text layer' else null end
from generate_series(1, 34) as g;

insert into public.requests (id, org_id, project_id, title, description, priority, status, created_at) values
  ('00000000-0000-4000-d000-000000000001', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-b000-000000000001',
   'Add catering orders to the board', 'Catering orders come from a separate form. Can they show up too?', 'normal', 'in_progress', now() - interval '6 days'),
  ('00000000-0000-4000-d000-000000000002', '00000000-0000-4000-a000-000000000001', null,
   'Invoice from Flour Supply Ltd not captured', 'The PDF from last Tuesday never showed up as a draft bill.', 'high', 'open', now() - interval '1 day')
on conflict (id) do nothing;

insert into public.request_comments (request_id, body, created_at) values
  ('00000000-0000-4000-d000-000000000001', 'Yes. We will add the catering form as a second source this week.', now() - interval '5 days');

insert into public.invoices (org_id, number, issued_on, due_on, amount_cents, currency, status, url) values
  ('00000000-0000-4000-a000-000000000001', 'DEMO-0001', current_date - 75, current_date - 61, 49000, 'USD', 'paid', 'https://example.com/invoices/demo-0001'),
  ('00000000-0000-4000-a000-000000000001', 'DEMO-0002', current_date - 45, current_date - 31, 49000, 'USD', 'paid', 'https://example.com/invoices/demo-0002'),
  ('00000000-0000-4000-a000-000000000001', 'DEMO-0003', current_date - 15, current_date - 1,  49000, 'USD', 'open', 'https://example.com/invoices/demo-0003'),
  ('00000000-0000-4000-a000-000000000001', 'DEMO-0004', current_date,      current_date + 14, 49000, 'USD', 'draft', null)
on conflict (org_id, number) do nothing;
