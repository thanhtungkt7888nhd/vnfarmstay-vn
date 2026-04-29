import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { HomePage } from "@/features/listing/HomePage";
import { FARMSTAYS } from "@/features/listing/data";

export const metadata: Metadata = {
  title: "Farmstay.vn – Khám phá trải nghiệm nông nghiệp đích thực Việt Nam",
  description:
    "Nền tảng đặt phòng farmstay hàng đầu Việt Nam. Khám phá 500+ farmstay xác minh từ Hà Giang đến Cà Mau.",
  alternates: { canonical: "https://farmstay.vn/" },
};

export default function Home() {
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
      <HomePage farmstays={FARMSTAYS} />
      <Footer />
    </>
  );
}
