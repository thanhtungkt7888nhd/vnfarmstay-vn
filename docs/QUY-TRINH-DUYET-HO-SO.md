# QUY TRÌNH DUYỆT HỒ SƠ FARMSTAY

> Dựng 24/08/2026 (Trụ B). Áp cho mọi hồ sơ chủ farm gửi qua `/dang-farmstay`.

---

## 0. Trước khi nhận được hồ sơ nào — hai khoá phải khai

Cửa nhận **không tự mở**. Chưa khai `VNFARMSTAY_SHEET_URL` thì trang `/dang-farmstay`
tự nói "kênh nhận chưa mở" và **không hiện biểu mẫu** — cố ý, để không ai điền vào hư không.

| Biến | Bắt buộc? | Thiếu thì sao |
|---|---|---|
| `VNFARMSTAY_SHEET_URL` | **Có** | Biểu mẫu không hiện; đường dẫn `/api/dang-farmstay` trả 503 |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | Không | Hồ sơ **vẫn vào bảng tính**, chỉ là không ai được báo — nhật ký máy chủ ghi cảnh báo |

Khai ở **cả hai nơi**: `.env.local` (chạy tại máy) và biến môi trường trên Vercel (web thật).
⚠️ Chạy tại máy kêu **không có nghĩa** lên web thật cũng kêu — bài học từ web khác trong nhà.
Khai xong phải **deploy lại** thì biểu mẫu mới xuất hiện (trạng thái đọc lúc dựng).

---

## 1. Năm bước duyệt

```
① Hồ sơ về bảng tính  →  chuông Telegram kêu
② Người duyệt đọc, GỌI THỬ số điện thoại — liên hệ có thật không
③ Đủ trường bắt buộc  →  gán CẤP 1
④ Chép vào src/features/listing/data.ts  →  npm run build (van tự chạy)
⑤ Thiếu trường  →  gọi hỏi chủ farm.  ⛔ TUYỆT ĐỐI KHÔNG TỰ ĐIỀN HỘ
```

### Bước ② — gọi thử là bắt buộc, không phải tuỳ chọn

Cấp 1 có tên đầy đủ là *"Thông tin do cơ sở cung cấp — **đã kiểm tra liên hệ**"*.
Chưa gọi thử thì vế sau là nói dối. Gọi không được ⇒ chưa đủ cấp 1, quay về bước ⑤.

### Bước ③ — cấp xác minh gán theo BẰNG CHỨNG, không theo lời khai

| Cấp | Chỉ được gán khi |
|---|---|
| 1 | Chủ farm tự khai + đã gọi thử liên hệ |
| 2 | **Đã gọi video** kiểm cảnh quan + đối chiếu ảnh vệ tinh |
| 3 | **Đã tới tận nơi** — có biên bản, toạ độ, ảnh của đoàn |
| 4 | **Chính quyền ghi nhận** — có văn bản UBND huyện/xã hoặc OCOP |

⛔ Hồ sơ tự khai mà gán cấp 3 là vi phạm điều cấm số 8. Không có ngoại lệ vì "farm này uy tín".

### Bước ④ — van tự chặn, không cần nhớ tay

Chép hồ sơ vào `FARMSTAYS` rồi chạy:

```bash
npm run kiem-ho-so     # hoặc để nguyên: npm run build tự chạy van này trước
```

Thiếu trường nào, van nêu **đúng tên trường** và làm **đứt build**. Không sửa được van
cho qua — sửa van là bịt mắt chính mình.

### Bước ⑤ — chỗ dễ sai nhất

Thiếu lịch mùa vụ thì **gọi hỏi**, đừng suy từ vùng ra. Thiếu ứng xử tại chỗ thì **gọi hỏi**,
đừng chép từ farm khác cùng vùng.

> Web này đã một lần tự suy tiện nghi từ thẻ phân loại — mọi farm đều được gán
> "Wifi miễn phí · Bãi đậu xe · Bữa sáng", farm gắn thẻ "Chăn nuôi" tự động có
> "Vắt sữa bò · Làm phó mát". Không farm nào xác nhận điều đó. Đã tháo ngòi 08/08/2026.

---

## 2. Rà soát định kỳ

Mỗi **6 tháng** đọc lại `ngayRaSoat` của toàn kho. Quá hạn ⇒ liên hệ chủ farm xác nhận
thông tin còn đúng không. **Nhắc 3 lần không phản hồi ⇒ hạ nhãn xác minh**, không giữ
nhãn cũ cho đẹp.

---

## 3. Kiểm cửa nhận còn sống không

```bash
node scripts/thu-cua-nhan-ho-so.mjs
```

Máy dựng bên nhận giả ngay tại máy, thử **cả hai chiều**: hồ sơ đúng phải vào được, và
— quan trọng hơn — **bảng tính hỏng thì cửa phải KHÔNG báo thành công**. Đây đúng là lỗi
đã khiến biểu mẫu cũ bị gỡ: báo thành công mà dữ liệu bốc hơi.

Chạy sau mỗi lần đụng vào `src/lib/nhan-ho-so.ts` hoặc `src/app/api/dang-farmstay/`.
Máy không đụng tới bảng tính thật, chạy bao nhiêu lần cũng được.

---

## 4. ⛔ Điều cấm

- **CẤM báo thành công khi chưa chắc dữ liệu tới nơi.**
- **CẤM tự điền hộ** trường chủ farm bỏ trống.
- **CẤM gán cấp xác minh cao hơn bằng chứng.**
- **CẤM thử biểu mẫu THẬT nhiều lần** — trần 5 lượt/máy/24 giờ, thử nhiều là tự khoá mình.
  Muốn thử thì dùng máy ở mục 3, nó chạy trên cổng riêng và bên nhận giả.
