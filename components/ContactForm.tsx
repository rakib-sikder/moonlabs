"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { serviceCategories, services, servicesIn } from "@/lib/site";
import { budgetOptions, LIMITS, timelineOptions, validateContact, type ContactPayload } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error";

/** Dot colour for each service, by name (the form stores names). */
const colorOf: Record<string, string> = Object.fromEntries(services.map((x) => [x.name, x.color]));

const field =
  "w-full rounded-xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted/70 focus:border-accent";

export function ContactForm({ fallbackEmail }: { fallbackEmail?: string }) {
  const [data, setData] = useState<ContactPayload>({
    name: "",
    email: "",
    company: "",
    services: [],
    budget: budgetOptions[0],
    timeline: timelineOptions[0],
    message: "",
    website: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  // The service list stays closed until asked for, so the form opens short.
  const [picking, setPicking] = useState(false);
  const [query, setQuery] = useState("");
  const noMatch = !services.some((x) => x.name.toLowerCase().includes(query.trim().toLowerCase()));

  const set = <K extends keyof ContactPayload>(k: K, v: ContactPayload[K]) => {
    setData((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const toggleService = (name: string) =>
    set("services", data.services.includes(name) ? data.services.filter((s) => s !== name) : [...data.services, name]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = validateContact(data);
    setErrors(v);
    if (Object.keys(v).length) return;
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; errors?: Record<string, string>; error?: string };
      if (res.ok && json.ok) {
        setStatus("sent");
        return;
      }
      if (json.errors) setErrors(json.errors);
      setServerError(json.error ?? "Something went wrong. Please try again.");
      setStatus("error");
    } catch {
      setServerError("You seem to be offline. Please try again.");
      setStatus("error");
    }
  }

  return (
    <div className="relative rounded-3xl border border-border bg-surface/80 p-6 backdrop-blur-sm sm:p-10">
      <AnimatePresence mode="wait">
        {status === "sent" ? (
          <motion.div
            key="sent"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex min-h-[420px] flex-col items-center justify-center text-center"
            role="status"
          >
            <motion.div
              initial={{ scale: 0, rotate: -40 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 14 }}
              className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-accent-ink"
              style={{ boxShadow: "0 0 40px 6px var(--accent)" }}
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={2.4}>
                <path d="M4 12.5 9.5 18 20 6" />
              </svg>
            </motion.div>
            <h2 className="text-2xl font-semibold">Thanks, we got your message.</h2>
            <p className="mt-3 max-w-sm text-muted">
              We reply within one working day with a few times for your free audit. Keep an eye on {data.email}.
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} noValidate exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm">Name</label>
                <input id="name" className={field} value={data.name} maxLength={LIMITS.name} autoComplete="name"
                  onChange={(e) => set("name", e.target.value)} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-err" : undefined} />
                {errors.name && <p id="name-err" className="mt-1.5 text-xs text-[#ff8f8f]">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="mb-2 block text-sm">Work email</label>
                <input id="email" type="email" className={field} value={data.email} maxLength={LIMITS.email} autoComplete="email"
                  onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} aria-describedby={errors.email ? "email-err" : undefined} />
                {errors.email && <p id="email-err" className="mt-1.5 text-xs text-[#ff8f8f]">{errors.email}</p>}
              </div>
            </div>
            <div>
              <label htmlFor="company" className="mb-2 block text-sm">
                Company <span className="text-muted">(optional)</span>
              </label>
              <input id="company" className={field} value={data.company} maxLength={LIMITS.company} autoComplete="organization"
                onChange={(e) => set("company", e.target.value)} />
            </div>

            <fieldset>
              <legend className="mb-3 text-sm">
                What can we help with? <span className="text-muted">(optional)</span>
              </legend>
              <div className="flex flex-wrap items-center gap-2">
                {data.services.map((name) => (
                  <span
                    key={name}
                    className="inline-flex items-center gap-2 rounded-full border border-accent bg-accent-soft py-1.5 pl-3.5 pr-1.5 text-sm"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ background: colorOf[name] }} />
                    {name}
                    <button
                      type="button"
                      onClick={() => toggleService(name)}
                      aria-label={`Remove ${name}`}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
                <button
                  type="button"
                  onClick={() => setPicking(!picking)}
                  aria-expanded={picking}
                  aria-controls="service-picker"
                  className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3.5 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-foreground"
                >
                  <Plus className={`h-4 w-4 transition-transform ${picking ? "rotate-45" : ""}`} />
                  {picking ? "Close" : data.services.length ? "Add another" : "Add a service"}
                </button>
              </div>

              {picking && (
                <div
                  id="service-picker"
                  onKeyDown={(e) => e.key === "Escape" && setPicking(false)}
                  className="mt-3 rounded-2xl border border-border bg-background/60 p-4"
                >
                  <input
                    type="search"
                    autoFocus
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search services"
                    aria-label="Search services"
                    className={field}
                  />
                  <div className="mt-4 max-h-72 space-y-4 overflow-y-auto pr-1" data-lenis-prevent>
                    {serviceCategories.map((c) => {
                      const list = servicesIn(c.id).filter((x) => x.name.toLowerCase().includes(query.trim().toLowerCase()));
                      if (!list.length) return null;
                      return (
                        <div key={c.id}>
                          <p className="mb-2 text-xs uppercase tracking-widest text-muted">{c.name}</p>
                          <div className="flex flex-wrap gap-2">
                            {list.map((x) => {
                              const on = data.services.includes(x.name);
                              return (
                                <button
                                  key={x.slug}
                                  type="button"
                                  aria-pressed={on}
                                  onClick={() => toggleService(x.name)}
                                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors ${
                                    on ? "border-accent bg-accent-soft text-foreground" : "border-border text-muted hover:border-muted hover:text-foreground"
                                  }`}
                                >
                                  {on ? <Check className="h-3.5 w-3.5 text-accent" /> : <span className="h-2 w-2 rounded-full" style={{ background: x.color }} />}
                                  {x.name}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    {noMatch && <p className="text-sm text-muted">No service matches that. Describe it in the message below.</p>}
                  </div>
                </div>
              )}
            </fieldset>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="budget" className="mb-2 block text-sm">Budget</label>
                <select id="budget" className={field} value={data.budget} onChange={(e) => set("budget", e.target.value)}>
                  {budgetOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="timeline" className="mb-2 block text-sm">Timeline</label>
                <select id="timeline" className={field} value={data.timeline} onChange={(e) => set("timeline", e.target.value)}>
                  {timelineOptions.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="mb-2 block text-sm">What eats your team&apos;s week?</label>
              <textarea id="message" rows={5} className={`${field} resize-y`} value={data.message} maxLength={LIMITS.message}
                placeholder="e.g. We copy leads from our website form into HubSpot by hand and reply the next day…"
                onChange={(e) => set("message", e.target.value)} aria-invalid={!!errors.message} aria-describedby={errors.message ? "message-err" : undefined} />
              {errors.message && <p id="message-err" className="mt-1.5 text-xs text-[#ff8f8f]">{errors.message}</p>}
            </div>

            {/* Honeypot: hidden from people and screen readers. */}
            <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="website">Website</label>
              <input id="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
            </div>

            {status === "error" && (
              <p role="alert" className="rounded-xl border border-[#ff8f8f]/40 bg-[#ff8f8f]/10 px-4 py-3 text-sm">
                {serverError}
                {fallbackEmail && (
                  <>
                    {" "}
                    <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-4 transition-colors hover:text-accent">{fallbackEmail}</a>
                  </>
                )}
              </p>
            )}

            <div className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-muted">We reply within one working day. No spam, ever.</p>
              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {status === "sending" ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent" />
                    Sending…
                  </>
                ) : (
                  <>Send and book my free audit →</>
                )}
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
