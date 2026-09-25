import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // The stylesheet is ~6 KB: inlining it removes a render-blocking request.
    inlineCss: true,
  },
};

export default nextConfig;
