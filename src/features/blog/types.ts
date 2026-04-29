/**
 * TypeScript types cho blog posts và Sanity responses.
 * Tách riêng để tránh circular imports giữa queries và components.
 */

/** Block content Sanity (PortableText) */
export interface SanityBlock {
  _type: string;
  _key: string;
  style?: string;
  children?: Array<{
    _type: string;
    _key: string;
    text: string;
    marks?: string[];
  }>;
  markDefs?: Array<{ _type: string; _key: string; href?: string }>;
  asset?: { _ref: string; _type: string };
}

/** Ảnh Sanity */
export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number; height: number; width: number };
  alt?: string;
}

/** FAQ item trong bài viết */
export interface FaqItem {
  question: string;
  answer: string;
}

/** Bài viết blog đầy đủ (từ Sanity) */
export interface SanityPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: SanityImage;
  content?: SanityBlock[];
  category?: PostCategory;
  tags?: string[];
  author?: string;
  faq?: FaqItem[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
  };
  publishedAt?: string;
  updatedAt?: string;
  readTime?: number;
  relatedPosts?: SanityPostSummary[];
  relatedSlugs?: string[];
}

/** Bài viết tóm tắt (dùng trong danh sách, related) */
export interface SanityPostSummary {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  coverImage?: SanityImage;
  category?: PostCategory;
  publishedAt?: string;
  readTime?: number;
}

/** Farmstay từ Sanity */
export interface SanityFarmstay {
  _id: string;
  name: string;
  slug: { current: string };
  province?: string;
  location?: string;
  region?: "north" | "central" | "south";
  lat?: number;
  lng?: number;
  price?: number;
  rating?: number;
  reviewCount?: number;
  tags?: string[];
  badges?: string[];
  images?: SanityImage[];
  description?: string;
  highlights?: string[];
  amenities?: string[];
  seo?: { metaTitle?: string; metaDescription?: string };
  publishedAt?: string;
}

/** Các category blog */
export type PostCategory =
  | "phap-ly"
  | "van-hanh"
  | "review"
  | "nong-nghiep"
  | "tin-tuc";

/** Mapping category → label tiếng Việt */
export const CATEGORY_LABELS: Record<PostCategory, string> = {
  "phap-ly": "Pháp lý",
  "van-hanh": "Vận hành",
  review: "Review farmstay",
  "nong-nghiep": "Nông nghiệp & thiên nhiên",
  "tin-tuc": "Tin tức",
};

/** Heading item cho TOC */
export interface TocItem {
  id: string;
  text: string;
  level: number;
}
