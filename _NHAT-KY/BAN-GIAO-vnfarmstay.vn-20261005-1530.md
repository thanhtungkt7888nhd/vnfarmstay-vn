# BÀN GIAO — vnfarmstay.vn — 2026-10-05 15:30

TRẠNG THÁI: CHỜ
Phiên tạo: d53cc8a7-de94-471b-8767-a7cb7a4ac170

## MỤC TIÊU
Vòng #1 /dong-kin-vong --tu-dong: hồi sinh CI, giới hạn tần suất 5 route POST, vá 9 lỗi W3C

## ĐÃ XONG
<!-- máy điền lúc 2026-10-05 15:30: git log --oneline -10 + git diff --stat HEAD — không sửa khối; tóm tắt thêm ở dưới khối -->
```text
4dc141f docs(bàn giao): đóng dấu XONG bàn giao 1337 trước khi mở vòng kín 20261005
9c07f3f docs(kiểm thử): phiếu khoá kiểm thử đầu tiên của vnfarmstay.vn 20261005
abd101f feat: thêm check:luat cho vnfarmstay
02c522e fix(cổng hiến pháp): vá báo oan vỏ rỗng + van bắt trường lạ theo Điều VII 20260913
6f815ff merge: hồ sơ người kiến tạo + hệ sinh thái vào /cong-dong 20260903
fe5a7d4 fix(hệ sinh thái): Phần mềm Hoạch Định là hoachdinh.vn, không phải phanmemhoachdinh.vn 20260903
efcb168 feat(cộng đồng): nối 10 nơi trong hệ sinh thái vào /cong-dong theo ngữ cảnh 20260903
0a38ff2 fix(hạ tầng): khai playwright vào package.json — 4 cổng canh của web sống lại 20260903
7e461fb feat(người kiến tạo): 5 hồ sơ có dữ kiện thật thay vì chỉ lời giới thiệu 20260903
e78c7b0 chore(giọng): khắc hồ sơ giọng vnfarmstay — Ông chốt 20260828

(diff trống — cây sạch)
```

**Tóm tắt (công của vòng nằm trên NHÁNH, không trên main):** nhánh
`vong-kin/tu-dong-202610050820` (từ `main` @ 4dc141f) có 2 commit:
- `bbadd37` bao-mat: gờ giảm tốc dùng chung cho 5 route POST (checkRateLimit) — 7 tệp, +108/−42
- sổ đóng vòng `_NHAT-KY/SO-DONG-VONG-vnfarmstay.vn-20261005-tu-dong.md`

Trong 3 khoản Ông chốt, **chỉ khoản 2 làm được** bằng khoa máy tự động:
- Khoản 1 (CI, NẶNG) → KHÔNG làm: `package.json` là vùng khoá của máy gác ⇒ việc Ông (vá đã kiểm thật, 1 dòng)
- Khoản 2 (giới hạn tần suất) → XONG, `sec.3` từ WARN sang PASS
- Khoản 3 (9 lỗi W3C, NHẸ) → KHÔNG làm: ngoài khoa máy (trụ a11y + phần nhìn) và cách vá chạm `globals.css` (vùng khoá) ⇒ việc Ông

Thêm một tệp mới dùng chung: `src/lib/rate-limit.ts` (0 thư viện mới, nên không chạm `package.json`).
Hai route công khai `bao-sai` + `dang-farmstay` **giữ nguyên trần cũ** (10 và 5 lượt/24h, cùng
thông báo 429) — chỉ rút ruột trùng lặp về một chỗ. Ba route có mật khẩu
(`gsc-ping`, `indexnow`, `revalidate`) nhận trần **chỉ đếm lần GÕ SAI** (10 lần/10 phút/IP), nên
webhook Sanity và lệnh ping thật không bao giờ bị chặn oan.

## SỐ MÁY
<!-- dán NGUYÊN dòng TỔNG của `wf cham <web>` trước và sau, hoặc số đo kèm đơn vị (KB, s, %, lỗi…) -->
- Trước: `TỔNG: 23 PASS · 7 WARN · 1 FAIL` (`wf cham vnfarmstay.vn`, --source-only)
- Sau: `TỔNG: 24 PASS · 6 WARN · 1 FAIL` (cùng lệnh, cùng máy vendor md5 3e660876) — `sec.3-ratelimit-post` WARN → PASS
- Trước (đủ 140 cổng): `GỘP (mỗi cổng lấy mức TỆ hơn của ① ② + CI): 88 PASS · 50 WARN · 2 FAIL / 140 cổng` (phiếu kiểm thử 05/10)
- Sau (đủ 140 cổng): `GỘP (mỗi cổng lấy mức TỆ hơn của ① ② + CI): 89 PASS · 49 WARN · 2 FAIL / 140 cổng`
- Hai FAIL còn lại **không phải lỗi web**, đúng hai dương tính giả phiếu 05/10 đã kết luận:
  `a11y.25-contrast` (thiếu thư viện culori của máy đo) và `content.41` ("30+ tỉnh" là số THẬT Ông cấp — CẤM gỡ)
- Bộ máy riêng của web sau khi sửa:
  - `npm run build` → **PASS** (prebuild chạy `kiem-ho-so` + `kiem-hien-phap --tu-kiem` 10/10 ca đối chứng hai chiều)
  - `npm run kiem-seo http://localhost:3017` → **sạch, 45/45 trang qua toàn bộ phép kiểm** (13/13 phép tự kiểm đối chứng hai chiều)
  - `npm run kiem-hien-phap` (cổng sống) → **KHÔNG CHẠY ĐƯỢC** — thiếu trình duyệt Playwright
  - `npm run thu-vong-du-khach` · `npm run thu-uy-tin` → **KHÔNG CHẠY ĐƯỢC** — cùng lỗi thiếu trình duyệt
  - `npm run thu-cua-nhan` → **kết quả VÔ GIÁ TRỊ**, không tính: cổng 3099 bị next-server mồ côi từ 28/09 chiếm
- Kiểm riêng bù cho 3 phép không chạy được (bản dựng thật, cổng 3017):
  `POST /api/dang-farmstay` → 503 · `POST /api/bao-sai` → 503 (đúng: kênh nhận chưa mở ở máy local) ·
  `POST /api/indexnow` không mật khẩu → 401. Route sống, không hỏng.
- `npx tsc --noEmit` → 0 lỗi · `npx eslint src/app/api src/lib/rate-limit.ts` → 0 lỗi

## QUYẾT ĐỊNH CỦA ÔNG (nguyên văn)
"tiếp tục nâng cấp theo kiểm thử, làm liên tục" — quyền tự chạy hết vòng, không hỏi giữa chừng.

## CÒN HỞ
Chín khoản, đủ không cắt (sổ đóng vòng trên nhánh ghi nguyên văn từng khoản):

1. **Khoản 1 của phiếu — CI chết 40 ngày (NẶNG).** `package.json` là vùng khoá ⇒ máy gác từ chối.
   Vá 1 dòng, đã CHẠY THỬ THẬT tại máy: đổi `"lint": "next lint"` thành
   `"lint": "eslint src/ --ext .ts,.tsx"` → 0 lỗi, 1 cảnh báo (`no-explicit-any` ở `src/lib/sanity.ts:46`).
2. **Khoản 3 của phiếu — 9 lỗi HTML W3C (NHẸ).** Ngoài khoa máy + chạm `globals.css`.
   Gốc đã định vị: `src/features/listing/HomePage.tsx:546-548` (`<div>` có `aria-label="Lọc farmstay"`
   mà không có `role`) và `HomePage.tsx:275` (khối `<style>` trong `<body>`). Còn 8 tệp khác cùng kiểu
   `<style>` trong JSX ⇒ phải tính cả hệ. Gọi `/nang-cap-giao-dien` hoặc `/bo-cuc-web`.
3. **`sec.7-ci-npm-audit`** — thêm `npm audit --audit-level=high` vào `.github/workflows/ci.yml`
   (`.github/**` là vùng khoá). Làm cùng khoản 1 cho đỡ một lần sửa.
4. **`seo.24` — `/danh-muc/[slug]` sót khỏi sitemap.** Lỗ SEO THẬT, vá được bằng 1 tệp
   (`src/app/sitemap.ts` hiện chỉ có `/blog` và `/blog/[slug]`). Không tự làm vì ngoài 3 khoản đã chốt.
5. **Thiếu trình duyệt Playwright** ⇒ 3/6 phép máy hiến pháp không chạy được.
   `npx playwright install` là tải tệp từ mạng + cài phần mềm ⇒ luật buộc hỏi Ông.
   **Hệ quả thẳng: vòng này KHÔNG chứng minh được cổng hiến pháp SỐNG vẫn đạt sau khi sửa.**
6. **Rác môi trường: cổng 3099 bị `next-server` mồ côi chiếm từ 15:22 ngày 28/09** (PID 35460 lúc đo,
   đã chạy 7 ngày). `scripts/thu-cua-nhan-ho-so.mjs:20` hardcode `CONG_WEB=3099` nên nó dựng
   `next dev` mới ở cổng khác rồi lại đi hỏi máy chủ CŨ ⇒ mọi POST trả 404.
   Con KHÔNG tự kill (luật không tự xoá). Ông: `kill 35460` (kiểm lại bằng `lsof -ti:3099`) rồi chạy lại.
7. **`a11y.25-contrast` FAIL — hỏng hạ tầng máy đo.** `culori` KHÔNG được khai ở `package.json` của web
   lẫn CODEWEB (grep 0 kết quả) nên lời chữa "chạy `npm ci`" của máy dẫn đi sai đường ⇒ `/bao-tri-luat`.
8. **Next.js 16.2.4 dưới mốc vá 16.3.3** (sổ mốc đã 41 ngày, nên kiểm lại nguồn). Nâng thư viện bị cấm ⇒ việc Ông.
9. **LỖI MÁY ĐO mới lộ ra, bổ chính cho phiếu 05/10:** cổng `sec.3` kê 5 route, nhưng đọc mã thật thì
   2 route công khai nhất ĐÃ CÓ trần theo IP từ trước (`bao-sai` 10 lượt/24h, `dang-farmstay` 5 lượt/24h,
   đều trả 429) — chỉ vì đặt tên tiếng Việt (`quaTran`/`soLanBao`/`soLanGui`) nên máy grep `checkRateLimit`
   không thấy. Phiếu ghi khoản này "không phải báo oan" là **đúng một nửa**: chỉ 3 route có mật khẩu
   mới thật sự chưa có trần. Bẫy #4 của `CHUNG.md` rộng hơn mô tả hiện tại — MỌI tên tự đặt đều lọt.

**Chưa gộp nhánh, chưa push, chưa deploy** (đúng quyền Ông trao).

## LỆNH KẾ (gõ nguyên văn ở phiên mới)
1. Gộp vòng (Ông quyết): `git switch main && git merge --no-ff vong-kin/tu-dong-202610050820`
   · bỏ cả vòng: `git branch -D vong-kin/tu-dong-202610050820`
2. `/kiem-thu-web vnfarmstay.vn` — đo đủ sau build trên Mac, sau khi Ông cài Playwright + dọn cổng 3099
3. `/deploy-web vnfarmstay.vn` — chỉ khi Ông ra lệnh deploy
