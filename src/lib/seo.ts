/**
 * Helper tạo metadata chuẩn cho mọi trang — Lệnh 17-MEGA.
 * Áp dụng defaults từ site, override bằng page-level values.
 */
import type { Metadata } from "next";

const SITE_URL = "https://farmstay.vn";
const SITE_NAME = "Farmstay.vn";
/** OG image mặc định — dùng dynamic generator /api/og khi không có ảnh bài */
const DEFAULT_OG_IMAGE =
  "/api/og?title=Farmstay.vn&subtitle=Tr%E1%BA%A3i+nghi%E1%BB%87m+n%C3%B4ng+nghi%E1%BB%87p+%C4%91%C3%ADch+th%E1%BB%B1c+Vi%E1%BB%87t+Nam";

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
}: SeoProps): Metadata {
  const url = canonical ? `${SITE_URL}${canonical}` : SITE_URL;

  return {
    title,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
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
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}
