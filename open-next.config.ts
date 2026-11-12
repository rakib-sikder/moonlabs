// Cloudflare Workers build (OpenNext).
// Every marketing page is prerendered at build time. Serve those straight from the Worker's
// static assets and skip the Next.js server for them: without this each page view re-renders
// the page, which costs enough CPU that a burst of requests (a crawler, a link going round)
// makes Cloudflare answer 503 "Worker exceeded resource limits".
// Nothing on the site revalidates, so a read-only cache is all it needs.
import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
