# SỔ ĐÓNG VÒNG TỰ ĐỘNG — vnfarmstay.vn — 20261005

## Kết luận: ĐẠT CÓ ĐIỀU KIỆN (chờ Ông duyệt gộp nhánh)

- Nhánh: `vong-kin/tu-dong-202610050820` (từ `main` @ 4dc141f) · bắt đầu 2026-10-05T08:20:09.265Z
- Thay đổi: 7 files changed, 108 insertions(+), 42 deletions(-) · 1 commit

## Trước → sau (check-luat --source-only)
| Chỉ số | Trước | Sau | Δ |
|---|---|---|---|
| PASS | 23 | 24 | +1 |
| WARN | 7 | 6 | -1 |
| FAIL | 1 | 1 | 0 |

## Các lô đã làm
1. bao-mat: gờ giảm tốc dùng chung cho 5 route POST (checkRateLimit) (bbadd37)

## Commit
- bbadd37 dong-kin-vong(tu-dong): bao-mat: gờ giảm tốc dùng chung cho 5 route POST (checkRateLimit)

## Việc chờ Ông (máy không được tự làm)
- CI chết 40 ngày (khoản NẶNG của phiếu) — package.json là vùng khoá của Ông, máy gác tu-dong từ chối. Vá đã KIỂM THẬT tại máy: đổi "lint": "next lint" thành "lint": "eslint src/ --ext .ts,.tsx" (Next 16 đã gỡ next lint nên nó hiểu lint là tên thư mục). Chạy thử lệnh mới: 0 lỗi, 1 cảnh báo (no-explicit-any ở src/lib/sanity.ts:46). Sửa 1 dòng này mở lại job Build đang bị skip từ 26/08.
- sec.7-ci-npm-audit WARN — workflow thiếu bước npm audit chặn HIGH/CRITICAL. .github/** là vùng khoá, máy gác từ chối. Đề xuất: thêm bước "npm audit --audit-level=high" vào .github/workflows/ci.yml sau bước cài gói. Làm cùng lúc với khoản CI ở trên cho đỡ một lần sửa.
- 9 lỗi HTML W3C (khoản NHẸ của phiếu) — NGOÀI khoa máy tự động: lỗi thuộc trụ a11y + phần nhìn, và cách vá tự nhiên (đưa CSS khỏi <style> trong body sang globals.css) chạm đúng vùng khoá **/globals.css. Hai gốc đã định vị: (1) src/features/listing/HomePage.tsx:546-548 <div> có aria-label="Lọc farmstay" mà không có role — thêm role hoặc đổi sang thẻ <section>; (2) src/features/listing/HomePage.tsx:275 khối <style> nằm trong <body> làm 3 rule .hero-waves/.hero-wave + @keyframes bị W3C báo ngoài @scope. Web còn 8 tệp khác cùng kiểu <style> trong JSX (dang-farmstay, farmstay-la-gi, tour-farmstay, ve-chung-toi, chu-farmstay, farmstay/[slug], loading.tsx) nên sửa phải tính cả hệ, không chỉ trang chủ. Gọi /nang-cap-giao-dien hoặc /bo-cuc-web.
- seo.24-dynroute-sitemap WARN — route động /danh-muc/[slug] có generateStaticParams nhưng src/app/sitemap.ts KHÔNG hề nhắc tới /danh-muc (đã grep: sitemap chỉ có /blog và /blog/[slug]). Đây là lỗ SEO THẬT thuộc khoa 4, vá được bằng 1 tệp. KHÔNG tự làm vì nằm ngoài 3 khoản Ông chốt cho vòng này (luật trần: việc phát sinh ngoài mục tiêu thì ghi sổ, không tự nhảy vào). Vòng sau hoặc /seo-toan-dien nhặt ngay.
- a11y.25-contrast FAIL — HỎNG HẠ TẦNG MÁY ĐO, không phải web sai màu. Thư viện culori KHÔNG được khai trong package.json của web lẫn của CODEWEB (đã grep 0 kết quả) nên lời chữa của máy ("chạy npm ci") không bao giờ cứu được — đã npm ci rồi vẫn thiếu. Cài culori chạm package.json (vùng khoá). Chữa đúng gốc là sửa engine check-luat hoặc khai culori ở CODEWEB ⇒ /bao-tri-luat, phải hỏi Ông.
- Next.js 16.2.4 dưới mốc vá 16.3.3 (sổ đã 41 ngày, nên kiểm lại nguồn mốc). Nâng thư viện bị luật tu-dong cấm tuyệt đối ⇒ việc của Ông.
- LỖI MÁY ĐO mới lộ ra trong vòng này (bổ sung cho phiếu kiểm thử 05/10): cổng sec.3 kê 5 route POST thiếu giới hạn tần suất, nhưng ĐỌC MÃ THẬT cho thấy 2 route công khai nhất ĐÃ CÓ gờ giảm tốc theo IP từ trước — bao-sai 10 lượt/24h và dang-farmstay 5 lượt/24h, đều trả HTTP 429 — chỉ vì đặt tên tiếng Việt (quaTran/soLanBao/soLanGui) nên máy grep checkRateLimit không thấy. Tức bẫy #4 của CHUNG.md rộng hơn mô tả hiện tại: không chỉ rateLimitResponse mà MỌI tên tự đặt đều lọt. Phiếu kiểm thử 05/10 ghi khoản này là "không phải báo oan" — ghi vậy là ĐÚNG MỘT NỬA: 3 route gsc-ping/indexnow/revalidate thật sự chưa có trần (nhưng cả 3 đều chặn bằng mật khẩu, trả 401). Đề xuất cho /bao-tri-luat: nới mẫu grep của sec.3 hoặc đổi thông điệp cổng thành "không thấy TÊN CHUẨN checkRateLimit — đọc mã trước khi kết luận".
- HỎNG HẠ TẦNG NGHIỆM THU — thiếu trình duyệt Playwright. 3 trong 6 phép máy riêng của web KHÔNG chạy được: kiem-hien-phap (cổng hiến pháp sống), thu-vong-du-khach, thu-uy-tin — cả 3 chết cùng một lỗi "Executable does not exist at .../ms-playwright/chromium_headless_shell-1234". Vá: npx playwright install (tải trình duyệt từ mạng + cài phần mềm ⇒ con KHÔNG tự chạy, luật buộc hỏi Ông). Hệ quả: vòng này KHÔNG chứng minh được cổng hiến pháp sống vẫn đạt sau khi sửa — chỉ chứng minh được phần chạy ở lúc dựng (prebuild: kiem-ho-so + kiem-hien-phap --tu-kiem 10/10 đối chứng hai chiều, đều PASS) và kiem-seo (45/45 trang sạch). Cài xong xin chạy lại đủ bộ 6 phép trước khi deploy.
- RÁC MÔI TRƯỜNG làm phép thử báo oan: cổng 3099 đang bị một next-server (v16.2.4) MỒ CÔI chiếm từ 15:22 ngày 28/09 (PID 35460 lúc đo 05/10, đã chạy 7 ngày). Máy thu-cua-nhan hardcode CONG_WEB=3099 (scripts/thu-cua-nhan-ho-so.mjs:20) nên nó dựng next dev mới ở cổng khác rồi lại đi hỏi cái máy chủ CŨ ⇒ mọi phép POST trả 404 và máy kết luận "2 phép đạt" một cách vô nghĩa. ĐÃ KIỂM RIÊNG: route không hỏng — trên bản dựng thật cổng 3017, POST /api/dang-farmstay và /api/bao-sai trả 503 (đúng, vì kênh nhận chưa mở ở máy local) và POST /api/indexnow trả 401 (đúng, chưa có mật khẩu). Con KHÔNG tự kill tiến trình (luật không tự xoá). Ông chạy: kill 35460 (kiểm lại PID bằng lsof -ti:3099) rồi npm run thu-cua-nhan mới ra kết quả thật.

## Dòng FAIL/WARN còn lại
- ⚠️  [sec.7-ci-npm-audit] 1 workflow không thấy bước npm audit chặn HIGH/CRITICAL
- ⚠️  [seo.24-dynroute-sitemap] route động có generateStaticParams nhưng sitemap.ts KHÔNG nhắc tới (nghi sót khỏi sitemap): /danh-muc/[slug] — thêm URL các trang 
- ❌ [a11y.25-contrast] HỎNG HẠ TẦNG, KHÔNG phải web sai màu: thiếu thư viện culori (đã khai trong package.json) nên không đo được tương phản. Chữa: cd vào thư mục
- ⚠️  [exp.25-score-filled] Không tìm thấy site-config.ts để kiểm
- ⚠️  [exp.26-mau-ong-chon] Không tìm thấy site-config.ts để kiểm
- ⚠️  [exp.27-mau-khop-luachon] Không tìm thấy site-config.ts để kiểm
- ⚠️  [exp.29-sodo-ong-chon] Không tìm thấy site-config.ts để kiểm

## Gộp vào nhánh chính (Ông quyết)
```
git switch main && git merge --no-ff vong-kin/tu-dong-202610050820
```
Không gộp: `git branch -D vong-kin/tu-dong-202610050820` (bỏ cả vòng).

SKILL KẾ: /kiem-thu-web (đo đủ sau build trên Mac) → /deploy-web khi Ông ra lệnh.
