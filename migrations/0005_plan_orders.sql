-- A client choosing a plan in the portal. Each order comes with an open invoice; Moonlab adds a
-- payment link (Payoneer) to that invoice, and marking the invoice paid switches the plan on.
CREATE TABLE IF NOT EXISTS plan_orders (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('crescent', 'half_moon', 'full_moon')),
  invoice_id TEXT REFERENCES invoices (id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
  created_by TEXT REFERENCES users (id) ON DELETE SET NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS plan_orders_org_idx ON plan_orders (org_id, status);
CREATE INDEX IF NOT EXISTS plan_orders_invoice_idx ON plan_orders (invoice_id);
