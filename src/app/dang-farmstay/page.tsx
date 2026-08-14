/**
 * Trang mời chủ farmstay giới thiệu farm của mình.
 *
 * ⚠️ 08/08/2026 — Ông ra lệnh GỠ HẲN form đăng ký cũ. Lý do: `onSubmit` của nó chỉ
 * `await setTimeout(1200)` rồi hiện màn hình "Đăng ký thành công" — không gửi email,
 * không gọi API, không lưu đâu cả. Chủ farmstay điền thật, thấy báo thành công, dữ
 * liệu bốc hơi. Đó là hứa suông với người thật, nặng hơn lỗi SEO.
 *
 * Cùng đợt đã gỡ: "50.000+ du khách/tháng" · huy hiệu "Đã xác minh" + "tăng tỷ lệ đặt
 * phòng lên 3×" · "mạng lưới 500+ chủ farmstay" · lời chứng thực tự chế của
 * "Chị Nguyễn Hương" (khối đó còn được chú thích nhầm là "quote từ chủ farmstay thật").
 *
 * CẤM dựng lại form ở đây cho tới khi có đường nhận THẬT (API/email/CRM) đã chạy được
 * và Ông xác nhận. Không có đường nhận thì mời liên hệ thẳng — thà ít bước mà tới nơi.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";

/**
 * ⚠️ CHƯA CÓ KÊNH NHẬN THẬT. Ông xác nhận 08/08/2026: hòm thư hello@vnfarmstay.vn,
 * hotline 1800 6868 và Zalo "vnfarmstay.vn Official" — cả ba đều KHÔNG tồn tại.
 * Nên trang này nói thẳng là chưa nhận thư được, thay vì đưa ra một địa chỉ chết.
 * Khi Ông cấp kênh thật: khai vào đây rồi mở lại nút gửi ở khối cuối trang.
 */
export const metadata: Metadata = buildMetadata({
  title: "Giới thiệu farmstay của bạn lên vnfarmstay.vn",
  description:
    "Gửi cho chúng tôi vài dòng về farm của bạn — miễn phí, không hoa hồng. Chúng tôi viết lại thành câu chuyện và dẫn khách về thẳng chỗ bạn.",
  canonical: "/dang-farmstay",
  keywords: ["giới thiệu farmstay", "chủ farmstay", "quảng bá farmstay"],
});

/** Những thứ cần có trong thư — để chủ farmstay gửi một lần là đủ. */
const CAN_GUI = [
  "Tên farm và địa chỉ (xã/huyện/tỉnh)",
  "Farm bạn làm nông gì — trồng, nuôi, theo mùa nào",
  "Khách tới được làm gì, ăn gì, ngủ ở đâu",
  "Vài tấm ảnh thật của farm (không cần ảnh chuyên nghiệp)",
  "Cách khách liên hệ với bạn: website, Zalo hoặc số điện thoại",
];

export default function DangFarmstayPage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        style={{ background: "var(--bg-deep)", minHeight: "80vh" }}
      >
        <div
          style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          <BreadcrumbNav
            items={[
              { name: "Dành cho chủ farmstay", href: "/chu-farmstay" },
              { name: "Giới thiệu farmstay", href: "/dang-farmstay" },
            ]}
          />

          <span className="section-kicker reveal">
            Miễn phí, không hoa hồng
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
            Kể cho chúng tôi nghe về farm của bạn
          </h1>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1.02rem",
              lineHeight: 1.75,
              marginBottom: 16,
            }}
          >
            Chúng tôi giới thiệu farmstay Việt Nam và dẫn khách về thẳng chỗ chủ
            farm. Miễn phí, không hoa hồng, không ràng buộc.
          </p>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.75,
              marginBottom: 36,
            }}
          >
            vnfarmstay.vn <strong>không nhận đặt phòng</strong> và{" "}
            <strong>không giữ tiền của ai</strong>. Việc của chúng tôi là kể câu
            chuyện của farm bạn cho đúng, rồi đứng sang một bên.
          </p>

          <section
            aria-label="Cần gửi những gì"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "32px 28px",
              marginBottom: 32,
            }}
          >
            <h2
              className="section-heading"
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                marginBottom: 20,
                color: "var(--text-primary)",
              }}
            >
              Gửi cho chúng tôi mấy thứ này
            </h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {CAN_GUI.map((item) => (
                <li
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    color: "var(--text-muted)",
                    fontSize: "0.95rem",
                    lineHeight: 1.6,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{ color: "var(--gold)", flexShrink: 0 }}
                  >
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-label="Cách gửi cho chúng tôi"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius)",
              padding: "32px 28px",
            }}
          >
            <h2
              className="section-heading"
              style={{
                fontSize: "1.15rem",
                fontWeight: 700,
                marginBottom: 12,
                color: "var(--text-primary)",
              }}
            >
              Gửi cho chúng tôi bằng cách nào?
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.75,
              }}
            >
              Nói thật với bạn: <strong>kênh nhận của chúng tôi chưa mở</strong>
              . vnfarmstay.vn còn đang dựng, chưa có hòm thư hay số điện thoại
              nào trực được — nên chúng tôi không đặt sẵn một địa chỉ ở đây để
              rồi bạn gửi vào chỗ không ai đọc.
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.75,
                marginTop: 16,
              }}
            >
              Ngay khi kênh liên hệ mở, địa chỉ sẽ được đăng tại đây và ở trang{" "}
              <Link
                href="/ve-chung-toi#lien-he"
                style={{ color: "var(--gold)" }}
              >
                Về chúng tôi
              </Link>
              . Bạn cứ chuẩn bị sẵn mấy thứ ở trên, lúc đó gửi một lần là xong.
            </p>
          </section>

          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "1rem",
              lineHeight: 1.7,
              marginTop: 32,
              textAlign: "center",
            }}
          >
            Chưa rõ chúng tôi làm gì cho farm của bạn?{" "}
            <Link href="/chu-farmstay" style={{ color: "var(--gold)" }}>
              Xem trang dành cho chủ farmstay
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
