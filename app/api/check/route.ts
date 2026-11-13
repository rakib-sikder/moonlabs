// GET /api/check?url=example.com — the free website checker behind /website-checker.
// Results are cached for a day per page (same answer, no Google quota spent), and each IP
// can start a limited number of fresh checks an hour.

import { CheckError, normalizeUrl, runCheck, urlKey, type CheckResult } from "@/lib/checker";
import { getDb } from "@/lib/portal/env";
import { ipHash, readSecret } from "@/lib/server-env";

const CACHE_HOURS = 24;
const FRESH_CHECKS_PER_HOUR = 6;

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

// Always run on request: these answers change, and must never be baked in at build time.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  let target: URL;
  try {
    target = normalizeUrl(new URL(request.url).searchParams.get("url") ?? "");
  } catch (err) {
    return json({ ok: false, error: err instanceof CheckError ? err.message : "Invalid address." }, 400);
  }

  const key = await readSecret("GOOGLE_API_KEY");
  if (!key) return json({ ok: false, error: "The checker isn't set up yet. Please book a free audit instead." }, 503);

  const db = await getDb();
  const k = urlKey(target);
  const hash = await ipHash(request);
  const since = (hours: number) => new Date(Date.now() - hours * 3600_000).toISOString();

  if (db) {
    const cached = await db
      .prepare("SELECT result FROM site_checks WHERE url_key = ? AND created_at > ? ORDER BY created_at DESC LIMIT 1")
      .bind(k, since(CACHE_HOURS))
      .first<{ result: string }>()
      .catch(() => null);
    if (cached) return json({ ok: true, cached: true, result: JSON.parse(cached.result) as CheckResult });

    const recent = await db
      .prepare("SELECT COUNT(*) AS n FROM site_checks WHERE ip_hash = ? AND created_at > ?")
      .bind(hash, since(1))
      .first<{ n: number }>()
      .catch(() => null);
    if (recent && recent.n >= FRESH_CHECKS_PER_HOUR)
      return json({ ok: false, error: "You've run a lot of checks in the last hour. Please try again a bit later." }, 429);
  }

  try {
    const result = await runCheck(key, target);
    if (db) {
      await db
        .prepare("INSERT INTO site_checks (id, url_key, url, result, ip_hash, created_at) VALUES (?, ?, ?, ?, ?, ?)")
        .bind(crypto.randomUUID(), k, target.toString(), JSON.stringify(result), hash, result.checkedAt)
        .run()
        .catch((e) => console.error("[check] could not store result:", e));
    }
    return json({ ok: true, cached: false, result });
  } catch (err) {
    if (err instanceof CheckError) return json({ ok: false, error: err.message }, err.status);
    console.error("[check] failed:", err);
    return json({ ok: false, error: "Something went wrong while testing that site. Please try again." }, 502);
  }
}
