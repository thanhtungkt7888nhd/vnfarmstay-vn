"use client";

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

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "var(--radius-sm)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  outline: "none",
  transition: "var(--transition)",
};

export default function DangFarmstayPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Form submitted:", data);
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
          }}
        >
          <div>
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
              Đăng ký thành công!
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 480,
                margin: "0 auto 28px",
                lineHeight: 1.7,
              }}
            >
              Đội ngũ Farmstay.vn sẽ liên hệ với bạn trong vòng 24 giờ để xác
              minh và hỗ trợ hoàn thiện hồ sơ.
            </p>
            <a
              href="/"
              style={{
                padding: "12px 32px",
                borderRadius: 20,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                display: "inline-block",
              }}
            >
              Về trang chủ
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main
        style={{
          background: "var(--bg-deep)",
          minHeight: "80vh",
          padding: "60px 24px",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <h1
            style={{
              fontFamily: "var(--font-playfair),serif",
              fontSize: "clamp(1.8rem,4vw,2.8rem)",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Đăng ký <em style={{ color: "var(--gold)" }}>Farmstay</em> của bạn
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              marginBottom: 40,
              lineHeight: 1.7,
            }}
          >
            Kết nối với 50.000+ du khách đang tìm kiếm trải nghiệm nông nghiệp
            đích thực. Đăng ký miễn phí — Farmstay.vn chỉ thu phí khi bạn có đặt
            phòng thành công.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={{ display: "flex", flexDirection: "column", gap: 20 }}
          >
            {/* Farmstay name */}
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                TÊN FARMSTAY *
              </label>
              <input
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
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                HỌ TÊN CHỦ FARMSTAY *
              </label>
              <input
                {...register("ownerName")}
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
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    marginBottom: 8,
                    letterSpacing: "0.05em",
                  }}
                >
                  SỐ ĐIỆN THOẠI *
                </label>
                <input
                  {...register("phone")}
                  type="tel"
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
                <label
                  style={{
                    display: "block",
                    fontSize: "0.82rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    marginBottom: 8,
                    letterSpacing: "0.05em",
                  }}
                >
                  EMAIL *
                </label>
                <input
                  {...register("email")}
                  type="email"
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
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                TỈNH / THÀNH PHỐ *
              </label>
              <select
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
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                ĐỊA CHỈ CỤ THỂ *
              </label>
              <input
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
              <label
                style={{
                  display: "block",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 8,
                  letterSpacing: "0.05em",
                }}
              >
                MÔ TẢ FARMSTAY *
              </label>
              <textarea
                {...register("description")}
                rows={5}
                placeholder="Kể về farmstay của bạn — điểm đặc biệt, trải nghiệm nổi bật, câu chuyện phía sau..."
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
                padding: "14px",
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
              }}
            >
              {isSubmitting ? "Đang gửi..." : "🌿 Đăng ký ngay — Miễn phí"}
            </button>

            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                textAlign: "center",
              }}
            >
              Bằng cách đăng ký, bạn đồng ý với{" "}
              <a href="/dieu-khoan" style={{ color: "var(--gold)" }}>
                Điều khoản sử dụng
              </a>{" "}
              và{" "}
              <a href="/chinh-sach-bao-mat" style={{ color: "var(--gold)" }}>
                Chính sách bảo mật
              </a>{" "}
              của Farmstay.vn.
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
