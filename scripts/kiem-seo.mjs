#!/usr/bin/env node
/**
 * MÁY KIỂM SEO — chạy trên máy chủ ĐANG SỐNG, đo HTML thật máy chủ trả về.
 *
 * Vì sao không đọc mã nguồn: mã chỉ cho biết ta ĐỊNH làm gì. Giữa mã và HTML có
 * nhiều tầng bẻ gãy ý định (khuôn tiêu đề của layout, thẻ robots bị ghi đè, schema
 * không lọt vào HTML…). Máy này chỉ tin thứ máy chủ thật sự gửi đi.
 *
 * Cách chạy:
 *   npm run build && npx next start -p 3117
 *   node scripts/kiem-seo.mjs http://localhost:3117
 *
 * ⚠️ ĐỐI CHỨNG HAI CHIỀU (quy ước #11 của dự án): mỗi phép kiểm dưới đây đều được
 * chạy thử trên MỘT mẫu đã biết ĐÚNG và MỘT mẫu đã biết SAI trước khi máy được phép
 * báo kết quả thật (`node scripts/kiem-seo.mjs --tu-kiem`). Nếu bộ tự kiểm không
 * qua, máy DỪNG và không đưa ra con số nào — công cụ đo sai còn nguy hơn không đo.
 */

const GOC = process.argv[2] || "http://localhost:3117";
const CHI_TU_KIEM = process.argv.includes("--tu-kiem");

// ─── Các phép kiểm, viết thành hàm thuần để đối chứng được ────────────────────

/** Đếm thẻ h1 cấp trang. */
export function demH1(html) {
  return (html.match(/<h1[\s>]/gi) || []).length;
}

/** Lấy canonical; trả về null nếu không có. */
export function layCanonical(html) {
  const m = html.match(/<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
  return m ? m[1] : null;
}

/** Lấy nội dung thẻ title. */
export function layTitle(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
}

/** Lấy meta description. */
export function layDescription(html) {
  const m = html.match(
    /<meta[^>]+name="description"[^>]+content="([^"]*)"/i
  );
  return m ? m[1].trim() : "";
}

/** Trang có bị chặn index không. */
export function biChanIndex(html) {
  const m = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i);
  return m ? /noindex/i.test(m[1]) : false;
}

/** Đếm liên kết chết `href="#"`. */
export function demLienKetChet(html) {
  return (html.match(/href="#"/g) || []).length;
}

/** Bóc mọi khối JSON-LD; ném lỗi nếu có khối không phân tích được. */
export function bocJsonLd(html) {
  const khoi = [
    ...html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi
    ),
  ];
  return khoi.map((k) => JSON.parse(k[1]));
}

/** Đếm liên kết nội bộ dạng `<a href="/…">` — điều hướng máy đi theo được. */
export function demLienKetNoiBo(html) {
  return (html.match(/<a[^>]+href="\/[^"]*"/g) || []).length;
}


/** Đếm thẻ landmark chính. */
export function demMain(html) {
  return (html.match(/<main[\s>]/gi) || []).length;
}

/** Đếm ảnh thiếu thuộc tính alt. */
export function demAnhThieuAlt(html) {
  const anh = html.match(/<img\b[^>]*>/gi) || [];
  return anh.filter((a) => !/\salt=/i.test(a)).length;
}

/**
 * Tìm chỗ thứ bậc tiêu đề nhảy cấp (h2 → h4).
 * Trình đọc màn hình dựng mục lục trang bằng thứ bậc này; nhảy cấp là mất một tầng.
 */
export function timNhayCapTieuDe(html) {
  const cap = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => +m[1]);
  const nhay = [];
  for (let i = 1; i < cap.length; i++) {
    if (cap[i] - cap[i - 1] > 1) nhay.push(`h${cap[i - 1]}→h${cap[i]}`);
  }
  return nhay;
}

// ─── Bộ tự kiểm: mỗi phép kiểm chạy trên 1 mẫu ĐÚNG và 1 mẫu SAI ─────────────

const MAU_DUNG = `<html><head>
<title>Tiêu đề thật</title>
<meta name="description" content="Mô tả thật của trang."/>
<link rel="canonical" href="https://vnfarmstay.vn/vi-du"/>
<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebPage"}</script>
</head><body><h1>Một tiêu đề chính</h1><a href="/tour-farmstay">Bản đồ vùng</a></body></html>`;

const MAU_SAI = `<html><head>
<title></title>
<meta name="robots" content="noindex, follow"/>
<script type="application/ld+json">{ khong phai json }</script>
</head><body><h1>Một</h1><h1>Hai</h1><a href="#">Liên kết chết</a></body></html>`;

const MAU_A11Y_DUNG = `<body><main><h1>Một</h1><h2>Hai</h2><h3>Ba</h3>
<img src="a.jpg" alt="Mô tả thật"/></main></body>`;

const MAU_A11Y_SAI = `<body><main><h1>Một</h1><h3>Nhảy cấp</h3>
<img src="a.jpg"/></main><main>Hai landmark</main></body>`;

/* Mẫu đối chứng cho phép "trang mồ côi": trang A có liên kết trỏ tới, trang B không. */
const MANG_DUNG = { "/a": ['<a href="/b">x</a>'], "/b": [] };
const MANG_SAI = { "/a": [], "/b": [] };

/** Trả về các đường dẫn KHÔNG được trang nào khác trỏ tới. */
function timMoCoi(banDo) {
  const duocTro = new Set();
  for (const html of Object.values(banDo)) {
    for (const h of html) {
      for (const m of h.matchAll(/href="(\/[^"#?]*)"/g)) duocTro.add(m[1]);
    }
  }
  return Object.keys(banDo).filter((d) => d !== "/" && !duocTro.has(d));
}

function tuKiem() {
  const ca = [
    ["đếm h1", () => demH1(MAU_DUNG) === 1, () => demH1(MAU_SAI) === 2],
    [
      "canonical",
      () => layCanonical(MAU_DUNG) === "https://vnfarmstay.vn/vi-du",
      () => layCanonical(MAU_SAI) === null,
    ],
    [
      "title",
      () => layTitle(MAU_DUNG) === "Tiêu đề thật",
      () => layTitle(MAU_SAI) === "",
    ],
    [
      "description",
      () => layDescription(MAU_DUNG).length > 0,
      () => layDescription(MAU_SAI) === "",
    ],
    [
      "chặn index",
      () => biChanIndex(MAU_DUNG) === false,
      () => biChanIndex(MAU_SAI) === true,
    ],
    [
      "liên kết chết",
      () => demLienKetChet(MAU_DUNG) === 0,
      () => demLienKetChet(MAU_SAI) === 1,
    ],
    [
      "JSON-LD",
      () => bocJsonLd(MAU_DUNG).length === 1,
      () => {
        try {
          bocJsonLd(MAU_SAI);
          return false; // mẫu sai mà không ném lỗi ⇒ máy mù
        } catch {
          return true;
        }
      },
    ],
    [
      "liên kết nội bộ",
      () => demLienKetNoiBo(MAU_DUNG) === 1,
      () => demLienKetNoiBo(MAU_SAI) === 0,
    ],
    [
      "landmark main",
      () => demMain(MAU_A11Y_DUNG) === 1,
      () => demMain(MAU_A11Y_SAI) === 2,
    ],
    [
      "ảnh thiếu alt",
      () => demAnhThieuAlt(MAU_A11Y_DUNG) === 0,
      () => demAnhThieuAlt(MAU_A11Y_SAI) === 1,
    ],
    [
      "trang mồ côi",
      () => timMoCoi(MANG_DUNG).length === 1,
      () => timMoCoi(MANG_SAI).length === 2,
    ],
    [
      "nhảy cấp tiêu đề",
      () => timNhayCapTieuDe(MAU_A11Y_DUNG).length === 0,
      () => timNhayCapTieuDe(MAU_A11Y_SAI).length === 1,
    ],
  ];

  let hong = 0;
  for (const [ten, chieuDung, chieuSai] of ca) {
    const a = chieuDung();
    const b = chieuSai();
    if (!a || !b) {
      hong++;
      console.error(
        `  ✗ ${ten}: chiều-đúng=${a ? "đạt" : "TRƯỢT"} · chiều-sai=${b ? "đạt" : "TRƯỢT"}`
      );
    }
  }
  if (hong > 0) {
    console.error(
      `\n⛔ Bộ tự kiểm hỏng ${hong}/${ca.length} phép — KHÔNG dùng kết quả của máy này.`
    );
    process.exit(2);
  }
  console.log(`✓ Tự kiểm: ${ca.length}/${ca.length} phép qua đối chứng hai chiều.`);
}

// ─── Chạy thật ───────────────────────────────────────────────────────────────

async function tai(duong) {
  const res = await fetch(`${GOC}${duong}`, { redirect: "manual" });
  return { ma: res.status, html: res.ok ? await res.text() : "" };
}

async function layUrlTrongSitemap() {
  const res = await fetch(`${GOC}/sitemap.xml`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => m[1].replace(/^https:\/\/vnfarmstay\.vn/, ""))
    .map((u) => (u === "" ? "/" : u));
}

async function chay() {
  const loi = [];
  const canhBao = [];

  const duongDan = await layUrlTrongSitemap();
  console.log(`\nĐo ${duongDan.length} đường dẫn khai trong sitemap tại ${GOC}\n`);

  /* Gom HTML để dò trang mồ côi sau vòng lặp. `check-orphans.mjs` bỏ qua các route
     động, nên 13 trang sinh từ dữ liệu (vùng · trải nghiệm · mùa · tuyến) không được
     máy nào canh — đây chính là lỗ hổng phép này bịt. */
  const banDoHtml = {};

  for (const d of duongDan) {
    const { ma, html } = await tai(d);
    if (ma === 200) banDoHtml[d] = [html];

    if (ma !== 200) {
      loi.push(`${d} — sitemap khai nhưng máy chủ trả mã ${ma}`);
      continue;
    }
    if (biChanIndex(html)) {
      loi.push(`${d} — nằm trong sitemap nhưng mang thẻ noindex`);
    }

    const soH1 = demH1(html);
    if (soH1 !== 1) loi.push(`${d} — có ${soH1} thẻ h1, phải đúng 1`);

    const canonical = layCanonical(html);
    if (!canonical) loi.push(`${d} — thiếu canonical`);
    else if (!canonical.startsWith("https://"))
      loi.push(`${d} — canonical không phải URL tuyệt đối: ${canonical}`);

    const title = layTitle(html);
    if (!title) loi.push(`${d} — thiếu tiêu đề`);
    else if (title.length > 70)
      canhBao.push(`${d} — tiêu đề ${title.length} ký tự, dễ bị cắt`);

    const desc = layDescription(html);
    if (!desc) loi.push(`${d} — thiếu mô tả`);

    try {
      const khoi = bocJsonLd(html);
      if (khoi.length === 0) canhBao.push(`${d} — không có khối JSON-LD nào`);
    } catch (e) {
      loi.push(`${d} — JSON-LD không phân tích được: ${e.message}`);
    }

    const chet = demLienKetChet(html);
    if (chet > 0) loi.push(`${d} — có ${chet} liên kết chết href="#"`);

    if (demLienKetNoiBo(html) === 0)
      loi.push(`${d} — không có liên kết nội bộ nào máy đi theo được`);

    const soMain = demMain(html);
    if (soMain !== 1) loi.push(`${d} — có ${soMain} thẻ <main>, phải đúng 1`);

    const thieuAlt = demAnhThieuAlt(html);
    if (thieuAlt > 0) loi.push(`${d} — ${thieuAlt} ảnh thiếu thuộc tính alt`);

    const nhayCap = timNhayCapTieuDe(html);
    if (nhayCap.length > 0)
      loi.push(`${d} — thứ bậc tiêu đề nhảy cấp: ${nhayCap.join(", ")}`);
  }

  // Đường dẫn bịa phải trả 404 thật, không phải 200 kèm trang "không tìm thấy"
  for (const bia of ["/vung/khong-co-that-dau", "/farmstay/khong-co-that-dau"]) {
    const { ma } = await tai(bia);
    if (ma !== 404) loi.push(`${bia} — trả mã ${ma}, phải là 404 (404 mềm)`);
  }

  // Trang kết quả tìm kiếm nội bộ phải noindex và không được nằm trong sitemap
  const tim = await tai("/tim-kiem");
  if (tim.ma === 200 && !biChanIndex(tim.html))
    loi.push("/tim-kiem — phải mang noindex");
  if (duongDan.includes("/tim-kiem"))
    loi.push("/tim-kiem — không được nằm trong sitemap");

  /* Trang mồ côi — không trang nào trong sitemap trỏ tới nó. Người dùng chỉ tới được
     bằng cách gõ tay URL, và máy tìm kiếm coi đó là dấu hiệu trang không quan trọng. */
  for (const d of timMoCoi(banDoHtml)) {
    loi.push(`${d} — mồ côi: không trang nào trong sitemap có liên kết trỏ tới`);
  }

  console.log(`\n${"─".repeat(60)}`);
  if (canhBao.length) {
    console.log(`\n⚠ ${canhBao.length} cảnh báo:`);
    canhBao.forEach((c) => console.log(`  · ${c}`));
  }
  if (loi.length) {
    console.log(`\n✗ ${loi.length} lỗi chặn:`);
    loi.forEach((l) => console.log(`  · ${l}`));
    process.exit(1);
  }
  console.log(`\n✓ Sạch — ${duongDan.length} trang qua toàn bộ phép kiểm.`);
}

tuKiem();
if (!CHI_TU_KIEM) await chay();
