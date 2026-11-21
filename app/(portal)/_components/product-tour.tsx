"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { markTourDone } from "../actions";

/** Fired by "Show the guide" in the account menu. */
export const TOUR_EVENT = "ml:start-tour";

/** `path`: the page the step happens on (the guide opens it). `target`: data-tour anchor to point at. */
type Step = { path?: string; target?: string; title: string; body: string; final?: boolean };

const ALL_STEPS: Step[] = [
  {
    path: "/dashboard",
    title: "Welcome to your Moonlab portal",
    body: "Everything about your work with us lives here. This two-minute guide opens each page and shows what it is for. Skip it any time, and reopen it from your account menu.",
  },
  {
    path: "/dashboard",
    target: "overview-kpis",
    title: "Overview: your numbers",
    body: "What is running for you, how many runs went through this week, the hours saved this month, and open requests. When something needs your approval or input, a yellow note appears above these.",
  },
  {
    path: "/dashboard/projects",
    target: "projects-new",
    title: "Projects: start here",
    body: "Press “Start a new project” and tell us what you need in your own words. We reply within one business day. Every project then shows its stages (Audit, Design, Build, Test, Live), milestones and updates.",
  },
  {
    path: "/dashboard/projects",
    title: "Inside a project",
    body: "When we need you, it appears at the top of the project: approve a spec, mockup or release, or ask for changes. “Access and keys” is where you share logins and API keys safely, never by email. Blocked tasks say clearly who they wait on.",
  },
  {
    path: "/dashboard/automations",
    target: "automations-list",
    title: "Automations",
    body: "Every workflow we run for you, with its health, recent runs, success rate and the hours it saves. Open one to see its run log.",
  },
  {
    path: "/dashboard/requests",
    target: "requests-new",
    title: "Requests",
    body: "Questions, problems and change requests go here with “New request”. Each request keeps the whole conversation in one thread, so nothing gets lost in email.",
  },
  {
    path: "/dashboard/files",
    target: "files-list",
    title: "Files",
    body: "Deliverables, documents and handover material we share with you. Only people in your organization can open them.",
  },
  {
    path: "/dashboard/billing",
    target: "billing-plans",
    title: "Billing: plans",
    body: "Crescent is a one-time automation build. Full Moon adds one new automation every month with care. Half Moon keeps what you have running. When a seasonal offer is on, the lower first payment shows here and is applied for you.",
  },
  {
    path: "/dashboard/billing",
    target: "billing-invoices",
    title: "Billing: invoices",
    body: "Every invoice, with a “Pay” button once we add the secure payment link (card, PayPal or bank transfer). Websites and apps are quoted per project and paid in three steps.",
  },
  {
    target: "assistant",
    title: "Ask Moon",
    body: "Moon, our AI assistant, answers questions about the portal in your language. Tell it what you want to build: it asks a few questions, gives you an estimate and prepares a brief for our team.",
  },
  {
    target: "user-menu",
    title: "Your account",
    body: "Switch workspace, go back to the website, sign out, or open this guide again.",
  },
  {
    path: "/dashboard",
    title: "Where to start",
    body: "Most clients begin by telling us what they need. It takes about five minutes, and we reply within one business day.",
    final: true,
  },
];

const PAD = 6;
const CARD_W = 340;
const CARD_H = 240;

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
 * Guided tour of the portal. Starts by itself once for people who have not finished or skipped
 * it (only on Overview), and again whenever TOUR_EVENT fires. Each step opens its page and points
 * at the real control; when that control is not on screen the step shows as a centred card.
 */
export function ProductTour({ autoStart, assistant = false }: { autoStart: boolean; assistant?: boolean }) {
  const STEPS = assistant ? ALL_STEPS : ALL_STEPS.filter((s) => s.target !== "assistant");
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // Finished or skipped in this session: the layout's autoStart prop is stale until a full reload.
  const done = useRef(false);
  const step = STEPS[index];
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (autoStart && !done.current && pathname === "/dashboard") {
      const t = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(t);
    }
  }, [autoStart, pathname]);

  useEffect(() => {
    const start = () => {
      setIndex(0);
      setOpen(true);
    };
    window.addEventListener(TOUR_EVENT, start);
    return () => window.removeEventListener(TOUR_EVENT, start);
  }, []);

  // Go to the step's page when needed.
  useEffect(() => {
    if (open && step?.path && pathname !== step.path) router.push(step.path);
  }, [open, step, pathname, router]);

  const onPage = !step?.path || pathname === step.path;

  const measure = useCallback(() => {
    const el = onPage ? findTarget(step?.target) : null;
    setRect(el ? el.getBoundingClientRect() : null);
  }, [step, onPage]);

  // The page may still be loading: look for the target for a couple of seconds.
  useLayoutEffect(() => {
    if (!open) return;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const seek = () => {
      const el = onPage ? findTarget(step?.target) : null;
      if (el) {
        el.scrollIntoView({ block: "nearest" });
        requestAnimationFrame(measure);
      } else {
        requestAnimationFrame(measure);
        if (step?.target && tries++ < 15) timer = setTimeout(seek, 150);
      }
    };
    seek();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [open, measure, step, onPage]);

  useEffect(() => {
    if (open) cardRef.current?.focus();
  }, [open, index]);

  const finish = useCallback(() => {
    done.current = true;
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

  // Card placement: right of the target, else below it, else above it, else bottom-right.
  let cardStyle: React.CSSProperties;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const left = (x: number) => Math.min(Math.max(12, x), vw - CARD_W - 12);
  if (rect && rect.right + 16 + CARD_W < vw && rect.height < vh * 0.6) {
    cardStyle = { left: rect.right + 16, top: Math.min(Math.max(12, rect.top - 8), vh - CARD_H - 12) };
  } else if (rect && rect.bottom + 12 + CARD_H < vh) {
    cardStyle = { left: left(rect.left), top: rect.bottom + 12 };
  } else if (rect && rect.top - 12 - CARD_H > 0) {
    cardStyle = { left: left(rect.left), top: rect.top - 12 - CARD_H };
  } else if (rect) {
    cardStyle = { right: 16, bottom: 16 };
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
