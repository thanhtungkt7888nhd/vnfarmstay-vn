/**
 * MỘT NGUỒN SỰ THẬT về "vnfarmstay.vn là gì".
 *
 * Trước file này, tên thương hiệu / mô tả / URL / quan hệ hệ sinh thái bị chép cứng
 * rải rác ở layout.tsx, seo.ts, schema.ts, sitemap.ts, Footer.tsx — nên Footer từng
 * ghi "Farmstay.vn" trong khi toàn site là "vnfarmstay.vn" (sai định danh thực thể).
 *
 * LUẬT: chỉ khai vào đây thứ CÓ THẬT và đã được Ông xác nhận. Không email/điện thoại/
 * mạng xã hội/giải thưởng/ngày thành lập bịa. Thiếu dữ liệu ⇒ để trống, KHÔNG đoán.
 */

/** URL canonical tuyệt đối, không có dấu / ở cuối. */
export const SITE_URL = "https://vnfarmstay.vn";

/** Tên chính thức — dùng ở mọi nơi hiển thị tên thương hiệu. */
export const SITE_NAME = "vnfarmstay.vn";

/** Tên thay thế — dùng cho schema `alternateName`, không dùng làm nhãn hiển thị chính. */
export const SITE_ALT_NAMES = ["VNFarmstay", "Vietnam Farmstay"];

/** Định vị một câu — dùng cho meta description, hero, footer, schema description. */
export const SITE_TAGLINE = "Hạ tầng chung của cộng đồng Farmstay Việt Nam";

/** Mô tả ngắn thống nhất — Google, mạng xã hội và trang Giới thiệu dùng CHUNG chuỗi này. */
export const SITE_DESCRIPTION =
  "Khám phá farmstay và trải nghiệm du lịch nông nghiệp Việt Nam; kết nối điểm đến, câu chuyện vùng đất và cộng đồng chủ farmstay — liên hệ trực tiếp với nơi bạn chọn.";

/** Đoạn nói rõ ranh giới sản phẩm — dùng cho khối "là gì / không phải gì". */
export const SITE_BOUNDARY = {
  la: "Hạ tầng nội dung và dữ liệu của cộng đồng Farmstay Việt Nam — nơi chuẩn hoá hồ sơ điểm đến, kể câu chuyện vùng đất và nối các farmstay theo vùng, mùa, chủ đề và tuyến hành trình.",
  khongPhai:
    "Không phải sàn đặt phòng, không bán tour, không thu hoa hồng, không giữ tiền và không sở hữu dữ liệu hay khách hàng của thành viên.",
  khachDatODau:
    "Khách liên hệ và đặt trực tiếp với farmstay, theo giá và điều kiện của chính farmstay đó.",
} as const;

/** Logo chính thức (đường dẫn trong /public). */
export const SITE_LOGO = "/logo-x.png";

/** Ảnh mạng xã hội mặc định — sinh động qua /api/og, giữ ở một chỗ để không lệch nhau. */
export const DEFAULT_OG_IMAGE = `/api/og?title=${encodeURIComponent(
  SITE_NAME
)}&subtitle=${encodeURIComponent(SITE_TAGLINE)}`;

/**
 * Hồ sơ mạng xã hội CHÍNH THỨC của chính thực thể này.
 *
 * ⚠️ CỐ Ý RỖNG. 08/08/2026 Ông xác nhận facebook.com/farmstayvn và instagram.com/farmstayvn
 * là của thương hiệu KHÁC. Chỉ điền vào đây khi có trang thật do Ông xác nhận —
 * `sameAs` sai nghĩa là khai man danh tính thực thể với Google.
 */
export const SITE_SAME_AS: string[] = [];

/**
 * Kênh liên hệ đã xác nhận. Rỗng ⇒ schema KHÔNG khai `contactPoint`/`email`/`telephone`,
 * và trang /lien-he nói thẳng là kênh đang được mở, thay vì bịa một số hotline.
 */
export const SITE_CONTACT: {
  email?: string;
  telephone?: string;
  addressLocality?: string;
} = {};

/**
 * Các thương hiệu trong hệ sinh thái.
 *
 * ⚠️ ĐÂY KHÔNG PHẢI `sameAs`. `sameAs` chỉ dùng khi đó thực sự là CÙNG MỘT thực thể.
 * Các web dưới đây là thực thể KHÁC, có vai trò khác — thể hiện quan hệ bằng nội dung
 * hiển thị cho người đọc và liên kết có ngữ cảnh, không ép bằng schema sai nghĩa.
 */
export const ECOSYSTEM = [
  {
    url: "https://nhahoachdinh.vn",
    label: "Nhà Hoạch Định",
    vaiTro: "Tư duy và tri thức hoạch định farmstay của người khởi xướng",
  },
  {
    url: "https://hoachdinhmastery.vn",
    label: "Hoạch Định Mastery",
    vaiTro: "Đơn vị tư vấn chiến lược cho tổ chức và địa phương",
  },
  {
    url: "https://xuyenvietfarmstay.vn",
    label: "Xuyên Việt Farmstay",
    vaiTro: "Hành trình thực địa và sự kiện cộng đồng của ngành",
  },
] as const;

/** Mã định danh schema ổn định — tuyệt đối không đổi sau khi đã được Google đọc. */
export const SCHEMA_ID = {
  organization: `${SITE_URL}/#organization`,
  website: `${SITE_URL}/#website`,
  /** @id của một trang bất kỳ — luôn là URL canonical + "#webpage" */
  webPage: (path: string) => `${SITE_URL}${path}#webpage`,
} as const;

/** Ghép URL tuyệt đối từ đường dẫn tương đối, chịu được cả khi đã là URL đầy đủ. */
export function absUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
