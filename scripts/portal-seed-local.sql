-- DEMO DATA FOR LOCAL TESTING ONLY. Every name, number and email here is made up.
-- Never run this against the production database (no --remote).
--
--   npx wrangler d1 migrations apply moonlabs-portal --local
--   npx wrangler d1 execute moonlabs-portal --local --file=scripts/portal-seed-local.sql
--
-- Creates two fake client organizations, "Demo Bakery Co. (DEMO)" with a project,
-- automations, runs, requests and invoices, and "Demo Florist (DEMO)" with a little data
-- (handy for checking that one client cannot see the other). It also adds two invites with
-- fixed, publicly known tokens, so they only make sense locally:
--   /invite/local-demo-client-invite-0001   demo-client@example.com  -> Demo Bakery (client)
--   /invite/local-demo-florist-invite-0001  demo-florist@example.com -> Demo Florist (client)
-- Dates are relative to now so the dashboard always looks recent.

INSERT OR IGNORE INTO organizations (id, name, plan, plan_started_on) VALUES
  ('00000000-0000-4000-a000-000000000001', 'Demo Bakery Co. (DEMO)', 'half_moon', date('now', '-75 days')),
  ('00000000-0000-4000-a000-000000000002', 'Demo Florist (DEMO)', 'crescent', date('now', '-20 days'));

INSERT OR IGNORE INTO invites (id, token_hash, email, org_id, role, is_staff, expires_at) VALUES
  ('00000000-0000-4000-f000-000000000001', 'f0bb1099e6dbcb51b922bbd81e0d8e96281b2f5e9042aa96da0d4f61254a31dc',
   'demo-client@example.com', '00000000-0000-4000-a000-000000000001', 'client', 0, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '+7 days')),
  ('00000000-0000-4000-f000-000000000002', 'b0aef77bee789f7218ce3de2589f9daac89547a11a1217e7b3cf960b2a9533b3',
   'demo-florist@example.com', '00000000-0000-4000-a000-000000000002', 'client', 0, strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '+7 days'));

INSERT OR IGNORE INTO projects (id, org_id, name, summary, status, started_on, target_on) VALUES
  ('00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001',
   'Order intake automation',
   'Web and email orders land in one sheet, get confirmed automatically and reach the kitchen board.',
   'active', date('now', '-40 days'), date('now', '+10 days')),
  ('00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001',
   'Supplier invoice capture',
   'Read supplier PDFs from the shared inbox and push line items into the accounting tool.',
   'completed', date('now', '-120 days'), date('now', '-70 days')),
  ('00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000002',
   'Wedding enquiry follow-up',
   'Reply to wedding enquiries within the hour and book consultations automatically.',
   'active', date('now', '-10 days'), date('now', '+20 days'));

INSERT OR IGNORE INTO project_stages (id, project_id, org_id, stage, status, started_on, due_on, completed_on) VALUES
  ('00000000-0000-4000-b100-000000000001', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'audit',  'done',    date('now', '-40 days'), date('now', '-35 days'), date('now', '-34 days')),
  ('00000000-0000-4000-b100-000000000002', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'design', 'done',    date('now', '-34 days'), date('now', '-26 days'), date('now', '-25 days')),
  ('00000000-0000-4000-b100-000000000003', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'build',  'active',  date('now', '-25 days'), date('now', '+2 days'),  NULL),
  ('00000000-0000-4000-b100-000000000004', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'test',   'pending', NULL,                    date('now', '+7 days'),  NULL),
  ('00000000-0000-4000-b100-000000000005', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'live',   'pending', NULL,                    date('now', '+10 days'), NULL),
  ('00000000-0000-4000-b100-000000000006', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001', 'audit',  'done', date('now', '-120 days'), NULL, date('now', '-115 days')),
  ('00000000-0000-4000-b100-000000000007', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001', 'design', 'done', date('now', '-115 days'), NULL, date('now', '-105 days')),
  ('00000000-0000-4000-b100-000000000008', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001', 'build',  'done', date('now', '-105 days'), NULL, date('now', '-85 days')),
  ('00000000-0000-4000-b100-000000000009', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001', 'test',   'done', date('now', '-85 days'),  NULL, date('now', '-75 days')),
  ('00000000-0000-4000-b100-000000000010', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001', 'live',   'done', date('now', '-75 days'),  NULL, date('now', '-70 days')),
  ('00000000-0000-4000-b100-000000000011', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000002', 'audit',  'active',  date('now', '-10 days'), date('now', '-2 days'), NULL),
  ('00000000-0000-4000-b100-000000000012', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000002', 'design', 'pending', NULL, NULL, NULL),
  ('00000000-0000-4000-b100-000000000013', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000002', 'build',  'pending', NULL, NULL, NULL),
  ('00000000-0000-4000-b100-000000000014', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000002', 'test',   'pending', NULL, NULL, NULL),
  ('00000000-0000-4000-b100-000000000015', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000002', 'live',   'pending', NULL, NULL, NULL);

INSERT OR IGNORE INTO project_milestones (id, project_id, org_id, stage, title, done, due_on, position) VALUES
  ('00000000-0000-4000-b200-000000000001', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'audit',  'Map current order sources', 1, date('now', '-36 days'), 1),
  ('00000000-0000-4000-b200-000000000002', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'design', 'Agree on confirmation email copy', 1, date('now', '-27 days'), 2),
  ('00000000-0000-4000-b200-000000000003', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'build',  'Connect web shop webhook', 1, date('now', '-15 days'), 3),
  ('00000000-0000-4000-b200-000000000004', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'build',  'Parse emailed orders', 0, date('now', '+1 days'), 4),
  ('00000000-0000-4000-b200-000000000005', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'test',   'Two-day parallel run with manual process', 0, date('now', '+6 days'), 5),
  ('00000000-0000-4000-b200-000000000006', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'live',   'Team walkthrough and handover docs', 0, date('now', '+10 days'), 6);

INSERT OR IGNORE INTO project_updates (id, project_id, org_id, title, body, created_at) VALUES
  ('00000000-0000-4000-b300-000000000001', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'Kickoff and audit done',
   'We mapped four order sources and agreed the kitchen board is the single source of truth.', strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-34 days')),
  ('00000000-0000-4000-b300-000000000002', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'Design approved',
   'Flow diagram and confirmation email signed off. Starting the build.', strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-25 days')),
  ('00000000-0000-4000-b300-000000000003', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'Web shop orders flowing',
   'Web orders now reach the sheet within a minute. Email parsing is next.', strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-3 days'));

INSERT OR IGNORE INTO automations (id, org_id, project_id, name, description, trigger_label, status, minutes_saved_per_run) VALUES
  ('00000000-0000-4000-c000-000000000001', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-b000-000000000001',
   'Web order to kitchen board', 'Copies each paid web order into the sheet and posts it to the kitchen board.',
   'Webhook: new paid order', 'healthy', 4),
  ('00000000-0000-4000-c000-000000000002', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-b000-000000000002',
   'Supplier invoice capture', 'Reads supplier PDFs and creates draft bills in accounting.',
   'Every 30 minutes', 'warning', 6),
  ('00000000-0000-4000-c000-000000000003', '00000000-0000-4000-a000-000000000001', NULL,
   'Weekly sales digest', 'Monday summary of last week''s sales sent to the owners.',
   'Mondays 08:00', 'paused', 20);

-- About 10 days of runs: web orders several times a day, invoice capture with a few failures.
INSERT OR IGNORE INTO automation_runs (id, automation_id, org_id, status, started_at, duration_ms, items_processed, minutes_saved, message)
WITH RECURSIVE g(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM g WHERE n < 48)
SELECT printf('00000000-0000-4000-e001-%012d', n), '00000000-0000-4000-c000-000000000001', '00000000-0000-4000-a000-000000000001',
       'success', strftime('%Y-%m-%dT%H:%M:%fZ', 'now', printf('-%d hours', n * 5)), 1200 + (n * 37) % 900, 1, 4, NULL
FROM g;

INSERT OR IGNORE INTO automation_runs (id, automation_id, org_id, status, started_at, duration_ms, items_processed, minutes_saved, message)
WITH RECURSIVE g(n) AS (SELECT 1 UNION ALL SELECT n + 1 FROM g WHERE n < 34)
SELECT printf('00000000-0000-4000-e002-%012d', n), '00000000-0000-4000-c000-000000000002', '00000000-0000-4000-a000-000000000001',
       CASE WHEN n % 9 = 0 THEN 'failed' ELSE 'success' END,
       strftime('%Y-%m-%dT%H:%M:%fZ', 'now', printf('-%d hours', n * 7)), 4000 + (n * 53) % 3000,
       CASE WHEN n % 9 = 0 THEN 0 ELSE 1 + n % 3 END,
       CASE WHEN n % 9 = 0 THEN 0 ELSE 6 END,
       CASE WHEN n % 9 = 0 THEN 'Supplier PDF had no readable text layer' ELSE NULL END
FROM g;

INSERT OR IGNORE INTO requests (id, org_id, project_id, title, description, priority, status, created_at, updated_at) VALUES
  ('00000000-0000-4000-d000-000000000001', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-b000-000000000001',
   'Add catering orders to the board', 'Catering orders come from a separate form. Can they show up too?', 'normal', 'in_progress',
   strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-6 days'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-6 days')),
  ('00000000-0000-4000-d000-000000000002', '00000000-0000-4000-a000-000000000001', NULL,
   'Invoice from Flour Supply Ltd not captured', 'The PDF from last Tuesday never showed up as a draft bill.', 'high', 'open',
   strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-1 days')),
  ('00000000-0000-4000-d000-000000000003', '00000000-0000-4000-a000-000000000002', NULL,
   'Can we add Instagram DMs?', 'Some couples message us on Instagram first.', 'low', 'open',
   strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-2 days'), strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-2 days'));

INSERT OR IGNORE INTO request_comments (id, request_id, org_id, body, created_at) VALUES
  ('00000000-0000-4000-d100-000000000001', '00000000-0000-4000-d000-000000000001', '00000000-0000-4000-a000-000000000001',
   'Yes. We will add the catering form as a second source this week.', strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-5 days'));

INSERT OR IGNORE INTO files (id, org_id, project_id, name, external_url, created_at) VALUES
  ('00000000-0000-4000-d200-000000000001', '00000000-0000-4000-a000-000000000001', '00000000-0000-4000-b000-000000000001',
   'Order flow diagram (DEMO)', 'https://example.com/demo/order-flow', strftime('%Y-%m-%dT%H:%M:%fZ', 'now', '-24 days'));

INSERT OR IGNORE INTO invoices (id, org_id, number, issued_on, due_on, amount_cents, currency, status, url) VALUES
  ('00000000-0000-4000-d300-000000000001', '00000000-0000-4000-a000-000000000001', 'DEMO-0001', date('now', '-75 days'), date('now', '-61 days'), 49000, 'USD', 'paid', 'https://example.com/invoices/demo-0001'),
  ('00000000-0000-4000-d300-000000000002', '00000000-0000-4000-a000-000000000001', 'DEMO-0002', date('now', '-45 days'), date('now', '-31 days'), 49000, 'USD', 'paid', 'https://example.com/invoices/demo-0002'),
  ('00000000-0000-4000-d300-000000000003', '00000000-0000-4000-a000-000000000001', 'DEMO-0003', date('now', '-15 days'), date('now', '-1 days'),  49000, 'USD', 'open', 'https://example.com/invoices/demo-0003'),
  ('00000000-0000-4000-d300-000000000004', '00000000-0000-4000-a000-000000000001', 'DEMO-0004', date('now'),             date('now', '+14 days'), 49000, 'USD', 'draft', NULL),
  ('00000000-0000-4000-d300-000000000005', '00000000-0000-4000-a000-000000000002', 'DEMO-F-0001', date('now', '-5 days'), date('now', '+9 days'), 19000, 'USD', 'open', 'https://example.com/invoices/demo-f-0001');
