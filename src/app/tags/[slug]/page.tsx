/**
 * Trang bài viết theo tag /tags/[slug] — ISR.
 */
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { PostCard } from "@/features/blog/ui/PostCard";
import {
  CATEGORY_LABELS,
  type PostCategory,
  type SanityPostSummary,
} from "@/features/blog/types";
import { buildMetadata } from "@/lib/seo";
import { isSanityConfigured, POSTS_BY_TAG_QUERY } from "@/lib/sanity-queries";
import { sanityFetch } from "@/lib/sanity";
import { MOCK_POSTS } from "@/features/blog/mock-posts";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = decodeURIComponent(slug);
  return buildMetadata({
    title: `#${tag} — Blog vnfarmstay.vn`,
    description: `Bài viết có tag "${tag}" về du lịch nông nghiệp và farmstay Việt Nam.`,
    canonical: `/tags/${slug}`,
    // ⚠️ 19/08/2026 — trang tập hợp chỉ được index khi nguồn nội dung THẬT (Sanity)
    // đã đấu dây. Chưa đấu, trang này chỉ gom được các bài mẫu không có thân bài:
    // đó là nội dung mỏng, và nhiều trang như vậy còn gần trùng nhau. Tự index lại
    // ngay khi có bài thật, không cần sửa tay.
    noindex: !isSanityConfigured(),
  });
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tag = decodeURIComponent(slug);

  const posts = isSanityConfigured()
    ? await sanityFetch<SanityPostSummary[]>(POSTS_BY_TAG_QUERY, { tag })
    : MOCK_POSTS.filter((p) => p.tags?.includes(tag));

  return (
    <>
      <Navbar />
      <main id="main">
        <section
          style={{
            background: "var(--bg-deep)",
            padding: "64px 24px 40px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 640, margin: "0 auto" }}>
            <p
              style={{
                color: "var(--gold)",
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 12,
              }}
            >
              TAG
            </p>
            <h1
              className="shine reveal"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.8rem,4vw,2.4rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              #{tag}
            </h1>
            <p style={{ color: "var(--text-dim)", fontSize: "0.95rem" }}>
              {posts.length} bài viết
            </p>
          </div>
        </section>

        <section
          style={{ background: "var(--bg-main)", padding: "48px 24px 80px" }}
        >
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            {posts.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-dim)",
                  padding: "60px 0",
                }}
              >
                Không có bài viết với tag này.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 28,
                }}
              >
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    categoryLabel={
                      post.category
                        ? CATEGORY_LABELS[post.category as PostCategory]
                        : undefined
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
