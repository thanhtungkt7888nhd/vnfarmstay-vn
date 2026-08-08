/**
 * Trụ kiến thức — trả lời câu hỏi gốc của cả ngành: "farmstay là gì".
 *
 * Vì sao trang này tồn tại: người Việt tìm "farmstay là gì" rất nhiều nhưng phần lớn
 * kết quả là bài rao bán phòng đội lốt bài giải thích. vnfarmstay.vn trả lời tử tế —
 * kể cả phần "farmstay KHÔNG hợp với ai", thứ không nơi nào chịu viết vì sợ mất khách.
 *
 * ⚠️ Mọi nội dung ở đây là ĐỊNH NGHĨA và KIẾN THỨC NÔNG NGHIỆP/ĐỊA LÝ có thật.
 * KHÔNG có số liệu kinh doanh, KHÔNG có tên farmstay cụ thể, KHÔNG có lời chứng thực.
 * Muốn thêm ví dụ farm thật → phải là farm Ông đã xác nhận, không tự nghĩ ra.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { JsonLd } from "@/shared/ui/JsonLd";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Farmstay là gì? Phân biệt farmstay, homestay và resort sinh thái",
  description:
    "Farmstay là hình thức lưu trú ngay trong một nông trại đang canh tác thật. Phân biệt rõ farmstay với homestay và resort sinh thái, các loại hình farmstay ở Việt Nam, ai hợp và ai không hợp.",
  canonical: "/farmstay-la-gi",
  keywords: [
    "farmstay là gì",
    "phân biệt farmstay homestay",
    "farmstay việt nam",
    "du lịch nông nghiệp",
    "nông nghiệp trải nghiệm",
    "resort sinh thái",
  ],
});

/** So sánh 4 hình thức thường bị gọi lẫn lộn với nhau */
const SO_SANH = [
  {
    loai: "Farmstay",
    lang: "Nông trại đang canh tác thật",
    trongTam: "Bạn sống trong nhịp làm nông — có mùa vụ, có việc để làm",
    noiBat: true,
  },
  {
    loai: "Homestay",
    lang: "Nhà dân, thường trong làng bản",
    trongTam:
      "Bạn sống cùng gia đình chủ nhà — trọng tâm là nếp nhà, không nhất thiết có nông trại",
    noiBat: false,
  },
  {
    loai: "Resort sinh thái",
    lang: "Khu nghỉ dưỡng đặt giữa thiên nhiên",
    trongTam: "Bạn được phục vụ — cây xanh là khung cảnh, không phải sinh kế",
    noiBat: false,
  },
  {
    loai: "Nông trại giáo dục",
    lang: "Nông trại mở cửa đón đoàn theo buổi",
    trongTam: "Bạn tới học và chơi trong ngày, thường không ngủ lại",
    noiBat: false,
  },
];

/** Loại hình farmstay phân theo thứ nông trại đó thật sự canh tác */
const LOAI_HINH = [
  {
    ten: "Ruộng bậc thang",
    vung: "Tây Bắc, Đông Bắc",
    mota: "Lưu trú giữa những thửa ruộng khắc vào sườn núi. Việc của khách là lội ruộng, học cách người Mông người Dao dẫn nước từ đỉnh núi xuống từng bậc.",
  },
  {
    ten: "Đồi chè",
    vung: "Thái Nguyên, Mộc Châu, Bảo Lộc, Cầu Đất",
    mota: "Dậy sớm hái chè cùng người làm, rồi ngồi xem cả quy trình sao chè — héo, vò, sấy. Uống ngụm chè mình vừa hái là chuyện khác hẳn mua một hộp chè.",
  },
  {
    ten: "Vườn cà phê",
    vung: "Đắk Lắk, Gia Lai, Lâm Đồng",
    mota: "Mùa hoa nở trắng cả vườn khác hẳn mùa quả chín đỏ. Khách được hái, xát vỏ, phơi, rang — hiểu vì sao ly cà phê sáng có giá của nó.",
  },
  {
    ten: "Miệt vườn cây trái",
    vung: "Đồng bằng sông Cửu Long",
    mota: "Chèo xuồng trong mương vườn, tự hái trái ăn tại gốc, ăn cơm với cá vừa bắt dưới ao. Mùa nào trái nấy — không có chuyện quanh năm giống nhau.",
  },
  {
    ten: "Trang trại chăn nuôi",
    vung: "Mộc Châu, Ba Vì, Lâm Đồng",
    mota: "Vắt sữa lúc trời còn tối, cho bò cho dê ăn, làm sữa chua và phô mai tươi. Trẻ con thường mê loại này nhất.",
  },
  {
    ten: "Vườn rau — hoa",
    vung: "Đà Lạt, Lâm Đồng, ven đô lớn",
    mota: "Gieo, tưới, thu hoạch rồi nấu ngay bằng thứ mình vừa cắt. Loại này gần thành phố nên hợp với chuyến đi ngắn cuối tuần.",
  },
  {
    ten: "Vườn dược liệu",
    vung: "Tây Bắc, Tây Nguyên, Quảng Nam",
    mota: "Nhận mặt cây thuốc, học cách người bản địa dùng chúng, tắm lá thuốc. Đây là loại hình gắn chặt nhất với tri thức bản địa.",
  },
  {
    ten: "Ruộng muối — vùng nước lợ",
    vung: "Ninh Thuận, Bạc Liêu, ven biển miền Trung",
    mota: "Cào muối dưới nắng gắt, hoặc theo ghe ra đầm nuôi tôm. Nặng nhọc thật, nên khách đi về thường nhớ rất lâu.",
  },
];

/** Trung thực về việc farmstay không hợp với tất cả mọi người */
const HOP = [
  "Người muốn hiểu thức ăn của mình từ đâu ra, không chỉ muốn chụp ảnh đẹp",
  "Gia đình có trẻ nhỏ — trẻ con học từ đất, con vật và người làm nhanh hơn từ sách",
  "Người mệt vì thành phố và cần một nhịp sống chậm có việc để làm, không phải nằm không",
  "Người thích ăn thứ vừa hái, và không phiền khi bữa ăn phụ thuộc vào mùa",
];

const KHONG_HOP = [
  "Người cần tiện nghi khách sạn — nhiều farmstay không có điều hoà, thang máy hay phục vụ phòng",
  "Người ngại côn trùng, bùn đất, mùi chuồng trại — đây là nông trại thật, không phải mô hình trưng bày",
  "Người cần mạng mạnh và sóng ổn định để làm việc — vùng núi và vùng sâu thường yếu sóng",
  "Người muốn lịch trình dày đặc điểm tham quan — farmstay vốn là ở lại một chỗ và đi chậm",
];

const CHUAN_BI = [
  {
    ten: "Hỏi rõ mùa trước khi đặt",
    mota: "Cùng một farm, tháng này là đồi chè xanh mướt, tháng khác là đồi trọc vừa đốn. Hỏi thẳng chủ farm tháng bạn đi có gì để xem và để làm.",
  },
  {
    ten: "Quần áo bỏ đi được",
    mota: "Đồ dài tay chống nắng và chống xước, giày kín mũi bám tốt, một bộ chấp nhận lấm bùn. Đừng mang đồ đẹp để rồi tiếc không dám xuống ruộng.",
  },
  {
    ten: "Thuốc và chống côn trùng",
    mota: "Thuốc cá nhân, thuốc bôi côn trùng đốt, kem chống nắng. Trạm y tế ở vùng nông nghiệp thường xa và đóng cửa sớm.",
  },
  {
    ten: "Tiền mặt",
    mota: "Nhiều farm ở vùng sâu chưa dùng thẻ, và sóng yếu thì chuyển khoản cũng chậm. Mang đủ tiền mặt cho cả chuyến.",
  },
  {
    ten: "Tinh thần làm cùng, không đứng xem",
    mota: "Thứ đáng giá nhất của farmstay nằm ở lúc bạn xắn tay làm. Hỏi chủ farm hôm nay nhà có việc gì — họ thường vui khi có người muốn làm cùng.",
  },
];

const FAQS = [
  {
    q: "Farmstay và homestay khác nhau thế nào?",
    a: "Farmstay là lưu trú trong một nông trại đang canh tác thật — trọng tâm là mùa vụ và công việc nhà nông. Homestay là ở trong nhà dân, trọng tâm là nếp sống của gia đình chủ nhà và có thể hoàn toàn không có nông trại nào. Một farmstay có thể mang tính chất homestay nếu bạn ở chung nhà với chủ, nhưng một homestay giữa phố cổ thì không bao giờ là farmstay.",
  },
  {
    q: "Đi farmstay có phải làm việc đồng áng không?",
    a: "Không bắt buộc. Nhưng nếu chỉ nằm nghỉ thì bạn đang trả tiền cho một khu nghỉ dưỡng kém tiện nghi. Giá trị thật của farmstay nằm ở lúc bạn hái chè, vắt sữa, lội ruộng hay chèo xuồng ra vườn — đó là thứ resort không bán được.",
  },
  {
    q: "Farmstay có hợp với trẻ nhỏ không?",
    a: "Rất hợp, và thường là nhóm khách hưởng lợi nhiều nhất. Trẻ được chạm vào con vật, đất và cây thật. Nhưng cần hỏi trước về ao hồ, máy nông nghiệp và vật nuôi lớn — nông trại thật luôn có những chỗ nguy hiểm mà khu vui chơi không có.",
  },
  {
    q: "Nên đi farmstay vào mùa nào?",
    a: "Không có mùa đẹp chung cho cả nước — mỗi vùng có nhịp riêng. Ruộng bậc thang Tây Bắc đẹp nhất mùa nước đổ và mùa lúa chín; vườn cà phê Tây Nguyên có hai mùa hoàn toàn khác nhau là mùa hoa và mùa quả chín; miệt vườn miền Tây thì mùa nào trái nấy. Hãy chọn theo thứ bạn muốn thấy, đừng chọn theo lịch nghỉ.",
  },
  {
    q: "Farmstay có đắt không?",
    a: "Thường rẻ hơn resort cùng khu vực vì không gánh chi phí tiện nghi cao cấp. Nhưng đừng chọn chỉ vì rẻ — một farm làm tử tế có thể đắt hơn nhà nghỉ mà vẫn đáng, vì thứ bạn trả tiền là trải nghiệm và công người hướng dẫn, không phải cái giường.",
  },
  {
    q: "Làm sao biết một farmstay là thật, không phải nhà nghỉ gắn mác?",
    a: "Hỏi ba câu: farm này đang trồng hoặc nuôi gì, thu hoạch vào tháng mấy, và khách có được tham gia không. Nơi làm nông thật sẽ trả lời ngay và rất chi tiết. Nơi chỉ mượn chữ farmstay sẽ nói loanh quanh về tiện nghi và khung cảnh.",
  },
];

const schemas = [
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Farmstay là gì", url: "/farmstay-la-gi" },
  ]),
  faqSchema(FAQS.map((f) => ({ question: f.q, answer: f.a }))),
];

export default function FarmstayLaGiPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <style>{`
        .kt-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 640px) { .kt-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .kt-grid { grid-template-columns: repeat(4, 1fr); } }
        .kt-grid-2 { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 900px) { .kt-grid-2 { grid-template-columns: repeat(2, 1fr); } }
        .kt-sosanh { width: 100%; border-collapse: collapse; }
        .kt-sosanh th, .kt-sosanh td {
          text-align: left; padding: 14px 16px;
          border-bottom: 1px solid var(--border); vertical-align: top;
        }
        .kt-sosanh th { color: var(--gold); font-size: .78rem;
          letter-spacing: .1em; text-transform: uppercase; font-weight: 700; }
      `}</style>

      <main id="main" style={{ background: "var(--bg-deep)" }}>
        {/* ── Hero ── */}
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "72px 24px 80px",
            textAlign: "center",
          }}
        >
          <span className="section-kicker reveal">Trụ kiến thức</span>
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
            Farmstay <em style={{ color: "var(--gold)" }}>là gì?</em>
          </h1>
          <p className="lead" style={{ maxWidth: 660, margin: "0 auto" }}>
            Farmstay là hình thức lưu trú{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              ngay trong một nông trại đang canh tác thật
            </strong>{" "}
            — nơi bạn ngủ lại, ăn thứ vườn nhà làm ra, và được tham gia vào công
            việc theo mùa vụ của farm.
          </p>
        </section>

        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 24px" }}>
          <BreadcrumbNav
            items={[{ name: "Farmstay là gì", href: "/farmstay-la-gi" }]}
          />
        </div>

        {/* ── Điều làm nên một farmstay thật ── */}
        <section style={{ padding: "64px 24px" }}>
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
              Ba điều làm nên một farmstay thật
            </h2>
            <div className="prose" style={{ maxWidth: "none" }}>
              <p>
                Chữ &ldquo;farmstay&rdquo; đang bị dùng rộng tới mức gần như mất
                nghĩa — nhiều nhà nghỉ chỉ cần trồng vài luống rau trước sân đã
                tự gọi mình là farmstay. Để phân biệt, hãy soi đúng ba điều dưới
                đây.
              </p>
              <p>
                <strong>Một, nông trại phải đang sản xuất thật.&nbsp;</strong>Có
                mùa vụ, có thu hoạch, có sản phẩm bán ra — chứ không phải vài
                luống cây trồng cho đẹp ảnh. Nông trại thật thì tháng nào cũng
                khác nhau, và chủ farm luôn trả lời được câu &ldquo;tháng này
                nhà đang làm gì&rdquo;.
              </p>
              <p>
                <strong>Hai, khách được tham gia, không chỉ đứng nhìn.</strong>{" "}
                Được xuống ruộng, được hái, được vắt sữa, được vào bếp. Ranh
                giới giữa farmstay và resort nằm đúng ở chỗ này: một bên bạn
                làm, một bên bạn được phục vụ.
              </p>
              <p>
                <strong>Ba, người của vùng đất đó vẫn ở đó.&nbsp;</strong>Chủ
                farm và người làm là người bản địa hoặc người đã gắn bó với đất,
                không phải nhân viên thời vụ thuê theo ca. Đây là thứ quyết định
                câu chuyện bạn nghe được có thật hay không.
              </p>
            </div>
          </div>
        </section>

        {/* ── Bảng so sánh ── */}
        <section style={{ padding: "0 24px 64px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              Phân biệt với những hình thức hay bị gọi lẫn
            </h2>
            <div
              style={{
                overflowX: "auto",
                background: "var(--bg-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
              }}
            >
              <table className="kt-sosanh">
                <caption className="sr-only">
                  So sánh farmstay với homestay, resort sinh thái và nông trại
                  giáo dục
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Hình thức</th>
                    <th scope="col">Bạn ở đâu</th>
                    <th scope="col">Trọng tâm trải nghiệm</th>
                  </tr>
                </thead>
                <tbody>
                  {SO_SANH.map((r) => (
                    <tr
                      key={r.loai}
                      style={
                        r.noiBat ? { background: "var(--gold-dim)" } : undefined
                      }
                    >
                      <th
                        scope="row"
                        style={{
                          color: r.noiBat
                            ? "var(--gold)"
                            : "var(--text-primary)",
                          fontSize: "0.95rem",
                          textTransform: "none",
                          letterSpacing: 0,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {r.loai}
                      </th>
                      <td
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.92rem",
                        }}
                      >
                        {r.lang}
                      </td>
                      <td
                        style={{
                          color: "var(--text-muted)",
                          fontSize: "0.92rem",
                        }}
                      >
                        {r.trongTam}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Các loại hình farmstay ở Việt Nam ── */}
        <section
          style={{
            padding: "72px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <span className="section-kicker">Tám loại hình</span>
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
              Farmstay ở Việt Nam có những loại nào
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 640,
                marginBottom: 32,
                lineHeight: 1.8,
              }}
            >
              Cách chia đáng tin nhất là chia theo{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                thứ nông trại đó thật sự canh tác
              </strong>{" "}
              — vì chính nó quyết định bạn được làm gì và đi vào tháng nào.
            </p>

            <div className="kt-grid">
              {LOAI_HINH.map((l) => (
                <article
                  key={l.ten}
                  className="fx-tilt"
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "20px 20px 22px",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.02rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 6,
                    }}
                  >
                    {l.ten}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: 12,
                      fontWeight: 600,
                    }}
                  >
                    {l.vung}
                  </div>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {l.mota}
                  </p>
                </article>
              ))}
            </div>

            <div style={{ marginTop: 36, textAlign: "center" }}>
              <Link
                href="/tour-farmstay"
                style={{
                  display: "inline-block",
                  padding: "12px 28px",
                  borderRadius: 24,
                  border: "1px solid var(--gold-border)",
                  color: "var(--gold)",
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  transition: "var(--transition)",
                }}
              >
                Xem bản đồ vùng farmstay Việt Nam →
              </Link>
            </div>
          </div>
        </section>

        {/* ── Hợp / không hợp ── */}
        <section style={{ padding: "72px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
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
              Farmstay hợp với ai — và không hợp với ai
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                maxWidth: 640,
                marginBottom: 32,
                lineHeight: 1.8,
              }}
            >
              Phần dưới bên phải là thứ hiếm nơi nào chịu viết. Chúng tôi viết,
              vì một chuyến đi sai người còn tệ hơn là không đi.
            </p>

            <div className="kt-grid-2">
              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid oklch(0.7 0.18 115 / 0.3)",
                  borderRadius: "var(--radius)",
                  padding: "26px 24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--accent-ma)",
                    marginBottom: 16,
                  }}
                >
                  Rất hợp nếu bạn là
                </h3>
                <ul style={{ listStyle: "none", display: "grid", gap: 12 }}>
                  {HOP.map((t) => (
                    <li
                      key={t}
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.92rem",
                        lineHeight: 1.7,
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

              <div
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "26px 24px",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 16,
                  }}
                >
                  Nên cân nhắc kỹ nếu bạn
                </h3>
                <ul style={{ listStyle: "none", display: "grid", gap: 12 }}>
                  {KHONG_HOP.map((t) => (
                    <li
                      key={t}
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.92rem",
                        lineHeight: 1.7,
                        paddingLeft: 20,
                        position: "relative",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          position: "absolute",
                          left: 0,
                          color: "var(--text-dim)",
                        }}
                      >
                        —
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ── Chuẩn bị gì ── */}
        <section
          style={{
            padding: "72px 24px",
            background: "var(--bg-main)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <div style={{ maxWidth: 780, margin: "0 auto" }}>
            <span className="section-kicker">Trước khi đi</span>
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
              Cần chuẩn bị những gì
            </h2>
            <ol style={{ listStyle: "none", display: "grid", gap: 20 }}>
              {CHUAN_BI.map((c, i) => (
                <li
                  key={c.ten}
                  style={{ display: "flex", gap: 18, alignItems: "flex-start" }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.6rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      opacity: 0.5,
                      lineHeight: 1.2,
                      minWidth: 34,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 6,
                      }}
                    >
                      {c.ten}
                    </h3>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        fontSize: "0.92rem",
                        lineHeight: 1.75,
                      }}
                    >
                      {c.mota}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ padding: "72px 24px" }}>
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
                      fontSize: "0.98rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {f.q}
                  </summary>
                  <p
                    style={{
                      marginTop: 14,
                      color: "var(--text-muted)",
                      fontSize: "0.93rem",
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
          style={{ padding: "0 24px 88px" }}
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
              Bạn đang làm nông và muốn đón khách?
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.8,
                marginBottom: 26,
                fontSize: "0.95rem",
              }}
            >
              vnfarmstay.vn giới thiệu farmstay hoàn toàn miễn phí — không phí
              đăng, không hoa hồng. Chúng tôi kể câu chuyện của farm bạn, khách
              liên hệ thẳng với bạn.
            </p>
            <Link
              href="/chu-farmstay"
              className="fx-arrow-slide fx-ripple"
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
              Dành cho chủ farmstay
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
