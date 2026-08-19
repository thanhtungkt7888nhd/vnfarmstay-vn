import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { HomePage } from "@/features/listing/HomePage";
import { FARMSTAYS } from "@/features/listing/data";

/**
 * Trang kết quả tìm kiếm nội bộ — `noindex, follow` (đặt 19/08/2026).
 *
 * Lý do: đây là trang kết quả truy vấn, mỗi tham số `?q=` sinh một biến thể nội dung
 * gần trùng trang chủ. Bản cũ để index và còn nằm trong sitemap với mức ưu tiên 0.9.
 * `follow` được giữ để máy vẫn đi tiếp theo các liên kết bên trong.
 */
export const metadata: Metadata = {
  title: "Tìm kiếm farmstay",
  description: "Tìm farmstay theo vùng đất và trải nghiệm trên vnfarmstay.vn.",
  alternates: { canonical: "https://vnfarmstay.vn/tim-kiem" },
  robots: { index: false, follow: true },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function TimKiemPage({ searchParams }: Props) {
  const { q } = await searchParams;
  return (
    <>
      <Navbar />
      <HomePage farmstays={FARMSTAYS} initialQuery={q ?? ""} />
      <Footer />
    </>
  );
}
