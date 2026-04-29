import type { Metadata } from "next";
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
    "Nền tảng đặt phòng farmstay hàng đầu Việt Nam. Khám phá 500+ farmstay xác minh từ Hà Giang đến Cà Mau.",
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
      { url: "/og-image.jpg", width: 1200, height: 630, alt: "Farmstay.vn" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Farmstay.vn – Trải nghiệm nông nghiệp đích thực Việt Nam",
    description:
      "Nền tảng đặt phòng farmstay hàng đầu Việt Nam. 500+ farmstay xác minh.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  manifest: "/manifest.json",
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </body>
    </html>
  );
}
