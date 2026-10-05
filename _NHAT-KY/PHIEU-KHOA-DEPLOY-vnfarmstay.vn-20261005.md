# PHIẾU KHOÁ DEPLOY — vnfarmstay.vn — 05/10/2026

Ngày       : 2026-10-05
Domain     : vnfarmstay.vn (đã sống từ trước — đây là deploy CẬP NHẬT, không phải ra mắt)
Lệnh Ông   : "deploy đi" → cổng đo lường chặn → Ông chốt **mã B** (vẫn đẩy, ghi thiếu vào phiếu)
Commit     : `abd101f..2d7eec8` — 12 commit
Trạng thái : **KHOÁ**

## 5 cổng PRE

| Cổng | Kết quả |
|---|---|
| 1. Commit có đuôi ngày | ĐẠT — `20261005` |
| 2. Đo lường trên production | **CHẶN → Ông chốt mã B, vẫn đẩy** (chi tiết dưới) |
| 3. Sitemap | ĐẠT — 200, XML hợp lệ, **45 URL** |
| 4. robots.txt | ĐẠT — 200, có `Sitemap:` + 5 `User-agent:` |
| 5. Khoá IndexNow | ĐẠT — `public/vnfarmstay2026indexnow.txt` |

## Cổng 2 — GA4 và Clarity THIẾU (Ông biết và vẫn đẩy)

`kiem-do-luong.mjs` trên bản đang chạy thật: **GA4 THIẾU · Clarity THIẾU** — trang không định gọi,
mã đã dựng cũng không có (28 tệp HTML + JS cùng nguồn).

Đo thêm bằng giao diện lập trình Vercel: dự án chỉ có **4 biến** (`NEXT_PUBLIC_SANITY_DATASET`,
`NEXT_PUBLIC_SANITY_PROJECT_ID`, `REVALIDATE_SECRET`, `INDEXNOW_KEY`). Hai biến đo lường **chưa từng
được đặt** — nên đây không phải chuyện "đặt rồi mà bản dựng chưa lấy".

Đã thử phương án A (con tự đặt hộ): **không làm được vì thiếu chính con số**. Máy không lưu mã nào,
Vercel không có, và `analytics.google.com` nằm ngoài danh sách miền trình duyệt được phép mở nên
không vào lấy mã được; trình duyệt trong ứng dụng thì không mang phiên đăng nhập của Ông.

⇒ Web **chưa đếm được lượt khách**. Tình trạng này có từ trước, **không phải do đợt deploy này**.
Việc còn lại: Ông lấy mã `G-XXXXXXXXXX` trong Google Analytics (và mã Clarity nếu muốn), đưa con
đặt biến + deploy lại. Hai mã này công khai trong HTML mọi trang, không phải bí mật.

## ⭐ KẾT QUẢ LỚN NHẤT — CI SỐNG LẠI SAU 40 NGÀY

| Lượt | Commit | Kết quả |
|---|---|---|
| 5 lượt gần nhất trước deploy (26/08 → 17/09) | — | **đỏ cả 5** |
| Lượt sau khi push hôm nay (`37290049049`) | `2d7eec8` | **XANH** |

Ba việc đều thành công: `🔍 Lint + TypeCheck` · `🏗️ Build` · `🚦 Lighthouse`.
Job **Build** vốn bị bỏ qua suốt 40 ngày (vì job Lint hỏng kéo theo) nay **chạy thật và qua**.

Gốc bệnh: `"lint": "next lint"` — Next.js 16 đã gỡ lệnh `next lint` nên nó hiểu chữ `lint` là tên
thư mục. Ông tự tay sửa sang `eslint src/ --ext .ts,.tsx` (commit `ee4d50e`).

## Smoke test trên tên miền thật

| Đường dẫn | Mã |
|---|---|
| `/` · `/sitemap.xml` · `/robots.txt` | 200 · 200 · 200 |
| `/vnfarmstay2026indexnow.txt` · `/llms.txt` | 200 · 200 |
| `/phuong-phap-xac-minh` · `/dang-farmstay` | 200 · 200 |

Sitemap trên web thật: **45 URL**.

⚠️ **Không dừng ở mã 200** (luật cấm tin tín hiệu xanh bề mặt): xác minh bản mới đã lên bằng NỘI
DUNG — `llms.txt` trên tên miền thật đổi sang `Cập nhật: 2026-10-05`, khớp bản máy.

## Kiểm trước khi đẩy (luật "deploy đi" ngầm hiểu)

**Mobile 375 · 414 · 768** — chụp và tự nhìn cả ba: chữ không tràn, nút đủ lớn, không chồng chữ,
không cắt mép. Sạch.

**Rà 12 commit tìm lỗi im lặng** — chỗ đáng ngờ nhất: `bao-sai` giảm 23 dòng và `dang-farmstay`
giảm 27 dòng (gom về `src/lib/rate-limit.ts` dùng chung), đúng loại "dọn cho gọn" có thể âm thầm
làm mất trần chặn mà build vẫn xanh. Mở mã đọc: **trần cũ còn nguyên** — 10 lượt/24h và 5 lượt/24h.
Bốn tệp tự sinh đều 200.

## Số đo luật trong ngày

`wf cham --day-du` (140 cổng): **88·50·2 → 89·49·2 → 90 PASS · 48 WARN · 2 FAIL**.
Hai FAIL còn lại đều là báo oan đã chốt (`a11y.25` thiếu `culori` của máy đo · `content.41` số
"30+ tỉnh" là số THẬT Ông cấp) ⇒ **0 lỗi chặn thật**.

Sáu phép máy riêng của web đều ĐẠT: cổng hiến pháp 45 trang/0 vi phạm · `kiem-seo` 45/45 ·
`thu-cua-nhan` 14/14 · `thu-vong-du-khach` 33/33 · `thu-uy-tin` 27/27 · `kiem-ho-so` 16/16.

## Registry
KHÔNG đụng — `HO-KHAU-WEB.json` và `ENTITY-GRAPH.json` đã có web này từ trước; sửa hai tệp đó
phải hỏi Ông.

## Còn lại sau deploy
1. **GA4 + Clarity** — Ông cấp mã, con đặt biến rồi deploy lại
2. **9 lỗi W3C** — `HomePage.tsx:275` và `:546`, còn 8 tệp cùng kiểu `<style>` trong JSX ⇒ `/nang-cap-giao-dien`
3. **`sec.7`** — thiếu bước `npm audit` chặn HIGH/CRITICAL trong `.github/workflows/ci.yml`
4. **`culori`** chưa khai ở đâu ⇒ `a11y.25` FAIL vĩnh viễn, cần `/bao-tri-luat`
5. **Next.js 16.2.4** dưới mốc vá 16.3.3

---

SKILL KẾ: `/van-hanh-web vnfarmstay.vn` — sau 28 ngày, xem dữ liệu thực địa Core Web Vitals và
độ tươi nội dung. Hoặc `/seo-toan-dien vnfarmstay.vn` ngay, vì đơn SEO mạng tuần này còn 8 việc
đứng yên.
