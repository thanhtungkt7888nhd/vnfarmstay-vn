# HIẾN PHÁP VNFARMSTAY.VN

### ⚖️ CÓ HIỆU LỰC — Ông chốt ngày 24/08/2026

*Soạn 21/08/2026 theo lệnh Ông. Mỗi Điều rút từ Master Prompt Ông đã duyệt hướng, từ lời Ông đã
phán trong các phiên trước, hoặc từ một sự cố có thật đã trả giá — và đều ghi nguồn.*

**Đây là bản chính thức, nguồn sự thật duy nhất.** Bản ở `~/Downloads/KE-HOACH-VNFARMSTAY/` chỉ
còn là con trỏ về đây, không được sửa nữa.

**Cách sửa hiến pháp:** chỉ Ông sửa. Mỗi lần sửa ghi rõ ngày và lý do — không sửa lén, để về sau
còn truy được vì sao đổi.

**Nhật ký sửa đổi**

| Ngày | Việc | Lý do |
|---|---|---|
| 21/08/2026 | Soạn bản nháp 9 Điều | Ông ra lệnh soạn |
| 24/08/2026 | **Ông chốt — bản có hiệu lực.** Lời luật giữ NGUYÊN từng chữ. Cập nhật phần *Thi hành* dưới mỗi Điều theo số đo hôm ấy; khắc vào repo | Bản nháp mô tả hiện trạng ngày 21/08, sau đợt năm trụ + cổng hiến pháp đã sai theo hướng bi quan — chính Điều II buộc số phải đo được hôm nay |

---

Hiến pháp này cai quản **một website duy nhất: vnfarmstay.vn**.

Nó **phục tùng** theo thứ tự:
1. **HIẾN PHÁP THỜI KHÔNG** (`_pillars/01_hien_phap.md`) — khi mâu thuẫn, bên đó thắng.
2. **HIẾN PHÁP NHÀ MÁY** (`_pillars/05_hien_phap_nha_may.md`) — vnfarmstay là sản phẩm của hai nhà
   máy ấy, nên chịu luật của chúng.

Hiến pháp này **không thay thế** hai văn bản trên. Nó nói thêm điều **chỉ đúng với riêng web này** —
bởi vnfarmstay không giống bất kỳ web nào khác trong hệ: nó không bán gì của mình, không kể chuyện
của mình, mà **giữ dữ liệu của người khác và trả khách về cho họ**.

Khi Master Prompt, skill, kho luật hay một quyết định kỹ thuật mâu thuẫn nhau về web này →
**hiến pháp này phân xử**.

---

## MỤC TIÊU TỐI THƯỢNG

> **Mỗi farmstay Việt Nam — dù nhỏ đến đâu, ở xa đến đâu — đều có thể tự kể câu chuyện của mình
> với thế giới, bằng dữ liệu mà máy đọc được và người tin được.**
>
> **Và vnfarmstay không lấy của họ thứ gì để đổi lại điều đó.**

Hai vế không tách được. Vế đầu là *đích*. Vế sau là *điều kiện để đích ấy còn giá trị* — bởi mọi
sàn trung gian đều bắt đầu bằng lời hứa giúp người bán, rồi kết thúc bằng việc sở hữu khách hàng
của họ.

*Nguồn: Master Prompt mục 1 và mục 6 · tuyên ngôn "Một cây đứng riêng thì đổ. Một khu rừng thì có
tên trên bản đồ."*

---

## BẢNG THI HÀNH — điều nào có máy canh *(đo 24/08/2026)*

Theo **Điều II của Hiến Pháp Nhà Máy**: luật không khai được máy nào thi hành thì **chưa đủ tư cách
làm luật, nó là khuyến nghị**. Bảng này nói thẳng chỗ nào đã là luật, chỗ nào còn là khuyến nghị.

| Điều | Trạng thái | Máy nào canh |
|---|---|---|
| **I** — không phải sàn | ✅ có máy | `kiem-hien-phap` HP.1 soi nhãn nút · HP.2 soi schema |
| **II** — trung thực về trạng thái | 🟡 một phần | Van hồ sơ · `kiem-seo`. **Số trong lời văn vẫn là mắt Ông** |
| **III** — cộng sinh, không ký sinh | ❌ **mắt Ông** | Cố ý — xem ghi chú cuối văn bản |
| **IV** — dữ kiện truy được về nguồn | 🟡 một phần | Van bắt buộc `nguon`·`ngayDo`·`ngayRaSoat`. Cổng Dữ Kiện thuộc D4, chưa mở |
| **V** — xác minh có cấp, nói cả giới hạn | ✅ có máy | 4 cấp · `/phuong-phap-xac-minh` · huy hiệu thu hồi được (`thu-uy-tin`) |
| **VI** — không vỏ rỗng | ✅ có máy | `kiem-hien-phap` HP.3 · `thu-cua-nhan` · `thu-vong-du-khach` |
| **VII** — hình dạng dữ liệu là danh tính | ✅ có máy | Van hồ sơ 12 ca, chạy trong `prebuild` |
| **VIII** — trang chủ thuộc về chủ farm | ✅ có máy | `kiem-hien-phap` HP.4 |
| **IX** — chủ quyền dữ liệu | 🟡 một phần | Thời điểm đồng ý do máy chủ đóng dấu. Phân quyền chưa có — chưa có tài khoản |

**Lệnh chạy toàn bộ máy thi hành:**

```bash
cd Web/vnfarmstay-vn
npm run build                                 # prebuild tự chạy van hồ sơ + tự kiểm cổng hiến pháp
npx next start -p 3017 &                      # hai cổng dưới PHẢI đo trên bản dựng thật
npm run kiem-hien-phap http://localhost:3017  # 6 phép hiến pháp · 10 ca đối chứng hai chiều
npm run kiem-seo       http://localhost:3017
npm run thu-cua-nhan && npm run thu-vong-du-khach && npm run thu-uy-tin
```

---

## ĐIỀU I — TA LÀ HẠ TẦNG, KHÔNG PHẢI SÀN

vnfarmstay.vn là **hạ tầng dữ liệu**. Nó **không** nhận đặt phòng, **không** thu hoa hồng,
**không** bán tour, **không** giữ tiền của ai.

Khách đến đây để **tìm ra** một farmstay, rồi **đi thẳng** tới chủ farm. Ta là tấm bản đồ, không
phải cái cổng thu phí.

Mọi tính năng làm ta giống một sàn đặt phòng — nút "đặt phòng", giỏ hàng, thanh toán, xếp hạng sao,
ưu tiên trả tiền — đều **vi hiến**, dù đứng riêng thì nghe hợp lý đến đâu.

*Thi hành (24/08/2026): ✅ **có máy**. `scripts/kiem-hien-phap.mjs` phép **HP.1** soi nhãn của mọi
nút và liên kết trên toàn bộ trang trong sitemap, tìm từ vựng sàn ("đặt phòng", "giữ chỗ", "thanh
toán", "giỏ hàng", "mua tour"…); phép **HP.2** soi dữ liệu có cấu trúc tìm điểm đánh giá tổng hợp.
Cổng chỉ soi **nhãn nút**, KHÔNG soi văn xuôi — vì web nói "chúng tôi không nhận đặt phòng" là lời
TỪ CHỐI, đúng hiến pháp. Nhãn dài quá trần được coi là văn xuôi, không phải nút.*
*Nguồn: Master Prompt mục 1 · Ông chốt mô hình 0% hoa hồng.*

## ĐIỀU II — TRUNG THỰC VỀ TRẠNG THÁI

Thà nói **"chúng ta chưa có"** hơn là bịa cho đủ chỗ trống.

Chưa xác minh farmstay nào thì đăng số không. Khối trống thì để nó tự ẩn — **đó là hành vi đúng**,
không phải lỗi cần che.

Con số trên web phải là con số **đo được hôm nay**. Số cũ trích lại mà không đo lại là số nói dối.

*Thi hành (24/08/2026): 🟡 **một phần**. `FARMSTAYS` rỗng thì mọi khối danh sách tự ẩn · van kiểm
hồ sơ (`npm run kiem-ho-so`, 12 ca đối chứng hai chiều) chạy trong `prebuild` nên hồ sơ hỏng làm
ĐỨT BUILD · `npm run kiem-seo`.*
*⚠️ **Chỗ còn hở, giữ nguyên lời thú nhận cũ:** chưa có máy nào canh con số trong LỜI VĂN. Chính
điều này buộc Master Prompt phải nâng lên v3 ngày 24/08 — bản v2 đo ngày 21/08 nên sau năm trụ đã
sai theo hướng bi quan. Ai trích lại một con số cũ mà không đo lại là đang vi phạm Điều này.*
*Nguồn: Ông lệnh xoá 15 farmstay bịa ngày 08/08/2026 — chúng có đủ giá tiền, số sao, "127 đánh giá"
và huy hiệu "đã xác minh", toàn bộ tự chế. Và vụ tệp `llms.txt` khai "nền tảng đặt phòng hàng đầu
Việt Nam · 500+ farmstay tại 63 tỉnh" — nói dối suốt gần bốn tháng vì không cổng nào canh tệp tĩnh.*

## ĐIỀU III — CỘNG SINH, KHÔNG KÝ SINH

vnfarmstay chỉ được tồn tại nếu nó **tạo cho chủ farm nhiều hơn cái nó lấy của họ**.

Chủ farm **sở hữu** dữ liệu và khách hàng của mình. Ta chỉ **mượn quyền hiển thị**, và trả lại bằng
lượt khách tự nhiên.

Không lấy nội dung của chủ farm khi chưa có phép. Không đứng giữa họ và khách của họ.

*Thi hành (24/08/2026): ❌ **mắt Ông — và Ông chốt giữ nguyên như vậy.** Đây là Điều DUY NHẤT trong
chín Điều không có máy canh. Cố ý, không phải bỏ sót: "tạo nhiều hơn cái lấy" là phán quyết ở tầng
con người, ép một con số vào đó sẽ đẻ ra chỉ số giả — mà chỉ số giả còn hại hơn không có chỉ số,
vì nó cho phép người ta yên tâm sai.*
*Thứ máy giữ được thì đã giữ: ô đồng ý theo dõi kênh trong biểu mẫu đăng ký (Trụ B) là bằng chứng
máy lưu được, và **thời điểm đồng ý do MÁY CHỦ đóng dấu**, không tin giờ trình duyệt gửi lên.*
*Nguồn: Master Prompt mục 6 · nguyên tắc "Cho trước, nhận sau — nhưng nhận nhiều hơn cho".*

## ĐIỀU IV — MỌI DỮ KIỆN PHẢI TRUY ĐƯỢC VỀ NGUỒN

Mỗi con số, tên riêng, địa danh, ngày tháng xuất hiện trên web này phải **truy ngược được** về một
nguồn có thật, kèm ngày lấy.

Không có nguồn thì **không được đăng** — kể cả khi nó nghe rất hợp lý.

Máy viết bài không phải nguồn. **Máy là thợ diễn đạt; nguồn là dữ kiện có thật.**

Từ đó suy ra luật vàng: **số bài đăng lên không bao giờ vượt quá số dữ kiện lấy về được.**

*Thi hành (24/08/2026): 🟡 **một phần**. Mỗi hồ sơ farmstay BẮT BUỘC có `nguon` · `ngayDo` ·
`ngayRaSoat`; van chặn nếu thiếu, và mỗi trang hồ sơ có khối "Hồ sơ này dựa trên đâu" hiện ra cho
khách đọc.*
*⚠️ **Chỗ còn hở:** Cổng Dữ Kiện và dấu `[[CẦN-DỮ-KIỆN]]` vẫn CHƯA DỰNG. Cả hai thuộc việc D4
(nội dung) — **cố ý chưa mở**, vì chính Trụ D cấm làm nội dung khi chưa có hồ sơ farmstay thật.
Dựng sớm là xây nhà từ nóc.*
*Nguồn: Ông duyệt hướng "vòng kín dữ kiện" 21/08/2026 · chính sách nội dung của Google từ 3/2024.*

## ĐIỀU V — XÁC MINH CÓ CẤP, VÀ PHẢI NÓI CẢ GIỚI HẠN

Không có nhãn "đã xác minh" chung chung. Chỉ có **bốn cấp**, mỗi cấp nói rõ **bằng chứng gì đứng sau**.

Và mỗi cấp phải nói thẳng **nó KHÔNG đảm bảo điều gì**. Cấp một nghĩa là *"cơ sở tự cung cấp, ta mới
kiểm được rằng liên hệ có thật — chưa tới tận nơi"*. Nói vậy **làm tăng** độ tin, không giảm.

Nhãn phải **thu hồi được**. Hồ sơ quá hạn rà soát mà chủ farm không phản hồi thì hạ nhãn xuống.

*Thi hành (24/08/2026): ✅ **có máy, cả bốn thứ đã dựng**. Trường `capXacMinh` + `ngayRaSoat` trong
hồ sơ · trang `/phuong-phap-xac-minh` giải thích đủ 4 cấp, mỗi cấp có một khối riêng ghi "cấp này
KHÔNG bảo đảm điều gì" · huy hiệu nhúng là ảnh **sinh từ trạng thái sống** (`/api/huy-hieu/[slug]`),
không phải tệp ảnh phát cho chủ farm.*
*Máy `npm run thu-uy-tin` (27 phép) dựng lại web ba lần với ba trạng thái farm và chứng minh: hạ farm
xuống cấp 2 **hoặc** gỡ hẳn hồ sơ thì huy hiệu TẮT NGAY. Huy hiệu chỉ cấp cho cấp 3 trở lên.*
*Quy trình duyệt và rà soát 6 tháng: `docs/QUY-TRINH-DUYET-HO-SO.md`.*
*Nguồn: Master Prompt mục 7 · mô hình 4 cấp trong đề án tháng 08/2026.*

## ĐIỀU VI — KHÔNG VỎ RỖNG

**Dựng thật, hoặc không dựng.** Không có lựa chọn thứ ba.

Một nút bấm không có đích, một biểu mẫu không lưu đi đâu, một trang hứa việc web không làm được —
đều là **nói dối người dùng**, và tệ hơn việc không có nó.

Thà để trống và nói *"chưa mở"* còn hơn dựng một cái vỏ trông như đang chạy.

*Thi hành (24/08/2026): ✅ **có máy — và đúng là điều đáng dựng máy nhất, như bản nháp đã đoán**.
Phép **HP.3** chạy trên trình duyệt thật, dò ba dạng vỏ rỗng: liên kết không có đích (thiếu `href`
hoặc `href="#"`) · nút đứng NGOÀI biểu mẫu mà không ai nghe cú bấm · biểu mẫu không có nơi gửi.*
*⚠️ Miễn trừ dựa vào **VỊ TRÍ** (nút nằm trong `<form>`), KHÔNG dựa vào thuộc tính `type` — vì
`<button>` không khai `type` thì HTML mặc định là `submit`, tin vào nó là bỏ lọt mọi nút chết.*
*Cùng luật ấy áp cho cửa nhận: biểu mẫu đăng ký **chỉ hiện khi kênh nhận đã đấu dây**, và chỉ báo
thành công khi bảng tính XÁC NHẬN đã nhận (`npm run thu-cua-nhan`, 14 phép, có ca "bảng tính hỏng ⇒
KHÔNG được báo thành công").*
*Nguồn: sự cố 08/08/2026 — biểu mẫu đăng ký farmstay bấm gửi chỉ chờ 1,2 giây rồi hiện "thành công"
mà không gửi thư, không gọi máy chủ, không lưu đâu cả. Đã phải gỡ hẳn. Và tính đến 21/08/2026, nút
"Đặt phòng ngay" cùng "Liên hệ chủ farmstay" trên trang hồ sơ vẫn chưa có đích — nay đã thay bằng
nút liên hệ trực tiếp có đích thật.*

## ĐIỀU VII — HÌNH DẠNG DỮ LIỆU LÀ DANH TÍNH

Cấu trúc dữ liệu quyết định web **LÀ CÁI GÌ** — mạnh hơn mọi lời tuyên bố trên trang giới thiệu.

Một web khai mình là hạ tầng dữ liệu nhưng lưu farmstay bằng bộ trường `giá · sao · số đánh giá`
thì **nó là một sàn đặt phòng thiếu tiền**, bất kể trang giới thiệu viết gì.

Vì vậy: mỗi khi đổi định vị, **phải soi lại hình dạng dữ liệu trước**. Và mỗi trường dữ liệu phải
trả lời được câu *"trường này phục vụ điều nào trong hiến pháp?"* — không trả lời được thì nó là
di sản của một web khác, phải gỡ.

*Thi hành (24/08/2026): ✅ **có máy**. Hình dạng đã đổi xong (Trụ A): 5 nhóm trường, **0 trường kiểu
sàn**, `region` ba miền đã biến mất, thay bằng `vungSlug` nối thẳng vào 9 vùng có thật. Van kiểm hồ
sơ 12 ca chạy trong `prebuild` — hồ sơ hỏng làm ĐỨT BUILD, không lên web được.*
*⚠️ **Chỗ còn hở, giữ nguyên lời thú nhận cũ:** van bắt **thiếu** trường, chưa bắt **thừa** trường.
Chưa có máy nào canh việc "trường lạ mọc lại".*
*Nguồn: phát hiện 21/08/2026 — kiểu `Farmstay` mang `price · rating · reviewCount · badges · emoji`
của khung web sàn cũ, và `region` ba miền **đánh nhau** với chín vùng trải nghiệm mà web đang chạy;
một farmstay khai `region: "north"` không nối được vào trang vùng nào cả.*

## ĐIỀU VIII — TRANG CHỦ THUỘC VỀ CHỦ FARM

vnfarmstay **không phải** kênh quảng bá cá nhân Người khởi xướng.

Trang chủ dành cho **câu chuyện của chủ farmstay bản địa**. Phạm Thanh Tùng chỉ xuất hiện ở mục
*"Người khởi xướng"* trong trang giới thiệu, với đúng vai trò: người góp vốn mồi uy tín ban đầu.

Uy tín cá nhân được dùng để **bảo chứng cho hệ thống**, không để hệ thống trở thành bệ đỡ cho cá nhân.

*Thi hành (24/08/2026): ✅ **có máy**. Phép **HP.4** soi tên riêng Người khởi xướng trong THÂN trang
chủ — cố ý không tính thanh điều hướng và chân trang, vì hai khối đó có mặt trên mọi trang nên không
nói lên điều gì về riêng trang chủ. Đo 24/08: sạch.*
*Nguồn: Master Prompt mục 6 · đề án tháng 08/2026, rủi ro RSK-01.*

## ĐIỀU IX — CHỦ QUYỀN DỮ LIỆU VÀ RANH GIỚI PHÁP LÝ

Dữ liệu chia **bốn lớp**: công khai · thành viên · nghiệp vụ · phân tích. Mỗi lớp có người được
xem riêng và cách bảo vệ riêng.

Thu thập số điện thoại, toạ độ, thông tin cá nhân của chủ farm và khách phải theo **Nghị định
13/2023/NĐ-CP**: nói rõ thu để làm gì, cho người ta rút lại được.

vnfarmstay là **cổng dữ liệu**, không kinh doanh dịch vụ lưu trú. Trách nhiệm dân sự với khách
thuộc về cơ sở lưu trú — điều này phải ghi rõ, không được để mập mờ cho có vẻ uy tín hơn.

*Thi hành (24/08/2026): 🟡 **một phần**. Biểu mẫu đăng ký nói rõ NGAY TẠI CHỖ: thu để làm gì, dữ
liệu nào công khai, dữ liệu nào giữ riêng, và cách rút lại — kèm đường dẫn `/chinh-sach-bao-mat`.
Thời điểm đồng ý do **MÁY CHỦ** đóng dấu làm bằng chứng pháp lý. Trang `/chinh-sach-bao-mat` và
`/dieu-khoan` đã có.*
*⚠️ **Chỗ còn hở, giữ nguyên lời thú nhận cũ:** bốn lớp dữ liệu mới có trên giấy, **chưa có cơ chế
phân quyền thật** — vì chưa có hệ tài khoản.*
*Nguồn: Nghị định 13/2023/NĐ-CP · Luật Du lịch 09/2017/QH14 · đề án mục 11 và rủi ro RSK-04.*

---

## GHI CHÚ SOẠN THẢO

**Vì sao chỉ chín Điều:** cùng số với Hiến Pháp Thời Không và Hiến Pháp Nhà Máy. Điều thứ mười chỉ
được thêm khi có một loại sai lầm mới mà chín Điều này không phủ.

**Điều chưa thi hành được bằng máy — nay còn MỘT:** bản nháp 21/08 ghi bốn Điều I · III · VI · VIII
đều là cửa mắt người. Ngày 24/08 đã dựng `scripts/kiem-hien-phap.mjs`, ba Điều I · VI · VIII chuyển
sang máy. **Còn lại Điều III**, và Ông chốt giữ nguyên như vậy — lý do ghi ngay dưới Điều ấy.

**Điều đáng dựng máy nhất — đã dựng:** Điều VI, cổng dò vỏ rỗng. Bản nháp đoán đúng: cổng chạy lần
đầu đã bắt được một vi phạm thật đang sống (liên kết chân trang toàn site sang ba web anh em, trên
**cả 39 trang** — trái điều cấm tuyệt đối số 5 của Master Prompt).

**Cố ý không ghi con số nào vào hiến pháp** — số farmstay, số trang, số cổng. Theo Điều V của Hiến
Pháp Nhà Máy: chép số vào văn bản là để nó tự lệch. Muốn biết số thì chạy máy đo. *(Ngoại lệ duy
nhất: bảng THI HÀNH ở đầu văn bản có ghi ngày đo — vì bảng ấy mô tả trạng thái máy móc, không phải
lời luật, và nó BẮT BUỘC phải ghi ngày để người đọc biết có nên đo lại không.)*

**Ba văn bản đi kèm, đọc cùng hiến pháp:**
- `~/Downloads/KE-HOACH-VNFARMSTAY/MASTER-PROMPT-VNFARMSTAY.md` v3 — mô tả đầy đủ, diễn giải hiến
  pháp thành việc cụ thể
- `docs/NAM-TRU-DONG-SO-20260824.md` — hồ sơ bàn giao năm trụ, bảng toàn cảnh, việc còn chặn
- `docs/QUY-TRINH-DUYET-HO-SO.md` — 5 bước duyệt hồ sơ chủ farm gửi lên
