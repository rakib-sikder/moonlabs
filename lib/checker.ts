// Website checker: Google's own data about a site, turned into a short plain-language report.
// Server-only. Two Google APIs, both with the Worker secret GOOGLE_API_KEY:
//   - Chrome UX Report (CrUX): how the site behaved for real visitors on phones over 28 days.
//     Only sites with enough visitors are in it.
//   - PageSpeed Insights: a fresh Lighthouse test of the page on a simulated phone.
// The PageSpeed response is ~450 KB, mostly screenshots; those are cut out as text before
// parsing so the Worker stays well inside its CPU limit.

export type Rating = "good" | "needs-improvement" | "poor";

export type Vital = { key: "lcp" | "inp" | "cls"; label: string; value: string; rating: Rating; good: string };

export type Issue = { id: string; area: "Speed" | "SEO" | "Mobile" | "Trust"; title: string; why: string; detail?: string };

export type CheckResult = {
  url: string;
  checkedAt: string;
  scores: { performance: number | null; seo: number | null; accessibility: number | null; bestPractices: number | null };
  /** Real-visitor data; null when Google doesn't have enough visitors for this site. */
  field: { scope: "page" | "site"; vitals: Vital[] } | null;
  issues: Issue[];
  passed: string[];
};

export class CheckError extends Error {
  constructor(message: string, readonly status = 400) {
    super(message);
  }
}

/** Accepts "example.com", "www.example.com/page" or a full URL; rejects anything not a public website. */
export function normalizeUrl(input: string): URL {
  let raw = (input || "").trim();
  if (!raw) throw new CheckError("Enter your website address.");
  if (raw.length > 300) throw new CheckError("That address is too long.");
  if (!/^https?:\/\//i.test(raw)) raw = `https://${raw}`;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new CheckError("That doesn't look like a website address.");
  }
  const host = u.hostname.toLowerCase();
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new CheckError("Use a normal website address (http or https).");
  if (u.username || u.password || u.port) throw new CheckError("Use the plain website address.");
  if (!host.includes(".") || host.endsWith(".local") || host.endsWith(".internal") || host === "localhost")
    throw new CheckError("That doesn't look like a public website.");
  if (/^[\d.]+$/.test(host) || host.includes(":")) throw new CheckError("Use the site's name, not an IP address.");
  u.hash = "";
  return u;
}

/** Cache key: the same page with or without www, trailing slash or tracking query counts as one. */
export const urlKey = (u: URL) => `${u.hostname.replace(/^www\./, "")}${u.pathname.replace(/\/+$/, "") || "/"}`;

const GOOD = { lcp: 2500, inp: 200, cls: 0.1 };
const POOR = { lcp: 4000, inp: 500, cls: 0.25 };

function rate(key: keyof typeof GOOD, v: number): Rating {
  return v <= GOOD[key] ? "good" : v <= POOR[key] ? "needs-improvement" : "poor";
}

async function crux(key: string, u: URL): Promise<CheckResult["field"]> {
  const ask = async (body: Record<string, string>) => {
    const res = await fetch(`https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${key}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...body, formFactor: "PHONE" }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { record?: { metrics?: Record<string, { percentiles?: { p75?: number | string } }> } };
    return json.record?.metrics ?? null;
  };
  // Google files a site under the exact host it is served from, so try it with and without www.
  const other = new URL(u.toString());
  other.hostname = u.hostname.startsWith("www.") ? u.hostname.slice(4) : `www.${u.hostname}`;
  let scope: "page" | "site" = "page";
  let m = (await ask({ url: u.toString() })) ?? (await ask({ url: other.toString() }));
  if (!m) {
    scope = "site";
    m = (await ask({ origin: u.origin })) ?? (await ask({ origin: other.origin }));
  }
  if (!m) return null;
  const p = (name: string) => {
    const v = m![name]?.percentiles?.p75;
    return v === undefined ? null : Number(v);
  };
  const vitals: Vital[] = [];
  const lcp = p("largest_contentful_paint");
  if (lcp !== null)
    vitals.push({ key: "lcp", label: "Main content shows up", value: `${(lcp / 1000).toFixed(1)} s`, rating: rate("lcp", lcp), good: "2.5 s or less" });
  const inp = p("interaction_to_next_paint");
  if (inp !== null)
    vitals.push({ key: "inp", label: "Reacts to a tap", value: `${Math.round(inp)} ms`, rating: rate("inp", inp), good: "200 ms or less" });
  const cls = p("cumulative_layout_shift");
  if (cls !== null)
    vitals.push({ key: "cls", label: "Page stays still while loading", value: cls.toFixed(2), rating: rate("cls", cls), good: "0.10 or less" });
  return vitals.length ? { scope, vitals } : null;
}

type Audit = { title?: string; score?: number | null; scoreDisplayMode?: string; displayValue?: string };

/** What a failed Lighthouse audit means for a business, in plain words. Only these are reported. */
const EXPLAIN: Record<string, { area: Issue["area"]; title: string; why: string }> = {
  "largest-contentful-paint": { area: "Speed", title: "The main content is slow to appear", why: "Visitors on phones leave when the page stays blank; every second costs enquiries." },
  "total-blocking-time": { area: "Speed", title: "The page freezes while it loads", why: "Taps and scrolls don't respond for a moment, which feels broken on a phone." },
  "cumulative-layout-shift": { area: "Mobile", title: "The layout jumps while loading", why: "People tap the wrong button or lose their place, then give up." },
  "render-blocking-resources": { area: "Speed", title: "Files hold back the first paint", why: "The browser waits for scripts and styles before showing anything." },
  "unused-javascript": { area: "Speed", title: "Code the page never uses is downloaded", why: "Extra code is slower to load and run, mostly on cheaper phones." },
  "uses-responsive-images": { area: "Speed", title: "Images are bigger than the screen needs", why: "Phones download full-size pictures, which slows the page and uses data." },
  "modern-image-formats": { area: "Speed", title: "Images use older, heavier formats", why: "WebP or AVIF versions are often half the size with the same look." },
  "offscreen-images": { area: "Speed", title: "Images below the fold load straight away", why: "They compete with what the visitor actually sees first." },
  "uses-text-compression": { area: "Speed", title: "Text files are sent uncompressed", why: "A server setting can make pages several times smaller to download." },
  "total-byte-weight": { area: "Speed", title: "The page is heavy to download", why: "Large pages are slow on mobile data." },
  "document-title": { area: "SEO", title: "The page has no title", why: "Google shows the title in search results; without one the listing looks broken." },
  "meta-description": { area: "SEO", title: "No description for search results", why: "Google writes its own snippet, often a poor one, so fewer people click." },
  "link-text": { area: "SEO", title: "Links say 'click here' instead of what they lead to", why: "Google and screen readers use link words to understand pages." },
  "image-alt": { area: "SEO", title: "Images have no text description", why: "Google can't tell what the pictures show, and neither can screen readers." },
  "is-crawlable": { area: "SEO", title: "Google is told not to index this page", why: "A blocked page can't appear in search results at all." },
  "http-status-code": { area: "SEO", title: "The page returns an error code", why: "Search engines may drop pages that answer with an error." },
  canonical: { area: "SEO", title: "The canonical link is wrong", why: "Google may index the wrong version of the page." },
  hreflang: { area: "SEO", title: "Language tags are invalid", why: "Search engines may show the wrong language version." },
  "robots-txt": { area: "SEO", title: "robots.txt has errors", why: "Search engines may not crawl the site the way you expect." },
  "structured-data": { area: "SEO", title: "Structured data has errors", why: "Rich results (stars, prices, FAQs) won't show in Google." },
  viewport: { area: "Mobile", title: "The page isn't set up for phones", why: "Without a viewport tag, phones show a tiny desktop page." },
  "tap-targets": { area: "Mobile", title: "Buttons and links are too small or close together", why: "People hit the wrong thing on a phone." },
  "font-size": { area: "Mobile", title: "Text is too small to read on a phone", why: "Visitors have to pinch and zoom, and most won't." },
  "color-contrast": { area: "Mobile", title: "Some text is hard to read against its background", why: "Low contrast is unreadable outdoors and for many people." },
  "is-on-https": { area: "Trust", title: "Parts of the site aren't secure (no HTTPS)", why: "Browsers warn visitors, and forms can't be trusted." },
  "errors-in-console": { area: "Trust", title: "The page has script errors", why: "Something on the page may be broken, such as a form or menu." },
};

const PASS_LABEL: Record<string, string> = {
  "document-title": "Has a page title",
  "meta-description": "Has a search description",
  viewport: "Set up for phones",
  "is-on-https": "Secure (HTTPS)",
  "is-crawlable": "Google can index it",
  "font-size": "Readable text size",
  "image-alt": "Images described",
  "link-text": "Descriptive links",
};

/** Keeps only the parts of the PageSpeed JSON we read; screenshots and request lists are cut as text first. */
function slimPsi(raw: string): { finalUrl?: string; categories?: Record<string, { score?: number | null }>; audits?: Record<string, Audit> } {
  const trimmed = raw.replace(/"data:[^"]{200,}"/g, '""');
  const json = JSON.parse(trimmed) as { lighthouseResult?: { finalUrl?: string; categories?: Record<string, { score?: number | null }>; audits?: Record<string, Audit> } };
  return json.lighthouseResult ?? {};
}

async function pagespeed(key: string, u: URL) {
  const q = new URLSearchParams({ url: u.toString(), strategy: "mobile", key });
  for (const c of ["PERFORMANCE", "SEO", "ACCESSIBILITY", "BEST_PRACTICES"]) q.append("category", c);
  q.append("fields", "lighthouseResult/finalUrl,lighthouseResult/categories,lighthouseResult/audits");
  let res: Response;
  try {
    // Google's test usually takes 20-40 s; some slow sites never finish. Give up before visitors do.
    res = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${q}`, { signal: AbortSignal.timeout(75_000) });
  } catch {
    throw new CheckError("That site took too long to load for Google's test. Please try again in a few minutes.", 504);
  }
  const text = await res.text();
  if (!res.ok) {
    const lower = text.toLowerCase();
    if (res.status === 429) throw new CheckError("The checker is busy right now. Please try again in a minute.", 503);
    if (lower.includes("failed_document_request") || lower.includes("errored_document_request") || lower.includes("dns"))
      throw new CheckError("We couldn't open that site. Check the address and that the site is online.", 422);
    throw new CheckError("Google couldn't test that page. Check the address and try again.", 422);
  }
  return slimPsi(text);
}

const pct = (v: number | null | undefined) => (typeof v === "number" ? Math.round(v * 100) : null);

export async function runCheck(key: string, u: URL): Promise<CheckResult> {
  const [field, lh] = await Promise.all([crux(key, u).catch(() => null), pagespeed(key, u)]);
  const audits = lh.audits ?? {};
  const issues: Issue[] = [];
  const passed: string[] = [];
  // When real visitors already get a good result, the simulated slow-phone test of the same
  // thing would only contradict it, so it is left out.
  const realGood = new Set<string>(
    (field?.vitals ?? []).filter((v) => v.rating === "good").map((v) => (v.key === "lcp" ? "largest-contentful-paint" : v.key === "cls" ? "cumulative-layout-shift" : "")),
  );
  for (const [id, info] of Object.entries(EXPLAIN)) {
    if (realGood.has(id)) continue;
    const a = audits[id];
    if (!a || a.score === null || a.score === undefined) continue;
    if (a.scoreDisplayMode === "notApplicable" || a.scoreDisplayMode === "manual" || a.scoreDisplayMode === "informative") continue;
    if (a.score < 0.9) issues.push({ id, area: info.area, title: info.title, why: info.why, detail: a.displayValue || undefined });
    else if (PASS_LABEL[id]) passed.push(PASS_LABEL[id]);
  }
  // Worst first: real-visitor problems are already in `field`; here order by area, then by how bad.
  const order: Record<Issue["area"], number> = { Speed: 0, Mobile: 1, SEO: 2, Trust: 3 };
  issues.sort((a, b) => order[a.area] - order[b.area] || (audits[a.id]?.score ?? 1) - (audits[b.id]?.score ?? 1));
  const c = lh.categories ?? {};
  return {
    url: lh.finalUrl || u.toString(),
    checkedAt: new Date().toISOString(),
    scores: {
      performance: pct(c.performance?.score),
      seo: pct(c.seo?.score),
      accessibility: pct(c.accessibility?.score),
      bestPractices: pct(c["best-practices"]?.score),
    },
    field,
    issues: issues.slice(0, 8),
    passed,
  };
}
