import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { HomePage } from "@/features/listing/HomePage";
import { FARMSTAYS } from "@/features/listing/data";

export const metadata: Metadata = {
  title: "Tìm kiếm Farmstay | vnfarmstay.vn",
  description:
    "Tìm farmstay theo khu vực Miền Bắc, Miền Trung, Miền Nam trên vnfarmstay.vn.",
  alternates: { canonical: "https://vnfarmstay.vn/tim-kiem" },
};

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function TimKiemPage({ searchParams }: Props) {
  const { q } = await searchParams;
  return (
    <>
      <a
        href="#main"
        style={{
          position: "absolute",
          top: -40,
          left: 0,
          zIndex: 9999,
          background: "var(--gold)",
          color: "var(--bg-deep)",
          padding: "8px 16px",
          fontWeight: 600,
        }}
        className="transition-all focus:top-0"
      >
        Chuyển đến nội dung chính
      </a>
      <Navbar />
      <HomePage farmstays={FARMSTAYS} initialQuery={q ?? ""} />
      <Footer />
    </>
  );
}
