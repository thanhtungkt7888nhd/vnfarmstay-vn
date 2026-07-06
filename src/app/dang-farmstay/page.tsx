"use client";

/**
 * Trang đăng ký farmstay — layout 2 cột: value proposition (trái) + form (phải).
 * Thiết kế để chủ farmstay thấy ngay lý do nên tham gia trước khi điền form.
 */
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

const schema = z.object({
  name: z.string().min(2, "Vui lòng nhập tên farmstay"),
  ownerName: z.string().min(2, "Vui lòng nhập họ tên chủ farmstay"),
  phone: z.string().regex(/^(0|\+84)[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  province: z.string().min(1, "Vui lòng chọn tỉnh thành"),
  address: z.string().min(10, "Vui lòng nhập địa chỉ đầy đủ"),
  description: z.string().min(50, "Mô tả tối thiểu 50 ký tự"),
});

type FormData = z.infer<typeof schema>;

const PROVINCES = [
  "Hà Giang",
  "Lào Cai",
  "Yên Bái",
  "Sơn La",
  "Hòa Bình",
  "Hà Nội",
  "Ninh Bình",
  "Thanh Hóa",
  "Nghệ An",
  "Hà Tĩnh",
  "Quảng Bình",
  "Quảng Trị",
  "Thừa Thiên Huế",
  "Đà Nẵng",
  "Quảng Nam",
  "Quảng Ngãi",
  "Bình Định",
  "Phú Yên",
  "Khánh Hòa",
  "Gia Lai",
  "Kon Tum",
  "Đắk Lắk",
  "Đắk Nông",
  "Lâm Đồng",
  "Đồng Nai",
  "Bình Dương",
  "TP. Hồ Chí Minh",
  "Long An",
  "Tiền Giang",
  "Đồng Tháp",
  "Cần Thơ",
  "An Giang",
  "Kiên Giang",
  "Cà Mau",
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "var(--radius-sm)",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  outline: "none",
  transition: "var(--transition)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: 700,
  color: "var(--text-dim)",
  marginBottom: 8,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
};

/** Lợi ích hiển thị bên cột trái */
const BENEFITS = [
  {
    icon: "👥",
    title: "50.000+ du khách/tháng",
    desc: "Tiếp cận lượng khách chủ động tìm farmstay — không cần chạy quảng cáo.",
  },
  {
    icon: "✅",
    title: "Huy hiệu xác minh",
    desc: 'Badge "Đã xác minh" giúp farmstay nổi bật và tăng tỷ lệ đặt phòng lên 3×.',
  },
  {
    icon: "📈",
    title: "SEO tự động",
    desc: "Mỗi farmstay có trang riêng được tối ưu SEO — khách tìm trên Google thấy ngay.",
  },
  {
    icon: "🤝",
    title: "Cộng đồng chủ farmstay",
    desc: "Tham gia mạng lưới 500+ chủ farmstay — chia sẻ kinh nghiệm, hỗ trợ lẫn nhau.",
  },
];

/** Quote từ chủ farmstay thật */
const TESTIMONIAL = {
  quote:
    "Từ khi lên Farmstay.vn, tôi không phải đăng bài Facebook mỗi ngày nữa. Khách tự tìm đến, tháng nào cũng kín lịch cuối tuần.",
  name: "Chị Nguyễn Hương",
  farm: "Vườn Cà Phê Robusta · Kon Tum",
  avatar: "☕",
};

export default function DangFarmstayPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (_data: FormData) => {
    await new Promise((r) => setTimeout(r, 1200));
  };

  if (isSubmitSuccessful) {
    return (
      <>
        <Navbar />
        <div
          style={{
            minHeight: "80vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 24px",
            textAlign: "center",
            background: "var(--bg-deep)",
          }}
        >
          <div style={{ maxWidth: 480 }}>
            <div style={{ fontSize: "4rem", marginBottom: 20 }}>🎉</div>
            <h1
              style={{
                fontFamily: "var(--font-playfair),serif",
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--gold)",
                marginBottom: 16,
              }}
            >
              Chào mừng bạn gia nhập!
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: 12,
              }}
            >
              Đội ngũ Farmstay.vn sẽ liên hệ trong vòng{" "}
              <strong style={{ color: "var(--text-primary)" }}>24 giờ</strong>{" "}
              để xác minh và hỗ trợ hoàn thiện hồ sơ farmstay của bạn.
            </p>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.85rem",
                marginBottom: 32,
              }}
            >
              Trong thời gian chờ, hãy chuẩn bị{" "}
              <strong style={{ color: "var(--gold)" }}>
                5–10 ảnh đẹp nhất
              </strong>{" "}
              của farmstay — đó là yếu tố thu hút khách số một.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <a
                href="/chu-farmstay"
                style={{
                  padding: "12px 28px",
                  borderRadius: 20,
                  background: "var(--gold)",
                  color: "var(--bg-deep)",
                  fontWeight: 700,
                  display: "inline-block",
                  fontSize: "0.9rem",
                }}
              >
                Xem hướng dẫn chủ farmstay
              </a>
              <a
                href="/"
                style={{
                  padding: "12px 28px",
                  borderRadius: 20,
                  background: "transparent",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  display: "inline-block",
                  fontSize: "0.9rem",
                }}
              >
                Về trang chủ
              </a>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      {/* Page hero — narrow */}
      <section
        style={{
          background: "var(--bg-deep)",
          borderBottom: "1px solid var(--border)",
          padding: "48px 24px 40px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "var(--gold)",
            marginBottom: 12,
            textTransform: "uppercase",
          }}
        >
          Dành cho chủ farmstay
        </p>
        <h1
          style={{
            fontFamily: "var(--font-playfair),serif",
            fontSize: "clamp(1.8rem,4vw,2.6rem)",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.2,
            marginBottom: 14,
            maxWidth: 620,
            margin: "0 auto 14px",
          }}
        >
          Đưa farmstay của bạn đến{" "}
          <em style={{ color: "var(--gold)" }}>50.000 du khách</em> mỗi tháng
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            fontSize: "0.95rem",
            lineHeight: 1.7,
            maxWidth: 500,
            margin: "0 auto",
          }}
        >
          Đăng ký miễn phí — không phí ẩn, không cam kết dài hạn. Farmstay.vn
          chỉ thu phí khi bạn có đặt phòng thành công.
        </p>
      </section>

      <main
        style={{
          background: "var(--bg-main)",
          minHeight: "80vh",
          padding: "48px 24px 80px",
        }}
      >
        {/* Stats bar */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto 48px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 1,
            background: "var(--border)",
            borderRadius: "var(--radius-sm)",
            overflow: "hidden",
            border: "1px solid var(--border)",
          }}
        >
          {[
            { num: "50.000+", label: "du khách/tháng" },
            { num: "500+", label: "farmstay xác minh" },
            { num: "4.8★", label: "đánh giá trung bình" },
            { num: "0đ", label: "phí đăng ký" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                background: "var(--bg-card)",
                padding: "20px 24px",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-playfair),serif",
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--gold)",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {s.num}
              </div>
              <div style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main 2-col layout */}
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 48,
            alignItems: "start",
          }}
          className="register-grid"
        >
          {/* ── Cột trái: Value proposition ── */}
          <div style={{ position: "sticky", top: 90 }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair),serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 28,
                lineHeight: 1.3,
              }}
            >
              Tại sao 500+ chủ farmstay
              <br />
              chọn Farmstay.vn?
            </h2>

            {/* Benefits */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 20,
                marginBottom: 36,
              }}
            >
              {BENEFITS.map((b) => (
                <div
                  key={b.title}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr",
                    gap: 16,
                    alignItems: "start",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--gold-dim)",
                      border: "1px solid var(--gold-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.4rem",
                      flexShrink: 0,
                    }}
                  >
                    {b.icon}
                  </div>
                  <div>
                    <p
                      style={{
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontSize: "0.92rem",
                        marginBottom: 4,
                      }}
                    >
                      {b.title}
                    </p>
                    <p
                      style={{
                        color: "var(--text-dim)",
                        fontSize: "0.83rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {b.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <blockquote
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderLeft: "3px solid var(--gold)",
                borderRadius: "var(--radius-sm)",
                padding: "20px 24px",
                margin: 0,
              }}
            >
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "0.88rem",
                  lineHeight: 1.7,
                  fontStyle: "italic",
                  marginBottom: 14,
                }}
              >
                &ldquo;{TESTIMONIAL.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  aria-hidden="true"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--gold-dim)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.1rem",
                    flexShrink: 0,
                  }}
                >
                  {TESTIMONIAL.avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {TESTIMONIAL.name}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}>
                    {TESTIMONIAL.farm}
                  </p>
                </div>
              </div>
            </blockquote>

            <p
              style={{
                marginTop: 20,
                fontSize: "0.82rem",
                color: "var(--text-dim)",
              }}
            >
              Đã có tài khoản?{" "}
              <a
                href="/dang-nhap"
                style={{ color: "var(--gold)", textDecoration: "underline" }}
              >
                Đăng nhập tại đây →
              </a>
            </p>
          </div>

          {/* ── Cột phải: Form đăng ký ── */}
          <div
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "36px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair),serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Thông tin farmstay của bạn
            </h2>
            <p
              style={{
                fontSize: "0.82rem",
                color: "var(--text-dim)",
                marginBottom: 28,
              }}
            >
              Điền đầy đủ để đội ngũ xác minh nhanh hơn — thường trong 24 giờ.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              aria-label="Form đăng ký farmstay"
              style={{ display: "flex", flexDirection: "column", gap: 20 }}
            >
              {/* Farmstay name */}
              <div>
                <label htmlFor="farm-name" style={labelStyle}>
                  Tên farmstay *
                </label>
                <input
                  id="farm-name"
                  {...register("name")}
                  placeholder="VD: Đồi Chè Sunrise Mộc Châu"
                  style={inputStyle}
                />
                {errors.name && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: "0.78rem",
                      marginTop: 6,
                    }}
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Owner name */}
              <div>
                <label htmlFor="owner-name" style={labelStyle}>
                  Họ tên chủ farmstay *
                </label>
                <input
                  id="owner-name"
                  {...register("ownerName")}
                  autoComplete="name"
                  placeholder="Họ và tên đầy đủ"
                  style={inputStyle}
                />
                {errors.ownerName && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: "0.78rem",
                      marginTop: 6,
                    }}
                  >
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              {/* Phone + Email */}
              <div className="grid-form-2">
                <div>
                  <label htmlFor="farm-phone" style={labelStyle}>
                    Số điện thoại *
                  </label>
                  <input
                    id="farm-phone"
                    {...register("phone")}
                    type="tel"
                    autoComplete="tel"
                    placeholder="0912 345 678"
                    style={inputStyle}
                  />
                  {errors.phone && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: "0.78rem",
                        marginTop: 6,
                      }}
                    >
                      {errors.phone.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="farm-email" style={labelStyle}>
                    Email *
                  </label>
                  <input
                    id="farm-email"
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    placeholder="farmstay@gmail.com"
                    style={inputStyle}
                  />
                  {errors.email && (
                    <p
                      style={{
                        color: "#f87171",
                        fontSize: "0.78rem",
                        marginTop: 6,
                      }}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Province */}
              <div>
                <label htmlFor="farm-province" style={labelStyle}>
                  Tỉnh / thành phố *
                </label>
                <select
                  id="farm-province"
                  {...register("province")}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  <option value="">-- Chọn tỉnh thành --</option>
                  {PROVINCES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
                {errors.province && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: "0.78rem",
                      marginTop: 6,
                    }}
                  >
                    {errors.province.message}
                  </p>
                )}
              </div>

              {/* Address */}
              <div>
                <label htmlFor="farm-address" style={labelStyle}>
                  Địa chỉ cụ thể *
                </label>
                <input
                  id="farm-address"
                  {...register("address")}
                  placeholder="Số nhà, thôn, xã, huyện..."
                  style={inputStyle}
                />
                {errors.address && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: "0.78rem",
                      marginTop: 6,
                    }}
                  >
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="farm-desc" style={labelStyle}>
                  Kể về farmstay của bạn *
                </label>
                <textarea
                  id="farm-desc"
                  {...register("description")}
                  rows={5}
                  placeholder="Điểm đặc biệt nhất của farmstay? Khách đến đây sẽ trải nghiệm gì? Câu chuyện phía sau vườn đất của bạn là gì?..."
                  style={{ ...inputStyle, resize: "vertical" }}
                />
                {errors.description && (
                  <p
                    style={{
                      color: "#f87171",
                      fontSize: "0.78rem",
                      marginTop: 6,
                    }}
                  >
                    {errors.description.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "15px",
                  borderRadius: 20,
                  background: isSubmitting
                    ? "rgba(212,168,83,0.5)"
                    : "var(--gold)",
                  color: "var(--bg-deep)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  border: "none",
                  cursor: isSubmitting ? "wait" : "pointer",
                  transition: "var(--transition)",
                  letterSpacing: "0.02em",
                }}
              >
                {isSubmitting ? "Đang gửi..." : "🌿 Đăng ký miễn phí ngay"}
              </button>

              <p
                style={{
                  fontSize: "0.73rem",
                  color: "var(--text-dim)",
                  textAlign: "center",
                  lineHeight: 1.6,
                }}
              >
                Bằng cách đăng ký, bạn đồng ý với{" "}
                <a href="/dieu-khoan" style={{ color: "var(--gold)" }}>
                  Điều khoản
                </a>{" "}
                và{" "}
                <a href="/chinh-sach-bao-mat" style={{ color: "var(--gold)" }}>
                  Chính sách bảo mật
                </a>
                .
              </p>
            </form>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .register-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
