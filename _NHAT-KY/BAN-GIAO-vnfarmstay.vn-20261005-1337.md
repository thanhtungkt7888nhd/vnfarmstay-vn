# BÀN GIAO — vnfarmstay.vn — 2026-10-05 13:37

TRẠNG THÁI: XONG 2026-10-05
Phiên tạo: d53cc8a7-de94-471b-8767-a7cb7a4ac170

## MỤC TIÊU
Kiểm thử chất lượng vnfarmstay.vn — phiếu khoá đầu tiên của web

## ĐÃ XONG
<!-- máy điền lúc 2026-10-05 13:37: git log --oneline -10 + git diff --stat HEAD — không sửa khối; tóm tắt thêm ở dưới khối -->
```text
abd101f feat: thêm check:luat cho vnfarmstay
02c522e fix(cổng hiến pháp): vá báo oan vỏ rỗng + van bắt trường lạ theo Điều VII 20260913
6f815ff merge: hồ sơ người kiến tạo + hệ sinh thái vào /cong-dong 20260903
fe5a7d4 fix(hệ sinh thái): Phần mềm Hoạch Định là hoachdinh.vn, không phải phanmemhoachdinh.vn 20260903
efcb168 feat(cộng đồng): nối 10 nơi trong hệ sinh thái vào /cong-dong theo ngữ cảnh 20260903
0a38ff2 fix(hạ tầng): khai playwright vào package.json — 4 cổng canh của web sống lại 20260903
7e461fb feat(người kiến tạo): 5 hồ sơ có dữ kiện thật thay vì chỉ lời giới thiệu 20260903
e78c7b0 chore(giọng): khắc hồ sơ giọng vnfarmstay — Ông chốt 20260828
14be9d3 feat(vnfarmstay): Người kiến tạo vào menu chính + hồ sơ Người khởi xướng, nói rõ quan hệ 20260827
e8fa526 feat(vnfarmstay): trang Người kiến tạo — 4 chuyên gia, dẫn sang web riêng theo ngữ cảnh 20260826

 1 mục chưa theo dõi (untracked)
```

## SỐ MÁY
<!-- dán NGUYÊN dòng TỔNG của `wf cham <web>` trước và sau, hoặc số đo kèm đơn vị (KB, s, %, lỗi…) -->
- Trước: (chưa từng có phiếu kiểm thử cho web này — không có số nền)
- Sau: `GỘP (mỗi cổng lấy mức TỆ hơn của ① ② + CI): 88 PASS · 50 WARN · 2 FAIL / 140 cổng` — **0 FAIL thật** sau đối chiếu mã (cả 2 là báo oan)
- Máy ngoài: Lighthouse hiệu năng **89/100** (LCP 3,2 s · CLS 0,002 · TBT 90 ms) · W3C **9 lỗi** · header bảo mật **6/6** · sitemap **45 URL**
- ③ snapshot ↔ trang thật: **138/140 khớp** · ④ CI: **5/5 lượt đỏ**

## QUYẾT ĐỊNH CỦA ÔNG (nguyên văn)
<!-- dán nguyên văn lời Ông; không có thì ghi đúng dòng: (không có quyết định mới) -->
(không có quyết định mới)

## CÒN HỞ
<!-- việc chưa xong, lỗi còn treo, việc chờ Ông -->
Skill `/kiem-thu-web` CHỈ ĐO — không sửa gì. Ba lỗi thật còn nguyên, chờ Ông quyết:

1. **CI chết 40 ngày (NẶNG)** — `npm run lint` gọi `next lint`, lệnh đã bị gỡ khỏi Next.js 16 nên
   nó hiểu `lint` là tên thư mục: `Invalid project directory provided, no such directory: …/lint`.
   Job Lint hỏng kéo theo job Build bị skip, nên 5/5 lượt gần nhất (26/08 → 17/09) đều đỏ và
   **40 ngày qua không lượt nào dựng được web**. Sửa: đổi script `lint` sang `eslint`.
2. **5 route POST không có giới hạn tần suất (VỪA)** — `bao-sai`, `dang-farmstay`, `gsc-ping`,
   `indexnow`, `revalidate`. Không có `src/lib/rate-limit.ts`, grep cả hai tên hàm đều 0 kết quả
   nên KHÔNG phải báo oan kiểu bẫy #4. `/dang-farmstay` là cửa nhận hồ sơ công khai.
3. **9 lỗi HTML W3C (NHẸ)** — `aria-label` trên `<div>` không role · `<style>` trong `<body>` ·
   rule CSS và `@keyframes` ngoài `@scope`.

Ba lỗi MÁY ĐO lộ ra (chỉ ghi phiếu, sửa engine phải hỏi Ông):
`a11y.25` khuyên chạy `npm ci` trong khi `culori` chưa từng được khai ở `package.json` ·
`content.41` coi số thật Ông cấp là số bịa · 6 cổng dò sai gốc báo thiếu tệp đang có.

Chưa đo được: tương phản màu (`a11y.25`, thiếu culori) · cân nặng trang (`green.1`, cần build) ·
mốc nội dung (`content.40`, chưa có snapshot).

## LỆNH KẾ (gõ nguyên văn ở phiên mới)
<!-- vd: /dong-kin-vong <web> --tu-dong · tiếp tục <web> -->
`/seo-toan-dien vnfarmstay.vn` — đơn SEO mạng tuần này còn 8 việc chưa làm, đứng yên so với tuần
trước; phiếu kiểm thử không tìm thấy lỗi chặn nào cản việc đó.

Muốn vá 3 lỗi thật ở trên trước thì gõ: `/dong-kin-vong vnfarmstay.vn` (khoản 1 và 2 thuộc khoa
máy của `--tu-dong`; khoản 3 chạm giao diện nên để người xem).
