import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
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
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://farmstay.vn",
    siteName: "Farmstay.vn",
  },
  twitter: { card: "summary_large_image" },
  manifest: "/manifest.json",
  themeColor: "#0f2318",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}
    >
      <body className="flex min-h-screen flex-col">{children}</body>
    </html>
  );
}
