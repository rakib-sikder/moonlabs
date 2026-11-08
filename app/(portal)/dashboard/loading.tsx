// Shown inside the portal shell while a dashboard page loads its data.
export default function DashboardLoading() {
  return (
    <div role="status" aria-label="Loading">
      <div className="pt-skeleton h-6 w-40" />
      <div className="pt-skeleton mt-2 h-4 w-64" />
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="pt-panel p-4">
            <div className="pt-skeleton h-3 w-24" />
            <div className="pt-skeleton mt-3 h-7 w-16" />
          </div>
        ))}
      </div>
      <div className="pt-panel mt-6">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 border-b border-border px-4 py-3 last:border-0">
            <div className="pt-skeleton h-4 flex-1" />
            <div className="pt-skeleton h-4 w-20" />
          </div>
        ))}
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
