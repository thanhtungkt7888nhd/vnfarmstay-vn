/**
 * Card hiển thị bài viết trong danh sách blog — dùng trên trang /blog, /danh-muc, /tags.
 */
import Image from "next/image";
import type { SanityPostSummary } from "@/features/blog/types";
import { urlFor } from "@/lib/sanity";

interface PostCardProps {
  post: SanityPostSummary;
  categoryLabel?: string;
}

/** Card bài viết với ảnh bìa, tiêu đề, excerpt, meta */
export function PostCard({ post, categoryLabel }: PostCardProps) {
  const coverUrl = post.coverImage
    ? urlFor(post.coverImage).width(640).height(360).url()
    : null;

  const publishDate = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : null;

  return (
    <a
      href={`/blog/${post.slug.current}`}
      style={{
        display: "block",
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-md)",
        overflow: "hidden",
        textDecoration: "none",
        transition: "var(--transition)",
      }}
      className="post-card fx-hover-lift fx-card-sheen"
    >
      {/* Ảnh bìa — dùng next/image để tự động tối ưu WebP/AVIF */}
      {coverUrl ? (
        <div style={{ position: "relative", width: "100%", height: 200 }}>
          <Image
            src={coverUrl}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: 200,
            background:
              "linear-gradient(135deg, var(--bg-deep), var(--border))",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            padding: 12,
          }}
        >
          {categoryLabel && (
            <span
              style={{
                color: "var(--text-dim)",
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              {categoryLabel}
            </span>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "20px 20px 24px" }}>
        {/* Category badge */}
        {categoryLabel && (
          <span
            style={{
              display: "inline-block",
              background: "rgba(196,160,70,0.12)",
              color: "var(--gold)",
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              padding: "3px 10px",
              borderRadius: 20,
              marginBottom: 10,
            }}
          >
            {categoryLabel}
          </span>
        )}

        {/* Title */}
        <h3
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            lineHeight: 1.4,
            marginBottom: 10,
          }}
        >
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.6,
              marginBottom: 14,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {post.excerpt}
          </p>
        )}

        {/* Meta */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--text-dim)",
            fontSize: "0.78rem",
          }}
        >
          {publishDate && <span>{publishDate}</span>}
          {post.readTime && <span>· {post.readTime} phút đọc</span>}
        </div>
      </div>
    </a>
  );
}
