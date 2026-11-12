import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Reveal } from "@/components/ui/Section";
import { JsonLd, breadcrumbLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta(
  "/sample-audit",
  "Sample audit report",
  "See the written report you get after the free automation audit: where the hours go, what we would automate, the fixed price and the payback.",
);

// A made-up business, used only to show the layout of the report. Not a client.
const today = [
  { task: "Replying to website and phone enquiries", who: "Office manager", hours: 6 },
  { task: "Booking jobs and sending reminders", who: "Office manager", hours: 4 },
  { task: "Typing job details into the accounting tool", who: "Bookkeeper", hours: 3 },
  { task: "Chasing unpaid invoices", who: "Owner", hours: 2 },
  { task: "Asking customers for reviews", who: "Nobody, it gets skipped", hours: 0 },
];

const proposals = [
  {
    title: "Instant reply and booking link for new enquiries",
    how: "Form and missed-call enquiries get a reply within a minute with a booking link. Anything unusual goes to the office manager.",
    tools: "Website form, phone system, calendar",
    saves: 5,
  },
  {
    title: "Job details copied into accounting automatically",
    how: "When a job is marked done, the invoice is drafted in the accounting tool. The bookkeeper approves it before it is sent.",
    tools: "Job sheet, accounting tool",
    saves: 3,
  },
  {
    title: "Invoice reminders and review requests",
    how: "Polite reminders at 7 and 14 days overdue, and a review request two days after a paid job.",
    tools: "Accounting tool, email, SMS",
    saves: 2,
  },
];

const skipped = [
  { what: "Quoting large jobs", why: "Each quote depends on a site visit and judgement. Automating it would save little and risk wrong prices." },
  { what: "Payroll", why: "Runs once a month and already takes under an hour. Not worth the build cost." },
];

const totalNow = today.reduce((n, t) => n + t.hours, 0);
const totalSaved = proposals.reduce((n, p) => n + p.saves, 0);
const hourly = 25;

export default function SampleAuditPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Home", path: "/" }, { name: "Sample audit report", path: "/sample-audit" }])} />
      <PageHeader
        eyebrow="Sample audit report"
        title="What you get after the free audit."
        intro="A short written report, sent within three working days of the call. Below is the layout, filled in for a made-up business so you can see what each part looks like."
      />

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <Reveal>
          <p className="mb-6 rounded-xl border border-dashed border-border bg-surface/60 px-5 py-3 text-sm text-muted">
            <strong className="font-medium text-foreground">Example only.</strong> The business and every number below are invented to show the
            format. Your report uses your own tasks, tools and hours.
          </p>
        </Reveal>

        <Reveal>
          <article className="overflow-hidden rounded-3xl border border-border bg-surface">
            <header className="border-b border-border px-6 py-8 sm:px-10">
              <p className="font-mono text-xs uppercase tracking-widest text-moon">Automation audit</p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">Example: a six-person home services company</h2>
              <p className="mt-2 text-sm text-muted">Based on a 30-minute call with the owner and office manager.</p>
            </header>

            <div className="space-y-12 px-6 py-10 sm:px-10">
              <section>
                <h3 className="text-lg font-semibold">1. Where the hours go today</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  The repeating work we heard about on the call, with a rough weekly time for each.
                </p>
                <div className="mt-5 overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-surface-2/60 text-xs uppercase tracking-wider text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Task</th>
                        <th className="hidden px-4 py-3 font-medium sm:table-cell">Done by</th>
                        <th className="whitespace-nowrap px-4 py-3 text-right font-medium">Hours a week</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {today.map((t) => (
                        <tr key={t.task}>
                          <td className="px-4 py-3">
                            {t.task}
                            <span className="mt-0.5 block text-xs text-muted sm:hidden">{t.who}</span>
                          </td>
                          <td className="hidden px-4 py-3 text-muted sm:table-cell">{t.who}</td>
                          <td className="px-4 py-3 text-right font-mono">{t.hours}</td>
                        </tr>
                      ))}
                      <tr className="bg-surface-2/40 font-medium">
                        <td className="px-4 py-3">Total</td>
                        <td className="hidden sm:table-cell" />
                        <td className="px-4 py-3 text-right font-mono">{totalNow}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 className="text-lg font-semibold">2. What we would automate</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">In the order we would build them, starting with the one that saves the most.</p>
                <ol className="mt-5 space-y-4">
                  {proposals.map((p, i) => (
                    <li key={p.title} className="rounded-xl border border-border bg-background/40 p-5">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                        <p className="font-medium">
                          <span className="mr-2 font-mono text-xs text-moon">0{i + 1}</span>
                          {p.title}
                        </p>
                        <p className="font-mono text-sm" style={{ color: "var(--ok)" }}>
                          saves about {p.saves} h a week
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{p.how}</p>
                      <p className="mt-3 text-xs text-muted">
                        <span className="font-medium text-foreground">Connects:</span> {p.tools}
                      </p>
                    </li>
                  ))}
                </ol>
              </section>

              <section>
                <h3 className="text-lg font-semibold">3. What we would leave alone</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Not everything is worth automating. We say so here, so you do not pay for work that will not pay back.
                </p>
                <ul className="mt-5 space-y-3">
                  {skipped.map((s) => (
                    <li key={s.what} className="flex gap-3 text-sm">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted" />
                      <span>
                        <span className="font-medium">{s.what}.</span> <span className="text-muted">{s.why}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h3 className="text-lg font-semibold">4. Price and payback</h3>
                <div className="mt-5 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-xl border border-border p-5">
                    <p className="text-xs uppercase tracking-wider text-muted">Hours saved</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">{totalSaved} h</p>
                    <p className="mt-1 text-sm text-muted">a week, out of {totalNow}</p>
                  </div>
                  <div className="rounded-xl border border-border p-5">
                    <p className="text-xs uppercase tracking-wider text-muted">Worth</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">${totalSaved * hourly}</p>
                    <p className="mt-1 text-sm text-muted">a week, at ${hourly} an hour</p>
                  </div>
                  <div className="rounded-xl border border-accent/40 bg-accent-soft p-5">
                    <p className="text-xs uppercase tracking-wider text-muted">Fixed price</p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight">$199</p>
                    <p className="mt-1 text-sm text-muted">a month, all three live in two months</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  The report also lists the running costs of any tools involved, taken from each vendor&apos;s current price list, so the payback
                  figure includes them.
                </p>
              </section>

              <section>
                <h3 className="text-lg font-semibold">5. Next steps</h3>
                <ol className="mt-4 space-y-2 text-sm text-muted">
                  <li>1. You read the report. No obligation, and it is yours to keep either way.</li>
                  <li>2. If you want to go ahead, we agree the scope and price in writing before any work starts.</li>
                  <li>3. We build the first automation in your accounts, test it with your team, and switch it on.</li>
                </ol>
              </section>
            </div>
          </article>
        </Reveal>
      </section>

      <CtaBanner title="Get this report for your own business." />
    </>
  );
}
