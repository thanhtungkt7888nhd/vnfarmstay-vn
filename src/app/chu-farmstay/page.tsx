/**
 * Trang hub dành cho Chủ Farmstay — giải thích lợi ích, cách hoạt động,
 * giá niêm yết, FAQ và CTA đăng ký. Đây là landing page B2B quan trọng nhất.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { JsonLd } from "@/shared/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dành cho Chủ Farmstay — Đưa farm của bạn lên Farmstay.vn",
  description:
    "Nền tảng farmstay hàng đầu Việt Nam. Miễn phí đăng ký, tiếp cận 50.000+ du khách mỗi tháng. Công cụ quản lý đặt phòng, analytics và hỗ trợ 24/7 cho chủ farmstay.",
  canonical: "/chu-farmstay",
  keywords: [
    "chủ farmstay",
    "đăng ký farmstay",
    "kinh doanh farmstay",
    "quản lý farmstay",
    "nền tảng farmstay việt nam",
  ],
});

const schemas = [
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Dành cho chủ farmstay", url: "/chu-farmstay" },
  ]),
];

const steps = [
  {
    num: "01",
    icon: "📋",
    title: "Đăng ký miễn phí",
    desc: "Điền thông tin cơ bản về farmstay trong 10 phút. Đội ngũ Farmstay.vn liên hệ hỗ trợ trong 24h.",
  },
  {
    num: "02",
    icon: "✅",
    title: "Xác minh thực địa",
    desc: "Chúng tôi xác minh farmstay của bạn — đảm bảo tiêu chuẩn chất lượng và xây dựng lòng tin với du khách.",
  },
  {
    num: "03",
    icon: "🚀",
    title: "Lên sóng & nhận đặt phòng",
    desc: "Trang farmstay của bạn xuất hiện trên nền tảng, trên Google và mạng xã hội. Đặt phòng về trực tiếp.",
  },
];

const benefits = [
  {
    icon: "👁️",
    title: "50.000+ du khách/tháng",
    desc: "Tiếp cận đúng đối tượng — người thật sự muốn đến farmstay, không phải khách du lịch đại trà.",
  },
  {
    icon: "📸",
    title: "Trang giới thiệu chuyên nghiệp",
    desc: "Gallery ảnh đẹp, mô tả đầy cảm xúc, bản đồ vị trí, hoạt động nổi bật — farmstay của bạn được trình bày đúng giá trị.",
  },
  {
    icon: "📊",
    title: "Analytics minh bạch",
    desc: "Biết ai đang xem trang của bạn, từ đâu đến, quan tâm điều gì. Ra quyết định dựa trên dữ liệu thật.",
  },
  {
    icon: "🛡️",
    title: "Hỗ trợ pháp lý & vận hành",
    desc: "Thư viện kiến thức về giấy phép, bảo hiểm, định giá và vận hành farmstay chuẩn — chỉ có trên Farmstay.vn.",
  },
  {
    icon: "💬",
    title: "Cộng đồng chủ farmstay",
    desc: "Kết nối với hàng trăm chủ farmstay trên cả nước. Chia sẻ kinh nghiệm, học từ người đi trước.",
  },
  {
    icon: "💰",
    title: "0đ niêm yết cơ bản",
    desc: "Tạo trang farmstay hoàn toàn miễn phí. Chỉ thanh toán % hoa hồng khi có đặt phòng thành công.",
  },
];

const pricing = [
  {
    tier: "Cơ bản",
    price: "Miễn phí",
    sub: "Mãi mãi",
    color: "var(--border)",
    features: [
      "Trang giới thiệu farmstay",
      "Tối đa 10 ảnh",
      "Hiển thị trên bản đồ",
      "Nhận yêu cầu đặt phòng",
      "Hỗ trợ email",
    ],
    cta: "Đăng ký ngay",
    ctaHref: "/dang-farmstay",
    highlight: false,
  },
  {
    tier: "Xác minh",
    price: "8% hoa hồng",
    sub: "trên mỗi đặt phòng thành công",
    color: "var(--gold)",
    features: [
      "Tất cả tính năng Cơ bản",
      'Huy hiệu "Đã xác minh"',
      "Ảnh không giới hạn",
      "Ưu tiên hiển thị trong kết quả",
      "Analytics chi tiết",
      "Hỗ trợ ưu tiên 24/7",
      "Xuất hiện trong bài viết blog",
    ],
    cta: "Đăng ký & xác minh",
    ctaHref: "/dang-farmstay",
    highlight: true,
  },
];

const faqs = [
  {
    q: "Farmstay.vn lấy phí như thế nào?",
    a: "Đăng ký và tạo trang giới thiệu hoàn toàn miễn phí. Chúng tôi chỉ thu 8% hoa hồng trên mỗi đặt phòng thành công qua nền tảng. Không phí ẩn, không phí hàng tháng.",
  },
  {
    q: "Tôi cần chuẩn bị gì để đăng ký?",
    a: "Thông tin cơ bản về farmstay (tên, địa chỉ, mô tả), ít nhất 5 ảnh chất lượng tốt, và giấy phép kinh doanh (hoặc hộ kinh doanh cá thể). Đội ngũ chúng tôi sẽ hướng dẫn phần còn lại.",
  },
  {
    q: "Mất bao lâu để farmstay xuất hiện trên nền tảng?",
    a: "Sau khi đăng ký, đội ngũ Farmstay.vn liên hệ trong 24h. Sau khi xác minh thực địa (3–5 ngày), farmstay của bạn lên sóng ngay.",
  },
  {
    q: "Tôi có thể tự chỉnh sửa thông tin sau khi đăng ký không?",
    a: "Có. Bạn có thể cập nhật ảnh, mô tả, giá phòng và lịch trống bất cứ lúc nào qua bảng điều khiển chủ farmstay.",
  },
  {
    q: "Farmstay nhỏ, chưa có nhiều tiện nghi có thể đăng ký không?",
    a: "Hoàn toàn có thể. Farmstay.vn phù hợp với mọi quy mô — từ homestay nông trại nhỏ đến resort sinh thái lớn. Điều quan trọng là trải nghiệm đích thực, không phải tiện nghi xa xỉ.",
  },
];

const testimonials = [
  {
    avatar: "🌿",
    name: "Chị Nguyễn Hương",
    farm: "Vườn Cà Phê Robusta · Kon Tum",
    text: "Trước khi lên Farmstay.vn, tôi chủ yếu dựa vào khách qua zalo và giới thiệu miệng. Sau 3 tháng, đặt phòng tăng gấp đôi, quan trọng hơn là khách hiểu đúng về trải nghiệm của mình ngay từ đầu.",
    stat: "Đặt phòng tăng 2×",
  },
  {
    avatar: "🍃",
    name: "Anh Trần Minh",
    farm: "Vườn Dâu Tằm · Bảo Lộc",
    text: "Trang giới thiệu farmstay nhà tôi trông chuyên nghiệp hơn hẳn. Du khách đến đã hiểu mình sẽ trải nghiệm gì, nên rất ít khi thất vọng. Đó là thứ tôi cần nhất.",
    stat: "Giảm 70% câu hỏi lặp lại",
  },
];

export default function ChuFarmstayPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <style>{`
        .owner-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .owner-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .benefits-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        .pricing-grid { display: grid; grid-template-columns: 1fr; gap: 24px; }
        @media (min-width: 640px) { .pricing-grid { grid-template-columns: repeat(2, 1fr); } }
        .step-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 768px) { .step-grid { grid-template-columns: repeat(3, 1fr); } }
        .testimonial-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 768px) { .testimonial-grid { grid-template-columns: repeat(2, 1fr); } }
      `}</style>

      <main style={{ background: "var(--bg-main)", minHeight: "100vh" }}>
        {/* ── Hero ── */}
        <section
          style={{
            background:
              "linear-gradient(160deg, var(--bg-deep) 0%, #0d2b1a 100%)",
            borderBottom: "1px solid var(--gold-border)",
            padding: "72px 24px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative watermark */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "20rem",
              opacity: 0.03,
              pointerEvents: "none",
              userSelect: "none",
            }}
          >
            🌾
          </div>

          <div
            style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(212,168,83,0.15)",
                border: "1px solid var(--gold-border)",
                color: "var(--gold)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                padding: "5px 16px",
                borderRadius: 20,
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              Dành cho Chủ Farmstay
            </span>

            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              Đưa farmstay của bạn
              <br />
              <span style={{ color: "var(--gold)" }}>
                đến đúng người, đúng lúc
              </span>
            </h1>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.05rem",
                lineHeight: 1.75,
                maxWidth: 580,
                margin: "0 auto 36px",
              }}
            >
              Farmstay.vn kết nối farmstay của bạn với 50.000+ du khách đang tìm
              kiếm trải nghiệm nông nghiệp đích thực mỗi tháng — không qua trung
              gian, không phức tạp.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/dang-farmstay"
                style={{
                  display: "inline-block",
                  background: "var(--gold)",
                  color: "#0f2318",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  paddingStyle: "px-8 py-3.5",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                }}
              >
                Đăng ký miễn phí ngay
              </Link>
              <a
                href="#cach-hoat-dong"
                style={{
                  display: "inline-block",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  padding: "14px 28px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                }}
              >
                Tìm hiểu thêm ↓
              </a>
            </div>
          </div>
        </section>

        {/* ── Stats bar ── */}
        <div
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border)",
            padding: "20px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "flex",
              justifyContent: "space-around",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            {[
              { num: "50K+", label: "du khách/tháng" },
              { num: "500+", label: "farmstay đối tác" },
              { num: "8%", label: "hoa hồng duy nhất" },
              { num: "0đ", label: "phí niêm yết" },
            ].map(({ num, label }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-playfair), serif",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    lineHeight: 1,
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.78rem",
                    marginTop: 4,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}
        >
          <BreadcrumbNav
            items={[{ name: "Dành cho chủ farmstay", href: "/chu-farmstay" }]}
          />

          {/* ── Cách hoạt động ── */}
          <section
            id="cach-hoat-dong"
            style={{ marginTop: 64 }}
            aria-label="Cách hoạt động"
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Chỉ 3 bước để lên sóng
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                textAlign: "center",
                marginBottom: 48,
                fontSize: "0.92rem",
              }}
            >
              Từ đăng ký đến nhận đặt phòng — không quá 7 ngày.
            </p>

            <div className="step-grid">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  style={{
                    padding: "32px 28px",
                    borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontSize: "3rem",
                      fontWeight: 700,
                      color: "rgba(212,168,83,0.15)",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {step.num}
                  </div>
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>
                    {step.icon}
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      marginBottom: 10,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.88rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Lợi ích ── */}
          <section
            style={{ marginTop: 72 }}
            aria-label="Lợi ích cho chủ farmstay"
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Tại sao chủ farmstay chọn chúng tôi?
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                textAlign: "center",
                marginBottom: 44,
                fontSize: "0.92rem",
              }}
            >
              Không chỉ là nơi đăng tin — đây là đối tác phát triển kinh doanh
              của bạn.
            </p>

            <div
              className="owner-grid benefits-grid"
              style={{ display: "grid", gap: 20 }}
            >
              {benefits.map((b) => (
                <div
                  key={b.title}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "28px 24px",
                    transition: "var(--transition)",
                  }}
                >
                  <div style={{ fontSize: "2rem", marginBottom: 12 }}>
                    {b.icon}
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      marginBottom: 8,
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Testimonials ── */}
          <section
            style={{ marginTop: 72 }}
            aria-label="Chia sẻ từ chủ farmstay"
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
                marginBottom: 44,
              }}
            >
              Chủ farmstay nói gì?
            </h2>

            <div className="testimonial-grid">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "32px",
                    position: "relative",
                  }}
                >
                  {/* Stat badge */}
                  <div
                    style={{
                      position: "absolute",
                      top: 20,
                      right: 20,
                      background: "rgba(212,168,83,0.1)",
                      border: "1px solid var(--gold-border)",
                      color: "var(--gold)",
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "4px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {t.stat}
                  </div>

                  {/* Quote mark */}
                  <div
                    aria-hidden="true"
                    style={{
                      fontFamily: "Georgia, serif",
                      fontSize: "3.5rem",
                      color: "var(--gold-border)",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    "
                  </div>

                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.92rem",
                      lineHeight: 1.75,
                      fontStyle: "italic",
                      marginBottom: 24,
                    }}
                  >
                    {t.text}
                  </p>

                  <div
                    style={{ display: "flex", alignItems: "center", gap: 12 }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: "50%",
                        background: "var(--gold-dim)",
                        border: "1px solid var(--gold-border)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.3rem",
                      }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: 700,
                          color: "var(--text-primary)",
                          fontSize: "0.88rem",
                        }}
                      >
                        {t.name}
                      </div>
                      <div
                        style={{
                          color: "var(--text-dim)",
                          fontSize: "0.78rem",
                          marginTop: 2,
                        }}
                      >
                        {t.farm}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Bảng giá ── */}
          <section
            id="bang-gia"
            style={{ marginTop: 72 }}
            aria-label="Bảng giá"
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Minh bạch về chi phí
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                textAlign: "center",
                marginBottom: 44,
                fontSize: "0.92rem",
              }}
            >
              Không phí ẩn. Chỉ trả khi có doanh thu.
            </p>

            <div className="pricing-grid">
              {pricing.map((plan) => (
                <div
                  key={plan.tier}
                  style={{
                    background: plan.highlight
                      ? "var(--bg-deep)"
                      : "var(--bg-card)",
                    border: `1px solid ${plan.highlight ? "var(--gold-border)" : "var(--border)"}`,
                    borderRadius: "var(--radius)",
                    padding: "36px 28px",
                    position: "relative",
                  }}
                >
                  {plan.highlight && (
                    <div
                      style={{
                        position: "absolute",
                        top: -13,
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--gold)",
                        color: "#0f2318",
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        padding: "4px 16px",
                        borderRadius: 20,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Được chọn nhiều nhất
                    </div>
                  )}

                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--text-dim)",
                      fontSize: "0.78rem",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      marginBottom: 12,
                    }}
                  >
                    {plan.tier}
                  </div>

                  <div
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontSize: "2rem",
                      fontWeight: 700,
                      color: plan.highlight
                        ? "var(--gold)"
                        : "var(--text-primary)",
                      lineHeight: 1.2,
                    }}
                  >
                    {plan.price}
                  </div>
                  <div
                    style={{
                      color: "var(--text-dim)",
                      fontSize: "0.78rem",
                      marginBottom: 28,
                      marginTop: 4,
                    }}
                  >
                    {plan.sub}
                  </div>

                  <ul
                    style={{
                      listStyle: "none",
                      padding: 0,
                      margin: "0 0 32px 0",
                      display: "flex",
                      flexDirection: "column",
                      gap: 10,
                    }}
                  >
                    {plan.features.map((f) => (
                      <li
                        key={f}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 8,
                          color: "var(--text-muted)",
                          fontSize: "0.88rem",
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: "var(--gold)", flexShrink: 0 }}>
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.ctaHref}
                    style={{
                      display: "block",
                      textAlign: "center",
                      background: plan.highlight
                        ? "var(--gold)"
                        : "transparent",
                      border: plan.highlight
                        ? "none"
                        : "1px solid var(--border)",
                      color: plan.highlight ? "#0f2318" : "var(--text-muted)",
                      fontWeight: 700,
                      fontSize: "0.9rem",
                      padding: "12px",
                      borderRadius: "var(--radius-sm)",
                      textDecoration: "none",
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </section>

          {/* ── FAQ ── */}
          <section style={{ marginTop: 72 }} aria-label="Câu hỏi thường gặp">
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 32,
              }}
            >
              Câu hỏi thường gặp
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {faqs.map((item, idx) => (
                <details
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "18px 22px",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      listStyle: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.q}
                  </summary>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      marginTop: 12,
                      lineHeight: 1.75,
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section
            style={{
              marginTop: 72,
              background: "var(--bg-deep)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius)",
              padding: "56px 40px",
              textAlign: "center",
            }}
            aria-label="Đăng ký"
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--gold)",
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Bắt đầu ngay hôm nay
            </p>
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
                lineHeight: 1.3,
              }}
            >
              Farmstay của bạn xứng đáng
              <br />
              được nhiều người biết đến hơn
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.92rem",
                maxWidth: 460,
                margin: "0 auto 32px",
                lineHeight: 1.7,
              }}
            >
              Đăng ký miễn phí trong 10 phút. Đội ngũ Farmstay.vn liên hệ hỗ trợ
              trong 24h.
            </p>
            <Link
              href="/dang-farmstay"
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "#0f2318",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "14px 36px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
              }}
            >
              Đăng ký farmstay miễn phí →
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
