"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import type { PublicReview } from "@/lib/reviews";

/**
 * Approved client reviews, fetched when the section loads (pages are prerendered, so a new
 * approval shows up without a rebuild). Renders nothing until there is at least one.
 */
export function Reviews() {
  const [reviews, setReviews] = useState<PublicReview[]>([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/reviews")
      .then((r) => (r.ok ? (r.json() as Promise<{ reviews?: PublicReview[] }>) : { reviews: [] }))
      .then((j) => {
        if (alive) setReviews(j.reviews ?? []);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (reviews.length === 0) return null;
  const avg = reviews.reduce((n, r) => n + r.rating, 0) / reviews.length;

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-moon">What clients say</p>
          <h2 className="text-balance text-2xl font-semibold tracking-tight sm:text-[2rem]">Reviews from businesses we&apos;ve worked with.</h2>
        </div>
        <p className="flex items-center gap-2 text-sm text-muted">
          <Star className="h-4 w-4 fill-accent text-accent" />
          <span className="font-medium text-foreground">{avg.toFixed(1)}</span> from {reviews.length}{" "}
          {reviews.length === 1 ? "review" : "reviews"}
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.id} className="flex flex-col rounded-2xl border border-border bg-surface/70 p-6">
            <div className="flex gap-0.5" aria-label={`${r.rating} out of 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} className={`h-4 w-4 ${n <= r.rating ? "fill-accent text-accent" : "text-border"}`} strokeWidth={1.5} />
              ))}
            </div>
            <blockquote className="mt-4 flex-1 whitespace-pre-line text-[15px] leading-relaxed">“{r.quote}”</blockquote>
            {r.project && <p className="mt-4 text-xs text-muted">Project: {r.project}</p>}
            <figcaption className="mt-5 border-t border-border pt-4 text-sm">
              <p className="font-medium">{r.name}</p>
              {(r.role || r.company) && (
                <p className="text-muted">
                  {[r.role, r.company].filter(Boolean).join(", ")}
                  {r.website && (
                    <>
                      {" · "}
                      <a href={r.website} target="_blank" rel="noopener noreferrer nofollow" className="underline-offset-4 hover:text-foreground hover:underline">
                        site
                      </a>
                    </>
                  )}
                </p>
              )}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 text-sm text-muted">
        Worked with us?{" "}
        <Link href="/review" className="text-accent underline-offset-4 hover:underline">
          Leave a review
        </Link>
      </p>
    </section>
  );
}
