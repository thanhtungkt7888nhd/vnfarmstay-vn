/**
 * NGƯỜI KIẾN TẠO — các chuyên gia đứng sau phong trào farmstay Việt Nam.
 *
 * Master Prompt §9 (Trục 7) chừa sẵn `/nguoi-kien-tao/[slug]` và đánh dấu "⛔ CHƯA CÓ".
 * Tệp này lấp đúng chỗ ấy, không đẻ thêm khối mới.
 *
 * ⛔ MỌI DỮ KIỆN Ở ĐÂY LẤY TỪ SCHEMA `Person` CÔNG KHAI TRÊN CHÍNH WEB CỦA HỌ,
 * đọc ngày 26/08/2026 — không suy diễn, không tô vẽ, không thêm thành tích.
 * Đây là Điều IV: mọi dữ kiện phải truy được về nguồn, kèm ngày lấy.
 *
 * ⚠️ Vì sao KHÔNG rải liên kết này ra chân trang: điều cấm tuyệt đối số 5 —
 * *"Cấm liên kết chân trang toàn site giữa sáu web"*. Ở đây là **liên kết theo ngữ
 * cảnh, trong câu chữ có lý do nối** — mỗi chuyên gia đi kèm một đoạn nói rõ họ là
 * ai và vì sao vnfarmstay dẫn sang. Đó đúng thứ Master Prompt cho phép.
 *
 * ⚠️ Điều VIII: trang chủ thuộc về chủ farm. Khối này KHÔNG được đặt lên trang chủ —
 * uy tín cá nhân bảo chứng cho hệ thống, không để hệ thống thành bệ đỡ cho cá nhân.
 */

/** Một chuyên gia — hình dạng cố ý bám sát schema `Person` để không sinh dữ kiện lạ */
export interface NguoiKienTao {
  slug: string;
  ten: string;
  /** Chức danh họ tự khai, nguyên văn */
  chucDanh: string;
  /**
   * Chức danh RÚT GỌN, chỉ dùng cho tiêu đề trang.
   * ⚠️ Có trường này vì cổng SEO bắt được 26/08/2026: tiêu đề ghép nguyên chức danh
   * dài 93 ký tự, máy tìm kiếm cắt cụt. Bản rút gọn lấy TỪ CHÍNH lời họ, không
   * diễn giải lại thành chữ của mình.
   */
  chucDanhNgan: string;
  /** Mô tả ngắn họ tự khai, nguyên văn — KHÔNG viết lại cho "hay hơn" */
  tuKhai: string;
  /** Vì sao vnfarmstay dẫn sang họ — phần này là LỜI CỦA TA, phải nói được lý do thật */
  vaiTroVoiNganh: string;
  /** Lĩnh vực họ khai `knowsAbout` — nguyên văn */
  linhVuc: string[];
  /** Tổ chức họ khai `worksFor`; không khai thì bỏ trống */
  toChuc?: string;
  /** Địa bàn khai trong `address`; không khai thì bỏ trống */
  diaBan?: string;
  /** Web riêng — đích của liên kết */
  web: string;
  /** Ảnh chân dung họ tự đăng; không có thì bỏ trống, khối ảnh tự ẩn */
  anh?: string;
  /** Ngày đọc dữ kiện, dạng YYYY-MM-DD — Điều IV */
  ngayDo: string;
  /**
   * Người này có phải NGƯỜI KHỞI XƯỚNG chính vnfarmstay.vn không.
   *
   * ⚠️ Có trường này vì Điều II — trung thực về trạng thái. Người khởi xướng đứng
   * lẫn trong danh sách chuyên gia mà không nói rõ thì người đọc tưởng đây là một
   * bảng do bên thứ ba bình chọn. Nói thẳng quan hệ LÀM TĂNG độ tin, không giảm —
   * cùng lối với việc mỗi cấp xác minh phải nói cả thứ nó KHÔNG bảo đảm.
   *
   * Trang tổng tách người này ra một khối RIÊNG ở cuối, không xếp chung hàng —
   * để hệ thống không thành bệ đỡ cho cá nhân (Điều VIII).
   */
  laNguoiKhoiXuong?: boolean;
}

export const NGUOI_KIEN_TAO: NguoiKienTao[] = [
  {
    slug: "tran-danh-manh",
    ten: "Trần Danh Mạnh",
    chucDanh: "Nhà Phát triển Nông nghiệp & Chuyên gia Đàm phán Quốc tế",
    chucDanhNgan: "Nhà Phát triển Nông nghiệp",
    tuKhai:
      "Chuyên gia đàm phán mở 6 thị trường châu Âu cho nông sản Việt Nam (2008–2015). Người kiến tạo Hệ Tháp Cây Trồng Di Sản 8 tầng tại Tây Nguyên.",
    vaiTroVoiNganh:
      "Farmstay sống được hay không phụ thuộc vào chỗ nông sản đi đâu sau mùa thu hoạch. Ông Mạnh làm đúng khúc ấy — đưa nông sản Việt ra thị trường ngoài, và dựng mô hình canh tác nhiều tầng để một mảnh đất nuôi được nhiều thứ cùng lúc.",
    linhVuc: [
      "Đàm phán thương mại quốc tế",
      "Phát triển thị trường nông sản châu Âu",
      "Nông nghiệp di sản",
      "Hệ sinh thái cây trồng đa tầng",
      "Chuỗi cung ứng nông sản",
      "Vùng trồng Tây Nguyên",
      "Global G.A.P.",
      "Nông nghiệp bền vững",
    ],
    toChuc: "Hệ Sinh Thái Nông Nghiệp Di Sản",
    web: "https://trandanhmanh.com",
    anh: "https://trandanhmanh.com/images/portrait-vetoi.jpg",
    ngayDo: "2026-08-26",
  },
  {
    slug: "nguyen-minh-thanh",
    ten: "Nguyễn Minh Thành",
    chucDanh: "Nhà sáng lập Sản Việt Farm",
    chucDanhNgan: "Nhà sáng lập Sản Việt Farm",
    tuKhai:
      "Nhà sáng lập Sản Việt Farm — trang trại nông nghiệp hữu cơ tuần hoàn 130ha tại Ninh Hòa, Khánh Hòa. Chuyên gia du lịch nông nghiệp và lộ trình xuất khẩu Halal.",
    vaiTroVoiNganh:
      "Đây là người đã tự làm cái mà nhiều chủ farm mới đang định làm: một trang trại thật, vận hành thật, mở cửa đón khách thật. Kinh nghiệm của một người vừa canh tác vừa đón khách khác hẳn kinh nghiệm chỉ đọc trên giấy.",
    linhVuc: [
      "Nông nghiệp hữu cơ tuần hoàn",
      "Du lịch nông nghiệp",
      "Farmstay Việt Nam",
      "Chứng nhận Halal",
      "Văn hóa Raglai Ê Đê",
    ],
    toChuc: "Sản Việt Farm",
    diaBan: "Ninh Hòa, Khánh Hòa",
    web: "https://nguyenminhthanh.com",
    anh: "https://nguyenminhthanh.com/og-image.jpg",
    ngayDo: "2026-08-26",
  },
  {
    slug: "tran-cong-thuy",
    ten: "Trần Công Thuỷ",
    chucDanh: "Chuyên gia Quản trị Nguồn lực Đất",
    chucDanhNgan: "Chuyên gia Quản trị Nguồn lực Đất",
    tuKhai:
      "Hơn 20 năm đồng hành cùng nhà đầu tư, chính quyền địa phương và cộng đồng nông dân trong lĩnh vực farmstay và du lịch nông nghiệp.",
    vaiTroVoiNganh:
      "Câu hỏi đầu tiên và khó nhất của mọi người muốn mở farmstay là đất: mảnh này có được làm không, làm tới đâu thì đúng luật. Đó là khúc ông Thuỷ đứng — giữa nhà đầu tư, chính quyền và người nông dân đang giữ đất.",
    linhVuc: [
      "Luật Đất đai 2024",
      "Sử dụng đất đa mục đích",
      "Farmstay",
      "Du lịch nông nghiệp",
      "Quy hoạch đất",
    ],
    web: "https://trancongthuy.vn",
    ngayDo: "2026-08-26",
  },
  {
    slug: "do-phuong-quyen",
    ten: "Đỗ Phương Quyên",
    chucDanh: "Thạc sĩ · Giảng viên chính ngành Du lịch",
    chucDanhNgan: "Giảng viên chính ngành Du lịch",
    tuKhai:
      "ThS. Đỗ Phương Quyên là giảng viên chính ngành Du lịch với hơn 20 năm giảng dạy và hành nghề. Chủ biên giáo trình Nghiệp vụ thiết kế và điều hành tour, Chi hội phó Chi hội Hướng dẫn viên Du lịch Khánh Hòa, cô bền bỉ với sứ mệnh đào tạo nguồn nhân lực du lịch chuyên nghiệp cho miền Trung.",
    vaiTroVoiNganh:
      "Một farmstay có cảnh đẹp mà đón khách vụng thì khách không quay lại. Nghề đón khách là nghề phải học, và cô Quyên là người dạy nghề ấy — cả trên giảng đường lẫn ngoài hiện trường.",
    linhVuc: [
      "Du lịch xanh & bền vững",
      "Sản phẩm du lịch đặc thù",
      "Nghiệp vụ hướng dẫn du lịch",
      "Thiết kế & điều hành tour",
      "Đánh giá tài nguyên du lịch",
      "Quy hoạch du lịch",
      "Du lịch địa phương (Khánh Hòa)",
    ],
    toChuc: "Trường Đại học Khánh Hòa",
    diaBan: "Nha Trang, Khánh Hòa",
    web: "https://dophuongquyen.vn",
    anh: "https://dophuongquyen.vn/assets/do-phuong-quyen-portrait-1.jpg",
    ngayDo: "2026-08-26",
  },
  {
    /* ⚠️ Đặt CUỐI mảng là cố ý — xem `laNguoiKhoiXuong`. Dữ kiện lấy nguyên văn từ
       schema `Person` trên nhahoachdinh.vn, đọc 27/08/2026.
       ⚠️⚠️ Mô tả tự khai ghi ĐÚNG "Người biên dịch" — KHÔNG phải tác giả. Giữ nguyên
       chữ ấy; sửa thành "tác giả" là khai sai danh tính, đã từng phải đính chính bằng
       PR ở web khác. Web này cũng KHÔNG khai năm sinh, nên không có nguy cơ lẫn với
       người trùng tên nổi tiếng hơn. */
    slug: "pham-thanh-tung",
    ten: "Phạm Thanh Tùng",
    chucDanh: "Nhà Hoạch Định Farmstay & Du Lịch Nông Nghiệp",
    chucDanhNgan: "Nhà Hoạch Định Farmstay",
    tuKhai:
      "Chuyên gia hoạch định farmstay hàng đầu Việt Nam với hơn 9 năm kinh nghiệm, tư vấn 100+ dự án trải khắp 30+ tỉnh thành, dẫn 5 mùa Xuyên Việt Farmstay. Sáng lập DEFARM, Xuyên Việt Farmstay, Farmstay Update. Người biên dịch và đưa sách Hướng Dẫn Thiết Lập Farmstay về Việt Nam (NXB Hồng Đức, 2021).",
    vaiTroVoiNganh:
      "Người khởi xướng chính vnfarmstay.vn — nên nói rõ ngay: hồ sơ này không phải do bên thứ ba bình chọn. Việc ông làm với ngành là dựng phương pháp: đưa cuốn cẩm nang thiết lập farmstay về tiếng Việt, và đi thực địa cùng chủ farm qua nhiều mùa Xuyên Việt để phương pháp ấy chạm đất thật chứ không nằm trên giấy.",
    linhVuc: [
      /* Lọc bỏ "Phạm Thanh Tùng" và "Nhà Hoạch Định" khỏi `knowsAbout` gốc: đó là
         tên riêng và danh xưng, không phải lĩnh vực chuyên môn. */
      "Quy hoạch vùng đất nông nghiệp",
      "Thiết kế farmstay bền vững",
      "Pháp lý farmstay",
      "Luật Đất đai 2024",
      "Chuyển mục đích sử dụng đất",
      "Vận hành farmstay",
      "Đào tạo chủ farmstay",
      "Tư vấn đầu tư farmstay",
    ],
    toChuc: "DEFARM",
    web: "https://nhahoachdinh.vn",
    ngayDo: "2026-08-27",
    laNguoiKhoiXuong: true,
  },
];

export function timNguoiKienTao(slug: string): NguoiKienTao | undefined {
  return NGUOI_KIEN_TAO.find((n) => n.slug === slug);
}

/**
 * Van kiểm hồ sơ người kiến tạo — chạy lúc dựng, cùng lối `kiemHoSoFarmstay`.
 *
 * Vì sao cần: đây là hồ sơ về NGƯỜI THẬT. Thiếu nguồn hay thiếu ngày đọc thì không
 * ai truy lại được dữ kiện lấy từ đâu (Điều IV), và một hồ sơ người mà sai là loại
 * sai nặng nhất — xem [[lesson_so_khop_ten_khong_phai_so_khop_con_nguoi]].
 */
export function kiemNguoiKienTao(): string[] {
  const loi: string[] = [];
  const daThay = new Set<string>();

  for (const n of NGUOI_KIEN_TAO) {
    const bao = (m: string) =>
      loi.push(`nguoi-kien-tao/${n.slug || "(không mã)"}: ${m}`);

    for (const truong of [
      "slug",
      "ten",
      "chucDanh",
      "chucDanhNgan",
      "tuKhai",
      "vaiTroVoiNganh",
      "web",
      "ngayDo",
    ] as const) {
      if (typeof n[truong] !== "string" || n[truong].trim() === "") {
        bao(`thiếu trường bắt buộc \`${truong}\``);
      }
    }

    if (n.linhVuc.length === 0)
      bao("thiếu `linhVuc` — không nói được họ giỏi việc gì");

    /* Web riêng phải là địa chỉ đầy đủ — thiếu giao thức là liên kết chết */
    if (!/^https?:\/\/.+/.test(n.web))
      bao(`\`web\` không phải địa chỉ đầy đủ — "${n.web}"`);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.ngayDo)) {
      bao(`\`ngayDo\` sai dạng, phải là YYYY-MM-DD — "${n.ngayDo}"`);
    }

    if (daThay.has(n.slug)) bao("trùng mã với một hồ sơ khác");
    daThay.add(n.slug);
  }
  return loi;
}
