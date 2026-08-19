# NỀN SEO CỦA vnfarmstay.vn — bản đo ngày 19/08/2026

Tài liệu này ghi **hiện trạng đo được**, không ghi mong muốn. Mọi con số dưới đây lấy
từ bản dựng production chạy tại `localhost` cùng ngày, bằng cách đếm thật trên HTML
máy chủ trả về — không suy ra từ việc đọc mã.

Cách đo lại:

```bash
npm run build && npx next start -p 3117
curl -s http://localhost:3117/sitemap.xml | grep -c "<loc>"
```

---

## 1. Bộ khung kỹ thuật

| Mục | Hiện trạng |
|---|---|
| Khung (framework) | Next.js 16 App Router · React 19 · TypeScript strict |
| Kiểu dựng trang | Tĩnh (static) cho hầu hết route; ISR 1 giờ cho blog và danh mục |
| Nguồn nội dung (CMS) | Sanity — **chưa đấu dây**, `isSanityConfigured()` trả về `false` |
| Nguồn farmstay | `src/features/listing/data.ts` — **cố ý rỗng** |
| Nơi đưa lên mạng (deploy) | Vercel, vùng `sin1` |
| Chuyển hướng | `www` → không-`www`, mã 301, qua `src/middleware.ts` |

## 2. Một nguồn sự thật về thương hiệu

Từ 19/08/2026, mọi tên · mô tả · URL · logo · quan hệ hệ sinh thái · mã định danh
schema nằm trong **`src/lib/site.ts`**. Trước đó chúng bị chép cứng rải rác ở
`layout.tsx`, `seo.ts`, `schema.ts`, `sitemap.ts`, `Footer.tsx` — nên footer từng ghi
tên thương hiệu là "Farmstay.vn" trong khi toàn site là "vnfarmstay.vn".

Ba trường **cố ý để rỗng** vì chưa có dữ liệu thật được Ông xác nhận:

- `SITE_SAME_AS` — chưa có hồ sơ mạng xã hội chính thức nào.
- `SITE_CONTACT` — chưa có thư điện tử/số điện thoại đã xác nhận.
- `FARMSTAYS` — chưa có farmstay nào đã đi tới tận nơi và được xuất bản.

Rỗng ở đây **kéo theo hành vi đúng ở mọi nơi khác**: schema không khai `sameAs`,
trang `/lien-he` nói thẳng kênh đang mở, trang chủ ẩn bộ máy lọc, sitemap không có
URL farmstay nào. Đây là thiết kế có chủ đích, không phải thiếu sót.

## 3. Danh sách route và tình trạng index

| Route | Kiểu | Index | Ghi chú |
|---|---|---|---|
| `/` | tĩnh | có | `@graph`: Organization · WebSite · WebPage |
| `/ve-chung-toi` | tĩnh | có | `@graph` cùng bộ `@id` với trang chủ, AboutPage |
| `/chu-farmstay` | tĩnh | có | Cửa vào của chủ farmstay |
| `/tour-farmstay` | tĩnh | có | Bản đồ 9 vùng + lịch mùa (nội dung thật) |
| `/farmstay-la-gi` | tĩnh | có | Trang trụ cột |
| `/cong-dong` | tĩnh | có | Nói rõ "chưa mở" |
| `/lien-he` | tĩnh | có | **mới 19/08** |
| `/chinh-sach-bien-tap` | tĩnh | có | **mới 19/08** |
| `/dang-farmstay` | tĩnh | có | Biểu mẫu giới thiệu farmstay |
| `/phap-ly` · `/dieu-khoan` · `/chinh-sach-bao-mat` · `/ve-tac-gia` | tĩnh | có | Trang pháp lý và niềm tin |
| `/blog` | tĩnh | có | Danh sách |
| `/blog/[slug]` | ISR | **tuỳ bài** | Chỉ index khi bài có thân bài thật |
| `/vung/[slug]` × 9 | tĩnh | có | **mới 19/08** — trang đích vùng đất, `dynamicParams=false` |
| `/trai-nghiem/[slug]` × 6 | tĩnh | có | **mới 19/08** — trục việc nhà nông |
| `/mua/[slug]` × 4 | tĩnh | có | **mới 19/08** — trục nhịp canh tác |
| `/tuyen/[slug]` × 3 | tĩnh | có | **mới 19/08** — trục hành trình |
| `/danh-muc/[slug]` · `/tags/[slug]` · `/tac-gia/[slug]` | ISR/động | **không** | `noindex, follow` tới khi Sanity có bài thật |
| `/tim-kiem` | động | **không** | `noindex, follow`; đã gỡ khỏi sitemap |
| `/farmstay/[slug]` | tĩnh | — | Chưa có hồ sơ nào (danh sách rỗng) |
| `/api/*` | — | không | Đã chặn trong `robots.txt` |

**Số URL trong sitemap: 38** — toàn bộ là trang tĩnh trả mã 200 và cho phép index.

## 4. Những gì đã sửa ngày 19/08/2026

1. Dựng `src/lib/site.ts` làm nguồn sự thật duy nhất; `seo.ts`, `schema.ts`,
   `layout.tsx`, `sitemap.ts`, `robots.ts`, `Footer.tsx`, trang chủ cùng đọc từ đó.
2. Footer: sửa tên thương hiệu **"Farmstay.vn" → "vnfarmstay.vn"**; gỡ **4 liên kết
   mạng xã hội rỗng `href="#"`** vốn xuất hiện trên MỌI trang; sửa mục Hệ sinh thái
   (`mastery.vn` là tên miền không đúng → `hoachdinhmastery.vn`, thêm
   `xuyenvietfarmstay.vn`); thêm lối vào `/chinh-sach-bien-tap` và `/lien-he`.
3. Trang chủ: đổi H1 và hai đoạn mở đầu để nói rõ **là gì · phục vụ ai · không phải
   gì**; thêm hai cửa vào (du khách · chủ farmstay); thêm khối "là gì / không phải gì
   / khách đặt ở đâu" lấy chữ từ cùng một nguồn với schema.
4. JSON-LD: gỡ Organization + WebSite lặp trên mọi trang; thay bằng `@graph` có `@id`
   ổn định, chỉ đặt ở trang chủ và `/ve-chung-toi`.
5. `SearchAction` chỉ khai khi danh bạ có dữ liệu — trước đó hứa với Google một chức
   năng tìm kiếm luôn trả về không kết quả.
6. `LodgingBusiness` không còn nhận `rating`/`reviewCount`: vnfarmstay.vn không có
   quy trình chấm sao nên không có quyền khai `AggregateRating`.
7. `/tim-kiem` chuyển sang `noindex, follow` và gỡ khỏi sitemap. **Cố ý KHÔNG** chặn
   thêm trong `robots.txt` — chặn thu thập thì máy không đọc được thẻ `noindex`.
8. Sáu bài mẫu trong `MOCK_POSTS` không có thân bài: nay `noindex`, không phát
   `Article`/`FAQPage`, và đã gỡ khỏi sitemap. **Chưa xoá** — chờ Ông quyết.
9. Ba nhóm trang tập hợp (danh mục · thẻ · tác giả) `noindex, follow` tới khi có bài
   thật; tự index lại khi Sanity đấu dây, không phải sửa tay.
10. Loại Open Graph mặc định `website` thay vì `article` cho mọi trang.

## 4b. Đợt hai cùng ngày 19/08/2026

11. **Vá lỗi bố cục toàn site.** `globals.css` khai bộ reset `* { margin:0; padding:0 }`
    NGOÀI `@layer`. Luật xếp tầng CSS: style không thuộc lớp nào luôn thắng style trong
    `@layer` — mà Tailwind v4 để toàn bộ tiện ích trong `@layer utilities`. Hậu quả đo
    được: `px-6` cho `padding: 0px`, `mx-auto` không căn giữa được. Nghĩa là MỌI tiện ích
    khoảng cách chết trên toàn site từ ngày dựng web. Đã bọc reset vào `@layer base`.
12. **Mô hình dữ liệu 9 vùng** tách khỏi `/tour-farmstay` ra `src/features/vung/data.ts`;
    mỗi vùng thêm `slug`, `tomTat`, `cachDi`, `ungXu`. Sinh 9 trang `/vung/[slug]`.
13. **Chặn 404 mềm** ở `/vung/[slug]` và `/farmstay/[slug]` bằng `dynamicParams = false` —
    trước đó đường dẫn bịa trả mã **200**, `notFound()` một mình không đủ.
14. **Trang chủ** thêm 4 khối: khám phá theo vùng · lịch mùa cả năm · đi theo tuyến ·
    cửa vào chủ farmstay. Nay có 1 h1 và 6 h2, dẫn thẳng tới cả 9 trang vùng.
15. **Máy kiểm `scripts/kiem-seo.mjs`** — 11 phép, mỗi phép qua đối chứng hai chiều
    (mẫu đã biết đúng + mẫu đã biết sai) trước khi được phép báo số. Chạy:
    `npm run kiem-seo -- http://localhost:3117`. Nó đã bắt được: 404 mềm ở `/farmstay`,
    6 trang thiếu JSON-LD, 4 tiêu đề quá dài, 2 landmark `<main>` ở `/blog`,
    thứ bậc tiêu đề nhảy cấp ở chân trang · `/blog` · `/phap-ly`.
16. **Đo lường** gom về một cửa `src/lib/do-luong.ts` + bộ lắng nghe uỷ nhiệm
    `TheoDoiSuKien.tsx`: trang vẫn dựng ở máy chủ, chỉ gắn nhãn `data-su-kien`.
    Có hàng đợi cứu sự kiện bắn trước khi `gtag` kịp nạp (giới hạn 20 sự kiện / 15 giây).
17. **Khả năng tiếp cận** đo trên trình duyệt thật: 0 vùng chạm dưới 44px (trừ liên kết
    nội dòng — WCAG miễn trừ), 1 `<main>`/1 `<nav>`/1 `<footer>`, 0 ảnh thiếu `alt`,
    0 nhảy cấp tiêu đề, CLS = 0, không tràn ngang ở khổ 390px.

**Số đo hiệu năng một trang vùng** (bản dựng production, máy nội bộ): tổng tải 63 KB ·
11 tệp JavaScript · DOM sẵn sàng 95 ms · CLS 0.

## 4c. Đợt ba cùng ngày 19/08/2026 — trọn bốn trục khám phá

18. **Ba trục còn lại** dựng trên `src/features/kham-pha/data.ts`: 6 trang trải nghiệm,
    4 trang mùa, 3 tuyến hành trình. Mỗi trang có đoạn mở đầu riêng, việc làm được,
    điều nên biết trước khi đi — không phải lưới thẻ đổi tên tiêu đề.
19. **Van chống trang mỏng** `kiemTraDuDay()`: một trang đích chỉ được sinh ra khi gom
    được ≥2 vùng thật và mọi slug vùng nó khai đều tồn tại. Đã qua đối chứng ba chiều
    (mẫu đúng · mẫu khai slug bịa · mẫu chỉ gom 1 vùng).
20. **Mạng liên kết hai chiều** qua khối dùng chung `KhamPhaTiep`. Mỗi liên kết BẮT BUỘC
    kèm lý do nối, và lý do phải CỤ THỂ tới từng mục — bản đầu dùng chung một câu
    "làm được ở ít nhất một điểm dừng" cho cả bốn thẻ, đã sửa thành nêu đích danh chặng.
21. **Trang chủ** thay ví dụ tuyến cứng bằng ba tuyến thật, và nối lịch mùa sang 4 trang mùa.
22. **Phép kiểm thứ 12 — chống trang mồ côi.** `check-orphans.mjs` bỏ qua mọi route động,
    nên 13 trang sinh từ dữ liệu không được máy nào canh. Phép mới bắt lỗi thật ngay lần
    chạy đầu: `/phap-ly` nằm trong sitemap mà không trang nào trỏ tới — đã nối vào chân trang.

**Số đo trang mùa** (bản dựng production, máy nội bộ): tổng tải 64 KB · 11 tệp JavaScript ·
DOM sẵn sàng 94 ms · LCP 132 ms · CLS 0 · 0 ảnh thiếu `alt` · 0 nhảy cấp tiêu đề ·
0 vùng chạm dưới 44px · đúng 1 `<main>`.

## 4d. Đợt bốn cùng ngày 19/08/2026

23. **Ba trang tổng** `/trai-nghiem` · `/mua` · `/tuyen` — cấp cha thật của ba trục.
    Trước đó breadcrumb của trang con phải mượn tạm `/tour-farmstay`.
24. **Ảnh mạng xã hội riêng theo trang.** 22 trang trục trước đó dùng CHUNG đúng một
    ảnh ghi "vnfarmstay.vn — Hạ tầng chung…": chia sẻ trang nào cũng ra một tấm giống
    hệt. Nay **26 ảnh khác nhau** trên 38 trang.
25. **Máy sinh ảnh vẫn ghi sai tên "Farmstay.vn".** Chân trang đã sửa từ đợt một nhưng
    `/api/og` bị bỏ sót — nghĩa là MỌI lần chia sẻ lên mạng xã hội đều phát ra tên sai.
    Chỉ lộ ra khi MỞ TẤM ẢNH SINH RA MÀ NHÌN; đọc mã không thấy.
26. **`llms.txt` sinh bằng máy.** Bản viết tay 01/05/2026 nằm im gần bốn tháng và khai
    với các trợ lý AI: *"nền tảng ĐẶT PHÒNG hàng đầu Việt Nam"*, *"500+ farmstay được
    xác minh tại 63 tỉnh thành"* — đúng những tuyên bố Ông đã cho gỡ khỏi web từ 08/08.
    Không cổng nào canh vì nó là tệp tĩnh trong `/public`. Nay sinh từ `site.ts` +
    dữ liệu vùng/khám phá qua `npm run sinh-llms`, tự chạy trong `prebuild`.
27. **Phép kiểm thứ 13** canh `llms.txt` không chứa bốn cụm cấm ("nền tảng đặt phòng",
    "500+", "63 tỉnh", "hàng đầu"). Qua đối chứng hai chiều: bắt đủ 4/4 ở mẫu đã biết
    sai, im lặng ở mẫu đã biết đúng.

## 5. Rủi ro còn lại và việc đang chờ dữ liệu

| Việc | Chờ gì |
|---|---|
| Danh bạ farmstay | Hồ sơ farmstay thật đã đi tới tận nơi |
| Sáu bài mẫu trong `/blog` | Ông quyết: xoá hẳn, hay thay bằng bài thật |
| `sameAs` của Organization | URL mạng xã hội chính thức do Ông xác nhận |
| Kênh liên hệ | Thư điện tử hoặc số điện thoại thật |
| Trang chủ đề · mùa · tuyến riêng | Nội dung biên tập riêng (9 trang vùng đã xong) |
| Sự kiện `join_form_submit` | Chưa có biểu mẫu nào — `/dang-farmstay` cố ý không dựng form khi chưa có đường nhận thật |
| Sự kiện hồ sơ farmstay (xem hồ sơ · bấm liên hệ · bấm đặt phòng) | Chờ có hồ sơ farmstay thật |
| Trang phương pháp xác minh | Quy trình xác minh có thật, có tiêu chí và chu kỳ |
| Ảnh bìa bài viết | Ảnh gốc có nguồn/giấy phép |

## 6. Không đổi URL nào

Đợt này **không đổi, không xoá, không gộp URL nào**, nên không cần chuyển hướng mới.
Đường dẫn được THÊM: `/lien-he`, `/chinh-sach-bien-tap`, và 9 trang `/vung/[slug]`.
Không đường dẫn nào bị đổi hay gỡ.
