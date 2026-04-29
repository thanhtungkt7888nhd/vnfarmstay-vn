import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Chính sách bảo mật – Farmstay.vn",
  description:
    "Chính sách bảo mật Farmstay.vn — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
  alternates: { canonical: "https://farmstay.vn/chinh-sach-bao-mat" },
};

const SECTIONS = [
  {
    title: "1. Thông tin chúng tôi thu thập",
    content:
      "Chúng tôi thu thập: thông tin bạn cung cấp (tên, email, số điện thoại khi đăng ký); thông tin đặt phòng (ngày, số khách, farmstay); dữ liệu sử dụng (trang đã xem, thời gian truy cập, thiết bị); và cookie phục vụ trải nghiệm.",
  },
  {
    title: "2. Mục đích sử dụng",
    content:
      "Dữ liệu được dùng để: xử lý đặt phòng và thanh toán; gửi thông báo liên quan đến đặt phòng; cải thiện dịch vụ và trải nghiệm người dùng; phân tích xu hướng (ẩn danh); phòng chống gian lận.",
  },
  {
    title: "3. Chia sẻ thông tin",
    content:
      "Chúng tôi KHÔNG bán thông tin cá nhân. Thông tin chỉ được chia sẻ với: chủ farmstay khi bạn đặt phòng (tên, số điện thoại); đối tác thanh toán (mã hóa); cơ quan pháp luật khi có yêu cầu hợp pháp.",
  },
  {
    title: "4. Cookie và theo dõi",
    content:
      "Farmstay.vn dùng cookie để: lưu phiên đăng nhập; ghi nhớ tùy chọn tìm kiếm; phân tích lưu lượng qua GA4 (ẩn danh). Bạn có thể tắt cookie trong trình duyệt, nhưng một số tính năng có thể bị ảnh hưởng.",
  },
  {
    title: "5. Bảo mật dữ liệu",
    content:
      "Chúng tôi áp dụng: HTTPS/TLS cho mọi kết nối; mã hóa mật khẩu bcrypt; 2FA cho tài khoản admin; giới hạn truy cập dữ liệu theo vai trò; backup mã hóa 4 nơi lưu trữ.",
  },
  {
    title: "6. Quyền của bạn",
    content:
      "Bạn có quyền: xem dữ liệu chúng tôi lưu về bạn; yêu cầu chỉnh sửa thông tin không chính xác; yêu cầu xóa tài khoản và dữ liệu; rút lại sự đồng ý marketing bất kỳ lúc nào.",
  },
  {
    title: "7. Lưu trữ dữ liệu",
    content:
      "Dữ liệu đặt phòng được lưu 3 năm theo yêu cầu kế toán. Tài khoản không hoạt động 2 năm sẽ được thông báo trước khi xóa. Dữ liệu analytics được ẩn danh sau 26 tháng.",
  },
  {
    title: "8. Trẻ em",
    content:
      "Farmstay.vn không có dịch vụ hướng đến trẻ em dưới 13 tuổi và không cố ý thu thập thông tin của trẻ em. Nếu phát hiện, vui lòng liên hệ để chúng tôi xóa ngay.",
  },
  {
    title: "9. Thay đổi chính sách",
    content:
      "Khi có thay đổi quan trọng, chúng tôi sẽ thông báo qua email và hiển thị banner trên website ít nhất 7 ngày trước khi áp dụng. Ngày cập nhật luôn được hiển thị đầu trang.",
  },
  {
    title: "10. Liên hệ",
    content:
      "Mọi yêu cầu liên quan đến dữ liệu cá nhân: Email privacy@farmstay.vn hoặc gửi thư đến địa chỉ Farmstay.vn, TP. Hồ Chí Minh, Việt Nam. Phản hồi trong vòng 72 giờ.",
  },
];

export default function ChinhSachBaoMatPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-deep)", minHeight: "80vh" }}>
        <section
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "64px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
              fontWeight: 700,
              marginBottom: 12,
            }}
          >
            Chính sách <em style={{ color: "var(--gold)" }}>bảo mật</em>
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}>
            Cập nhật lần cuối: 29/04/2026
          </p>
        </section>

        <section style={{ padding: "60px 24px 80px" }}>
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: 32,
            }}
          >
            {SECTIONS.map((sec) => (
              <div key={sec.title}>
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 10,
                  }}
                >
                  {sec.title}
                </h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    fontSize: "0.92rem",
                  }}
                >
                  {sec.content}
                </p>
              </div>
            ))}

            <div
              style={{
                marginTop: 16,
                padding: "24px",
                background: "var(--bg-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--gold-border)",
                fontSize: "0.85rem",
                color: "var(--text-dim)",
                lineHeight: 1.7,
              }}
            >
              Câu hỏi về quyền riêng tư?{" "}
              <a
                href="mailto:privacy@farmstay.vn"
                style={{ color: "var(--gold)" }}
              >
                privacy@farmstay.vn
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
