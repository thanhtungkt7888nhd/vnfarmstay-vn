import type { CapXacMinh } from "@/shared/types/farmstay";

/**
 * Nhãn của bốn cấp xác minh.
 *
 * ⚠️ Thay cho `badgeLabel()` cũ (24/08/2026, Trụ A). Nhãn cũ chỉ có "XÁC MINH" —
 * một huy hiệu nhị phân có/không, đúng thứ đã bị bịa một lần ở web này.
 *
 * Mỗi cấp PHẢI nói cả thứ nó KHÔNG bảo đảm. Trung thực về giới hạn làm tăng độ tin,
 * và tránh việc khách hiểu nhãn rộng hơn thứ ta thật sự kiểm được (Điều V hiến pháp).
 */
const CAP_XAC_MINH: Record<
  CapXacMinh,
  { nhanNgan: string; nhanDay: string; khongBaoDam: string }
> = {
  1: {
    nhanNgan: "CẤP 1",
    nhanDay: "Thông tin do cơ sở cung cấp — Đã kiểm tra liên hệ",
    khongBaoDam:
      "Chưa có đoàn nào tới tận nơi. Cảnh quan, tiện nghi và chất lượng lưu trú chưa được kiểm chứng.",
  },
  2: {
    nhanNgan: "CẤP 2",
    nhanDay: "Đã rà soát hồ sơ từ xa",
    khongBaoDam:
      "Rà qua gọi video và ảnh vệ tinh. Chưa kiểm được thứ chỉ thấy khi tới nơi: vệ sinh, an toàn, thái độ đón khách.",
  },
  3: {
    nhanNgan: "CẤP 3",
    nhanDay: "VNFarmstay Verified — Đã khảo sát thực địa",
    khongBaoDam:
      "Ghi nhận đúng tại ngày khảo sát. Không bảo đảm mọi thời điểm sau đó đều giữ nguyên trạng.",
  },
  4: {
    nhanNgan: "CẤP 4",
    nhanDay: "Điểm đến được chính quyền địa phương ghi nhận",
    khongBaoDam:
      "Ghi nhận về mặt hành chính, không phải xếp hạng chất lượng dịch vụ.",
  },
};

/** Lấy nhãn của một cấp xác minh — dùng cho thẻ, hồ sơ và dữ liệu có cấu trúc */
export function nhanCapXacMinh(cap: CapXacMinh) {
  return CAP_XAC_MINH[cap];
}

/**
 * Định dạng khoảng giá THAM KHẢO: 400000, 800000 → "400.000 – 800.000đ".
 * ⚠️ Cố ý nhận một KHOẢNG, không nhận một con số: web không bán phòng, và giá đổi
 * liên tục nên một con số cứng sẽ nói dối ngay hôm sau.
 */
export function dinhDangKhoangGia(tuVND: number, denVND: number): string {
  return `${tuVND.toLocaleString("vi-VN")} – ${denVND.toLocaleString("vi-VN")}đ`;
}
