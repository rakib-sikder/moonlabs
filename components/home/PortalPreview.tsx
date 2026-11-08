import Link from "next/link";
import { Activity, FileText, LayoutDashboard, MessageSquare } from "lucide-react";
import { SectionHead } from "./SectionHead";

const features = [
  { icon: LayoutDashboard, title: "Project tracker", body: "Every project's stage, next milestone and latest update." },
  { icon: Activity, title: "Automation health", body: "Each automation's last run, success rate and any failures." },
  { icon: MessageSquare, title: "Requests", body: "Ask for a change or report a problem, and follow the reply." },
  { icon: FileText, title: "Files & invoices", body: "Deliverables, documentation and billing in one place." },
];

// Illustrative rows for the mock-up below (labelled as sample data on the page).
const runs = [
  { name: "Inbound lead → CRM", status: "Healthy", last: "2 min ago", rate: "100%" },
  { name: "Invoice reminders", status: "Healthy", last: "1 h ago", rate: "99%" },
  { name: "Review requests", status: "Warning", last: "3 h ago", rate: "94%" },
  { name: "Weekly KPI report", status: "Healthy", last: "Mon 08:00", rate: "100%" },
];

const statusColor: Record<string, string> = { Healthy: "#4fd18b", Warning: "#ffc76b" };

/** Home: what clients get after they sign up — the client portal. */
export function PortalPreview() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHead
        eyebrow="Client portal"
        title="Check on your projects any time."
        intro="Every client gets a login to follow their projects and automations, so you don't have to email us for updates."
      />
      <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr] lg:items-center">
        <div>
          <ul className="divide-y divide-border border-y border-border">
            {features.map((f) => (
              <li key={f.title} className="flex gap-4 py-4">
                <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent" strokeWidth={1.6} />
                <div>
                  <p className="text-sm font-medium">{f.title}</p>
                  <p className="mt-0.5 text-sm text-muted">{f.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:border-muted">
              Client sign in
            </Link>
            <Link href="/contact" className="rounded-full px-5 py-2.5 text-sm text-muted transition-colors hover:text-foreground">
              Become a client →
            </Link>
          </div>
        </div>

        {/* Static mock-up of the dashboard */}
        <figure className="overflow-hidden rounded-2xl border border-border bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
              <span className="h-2.5 w-2.5 rounded-full bg-border" />
            </div>
            <span className="font-mono text-xs text-muted">moonlabs · dashboard</span>
            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] uppercase tracking-wider text-muted">Sample data</span>
          </div>
          <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
            {[
              ["Active automations", "12"],
              ["Runs · 7 days", "3,418"],
              ["Success rate", "99.2%"],
              ["Hours saved · month", "64 h"],
            ].map(([k, v]) => (
              <div key={k} className="bg-surface p-4">
                <p className="text-xs text-muted">{k}</p>
                <p className="mt-1 text-xl font-semibold tabular-nums">{v}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-border">
            <div className="grid grid-cols-[1.6fr_1fr_1fr_0.6fr] gap-2 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-muted">
              <span>Automation</span>
              <span>Status</span>
              <span>Last run</span>
              <span className="text-right">Success</span>
            </div>
            {runs.map((r) => (
              <div key={r.name} className="grid grid-cols-[1.6fr_1fr_1fr_0.6fr] gap-2 border-t border-border px-4 py-2.5 text-[13px]">
                <span className="truncate">{r.name}</span>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: statusColor[r.status] }} />
                  {r.status}
                </span>
                <span className="text-muted">{r.last}</span>
                <span className="text-right tabular-nums text-muted">{r.rate}</span>
              </div>
            ))}
          </div>
          <figcaption className="sr-only">Illustration of the client dashboard with sample data.</figcaption>
        </figure>
      </div>
    </section>
  );
}
