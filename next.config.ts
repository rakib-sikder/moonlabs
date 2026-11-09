import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // Cloudflare Workers has no built-in Next image optimizer; serve images as-is.
  images: { unoptimized: true },
  // Baseline security headers on every response.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
        ],
      },
    ];
  },
  // One canonical address for SEO: every other hostname redirects to https://moonlab.space.
  async redirects() {
    const others = ["www.moonlab.space", "moonlab.best", "www.moonlab.best", "moonlabs.sikdersmail.workers.dev"];
    return others.map((host) => ({
      source: "/:path*",
      has: [{ type: "host" as const, value: host.replace(/\./g, "\\.") }],
      destination: "https://moonlab.space/:path*",
      permanent: true,
    }));
  },
};

export default nextConfig;

// Makes the Cloudflare bindings in wrangler.jsonc (the portal's D1 database) available to
// `next dev` through getCloudflareContext(), using the local Miniflare copy of the database.
initOpenNextCloudflareForDev();
