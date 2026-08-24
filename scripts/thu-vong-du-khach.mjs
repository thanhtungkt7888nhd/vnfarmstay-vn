/**
 * THỬ VÒNG DU KHÁCH — nghiệm thu Trụ C bằng TRÌNH DUYỆT THẬT.
 *
 * Vấn đề phải giải: Trụ C đòi "phải NHÌN, không đọc mã rồi suy" và "phải thấy tận
 * mắt sự kiện bắn ra" — nhưng kho `FARMSTAYS` cố ý RỖNG, và đổ dữ liệu mẫu vào đó
 * là điều cấm (dự án đã trả giá: dữ liệu mẫu ghi rõ chữ "mẫu" vẫn lọt lên web thật).
 *
 * Cách giải: MƯỢN TẠM một hồ sơ đối chứng, dựng web, đo, rồi HOÀN NGUYÊN — mọi
 * đường đi ra khỏi máy này đều đi qua `finally`, kể cả khi phép đo nổ giữa chừng.
 * Hồ sơ mượn nằm ngoài `src/`, không lần nào chạm vào tệp dữ liệu thật quá vài giây.
 *
 * Chạy:  node scripts/thu-vong-du-khach.mjs
 */
import { chromium } from "playwright";
import { execFileSync, spawn } from "node:child_process";
import { copyFileSync, rmSync, writeFileSync } from "node:fs";
import { setTimeout as doi } from "node:timers/promises";

const TEP_DU_LIEU = "src/features/listing/data.ts";
const BAN_LUU = "src/features/listing/.data.ts.dang-thu";
const CONG = 3097;
const SLUG = "doi-chung-vong-du-khach";
const VUNG_SLUG = "cao-nguyen-moc-chau";

const loi = [];
const dat = [];
const cham = (ten, dung, chiTiet = "") =>
  dung ? dat.push(ten) : loi.push(`${ten}${chiTiet ? " — " + chiTiet : ""}`);

let web;
let daThayDuLieu = false;

try {
  // ── Mượn tạm hồ sơ đối chứng ──
  copyFileSync(TEP_DU_LIEU, BAN_LUU);
  daThayDuLieu = true;
  writeFileSync(
    TEP_DU_LIEU,
    `import type { Farmstay } from "@/shared/types/farmstay";
import { HO_SO_DAY_DU } from "../../../scripts/doi-chung-ho-so";
/** ⚠️ TỆP TẠM do scripts/thu-vong-du-khach.mjs sinh ra. Máy tự hoàn nguyên khi xong. */
export const FARMSTAYS: Farmstay[] = [HO_SO_DAY_DU];
`
  );

  execFileSync("npm", ["run", "build"], { stdio: "pipe" });

  web = spawn("npx", ["next", "start", "-p", String(CONG)], { stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    await doi(500);
    try {
      await fetch(`http://localhost:${CONG}/`);
      break;
    } catch {
      /* chưa lên */
    }
  }

  const tr = await chromium.launch();

  // ══ VÒNG 1 — TRANG HỒ SƠ ══
  {
    const p = await tr.newPage({ viewport: { width: 1440, height: 1000 } });
    /* Cắm gtag giả TRƯỚC khi trang chạy, để bắt được sự kiện đúng lúc nó bắn.
       Không cần GA thật — chỗ cần chứng minh là "có bắn hay không", không phải
       "Google có nhận hay không". */
    await p.addInitScript(() => {
      window.__suKien = [];
      window.gtag = (lenh, ten, thamSo) => {
        window.__suKien.push({ lenh, ten, thamSo });
      };
    });
    const res = await p.goto(`http://localhost:${CONG}/farmstay/${SLUG}`, {
      waitUntil: "load",
    });
    cham("trang hồ sơ mở được", res?.status() === 200, `mã ${res?.status()}`);

    /* ⚠️ PHẢI chờ nội dung thật hiện rồi mới đọc chữ. `innerText` KHÔNG tự chờ
       như `locator`, nên đọc ngay sau `load` là đọc trúng lúc khung xương
       (`loading.tsx`) còn đang hiện ⇒ báo oan "trang thiếu chữ". Đã dính đúng lỗi
       này 24/08/2026: 4 phép chữ rớt trong khi mở trang ra nhìn thì chữ có đủ. */
    await p.locator('a[data-su-kien="direct_contact_click"]').first().waitFor();
    const chu = await p.locator("body").innerText();
    cham(
      'KHÔNG còn chữ "Đặt phòng ngay"',
      !chu.includes("Đặt phòng ngay"),
      "vẫn còn trên trang"
    );
    cham(
      'KHÔNG còn "Phí dịch vụ" (web không thu hoa hồng)',
      !chu.includes("Phí dịch vụ"),
      "vẫn còn trên trang"
    );
    cham(
      "có nói rõ ranh giới: không nhận đặt phòng",
      chu.includes("không nhận đặt phòng")
    );
    cham("hiện câu chuyện chủ farm", chu.includes("Tôi về đây năm 2015"));
    cham("hiện nhãn cấp xác minh", chu.includes("rà soát hồ sơ từ xa"));
    cham(
      "nói cả điều cấp này KHÔNG bảo đảm",
      chu.includes("không") && chu.includes("bảo đảm")
    );

    // Nút liên hệ — có đích thật, đúng loại
    const goi = p.locator('a[data-su-kien="direct_contact_click"][data-sk-kenh="dien-thoai"]');
    cham("nút gọi tồn tại", (await goi.count()) === 1);
    cham(
      "nút gọi trỏ tới đường dẫn gọi máy",
      (await goi.first().getAttribute("href")) === "tel:0901234567",
      await goi.first().getAttribute("href")
    );

    const zalo = p.locator('a[data-sk-kenh="zalo"]');
    cham(
      "nút Zalo trỏ tới trang Zalo của farm",
      (await zalo.first().getAttribute("href"))?.startsWith("https://zalo.me/"),
      await zalo.first().getAttribute("href")
    );

    const ngoai = p.locator('a[data-su-kien="external_booking_click"]');
    cham("nút web riêng gắn đúng tên sự kiện ra ngoài", (await ngoai.count()) === 1);
    cham(
      "nút ra ngoài mở tab mới",
      (await ngoai.first().getAttribute("target")) === "_blank"
    );
    cham(
      "nút ra ngoài có thuộc tính an toàn",
      (await ngoai.first().getAttribute("rel"))?.includes("noopener")
    );

    // ⭐ SỰ KIỆN PHẢI BẮN THẬT — bằng chứng quan trọng nhất của trụ này
    await goi.first().evaluate((el) => {
      el.removeAttribute("href"); // chặn trình duyệt đi mở app gọi điện
      el.click();
    });
    const suKien = await p.evaluate(() => window.__suKien ?? []);
    cham(
      "bấm nút gọi ⇒ direct_contact_click BẮN THẬT",
      suKien.some((s) => s.ten === "direct_contact_click"),
      JSON.stringify(suKien.map((s) => s.ten))
    );
    cham(
      "sự kiện chở đúng kênh và farm nào",
      suKien.some(
        (s) =>
          s.ten === "direct_contact_click" &&
          s.thamSo?.kenh === "dien-thoai" &&
          s.thamSo?.farm === SLUG
      ),
      JSON.stringify(suKien.find((s) => s.ten === "direct_contact_click")?.thamSo)
    );
    cham(
      "mở trang hồ sơ ⇒ farmstay_profile_view bắn",
      suKien.some((s) => s.ten === "farmstay_profile_view")
    );

    await p.close();
  }

  // ══ VÒNG 2 — BẢN ĐỒ: không tự tải trước khi cuộn tới ══
  {
    const p = await tr.newPage({ viewport: { width: 1440, height: 900 } });
    const oBanDo = [];
    p.on("request", (r) => {
      const u = r.url();
      if (u.includes("tile.openstreetmap.org")) oBanDo.push(u);
    });
    await p.goto(`http://localhost:${CONG}/farmstay/${SLUG}`, {
      waitUntil: "load",
    });
    cham(
      "bản đồ KHÔNG tự tải khi chưa cuộn tới",
      oBanDo.length === 0,
      `đã tải ${oBanDo.length} ô bản đồ`
    );

    await p.getByRole("heading", { name: /Vị trí .* trên bản đồ/ }).scrollIntoViewIfNeeded();
    await p.waitForTimeout(4000);
    cham(
      "cuộn tới ⇒ bản đồ tải thật (ô bản đồ OpenStreetMap về)",
      oBanDo.length > 0,
      `${oBanDo.length} ô`
    );

    const soLienKet = await p
      .locator('section[aria-label*="trên bản đồ"] a[href^="/farmstay/"]')
      .count();
    cham(
      "có đường đi song song bằng liên kết cho bàn phím / trình đọc màn hình",
      soLienKet >= 1,
      `${soLienKet} liên kết`
    );
    await p.close();
  }

  // ══ VÒNG 3 — TRANG VÙNG: có farm ⇒ bản đồ hiện ══
  {
    const p = await tr.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`http://localhost:${CONG}/vung/${VUNG_SLUG}`, {
      waitUntil: "load",
    });
    cham(
      "trang vùng CÓ farm ⇒ khối bản đồ hiện",
      (await p.locator('section[aria-label*="trên bản đồ"]').count()) === 1
    );
    cham(
      "bản đồ vùng dẫn tới đúng hồ sơ farm",
      (await p.locator(`a[href="/farmstay/${SLUG}"]`).count()) >= 1
    );
    await p.close();
  }

  // ══ VÒNG 4 — TRANG VÙNG KHÁC: chưa có farm ⇒ khối bản đồ TỰ ẨN ══
  {
    const p = await tr.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`http://localhost:${CONG}/vung/miet-vuon-song-nuoc`, {
      waitUntil: "load",
    });
    cham(
      "vùng CHƯA có farm ⇒ khối bản đồ tự ẩn, không hiện bản đồ trống",
      (await p.locator('section[aria-label*="trên bản đồ"]').count()) === 0
    );
    await p.close();
  }

  // ══ VÒNG 4b — KHUNG XƯƠNG LÚC CHỜ cũng không được tràn ngang ══
  {
    /* Vì sao có phép này: lỗi thật bắt được 24/08/2026 — `farmstay/[slug]/loading.tsx`
       khai `1fr 340px` mà thiếu ngắt khổ, nên trên máy 375px trang TRƯỢT NGANG trong
       lúc chờ. Lỗi sống trong khoảnh khắc nên mọi phép đo trang-đã-xong đều mù.
       Bắt khung xương đứng yên bằng cách giữ chậm câu trả lời của máy chủ. */
    const p = await tr.newPage({ viewport: { width: 375, height: 900 } });
    /* Bóp băng thông xuống mức mạng chậm để KÉO DÀI khoảnh khắc khung xương hiện.
       Bấm chuyển trang không ăn thua: `/farmstay/[slug]` là trang dựng sẵn nên Next
       nạp trước và đi thẳng vào bộ nhớ đệm ⇒ khung xương không kịp hiện, phép đo
       hoá vô nghĩa mà vẫn xanh. Khung xương chỉ thật sự lộ ra trong lúc trang được
       rót về từ máy chủ — đúng cảnh người dùng mạng yếu gặp phải. */
    const cdp = await p.context().newCDPSession(p);
    await cdp.send("Network.enable");
    await cdp.send("Network.emulateNetworkConditions", {
      offline: false,
      latency: 300,
      downloadThroughput: (200 * 1024) / 8,
      uploadThroughput: (100 * 1024) / 8,
    });
    p.goto(`http://localhost:${CONG}/farmstay/${SLUG}`).catch(() => {});
    /* Dò liên tục thay vì chờ một mốc cố định — khung xương sống rất ngắn */
    let do_ = { dangCho: false, tran: false, rong: 0, man: 0 };
    for (let i = 0; i < 60; i++) {
      await doi(120);
      try {
        const nay = await p.evaluate(() => ({
          dangCho: !!document.querySelector('[aria-busy="true"]'),
          tran:
            document.documentElement.scrollWidth >
            document.documentElement.clientWidth,
          rong: document.documentElement.scrollWidth,
          man: document.documentElement.clientWidth,
        }));
        if (nay.dangCho) {
          do_ = nay;
          break;
        }
      } catch {
        /* trang đang thay, đo lại vòng sau */
      }
    }
    cham(
      "bắt được đúng lúc khung xương đang hiện",
      do_.dangCho,
      "không bắt được — phép dưới mất ý nghĩa"
    );
    cham(
      "khung xương lúc chờ KHÔNG tràn ngang ở khổ 375",
      !do_.tran,
      `${do_.rong} > ${do_.man}`
    );
    await p.close();
  }

  // ══ VÒNG 5 — BỐ CỤC 3 KHỔ MÀN ══
  for (const [ten, w] of [
    ["375", 375],
    ["414", 414],
    ["768", 768],
  ]) {
    const p = await tr.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(`http://localhost:${CONG}/farmstay/${SLUG}`, {
      waitUntil: "load",
    });
    const do_ = await p.evaluate(() => ({
      tran: document.documentElement.scrollWidth > window.innerWidth,
      rong: document.documentElement.scrollWidth,
      man: window.innerWidth,
      chamNho: [...document.querySelectorAll("a[data-su-kien], button")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.height > 0 && r.height < 44;
        })
        .map((e) => `${(e.textContent || "").trim().slice(0, 24)}:${Math.round(e.getBoundingClientRect().height)}px`),
      anhThieuMoTa: [...document.querySelectorAll("img")].filter(
        (i) => !i.getAttribute("alt")
      ).length,
    }));
    cham(`khổ ${ten}: không tràn ngang`, !do_.tran, `${do_.rong} > ${do_.man}`);
    cham(
      `khổ ${ten}: mọi nút liên hệ ≥44px`,
      do_.chamNho.length === 0,
      do_.chamNho.join(", ")
    );
    cham(`khổ ${ten}: mọi ảnh có mô tả thay thế`, do_.anhThieuMoTa === 0);
    await p.close();
  }

  await tr.close();
} catch (err) {
  loi.push(`không chạy được phép thử: ${err}`);
} finally {
  if (web) web.kill("SIGTERM");
  /* ⛔ HOÀN NGUYÊN LUÔN LUÔN — kể cả khi phép đo nổ giữa chừng.
     Dữ liệu mượn không bao giờ được ở lại trong tệp thật. */
  if (daThayDuLieu) {
    copyFileSync(BAN_LUU, TEP_DU_LIEU);
    rmSync(BAN_LUU, { force: true });
  }
}

if (loi.length > 0) {
  console.error(`\n✗ VÒNG DU KHÁCH — ${loi.length} phép RỚT:`);
  loi.forEach((l) => console.error("  · " + l));
  console.error(`  (${dat.length} phép đạt)`);
  process.exit(1);
}
console.log(
  `✓ Vòng du khách: ${dat.length}/${dat.length} phép đạt trên TRÌNH DUYỆT THẬT — hồ sơ mở được, nút liên hệ có đích, sự kiện đo bắn thật, bản đồ lười tải và tự ẩn khi vùng trống. Dữ liệu mượn đã hoàn nguyên.`
);
