import Link from "next/link";
import { SITE_NAME, SITE_TAGLINE, ECOSYSTEM } from "@/lib/site";

const footerLinks = {
  "Khám phá": [
    { href: "/", label: "Trang chủ farmstay" },
    { href: "/tour-farmstay", label: "Bản đồ vùng farmstay" },
    { href: "/farmstay-la-gi", label: "Farmstay là gì?" },
    { href: "/blog", label: "Câu chuyện & Blog" },
    { href: "/cong-dong", label: "Cộng đồng" },
  ],
  "Chủ farmstay": [
    { href: "/chu-farmstay", label: "Dành cho chủ farmstay" },
    { href: "/dang-farmstay", label: "Giới thiệu farmstay" },
  ],
  "Về chúng tôi": [
    { href: "/ve-chung-toi", label: `Về ${SITE_NAME}` },
    { href: "/ve-chung-toi#su-menh", label: "Sứ mệnh" },
    { href: "/chinh-sach-bien-tap", label: "Chính sách biên tập" },
    { href: "/lien-he", label: "Liên hệ" },
  ],
  // Đây là các thương hiệu KHÁC trong hệ sinh thái, không phải cùng một thực thể —
  // nên chỉ liên kết hiển thị cho người đọc, không khai `sameAs` trong schema.
  "Hệ sinh thái": ECOSYSTEM.map((e) => ({ href: e.url, label: e.label })),
};

/**
 * Biểu tượng mạng xã hội.
 *
 * ⚠️ 19/08/2026 — KHÔNG được render khi chưa có tài khoản THẬT. Trước ngày này,
 * bốn biểu tượng dưới đây trỏ vào `href="#"`: người dùng bấm thì trang nhảy về đầu,
 * và máy tìm kiếm đọc được bốn liên kết chết trên MỌI trang của site.
 *
 * Cách bật lại: Ông xác nhận URL thật → điền vào `SITE_SAME_AS` trong `src/lib/site.ts`
 * (nơi ấy đồng thời cấp `sameAs` cho schema Organization) rồi render danh sách đó ở đây.
 * CẤM điền trang của thương hiệu khác — 08/08/2026 đã một lần khai nhầm
 * facebook.com/farmstayvn và instagram.com/farmstayvn.
 */
/* (Danh sách biểu tượng đã gỡ hẳn — xem ghi chú ngay trên.) */

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: "var(--bg-main)",
        borderTop: "3px solid var(--gold-border)",
      }}
      className="mt-16"
    >
      {/* Dải CTA — Bạn có farmstay? */}
      <div
        style={{
          background: "var(--bg-card)",
          borderBottom: "1px solid var(--border)",
          padding: "28px 24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "1rem",
            color: "var(--text-muted)",
            marginBottom: 12,
          }}
        >
          Bạn có farmstay muốn chia sẻ với cộng&nbsp;đồng?
        </p>
        <Link
          href="/dang-farmstay"
          style={{
            display: "inline-block",
            padding: "9px 24px",
            borderRadius: 20,
            border: "1px solid var(--gold-border)",
            color: "var(--gold)",
            fontSize: "0.8rem",
            fontWeight: 600,
            transition: "var(--transition)",
          }}
        >
          Giới thiệu farmstay →
        </Link>
      </div>

      <div className="px-6 pt-12 pb-6">
        <div className="mx-auto mb-10 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--gold)",
              }}
            >
              vnfarmstay
              <span
                style={{ color: "var(--text-primary)", fontStyle: "italic" }}
              >
                .vn
              </span>
            </div>
            <p
              className="mt-3 text-sm"
              style={{ color: "var(--text-dim)", lineHeight: 1.7 }}
            >
              {SITE_TAGLINE}. Nơi du khách khám phá điểm đến nông nghiệp đích
              thực, còn các farmstay được chuẩn hoá hồ sơ, kể câu chuyện vùng
              đất và kết nối theo tuyến hành trình. Không phải sàn đặt phòng —
              khách liên hệ trực tiếp với farmstay.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              {/* h2 chứ không phải h4 (sửa 19/08/2026): đo trên trình duyệt thật
                  thấy thứ bậc tiêu đề nhảy h2 → h4 ở mọi trang, vì thân trang dừng
                  ở h2 rồi chân trang nhảy thẳng xuống h4. Trình đọc màn hình dùng
                  thứ bậc này để dựng mục lục trang — nhảy cấp là mất một tầng. */}
              <h2
                className="mb-4 text-sm font-semibold"
                style={{ color: "var(--text-primary)" }}
              >
                {title}
              </h2>
              <ul className="space-y-2">
                {links.map((link) => {
                  const isExternal = link.href.startsWith("http");
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm"
                        style={{
                          color: "var(--text-dim)",
                          transition: "var(--transition)",
                        }}
                        {...(isExternal
                          ? {
                              target: "_blank",
                              rel: "noopener noreferrer",
                            }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 pt-6 text-xs md:flex-row"
          style={{
            borderTop: "1px solid var(--border)",
            color: "var(--text-dim)",
          }}
        >
          <p>© 2026 vnfarmstay.vn. Nền tảng du lịch nông nghiệp Việt Nam.</p>
          <div className="flex gap-4">
            <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
            <Link href="/dieu-khoan">Điều khoản sử dụng</Link>
            <Link href="/sitemap.xml">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
