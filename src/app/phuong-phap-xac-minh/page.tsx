/**
 * PHƯƠNG PHÁP XÁC MINH — trang trả lời câu "vì sao tin được dữ liệu của web này".
 *
 * ⚠️ Dựng 24/08/2026 (Trụ D, việc D1). Trước đó web khai có "quy trình xác minh 4
 * cấp" mà KHÔNG trang nào giải thích — nhãn cấp trên hồ sơ farm chỉ là chữ dán,
 * khách không có cách nào biết ta kiểm kỹ tới đâu. Đó đúng là thứ phân biệt một hạ
 * tầng dữ liệu với một danh bạ rác.
 *
 * ⛔ Trang này PHẢI nói cả mặt hạn chế của từng cấp. Trung thực về giới hạn LÀM TĂNG
 * độ tin, không giảm — và nó chặn việc khách hiểu nhãn rộng hơn thứ ta kiểm được
 * (Điều V hiến pháp). Bỏ cột "không bảo đảm" đi là biến trang này thành quảng cáo.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { graph, webPageSchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { nhanCapXacMinh } from "@/shared/utils/format";
import type { CapXacMinh } from "@/shared/types/farmstay";

export const metadata: Metadata = buildMetadata({
  title: "Chúng tôi xác minh farmstay như thế nào",
  description:
    "Bốn cấp xác minh của vnfarmstay.vn: mỗi cấp cần bằng chứng gì, và quan trọng hơn — mỗi cấp KHÔNG bảo đảm điều gì. Rà soát 6 tháng một lần.",
  canonical: "/phuong-phap-xac-minh",
  keywords: ["xác minh farmstay", "kiểm định farmstay", "farmstay uy tín"],
});

const pageSchema = graph([
  webPageSchema({
    path: "/phuong-phap-xac-minh",
    name: "Phương pháp xác minh farmstay — vnfarmstay.vn",
    description:
      "Bốn cấp xác minh, bằng chứng từng cấp, giới hạn từng cấp và chu kỳ rà soát.",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Phương pháp xác minh", url: "/phuong-phap-xac-minh" },
  ]),
]);

/** Bằng chứng và quyền lợi từng cấp. Nhãn + giới hạn lấy từ nguồn dùng chung với hồ sơ farm. */
const BANG_CHUNG: Record<CapXacMinh, { bangChung: string; quyenLoi: string }> =
  {
    1: {
      bangChung:
        "Chủ farm tự khai hồ sơ, kèm ảnh farm và giấy đăng ký kinh doanh. Chúng tôi gọi vào số điện thoại đã khai để xác nhận liên hệ là thật.",
      quyenLoi: "Có mặt trong danh bạ và trên bản đồ vùng.",
    },
    2: {
      bangChung:
        "Gọi video cùng chủ farm để nhìn cảnh quan tại chỗ, rồi đối chiếu với ảnh vệ tinh ở đúng toạ độ đã khai.",
      quyenLoi: "Hiển thị nổi bật hơn trong vùng của mình.",
    },
    3: {
      bangChung:
        "Đoàn khảo sát tới tận nơi: biên bản khảo sát, toạ độ đo tại chỗ, ảnh do đoàn tự chụp.",
      quyenLoi:
        "Được cấp huy hiệu nhúng lên web riêng, và được ưu tiên gợi ý trong các tuyến hành trình.",
    },
    4: {
      bangChung:
        "Có văn bản ghi nhận của chính quyền địa phương (UBND huyện/xã) hoặc chứng nhận OCOP.",
      quyenLoi: "Được đưa vào báo cáo ngành và các hoạt động xúc tiến.",
    },
  };

const CAC_CAP: CapXacMinh[] = [1, 2, 3, 4];

export default function PhuongPhapXacMinhPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={pageSchema} />
      <main
        id="main"
        style={{ background: "var(--bg-deep)", minHeight: "80vh" }}
      >
        <div
          style={{ maxWidth: 820, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          <BreadcrumbNav
            items={[
              { name: "Phương pháp xác minh", href: "/phuong-phap-xac-minh" },
            ]}
          />

          <span className="section-kicker reveal">
            Nói rõ cả chỗ chúng tôi chưa biết
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
            Chúng tôi xác minh farmstay như thế nào
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.02rem",
              lineHeight: 1.8,
              marginBottom: 16,
            }}
          >
            Mỗi hồ sơ farmstay trên trang này đeo một nhãn cấp xác minh. Nhãn ấy
            nói chúng tôi đã kiểm tới đâu —{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              và cũng nói thẳng chỗ chúng tôi chưa kiểm
            </strong>
            .
          </p>
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.8,
              marginBottom: 40,
            }}
          >
            Chúng tôi cố ý không dùng một huy hiệu &ldquo;đã xác minh&rdquo;
            chung chung. Một nhãn có/không buộc người đọc tin toàn bộ hoặc không
            tin gì cả, trong khi sự thật nằm ở giữa: có farm chúng tôi đã ngủ
            lại một đêm, có farm mới chỉ gọi điện được cho chủ. Hai thứ đó không
            thể đeo cùng một nhãn.
          </p>

          {CAC_CAP.map((cap) => {
            const nhan = nhanCapXacMinh(cap);
            const bc = BANG_CHUNG[cap];
            return (
              <section
                key={cap}
                aria-label={nhan.nhanDay}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "28px 26px",
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: 12,
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <span
                    style={{
                      padding: "4px 12px",
                      borderRadius: 4,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      background: "var(--gold)",
                      color: "var(--bg-deep)",
                      flexShrink: 0,
                    }}
                  >
                    {nhan.nhanNgan}
                  </span>
                  <h2
                    style={{
                      fontFamily: "var(--font-display),serif",
                      fontSize: "1.15rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      margin: 0,
                    }}
                  >
                    {nhan.nhanDay}
                  </h2>
                </div>

                <dl style={{ margin: 0 }}>
                  <dt
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.09em",
                      color: "var(--text-dim)",
                      marginBottom: 4,
                    }}
                  >
                    BẰNG CHỨNG CHÚNG TÔI CẦN CÓ
                  </dt>
                  <dd
                    style={{
                      margin: "0 0 16px",
                      color: "var(--text-muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {bc.bangChung}
                  </dd>

                  {/* ⛔ Khối này là lý do trang tồn tại — CẤM gỡ để trang "gọn hơn" */}
                  <dt
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.09em",
                      color: "var(--gold)",
                      marginBottom: 4,
                    }}
                  >
                    CẤP NÀY KHÔNG BẢO ĐẢM ĐIỀU GÌ
                  </dt>
                  <dd
                    style={{
                      margin: "0 0 16px",
                      color: "var(--text-muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                      paddingLeft: 14,
                      borderLeft: "2px solid var(--gold-border)",
                    }}
                  >
                    {nhan.khongBaoDam}
                  </dd>

                  <dt
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.09em",
                      color: "var(--text-dim)",
                      marginBottom: 4,
                    }}
                  >
                    FARM ĐƯỢC GÌ Ở CẤP NÀY
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      color: "var(--text-muted)",
                      fontSize: "0.95rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {bc.quyenLoi}
                  </dd>
                </dl>
              </section>
            );
          })}

          <section
            aria-label="Rà soát và sửa sai"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius)",
              padding: "28px 26px",
              marginTop: 32,
            }}
          >
            <h2
              className="section-heading"
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Rà soát lại, và sửa khi sai
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: 14,
              }}
            >
              <strong style={{ color: "var(--text-primary)" }}>
                Sáu tháng một lần
              </strong>{" "}
              chúng tôi liên hệ lại từng farm để xác nhận thông tin còn đúng.
              Nhắc ba lần không nhận được phản hồi thì{" "}
              <strong style={{ color: "var(--text-primary)" }}>hạ nhãn</strong>{" "}
              — chúng tôi không giữ một nhãn cũ cho hồ sơ đẹp hơn.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: 14,
              }}
            >
              Mỗi hồ sơ đều ghi ngày lấy dữ kiện và ngày rà soát gần nhất, ngay
              trên trang. Bạn nhìn được hồ sơ ấy cũ bao lâu rồi mà không cần
              hỏi.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
              }}
            >
              Thấy chỗ nào sai, xin bấm nút{" "}
              <strong style={{ color: "var(--text-primary)" }}>
                &ldquo;Thấy thông tin sai?&rdquo;
              </strong>{" "}
              trên chính hồ sơ đó. Báo về tới người trực, không rơi vào hộp thư
              không ai đọc. Sai thì chúng tôi sửa, hoặc hạ cấp xác minh xuống
              cho đúng bằng chứng đang có.
            </p>
          </section>

          <section aria-label="Ai duyệt" style={{ marginTop: 32 }}>
            <h2
              className="section-heading"
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Ai duyệt, và theo tiêu chí nào
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.8,
                marginBottom: 14,
              }}
            >
              Giai đoạn này, Ban Điều phối Cộng đồng duyệt hồ sơ theo đúng bảng
              bằng chứng ở trên — cấp nào cũng phải có bằng chứng của cấp đó,
              không có ngoại lệ vì quen biết hay vì farm nổi tiếng.
            </p>
            {/* Trung thực về thứ CHƯA có — Điều II. Master Prompt khai có Hội đồng
                Tiêu chuẩn Độc lập; hiện nó mới nằm trên giấy, nên nói thẳng. */}
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.95rem",
                lineHeight: 1.8,
              }}
            >
              Về lâu dài, một Hội đồng Tiêu chuẩn Độc lập sẽ giữ vai trò này.{" "}
              <strong style={{ color: "var(--text-muted)" }}>
                Hội đồng đó chưa được lập
              </strong>{" "}
              — chúng tôi nói ra thay vì để bạn tưởng đã có.
            </p>
          </section>

          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "1rem",
              lineHeight: 1.7,
              marginTop: 36,
              textAlign: "center",
            }}
          >
            Bạn là chủ farm và muốn có hồ sơ ở đây?{" "}
            <Link
              href="/dang-farmstay"
              style={{
                /* ≥44px — lời kêu gọi hành động cuối đoạn, khách sẽ nhắm tay vào */
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                color: "var(--gold)",
              }}
            >
              Gửi hồ sơ farm của bạn
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
