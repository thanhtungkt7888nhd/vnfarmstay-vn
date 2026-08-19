import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema, breadcrumbSchema } from "@/lib/schema";

/**
 * Chính sách biên tập — trang niềm tin.
 *
 * Chỉ ghi những nguyên tắc ĐANG THỰC SỰ thi hành (đi tới tận nơi mới đăng · không
 * dựng dữ liệu mẫu · nói rõ trạng thái khu vực chưa hoàn thiện). KHÔNG dựng ở đây
 * một "quy trình xác minh" nhiều bậc với huy hiệu, vì quy trình ấy chưa tồn tại —
 * ngày nào có thật thì tách ra trang /phuong-phap-xac-minh riêng.
 */
export const metadata = buildMetadata({
  title: "Chính sách biên tập",
  description:
    "Cách nội dung trên vnfarmstay.vn được thu thập, kiểm chứng, ghi nguồn và cập nhật — và những điều chúng ta cam kết không làm.",
  canonical: "/chinh-sach-bien-tap",
});

const pageSchema = graph([
  webPageSchema({
    path: "/chinh-sach-bien-tap",
    name: "Chính sách biên tập — vnfarmstay.vn",
    description:
      "Cách nội dung trên vnfarmstay.vn được thu thập, kiểm chứng, ghi nguồn và cập nhật.",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Chính sách biên tập", url: "/chinh-sach-bien-tap" },
  ]),
]);

const nguyenTac = [
  {
    h: "Đi tới tận nơi mới đăng",
    p: "Một farmstay chỉ có hồ sơ trên trang này sau khi đã có người đến tận nơi, ngồi xuống với chủ farm và hiểu mảnh đất ấy giữ thứ gì. Chúng ta không nhập liệu hàng loạt và không sao chép hồ sơ từ nền tảng khác.",
  },
  {
    h: "Không dựng dữ liệu mẫu",
    p: "Không farmstay giả, không bài viết giả, không bình luận hay sự kiện dựng sẵn, không con số ước lượng làm tròn lên. Khi một khu vực còn trống, trang ấy nói thẳng là còn trống — thà vậy còn hơn dựng cảnh cho có vẻ đông vui.",
  },
  {
    h: "Không tự gán sao, giá và đánh giá",
    p: "vnfarmstay.vn không nhận đặt phòng, không thu hoa hồng và không có hội đồng chấm điểm — nên không có quyền gắn số sao, số lượt đánh giá hay bảng giá cho farmstay của người khác. Giá và điều kiện là do chính farmstay công bố.",
  },
  {
    h: "Nguồn thông tin được ghi rõ",
    p: "Mỗi hồ sơ và mỗi bài viết cho biết thông tin đến từ đâu: chuyến đi thực địa, trao đổi trực tiếp với chủ farm, hay tài liệu công khai. Ảnh có ghi nguồn hoặc quyền sử dụng; ảnh của chủ farm chỉ dùng khi được đồng ý.",
  },
  {
    h: "Cập nhật và sửa sai",
    p: "Mùa vụ đổi, giá đổi, chủ farm đổi cách làm — nội dung ở đây vì thế có ngày cập nhật. Khi bạn thấy một chi tiết sai, báo lại qua trang Liên hệ; chúng ta sửa và ghi nhận ngày sửa, không lặng lẽ xoá.",
  },
  {
    h: "Trí tuệ nhân tạo hỗ trợ, con người chịu trách nhiệm",
    p: "Công cụ AI có thể được dùng để soạn nháp, chuẩn hoá cấu trúc dữ liệu hoặc rà lỗi chính tả. Mọi sự thật về một vùng đất hay một farmstay đều do người thật kiểm lại trước khi xuất bản — AI không được phép tự sinh ra sự kiện, số liệu hay lời kể.",
  },
];

const chuaCo = [
  "Chưa có huy hiệu “đã xác minh”. Sẽ chỉ có khi tiêu chí, chu kỳ kiểm tra lại và cách báo sai thông tin được công bố thành trang riêng.",
  "Chưa có hệ thống đánh giá của du khách.",
  "Chưa có trang tự quản lý cho chủ farmstay — mọi thay đổi hiện làm thủ công qua trang Liên hệ.",
];

export default function ChinhSachBienTapPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={pageSchema} />
      <main id="main" style={{ background: "var(--bg-deep)" }}>
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "64px 24px 72px",
            textAlign: "center",
          }}
        >
          <span className="section-kicker reveal">
            Cách chúng ta làm nội dung
          </span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Chính sách biên tập
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 600,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Trang này nói rõ nội dung ở đây đến từ đâu, được kiểm ra sao, và
            những điều chúng ta cam kết không làm — để bạn có căn cứ mà tin,
            hoặc mà bắt lỗi.
          </p>
        </section>

        <div
          style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 88px" }}
        >
          <BreadcrumbNav
            items={[
              { name: "Chính sách biên tập", href: "/chinh-sach-bien-tap" },
            ]}
          />

          <div style={{ display: "grid", gap: 24 }}>
            {nguyenTac.map((n) => (
              <section key={n.h}>
                <h2
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 10,
                  }}
                >
                  {n.h}
                </h2>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.85 }}>
                  {n.p}
                </p>
              </section>
            ))}
          </div>

          <section
            style={{
              marginTop: 40,
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius-lg)",
              padding: "26px 24px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Những thứ chúng ta chưa có
            </h2>
            <ul style={{ display: "grid", gap: 10 }}>
              {chuaCo.map((c) => (
                <li
                  key={c}
                  style={{ color: "var(--text-muted)", lineHeight: 1.8 }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </section>

          <p
            style={{
              marginTop: 32,
              color: "var(--text-dim)",
              fontSize: "0.9rem",
            }}
          >
            Cập nhật lần cuối: 19/08/2026.{" "}
            <a href="/lien-he" style={{ color: "var(--gold)" }}>
              Báo cho chúng ta một thông tin chưa chính xác →
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
