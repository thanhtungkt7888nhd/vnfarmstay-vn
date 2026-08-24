# NĂM TRỤ VNFARMSTAY — ĐÓNG SỔ 24/08/2026

> Hồ sơ bàn giao. Phiên mới đọc file này là thi công tiếp được ngay, không cần bối cảnh chat.
> Kế hoạch gốc: `~/Downloads/KE-HOACH-VNFARMSTAY/` (hiến pháp · Master Prompt · 5 file trụ).

---

## 1. NĂM COMMIT

| Trụ | Commit | Nội dung |
|---|---|---|
| 0 | `a4535e0` | Gỡ cửa `api/webhook` không khoá · trần độ dài `api/og` · ghi dấu nút đặt phòng |
| A | `aed46fb` | Hình dạng dữ liệu: kiểu sàn OTA → hạ tầng dữ liệu · van kiểm hồ sơ vào `prebuild` |
| B | `6b803f0` | Cửa nhận hồ sơ chủ farm: biểu mẫu thật + bảng tính + chuông Telegram |
| C | `c981ce4` | Nối bản đồ mồ côi · nút liên hệ có đích · đo click bắn thật |
| D | `9562cf5` | `/phuong-phap-xac-minh` · nút báo sai · huy hiệu nhúng **thu hồi được** |
| — | `e621cf1` | Hồ sơ bàn giao này |
| **+** | `f2f9621` | **Cổng hiến pháp** — máy thi hành cho Điều I/VI/VIII + 3 điều cấm; gỡ link chân trang toàn site |

**CHƯA DEPLOY.** Toàn bộ nằm ở máy, chờ lệnh Ông.

### Đợt bổ sung 24/08 — cổng hiến pháp (`f2f9621`)

Master Prompt v2 §4 tự khai **bốn Điều I · III · VI · VIII chưa có máy thi hành**, và hiến pháp
ghi dưới Điều VI: *"đây là điều đáng dựng máy nhất trong cả hiến pháp này"*. Đã dựng
`scripts/kiem-hien-phap.mjs` — 6 phép, quét 39 trang bằng trình duyệt thật, tự kiểm 10 ca đối
chứng hai chiều trước khi đo. Điều có máy canh: **5/9 → 7/9** (Điều III vẫn là mắt Ông).

**Bắt được một vi phạm THẬT đang sống:** `Footer.tsx` rải liên kết sang 3 web anh em ở chân trang
**cả 39 trang** — đúng điều cấm tuyệt đối số 5. Đã gỡ; hệ sinh thái vẫn được giới thiệu **theo
ngữ cảnh** ở `/lien-he`, nơi mỗi web kèm một câu nói rõ vai trò.

**Hai lỗ hổng trong chính cổng, bắt được nhờ soi lại:**
- Báo oan `/blog`: thẻ bài viết bọc trong `<a>` nên tên khả truy cập chứa chữ "đặt phòng". Sửa
  bằng **cách nhận biết** (nhãn CTA thì ngắn, văn xuôi thì dài), không bằng nới cổng — và ca
  chống-báo-oan này có ca đối chứng đi kèm để không ai nới trần cho qua.
- Bỏ lọt: `<button>` không khai `type` thì HTML mặc định là `submit`, nên bản đầu bỏ qua **mọi**
  nút không khai `type`, kể cả nút chết. Sửa: chỉ miễn nút **nằm trong biểu mẫu**.

---

## 2. BẢNG TOÀN CẢNH — đo ngày 24/08/2026

| Master Prompt mô tả | Trước (21/08) | Đo được hôm nay | Đạt? |
|---|---|---|---|
| Hạ tầng dữ liệu có cấu trúc máy đọc được | dữ liệu kiểu sàn OTA | 5 nhóm trường, 0 trường kiểu sàn còn lại; schema có `@id` cố định + toạ độ | ✅ |
| Bản đồ điểm đến 9 vùng theo mùa vụ | bản đồ mồ côi, 0 nơi gọi | nối vào `/vung/[slug]` + `/farmstay/[slug]`, lười tải, tự ẩn khi vùng trống | ✅ |
| Cổng dẫn khách về chủ farm | nút không có đích | nút `tel:` · Zalo · web riêng (tab mới + `noopener`) | ✅ |
| Hộ chiếu số 4 cấp xác minh | không có quy trình | `/phuong-phap-xac-minh` giải thích 4 cấp + **giới hạn từng cấp** | ✅ |
| Chủ farm sở hữu dữ liệu, tự cập nhật | không có cửa vào | có cửa nhận hồ sơ; **tự cập nhật thì CHƯA** (chưa có tài khoản) | 🟡 |
| 0% hoa hồng, không nhận đặt phòng | còn nút "Đặt phòng ngay" | gỡ trọn bộ máy đặt phòng, kể cả "Phí dịch vụ 12%" | ✅ |
| Tiếng nói chung của ngành | chưa có báo cáo | vẫn chưa — cần dữ liệu thật trước | ❌ |

### Số đo cụ thể

| Đo cái gì | 21/08 | 24/08 |
|---|---|---|
| Đường vào máy chủ thiếu khoá | 1 | **0** |
| Nút hứa việc web không làm | có | **không còn** |
| Hồ sơ farmstay thật | 0 | **0** *(chờ Ông mở kênh nhận — xem mục 3)* |
| Chủ farm gửi hồ sơ tới được | không | **có, đường ống chạy thật** |
| Kênh liên hệ trên mỗi hồ sơ | không | **van chặn dưới 2 kênh** |
| Click liên hệ đo được | chưa bắn lần nào | **bắn thật, đo được** |
| Bản đồ điểm đến | mồ côi | **hiện trên 2 loại trang** |
| Trang phương pháp xác minh | không có | **có** |
| Hai hệ phân vùng | mâu thuẫn | **thống nhất 9 vùng** |
| Đường dẫn trong sitemap | 38 | **39** |

---

## 3. ⛔ CHẶN — hai khoá chỉ Ông cấp được

Cửa nhận hồ sơ **đã dựng xong và chạy thật**, nhưng chưa mở vì thiếu nơi nhận.

| Biến | Lấy ở đâu | Thiếu thì sao |
|---|---|---|
| `VNFARMSTAY_SHEET_URL` | Google Sheets › Tiện ích mở rộng › Apps Script › Triển khai ứng dụng web › URL `/exec` | Biểu mẫu **không hiện**, `/api/dang-farmstay` trả 503. Trang tự nói "kênh nhận chưa mở" |
| `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` | @BotFather · `getUpdates` | Hồ sơ **vẫn vào bảng tính**, chỉ là không ai được báo |

Khai ở **cả `.env.local` lẫn Vercel**, rồi **deploy lại** (trạng thái đọc lúc dựng).
⛔ Bảng tính phải RIÊNG của vnfarmstay — cấm dùng chung với web khác trong nhà.

**Sau khi khai xong:** chạy `npm run thu-cua-nhan` rồi gửi thử **một** hồ sơ thật và **mở bảng tính ra nhìn**. Trần 5 lượt/máy/24 giờ — đừng thử nhiều lần kẻo tự khoá.

---

## 4. BỐN MÁY ĐO — chạy khi đụng vào phần tương ứng

```bash
npm run kiem-ho-so                            # van hồ sơ · 12 ca (tự chạy trong prebuild)
npm run kiem-seo       http://localhost:3017  # 13 phép · 39 trang
npm run kiem-hien-phap http://localhost:3017  # 6 phép hiến pháp · 39 trang · 10 ca tự kiểm
npm run thu-cua-nhan                          # cửa nhận hồ sơ · 14 phép
npm run thu-vong-du-khach                     # vòng du khách · 33 phép, trình duyệt thật
npm run thu-uy-tin                            # xác minh + huy hiệu thu hồi · 27 phép
```

⚠️ `kiem-seo` và `kiem-hien-phap` **phải đo trên `next start`**, không đo trên `npm run dev` —
bản dev trả 404 mềm, cho kết quả báo oan.

Cả năm máy đều đã qua **đối chứng hai chiều**: gỡ đúng cái vá → máy báo đỏ lại.

⚠️ `thu-vong-du-khach` và `thu-uy-tin` **mượn tạm** hồ sơ đối chứng rồi hoàn nguyên qua `finally`.
Mẫu nằm ở `scripts/doi-chung-ho-so.ts` — **ngoài `src/`** để Next.js không có đường gói vào trang.

---

## 5. BỐN LỖI THẬT BẮT ĐƯỢC TRONG ĐỢT NÀY

1. **Van `kiemTraDuDay()` mồ côi** — ba nơi ghi chú là "canh" mà không nơi nào GỌI. Nay nối vào `prebuild`.
2. **`api/og` không có trần độ dài** — ai cũng truyền chữ hàng vạn ký tự để đốt tài nguyên dựng ảnh.
3. **10/11 thẻ lọc trang chủ là nút trang trí** — bấm không đổi gì; thẻ duy nhất đấu dây lại lọc theo `badges` đã bị bỏ.
4. **Khung xương lúc chờ tràn ngang trên điện thoại** — `farmstay/[slug]/loading.tsx` khai `1fr 340px` mà thiếu ngắt khổ ⇒ trang trượt ngang 412px trên máy 375px. Lỗi sống trong khoảnh khắc nên mọi phép đo trang-đã-xong đều mù.

Thêm hai lỗi của chính máy đo, đều cùng gốc: **`innerText` không tự chờ như `locator`**, đọc ngay sau `load` là đọc trúng lúc khung xương còn hiện ⇒ báo oan "trang thiếu chữ".

---

## 6. CÒN LẠI — chưa làm, có lý do

| Việc | Vì sao chưa |
|---|---|
| **D4 — nội dung** | Chính Trụ D CẤM: "chỉ làm khi đã có hồ sơ farmstay thật". Kho đang 0 hồ sơ. Mở `PHU-LUC-NOI-DUNG/` sau |
| `SITE_CONTACT` của chính web | Ông chưa cấp thư/điện thoại chính thức. **Để rỗng là đúng** — khối tự ẩn, không bịa |
| Tài khoản để chủ farm **tự** cập nhật | Ngoài phạm vi 5 trụ; hiện duyệt tay theo `docs/QUY-TRINH-DUYET-HO-SO.md` |
| Báo cáo ngành · Hội đồng Tiêu chuẩn · bản tiếng Anh · hồ sơ người kiến tạo | Việc dài hơi, chính kế hoạch xếp sau bốn trụ |

---

## 7. VIỆC TIẾP THEO, ĐÚNG THỨ TỰ

1. **Ông cấp 2 khoá ở mục 3** → khai → deploy → gửi thử 1 hồ sơ → mở bảng tính nhìn.
2. Có hồ sơ thật đầu tiên → duyệt theo `docs/QUY-TRINH-DUYET-HO-SO.md` → gán **cấp 1** (không cấp cao hơn bằng chứng).
3. Có hồ sơ rồi mới mở **D4 — nội dung**, theo luật vàng: *số bài ≤ số dữ kiện lấy về được*.
