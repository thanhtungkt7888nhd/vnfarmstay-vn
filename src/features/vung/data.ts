/**
 * Chín vùng nông nghiệp Việt Nam — MÔ HÌNH DỮ LIỆU DÙNG CHUNG.
 *
 * Trước 19/08/2026 khối dữ liệu này nằm chôn trong `src/app/tour-farmstay/page.tsx`,
 * nên nó chỉ phục vụ đúng một trang. Tách ra đây để `/tour-farmstay`, `/vung/[slug]`,
 * trang chủ và sitemap cùng đọc MỘT nguồn — sửa một chỗ là mọi nơi đổi theo.
 *
 * Mọi chữ trong này là nội dung biên tập THẬT về vùng đất (nông sản, nhịp mùa, việc
 * nhà nông). Mùa vụ ghi theo lịch canh tác phổ biến của vùng; thời tiết từng năm có
 * thể lệch, nên trang nào dùng dữ liệu này cũng phải nhắc người đọc hỏi lại chủ farm.
 */

export interface Vung {
  /** Slug URL, ví dụ "tay-bac-ruong-bac-thang" */
  slug: string;
  ten: string;
  diaDanh: string;
  nongSan: string;
  dacTrung: string;
  muaDep: string;
  viecNhaNong: string[];
  /** Một câu tóm tắt bản sắc vùng — dùng cho thẻ giới thiệu và mô tả trang */
  tomTat: string;
  /** Cách đi và thời điểm phù hợp — thông tin hữu ích thật cho chuyến đi */
  cachDi: string;
  /** Ứng xử tôn trọng địa phương — điều nên biết trước khi tới */
  ungXu: string;
  /** Vị trí gần đúng trên dải Bắc → Nam, dùng cho thanh định vị */
  bac: number;
}

/**
 * 9 vùng — sắp theo trục Bắc vào Nam.
 * Mùa vụ ghi theo lịch canh tác phổ biến của vùng; thời tiết từng năm có thể lệch,
 * nên nội dung luôn nhắc người đọc hỏi lại chủ farm trước khi đi.
 */
export const VUNG: Vung[] = [
  {
    slug: "vung-cao-dong-bac",
    ten: "Vùng cao Đông Bắc",
    tomTat:
      "Cao nguyên đá và những sườn ruộng dốc nhất nước — nơi cây chè phải trèo lên mới hái được.",
    cachDi:
      "Đường đèo nhiều khúc cua liên tục; nên đi xe gầm cao hoặc thuê lái xe quen đường, và tránh chạy đêm. Từ Hà Nội lên Hà Giang khoảng 6–7 giờ xe.",
    ungXu:
      "Nhiều bản còn giữ nếp riêng: hỏi trước khi chụp ảnh người, xin phép trước khi vào nhà, và đừng trả giá món đồ thủ công như trả giá ngoài chợ.",
    diaDanh: "Hà Giang · Cao Bằng · Bắc Kạn",
    nongSan: "Lúa ruộng bậc thang · tam giác mạch · chè Shan tuyết cổ thụ",
    dacTrung:
      "Nơi ruộng bậc thang được khắc vào những sườn núi dốc nhất Việt Nam. Chè Shan tuyết ở đây mọc trên cây cổ thụ, phải trèo lên hái chứ không cúi xuống hái như đồi chè dưới xuôi.",
    muaDep: "Tháng 9–10 lúa chín vàng; tháng 10–11 hoa tam giác mạch nở",
    viecNhaNong: [
      "Gặt lúa nương",
      "Trèo hái chè Shan tuyết",
      "Nấu rượu ngô men lá",
    ],
    bac: 5,
  },
  {
    slug: "tay-bac-ruong-bac-thang",
    ten: "Tây Bắc — ruộng bậc thang",
    tomTat:
      "Kỹ thuật dẫn nước từ đỉnh núi xuống từng bậc ruộng, truyền qua nhiều đời người Mông và người Dao.",
    cachDi:
      "Mùa nước đổ và mùa lúa chín là hai cao điểm — đặt chỗ sớm vài tuần. Đường Mù Cang Chải đẹp nhưng dốc; đi vào sáng sớm để tránh sương mù buổi chiều.",
    ungXu:
      "Ruộng là ruộng đang canh tác, không phải điểm chụp ảnh: đi theo bờ ruộng, đừng giẫm xuống mạ.",
    diaDanh: "Mù Cang Chải · Sa Pa · Lai Châu",
    nongSan: "Lúa nước ruộng bậc thang · thảo quả · cá ruộng",
    dacTrung:
      "Hệ thống dẫn nước từ đỉnh núi xuống từng bậc ruộng là một kỹ thuật canh tác truyền qua nhiều đời của người Mông và người Dao — thứ đáng xem không kém gì cảnh đẹp.",
    muaDep:
      "Tháng 5–6 mùa nước đổ, ruộng loang loáng như gương; tháng 9–10 lúa chín",
    viecNhaNong: [
      "Cấy lúa dưới ruộng bậc thang",
      "Bắt cá ruộng",
      "Nhuộm chàm, vẽ sáp ong",
    ],
    bac: 12,
  },
  {
    slug: "cao-nguyen-moc-chau",
    ten: "Cao nguyên Mộc Châu",
    tomTat:
      "Ít vùng nào có cả đồi chè, vườn mận và trại bò sữa trong bán kính ngắn như ở đây.",
    cachDi:
      "Gần Hà Nội nhất trong nhóm vùng cao — khoảng 4 giờ xe, hợp chuyến hai đêm cuối tuần. Cuối tuần mùa hoa rất đông, đi giữa tuần dễ thở hơn.",
    ungXu:
      "Vào vườn mận hay đồi chè của dân thì hỏi chủ vườn trước; nhiều nơi có thu phí nhỏ và đó là chuyện bình thường.",
    diaDanh: "Sơn La · Mộc Châu · Vân Hồ",
    nongSan: "Chè · mận hậu · bò sữa · cải trắng",
    dacTrung:
      "Một trong ít vùng của Việt Nam có cả đồi chè, vườn mận và trại bò sữa trong bán kính ngắn — nên đi một chuyến thấy được ba nhịp nông nghiệp khác nhau.",
    muaDep:
      "Tháng 1–2 hoa mận nở trắng đồi; tháng 5–6 mận chín; tháng 11–12 hoa cải trắng",
    viecNhaNong: [
      "Hái chè sáng sớm",
      "Vắt sữa bò",
      "Làm sữa chua và phô mai tươi",
    ],
    bac: 20,
  },
  {
    slug: "trung-du-che",
    ten: "Trung du chè",
    tomTat:
      "Vùng chè lâu đời và gần Hà Nội nhất — xem trọn đường đi của búp chè trong một ngày.",
    cachDi:
      "Khoảng 2 giờ xe từ Hà Nội, đi về trong ngày được. Nhưng ở lại một đêm mới kịp buổi hái chè sáng sớm — lúc chè ngon nhất.",
    ungXu:
      "Sao chè bằng chảo gang rất nóng; nghe hướng dẫn của chủ nhà trước khi tự tay làm.",
    diaDanh: "Thái Nguyên · Phú Thọ · Tuyên Quang",
    nongSan: "Chè Tân Cương · cọ · bưởi",
    dacTrung:
      "Vùng chè lâu đời và gần Hà Nội nhất — hợp cho chuyến cuối tuần. Ở đây khách xem được trọn quy trình từ búp chè tươi tới chè khô đóng gói trong cùng một ngày.",
    muaDep: "Tháng 3–5 và tháng 8–10 là hai vụ chè ngon nhất trong năm",
    viecNhaNong: [
      "Hái chè hai lá một tôm",
      "Sao chè bằng chảo gang",
      "Pha và thử nếm chè",
    ],
    bac: 27,
  },
  {
    slug: "duyen-hai-mien-trung",
    ten: "Duyên hải miền Trung",
    tomTat:
      "Nông nghiệp dính liền biển và đầm phá — một buổi vừa làm vườn rau vừa theo ghe ra đầm.",
    cachDi:
      "Tránh tháng 9–11 mùa mưa bão. Từ Đà Nẵng hoặc Huế đi các làng nghề đều trong vòng một giờ xe.",
    ungXu: "Đi ghe ra đầm phải mặc áo phao, kể cả khi nước trông êm.",
    diaDanh: "Quảng Nam · Huế · Quảng Ngãi",
    nongSan: "Rau làng Trà Quế · lúa · sen · thuỷ sản đầm phá",
    dacTrung:
      "Nông nghiệp ở đây dính liền với biển và đầm phá — cùng một buổi có thể vừa làm vườn rau vừa theo ghe ra đầm. Làng rau Trà Quế bón rong biển vớt từ sông, một cách canh tác riêng của vùng.",
    muaDep:
      "Tháng 2–8 khô ráo dễ đi; tháng 5–6 mùa sen. Tránh tháng 9–11 mùa mưa bão",
    viecNhaNong: [
      "Cuốc luống, bón rong biển",
      "Đi ghe thả lưới đầm phá",
      "Làm bánh từ gạo mới",
    ],
    bac: 42,
  },
  {
    slug: "tay-nguyen-ca-phe",
    ten: "Tây Nguyên — thủ phủ cà phê",
    tomTat:
      "Vùng cà phê lớn nhất cả nước trên nền đất đỏ bazan; mùa hoa và mùa quả là hai thế giới khác nhau.",
    cachDi:
      "Mùa thu hoạch tháng 11–12 là lúc cả vùng bận nhất — cũng là lúc đáng đi nhất, nhưng phải báo chủ farm sớm vì nhà nào cũng đang vào vụ.",
    ungXu:
      "Cồng chiêng là sinh hoạt văn hoá, không phải tiết mục biểu diễn: hỏi trước khi quay phim, và đừng yêu cầu diễn lại cho vừa khung hình.",
    diaDanh: "Đắk Lắk · Gia Lai · Kon Tum · Đắk Nông",
    nongSan: "Cà phê · hồ tiêu · ca cao · mắc ca",
    dacTrung:
      "Vùng cà phê lớn nhất cả nước, trên nền đất đỏ bazan. Hai mùa ở đây khác nhau hoàn toàn: mùa hoa nở trắng xoá cả vườn và thơm nức, mùa quả thì đỏ rực và cả vùng bận rộn thu hái.",
    muaDep: "Tháng 2–3 hoa cà phê nở trắng; tháng 11–12 mùa thu hoạch quả chín",
    viecNhaNong: [
      "Hái cà phê chín",
      "Xát vỏ, phơi, rang mẻ nhỏ",
      "Nghe cồng chiêng bên bếp lửa",
    ],
    bac: 55,
  },
  {
    slug: "cao-nguyen-lam-vien",
    ten: "Cao nguyên Lâm Viên",
    tomTat:
      "Vùng duy nhất trồng được rau và hoa ôn đới quy mô lớn; Bảo Lộc còn giữ nghề ươm tơ dệt lụa.",
    cachDi:
      "Đi được quanh năm, tháng 10–12 mát và ít mưa nhất. Đà Lạt đông vào dịp lễ — muốn yên tĩnh thì chọn Đơn Dương hoặc Cầu Đất.",
    ungXu:
      "Nhà kính là nơi sản xuất: đi đúng lối, không tự hái, và giữ cửa đóng để không phá nhiệt độ bên trong.",
    diaDanh: "Đà Lạt · Bảo Lộc · Cầu Đất · Đơn Dương",
    nongSan: "Rau ôn đới · hoa · dâu tây · chè Cầu Đất · atisô · tơ tằm",
    dacTrung:
      "Khí hậu mát quanh năm nên đây là vùng duy nhất trồng được rau và hoa ôn đới quy mô lớn. Bảo Lộc còn giữ nghề ươm tơ dệt lụa — xem tằm ăn dâu tới lúc kéo kén là trải nghiệm riêng của vùng này.",
    muaDep: "Đi được quanh năm; tháng 10–12 mát và ít mưa nhất",
    viecNhaNong: [
      "Thu hoạch rau nhà kính",
      "Hái dâu tây",
      "Xem nuôi tằm — ươm tơ",
    ],
    bac: 63,
  },
  {
    slug: "nang-gio-nam-trung-bo",
    ten: "Nắng gió Nam Trung Bộ",
    tomTat:
      "Vùng khô hạn nhất Việt Nam — chính cái nắng gắt đó làm nên nho, táo và những cánh đồng muối.",
    cachDi:
      "Tháng 12–4 khô ráo dễ đi. Nắng rất gắt từ 10 giờ tới 15 giờ: sắp việc ngoài đồng vào sáng sớm hoặc chiều muộn.",
    ungXu:
      "Cào muối nặng hơn vẻ ngoài rất nhiều — làm thử một buổi thôi, và mang nón rộng vành cùng nước uống.",
    diaDanh: "Ninh Thuận · Bình Thuận",
    nongSan: "Nho · táo · muối · thanh long · cừu",
    dacTrung:
      "Vùng khô hạn nhất Việt Nam — và chính cái nắng gắt đó làm nên nho, táo và những cánh đồng muối trắng. Nghề muối ở đây nặng nhọc thật, nên khách làm thử một buổi thường nhớ rất lâu.",
    muaDep:
      "Tháng 12–4 khô ráo, ít mưa; nho thu hoạch rộ khoảng tháng 4 và tháng 8",
    viecNhaNong: [
      "Cắt nho trong giàn",
      "Cào muối trên ruộng",
      "Chăn cừu buổi chiều",
    ],
    bac: 70,
  },
  {
    slug: "miet-vuon-song-nuoc",
    ten: "Miệt vườn sông nước",
    tomTat:
      "Vườn chia bằng mương nước nên di chuyển trong vườn là chèo xuồng chứ không phải đi bộ.",
    cachDi:
      "Tháng 5–8 rộ trái cây, tháng 9–11 mùa nước nổi ở vùng đầu nguồn. Đi từ TP Hồ Chí Minh xuống Bến Tre hay Vĩnh Long khoảng 2–3 giờ xe.",
    ungXu:
      "Xuống xuồng phải mặc áo phao. Ăn trái tại vườn thì hỏi chủ vườn trước — mỗi nhà một cách tính.",
    diaDanh: "Bến Tre · Vĩnh Long · Tiền Giang · Cần Thơ",
    nongSan: "Dừa · cây ăn trái · lúa · cá nước ngọt",
    dacTrung:
      "Vườn ở đây được chia bằng mương nước, nên di chuyển trong vườn là chèo xuồng chứ không phải đi bộ. Bến Tre là xứ dừa — từ cơm dừa, nước dừa tới thân và lá đều thành sản phẩm.",
    muaDep: "Tháng 5–8 rộ trái cây; tháng 9–11 mùa nước nổi ở vùng đầu nguồn",
    viecNhaNong: [
      "Chèo xuồng hái trái tại gốc",
      "Làm kẹo dừa, đan lá dừa",
      "Tát mương bắt cá",
    ],
    bac: 90,
  },
];

/** Lịch mùa gọn — tra nhanh "tháng này đi đâu" */
export const LICH_MUA = [
  {
    thang: "Tháng 1 – 2",
    diem: "Hoa mận Mộc Châu · hoa cà phê Tây Nguyên chớm nở",
  },
  {
    thang: "Tháng 3 – 4",
    diem: "Vụ chè xuân trung du · nho Ninh Thuận vào vụ",
  },
  {
    thang: "Tháng 5 – 6",
    diem: "Mùa nước đổ ruộng bậc thang · mận chín · trái cây miền Tây",
  },
  {
    thang: "Tháng 7 – 8",
    diem: "Miệt vườn rộ trái · vụ chè hè thu · biển miền Trung êm",
  },
  {
    thang: "Tháng 9 – 10",
    diem: "Lúa chín vàng Tây Bắc và Đông Bắc · mùa nước nổi ĐBSCL",
  },
  {
    thang: "Tháng 11 – 12",
    diem: "Thu hoạch cà phê Tây Nguyên · hoa cải Mộc Châu · Đà Lạt khô ráo",
  },
];

/** Tra một vùng theo slug; trả về `undefined` nếu không có (để trang gọi `notFound()`). */
export function timVung(slug: string): Vung | undefined {
  return VUNG.find((v) => v.slug === slug);
}

/**
 * Các vùng liền kề theo trục Bắc–Nam, dùng cho khối "Điểm đến tiếp theo".
 * Chọn theo khoảng cách địa lý thật (trường `bac`), KHÔNG chọn ngẫu nhiên —
 * gợi ý ngẫu nhiên chỉ để tăng lượt xem là thứ bản đặt hàng cấm.
 */
export function vungLanCan(slug: string, soLuong = 2): Vung[] {
  const goc = timVung(slug);
  if (!goc) return [];
  return VUNG.filter((v) => v.slug !== slug)
    .sort((a, b) => Math.abs(a.bac - goc.bac) - Math.abs(b.bac - goc.bac))
    .slice(0, soLuong);
}

/** Ngày rà soát lại nội dung vùng gần nhất — hiện trên trang, không phải ngày build. */
export const NGAY_CAP_NHAT_VUNG = "2026-08-19";
