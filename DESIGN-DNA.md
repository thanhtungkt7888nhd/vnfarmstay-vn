# DESIGN DNA — vnfarmstay.vn

## Sơ đồ Tab ✅ (chốt 20260806 — Phương án 5 Tối giản MVP)

| Mục | Route | Vai trò |
|---|---|---|
| **Farmstay** | `/` | Trang chủ listing + dẫn tới website riêng từng farmstay |
| **Câu chuyện** | `/blog` | Editorial storytelling: vùng miền, văn hoá, nông sản |
| **Cộng đồng** | `/cong-dong` | Chat hỏi đáp farmstay (realtime + AI fallback 10s — roadmap) |
| **Chủ farmstay** | `/chu-farmstay` | CTA phụ: thương hiệu cá nhân + mạng xã hội |
| **+ Đăng farmstay** | `/dang-farmstay` | CTA chính: form đăng ký kết nối hệ sinh thái |
| **Thành viên** | dropdown | 2 vai: Khách du lịch / Chủ farmstay |

**Nguyên tắc cốt lõi:** Nền tảng kết nối 2 chiều (vnfarmstay.vn ↔ website riêng farmstay), không chỉ là danh mục một chiều.

---

## Palette ✅ (chốt 20260806 — PA5 Rừng Mạ Non Dịu × Bộ IV)

**Hue chính:** 132° (blend H2 Lá Trà × H8 Mạ Non — không hẳn xanh rừng, không hẳn xanh mạ)
**Bộ cảm xúc:** IV — Trầm Sang Điện Ảnh · Chroma: 0.20
**Cảm xúc:** rừng sâu thẳm + mạ non dịu + gold ấm — trầm, sang, không gắt

| Token | Giá trị OKLCH | Vai trò |
|---|---|---|
| `--bg-deep` | `oklch(0.10 0.20 132)` | Nền sâu nhất (nav, footer) |
| `--bg-main` | `oklch(0.17 0.20 130)` | Nền trang chính |
| `--bg-card` | `oklch(0.22 0.18 130)` | Nền thẻ/card |
| `--gold` | `oklch(0.72 0.20 75)` | Accent chính — gold dịu ấm |
| `--gold-light` | `oklch(0.80 0.18 75)` | Accent sáng — hover/highlight |
| `--accent-ma` | `oklch(0.70 0.18 115)` | Accent phụ — mạ non (badge/tag) |
| `--text-primary` | `oklch(0.95 0.05 120)` | Chữ chính |
| `--text-muted` | `oklch(0.60 0.07 125)` | Chữ mờ |
| `--text-dim` | `oklch(0.40 0.07 130)` | Chữ rất mờ |

**Biến CSS gốc:** `--brand-h: 132; --brand-c: 0.20`

---

## Nhịp ✅ (chốt 20260806 — Bộ IV Trầm Sang Điện Ảnh)

| Token | Giá trị | Dùng cho |
|---|---|---|
| `--dur-fast` | `250ms` | Hover · micro-feedback |
| `--dur-base` | `450ms` | Reveal chữ · fade phần tử |
| `--dur-slow` | `720ms` | Chuyển trang · hero reveal |
| `--stagger-step` | `64ms` | Delay giữa mỗi phần tử stagger |
| `--reveal-y` | `16px` | Khoảng trượt lên khi reveal |
| `--space-section` | `clamp(72px,11vh,132px)` | Khoảng cách giữa section |
| `--ease` | `cubic-bezier(0.25, 0.46, 0.45, 0.94)` | Easing chính |

**Đặc trưng Bộ IV:** chậm nhất trong 6 Bộ — điện ảnh sâu, mỗi thứ nổi lên có chủ đích, không vội vàng.

---

## Hiệu ứng signature ✅ (chốt 20260807 — I5 + I6)

| Mã | Tên | Kỹ thuật | Dùng cho |
|---|---|---|---|
| **I5** | Metallic Shine — Kim Loại Lướt | CSS `::after` + `translateX` + `mix-blend-mode: overlay` | Logo · Headline · CTA chính (vệt sáng gold quét ngang) |
| **I6** | Plasma Blobs — Bong Bóng Huyền Ảo | CSS `::before/::after` 2 khối tròn `blur()` trôi hữu cơ | Nền section dark — sống động, gợi đêm farmstay |

**Nguyên tắc áp:** I5 áp cho MỌI headline cùng vai trò (H1 trang chủ, H1 bài viết, tên farmstay nổi bật) — không chỉ 1 chỗ. I6 áp cho section nền dark (Hero, Cộng đồng, footer CTA) — không chỉ Hero.

---

## Hoa văn ✅ (chốt 20260807 — X Nút Gold, chữ X logo)

**Nguồn:** Sáng tạo riêng từ chữ **X** trong logo vnfarmstay — không dùng mô-típ dân tộc.
**Ý nghĩa:** X = kết nối, giao thoa — ẩn dụ chính xác cho nền tảng nối farmstay ↔ du khách.

| Token | Giá trị | Ghi chú |
|---|---|---|
| `--motif-stroke` | `oklch(0.70 0.18 115)` | Nét X — màu mạ non |
| `--motif-node` | `oklch(0.72 0.20 75)` | Nút gold tại giao điểm |
| `--motif-opacity` | `0.35–0.55` | Mờ nhạt ở nền, rõ hơn ở accent |
| `--motif-size` | `28px` | Ô tile cơ bản |

**Kỹ thuật:** SVG `<pattern>` — 2 đường chéo nét mảnh (opacity 0.35) + chấm gold tại giao điểm (r=2.2, opacity 0.55). Tile đều nền section dark.
**Dùng cho:** Nền Hero · Nền section Cộng đồng · Nền footer CTA — đúng vị trí I6 Plasma Blobs (2 hiệu ứng chồng layer, không cạnh tranh).

---

## Hoa văn nền ✅ (chốt 20260808 — N1 Nền X Mờ)

**Phương án:** N1 — dùng lại đúng pattern X Nút Gold ở opacity thấp hơn nhiều, trải toàn trang.
**Nguyên tắc:** 1 ngôn ngữ xuyên suốt — hoa văn nền và hoa văn chữ ký là cùng 1 mô-típ X, chỉ khác độ mờ.

| Vị trí | Opacity | Ghi chú |
|---|---|---|
| Nền trang tổng thể (`--bg-main`) | `0.06–0.08` | Gần như vô hình, chỉ tạo chiều sâu |
| Nền card / section sáng | `0.05` | Cực nhẹ, không cạnh tranh nội dung |
| Nền section dark (Hero, CTA) | X Nút Gold đầy đủ `0.35–0.55` | Đây là hoa văn chữ ký — không phải nền |

**Kỹ thuật:** CSS `background-image: url("data:image/svg+xml,...")` với pattern SVG inline — không tải thêm file.

## Bố cục chữ ✅ (chốt 20260808 — Libre Bodoni 700 + DM Sans 400)

| Vai trò | Font | Weight | Ghi chú |
|---|---|---|---|
| Heading / Display | `Libre Bodoni` | 700 (italic tuỳ ngữ cảnh) | Didone tương phản cao — nét mảnh bắt gold |
| Body / UI | `DM Sans` | 400 | Trung tính, chuyên nghiệp, italic đẹp cho trích dẫn |
| Kicker / Label | `DM Sans` | 500 letter-spacing .12em uppercase | Phân cấp thứ bậc |

**Tính cách cặp:** Bodoni cổ điển sang trọng + DM Sans hiện đại trung tính — tương phản thời đại, không cạnh tranh nhau.
**Load strategy:** Google Fonts `display=swap`, chỉ load weight dùng thật (700 Bodoni + 400/500 DM Sans).

---

## Thẩm Mỹ Tổng Thể ✅ (chốt 20260808 — Resort Sang Trọng)

**Tinh thần:** Bodoni italic dàn trải · không gian thở nhiều · accent mạ non · ít text nhiều cảm xúc.
**Nguyên tắc bố trí:** mỗi section có 1 focal point duy nhất, không cạnh tranh; Bodoni italic xuất hiện đúng lúc — không dùng mọi chỗ; khoảng cách `--space-section` giữ đủ để mỗi block "thở".
**Không khí:** resort 5 sao × nông trại xác thực — sang mà không xa lạ, gần mà không thô.

## Mood board (chưa chốt — chờ B3c)

---

## Phạm vi (chưa duyệt — chờ B3d)

Tính năng ROADMAP (không build trong đợt này):
- Chat cộng đồng realtime + AI fallback sau 10 giây
- Hệ thống thành viên 2 vai (auth + role management)
- Cross-linking API với website riêng farmstay
- Thông báo email/app khi có câu hỏi mới
