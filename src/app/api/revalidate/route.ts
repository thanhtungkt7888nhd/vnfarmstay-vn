/**
 * Webhook handler từ Sanity → revalidate ISR cache → ping IndexNow.
 * URL: POST /api/revalidate?secret=REVALIDATE_SECRET
 * Sau khi Sanity publish bài, cache trang blog tương ứng bị xoá ngay lập tức.
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  // Bảo vệ endpoint
  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { _type, slug } = body as {
      _type?: string;
      slug?: { current?: string };
    };

    const paths: string[] = [];

    if (_type === "post") {
      const postSlug = slug?.current;
      if (postSlug) {
        revalidatePath(`/blog/${postSlug}`, "page");
        revalidateTag(`post:${postSlug}`, "default");
        paths.push(`/blog/${postSlug}`);
      }
      revalidatePath("/blog", "page");
      revalidatePath("/sitemap.xml", "page");
      paths.push("/blog");

      // Trigger IndexNow ping bất đồng bộ
      if (postSlug) {
        pingIndexNow(postSlug).catch(console.error);
      }
    } else if (_type === "farmstay") {
      const farmstaySlug = slug?.current;
      if (farmstaySlug) {
        revalidatePath(`/farmstay/${farmstaySlug}`, "page");
        paths.push(`/farmstay/${farmstaySlug}`);
      }
      revalidatePath("/tim-kiem", "page");
      paths.push("/tim-kiem");
    }

    return NextResponse.json({ revalidated: true, paths });
  } catch (err) {
    return NextResponse.json(
      { error: "Revalidation failed", detail: String(err) },
      { status: 500 }
    );
  }
}

/** Gọi IndexNow API để Bing/Yandex/Cốc Cốc index ngay */
async function pingIndexNow(slug: string): Promise<void> {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return;

  const url = `https://farmstay.vn/blog/${slug}`;
  const body = {
    host: "farmstay.vn",
    key,
    keyLocation: `https://farmstay.vn/${key}.txt`,
    urlList: [url],
  };

  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
