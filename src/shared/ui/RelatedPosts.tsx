/**
 * Component hiển thị bài viết liên quan — dùng cuối trang blog/[slug].
 * Nhận danh sách bài tóm tắt và render dạng grid ngang.
 */
import type { SanityPostSummary } from "@/features/blog/types";
import { PostCard } from "@/features/blog/ui/PostCard";
import { CATEGORY_LABELS } from "@/features/blog/types";

interface RelatedPostsProps {
  posts: SanityPostSummary[];
  /** slug bài hiện tại để lọc bỏ khỏi danh sách */
  currentSlug?: string;
}

/** Section bài viết liên quan — tối đa 4 bài */
export function RelatedPosts({ posts, currentSlug }: RelatedPostsProps) {
  const filtered = posts
    .filter((p) => p.slug.current !== currentSlug)
    .slice(0, 4);
  if (filtered.length === 0) return null;

  return (
    <section
      style={{
        background: "var(--bg-deep)",
        padding: "56px 24px 72px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1160, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: 32,
          }}
        >
          Bài viết liên quan
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 24,
          }}
        >
          {filtered.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              categoryLabel={
                post.category ? CATEGORY_LABELS[post.category] : undefined
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
