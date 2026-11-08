import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cloudflare Workers has no built-in Next image optimizer; serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;

// Makes the Cloudflare bindings in wrangler.jsonc (the portal's D1 database) available to
// `next dev` through getCloudflareContext(), using the local Miniflare copy of the database.
initOpenNextCloudflareForDev();
