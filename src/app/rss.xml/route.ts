/**
 * RSS feed — /rss.xml — tự động cập nhật từ Sanity posts.
 * Dùng mock data khi Sanity chưa cấu hình.
 * Cache 1 giờ (ISR).
 */
import { NextResponse } from "next/server";
import { fetchPosts, isSanityConfigured } from "@/lib/sanity-queries";
import { MOCK_POSTS } from "@/features/blog/mock-posts";

export const revalidate = 3600;

const SITE = "https://vnfarmstay.vn";

/** Escape XML special characters */
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const livePosts = await fetchPosts();
  const nguon = isSanityConfigured() ? livePosts : MOCK_POSTS;

  /**
   * Chỉ phát bài CÓ THÂN BÀI THẬT (19/08/2026).
   *
   * ⚠️ Bắt được trong lượt rà trước khi đưa lên web thật: nguồn tin này đang đẩy
   * đủ 6 bài mẫu ra ngoài, trong khi chính những bài ấy chỉ hiện một dòng
   * "Nội dung đang được cập nhật...", đã mang `noindex` và đã bị gỡ khỏi sitemap.
   * Nguồn tin đi tới trình đọc tin và các dịch vụ tổng hợp — để lọt là phát tán
   * trang rỗng dưới danh nghĩa bài viết, đúng thứ hai cửa kia vừa chặn.
   */
  const posts = nguon.filter(
    (p) => Array.isArray(p.content) && p.content.length > 0
  );

  const items = posts
    .slice(0, 20)
    .map((post) => {
      const url = `${SITE}/blog/${post.slug.current}`;
      const date = post.publishedAt
        ? new Date(post.publishedAt).toUTCString()
        : new Date().toUTCString();
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.excerpt ?? "")}</description>
      <pubDate>${date}</pubDate>
      ${post.author ? `<author>${escapeXml(post.author)}</author>` : ""}
      ${post.category ? `<category>${escapeXml(post.category)}</category>` : ""}
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>vnfarmstay.vn — Blog &amp; Hướng dẫn</title>
    <link>${SITE}</link>
    <description>Kinh nghiệm vận hành farmstay, hướng dẫn pháp lý, review địa điểm và tin tức nông nghiệp du lịch Việt Nam.</description>
    <language>vi-VN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${SITE}/logo.png</url>
      <title>vnfarmstay.vn</title>
      <link>${SITE}</link>
    </image>
${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/rss+xml; charset=UTF-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
