-- Seasonal offers. An offer is live when it is enabled and today falls between starts_on and
-- ends_on (inclusive, UTC dates). The discount applies to the first payment of the listed plans
-- ('all' = every plan). When several are live, the largest discount wins. Staff edit them in the
-- admin; the rows below are the first year's calendar. Islamic dates are estimates and shift with
-- the moon sighting, so check them a few weeks before.
CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL CHECK (length(name) BETWEEN 2 AND 80),
  headline TEXT NOT NULL CHECK (length(headline) BETWEEN 5 AND 200),
  starts_on TEXT NOT NULL,
  ends_on TEXT NOT NULL,
  discount_percent INTEGER NOT NULL CHECK (discount_percent BETWEEN 1 AND 90),
  plans TEXT NOT NULL DEFAULT 'all',
  enabled INTEGER NOT NULL DEFAULT 1 CHECK (enabled IN (0, 1)),
  source TEXT NOT NULL DEFAULT 'custom' CHECK (source IN ('calendar', 'custom')),
  updated_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  CHECK (ends_on >= starts_on)
);
CREATE INDEX IF NOT EXISTS offers_dates_idx ON offers (enabled, starts_on, ends_on);

-- Which offer a plan order used, so the invoice and reports can show it.
ALTER TABLE plan_orders ADD COLUMN offer_id TEXT REFERENCES offers (id) ON DELETE SET NULL;
ALTER TABLE plan_orders ADD COLUMN discount_percent INTEGER;

INSERT OR IGNORE INTO offers (id, name, headline, starts_on, ends_on, discount_percent, plans, source) VALUES
  ('cal-2026-black-friday', 'Black Friday 2026', 'Black Friday: 30% off your first payment on every plan.', '2026-11-27', '2026-11-29', 30, 'all', 'calendar'),
  ('cal-2026-cyber-monday', 'Cyber Monday 2026', 'Cyber Monday: 25% off your first payment on every plan.', '2026-11-30', '2026-12-01', 25, 'all', 'calendar'),
  ('cal-2026-holidays', 'Holiday season 2026', 'Holiday offer: 20% off your first payment on every plan.', '2026-12-15', '2026-12-26', 20, 'all', 'calendar'),
  ('cal-2027-new-year', 'New Year 2027', 'New Year offer: 15% off your first payment on every plan.', '2026-12-31', '2027-01-07', 15, 'all', 'calendar'),
  ('cal-2027-ramadan', 'Ramadan 2027', 'Ramadan offer: 20% off your first payment on every plan.', '2027-02-08', '2027-03-09', 20, 'all', 'calendar'),
  ('cal-2027-eid-al-fitr', 'Eid al-Fitr 2027', 'Eid offer: 15% off your first payment on every plan.', '2027-03-10', '2027-03-14', 15, 'all', 'calendar'),
  ('cal-2027-eid-al-adha', 'Eid al-Adha 2027', 'Eid offer: 15% off your first payment on every plan.', '2027-05-16', '2027-05-19', 15, 'all', 'calendar'),
  ('cal-2027-memorial-day', 'Memorial Day 2027', 'Memorial Day offer: 15% off your first payment on every plan.', '2027-05-28', '2027-05-31', 15, 'all', 'calendar'),
  ('cal-2027-july-4', 'Independence Day 2027', 'Fourth of July offer: 15% off your first payment on every plan.', '2027-07-01', '2027-07-05', 15, 'all', 'calendar'),
  ('cal-2027-labor-day', 'Labor Day 2027', 'Labor Day offer: 15% off your first payment on every plan.', '2027-09-03', '2027-09-06', 15, 'all', 'calendar'),
  ('cal-2027-black-friday', 'Black Friday 2027', 'Black Friday: 30% off your first payment on every plan.', '2027-11-26', '2027-11-28', 30, 'all', 'calendar'),
  ('cal-2027-cyber-monday', 'Cyber Monday 2027', 'Cyber Monday: 25% off your first payment on every plan.', '2027-11-29', '2027-11-30', 25, 'all', 'calendar');
