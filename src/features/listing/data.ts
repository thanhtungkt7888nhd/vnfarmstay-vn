import type { Farmstay } from "@/shared/types/farmstay";

/**
 * Danh sách farmstay có thật của vnfarmstay.vn.
 *
 * ⚠️ CỐ Ý ĐỂ RỖNG — Ông ra lệnh 08/08/2026 xoá sạch 15 farmstay BỊA thừa hưởng từ
 * khung web cũ (Đồi Chè Sunrise Mộc Châu, Ruộng Bậc Thang Heritage Farm, Vườn Cà Phê
 * Robusta Kon Tum...). Chúng có cả giá tiền, số sao, "127 đánh giá" và huy hiệu
 * "đã xác minh" — toàn bộ đều tự chế, không có farmstay thật nào đứng sau.
 *
 * CẤM đổ dữ liệu mẫu vào đây để "trang chủ đỡ trống". Mảng rỗng thì mọi khối danh
 * sách trên trang chủ / tìm kiếm / sitemap tự ẩn — đó là hành vi đúng. Chỉ thêm vào
 * khi có farmstay THẬT được Ông xác nhận (tên · tỉnh · link web riêng).
 */
export const FARMSTAYS: Farmstay[] = [];
