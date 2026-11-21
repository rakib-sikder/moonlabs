"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { markTourDone } from "../actions";

/** Fired by "Show the guide" in the account menu. */
export const TOUR_EVENT = "ml:start-tour";

type Step = { target?: string; title: string; body: string; final?: boolean };

const ALL_STEPS: Step[] = [
  {
    title: "Welcome to your Moonlab portal",
    body: "Everything about your work with us lives here. This one-minute guide shows you around. You can skip it and open it again any time from your account menu.",
  },
  {
    target: "nav-overview",
    title: "Overview",
    body: "Your home page: what is running, what changed lately, and anything waiting for you, such as an approval.",
  },
  {
    target: "nav-projects",
    title: "Projects",
    body: "Tell us what you want built with “Start a new project”. Each project shows its stages, milestones and updates. When we need your approval or a login, it appears at the top of the project.",
  },
  {
    target: "nav-automations",
    title: "Automations",
    body: "The workflows we run for you, with their recent runs, success rate and the hours they save.",
  },
  {
    target: "nav-requests",
    title: "Requests",
    body: "Ask a question, report a problem or ask for a change. Each request keeps the whole conversation in one place, so nothing gets lost in email.",
  },
  {
    target: "nav-files",
    title: "Files",
    body: "Deliverables, documents and links we share with you.",
  },
  {
    target: "nav-billing",
    title: "Billing",
    body: "Choose a monthly plan for automations and see your invoices. Websites and apps are quoted per project. You pay through a secure link we email you, by card, PayPal or bank transfer.",
  },
  {
    target: "assistant",
    title: "Ask Moonlab",
    body: "Our assistant answers questions about the portal in your language. Tell it what you want to build, and it asks a few questions, gives you an estimate and prepares a brief for our team.",
  },
  {
    target: "user-menu",
    title: "Your account",
    body: "Sign out, go back to the website, or open this guide again.",
  },
  {
    title: "Where to start",
    body: "Most clients begin by telling us what they need. It takes about five minutes, and we reply within one business day.",
    final: true,
  },
];

const PAD = 6;
const CARD_W = 340;

/** The first element for this step that is actually on screen (the sidebar is hidden on mobile). */
function findTarget(key: string | undefined): HTMLElement | null {
  if (!key) return null;
  for (const el of document.querySelectorAll<HTMLElement>(`[data-tour="${key}"]`)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.height > 0) return el;
  }
  return null;
}

/**
 * Guided tour of the portal. Starts by itself for people who have not finished or skipped it,
 * and again whenever TOUR_EVENT fires. Highlights one menu item per step; when the item is not
 * visible (small screens) the step shows as a centred card.
 */
export function ProductTour({ autoStart, assistant = false }: { autoStart: boolean; assistant?: boolean }) {
  const STEPS = assistant ? ALL_STEPS : ALL_STEPS.filter((s) => s.target !== "assistant");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const step = STEPS[index];

  useEffect(() => {
    if (autoStart) {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [autoStart]);

  useEffect(() => {
    const start = () => {
      setIndex(0);
      setOpen(true);
    };
    window.addEventListener(TOUR_EVENT, start);
    return () => window.removeEventListener(TOUR_EVENT, start);
  }, []);

  const measure = useCallback(() => {
    const el = findTarget(step?.target);
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step]);

  useLayoutEffect(() => {
    if (!open) return;
    findTarget(step?.target)?.scrollIntoView({ block: "nearest" });
    const frame = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure, step]);

  useEffect(() => {
    if (open) cardRef.current?.focus();
  }, [open, index]);

  const finish = useCallback(() => {
    setOpen(false);
    setIndex(0);
    void markTourDone().catch(() => {});
  }, []);

  const next = useCallback(() => (index < STEPS.length - 1 ? setIndex(index + 1) : finish()), [index, finish, STEPS.length]);
  const back = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") finish();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, next, back, finish]);

  if (!open || !step) return null;

  // Card placement: right of the highlighted item, or under it, or centred.
  let cardStyle: React.CSSProperties;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  if (rect && rect.right + 16 + CARD_W < vw) {
    cardStyle = { left: rect.right + 16, top: Math.min(Math.max(12, rect.top - 8), vh - 260) };
  } else if (rect) {
    cardStyle = { left: Math.min(Math.max(12, rect.right - CARD_W), vw - CARD_W - 12), top: Math.min(rect.bottom + 12, vh - 260) };
  } else {
    cardStyle = { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  }

  return createPortal(
    <div className="fixed inset-0 z-[60]" aria-hidden={false}>
      {/* Click guard + dimmed page. With a target, the spotlight's shadow does the dimming. */}
      <div className="absolute inset-0" style={{ background: rect ? "transparent" : "rgba(10,12,16,0.55)" }} onClick={() => undefined} />
      {rect && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-lg transition-all duration-200 motion-reduce:transition-none"
          style={{
            left: rect.left - PAD,
            top: rect.top - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            boxShadow: "0 0 0 9999px rgba(10,12,16,0.55), 0 0 0 2px var(--accent)",
          }}
        />
      )}
      <div
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-body"
        tabIndex={-1}
        className="pt-panel absolute p-4 shadow-xl shadow-black/30 outline-none"
        style={{ ...cardStyle, width: CARD_W, maxWidth: "calc(100vw - 24px)" }}
      >
        <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted">
          Step {index + 1} of {STEPS.length}
        </p>
        <h2 id="tour-title" className="mt-1 text-[15px] font-semibold">
          {step.title}
        </h2>
        <p id="tour-body" className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
          {step.body}
          {step.target?.startsWith("nav-") && !rect && " On a phone, you find it in the ☰ menu at the top left."}
        </p>
        <div className="mt-4 flex items-center justify-between gap-2">
          {step.final ? (
            <>
              <button type="button" className="pt-btn" data-variant="ghost" data-size="sm" onClick={finish}>
                Explore on my own
              </button>
              <Link href="/dashboard/projects/new" className="pt-btn" data-variant="primary" data-size="sm" onClick={finish}>
                Start a new project
              </Link>
            </>
          ) : (
            <>
              <button type="button" className="pt-btn" data-variant="ghost" data-size="sm" onClick={finish}>
                Skip guide
              </button>
              <div className="flex gap-2">
                {index > 0 && (
                  <button type="button" className="pt-btn" data-size="sm" onClick={back}>
                    Back
                  </button>
                )}
                <button type="button" className="pt-btn" data-variant="primary" data-size="sm" onClick={next}>
                  {index === 0 ? "Show me around" : "Next"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/** "Show the guide" entry for the account menu. */
export function ShowTourButton() {
  return (
    <button
      type="button"
      className="pt-nav-link w-full text-left"
      onClick={(e) => {
        e.currentTarget.closest("details")?.removeAttribute("open");
        window.dispatchEvent(new Event(TOUR_EVENT));
      }}
    >
      Show the guide
    </button>
  );
}
