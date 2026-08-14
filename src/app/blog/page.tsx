/**
 * Trang danh sách bài viết /blog — ISR 1 giờ.
 * Hiển thị tất cả bài từ Sanity hoặc mock data khi chưa cấu hình.
 */
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { PostCard } from "@/features/blog/ui/PostCard";
import { MOCK_POSTS } from "@/features/blog/mock-posts";
import { buildMetadata } from "@/lib/seo";
import { fetchPosts, isSanityConfigured } from "@/lib/sanity-queries";
import { CATEGORY_LABELS } from "@/features/blog/types";

export const revalidate = 3600;

export const metadata: Metadata = buildMetadata({
  title: "Blog & Hướng dẫn Farmstay",
  description:
    "Kinh nghiệm vận hành farmstay, hướng dẫn pháp lý, review địa điểm và tin tức nông nghiệp du lịch Việt Nam.",
  canonical: "/blog",
  keywords: [
    "blog farmstay",
    "hướng dẫn farmstay",
    "kinh nghiệm nông nghiệp",
    "pháp lý farmstay",
  ],
});

export default async function BlogPage() {
  const liveData = await fetchPosts();
  const posts = isSanityConfigured() ? liveData : MOCK_POSTS;

  return (
    <>
      <Navbar />
      <main id="main">
        {/* Hero */}
        <section
          className="plasma-bg motif-x"
          style={{
            background: "var(--bg-deep)",
            padding: "72px 24px 48px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                color: "var(--gold)",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 12,
              }}
            >
              BLOG & HƯỚNG DẪN
            </p>
            <span className="section-kicker reveal">Câu chuyện vùng miền</span>
            <h1
              className="shine reveal"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2rem,5vw,2.8rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Kiến thức{" "}
              <em
                className="fx-gradient-text-gold"
                style={{ fontStyle: "italic" }}
              >
                Farmstay
              </em>
            </h1>
            <p
              className="fx-blur-in"
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              Hướng dẫn pháp lý, kinh nghiệm vận hành, review điểm đến và
              insight nông nghiệp du lịch.
            </p>
          </div>
        </section>

        {/* Danh mục nhanh */}
        <section
          style={{
            background: "var(--bg-card)",
            borderBottom: "1px solid var(--border)",
            padding: "16px 24px",
          }}
        >
          <div
            style={{
              maxWidth: 1160,
              margin: "0 auto",
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.8rem",
                color: "var(--text-dim)",
                marginRight: 4,
              }}
            >
              Danh mục:
            </span>
            {(Object.entries(CATEGORY_LABELS) as [string, string][]).map(
              ([slug, label]) => (
                <a
                  key={slug}
                  href={`/danh-muc/${slug}`}
                  className="fx-hover-lift fx-clip-reveal"
                  style={{
                    background: "var(--bg-main)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "0.8rem",
                    padding: "4px 14px",
                    borderRadius: 20,
                    textDecoration: "none",
                    transition: "var(--transition)",
                  }}
                >
                  {label}
                </a>
              )
            )}
          </div>
        </section>

        {/* Posts grid */}
        <section
          style={{
            background: "var(--bg-main)",
            padding: "56px 24px 80px",
          }}
        >
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            {posts.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "80px 24px",
                  color: "var(--text-dim)",
                }}
              >
                <p style={{ fontSize: "1.1rem" }}>
                  Chưa có bài viết nào. Vui lòng quay lại sau.
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: 28,
                }}
              >
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    categoryLabel={
                      post.category ? CATEGORY_LABELS[post.category] : undefined
                    }
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
