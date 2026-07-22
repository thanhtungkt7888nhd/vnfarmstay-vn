/**
 * Sanity webhook → revalidate Next.js cache + ping IndexNow.
 * Hỗ trợ cả farmstay listing và blog post (phân biệt qua _type).
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

const SITE_URL = "https://vnfarmstay.vn";
const SITE_HOST = "vnfarmstay.vn";

/** Ping IndexNow để Google/Bing index URL mới ngay lập tức */
async function pingIndexNow(url: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;
  try {
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: SITE_HOST,
        key,
        keyLocation: `${SITE_URL}/${key}.txt`,
        urlList: [url, `${SITE_URL}/sitemap.xml`, `${SITE_URL}/rss.xml`],
      }),
    });
  } catch {
    // Ping thất bại — không crash webhook
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const docType: string = body?._type ?? "unknown";
    const slug: string = body?.slug?.current ?? body?.slug ?? "";

    // Revalidate chung (sitemap, RSS)
    revalidatePath("/sitemap.xml", "page");
    revalidatePath("/rss.xml", "page");

    if (docType === "post" || (!docType && body?.content)) {
      // Blog post được update
      if (slug) {
        revalidatePath(`/blog/${slug}`, "page");
        revalidateTag(`post:${slug}`, "default");
        await pingIndexNow(`${SITE_URL}/blog/${slug}`);
      }
      revalidatePath("/blog", "page");
      // Revalidate category pages
      const category: string = body?.category ?? "";
      if (category) {
        revalidatePath(`/danh-muc/${category}`, "page");
      }
    } else {
      // Farmstay listing được update (mặc định)
      if (slug) {
        revalidatePath(`/farmstay/${slug}`, "page");
        await pingIndexNow(`${SITE_URL}/farmstay/${slug}`);
      }
      revalidatePath("/", "page");
      revalidatePath("/tim-kiem", "page");
    }

    return NextResponse.json({ ok: true, type: docType, slug: slug || null });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
