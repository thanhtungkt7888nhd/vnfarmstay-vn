/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Schema Sanity cho HỒ SƠ SỐ FARMSTAY — phải khớp `src/shared/types/farmstay.ts`.
 *
 * ⚠️ Viết lại 24/08/2026 (Trụ A). Bản cũ khai `price` · `rating` · `reviewCount` ·
 * `badges` · `region` 3 miền — cấu trúc sàn đặt phòng. Để nguyên thì ngày nối
 * Sanity, người nhập liệu lại được hỏi đúng những câu sai, và dữ liệu sai đổ
 * thẳng vào web.
 *
 * Ràng buộc ở đây cố ý ĐỒNG BỘ với van `src/features/listing/van-kiem-ho-so.ts`:
 * cổng vào không được dễ hơn van dựng, kẻo Sanity nhận rồi build mới đứt
 * (bài học `lesson_cong_vao_khong_khat_khe_hon_engine`).
 */

/** 9 vùng trải nghiệm nông nghiệp — phải trùng `src/features/vung/data.ts` */
const VUNG = [
  { title: "Vùng cao Đông Bắc", value: "vung-cao-dong-bac" },
  { title: "Tây Bắc — ruộng bậc thang", value: "tay-bac-ruong-bac-thang" },
  { title: "Cao nguyên Mộc Châu", value: "cao-nguyen-moc-chau" },
  { title: "Trung du chè", value: "trung-du-che" },
  { title: "Duyên hải miền Trung", value: "duyen-hai-mien-trung" },
  { title: "Tây Nguyên — thủ phủ cà phê", value: "tay-nguyen-ca-phe" },
  { title: "Cao nguyên Lâm Viên", value: "cao-nguyen-lam-vien" },
  { title: "Nắng gió Nam Trung Bộ", value: "nang-gio-nam-trung-bo" },
  { title: "Miệt vườn sông nước", value: "miet-vuon-song-nuoc" },
];

const TRAI_NGHIEM = [
  { title: "Hái chè", value: "hai-che" },
  { title: "Mùa cà phê", value: "mua-ca-phe" },
  { title: "Ruộng bậc thang", value: "ruong-bac-thang" },
  { title: "Vườn cây ăn trái", value: "vuon-cay-an-trai" },
  { title: "Chăn nuôi và nghề sữa", value: "chan-nuoi-va-sua" },
  { title: "Rau và hoa ôn đới", value: "rau-hoa-on-doi" },
];

const MUA = [
  { title: "Đầu năm — mùa hoa", value: "dau-nam-mua-hoa" },
  { title: "Giữa năm — mùa nước đổ", value: "giua-nam-mua-nuoc-do" },
  { title: "Cuối hè sang thu — mùa gặt", value: "cuoi-nam-mua-gat" },
  { title: "Cuối năm — mùa thu hoạch cà phê", value: "cuoi-nam-mua-thu-hoach" },
];

export default {
  name: "farmstay",
  title: "Hồ sơ farmstay",
  type: "document",
  groups: [
    { name: "dinhDanh", title: "1 · Định danh" },
    { name: "viTri", title: "2 · Vị trí trong hệ sinh thái" },
    { name: "noiDung", title: "3 · Nội dung hồ sơ" },
    { name: "lienHe", title: "4 · Liên hệ trực tiếp" },
    { name: "xacMinh", title: "5 · Xác minh & xuất xứ" },
  ],
  fields: [
    // ── 1 · Định danh ──────────────────────────────────────────────
    {
      name: "ten",
      title: "Tên farmstay",
      description: "Đúng như đăng ký kinh doanh, hoặc tên chủ farm tự khai",
      type: "string",
      group: "dinhDanh",
      validation: (R: any) => R.required(),
    },
    {
      name: "slug",
      title: "Mã đường dẫn",
      description: "Đã đăng rồi thì CẤM đổi — đổi là mất thứ hạng tìm kiếm",
      type: "slug",
      options: { source: "ten" },
      group: "dinhDanh",
      validation: (R: any) => R.required(),
    },
    {
      name: "tinh",
      title: "Tỉnh / Thành phố",
      type: "string",
      group: "dinhDanh",
      validation: (R: any) => R.required(),
    },
    {
      name: "diaChi",
      title: "Địa chỉ hiển thị",
      description: "Xã / huyện — không cần số nhà",
      type: "string",
      group: "dinhDanh",
      validation: (R: any) => R.required(),
    },

    // ── 2 · Vị trí trong hệ sinh thái ──────────────────────────────
    {
      name: "vungSlug",
      title: "Vùng trải nghiệm",
      description: "Một trong 9 vùng — quyết định farm hiện ở trang vùng nào",
      type: "string",
      options: { list: VUNG },
      group: "viTri",
      validation: (R: any) => R.required(),
    },
    {
      name: "viDo",
      title: "Vĩ độ (GPS)",
      description: "Toạ độ THẬT, không đại khái. Việt Nam nằm trong 8–24",
      type: "number",
      group: "viTri",
      validation: (R: any) => R.required().min(8).max(24),
    },
    {
      name: "kinhDo",
      title: "Kinh độ (GPS)",
      description: "Việt Nam nằm trong 102–110",
      type: "number",
      group: "viTri",
      validation: (R: any) => R.required().min(102).max(110),
    },
    {
      name: "traiNghiemSlugs",
      title: "Trải nghiệm farm này có",
      type: "array",
      of: [{ type: "string", options: { list: TRAI_NGHIEM } }],
      options: { list: TRAI_NGHIEM },
      group: "viTri",
    },
    {
      name: "muaSlugs",
      title: "Mùa farm này đẹp",
      type: "array",
      of: [{ type: "string", options: { list: MUA } }],
      options: { list: MUA },
      group: "viTri",
    },

    // ── 3 · Nội dung hồ sơ ─────────────────────────────────────────
    {
      name: "cauChuyen",
      title: "Câu chuyện chủ farm",
      description:
        "NGÔI THỨ NHẤT, giọng của chính chủ farm. Không văn mẫu, không viết hộ cho hay",
      type: "text",
      rows: 6,
      group: "noiDung",
      validation: (R: any) => R.required(),
    },
    {
      name: "lichMuaVu",
      title: "Lịch mùa vụ",
      description: 'Mùa nào có gì — CỤ THỂ. Cấm viết "mùa nào cũng đẹp"',
      type: "array",
      group: "noiDung",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "muaSlug",
              title: "Mùa",
              type: "string",
              options: { list: MUA },
              validation: (R: any) => R.required(),
            },
            {
              name: "coGi",
              title: "Mùa này có gì",
              type: "text",
              rows: 3,
              validation: (R: any) => R.required(),
            },
          ],
          preview: { select: { title: "muaSlug", subtitle: "coGi" } },
        },
      ],
      validation: (R: any) => R.required().min(1),
    },
    {
      name: "duongDi",
      title: "Đường đi",
      description: "Quãng đường từ trung tâm huyện + phương tiện đi được",
      type: "text",
      rows: 3,
      group: "noiDung",
      validation: (R: any) => R.required(),
    },
    {
      name: "ungXu",
      title: "Ứng xử tại chỗ",
      description: "Điều nên và không nên — tôn trọng văn hoá bản địa",
      type: "text",
      rows: 3,
      group: "noiDung",
      validation: (R: any) => R.required(),
    },
    {
      name: "anh",
      title: "Ảnh thực địa",
      description:
        "Ảnh CHỤP TẠI FARM. Cấm ảnh minh hoạ lấy trên mạng. Bắt buộc ≥1 ảnh",
      type: "array",
      group: "noiDung",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "moTa",
              title: "Chữ thay ảnh",
              type: "string",
              validation: (R: any) => R.required(),
            },
            { name: "nguoiChup", title: "Người chụp", type: "string" },
          ],
        },
      ],
      validation: (R: any) => R.required().min(1),
    },

    // ── 4 · Liên hệ trực tiếp ──────────────────────────────────────
    {
      name: "lienHe",
      title: "Kênh liên hệ trực tiếp",
      description:
        "Tối thiểu 2 kênh. Đây là mục tiêu chuyển đổi số một — web chỉ dẫn khách về chủ farm",
      type: "array",
      group: "lienHe",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "loai",
              title: "Loại kênh",
              type: "string",
              options: {
                list: [
                  { title: "Zalo", value: "zalo" },
                  { title: "Điện thoại", value: "dien-thoai" },
                  { title: "Web riêng của farm", value: "web-rieng" },
                  { title: "Hồ sơ Google", value: "google-business" },
                ],
              },
              validation: (R: any) => R.required(),
            },
            {
              name: "giaTri",
              title: "Số / đường dẫn",
              type: "string",
              validation: (R: any) => R.required(),
            },
            { name: "nhan", title: "Chữ trên nút", type: "string" },
          ],
          preview: { select: { title: "loai", subtitle: "giaTri" } },
        },
      ],
      validation: (R: any) => R.required().min(2),
    },

    // ── 5 · Xác minh & xuất xứ ─────────────────────────────────────
    {
      name: "capXacMinh",
      title: "Cấp xác minh",
      type: "number",
      group: "xacMinh",
      options: {
        list: [
          { title: "Cấp 1 — cơ sở tự cung cấp, đã kiểm liên hệ", value: 1 },
          { title: "Cấp 2 — đã rà soát hồ sơ từ xa", value: 2 },
          { title: "Cấp 3 — đã khảo sát thực địa", value: 3 },
          { title: "Cấp 4 — chính quyền địa phương ghi nhận", value: 4 },
        ],
      },
      validation: (R: any) => R.required().min(1).max(4),
    },
    {
      name: "nguon",
      title: "Dữ kiện lấy từ đâu",
      type: "string",
      group: "xacMinh",
      options: {
        list: [
          { title: "Khảo sát thực địa", value: "thuc-dia" },
          { title: "Hồ sơ Google Business", value: "google-business" },
          { title: "Web của farm", value: "web-farm" },
          { title: "Zalo của chủ farm", value: "zalo" },
          { title: "Chủ farm tự khai", value: "chu-farm-khai" },
        ],
      },
      validation: (R: any) => R.required(),
    },
    {
      name: "ngayDo",
      title: "Ngày lấy dữ kiện",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      group: "xacMinh",
      validation: (R: any) => R.required(),
    },
    {
      name: "ngayRaSoat",
      title: "Rà soát gần nhất",
      description: "Quá 6 tháng thì hạ nhãn xác minh",
      type: "date",
      options: { dateFormat: "YYYY-MM-DD" },
      group: "xacMinh",
      validation: (R: any) => R.required(),
    },

    // ── Tuỳ chọn ───────────────────────────────────────────────────
    {
      name: "the",
      title: "Thẻ phân loại",
      type: "array",
      of: [{ type: "string" }],
      group: "dinhDanh",
    },
    {
      name: "giaThamKhao",
      title: "Giá tham khảo (khoảng)",
      description:
        "CỐ Ý là một KHOẢNG, không phải một con số — giá đổi liên tục, số cứng sẽ nói dối. Web không bán phòng",
      type: "object",
      group: "lienHe",
      fields: [
        { name: "tuVND", title: "Từ (VNĐ)", type: "number" },
        { name: "denVND", title: "Đến (VNĐ)", type: "number" },
        {
          name: "ngayCapNhat",
          title: "Chủ farm cập nhật ngày",
          type: "date",
          options: { dateFormat: "YYYY-MM-DD" },
        },
      ],
    },
  ],
  preview: {
    select: { title: "ten", subtitle: "diaChi", media: "anh.0" },
  },
};
