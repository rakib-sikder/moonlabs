"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment, useEffect, useRef, useState, useTransition } from "react";
import { askAssistant, getAssistantConversation, sendAssistantBrief, type AssistantState, type ChatLine } from "../assistant-actions";

const STORE_KEY = "ml_assistant_conversation";
const SUGGESTIONS = ["I want to build something", "Which plan fits me?", "Where do I see my invoices?"];

function readStored(): string | null {
  try {
    return sessionStorage.getItem(STORE_KEY);
  } catch {
    return null;
  }
}
function writeStored(id: string | null) {
  try {
    if (id) sessionStorage.setItem(STORE_KEY, id);
    else sessionStorage.removeItem(STORE_KEY);
  } catch {
    /* private mode: the conversation just is not restored */
  }
}

/** On a phone the panel covers the page, so following a link closes it. */
const isSmall = () => typeof window !== "undefined" && window.innerWidth < 640;

/** Turns portal paths in the assistant's text into links. */
function Linkified({ text, onNavigate }: { text: string; onNavigate: () => void }) {
  const parts = text.split(/(\/dashboard(?:\/[a-z-]+)*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("/dashboard") ? (
          <Link key={i} href={p} className="pt-link" onClick={onNavigate}>
            {p}
          </Link>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

/** Floating help and project-planning chat for clients. */
export function AssistantPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState<AssistantState>({ ok: true, lines: [] });
  const [pendingText, setPendingText] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [pending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const restored = useRef(false);
  const onAdmin = usePathname().startsWith("/dashboard/admin");

  useEffect(() => {
    if (!open || restored.current) return;
    restored.current = true;
    const id = readStored();
    if (id) {
      startTransition(async () => {
        const res = await getAssistantConversation(id);
        if (res.ok) setState(res);
        else writeStored(null);
      });
    }
  }, [open]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [state, pendingText, open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = (text: string) => {
    const msg = text.trim();
    if (!msg || pending) return;
    setInput("");
    setPendingText(msg);
    startTransition(async () => {
      const res = await askAssistant(state.conversationId ?? null, msg);
      setPendingText(null);
      if (res.conversationId) writeStored(res.conversationId);
      if (res.ok) setState(res);
      else {
        setState((s) => ({ ...s, conversationId: res.conversationId ?? s.conversationId, error: res.error }));
        setInput(msg);
      }
    });
  };

  const sendBrief = () => {
    if (!state.conversationId) return;
    startTransition(async () => {
      const res = await sendAssistantBrief(state.conversationId!);
      setState((s) => (res.ok ? { ...s, briefId: res.briefId, error: undefined } : { ...s, error: res.error }));
    });
  };

  const closeIfSmall = () => {
    if (isSmall()) setOpen(false);
  };

  const reset = () => {
    writeStored(null);
    setState({ ok: true, lines: [] });
    setInput("");
  };

  const lines: ChatLine[] = [...(state.lines ?? []), ...(pendingText ? [{ role: "user" as const, text: pendingText }] : [])];

  return (
    <>
      {!open && !onAdmin && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="pt-btn fixed bottom-4 right-4 z-40 shadow-lg shadow-black/20"
          data-variant="primary"
          data-tour="assistant"
          aria-haspopup="dialog"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
            <path d="M4 4h12v9H8l-4 3V4z" strokeLinejoin="round" />
          </svg>
          Ask Moonlab
        </button>
      )}
      {open && (
        <section
          role="dialog"
          aria-label="Moonlab assistant"
          className="pt-panel fixed inset-x-2 bottom-2 top-14 z-40 flex flex-col shadow-xl shadow-black/30 sm:inset-x-auto sm:right-4 sm:top-auto sm:h-[min(600px,calc(100dvh-5rem))] sm:w-[400px]"
        >
          <header className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
            <div>
              <h2 className="text-[14px] font-semibold">Moonlab assistant</h2>
              <p className="text-[11.5px] text-muted">Help with the portal and planning a project</p>
            </div>
            <div className="flex gap-1">
              {(state.lines?.length ?? 0) > 0 && (
                <button type="button" className="pt-btn" data-variant="ghost" data-size="sm" onClick={reset} disabled={pending}>
                  New chat
                </button>
              )}
              <button type="button" className="pt-btn" data-variant="ghost" data-size="sm" aria-label="Close assistant" onClick={() => setOpen(false)}>
                ✕
              </button>
            </div>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3 text-[13.5px]" aria-live="polite">
            <p className="max-w-[90%] rounded-lg bg-surface-2 px-3 py-2">
              Hi! Ask me where things are in the portal, or tell me what you want to build. I will ask a few questions, give you an estimate and
              prepare a brief for the Moonlab team. You can write in any language.
            </p>
            {lines.length === 0 && (
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" className="pt-btn" data-size="sm" onClick={() => send(s)}>
                    {s}
                  </button>
                ))}
              </div>
            )}
            {lines.map((l, i) => (
              <p
                key={i}
                className={`max-w-[90%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 ${
                  l.role === "user" ? "ml-auto bg-accent-soft" : "bg-surface-2"
                }`}
              >
                {l.role === "assistant" ? <Linkified text={l.text} onNavigate={closeIfSmall} /> : l.text}
              </p>
            ))}
            {pending && pendingText && <p className="text-[12.5px] text-muted">Thinking…</p>}

            {state.draft && (
              <div className="rounded-lg border border-border p-3">
                <p className="text-[11.5px] font-medium uppercase tracking-wider text-muted">Project brief</p>
                <p className="mt-1 font-semibold">{state.draft.title}</p>
                <p className="mt-1 whitespace-pre-wrap text-[13px]">{state.draft.goal}</p>
                {state.draft.features && (
                  <>
                    <p className="mt-2 text-[12px] font-medium text-muted">Must-have features</p>
                    <p className="whitespace-pre-wrap text-[13px]">{state.draft.features}</p>
                  </>
                )}
                {state.draft.estimate_summary && (
                  <p className="mt-2 text-[13px]">
                    <span className="text-muted">Estimate: </span>
                    <b>{state.draft.estimate_summary}</b>
                  </p>
                )}
                <p className="mt-1 text-[11.5px] text-muted">An estimate only. Moonlab confirms the fixed price after reading your brief.</p>
                {state.briefId ? (
                  <p role="status" className="mt-3 text-[13px]">
                    Sent to Moonlab. We reply within one business day.{" "}
                    <Link href={`/dashboard/projects/briefs/${state.briefId}`} className="pt-link" onClick={closeIfSmall}>
                      View the brief
                    </Link>
                  </p>
                ) : (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button type="button" className="pt-btn" data-variant="primary" data-size="sm" onClick={sendBrief} disabled={pending}>
                      Send to Moonlab
                    </button>
                    <span className="text-[12px] text-muted">Or tell me what to change.</span>
                  </div>
                )}
              </div>
            )}
            {state.error && (
              <p role="alert" className="text-[12.5px]" style={{ color: "var(--pt-bad)" }}>
                {state.error}
              </p>
            )}
          </div>

          <form
            method="post"
            className="border-t border-border p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <div className="flex items-end gap-2">
              <label htmlFor="assistant-input" className="sr-only">
                Message
              </label>
              <textarea
                id="assistant-input"
                ref={inputRef}
                rows={2}
                maxLength={2000}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                placeholder="Type a message…"
                className="pt-textarea min-h-0 flex-1 resize-none text-[13.5px]"
              />
              <button type="submit" className="pt-btn" data-variant="primary" disabled={pending || !input.trim()}>
                Send
              </button>
            </div>
            <p className="mt-1 px-1 text-[11px] text-muted">AI can make mistakes. Never share passwords here; use Access and keys on a project.</p>
          </form>
        </section>
      )}
    </>
  );
}
