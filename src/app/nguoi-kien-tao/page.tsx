/**
 * NGƯỜI KIẾN TẠO — trang tổng, giới thiệu các chuyên gia đứng sau ngành farmstay.
 *
 * Master Prompt §9 (Trục 7) chừa sẵn đường dẫn này và đánh dấu "⛔ CHƯA CÓ".
 *
 * ⚠️ Ba ranh giới phải giữ, đã kiểm bằng cổng `kiem-hien-phap`:
 * ① Điều cấm 5 — đây là **liên kết theo ngữ cảnh** (mỗi người kèm đoạn nói rõ họ là
 *   ai và vì sao ta dẫn sang), KHÔNG phải liên kết chân trang toàn site.
 * ② Điều VIII — khối này KHÔNG được đặt lên trang chủ. Trang chủ thuộc về chủ farm.
 * ③ Điều IV — mọi dữ kiện lấy từ schema `Person` công khai trên chính web của họ,
 *   ghi rõ ngày đọc. Không thêm thành tích, không viết lại lời họ cho "hay hơn".
 *
 * ⛔ KHÔNG hiện ảnh chân dung: ảnh nằm trên máy chủ của họ, dẫn thẳng vào là tiêu
 * băng thông của họ, mà quyền dùng thì ta chưa hỏi (Điều III). Dùng chữ cái đầu.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { graph, webPageSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { NGUOI_KIEN_TAO } from "@/features/nguoi-kien-tao/data";

export const metadata: Metadata = buildMetadata({
  title: "Người kiến tạo — chuyên gia ngành farmstay",
  description:
    "Đàm phán thị trường nông sản, quản trị đất đai, vận hành trang trại, đào tạo nghề đón khách — bốn khúc nghề mà một farmstay cần, và những người làm nghề ấy thật.",
  canonical: "/nguoi-kien-tao",
  keywords: [
    "chuyên gia farmstay",
    "người kiến tạo farmstay",
    "cố vấn nông nghiệp",
  ],
});

const pageSchema = graph([
  webPageSchema({
    path: "/nguoi-kien-tao",
    name: "Người kiến tạo — vnfarmstay.vn",
    description:
      "Các chuyên gia đứng sau phong trào farmstay Việt Nam: nghề của họ, lĩnh vực họ làm, và web riêng của từng người.",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Người kiến tạo", url: "/nguoi-kien-tao" },
  ]),
]);

export default function NguoiKienTaoPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={pageSchema} />
      <main
        id="main"
        style={{ background: "var(--bg-deep)", minHeight: "80vh" }}
      >
        <div
          style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          <BreadcrumbNav
            items={[{ name: "Người kiến tạo", href: "/nguoi-kien-tao" }]}
          />

          <span className="section-kicker reveal">
            Nghề đứng sau một farmstay
          </span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
              fontWeight: 700,
              lineHeight: 1.25,
              margin: "24px 0 20px",
            }}
          >
            Người kiến tạo
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.02rem",
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            Một farmstay đứng được cần bốn khúc nghề mà hiếm ai làm giỏi cả bốn:{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              đất có hợp pháp không · nông sản bán đi đâu · trang trại vận hành
              ra sao · đón khách thế nào cho họ quay lại
            </strong>
            . Đây là những người làm thật từng khúc ấy.
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            Mỗi hồ sơ dưới đây dẫn thẳng sang web riêng của họ. Chúng tôi{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              không thu tiền để đưa ai lên trang này
            </strong>
            , và cũng không đứng giữa bạn với họ — bạn liên hệ thẳng.
          </p>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "0.92rem",
              lineHeight: 1.75,
              marginBottom: 40,
            }}
          >
            Lời tự giới thiệu trong mỗi hồ sơ là{" "}
            <strong style={{ color: "var(--text-muted)" }}>
              nguyên văn của chính họ
            </strong>
            , đọc từ web của họ ngày 26/08/2026. Chúng tôi không viết lại cho
            hay hơn, và không thêm thành tích nào họ không tự nói.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {NGUOI_KIEN_TAO.filter((n) => !n.laNguoiKhoiXuong).map((n) => (
              <Link
                key={n.slug}
                href={`/nguoi-kien-tao/${n.slug}`}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "24px 26px",
                  textDecoration: "none",
                  transition: "var(--transition)",
                }}
              >
                {/* Chữ cái đầu bằng Bodoni — thay ảnh chân dung, xem chú thích đầu tệp */}
                <span
                  aria-hidden="true"
                  style={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "var(--gold-dim)",
                    border: "1px solid var(--gold-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display), serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                  }}
                >
                  {n.ten.trim().split(" ").at(-1)?.charAt(0).toUpperCase()}
                </span>

                <div style={{ minWidth: 0 }}>
                  <h2
                    style={{
                      fontFamily: "var(--font-display),serif",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "0 0 4px",
                    }}
                  >
                    {n.ten}
                  </h2>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                      color: "var(--gold)",
                      margin: "0 0 10px",
                    }}
                  >
                    {n.chucDanh}
                  </p>
                  <p
                    style={{
                      fontSize: "0.97rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.7,
                      margin: "0 0 10px",
                    }}
                  >
                    {n.motDong}
                  </p>
                  <p
                    style={{
                      fontSize: "0.94rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {n.vaiTroVoiNganh}
                  </p>
                  {/* Dải con số họ tự công bố — thứ phân biệt hồ sơ này với một lời khen */}
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px 16px",
                      padding: 0,
                      margin: "12px 0 0",
                    }}
                  >
                    {n.dauMoc.slice(0, 3).map((m) => (
                      <li
                        key={m.so + m.y}
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "var(--gold)",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {m.so}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--gold)",
                    }}
                  >
                    Xem hồ sơ →
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* ── Người khởi xướng — khối RIÊNG, đặt cuối, nói thẳng quan hệ ──
              Không xếp chung hàng với bốn chuyên gia bên trên: người khởi xướng
              đứng lẫn vào danh sách mà không nói rõ thì người đọc tưởng đây là
              bảng do bên thứ ba bình chọn (Điều II). Và hệ thống không được thành
              bệ đỡ cho cá nhân (Điều VIII). */}
          {NGUOI_KIEN_TAO.filter((n) => n.laNguoiKhoiXuong).map((n) => (
            <section
              key={n.slug}
              aria-label="Người khởi xướng"
              style={{
                marginTop: 40,
                paddingTop: 32,
                borderTop: "1px solid var(--ke, var(--border))",
              }}
            >
              <h2
                style={{
                  fontSize: "0.74rem",
                  fontWeight: 700,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--text-dim)",
                  marginBottom: 16,
                }}
              >
                Người khởi xướng vnfarmstay.vn
              </h2>
              <Link
                href={`/nguoi-kien-tao/${n.slug}`}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                  background: "var(--bg-card)",
                  border: "1px solid var(--gold-border)",
                  borderRadius: "var(--radius)",
                  padding: "24px 26px",
                  textDecoration: "none",
                }}
              >
                <span
                  aria-hidden="true"
                  style={{
                    width: 52,
                    height: 52,
                    flexShrink: 0,
                    borderRadius: "50%",
                    background: "var(--gold-dim)",
                    border: "1px solid var(--gold-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-display), serif",
                    fontSize: "1.4rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                  }}
                >
                  {n.ten.trim().split(" ").at(-1)?.charAt(0).toUpperCase()}
                </span>
                <div style={{ minWidth: 0 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display),serif",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: "0 0 4px",
                    }}
                  >
                    {n.ten}
                  </h3>
                  <p
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      letterSpacing: "0.03em",
                      color: "var(--gold)",
                      margin: "0 0 10px",
                    }}
                  >
                    {n.chucDanh}
                  </p>
                  <p
                    style={{
                      fontSize: "0.97rem",
                      color: "var(--text-primary)",
                      lineHeight: 1.7,
                      margin: "0 0 10px",
                    }}
                  >
                    {n.motDong}
                  </p>
                  <p
                    style={{
                      fontSize: "0.94rem",
                      color: "var(--text-muted)",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {n.vaiTroVoiNganh}
                  </p>
                  {/* Dải con số họ tự công bố — thứ phân biệt hồ sơ này với một lời khen */}
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px 16px",
                      padding: 0,
                      margin: "12px 0 0",
                    }}
                  >
                    {n.dauMoc.slice(0, 3).map((m) => (
                      <li
                        key={m.so + m.y}
                        style={{
                          fontSize: "0.82rem",
                          fontWeight: 600,
                          color: "var(--gold)",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {m.so}
                      </li>
                    ))}
                  </ul>
                  <p
                    style={{
                      marginTop: 12,
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      color: "var(--gold)",
                    }}
                  >
                    Xem hồ sơ →
                  </p>
                </div>
              </Link>
            </section>
          ))}

          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "0.95rem",
              lineHeight: 1.75,
              marginTop: 40,
              paddingTop: 24,
              borderTop: "1px solid var(--border)",
            }}
          >
            Bạn là chuyên gia trong ngành và muốn có hồ sơ ở đây?{" "}
            <Link
              href="/lien-he"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                color: "var(--gold)",
              }}
            >
              Liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
