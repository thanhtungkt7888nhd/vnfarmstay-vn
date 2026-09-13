/**
 * VAN KIỂM HỒ SƠ FARMSTAY — chặn hồ sơ thiếu trường bắt buộc ngay LÚC DỰNG WEB.
 *
 * Vì sao chạy lúc dựng chứ không lúc người dùng mở trang: hồ sơ hỏng phải làm
 * ĐỨT BUILD để người dựng thấy ngay, chứ không âm thầm render nửa vời cho khách xem.
 * Cùng lối với `kiemTraDuDay()` ở `src/features/kham-pha/data.ts`.
 *
 * Van trả về DANH SÁCH LỖI dạng chữ, mỗi lỗi nêu ĐÚNG TÊN TRƯỜNG sai — nêu chung
 * chung kiểu "hồ sơ không hợp lệ" thì người sửa vẫn phải mò, van coi như vô dụng.
 */
import { MUA, TRAI_NGHIEM } from "@/features/kham-pha/data";
import { VUNG } from "@/features/vung/data";
import type { Farmstay } from "@/shared/types/farmstay";

/** Số kênh liên hệ tối thiểu — Master Prompt đòi ≥2, đây là mục tiêu chuyển đổi số 1 */
const SAN_KENH_LIEN_HE = 2;

/** Bốn cấp xác minh hợp lệ */
const CAP_XAC_MINH_HOP_LE = [1, 2, 3, 4];

/** Ngày phải dạng YYYY-MM-DD — ngày mờ ("mùa hè 2026") thì không tính tuổi hồ sơ được */
const DANG_NGAY = /^\d{4}-\d{2}-\d{2}$/;

/**
 * Toàn bộ khoá hợp lệ của một hồ sơ — phải khớp `interface Farmstay`.
 * Van cũ chỉ bắt THIẾU trường; Điều VII đòi cả chiều ngược lại: mỗi trường phải trả lời
 * được "phục vụ Điều nào?", không trả lời được thì nó là di sản của một web khác.
 */
const KHOA_HOP_LE = new Set([
  "id",
  "slug",
  "ten",
  "tinh",
  "diaChi",
  "vungSlug",
  "toaDo",
  "traiNghiemSlugs",
  "muaSlugs",
  "cauChuyen",
  "lichMuaVu",
  "duongDi",
  "ungXu",
  "anh",
  "lienHe",
  "capXacMinh",
  "nguon",
  "ngayDo",
  "ngayRaSoat",
  "the",
  "giaThamKhao",
]);

/**
 * Trường mang HÌNH DẠNG SÀN ĐẶT PHÒNG — mọc lại cái nào là web đổi danh tính cái đó,
 * bất kể trang giới thiệu viết gì (Điều VII). Sáu tên đầu chính là bộ trường đã bị gỡ
 * ngày 24/08/2026; các tên sau là biến thể tiếng Việt cùng nghĩa, chặn luôn đường vòng.
 */
const TRUONG_KIEU_SAN = new Set([
  "price",
  "rating",
  "reviewcount",
  "badges",
  "emoji",
  "region",
  "gia",
  "giaphong",
  "sosao",
  "danhgia",
  "sodanhgia",
  "huyhieu",
  "mien",
  "bookingurl",
  "datphong",
  "hoahong",
  "commission",
  "giohang",
]);

/** Trường chữ bắt buộc: tên trường → giá trị. Rỗng hoặc toàn khoảng trắng đều là thiếu. */
function truongChuBatBuoc(f: Farmstay): Record<string, unknown> {
  return {
    id: f.id,
    slug: f.slug,
    ten: f.ten,
    tinh: f.tinh,
    diaChi: f.diaChi,
    vungSlug: f.vungSlug,
    cauChuyen: f.cauChuyen,
    duongDi: f.duongDi,
    ungXu: f.ungXu,
    nguon: f.nguon,
    ngayDo: f.ngayDo,
    ngayRaSoat: f.ngayRaSoat,
  };
}

/**
 * Kiểm MỘT hồ sơ. Trả mảng lỗi — rỗng nghĩa là đạt.
 * @param nhan tên gọi hồ sơ trong thông báo lỗi (mặc định lấy slug)
 */
export function kiemHoSoFarmstay(f: Farmstay, nhan?: string): string[] {
  const ten = nhan ?? f?.slug ?? "(không rõ)";
  const loi: string[] = [];
  const bao = (msg: string) => loi.push(`farmstay/${ten}: ${msg}`);

  // ① Trường chữ bắt buộc
  for (const [truong, giaTri] of Object.entries(truongChuBatBuoc(f))) {
    if (typeof giaTri !== "string" || giaTri.trim() === "") {
      bao(`thiếu trường bắt buộc \`${truong}\``);
    }
  }

  // ② Vùng phải là 1 trong 9 vùng CÓ THẬT — mã bịa làm đứt trục địa lý mà build vẫn xanh
  if (typeof f?.vungSlug === "string" && f.vungSlug.trim() !== "") {
    if (!VUNG.some((v) => v.slug === f.vungSlug)) {
      bao(`\`vungSlug\` khai mã không tồn tại — "${f.vungSlug}"`);
    }
  }

  // ③ Toạ độ phải là số thật, nằm trong khung Việt Nam
  const viDo = f?.toaDo?.viDo;
  const kinhDo = f?.toaDo?.kinhDo;
  if (typeof viDo !== "number" || !Number.isFinite(viDo)) {
    bao("thiếu trường bắt buộc `toaDo.viDo`");
  } else if (viDo < 8 || viDo > 24) {
    bao(`\`toaDo.viDo\` ngoài lãnh thổ Việt Nam — ${viDo}`);
  }
  if (typeof kinhDo !== "number" || !Number.isFinite(kinhDo)) {
    bao("thiếu trường bắt buộc `toaDo.kinhDo`");
  } else if (kinhDo < 102 || kinhDo > 110) {
    bao(`\`toaDo.kinhDo\` ngoài lãnh thổ Việt Nam — ${kinhDo}`);
  }

  // ④ Trải nghiệm & mùa phải nối được vào trang có thật
  const maBia = (khai: unknown, kho: { slug: string }[]) =>
    Array.isArray(khai)
      ? khai.filter((s) => !kho.some((k) => k.slug === s))
      : [];
  const tnBia = maBia(f?.traiNghiemSlugs, TRAI_NGHIEM);
  if (tnBia.length > 0) {
    bao(`\`traiNghiemSlugs\` khai mã không tồn tại — ${tnBia.join(", ")}`);
  }
  const muaBia = maBia(f?.muaSlugs, MUA);
  if (muaBia.length > 0) {
    bao(`\`muaSlugs\` khai mã không tồn tại — ${muaBia.join(", ")}`);
  }

  // ⑤ Lịch mùa vụ — mỗi mục phải trỏ mùa có thật và nói CỤ THỂ mùa đó có gì
  if (!Array.isArray(f?.lichMuaVu) || f.lichMuaVu.length === 0) {
    bao("thiếu trường bắt buộc `lichMuaVu`");
  } else {
    f.lichMuaVu.forEach((m, i) => {
      if (!MUA.some((k) => k.slug === m?.muaSlug)) {
        bao(
          `\`lichMuaVu[${i}].muaSlug\` khai mã không tồn tại — "${m?.muaSlug}"`
        );
      }
      if (typeof m?.coGi !== "string" || m.coGi.trim() === "") {
        bao(`thiếu trường bắt buộc \`lichMuaVu[${i}].coGi\``);
      }
    });
  }

  // ⑥ Ảnh thực địa — bắt buộc ≥1, mỗi ảnh có chữ thay ảnh
  if (!Array.isArray(f?.anh) || f.anh.length === 0) {
    bao("thiếu trường bắt buộc `anh` — hồ sơ phải có ít nhất 1 ảnh thực địa");
  } else {
    f.anh.forEach((a, i) => {
      if (typeof a?.url !== "string" || a.url.trim() === "") {
        bao(`thiếu trường bắt buộc \`anh[${i}].url\``);
      }
      if (typeof a?.moTa !== "string" || a.moTa.trim() === "") {
        bao(`thiếu trường bắt buộc \`anh[${i}].moTa\``);
      }
    });
  }

  // ⑦ Kênh liên hệ — sàn 2 kênh, mỗi kênh phải có giá trị bấm được
  if (!Array.isArray(f?.lienHe) || f.lienHe.length < SAN_KENH_LIEN_HE) {
    bao(
      `\`lienHe\` chỉ có ${Array.isArray(f?.lienHe) ? f.lienHe.length : 0} kênh, dưới sàn ${SAN_KENH_LIEN_HE} kênh`
    );
  }
  if (Array.isArray(f?.lienHe)) {
    f.lienHe.forEach((k, i) => {
      if (typeof k?.giaTri !== "string" || k.giaTri.trim() === "") {
        bao(`thiếu trường bắt buộc \`lienHe[${i}].giaTri\``);
      }
    });
  }

  // ⑧ Cấp xác minh trong 1–4
  if (!CAP_XAC_MINH_HOP_LE.includes(f?.capXacMinh as number)) {
    bao(`\`capXacMinh\` ngoài thang 1–4 — ${f?.capXacMinh}`);
  }

  // ⑨ Ngày phải đọc được bằng máy
  (["ngayDo", "ngayRaSoat"] as const).forEach((truong) => {
    const gt = f?.[truong];
    if (typeof gt === "string" && gt.trim() !== "" && !DANG_NGAY.test(gt)) {
      bao(`\`${truong}\` sai dạng, phải là YYYY-MM-DD — "${gt}"`);
    }
  });

  // ⑩ TRƯỜNG LẠ — chiều ngược của ①, Điều VII đòi đủ cả hai chiều.
  //    Kiểm tra kiểu của TypeScript không thay được phép này: nó chỉ soi được chữ viết
  //    thẳng trong mã, còn hồ sơ về từ JSON, Sanity hay phép trải `...` thì lọt hết.
  if (f !== null && typeof f === "object") {
    for (const khoa of Object.keys(f)) {
      /* ⚠️ Soi trường kiểu sàn TRƯỚC, và cố ý KHÔNG cho `KHOA_HOP_LE` miễn trừ nó.
         Nếu xét danh sách hợp lệ trước thì cổng tự vô hiệu hoá được bằng một dòng sửa:
         ai bị chặn chỉ cần thêm "rating" vào `KHOA_HOP_LE` là xanh ngay — mà "sửa cho
         xanh" đúng là phản xạ tự nhiên nhất khi cổng báo đỏ. Cổng nào gỡ được bằng
         chính cái nó canh thì không phải cổng. */
      if (TRUONG_KIEU_SAN.has(khoa.toLowerCase())) {
        bao(
          `\`${khoa}\` là TRƯỜNG KIỂU SÀN ĐẶT PHÒNG mọc lại — trái Điều VII (hình dạng dữ liệu là danh tính) và Điều I (ta là hạ tầng, không phải sàn). Gỡ khỏi hồ sơ, đừng chỉ ẩn khỏi giao diện`
        );
      } else if (!KHOA_HOP_LE.has(khoa)) {
        bao(
          `\`${khoa}\` là trường lạ, không có trong hộ chiếu số. Điều VII: trường nào không trả lời được "phục vụ Điều nào trong hiến pháp?" thì là di sản của một web khác, phải gỡ`
        );
      }
    }
  }

  return loi;
}

/**
 * Kiểm CẢ KHO — thêm phép bắt trùng `slug` và trùng `id`.
 * Hai hồ sơ cùng slug thì một cái vĩnh viễn không ai mở được, mà build vẫn xanh.
 */
export function kiemKhoFarmstay(kho: Farmstay[]): string[] {
  const loi = kho.flatMap((f, i) => kiemHoSoFarmstay(f, f?.slug ?? `#${i}`));

  const demTrung = (lay: (f: Farmstay) => string, tenTruong: string) => {
    const dem = new Map<string, number>();
    kho.forEach((f) => {
      const k = lay(f);
      if (k) dem.set(k, (dem.get(k) ?? 0) + 1);
    });
    dem.forEach((n, k) => {
      if (n > 1)
        loi.push(`kho farmstay: ${n} hồ sơ trùng \`${tenTruong}\` — "${k}"`);
    });
  };
  demTrung((f) => f?.slug, "slug");
  demTrung((f) => f?.id, "id");

  return loi;
}
