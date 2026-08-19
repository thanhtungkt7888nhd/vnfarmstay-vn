import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ⚠️ /tim-kiem CỐ Ý KHÔNG chặn ở đây. Nó đã mang `noindex, follow` trong
      // metadata, và đã gỡ khỏi sitemap. Chặn thêm bằng robots.txt sẽ phản tác dụng:
      // máy không vào được trang thì cũng không đọc được thẻ `noindex`, nên URL đã
      // trót lọt vào chỉ mục sẽ nằm lại đó vĩnh viễn. Chọn một cơ chế, không chọn cả hai.
      { userAgent: "*", allow: "/", disallow: ["/api/", "/admin/"] },
      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
