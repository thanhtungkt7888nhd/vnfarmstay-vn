/**
 * Đường vào nhận hồ sơ farmstay do chủ farm gửi lên.
 *
 * Ba việc, đúng thứ tự: ① kiểm trần gửi · ② kiểm nội dung PHÍA MÁY CHỦ · ③ đẩy đi
 * và trả về đúng thứ thật sự xảy ra.
 *
 * ⛔ Kiểm ở trình duyệt KHÔNG tính là kiểm — ai cũng gọi thẳng đường dẫn này được.
 * Bộ luật kiểm ở đây cố ý ngang bằng van dựng `van-kiem-ho-so.ts`, không dễ hơn:
 * cổng vào dễ hơn engine thì dữ liệu lọt vào rồi mới làm đứt build (bài học
 * `lesson_cong_vao_khong_khat_khe_hon_engine`).
 */
import { NextResponse } from "next/server";
import { VUNG } from "@/features/vung/data";
import { TRAI_NGHIEM } from "@/features/kham-pha/data";
import { daMoKenhNhan, nhanHoSo, type HoSoGuiLen } from "@/lib/nhan-ho-so";

/**
 * TRẦN GỬI — ghi rõ ra đây để không ai phải mò.
 * 5 hồ sơ / 1 địa chỉ máy / 24 giờ.
 *
 * ⚠️ Dự án có tiền lệ: một web đặt trần rồi người thử biểu mẫu bị chặn mà không
 * hiểu vì sao. Nên thông báo chặn ở dưới phải nói THẲNG con số và thời gian chờ.
 *
 * ⚠️ Trần này đếm trong bộ nhớ tiến trình. Trên Vercel mỗi tiến trình lạnh là bộ
 * đếm về 0 — nên nó là GỜ GIẢM TỐC chống bấm nhầm và gửi trùng, KHÔNG phải tường
 * chống tấn công. Ghi thẳng ra để không ai tưởng nhầm là đã có tường.
 */
const TRAN_MOI_NGAY = 5;
const CUA_SO_MS = 24 * 60 * 60 * 1000;

const soLanGui = new Map<string, number[]>();

function quaTran(ip: string): boolean {
  const gio = Date.now();
  const cu = soLanGui.get(ip) ?? [];
  const conHan = cu.filter((t) => gio - t < CUA_SO_MS);
  if (conHan.length >= TRAN_MOI_NGAY) {
    soLanGui.set(ip, conHan);
    return true;
  }
  conHan.push(gio);
  soLanGui.set(ip, conHan);
  return false;
}

/** Trần độ dài từng trường — chặn gửi cả quyển sách làm nghẽn bảng tính */
const TRAN_CHU: Record<string, number> = {
  tenFarm: 120,
  tinh: 60,
  diaChi: 200,
  cauChuyen: 3000,
  hoTenChuFarm: 120,
  soDienThoai: 20,
  zalo: 200,
  webRieng: 200,
  lichMuaVu: 2000,
  duongDi: 1000,
  ungXu: 1000,
  giaThamKhao: 100,
};

function chu(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

/** Kiểm nội dung. Trả danh sách lỗi — rỗng nghĩa là qua. */
function kiem(than: Record<string, unknown>): string[] {
  const loi: string[] = [];

  // Bắt buộc — đúng bộ Master Prompt đòi ở cửa vào
  const batBuoc: Array<[string, string]> = [
    ["tenFarm", "tên farm"],
    ["tinh", "tỉnh / thành phố"],
    ["vungSlug", "vùng trải nghiệm"],
    ["diaChi", "địa chỉ"],
    ["cauChuyen", "câu chuyện của chủ farm"],
    ["hoTenChuFarm", "họ tên chủ farm"],
    ["soDienThoai", "số điện thoại"],
  ];
  for (const [khoa, ten] of batBuoc) {
    if (chu(than[khoa]) === "") loi.push(`Chưa điền ${ten}.`);
  }

  // Vùng phải có thật
  const vung = chu(than.vungSlug);
  if (vung !== "" && !VUNG.some((v) => v.slug === vung)) {
    loi.push("Vùng đã chọn không nằm trong 9 vùng của hệ thống.");
  }

  // Trải nghiệm phải có thật
  const tn = Array.isArray(than.traiNghiemSlugs) ? than.traiNghiemSlugs : [];
  const tnBia = tn.filter((s) => !TRAI_NGHIEM.some((t) => t.slug === s));
  if (tnBia.length > 0) {
    loi.push("Có trải nghiệm không nằm trong danh sách của hệ thống.");
  }

  // Số điện thoại phải là số gọi được
  const sdt = chu(than.soDienThoai).replace(/\D/g, "");
  if (chu(than.soDienThoai) !== "" && (sdt.length < 9 || sdt.length > 11)) {
    loi.push("Số điện thoại chưa đúng — cần 9 đến 11 chữ số.");
  }

  // ≥2 kênh liên hệ: điện thoại là 1, phải có thêm Zalo hoặc web riêng
  const zalo = chu(than.zalo);
  const web = chu(than.webRieng);
  if (zalo === "" && web === "") {
    loi.push(
      "Cần ít nhất 2 kênh liên hệ — ngoài điện thoại, xin thêm Zalo hoặc web riêng của farm."
    );
  }
  for (const [khoa, giaTri] of [
    ["webRieng", web],
    ["zalo", zalo],
  ] as const) {
    if (
      giaTri !== "" &&
      /^https?:\/\//.test(giaTri) === false &&
      khoa === "webRieng"
    ) {
      loi.push("Địa chỉ web riêng cần bắt đầu bằng http:// hoặc https://");
    }
  }

  // Trần độ dài
  for (const [khoa, tran] of Object.entries(TRAN_CHU)) {
    if (chu(than[khoa]).length > tran) {
      loi.push(`Mục "${khoa}" dài quá ${tran} ký tự.`);
    }
  }

  // Đồng ý theo dõi kênh — không bắt buộc phải đồng ý, nhưng phải là câu trả lời rõ ràng
  if (typeof than.dongYTheoDoi !== "boolean") {
    loi.push("Chưa trả lời mục cho phép theo dõi kênh.");
  }

  return loi;
}

export async function POST(req: Request) {
  // ① Kênh nhận chưa mở thì nói thẳng, KHÔNG nhận rồi đánh rơi
  if (!daMoKenhNhan()) {
    return NextResponse.json(
      {
        ok: false,
        loi: [
          "Kênh nhận hồ sơ chưa được mở. Xin liên hệ trực tiếp — chúng tôi không muốn nhận rồi làm mất hồ sơ của bạn.",
        ],
      },
      { status: 503 }
    );
  }

  // ② Trần gửi
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "khong-ro";
  if (quaTran(ip)) {
    return NextResponse.json(
      {
        ok: false,
        loi: [
          `Bạn đã gửi ${TRAN_MOI_NGAY} hồ sơ trong 24 giờ qua — đây là trần chống gửi trùng. Xin thử lại sau 24 giờ, hoặc liên hệ trực tiếp nếu cần gửi thêm.`,
        ],
      },
      { status: 429 }
    );
  }

  // ③ Kiểm rồi đẩy đi
  let than: Record<string, unknown>;
  try {
    than = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, loi: ["Không đọc được dữ liệu gửi lên."] },
      { status: 400 }
    );
  }

  const loi = kiem(than);
  if (loi.length > 0) {
    return NextResponse.json({ ok: false, loi }, { status: 400 });
  }

  const hoSo: HoSoGuiLen = {
    tenFarm: chu(than.tenFarm),
    tinh: chu(than.tinh),
    vungSlug: chu(than.vungSlug),
    diaChi: chu(than.diaChi),
    cauChuyen: chu(than.cauChuyen),
    hoTenChuFarm: chu(than.hoTenChuFarm),
    soDienThoai: chu(than.soDienThoai),
    zalo: chu(than.zalo) || undefined,
    webRieng: chu(than.webRieng) || undefined,
    lichMuaVu: chu(than.lichMuaVu) || undefined,
    duongDi: chu(than.duongDi) || undefined,
    ungXu: chu(than.ungXu) || undefined,
    traiNghiemSlugs: Array.isArray(than.traiNghiemSlugs)
      ? (than.traiNghiemSlugs as string[])
      : [],
    giaThamKhao: chu(than.giaThamKhao) || undefined,
    dongYTheoDoi: than.dongYTheoDoi === true,
    /* Thời điểm đồng ý lấy ở MÁY CHỦ, không tin giờ trình duyệt gửi lên —
       đây là bằng chứng pháp lý theo Nghị định 13/2023. */
    thoiDiemDongY: new Date().toISOString(),
  };

  const ketQua = await nhanHoSo(hoSo);

  /* ⛔ Chỉ báo thành công khi bên nhận ĐÃ XÁC NHẬN. Biểu mẫu cũ của chính web này
     bị gỡ vì báo thành công mà không lưu đi đâu — không lặp lại. */
  if (ketQua.trangThai !== "da-luu") {
    console.error("[dang-farmstay] hồ sơ KHÔNG lưu được:", ketQua);
    return NextResponse.json(
      {
        ok: false,
        loi: [
          "Chúng tôi chưa lưu được hồ sơ của bạn. Xin thử lại, hoặc gọi thẳng cho chúng tôi — đừng để công bạn điền bị mất.",
        ],
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
