/**
 * THỬ CỬA NHẬN HỒ SƠ — đối chứng hai chiều cho `/api/dang-farmstay` (Trụ B).
 *
 * Vì sao cần máy này: cả trụ B đứng trên MỘT lời hứa — "chỉ báo thành công khi
 * bảng tính đã xác nhận". Lời hứa đó không kiểm được bằng mắt đọc mã; biểu mẫu cũ
 * của chính web này trông cũng rất đúng mà vẫn đánh rơi dữ liệu suốt nhiều tháng.
 *
 * Máy dựng một BÊN NHẬN GIẢ ngay tại máy để đóng được vòng: gửi hồ sơ → bên nhận
 * ghi lại → máy đọc lại xem có đúng thứ đã gửi không. Bên nhận giả cũng đóng được
 * vai "bảng tính hỏng" (trả 500) để chứng minh cửa KHÔNG báo thành công khi hỏng —
 * đây mới là chiều quan trọng nhất.
 *
 * Chạy:  node scripts/thu-cua-nhan-ho-so.mjs
 * Máy tự bật web ở cổng trống, tự tắt khi xong. Không đụng tới bảng tính thật.
 */
import { createServer } from "node:http";
import { spawn } from "node:child_process";
import { setTimeout as doi } from "node:timers/promises";

const CONG_WEB = 3099;
const CONG_NHAN = 3098;

/** Bên nhận giả — đóng vai Apps Script. Đổi `che_do` để giả lập bảng tính hỏng. */
let cheDo = "nhan-duoc";
const daNhan = [];

const benNhan = createServer((req, res) => {
  let than = "";
  req.on("data", (c) => (than += c));
  req.on("end", () => {
    if (cheDo === "hong") {
      res.writeHead(500).end("loi bang tinh");
      return;
    }
    try {
      daNhan.push(JSON.parse(than));
    } catch {
      daNhan.push({ khongDocDuoc: than });
    }
    /* Apps Script thật trả 302 khi ghi xong — giả lập đúng thứ đó, vì chính
       chỗ này là nơi dễ hiểu nhầm nhất (302 LÀ thành công, không phải lỗi). */
    res.writeHead(302, { Location: "https://googleusercontent.com/xong" }).end();
  });
});

const loi = [];
const dat = [];
function chấm(ten, dung, chiTiet = "") {
  if (dung) dat.push(ten);
  else loi.push(`${ten}${chiTiet ? " — " + chiTiet : ""}`);
}

/** Hồ sơ ĐÚNG, đủ mọi trường bắt buộc + đủ 2 kênh liên hệ */
const HO_SO_DUNG = {
  tenFarm: "Farm thử cửa nhận",
  tinh: "Sơn La",
  vungSlug: "cao-nguyen-moc-chau",
  diaChi: "Xã thử, huyện thử",
  cauChuyen: "Tôi về đây năm 2015, dựng lại vườn từ mảnh đồi bỏ hoang.",
  hoTenChuFarm: "Người Thử",
  soDienThoai: "0901234567",
  zalo: "0901234567",
  traiNghiemSlugs: ["chan-nuoi-va-sua"],
  dongYTheoDoi: true,
};

async function gui(than) {
  const res = await fetch(`http://localhost:${CONG_WEB}/api/dang-farmstay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(than),
  });
  let ketQua = null;
  try {
    ketQua = await res.json();
  } catch {
    /* không phải JSON — để null, phép kiểm bên dưới tự bắt */
  }
  return { ma: res.status, ketQua };
}

let web;
try {
  await new Promise((ok) => benNhan.listen(CONG_NHAN, ok));

  web = spawn("npx", ["next", "dev", "-p", String(CONG_WEB)], {
    env: {
      ...process.env,
      VNFARMSTAY_SHEET_URL: `http://localhost:${CONG_NHAN}/nhan`,
      /* Cố ý KHÔNG khai chuông: chứng minh thiếu chuông vẫn nhận được hồ sơ */
      TELEGRAM_BOT_TOKEN: "",
      TELEGRAM_CHAT_ID: "",
    },
    stdio: "ignore",
  });

  // Chờ web sẵn sàng
  let songChua = false;
  for (let i = 0; i < 60; i++) {
    await doi(1000);
    try {
      await fetch(`http://localhost:${CONG_WEB}/`);
      songChua = true;
      break;
    } catch {
      /* chưa lên, chờ tiếp */
    }
  }
  if (!songChua) throw new Error(`web không lên ở cổng ${CONG_WEB}`);

  // ── CHIỀU XANH: hồ sơ đúng phải được nhận và ghi lại ĐÚNG thứ đã gửi ──
  {
    const { ma, ketQua } = await gui(HO_SO_DUNG);
    chấm("hồ sơ đủ trường được nhận", ma === 200 && ketQua?.ok === true, `mã ${ma}`);
    const banGhi = daNhan.at(-1);
    chấm(
      "bên nhận ghi đúng tên farm đã gửi",
      banGhi?.tenFarm === HO_SO_DUNG.tenFarm,
      `nhận được "${banGhi?.tenFarm}"`
    );
    chấm(
      "số điện thoại được chèn khoảng trắng (Sheet không ăn mất số 0)",
      typeof banGhi?.soDienThoai === "string" && /\s/.test(banGhi.soDienThoai),
      `nhận được "${banGhi?.soDienThoai}"`
    );
    chấm(
      "thời điểm đồng ý do MÁY CHỦ đóng dấu, đọc được bằng máy",
      typeof banGhi?.thoiDiemDongY === "string" &&
        !Number.isNaN(Date.parse(banGhi.thoiDiemDongY)),
      `nhận được "${banGhi?.thoiDiemDongY}"`
    );
  }

  // ── CHIỀU ĐỎ 1: thiếu trường bắt buộc phải bị chặn, nêu rõ thiếu gì ──
  {
    const soTruoc = daNhan.length;
    const { ma, ketQua } = await gui({ ...HO_SO_DUNG, cauChuyen: "" });
    chấm("thiếu câu chuyện bị chặn", ma === 400, `mã ${ma}`);
    chấm(
      "báo lỗi nêu rõ thiếu câu chuyện",
      (ketQua?.loi ?? []).some((l) => l.includes("câu chuyện")),
      JSON.stringify(ketQua?.loi)
    );
    chấm("hồ sơ hỏng KHÔNG lọt sang bên nhận", daNhan.length === soTruoc);
  }

  // ── CHIỀU ĐỎ 2: chỉ 1 kênh liên hệ phải bị chặn (sàn của Master Prompt là 2) ──
  {
    const { ma, ketQua } = await gui({
      ...HO_SO_DUNG,
      zalo: "",
      webRieng: "",
    });
    chấm("chỉ 1 kênh liên hệ bị chặn", ma === 400, `mã ${ma}`);
    chấm(
      "báo lỗi nêu rõ cần 2 kênh",
      (ketQua?.loi ?? []).some((l) => l.includes("2 kênh")),
      JSON.stringify(ketQua?.loi)
    );
  }

  // ── CHIỀU ĐỎ 3: vùng bịa phải bị chặn ──
  {
    const { ma } = await gui({ ...HO_SO_DUNG, vungSlug: "vung-khong-co-that" });
    chấm("vùng bịa bị chặn", ma === 400, `mã ${ma}`);
  }

  // ── CHIỀU ĐỎ 4 (QUAN TRỌNG NHẤT): bảng tính hỏng ⇒ TUYỆT ĐỐI không báo thành công ──
  {
    cheDo = "hong";
    const { ma, ketQua } = await gui({ ...HO_SO_DUNG, tenFarm: "Farm lúc bảng hỏng" });
    cheDo = "nhan-duoc";
    chấm(
      "bảng tính hỏng ⇒ KHÔNG báo thành công",
      ketQua?.ok !== true,
      `nhận ok=${ketQua?.ok}`
    );
    chấm("bảng tính hỏng ⇒ trả mã lỗi 502", ma === 502, `mã ${ma}`);
  }

  // ── CHIỀU ĐỎ 5: trần gửi phải chặn khi vượt ──
  {
    /* Đã gửi 1 lượt thành công + 1 lượt lúc bảng hỏng = 2 lượt tính vào trần.
       Ba lượt nữa là chạm trần 5, lượt thứ sáu phải bị chặn. */
    for (let i = 0; i < 3; i++) await gui(HO_SO_DUNG);
    const { ma, ketQua } = await gui(HO_SO_DUNG);
    chấm("vượt trần gửi bị chặn", ma === 429, `mã ${ma}`);
    chấm(
      "thông báo chặn nói rõ con số và thời gian chờ",
      (ketQua?.loi ?? []).some((l) => l.includes("5") && l.includes("24 giờ")),
      JSON.stringify(ketQua?.loi)
    );
  }
} catch (err) {
  loi.push(`không chạy được phép thử: ${err}`);
} finally {
  if (web) web.kill("SIGTERM");
  benNhan.close();
}

if (loi.length > 0) {
  console.error(`\n✗ CỬA NHẬN HỒ SƠ — ${loi.length} phép RỚT:`);
  loi.forEach((l) => console.error("  · " + l));
  console.error(`  (${dat.length} phép đạt)`);
  process.exit(1);
}
console.log(
  `✓ Cửa nhận hồ sơ: ${dat.length}/${dat.length} phép qua đối chứng hai chiều — nhận được thật, và KHÔNG báo thành công khi bên nhận hỏng.`
);
