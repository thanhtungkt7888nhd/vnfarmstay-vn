/**
 * Trang chi tiết farmstay — layout giàu nội dung: hero, story, activities, reviews, booking.
 * Thiết kế để chủ farmstay tự hào khi nhìn hồ sơ của mình, khách muốn đặt ngay.
 */
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
    description: `Trải nghiệm ${farmstay.tags.join(", ")} tại ${farmstay.location}. Giá từ ${formatPrice(farmstay.price)}/đêm. Liên hệ trực tiếp chủ farm.`,
    canonical: `/farmstay/${farmstay.slug}`,
    keywords: [...farmstay.tags, farmstay.location, "farmstay"],
  });
}

/**
 * Tiện nghi CÓ THẬT của farmstay — hiện chưa có nguồn dữ liệu nào cấp, nên trả về rỗng
 * và khối "Tiện nghi" tự ẩn.
 *
 * ⚠️ 08/08/2026 — bản cũ TỰ SUY RA tiện nghi từ thẻ phân loại: mọi farm đều được gán
 * "Wifi miễn phí · Bãi đậu xe · Bữa sáng · Hướng dẫn viên nội bộ", farm gắn thẻ "Chăn
 * nuôi" thì tự động có "Vắt sữa bò · Làm phó mát", thẻ "Cà phê" thì có "Gift bag cà phê"...
 * Đây là quả mìn ngủ: ngày Ông đưa farmstay THẬT vào `data.ts`, nó lập tức bịa tiện nghi
 * cho farm của người ta mà không ai kịp nhận ra. Đã tháo ngòi.
 *
 * Muốn dùng lại: thêm trường `amenities` vào type `Farmstay` và điền bằng thứ chủ farm
 * xác nhận. CẤM suy ra từ thẻ phân loại.
 */
function getAmenities(_tags: string[]): string[] {
  return [];
}

export default async function FarmstayDetailPage({ params }: Props) {
  const { slug } = await params;
  const farmstay = FARMSTAYS.find((f) => f.slug === slug);
  if (!farmstay) notFound();

  const amenities = getAmenities(farmstay.tags);

  const regionLabel =
    farmstay.region === "north"
      ? "Miền Bắc"
      : farmstay.region === "central"
        ? "Miền Trung"
        : "Miền Nam";

  const schemas = [
    farmstaySchema({
      name: farmstay.name,
      description: `Trải nghiệm ${farmstay.tags.join(", ")} tại ${farmstay.location}.`,
      url: `https://vnfarmstay.vn/farmstay/${farmstay.slug}`,
      imageUrl: `https://vnfarmstay.vn/api/og?title=${encodeURIComponent(farmstay.name)}&subtitle=${encodeURIComponent(farmstay.location)}`,
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

      <main style={{ background: "var(--bg-deep)" }}>
        {/* ── HERO ── */}
        <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
          {/* Background gradient theo vùng */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                farmstay.region === "north"
                  ? "linear-gradient(135deg, #0f3020 0%, #1a5032 50%, #0d2518 100%)"
                  : farmstay.region === "central"
                    ? "linear-gradient(135deg, #1a2a0f, #2d4a1a, #162208)"
                    : "linear-gradient(135deg, #0f2a1a, #1e4a2d, #0a1f10)",
            }}
          />
          {/* Emoji lớn */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10rem",
              opacity: 0.18,
              userSelect: "none",
            }}
          >
            {farmstay.emoji}
          </div>
          {/* Overlay gradient bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "60%",
              background:
                "linear-gradient(to top, rgba(15,35,24,0.95), transparent)",
            }}
          />
          {/* Badges */}
          <div
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              display: "flex",
              gap: 8,
            }}
          >
            {farmstay.badges?.map((b) => (
              <span
                key={b}
                style={{
                  padding: "5px 14px",
                  borderRadius: 4,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  background:
                    b === "verified"
                      ? "#2563eb"
                      : b === "featured"
                        ? "#b45309"
                        : "#7c3aed",
                  color: "#fff",
                }}
              >
                {b === "verified"
                  ? "✓ XÁC MINH"
                  : b === "new"
                    ? "MỚI"
                    : "TIÊU BIỂU"}
              </span>
            ))}
          </div>
          {/* Hero text — bottom left */}
          <div
            style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "var(--gold)",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              {farmstay.location} · {regionLabel}
            </p>
            <h1
              className="shine reveal"
              style={{
                fontFamily: "var(--font-display),serif",
                fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.15,
                marginBottom: 12,
                maxWidth: 680,
              }}
            >
              {farmstay.name}
            </h1>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              {farmstay.rating !== undefined && (
                <span
                  style={{
                    color: "var(--gold)",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  {"★".repeat(Math.round(farmstay.rating))} {farmstay.rating}
                </span>
              )}
              {farmstay.reviewCount !== undefined && (
                <span
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "0.85rem",
                  }}
                >
                  {farmstay.reviewCount} đánh giá
                </span>
              )}
              {farmstay.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "3px 12px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.1)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    color: "rgba(255,255,255,0.8)",
                    fontSize: "0.75rem",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY: 2-col layout ── */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 48,
            alignItems: "start",
          }}
          className="detail-grid"
        >
          {/* ── LEFT COLUMN ── */}
          <div>
            <div style={{ paddingTop: 36 }}>
              <BreadcrumbNav
                items={[
                  { name: "Tìm kiếm", href: "/tim-kiem" },
                  {
                    name: farmstay.location,
                    href: `/tim-kiem?q=${encodeURIComponent(farmstay.location)}`,
                  },
                ]}
              />
            </div>

            {/* Story section */}
            <section
              style={{
                marginTop: 8,
                paddingBottom: 36,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display),serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 16,
                }}
              >
                Câu chuyện của chúng tôi
              </h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.85,
                  marginBottom: 14,
                  fontSize: "0.95rem",
                }}
              >
                {farmstay.name} ra đời từ tình yêu với mảnh đất{" "}
                {farmstay.province} và mong muốn chia sẻ cuộc sống nông nghiệp
                đích thực với những người đến từ thành phố. Không phải resort,
                không phải show — đây là nơi bạn thật sự sống cùng đất, cùng
                cây, cùng nhịp thở của tự nhiên.
              </p>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.85,
                  fontSize: "0.95rem",
                }}
              >
                Mỗi mùa tại đây mang một sắc màu riêng —{" "}
                <strong style={{ color: "var(--text-primary)" }}>
                  {farmstay.tags.slice(0, 2).join(", ")}
                </strong>{" "}
                là những trải nghiệm không thể bỏ lỡ. Chủ nhà luôn ở đây, sẵn
                sàng dẫn bạn khám phá từng góc của nông trại.
              </p>
            </section>

            {/* Activities */}
            <section
              style={{
                paddingTop: 32,
                paddingBottom: 36,
                borderBottom: "1px solid var(--border)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display),serif",
                  fontSize: "1.3rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 20,
                }}
              >
                Bạn sẽ trải nghiệm gì?
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                  gap: 12,
                }}
              >
                {farmstay.tags.map((tag) => (
                  <div
                    key={tag}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "16px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <span style={{ fontSize: "1.4rem" }}>{farmstay.emoji}</span>
                    <span
                      style={{
                        fontSize: "0.85rem",
                        color: "var(--text-muted)",
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Amenities — tự ẩn khi chưa có tiện nghi THẬT, không để lại khung trống
                mang tiêu đề "Tiện nghi & Dịch vụ" */}
            {amenities.length > 0 && (
              <section
                style={{
                  paddingTop: 32,
                  paddingBottom: 36,
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <h2
                  style={{
                    fontFamily: "var(--font-display),serif",
                    fontSize: "1.3rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 20,
                  }}
                >
                  Tiện nghi & Dịch vụ
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  {amenities.map((item) => (
                    <div
                      key={item}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        color: "var(--text-muted)",
                        fontSize: "0.88rem",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--gold)",
                          fontWeight: 700,
                          fontSize: "0.8rem",
                        }}
                      >
                        ✓
                      </span>
                      {item}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Khối "Đánh giá từ khách" đã GỠ 08/08/2026: 2 lời khen ký tên
                "Minh Phương" và "Gia đình anh Tuấn" do khung web cũ tự chế, dùng chung
                cho MỌI farmstay. Web không có chức năng nhận đánh giá nên không có
                đánh giá thật nào để thay vào — để trống là đúng. */}
          </div>

          {/* ── RIGHT COLUMN: Booking card ── */}
          <div style={{ paddingTop: 36 }}>
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                padding: "28px",
                position: "sticky",
                top: 82,
                boxShadow: "var(--shadow)",
              }}
            >
              {/* Price */}
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 6,
                  marginBottom: 6,
                }}
              >
                <span
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    fontFamily: "var(--font-display),serif",
                  }}
                >
                  {formatPrice(farmstay.price)}
                </span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
                  /đêm
                </span>
              </div>
              {farmstay.rating !== undefined && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 24,
                  }}
                >
                  <span style={{ color: "var(--gold)", fontSize: "0.85rem" }}>
                    {"★".repeat(Math.round(farmstay.rating))}
                  </span>
                  {farmstay.reviewCount !== undefined && (
                    <span
                      style={{ color: "var(--text-dim)", fontSize: "0.78rem" }}
                    >
                      {farmstay.reviewCount} đánh giá
                    </span>
                  )}
                </div>
              )}

              {/* Date pickers */}
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  marginBottom: 12,
                }}
              >
                {[
                  { id: "checkin", label: "NHẬN PHÒNG", type: "date" },
                  { id: "checkout", label: "TRẢ PHÒNG", type: "date" },
                ].map((field, i) => (
                  <div
                    key={field.id}
                    style={{
                      padding: "12px 16px",
                      borderBottom:
                        i === 0 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <label
                      htmlFor={field.id}
                      style={{
                        display: "block",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: "var(--text-dim)",
                        letterSpacing: "0.1em",
                        marginBottom: 4,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--text-primary)",
                        fontSize: "0.9rem",
                        outline: "none",
                        width: "100%",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Guests */}
              <div
                style={{
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "12px 16px",
                  marginBottom: 20,
                }}
              >
                <label
                  htmlFor="guests"
                  style={{
                    display: "block",
                    fontSize: "0.68rem",
                    fontWeight: 700,
                    color: "var(--text-dim)",
                    letterSpacing: "0.1em",
                    marginBottom: 4,
                  }}
                >
                  SỐ KHÁCH
                </label>
                <select
                  id="guests"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--text-primary)",
                    fontSize: "0.9rem",
                    outline: "none",
                    width: "100%",
                    cursor: "pointer",
                  }}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => (
                    <option key={n} value={n}>
                      {n} khách
                    </option>
                  ))}
                </select>
              </div>

              <button
                style={{
                  width: "100%",
                  padding: "15px",
                  borderRadius: 20,
                  background: "var(--gold)",
                  color: "var(--bg-deep)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 12,
                  transition: "var(--transition)",
                  letterSpacing: "0.02em",
                }}
              >
                Đặt phòng ngay
              </button>

              <button
                style={{
                  width: "100%",
                  padding: "13px",
                  borderRadius: 20,
                  background: "transparent",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: "0.88rem",
                  border: "1px solid var(--border)",
                  cursor: "pointer",
                  marginBottom: 16,
                  transition: "var(--transition)",
                }}
              >
                Liên hệ chủ farmstay
              </button>

              <p
                style={{
                  fontSize: "0.73rem",
                  color: "var(--text-dim)",
                  textAlign: "center",
                  marginBottom: 20,
                }}
              >
                Miễn phí huỷ phòng trước 48 giờ · Xác nhận trong 2h
              </p>

              {/* Price breakdown hint */}
              <div
                style={{
                  borderTop: "1px solid var(--border)",
                  paddingTop: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                {[
                  [
                    `${formatPrice(farmstay.price)} × 2 đêm`,
                    formatPrice(farmstay.price * 2),
                  ],
                  [
                    "Phí dịch vụ",
                    formatPrice(Math.round(farmstay.price * 0.12)),
                  ],
                ].map(([label, val]) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.82rem",
                      color: "var(--text-dim)",
                    }}
                  >
                    <span
                      style={{
                        textDecoration: "underline",
                        textDecorationStyle: "dotted",
                      }}
                    >
                      {label}
                    </span>
                    <span>{val}</span>
                  </div>
                ))}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.9rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    paddingTop: 8,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <span>Tổng cộng</span>
                  <span>
                    {formatPrice(
                      farmstay.price * 2 + Math.round(farmstay.price * 0.12)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Owner contact card */}
            <div
              style={{
                marginTop: 16,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "20px 24px",
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "var(--gold-dim)",
                  border: "1px solid var(--gold-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  flexShrink: 0,
                }}
              >
                {farmstay.emoji}
              </div>
              <div>
                <p
                  style={{
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 2,
                  }}
                >
                  Chủ farmstay
                </p>
                {/* Dòng "Tỷ lệ phản hồi 98% · Thường trả lời trong 1 giờ" đã GỠ
                    08/08/2026 — số tự chế, web không đo được tốc độ trả lời của chủ farm. */}
                <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                  Liên hệ trực tiếp với chủ farm
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
