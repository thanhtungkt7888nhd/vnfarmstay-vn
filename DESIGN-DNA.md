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

## Palette (chưa chốt — chờ B3b)

Palette hiện tại (mặc định từ template):
- `--bg-deep: #0f2318` · `--bg-main: #1a3d28` · `--bg-card: #213d2e`
- `--gold: #d4a853` · `--gold-light: #e8c97a`
- `--text-primary: #faf6ef` · `--text-muted: #a8c5b0` · `--text-dim: #6b9478`

*Cần chốt qua B3b với widget màu sắc thật.*

---

## Nhịp (chưa chốt — chờ B3b)

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
