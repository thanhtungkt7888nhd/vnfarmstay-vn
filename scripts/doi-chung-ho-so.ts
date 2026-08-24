/**
 * MẪU ĐỐI CHỨNG HAI CHIỀU cho van kiểm hồ sơ farmstay.
 *
 * ⛔ TỆP NÀY NẰM NGOÀI `src/` LÀ CỐ Ý — không phải cho gọn thư mục.
 * Dự án đã trả giá: dữ liệu mẫu ghi rõ chữ "mẫu" VẪN LỌT LÊN WEB THẬT
 * (memory `lesson_du_lieu_mau_ghi_ro_la_mau_van_len_web_that`). Một dòng chú thích
 * "đừng dùng" không chặn được ai. Để ngoài `src/` thì Next.js không có đường nào
 * gói nó vào trang — chặn bằng CẤU TRÚC, không bằng lời dặn.
 *
 * Mỗi ca SAI phải kèm `chuoiPhaiCo` — van bắt được nhưng báo sai chỗ thì vẫn là van hỏng.
 */
import type { Farmstay } from "../src/shared/types/farmstay";

/** Hồ sơ ĐÚNG hoàn toàn — van phải IM LẶNG. Dữ kiện tự đặt, chỉ sống trong tệp này. */
const HO_SO_DUNG: Farmstay = {
  id: "doi-chung-01",
  slug: "doi-chung-ho-so-dung",
  ten: "Hồ sơ đối chứng — bản đúng",
  tinh: "Sơn La",
  diaChi: "Xã đối chứng, huyện đối chứng",
  vungSlug: "cao-nguyen-moc-chau",
  toaDo: { viDo: 20.84, kinhDo: 104.63 },
  traiNghiemSlugs: ["chan-nuoi-va-sua"],
  muaSlugs: ["dau-nam-mua-hoa"],
  cauChuyen: "Tôi về đây năm 2015, dựng lại vườn từ mảnh đồi bỏ hoang.",
  lichMuaVu: [
    {
      muaSlug: "dau-nam-mua-hoa",
      coGi: "Hoa mận nở trắng đồi, khách hái rau vụ đông.",
    },
  ],
  duongDi: "Cách trung tâm huyện 12km, đi xe máy hoặc ô tô con được cả năm.",
  ungXu:
    "Xin phép trước khi chụp ảnh người làm vườn; không hái quả khi chưa hỏi.",
  anh: [
    { url: "/images/doi-chung.jpg", moTa: "Đồi mận sau nhà, chụp tháng 2" },
  ],
  lienHe: [
    { loai: "zalo", giaTri: "0900000000" },
    { loai: "dien-thoai", giaTri: "0900000000" },
  ],
  capXacMinh: 2,
  nguon: "chu-farm-khai",
  ngayDo: "2026-08-24",
  ngayRaSoat: "2026-08-24",
};

/** Đổi một chỗ trên hồ sơ đúng để tạo ca sai — mọi ca chỉ khác bản đúng ĐÚNG MỘT ĐIỂM */
function sua(vaTru: Partial<Farmstay>): Farmstay {
  return { ...HO_SO_DUNG, ...vaTru };
}

export interface CaDoiChung {
  ten: string;
  hoSo: Farmstay;
  /** true = van phải im lặng · false = van phải chặn */
  phaiDat: boolean;
  /** Chuỗi bắt buộc có trong thông báo lỗi — canh van báo ĐÚNG CHỖ, không báo bừa */
  chuoiPhaiCo?: string;
}

export const CAC_CA_DOI_CHUNG: CaDoiChung[] = [
  { ten: "hồ sơ đủ mọi trường bắt buộc", hoSo: HO_SO_DUNG, phaiDat: true },

  {
    ten: "thiếu câu chuyện chủ farm",
    hoSo: sua({ cauChuyen: "" }),
    phaiDat: false,
    chuoiPhaiCo: "cauChuyen",
  },
  {
    ten: "vungSlug là mã bịa",
    hoSo: sua({ vungSlug: "vung-khong-co-that" }),
    phaiDat: false,
    chuoiPhaiCo: "vung-khong-co-that",
  },
  {
    ten: "lienHe chỉ 1 kênh",
    hoSo: sua({ lienHe: [{ loai: "zalo", giaTri: "0900000000" }] }),
    phaiDat: false,
    chuoiPhaiCo: "lienHe",
  },
  {
    ten: "anh rỗng",
    hoSo: sua({ anh: [] }),
    phaiDat: false,
    chuoiPhaiCo: "anh",
  },
  {
    ten: "capXacMinh = 5, ngoài thang 1–4",
    hoSo: sua({ capXacMinh: 5 as unknown as Farmstay["capXacMinh"] }),
    phaiDat: false,
    chuoiPhaiCo: "capXacMinh",
  },
  {
    ten: "thiếu lịch mùa vụ",
    hoSo: sua({ lichMuaVu: [] }),
    phaiDat: false,
    chuoiPhaiCo: "lichMuaVu",
  },
  {
    ten: "toạ độ ngoài lãnh thổ Việt Nam",
    hoSo: sua({ toaDo: { viDo: 48.85, kinhDo: 2.35 } }),
    phaiDat: false,
    chuoiPhaiCo: "toaDo",
  },
  {
    ten: "traiNghiemSlugs khai mã bịa",
    hoSo: sua({ traiNghiemSlugs: ["hai-sao-tren-troi"] }),
    phaiDat: false,
    chuoiPhaiCo: "hai-sao-tren-troi",
  },
  {
    ten: "ngayRaSoat sai dạng, không đọc được bằng máy",
    hoSo: sua({ ngayRaSoat: "mùa hè 2026" }),
    phaiDat: false,
    chuoiPhaiCo: "ngayRaSoat",
  },
  {
    ten: "kênh liên hệ có nhưng giá trị rỗng — nút bấm không tới đâu",
    hoSo: sua({
      lienHe: [
        { loai: "zalo", giaTri: "" },
        { loai: "dien-thoai", giaTri: "0900000000" },
      ],
    }),
    phaiDat: false,
    chuoiPhaiCo: "lienHe[0].giaTri",
  },
];

/** Ca riêng cho van CẢ KHO: hai hồ sơ trùng slug — một cái vĩnh viễn không ai mở được */
export const KHO_TRUNG_SLUG: Farmstay[] = [
  HO_SO_DUNG,
  sua({ id: "doi-chung-02" }),
];
