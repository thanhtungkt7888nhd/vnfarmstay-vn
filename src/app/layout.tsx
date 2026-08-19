import type { Metadata, Viewport } from "next";
import { ConsentGate } from "@/shared/ui/ConsentGate";
import { TheoDoiSuKien } from "@/shared/ui/TheoDoiSuKien";
import { Libre_Bodoni, DM_Sans } from "next/font/google";
import "./globals.css";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
} from "@/lib/site";

const libreBodoni = Libre_Bodoni({
  subsets: ["latin", "vietnamese"],
  weight: ["700"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "farmstay việt nam",
    "du lịch nông nghiệp",
    "farmstay hà giang",
    "farmstay đà lạt",
    "du lịch nông trại",
    "trải nghiệm nông nghiệp",
  ],
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [
      {
        // Ảnh mạng xã hội sinh động — Edge function trả về PNG 1200×630 thật
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
        width: 1200,
        height: 630,
        alt: `${SITE_NAME} — ${SITE_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}${DEFAULT_OG_IMAGE}`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  manifest: "/manifest.json",
};

/** Viewport riêng — Next.js 16 yêu cầu tách themeColor ra khỏi metadata */
export const viewport: Viewport = {
  themeColor: "#0f2318",
};

/* JSON-LD Organization + WebSite KHÔNG còn nằm ở đây (19/08/2026).
   Trước đó hai khối này lặp trên MỌI trang — vừa thừa, vừa khai `sameAs` sang
   nhahoachdinh.vn (một thực thể KHÁC, không phải cùng một tổ chức), vừa hứa
   `SearchAction` trong khi danh bạ rỗng nên tìm kiếm không trả về gì.
   Nay chúng nằm trong `@graph` của trang chủ và /ve-chung-toi, sinh từ
   `@/lib/schema` với `@id` ổn định. */

/** GA4 measurement ID — điền vào .env.local khi có tài khoản */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
/** Microsoft Clarity project ID — điền vào .env.local */
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;
/** Search Console / Bing / CocCoc verification codes — điền khi xác minh domain */
const GSC_VERIFY = process.env.NEXT_PUBLIC_GSC_VERIFY;
const BING_VERIFY = process.env.NEXT_PUBLIC_BING_VERIFY;
const COCCOC_VERIFY = process.env.NEXT_PUBLIC_COCCOC_VERIFY;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${libreBodoni.variable} ${dmSans.variable}`}>
      <head>
        {/* RSS Feed discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="vnfarmstay.vn Blog RSS"
          href="/rss.xml"
        />
        {/* Search engine verification meta tags — env-gated */}
        {GSC_VERIFY && (
          <meta name="google-site-verification" content={GSC_VERIFY} />
        )}
        {BING_VERIFY && <meta name="msvalidate.01" content={BING_VERIFY} />}
        {COCCOC_VERIFY && (
          <meta name="coccoc-site-verification" content={COCCOC_VERIFY} />
        )}
      </head>
      <body className="flex min-h-screen flex-col">
        {/* Liên kết bỏ qua — đặt ở layout nên MỌI trang đều có (trước 08/08
            chỉ / và /tim-kiem tự khai, 13 trang còn lại không có lối tắt cho
            người dùng bàn phím). Ẩn ngoài màn hình tới khi nhận tiêu điểm. */}
        <a href="#main" className="skip-link">
          Chuyển đến nội dung chính
        </a>
        {children}

        {/* Đo lường (GA4 + Clarity) — nằm SAU cổng đồng ý, không nạp trước.
            Trước 11/08/2026 hai script này chạy ngay khi mở trang: người dùng
            bị đo trước khi được hỏi, vi phạm PDPL "im lặng ≠ đồng ý". */}
        <ConsentGate gaId={GA_ID} clarityId={CLARITY_ID} />

        {/* Bộ lắng nghe uỷ nhiệm cho sự kiện đo lường — xem
            `src/shared/ui/TheoDoiSuKien.tsx`. Nó chỉ đọc nhãn `data-su-kien` và
            chuyển cho `@/lib/do-luong`, nơi tôn trọng cổng đồng ý ở trên. */}
        <TheoDoiSuKien />
      </body>
    </html>
  );
}
