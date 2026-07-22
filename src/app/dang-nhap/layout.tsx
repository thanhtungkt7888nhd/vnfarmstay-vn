/**
 * Layout wrapper cho /dang-nhap — cung cấp metadata (page là client component).
 * Next.js App Router cho phép export metadata từ layout thay vì page.
 * noindex=true: trang auth không cần SEO.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Đăng nhập — vnfarmstay.vn",
  description:
    "Đăng nhập vào vnfarmstay.vn để quản lý đặt phòng, theo dõi farmstay yêu thích và kết nối cộng đồng nông nghiệp Việt Nam.",
  canonical: "/dang-nhap",
  noindex: true, // Trang auth không nên index
});

export default function DangNhapLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
