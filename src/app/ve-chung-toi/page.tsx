/**
 * Trang tuyên ngôn — trả lời câu "các anh là ai, tin được không".
 *
 * ⚠️ 08/08/2026 — Ông ra lệnh gỡ nội dung BỊA thừa hưởng từ khung web cũ ở trang này:
 * · khối `STATS` (500+ Farmstay xác minh · 63 Tỉnh thành · 50K+ Du khách tin tưởng ·
 *   4.8★ Đánh giá trung bình) — toàn bộ tự chế, đã gỡ, KHÔNG thay bộ số khác.
 * · khối `TEAM` — Ông xác nhận "Nguyễn Thị Lan" và "Lê Văn Hùng" là người KHÔNG CÓ THẬT.
 *   Còn lại một mình Phạm Thanh Tùng thì không gọi là "đội ngũ" được, nên gộp vào phần
 *   sứ mệnh. CẤM dựng lại khối đội ngũ bằng tên tự nghĩ ra.
 *
 * ⚠️ 08/08/2026 (đợt sau) — mở rộng thành tuyên ngôn đầy đủ. Mọi nội dung thêm vào đây
 * là NGUYÊN TẮC và CAM KẾT (điều chúng tôi tự ràng buộc mình), KHÔNG phải thành tích.
 * Tuyệt đối KHÔNG thêm: số farmstay, số lượt khách, số tỉnh thành, năm thành lập, giải
 * thưởng, đối tác — trừ khi Ông xác nhận đó là số THẬT.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Về vnfarmstay.vn — Chúng tôi là ai và làm việc theo nguyên tắc nào",
  description:
    "vnfarmstay.vn giới thiệu farmstay Việt Nam miễn phí, không hoa hồng, không nhận đặt phòng. Nguyên tắc chọn farm, cam kết với du khách và chủ farmstay, lộ trình công khai.",
  canonical: "/ve-chung-toi",
  keywords: [
    "về vnfarmstay",
    "giới thiệu vnfarmstay.vn",
    "nền tảng farmstay việt nam",
    "du lịch nông nghiệp việt nam",
  ],
});

const schemas = [
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Về chúng tôi", url: "/ve-chung-toi" },
  ]),
];

/** Nguyên tắc chọn farm — là RÀNG BUỘC tự đặt, không phải thành tích đã đạt */
const NGUYEN_TAC = [
  {
    num: "01",
    ten: "Phải là nông trại đang canh tác thật",
    mota: "Có mùa vụ, có thu hoạch, có sản phẩm. Một khu nghỉ dưỡng trồng vài luống rau trước sân không phải farmstay, dù nó tự gọi mình là vậy.",
  },
  {
    num: "02",
    ten: "Khách phải được tham gia, không chỉ đứng nhìn",
    mota: "Được xuống ruộng, được hái, được vào bếp. Nơi nào chỉ cho khách chụp ảnh rồi về thì chúng tôi xếp vào loại khác, không gọi là farmstay.",
  },
  {
    num: "03",
    ten: "Tìm hiểu trước khi đăng",
    mota: "Chúng tôi hỏi chủ farm về mùa vụ, cách canh tác và trải nghiệm cho khách trước khi viết. Chưa nắm được thì chưa đăng — thà trang trống còn hơn dẫn người ta đi sai chỗ.",
  },
  {
    num: "04",
    ten: "Kể đúng, kể cả phần chưa hay",
    mota: "Farm xa, đường xấu, chưa có điều hoà, mùa này chưa có gì để xem — chúng tôi viết thẳng. Khách biết trước thì đi mới vui, và chủ farm cũng đỡ mang tiếng.",
  },
  {
    num: "05",
    ten: "Không xếp hạng theo tiền",
    mota: "Không có gói nổi bật, không bán vị trí đầu trang. Thứ tự trên vnfarmstay.vn không mua được — đây là điều chúng tôi giữ kể cả khi có người trả tiền để đổi.",
  },
];

const CAM_KET_KHACH = [
  "Chúng tôi nói rõ mùa nào farm có gì, để bạn không đi nhầm tháng",
  "Chúng tôi viết cả điểm bất tiện, không chỉ điểm đẹp",
  "Chúng tôi không nhận tiền để đẩy farm nào lên trước",
  "Chúng tôi không giữ tiền của bạn — bạn đặt thẳng với chủ farm",
];

const CAM_KET_CHU_FARM = [
  "Giới thiệu hoàn toàn miễn phí — không phí đăng, không phí tháng, không hoa hồng",
  "Mọi liên kết trỏ thẳng về website, Zalo hoặc số điện thoại của bạn",
  "Chúng tôi không đứng giữa việc kinh doanh của bạn, không can thiệp giá",
  "Bạn muốn gỡ farm khỏi trang lúc nào cũng được, không ràng buộc",
];

/** Nói thẳng về thứ mình KHÔNG làm — chống hiểu lầm về mô hình */
const KHONG_LAM = [
  {
    ten: "Không phải sàn đặt phòng",
    mota: "Chúng tôi không nhận đặt chỗ, không xử lý thanh toán, không giữ tiền cọc. Mọi giao dịch diễn ra thẳng giữa bạn và chủ farm.",
  },
  {
    ten: "Không bán tour",
    mota: "Trang Tour Farmstay là bản đồ vùng và gợi ý mùa để bạn tự chọn đường đi — không phải sản phẩm tour đang mở bán.",
  },
  {
    ten: "Không cấp chứng nhận",
    mota: "Chúng tôi tìm hiểu trước khi đăng, nhưng đó là công việc biên tập chứ không phải kiểm định. Chúng tôi không cấp huy hiệu, không đóng dấu xác nhận chất lượng.",
  },
];

/** Lộ trình — trung thực về chỗ còn trống, không hứa ngày cụ thể */
const LO_TRINH = [
  {
    trangThai: "Đã có",
    mau: "var(--accent-ma)",
    muc: [
      "Bản đồ chín vùng nông nghiệp Việt Nam theo mùa vụ",
      "Trụ kiến thức: farmstay là gì, phân biệt với homestay và resort",
      "Cửa tiếp nhận giới thiệu farmstay từ chủ farm",
    ],
  },
  {
    trangThai: "Đang làm",
    mau: "var(--gold)",
    muc: [
      "Danh bạ farmstay — đang tìm hiểu từng farm trước khi đăng",
      "Câu chuyện từng vùng đất, viết theo mùa",
      "Kênh liên hệ chính thức",
    ],
  },
  {
    trangThai: "Chưa có",
    mau: "var(--text-dim)",
    muc: [
      "Diễn đàn cộng đồng cho chủ farmstay và du khách",
      "Trang tự quản lý thông tin dành cho chủ farm",
    ],
  },
];

export default function VeChungToiPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <style>{`
        .vct-grid-2 { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 900px) { .vct-grid-2 { grid-template-columns: repeat(2, 1fr); } }
        .vct-grid-3 { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 860px) { .vct-grid-3 { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <main id="main" style={{ background: "var(--bg-deep)" }}>
        {/* ── Hero ── */}
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <h1
            className="reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              marginBottom: 20,
              color: "var(--text-primary)",
            }}
          >
            Về <em style={{ color: "var(--gold)" }}>vnfarmstay.vn</em>
          </h1>
          <p className="lead" style={{ maxWidth: 640, margin: "0 auto" }}>
            Chúng tôi tin rằng mỗi mảnh đất nông nghiệp Việt Nam đều mang trong
            mình một câu chuyện xứng đáng được kể — và mỗi du khách xứng đáng
            được trải nghiệm điều đó.
          </p>
        </section>

        {/* ── Vì sao trang này tồn tại ── */}
        <section style={{ padding: "80px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <span className="section-kicker">Vì sao có trang này</span>
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
              Vấn đề chúng tôi muốn giải
            </h2>
            <div className="prose" style={{ maxWidth: "none" }}>
              <p>
                Việt Nam có nông nghiệp trải dài từ ruộng bậc thang vùng cao tới
                miệt vườn sông nước — gần như vùng nào cũng có thứ đáng để người
                ta tới xem và làm cùng. Nhưng người muốn đi thì không biết đi
                đâu, còn người làm nông muốn đón khách thì không biết kể chuyện
                mình ở đâu cho ai nghe.
              </p>
              <p>
                Khoảng trống ở giữa đang được lấp bằng những thứ không ổn: các
                trang đặt phòng xếp farmstay lẫn với nhà nghỉ và xếp hạng theo
                tiền quảng cáo; nhiều nơi mượn chữ &ldquo;farmstay&rdquo; cho
                một khu nghỉ không hề canh tác gì. Người đi thì thất vọng, người
                làm nông tử tế thì chìm nghỉm.
              </p>
              <p>
                vnfarmstay.vn ra đời để làm đúng một việc:{" "}
                <strong>
                  giới thiệu farmstay Việt Nam cho tử tế, rồi đứng sang một bên
                </strong>{" "}
                — dẫn khách về thẳng chỗ chủ farm, không đứng giữa thu tiền của
                bên nào.
              </p>
            </div>
          </div>
        </section>

        {/* ── Sứ mệnh ── */}
        <section
          id="su-menh"
          style={{
            padding: "72px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <span className="section-kicker">Sứ mệnh</span>
            <h2
              className="section-heading section-heading--center"
              style={{
                fontFamily: "var(--font-display),serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 24,
              }}
            >
              Sứ mệnh của chúng tôi
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.9,
                fontSize: "1.02rem",
              }}
            >
              vnfarmstay.vn ra đời để{" "}
              <strong style={{ color: "var(--text-primary)" }}>kết nối</strong>{" "}
              những người muốn trải nghiệm nông nghiệp đích thực với những chủ
              farmstay tâm huyết trên khắp Việt Nam — đồng thời giúp
              <strong style={{ color: "var(--text-primary)" }}>
                {" "}
                tăng thu nhập cho nông dân
              </strong>{" "}
              và
              <strong style={{ color: "var(--text-primary)" }}>
                {" "}
                bảo tồn văn hoá bản địa
              </strong>{" "}
              thông qua du lịch có trách nhiệm.
            </p>
          </div>
        </section>

        {/* ── Nguyên tắc chọn farm ── */}
        <section style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <span className="section-kicker">Năm nguyên tắc</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Chúng tôi chọn farmstay theo nguyên tắc nào
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: 36,
                lineHeight: 1.8,
                maxWidth: 640,
              }}
            >
              Đây là những ràng buộc chúng tôi tự đặt cho mình. Bạn có quyền soi
              và nhắc chúng tôi khi thấy chúng tôi làm sai.
            </p>

            <ol style={{ listStyle: "none", display: "grid", gap: 24 }}>
              {NGUYEN_TAC.map((n) => (
                <li
                  key={n.num}
                  style={{ display: "flex", gap: 20, alignItems: "flex-start" }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.9rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      opacity: 0.42,
                      lineHeight: 1.1,
                      minWidth: 44,
                    }}
                  >
                    {n.num}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: "1.04rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 7,
                      }}
                    >
                      {n.ten}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.93rem",
                        lineHeight: 1.78,
                      }}
                    >
                      {n.mota}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Cam kết hai chiều ── */}
        <section
          style={{
            padding: "80px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <span className="section-kicker">Cam kết</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 36,
              }}
            >
              Chúng tôi hứa gì — với cả hai phía
            </h2>

            <div className="vct-grid-2">
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "28px 26px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.06rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 18,
                  }}
                >
                  Với người đi
                </h3>
                <ul style={{ listStyle: "none", display: "grid", gap: 13 }}>
                  {CAM_KET_KHACH.map((t) => (
                    <li
                      key={t}
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.92rem",
                        lineHeight: 1.72,
                        paddingLeft: 20,
                        position: "relative",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "var(--gold)",
                        }}
                      >
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid oklch(0.7 0.18 115 / 0.3)",
                  borderRadius: "var(--radius)",
                  padding: "28px 26px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.06rem",
                    fontWeight: 700,
                    color: "var(--accent-ma)",
                    marginBottom: 18,
                  }}
                >
                  Với chủ farmstay
                </h3>
                <ul style={{ listStyle: "none", display: "grid", gap: 13 }}>
                  {CAM_KET_CHU_FARM.map((t) => (
                    <li
                      key={t}
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.92rem",
                        lineHeight: 1.72,
                        paddingLeft: 20,
                        position: "relative",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "var(--accent-ma)",
                        }}
                      >
                        ✓
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Chúng tôi KHÔNG làm gì ── */}
        <section style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <span className="section-kicker">Nói cho rõ</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Chúng tôi không làm những việc này
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: 32,
                lineHeight: 1.8,
                maxWidth: 640,
              }}
            >
              Nói trước để không ai kỳ vọng nhầm — và cũng để bạn biết chúng tôi
              kiếm gì và không kiếm gì từ việc này.
            </p>

            <div className="vct-grid-3">
              {KHONG_LAM.map((k) => (
                <div
                  key={k.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "22px 22px 24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 10,
                    }}
                  >
                    {k.ten}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {k.mota}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lộ trình công khai ── */}
        <section
          style={{
            padding: "80px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <span className="section-kicker">Minh bạch</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Chúng tôi đang ở đâu
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: 34,
                lineHeight: 1.8,
                maxWidth: 660,
              }}
            >
              vnfarmstay.vn còn mới và còn nhiều chỗ trống. Chúng tôi để bảng
              này ở đây thay vì giả vờ mọi thứ đã xong — bạn biết đúng thứ mình
              đang dùng.
            </p>

            <div className="vct-grid-3">
              {LO_TRINH.map((g) => (
                <div
                  key={g.trangThai}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderTop: `3px solid ${g.mau}`,
                    borderRadius: "var(--radius)",
                    padding: "22px 22px 24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: g.mau,
                      marginBottom: 16,
                    }}
                  >
                    {g.trangThai}
                  </h3>
                  <ul style={{ listStyle: "none", display: "grid", gap: 11 }}>
                    {g.muc.map((m) => (
                      <li
                        key={m}
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.89rem",
                          lineHeight: 1.7,
                        }}
                      >
                        {m}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Người đứng sau ── */}
        <section style={{ padding: "80px 24px 64px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <span className="section-kicker">Người đứng sau</span>
            <h2
              className="section-heading section-heading--center"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.4rem,2.6vw,1.8rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 22,
              }}
            >
              Ai làm trang này
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.85,
                fontSize: "0.98rem",
              }}
            >
              Người khởi xướng và đứng sau vnfarmstay.vn là{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                Phạm Thanh Tùng
              </strong>{" "}
              — Nhà Hoạch Định.
            </p>
            <p
              style={{
                color: "var(--text-dim)",
                lineHeight: 1.8,
                fontSize: "0.9rem",
                marginTop: 18,
              }}
            >
              Hiện chưa có đội ngũ nhiều người. Chúng tôi nói thẳng điều đó thay
              vì dựng lên một trang &ldquo;đội ngũ&rdquo; với những cái tên
              không có thật — cách nhiều nền tảng vẫn làm để trông cho lớn.
            </p>
          </div>
        </section>

        {/* ── Liên hệ ── */}
        <section id="lien-he" style={{ padding: "0 24px 88px" }}>
          <div
            style={{
              maxWidth: 680,
              margin: "0 auto",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--gold-border)",
              padding: "44px 38px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display),serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Liên hệ với chúng tôi
            </h2>
            {/* ⚠️ 08/08/2026 — Ông xác nhận CẢ BA kênh cũ đều KHÔNG CÓ THẬT, đã gỡ:
                email hello@vnfarmstay.vn · hotline "1800 6868 (miễn phí)" ·
                Zalo "vnfarmstay.vn Official". Để người ta gọi vào số không tồn tại
                hoặc gửi thư vào hòm thư không ai đọc còn tệ hơn là nói thẳng chưa có.
                Khi Ông cấp kênh THẬT thì đặt lại vào đúng chỗ này. */}
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: 26,
                lineHeight: 1.8,
              }}
            >
              Kênh liên hệ chính thức của vnfarmstay.vn đang được mở. Khi có,
              địa chỉ sẽ được đăng ngay tại đây — chúng tôi không muốn để lại
              một số điện thoại hay hòm thư mà bạn gọi vào lại không có ai.
            </p>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.9rem",
                marginBottom: 24,
                lineHeight: 1.75,
              }}
            >
              Nếu bạn đang làm nông và muốn giới thiệu farm của mình, dùng cửa
              dưới đây — đó là lối vào đang mở.
            </p>
            <Link
              href="/dang-farmstay"
              style={{
                display: "inline-block",
                padding: "13px 30px",
                borderRadius: 24,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.9rem",
                transition: "var(--transition)",
              }}
            >
              Giới thiệu farmstay của bạn →
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
