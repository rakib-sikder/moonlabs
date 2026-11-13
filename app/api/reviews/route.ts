// GET  /api/reviews: approved reviews, newest first, for the site to show.
// POST /api/reviews: a client sends a review; it is stored as 'pending' and the owner is emailed.

import { getDb } from "@/lib/portal/env";
import { emailReview } from "@/lib/notify";
import { ipHash } from "@/lib/server-env";
import { validateReview, type PublicReview, type ReviewPayload } from "@/lib/reviews";

// Always run on request: these answers change, and must never be baked in at build time.
export const dynamic = "force-dynamic";

export async function GET() {
  const db = await getDb();
  const rows = db
    ? ((
        await db
          .prepare(
            "SELECT id, name, role, company, website, rating, quote, project, created_at FROM reviews WHERE status = 'approved' ORDER BY reviewed_at DESC, created_at DESC LIMIT 30",
          )
          .all<PublicReview>()
          .catch(() => ({ results: [] as PublicReview[] }))
      ).results ?? [])
    : [];
  // Short browser cache: an approved review shows up within a few minutes.
  return Response.json({ reviews: rows }, { headers: { "cache-control": "public, max-age=300" } });
}

export async function POST(request: Request) {
  let body: Partial<ReviewPayload>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Bots fill every field; pretend success so they don't retry.
  if (body.url) return Response.json({ ok: true });

  const errors = validateReview(body);
  if (Object.keys(errors).length) return Response.json({ ok: false, errors }, { status: 422 });

  const db = await getDb();
  if (!db) return Response.json({ ok: false, error: "Reviews can't be saved right now. Please email us instead." }, { status: 503 });

  const hash = await ipHash(request);
  const recent = await db
    .prepare("SELECT COUNT(*) AS n FROM site_checks WHERE ip_hash = ? AND url_key = 'review' AND created_at > ?")
    .bind(hash, new Date(Date.now() - 3600_000).toISOString())
    .first<{ n: number }>()
    .catch(() => null);
  if (recent && recent.n >= 3) return Response.json({ ok: false, error: "Thanks, we already have your review." }, { status: 429 });

  const now = new Date().toISOString();
  const clean = (v?: string) => (v ?? "").trim() || null;
  let website = clean(body.website);
  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;
  const review = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    role: clean(body.role),
    company: clean(body.company),
    rating: Number(body.rating),
    quote: body.quote!.trim(),
    project: clean(body.project),
  };
  await db
    .prepare(
      `INSERT INTO reviews (id, name, email, role, company, website, rating, quote, project, consent, status, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'pending', ?)`,
    )
    .bind(crypto.randomUUID(), review.name, review.email, review.role, review.company, website, review.rating, review.quote, review.project, now)
    .run();
  // Rate-limit marker, kept in the checker log so no extra table is needed.
  await db
    .prepare("INSERT INTO site_checks (id, url_key, url, result, ip_hash, created_at) VALUES (?, 'review', '', '{}', ?, ?)")
    .bind(crypto.randomUUID(), hash, now)
    .run()
    .catch(() => {});
  await emailReview(review).catch((e) => console.error("[reviews] alert failed:", e));
  return Response.json({ ok: true });
}
