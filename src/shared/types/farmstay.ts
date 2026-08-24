/**
 * HỘ CHIẾU SỐ FARMSTAY — hình dạng dữ liệu của vnfarmstay.vn.
 *
 * ⚠️ Đổi hình dạng 24/08/2026 (Trụ A). Bản cũ là cấu trúc SÀN ĐẶT PHÒNG
 * (`price` · `rating` · `reviewCount` · `badges` · `emoji` · `region` 3 miền) —
 * đúng thứ Master Prompt tuyên bố web KHÔNG PHẢI. Hình dạng dữ liệu quyết định web
 * LÀ CÁI GÌ (Điều VII hiến pháp), nên bộ trường kiểu sàn phải biến mất khỏi kiểu,
 * không phải chỉ ẩn khỏi giao diện.
 *
 * Ba thứ bị bỏ hẳn và lý do:
 * - `rating`/`reviewCount` — web không có chức năng nhận đánh giá, không nguồn thật nào cấp.
 * - `badges: "verified"` — huy hiệu nhị phân đã bị bịa một lần; thay bằng `capXacMinh` 4 cấp.
 * - `emoji` — làm hình đại diện trái luật thiết kế dự án; thay bằng ảnh thực địa.
 * - `region: north|central|south` — 3 miền ĐÁNH NHAU với 9 vùng trải nghiệm web đang chạy;
 *   giữ song song hai hệ phân vùng là mầm lỗi im lặng (trục địa lý đứt mà build vẫn xanh).
 */

/** Bốn cấp xác minh — mỗi cấp kèm bằng chứng riêng, xem `/phuong-phap-xac-minh` */
export type CapXacMinh = 1 | 2 | 3 | 4;

/** Dữ kiện lấy từ đâu — để mọi trường truy được về nguồn (Điều IV hiến pháp) */
export type NguonDuKien =
  | "thuc-dia"
  | "google-business"
  | "web-farm"
  | "zalo"
  | "chu-farm-khai";

/** Kênh liên hệ TRỰC TIẾP với chủ farm — mục tiêu chuyển đổi số một của cả web */
export type LoaiKenhLienHe =
  | "zalo"
  | "dien-thoai"
  | "web-rieng"
  | "google-business";

export interface KenhLienHe {
  loai: LoaiKenhLienHe;
  /** Số điện thoại, đường dẫn Zalo, hoặc địa chỉ web — thứ khách bấm vào là tới chủ farm */
  giaTri: string;
  /** Chữ hiện trên nút, ví dụ "Nhắn Zalo cho anh Tùng" */
  nhan?: string;
}

/** Ảnh thực địa — CẤM ảnh minh hoạ lấy trên mạng (Master Prompt, trường bắt buộc số 9) */
export interface AnhThucDia {
  url: string;
  /** Chữ thay ảnh — bắt buộc, vừa cho người khiếm thị vừa cho máy tìm kiếm */
  moTa: string;
  /** Ai chụp — chủ farm hay đoàn khảo sát; để truy được nguồn */
  nguoiChup?: string;
}

/**
 * Một mùa trong lịch mùa vụ của farm.
 * ⛔ CẤM ghi "mùa nào cũng đẹp" — Master Prompt đòi cụ thể mùa nào có gì.
 */
export interface MucLichMuaVu {
  /** Mã mùa, phải nằm trong 4 mùa thật ở `src/features/kham-pha/data.ts` */
  muaSlug: string;
  /** Mùa này farm có gì — việc làm được, cảnh thấy được, nông sản thu được */
  coGi: string;
}

export interface Farmstay {
  // ── Nhóm 1 — Định danh ──────────────────────────────────────────────
  id: string;
  slug: string;
  ten: string;
  tinh: string;
  /** Địa chỉ hiển thị cho khách — xã/huyện, không cần số nhà */
  diaChi: string;

  // ── Nhóm 2 — Vị trí trong hệ sinh thái ──────────────────────────────
  /** Một trong 9 mã vùng CÓ THẬT ở `src/features/vung/data.ts` — van chặn mã bịa */
  vungSlug: string;
  toaDo: { viDo: number; kinhDo: number };
  /** Nối vào 6 trang trải nghiệm — mã phải có thật trong `TRAI_NGHIEM` */
  traiNghiemSlugs: string[];
  /** Nối vào 4 trang mùa — mã phải có thật trong `MUA` */
  muaSlugs: string[];

  // ── Nhóm 3 — Nội dung hồ sơ ─────────────────────────────────────────
  /** Câu chuyện chủ farm, NGÔI THỨ NHẤT, giọng bản địa — không văn mẫu */
  cauChuyen: string;
  lichMuaVu: MucLichMuaVu[];
  /** Quãng đường từ trung tâm huyện + phương tiện đi được */
  duongDi: string;
  /** Điều nên và không nên tại chỗ — tôn trọng văn hoá bản địa */
  ungXu: string;
  /** Ảnh thực địa, bắt buộc ≥1 */
  anh: AnhThucDia[];

  // ── Nhóm 4 — Liên hệ trực tiếp ──────────────────────────────────────
  /** Bắt buộc ≥2 kênh. Web KHÔNG nhận đặt phòng — chỉ dẫn khách về chủ farm */
  lienHe: KenhLienHe[];

  // ── Nhóm 5 — Xác minh & xuất xứ ─────────────────────────────────────
  capXacMinh: CapXacMinh;
  nguon: NguonDuKien;
  /** Ngày lấy dữ kiện, dạng YYYY-MM-DD */
  ngayDo: string;
  /** Lần rà soát gần nhất, dạng YYYY-MM-DD — quá 6 tháng thì hạ nhãn */
  ngayRaSoat: string;

  // ── Tuỳ chọn ────────────────────────────────────────────────────────
  /** Thẻ phân loại tự do, dùng cho tìm kiếm */
  the?: string[];
  /**
   * Giá THAM KHẢO dạng khoảng, kèm ngày cập nhật.
   * ⚠️ Cố ý KHÔNG phải một con số: giá đổi liên tục, con số cứng sẽ nói dối.
   * Web không bán phòng — đây chỉ là dữ kiện tham khảo cho khách chuẩn bị.
   */
  giaThamKhao?: { tuVND: number; denVND: number; ngayCapNhat: string };
}

/** Điểm trên bản đồ — dữ liệu tối thiểu để vẽ, không kèm giá/sao */
export interface MapLocation {
  viDo: number;
  kinhDo: number;
  ten: string;
  slug: string;
  /** Tên vùng hiện trong bong bóng khi bấm vào điểm */
  tenVung: string;
}
