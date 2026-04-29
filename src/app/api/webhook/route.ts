import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const SITE_URL = "https://farmstay.vn";
const SITE_HOST = "farmstay.vn";

/** Sanity webhook → revalidate Next.js cache + ping IndexNow */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const slug = body?.slug?.current ?? body?.slug;

    if (slug) {
      revalidatePath(`/farmstay/${slug}`);
      revalidatePath("/");
      revalidatePath("/tim-kiem");
    }
    revalidatePath("/sitemap.xml");

    // Ping IndexNow (Google + Bing + Cốc Cốc biết ngay)
    if (slug && process.env.INDEXNOW_KEY) {
      const url = slug.startsWith("http")
        ? slug
        : `${SITE_URL}/farmstay/${slug}`;
      await fetch("https://api.indexnow.org/indexnow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: SITE_HOST,
          key: process.env.INDEXNOW_KEY,
          urlList: [url, `${SITE_URL}/sitemap.xml`],
        }),
      });
    }

    return NextResponse.json({ ok: true, revalidated: slug });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
