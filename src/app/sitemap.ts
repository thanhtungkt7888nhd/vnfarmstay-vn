import type { MetadataRoute } from "next";
import { FARMSTAYS } from "@/features/listing/data";

const SITE_URL = "https://farmstay.vn";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: SITE_URL, priority: 1.0, changeFrequency: "daily" as const },
    {
      url: `${SITE_URL}/tim-kiem`,
      priority: 0.9,
      changeFrequency: "daily" as const,
    },
    {
      url: `${SITE_URL}/cong-dong`,
      priority: 0.7,
      changeFrequency: "weekly" as const,
    },
    {
      url: `${SITE_URL}/phap-ly`,
      priority: 0.7,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${SITE_URL}/ve-chung-toi`,
      priority: 0.6,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${SITE_URL}/dang-farmstay`,
      priority: 0.8,
      changeFrequency: "monthly" as const,
    },
    {
      url: `${SITE_URL}/dieu-khoan`,
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
    {
      url: `${SITE_URL}/chinh-sach-bao-mat`,
      priority: 0.3,
      changeFrequency: "yearly" as const,
    },
  ];

  const farmstayPages = FARMSTAYS.map((f) => ({
    url: `${SITE_URL}/farmstay/${f.slug}`,
    priority: 0.8,
    changeFrequency: "weekly" as const,
    lastModified: new Date(),
  }));

  return [...staticPages, ...farmstayPages];
}
