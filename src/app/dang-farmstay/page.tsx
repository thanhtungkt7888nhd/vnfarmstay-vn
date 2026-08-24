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
 * ✅ 24/08/2026 (Trụ B) — đã dựng lại biểu mẫu, lần này có đường nhận thật:
 * `/api/dang-farmstay` → `src/lib/nhan-ho-so.ts` → bảng tính + chuông Telegram.
 * Máy chủ chỉ trả `ok: true` khi bảng tính XÁC NHẬN đã nhận, và biểu mẫu chỉ hiện
 * màn hình cảm ơn khi nhận được `ok: true`. Không còn khoảng trống nào để "báo
 * thành công mà không lưu" chui vào.
 *
 * ⚠️ Biểu mẫu CHỈ HIỆN khi biến `VNFARMSTAY_SHEET_URL` đã khai — chưa khai thì trang
 * tự quay về nói thẳng "kênh nhận chưa mở". Trạng thái đọc lúc DỰNG, nên khai biến
 * xong phải dựng lại web (deploy) thì biểu mẫu mới xuất hiện.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { BieuMauHoSo } from "./BieuMauHoSo";
import { TRAI_NGHIEM } from "@/features/kham-pha/data";
import { VUNG } from "@/features/vung/data";
import { daMoKenhNhan } from "@/lib/nhan-ho-so";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { graph, webPageSchema, breadcrumbSchema } from "@/lib/schema";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";

/**
 * ⚠️ Ghi lại để không ai khôi phục nhầm: hòm thư hello@vnfarmstay.vn, hotline
 * 1800 6868 và Zalo "vnfarmstay.vn Official" từng in trên trang này đều KHÔNG
 * tồn tại (Ông xác nhận 08/08/2026). Cửa nhận hồ sơ nay đi qua biểu mẫu bên
 * dưới, không qua ba địa chỉ chết ấy.
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

/* Dữ liệu có cấu trúc — thêm 19/08/2026 sau khi `scripts/kiem-seo.mjs` phát hiện
   trang này không phát khối JSON-LD nào, nên máy tìm kiếm không nối được nó vào
   thực thể vnfarmstay.vn. */
const pageSchema = graph([
  webPageSchema({
    path: "/dang-farmstay",
    name: "Giới thiệu farmstay của bạn — vnfarmstay.vn",
    description:
      "Gửi thông tin farmstay của bạn để được chúng ta tới tận nơi và viết hồ sơ.",
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Giới thiệu farmstay", url: "/dang-farmstay" },
  ]),
]);

export default function DangFarmstayPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={pageSchema} />
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
            /* `khoi-bieu-mau` để nới lề ở khổ hẹp — xem khối <style> cuối tệp.
               Đo 24/08/2026: lề khối cha 24px chồng lề khối này 28px ⇒ trên máy
               375px biểu mẫu 20 ô chỉ còn 269px, nhãn và dòng gợi ý bị bóp. */
            className="khoi-bieu-mau"
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
              Gửi hồ sơ farm của bạn
            </h2>

            {/* ⛔ CỐ Ý rẽ hai nhánh theo trạng thái THẬT của kênh nhận.
                Biểu mẫu chỉ xuất hiện khi bảng tính đã đấu dây; chưa đấu thì trang
                nói thẳng là chưa nhận được, thay vì mời người ta điền vào hư không.
                Đây chính là lỗi đã khiến biểu mẫu cũ bị gỡ 08/08/2026 — không lặp lại.
                Khai `VNFARMSTAY_SHEET_URL` là biểu mẫu tự hiện, không phải sửa mã. */}
            {daMoKenhNhan() ? (
              <>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    marginBottom: 28,
                  }}
                >
                  Điền một lần là xong. Phần bắt buộc chỉ gồm những thứ không có
                  thì chúng tôi không dựng nổi hồ sơ cho bạn — còn lại cứ bỏ
                  trống, chúng tôi sẽ gọi hỏi.
                </p>
                <BieuMauHoSo
                  vung={VUNG.map((v) => ({ slug: v.slug, ten: v.ten }))}
                  traiNghiem={TRAI_NGHIEM.map((t) => ({
                    slug: t.slug,
                    ten: t.ten,
                  }))}
                />
              </>
            ) : (
              <>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                  }}
                >
                  Nói thật với bạn:{" "}
                  <strong>kênh nhận của chúng tôi chưa mở</strong>. Biểu mẫu đã
                  dựng xong và chờ sẵn, nhưng chỗ lưu hồ sơ thì chưa đấu dây —
                  nên chúng tôi không mời bạn điền để rồi hồ sơ rơi vào chỗ
                  không ai đọc.
                </p>
                <p
                  style={{
                    color: "var(--text-muted)",
                    fontSize: "1rem",
                    lineHeight: 1.75,
                    marginTop: 16,
                  }}
                >
                  Ngay khi kênh nhận mở, biểu mẫu sẽ hiện ngay tại đây. Bạn cứ
                  chuẩn bị sẵn mấy thứ ở trên, lúc đó gửi một lần là xong. Cần
                  liên hệ sớm hơn thì xem trang{" "}
                  <Link href="/lien-he" style={{ color: "var(--gold)" }}>
                    Liên hệ
                  </Link>
                  .
                </p>
              </>
            )}
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

      <style>{`
        @media (max-width: 480px) {
          .khoi-bieu-mau { padding: 24px 16px !important; }
        }
      `}</style>
      <Footer />
    </>
  );
}
