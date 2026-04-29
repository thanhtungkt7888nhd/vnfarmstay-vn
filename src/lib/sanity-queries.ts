/**
 * GROQ queries và fetch helpers cho Sanity CMS.
 * Client, urlFor nằm ở sanity.ts. Types nằm ở features/blog/types.ts.
 */

import { sanityClient } from "./sanity";
import type { SanityPost, SanityPostSummary } from "@/features/blog/types";

// ── Kiểm tra cấu hình ────────────────────────────────────────────────

/** Trả true nếu SANITY_PROJECT_ID đã được điền thật (không phải placeholder) */
export function isSanityConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  return Boolean(id && id !== "placeholder" && id.length > 4);
}

// ── GROQ Queries ─────────────────────────────────────────────────────

/** Lấy danh sách bài viết (listing page, RSS, sitemap) */
export const POST_LIST_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  category,
  tags,
  author,
  publishedAt,
  updatedAt,
  readTime
}`;

/** Lấy bài viết theo slug (detail page) — đầy đủ fields */
export const POST_BY_SLUG_QUERY = `*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  content,
  category,
  tags,
  author,
  faq,
  seo,
  publishedAt,
  updatedAt,
  readTime,
  "relatedPosts": relatedPosts[]->{
    _id, title, slug, excerpt, coverImage, category, publishedAt, readTime
  }
}`;

/** Lấy bài viết theo category */
export const POSTS_BY_CATEGORY_QUERY = `*[_type == "post" && category == $category && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  category,
  tags,
  author,
  publishedAt,
  readTime
}`;

/** Lấy bài liên quan theo category (cho RelatedArticles) */
export const RELATED_POSTS_QUERY = `*[_type == "post" && category == $category && slug.current != $currentSlug && defined(slug.current)] | order(publishedAt desc) [0...4] {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  category,
  publishedAt,
  readTime
}`;

/** Lấy slugs bài viết (cho generateStaticParams + sitemap) */
export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)] {
  "slug": slug.current,
  updatedAt,
  publishedAt
}`;

/** Lấy bài viết theo tag */
export const POSTS_BY_TAG_QUERY = `*[_type == "post" && $tag in tags && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  category,
  tags,
  author,
  publishedAt,
  readTime
}`;

/** Lấy bài viết theo tác giả */
export const POSTS_BY_AUTHOR_QUERY = `*[_type == "post" && author == $author && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  excerpt,
  coverImage,
  category,
  author,
  publishedAt,
  readTime
}`;

/** Lấy slugs farmstay từ Sanity (cho sitemap động) */
export const FARMSTAY_SLUGS_QUERY = `*[_type == "farmstay" && defined(slug.current)] {
  "slug": slug.current,
  updatedAt
}`;

// ── Fetch helpers ────────────────────────────────────────────────────

/** Fetch danh sách bài viết — trả [] nếu chưa cấu hình Sanity */
export async function fetchPosts(): Promise<SanityPost[]> {
  if (!isSanityConfigured()) return [];
  try {
    return await sanityClient.fetch<SanityPost[]>(
      POST_LIST_QUERY,
      {},
      {
        next: { revalidate: 60 },
      }
    );
  } catch {
    return [];
  }
}

/** Fetch bài viết theo slug — trả null nếu không tìm thấy */
export async function fetchPostBySlug(
  slug: string
): Promise<SanityPost | null> {
  if (!isSanityConfigured()) return null;
  try {
    return await sanityClient.fetch<SanityPost | null>(
      POST_BY_SLUG_QUERY,
      { slug },
      { next: { tags: [`post:${slug}`], revalidate: 60 } }
    );
  } catch {
    return null;
  }
}

/** Fetch bài viết theo category */
export async function fetchPostsByCategory(
  category: string
): Promise<SanityPost[]> {
  if (!isSanityConfigured()) return [];
  try {
    return await sanityClient.fetch<SanityPost[]>(
      POSTS_BY_CATEGORY_QUERY,
      { category },
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

/** Fetch bài liên quan (cho RelatedArticles component) */
export async function fetchRelatedPosts(
  category: string,
  currentSlug: string
): Promise<SanityPostSummary[]> {
  if (!isSanityConfigured()) return [];
  try {
    return await sanityClient.fetch<SanityPostSummary[]>(
      RELATED_POSTS_QUERY,
      { category, currentSlug },
      { next: { revalidate: 60 } }
    );
  } catch {
    return [];
  }
}

/** Fetch slugs bài viết (cho generateStaticParams + sitemap) */
export async function fetchPostSlugs(): Promise<
  { slug: string; updatedAt?: string; publishedAt?: string }[]
> {
  if (!isSanityConfigured()) return [];
  try {
    return await sanityClient.fetch(
      POST_SLUGS_QUERY,
      {},
      { cache: "no-store" }
    );
  } catch {
    return [];
  }
}

/** Fetch slugs farmstay từ Sanity (cho sitemap động) */
export async function fetchFarmstaySlugs(): Promise<
  { slug: string; updatedAt?: string }[]
> {
  if (!isSanityConfigured()) return [];
  try {
    return await sanityClient.fetch<{ slug: string; updatedAt?: string }[]>(
      FARMSTAY_SLUGS_QUERY,
      {},
      { cache: "no-store" }
    );
  } catch {
    return [];
  }
}
