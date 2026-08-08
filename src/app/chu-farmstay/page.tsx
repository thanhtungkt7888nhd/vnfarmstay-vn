/**
 * Trang hub dành cho Chủ Farmstay — giải thích lời mời, cách hoạt động và FAQ.
 *
 * ⚠️ 08/08/2026 — Ông ra lệnh gỡ sạch nội dung NỀN TẢNG BỊA thừa hưởng từ khung web cũ:
 * vnfarmstay.vn KHÔNG vận hành nền tảng đặt phòng, KHÔNG thu hoa hồng, KHÔNG xác minh
 * thực địa, KHÔNG có bảng điều khiển chủ farmstay. Đã gỡ: bảng giá "8% hoa hồng" ·
 * "50.000+ du khách/tháng" · "500+ farmstay đối tác" · huy hiệu "Đã xác minh" ·
 * 2 lời chứng thực tự chế (Chị Nguyễn Hương · Anh Trần Minh).
 * CẤM đưa số liệu mới vào trang này nếu Ông chưa xác nhận đó là số THẬT.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { JsonLd } from "@/shared/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Dành cho Chủ Farmstay — Đưa farm của bạn lên vnfarmstay.vn",
  description:
    "Giới thiệu farmstay của bạn trên vnfarmstay.vn — miễn phí, kèm liên kết về website riêng của farm. Chúng tôi kể câu chuyện của farm, khách liên hệ thẳng với bạn.",
  canonical: "/chu-farmstay",
  keywords: [
    "chủ farmstay",
    "giới thiệu farmstay",
    "kinh doanh farmstay",
    "quảng bá farmstay",
    "farmstay việt nam",
  ],
});

const schemas = [
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Dành cho chủ farmstay", url: "/chu-farmstay" },
  ]),
];

const steps = [
  {
    num: "01",
    title: "Bạn kể về farm của mình",
    desc: "Gửi cho chúng tôi tên farm, ở đâu, làm nông gì, khách tới được trải nghiệm điều gì — kèm vài tấm ảnh thật của farm.",
  },
  {
    num: "02",
    title: "Chúng tôi viết lại thành câu chuyện",
    desc: "Không phải mẩu rao vặt. Là câu chuyện về vùng đất, mùa vụ và con người ở farm bạn — thứ khiến người đọc muốn tới tận nơi.",
  },
  {
    num: "03",
    title: "Đăng lên, kèm đường về farm bạn",
    desc: "Trang giới thiệu trỏ thẳng về website, Zalo hoặc số điện thoại của bạn. Khách liên hệ trực tiếp với bạn, không qua chúng tôi.",
  },
];

const benefits = [
  {
    title: "Hoàn toàn miễn phí",
    desc: "Không phí đăng, không phí hàng tháng, không hoa hồng. vnfarmstay.vn không đứng giữa việc kinh doanh của bạn.",
  },
  {
    title: "Được kể chuyện tử tế",
    desc: "Farm của bạn được viết bằng giọng kể — vùng đất, mùa vụ, nếp sống — thay vì một dòng liệt kê tiện nghi khô khan.",
  },
  {
    title: "Dẫn khách về thẳng chỗ bạn",
    desc: "Mọi liên kết trỏ về website, Zalo hoặc số điện thoại của farm. Khách đặt thẳng với bạn, theo giá và điều kiện của bạn.",
  },
  {
    title: "Có mặt trên Google",
    desc: "Trang của farm bạn được tối ưu để người tìm 'farmstay + tên vùng' có thể tìm ra — thứ mà một trang Facebook khó làm được.",
  },
  {
    title: "Quảng bá chéo",
    desc: "Farm của bạn đứng cạnh những farm khác cùng vùng. Người đọc tìm một cái, biết thêm cả cụm.",
  },
  {
    title: "Mọi quy mô đều được",
    desc: "Từ vườn nhà vài phòng tới trang trại sinh thái lớn. Điều chúng tôi tìm là trải nghiệm thật, không phải tiện nghi xa xỉ.",
  },
];

/**
 * Bốn tầng hệ sinh thái — Phần III.2 tài liệu nền tảng thương hiệu (Ông cấp 08/08/2026).
 * Không tầng nào chỉ nhận, không tầng nào chỉ cho.
 */
const TANG = [
  {
    ten: "Rễ",
    thucThe: "vnfarmstay.vn",
    nhan: "Sự phong phú và dữ liệu thực địa của các nhánh",
    gop: "Bảo chứng uy tín, chuẩn dữ liệu, điều phối chung",
    mau: "var(--gold)",
  },
  {
    ten: "Thân",
    thucThe: "Chủ farm & người kiến tạo",
    nhan: "Thẩm quyền được cả mạng lưới xác nhận",
    gop: "Câu chuyện thật, tính người, nội dung gốc",
    mau: "var(--accent-ma)",
  },
  {
    ten: "Tán",
    thucThe: "Farmstay điểm đến",
    nhan: "Lượt tiếp cận, tín nhiệm, khách trong nước và quốc tế",
    gop: "Bằng chứng thực địa, hình ảnh, sản vật, trải nghiệm",
    mau: "var(--gold-light)",
  },
  {
    ten: "Gió",
    thucThe: "Kênh social cộng đồng",
    nhan: "Nội dung chuẩn từ lõi và từ thành viên khác",
    gop: "Độ phủ, tương tác, khuếch tán chéo",
    mau: "var(--text-muted)",
  },
];

/** Liên kết ngang giữa thành viên — Phần III.4 */
const LIEN_KET_NGANG = [
  {
    ten: "Liên kết cùng vùng",
    mota: "Các farmstay trong một vùng đất giới thiệu chéo nhau, cùng tạo thành một tuyến trải nghiệm hoàn chỉnh thay vì cạnh tranh giành một lượt khách.",
  },
  {
    ten: "Liên kết cùng chủ đề",
    mota: "Các thành viên cùng làm cà phê, cùng làm trà, cùng làm nông nghiệp hữu cơ liên kết thành cụm chuyên đề — nâng thẩm quyền của cả cụm.",
  },
  {
    ten: "Liên kết theo tuyến hành trình",
    mota: "Khách đi Tây Bắc năm ngày cần ba bốn điểm dừng; mỗi điểm giới thiệu điểm kế tiếp — không ai mất khách, tất cả cùng có thêm đêm lưu trú.",
  },
];

/** Cơ chế truyền thông chéo — Phần IV.3 */
const CO_CHE = [
  {
    ten: "Nội dung một lần — lan toả nhiều lần",
    mota: "Một câu chuyện hay không chỉ nằm trên web của bạn: được đưa lên lõi trung tâm, được các thành viên cùng vùng và cùng chủ đề chia sẻ lại, được cắt thành nội dung ngắn cho các kênh cộng đồng.",
  },
  {
    ten: "Giới thiệu chéo theo tuyến",
    mota: "Mỗi hồ sơ farmstay đều dẫn tới các điểm đến kế tiếp trên cùng hành trình. Khách đến với một thành viên — biết thêm ba thành viên khác, không tốn một đồng quảng cáo.",
  },
  {
    ten: "Chiến dịch chung theo mùa",
    mota: "Mùa lúa chín Tây Bắc, mùa cà phê Tây Nguyên, mùa nước nổi miền Tây — cả cộng đồng cùng đẩy một chủ đề trong cùng khoảng thời gian. Trăm kênh nói cùng một câu chuyện.",
  },
  {
    ten: "Kho tài nguyên dùng chung",
    mota: "Bộ nhận diện thành viên, mẫu nội dung, hướng dẫn chụp ảnh, khung bài viết, cẩm nang chuẩn hoá dữ liệu — làm một lần, cả cộng đồng dùng. Thành viên nhỏ nhất cũng có công cụ như thành viên lớn nhất.",
  },
  {
    ten: "Sự kiện hội tụ",
    mota: "Hành trình Xuyên Việt Farmstay, sự kiện thường niên Farmstay Update, các buổi gặp mặt vùng — nơi quan hệ được làm dày và thành viên mới được kết nạp trước sự chứng kiến của cả cộng đồng.",
  },
  {
    ten: "Tiếng nói chung với bên ngoài",
    mota: "Khi cộng đồng làm việc với báo chí, chính quyền, đối tác lữ hành hay thị trường quốc tế, một tiếng nói đại diện cho hàng trăm thành viên có trọng lượng khác hẳn hàng trăm tiếng nói lẻ.",
  },
];

/** Cam kết công bằng của cơ chế — Phần IV.4 */
const CAM_KET_CONG_BANG = [
  {
    ten: "Không thu hoa hồng",
    mota: "Không lấy phần trăm trên doanh thu của thành viên — khách đặt thẳng với chủ farm.",
  },
  {
    ten: "Thành viên nhỏ không bị lép vế",
    mota: "Vị trí trên bản đồ và trong nội dung dựa trên chất lượng và tính xác thực, không dựa trên quy mô hay chi tiền.",
  },
  {
    ten: "Ai góp nhiều được lan toả nhiều",
    mota: "Thành viên tích cực đóng góp nội dung và chia sẻ chéo được ưu tiên khuếch đại.",
  },
  {
    ten: "Dữ liệu là của thành viên",
    mota: "Góp vào để dùng chung, không phải giao đi. Bạn giữ 100% quyền sở hữu website, dữ liệu, thương hiệu và khách hàng.",
  },
];

const faqs = [
  {
    q: "vnfarmstay.vn lấy phí như thế nào?",
    a: "Không lấy đồng nào. Giới thiệu farm trên vnfarmstay.vn hoàn toàn miễn phí — không phí đăng, không phí hàng tháng, không hoa hồng. Chúng tôi không nhận đặt phòng nên cũng không có gì để ăn phần trăm.",
  },
  {
    q: "Tôi cần chuẩn bị gì để được giới thiệu?",
    a: "Tên farm, địa chỉ, mô tả ngắn về việc làm nông và trải nghiệm cho khách, vài tấm ảnh thật của farm, cùng cách liên hệ để chúng tôi dẫn khách về đúng chỗ bạn — website, Zalo hoặc số điện thoại.",
  },
  {
    q: "Khách đặt phòng qua vnfarmstay.vn phải không?",
    a: "Không. Chúng tôi chỉ giới thiệu và dẫn đường. Khách đọc xong sẽ liên hệ thẳng với bạn qua kênh bạn cung cấp, đặt theo giá và điều kiện của bạn. Chúng tôi không giữ tiền, không xử lý thanh toán, không can thiệp.",
  },
  {
    q: "Tôi muốn sửa thông tin farm sau khi đã đăng thì làm sao?",
    a: "Nhắn cho chúng tôi qua trang liên hệ, nói rõ cần sửa gì. Hiện chưa có trang tự quản lý cho chủ farmstay — mọi thay đổi đều làm thủ công, nên xin bạn kiên nhẫn vài ngày.",
  },
  {
    q: "Farmstay nhỏ, chưa có nhiều tiện nghi có được giới thiệu không?",
    a: "Được. vnfarmstay.vn hợp với mọi quy mô — từ homestay nông trại nhỏ tới trang trại sinh thái lớn. Điều quan trọng là trải nghiệm đích thực và cách bạn đối đãi với đất đai, không phải tiện nghi xa xỉ.",
  },
];

export default function ChuFarmstayPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <style>{`
        .owner-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .owner-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .benefits-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        .step-grid { display: grid; grid-template-columns: 1fr; gap: 0; }
        @media (min-width: 768px) { .step-grid { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <main
        id="main"
        style={{ background: "var(--bg-main)", minHeight: "100vh" }}
      >
        {/* ── Hero ── */}
        <section
          className="plasma-bg motif-x"
          style={{
            background:
              "linear-gradient(160deg, var(--bg-deep) 0%, #0d2b1a 100%)",
            borderBottom: "1px solid var(--gold-border)",
            padding: "72px 24px 64px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}
          >
            <span
              style={{
                display: "inline-block",
                background: "rgba(212,168,83,0.15)",
                border: "1px solid var(--gold-border)",
                color: "var(--gold)",
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                padding: "5px 16px",
                borderRadius: 20,
                marginBottom: 24,
                textTransform: "uppercase",
              }}
            >
              Dành cho Chủ Farmstay
            </span>

            <h1
              className="shine reveal"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              Đưa farmstay của bạn
              <br />
              <span style={{ color: "var(--gold)" }}>
                đến đúng người, đúng lúc
              </span>
            </h1>

            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1.05rem",
                lineHeight: 1.75,
                maxWidth: 580,
                margin: "0 auto 36px",
              }}
            >
              vnfarmstay.vn giới thiệu farm của bạn tới người đang tìm trải
              nghiệm nông nghiệp đích thực, rồi dẫn họ về thẳng chỗ bạn — miễn
              phí, không hoa hồng, không đứng giữa.
            </p>

            <div
              style={{
                display: "flex",
                gap: 16,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/dang-farmstay"
                className="fx-spotlight"
                style={{
                  display: "inline-block",
                  background: "var(--gold)",
                  color: "#0f2318",
                  fontWeight: 700,
                  fontSize: "0.95rem",
                  padding: "14px 32px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                }}
              >
                Đăng ký miễn phí ngay
              </Link>
              <a
                href="#cach-hoat-dong"
                style={{
                  display: "inline-block",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  padding: "14px 28px",
                  borderRadius: "var(--radius-sm)",
                  textDecoration: "none",
                }}
              >
                Tìm hiểu thêm ↓
              </a>
            </div>
          </div>
        </section>

        {/* Thanh số cũ (50K+ du khách/tháng · 500+ farmstay đối tác · 8% hoa hồng ·
            0đ phí niêm yết) đã GỠ 08/08/2026 — toàn bộ là số tự chế của khung web cũ.
            KHÔNG thay bằng bộ số khác; chỉ đặt lại khi có số THẬT Ông xác nhận. */}

        <div
          style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px 80px" }}
        >
          <BreadcrumbNav
            items={[{ name: "Dành cho chủ farmstay", href: "/chu-farmstay" }]}
          />

          {/* ── Cách hoạt động ── */}
          <section
            id="cach-hoat-dong"
            style={{ marginTop: 64 }}
            aria-label="Cách hoạt động"
          >
            {/* Chồng lớp: số Bodoni khổng lồ mờ làm NỀN, heading nổi lên trên
                — chữ ký bố cục của mood board Dark Luxe Editorial, lấy từ kho
                03-BANG-LAYOUT (biến thể web chưa từng dùng). */}
            <div style={{ position: "relative", isolation: "isolate" }}>
              <span
                aria-hidden="true"
                className="editorial-num"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  zIndex: -1,
                  transform: "translateY(-0.12em)",
                }}
              >
                03
              </span>
              <h2
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "1.7rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  textAlign: "center",
                  marginBottom: 8,
                  position: "relative",
                }}
              >
                Chỉ 3 bước để lên sóng
              </h2>
            </div>
            <p
              style={{
                color: "var(--text-dim)",
                textAlign: "center",
                marginBottom: 48,
                fontSize: "0.92rem",
              }}
            >
              Từ đăng ký đến lên sóng — không quá 7 ngày.
            </p>

            <div className="step-grid">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  style={{
                    padding: "32px 28px",
                    borderLeft: i > 0 ? "1px solid var(--border)" : "none",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "3rem",
                      fontWeight: 700,
                      color: "rgba(212,168,83,0.15)",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: "1rem",
                      marginBottom: 10,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.88rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Lợi ích ── */}
          <section
            style={{ marginTop: 72 }}
            aria-label="Lợi ích cho chủ farmstay"
          >
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                textAlign: "center",
                marginBottom: 8,
              }}
            >
              Tại sao chủ farmstay chọn chúng tôi?
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                textAlign: "center",
                marginBottom: 44,
                fontSize: "0.92rem",
              }}
            >
              Không chỉ là nơi đăng tin — đây là đối tác phát triển kinh doanh
              của bạn.
            </p>

            <div
              className="owner-grid benefits-grid"
              style={{ display: "grid", gap: 20 }}
            >
              {benefits.map((b) => (
                <div
                  key={b.title}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "28px 24px",
                    transition: "var(--transition)",
                  }}
                >
                  <h3
                    style={{
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      fontSize: "0.95rem",
                      marginBottom: 8,
                    }}
                  >
                    {b.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.85rem",
                      lineHeight: 1.7,
                    }}
                  >
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Khối "Chủ farmstay nói gì?" (2 lời chứng thực Chị Nguyễn Hương ·
              Anh Trần Minh) và khối "Minh bạch về chi phí" (gói Cơ bản / gói Xác minh
              8% hoa hồng) đã GỠ HẲN 08/08/2026 — người không có thật, gói phí không có thật.
              Ông chốt: KHÔNG viết lời chứng thực mới, KHÔNG dựng bảng giá mới. */}

          {/* ── Bốn tầng hệ sinh thái ──
              Nguồn: vnfarmstay-nen-tang-thuong-hieu-v2.md Phần III.2 (Ông cấp 08/08/2026).
              Mỗi tầng VỪA CHO VỪA NHẬN — đó là điều khiến hệ sinh thái tự nuôi được chính nó. */}
          <section style={{ marginTop: 72 }} aria-label="Bốn tầng hệ sinh thái">
            <span className="section-kicker">Cấu trúc hệ sinh thái</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Bốn tầng — mỗi tầng vừa cho vừa nhận
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 640,
                marginBottom: 28,
                lineHeight: 1.8,
              }}
            >
              vnfarmstay.vn là <strong>bộ rễ chung</strong> — nơi tích tụ và
              phân phối tín nhiệm. Website thành viên là{" "}
              <strong>tầng tán</strong> mọc trên bộ rễ ấy: vươn nhanh hơn, đứng
              vững hơn so với mọc một mình trên đất trống.
            </p>

            <div style={{ display: "grid", gap: 14 }}>
              {TANG.map((t) => (
                <div
                  key={t.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderLeft: `3px solid ${t.mau}`,
                    borderRadius: "var(--radius-sm)",
                    padding: "20px 22px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: 12,
                      flexWrap: "wrap",
                      marginBottom: 12,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-display), serif",
                        fontSize: "1.15rem",
                        fontWeight: 700,
                        color: t.mau,
                      }}
                    >
                      {t.ten}
                    </span>
                    <span
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.88rem",
                      }}
                    >
                      {t.thucThe}
                    </span>
                  </div>
                  <div className="owner-grid">
                    <div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-dim)",
                          fontWeight: 600,
                          marginBottom: 5,
                        }}
                      >
                        Nhận từ mạng lưới
                      </div>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.87rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {t.nhan}
                      </p>
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: "0.7rem",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--text-dim)",
                          fontWeight: 600,
                          marginBottom: 5,
                        }}
                      >
                        Góp lại cho mạng lưới
                      </div>
                      <p
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.87rem",
                          lineHeight: 1.65,
                        }}
                      >
                        {t.gop}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Liên kết ngang — Phần III.4 ── */}
          <section
            style={{ marginTop: 72 }}
            aria-label="Liên kết giữa các thành viên"
          >
            <span className="section-kicker">Liên kết ngang</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Farmstay bên cạnh không phải đối thủ
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 640,
                marginBottom: 28,
                lineHeight: 1.8,
              }}
            >
              Đây là phần mà mọi danh bạ đều bỏ quên — và là phần tạo ra sức
              mạnh thật của hệ sinh thái. Farm bên cạnh là{" "}
              <strong>mắt xích tiếp theo của cùng một hành trình.</strong>
            </p>

            <div className="owner-grid">
              {LIEN_KET_NGANG.map((l) => (
                <div
                  key={l.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "22px 22px 24px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "0.99rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 9,
                    }}
                  >
                    {l.ten}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.89rem",
                      lineHeight: 1.72,
                    }}
                  >
                    {l.mota}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Cơ chế truyền thông chéo — Phần IV.3 ── */}
          <section
            style={{ marginTop: 72 }}
            aria-label="Cơ chế truyền thông chéo"
          >
            <span className="section-kicker">Cơ chế vận hành</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Một công sức, nhiều lần hiệu quả
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 640,
                marginBottom: 28,
                lineHeight: 1.8,
              }}
            >
              Mỗi người góp một phần nhỏ, mỗi người nhận về phần của tất cả. Đây
              là sáu cách công sức của bạn được nhân lên khi chảy qua mạng lưới.
            </p>

            <div className="owner-grid">
              {CO_CHE.map((c, i) => (
                <div
                  key={c.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "22px 22px 24px",
                  }}
                >
                  <div
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.4rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      opacity: 0.42,
                      marginBottom: 8,
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3
                    style={{
                      fontSize: "0.99rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 9,
                    }}
                  >
                    {c.ten}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.89rem",
                      lineHeight: 1.72,
                    }}
                  >
                    {c.mota}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ── Cam kết công bằng — Phần IV.4 ── */}
          <section style={{ marginTop: 72 }} aria-label="Cam kết công bằng">
            <span className="section-kicker">Cam kết công bằng</span>
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 28,
              }}
            >
              Bốn điều cơ chế này tự ràng buộc
            </h2>

            <ul style={{ listStyle: "none", display: "grid", gap: 14 }}>
              {CAM_KET_CONG_BANG.map((c) => (
                <li
                  key={c.ten}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid oklch(0.7 0.18 115 / 0.28)",
                    borderRadius: "var(--radius-sm)",
                    padding: "18px 22px",
                  }}
                >
                  <strong
                    style={{
                      color: "var(--accent-ma)",
                      fontSize: "0.95rem",
                      display: "block",
                      marginBottom: 6,
                    }}
                  >
                    {c.ten}
                  </strong>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.89rem",
                      lineHeight: 1.72,
                    }}
                  >
                    {c.mota}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* ── FAQ ── */}
          <section style={{ marginTop: 72 }} aria-label="Câu hỏi thường gặp">
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 32,
              }}
            >
              Câu hỏi thường gặp
            </h2>

            {/* textAlign justify ở chính khối bọc: máy đo coi cả cụm hỏi–đáp
                là một khối đoạn văn K5 (sàn BAN-DO-BO-CUC-CHU). */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                textAlign: "justify",
              }}
            >
              {faqs.map((item, idx) => (
                <details
                  key={idx}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-sm)",
                    padding: "18px 22px",
                  }}
                >
                  <summary
                    style={{
                      cursor: "pointer",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      listStyle: "none",
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.q}
                  </summary>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      marginTop: 12,
                      lineHeight: 1.75,
                      fontSize: "0.9rem",
                    }}
                  >
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          </section>

          {/* ── Final CTA ── */}
          <section
            style={{
              marginTop: 72,
              background: "var(--bg-deep)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius)",
              padding: "56px 40px",
              textAlign: "center",
            }}
            aria-label="Đăng ký"
          >
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--gold)",
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Bắt đầu ngay hôm nay
            </p>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
                lineHeight: 1.3,
              }}
            >
              Farmstay của bạn xứng đáng
              <br />
              được nhiều người biết đến hơn
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.92rem",
                maxWidth: 460,
                margin: "0 auto 32px",
                lineHeight: 1.7,
              }}
            >
              Gửi cho chúng tôi vài dòng về farm của bạn. Miễn phí, không hoa
              hồng, không ràng buộc.
            </p>
            <Link
              href="/dang-farmstay"
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "#0f2318",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "14px 36px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
              }}
            >
              Giới thiệu farmstay của bạn →
            </Link>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
