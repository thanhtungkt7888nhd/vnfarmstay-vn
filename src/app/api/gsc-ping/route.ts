/**
 * Route /api/gsc-ping — submit URL mới lên Google Search Console Indexing API.
 * Dùng sau khi publish bài viết mới, kết hợp với IndexNow để tối đa tốc độ index.
 *
 * POST body: { url: string }
 * Header: x-secret = REVALIDATE_SECRET
 *
 * Lưu ý: Cần GSC_SERVICE_ACCOUNT_JSON (JSON key của Google Service Account)
 * có quyền "Owner" trên Google Search Console property farmstay.vn.
 */
import { NextRequest, NextResponse } from "next/server";

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET ?? "";

/** Validate và gọi Google Indexing API cho 1 URL */
async function requestGoogleIndex(url: string): Promise<{ status: number }> {
  const serviceAccountJson = process.env.GSC_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountJson) {
    return { status: 503 }; // Service account chưa config
  }

  // Parse service account credentials
  let credentials: {
    client_email: string;
    private_key: string;
  };
  try {
    credentials = JSON.parse(serviceAccountJson);
  } catch {
    return { status: 500 };
  }

  // Tạo JWT để lấy access token (Google OAuth2)
  const token = await getGoogleAccessToken(
    credentials.client_email,
    credentials.private_key
  );
  if (!token) return { status: 401 };

  const res = await fetch(
    "https://indexing.googleapis.com/v3/urlNotifications:publish",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ url, type: "URL_UPDATED" }),
    }
  );

  return { status: res.status };
}

/** Tạo Google OAuth2 access token từ service account private key */
async function getGoogleAccessToken(
  clientEmail: string,
  privateKey: string
): Promise<string | null> {
  try {
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: clientEmail,
      scope: "https://www.googleapis.com/auth/indexing",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj))
        .toString("base64")
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");

    const signingInput = `${encode(header)}.${encode(payload)}`;

    // Import PEM private key
    const keyData = privateKey
      .replace(/-----BEGIN PRIVATE KEY-----/g, "")
      .replace(/-----END PRIVATE KEY-----/g, "")
      .replace(/\s/g, "");

    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      Buffer.from(keyData, "base64"),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"]
    );

    const signature = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      Buffer.from(signingInput)
    );

    const jwt = `${signingInput}.${Buffer.from(signature)
      .toString("base64")
      .replace(/=/g, "")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")}`;

    // Exchange JWT cho access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion=${jwt}`,
    });

    const data = (await tokenRes.json()) as { access_token?: string };
    return data.access_token ?? null;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  // Auth check
  const secret = req.headers.get("x-secret");
  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { url?: string; urls?: string[] };
  const urls: string[] = body.urls ?? (body.url ? [body.url] : []);

  if (urls.length === 0) {
    return NextResponse.json(
      { error: "url hoặc urls là bắt buộc" },
      { status: 400 }
    );
  }

  // Google Indexing API cho phép tối đa 200 URL/ngày
  const results = await Promise.all(
    urls.slice(0, 10).map(async (url) => {
      const { status } = await requestGoogleIndex(url);
      return { url, status };
    })
  );

  const allOk = results.every((r) => r.status < 400);
  return NextResponse.json(
    { submitted: results, count: results.length },
    { status: allOk ? 200 : 207 }
  );
}

/** GET — kiểm tra service account đã config chưa */
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-secret");
  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configured = !!process.env.GSC_SERVICE_ACCOUNT_JSON;
  return NextResponse.json({
    configured,
    message: configured
      ? "GSC service account đã config — sẵn sàng submit URL"
      : "Chưa có GSC_SERVICE_ACCOUNT_JSON. Xem hướng dẫn tại /ve-chung-toi#gsc-setup",
  });
}
