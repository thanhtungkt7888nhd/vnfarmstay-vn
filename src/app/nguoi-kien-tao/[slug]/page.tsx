/**
 * HỒ SƠ MỘT NGƯỜI KIẾN TẠO — và cửa dẫn sang web riêng của họ.
 *
 * Cấu trúc trang cố ý tách bạch HAI GIỌNG, không trộn:
 *   · "Họ tự giới thiệu"      → nguyên văn lời họ, đọc từ web của họ
 *   · "Vì sao chúng tôi dẫn"  → lời của vnfarmstay, nói rõ lý do nối
 * Trộn hai giọng lại là mượn uy tín của họ để nói lời của mình — Điều IV cấm.
 *
 * ⚠️ Schema: khai `Person` với `url` trỏ web riêng của họ. KHÔNG khai `sameAs` —
 * điều cấm số 7: `sameAs` chỉ dùng cho kênh định danh của CÙNG một thực thể, mà ta
 * không xác minh được các kênh khác của họ.
 */
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";
import {
  NGUOI_KIEN_TAO,
  timNguoiKienTao,
} from "@/features/nguoi-kien-tao/data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return NGUOI_KIEN_TAO.map((n) => ({ slug: n.slug }));
}

/** Chỉ phục vụ mã có thật — mã bịa trả 404 THẬT, không phải 200 kèm trang trống */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const n = timNguoiKienTao(slug);
  if (!n) return { title: "Không tìm thấy hồ sơ" };
  return buildMetadata({
    title: `${n.ten} — ${n.chucDanhNgan}`,
    description: n.tuKhai,
    canonical: `/nguoi-kien-tao/${n.slug}`,
    keywords: n.linhVuc.slice(0, 6),
  });
}

export default async function HoSoNguoiKienTao({ params }: Props) {
  const { slug } = await params;
  const n = timNguoiKienTao(slug);
  if (!n) notFound();

  const url = `${SITE_URL}/nguoi-kien-tao/${n.slug}`;
  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      /* Mã định danh là WEB RIÊNG của họ — thực thể ấy thuộc về họ, không thuộc ta */
      "@id": `${n.web}#person`,
      name: n.ten,
      jobTitle: n.chucDanh,
      description: n.tuKhai,
      url: n.web,
      knowsAbout: n.linhVuc,
      ...(n.toChuc
        ? { worksFor: { "@type": "Organization", name: n.toChuc } }
        : {}),
      ...(n.diaBan
        ? {
            address: {
              "@type": "PostalAddress",
              addressLocality: n.diaBan,
              addressCountry: "VN",
            },
          }
        : {}),
      subjectOf: { "@type": "WebPage", "@id": `${url}#webpage`, url },
    },
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Người kiến tạo", url: "/nguoi-kien-tao" },
      { name: n.ten, url: `/nguoi-kien-tao/${n.slug}` },
    ]),
  ];

  const kieuH2: React.CSSProperties = {
    fontFamily: "var(--font-display),serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 12,
  };
  const kieuKhoi: React.CSSProperties = {
    paddingTop: 28,
    paddingBottom: 28,
    borderTop: "1px solid var(--border)",
  };

  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main
        id="main"
        data-su-kien-tai="route_view"
        style={{ background: "var(--bg-deep)", minHeight: "80vh" }}
      >
        <div
          style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          <BreadcrumbNav
            items={[
              { name: "Người kiến tạo", href: "/nguoi-kien-tao" },
              { name: n.ten, href: `/nguoi-kien-tao/${n.slug}` },
            ]}
          />

          <div
            style={{
              display: "flex",
              gap: 20,
              alignItems: "center",
              margin: "24px 0 20px",
              flexWrap: "wrap",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 64,
                height: 64,
                flexShrink: 0,
                borderRadius: "50%",
                background: "var(--gold-dim)",
                border: "1px solid var(--gold-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-display), serif",
                fontSize: "1.7rem",
                fontWeight: 700,
                color: "var(--gold)",
              }}
            >
              {n.ten.trim().split(" ").at(-1)?.charAt(0).toUpperCase()}
            </span>
            <div style={{ minWidth: 0 }}>
              <h1
                className="shine reveal"
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "clamp(1.6rem, 3.6vw, 2.3rem)",
                  fontWeight: 700,
                  lineHeight: 1.2,
                  margin: "0 0 6px",
                }}
              >
                {n.ten}
              </h1>
              <p
                style={{
                  fontSize: "0.92rem",
                  fontWeight: 600,
                  color: "var(--gold)",
                  margin: 0,
                }}
              >
                {n.chucDanh}
              </p>
            </div>
          </div>

          {/* ── Giọng 1: LỜI CỦA HỌ, nguyên văn ── */}
          <section style={{ ...kieuKhoi, borderTop: "none", paddingTop: 12 }}>
            <h2 style={kieuH2}>Họ tự giới thiệu</h2>
            <blockquote
              style={{
                margin: 0,
                paddingLeft: 18,
                borderLeft: "3px solid var(--gold-border)",
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.85,
              }}
            >
              {n.tuKhai}
            </blockquote>
            <p
              style={{
                marginTop: 10,
                fontSize: "0.8rem",
                color: "var(--text-dim)",
                fontStyle: "italic",
              }}
            >
              Nguyên văn từ {new URL(n.web).hostname}, đọc ngày {n.ngayDo}.
            </p>
          </section>

          {/* ── Giọng 2: LỜI CỦA TA ── */}
          <section style={kieuKhoi}>
            <h2 style={kieuH2}>Vì sao chúng tôi dẫn bạn sang</h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.85,
                margin: 0,
              }}
            >
              {n.vaiTroVoiNganh}
            </p>
          </section>

          <section style={kieuKhoi}>
            <h2 style={kieuH2}>Lĩnh vực</h2>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {n.linhVuc.map((l) => (
                <li
                  key={l}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 20,
                    background: "var(--gold-dim)",
                    border: "1px solid var(--gold-border)",
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                  }}
                >
                  {l}
                </li>
              ))}
            </ul>
            {(n.toChuc || n.diaBan) && (
              <p
                style={{
                  marginTop: 16,
                  fontSize: "0.92rem",
                  color: "var(--text-dim)",
                  lineHeight: 1.7,
                }}
              >
                {n.toChuc && (
                  <>
                    Đang làm việc tại{" "}
                    <strong style={{ color: "var(--text-muted)" }}>
                      {n.toChuc}
                    </strong>
                  </>
                )}
                {n.toChuc && n.diaBan ? " · " : ""}
                {n.diaBan && <>Địa bàn {n.diaBan}</>}
              </p>
            )}
          </section>

          {/* ── Cửa dẫn sang web riêng — mục tiêu của cả trang ── */}
          <section style={{ ...kieuKhoi, paddingBottom: 0 }}>
            <h2 style={kieuH2}>Sang thẳng chỗ họ</h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.92rem",
                lineHeight: 1.7,
                marginBottom: 16,
              }}
            >
              vnfarmstay không đứng giữa bạn và họ. Bấm nút là sang web riêng
              của họ, nơi có đầy đủ cách liên hệ.
            </p>
            <a
              href={n.web}
              target="_blank"
              rel="noopener noreferrer"
              data-su-kien="related_destination_click"
              data-sk-den={n.slug}
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 48,
                padding: "13px 28px",
                borderRadius: 24,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.92rem",
                textDecoration: "none",
                letterSpacing: "0.02em",
              }}
            >
              Mở {new URL(n.web).hostname} →
            </a>
          </section>

          <p
            style={{
              marginTop: 40,
              paddingTop: 20,
              borderTop: "1px solid var(--border)",
              fontSize: "0.9rem",
              color: "var(--text-dim)",
            }}
          >
            <Link
              href="/nguoi-kien-tao"
              style={{
                display: "inline-flex",
                alignItems: "center",
                minHeight: 44,
                color: "var(--gold)",
              }}
            >
              ← Xem tất cả người kiến tạo
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
