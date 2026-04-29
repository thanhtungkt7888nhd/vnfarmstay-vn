/**
 * Các hàm tạo JSON-LD Schema.org cho SEO — Lệnh 17-MEGA.
 * Import và dùng trong từng page/layout để tối ưu rich results.
 */
import type {
  WithContext,
  Article,
  FAQPage,
  BreadcrumbList,
  Product,
  LodgingBusiness,
} from "schema-dts";

const SITE_URL = "https://farmstay.vn";

// ─── Article ────────────────────────────────────────────────────────────────

export interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
}

/** JSON-LD Article — dùng cho trang blog/bài viết */
export function articleSchema({
  title,
  description,
  url,
  imageUrl,
  publishedAt,
  updatedAt,
  authorName = "Farmstay.vn Editorial",
}: ArticleSchemaProps): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: imageUrl,
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "Farmstay.vn",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

/** JSON-LD FAQPage — dùng khi trang có phần hỏi & đáp */
export function faqSchema(items: FaqItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ─── Breadcrumb ──────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/** JSON-LD BreadcrumbList — dùng kèm component BreadcrumbNav */
export function breadcrumbSchema(
  items: BreadcrumbItem[]
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// ─── LodgingBusiness (Farmstay) ──────────────────────────────────────────────

export interface FarmstaySchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  address: string;
  priceFrom: number;
  rating?: number;
  reviewCount?: number;
}

/** JSON-LD LodgingBusiness — dùng cho trang chi tiết farmstay */
export function farmstaySchema({
  name,
  description,
  url,
  imageUrl,
  address,
  priceFrom,
  rating,
  reviewCount,
}: FarmstaySchemaProps): WithContext<LodgingBusiness> {
  return {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name,
    description,
    url,
    image: imageUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: address,
      addressCountry: "VN",
    },
    priceRange: `Từ ${priceFrom.toLocaleString("vi-VN")}đ/đêm`,
    ...(rating && reviewCount
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.toString(),
            reviewCount: reviewCount.toString(),
            bestRating: "5",
            worstRating: "1",
          },
        }
      : {}),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any as WithContext<LodgingBusiness>;
}

// ─── Product (dùng cho trang giới thiệu nền tảng) ────────────────────────────

/** JSON-LD Product — dùng cho các trang landing có offer */
export function productSchema({
  name,
  description,
  url,
}: {
  name: string;
  description: string;
  url: string;
}): WithContext<Product> {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    url,
    brand: {
      "@type": "Brand",
      name: "Farmstay.vn",
    },
  };
}
