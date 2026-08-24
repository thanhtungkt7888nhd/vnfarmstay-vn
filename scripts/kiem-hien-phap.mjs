/**
 * CỔNG HIẾN PHÁP — máy thi hành cho những Điều mà hiến pháp tự khai là "cửa mắt người".
 *
 * VÌ SAO CÓ TỆP NÀY: `HIEN-PHAP-VNFARMSTAY.md` ghi thẳng dưới bốn Điều rằng chúng
 * *"chưa có máy nào canh"*, và dưới Điều VI còn ghi *"đây là điều đáng dựng máy nhất
 * trong cả hiến pháp này"*. Một điều luật không có máy canh thì mỗi phiên làm việc
 * phải nhớ bằng đầu — và dự án đã có bằng chứng là không nhớ nổi: nút "Đặt phòng
 * ngay" sống trên trang hồ sơ suốt nhiều tháng, biểu mẫu đăng ký báo "thành công"
 * mà không lưu đi đâu.
 *
 * Hiến pháp còn chỉ đích danh máy cần dựng, tệp này làm đúng thế:
 *   Điều I   → "cổng máy soi từ vựng cấm (đặt phòng, giữ chỗ, thanh toán) trên toàn web"
 *   Điều VI  → "cổng máy dò nút không có đích và biểu mẫu không có nơi nhận"
 *   Điều VIII→ trang chủ không được là bệ đỡ cho cá nhân Người khởi xướng
 *   Điều cấm 5 → không liên kết chân trang toàn site giữa sáu web trong hệ
 *
 * KIẾN TRÚC — cố ý tách làm hai tầng, cùng lối với `kiem-seo.mjs`:
 *   ① Trình duyệt thật đi gom "HỒ SƠ TRANG" (một đối tượng thuần dữ liệu)
 *   ② Các hàm chấm là HÀM THUẦN, chỉ ăn hồ sơ đó
 * Nhờ vậy `--tu-kiem` chấm được trên hồ sơ BỊA sẵn, không cần dựng web — nên bộ đối
 * chứng hai chiều neo vào fixture chứ không neo vào dữ liệu thật (bài học
 * `lesson_doi_chung_neo_fixture_khong_neo_du_lieu_that`: neo vào dữ liệu thật thì
 * hôm nay web sạch, ca "phải bắt được" tự nhiên biến mất mà không ai hay).
 *
 * Chạy:  node scripts/kiem-hien-phap.mjs [http://localhost:3017]
 *        node scripts/kiem-hien-phap.mjs --tu-kiem     (chỉ chấm bộ đối chứng)
 */
import { chromium } from "playwright";

const CHI_TU_KIEM = process.argv.includes("--tu-kiem");
const GOC =
  process.argv.find((a) => a.startsWith("http")) ?? "http://localhost:3017";

/** Năm web anh em trong hệ — chân trang CẤM trỏ sang, chỉ được nối theo ngữ cảnh */
const WEB_ANH_EM = [
  "nhahoachdinh.vn",
  "hoachdinhmastery.vn",
  "xuyenvietfarmstay.vn",
  "hoachdinh.vn",
  "trandanhmanh.com",
];

/**
 * Từ vựng của một SÀN ĐẶT PHÒNG.
 * ⚠️ Chỉ soi trên NHÃN CỦA NÚT/LIÊN KẾT, KHÔNG soi trên văn xuôi. Web này nói
 * "chúng tôi không nhận đặt phòng" ở nhiều chỗ — đó là lời TỪ CHỐI, đúng hiến pháp.
 * Soi cả văn xuôi thì cổng sẽ bắt oan chính câu tuyên bố ranh giới. Điều I cấm
 * TÍNH NĂNG làm ta giống sàn, không cấm nhắc tới chữ.
 */
const TU_VUNG_SAN = [
  "đặt phòng",
  "đặt chỗ",
  "giữ chỗ",
  "thanh toán",
  "giỏ hàng",
  "thêm vào giỏ",
  "mua tour",
  "đặt tour",
  "book now",
  "checkout",
];

/** Tên riêng Người khởi xướng — trang chủ không được là bệ đỡ cho cá nhân */
const TEN_NGUOI_KHOI_XUONG = ["Phạm Thanh Tùng"];

// ─────────────────────────────────────────────────────────────
// TẦNG ②: CÁC HÀM CHẤM — thuần, chỉ ăn "hồ sơ trang"
// ─────────────────────────────────────────────────────────────

/**
 * Trần độ dài nhãn để còn được coi là một LỜI KÊU GỌI HÀNH ĐỘNG.
 *
 * ⚠️ Có con số này vì cổng đã báo oan thật ngày 24/08/2026: trang `/blog` bọc cả
 * THẺ BÀI VIẾT trong một thẻ `<a>`, nên tên khả truy cập của liên kết gồm cả tiêu
 * đề lẫn đoạn tóm tắt — trong đó có chữ "kênh đặt phòng". Đó là một bài viết BÀN VỀ
 * vận hành farmstay, không phải nút đặt phòng.
 *
 * Phân biệt bằng bản chất, không bằng cách nới lỏng: một nút kêu gọi hành động thì
 * NGẮN ("Đặt phòng ngay" 14 chữ), còn thẻ bài viết thì dài hàng trăm chữ. Nhãn dài
 * hơn trần này là văn xuôi, mà Điều I cấm TÍNH NĂNG chứ không cấm nhắc tới chữ.
 */
const TRAN_NHAN_CTA = 40;

/** Đ.I — nút/liên kết nào HỨA việc của một sàn đặt phòng */
export function nutHuaViecSan(hs) {
  return hs.dieuKhien
    .filter((d) => {
      const nhan = (d.nhan ?? "").trim();
      if (nhan.length > TRAN_NHAN_CTA) return false; // văn xuôi, không phải nút
      return TU_VUNG_SAN.some((t) => nhan.toLowerCase().includes(t));
    })
    .map((d) => `${d.the}["${d.nhan}"]`);
}

/** Điều cấm 6 — điểm đánh giá tổng hợp khi web không có chức năng nhận đánh giá */
export function schemaCoDiemDanhGia(hs) {
  const dinh = [];
  const dao = (nut, duong) => {
    if (nut === null || typeof nut !== "object") return;
    if (Array.isArray(nut)) return nut.forEach((n, i) => dao(n, `${duong}[${i}]`));
    for (const [khoa, gt] of Object.entries(nut)) {
      const k = khoa.toLowerCase();
      if (k === "aggregaterating" || k === "ratingvalue" || k === "reviewcount") {
        dinh.push(`${duong}.${khoa}`);
      }
      dao(gt, `${duong}.${khoa}`);
    }
  };
  hs.jsonLd.forEach((s, i) => dao(s, `jsonld[${i}]`));
  return dinh;
}

/**
 * Đ.VI — điều khiển KHÔNG CÓ ĐÍCH (vỏ rỗng).
 * Ba dạng: liên kết không href (hoặc href="#") · nút không phải nút gửi mà cũng
 * không ai nghe cú bấm · biểu mẫu không có nơi gửi mà cũng không ai nghe.
 */
export function dieuKhienChet(hs) {
  const chet = [];
  for (const d of hs.dieuKhien) {
    if (d.the === "a") {
      if (!d.href || d.href === "#" || d.href === "") {
        chet.push(`a["${d.nhan}"] không có đích`);
      }
    } else if (d.the === "button") {
      /* ⚠️ Miễn trừ theo VỊ TRÍ, không theo thuộc tính `type`.
         Đo thật 24/08/2026: nút "Mở menu" không khai `type` nào, mà HTML mặc định
         cho `<button>` LÀ "submit" — nên bản đầu của cổng này bỏ qua nó. Tức là
         MỌI nút không khai `type` đều lọt, kể cả nút chết. Cổng xanh mà rỗng.
         Chỉ nút NẰM TRONG biểu mẫu mới được miễn, vì ở đó biểu mẫu lo việc gửi;
         nút đứng ngoài mọi biểu mẫu mà không ai nghe thì chắc chắn là vỏ rỗng. */
      const duocMienVìTrongBieuMau =
        d.trongBieuMau && (d.loai === "submit" || d.loai === "reset");
      if (!duocMienVìTrongBieuMau && !d.coNguoiNghe) {
        chet.push(`button["${d.nhan}"] không ai nghe cú bấm`);
      }
    }
  }
  for (const f of hs.bieuMau) {
    if (!f.action && !f.coNguoiNghe) {
      chet.push(`form[${f.nhan}] không có nơi gửi`);
    }
  }
  return chet;
}

/** Đ.VIII — trang chủ nhắc tên riêng Người khởi xướng ngoài khối giới thiệu */
export function trangChuQuangBaCaNhan(hs) {
  if (hs.duongDan !== "/") return [];
  return TEN_NGUOI_KHOI_XUONG.filter((t) => (hs.chuNoiDung ?? "").includes(t));
}

/** Điều cấm 5 — chân trang trỏ sang web anh em (toàn site ⇒ mạng liên kết thao túng) */
export function chanTrangNoiWebAnhEm(hs) {
  return hs.lienKetChanTrang
    .filter((h) => WEB_ANH_EM.some((d) => h.includes(d)))
    .map((h) => h);
}

/**
 * Điều cấm 7 — `sameAs` chỉ được trỏ KÊNH ĐỊNH DANH của CÙNG MỘT thực thể.
 * Bài báo viết VỀ ai đó không phải là chính người đó — dùng `subjectOf`/`citation`.
 */
export function sameAsTroBaiBao(hs) {
  const xau = [];
  const DAU_HIEU_BAI = ["/blog/", "/tin-", "/bai-viet/", "/news/", "/p/"];
  const dao = (nut) => {
    if (nut === null || typeof nut !== "object") return;
    if (Array.isArray(nut)) return nut.forEach(dao);
    for (const [khoa, gt] of Object.entries(nut)) {
      if (khoa === "sameAs") {
        for (const u of [].concat(gt)) {
          if (typeof u === "string" && DAU_HIEU_BAI.some((d) => u.includes(d))) {
            xau.push(u);
          }
        }
      }
      dao(gt);
    }
  };
  hs.jsonLd.forEach(dao);
  return xau;
}

// ─────────────────────────────────────────────────────────────
// BỘ ĐỐI CHỨNG HAI CHIỀU — neo vào fixture, không neo dữ liệu thật
// ─────────────────────────────────────────────────────────────

const HS_SACH = {
  duongDan: "/",
  chuNoiDung:
    "vnfarmstay.vn không nhận đặt phòng và không thu hoa hồng. Việc của chúng tôi là kể câu chuyện của farm.",
  dieuKhien: [
    { the: "a", nhan: "Gọi chủ farm", href: "tel:0900000000", coNguoiNghe: false },
    // Nút gửi NẰM TRONG biểu mẫu ⇒ được miễn, biểu mẫu lo việc gửi
    {
      the: "button",
      nhan: "Gửi hồ sơ",
      loai: "submit",
      trongBieuMau: true,
      coNguoiNghe: false,
    },
    // Nút ngoài biểu mẫu nhưng CÓ người nghe ⇒ sống
    {
      the: "button",
      nhan: "Thấy thông tin sai?",
      loai: "button",
      trongBieuMau: false,
      coNguoiNghe: true,
    },
    // Nút mở menu: không khai `type` nên mặc định là "submit", NHƯNG đứng ngoài
    // mọi biểu mẫu — sống được là nhờ có người nghe, không nhờ cái `type` ấy
    {
      the: "button",
      nhan: "Mở menu",
      loai: "submit",
      trongBieuMau: false,
      coNguoiNghe: true,
    },
  ],
  bieuMau: [{ nhan: "dang-farmstay", action: "", coNguoiNghe: true }],
  lienKetChanTrang: ["/vung/trung-du-che", "/phap-ly"],
  jsonLd: [
    {
      "@type": "LodgingBusiness",
      name: "Farm mẫu",
      sameAs: ["https://farm-cua-toi.test/"],
    },
  ],
};

/**
 * Ca riêng cho phép chống-báo-oan: THẺ BÀI VIẾT bọc trong `<a>`, tên khả truy cập
 * dài và có chứa đúng từ vựng cấm. Cổng PHẢI im lặng ở đây.
 *
 * ⚠️ Ca này bắt buộc phải nằm trong corpus, không phải cho đủ số. Bài học
 * `lesson_bo_loc_chong_bao_oan_bit_loi_that`: bộ lọc chống báo oan rất dễ bịt luôn
 * lỗi thật. Có ca này thì mỗi lần ai nới trần, phép "mẫu BẨN mà cổng im lặng" ở
 * ngay bên cạnh sẽ đỏ lên.
 */
const HS_THE_BAI_VIET = {
  ...HS_SACH,
  duongDan: "/blog",
  dieuKhien: [
    {
      the: "a",
      nhan: "Vận hành farmstay hiệu quả: từ booking online đến trải nghiệm khách. Quy trình vận hành farmstay chuẩn từ A–Z: kênh đặt phòng, quản lý nhân sự, lịch trình trải nghiệm nông nghiệp. 01/04/2026 · 11 phút đọc",
      href: "/blog/van-hanh-farmstay",
      coNguoiNghe: false,
    },
  ],
};

const HS_BAN = {
  duongDan: "/",
  chuNoiDung:
    "Trang chủ do Phạm Thanh Tùng dẫn dắt, mời bạn đặt phòng ngay hôm nay.",
  dieuKhien: [
    {
      the: "button",
      nhan: "Đặt phòng ngay",
      loai: "button",
      trongBieuMau: false,
      coNguoiNghe: false,
    },
    { the: "a", nhan: "Liên hệ chủ farmstay", href: "", coNguoiNghe: false },
    { the: "a", nhan: "Xem thêm", href: "#", coNguoiNghe: false },
  ],
  bieuMau: [{ nhan: "dang-ky", action: "", coNguoiNghe: false }],
  lienKetChanTrang: ["https://nhahoachdinh.vn", "https://xuyenvietfarmstay.vn"],
  jsonLd: [
    {
      "@type": "LodgingBusiness",
      aggregateRating: { "@type": "AggregateRating", ratingValue: 4.9, reviewCount: 127 },
      sameAs: ["https://bao-nao-do.test/blog/farmstay-hay-nhat"],
    },
  ],
};

function tuKiem() {
  const ca = [
    [
      "Đ.I — nút hứa việc sàn",
      () => nutHuaViecSan(HS_SACH).length === 0,
      () => nutHuaViecSan(HS_BAN).length === 1,
    ],
    [
      "Đ.I — lời TỪ CHỐI trong văn xuôi KHÔNG bị bắt oan",
      // Hồ sơ sạch có đúng chữ "đặt phòng" trong câu phủ định mà vẫn phải im lặng
      () =>
        HS_SACH.chuNoiDung.includes("đặt phòng") &&
        nutHuaViecSan(HS_SACH).length === 0,
      // Mẫu bẩn cũng có chữ ấy trong văn xuôi, nhưng bị bắt vì có NÚT, không vì chữ
      () => nutHuaViecSan(HS_BAN).length > 0,
    ],
    [
      "Đ.I — thẻ BÀI VIẾT chứa từ vựng cấm KHÔNG bị bắt oan",
      // Nhãn dài = văn xuôi trong thẻ bài, dù có đúng chữ "đặt phòng" vẫn phải im
      () => nutHuaViecSan(HS_THE_BAI_VIET).length === 0,
      // Nhưng NÚT NGẮN thì vẫn phải bắt — canh không ai nới trần cho qua
      () =>
        nutHuaViecSan({
          ...HS_THE_BAI_VIET,
          dieuKhien: [
            { the: "a", nhan: "Đặt phòng ngay", href: "/x", coNguoiNghe: false },
          ],
        }).length === 1,
    ],
    [
      "điều cấm 6 — điểm đánh giá tổng hợp",
      () => schemaCoDiemDanhGia(HS_SACH).length === 0,
      () => schemaCoDiemDanhGia(HS_BAN).length === 3,
    ],
    [
      "Đ.VI — điều khiển không có đích",
      () => dieuKhienChet(HS_SACH).length === 0,
      () => dieuKhienChet(HS_BAN).length === 4,
    ],
    [
      "Đ.VI — nút KHÔNG khai `type`, đứng NGOÀI biểu mẫu, không ai nghe ⇒ phải bắt",
      // Chiều xanh: đúng nút ấy nhưng CÓ người nghe thì phải im (nút "Mở menu" thật)
      () =>
        dieuKhienChet({
          ...HS_SACH,
          dieuKhien: [
            { the: "button", nhan: "Mở menu", loai: "submit", trongBieuMau: false, coNguoiNghe: true },
          ],
        }).length === 0,
      // Chiều đỏ: y hệt nhưng KHÔNG ai nghe ⇒ vỏ rỗng, phải bắt.
      // Đây chính là lỗ hổng bản đầu bỏ lọt vì tin vào thuộc tính `type`.
      () =>
        dieuKhienChet({
          ...HS_SACH,
          dieuKhien: [
            { the: "button", nhan: "Mở menu", loai: "submit", trongBieuMau: false, coNguoiNghe: false },
          ],
        }).length === 1,
    ],
    [
      "Đ.VIII — trang chủ quảng bá cá nhân",
      () => trangChuQuangBaCaNhan(HS_SACH).length === 0,
      () => trangChuQuangBaCaNhan(HS_BAN).length === 1,
    ],
    [
      "Đ.VIII — trang KHÁC trang chủ thì được phép nhắc tên",
      () =>
        trangChuQuangBaCaNhan({ ...HS_BAN, duongDan: "/ve-chung-toi" }).length === 0,
      () => trangChuQuangBaCaNhan(HS_BAN).length === 1,
    ],
    [
      "điều cấm 5 — chân trang nối web anh em",
      () => chanTrangNoiWebAnhEm(HS_SACH).length === 0,
      () => chanTrangNoiWebAnhEm(HS_BAN).length === 2,
    ],
    [
      "điều cấm 7 — sameAs trỏ bài báo",
      () => sameAsTroBaiBao(HS_SACH).length === 0,
      () => sameAsTroBaiBao(HS_BAN).length === 1,
    ],
  ];

  const hong = [];
  for (const [ten, chieuXanh, chieuDo] of ca) {
    if (!chieuXanh()) hong.push(`${ten}: mẫu SẠCH mà cổng vẫn kêu`);
    if (!chieuDo()) hong.push(`${ten}: mẫu BẨN mà cổng im lặng`);
  }
  return { soCa: ca.length, hong };
}

// ─────────────────────────────────────────────────────────────
// TẦNG ①: gom hồ sơ trang bằng trình duyệt thật
// ─────────────────────────────────────────────────────────────

/**
 * Đọc hồ sơ một trang.
 * ⚠️ Phải dùng trình duyệt thật, không đọc HTML thô: người nghe cú bấm là thứ React
 * gắn lúc chạy, HTML máy chủ trả về KHÔNG hề có dấu vết nào của nó. Quét HTML thô
 * sẽ kết luận mọi nút đều chết — báo oan toàn tập.
 */
async function docHoSo(trang, duongDan) {
  return trang.evaluate((duongDan) => {
    const chuNhan = (e) =>
      (e.getAttribute("aria-label") || e.textContent || "").replace(/\s+/g, " ").trim();

    /* `getEventListeners` chỉ có trong bảng điều khiển của trình duyệt, không có
       trong trang. Nên nhận biết "có người nghe" theo cách khác: React 17+ gắn một
       bộ nghe duy nhất ở gốc rồi phân phát, nên phải dò thuộc tính nội bộ của React
       trên chính phần tử. */
    const coNguoiNgheReact = (e) => {
      const khoa = Object.keys(e).find(
        (k) => k.startsWith("__reactProps$") || k.startsWith("__reactEventHandlers$")
      );
      if (!khoa) return false;
      const p = e[khoa];
      return typeof p?.onClick === "function" || typeof p?.onSubmit === "function";
    };

    const dieuKhien = [...document.querySelectorAll("a, button")].map((e) => ({
      the: e.tagName.toLowerCase(),
      nhan: chuNhan(e),
      href: e.tagName === "A" ? e.getAttribute("href") : undefined,
      loai: e.tagName === "BUTTON" ? e.getAttribute("type") || "submit" : undefined,
      /* Nút có nằm trong biểu mẫu không — căn cứ miễn trừ duy nhất được chấp nhận */
      trongBieuMau: e.tagName === "BUTTON" ? Boolean(e.closest("form")) : undefined,
      coNguoiNghe: coNguoiNgheReact(e),
    }));

    const bieuMau = [...document.querySelectorAll("form")].map((f) => ({
      nhan: f.getAttribute("aria-label") || f.id || "(không tên)",
      action: f.getAttribute("action") || "",
      coNguoiNghe: coNguoiNgheReact(f),
    }));

    const chanTrang = document.querySelector("footer");
    const lienKetChanTrang = chanTrang
      ? [...chanTrang.querySelectorAll("a[href]")].map((a) => a.getAttribute("href"))
      : [];

    /* Chữ nội dung = phần thân trang, KHÔNG tính thanh điều hướng và chân trang —
       hai khối đó có mặt trên mọi trang nên không nói lên điều gì về trang này. */
    const main = document.querySelector("main");
    const chuNoiDung = main ? main.innerText : document.body.innerText;

    const jsonLd = [...document.querySelectorAll('script[type="application/ld+json"]')]
      .map((s) => {
        try {
          return JSON.parse(s.textContent);
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    return { duongDan, dieuKhien, bieuMau, lienKetChanTrang, chuNoiDung, jsonLd };
  }, duongDan);
}

/** Lấy danh sách đường dẫn từ sitemap — đo đúng những trang web tự khai là của mình */
async function layDuongDan() {
  const res = await fetch(`${GOC}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .sort();
}

const PHEP = [
  ["HP.1 · Điều I — nút hứa việc của một sàn đặt phòng", nutHuaViecSan],
  ["HP.2 · điều cấm 6 — điểm đánh giá tổng hợp trong schema", schemaCoDiemDanhGia],
  ["HP.3 · Điều VI — điều khiển không có đích (vỏ rỗng)", dieuKhienChet],
  ["HP.4 · Điều VIII — trang chủ quảng bá cá nhân Người khởi xướng", trangChuQuangBaCaNhan],
  ["HP.5 · điều cấm 5 — chân trang nối web anh em toàn site", chanTrangNoiWebAnhEm],
  ["HP.6 · điều cấm 7 — sameAs trỏ bài báo", sameAsTroBaiBao],
];

async function main() {
  // ① Tự kiểm TRƯỚC — công cụ không đáng tin thì kết quả đo web cũng không đáng tin
  const { soCa, hong } = tuKiem();
  if (hong.length > 0) {
    console.error("✗ CỔNG HIẾN PHÁP — TỰ KIỂM RỚT, chưa đo web thật:");
    hong.forEach((h) => console.error("  · " + h));
    process.exit(1);
  }
  console.log(`✓ Tự kiểm: ${soCa}/${soCa} ca đối chứng hai chiều qua.`);
  if (CHI_TU_KIEM) return;

  // ② Đo web thật
  const duongDan = await layDuongDan();
  const tr = await chromium.launch();
  const trang = await tr.newPage({ viewport: { width: 1280, height: 900 } });
  const viPham = new Map(PHEP.map(([ten]) => [ten, []]));

  for (const dd of duongDan) {
    await trang.goto(`${GOC}${dd}`, { waitUntil: "load" });
    /* Chờ React gắn xong người nghe — đo sớm là kết luận nhầm mọi nút đều chết */
    await trang.waitForFunction(
      () =>
        !document.querySelector("[aria-busy='true']") &&
        Object.keys(document.body).some((k) => k.startsWith("__react")),
      { timeout: 15000 }
    ).catch(() => {});
    const hs = await docHoSo(trang, dd);
    for (const [ten, ham] of PHEP) {
      const ra = ham(hs);
      if (ra.length > 0) viPham.get(ten).push(`${dd} → ${ra.join(" · ")}`);
    }
  }
  await tr.close();

  const tong = [...viPham.values()].reduce((a, b) => a + b.length, 0);
  console.log(`\nĐo ${duongDan.length} trang · ${PHEP.length} phép hiến pháp\n`);
  for (const [ten, ds] of viPham) {
    if (ds.length === 0) {
      console.log(`  ✓ ${ten}`);
    } else {
      console.log(`  ✗ ${ten} — ${ds.length} trang:`);
      ds.slice(0, 6).forEach((d) => console.log(`      ${d}`));
      if (ds.length > 6) console.log(`      … và ${ds.length - 6} trang nữa`);
    }
  }

  if (tong > 0) {
    console.error(`\n✗ CỔNG HIẾN PHÁP: ${tong} vi phạm.`);
    process.exit(1);
  }
  console.log(`\n✓ CỔNG HIẾN PHÁP: ${duongDan.length} trang, 0 vi phạm.`);
}

main().catch((e) => {
  console.error("✗ CỔNG HIẾN PHÁP — không chạy được:", e);
  process.exit(1);
});
