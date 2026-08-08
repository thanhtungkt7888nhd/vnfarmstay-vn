export interface Farmstay {
  id: string;
  slug: string;
  name: string;
  location: string;
  province: string;
  region: "north" | "central" | "south";
  tags: string[];
  price: number;
  /**
   * ⚠️ 3 trường dưới đây thành TUỲ CHỌN từ 08/08/2026 theo lệnh Ông.
   * vnfarmstay.vn KHÔNG có chức năng nhận đánh giá và KHÔNG có quy trình xác minh
   * farmstay, nên không tồn tại nguồn thật nào cấp `rating`, `reviewCount` hay huy
   * hiệu "verified". Bộ số cũ (4.9★ · 127 đánh giá · badge "XÁC MINH") là tự chế.
   * Thiếu thì mọi khối liên quan TỰ ẨN. CẤM điền số tự nghĩ ra cho đủ chỗ trống.
   */
  rating?: number;
  reviewCount?: number;
  badges?: Array<"verified" | "new" | "featured">;
  emoji: string;
  lat: number;
  lng: number;
}

export interface MapLocation {
  lat: number;
  lng: number;
  name: string;
  price: string;
  rating: string;
}
