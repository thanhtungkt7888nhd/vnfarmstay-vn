# PHIẾU KHOÁ KIỂM THỬ — vnfarmstay.vn — 26/10/2026 (đo nền pha 1/9 của vòng hoàn thiện)

## Kết luận: ĐẠT CÓ ĐIỀU KIỆN

Máy báo 3 FAIL (lỗi chặn); sau đối chiếu mã thật: 1 FAIL THẬT (seo.47), 2 là dương tính giả/báo oan (a11y.25, content.41).
Điều kiện: 33 lỗ hổng phụ thuộc (2 nghiêm trọng, 20 cao) kể cả Next.js 16.2.4 dưới mốc vá 16.3.3; 3 cổng Playwright chưa đo được.

## Luật: VN v5.2 (22 trụ · 357 tiêu chí · 208 must) · Engine check-luat v5.26 · Vendor md5=795db617 · trùng gốc

## Tổng quan (NỀN cho pha 9 — cùng điều kiện, cùng bộ tiêu chí)

| Chỉ số | Số đo |
|---|---|
| Cổng chạy | 142 |
| PASS (đạt) | 92 |
| WARN (cảnh báo) | 47 |
| FAIL (lỗi chặn) máy báo | 3 |
| FAIL thật sau đối chiếu | 1 (seo.47) |
| Báo oan thiếu tệp (⑤) | 6 cổng (nằm trong 47 WARN) |

Lệnh: `node $WF cham vnfarmstay.vn --day-du` sau `npm ci` + `npm run build` + `node SO-TAY/snapshot-routes.mjs .` (snapshot 20 route, dấu chụp khớp mã). Bản thô: `/var/folders/zz/tgg_zz752js1ptzx589d9rl40000gn/T/check-luat-vnfarmstay-vn-20261026-{snapshot,that}.txt`.

## DANH SÁCH ĐỎ (FAIL THẬT)

| # | ID | Mô tả | Chứng cứ | Pha xử lý |
|---|---|---|---|---|
| 1 | seo.47-main-khong-an-cho-js | 20/20 trang (cả snapshot lẫn HTML thật trên tên miền) có `<main>`/`<h1>` nằm sau khối ẩn chờ JS | `src/app/loading.tsx` gốc là một `<div aria-busy>` toàn màn hình; Suspense của Next bọc cả trang → nội dung nằm sau khối ẩn (vd blog: khối ẩn @9717, `<main>` @15457). Dòng này MỚI so với phiếu 05/10 (cổng mới trong v5.26), không phải lỗi mới của mã | SEO |

Khoản lỗi thật ngoài bảng cổng:

| # | Khoản | Chứng cứ | Pha xử lý |
|---|---|---|---|
| 2 | `npm audit --omit=dev`: 33 lỗ hổng (2 critical · 20 high · 9 moderate · 2 low). Critical: `next`, `tar`. High gồm postcss, sharp, vite, ws, undici, zod, dompurify, markdown-it, nanoid… `next` đề xuất 16.4.3; mốc vá của sổ nhà máy 16.3.3 (web đang 16.2.4, DƯỚI MỐC, sổ 62 ngày) | `npm audit --json` hôm nay; sec.7 WARN "không thấy bước npm audit" trong CI | Bảo mật (Ông duyệt nâng bản) |
| 3 | W3C 8 lỗi trang chủ: `aria-label` trên `<div>` không role (loading) · `<style>` trong `<body>` không phải con đầu · 6 rule `.hero-wave*` ngoài `@scope` | validator.w3.org, tên miền thật | Giao diện / hiệu ứng |
| 4 | Lighthouse truy cập 96: `aria-hidden-focus` (phần tử `aria-hidden` chứa con focus được) | Lighthouse mobile, tên miền thật | Giao diện |

## Dương tính giả đã loại

| # | ID | Máy nói | Sự thật (bằng chứng) |
|---|---|---|---|
| 1 | content.41 FAIL | "30+ tỉnh" số tự chế | Số THẬT Ông cấp: `src/app/ve-chung-toi/page.tsx:9` (bộ "9+ năm · 100+ dự án · 30+ tỉnh thành…", 08/08/2026), dòng 140 `so: "30+"`. Không phải số bịa |
| 2 | a11y.25-contrast FAIL | thiếu `culori` | Hạ tầng máy: `culori` không có trong `package.json` (grep 0), `npm ci` không cứu. Lighthouse accessibility 96 và KHÔNG có lỗi `color-contrast` trên trang chủ thật. Phần còn lại chưa đo (a11y.25b CHƯA ĐO) |
| 3–8 | code.1 · code.3 · ops.2 · qa.6 · qa.11 · content.15 | "không tìm thấy tệp" | Nhãn ⑤: cả 6 tệp CÓ thật (`public/manifest.json`, `.github/workflows/ci.yml`, `README.md`, `src/app/page.tsx`) |
| 9 | perf.4-raw-img WARN | 1 tệp `<img>` thô | Cố ý: `farmstay/[slug]/page.tsx:744` ảnh huy hiệu sinh động có chú thích lý do (tệp blog đã dùng next/image). Phần còn lại chỉ nhắc trong comment/chuỗi mã nhúng. Giữ nguyên, không phải lỗi |
| 10 | seo.44/45 · exp.20,25-29,33-35 · content.3,3b,14 | thiếu site-config.ts/.buildstate.json/content.ts | Web dựng trước template chuẩn → "chưa đo được", không phải sai |
| 11 | sec.7 WARN | thiếu npm audit trong CI | Thật nhưng nhẹ (CI chạy lint + build); đã gộp vào khoản đỏ #2 |

## Cách đo

- **①** Snapshot `.kiem-snapshot`: 20 trang · chụp lại 26/10 18:23 sau build mới · "ảnh khớp mã" (so nội dung qua dấu chụp). Lưu ý: 20 route thật, không gồm route động (`[slug]`); sitemap có 45 URL
- **②** HTML thật `https://vnfarmstay.vn`: 20/20 trang tải được. Bản chạy trên domain thật là bản deploy 05/10 (header `age` ~21 ngày)
- **③** So ①↔②: 142/142 khớp · lệch 0
- **④** CI: `thanhtungkt7888nhd/vnfarmstay-vn` lượt cuối 05/10 `success` (2 lượt gần nhất xanh, 3 lượt trước đó đỏ) → không hạ cổng CI
- **⑤** 6 cổng báo oan thiếu tệp (xem trên)
- Cổng hiến pháp (cổng `next start -p 3017`, bản dựng thật): xem bảng dưới

## Cổng hiến pháp / máy riêng của web (build thật, `next start -p 3017`)

| Phép | Kết quả |
|---|---|
| `npm run build` (prebuild: kiem-ho-so 16/16, tự kiểm hiến pháp 10/10, sinh tệp tĩnh) | THÀNH CÔNG, exit 0 |
| `kiem-seo` | SẠCH — 45/45 trang qua; tự kiểm 13/13 |
| `thu-cua-nhan` | 14/14 phép qua |
| `kiem-hien-phap` | CHƯA ĐO ĐƯỢC — thiếu trình duyệt Playwright (`chromium_headless_shell-1234` chưa tải). Chỉ phần tự kiểm 10/10 chạy được |
| `thu-vong-du-khach` | CHƯA ĐO ĐƯỢC — cùng lý do (0 phép chạy) |
| `thu-uy-tin` | CHƯA ĐO ĐƯỢC — cùng lý do (0 phép chạy) |

Cách khắc phục cần Ông cho phép: `npx playwright install chromium` (tải trình duyệt ~100MB; chưa làm vì tải tệp cần Ông duyệt).

## Máy ngoài (tên miền thật, 26/10)

| Công cụ | Kết quả | Ghi chú |
|---|---|---|
| Lighthouse hiệu năng mobile | **75/100** | LCP 3,6 s · CLS 0 · TBT 420 ms · FCP 2,4 s · Speed Index 3,9 s (mạng/máy chạy trên Mac của phiên; lần 05/10 đo 89, chênh lớn → số hiệu năng có nhiễu, pha 9 đo lại cùng máy, chạy 3 lần lấy trung vị) |
| Lighthouse truy cập / thực hành tốt / SEO | **96 / 100 / 100** | lỗi duy nhất: aria-hidden-focus |
| W3C | 8 lỗi · 43 thông tin | xem đỏ #3 |
| Header bảo mật | 6/6 | CSP · HSTS preload · X-Frame-Options · X-Content-Type-Options · Referrer-Policy · Permissions-Policy |
| robots.txt | mở đúng | chặn `/api/` `/admin/`; cho GPTBot, ClaudeBot, Google-Extended, PerplexityBot; khai sitemap |
| sitemap.xml | 45 URL | khớp kiem-seo |
| npm audit | 33 lỗ hổng | xem đỏ #2 |

## So sánh với lần kiểm trước (05/10)

| Chỉ số | 05/10 (máy v5.x cũ) | 26/10 (v5.26) | Ghi chú |
|---|---|---|---|
| Cổng chạy | 140 | 142 | máy thêm 2 cổng |
| PASS / WARN / FAIL | 88 / 50 / 2 | 92 / 47 / 3 | FAIL +1 là cổng mới seo.47; sec.3 và seo.24 đã PASS nhờ vòng 05/10 |
| Lighthouse hiệu năng | 89 | 75 | nhiễu đo; cần đo lặp ở pha 9 |
| W3C | 9 lỗi | 8 lỗi | |
| CI | 5/5 đỏ | xanh 2 lượt | đã sống lại 05/10 |

Không tái dùng số cũ làm nền; bảng chỉ để đối chiếu.

## Lỗi máy đo lộ ra (chỉ ghi phiếu)

| # | Cổng | Máy nói | Sự thật |
|---|---|---|---|
| 1 | a11y.25 | "culori đã khai trong package.json, chạy npm ci" | không khai; lời chữa sai hướng |
| 2 | content.41 | "30+ tỉnh" bịa | số Ông cấp có chú thích nguồn |
| 3 | 6 cổng ⑤ | "không tìm thấy tệp" | tệp có thật |
| 4 | green.1 | "Không có .next/static" | `.next/static` có 1,3 MB sau build; máy chấm trên thư mục tạm không thấy → số cân nặng trang CHƯA ĐO |
| 5 | snapshot-routes | 20 route | bỏ route động; 45 URL sitemap chỉ kiem-seo phủ hết |

## Mục thiếu / chưa đo được

- 3 cổng Playwright (kiem-hien-phap, thu-vong-du-khach, thu-uy-tin): thiếu trình duyệt
- a11y.25 / a11y.25b tương phản toàn trang; green.1 cân nặng trang; content.40 / seo.35 chưa có mốc snapshot trước (cần `--update-snapshot`, chờ Ông xác nhận nội dung)
- Chưa chụp màn hình/bố cục trên Chrome thật (phiếu này không chấm bố cục; pha bố cục/giao diện làm)
- Lighthouse hiệu năng 1 lần đo, nhiễu

## Khuyến nghị theo pha sau

| Pha | Việc |
|---|---|
| Bảo mật | Nâng Next.js ≥ mốc vá (16.3.3, nay đề xuất 16.4.3) và các gói critical/high (tar, postcss, sharp…); thêm bước `npm audit` vào CI (sec.7) — cần Ông duyệt đổi bản |
| SEO | Gỡ/ thu hẹp `src/app/loading.tsx` gốc (seo.47); 5 title ngoài 30–60, 11 mô tả ngoài 120–160, 2 trang ít link nội bộ (cong-dong 0, phap-ly 1); 2 câu trả lời FAQ ngoài 40–60 từ (aeo.12); đơn SEO mạng: 6 việc |
| Bài viết | Mô tả meta/độ dài bài blog (seo.31 blog 106 ký tự); aeo.12; 2 bài trong đơn đặt bài cụm (chờ Ông duyệt) |
| Giao diện | `aria-hidden-focus`, aes.41 kicker dài ở `/tuyen`, mot.9 (DESIGN-DNA chưa có dòng "Hiệu ứng đã chọn") |
| Bố cục | layout.18 (text-wrap), layout.20-trim, layout.23-container, ux.18 (20 khối nav >7 link), layout.20-measure |
| Hiệu ứng | mot.1 (10 chỗ easing linear), W3C 6 rule `.hero-wave*` ngoài `@scope`, `<style>` trong `<body>` |
| Ngoài các pha | `npx playwright install chromium` rồi chạy lại 3 cổng; `--update-snapshot` cho content.40/seo.35 |

Kiểm lại: pha 9 (cùng điều kiện: `npm ci` → build → snapshot-routes → `wf cham --day-du` + 3 cổng riêng + Lighthouse lặp).

Ghi chú vết đo: `npm run build` tự chạy prebuild làm đổi `public/llms.txt` (chỉ dòng ngày "Cập nhật"), và `snapshot-routes.mjs` chụp lại `.kiem-snapshot/`; hai thứ này commit cùng phiếu như vết đo, không phải sửa mã.

SKILL KẾ: `/bao-mat-web` — Next.js dưới mốc vá + 2 lỗ hổng critical là rủi ro lớn nhất, kế đó `/seo-toan-dien` cho seo.47.
