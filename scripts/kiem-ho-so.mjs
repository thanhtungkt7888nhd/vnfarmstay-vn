/**
 * CỔNG KIỂM HỒ SƠ — chạy LÚC DỰNG (prebuild). Hồ sơ hỏng thì ĐỨT BUILD, không lên web.
 *
 * ⚠️ Vì sao có tệp này: van `kiemTraDuDay()` viết từ trước được BA nơi ghi chú là
 * "canh" nhưng KHÔNG NƠI NÀO GỌI — van mồ côi, tức là suốt thời gian qua không có
 * cổng nào chạy thật (bài học `lesson_luat_tu_khai_AUTO_khong_co_may`). Cổng này
 * nối cả van cũ lẫn van hồ sơ farmstay mới vào đường build.
 *
 * Cổng TỰ KIỂM trước khi kiểm dữ liệu thật: chạy bộ mẫu đối chứng hai chiều
 * (`scripts/doi-chung-ho-so.ts`) — mẫu ĐÚNG phải qua, mẫu SAI phải bị chặn và phải
 * báo ĐÚNG TÊN TRƯỜNG. Tự kiểm rớt thì dừng ngay, vì lúc đó kết quả đo dữ liệu thật
 * không còn đáng tin (luật "công cụ đo mới phải qua đối chứng 2 chiều").
 */
import { execFileSync } from "node:child_process";

const KICH_BAN = `
import { CAC_CA_DOI_CHUNG, KHO_TRUNG_SLUG } from "./scripts/doi-chung-ho-so";
import { kiemHoSoFarmstay, kiemKhoFarmstay } from "./src/features/listing/van-kiem-ho-so";
import { FARMSTAYS } from "./src/features/listing/data";
import { kiemTraDuDay } from "./src/features/kham-pha/data";
import { kiemNguoiKienTao } from "./src/features/nguoi-kien-tao/data";
import { kiemHeSinhThai } from "./src/features/he-sinh-thai/data";

const loiTuKiem = [];

// ── Chiều 1 + 2: mẫu đúng phải qua, mẫu sai phải bị chặn ĐÚNG CHỖ ──
for (const ca of CAC_CA_DOI_CHUNG) {
  const loi = kiemHoSoFarmstay(ca.hoSo, "doi-chung");
  const daBat = loi.length > 0;
  if (ca.phaiDat && daBat) {
    loiTuKiem.push("ca \\"" + ca.ten + "\\": mẫu ĐÚNG mà van chặn — " + loi.join(" | "));
  }
  if (!ca.phaiDat && !daBat) {
    loiTuKiem.push("ca \\"" + ca.ten + "\\": mẫu SAI mà van cho qua");
  }
  if (!ca.phaiDat && daBat && ca.chuoiPhaiCo) {
    const trungKhop = loi.some((l) => l.includes(ca.chuoiPhaiCo));
    if (!trungKhop) {
      loiTuKiem.push(
        "ca \\"" + ca.ten + "\\": van chặn nhưng báo SAI CHỖ — cần nhắc \\"" +
        ca.chuoiPhaiCo + "\\", thực nhận: " + loi.join(" | ")
      );
    }
  }
}

// ── Ca riêng của van cả kho: trùng slug ──
const loiTrung = kiemKhoFarmstay(KHO_TRUNG_SLUG);
if (!loiTrung.some((l) => l.includes("trùng \`slug\`"))) {
  loiTuKiem.push("ca \\"kho trùng slug\\": van cả kho KHÔNG bắt được trùng slug");
}

if (loiTuKiem.length > 0) {
  console.error("TU_KIEM_ROT");
  loiTuKiem.forEach((l) => console.error("  · " + l));
  process.exitCode = 1;
} else {
  console.log("TU_KIEM_DAT " + (CAC_CA_DOI_CHUNG.length + 1));

  // ── Kiểm DỮ LIỆU THẬT, chỉ khi công cụ đã đáng tin ──
  const loiThat = [...kiemKhoFarmstay(FARMSTAYS), ...kiemTraDuDay(), ...kiemNguoiKienTao(), ...kiemHeSinhThai()];
  if (loiThat.length > 0) {
    console.error("DU_LIEU_HONG");
    loiThat.forEach((l) => console.error("  · " + l));
    process.exitCode = 1;
  } else {
    console.log("DU_LIEU_SACH " + FARMSTAYS.length);
  }
}
`;

let ketQua;
try {
  ketQua = execFileSync("npx", ["tsx", "-e", KICH_BAN], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
} catch (err) {
  const ra = `${err.stdout ?? ""}${err.stderr ?? ""}`.trim();
  if (ra.includes("TU_KIEM_ROT")) {
    console.error("\n✗ CỔNG HỒ SƠ — TỰ KIỂM RỚT: van không đáng tin, chưa đo dữ liệu thật.");
  } else if (ra.includes("DU_LIEU_HONG")) {
    console.error("\n✗ CỔNG HỒ SƠ — hồ sơ farmstay hỏng, không cho lên web:");
  } else {
    console.error("\n✗ CỔNG HỒ SƠ — không chạy được van:");
  }
  console.error(ra);
  process.exit(1);
}

const soCa = ketQua.match(/TU_KIEM_DAT (\d+)/)?.[1] ?? "?";
const soHoSo = ketQua.match(/DU_LIEU_SACH (\d+)/)?.[1] ?? "?";
console.log(
  `✓ Cổng hồ sơ: tự kiểm ${soCa}/${soCa} ca đối chứng hai chiều · ${soHoSo} hồ sơ farmstay sạch · van vùng/mùa/tuyến sạch`
);
