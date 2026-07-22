import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Điều khoản sử dụng – vnfarmstay.vn",
  description:
    "Điều khoản sử dụng dịch vụ vnfarmstay.vn — quyền và nghĩa vụ của người dùng, chủ farmstay, và nền tảng.",
  alternates: { canonical: "https://vnfarmstay.vn/dieu-khoan" },
};

const SECTIONS = [
  {
    title: "1. Chấp nhận điều khoản",
    content:
      "Bằng cách truy cập và sử dụng vnfarmstay.vn, bạn đồng ý tuân thủ và bị ràng buộc bởi các Điều khoản sử dụng này. Nếu bạn không đồng ý với bất kỳ phần nào, vui lòng không sử dụng dịch vụ.",
  },
  {
    title: "2. Mô tả dịch vụ",
    content:
      "vnfarmstay.vn là nền tảng kết nối du khách với chủ farmstay tại Việt Nam. Chúng tôi cung cấp công cụ tìm kiếm, đặt phòng, và quản lý farmstay — không trực tiếp cung cấp dịch vụ lưu trú.",
  },
  {
    title: "3. Tài khoản người dùng",
    content:
      "Bạn chịu trách nhiệm bảo mật tài khoản và mật khẩu. Mọi hoạt động dưới tài khoản của bạn là trách nhiệm của bạn. Thông báo ngay cho chúng tôi nếu phát hiện truy cập trái phép.",
  },
  {
    title: "4. Quy tắc sử dụng",
    content:
      "Nghiêm cấm: đăng thông tin sai lệch về farmstay, gian lận đánh giá, spam, vi phạm quyền riêng tư của người khác, hoặc sử dụng dịch vụ cho mục đích bất hợp pháp.",
  },
  {
    title: "5. Phí và thanh toán",
    content:
      "vnfarmstay.vn thu phí hoa hồng trên mỗi đặt phòng thành công theo tỷ lệ đã thông báo. Đăng ký farmstay hoàn toàn miễn phí. Phí sẽ được khấu trừ trực tiếp từ thanh toán của khách.",
  },
  {
    title: "6. Chính sách huỷ phòng",
    content:
      "Chính sách huỷ phòng do từng chủ farmstay quy định và được hiển thị rõ trên trang farmstay. vnfarmstay.vn hỗ trợ xử lý hoàn tiền theo chính sách đã đăng ký.",
  },
  {
    title: "7. Giới hạn trách nhiệm",
    content:
      "vnfarmstay.vn không chịu trách nhiệm về chất lượng dịch vụ thực tế tại farmstay, thiệt hại phát sinh từ thông tin sai lệch do chủ farmstay cung cấp, hoặc sự cố nằm ngoài tầm kiểm soát.",
  },
  {
    title: "8. Sở hữu trí tuệ",
    content:
      "Toàn bộ nội dung trên vnfarmstay.vn (logo, hình ảnh, văn bản, code) thuộc quyền sở hữu của vnfarmstay.vn hoặc đối tác được cấp phép. Nghiêm cấm sao chép, phân phối khi chưa được phép.",
  },
  {
    title: "9. Thay đổi điều khoản",
    content:
      "vnfarmstay.vn có quyền cập nhật Điều khoản này bất kỳ lúc nào. Thay đổi quan trọng sẽ được thông báo qua email đăng ký. Tiếp tục sử dụng sau thông báo nghĩa là bạn chấp nhận điều khoản mới.",
  },
  {
    title: "10. Luật áp dụng",
    content:
      "Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết tại toà án có thẩm quyền tại TP. Hồ Chí Minh, Việt Nam.",
  },
];

export default function DieuKhoanPage() {
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
            Điều khoản <em style={{ color: "var(--gold)" }}>sử dụng</em>
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
              Có câu hỏi về Điều khoản?{" "}
              <a href="/ve-chung-toi#lien-he" style={{ color: "var(--gold)" }}>
                Liên hệ chúng tôi
              </a>
              .
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
