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

## Hiệu ứng signature (chưa chốt — chờ B3b)

---

## Hoa văn (chưa chốt — chờ B3b)

---

## Bố cục chữ (chưa chốt — chờ B3b)

---

## Mood board (chưa chốt — chờ B3c)

---

## Phạm vi (chưa duyệt — chờ B3d)

Tính năng ROADMAP (không build trong đợt này):
- Chat cộng đồng realtime + AI fallback sau 10 giây
- Hệ thống thành viên 2 vai (auth + role management)
- Cross-linking API với website riêng farmstay
- Thông báo email/app khi có câu hỏi mới
