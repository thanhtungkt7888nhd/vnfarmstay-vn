/**
 * Tour Farmstay — bản đồ vùng nông nghiệp Việt Nam + lịch mùa vụ.
 *
 * ⚠️ RANH GIỚI TRUNG THỰC (Ông chốt 08/08/2026): vnfarmstay.vn KHÔNG bán tour,
 * KHÔNG nhận đặt chỗ, KHÔNG thu tiền. Trang này là BẢN ĐỒ VÙNG và GỢI Ý MÙA —
 * giúp người đọc biết đi đâu vào tháng nào để thấy gì. Mọi nội dung dưới đây là
 * ĐỊA LÝ và MÙA VỤ NÔNG NGHIỆP có thật, kiểm chứng được.
 *
 * CẤM: thêm giá tour, lịch trình ngày/đêm cụ thể, tên farmstay chưa xác nhận,
 * số lượng khách/đoàn, hay bất kỳ thứ gì ngụ ý đang có tour mở bán.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { JsonLd } from "@/shared/ui/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { giuTuGhep } from "@/shared/utils/giu-tu-ghep";
import { VUNG, LICH_MUA } from "@/features/vung/data";

export const metadata: Metadata = buildMetadata({
  title: "Tour Farmstay — Bản đồ vùng nông nghiệp Việt Nam theo mùa",
  description:
    "Bản đồ 9 vùng nông nghiệp Việt Nam có trải nghiệm farmstay: ruộng bậc thang Tây Bắc, chè Mộc Châu, cà phê Tây Nguyên, miệt vườn ĐBSCL. Mỗi vùng kèm mùa đẹp nhất và việc nhà nông đặc trưng.",
  canonical: "/tour-farmstay",
  keywords: [
    "tour farmstay",
    "bản đồ farmstay việt nam",
    "vùng nông nghiệp việt nam",
    "mùa lúa chín tây bắc",
    "mùa hoa cà phê tây nguyên",
    "miệt vườn miền tây",
  ],
});

/* Dữ liệu 9 vùng đã chuyển sang `src/features/vung/data.ts` (19/08/2026) để
   `/tour-farmstay`, `/vung/[slug]`, trang chủ và sitemap cùng đọc một nguồn. */

/* LICH_MUA đã chuyển sang `src/features/vung/data.ts` (19/08/2026) — trang chủ
   và bản đồ vùng cùng dùng, không chép hai bản lệch nhau. */

const FAQS = [
  {
    q: "vnfarmstay.vn có bán tour farmstay không?",
    a: "Không. Chúng tôi không bán tour, không nhận đặt chỗ và không giữ tiền của ai. Trang này là bản đồ vùng và gợi ý mùa — để bạn biết đi đâu vào tháng nào thì thấy được gì. Khi bạn chọn được farm, bạn liên hệ thẳng với chủ farm theo kênh của họ.",
  },
  {
    q: "Tháng này nên đi vùng nào?",
    a: "Xem bảng lịch mùa ở trên. Nguyên tắc chung: tháng 9–10 lên Tây Bắc xem lúa chín, tháng 11–12 vào Tây Nguyên mùa thu hoạch cà phê, tháng 1–2 lên Mộc Châu mùa hoa mận, tháng 5–8 xuống miền Tây mùa trái cây. Nhưng thời tiết mỗi năm mỗi khác, nên hãy hỏi lại chủ farm trước khi đặt vé.",
  },
  {
    q: "Đi farmstay nên ở mấy ngày?",
    a: "Tối thiểu hai đêm. Một đêm thì bạn chỉ kịp tới, ngủ và về — không chạm được vào nhịp làm nông vốn bắt đầu từ sáng sớm. Ba đến bốn đêm là khoảng đủ để làm được vài việc thật và hiểu vùng đất đó sống bằng gì.",
  },
  {
    q: "Có thể đi nhiều vùng trong một chuyến không?",
    a: "Được, nhưng nên chọn các vùng gần nhau — ví dụ Đà Lạt với Ninh Thuận, hoặc Mộc Châu với Tây Bắc. Farmstay hợp với cách đi chậm, ở lại lâu một chỗ; nhồi bốn vùng vào một tuần thì bạn chỉ kịp chụp ảnh rồi đi.",
  },
];

const schemas = [
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Tour Farmstay", url: "/tour-farmstay" },
  ]),
  faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
];

export default function TourFarmstayPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <style>{`
        .vung-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 760px) { .vung-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1180px) { .vung-grid { grid-template-columns: repeat(3, 1fr); } }
        .mua-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 700px) { .mua-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1040px) { .mua-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <main id="main" style={{ background: "var(--bg-deep)" }}>
        {/* ── Hero ── */}
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a4a2e 55%,#0f2318)",
            padding: "72px 24px 80px",
            textAlign: "center",
          }}
        >
          <span className="section-kicker reveal">Bản đồ vùng</span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem,4.5vw,3.2rem)",
              fontWeight: 700,
              lineHeight: 1.2,
              marginBottom: 20,
              color: "var(--text-primary)",
            }}
          >
            Tour <em style={{ color: "var(--gold)" }}>Farmstay</em> Việt Nam
          </h1>
          <p className="lead" style={{ maxWidth: 680, margin: "0 auto 14px" }}>
            Từ ruộng bậc thang Hà Giang tới miệt vườn Bến Tre — chín vùng nông
            nghiệp, mỗi vùng một nhịp mùa vụ riêng và những việc nhà nông chỉ
            vùng đó mới có.
          </p>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "1rem",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Đây là bản đồ để bạn tự chọn đường đi — vnfarmstay.vn không bán tour
            và không nhận đặt chỗ.
          </p>
        </section>

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px" }}>
          <BreadcrumbNav
            items={[{ name: "Tour Farmstay", href: "/tour-farmstay" }]}
          />
        </div>

        {/* ── Lịch mùa ── */}
        <section style={{ padding: "48px 24px 64px" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <span className="section-kicker">Tra nhanh</span>
            <h2
              className="section-heading fx-text-clip"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 28,
              }}
            >
              Tháng này đi đâu
            </h2>
            <div className="mua-grid">
              {LICH_MUA.map((m) => (
                <div
                  key={m.thang}
                  className="fx-card-wash"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderLeft: "3px solid var(--gold)",
                    borderRadius: "var(--radius-sm)",
                    padding: "16px 18px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.76rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: 8,
                    }}
                  >
                    {m.thang}
                  </div>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "1rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {m.diem}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9 vùng ── */}
        <section
          style={{
            padding: "72px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 1180, margin: "0 auto" }}>
            <span className="section-kicker">Bắc vào Nam</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Chín vùng nông nghiệp đáng đi
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 660,
                marginBottom: 36,
                lineHeight: 1.8,
              }}
            >
              Mỗi vùng dưới đây có một thứ nông nghiệp làm nên bản sắc của nó —
              và vì thế có một mùa đẹp nhất không trùng với vùng khác.
            </p>

            <div className="vung-grid">
              {VUNG.map((v) => (
                <article
                  key={v.slug}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "24px 22px 26px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Thanh định vị Bắc → Nam */}
                  <div
                    aria-hidden="true"
                    style={{
                      height: 3,
                      background: "var(--gold-dim)",
                      borderRadius: 2,
                      marginBottom: 18,
                      position: "relative",
                    }}
                  >
                    <span
                      style={{
                        position: "absolute",
                        left: `${v.bac}%`,
                        top: -3,
                        width: 9,
                        height: 9,
                        borderRadius: "50%",
                        background: "var(--gold)",
                        transform: "translateX(-50%)",
                      }}
                    />
                  </div>

                  <h3
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.2rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 6,
                      lineHeight: 1.3,
                    }}
                  >
                    {giuTuGhep(v.ten)}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      letterSpacing: "0.05em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      fontWeight: 600,
                      marginBottom: 14,
                    }}
                  >
                    {v.diaDanh}
                  </div>

                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "1rem",
                      lineHeight: 1.75,
                      marginBottom: 18,
                      flex: 1,
                    }}
                  >
                    {v.dacTrung}
                  </p>

                  <dl style={{ display: "grid", gap: 12, marginBottom: 16 }}>
                    <div>
                      <dt
                        style={{
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-dim)",
                          marginBottom: 4,
                          fontWeight: 600,
                        }}
                      >
                        Nông sản
                      </dt>
                      <dd
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.88rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {v.nongSan}
                      </dd>
                    </div>
                    <div>
                      <dt
                        style={{
                          fontSize: "0.72rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-dim)",
                          marginBottom: 4,
                          fontWeight: 600,
                        }}
                      >
                        Mùa đẹp nhất
                      </dt>
                      <dd
                        style={{
                          color: "var(--accent-ma)",
                          fontSize: "0.88rem",
                          lineHeight: 1.6,
                        }}
                      >
                        {v.muaDep}
                      </dd>
                    </div>
                  </dl>

                  <div
                    style={{
                      borderTop: "1px solid var(--border)",
                      paddingTop: 14,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.72rem",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--text-dim)",
                        marginBottom: 10,
                        fontWeight: 600,
                      }}
                    >
                      Việc nhà nông
                    </div>
                    <ul
                      style={{
                        listStyle: "none",
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 6,
                      }}
                    >
                      {v.viecNhaNong.map((viec) => (
                        <li
                          key={viec}
                          style={{
                            padding: "4px 11px",
                            borderRadius: 20,
                            background: "var(--gold-dim)",
                            border: "1px solid var(--gold-border)",
                            fontSize: "0.76rem",
                            color: "var(--text-muted)",
                          }}
                        >
                          {viec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lối vào trang riêng của vùng — thêm 19/08/2026. Trước đó bản đồ
                      này là ngõ cụt: người đọc thấy vùng hay nhưng không đi tiếp được. */}
                  <a
                    href={`/vung/${v.slug}`}
                    style={{
                      marginTop: 16,
                      display: "inline-block",
                      padding: "10px 20px",
                      borderRadius: 22,
                      border: "1px solid var(--gold-border)",
                      color: "var(--gold)",
                      fontWeight: 600,
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      alignSelf: "flex-start",
                    }}
                  >
                    Tìm hiểu {giuTuGhep(v.ten)} →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── Cách dùng bản đồ này ── */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 24,
              }}
            >
              Cách dùng bản đồ này
            </h2>
            <div className="prose" style={{ maxWidth: "none" }}>
              <p>
                <strong>Chọn mùa trước, chọn vùng sau.&nbsp;</strong>Đây là điều
                ngược với cách phần lớn người Việt đi chơi — thường chọn nơi rồi
                mới xem đi tháng nào. Với farmstay thì ngược lại mới đúng: cùng
                một đồi chè, tháng có vụ và tháng vừa đốn là hai nơi hoàn toàn
                khác nhau.
              </p>
              <p>
                <strong>Hỏi chủ farm trước khi đặt vé.&nbsp;</strong>Lịch mùa
                trên trang này là nhịp chung của vùng, còn thời tiết mỗi năm mỗi
                khác — mưa muộn hay nắng sớm đều đẩy mùa vụ lệch đi vài tuần.
                Người biết chắc nhất luôn là người đang đứng trên mảnh đất đó.
              </p>
              <p>
                <strong>Ở lại lâu một chỗ, đừng chạy nhiều nơi.&nbsp;</strong>
                Nhịp làm nông bắt đầu từ tờ mờ sáng và kết thúc lúc chiều muộn.
                Đi lướt qua thì bạn chỉ gặp được phần cảnh, không gặp được phần
                việc — mà phần việc mới là thứ đáng để đi.
              </p>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section
          style={{
            padding: "72px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 28,
              }}
            >
              Câu hỏi thường gặp
            </h2>
            <div style={{ display: "grid", gap: 14 }}>
              {FAQS.map((f) => (
                <details
                  key={f.q}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "18px 22px",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.q}
                  </summary>
                  <p
                    style={{
                      marginTop: 14,
                      color: "var(--text-muted)",
                      fontSize: "1rem",
                      lineHeight: 1.8,
                    }}
                  >
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA cuối ── */}
        <section
          className="plasma-bg motif-x"
          style={{ padding: "72px 24px 88px" }}
        >
          <div
            style={{
              maxWidth: 720,
              margin: "0 auto",
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius-lg)",
              padding: "44px 36px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Farm của bạn nằm ở một trong những vùng này?
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: 26,
                fontSize: "1rem",
              }}
            >
              Bản đồ này sẽ dày lên bằng những farmstay thật — mỗi cái chúng tôi
              đều tìm hiểu trước khi đăng. Giới thiệu hoàn toàn miễn phí, không
              hoa hồng.
            </p>
            <Link
              href="/dang-farmstay"
              className="fx-arrow-slide fx-ripple"
              style={{
                display: "inline-block",
                padding: "13px 30px",
                borderRadius: 24,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.95rem",
                transition: "var(--transition)",
              }}
            >
              Giới thiệu farmstay của bạn
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
