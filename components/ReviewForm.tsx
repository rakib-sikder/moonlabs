"use client";

import { useState, type FormEvent } from "react";
import { Check, Star } from "lucide-react";
import { REVIEW_LIMITS, validateReview, type ReviewPayload } from "@/lib/reviews";

const field =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent";

const words = ["", "Poor", "Below expectations", "Good", "Very good", "Excellent"];

export function ReviewForm() {
  const [data, setData] = useState<ReviewPayload>({
    name: "",
    email: "",
    role: "",
    company: "",
    website: "",
    rating: 0,
    quote: "",
    project: "",
    consent: false,
    url: "",
  });
  const [hover, setHover] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const set = <K extends keyof ReviewPayload>(k: K, v: ReviewPayload[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = validateReview(data);
    setErrors(v);
    if (Object.keys(v).length) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && json.ok) return setStatus("sent");
      if (json.errors) setErrors(json.errors);
      setServerError(json.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("You seem to be offline. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <div className="rounded-3xl border border-border bg-surface/80 p-8 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft">
          <Check className="h-6 w-6 text-accent" />
        </span>
        <h2 className="mt-4 text-xl font-semibold">Thank you, {data.name.split(" ")[0]}.</h2>
        <p className="mt-2 text-sm text-muted">We read every review before it goes on the site. Yours will appear once we&apos;ve checked it.</p>
      </div>
    );

  const err = (k: string) => errors[k] && <p className="mt-1.5 text-xs" style={{ color: "var(--late)" }}>{errors[k]}</p>;
  const shown = hover || data.rating;

  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-sm sm:p-8">
      <fieldset>
        <legend className="mb-3 text-sm">How was working with us?</legend>
        <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              aria-label={`${n} out of 5: ${words[n]}`}
              aria-pressed={data.rating === n}
              onClick={() => set("rating", n)}
              onMouseEnter={() => setHover(n)}
              className="rounded-md p-1 transition-transform hover:scale-110"
            >
              <Star className={`h-8 w-8 ${n <= shown ? "fill-accent text-accent" : "text-border"}`} strokeWidth={1.5} />
            </button>
          ))}
          <span className="ml-3 text-sm text-muted">{shown ? words[shown] : "Pick a rating"}</span>
        </div>
        {err("rating")}
      </fieldset>

      <div>
        <label htmlFor="rv-quote" className="mb-2 block text-sm">Your review</label>
        <textarea
          id="rv-quote"
          rows={5}
          maxLength={REVIEW_LIMITS.quote}
          value={data.quote}
          onChange={(e) => set("quote", e.target.value)}
          placeholder="What did we build or fix, and what changed for your business afterwards?"
          className={field}
        />
        {err("quote")}
      </div>

      <div>
        <label htmlFor="rv-project" className="mb-2 block text-sm">
          What we worked on <span className="text-muted">(optional)</span>
        </label>
        <input id="rv-project" maxLength={REVIEW_LIMITS.project} value={data.project} onChange={(e) => set("project", e.target.value)}
          placeholder="e.g. Lead replies and booking automation" className={field} />
        {err("project")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="rv-name" className="mb-2 block text-sm">Your name</label>
          <input id="rv-name" autoComplete="name" value={data.name} onChange={(e) => set("name", e.target.value)} className={field} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="rv-email" className="mb-2 block text-sm">
            Email <span className="text-muted">(never shown)</span>
          </label>
          <input id="rv-email" type="email" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} className={field} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="rv-role" className="mb-2 block text-sm">
            Your role <span className="text-muted">(optional)</span>
          </label>
          <input id="rv-role" value={data.role} onChange={(e) => set("role", e.target.value)} placeholder="e.g. Owner" className={field} />
          {err("role")}
        </div>
        <div>
          <label htmlFor="rv-company" className="mb-2 block text-sm">
            Business <span className="text-muted">(optional)</span>
          </label>
          <input id="rv-company" autoComplete="organization" value={data.company} onChange={(e) => set("company", e.target.value)} className={field} />
          {err("company")}
        </div>
      </div>

      <div>
        <label htmlFor="rv-website" className="mb-2 block text-sm">
          Business website <span className="text-muted">(optional)</span>
        </label>
        <input id="rv-website" inputMode="url" value={data.website} onChange={(e) => set("website", e.target.value)} placeholder="yourbusiness.com" className={field} />
        {err("website")}
      </div>

      {/* Honeypot: hidden from people, filled by bots. */}
      <input type="text" name="url" tabIndex={-1} autoComplete="off" value={data.url} onChange={(e) => set("url", e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden />

      <label className="flex items-start gap-3 text-sm">
        <input type="checkbox" checked={data.consent} onChange={(e) => set("consent", e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--accent)]" />
        <span className="text-muted">
          You can show this review, with my name, role and business, on moonlab.space.
        </span>
      </label>
      {err("consent")}

      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="text-xs text-muted">Reviews are checked by a person before they appear.</p>
        <button type="submit" disabled={status === "sending"}
          className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60">
          {status === "sending" ? "Sending…" : "Send review"}
        </button>
      </div>
      {serverError && <p className="text-sm" style={{ color: "var(--late)" }}>{serverError}</p>}
    </form>
  );
}
