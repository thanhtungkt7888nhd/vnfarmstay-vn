/**
 * Sitemap động — bao gồm trang tĩnh + farmstay + bài viết từ Sanity.
 * Webhook kích hoạt revalidatePath("/sitemap.xml") để làm mới ngay.
 */
import type { MetadataRoute } from "next";
import { FARMSTAYS } from "@/features/listing/data";
import { fetchPostSlugs } from "@/lib/sanity-queries";
import { MOCK_POSTS } from "@/features/blog/mock-posts";

const SITE_URL = "https://farmstay.vn";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "daily" },
    { url: `${SITE_URL}/tim-kiem`, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/cong-dong`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/phap-ly`, priority: 0.7, changeFrequency: "monthly" },
    {
      url: `${SITE_URL}/ve-chung-toi`,
      priority: 0.6,
      changeFrequency: "monthly",
    },
    {
      url: `${SITE_URL}/dang-farmstay`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
    { url: `${SITE_URL}/dieu-khoan`, priority: 0.3, changeFrequency: "yearly" },
    {
      url: `${SITE_URL}/chinh-sach-bao-mat`,
      priority: 0.3,
      changeFrequency: "yearly",
    },
  ];

  // Farmstay pages từ static data
  const farmstayPages: MetadataRoute.Sitemap = FARMSTAYS.map((f) => ({
    url: `${SITE_URL}/farmstay/${f.slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
  }));

  // Blog pages — ưu tiên Sanity, fallback mock slugs
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await fetchPostSlugs();
    const source =
      slugs.length > 0
        ? slugs
        : MOCK_POSTS.map((p) => ({
            slug: p.slug.current,
            publishedAt: p.publishedAt,
          }));

    blogPages = source.map((s) => ({
      url: `${SITE_URL}/blog/${s.slug}`,
      priority: 0.7,
      changeFrequency: "weekly" as const,
      lastModified:
        "updatedAt" in s && s.updatedAt
          ? new Date(s.updatedAt as string)
          : s.publishedAt
            ? new Date(s.publishedAt)
            : new Date(),
    }));
  } catch {
    // Không thể fetch — bỏ qua, không crash
  }

  return [...staticPages, ...farmstayPages, ...blogPages];
}
