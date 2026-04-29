/**
 * Trang bài viết theo danh mục /danh-muc/[slug] — ISR.
 * Hiển thị tất cả bài trong category slug.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { PostCard } from "@/features/blog/ui/PostCard";
import { CATEGORY_LABELS, type PostCategory } from "@/features/blog/types";
import { buildMetadata } from "@/lib/seo";
import { fetchPostsByCategory, isSanityConfigured } from "@/lib/sanity-queries";
import { MOCK_POSTS } from "@/features/blog/mock-posts";

export const revalidate = 3600;

export async function generateStaticParams() {
  return (Object.keys(CATEGORY_LABELS) as PostCategory[]).map((cat) => ({
    slug: cat,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const label = CATEGORY_LABELS[slug as PostCategory] ?? slug;
  return buildMetadata({
    title: `${label} — Blog Farmstay.vn`,
    description: `Các bài viết về ${label.toLowerCase()} dành cho chủ và khách farmstay Việt Nam.`,
    canonical: `/danh-muc/${slug}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!Object.keys(CATEGORY_LABELS).includes(slug)) notFound();

  const livePosts = isSanityConfigured()
    ? await fetchPostsByCategory(slug)
    : MOCK_POSTS.filter((p) => p.category === slug);

  const label = CATEGORY_LABELS[slug as PostCategory] ?? slug;

  return (
    <>
      <Navbar />
      <main>
        {/* Header */}
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
                fontSize: "0.78rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                marginBottom: 12,
              }}
            >
              DANH MỤC
            </p>
            <h1
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(1.8rem,4vw,2.4rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              {label}
            </h1>
            <p style={{ color: "var(--text-dim)", fontSize: "0.9rem" }}>
              {livePosts.length} bài viết
            </p>
          </div>
        </section>

        {/* Posts */}
        <section
          style={{ background: "var(--bg-main)", padding: "48px 24px 80px" }}
        >
          <div style={{ maxWidth: 1160, margin: "0 auto" }}>
            {livePosts.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--text-dim)",
                  padding: "60px 0",
                }}
              >
                Chưa có bài viết trong danh mục này.
              </p>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gap: 28,
                }}
              >
                {livePosts.map((post) => (
                  <PostCard key={post._id} post={post} categoryLabel={label} />
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
