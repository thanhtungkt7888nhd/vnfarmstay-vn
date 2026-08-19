import type { NextConfig } from "next";

/** Security headers bảo vệ tất cả response */
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
    /* HSTS — buộc trình duyệt chỉ nói chuyện qua HTTPS trong 2 năm, kể cả khi
       người dùng gõ http://. Chặn hạ cấp giao thức và đánh cắp phiên ở lần
       truy cập đầu qua mạng công cộng. Vercel phục vụ HTTPS cho mọi domain
       nên bật an toàn; `preload` để xin vào danh sách nạp sẵn của trình duyệt. */
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      /* chỉ thị eval-không-an-toàn đã gỡ 11/08/2026 — xem lý do đầy đủ ở src/middleware.ts.
         Giữ khối này đồng bộ với middleware, tránh hai nơi khai ngược nhau. */
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://unpkg.com https://cdn.sanity.io",
      "connect-src 'self' https://api.indexnow.org https://www.google-analytics.com https://*.sanity.io https://www.clarity.ms",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  compress: true,

  /** Security headers trên mọi response */
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  /** Redirects 301 — tránh duplicate content */
  async redirects() {
    return [
      /* www → không-www. Đo thật 19/08/2026 sau khi trỏ tên miền: CẢ HAI bản
         đều trả 200 và phục vụ cùng nội dung — với công cụ tìm kiếm đó là hai
         website trùng nhau, chia đôi tín nhiệm. Bản CHÍNH là không-www vì
         `SITE_URL` và mọi thẻ canonical đều khai như vậy.
         Điều kiện `has host = www...` khiến luật chỉ bắn khi tên miền vào là
         bản www, nên KHÔNG có nguy cơ chuyển hướng vòng tròn. */
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: "www.vnfarmstay.vn" }],
        destination: "https://vnfarmstay.vn/:path*",
        permanent: true,
      },
      // /bai-viet/ → /blog/ (URL cũ, giữ SEO juice)
      {
        source: "/bai-viet",
        destination: "/blog",
        permanent: true,
      },
      {
        source: "/bai-viet/:slug*",
        destination: "/blog/:slug*",
        permanent: true,
      },
    ];
  },

  /** Tối ưu images — cho phép Sanity CDN */
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 ngày
    dangerouslyAllowSVG: false,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/**",
      },
    ],
  },

  /** Tối ưu bundle: tree-shake leaflet */
  experimental: {
    optimizePackageImports: ["leaflet", "lucide-react"],
  },
};

export default nextConfig;
