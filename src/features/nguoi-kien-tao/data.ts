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
  /**
   * MỘT DÒNG nói họ làm nghề gì — lời của ta, dựng từ dữ kiện họ tự đăng.
   * Đây là thứ người đọc thấy trước tiên, nên nó phải nói được VIỆC THẬT chứ không
   * phải tính từ khen ngợi: "mở 6 thị trường châu Âu" đọc ra nghề, "chuyên gia hàng
   * đầu" thì không. Giọng web (`.giong-web.json`): cụ thể, không hoa mỹ.
   */
  motDong: string;
  /**
   * Các mốc/con số họ TỰ ĐĂNG trên web của họ — không phải ta đếm hộ, không phải ta
   * ước lượng. Đây là phần trả lời câu "người này làm được gì" bằng dữ kiện thay vì
   * bằng lời khen (Điều II + Điều IV).
   */
  dauMoc: { so: string; y: string }[];
  /** Ngày đọc riêng cho `dauMoc` — khối này lấy sau `tuKhai` nên có ngày riêng (Điều IV) */
  ngayDocMoc: string;
  /** Một câu NGUYÊN VĂN của chính họ — có thì hồ sơ có hơi người, không có thì bỏ trống */
  loiHo?: string;
  /** Nguồn của `loiHo` khi câu ấy nói ở nơi khác web họ (hội thảo, bài báo) */
  loiHoNguon?: string;
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
    motDong:
      "Người đưa nông sản Việt vào sáu thị trường châu Âu, rồi quay về Tây Nguyên dựng mô hình canh tác tám tầng.",
    dauMoc: [
      { so: "18 năm", y: "thực chiến trong nông nghiệp" },
      {
        so: "6 thị trường EU",
        y: "đã mở cho nông sản Việt — Đức, Pháp, Hà Lan, Thụy Sĩ (2008–2015)",
      },
      { so: "200+ ha", y: "quản lý theo chuẩn Global G.A.P." },
      {
        so: "5 tỉnh",
        y: "thực địa: Đắk Lắk, Lâm Đồng, Khánh Hòa, Gia Lai, Quảng Ngãi",
      },
    ],
    ngayDocMoc: "2026-09-03",
    loiHo:
      "Người nhìn thấy được cấu trúc đó không phải là người làm nhiều nhất, mà là người nhìn hệ thống rõ nhất.",
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
    motDong:
      "Chủ một trang trại 130 hecta ở Khánh Hòa — vừa canh tác, vừa giữ rừng, vừa mở cửa đón khách.",
    dauMoc: [
      {
        so: "130 ha",
        y: "Sản Việt Farm tại Suối Sâu, Nam Ninh Hòa, Khánh Hòa",
      },
      {
        so: "60 · 30 · 10",
        y: "tỉ lệ đất: sản xuất · rừng tái sinh · du lịch",
      },
      { so: "40+", y: "việc làm cho lao động địa phương" },
      { so: "2025–2027", y: "lộ trình chứng nhận Halal để xuất khẩu" },
    ],
    ngayDocMoc: "2026-09-03",
    loiHo: "Đất tử tế trả công cho người tử tế. Tôi không vội.",
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
    motDong:
      "Người đứng giữa nhà đầu tư, chính quyền và nông dân — ở đúng khúc khó nhất: pháp lý của mảnh đất.",
    dauMoc: [
      { so: "20+ năm", y: "quy hoạch và khai thác đất bền vững" },
      {
        so: "5 khúc nghề",
        y: "quy hoạch · pháp lý · đầu tư · đào tạo · truyền thông",
      },
      {
        so: "Luật Đất đai 2024",
        y: "cùng các nghị định liên quan — đọc bản đồ quy hoạch, dựng mô hình tài chính dự án",
      },
    ],
    ngayDocMoc: "2026-09-03",
    loiHo:
      "Farmstay phải trước hết là farm — nông trại thật. Rồi mới đến stay — dịch vụ lưu trú.",
    loiHoNguon: "Hội thảo 19/8/2025",
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
    motDong:
      "Người dạy nghề đón khách — hơn hai mươi năm, cả trên giảng đường lẫn ngoài hiện trường.",
    dauMoc: [
      { so: "20+ năm", y: "giảng dạy và hành nghề du lịch" },
      { so: "26", y: "công bố khoa học giai đoạn 2016–2025" },
      {
        so: "1 giáo trình",
        y: "chủ biên — Nghiệp vụ thiết kế và điều hành tour (NXB Giáo dục, 2023)",
      },
      {
        so: "18 · 12",
        y: "đề tài đã hướng dẫn · khóa luận tốt nghiệp của sinh viên",
      },
    ],
    ngayDocMoc: "2026-09-03",
    loiHo: "Người truyền nghề du lịch — từ giảng đường đến thực địa.",
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
    /* ⚠️⚠️ "đưa … về tiếng Việt" = BIÊN DỊCH. Tuyệt đối không rút gọn thành "viết"
       hay "tác giả" — xem chú thích danh tính ở đầu hồ sơ này. */
    motDong:
      "Người đưa cuốn cẩm nang thiết lập farmstay đầu tiên về tiếng Việt, rồi đi hơn ba mươi tỉnh để phương pháp ấy chạm đất thật.",
    dauMoc: [
      { so: "100+", y: "dự án farmstay và du lịch đã tư vấn" },
      { so: "3.000+ ha", y: "đất nông nghiệp đã hoạch định" },
      { so: "30+ tỉnh thành", y: "địa bàn đã đi qua" },
      {
        so: "5 mùa",
        y: "Xuyên Việt Farmstay (2021–2026) — đi thực địa cùng chủ farm",
      },
    ],
    ngayDocMoc: "2026-09-03",
    loiHo:
      "Trước khi xây dựng, phải nhìn thấy. Trước khi nhìn thấy, phải hiểu đất.",
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
      "motDong",
      "web",
      "ngayDo",
      "ngayDocMoc",
    ] as const) {
      if (typeof n[truong] !== "string" || n[truong].trim() === "") {
        bao(`thiếu trường bắt buộc \`${truong}\``);
      }
    }

    if (n.linhVuc.length === 0)
      bao("thiếu `linhVuc` — không nói được họ giỏi việc gì");

    /* Dấu mốc là phần trả lời "người này làm được gì" bằng dữ kiện. Rỗng thì hồ sơ
       quay về chỗ cũ: chỉ có lời khen, không có việc thật. */
    if (n.dauMoc.length === 0)
      bao("thiếu `dauMoc` — hồ sơ không có dữ kiện nào chứng minh việc họ làm");
    for (const m of n.dauMoc) {
      if (!m.so?.trim() || !m.y?.trim())
        bao("`dauMoc` có mục để trống — mỗi mốc phải đủ cả con số lẫn ý nghĩa");
    }

    /* Nguồn treo lơ lửng không gắn với câu nào là dữ kiện mồ côi */
    if (n.loiHoNguon && !n.loiHo)
      bao(
        "có `loiHoNguon` nhưng không có `loiHo` — nguồn không gắn vào câu nào"
      );

    /* Web riêng phải là địa chỉ đầy đủ — thiếu giao thức là liên kết chết */
    if (!/^https?:\/\/.+/.test(n.web))
      bao(`\`web\` không phải địa chỉ đầy đủ — "${n.web}"`);

    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.ngayDo)) {
      bao(`\`ngayDo\` sai dạng, phải là YYYY-MM-DD — "${n.ngayDo}"`);
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(n.ngayDocMoc)) {
      bao(`\`ngayDocMoc\` sai dạng, phải là YYYY-MM-DD — "${n.ngayDocMoc}"`);
    }

    if (daThay.has(n.slug)) bao("trùng mã với một hồ sơ khác");
    daThay.add(n.slug);
  }
  return loi;
}
