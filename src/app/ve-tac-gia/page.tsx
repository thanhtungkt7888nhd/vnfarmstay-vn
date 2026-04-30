/**
 * Trang giới thiệu đội ngũ tác giả Farmstay.vn — /ve-tac-gia.
 * Static page, không cần ISR. Giúp Google hiểu E-E-A-T (Experience, Expertise, Authority, Trust).
 */
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { JsonLd } from "@/shared/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import type { WithContext, Person } from "schema-dts";

export const metadata: Metadata = {
  title: "Về tác giả | Farmstay.vn",
  description:
    "Gặp gỡ đội ngũ biên tập Farmstay.vn — những người đã đặt chân đến hàng trăm farmstay khắp Việt Nam để mang đến nội dung du lịch nông nghiệp chân thực nhất.",
  openGraph: {
    title: "Về tác giả | Farmstay.vn",
    description:
      "Đội ngũ biên tập Farmstay.vn với hàng trăm lượt trải nghiệm farmstay thực tế khắp Việt Nam.",
    type: "website",
  },
};

/** Danh sách tác giả biên tập */
const authors = [
  {
    slug: "ban-bien-tap",
    name: "Ban Biên Tập Farmstay.vn",
    title: "Đội ngũ nội dung",
    bio: "Nhóm biên tập Farmstay.vn gồm những người yêu thích du lịch nông nghiệp, đã trực tiếp trải nghiệm và đánh giá hàng trăm farmstay khắp Việt Nam — từ núi rừng Hà Giang đến đồng bằng sông Cửu Long. Mỗi bài viết được thẩm định bởi người đã ở thực tế tại đó.",
    expertise: ["Du lịch nông nghiệp", "Review farmstay", "Văn hoá bản địa"],
    icon: "🌿",
    articlesCount: 120,
  },
  {
    slug: "chuyen-gia-phap-ly",
    name: "Chuyên gia Pháp lý",
    title: "Tư vấn pháp luật nông nghiệp",
    bio: "Đội ngũ tư vấn pháp lý chuyên về luật đất đai, mô hình kinh doanh nông nghiệp và các quy định liên quan đến farmstay tại Việt Nam. Nội dung pháp lý được cập nhật theo từng thông tư, nghị định mới nhất.",
    expertise: ["Luật đất đai", "Pháp lý farmstay", "Mô hình kinh doanh"],
    icon: "⚖️",
    articlesCount: 45,
  },
  {
    slug: "chuyen-gia-van-hanh",
    name: "Chuyên gia Vận hành",
    title: "Tư vấn quản lý farmstay",
    bio: "Những chuyên gia có kinh nghiệm thực tế vận hành farmstay từ 5–15 năm, chia sẻ kiến thức về quản lý đặt phòng, dịch vụ khách hàng, vận hành mùa vụ và phát triển bền vững.",
    expertise: ["Quản lý đặt phòng", "Vận hành mùa vụ", "Phát triển bền vững"],
    icon: "🏡",
    articlesCount: 67,
  },
];

const authorSchemas: WithContext<Person>[] = authors.map((author) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: author.name,
  jobTitle: author.title,
  description: author.bio,
  url: `https://farmstay.vn/tac-gia/${author.slug}`,
  worksFor: {
    "@type": "Organization",
    name: "Farmstay.vn",
    url: "https://farmstay.vn",
  },
}));

const schemas = [
  ...authorSchemas,
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Về tác giả", url: "/ve-tac-gia" },
  ]),
];

export default function VeTacGiaPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <main style={{ background: "var(--bg-main)", minHeight: "100vh" }}>
        {/* Hero */}
        <section
          style={{
            background: "var(--bg-deep)",
            borderBottom: "1px solid var(--border)",
            padding: "64px 24px 48px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
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
              Đội ngũ biên tập
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.2,
                marginBottom: 20,
              }}
            >
              Những người viết về farmstay
              <br />
              <span style={{ color: "var(--gold)", fontStyle: "italic" }}>
                bằng trải nghiệm thực tế
              </span>
            </h1>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.7,
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              Mỗi bài viết trên Farmstay.vn được tạo ra bởi người đã sống, ăn,
              ngủ tại farmstay — không phải bởi AI tổng hợp hay người viết chưa
              từng đặt chân đến.
            </p>
          </div>
        </section>

        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "48px 24px 80px",
          }}
        >
          <BreadcrumbNav
            items={[{ name: "Về tác giả", href: "/ve-tac-gia" }]}
          />

          {/* Tác giả cards */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32,
              marginTop: 16,
            }}
          >
            {authors.map((author) => (
              <article
                key={author.slug}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "36px 40px",
                  display: "grid",
                  gridTemplateColumns: "auto 1fr",
                  gap: 32,
                  alignItems: "start",
                }}
              >
                {/* Avatar icon */}
                <div
                  aria-hidden="true"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: "var(--gold-dim)",
                    border: "2px solid var(--gold-border)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "2rem",
                    flexShrink: 0,
                  }}
                >
                  {author.icon}
                </div>

                {/* Info */}
                <div>
                  <h2
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 4,
                    }}
                  >
                    <a
                      href={`/tac-gia/${author.slug}`}
                      style={{
                        color: "inherit",
                        textDecoration: "none",
                        transition: "color 0.2s",
                      }}
                    >
                      {author.name}
                    </a>
                  </h2>
                  <p
                    style={{
                      color: "var(--gold)",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    {author.title} · {author.articlesCount} bài viết
                  </p>
                  <p
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.92rem",
                      lineHeight: 1.7,
                      marginBottom: 16,
                    }}
                  >
                    {author.bio}
                  </p>

                  {/* Expertise tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {author.expertise.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          background: "rgba(212,168,83,0.1)",
                          border: "1px solid var(--gold-border)",
                          color: "var(--gold)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          padding: "4px 12px",
                          borderRadius: 20,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a
                    href={`/tac-gia/${author.slug}`}
                    style={{
                      display: "inline-block",
                      marginTop: 20,
                      color: "var(--text-dim)",
                      fontSize: "0.82rem",
                      textDecoration: "underline",
                      textUnderlineOffset: 3,
                    }}
                    aria-label={`Xem tất cả bài viết của ${author.name}`}
                  >
                    Xem tất cả bài viết →
                  </a>
                </div>
              </article>
            ))}
          </div>

          {/* CTA */}
          <section
            style={{
              marginTop: 64,
              background: "var(--bg-deep)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius)",
              padding: "40px",
              textAlign: "center",
            }}
            aria-label="Góp ý nội dung"
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Bạn muốn đóng góp nội dung?
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.92rem",
                marginBottom: 24,
                maxWidth: 480,
                margin: "0 auto 24px",
              }}
            >
              Nếu bạn là chủ farmstay, chuyên gia nông nghiệp hoặc đam mê du
              lịch nông thôn, chúng tôi rất muốn nghe câu chuyện của bạn.
            </p>
            <a
              href="/ve-chung-toi#lien-he"
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "#0f2318",
                fontWeight: 700,
                fontSize: "0.9rem",
                padding: "12px 28px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                transition: "var(--transition)",
              }}
            >
              Liên hệ biên tập
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
