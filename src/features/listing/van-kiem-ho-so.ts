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
