# PHIẾU RA BAI-VIET — vnfarmstay.vn — 26/10/2026 (vòng hoàn thiện, pha 5/9)

Nhánh vong-hoan-thien/20261026. Kho "bài" của web là 10 route trang (không có kho markdown/blog; blog nằm ở Sanity/mock). Máy soi: 10 bài, đối chứng giọng 17/17 và máy soi 22/22 đạt.

## Phân nhóm (máy đề xuất, tự chọn thay Ông theo mặc định an toàn)
- KHOÁ-PHÁP-LÝ (không chạm): chinh-sach-bao-mat, chinh-sach-bien-tap, dieu-khoan; phap-ly (thư viện pháp lý, chừa theo lệnh).
- GỐC-chừa: ve-chung-toi, ve-tac-gia (title/meta ve-chung-toi vẫn 61/174: để nguyên).
- KHÔNG CHẮC (mặc định không nâng): dang-farmstay (title 61, lệch 1 ký tự), phuong-phap-xac-minh.
- THƯỜNG-nâng đã làm: chu-farmstay, farmstay-la-gi, tour-farmstay; thêm trang chức năng chỉ sửa meta: blog, cong-dong, lien-he, nguoi-kien-tao, tim-kiem.

## Việc đã làm (chỉ chữ có sẵn trong web, không số/địa danh/người mới)
| Trang | Việc | Trước → sau |
|---|---|---|
| blog | meta mô tả thêm "dành cho chủ farmstay và du khách" | 106 → 141 ký tự |
| cong-dong | meta mô tả viết lại đúng thực tế "chưa mở" (bản cũ hứa sự kiện); thêm 1 đoạn có 2 liên kết nội /farmstay-la-gi, /blog | 87 → 145; liên kết nội 0 → 2 |
| chu-farmstay | meta "kèm"→"có" | 161 → 160 |
| farmstay-la-gi | title + meta rút gọn; 2 câu trả lời FAQ rút còn 54 và 53 từ (giữ nguyên ý) | title 64 → 58, meta 189 → 158, FAQ 76/68 → 54/53 từ |
| lien-he | title | 23 → 50 |
| nguoi-kien-tao | meta | 161 → 155 |
| tim-kiem | meta | 61 → 120 |
| tour-farmstay | meta | 188 → 149 |

## Đo (cùng điều kiện `wf cham --day-du`, 142 cổng)
- Nền: 92 PASS · 47 WARN · 3 FAIL. Sau: bản dựng (snapshot) 93 · 46 · 3; GỘP vẫn 92 · 47 · 3 vì mặt "thật" đo trên tên miền chạy bản deploy 05/10 (aeo.12 vẫn WARN ở đó). Cần deploy (việc Ông) mới thấy cải thiện ở bản thật.
- seo.30: 5 → 3 trang ngoài khoảng (còn dang-farmstay 61, trang chủ 61, ve-chung-toi 61). seo.31: 11 → 4 (còn pháp lý x2, trang chủ 164, ve-chung-toi 174). seo.36: 2 → 1 (còn phap-ly). aeo.12 bản dựng PASS.
- `npx tsc --noEmit` sạch, `npm run build` thành công. Chưa chụp màn hình đoạn thêm ở cong-dong (không mở dev server theo lệnh); cổng: mắt-Ông.

## Quyết định thay Ông (3)
1. Nhóm KHÔNG CHẮC (dang-farmstay, phuong-phap-xac-minh) · giữ mặc định không nâng · tránh sửa trang giọng lệch · lùi: không cần.
2. Sửa meta của trang chức năng (blog, cong-dong, lien-he, tim-kiem, nguoi-kien-tao) ngoài 3 bài THƯỜNG · cùng loại việc on-page meta, không đổi slug/canonical · lùi: git revert commit.
3. Rút gọn chữ trong meta/FAQ khi vượt khoảng (có xoá vài từ, ý giữ) · bắt buộc để vào 40-60 từ/120-160 ký tự · lùi: git revert.

## Chờ Ông (3)
- Liên kết nội phap-ly (1) và meta chinh-sach-bao-mat/phap-ly: trang pháp lý, chừa.
- Đơn đặt bài cụm 2 bài (DON-DAT-BAI-CUM-20260819): chưa duyệt, không viết.
- Meta trang chủ (164) và title/meta ve-chung-toi (gốc): thuộc SEO cấp web / bài gốc. Việc DON-SEO còn lại (sameAs ngược, @id Person, liên kết sang web cùng cụm, anchor lặp) thuộc /seo-toan-dien, không nhận.

SKILL KẾ: /kiem-thu-web — đo lại cổng on-page sau pha bài viết; deploy mới làm aeo.12 thật hết WARN.
