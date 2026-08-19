import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import { graph, webPageSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE_CONTACT, ECOSYSTEM } from "@/lib/site";

/**
 * Trang liên hệ.
 *
 * ⚠️ Không có form, không có hotline, không có email bịa. `SITE_CONTACT` trong
 * `src/lib/site.ts` đang cố ý rỗng — nên trang này nói THẲNG kênh chính thức đang
 * được mở, và chỉ đường sang những cửa CÓ THẬT đang hoạt động (giới thiệu farmstay,
 * trang dành cho chủ farmstay). Ngày Ông cấp email/số điện thoại thật, điền vào
 * `SITE_CONTACT` là trang này và schema Organization cùng hiện lên một lượt.
 */
export const metadata = buildMetadata({
  title: "Liên hệ",
  description:
    "Các cửa liên hệ đang hoạt động của vnfarmstay.vn — giới thiệu farmstay của bạn, hoặc báo một thông tin chưa chính xác trên trang.",
  canonical: "/lien-he",
});

const pageSchema = graph([
  webPageSchema({
    path: "/lien-he",
    name: "Liên hệ — vnfarmstay.vn",
    description:
      "Các cửa liên hệ đang hoạt động của vnfarmstay.vn và cách báo thông tin chưa chính xác.",
    type: "ContactPage",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Liên hệ", url: "/lien-he" },
  ]),
]);

const cua = [
  {
    title: "Bạn có farmstay muốn được giới thiệu",
    body: "Gửi tên farm, địa chỉ, việc làm nông, trải nghiệm cho khách và vài tấm ảnh thật. Chúng ta sẽ liên hệ lại để sắp lịch tới tận nơi.",
    href: "/dang-farmstay",
    cta: "Giới thiệu farmstay của bạn",
  },
  {
    title: "Bạn muốn hiểu cách hệ sinh thái vận hành trước đã",
    body: "Trang dành cho chủ farmstay nói rõ ba bước lên sóng, tiêu chí xét duyệt, và những gì thành viên giữ nguyên: thương hiệu, dữ liệu, khách hàng và doanh thu đặt trực tiếp.",
    href: "/chu-farmstay",
    cta: "Đọc trang dành cho chủ farmstay",
  },
  {
    title: "Bạn thấy một thông tin chưa chính xác trên trang",
    body: "Nội dung ở đây được thu thập từ thực địa và từ chính chủ farm, nên vẫn có thể sai hoặc lỗi thời. Dùng cùng cửa gửi thông tin bên trên và ghi rõ trang nào, chỗ nào sai.",
    href: "/chinh-sach-bien-tap",
    cta: "Xem chính sách biên tập",
  },
];

export default function LienHePage() {
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
          <span className="section-kicker reveal">Nói chuyện với nhau</span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Liên hệ
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            Kênh liên hệ chính thức đang được mở. Trong lúc chờ, dưới đây là
            những cửa đang hoạt động thật — chúng ta không dựng một số hotline
            cho trang đỡ trống.
          </p>
        </section>

        <div
          style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 88px" }}
        >
          <BreadcrumbNav items={[{ name: "Liên hệ", href: "/lien-he" }]} />

          <div style={{ display: "grid", gap: 18 }}>
            {cua.map((c) => (
              <section
                key={c.href}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
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
                    marginBottom: 10,
                  }}
                >
                  {c.title}
                </h2>
                <p
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    marginBottom: 16,
                  }}
                >
                  {c.body}
                </p>
                <a
                  href={c.href}
                  style={{
                    display: "inline-block",
                    padding: "11px 22px",
                    borderRadius: 22,
                    border: "1px solid var(--gold-border)",
                    color: "var(--gold)",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  {c.cta} →
                </a>
              </section>
            ))}
          </div>

          {SITE_CONTACT.email && (
            <p style={{ color: "var(--text-muted)", marginTop: 28 }}>
              Thư điện tử:{" "}
              <a href={`mailto:${SITE_CONTACT.email}`}>{SITE_CONTACT.email}</a>
            </p>
          )}

          <section style={{ marginTop: 44 }}>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Các thương hiệu cùng hệ sinh thái
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                lineHeight: 1.8,
                marginBottom: 14,
                fontSize: "0.95rem",
              }}
            >
              Đây là những tổ chức riêng biệt, mỗi nơi một vai trò — không phải
              chi nhánh của vnfarmstay.vn.
            </p>
            <ul style={{ display: "grid", gap: 10 }}>
              {ECOSYSTEM.map((e) => (
                <li key={e.url} style={{ color: "var(--text-muted)" }}>
                  <a
                    href={e.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "var(--gold)", fontWeight: 600 }}
                  >
                    {e.label}
                  </a>{" "}
                  — {e.vaiTro}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
