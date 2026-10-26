# BÁO CÁO GIAO DIỆN — vnfarmstay.vn — 26/10/2026 (pha 6/9 vòng hoàn thiện)

MỤC TIÊU: xử 5 việc giao diện từ phiếu nền, không đổi DNA. ĐIỀU KIỆN XONG: seo.47 và aes.41 PASS trên snapshot, 0 `<style>` trong thân, tsc 0, build qua. TRẦN: không chạy đủ 5 vòng × 10 loại (xem "Phạm vi").

## Phạm vi và vì sao không chạy 5 vòng
Việc Ông giao là 5 mục cụ thể, đều là lỗi đã có máy chỉ đích danh. Không có căn cứ máy cho 10 loại còn lại ở pha này (nền: mọi cổng mà/ảnh/hiệu ứng khác không FAIL). Vòng quét 10 loại × 5 mức, B0b mở kho, taste classics: BỎ, chưa chạy; bằng chứng cần thiết là phiếu nền 26/10 không nêu lỗi thẩm mỹ nào khác. Giao `/bo-cuc-web` và `/lam-giau-hieu-ung` (đã gợi ở phiếu nền: layout.18/20/23, ux.18, mot.1).

## Kết quả
| # | Việc | Kết quả | Chứng cứ |
|---|---|---|---|
| 1 | seo.47 | ĐÃ SỬA | Thử trên bản build: loading.tsx trả `null` vẫn còn khối ẩn `S:0` (mọi trang). Gỡ hẳn thì hết, riêng /blog còn do `blog/loading.tsx`. Đổi tên 3 tệp loading.tsx (gốc, blog, farmstay/[slug]) thành `khung-cho*.tsx` (nội dung giữ nguyên). Đếm khối ẩn trên 44 URL sitemap: 0. Snapshot 20 route: seo.47 PASS |
| 2 | W3C trang chủ | ĐÃ SỬA (chờ đo lại trên domain thật sau deploy) | 7 khối `<style>` trong thân (trang chủ + 6 trang) chuyển vào `globals.css`; `aria-label` trên div không role vốn là div loading gốc, đã hết cùng #1. Còn 1 `<style>` trong tệp khung-cho của farmstay/[slug] (không còn là route). Kiểm DOM: 0 `<style>` trong thân ở 6 trang; lưới 2 cột ở 768px đúng media cũ |
| 3 | aria-hidden-focus | ĐÃ SỬA (chờ Lighthouse thật) | Menu mobile `aria-hidden` khi đóng nhưng link còn focus được: thêm `inert={!open}` ở Navbar. Kiểm trình duyệt: menu đóng `inert=true` |
| 4 | aes.41 | ĐÃ SỬA | Kicker /tuyen "Một hành trình không chỉ có một điểm dừng" (41) → "Hành trình không chỉ một điểm dừng" (34). Snapshot PASS |
| 5 | mot.9 | CHỜ ÔNG | DESIGN-DNA.md thiếu dòng "Hiệu ứng đã chọn:". DNA là vùng Ông, không sửa. Gợi ý nội dung: I5 Metallic Shine + I6 Plasma Blobs (đã chốt 20260807) |

## Số máy (`wf cham --day-du`, snapshot ① trên bản build mới)
PASS/WARN/FAIL: 92/47/3 → 94/46/2. 2 FAIL còn lại là báo oan đã loại ở phiếu nền (a11y.25 thiếu culori; content.41 số Ông cấp). Cột ② (domain thật) vẫn là bản deploy 05/10 nên vẫn đỏ seo.47 và aes.41 cho tới khi Ông deploy.

## Quyết định thay Ông
1. Đổi tên (không xoá) 3 tệp loading.tsx → bỏ khung chờ khi chuyển trang. Lý do: không cách nào giữ loading.tsx mà `<main>` ra HTML máy chủ (đã thử bản null). Lùi: `git mv` ngược lại.
2. Gom CSS 7 khối `<style>` vào globals.css (tăng ~2KB CSS toàn site, đổi lại hợp lệ W3C). Lùi: revert commit 36dc203.
3. Rút kicker /tuyen 7 ký tự (microcopy, không đổi nghĩa).

## Chưa chấm được
Bố cục ở khổ rộng thật: cửa sổ Chrome chỉ mở được 768px và ảnh chụp màn hình hết thời gian chờ. CHƯA chấm được bố cục khổ rộng. Phần đổi chỉ chuyển CSS nguyên văn nên computed style khớp, nhưng chưa có ảnh. Lighthouse, W3C trên domain thật: đo lại sau deploy (pha 9).

## Chờ Ông
1. Dòng "Hiệu ứng đã chọn:" cho DESIGN-DNA.md (mot.9).

SKILL KẾ: /bo-cuc-web — layout.18/20/23, ux.18; sau đó /lam-giau-hieu-ung cho mot.1 (7 chỗ easing linear, trong đó 3 là cuộn sóng hero liên tục hợp lệ).
