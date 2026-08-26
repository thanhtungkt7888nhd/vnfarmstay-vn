# PHIẾU HỒ SƠ FARMSTAY — chờ Ông cấp dữ kiện

> Dựng 26/08/2026 sau khi Ông ra lệnh *"nối các web đã deploy lên vnfarmstay.vn"*.
> Ông điền vào phiếu này → con đổ thẳng vào `FARMSTAYS` → van kiểm chạy → lên web.

---

## Vì sao con KHÔNG tự đổ được

Con đã dò dữ liệu **công khai** của 8 web đang sống. Kết luận: **không web nào đủ 9 trường bắt buộc.**

| Trường bắt buộc | Lấy được từ web công khai? |
|---|---|
| `ten` · `tinh` · `diaChi` | 🟡 một phần — có trong schema vài web |
| `toaDo` | 🟡 chỉ catfarm.vn và queli.vn có |
| `lienHe` (≥2 kênh) | 🟡 có Zalo/điện thoại, **nhưng phép dò của con ra số rác — không dùng được** |
| `vungSlug` (1 trong 9 vùng) | ❌ phải suy từ tỉnh — suy là **đoán**, cấm |
| `cauChuyen` ngôi thứ nhất | ❌ không web nào có sẵn đúng dạng |
| `lichMuaVu` theo 4 mùa, cụ thể | ❌ không có |
| `ungXu` tại chỗ | ❌ không có |
| `anh` thực địa | ❌ có ảnh, **nhưng dùng ảnh của họ cần PHÉP** — Điều III |
| `capXacMinh` | ❌ **chỉ Ông xác nhận được** |

Ba luật chặn con tự làm:

- **Điều III** — *"Không lấy nội dung của chủ farm khi chưa có phép."*
- **Điều cấm 8** — *"Cấm đưa farmstay lên khi chưa qua xác minh cấp 1"*, mà cấp 1 buộc phải
  **gọi thử số điện thoại**. Con không gọi điện được.
- **Điều IV / luật vàng** — *số bài ≤ số dữ kiện lấy về được*. Bịa cho đủ chỗ trống là vi hiến.

---

## ⚠️ Trước hết: web nào là FARMSTAY, web nào không

Con dò schema thấy có web **không phải farmstay**:

| Web | Dấu hiệu | Là farmstay? |
|---|---|---|
| catfarm.vn | `TouristAttraction` · `LocalBusiness` · toạ độ · giờ mở cửa | ✅ nhiều khả năng |
| defarm.com.vn | `Organization` · địa chỉ | 🟡 Ông xác nhận |
| queli.vn | có toạ độ + địa chỉ | 🟡 Ông xác nhận |
| sanvietfarm.vn · nongnghiepdisan.vn · dakago.vn | không có schema địa điểm | 🟡 Ông xác nhận |
| **dophuongquyen.vn** | `Person` · `CollegeOrUniversity` · `Book` · `Occupation` | ❌ **web chuyên gia cá nhân, không phải farmstay** |
| xuyenvietfarmstay.vn | web sự kiện của hệ sinh thái | ❌ đã có mặt ở `/lien-he` |

⛔ Đưa một web chuyên gia cá nhân lên vnfarmstay dưới dạng "farmstay" là **khai sai bản chất** —
trái Điều VII (hình dạng dữ liệu là danh tính).

---

## PHIẾU ĐIỀN — mỗi farm một phiếu

Chép khối dưới đây cho **từng farm** Ông muốn đưa lên, điền vào, gửi lại cho con.

```
━━━ FARM #__ ━━━
1. Tên farm (đúng đăng ký kinh doanh hoặc tên chủ farm dùng):
2. Tỉnh:
3. Địa chỉ hiển thị (xã/huyện — không cần số nhà):
4. Vùng — chọn ĐÚNG MỘT trong 9:
     vung-cao-dong-bac · tay-bac-ruong-bac-thang · cao-nguyen-moc-chau
     trung-du-che · duyen-hai-mien-trung · tay-nguyen-ca-phe
     cao-nguyen-lam-vien · nang-gio-nam-trung-bo · miet-vuon-song-nuoc
5. Toạ độ (vĩ độ, kinh độ) — lấy từ Google Maps, bấm chuột phải vào điểm:
6. Câu chuyện chủ farm — NGÔI THỨ NHẤT, giọng của chính họ, không văn mẫu:

7. Lịch mùa vụ — mùa nào có gì, CỤ THỂ (cấm "mùa nào cũng đẹp"):
     · Đầu năm (mùa hoa):
     · Giữa năm (mùa nước đổ / mùa quả):
     · Cuối hè sang thu (mùa gặt):
     · Cuối năm (mùa thu hoạch cà phê):
8. Đường đi — cách trung tâm huyện bao xa, đi bằng xe gì:
9. Ứng xử tại chỗ — điều nên và không nên:
10. Kênh liên hệ (TỐI THIỂU 2):
     · Điện thoại:
     · Zalo:
     · Web riêng:
11. Ảnh thực địa (≥1) — đường dẫn ảnh + chú thích + ai chụp.
    ⚠️ Ảnh CHỤP TẠI FARM. Cấm ảnh minh hoạ trên mạng. Cần PHÉP của chủ farm.
12. Trải nghiệm farm có (chọn nhiều):
     hai-che · mua-ca-phe · ruong-bac-thang · vuon-cay-an-trai
     chan-nuoi-va-sua · rau-hoa-on-doi
13. Nguồn dữ kiện: thuc-dia | google-business | web-farm | zalo | chu-farm-khai
14. Ngày lấy dữ kiện (YYYY-MM-DD):

━━━ HAI CÂU ÔNG PHẢI XÁC NHẬN ━━━
□ Con đã GỌI THỬ số điện thoại trên và liên hệ được  → đủ điều kiện CẤP 1
□ Chủ farm ĐÃ ĐỒNG Ý đưa hồ sơ và ảnh lên vnfarmstay.vn  → Điều III
```

---

## Sau khi Ông gửi phiếu

1. Con đổ vào `src/features/listing/data.ts`
2. `npm run kiem-ho-so` — van chặn nếu thiếu trường, nêu đích danh
3. `npm run build` → `npm run kiem-seo` + `npm run kiem-hien-phap`
4. Hồ sơ hiện trên `/farmstay/<slug>`, lên bản đồ vùng, vào sitemap
5. Gán **cấp 1** — không cấp cao hơn bằng chứng (`docs/QUY-TRINH-DUYET-HO-SO.md`)

**Chỉ cần MỘT farm đủ phiếu là vnfarmstay có hồ sơ thật đầu tiên** — con số quan trọng nhất
trong bảng đích đến của Master Prompt chuyển từ **0 → 1**.
