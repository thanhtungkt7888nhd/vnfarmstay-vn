/**
 * Sitemap động — bao gồm trang tĩnh + farmstay + bài viết từ Sanity.
 * Webhook kích hoạt revalidatePath("/sitemap.xml") để làm mới ngay.
 */
import type { MetadataRoute } from "next";
import { FARMSTAYS } from "@/features/listing/data";
import { fetchPostSlugs } from "@/lib/sanity-queries";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "daily" },
    // /tim-kiem ĐÃ GỠ 19/08/2026 — trang kết quả tìm kiếm nội bộ nay là `noindex`,
    // sitemap chỉ được chứa URL indexable (trước đó khai với mức ưu tiên 0.9).
    { url: `${SITE_URL}/blog`, priority: 0.9, changeFrequency: "daily" },
    // Hai trụ nội dung cốt lõi — thêm 08/08/2026
    {
      url: `${SITE_URL}/tour-farmstay`,
      priority: 0.9,
      changeFrequency: "weekly",
    },
    {
      url: `${SITE_URL}/farmstay-la-gi`,
      priority: 0.9,
      changeFrequency: "monthly",
    },
    // Cửa vào của chủ farmstay — trước 08/08/2026 bị SÓT khỏi sitemap dù là trang cốt lõi
    {
      url: `${SITE_URL}/chu-farmstay`,
      priority: 0.8,
      changeFrequency: "monthly",
    },
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
    // Hai trang niềm tin — thêm 19/08/2026
    { url: `${SITE_URL}/lien-he`, priority: 0.5, changeFrequency: "monthly" },
    {
      url: `${SITE_URL}/chinh-sach-bien-tap`,
      priority: 0.5,
      changeFrequency: "monthly",
    },
  ];

  // Farmstay pages từ static data
  const farmstayPages: MetadataRoute.Sitemap = FARMSTAYS.map((f) => ({
    url: `${SITE_URL}/farmstay/${f.slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
  }));

  // Blog pages — CHỈ lấy từ Sanity.
  //
  // ⚠️ 19/08/2026 gỡ nhánh dự phòng `MOCK_POSTS`: sáu bài mẫu không có thân bài
  // (render ra "Nội dung đang được cập nhật...") nhưng vẫn được mời Google vào
  // index qua sitemap. Sitemap chỉ được chứa URL đáng index; bài mẫu nay mang
  // `noindex` nên càng không có chỗ ở đây. Khi Sanity có bài thật, nhánh này tự sống lại.
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const source = await fetchPostSlugs();

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
