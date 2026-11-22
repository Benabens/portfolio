import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
// Preview deployments carry the Vercel Toolbar (vercel.live); production does not.
const isPreview = process.env.VERCEL_ENV === "preview";
const toolbar = (...sources: string[]) => (isPreview ? sources : []);

// Every page is prerendered, so there is no request to mint a nonce on, and
// Next's inline RSC scripts change with every build: script-src needs
// 'unsafe-inline'. No other origin can run code, frame the site or receive data.
const csp = {
  "default-src": ["'self'"],
  "script-src": [
    "'self'",
    "'unsafe-inline'",
    // Dev: React refresh evaluates code, Analytics loads its debug script.
    ...(isDev ? ["'unsafe-eval'", "https://va.vercel-scripts.com"] : []),
    ...toolbar("https://vercel.live"),
  ],
  // inlineCss <style>, server-rendered style attributes.
  "style-src": ["'self'", "'unsafe-inline'", ...toolbar("https://vercel.live")],
  "img-src": ["'self'", "data:", "blob:", ...toolbar("https://vercel.live", "https://vercel.com")],
  "font-src": ["'self'", ...toolbar("https://vercel.live", "https://assets.vercel.com")],
  // Analytics posts to a same-origin path in production.
  "connect-src": ["'self'", ...toolbar("https://vercel.live", "wss://ws-us3.pusher.com")],
  "frame-src": ["'self'", ...toolbar("https://vercel.live")],
  "object-src": ["'none'"],
  "base-uri": ["'self'"],
  "form-action": ["'self'"],
  "frame-ancestors": ["'none'"],
};

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: Object.entries(csp)
      .map(([directive, sources]) => `${directive} ${sources.join(" ")}`)
      .join("; "),
  },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

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
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
