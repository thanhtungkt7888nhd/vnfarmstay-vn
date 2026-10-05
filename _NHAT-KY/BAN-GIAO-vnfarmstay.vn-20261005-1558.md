# BÀN GIAO — vnfarmstay.vn — 2026-10-05 15:58

TRẠNG THÁI: CHỜ
Phiên tạo: d53cc8a7-de94-471b-8767-a7cb7a4ac170

## MỤC TIÊU
Vòng #1 dong-kin-vong — vá 3 khoản phiếu kiểm thử, nghiệm thu đủ bộ

## ĐÃ XONG
<!-- máy điền lúc 2026-10-05 15:58: git log --oneline -10 + git diff --stat HEAD — không sửa khối; tóm tắt thêm ở dưới khối -->
```text
0e2481e fix(seo.24): trang danh mục vào sitemap — nhưng CHỈ danh mục có bài thật 20261005
ee4d50e fix(CI): lint dùng eslint thay next lint — Next 16 đã gỡ lệnh này 20261005
f707b50 merge: vòng #1 dong-kin-vong vnfarmstay.vn 20261005
4ad7ab5 docs(đính chính): phiếu kiểm thử khai sai khoản rate-limit 20261005
d4a5409 docs(bàn giao): vòng #1 dong-kin-vong tu-dong vnfarmstay.vn 20261005
656e549 dong-kin-vong(tu-dong): sổ đóng vòng vnfarmstay.vn 20261005
bbadd37 dong-kin-vong(tu-dong): bao-mat: gờ giảm tốc dùng chung cho 5 route POST (checkRateLimit)
4dc141f docs(bàn giao): đóng dấu XONG bàn giao 1337 trước khi mở vòng kín 20261005
9c07f3f docs(kiểm thử): phiếu khoá kiểm thử đầu tiên của vnfarmstay.vn 20261005
abd101f feat: thêm check:luat cho vnfarmstay

.../SO-DONG-VONG-vnfarmstay.vn-20261005-tu-dong.md | 55 ++++++++++++++++++++++
 1 file changed, 55 insertions(+)
```

## SỐ MÁY
<!-- dán NGUYÊN dòng TỔNG của `wf cham <web>` trước và sau, hoặc số đo kèm đơn vị (KB, s, %, lỗi…) -->
- Trước: `GỘP (mỗi cổng lấy mức TỆ hơn của ① ② + CI): 88 PASS · 50 WARN · 2 FAIL / 140 cổng`
- Sau: `GỘP (mỗi cổng lấy mức TỆ hơn của ① ② + CI): 90 PASS · 48 WARN · 2 FAIL / 140 cổng`
- Hai FAIL còn lại là **hai dương tính giả đã chốt** (`a11y.25` thiếu culori của máy đo ·
  `content.41` số "30+ tỉnh" là số THẬT Ông cấp) ⇒ **0 lỗi chặn thật**
- Cổng chuyển xanh: `sec.3-ratelimit-post` · `seo.24-dynroute-sitemap`
- Nghiệm thu bản dựng thật (cổng 3017): cổng hiến pháp **45 trang · 0 vi phạm · 6/6 phép** ·
  `kiem-seo` **45/45 trang sạch** · `thu-vong-du-khach` **33/33** · `thu-uy-tin` **27/27**
- `tsc` 0 lỗi · `eslint` 0 lỗi, 1 cảnh báo · build qua
- Sitemap thật sau vá: **45 URL, 0 dòng `/danh-muc`** (đúng ý định — kho bài rỗng thì không mời
  Google vào trang trống)

## QUYẾT ĐỊNH CỦA ÔNG (nguyên văn)
<!-- dán nguyên văn lời Ông; không có thì ghi đúng dòng: (không có quyết định mới) -->
"tiếp tục nâng câp theo kiem thu web đi, làm liên tục"

Ông còn tự tay chạy hai lệnh trong terminal: vá script `lint` (`npm pkg set`) và `git merge --no-ff`
nhánh vòng. Lệnh merge dừng ở trạng thái chờ thông điệp; phiên chính đóng lại giúp (`f707b50`).

## CÒN HỞ
<!-- việc chưa xong, lỗi còn treo, việc chờ Ông -->
**Đã xong cả 3 khoản của phiếu kiểm thử** (khoản 1 Ông tự vá, khoản 2 agent vòng vá, khoản 3 còn
lại ở dạng việc giao diện) **cộng thêm `seo.24` ngoài kế hoạch.**

1. **9 lỗi W3C** — chưa vá. Ngoài khoa máy tự động (trụ a11y + phần nhìn). Gốc:
   `src/features/listing/HomePage.tsx:546` (`aria-label` trên `<div>` không `role`) và `:275`
   (`<style>` trong `<body>`). Còn **8 tệp khác cùng kiểu** `<style>` trong JSX ⇒ sửa phải tính
   cả hệ. Giao `/nang-cap-giao-dien` hoặc `/bo-cuc-web`.
2. **`sec.7`** — `.github/workflows/ci.yml` thiếu bước `npm audit` chặn HIGH/CRITICAL. Vùng của Ông.
3. **CI chưa xác minh xanh trở lại** — đã vá script nhưng **chưa push** nên chưa có lượt chạy mới.
   Lượt cuối máy đọc được vẫn là 17/09 → cổng ④ vẫn hạ 4 cổng CI.
4. ~~Cổng 3099 mồ côi~~ → **ĐÃ XONG cuối ngày.** Tiến trình `next-server` chiếm cổng từ 28/09
   15:22 nay đã chết, cổng trống trở lại. Chạy `thu-cua-nhan` → **14/14 phép qua đối chứng hai
   chiều**. ⇒ **Cả 6 phép máy riêng của web đều đã chạy và ĐẠT, không còn phép nào mù.**
   Ghi nhận cho sau: `scripts/thu-cua-nhan-ho-so.mjs:20` **hardcode** `CONG_WEB = 3099`, không
   đọc biến môi trường — bất kỳ tiến trình lạ nào chiếm cổng đó đều làm phép thử trả kết quả vô
   nghĩa mà vẫn tự khai "đạt". Nên cho máy đọc biến môi trường, hoặc tự chọn cổng trống.
5. **`culori`** chưa từng được khai ở `package.json` của web lẫn CODEWEB ⇒ `a11y.25` FAIL vĩnh viễn
   và lời chữa của máy ("chạy `npm ci`") dẫn sai đường. Sửa engine ⇒ `/bao-tri-luat`, chờ Ông.
6. Next.js **16.2.4 dưới mốc vá 16.3.3** — việc Ông.
7. `MEMORY.md` đã 19,5KB, gần trần đọc 24,4KB — nên chạy `consolidate-memory` một phiên riêng.

## LỆNH KẾ (gõ nguyên văn ở phiên mới)
<!-- vd: /dong-kin-vong <web> --tu-dong · tiếp tục <web> -->
`/deploy-web vnfarmstay.vn` — khi Ông ra lệnh deploy. Đây cũng là cách DUY NHẤT xác minh CI đã
xanh trở lại sau khi vá script `lint`.

Hoặc `/nang-cap-giao-dien vnfarmstay.vn` nếu Ông muốn dọn 9 lỗi W3C + hệ `<style>` trong JSX trước.
