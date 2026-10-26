pha 1 · kiem-thu-web · DAT · PHIEU-KHOA-KIEM-THU-20261026 · 6f7906f..b7283b1 · nen 92P/47W/3F (FAIL that: seo.47)
pha 2 · bao-mat-web · BO · viec con lai vung Ong (Next 16.3.3, npm audit CI) · -
pha 5 · nang-cap-bai-viet · DAT · BAI-VIET-20261026 · ebe656b..2417129 · seo.30 5->3 trang, seo.31 11->4, aeo.12 PASS (ban dung)
pha 6 · nang-cap-giao-dien · KET (gac-pha: doi ten loading.tsx) · BAO-CAO-GIAO-DIEN-20261026 · a9b37de..33dbad5 · 92/47/3 -> 94/46/2
pha 7 · bo-cuc-web · HOAN · chua cham duoc bo cuc kho rong (Chrome 768px) · -
pha 8 · lam-giau-hieu-ung · BO · BAO-CAO-GIAO-DIEN-20261026-hieu-ung · bf205a8 · khong doi ma
pha 3,4 · nang-tc / seo · HOAN · thi truong chua khai · -
pha 9 · kiem-thu-web (sau) · DAT · PHIEU-KHOA-KIEM-THU-20261026-sau · 433399a..1e673dd · nen 92/47/3 -> GOP 91/48/3; ma moi 94/46/2

# KET LUAN VONG: CHUA-XONG
Cai thien co that (ma moi, chua deploy): seo.47 FAIL->PASS, aeo.12 WARN->PASS, aes.41 WARN->PASS, seo.30/31/36 giam trang vi pham; sitemap 45, 45/45 trang dung 1 main, 0 style trong body, kiem-seo 45/45, Lighthouse trung vi 90 (3 lan).
Hoi quy: layout.24-spacing-boi8 PASS->WARN (14px, 18px) do globals.css gom khoi style.
## Quyet dinh thay Ong
- Dung 3 loading.tsx -> khung-cho*.tsx (doi ten); gom 7 khoi style vao globals.css; rut kicker /tuyen; sua meta/title 8 trang; giu linear cua animation vo han.
## Cho Ong
- Duyet doi ten loading.tsx (gac-pha bao vi pham duong dan) - lui: git revert f12c3f2
- Khai thi truong VN/QT -> chay /seo-toan-dien (6 viec DON-SEO) va nang-tc
- Chrome kho rong de /bo-cuc-web (layout.18/20/23, ux.18) va vá layout.24
- DESIGN-DNA dong "Hieu ung da chon" (mot.9); duyet don dat bai cum 2 bai
- Nang Next 16.2.4 -> >=16.3.3 + 33 lo hong (2 critical), them npm audit vao CI (sec.7); tai Playwright chromium
- Deploy
SKILL KE: /bo-cuc-web - vá layout.24 va bo cuc sau khi mo Chrome khoi rong; /seo-toan-dien sau khi chot thi truong
