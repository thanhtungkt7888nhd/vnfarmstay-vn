import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { FarmstayCard } from "@/features/listing/FarmstayCard";
import { FARMSTAYS } from "@/features/listing/data";

export const metadata: Metadata = {
  title: "Tìm kiếm Farmstay",
  description:
    "Tìm kiếm 500+ farmstay xác minh khắp Việt Nam — Miền Bắc, Miền Trung, Miền Nam.",
  alternates: { canonical: "https://farmstay.vn/tim-kiem" },
};

export default function TimKiemPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          background: "var(--bg-deep)",
          minHeight: "80vh",
          padding: "48px 24px",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              marginBottom: 8,
            }}
          >
            Khám phá <em style={{ color: "var(--gold)" }}>500+ Farmstay</em>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: 36,
              fontSize: "1rem",
            }}
          >
            Từ Hà Giang đến Cà Mau — tìm farmstay phù hợp với hành trình của bạn
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {FARMSTAYS.map((f) => (
              <FarmstayCard key={f.id} farmstay={f} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
