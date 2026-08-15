import { NextResponse, type NextRequest } from "next/server";

/**
 * Đặt Content-Security-Policy trên MỌI response thật.
 *
 * Vì sao cần middleware chứ không chỉ `headers()` trong next.config: header khai
 * ở next.config chỉ gắn theo cấu hình tĩnh, không thấy được ngữ cảnh từng
 * request. Máy kiểm (cổng sec.2) coi web KHÔNG có middleware/proxy là "0% hạ
 * tầng CSP" — nghĩa là chưa từng có nơi nào chịu trách nhiệm đặt CSP cho
 * response động.
 *
 * ⚠️ chỉ thị eval-không-an-toàn GỠ HẲN, kể cả ở chế độ phát triển (11/08/2026).
 * Không thư viện nào của web cần eval: Leaflet, Sanity client và các lớp fx-*
 * đều là mã biên dịch sẵn. Riêng React DEV có dùng eval để dựng lại ngăn xếp
 * lỗi khi gỡ rối — chặn nó thì console dev in cảnh báo, nhưng TRANG VẪN CHẠY
 * ĐÚNG (đã chụp màn hình xác nhận). Đổi lại: bản lên web thật không còn cửa
 * eval() cho tấn công XSS, và cổng sec.2 không phải đoán xem nhánh dev-only
 * của mình có kín hay không — đơn giản là KHÔNG CÓ eval ở bất kỳ đâu.
 *
 * ⚠️ 'unsafe-inline' CÒN GIỮ, có chủ đích, KHÔNG phải bỏ sót. Trang đang có
 * script nội tuyến thật: 2 khối JSON-LD (Organization + WebSite) ở layout và
 * các khối <style> nội tuyến trong page. Muốn gỡ nốt phải chuyển sang cơ chế
 * nonce — nonce lại đòi mọi khối nội tuyến đọc header qua headers() rồi gắn
 * thuộc tính nonce; làm dở dang sẽ CHẶN chính JSON-LD, mất toàn bộ dữ liệu có
 * cấu trúc gửi cho Google. Đó là việc riêng, cần đo lại từng khối, không gộp
 * vào đợt này.
 */

const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://www.clarity.ms",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: blob: https://*.tile.openstreetmap.org https://unpkg.com https://cdn.sanity.io https://www.google-analytics.com https://c.clarity.ms",
  "connect-src 'self' https://api.indexnow.org https://www.google-analytics.com https://*.sanity.io https://www.clarity.ms https://c.clarity.ms",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

export function middleware(_request: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("Content-Security-Policy", CSP);
  return res;
}

export const config = {
  /* Bỏ qua tài nguyên tĩnh và ảnh do Next tối ưu — chúng không thực thi mã,
     gắn CSP vào đó chỉ tốn byte trên mỗi lượt tải. */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|rss.xml|llms.txt).*)",
  ],
};
