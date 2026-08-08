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
      <Navbar />
      <HomePage farmstays={FARMSTAYS} initialQuery={q ?? ""} />
      <Footer />
    </>
  );
}
