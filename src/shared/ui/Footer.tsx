import Link from "next/link";

const footerLinks = {
  "Khám phá": [
    { href: "/tim-kiem", label: "Tất cả farmstay" },
    { href: "/tim-kiem?region=mien-bac", label: "Miền Bắc" },
    { href: "/tim-kiem?region=mien-trung", label: "Miền Trung" },
    { href: "/tim-kiem?region=mien-nam", label: "Miền Nam" },
    { href: "/cong-dong", label: "Cộng đồng" },
  ],
  "Blog & Kiến thức": [
    { href: "/blog", label: "Tất cả bài viết" },
    { href: "/danh-muc/phap-ly", label: "Pháp lý farmstay" },
    { href: "/danh-muc/van-hanh", label: "Vận hành" },
    { href: "/danh-muc/review", label: "Review farmstay" },
    { href: "/ve-tac-gia", label: "Về tác giả" },
  ],
  "Chủ farmstay": [
    { href: "/dang-farmstay", label: "Đăng farmstay" },
    { href: "/phap-ly", label: "Thư viện pháp lý" },
    { href: "/phap-ly#huong-dan", label: "Hướng dẫn" },
    { href: "/cong-dong#forum", label: "Diễn đàn" },
    { href: "/ve-chung-toi#lien-he", label: "Liên hệ" },
  ],
  "Farmstay.vn": [
    { href: "/ve-chung-toi", label: "Về chúng tôi" },
    { href: "/ve-chung-toi#su-menh", label: "Sứ mệnh" },
    { href: "/ve-tac-gia", label: "Tác giả & Chuyên gia" },
    { href: "/ve-chung-toi#bao-chi", label: "Báo chí" },
    { href: "/ve-chung-toi#lien-he", label: "Liên hệ" },
  ],
  "Hệ sinh thái": [
    { href: "https://nhahoachdinh.vn", label: "Nhà Hoạch Định" },
    { href: "https://mastery.vn", label: "Mastery.vn" },
  ],
};

export function Footer() {
  return (
    <footer
      role="contentinfo"
      style={{
        background: "var(--bg-main)",
        borderTop: "1px solid var(--border)",
      }}
      className="mt-16 px-6 pt-12 pb-6"
    >
      <div className="mx-auto mb-10 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-6">
        {/* Brand */}
        <div>
          <div
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "1.35rem",
              fontWeight: 700,
              color: "var(--gold)",
            }}
          >
            Farmstay
            <span style={{ color: "var(--text-primary)", fontStyle: "italic" }}>
              .vn
            </span>
          </div>
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--text-dim)", lineHeight: 1.7 }}
          >
            Nền tảng kết nối du khách với farmstay xác minh khắp Việt Nam. Trải
            nghiệm nông nghiệp đích thực, văn hoá bản địa chưa bị thương mại
            hoá.
          </p>
          <div className="mt-4 flex gap-2">
            {["f", "📸", "▶", "♪"].map((icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={["Facebook", "Instagram", "YouTube", "TikTok"][i]}
                style={{
                  width: 36,
                  height: 36,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  background: "rgba(168,197,176,0.08)",
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontSize: "0.85rem",
                  transition: "var(--transition)",
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        {/* Link columns */}
        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4
              className="mb-4 text-sm font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              {title}
            </h4>
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
        <p>© 2026 Farmstay.vn. Nền tảng du lịch nông nghiệp Việt Nam.</p>
        <div className="flex gap-4">
          <Link href="/chinh-sach-bao-mat">Chính sách bảo mật</Link>
          <Link href="/dieu-khoan">Điều khoản sử dụng</Link>
          <Link href="/sitemap.xml">Sitemap</Link>
        </div>
      </div>
    </footer>
  );
}
