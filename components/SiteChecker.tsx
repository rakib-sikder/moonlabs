"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check, Copy, Loader2, Search } from "lucide-react";
import type { CheckResult, Issue, Rating } from "@/lib/checker";

type State =
  | { kind: "idle" }
  | { kind: "running"; url: string }
  | { kind: "done"; result: CheckResult }
  | { kind: "error"; message: string };

// What the visitor reads while Google runs its test (it takes 20 to 40 seconds).
const STEPS = [
  "Opening the page on a simulated phone",
  "Measuring how fast the main content appears",
  "Reading Google's real-visitor data",
  "Checking the search basics: title, description, links",
  "Checking mobile layout and readable text",
  "Putting the report together",
];

const ratingTone: Record<Rating, { label: string; color: string }> = {
  good: { label: "Good", color: "var(--ok)" },
  "needs-improvement": { label: "Needs work", color: "var(--accent)" },
  poor: { label: "Poor", color: "var(--late)" },
};

const scoreColor = (n: number) => (n >= 90 ? "var(--ok)" : n >= 50 ? "var(--accent)" : "var(--late)");

function ScoreRing({ label, value }: { label: string; value: number | null }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="relative h-20 w-20">
        <svg viewBox="0 0 72 72" className="h-full w-full -rotate-90" aria-hidden>
          <circle cx="36" cy="36" r={r} fill="none" stroke="var(--border)" strokeWidth="6" />
          {value !== null && (
            <circle
              cx="36"
              cy="36"
              r={r}
              fill="none"
              stroke={scoreColor(value)}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={c}
              strokeDashoffset={c * (1 - value / 100)}
              className="transition-[stroke-dashoffset] duration-1000 ease-out"
            />
          )}
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold tabular-nums">
          {value ?? "-"}
        </span>
      </div>
      <span className="text-sm text-muted">{label}</span>
    </div>
  );
}

function IssueRow({ issue }: { issue: Issue }) {
  return (
    <li className="flex gap-4 py-4">
      <span className="mt-0.5 h-fit shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-[11px] uppercase tracking-wider text-muted">
        {issue.area}
      </span>
      <div className="min-w-0">
        <p className="font-medium">
          {issue.title}
          {issue.detail && <span className="ml-2 font-mono text-xs font-normal text-muted">{issue.detail}</span>}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{issue.why}</p>
      </div>
    </li>
  );
}

/** Asks the owner to email a short fix list; it lands as an enquiry, like the contact form. */
function FixListForm({ result }: { result: CheckResult }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const s = result.scores;
    const lines = [
      `Website checker request for ${result.url}`,
      `Scores: speed ${s.performance ?? "-"}, SEO ${s.seo ?? "-"}, accessibility ${s.accessibility ?? "-"}, best practices ${s.bestPractices ?? "-"}.`,
      ...(result.field ? result.field.vitals.map((v) => `${v.label}: ${v.value} (${ratingTone[v.rating].label})`) : ["No real-visitor data from Google."]),
      result.issues.length ? `Issues found: ${result.issues.map((i) => i.title).join("; ")}.` : "No issues found in the checks we run.",
      "Please send me a fix list.",
    ];
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company: "",
          services: [],
          budget: "Not sure yet",
          timeline: "Just exploring",
          message: lines.join("\n"),
          website: "",
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && json.ok) return setStatus("sent");
      setError(json.errors ? Object.values(json.errors)[0] : json.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setError("You seem to be offline. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <p className="flex items-center gap-2 text-sm">
        <Check className="h-4 w-4" style={{ color: "var(--ok)" }} /> Got it. We&apos;ll email you a short fix list within one working day.
      </p>
    );

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
      <label className="sr-only" htmlFor="fix-name">Your name</label>
      <input id="fix-name" required minLength={2} value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name"
        className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent" />
      <label className="sr-only" htmlFor="fix-email">Your email</label>
      <input id="fix-email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com"
        className="rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent" />
      <button type="submit" disabled={status === "sending"}
        className="whitespace-nowrap rounded-full border border-border px-5 py-3 text-sm font-medium transition-colors hover:border-accent hover:text-accent disabled:opacity-60">
        {status === "sending" ? "Sending…" : "Email me a fix list"}
      </button>
      {error && <p className="text-sm sm:col-span-3" style={{ color: "var(--late)" }}>{error}</p>}
    </form>
  );
}

function Report({ result }: { result: CheckResult }) {
  const [copied, setCopied] = useState(false);
  const host = (() => {
    try {
      return new URL(result.url).hostname.replace(/^www\./, "");
    } catch {
      return result.url;
    }
  })();
  const share = () => {
    const link = `${location.origin}/website-checker?url=${encodeURIComponent(host)}`;
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  const s = result.scores;
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-moon">Report for</p>
          <h2 className="mt-1 break-all text-xl font-semibold tracking-tight sm:text-2xl">{host}</h2>
          <p className="mt-1 text-sm text-muted">Tested on a phone, {new Date(result.checkedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</p>
        </div>
        <button type="button" onClick={share}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-muted hover:text-foreground">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Link copied" : "Copy link to this report"}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 rounded-2xl border border-border bg-surface/80 p-6 sm:grid-cols-4">
        <ScoreRing label="Speed" value={s.performance} />
        <ScoreRing label="SEO" value={s.seo} />
        <ScoreRing label="Accessibility" value={s.accessibility} />
        <ScoreRing label="Best practices" value={s.bestPractices} />
      </div>

      <div className="rounded-2xl border border-border bg-surface/80 p-6">
        <h3 className="font-semibold">What real visitors experience</h3>
        {result.field ? (
          <>
            <p className="mt-1 text-sm text-muted">
              Google&apos;s data from real visitors on phones over the last 28 days
              {result.field.scope === "site" ? ", for the whole site" : ", for this page"}.
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-3">
              {result.field.vitals.map((v) => (
                <li key={v.key} className="rounded-xl border border-border p-4">
                  <p className="text-sm text-muted">{v.label}</p>
                  <p className="mt-1 text-2xl font-semibold tabular-nums">{v.value}</p>
                  <p className="mt-1 text-xs" style={{ color: ratingTone[v.rating].color }}>
                    {ratingTone[v.rating].label} <span className="text-muted">· good is {v.good}</span>
                  </p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Google doesn&apos;t have enough real-visitor data for this site yet, which usually means few people find it through
            Google. The scores above come from a fresh test instead.
          </p>
        )}
      </div>

      <div className="rounded-2xl border border-border bg-surface/80 p-6">
        <h3 className="font-semibold">{result.issues.length ? `What to fix (${result.issues.length})` : "Nothing major to fix"}</h3>
        {result.issues.length > 0 ? (
          <ul className="mt-2 divide-y divide-border">
            {result.issues.map((i) => (
              <IssueRow key={i.id} issue={i} />
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-muted">The page passed every check we run. Nice work.</p>
        )}
        {result.passed.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4 text-xs text-muted">
            {result.passed.map((p) => (
              <span key={p} className="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1">
                <Check className="h-3 w-3" style={{ color: "var(--ok)" }} />
                {p}
              </span>
            ))}
          </p>
        )}
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-accent/40 bg-accent-soft p-6 sm:p-8">
        <h3 className="text-xl font-semibold tracking-tight">Want these fixed, or a look at the rest of the business?</h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          In a free 30-minute audit we go through this report with you, and the work around it: how enquiries are answered,
          booked and followed up. You get a written plan with a fixed price.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90">
            Book a free audit <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/sample-audit" className="text-sm text-muted underline-offset-4 transition-colors hover:text-foreground hover:underline">
            See a sample report
          </Link>
        </div>
        <div className="mt-6 border-t border-border pt-5">
          <p className="mb-3 text-sm font-medium">Or get a short fix list by email</p>
          <FixListForm result={result} />
        </div>
      </div>
    </div>
  );
}

export function SiteChecker() {
  const [input, setInput] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });
  const [step, setStep] = useState(0);

  async function run(raw: string) {
    const url = raw.trim();
    if (!url) return;
    setInput(url);
    setState({ kind: "running", url });
    setStep(0);
    const params = new URLSearchParams({ url });
    history.replaceState(null, "", `/website-checker?${params}`);
    try {
      const res = await fetch(`/api/check?${params}`);
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; result?: CheckResult; error?: string };
      if (res.ok && json.ok && json.result) setState({ kind: "done", result: json.result });
      else setState({ kind: "error", message: json.error ?? "Something went wrong. Please try again." });
    } catch {
      setState({ kind: "error", message: "You seem to be offline. Please try again." });
    }
  }

  // A shared link runs straight away (once, even in React's double-run dev mode).
  useEffect(() => {
    const url = new URLSearchParams(window.location.search).get("url");
    if (!url) return;
    const t = setTimeout(() => void run(url), 0);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (state.kind !== "running") return;
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 5000);
    return () => clearInterval(t);
  }, [state.kind]);

  return (
    <div className="space-y-8">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(input);
        }}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/80 p-3 sm:flex-row sm:items-center"
      >
        <label htmlFor="check-url" className="sr-only">Your website address</label>
        <div className="flex flex-1 items-center gap-3 px-3">
          <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden />
          <input
            id="check-url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="yourbusiness.com"
            inputMode="url"
            autoComplete="url"
            className="w-full bg-transparent py-3 text-base outline-none placeholder:text-muted/70"
          />
        </div>
        <button
          type="submit"
          disabled={state.kind === "running"}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state.kind === "running" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {state.kind === "running" ? "Checking…" : "Check my site"}
        </button>
      </form>

      <div aria-live="polite">
        {state.kind === "running" && (
          <div className="rounded-2xl border border-border bg-surface/80 p-6">
            <p className="font-medium">Testing {state.url}. This takes 20 to 40 seconds.</p>
            <ol className="mt-4 space-y-2 text-sm">
              {STEPS.map((s, i) => (
                <li key={s} className={`flex items-center gap-3 transition-colors ${i <= step ? "text-foreground" : "text-muted/60"}`}>
                  {i < step ? (
                    <Check className="h-4 w-4" style={{ color: "var(--ok)" }} />
                  ) : i === step ? (
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  ) : (
                    <span className="h-4 w-4 rounded-full border border-border" />
                  )}
                  {s}
                </li>
              ))}
            </ol>
          </div>
        )}
        {state.kind === "error" && (
          <p className="rounded-2xl border px-5 py-4 text-sm" style={{ borderColor: "var(--late)", color: "var(--late)" }}>
            {state.message}
          </p>
        )}
        {state.kind === "done" && <Report result={state.result} />}
      </div>
    </div>
  );
}
