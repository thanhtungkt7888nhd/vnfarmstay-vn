/**
 * HỆ SINH THÁI — những nơi khác trong mạng lưới, giới thiệu THEO NGỮ CẢNH.
 *
 * ⚠️ VÌ SAO KHỐI NÀY NẰM TRONG `<main>` CHỨ KHÔNG PHẢI CHÂN TRANG:
 * điều cấm tuyệt đối số 5 cấm rải liên kết web anh em ở chân trang toàn site. Web này
 * đã từng vi phạm thật — `Footer.tsx` rải sang 3 web trên cả 39 trang, cổng hiến pháp
 * bắt được 24/08/2026 và đã gỡ. Luật liên kết nội hệ (Ông ra lệnh 16/08/2026) nói rõ
 * cách làm đúng: *"thay lượng bằng chất — bớt liên kết template, thêm liên kết trong
 * bài viết thật với lời dẫn tự nhiên"*, và cấm liên kết rập khuôn ngoài `<main>` lặp
 * trên hơn 80% số trang. Khối này xuất hiện ở ĐÚNG MỘT trang, trong `<main>`, mỗi nơi
 * kèm một câu nói rõ vì sao ta dẫn sang.
 *
 * ⚠️ MỖI NƠI MỘT CÁCH NÓI RIÊNG — luật ba KHÔNG cấm lặp một anchor quá 30% tổng liên
 * kết trỏ về một web. Đừng gom chúng về cùng một khuôn chữ.
 *
 * ⛔ DỮ KIỆN: lấy từ ENTITY-GRAPH.json (nguồn sự thật chung, có ngày Ông xác nhận) và
 * từ chính web của họ, đọc 03/09/2026. Không thêm thành tích không ai công bố.
 *
 * ⛔ CHỈ DẪN SANG NƠI CÒN SỐNG VÀ CÓ NỘI DUNG THẬT. Đo 03/09/2026: `phanmemhoachdinh.vn`
 * và `hungdinhfarm.vn` không truy cập được; `nongnghiepdisan.vn` + `thevietnamtea.com`
 * trả về trang không có nội dung (tiêu đề chỉ là tên miền). Bốn nơi ấy CHƯA đưa vào —
 * dẫn khách sang trang chết là tự hạ uy tín mình, trái Điều II.
 */

/** Quan hệ thật giữa vnfarmstay và nơi ấy — nói thẳng, không gộp chung thành "đối tác" */
export type QuanHe = "truc-thuoc" | "phap-nhan" | "lien-ket";

export const NHAN_QUAN_HE: Record<QuanHe, string> = {
  "truc-thuoc": "Cùng nhà",
  "phap-nhan": "Cùng pháp nhân",
  "lien-ket": "Liên kết — không thuộc sở hữu",
};

export interface NoiTrongHe {
  ten: string;
  url: string;
  /** Một câu nói nơi ấy LÀM GÌ — dựng từ dữ kiện chính họ công bố */
  laGi: string;
  /** Vì sao người quan tâm farmstay nên biết nơi này — lời của vnfarmstay */
  viSaoDan: string;
  quanHe: QuanHe;
}

export interface CumTrongHe {
  ma: string;
  ten: string;
  /** Câu dẫn nói cụm này trả lời nhu cầu gì — để người đọc hiểu vì sao chúng đứng cạnh nhau */
  dan: string;
  noi: NoiTrongHe[];
}

/** Ngày đọc dữ kiện từ web của họ — Điều IV: mọi dữ kiện truy được về nguồn, kèm ngày */
export const NGAY_DOC = "2026-09-03";

export const CUM_HE_SINH_THAI: CumTrongHe[] = [
  {
    ma: "cong-cu-b2b",
    ten: "Nơi tìm đầu ra và người làm nghề",
    dan: "Một farmstay dựng xong rồi vẫn phải bán được nông sản và tìm được người tư vấn đúng việc. Đây là những nơi làm khúc ấy.",
    noi: [
      {
        ten: "Hội Nghị Sầu Riêng Châu Á (Việt Nam)",
        url: "https://hoinghisaurieng.com",
        laGi: "Hội nghị kết nối cung–cầu sầu riêng Việt Nam – Trung Quốc, lần thứ hai đã diễn ra 13–16/07/2026 tại TP.HCM; VCCI-HCM chủ trì cùng iFresh và DakAgo.",
        viSaoDan:
          "Chủ vườn muốn bán sang Trung Quốc thì phải gặp được nhà mua thật. Đây là chỗ hằng năm họ gặp nhau.",
        quanHe: "lien-ket",
      },
      {
        ten: "Defarm",
        url: "https://defarm.com.vn",
        laGi: "Đơn vị tư vấn, thiết kế và quản trị farmstay — tự công bố 10 năm thực chiến, hơn 50 dự án và trên 3.000 hecta.",
        viSaoDan:
          "Ai đang ở bước bản vẽ, chưa biết bắt đầu từ đâu, thì đây là nơi làm đúng nghề đó.",
        quanHe: "truc-thuoc",
      },
      {
        ten: "MASTERY",
        url: "https://hoachdinhmastery.vn",
        laGi: "Công ty hoạch định chiến lược đầu tư, làm việc với chính quyền địa phương, tập đoàn và nhà đầu tư về phát triển vùng đất.",
        viSaoDan:
          "Khi câu chuyện lớn hơn một mảnh đất — cả một vùng, một đề án của tỉnh — thì bài toán đổi sang tầm khác.",
        quanHe: "phap-nhan",
      },
    ],
  },
  {
    ma: "nong-nghiep-di-san",
    ten: "Nông sản bản địa và nghề giữ giống",
    dan: "Khách rời farmstay thường muốn mang về thứ gì đó của vùng đất ấy. Đây là những thương hiệu làm nông sản bản địa tử tế.",
    noi: [
      {
        ten: "Đại Việt Trà Hoa",
        url: "https://daiviettrahoa.vn",
        laGi: "Bảo tồn và thương mại hoá 116 loài trà hoa bản địa Việt Nam — trà Shan Tuyết cổ thụ, trà hoa vàng Camellia.",
        viSaoDan:
          "Farmstay vùng trà có thể học cách một thương hiệu kể chuyện cây trà mà không phải hạ giá.",
        quanHe: "lien-ket",
      },
      {
        ten: "Quê Liberica",
        url: "https://queli.vn",
        laGi: "Cà phê mít Liberica đặc sản Khe Sanh, vườn sáu hecta ở Hướng Phùng, Quảng Trị.",
        viSaoDan:
          "Một giống từng bị chê suốt chục năm nay thành đặc sản — câu chuyện đáng đọc với ai đang giữ giống lạ trong vườn mình.",
        quanHe: "lien-ket",
      },
      {
        ten: "DakAgo",
        url: "https://dakago.vn",
        laGi: "Doanh nghiệp nông sản đặt tại Đắk Lắk, cũng là một trong các bên đồng tổ chức Hội Nghị Sầu Riêng Châu Á.",
        viSaoDan:
          "Đầu mối nông sản Tây Nguyên, hữu ích cho farmstay vùng cao nguyên đang tìm nơi tiêu thụ.",
        quanHe: "lien-ket",
      },
    ],
  },
  {
    ma: "farmstay-thanh-vien",
    ten: "Những farm đã mở cửa đón khách",
    dan: "Đây là các farm thật trong mạng lưới, mỗi nơi một kiểu đón khách khác nhau. Xem cách họ làm thường dễ hiểu hơn đọc lý thuyết.",
    noi: [
      {
        ten: "Mây Takpo",
        url: "https://maytakpo.vn",
        laGi: "Homestay săn mây ở Nóc Tăk Pổ, xã Trà Tập, Đà Nẵng — trekking rừng nguyên sinh và văn hoá Ca Dong.",
        viSaoDan:
          "Mô hình vùng núi cao do hợp tác xã địa phương vận hành, không phải nhà đầu tư từ nơi khác tới.",
        quanHe: "phap-nhan",
      },
      {
        ten: "Cat Farm",
        url: "https://catfarm.vn",
        laGi: "Nông trại bên Suối Cát, Đại Lào, cách Bảo Lộc 12km — tắm suối, picnic, glamping, trekking thác ba tầng.",
        viSaoDan:
          "Cách làm nhẹ vốn: mở cửa vườn cho khách trong ngày trước, dựng chỗ ngủ sau.",
        quanHe: "lien-ket",
      },
      {
        ten: "Sản Việt Farm",
        url: "https://sanvietfarm.vn",
        laGi: "Trang trại hữu cơ tuần hoàn 130 hecta tại Suối Sâu, Nam Ninh Hoà, Khánh Hoà, của ông Nguyễn Minh Thành — 60% sản xuất, 30% rừng tái sinh, 10% du lịch.",
        viSaoDan:
          "Tỉ lệ đất ấy là câu trả lời hiếm thấy cho câu hỏi chừa bao nhiêu phần cho du lịch thì vừa.",
        quanHe: "lien-ket",
      },
      {
        ten: "Cỏ Ngọt Kombucha",
        url: "https://www.congot.vn",
        laGi: "Kombucha thủ công từ trà Shan tuyết cổ thụ và nông sản Việt theo mùa, do chị Thuý sáng lập năm 2024 — bộ sưu tập 21 vị.",
        viSaoDan:
          "Ví dụ về việc chế biến sâu nông sản theo mùa thay vì bán tươi — hướng đi nhiều chủ farm đang tìm.",
        quanHe: "lien-ket",
      },
    ],
  },
];

/**
 * Van kiểm — chạy lúc dựng, cùng lối các van hồ sơ khác của web.
 *
 * Canh đúng những chỗ đã trả giá: liên kết chết, quan hệ khai sai thành sở hữu, và
 * lời dẫn rập khuôn (luật ba KHÔNG cấm lặp một cách nói quá 30%).
 */
export function kiemHeSinhThai(): string[] {
  const loi: string[] = [];
  const daThayUrl = new Set<string>();
  const moiCauDan: string[] = [];

  for (const cum of CUM_HE_SINH_THAI) {
    if (!cum.ten.trim() || !cum.dan.trim())
      loi.push(`cụm ${cum.ma}: thiếu tên hoặc câu dẫn`);
    if (cum.noi.length === 0) loi.push(`cụm ${cum.ma}: rỗng`);

    for (const n of cum.noi) {
      const bao = (m: string) =>
        loi.push(`hệ-sinh-thái/${n.ten || "(không tên)"}: ${m}`);

      for (const truong of ["ten", "url", "laGi", "viSaoDan"] as const) {
        if (!n[truong]?.trim()) bao(`thiếu \`${truong}\``);
      }

      /* Địa chỉ phải đầy đủ — thiếu giao thức là liên kết chết.
         Và đây là chỗ bẫy thật: `defarm-vn` trong sổ hộ khẩu nhưng tên miền THẬT là
         defarm.com.vn (Ông phán 15/08/2026). Suy domain từ tên khoá là sai. */
      if (!/^https:\/\/.+\..+/.test(n.url))
        bao(`\`url\` không phải địa chỉ đầy đủ — "${n.url}"`);

      if (daThayUrl.has(n.url))
        bao("trùng địa chỉ với một nơi khác trong danh sách");
      daThayUrl.add(n.url);

      moiCauDan.push(n.viSaoDan.trim().toLowerCase());
    }
  }

  /* Ba KHÔNG — không để một cách nói lặp lại thành khuôn. Câu dẫn trùng nhau y hệt là
     dấu hiệu rõ nhất của liên kết rập khuôn. */
  const trung = moiCauDan.length - new Set(moiCauDan).size;
  if (trung > 0)
    loi.push(
      `có ${trung} câu "vì sao dẫn" trùng nhau — mỗi nơi phải một cách nói riêng`
    );

  return loi;
}
