import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { graph, webPageSchema, breadcrumbSchema } from "@/lib/schema";

/**
 * ⚠️ 08/08/2026 — Ông ra lệnh sửa lại cho đúng sự thật. Bản cũ (thừa hưởng từ khung web
 * nền tảng đặt phòng) khai vnfarmstay.vn "thu phí hoa hồng trên mỗi đặt phòng thành công"
 * và có "chính sách huỷ phòng / hoàn tiền", "tài khoản người dùng" — KHÔNG có thứ nào tồn
 * tại. Đây là văn bản RÀNG BUỘC hiển thị công khai nên sai ở đây nặng hơn sai ở trang bán
 * hàng. Đã gỡ 3 điều đó. CẤM viết lại điều khoản về đặt phòng/hoa hồng/thanh toán/tài khoản
 * khi web chưa thật sự có các chức năng ấy.
 */
export const metadata: Metadata = {
  title: "Điều khoản sử dụng – vnfarmstay.vn",
  description:
    "Điều khoản sử dụng vnfarmstay.vn — phạm vi dịch vụ giới thiệu farmstay, quyền và nghĩa vụ của người đọc và chủ farmstay.",
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
      "vnfarmstay.vn là website giới thiệu farmstay và kể câu chuyện về các vùng nông nghiệp Việt Nam. Chúng tôi KHÔNG phải nền tảng đặt phòng: không nhận đặt chỗ, không xử lý thanh toán, không giữ tiền của bạn và không thu hoa hồng của ai. Mọi giao dịch diễn ra trực tiếp giữa bạn và chủ farmstay, theo giá và điều kiện do chủ farmstay đặt ra.",
  },
  {
    title: "3. Quy tắc sử dụng",
    content:
      "Nghiêm cấm: gửi cho chúng tôi thông tin sai lệch về farmstay, mạo danh chủ farmstay khác, spam, vi phạm quyền riêng tư của người khác, hoặc sử dụng nội dung của website cho mục đích bất hợp pháp.",
  },
  {
    title: "4. Chi phí",
    content:
      "Việc giới thiệu farmstay trên vnfarmstay.vn hoàn toàn miễn phí — không phí đăng, không phí duy trì, không hoa hồng. Chúng tôi không phát sinh khoản thu nào với chủ farmstay hay với người đọc.",
  },
  {
    title: "5. Giới hạn trách nhiệm",
    content:
      "vnfarmstay.vn không chịu trách nhiệm về chất lượng dịch vụ thực tế tại farmstay, về thoả thuận giữa bạn và chủ farmstay, về thiệt hại phát sinh từ thông tin sai lệch do chủ farmstay cung cấp, hoặc sự cố nằm ngoài tầm kiểm soát. Chúng tôi chỉ giới thiệu và dẫn đường, không đứng ra bảo đảm.",
  },
  {
    title: "6. Sở hữu trí tuệ",
    content:
      "Toàn bộ nội dung trên vnfarmstay.vn (logo, hình ảnh, văn bản, code) thuộc quyền sở hữu của vnfarmstay.vn hoặc đối tác được cấp phép. Nghiêm cấm sao chép, phân phối khi chưa được phép.",
  },
  {
    title: "7. Thay đổi điều khoản",
    content:
      "vnfarmstay.vn có quyền cập nhật Điều khoản này bất kỳ lúc nào. Bản mới có hiệu lực kể từ khi đăng trên trang này. Bạn nên xem lại định kỳ; tiếp tục sử dụng website nghĩa là bạn chấp nhận điều khoản hiện hành.",
  },
  {
    title: "8. Luật áp dụng",
    content:
      "Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp sẽ được giải quyết tại toà án có thẩm quyền tại TP. Hồ Chí Minh, Việt Nam.",
  },
];

/* Dữ liệu có cấu trúc — thêm 19/08/2026 sau khi `scripts/kiem-seo.mjs` phát hiện
   trang này không phát khối JSON-LD nào, nên máy tìm kiếm không nối được nó vào
   thực thể vnfarmstay.vn. */
const pageSchema = graph([
  webPageSchema({
    path: "/dieu-khoan",
    name: "Điều khoản sử dụng — vnfarmstay.vn",
    description: "Điều khoản sử dụng website vnfarmstay.vn.",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Điều khoản sử dụng", url: "/dieu-khoan" },
  ]),
]);

export default function DieuKhoanPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={pageSchema} />
      <main
        id="main"
        style={{ background: "var(--bg-deep)", minHeight: "80vh" }}
      >
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
            Điều khoản <em style={{ color: "var(--gold)" }}>sử dụng</em>
          </h1>
          <p style={{ color: "var(--text-dim)", fontSize: "0.88rem" }}>
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
                    fontSize: "1rem",
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
                fontSize: "0.88rem",
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
