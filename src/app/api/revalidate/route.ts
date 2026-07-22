/**
 * Webhook handler từ Sanity → revalidate ISR cache → ping IndexNow.
 * Bảo vệ bằng 2 lớp: HMAC signature (Sanity webhook secret) + fallback secret query param.
 * Sau khi Sanity publish bài, cache trang blog tương ứng bị xoá ngay lập tức.
 */
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";
/** Sanity webhook signing secret — lấy từ Sanity dashboard > API > Webhooks */
const SANITY_WEBHOOK_SECRET = process.env.SANITY_WEBHOOK_SECRET ?? "";

/**
 * Xác minh HMAC-SHA256 signature từ Sanity webhook.
 * Sanity gửi header `sanity-webhook-signature` dạng: `t=<timestamp>,v1=<hmac>`
 */
async function verifySanitySignature(
  req: NextRequest,
  rawBody: string
): Promise<boolean> {
  if (!SANITY_WEBHOOK_SECRET) return false;

  const signatureHeader = req.headers.get("sanity-webhook-signature");
  if (!signatureHeader) return false;

  // Parse `t=<timestamp>,v1=<hmac>`
  const parts = Object.fromEntries(
    signatureHeader.split(",").map((p) => p.split("=") as [string, string])
  );
  const timestamp = parts["t"];
  const expectedHmac = parts["v1"];
  if (!timestamp || !expectedHmac) return false;

  // Payload = "<timestamp>.<rawBody>"
  const payload = `${timestamp}.${rawBody}`;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(SANITY_WEBHOOK_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  const computed = Buffer.from(signature).toString("hex");

  // Timing-safe comparison
  if (computed.length !== expectedHmac.length) return false;
  let diff = 0;
  for (let i = 0; i < computed.length; i++) {
    diff |= computed.charCodeAt(i) ^ expectedHmac.charCodeAt(i);
  }
  return diff === 0;
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();

  // Lớp 1: HMAC signature từ Sanity (ưu tiên)
  const signatureValid = await verifySanitySignature(req, rawBody);

  // Lớp 2: fallback secret query param (dùng khi test manual)
  const secret = req.nextUrl.searchParams.get("secret");
  const secretValid = REVALIDATE_SECRET && secret === REVALIDATE_SECRET;

  if (!signatureValid && !secretValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = JSON.parse(rawBody);
    const { _type, slug } = body as unknown as {
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

  const url = `https://vnfarmstay.vn/blog/${slug}`;
  const body = {
    host: "vnfarmstay.vn",
    key,
    keyLocation: `https://vnfarmstay.vn/${key}.txt`,
    urlList: [url],
  };

  await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
