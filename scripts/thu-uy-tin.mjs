/**
 * THỬ UY TÍN — nghiệm thu Trụ D bằng TRÌNH DUYỆT THẬT + gọi thẳng đường dẫn.
 *
 * Phép quan trọng nhất ở đây là **HUY HIỆU CÓ THU HỒI ĐƯỢC KHÔNG**. Trụ D nói rõ
 * đó là điều dễ bỏ sót nhất: huy hiệu không thu hồi được thì một farm bị hạ cấp
 * hoặc bị gỡ vẫn đeo huy hiệu của ta mãi mãi. Máy này dựng lại web ba lần với ba
 * trạng thái farm (cấp 3 → cấp 2 → gỡ hẳn) và đo huy hiệu ở từng trạng thái.
 *
 * Cùng lối với `thu-vong-du-khach.mjs`: mượn tạm hồ sơ đối chứng, hoàn nguyên qua
 * `finally`. Không lần nào dữ liệu mượn ở lại trong tệp thật.
 *
 * Chạy:  node scripts/thu-uy-tin.mjs
 */
import { chromium } from "playwright";
import { execFileSync, spawn } from "node:child_process";
import { copyFileSync, rmSync, writeFileSync } from "node:fs";
import { setTimeout as doi } from "node:timers/promises";

const TEP_DU_LIEU = "src/features/listing/data.ts";
const BAN_LUU = "src/features/listing/.data.ts.dang-thu-uy-tin";
const CONG = 3096;
const SLUG = "doi-chung-vong-du-khach";

const loi = [];
const dat = [];
const cham = (ten, dung, chiTiet = "") =>
  dung ? dat.push(ten) : loi.push(`${ten}${chiTiet ? " — " + chiTiet : ""}`);

let web;
let daThayDuLieu = false;

/** Dựng lại web với farm ở một cấp xác minh cho trước (null = gỡ hẳn hồ sơ) */
function dungLai(cap) {
  writeFileSync(
    TEP_DU_LIEU,
    cap === null
      ? `import type { Farmstay } from "@/shared/types/farmstay";
/** ⚠️ TỆP TẠM do scripts/thu-uy-tin.mjs sinh ra. Máy tự hoàn nguyên khi xong. */
export const FARMSTAYS: Farmstay[] = [];
`
      : `import type { Farmstay } from "@/shared/types/farmstay";
import { HO_SO_DAY_DU } from "../../../scripts/doi-chung-ho-so";
/** ⚠️ TỆP TẠM do scripts/thu-uy-tin.mjs sinh ra. Máy tự hoàn nguyên khi xong. */
export const FARMSTAYS: Farmstay[] = [{ ...HO_SO_DAY_DU, capXacMinh: ${cap} }];
`
  );
  execFileSync("npm", ["run", "build"], { stdio: "pipe" });
}

async function khoiDong() {
  web = spawn("npx", ["next", "start", "-p", String(CONG)], { stdio: "ignore" });
  for (let i = 0; i < 40; i++) {
    await doi(500);
    try {
      await fetch(`http://localhost:${CONG}/`);
      return;
    } catch {
      /* chưa lên */
    }
  }
}

/**
 * Tắt web VÀ CHỜ CỔNG NHẢ THẬT.
 *
 * ⚠️ Bản đầu chỉ gửi tín hiệu tắt rồi đi tiếp. Tiến trình cũ chưa chết kịp thì lần
 * dựng sau KHÔNG chiếm được cổng, chết im (đầu ra đã bị nuốt), còn phép đo thì vẫn
 * hỏi được máy chủ CŨ ⇒ đo trạng thái cũ mà tưởng là trạng thái mới. Đây đúng là
 * loại lỗi làm máy đo nói dối mà vẫn xanh.
 */
async function dungHan() {
  if (!web) return;
  web.kill("SIGTERM");
  web = undefined;
  for (let i = 0; i < 40; i++) {
    await doi(250);
    try {
      await fetch(`http://localhost:${CONG}/`);
    } catch {
      return; // không ai trả lời nữa = cổng đã nhả
    }
  }
  throw new Error(`cổng ${CONG} không nhả — máy chủ cũ còn sống, phép đo sau sẽ sai`);
}

try {
  copyFileSync(TEP_DU_LIEU, BAN_LUU);
  daThayDuLieu = true;

  // ══════ TRẠNG THÁI 1 — farm CẤP 3 (đã khảo sát thực địa) ══════
  dungLai(3);
  await khoiDong();
  const tr = await chromium.launch();

  {
    // D1 — trang phương pháp xác minh
    const p = await tr.newPage({ viewport: { width: 1440, height: 1000 } });
    const res = await p.goto(`http://localhost:${CONG}/phuong-phap-xac-minh`, {
      waitUntil: "load",
    });
    cham("D1: /phuong-phap-xac-minh mở được", res?.status() === 200, `mã ${res?.status()}`);
    /* Chờ nội dung thật hiện rồi mới đọc chữ — `innerText` KHÔNG tự chờ như
       `locator`, đọc ngay sau `load` là đọc trúng lúc khung xương còn hiện. */
    await p.locator("h1").waitFor();
    const chu = await p.locator("body").innerText();
    for (const c of ["CẤP 1", "CẤP 2", "CẤP 3", "CẤP 4"]) {
      cham(`D1: giải thích đủ ${c}`, chu.includes(c));
    }
    cham(
      "D1: nói cả mặt HẠN CHẾ của từng cấp",
      (chu.match(/KHÔNG BẢO ĐẢM ĐIỀU GÌ/g) ?? []).length === 4,
      `${(chu.match(/KHÔNG BẢO ĐẢM ĐIỀU GÌ/g) ?? []).length}/4 khối`
    );
    cham("D1: nêu chu kỳ rà soát 6 tháng", chu.includes("Sáu tháng"));
    cham(
      "D1: trung thực rằng Hội đồng Tiêu chuẩn CHƯA lập",
      chu.includes("chưa được lập")
    );
    await p.close();
  }

  {
    // D1 nối dây + D2 nút báo sai + D3 huy hiệu, trên hồ sơ farm cấp 3
    const p = await tr.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`http://localhost:${CONG}/farmstay/${SLUG}`, { waitUntil: "load" });
    await p.locator('a[data-su-kien="direct_contact_click"]').first().waitFor();

    cham(
      "D1: nhãn cấp trên hồ sơ bấm được, dẫn tới trang giải thích",
      (await p.locator('a[href="/phuong-phap-xac-minh"]').count()) >= 1
    );
    cham(
      "D3: farm cấp 3 CÓ khối huy hiệu nhúng",
      (await p.locator(`img[src="/api/huy-hieu/${SLUG}"]`).count()) === 1
    );
    const maNhung = await p.locator("code").first().innerText();
    cham(
      "D3: mã nhúng trỏ về đúng hồ sơ farm đó",
      maNhung.includes(`/farmstay/${SLUG}`),
      maNhung.slice(0, 80)
    );
    cham(
      "D3: mã nhúng ghi ĐÚNG CẤP, không ghi chung chung",
      maNhung.includes("khảo sát thực địa") && !/alt="[^"]*đã xác minh"/i.test(maNhung),
      maNhung.slice(0, 120)
    );
    await p.close();
  }

  {
    // D3 — huy hiệu là ẢNH SỐNG, ghi đúng cấp
    const res = await fetch(`http://localhost:${CONG}/api/huy-hieu/${SLUG}`);
    const svg = await res.text();
    cham("D3: huy hiệu cấp 3 phát ra được", res.status === 200, `mã ${res.status}`);
    cham(
      "D3: huy hiệu là ảnh SVG (sinh động, không phải tệp chết)",
      (res.headers.get("content-type") ?? "").includes("image/svg+xml")
    );
    cham(
      "D3: huy hiệu ghi ĐÚNG CẤP đã khảo sát thực địa",
      svg.includes("khảo sát thực địa")
    );
    cham(
      'D3: huy hiệu KHÔNG ghi chung chung "đã xác minh"',
      !/>\s*Đã xác minh\s*</i.test(svg)
    );
    cham(
      "D3: huy hiệu có tên farm và ngày rà soát",
      svg.includes("Farm đối chứng") && svg.includes("2026-08-24")
    );
    const dem = res.headers.get("cache-control") ?? "";
    const giay = Number(dem.match(/max-age=(\d+)/)?.[1] ?? "999999");
    cham(
      "D3: bộ nhớ đệm ngắn để việc hạ cấp có hiệu lực trong ngày",
      giay <= 3600,
      `max-age=${giay}`
    );

    const resBia = await fetch(`http://localhost:${CONG}/api/huy-hieu/khong-co-that`);
    cham("D3: mã farm bịa ⇒ không phát huy hiệu", resBia.status === 404, `mã ${resBia.status}`);
  }

  {
    // D2 — nút báo sai chỉ hiện khi có người nhận
    const p = await tr.newPage({ viewport: { width: 375, height: 900 } });
    await p.goto(`http://localhost:${CONG}/farmstay/${SLUG}`, { waitUntil: "load" });
    await p.locator('a[data-su-kien="direct_contact_click"]').first().waitFor();
    cham(
      "D2: chưa mở kênh nhận ⇒ KHÔNG dựng nút báo sai giả",
      (await p.getByRole("button", { name: /Thấy thông tin sai/ }).count()) === 0
    );
    const do_ = await p.evaluate(() => ({
      tran: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      /* Nêu đích danh phần tử đẩy trang rộng ra — báo "có tràn" mà không nói
         chỗ nào thì người sửa vẫn phải mò lại từ đầu. */
      thuPham: (() => {
        const man = document.documentElement.clientWidth;
        return [...document.querySelectorAll("*")]
          .filter((e) => e.getBoundingClientRect().right > man + 1)
          .slice(0, 3)
          .map(
            (e) =>
              e.tagName +
              "." +
              String(e.className).split(" ")[0] +
              "(rộng " +
              Math.round(e.getBoundingClientRect().width) +
              ")"
          )
          .join(" ‹ ");
      })(),
      chamNho: [...document.querySelectorAll("a[href], button")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.height > 0 && r.height < 44;
        })
        .map((e) => `${(e.textContent || "").trim().slice(0, 22)}:${Math.round(e.getBoundingClientRect().height)}`),
    }));
    cham("D: khổ 375 không tràn ngang", !do_.tran, do_.thuPham);
    cham("D: mọi nút/liên kết ≥44px", do_.chamNho.length === 0, do_.chamNho.join(", "));
    await p.close();

    // Đường dẫn báo sai phải nói thẳng là chưa mở, không nhận rồi đánh rơi
    const res = await fetch(`http://localhost:${CONG}/api/bao-sai`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ farmSlug: SLUG, saiChoNao: "thử" }),
    });
    cham(
      "D2: kênh nhận đóng ⇒ /api/bao-sai trả 503, KHÔNG nhận rồi làm mất",
      res.status === 503,
      `mã ${res.status}`
    );
  }

  await tr.close();
  await dungHan();

  // ══════ TRẠNG THÁI 2 — HẠ CẤP xuống 2 ══════
  dungLai(2);
  await khoiDong();
  {
    const res = await fetch(`http://localhost:${CONG}/api/huy-hieu/${SLUG}`);
    cham(
      "⭐ D3 THU HỒI: hạ farm xuống cấp 2 ⇒ huy hiệu NGỪNG phát",
      res.status === 404,
      `mã ${res.status} — farm bị hạ cấp vẫn đeo được huy hiệu`
    );
    const tr2 = await chromium.launch();
    const p = await tr2.newPage({ viewport: { width: 1440, height: 1000 } });
    await p.goto(`http://localhost:${CONG}/farmstay/${SLUG}`, { waitUntil: "load" });
    await p.locator('a[data-su-kien="direct_contact_click"]').first().waitFor();
    cham(
      "⭐ D3: farm cấp 2 KHÔNG còn khối huy hiệu trên hồ sơ",
      (await p.locator(`img[src="/api/huy-hieu/${SLUG}"]`).count()) === 0
    );
    await tr2.close();
  }
  await dungHan();

  // ══════ TRẠNG THÁI 3 — GỠ HẲN hồ sơ ══════
  dungLai(null);
  await khoiDong();
  {
    const res = await fetch(`http://localhost:${CONG}/api/huy-hieu/${SLUG}`);
    cham(
      "⭐ D3 THU HỒI: gỡ hồ sơ ⇒ huy hiệu NGỪNG phát",
      res.status === 404,
      `mã ${res.status} — farm đã gỡ vẫn đeo được huy hiệu`
    );
    const resHoSo = await fetch(`http://localhost:${CONG}/farmstay/${SLUG}`);
    cham(
      "gỡ hồ sơ ⇒ trang hồ sơ trả 404 thật",
      resHoSo.status === 404,
      `mã ${resHoSo.status}`
    );
  }
  await dungHan();
} catch (err) {
  loi.push(`không chạy được phép thử: ${err}`);
} finally {
  await dungHan().catch(() => {});
  /* ⛔ HOÀN NGUYÊN LUÔN LUÔN — dữ liệu mượn không bao giờ được ở lại */
  if (daThayDuLieu) {
    copyFileSync(BAN_LUU, TEP_DU_LIEU);
    rmSync(BAN_LUU, { force: true });
  }
}

if (loi.length > 0) {
  console.error(`\n✗ UY TÍN — ${loi.length} phép RỚT:`);
  loi.forEach((l) => console.error("  · " + l));
  console.error(`  (${dat.length} phép đạt)`);
  process.exit(1);
}
console.log(
  `✓ Uy tín: ${dat.length}/${dat.length} phép đạt — trang xác minh nói cả mặt hạn chế, nút báo sai không dựng giả, và HUY HIỆU THU HỒI ĐƯỢC (hạ cấp hoặc gỡ hồ sơ thì huy hiệu tắt). Dữ liệu mượn đã hoàn nguyên.`
);
