/**
 * HUY HIỆU NHÚNG cho farm — chủ farm gắn lên web riêng của họ (Trụ D, việc D3).
 *
 * Trả về một ảnh SVG SINH RA TỪ TRẠNG THÁI SỐNG, không phải tệp ảnh tĩnh.
 * Đây là điểm cốt tử của cả việc D3: **huy hiệu phải thu hồi được**. Nếu ta phát
 * một tệp ảnh cho chủ farm tải về, thì ngày farm bị hạ cấp hoặc bị gỡ hồ sơ, họ vẫn
 * đeo huy hiệu của ta mãi mãi — mất kiểm soát danh tiếng, và ta thành kẻ bảo chứng
 * cho thứ mình không còn bảo chứng.
 *
 * Ba luật cứng:
 * ① **Chỉ cấp cho cấp 3 trở lên** (đã khảo sát thực địa). Cấp 1–2 gọi vào đây trả
 *    404 — không phải ảnh "chưa đủ điều kiện", mà là KHÔNG CÓ GÌ để đeo.
 * ② **Ghi ĐÚNG CẤP**, không ghi chung chung "đã xác minh" — điều cấm số 2 của trụ D.
 * ③ **Không cho bộ nhớ đệm giữ lâu.** Huy hiệu đọc trạng thái sống mà bị đệm một
 *    tháng thì lại thành ảnh chết, hỏng đúng thứ nó sinh ra để giải quyết.
 */
import { FARMSTAYS } from "@/features/listing/data";
import { nhanCapXacMinh } from "@/shared/utils/format";
import { SITE_URL } from "@/lib/site";

/** Cấp tối thiểu được đeo huy hiệu — đã khảo sát thực địa */
const CAP_TOI_THIEU = 3;

/** Thoát ký tự để tên farm không phá cấu trúc XML của ảnh */
function thoatXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Cắt tên dài để không tràn khỏi khung huy hiệu */
function catTen(s: string, tran = 30): string {
  return s.length > tran ? s.slice(0, tran - 1) + "…" : s;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const farm = FARMSTAYS.find((f) => f.slug === slug);

  /* ① Không có hồ sơ, hoặc chưa đủ cấp ⇒ KHÔNG phát gì.
        Hồ sơ bị gỡ hay bị hạ cấp thì huy hiệu đang nhúng trên web farm tự tắt. */
  if (!farm || farm.capXacMinh < CAP_TOI_THIEU) {
    return new Response("Không có huy hiệu cho hồ sơ này.", {
      status: 404,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
      },
    });
  }

  const cap = nhanCapXacMinh(farm.capXacMinh);
  const ten = thoatXml(catTen(farm.ten));
  /* ② Ghi ĐÚNG CẤP — cấm nhãn chung chung "đã xác minh" */
  const dongCap = thoatXml(cap.nhanDay);

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="260" height="72" viewBox="0 0 260 72" role="img" aria-label="${ten} — ${dongCap}, xác minh bởi vnfarmstay.vn">
  <title>${ten} — ${dongCap}</title>
  <rect width="260" height="72" rx="8" fill="#0f2318"/>
  <rect x="0.5" y="0.5" width="259" height="71" rx="7.5" fill="none" stroke="#c4a046" stroke-opacity="0.45"/>
  <text x="16" y="24" font-family="Georgia,serif" font-size="13" font-weight="700" fill="#e8d5a3">${ten}</text>
  <text x="16" y="42" font-family="Helvetica,Arial,sans-serif" font-size="9.5" fill="#8aab94">${dongCap}</text>
  <text x="16" y="59" font-family="Helvetica,Arial,sans-serif" font-size="9" letter-spacing="0.5" fill="#c4a046">vnfarmstay.vn · rà soát ${thoatXml(farm.ngayRaSoat)}</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      /* ③ Đệm ngắn: đủ nhẹ tải, đủ nhanh để việc hạ cấp có hiệu lực trong ngày */
      "Cache-Control": "public, max-age=600, stale-while-revalidate=600",
      "X-Ho-So": `${SITE_URL}/farmstay/${farm.slug}`,
    },
  });
}
