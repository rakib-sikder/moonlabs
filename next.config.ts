import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Workers has no built-in Next image optimizer; serve images as-is.
  images: { unoptimized: true },
};

export default nextConfig;
