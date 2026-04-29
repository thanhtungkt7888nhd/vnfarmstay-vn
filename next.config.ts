import type { NextConfig } from "next";

/** Security headers theo NT-7 (bật mặc định) */
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://unpkg.com",
      "connect-src 'self' https://api.indexnow.org https://www.google-analytics.com https://*.sanity.io",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  compress: true,

  /** Security headers trên mọi response */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },

  /** Tối ưu images — thêm domain khi có Cloudinary/Sanity */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 ngày
    dangerouslyAllowSVG: false,
    remotePatterns: [
      // Thêm sau khi có Sanity project ID:
      // { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },

  /** Tối ưu import của leaflet */
  experimental: {
    optimizePackageImports: ["leaflet"],
  },
};

export default nextConfig;
