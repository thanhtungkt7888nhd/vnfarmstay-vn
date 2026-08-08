import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Chính sách bảo mật – vnfarmstay.vn",
  description:
    "Chính sách bảo mật vnfarmstay.vn — cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn.",
  alternates: { canonical: "https://vnfarmstay.vn/chinh-sach-bao-mat" },
};

/**
 * ⚠️ 08/08/2026 — Ông ra lệnh sửa lại cho đúng sự thật. Bản cũ (thừa hưởng từ khung web
 * nền tảng đặt phòng) khai thu thập "thông tin đặt phòng", "xử lý đặt phòng và thanh toán",
 * chia sẻ với "đối tác thanh toán", lưu "phiên đăng nhập", "mã hoá mật khẩu bcrypt",
 * "2FA tài khoản admin", "backup mã hoá 4 nơi lưu trữ", "dữ liệu đặt phòng lưu 3 năm".
 * KHÔNG có thứ nào tồn tại — web không có tài khoản, không có đặt phòng, không có thanh toán.
 * Khai khống trong chính sách bảo mật là tự nhận nghĩa vụ pháp lý mình không thực hiện được.
 * Bản này chỉ liệt kê đúng thứ ĐANG chạy thật: GA4 + Microsoft Clarity (khai ở layout.tsx)
 * và thư người dùng chủ động gửi tới. CẤM thêm mục nếu chức năng tương ứng chưa tồn tại.
 */
const SECTIONS = [
  {
    title: "1. Thông tin chúng tôi thu thập",
    content:
      "vnfarmstay.vn không có hệ thống tài khoản và không có chức năng đặt phòng, nên không thu thập thông tin đăng ký hay thông tin đặt chỗ của bạn. Chúng tôi chỉ có: dữ liệu truy cập ẩn danh (trang đã xem, thời gian, loại thiết bị, nguồn truy cập) do công cụ phân tích ghi nhận; và nội dung bạn chủ động gửi cho chúng tôi qua email.",
  },
  {
    title: "2. Mục đích sử dụng",
    content:
      "Dữ liệu truy cập ẩn danh dùng để hiểu bài viết nào hữu ích, trang nào khó đọc, từ đó cải thiện website. Thư bạn gửi chỉ dùng để trả lời bạn và — nếu bạn là chủ farmstay — để viết bài giới thiệu farm theo đúng ý bạn. Chúng tôi không dùng dữ liệu của bạn cho quảng cáo.",
  },
  {
    title: "3. Chia sẻ thông tin",
    content:
      "Chúng tôi KHÔNG bán và KHÔNG trao đổi thông tin cá nhân. Dữ liệu truy cập ẩn danh nằm trên hệ thống của Google Analytics và Microsoft Clarity theo chính sách của họ. Ngoài ra chỉ chia sẻ khi cơ quan pháp luật có yêu cầu hợp pháp.",
  },
  {
    title: "4. Cookie và theo dõi",
    content:
      "vnfarmstay.vn dùng cookie cho Google Analytics 4 và Microsoft Clarity để đo lưu lượng ẩn danh. Website không có đăng nhập nên không có cookie phiên đăng nhập. Bạn có thể chặn cookie trong trình duyệt — website vẫn hoạt động bình thường.",
  },
  {
    title: "5. Bảo mật dữ liệu",
    content:
      "Toàn bộ kết nối tới website đi qua HTTPS/TLS. Vì chúng tôi không lưu tài khoản, mật khẩu hay thông tin thanh toán của bạn nên cũng không có kho dữ liệu nhạy cảm nào để bị đánh cắp. Thư bạn gửi nằm trong hòm thư của chúng tôi.",
  },
  {
    title: "6. Quyền của bạn",
    content:
      "Bạn có quyền hỏi chúng tôi đang giữ gì về bạn, yêu cầu sửa thông tin không chính xác, và yêu cầu xoá thư cùng mọi thông tin bạn đã gửi. Chủ farmstay có quyền yêu cầu gỡ bài giới thiệu về farm mình bất cứ lúc nào, không cần nêu lý do.",
  },
  {
    title: "7. Lưu trữ dữ liệu",
    content:
      "Thư trao đổi được giữ trong thời gian còn cần cho việc liên hệ, và xoá khi bạn yêu cầu. Dữ liệu truy cập ẩn danh do Google Analytics và Microsoft Clarity lưu theo thời hạn mặc định của các công cụ này.",
  },
  {
    title: "8. Trẻ em",
    content:
      "vnfarmstay.vn không có dịch vụ hướng đến trẻ em dưới 13 tuổi và không cố ý thu thập thông tin của trẻ em. Nếu phát hiện, vui lòng liên hệ để chúng tôi xóa ngay.",
  },
  {
    title: "9. Thay đổi chính sách",
    content:
      "Khi có thay đổi quan trọng, bản mới sẽ được đăng ngay trên trang này kèm ngày cập nhật ở đầu trang. Vì không có danh sách tài khoản, chúng tôi không thể gửi thông báo riêng cho từng người — bạn nên xem lại trang này định kỳ.",
  },
  {
    title: "10. Liên hệ",
    content:
      "Mọi yêu cầu liên quan đến dữ liệu cá nhân: Email privacy@vnfarmstay.vn hoặc gửi thư đến địa chỉ vnfarmstay.vn, TP. Hồ Chí Minh, Việt Nam. Phản hồi trong vòng 72 giờ.",
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
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
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
                href="mailto:privacy@vnfarmstay.vn"
                style={{ color: "var(--gold)" }}
              >
                privacy@vnfarmstay.vn
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
