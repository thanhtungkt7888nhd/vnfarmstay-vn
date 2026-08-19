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
| `/danh-muc/[slug]` · `/tags/[slug]` · `/tac-gia/[slug]` | ISR/động | **không** | `noindex, follow` tới khi Sanity có bài thật |
| `/tim-kiem` | động | **không** | `noindex, follow`; đã gỡ khỏi sitemap |
| `/farmstay/[slug]` | tĩnh | — | Chưa có hồ sơ nào (danh sách rỗng) |
| `/api/*` | — | không | Đã chặn trong `robots.txt` |

**Số URL trong sitemap: 13** — toàn bộ là trang tĩnh trả mã 200 và cho phép index.

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

## 5. Rủi ro còn lại và việc đang chờ dữ liệu

| Việc | Chờ gì |
|---|---|
| Danh bạ farmstay | Hồ sơ farmstay thật đã đi tới tận nơi |
| Sáu bài mẫu trong `/blog` | Ông quyết: xoá hẳn, hay thay bằng bài thật |
| `sameAs` của Organization | URL mạng xã hội chính thức do Ông xác nhận |
| Kênh liên hệ | Thư điện tử hoặc số điện thoại thật |
| Trang vùng · chủ đề · mùa · tuyến | Nội dung biên tập riêng cho từng vùng (P1) |
| Trang phương pháp xác minh | Quy trình xác minh có thật, có tiêu chí và chu kỳ |
| Ảnh bìa bài viết | Ảnh gốc có nguồn/giấy phép |

## 6. Không đổi URL nào

Đợt này **không đổi, không xoá, không gộp URL nào**, nên không cần chuyển hướng mới.
Hai đường dẫn duy nhất được thêm là `/lien-he` và `/chinh-sach-bien-tap`.
