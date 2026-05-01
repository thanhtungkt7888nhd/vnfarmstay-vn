import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import type { WithContext, Organization, WebSite } from "schema-dts";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const SITE_URL = "https://farmstay.vn";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Farmstay.vn – Trải nghiệm nông nghiệp đích thực Việt Nam",
    template: "%s | Farmstay.vn",
  },
  description:
    "Nền tảng đặt phòng farmstay hàng đầu Việt Nam. Khám phá 500+ farmstay xác minh từ Hà Giang đến Cà Mau — trải nghiệm nông nghiệp đích thực, đặt phòng dễ dàng.",
  keywords: [
    "farmstay việt nam",
    "du lịch nông nghiệp",
    "farmstay hà giang",
    "farmstay đà lạt",
    "du lịch nông trại",
    "trải nghiệm nông nghiệp",
  ],
  authors: [{ name: "Farmstay.vn", url: SITE_URL }],
  creator: "Farmstay.vn",
  publisher: "Farmstay.vn",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: SITE_URL,
    siteName: "Farmstay.vn",
    title: "Farmstay.vn – Trải nghiệm nông nghiệp đích thực Việt Nam",
    description:
      "Nền tảng đặt phòng farmstay hàng đầu Việt Nam. Khám phá 500+ farmstay xác minh từ Hà Giang đến Cà Mau.",
    images: [
      {
        // Dynamic OG image — Edge function trả về PNG 1200×630 thật
        url: `${SITE_URL}/api/og?title=Farmstay.vn&subtitle=Tr%E1%BA%A3i+nghi%E1%BB%87m+n%C3%B4ng+nghi%E1%BB%87p+%C4%91%C3%ADch+th%E1%BB%B1c+Vi%E1%BB%87t+Nam`,
        width: 1200,
        height: 630,
        alt: "Farmstay.vn — Nền tảng farmstay Việt Nam",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmstay.vn – Trải nghiệm nông nghiệp đích thực Việt Nam",
    description:
      "Nền tảng đặt phòng farmstay hàng đầu Việt Nam. 500+ farmstay xác minh.",
    images: [
      `${SITE_URL}/api/og?title=Farmstay.vn&subtitle=Tr%E1%BA%A3i+nghi%E1%BB%87m+n%C3%B4ng+nghi%E1%BB%87p+%C4%91%C3%ADch+th%E1%BB%B1c+Vi%E1%BB%87t+Nam`,
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
  name: "Farmstay.vn",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  sameAs: [
    "https://www.facebook.com/farmstayvn",
    "https://www.instagram.com/farmstayvn",
    // Ecosystem cross-reference — liên kết entity với các site cùng hệ sinh thái
    "https://nhahoachdinh.vn",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+84-1800-6868",
    contactType: "customer service",
    availableLanguage: "Vietnamese",
  },
};

const websiteSchema: WithContext<WebSite> = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Farmstay.vn",
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
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}
    >
      <head>
        {/* RSS Feed discovery */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Farmstay.vn Blog RSS"
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
