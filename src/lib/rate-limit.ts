/**
 * Gờ giảm tốc theo IP cho các đường vào API — một chỗ duy nhất thay cho bản sao
 * trong từng route.
 *
 * ⚠️ Bộ đếm nằm trong BỘ NHỚ TIẾN TRÌNH. Trên Vercel mỗi tiến trình lạnh là bộ đếm
 * về 0, và hai tiến trình không thấy nhau — nên đây là GỜ GIẢM TỐC chống bấm nhầm,
 * gửi trùng và dò mật khẩu bằng tay, KHÔNG phải tường chống tấn công phân tán.
 * Ghi thẳng ra để không ai tưởng nhầm là đã có tường (Điều VI — không vỏ rỗng).
 *
 * Muốn thành tường thật: thay ruột hàm dưới bằng Upstash Redis (bản mẫu nhà máy ở
 * `05-TEMPLATE-CHUAN/src/lib/rate-limit.ts`) — chữ ký hàm đã là `Promise` sẵn nên
 * các chỗ gọi không phải sửa. Việc đó cần thêm thư viện vào package.json ⇒ chờ Ông.
 */

/** Trần suất: `tran` lượt trong mỗi cửa sổ `cuaSoMs` */
export type TranSuat = { tran: number; cuaSoMs: number };

const moc = new Map<string, number[]>();

/** Chặn Map phình vô hạn khi bị rải nhiều IP — dọn khoá đã hết hạn trước khi chặn */
const TRAN_SO_KHOA = 5000;

function don(gio: number): void {
  for (const [khoa, ds] of moc) {
    if (ds.length === 0 || gio - ds[ds.length - 1] > 24 * 60 * 60 * 1000) moc.delete(khoa);
  }
}

/**
 * Ghi nhận 1 lượt cho `khoa` rồi cho biết còn được phép hay không.
 * Trả `true` = còn trong trần, `false` = đã vượt (chỗ gọi nên trả HTTP 429).
 *
 * `khoa` phải gồm cả tên đường vào lẫn IP (vd `bao-sai:1.2.3.4`) để hai route
 * không ăn chung bộ đếm của nhau.
 */
export async function checkRateLimit(
  khoa: string,
  { tran, cuaSoMs }: TranSuat
): Promise<boolean> {
  const gio = Date.now();
  if (moc.size > TRAN_SO_KHOA) don(gio);

  const conHan = (moc.get(khoa) ?? []).filter((t) => gio - t < cuaSoMs);
  if (conHan.length >= tran) {
    moc.set(khoa, conHan);
    return false;
  }
  conHan.push(gio);
  moc.set(khoa, conHan);
  return true;
}

/** Lấy IP người gọi từ header (qua proxy/Vercel) */
export function getClientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "khong-ro"
  );
}
