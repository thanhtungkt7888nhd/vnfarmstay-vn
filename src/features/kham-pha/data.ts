/**
 * BA TRỤC KHÁM PHÁ CÒN LẠI — trải nghiệm · mùa · tuyến hành trình.
 *
 * Trục thứ tư (vùng đất) đã có ở `src/features/vung/data.ts`. Ba trục ở đây KHÔNG
 * đẻ thêm sự thật mới: mỗi mục chỉ nối vào các vùng CÓ THẬT bằng `vungSlugs`, còn
 * phần chữ là biên tập riêng trả lời đúng câu hỏi mà người tìm theo trục ấy đang hỏi.
 *
 * ⚠️ LUẬT GIỮ SỐ TRANG NHỎ. Bản đặt hàng cấm dựng hàng trăm trang đích chỉ khác vài
 * chữ. Vì vậy mỗi trục chỉ có vài trang, và một trang chỉ được sinh ra khi nó gom
 * được ÍT NHẤT HAI vùng thật — gom một vùng thì đã có trang vùng rồi, thêm trang nữa
 * là tự tạo nội dung gần trùng. `kiemTraDuDay()` cuối tệp canh đúng điều đó.
 */

import { VUNG, type Vung } from "@/features/vung/data";

// ─── Trải nghiệm ────────────────────────────────────────────────────────────

export interface TraiNghiem {
  slug: string;
  ten: string;
  /** Một câu nói rõ trải nghiệm này là gì, dùng cho thẻ và mô tả trang */
  tomTat: string;
  /** Đoạn mở đầu riêng của trang — không lặp lại chữ của trang vùng */
  moDau: string;
  /** Việc người đi thực sự làm khi tới nơi */
  viecLam: string[];
  /** Điều nên biết trước khi đi, riêng cho loại trải nghiệm này */
  nenBiet: string;
  vungSlugs: string[];
}

export const TRAI_NGHIEM: TraiNghiem[] = [
  {
    slug: "hai-che",
    ten: "Hái chè",
    tomTat:
      "Từ cây chè cổ thụ phải trèo lên hái, tới đồi chè trung du hái cúi — cùng một lá chè mà hai tư thế khác nhau.",
    moDau:
      "Chè là cây trồng cho thấy rõ nhất khoảng cách giữa các vùng đất Việt Nam. Trên núi cao phía Bắc, chè Shan tuyết mọc thành cây cổ thụ và người hái phải trèo lên thân cây. Xuống trung du, chè thành đồi thấp cắt bằng, người hái đi giữa luống mà cúi xuống. Còn ở cao nguyên phía Nam, chè lại nằm trong sương gần như quanh năm. Đi một vòng ba nơi ấy là hiểu vì sao cùng gọi là chè mà giá và hương lại chênh nhau xa đến vậy.",
    viecLam: [
      "Hái chè đúng cách một tôm hai lá",
      "Xem sao chè và vò chè bằng tay",
      "Uống thử nước đầu và nước thứ hai để nhận ra khác biệt",
    ],
    nenBiet:
      "Chè hái buổi sáng sớm khi còn sương thì thơm hơn, nên phần lớn farmstay bắt đầu việc này lúc trời chưa nắng. Vụ chè ngon nhất không trùng nhau giữa các vùng — hỏi chủ farm trước khi đặt vé.",
    vungSlugs: [
      "vung-cao-dong-bac",
      "cao-nguyen-moc-chau",
      "trung-du-che",
      "cao-nguyen-lam-vien",
    ],
  },
  {
    slug: "mua-ca-phe",
    ten: "Mùa cà phê",
    tomTat:
      "Hai khoảnh khắc đáng đi nhất trong năm của cây cà phê nằm cách nhau đúng chín tháng.",
    moDau:
      "Cây cà phê cho hai mùa đáng đi vì hai lý do trái ngược. Tháng 2–3 là mùa hoa: cả vùng trắng xoá trong vài ngày và thơm gắt, nhưng lúc ấy không có hạt nào để hái. Tháng 11–12 mới là mùa thu hoạch, khi quả chín đỏ và cả nhà cùng ra rẫy. Ai muốn xem cảnh thì đi mùa hoa; ai muốn làm việc thật thì đi mùa quả.",
    viecLam: [
      "Hái quả chín chọn tay, không tuốt cả cành",
      "Phơi và xát vỏ theo cách của từng nhà",
      "Rang mẻ nhỏ rồi pha thử ngay tại chỗ",
    ],
    nenBiet:
      "Mùa thu hoạch là lúc chủ farm bận nhất trong năm. Đi vào đúng dịp ấy thì được làm việc thật, nhưng đừng kỳ vọng được chăm sóc như đi nghỉ dưỡng — và nên báo trước sớm.",
    vungSlugs: ["tay-nguyen-ca-phe", "cao-nguyen-lam-vien"],
  },
  {
    slug: "ruong-bac-thang",
    ten: "Ruộng bậc thang",
    tomTat:
      "Một kỹ thuật dẫn nước truyền qua nhiều đời, đẹp nhất ở hai thời điểm hoàn toàn khác nhau.",
    moDau:
      "Ruộng bậc thang không phải là phong cảnh; đó là một giải pháp kỹ thuật để trồng lúa nước trên sườn dốc, nước chảy từ thửa cao nhất xuống thửa thấp nhất mà không thửa nào thiếu. Vì thế nó đẹp hai lần trong năm: mùa nước đổ khi từng bậc loang loáng như gương, và mùa lúa chín khi cả sườn núi vàng rực. Giữa hai mùa ấy là những tháng ruộng chỉ có màu xanh — vẫn đi được, nhưng không phải điều người ta nhớ.",
    viecLam: [
      "Lội ruộng cấy hoặc gặt cùng chủ nhà",
      "Đi men bờ ruộng xem hệ thống dẫn nước giữa các thửa",
      "Ăn cơm nấu từ chính hạt gạo của thửa ruộng đó",
    ],
    nenBiet:
      "Bờ ruộng trơn và hẹp, giày bám tốt quan trọng hơn giày đẹp. Mùa nước đổ và mùa lúa chín lệch nhau vài tuần giữa các vùng, nên xem lịch mùa trước rồi mới chọn nơi.",
    vungSlugs: [
      "vung-cao-dong-bac",
      "tay-bac-ruong-bac-thang",
      "duyen-hai-mien-trung",
    ],
  },
  {
    slug: "vuon-cay-an-trai",
    ten: "Vườn cây ăn trái",
    tomTat:
      "Mận hậu trên cao nguyên, nho dưới nắng gió, trái cây miệt vườn — ba kiểu vườn cho ba kiểu mùa.",
    moDau:
      "Vườn trái cây là nơi dễ đi nhất với người mới, vì việc nhà nông ở đây nhẹ và mùa vụ rõ ràng. Nhưng ba vùng cho ba trải nghiệm khác hẳn: cao nguyên phía Bắc có mận và hoa mận đầu năm, vùng nắng gió Nam Trung Bộ có giàn nho và táo, còn miệt vườn sông nước thì trái chín gối nhau gần như suốt mùa hè. Chọn theo loại quả mình thật sự muốn ăn tại gốc, đừng chọn theo ảnh.",
    viecLam: [
      "Hái quả tại vườn và học cách chọn quả đúng độ chín",
      "Xem cách nhà vườn tỉa cành, bọc quả, giữ giống",
      "Làm thử món chế biến từ quả tươi ngay trong ngày",
    ],
    nenBiet:
      "Mùa quả ngắn và lệch theo thời tiết từng năm — đây là loại trải nghiệm dễ trượt mùa nhất. Gọi hỏi chủ vườn trong tuần trước khi đi là chắc chắn nhất.",
    vungSlugs: [
      "cao-nguyen-moc-chau",
      "nang-gio-nam-trung-bo",
      "miet-vuon-song-nuoc",
    ],
  },
  {
    slug: "chan-nuoi-va-sua",
    ten: "Chăn nuôi và nghề sữa",
    tomTat:
      "Đồng cỏ bò sữa trên cao nguyên và đàn cừu giữa vùng khô hạn — hai lối chăn nuôi trái ngược nhau.",
    moDau:
      "Chăn nuôi là phần việc nhà nông có nhịp đều đặn nhất: con vật không đợi mùa, ngày nào cũng phải làm. Trên cao nguyên Mộc Châu là đồng cỏ và nghề sữa, buổi sáng bắt đầu từ chuồng. Ở vùng nắng gió Nam Trung Bộ lại là đàn cừu giữa đồng khô, một lối chăn thả gần như không thấy ở nơi nào khác của Việt Nam. Ai muốn hiểu nhịp sống thật của một nông hộ thì đây là trải nghiệm gần nhất.",
    viecLam: [
      "Dậy sớm theo nhịp chuồng trại của nhà",
      "Làm thử một khâu trong nghề sữa",
      "Đi cùng đàn ra bãi chăn buổi chiều",
    ],
    nenBiet:
      "Việc bắt đầu từ tờ mờ sáng và không dời được. Đây cũng là trải nghiệm nên ở lại ít nhất hai đêm — đi lướt một ngày thì chỉ kịp xem, không kịp làm.",
    vungSlugs: ["cao-nguyen-moc-chau", "nang-gio-nam-trung-bo"],
  },
  {
    slug: "rau-hoa-on-doi",
    ten: "Rau và hoa ôn đới",
    tomTat:
      "Vùng khí hậu mát quanh năm cho phép trồng thứ mà phần còn lại của Việt Nam không trồng được.",
    moDau:
      "Rau ôn đới, dâu tây, atisô và hoa cắt cành tồn tại được ở Việt Nam là nhờ một dải cao nguyên có nền nhiệt mát gần như quanh năm. Đây là loại canh tác gần với kỹ thuật hơn là với mùa: nhà kính, giống, quy trình. Đi vùng này không phải để xem cảnh mùa vụ đổi thay, mà để hiểu một nền nông nghiệp chính xác — nơi chênh vài độ là hỏng cả lứa.",
    viecLam: [
      "Vào nhà kính xem quy trình từ ươm giống tới thu hái",
      "Hái dâu và phân loại theo tiêu chuẩn thật của nhà vườn",
      "Xem cách bảo quản và đóng gói trước khi rời vườn",
    ],
    nenBiet:
      "Vùng này đi được quanh năm, nên đừng chọn theo mùa mà chọn theo việc muốn xem. Tháng 10–12 là quãng mát và ít mưa nhất.",
    vungSlugs: ["cao-nguyen-lam-vien", "cao-nguyen-moc-chau"],
  },
];

// ─── Mùa ────────────────────────────────────────────────────────────────────

export interface Mua {
  slug: string;
  ten: string;
  thang: string;
  tomTat: string;
  moDau: string;
  /** Nhịp việc nhà nông đặc trưng của quãng này */
  nhipViec: string;
  vungSlugs: string[];
}

/**
 * Bốn quãng mùa theo nhịp canh tác, KHÔNG theo bốn mùa khí hậu.
 * Profile gọi lịch mùa là xương sống của cả hệ thống nội dung: người đi farmstay
 * nên chọn mùa trước rồi mới chọn vùng, ngược với thói quen đi chơi thông thường.
 */
export const MUA: Mua[] = [
  {
    slug: "dau-nam-mua-hoa",
    ten: "Đầu năm — mùa hoa",
    thang: "Tháng 1 – tháng 3",
    tomTat:
      "Quãng cây ra hoa: hoa mận trắng cao nguyên phía Bắc, hoa cà phê trắng cả vùng Tây Nguyên.",
    moDau:
      "Đây là quãng đẹp mắt nhất nhưng ít việc nhất trong năm. Cây đang ra hoa nghĩa là chưa có gì để thu, nên người đi thời điểm này chủ yếu được ngắm và được nghe kể. Bù lại, hoa cà phê chỉ nở rộ vài ngày và hoa mận cũng vậy — trượt là đợi trọn một năm.",
    nhipViec:
      "Chăm cây sau Tết, tỉa cành, chuẩn bị đất cho vụ mới. Vùng trung du bắt đầu vào lứa chè xuân.",
    vungSlugs: [
      "cao-nguyen-moc-chau",
      "tay-nguyen-ca-phe",
      "nang-gio-nam-trung-bo",
      "trung-du-che",
    ],
  },
  {
    slug: "giua-nam-mua-nuoc-do",
    ten: "Giữa năm — mùa nước đổ và mùa quả",
    thang: "Tháng 4 – tháng 6",
    tomTat:
      "Ruộng bậc thang loang nước như gương, còn miền xuôi và miệt vườn bắt đầu vào mùa quả.",
    moDau:
      "Quãng này chia làm hai nửa rõ rệt theo địa hình. Trên núi phía Bắc là mùa nước đổ, khi từng thửa ruộng bậc thang được dẫn nước và cả sườn núi sáng lên như gương — cũng là lúc người ta cấy. Xuống thấp, mận chín ở cao nguyên, nho vào lứa đầu ở vùng nắng gió, và miệt vườn sông nước bắt đầu rộ trái.",
    nhipViec:
      "Dẫn nước, cấy lúa trên ruộng bậc thang. Thu hái lứa quả đầu ở vùng thấp. Vụ chè ngon thứ nhất trong năm.",
    vungSlugs: [
      "tay-bac-ruong-bac-thang",
      "cao-nguyen-moc-chau",
      "duyen-hai-mien-trung",
      "miet-vuon-song-nuoc",
      "nang-gio-nam-trung-bo",
    ],
  },
  {
    slug: "cuoi-nam-mua-gat",
    ten: "Cuối hè sang thu — mùa gặt",
    thang: "Tháng 7 – tháng 10",
    tomTat:
      "Lúa chín vàng khắp các sườn núi phía Bắc; miền Tây bắt đầu mùa nước nổi.",
    moDau:
      "Nếu chỉ đi farmstay được một lần trong năm thì đây là quãng đáng đi nhất. Ruộng bậc thang chín vàng từ Đông Bắc sang Tây Bắc, vụ chè thứ hai vào độ ngon, và vùng đầu nguồn miền Tây bước vào mùa nước nổi với cả một hệ sinh kế riêng chỉ có mấy tháng ấy.",
    nhipViec:
      "Gặt lúa nương và lúa ruộng bậc thang, phơi thóc, nấu rượu. Miền Tây đánh bắt mùa nước nổi. Vụ chè thứ hai.",
    vungSlugs: [
      "vung-cao-dong-bac",
      "tay-bac-ruong-bac-thang",
      "trung-du-che",
      "miet-vuon-song-nuoc",
    ],
  },
  {
    slug: "cuoi-nam-mua-thu-hoach",
    ten: "Cuối năm — mùa thu hoạch cà phê",
    thang: "Tháng 11 – tháng 12",
    tomTat:
      "Cả Tây Nguyên vào vụ cà phê; cao nguyên Lâm Viên bước vào quãng mát và ít mưa nhất năm.",
    moDau:
      "Cuối năm là lúc bận nhất của vùng cà phê: quả chín đỏ, cả nhà và người làm cùng ra rẫy từ sáng sớm. Đây là quãng người đi được làm việc thật nhiều nhất, đổi lại chủ farm cũng bận nhất. Cùng thời điểm, cao nguyên Lâm Viên vào những tháng dễ chịu nhất, còn vùng nắng gió Nam Trung Bộ bắt đầu mùa khô ráo.",
    nhipViec:
      "Hái, phơi và xát cà phê. Vùng cao chuẩn bị đất cho vụ sau. Vùng ôn đới vào lứa rau và hoa cuối năm.",
    vungSlugs: [
      "tay-nguyen-ca-phe",
      "cao-nguyen-lam-vien",
      "nang-gio-nam-trung-bo",
      "vung-cao-dong-bac",
    ],
  },
];

// ─── Tuyến hành trình ───────────────────────────────────────────────────────

export interface Tuyen {
  slug: string;
  ten: string;
  doDai: string;
  tomTat: string;
  moDau: string;
  /** Lý do các vùng này nối được với nhau — bắt buộc, để tuyến không phải là danh sách ngẫu nhiên */
  vaySaoNoiDuoc: string;
  muaHop: string;
  /** Thứ tự điểm dừng, dùng đúng slug vùng */
  vungSlugs: string[];
}

export const TUYEN: Tuyen[] = [
  {
    slug: "vong-cung-tay-bac",
    ten: "Vòng cung Đông Bắc — Tây Bắc",
    doDai: "Gợi ý 5 – 7 ngày",
    tomTat:
      "Cung đường núi phía Bắc, nối ba vùng có cùng một câu chuyện: trồng lúa nước trên sườn dốc.",
    moDau:
      "Đây là cung đường farmstay dày đặc nhất phía Bắc, và cũng là cung khiến người đi vỡ ra nhiều nhất về nghề nông vùng cao. Bắt đầu ở cao nguyên đá Đông Bắc, đi tiếp sang những thửa ruộng bậc thang Tây Bắc, rồi hạ dần xuống cao nguyên Mộc Châu nơi đã có đồng cỏ và nghề sữa. Cùng một dải núi mà ba kiểu canh tác khác hẳn nhau.",
    vaySaoNoiDuoc:
      "Ba vùng nằm liền nhau trên cùng một dải núi phía Bắc, đi bằng đường bộ trong ngày giữa các chặng, và cùng chung nhịp mùa: mùa nước đổ giữa năm, mùa lúa chín cuối năm.",
    muaHop:
      "Tháng 9–10 nếu muốn thấy lúa chín; tháng 5–6 nếu muốn thấy mùa nước đổ.",
    vungSlugs: [
      "vung-cao-dong-bac",
      "tay-bac-ruong-bac-thang",
      "cao-nguyen-moc-chau",
    ],
  },
  {
    slug: "tu-doi-che-ra-bien",
    ten: "Từ đồi chè ra biển",
    doDai: "Gợi ý 4 – 6 ngày",
    tomTat:
      "Nối vùng trung du chè phía Bắc với dải duyên hải miền Trung — từ đồi xuống đồng bằng ven biển.",
    moDau:
      "Cung này đi qua hai nền canh tác thường bị coi là không liên quan: đồi chè trung du và đồng lúa, vườn rau, đầm phá ven biển miền Trung. Nhưng đi liền một mạch mới thấy chúng bổ cho nhau — một bên là cây công nghiệp lâu năm cần đồi dốc, một bên là canh tác ngắn ngày và nghề nước lợ phụ thuộc con nước. Hai nhịp sống, hai kiểu bận rộn.",
    vaySaoNoiDuoc:
      "Hai vùng nối nhau theo trục Bắc — Trung dọc quốc lộ chính, và cùng có quãng đẹp trùng nhau vào tháng 3–5, nên đi một chuyến bắt được cả hai.",
    muaHop:
      "Tháng 3–5: vụ chè xuân ở trung du trùng quãng khô ráo của duyên hải miền Trung.",
    vungSlugs: ["trung-du-che", "duyen-hai-mien-trung"],
  },
  {
    slug: "cao-nguyen-xuong-nang-gio",
    ten: "Cao nguyên xuống vùng nắng gió",
    doDai: "Gợi ý 5 – 7 ngày",
    tomTat:
      "Từ thủ phủ cà phê qua cao nguyên ôn đới rồi đổ xuống vùng khô hạn nhất nước.",
    moDau:
      "Trong khoảng vài trăm cây số, cung đường này đi qua ba tiểu khí hậu gần như không liên quan gì tới nhau: rẫy cà phê bazan, cao nguyên mát trồng rau và hoa ôn đới, rồi vùng nắng gió với giàn nho, ruộng muối và đàn cừu. Không nơi nào ở Việt Nam cho thấy đất và khí hậu quyết định nghề nông rõ như đoạn này.",
    vaySaoNoiDuoc:
      "Ba vùng nằm kế nhau theo trục cao nguyên đổ ra biển Nam Trung Bộ, đi đường bộ nửa ngày giữa các chặng, và cùng khô ráo vào quãng cuối năm.",
    muaHop:
      "Tháng 11–12: trùng vụ thu hoạch cà phê, quãng mát nhất của cao nguyên và đầu mùa khô vùng nắng gió.",
    vungSlugs: [
      "tay-nguyen-ca-phe",
      "cao-nguyen-lam-vien",
      "nang-gio-nam-trung-bo",
    ],
  },
];

// ─── Hàm tra cứu ────────────────────────────────────────────────────────────

/** Đổi danh sách slug vùng thành đối tượng vùng, bỏ qua slug không khớp. */
export function layVung(slugs: string[]): Vung[] {
  return slugs
    .map((s) => VUNG.find((v) => v.slug === s))
    .filter((v): v is Vung => Boolean(v));
}

export function timTraiNghiem(slug: string) {
  return TRAI_NGHIEM.find((t) => t.slug === slug);
}
export function timMua(slug: string) {
  return MUA.find((m) => m.slug === slug);
}
export function timTuyen(slug: string) {
  return TUYEN.find((t) => t.slug === slug);
}

/** Các trải nghiệm có mặt ở một vùng — dùng cho khối "Khám phá tiếp" trên trang vùng. */
export function traiNghiemTheoVung(vungSlug: string): TraiNghiem[] {
  return TRAI_NGHIEM.filter((t) => t.vungSlugs.includes(vungSlug));
}
/** Các quãng mùa mà vùng này đang trong độ đẹp. */
export function muaTheoVung(vungSlug: string): Mua[] {
  return MUA.filter((m) => m.vungSlugs.includes(vungSlug));
}
/** Các tuyến có đi qua vùng này. */
export function tuyenTheoVung(vungSlug: string): Tuyen[] {
  return TUYEN.filter((t) => t.vungSlugs.includes(vungSlug));
}

/**
 * Van chống trang mỏng — chạy lúc dựng, KHÔNG chạy lúc người dùng mở trang.
 *
 * Trả về danh sách lỗi. Một trang đích chỉ hợp lệ khi gom được ≥2 vùng thật và
 * mọi slug vùng nó khai đều tồn tại. Khai slug sai chính tả là lỗi im lặng điển
 * hình: trang vẫn dựng được, chỉ là thiếu mất một điểm đến mà không ai biết.
 */
export function kiemTraDuDay(): string[] {
  const loi: string[] = [];
  const kiem = (loai: string, slug: string, vungSlugs: string[]) => {
    const co = layVung(vungSlugs);
    if (co.length !== vungSlugs.length) {
      const thieu = vungSlugs.filter((s) => !VUNG.some((v) => v.slug === s));
      loi.push(
        `${loai}/${slug}: khai slug vùng không tồn tại — ${thieu.join(", ")}`
      );
    }
    if (co.length < 2) {
      loi.push(
        `${loai}/${slug}: chỉ gom được ${co.length} vùng, dưới sàn 2 vùng`
      );
    }
  };
  TRAI_NGHIEM.forEach((t) => kiem("trai-nghiem", t.slug, t.vungSlugs));
  MUA.forEach((m) => kiem("mua", m.slug, m.vungSlugs));
  TUYEN.forEach((t) => kiem("tuyen", t.slug, t.vungSlugs));
  return loi;
}
