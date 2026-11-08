"use client";

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="pt-panel mx-auto mt-8 max-w-lg p-6" role="alert">
      <h1 className="text-[15px] font-semibold">Something went wrong loading this page</h1>
      <p className="mt-1 text-muted">
        Try again in a moment. If it keeps happening, let us know{error.digest ? ` and mention code ${error.digest}` : ""}.
      </p>
      <button type="button" className="pt-btn mt-4" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
