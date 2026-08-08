/**
 * Trang chi tiết bài viết /blog/[slug] — ISR + generateStaticParams.
 * Render Portable Text, FAQPage schema, BreadcrumbList, OG dynamic image.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { RelatedPosts } from "@/shared/ui/RelatedPosts";
import { PortableTextRenderer } from "@/features/blog/ui/PortableTextRenderer";
import { TableOfContents } from "@/shared/ui/TableOfContents";
import { CATEGORY_LABELS } from "@/features/blog/types";
import { buildMetadata } from "@/lib/seo";
import { articleSchema, faqSchema, breadcrumbSchema } from "@/lib/schema";
import { giuTuGhep } from "@/shared/utils/giu-tu-ghep";
import Image from "next/image";
import { urlFor } from "@/lib/sanity";
import {
  fetchPostBySlug,
  fetchRelatedPosts,
  fetchPostSlugs,
  isSanityConfigured,
} from "@/lib/sanity-queries";
import { MOCK_POSTS } from "@/features/blog/mock-posts";

export const revalidate = 3600;

// ─── Static params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
  if (!isSanityConfigured()) {
    return MOCK_POSTS.map((p) => ({ slug: p.slug.current }));
  }
  const slugs = await fetchPostSlugs();
  return slugs.map((s) => ({ slug: s.slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = isSanityConfigured()
    ? await fetchPostBySlug(slug)
    : (MOCK_POSTS.find((p) => p.slug.current === slug) ?? null);

  if (!post) return { title: "Bài viết không tồn tại" };

  const ogImage = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : `/api/og?title=${encodeURIComponent(post.title)}`;

  return buildMetadata({
    title: post.seo?.metaTitle ?? post.title,
    description: post.seo?.metaDescription ?? post.excerpt ?? "",
    canonical: `/blog/${slug}`,
    ogImage,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = isSanityConfigured()
    ? await fetchPostBySlug(slug)
    : (MOCK_POSTS.find((p) => p.slug.current === slug) ?? null);

  if (!post) notFound();

  const relatedPosts =
    post.relatedPosts ??
    (post.category && isSanityConfigured()
      ? await fetchRelatedPosts(post.category, slug)
      : []);

  const coverImageUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(630).url()
    : null;

  const articleUrl = `https://vnfarmstay.vn/blog/${slug}`;

  const schemas = [
    articleSchema({
      title: post.title,
      description: post.excerpt ?? "",
      url: articleUrl,
      imageUrl:
        coverImageUrl ??
        `https://vnfarmstay.vn/api/og?title=${encodeURIComponent(post.title)}&subtitle=${encodeURIComponent(post.excerpt ?? "vnfarmstay.vn")}`,
      publishedAt: post.publishedAt ?? new Date().toISOString(),
      updatedAt: post.updatedAt,
      authorName: post.author,
    }),
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Blog", url: "/blog" },
      { name: post.title, url: `/blog/${slug}` },
    ]),
    ...(post.faq && post.faq.length > 0 ? [faqSchema(post.faq)] : []),
  ];

  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />
      <main
        id="main"
        className="fx-grain"
        style={{ background: "var(--bg-main)" }}
      >
        {/* Hero ảnh bìa */}
        {coverImageUrl && (
          <div
            className="fx-blur-in"
            style={{
              width: "100%",
              maxHeight: 480,
              overflow: "hidden",
              background: "var(--bg-deep)",
            }}
          >
            {/* next/image thay <img> thô (cổng perf.4-raw-img). urlFor() ở
                trên đã dựng ảnh đúng 1200×630, nên khai đúng cặp số đó —
                trình duyệt giữ chỗ trước, không nhảy bố cục lúc ảnh về. */}
            <Image
              src={coverImageUrl}
              alt={post.title}
              width={1200}
              height={630}
              priority
              sizes="100vw"
              style={{
                width: "100%",
                height: "auto",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        )}

        <article
          style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 80px" }}
        >
          {/* Breadcrumb */}
          <BreadcrumbNav
            items={[
              { name: "Blog", href: "/blog" },
              {
                name: post.category
                  ? CATEGORY_LABELS[post.category]
                  : "Bài viết",
                href: post.category ? `/danh-muc/${post.category}` : "/blog",
              },
            ]}
          />

          {/* Category tag */}
          {post.category && (
            <a
              href={`/danh-muc/${post.category}`}
              className="fx-underline-slide"
              style={{
                display: "inline-block",
                background: "rgba(196,160,70,0.15)",
                color: "var(--gold)",
                fontSize: "0.75rem",
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "4px 12px",
                borderRadius: 20,
                marginBottom: 16,
                textDecoration: "none",
              }}
            >
              {CATEGORY_LABELS[post.category]}
            </a>
          )}

          {/* Title */}
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.6rem,4vw,2.2rem)",
              fontWeight: 700,
              color: "var(--text-primary)",
              lineHeight: 1.3,
              marginBottom: 16,
            }}
          >
            {giuTuGhep(post.title)}
          </h1>

          {/* Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              color: "var(--text-dim)",
              fontSize: "0.82rem",
              marginBottom: 32,
              paddingBottom: 24,
              borderBottom: "1px solid var(--border)",
              flexWrap: "wrap",
            }}
          >
            {/* Nhãn chữ thay emoji — LUẬT THIẾT KẾ: không emoji trên web premium */}
            {post.author && (
              <span>
                <span className="kicker">Tác giả</span> {post.author}
              </span>
            )}
            {post.publishedAt && (
              <span>
                <span className="kicker">Đăng</span>{" "}
                {new Date(post.publishedAt).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </span>
            )}
            {post.readTime && (
              <span>
                <span className="kicker">Đọc</span> {post.readTime} phút
              </span>
            )}
          </div>

          {/* Mục lục tự động (hiện khi bài có ≥ 3 heading) */}
          <TableOfContents />

          {/* Content */}
          {post.content ? (
            <PortableTextRenderer content={post.content} />
          ) : (
            <p style={{ color: "var(--text-muted)" }}>
              Nội dung đang được cập nhật...
            </p>
          )}

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div
              style={{
                marginTop: 40,
                paddingTop: 24,
                borderTop: "1px solid var(--border)",
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              {post.tags.map((tag) => (
                <a
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                    fontSize: "0.78rem",
                    padding: "4px 12px",
                    borderRadius: 20,
                    textDecoration: "none",
                  }}
                >
                  #{tag}
                </a>
              ))}
            </div>
          )}

          {/* FAQ */}
          {post.faq && post.faq.length > 0 && (
            <div style={{ marginTop: 48 }}>
              <h2
                className="fx-gradient-text-gold"
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 24,
                }}
              >
                Câu hỏi thường gặp
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  textAlign: "justify",
                }}
              >
                {post.faq.map((item, idx) => (
                  <details
                    key={idx}
                    style={{
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-sm)",
                      padding: "16px 20px",
                    }}
                  >
                    <summary
                      style={{
                        cursor: "pointer",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        listStyle: "none",
                      }}
                    >
                      {item.question}
                    </summary>
                    <p
                      style={{
                        color: "var(--text-muted)",
                        marginTop: 12,
                        lineHeight: 1.7,
                        fontSize: "0.92rem",
                      }}
                    >
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <RelatedPosts posts={relatedPosts} currentSlug={slug} />
        )}
      </main>
      <Footer />
    </>
  );
}
