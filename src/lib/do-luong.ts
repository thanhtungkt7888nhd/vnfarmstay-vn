/**
 * MỘT CỬA DUY NHẤT để ghi nhận sự kiện đo lường.
 *
 * Vì sao phải gom về đây thay vì gọi `gtag(...)` rải rác trong từng thành phần
 * giao diện:
 *   1. Tên sự kiện được khai một chỗ, không có chuyện cùng một hành vi bị đặt hai
 *      tên khác nhau ở hai trang rồi số liệu tách làm đôi.
 *   2. Cổng đồng ý PDPL nằm ở đúng một chỗ. Người dùng chưa đồng ý ⇒ `gtag` không
 *      tồn tại ⇒ hàm này im lặng bỏ qua. Rải lệnh đo trong giao diện thì sớm muộn
 *      sẽ có chỗ lọt ra ngoài cổng đồng ý.
 *   3. Ngày đổi nhà cung cấp đo lường, chỉ sửa tệp này.
 *
 * ⚠️ Hàm này KHÔNG bao giờ được làm hỏng luồng người dùng. Mọi lỗi bị nuốt —
 * không ghi được số liệu là chuyện nhỏ, chặn người dùng bấm nút mới là chuyện lớn.
 */

/** Danh mục sự kiện — thêm tên mới thì thêm vào đây, không gõ chuỗi tự do. */
export type TenSuKien =
  /** Người dùng tìm kiếm farmstay */
  | "farmstay_search"
  /** Bấm một bộ lọc trong danh bạ */
  | "filter_applied"
  /** Mở một hồ sơ farmstay */
  | "farmstay_profile_view"
  /** Mở một trang vùng hoặc tuyến hành trình */
  | "route_view"
  /** Bấm sang một điểm đến liên quan trong khối "Điểm đến tiếp theo" */
  | "related_destination_click"
  /** Bấm kênh liên hệ trực tiếp của farmstay (điện thoại, Zalo, thư) */
  | "direct_contact_click"
  /** Bấm sang trang đặt phòng riêng của farmstay */
  | "external_booking_click"
  /** Bấm lời mời gia nhập hệ sinh thái */
  | "join_ecosystem_cta_click"
  /** Gửi biểu mẫu giới thiệu farmstay */
  | "join_form_submit"
  /** Từ một bài viết bấm sang hồ sơ farmstay */
  | "story_to_profile_click";

type ThamSo = Record<string, string | number | boolean | undefined>;

interface CuaSoCoGtag extends Window {
  gtag?: (lenh: string, ten: string, thamSo?: ThamSo) => void;
}

/**
 * Hàng đợi tạm cho sự kiện bắn ra TRƯỚC khi thư viện đo lường kịp nạp.
 *
 * ⚠️ Có hàng đợi này vì một khe hở đo được 19/08/2026: sự kiện `route_view` bắn ngay
 * lúc trang gắn vào DOM, còn `gtag` chỉ tồn tại sau khi cổng đồng ý nạp xong script
 * GA4 (chiến lược `afterInteractive`). Không có hàng đợi thì sự kiện xem trang —
 * đúng cái sự kiện quan trọng nhất — luôn rơi mất.
 *
 * Có giới hạn cứng: tối đa 20 sự kiện và 15 giây chờ. Người dùng TỪ CHỐI đo lường
 * thì `gtag` không bao giờ xuất hiện, và hàng đợi phải tự tan chứ không được phình
 * mãi hay chờ mãi.
 */
const hangDoi: Array<[TenSuKien, ThamSo | undefined]> = [];
const TRAN_HANG_DOI = 20;
const HAN_CHO_MS = 15_000;
let dangCho = false;

function coGtag(): ((l: string, t: string, p?: ThamSo) => void) | null {
  if (typeof window === "undefined") return null;
  const g = (window as CuaSoCoGtag).gtag;
  return typeof g === "function" ? g : null;
}

function batDauCho(): void {
  if (dangCho) return;
  dangCho = true;
  const batDau = Date.now();
  const nhip = window.setInterval(() => {
    const g = coGtag();
    if (g) {
      window.clearInterval(nhip);
      dangCho = false;
      for (const [ten, thamSo] of hangDoi.splice(0)) {
        try {
          g("event", ten, thamSo);
        } catch {
          /* bỏ qua */
        }
      }
      return;
    }
    if (Date.now() - batDau > HAN_CHO_MS) {
      window.clearInterval(nhip);
      dangCho = false;
      hangDoi.length = 0; // người dùng đã từ chối đo lường — dọn sạch, không giữ
    }
  }, 500);
}

/**
 * Ghi nhận một sự kiện.
 *
 * Chạy phía máy chủ ⇒ bỏ qua. Thư viện đo lường chưa nạp ⇒ xếp hàng đợi và bắn
 * bù khi nó xuất hiện. Người dùng từ chối đo lường ⇒ hàng đợi tự tan sau 15 giây.
 * Mọi lỗi đều bị nuốt: không đo được là chuyện nhỏ, chặn thao tác người dùng là
 * chuyện lớn.
 */
export function ghiNhan(ten: TenSuKien, thamSo?: ThamSo): void {
  if (typeof window === "undefined") return;
  const g = coGtag();
  if (g) {
    try {
      g("event", ten, thamSo);
    } catch {
      /* Không bao giờ để việc đo lường làm hỏng thao tác của người dùng. */
    }
    return;
  }
  if (hangDoi.length < TRAN_HANG_DOI) hangDoi.push([ten, thamSo]);
  batDauCho();
}

/**
 * Trình xử lý bấm chuột dùng sẵn cho thẻ liên kết.
 * Dùng dạng `onClick={khiBam("related_destination_click", { den: slug })}`.
 */
export function khiBam(ten: TenSuKien, thamSo?: ThamSo) {
  return () => ghiNhan(ten, thamSo);
}
