# PHIẾU KHOÁ KIỂM THỬ (đo SAU) — vnfarmstay.vn — 26/10/2026 (pha 9/9 vòng hoàn thiện)

## Kết luận: ĐẠT CÓ ĐIỀU KIỆN — mã tốt hơn nền, nhưng CHƯA deploy nên bản sống chưa đổi; 1 hồi quy nhỏ ở mã

Cùng điều kiện nền: `npm ci` → `npm run build` (exit 0) → `snapshot-routes.mjs .` (20 route, cây mã b86395a, "ảnh khớp mã") → `node $WF cham vnfarmstay.vn --day-du`. Máy kiểm vendor md5 `795db617` = nền = gốc (so sánh được). Bản thô: `/var/folders/zz/tgg_zz752js1ptzx589d9rl40000gn/T/check-luat-vnfarmstay-vn-20261026-{snapshot,that}.txt` (đã ghi đè bản nền cùng tên).

## Tổng quan NỀN → SAU

| Chỉ số | Nền (pha 1) | Sau (pha 9) |
|---|---|---|
| Cổng chạy | 142 | 142 |
| GỘP (tệ hơn của ① mã mới và ② bản đã deploy 05/10) | 92 PASS / 47 WARN / 3 FAIL | **91 / 48 / 3** |
| ① Snapshot (MÃ MỚI, build hôm nay) | không ghi riêng; seo.47 FAIL | **94 / 46 / 2** |
| ② HTML thật (bản deploy 05/10, KHÔNG đổi) | gồm seo.47 FAIL | 91 / 48 / 3 |
| ③ lệch ①↔② | 0 | 3 (aeo.12, aes.41, seo.47: mã mới PASS, bản sống WARN/FAIL) |

Vì GỘP lấy mức tệ hơn và ② là bản cũ, các cải thiện của vòng CHƯA hiện trong GỘP; chúng hiện ở ① và sẽ hiện ở GỘP sau deploy. GỘP -1 PASS / +1 WARN so với nền là do 1 hồi quy ở mã (xem dưới).

## Cổng chuyển (nhìn ở ① mã mới)

| Cổng | Nền | Sau (mã) | Ghi chú |
|---|---|---|---|
| seo.47-main-khong-an-cho-js | FAIL | **PASS** | 3 `loading.tsx` đổi thành `khung-cho*.tsx`; bản sống vẫn FAIL đến khi deploy |
| aeo.12-qa-40-60tu | WARN (2 câu) | **PASS** | FAQ farmstay-la-gi; bản sống vẫn WARN (76, 68 từ) |
| aes.41-kicker-mono | WARN | **PASS** | rút kicker /tuyen; bản sống vẫn WARN |
| seo.30-title-length | 5 trang ngoài 30–60 (bản sống) | 3 trang (61 ký tự) | lệch 1 ký tự |
| seo.31-desc-length | 11 trang (bản sống) | 4 trang | |
| seo.36-internal-link-density | 2 trang (cong-dong 0, phap-ly 1) | 1 trang (phap-ly 1) | cong-dong đã có liên kết |
| mot.1-linear | bản sống 13 chỗ | 7 chỗ trong mã | giữ WARN |

Còn FAIL ở ① mã mới (2): a11y.25-contrast (hạ tầng: thiếu `culori`, dương tính giả) và content.41 (số "30+ tỉnh" là số THẬT Ông cấp, `src/app/ve-chung-toi/page.tsx`, dương tính giả). Không có FAIL thật nào ở mã mới. GỘP còn seo.47 FAIL chỉ do bản sống.

## HỒI QUY (1)

| Cổng | Nền | Sau | Nguyên nhân (đối chứng) |
|---|---|---|---|
| layout.24-spacing-boi8 | PASS | **WARN** — 4 giá trị spacing px không bội 4/8 (14px, 18px) | Chạy `check-luat --source-only` trên cây commit nền b7283b1 (PASS) và trên cây hiện tại (WARN): đúng 1 cổng khác nhau. Gốc: pha 6 (commit 36dc203) gom 7 khối `<style>` vào `globals.css`; các giá trị 14/18px vốn nằm trong khối `<style>` nên máy không soi, nay vào CSS gộp nên bị soi. Là hồi quy khi đo, không phải hành vi chạy đổi. Chỉ ghi, không sửa (pha đo) |

Hồi quy khác: không thấy. Các cổng hiến pháp/máy riêng không tụt.

## Kiểm cụ thể theo yêu cầu (đo trên `next start -p 3017`, bản dựng hôm nay)

| Phép | Kết quả |
|---|---|
| seo.47 | PASS ở snapshot (20/20 trang); trên `next start` khối ẩn duy nhất trước `<main>` là `<div hidden><!--$--><!--/$--></div>` rỗng (Suspense không chứa nội dung), `<main>` ở byte ~10–12k |
| Sitemap | `<loc>` = **45** (cục bộ `next start` và tên miền thật đều 45) |
| Đúng 1 `<main>` mỗi trang | 45/45 trang trong sitemap đúng 1 |
| `<style>` trong `<body>` | 0 trên 45/45 trang |
| `kiem-seo` | SẠCH — 45/45 trang qua; tự kiểm 13/13 |
| `thu-cua-nhan` | 14/14 phép qua |
| `npm run build` (prebuild: van hồ sơ, tự kiểm hiến pháp) | exit 0 |
| `kiem-hien-phap`, `thu-vong-du-khach`, `thu-uy-tin` | **CHƯA ĐO ĐƯỢC** — Playwright chromium chưa được duyệt tải (như nền), không tải |

## Máy ngoài trên tên miền thật (BẢN ĐÃ DEPLOY 05/10 — `age` ≈ 21 ngày, `x-vercel-cache: HIT` — KHÔNG phản ánh mã mới)

| Công cụ | Nền | Sau | Ghi chú |
|---|---|---|---|
| Lighthouse hiệu năng mobile | 75 (1 lần, nhiễu) | **trung vị 90** (3 lần: 97 / 90 / 88) | LCP 2,7–3,3 s · CLS 0 · TBT 0–30 ms; nhiễu lớn, bản sống không đổi |
| Lighthouse truy cập / thực hành tốt / SEO | 96 / 100 / 100 | 96 / 100 / 100 (cả 3 lần) | còn `aria-hidden-focus` (bản sống cũ; sửa ở mã, chưa deploy) |
| W3C | 8 lỗi · 43 thông tin | 8 · 43 | bản sống không đổi |
| Header bảo mật | 6/6 | 6/6 | |
| robots.txt | mở đúng | mở đúng | |
| sitemap.xml | 45 | 45 | |
| npm audit (prod) | 33 (2 critical · 20 high) | 33 (2 · 20 · 9 moderate · 2 low) | không đổi; Next.js 16.2.4 dưới mốc vá 16.3.3 |
| CI | lượt cuối 05/10 success | giống | chưa chạy lại vì chưa push |

## Dương tính giả / lỗi máy đo (giữ như nền)

a11y.25 (thiếu culori) · content.41 ("30+ tỉnh" số thật) · 6 cổng ⑤ báo oan thiếu tệp (code.1, code.3, ops.2, qa.6, qa.11, content.15) · green.1 (không thấy `.next/static` dù build vừa xong) · content.40/seo.35 chưa có mốc snapshot · các cổng web dựng trước template chuẩn (exp.*, seo.44/45, content.3*).

## Chưa đo được

3 cổng Playwright · a11y.25b (tương phản render) · green.1 cân nặng trang · bố cục trên Chrome thật (không thuộc phiếu này).

## Khuyến nghị

- Việc lớn nhất còn lại: **deploy** (Ông ra lệnh) để seo.47, aeo.12, aes.41, aria-hidden-focus, title/desc, W3C `<style>` trong body thành thật trên bản sống; sau deploy chạy lại `wf cham --day-du` để GỘP phản ánh mã mới.
- Nâng Next.js ≥ mốc vá và gói critical/high (Ông duyệt), thêm bước `npm audit` vào CI.
- layout.24 (14/18px) quy về token `--space-*` ở lượt giao diện sau.
- `npx playwright install chromium` (Ông duyệt tải) rồi chạy 3 cổng riêng.

Ghi chú vết đo: build làm đổi `public/llms.txt` (nếu có) và `snapshot-routes` chụp lại `.kiem-snapshot/`; commit cùng phiếu như vết đo.

SKILL KẾ: `/deploy-web` — chỉ khi Ông nói "deploy đi"; trước đó `/bao-mat-web` cho Next.js dưới mốc vá.
