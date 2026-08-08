import Link from "next/link";

const footerLinks = {
  "Khám phá": [
    { href: "/", label: "Trang chủ farmstay" },
    { href: "/blog", label: "Câu chuyện & Blog" },
    { href: "/cong-dong", label: "Cộng đồng" },
  ],
  "Chủ farmstay": [
    { href: "/chu-farmstay", label: "Dành cho chủ farmstay" },
    { href: "/dang-farmstay", label: "Giới thiệu farmstay" },
  ],
  "Về chúng tôi": [
    { href: "/ve-chung-toi", label: "Về vnfarmstay.vn" },
    { href: "/ve-chung-toi#su-menh", label: "Sứ mệnh" },
    { href: "/ve-chung-toi#lien-he", label: "Liên hệ" },
  ],
  "Hệ sinh thái": [
    { href: "https://nhahoachdinh.vn", label: "Nhà Hoạch Định" },
    { href: "https://mastery.vn", label: "Mastery.vn" },
  ],
};

/* SVG icons cho mạng xã hội */
const SocialFacebook = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const SocialInstagram = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const SocialYouTube = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.95C18.88 4 12 4 12 4s-6.88 0-8.59.47a2.78 2.78 0 00-1.95 1.95A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z" />
    <polygon
      points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02"
      fill="var(--bg-deep)"
    />
  </svg>
);

const SocialTikTok = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.32 6.32 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.77 1.52V6.74a4.85 4.85 0 01-1-.05z" />
  </svg>
);

const socialLinks = [
  { icon: SocialFacebook, label: "Facebook" },
  { icon: SocialInstagram, label: "Instagram" },
  { icon: SocialYouTube, label: "YouTube" },
  { icon: SocialTikTok, label: "TikTok" },
];

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
            fontSize: "0.88rem",
            color: "var(--text-muted)",
            marginBottom: 12,
          }}
        >
          Bạn có farmstay muốn chia sẻ với cộng đồng?
        </p>
        <Link
          href="/dang-farmstay"
          style={{
            display: "inline-block",
            padding: "9px 24px",
            borderRadius: 20,
            border: "1px solid var(--gold-border)",
            color: "var(--gold)",
            fontSize: "0.82rem",
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
              Farmstay
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
              Nền tảng kết nối du khách với farmstay xác minh khắp Việt Nam.
              Trải nghiệm nông nghiệp đích thực, văn hoá bản địa chưa bị thương
              mại hoá.
            </p>
            <div className="mt-4 flex gap-2">
              {socialLinks.map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
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
                    transition: "var(--transition)",
                  }}
                >
                  <Icon />
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
