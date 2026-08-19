/**
 * Helper tạo metadata chuẩn cho mọi trang — Lệnh 17-MEGA.
 * Áp dụng defaults từ site, override bằng page-level values.
 */
import type { Metadata } from "next";
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE } from "./site";

export interface SeoProps {
  title: string;
  description: string;
  /** Đường dẫn canonical, ví dụ "/blog/ten-bai-viet" */
  canonical?: string;
  /** Ảnh OG, mặc định dùng /api/og dynamic generator */
  ogImage?: string;
  /** Nếu true → noindex (draft, preview) */
  noindex?: boolean;
  /** Ngày xuất bản ISO string */
  publishedAt?: string;
  /** Ngày cập nhật ISO string */
  updatedAt?: string;
  /** Keywords bổ sung */
  keywords?: string[];
  /**
   * Loại Open Graph. Mặc định "website" — bản cũ khai "article" cho MỌI trang,
   * kể cả trang giới thiệu và trang chính sách, khiến mạng xã hội hiểu sai loại nội dung.
   * Trang có ngày xuất bản tự động được coi là "article".
   */
  ogType?: "website" | "article";
}

/** Tạo Metadata object đầy đủ cho một trang */
export function buildMetadata({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  noindex = false,
  publishedAt,
  updatedAt,
  keywords = [],
  ogType,
}: SeoProps): Metadata {
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;
  const resolvedOgType = ogType ?? (publishedAt ? "article" : "website");

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: resolvedOgType,
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedAt && { publishedTime: publishedAt }),
      ...(updatedAt && { modifiedTime: updatedAt }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`],
    },
    // `noindex` LUÔN đi kèm `follow` (sửa 19/08/2026 — trước đó là `nofollow`):
    // trang không đáng nằm trong chỉ mục vẫn là đường đi hợp lệ để máy tìm kiếm
    // đọc tiếp sang các trang bên trong. `nofollow` cắt luôn cả đường đi đó.
    robots: noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}
