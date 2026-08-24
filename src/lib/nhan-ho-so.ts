/**
 * CỬA DUY NHẤT nhận hồ sơ farmstay từ chủ farm — đẩy sang bảng tính + rung chuông.
 *
 * ⚠️ Vì sao mỗi việc gửi phải đi qua đúng một cửa: web nhahoachdinh từng có 5 chỗ tự
 * gọi Apps Script mỗi nơi một kiểu, một chỗ gửi sai tên khoá nên **suốt nhiều tháng
 * lời nhắn của khách bốc hơi mà biểu mẫu vẫn báo gửi thành công**.
 *
 * ⛔ LUẬT SỐNG CÒN CỦA TỆP NÀY: hàm chỉ trả `daLuu: true` khi bên nhận THẬT SỰ nhận.
 * Người gọi phải xem giá trị trả về rồi mới quyết định báo gì cho chủ farm. Biểu mẫu
 * cũ của chính web này bị Ông ra lệnh gỡ 08/08/2026 vì nó `setTimeout(1200)` rồi hiện
 * "Đăng ký thành công" — không gửi đi đâu cả.
 *
 * Chưa khai biến môi trường ⇒ trả `"chua-cau-hinh"`, KHÔNG phải lỗi và cũng KHÔNG
 * phải thành công. Trang đăng ký đọc trạng thái này để quyết định có hiện biểu mẫu
 * hay không — thà không có cửa còn hơn có cửa dẫn vào hư không.
 */

/** Địa chỉ Apps Script RIÊNG của vnfarmstay — CẤM dùng chung với web khác trong nhà */
const SHEET_URL = process.env.VNFARMSTAY_SHEET_URL ?? "";
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID ?? "";

export type KetQuaNhan =
  | { trangThai: "da-luu" }
  | { trangThai: "chua-cau-hinh" }
  | { trangThai: "loi"; chiTiet: string };

/** Kênh nhận đã sẵn sàng chưa — trang đăng ký hỏi hàm này trước khi hiện biểu mẫu */
export function daMoKenhNhan(): boolean {
  return SHEET_URL.trim() !== "";
}

/** Chuông đã đấu dây chưa. Thiếu chuông KHÔNG chặn nhận hồ sơ, chỉ ghi nhật ký cảnh báo. */
export function daCoChuong(): boolean {
  return TELEGRAM_TOKEN.trim() !== "" && TELEGRAM_CHAT_ID.trim() !== "";
}

/**
 * Chèn khoảng trắng vào số điện thoại TRƯỚC KHI gửi sang bảng tính.
 *
 * Vì sao: Google Sheet thấy chuỗi toàn chữ số thì hiểu là SỐ và **ăn mất số 0 đứng
 * đầu** — `0901234567` vào bảng thành `901234567`, gọi lại không được. Đây là lỗi
 * đã đo thật ở web khác trong nhà, không phải đề phòng suông.
 */
export function dinhDangSoDienThoai(so: string): string {
  const sach = so.trim();
  if (/\s/.test(sach)) return sach;
  const chiSo = sach.replace(/\D/g, "");
  if (chiSo.length < 9 || chiSo.length > 11) return sach;
  return chiSo.replace(/(\d{4})(\d{3})(\d+)/, "$1 $2 $3");
}

/** Một hồ sơ chủ farm gửi lên — CHƯA phải `Farmstay`, còn phải qua người duyệt */
export interface HoSoGuiLen {
  tenFarm: string;
  tinh: string;
  vungSlug: string;
  diaChi: string;
  cauChuyen: string;
  hoTenChuFarm: string;
  soDienThoai: string;
  zalo?: string;
  webRieng?: string;
  lichMuaVu?: string;
  duongDi?: string;
  ungXu?: string;
  traiNghiemSlugs?: string[];
  giaThamKhao?: string;
  /** Chủ farm cho phép theo dõi kênh nào để cập nhật hộ — bằng chứng pháp lý */
  dongYTheoDoi: boolean;
  /** Thời điểm bấm đồng ý, dạng ISO — Nghị định 13/2023 đòi ghi lại */
  thoiDiemDongY: string;
}

/** Gói hồ sơ thành một dòng chữ đọc được, để cả bảng tính lẫn chuông dùng chung */
function tomTatHoSo(h: HoSoGuiLen): string {
  const dong = [
    `Farm: ${h.tenFarm}`,
    `Tỉnh: ${h.tinh} · Vùng: ${h.vungSlug}`,
    `Địa chỉ: ${h.diaChi}`,
    `Chủ farm: ${h.hoTenChuFarm} — ${dinhDangSoDienThoai(h.soDienThoai)}`,
    h.zalo ? `Zalo: ${h.zalo}` : "",
    h.webRieng ? `Web riêng: ${h.webRieng}` : "",
    `Câu chuyện: ${h.cauChuyen}`,
    h.lichMuaVu ? `Lịch mùa vụ: ${h.lichMuaVu}` : "",
    h.duongDi ? `Đường đi: ${h.duongDi}` : "",
    h.ungXu ? `Ứng xử: ${h.ungXu}` : "",
    h.traiNghiemSlugs?.length
      ? `Trải nghiệm: ${h.traiNghiemSlugs.join(", ")}`
      : "",
    h.giaThamKhao ? `Giá tham khảo: ${h.giaThamKhao}` : "",
    `Đồng ý theo dõi kênh: ${h.dongYTheoDoi ? "CÓ" : "KHÔNG"} (${h.thoiDiemDongY})`,
  ];
  return dong.filter(Boolean).join("\n");
}

/** Đẩy hồ sơ sang bảng tính. Trả `true` CHỈ KHI bên kia thật sự nhận. */
async function guiVaoBangTinh(h: HoSoGuiLen): Promise<KetQuaNhan> {
  if (!daMoKenhNhan()) return { trangThai: "chua-cau-hinh" };

  try {
    /* ⚠️ `redirect: "manual"` và coi 302/303 LÀ THÀNH CÔNG — đo thật ở web khác
     * trong nhà 19/08/2026, ĐỪNG "sửa" lại. Apps Script ghi xong thì trả 302 trỏ
     * sang googleusercontent.com; để fetch tự đi theo thì nó POST tiếp và nhận 405,
     * khiến `res.ok` = false TRONG KHI dữ liệu đã vào bảng. Dùng `res.ok` ở đây sẽ
     * báo oan: chủ farm thấy lỗi rồi gửi lại → hồ sơ trùng. */
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ho-so-farmstay",
        tenFarm: h.tenFarm,
        tinh: h.tinh,
        vungSlug: h.vungSlug,
        hoTen: h.hoTenChuFarm,
        soDienThoai: dinhDangSoDienThoai(h.soDienThoai),
        zalo: h.zalo ?? "",
        webRieng: h.webRieng ?? "",
        dongYTheoDoi: h.dongYTheoDoi ? "CÓ" : "KHÔNG",
        thoiDiemDongY: h.thoiDiemDongY,
        chiTiet: tomTatHoSo(h),
      }),
      redirect: "manual",
    });

    const daNhan = res.status === 302 || res.status === 303 || res.ok;
    if (!daNhan) {
      console.error(
        `[hồ sơ] Bảng tính trả ${res.status} — hồ sơ KHÔNG được lưu: ${h.tenFarm}`
      );
      return { trangThai: "loi", chiTiet: `bảng tính trả ${res.status}` };
    }
    return { trangThai: "da-luu" };
  } catch (err) {
    console.error(
      "[hồ sơ] Không gọi được bảng tính — hồ sơ KHÔNG được lưu:",
      err
    );
    return { trangThai: "loi", chiTiet: String(err) };
  }
}

/**
 * Rung chuông báo có hồ sơ mới.
 * ⚠️ Chuông hỏng KHÔNG được làm hỏng việc nhận hồ sơ — hồ sơ đã vào bảng tính rồi
 * thì vẫn là thành công, chỉ ghi nhật ký để người trực biết mà đi xem tay.
 */
async function rungChuong(h: HoSoGuiLen): Promise<void> {
  if (!daCoChuong()) {
    console.warn(
      "[hồ sơ] Chưa đấu chuông Telegram — có hồ sơ mới mà không ai được báo"
    );
    return;
  }
  try {
    const res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `🌾 HỒ SƠ FARMSTAY MỚI\n\n${tomTatHoSo(h)}`,
          disable_web_page_preview: true,
        }),
      }
    );
    if (!res.ok) {
      console.error(
        `[hồ sơ] Chuông Telegram trả ${res.status} — không ai được báo`
      );
    }
  } catch (err) {
    console.error("[hồ sơ] Không rung được chuông:", err);
  }
}

/**
 * Nhận một hồ sơ: lưu vào bảng tính TRƯỚC, rung chuông SAU.
 * Thứ tự cố ý — chuông chỉ kêu cho thứ đã nằm an toàn trong bảng.
 */
export async function nhanHoSo(h: HoSoGuiLen): Promise<KetQuaNhan> {
  const ketQua = await guiVaoBangTinh(h);
  if (ketQua.trangThai === "da-luu") await rungChuong(h);
  return ketQua;
}

/** Một lời báo sai thông tin từ người đọc — cơ chế tự sửa của cả hệ thống */
export interface BaoSaiGuiLen {
  /** Hồ sơ farm nào đang sai */
  farmSlug: string;
  /** Sai chỗ nào — người báo tự mô tả */
  saiChoNao: string;
  /** Người báo để lại cách liên hệ nếu muốn; KHÔNG bắt buộc */
  lienHeNguoiBao?: string;
}

/**
 * Nhận một lời báo sai. Đi đúng đường ống của hồ sơ farmstay — cùng bảng tính,
 * cùng chuông — để người trực chỉ phải mở một chỗ.
 *
 * ⛔ Trả `da-luu` chỉ khi bảng tính xác nhận. Nút báo sai mà không ai nhận được
 * còn TỆ HƠN không có nút: nó tạo cảm giác an toàn giả, người đọc tưởng đã báo rồi
 * nên không tìm cách khác, còn thông tin sai thì cứ nằm nguyên trên web.
 */
export async function nhanBaoSai(b: BaoSaiGuiLen): Promise<KetQuaNhan> {
  if (!daMoKenhNhan()) return { trangThai: "chua-cau-hinh" };

  const chiTiet = [
    `BÁO SAI THÔNG TIN`,
    `Hồ sơ: /farmstay/${b.farmSlug}`,
    `Sai chỗ nào: ${b.saiChoNao}`,
    b.lienHeNguoiBao
      ? `Người báo: ${b.lienHeNguoiBao}`
      : "Người báo: không để lại liên hệ",
  ].join("\n");

  try {
    const res = await fetch(SHEET_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "bao-sai-thong-tin",
        tenFarm: b.farmSlug,
        soDienThoai: b.lienHeNguoiBao ?? "",
        chiTiet,
      }),
      redirect: "manual",
    });
    const daNhan = res.status === 302 || res.status === 303 || res.ok;
    if (!daNhan) {
      console.error(
        `[báo sai] Bảng tính trả ${res.status} — lời báo KHÔNG được lưu`
      );
      return { trangThai: "loi", chiTiet: `bảng tính trả ${res.status}` };
    }
  } catch (err) {
    console.error(
      "[báo sai] Không gọi được bảng tính — lời báo KHÔNG được lưu:",
      err
    );
    return { trangThai: "loi", chiTiet: String(err) };
  }

  if (daCoChuong()) {
    try {
      await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `⚠️ BÁO SAI THÔNG TIN\n\n${chiTiet}`,
          disable_web_page_preview: true,
        }),
      });
    } catch (err) {
      console.error("[báo sai] Không rung được chuông:", err);
    }
  } else {
    console.warn(
      "[báo sai] Chưa đấu chuông Telegram — có lời báo mà không ai được báo"
    );
  }

  return { trangThai: "da-luu" };
}
