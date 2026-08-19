/**
 * Xưởng sinh JSON-LD (dữ liệu có cấu trúc cho máy tìm kiếm).
 *
 * NGUYÊN TẮC (khắc 19/08/2026):
 *  1. Mọi giá trị lấy từ `@/lib/site` — không chép cứng tên/URL ở đây nữa.
 *  2. Mọi `@id` là URL canonical tuyệt đối và ỔN ĐỊNH, để Google nối được các thực thể.
 *  3. Chỉ khai trường CÓ THẬT. Thiếu dữ liệu ⇒ bỏ hẳn trường đó, không điền chuỗi rỗng.
 *  4. CẤM `AggregateRating` / `Review` / `Offer` khi không có quy trình đánh giá thật —
 *     bản cũ nhận `rating`/`reviewCount` rồi khai thẳng cho Google; hôm Ông đưa farmstay
 *     thật vào, những con số tự chế ấy sẽ đi ra kết quả tìm kiếm. Đã tháo ngòi.
 *  5. Ghép bằng object có kiểu, KHÔNG nối chuỗi JSON bằng tay.
 */
import type {
  WithContext,
  Article,
  FAQPage,
  BreadcrumbList,
  LodgingBusiness,
  Organization,
  WebSite,
  WebPage,
  CollectionPage,
  Thing,
} from "schema-dts";
import {
  SITE_URL,
  SITE_NAME,
  SITE_ALT_NAMES,
  SITE_DESCRIPTION,
  SITE_LOGO,
  SITE_SAME_AS,
  SITE_CONTACT,
  SCHEMA_ID,
  absUrl,
} from "./site";

// ─── Cấp website: Organization · WebSite · WebPage ───────────────────────────

/**
 * Tổ chức đứng sau website.
 * `sameAs`/`email`/`telephone` chỉ xuất hiện khi `site.ts` có dữ liệu thật —
 * `SITE_SAME_AS` đang cố ý rỗng nên trường này tự biến mất khỏi JSON-LD.
 */
export function organizationSchema(): Organization {
  return {
    "@type": "Organization",
    "@id": SCHEMA_ID.organization,
    name: SITE_NAME,
    alternateName: [...SITE_ALT_NAMES],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: absUrl(SITE_LOGO),
    ...(SITE_SAME_AS.length > 0 ? { sameAs: SITE_SAME_AS } : {}),
    ...(SITE_CONTACT.email ? { email: SITE_CONTACT.email } : {}),
    ...(SITE_CONTACT.telephone ? { telephone: SITE_CONTACT.telephone } : {}),
  };
}

/**
 * Chính website.
 * @param hasWorkingSearch — chỉ khai `SearchAction` khi tìm kiếm nội bộ CHẠY THẬT và
 * trả về kết quả. Khai khi danh bạ còn rỗng là hứa với Google một thứ không tồn tại.
 */
export function websiteSchema(hasWorkingSearch = false): WebSite {
  return {
    "@type": "WebSite",
    "@id": SCHEMA_ID.website,
    name: SITE_NAME,
    alternateName: [...SITE_ALT_NAMES],
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: "vi-VN",
    publisher: { "@id": SCHEMA_ID.organization },
    ...(hasWorkingSearch
      ? {
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/tim-kiem?q={search_term_string}`,
            },
            // @ts-expect-error — schema-dts chưa có literal "query-input"
            "query-input": "required name=search_term_string",
          },
        }
      : {}),
  };
}

export interface WebPageSchemaProps {
  /** Đường dẫn canonical, ví dụ "/ve-chung-toi" */
  path: string;
  name: string;
  description: string;
  /** "WebPage" mặc định; "AboutPage" cho /ve-chung-toi; "ContactPage" cho /lien-he… */
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  updatedAt?: string;
}

/** Một trang cụ thể, đã nối sẵn về WebSite + Organization bằng `@id`. */
export function webPageSchema({
  path,
  name,
  description,
  type = "WebPage",
  updatedAt,
}: WebPageSchemaProps): WebPage {
  return {
    "@type": type,
    "@id": SCHEMA_ID.webPage(path),
    url: absUrl(path),
    name,
    description,
    inLanguage: "vi-VN",
    isPartOf: { "@id": SCHEMA_ID.website },
    about: { "@id": SCHEMA_ID.organization },
    ...(updatedAt ? { dateModified: updatedAt } : {}),
  } as WebPage;
}

/**
 * Gói nhiều thực thể vào một `@graph` duy nhất — cách khai đúng khi các thực thể
 * tham chiếu lẫn nhau, thay vì rải nhiều khối `<script>` rời rạc.
 */
export function graph(nodes: Thing[]): Record<string, unknown> {
  // Gỡ "@context" của từng nút: trong một `@graph` chỉ được có MỘT ngữ cảnh ở gốc.
  // Cần thiết vì `breadcrumbSchema`/`articleSchema` còn được dùng đứng một mình
  // ở nơi khác, nên chúng vẫn phải tự mang "@context" khi ra ngoài graph.
  const stripped = nodes.map((node) => {
    if (node && typeof node === "object" && "@context" in node) {
      const rest = { ...(node as Record<string, unknown>) };
      delete rest["@context"];
      return rest;
    }
    return node;
  });
  return { "@context": "https://schema.org", "@graph": stripped };
}

// ─── CollectionPage + ItemList (danh mục, vùng, chủ đề, tuyến) ───────────────

export interface CollectionItem {
  name: string;
  url: string;
}

/**
 * Trang tập hợp. `ItemList` chỉ được gắn khi tập hợp CÓ phần tử thật —
 * một `ItemList` rỗng nói với Google rằng đây là trang mỏng.
 */
export function collectionPageSchema({
  path,
  name,
  description,
  items,
}: {
  path: string;
  name: string;
  description: string;
  items: CollectionItem[];
}): CollectionPage {
  const base = webPageSchema({
    path,
    name,
    description,
    type: "CollectionPage",
  }) as CollectionPage;

  if (items.length === 0) return base;

  return {
    ...base,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, idx) => ({
        "@type": "ListItem" as const,
        position: idx + 1,
        name: item.name,
        url: absUrl(item.url),
      })),
    },
  } as CollectionPage;
}

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
  authorName = "Ban biên tập vnfarmstay.vn",
}: ArticleSchemaProps): WithContext<Article> {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url,
    image: imageUrl,
    inLanguage: "vi-VN",
    datePublished: publishedAt,
    dateModified: updatedAt ?? publishedAt,
    author: { "@type": "Person", name: authorName },
    publisher: { "@id": SCHEMA_ID.organization },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

export interface FaqItem {
  question: string;
  answer: string;
}

/**
 * JSON-LD FAQPage — CHỈ dùng khi đúng những câu hỏi/đáp ấy HIỂN THỊ trên trang.
 * Khai câu hỏi không có trên màn hình là vi phạm điều kiện hợp lệ của Google.
 */
export function faqSchema(items: FaqItem[]): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
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
      item: absUrl(item.url),
    })),
  };
}

// ─── LodgingBusiness (hồ sơ farmstay) ────────────────────────────────────────

export interface FarmstaySchemaProps {
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  /** Địa danh hiển thị trên trang (huyện/tỉnh) */
  address: string;
  /** Giá thấp nhất do CHỦ FARM cấp; 0 hoặc bỏ trống ⇒ không khai giá */
  priceFrom?: number;
  /** Website riêng / kênh đặt trực tiếp của farmstay, nếu chủ farm đã xác nhận */
  officialUrl?: string;
  telephone?: string;
}

/**
 * JSON-LD LodgingBusiness cho hồ sơ farmstay.
 * Không có `aggregateRating`, không có `review`, không có `offer` — vnfarmstay.vn
 * không nhận đặt phòng và không có quy trình chấm sao, nên không có quyền khai.
 */
export function farmstaySchema({
  name,
  description,
  url,
  imageUrl,
  address,
  priceFrom,
  officialUrl,
  telephone,
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
    ...(priceFrom && priceFrom > 0
      ? { priceRange: `Từ ${priceFrom.toLocaleString("vi-VN")}đ/đêm` }
      : {}),
    ...(officialUrl ? { sameAs: [officialUrl] } : {}),
    ...(telephone ? { telephone } : {}),
  } as WithContext<LodgingBusiness>;
}
