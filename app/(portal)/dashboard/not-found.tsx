import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="pt-panel mx-auto mt-8 max-w-lg p-6">
      <h1 className="text-[15px] font-semibold">Not found</h1>
      <p className="mt-1 text-muted">
        This item does not exist, or it belongs to a different organization than the one you are viewing.
      </p>
      <Link href="/dashboard" className="pt-btn mt-4">
        Back to overview
      </Link>
    </div>
  );
}
