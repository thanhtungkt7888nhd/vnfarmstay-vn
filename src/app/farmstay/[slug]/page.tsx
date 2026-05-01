import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { FARMSTAYS } from "@/features/listing/data";
import { formatPrice } from "@/shared/utils/format";
import { farmstaySchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FARMSTAYS.map((f) => ({ slug: f.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const farmstay = FARMSTAYS.find((f) => f.slug === slug);
  if (!farmstay) return { title: "Không tìm thấy farmstay" };
  return buildMetadata({
    title: farmstay.name,
    description: `Trải nghiệm ${farmstay.tags.join(", ")} tại ${farmstay.location}. Giá từ ${formatPrice(farmstay.price)}/đêm.`,
    canonical: `/farmstay/${farmstay.slug}`,
    keywords: [...farmstay.tags, farmstay.location, "farmstay"],
  });
}

export default async function FarmstayDetailPage({ params }: Props) {
  const { slug } = await params;
  const farmstay = FARMSTAYS.find((f) => f.slug === slug);
  if (!farmstay) notFound();

  const schemas = [
    farmstaySchema({
      name: farmstay.name,
      description: `Trải nghiệm ${farmstay.tags.join(", ")} tại ${farmstay.location}.`,
      url: `https://farmstay.vn/farmstay/${farmstay.slug}`,
      imageUrl: `https://farmstay.vn/api/og?title=${encodeURIComponent(farmstay.name)}&subtitle=${encodeURIComponent(farmstay.location)}`,
      address: farmstay.location,
      priceFrom: farmstay.price,
      rating: farmstay.rating,
      reviewCount: farmstay.reviewCount,
    }),
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Tìm kiếm", url: "/tim-kiem" },
      { name: farmstay.name, url: `/farmstay/${farmstay.slug}` },
    ]),
  ];

  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main style={{ background: "var(--bg-deep)", minHeight: "80vh" }}>
        {/* Hero image area */}
        <div
          style={{
            height: 360,
            background:
              "linear-gradient(135deg, var(--bg-main), var(--bg-card))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "6rem",
            position: "relative",
          }}
        >
          {farmstay.emoji}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 24,
              display: "flex",
              gap: 8,
            }}
          >
            {farmstay.badges.map((b) => (
              <span
                key={b}
                style={{
                  padding: "4px 12px",
                  borderRadius: 4,
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  background:
                    b === "verified"
                      ? "#2563eb"
                      : b === "featured"
                        ? "#b45309"
                        : "#7c3aed",
                  color: "#fff",
                  letterSpacing: "0.05em",
                }}
              >
                {b === "verified"
                  ? "XÁC MINH"
                  : b === "new"
                    ? "MỚI"
                    : "TIÊU BIỂU"}
              </span>
            ))}
          </div>
        </div>

        <div
          className="grid-sidebar"
          style={{
            maxWidth: 960,
            margin: "0 auto",
            padding: "40px 24px",
          }}
        >
          {/* Main content */}
          <div>
            <BreadcrumbNav
              items={[
                { name: "Tìm kiếm", href: "/tim-kiem" },
                {
                  name: farmstay.location,
                  href: `/tim-kiem?q=${encodeURIComponent(farmstay.location)}`,
                },
              ]}
            />
            <p
              style={{
                fontSize: "0.78rem",
                color: "var(--text-dim)",
                letterSpacing: "0.08em",
                marginBottom: 8,
              }}
            >
              {farmstay.location.toUpperCase()}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair),serif",
                fontSize: "2rem",
                fontWeight: 700,
                lineHeight: 1.25,
                marginBottom: 16,
              }}
            >
              {farmstay.name}
            </h1>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 28,
              }}
            >
              <span style={{ color: "var(--gold)", fontWeight: 600 }}>
                {farmstay.rating}★
              </span>
              <span style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
                {farmstay.reviewCount} đánh giá
              </span>
              <span style={{ color: "var(--border)" }}>·</span>
              <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                {farmstay.region === "north"
                  ? "Miền Bắc"
                  : farmstay.region === "central"
                    ? "Miền Trung"
                    : "Miền Nam"}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 32,
              }}
            >
              {farmstay.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: "var(--gold-dim)",
                    border: "1px solid var(--gold-border)",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <div
              style={{ borderTop: "1px solid var(--border)", paddingTop: 28 }}
            >
              <h2
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 600,
                  marginBottom: 16,
                }}
              >
                Về farmstay này
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.8,
                  marginBottom: 16,
                }}
              >
                {farmstay.name} là một trong những địa điểm farmstay nổi bật
                nhất tại {farmstay.province}. Với phong cảnh thiên nhiên tuyệt
                đẹp và trải nghiệm nông nghiệp đích thực, đây là điểm đến lý
                tưởng cho những ai muốn thoát khỏi nhịp sống đô thị.
              </p>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                Mỗi đêm nghỉ tại đây, bạn sẽ được trải nghiệm{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {farmstay.tags.join(", ")}
                </strong>{" "}
                — những hoạt động gắn liền với cuộc sống của người dân địa
                phương.
              </p>
            </div>
          </div>

          {/* Booking card */}
          <div>
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                padding: "28px",
                position: "sticky",
                top: 80,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 20,
                }}
              >
                <span
                  style={{
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                  }}
                >
                  {formatPrice(farmstay.price)}
                </span>
                <span style={{ fontSize: "0.82rem", color: "var(--text-dim)" }}>
                  /đêm
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                {[
                  ["Nhận phòng", ""],
                  ["Trả phòng", ""],
                  ["Số khách", "1 khách"],
                ].map(([label, val]) => (
                  <div key={label}>
                    <div
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 600,
                        color: "var(--text-dim)",
                        letterSpacing: "0.08em",
                        marginBottom: 6,
                      }}
                    >
                      {label.toUpperCase()}
                    </div>
                    <input
                      type={label.includes("phòng") ? "date" : "number"}
                      defaultValue={val || undefined}
                      min={label === "Số khách" ? 1 : undefined}
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: "var(--radius-sm)",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                        fontSize: "0.88rem",
                        outline: "none",
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 20,
                  background: "var(--gold)",
                  color: "var(--bg-deep)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 12,
                  transition: "var(--transition)",
                }}
              >
                Đặt ngay
              </button>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  textAlign: "center",
                }}
              >
                Miễn phí huỷ phòng trước 48 giờ
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
