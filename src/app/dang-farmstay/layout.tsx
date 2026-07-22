/**
 * Layout wrapper cho /dang-farmstay — cung cấp metadata (page là client component).
 * Next.js App Router cho phép export metadata từ layout thay vì page.
 */
import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Đăng ký farmstay của bạn lên vnfarmstay.vn",
  description:
    "Đăng ký farmstay miễn phí — tiếp cận hàng nghìn du khách yêu thích nông nghiệp sinh thái. Quản lý đặt phòng dễ dàng, hỗ trợ 24/7.",
  canonical: "/dang-farmstay",
  keywords: ["đăng ký farmstay", "chủ farmstay", "kinh doanh farmstay"],
});

export default function DangFarmstayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
