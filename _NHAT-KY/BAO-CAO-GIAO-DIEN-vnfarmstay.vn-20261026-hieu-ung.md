# BAO-CAO-GIAO-DIEN (Hiệu ứng) — vnfarmstay.vn — 20261026 — /lam-giau-hieu-ung (pha 8)

MỤC TIÊU: xử lý mot.1 (10 chỗ easing linear) và làm giàu hiệu ứng nếu có căn cứ. ĐIỀU KIỆN XONG: mỗi mục có quyết định kèm bằng chứng; tsc 0, build qua, không tụt chỉ số. TRẦN: 1 lượt.

## Đo trước (không đổi mã nên số sau = số trước)
- Hồ sơ DNA hiệu ứng: 1.53 hiệu ứng/KB CSS · framer 0/88 tệp · 30 @keyframes · 24 lớp fx-* · có hệ reveal riêng (van 1: cấm chồng hệ vào-màn thứ hai).
- Mật độ: 3/7 loại trang đạt sàn; trang_chu, bai_viet, blog_danh_sach, san_pham_dich_vu đủ 5/5.
- wf cham --source-only: 25 PASS · 6 WARN · 1 FAIL (FAIL a11y.25 là hỏng hạ tầng thiếu culori, không phải lỗi web). mot.1-linear WARN, mot.9 WARN (Chờ Ông).

## mot.1 — BỎ (không sửa)
Kê từng chỗ `linear` (loại trừ gradient): máy loại đúng 6 chỗ scroll-driven (animation-timeline: view(), linear là chuẩn). Các chỗ còn bị cờ đều là vòng lặp vô hạn chuyển động đều:
- effects.css:22 fx-rotate-gradient 8s infinite (xoay), :226 fx-gradient-wave 6s, :264 fx-god-rays-spin 40s
- globals.css:847/850/853 wave-scroll 32s/20s/14s (sóng cuộn ngang vòng lặp)
- phần còn lại trong số 10 là chuỗi chữ trong comment khớp regex.
Lý do bỏ (Emil mục 3): chuyển động liên tục không điểm đầu/cuối phải đều; ease-in/out làm khựng ở mối nối vòng lặp (thấy giật mỗi chu kỳ). Đổi sang ease là làm xấu để lấy xanh. Cổng mot.1 là WARN "chỉ hợp progress/marquee" — đây đúng loại marquee. Không có chỗ transition/animation cảm nhận được nào dùng linear sai.

## Làm giàu — BỎ
Loại trang ⛔ còn lại và lý do không dán:
- lien_he_form (thiếu A, C): máy báo "không thấy input/button trong cây trang" vì form nằm ở component riêng (van 4: dán vào block không ăn prop = số tăng, màn đứng im). Thẻ liên hệ /lien-he là khối thông tin không bấm được; hover nâng thẻ không bấm được vi phạm Emil mục 2 (chuyển động phải có mục đích). Thêm nữa fx-hover-lift dùng ::after z-index -1, chưa chấm được trên khổ rộng ở ô này (Chrome 768px) nên không dám đẩy.
- gioi_thieu_ho_so, toan_site: nghèo do phân loại trang (11 trang chưa phân loại được, `loaiTrang()` của máy) — sửa máy là việc nhà máy, không phải sửa web.
- Không dán hệ vào-màn mới: web đã có hệ reveal riêng 2 tệp (van 1).

## Nghiệm thu
tsc --noEmit: 0 lỗi · npm run build: qua · diff mã: 0 (cây sạch) · framer 0/88 giữ nguyên · hiệu ứng/KB 1.53 giữ nguyên.

## Quyết định thay Ông: 1
mot.1 · giữ nguyên các linear của vòng lặp vô hạn · vì chuyển động đều không có mối nối khựng · lùi: không có gì để lùi (không đổi mã).

## Chờ Ông: 1
mot.9 — dòng "Hiệu ứng đã chọn" trong DESIGN-DNA.md (đổi DNA là quyền Ông).

## Cần ghi cho nhà máy (không phải việc của web)
mot.1-linear nên loại trừ animation `infinite`: hiện 6/10 cờ của web này là vòng lặp vô hạn hợp lệ.

SKILL KẾ: /kiem-thu-web — đo lại tổng sau cả vòng (hiệu ứng không đổi mã ở pha này).
