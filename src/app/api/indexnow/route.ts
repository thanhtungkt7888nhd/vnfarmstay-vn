/**
 * IndexNow ping engine — gọi thủ công để submit batch URLs.
 * POST /api/indexnow với body { urls: string[] }
 * Bảo vệ bằng REVALIDATE_SECRET để tránh lạm dụng.
 */
import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const SITE = "https://vnfarmstay.vn";

/**
 * Trần dò mật khẩu: 10 lần SAI / 10 phút / IP. Chỉ đếm lần sai, nên lệnh ping thật
 * (có đúng x-secret) không bao giờ bị chặn dù gọi dồn.
 */
const TRAN_SAI = { tran: 10, cuaSoMs: 10 * 60 * 1000 };

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-secret");
  const expectedSecret = process.env.REVALIDATE_SECRET ?? "";

  if (!expectedSecret || secret !== expectedSecret) {
    if (!(await checkRateLimit(`indexnow-sai:${getClientIp(req)}`, TRAN_SAI))) {
      return NextResponse.json({ error: "Too Many Requests" }, { status: 429 });
    }
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const indexNowKey = process.env.INDEXNOW_KEY;
  if (!indexNowKey) {
    return NextResponse.json(
      { error: "INDEXNOW_KEY not set" },
      { status: 500 }
    );
  }

  const body = await req.json();
  const urls: string[] = Array.isArray(body.urls)
    ? body.urls.map((u: string) => (u.startsWith("http") ? u : `${SITE}${u}`))
    : [];

  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  const payload = {
    host: "vnfarmstay.vn",
    key: indexNowKey,
    keyLocation: `${SITE}/${indexNowKey}.txt`,
    urlList: urls,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return NextResponse.json({
    submitted: urls.length,
    indexNowStatus: res.status,
    urls,
  });
}

/** GET để lấy trạng thái key — giúp debug */
export async function GET() {
  const key = process.env.INDEXNOW_KEY;
  return NextResponse.json({
    configured: Boolean(key),
    keyLocation: key ? `${SITE}/${key}.txt` : null,
  });
}
