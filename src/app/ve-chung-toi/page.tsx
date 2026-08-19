/**
 * Trang tuyên ngôn — câu chuyện thương hiệu và lý do tồn tại của vnfarmstay.vn.
 *
 * ✅ NGUỒN NỘI DUNG (Ông cấp 08/08/2026): `vnfarmstay-nen-tang-thuong-hieu-v2.md`
 * — tài liệu nền tảng thương hiệu chính thức. Trang này dựng theo Phần I (Câu chuyện),
 * Phần II (Lý do tồn tại) và Phần V (Thông điệp lõi) của tài liệu đó.
 *
 * ⚠️⚠️ ĐỌC KỸ TRƯỚC KHI XOÁ BẤT KỲ SỐ LIỆU NÀO Ở TRANG NÀY ⚠️⚠️
 * Bộ số "9+ năm · 100+ dự án · 30+ tỉnh thành · 5 mùa Xuyên Việt · 100+ điểm đến"
 * là số THẬT, do ÔNG CUNG CẤP trong tài liệu nền tảng thương hiệu nói trên.
 * ĐÂY KHÔNG PHẢI số bịa. KHÔNG được gỡ.
 *
 * Bối cảnh để phiên sau khỏi hiểu nhầm: ngày 08/08/2026 trang này từng bị gỡ một bộ
 * số HOÀN TOÀN KHÁC vì đó là số tự chế của khung web mẫu (500+ farmstay xác minh ·
 * 63 tỉnh thành · 50K+ du khách · 4.8★) — cùng khối "đội ngũ" với hai cái tên không
 * có thật. Bộ số hiện tại KHÔNG liên quan gì tới bộ số đã gỡ đó.
 *
 * Vẫn CẤM tuyệt đối: thêm số farmstay thành viên, số lượt khách, giải thưởng, tên
 * đối tác, hay bất kỳ con số nào KHÔNG có trong tài liệu nền tảng thương hiệu.
 *
 * Giọng: theo đúng nguyên tắc của tài liệu — "chúng ta" khi nói về cộng đồng làm
 * farmstay Việt Nam; "chúng tôi" chỉ dùng khi vnfarmstay.vn tự ràng buộc cam kết.
 */
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import {
  breadcrumbSchema,
  graph,
  organizationSchema,
  websiteSchema,
  webPageSchema,
} from "@/lib/schema";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";
import { buildMetadata } from "@/lib/seo";
import { giuTuGhep } from "@/shared/utils/giu-tu-ghep";

export const metadata: Metadata = buildMetadata({
  title: "Hạ tầng chung của cộng đồng Farmstay Việt Nam",
  description:
    "Một cây đứng riêng thì đổ. Một khu rừng thì có tên trên bản đồ. Câu chuyện và lý do tồn tại của vnfarmstay.vn — hạ tầng chung đưa Việt Nam thành Quốc Gia Du Lịch Nông Nghiệp.",
  canonical: "/ve-chung-toi",
  keywords: [
    "về vnfarmstay",
    "hạ tầng cộng đồng farmstay việt nam",
    "quốc gia du lịch nông nghiệp",
    "làng farmstay việt nam",
    "xuyên việt farmstay",
    "phạm thanh tùng nhà hoạch định",
  ],
});

/**
 * `@graph` cấp website — cùng bộ `@id` với trang chủ, nên Google hiểu đây là MỘT
 * thực thể được mô tả ở hai nơi, không phải hai tổ chức trùng tên.
 * `SearchAction` không khai ở đây: tìm kiếm nội bộ chỉ được hứa từ trang chủ và
 * chỉ khi danh bạ có dữ liệu thật.
 */
const schemas = graph([
  organizationSchema(),
  websiteSchema(false),
  webPageSchema({
    path: "/ve-chung-toi",
    name: `Về ${SITE_NAME} — ${SITE_TAGLINE}`,
    description:
      "Câu chuyện, phạm vi và nguyên tắc của vnfarmstay.vn — hạ tầng chung của cộng đồng Farmstay Việt Nam.",
    type: "AboutPage",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Về chúng tôi", url: "/ve-chung-toi" },
  ]),
]);

/** Ba điều thay đổi khi đứng cùng nhau — Phần I.3 tài liệu nền tảng */
const KHI_DUNG_CUNG = [
  {
    ten: "Giữ nguyên bản sắc riêng",
    mota: "Không đồng phục, không thâu tóm. Mỗi farmstay vẫn là chính nó — với vùng đất, mùa vụ và cách làm riêng.",
  },
  {
    ten: "Liên kết vào một lõi chung",
    mota: "Tín nhiệm, dữ liệu và lượt tiếp cận chảy qua lại giữa mọi mắt xích, thay vì đọng lại ở một chỗ rồi tắt.",
  },
  {
    ten: "Trả lời bằng cả hệ sinh thái",
    mota: "Khi thế giới hỏi “farmstay Việt Nam có gì?”, câu trả lời không còn là một cái tên lẻ.",
  },
];

/** Ba lý do khiến hệ sinh thái là bắt buộc — Phần II.1 */
const LY_DO = [
  {
    so: "01",
    ten: "Giá trị thật đang vô hình",
    mota: "Farmstay Việt Nam không thiếu chất liệu, chỉ thiếu hạ tầng để thế giới nhìn thấy. Một farmstay không được tìm thấy thì về mặt thị trường, nó không tồn tại — dù ngoài đời nó đẹp đến đâu.",
  },
  {
    so: "02",
    ten: "Kỷ nguyên AI Search đã đến, và không chờ ai",
    mota: "Du khách không còn chỉ tra Google. Họ hỏi thẳng trợ lý AI: “farmstay nào đáng đi nhất Việt Nam?”. Ai có dữ liệu chuẩn và mạng lưới liên kết — người đó là câu trả lời. Ai không có — người đó không tồn tại.",
  },
  {
    so: "03",
    ten: "Chi phí truyền thông đang bị đốt trùng lặp",
    mota: "Hàng trăm farmstay đang trả tiền cho cùng một việc mà không ai tận dụng được công sức của ai. Gộp lại, đó là một nguồn lực khổng lồ đang phân mảnh.",
  },
];

/** Điều vnfarmstay.vn KHÔNG phải — Phần II.2 */
const KHONG_PHAI = [
  {
    ten: "Không phải sàn đặt phòng",
    mota: "Không xây chợ — xây hạ tầng. Khách đặt trực tiếp với chủ farm, không trung gian, không hoa hồng.",
  },
  {
    ten: "Không phải tổ chức thâu tóm",
    mota: "Thành viên giữ 100% quyền sở hữu website, dữ liệu, thương hiệu và khách hàng của mình.",
  },
  {
    ten: "Không phải danh bạ liệt kê",
    mota: "Mỗi thành viên là một thực thể có định danh chuẩn, có câu chuyện, có dữ liệu, có liên kết.",
  },
  {
    ten: "Không phải một chiến dịch",
    mota: "Chiến dịch có ngày kết thúc. Hạ tầng thì được bồi đắp mãi.",
  },
];

/**
 * Vốn mồi của người khởi xướng — Phần I.6.
 * ⚠️ SỐ THẬT do Ông cấp trong tài liệu nền tảng thương hiệu. KHÔNG được gỡ.
 */
const VON_MOI = [
  { so: "9+", nhan: "năm hoạch định thực địa" },
  { so: "100+", nhan: "dự án đã triển khai" },
  { so: "30+", nhan: "tỉnh thành đi qua" },
  // Ông xác nhận 19/08/2026 — số kiểm chứng được, lấy từ tài liệu Profile bản 3.
  { so: "3.000+", nhan: "hecta đất nông nghiệp đã tư vấn chuyển đổi" },
  { so: "5", nhan: "mùa Xuyên Việt Farmstay" },
  { so: "100+", nhan: "điểm đến đã kết nối" },
];

/**
 * Nguyên tắc TRUNG THỰC VỀ TRẠNG THÁI — Profile 3.0 Phần III.
 * Đây là tài sản thương hiệu, không phải lời xin lỗi cho phần còn thiếu:
 * trong một thị trường đầy nội dung thổi phồng, một trang dám nói mình còn
 * trống lập tức tách khỏi phần còn lại.
 */
const TRUNG_THUC = [
  {
    ten: "Không dựng dữ liệu mẫu",
    mota: "Không farmstay giả, không bài viết giả, không con số ước lượng làm tròn lên. Danh bạ trống thì để trống.",
  },
  {
    ten: "Nói rõ trạng thái ở mọi khu vực chưa xong",
    mota: "Kèm điều đang chờ và điều sẽ tới — thay vì để người đọc tự đoán hoặc tưởng đã có.",
  },
  {
    ten: "Chỉ công bố con số đã kiểm chứng",
    mota: "Số thành viên, số bài viết, số vùng đã đi — có bao nhiêu nói bấy nhiêu.",
  },
];

/** Năm giá trị cốt lõi — Profile bản 3, mục Đích đến chung. */
const GIA_TRI = [
  {
    ten: "Đi tới tận nơi",
    mota: "Không đăng thứ chưa kiểm chứng. Mỗi cái tên trên trang này là một chuyến đi thật.",
  },
  {
    ten: "Bản sắc là tài sản",
    mota: "Chuẩn hoá hạ tầng dữ liệu, không chuẩn hoá linh hồn. Không đồng phục hoá farmstay của ai.",
  },
  {
    ten: "Cộng sinh, không cạnh tranh nội bộ",
    mota: "Khách đi theo tuyến; thành công của một farm là khách của cả mạng lưới.",
  },
  {
    ten: "Chủ quyền thuộc về chủ farm",
    mota: "Website, dữ liệu, giá và quyền tự quyết là của thành viên. Đây là liên minh, không phải công ty mẹ.",
  },
  {
    ten: "Chuẩn quốc tế từ gốc",
    mota: "Dữ liệu sẵn sàng cho thế giới ngay từ hồ sơ đầu tiên, không đợi tới lúc cần mới đi làm lại.",
  },
];

/** Lộ trình bốn giai đoạn — Profile bản 3. Mô tả ĐƯỜNG ĐI, không tuyên bố đã đạt. */
const LO_TRINH = [
  {
    ky: "Giai đoạn 1",
    ten: "Xây nền",
    mota: "Hoàn thiện lõi; những hồ sơ đầu tiên đến từ mạng lưới Xuyên Việt — mỗi hồ sơ là một chuyến đi thật.",
    dangO: true,
  },
  {
    ky: "Giai đoạn 2",
    ten: "Dệt mạng",
    mota: "Phủ các vùng trọng điểm: Tây Bắc — Đông Bắc, Bắc Trung Bộ, Tây Nguyên — Duyên hải, đồng bằng sông Cửu Long.",
    dangO: false,
  },
  {
    ky: "Giai đoạn 3",
    ten: "Vươn tầm",
    mota: "Dữ liệu song ngữ; hiện diện trên các nền tảng và ấn phẩm du lịch thế giới.",
    dangO: false,
  },
  {
    ky: "Giai đoạn 4",
    ten: "Định vị quốc gia",
    mota: "Trở thành nguồn tham chiếu chính thống về du lịch nông nghiệp Việt Nam cho báo chí, nhà đầu tư và các trợ lý trí tuệ nhân tạo.",
    dangO: false,
  },
];

/** Hiệu ứng cộng dồn — Phần III.6 */
const CONG_DON = [
  {
    quyMo: "1 website",
    ketQua: "Một tín hiệu yếu — thế giới không nghe thấy",
    manh: 12,
  },
  {
    quyMo: "10 website liên kết",
    ketQua: "Một cụm tín hiệu — bắt đầu có hình dạng",
    manh: 42,
  },
  {
    quyMo: "100 website liên kết chuẩn",
    ketQua: "Một tín hiệu quốc gia — Việt Nam là một quốc gia farmstay",
    manh: 100,
  },
];

export default function VeChungToiPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <style>{`
        .vct-3 { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 860px) { .vct-3 { grid-template-columns: repeat(3, 1fr); } }
        .vct-4 { display: grid; grid-template-columns: 1fr; gap: 18px; }
        @media (min-width: 700px) { .vct-4 { grid-template-columns: repeat(2, 1fr); } }
        .vct-von { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
        @media (min-width: 820px) { .vct-von { grid-template-columns: repeat(5, 1fr); } }
      `}</style>

      <main id="main" style={{ background: "var(--bg-deep)" }}>
        {/* ── Hero — tuyên ngôn lõi ── */}
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "84px 24px 88px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Tia sáng xiên — hiệu ứng rút mới từ kho (fx-god-rays), buộc theo
              --accent = gold thương hiệu để không đá tông Bộ IV. */}
          <div
            aria-hidden="true"
            className="fx-god-rays"
            style={{ "--accent": "var(--gold)" } as CSSProperties}
          />
          <span className="section-kicker reveal">Lẽ sống của chúng ta</span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.9rem,4vw,3rem)",
              fontWeight: 700,
              lineHeight: 1.25,
              marginBottom: 24,
              color: "var(--text-primary)",
              maxWidth: 880,
              margin: "0 auto 24px",
            }}
          >
            Một cây đứng riêng thì đổ.
            <br />
            <em style={{ color: "var(--gold)" }}>
              Một khu rừng thì có tên trên bản đồ.
            </em>
          </h1>
          <p className="lead" style={{ maxWidth: 660, margin: "0 auto" }}>
            vnfarmstay.vn là{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              hạ tầng chung của cộng đồng Farmstay Việt Nam
            </strong>{" "}
            — nơi nguồn lực rời rạc của hàng trăm thành viên được quy tụ thành
            một sức mạnh có tổ chức.
          </p>
        </section>

        {/* ── Nghịch lý ── */}
        <section style={{ padding: "84px 24px 64px" }}>
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <span className="section-kicker">Nghịch lý của chúng ta</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 26,
              }}
            >
              Giá trị thật thì có, nhưng đơn độc
            </h2>
            <div className="prose" style={{ maxWidth: "none" }}>
              <p>
                Việt Nam có hàng nghìn farmstay. Mỗi nơi giữ một thứ mà không
                resort nào mua được: gốc trà Shan Tuyết trăm tuổi trên núi Tây
                Bắc, hạt cà phê Liberica gần trăm năm ở Khe Sanh, những cánh
                đồng sen miền Tây, văn hoá Raglai — Êđê giữa đại ngàn, một nếp
                nhà giữ đúng hồn bản địa.
              </p>
              <p>
                Giá trị là thật. Nhưng gõ tên lên Google —{" "}
                <strong>thường không có gì cả.</strong>
              </p>
              <p>
                Đơn độc trong một website tự làm không ai tìm thấy. Đơn độc
                trong một fanpage tự chạy không ai tin. Đơn độc trước Google,
                trước ChatGPT, trước dòng khách quốc tế — những nơi mà farmstay
                của chúng ta không tồn tại, dù nó đẹp đến đâu ngoài đời thật.
              </p>
            </div>
          </div>
        </section>

        {/* ── Vì sao tự làm không đủ ── */}
        <section
          style={{
            padding: "72px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <span className="section-kicker">Vì sao tự làm thì không đủ</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 26,
              }}
            >
              Chúng ta không thua vì thiếu giá&nbsp;trị
            </h2>
            <div className="prose" style={{ maxWidth: "none" }}>
              <p>
                Suốt nhiều năm, mỗi farmstay tự bơi theo cách của mình: tự làm
                web, tự chạy quảng cáo, tự tìm khách. Ai cũng cố gắng. Nhưng kết
                quả cộng lại của cả ngành vẫn gần bằng không trên bản đồ thế
                giới.
              </p>
              <p>
                Lý do đơn giản:{" "}
                <strong>
                  một tiếng nói đơn lẻ, dù to đến đâu, cũng không thành một tín
                  hiệu quốc gia.
                </strong>
              </p>
              <p>
                Một website đứng một mình là một cái cây mọc trên đất trống —
                gió nào cũng lay. Ngân sách quảng cáo của một farmstay nhỏ, dù
                tăng gấp mười, vẫn không đủ để chen chân trên thị trường quốc
                tế. Chúng ta không thua vì thiếu giá trị. Chúng ta thua vì{" "}
                <strong>đứng rời nhau.</strong>
              </p>
            </div>
          </div>
        </section>

        {/* ── Điều thay đổi khi đứng cùng nhau ── */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <span className="section-kicker">Khi đứng cùng nhau</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 18,
              }}
            >
              Rễ giữ rễ, tán che tán
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 680,
                marginBottom: 38,
                lineHeight: 1.85,
              }}
            >
              Trong tự nhiên, một cái cây đứng riêng thì đổ. Một khu rừng thì
              không — vì rễ giữ rễ, tán che tán. Và từ vệ tinh nhìn xuống, người
              ta không thấy từng cây, người ta thấy{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                một khu rừng có tên
              </strong>
              .
            </p>

            <div className="vct-3">
              {KHI_DUNG_CUNG.map((k, i) => (
                <div
                  key={k.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderTop: "3px solid var(--accent-ma)",
                    borderRadius: "var(--radius)",
                    padding: "24px 22px 26px",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: "var(--accent-ma)",
                      opacity: 0.45,
                      marginBottom: 10,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.02rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 10,
                    }}
                  >
                    {giuTuGhep(k.ten)}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.91rem",
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

        {/* ── Đích đến chung — khối nhấn ── */}
        <section id="su-menh" style={{ padding: "24px 24px 84px" }}>
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              background:
                "linear-gradient(150deg, oklch(0.22 0.18 130), oklch(0.17 0.2 130))",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius-lg)",
              padding: "52px 44px",
              textAlign: "center",
            }}
          >
            <span className="section-kicker">Đích đến chung</span>
            <blockquote
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.25rem,2.6vw,1.75rem)",
                fontWeight: 700,
                lineHeight: 1.5,
                color: "var(--text-primary)",
                margin: "10px 0 20px",
              }}
            >
              Đưa Việt Nam định vị thành{" "}
              <em style={{ color: "var(--gold)" }}>
                Quốc Gia Du Lịch Nông Nghiệp
              </em>{" "}
              trên bản đồ thế giới — nơi mỗi vùng đất kể câu chuyện riêng qua
              nông sản, văn hoá và trải nghiệm bản địa.
            </blockquote>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "1rem",
                lineHeight: 1.75,
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              Đây không phải mục tiêu của một người hay một doanh nghiệp. Đây là
              đích đến chỉ có thể tới bằng sức của cả cộng đồng.
            </p>
          </div>
        </section>

        {/* ── Ba lý do tồn tại ── */}
        <section
          style={{
            padding: "84px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <span className="section-kicker">Lý do tồn tại</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 18,
              }}
            >
              Ba lý do khiến hệ sinh thái là bắt buộc
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 660,
                marginBottom: 38,
                lineHeight: 1.85,
              }}
            >
              Không phải một lựa chọn hay ho để cân nhắc. Là điều kiện sống còn
              của cả ngành trong thập kỷ tới.
            </p>

            <div style={{ display: "grid", gap: 22 }}>
              {LY_DO.map((l) => (
                <div
                  key={l.so}
                  style={{
                    display: "flex",
                    gap: 22,
                    alignItems: "flex-start",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "26px 26px 28px",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "2.1rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      opacity: 0.4,
                      lineHeight: 1,
                      minWidth: 52,
                    }}
                  >
                    {l.so}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: "1.08rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 9,
                      }}
                    >
                      {giuTuGhep(l.ten)}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "1rem",
                        lineHeight: 1.8,
                      }}
                    >
                      {l.mota}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Hiệu ứng cộng dồn ── */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <span className="section-kicker">Càng đông càng mạnh</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 18,
              }}
            >
              Giá trị không cộng lại — nó nhân lên
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: 38,
                lineHeight: 1.85,
                maxWidth: 660,
              }}
            >
              Một mắt xích có lượt truy cập, có tín nhiệm — cả mạng lưới cùng
              hưởng. Mỗi thành viên mới gia nhập làm tăng giá trị của tất cả
              những người đã có mặt.
            </p>

            <div style={{ display: "grid", gap: 18 }}>
              {CONG_DON.map((c) => (
                <div key={c.quyMo}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: 16,
                      marginBottom: 9,
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        fontSize: "1rem",
                      }}
                    >
                      {c.quyMo}
                    </span>
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.88rem",
                      }}
                    >
                      {c.ketQua}
                    </span>
                  </div>
                  <div
                    aria-hidden="true"
                    style={{
                      height: 8,
                      borderRadius: 4,
                      background: "var(--gold-dim)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: `${c.manh}%`,
                        height: "100%",
                        borderRadius: 4,
                        background:
                          c.manh === 100
                            ? "linear-gradient(90deg, var(--accent-ma), var(--gold))"
                            : "var(--gold-border)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Điều KHÔNG phải ── */}
        <section
          style={{
            padding: "84px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 1020, margin: "0 auto" }}>
            <span className="section-kicker">Nói cho rõ</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 18,
              }}
            >
              vnfarmstay.vn không phải những thứ này
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 640,
                marginBottom: 36,
                lineHeight: 1.85,
              }}
            >
              Chúng ta không xây một thương hiệu mới đè lên các thương hiệu cũ.
              Chúng ta xây <strong>cái nền mà tất cả cùng đứng.</strong>
            </p>

            <div className="vct-4">
              {KHONG_PHAI.map((k) => (
                <div
                  key={k.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "24px 22px 26px",
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
                    {giuTuGhep(k.ten)}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "1rem",
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

        {/* ── Nguyên tắc bất di bất dịch ── */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <span className="section-kicker">Nguyên tắc bất di bất dịch</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 34,
              }}
            >
              Cộng sinh, không ký sinh
            </h2>

            <div style={{ display: "grid", gap: 22 }}>
              <div
                style={{
                  background: "var(--bg-card)",
                  borderLeft: "3px solid var(--accent-ma)",
                  borderRadius: "var(--radius-sm)",
                  padding: "24px 26px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    color: "var(--accent-ma)",
                    marginBottom: 10,
                  }}
                >
                  Cộng sinh, không ký sinh
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                  }}
                >
                  Hệ sinh thái không sống bằng việc lấy đi của thành viên. Hệ
                  sinh thái sống bằng việc làm mỗi thành viên mạnh lên — và mỗi
                  thành viên mạnh lên lại làm dày thêm đất chung.
                </p>
              </div>

              <div
                style={{
                  background: "var(--bg-card)",
                  borderLeft: "3px solid var(--gold)",
                  borderRadius: "var(--radius-sm)",
                  padding: "24px 26px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    marginBottom: 10,
                  }}
                >
                  Cho trước, nhận sau — nhưng nhận nhiều hơn cho
                </h3>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    lineHeight: 1.8,
                  }}
                >
                  Mỗi thành viên góp vào một phần: câu chuyện thật, hình ảnh
                  thật, một lượt chia sẻ, một liên kết. Đổi lại, họ nhận về sức
                  mạnh cộng hưởng của cả trăm thành viên khác. Đó là phép tính
                  duy nhất khiến mọi người cùng có lợi.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Năm giá trị cốt lõi — Profile bản 3 ── */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 1040, margin: "0 auto" }}>
            <span className="section-kicker">Chúng ta cầm gì trong tay</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 26,
              }}
            >
              Năm giá trị cốt lõi
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 18,
              }}
            >
              {GIA_TRI.map((g, i) => (
                <div
                  key={g.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "26px 24px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "0.95rem",
                      color: "var(--gold)",
                      marginBottom: 10,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 10,
                    }}
                  >
                    {g.ten}
                  </h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                    {g.mota}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Trung thực về trạng thái — Profile 3.0 Phần III ── */}
        <section
          style={{
            padding: "84px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <span className="section-kicker">Cách chúng ta tự ràng buộc</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 18,
              }}
            >
              Thà nói &ldquo;chúng ta chưa có&rdquo; còn hơn dựng cảnh cho có vẻ
              đông vui
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.85,
                maxWidth: 760,
                marginBottom: 30,
              }}
            >
              Danh bạ còn trống thì trang chủ nói thẳng là còn trống. Cộng đồng
              chưa mở thì trang cộng đồng nói thẳng là chưa mở — và cũng không
              dựng sẵn vài bài đăng cho có vẻ đông vui. Đó không phải điểm yếu
              cần che; đó là bằng chứng đầu tiên rằng nền tảng này đáng tin.
            </p>
            <div className="vct-3">
              {TRUNG_THUC.map((t) => (
                <div
                  key={t.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--gold-border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "24px 22px",
                  }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 10,
                    }}
                  >
                    {t.ten}
                  </h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                    {t.mota}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Chuẩn quốc tế = thủ tục xuất khẩu cho câu chuyện — Phần IV.4 ── */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <span className="section-kicker">Vì sao phải chuẩn quốc tế</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 22,
              }}
            >
              Thủ tục xuất khẩu cho câu chuyện Việt Nam
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.85,
                marginBottom: 18,
              }}
            >
              Nông sản Việt muốn ra thế giới thì phải đạt chuẩn xuất khẩu. Dữ
              liệu Việt muốn ra thế giới cũng vậy.
            </p>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.85 }}>
              Chuẩn hoá dữ liệu — định danh chính xác, nội dung song ngữ, cấu
              trúc mà máy đọc được — không phải việc kỹ thuật vụn vặt. Đó là
              điều kiện để dòng khách quốc tế và các trợ lý trí tuệ nhân tạo tìm
              được đường tới tận cổng farm, thay vì phải đi qua một bên trung
              gian nào đó.
            </p>
          </div>
        </section>

        {/* ── Người khởi xướng + vốn mồi ── */}
        <section
          className="motif-x"
          style={{
            padding: "84px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <span className="section-kicker">Người khởi xướng</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 22,
              }}
            >
              Bộ rễ đầu tiên
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.85,
                fontSize: "1rem",
                maxWidth: 720,
                marginBottom: 16,
              }}
            >
              Hệ sinh thái được khởi xướng bởi{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                Nhà Hoạch Định Phạm Thanh Tùng
              </strong>{" "}
              cùng cộng đồng{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                Làng Farmstay Việt Nam
              </strong>{" "}
              — tác giả cuốn sách về farmstay đầu tiên tại Việt Nam, người sáng
              lập hành trình Xuyên Việt Farmstay.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.85,
                fontSize: "1rem",
                maxWidth: 720,
                marginBottom: 40,
              }}
            >
              Toàn bộ uy tín tích luỹ ấy được{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                góp vào làm vốn mồi cho cộng đồng
              </strong>{" "}
              — như người mở đất góp bộ rễ đầu tiên. Từ đây, hệ sinh thái lớn
              lên bằng nguồn lực của tất cả thành viên.
            </p>

            {/* ⚠️ Bộ số THẬT do Ông cấp trong tài liệu nền tảng thương hiệu — KHÔNG gỡ */}
            <div className="vct-von">
              {VON_MOI.map((v) => (
                <div
                  key={v.nhan}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--gold-border)",
                    borderRadius: "var(--radius)",
                    padding: "22px 16px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.9rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      lineHeight: 1.1,
                      marginBottom: 8,
                    }}
                  >
                    {v.so}
                  </div>
                  <div
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.8rem",
                      lineHeight: 1.55,
                    }}
                  >
                    {v.nhan}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lộ trình bốn giai đoạn — Profile bản 3 ── */}
        <section style={{ padding: "84px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <span className="section-kicker">Đường còn dài</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem,3vw,2.05rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 26,
              }}
            >
              Lộ trình bốn giai đoạn
            </h2>
            <div className="vct-4">
              {LO_TRINH.map((g) => (
                <div
                  key={g.ky}
                  style={{
                    background: "var(--bg-card)",
                    border: g.dangO
                      ? "1px solid var(--gold-border)"
                      : "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "24px 22px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 10,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 700,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--gold)",
                      }}
                    >
                      {g.ky}
                    </span>
                    {g.dangO && (
                      <span
                        style={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          color: "var(--bg-deep)",
                          background: "var(--gold)",
                          borderRadius: 20,
                          padding: "3px 10px",
                        }}
                      >
                        đang ở đây
                      </span>
                    )}
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 10,
                    }}
                  >
                    {g.ten}
                  </h3>
                  <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                    {g.mota}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Lời mời ── */}
        <section id="lien-he" style={{ padding: "84px 24px 88px" }}>
          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--gold-border)",
              padding: "48px 40px",
              textAlign: "center",
            }}
          >
            <blockquote
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.2rem,2.4vw,1.6rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.5,
                marginBottom: 20,
              }}
            >
              Chúng ta không chạy đua marketing với nhau.
              <br />
              <em style={{ color: "var(--gold)" }}>
                Chúng ta cùng nhau quy hoạch lại luật chơi.
              </em>
            </blockquote>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: 14,
                fontSize: "1rem",
              }}
            >
              Bạn giữ 100% những gì là của bạn — bạn chỉ thêm, không mất gì.
              Không phí đăng, không hoa hồng, khách đặt thẳng với bạn.
            </p>
            {/* ⚠️ 08/08/2026 — CẢ BA kênh liên hệ cũ đều KHÔNG CÓ THẬT, đã gỡ:
                email hello@vnfarmstay.vn · hotline "1800 6868" · Zalo "Official".
                Khi Ông cấp kênh THẬT thì đặt lại vào đúng chỗ này. */}
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "1rem",
                lineHeight: 1.75,
                marginBottom: 28,
              }}
            >
              Kênh liên hệ chính thức đang được mở. Trong lúc chờ, cửa dưới đây
              là lối vào đang hoạt động.
            </p>
            <div
              style={{
                display: "flex",
                gap: 12,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/chu-farmstay"
                style={{
                  display: "inline-block",
                  padding: "13px 28px",
                  borderRadius: 24,
                  background: "var(--gold)",
                  color: "var(--bg-deep)",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  transition: "var(--transition)",
                }}
              >
                Tham gia hệ sinh thái →
              </Link>
              <Link
                href="/tour-farmstay"
                style={{
                  display: "inline-block",
                  padding: "13px 28px",
                  borderRadius: 24,
                  border: "1px solid var(--gold-border)",
                  color: "var(--gold)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  transition: "var(--transition)",
                }}
              >
                Khám phá vùng đất
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
