import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { graph, webPageSchema, breadcrumbSchema } from "@/lib/schema";
import {
  CUM_HE_SINH_THAI,
  NHAN_QUAN_HE,
  NGAY_DOC,
} from "@/features/he-sinh-thai/data";

export const metadata: Metadata = {
  title: "Cộng đồng Farmstay Việt Nam",
  description:
    "Kết nối với cộng đồng chủ farmstay và du khách — chia sẻ kinh nghiệm, hỏi đáp, sự kiện.",
  alternates: { canonical: "https://vnfarmstay.vn/cong-dong" },
};

/**
 * ⚠️ 08/08/2026 — Ông ra lệnh xoá sạch nội dung BỊA thừa hưởng từ khung web cũ.
 * Trang này từng có: 3 bài đăng ký tên người KHÔNG CÓ THẬT ("Nguyễn Văn An — Chủ Đồi Chè
 * Mộc Châu", "Trần Thị Bình — Du khách Hà Nội", "Lê Hoàng Minh — Chủ Heritage Farm Yên
 * Bái"), kèm lượt thích/bình luận tự chế (47·12 · 89·23 · 34·41), và 3 SỰ KIỆN chưa từng
 * diễn ra với ngày giờ, địa điểm cụ thể (15/05 Workshop · 22/05 Gặp mặt · 01/06 Tour).
 * Hai người trong số đó còn "kể chuyện" về đúng những farmstay giả đã xoá khỏi data.ts.
 *
 * Chat cộng đồng là hạng mục ROADMAP (cần backend + AI trả lời tự động) — chưa dựng.
 * CẤM đổ bài mẫu/sự kiện mẫu vào đây cho trang đỡ trống.
 */

/* Dữ liệu có cấu trúc — thêm 19/08/2026 sau khi `scripts/kiem-seo.mjs` phát hiện
   trang này không phát khối JSON-LD nào, nên máy tìm kiếm không nối được nó vào
   thực thể vnfarmstay.vn. */
const pageSchema = graph([
  webPageSchema({
    path: "/cong-dong",
    name: "Cộng đồng Farmstay Việt Nam — vnfarmstay.vn",
    description:
      "Nơi chủ farmstay và du khách kết nối, hỏi đáp và chia sẻ kinh nghiệm.",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Cộng đồng", url: "/cong-dong" },
  ]),
]);

export default function CongDongPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={pageSchema} />
      <main
        id="main"
        style={{ background: "var(--bg-deep)", minHeight: "80vh" }}
      >
        {/* Hero */}
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "64px 24px 80px",
            textAlign: "center",
          }}
        >
          <span className="section-kicker reveal">Hỏi đáp cùng nhau</span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Cộng đồng <em style={{ color: "var(--gold)" }}>Farmstay</em> Việt
            Nam
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            Nơi chủ farmstay và du khách kết nối, chia sẻ, cùng nhau xây dựng
            nền du lịch nông nghiệp bền vững.
          </p>
        </section>

        <div
          style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px 80px" }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
            Chỗ này sẽ là nơi chủ farmstay và người đi hỏi nhau những câu rất
            thật: mùa nào nên đi, giống cây nào hợp đất, khách đông thì xoay xở
            ra sao.
          </p>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "1rem",
              lineHeight: 1.8,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Chúng tôi <strong>chưa mở</strong> — và cũng không dựng sẵn vài bài
            đăng cho có vẻ đông vui. Khi nào cộng đồng mở thật, bạn sẽ thấy nó ở
            đây.
          </p>
        </div>

        {/* ── Hệ sinh thái — xem chú thích đầu `features/he-sinh-thai/data.ts`:
            khối này CỐ Ý nằm trong <main> của ĐÚNG MỘT trang, không phải chân trang
            toàn site (điều cấm tuyệt đối số 5, đã có vi phạm thật bị gỡ 24/08/2026). */}
        <section
          aria-labelledby="he-sinh-thai"
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "0 24px 88px",
          }}
        >
          <div
            style={{
              borderTop: "1px solid var(--border)",
              paddingTop: 56,
            }}
          >
            <h2
              id="he-sinh-thai"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Trong khi chờ, đây là những nơi đã có người
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: 12,
              }}
            >
              Cộng đồng chưa mở, nhưng mạng lưới thì đã sống. Dưới đây là những
              nơi làm nghề thật quanh farmstay — nơi tìm đầu ra, nơi làm nông
              sản bản địa, và những farm đã mở cửa đón khách.
            </p>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.92rem",
                lineHeight: 1.75,
                marginBottom: 40,
              }}
            >
              Chúng tôi ghi rõ quan hệ với từng nơi, kể cả khi nơi đó{" "}
              <strong style={{ color: "var(--text-muted)" }}>
                không thuộc sở hữu của chúng tôi
              </strong>
              . Không nơi nào trả tiền để có mặt ở đây, và bạn liên hệ thẳng với
              họ. Dữ kiện đọc từ web của chính họ ngày {NGAY_DOC}.
            </p>

            {CUM_HE_SINH_THAI.map((cum) => (
              <div key={cum.ma} style={{ marginBottom: 48 }}>
                <h3
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: "1.15rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    marginBottom: 8,
                  }}
                >
                  {cum.ten}
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "0.95rem",
                    lineHeight: 1.75,
                    marginBottom: 20,
                  }}
                >
                  {cum.dan}
                </p>

                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "grid",
                    /* HAI CỘT ở khổ rộng — KHÔNG phải để nhồi thêm chữ, mà vì
                       `globals.css` có luật `li { max-width: 52ch }` (sàn measure,
                       giữ dòng chữ đủ ngắn để đọc). Một cột thì thẻ bó lại 569px
                       giữa khung 852px, nhìn như hỏng. Hai cột giữ nguyên luật ấy
                       mà vẫn lấp đầy khung. Đo trên trình duyệt thật 03/09/2026. */
                    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                    gap: 14,
                  }}
                >
                  {cum.noi.map((n) => (
                    <li
                      key={n.url}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius)",
                        padding: "20px 22px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "baseline",
                          gap: "6px 12px",
                          marginBottom: 8,
                        }}
                      >
                        <strong
                          style={{
                            fontFamily: "var(--font-display), serif",
                            fontSize: "1.08rem",
                            color: "var(--text-primary)",
                          }}
                        >
                          {n.ten}
                        </strong>
                        {/* Nói thẳng quan hệ — Điều II, trung thực về trạng thái */}
                        <span
                          style={{
                            fontSize: "0.74rem",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color: "var(--text-dim)",
                            border: "1px solid var(--border)",
                            borderRadius: 20,
                            padding: "3px 10px",
                          }}
                        >
                          {NHAN_QUAN_HE[n.quanHe]}
                        </span>
                      </div>

                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.94rem",
                          lineHeight: 1.7,
                          margin: "0 0 8px",
                        }}
                      >
                        {n.laGi}
                      </p>
                      <p
                        style={{
                          color: "var(--text-dim)",
                          fontSize: "0.92rem",
                          lineHeight: 1.7,
                          margin: "0 0 14px",
                        }}
                      >
                        {n.viSaoDan}
                      </p>

                      <a
                        href={n.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        data-su-kien="related_destination_click"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          minHeight: 44,
                          fontSize: "0.9rem",
                          fontWeight: 600,
                          color: "var(--gold)",
                        }}
                      >
                        Mở {new URL(n.url).hostname.replace(/^www\./, "")} →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
