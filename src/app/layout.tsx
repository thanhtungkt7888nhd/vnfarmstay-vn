import type { Metadata, Viewport } from "next";
import { Libre_Bodoni, DM_Sans } from "next/font/google";
import "./globals.css";
import type { WithContext, Organization, WebSite } from "schema-dts";

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

const SITE_URL = "https://vnfarmstay.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "vnfarmstay.vn – Trải nghiệm nông nghiệp đích thực Việt Nam",
    template: "%s | vnfarmstay.vn",
  },
  description:
    "Giới thiệu farmstay Việt Nam và những câu chuyện vùng miền — ruộng bậc thang, đồi chè, vườn cà phê, văn hoá bản địa chưa bị thương mại hoá. Cầu nối giữa nông dân Việt và du khách.",
  keywords: [
    "farmstay việt nam",
    "du lịch nông nghiệp",
    "farmstay hà giang",
    "farmstay đà lạt",
    "du lịch nông trại",
    "trải nghiệm nông nghiệp",
  ],
  authors: [{ name: "vnfarmstay.vn", url: SITE_URL }],
  creator: "vnfarmstay.vn",
  publisher: "vnfarmstay.vn",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "vnfarmstay.vn",
    title: "vnfarmstay.vn – Trải nghiệm nông nghiệp đích thực Việt Nam",
    description:
      "Giới thiệu farmstay Việt Nam và những câu chuyện vùng miền — ruộng bậc thang, đồi chè, vườn cà phê, văn hoá bản địa chưa bị thương mại hoá.",
    images: [
      {
        // Dynamic OG image — Edge function trả về PNG 1200×630 thật
        url: `${SITE_URL}/api/og?title=vnfarmstay.vn&subtitle=Tr%E1%BA%A3i+nghi%E1%BB%87m+n%C3%B4ng+nghi%E1%BB%87p+%C4%91%C3%ADch+th%E1%BB%B1c+Vi%E1%BB%87t+Nam`,
        width: 1200,
        height: 630,
        alt: "vnfarmstay.vn — Farmstay và câu chuyện vùng miền Việt Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "vnfarmstay.vn – Trải nghiệm nông nghiệp đích thực Việt Nam",
    description:
      "Giới thiệu farmstay Việt Nam và những câu chuyện vùng miền — cầu nối giữa nông dân Việt và du khách.",
    images: [
      `${SITE_URL}/api/og?title=vnfarmstay.vn&subtitle=Tr%E1%BA%A3i+nghi%E1%BB%87m+n%C3%B4ng+nghi%E1%BB%87p+%C4%91%C3%ADch+th%E1%BB%B1c+Vi%E1%BB%87t+Nam`,
    ],
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

/** JSON-LD: Organization + WebSite (dùng chung toàn site) */
const orgSchema: WithContext<Organization> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "vnfarmstay.vn",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  // ⚠️ 08/08/2026 — Ông xác nhận facebook.com/farmstayvn và instagram.com/farmstayvn
  // KHÔNG phải trang của vnfarmstay.vn (tên tay cầm là "farmstayvn" — của thương hiệu
  // khác), đã gỡ. Khai nhận trang mạng xã hội của thương hiệu khác là chính cái bệnh
  // đợt này đi chữa. Chỉ thêm lại khi có trang THẬT do Ông xác nhận.
  sameAs: [
    // Ecosystem cross-reference — liên kết entity với các site cùng hệ sinh thái
    "https://nhahoachdinh.vn",
  ],
  // `contactPoint` đã gỡ cùng ngày: hotline "+84-1800-6868" là số BỊA (Ông xác nhận),
  // mà đây là dữ liệu gửi thẳng cho Google nên sai ở đây lan ra mọi kết quả tìm kiếm.
};

const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "vnfarmstay.vn",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_URL}/tim-kiem?q={search_term_string}`,
    },
    // @ts-expect-error — schema-dts không có query-input string literal
    "query-input": "required name=search_term_string",
  },
};

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

        {/* JSON-LD: Organization + WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />

        {/* Google Analytics 4 */}
        {GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${GA_ID}', { page_path: window.location.pathname });
                `,
              }}
            />
          </>
        )}

        {/* Microsoft Clarity */}
        {CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${CLARITY_ID}");
              `,
            }}
          />
        )}
      </body>
    </html>
  );
}
