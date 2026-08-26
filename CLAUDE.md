# VNFARMSTAY.VN — HƯỚNG DẪN CHO CLAUDE CODE

## ⚖️ ĐỌC TRƯỚC KHI ĐỘNG VÀO WEB NÀY — HIẾN PHÁP (Ông chốt 24/08/2026)

**`docs/HIEN-PHAP.md`** — 9 Điều, thẩm quyền cao nhất với riêng web này. Khi Master Prompt, skill,
kho luật hay một quyết định kỹ thuật mâu thuẫn nhau về web này → **hiến pháp phân xử**.

Năm câu tự vấn TRƯỚC KHI viết một dòng mã:
1. Việc này có phá Điều nào trong hiến pháp không?
2. Có phá điều nào trong **tám điều cấm tuyệt đối** (Master Prompt mục 5) không?
3. Thứ sắp dựng có **chạy thật** không, hay lại là vỏ rỗng? *(Điều VI)*
4. Con số sắp đăng có **đo được hôm nay** không? *(Điều II)*
5. Việc này làm web **gần hơn** hay **xa hơn** với "hạ tầng dữ liệu"? *(Điều I)*

Có nghi ngờ ⇒ **dừng, trình Ông.**

⚠️ **Điều III là Điều DUY NHẤT không có máy canh** — Ông chốt giữ nguyên như vậy. Bảy Điều còn lại
có máy (đủ hoặc một phần); bảng đầy đủ ở đầu `docs/HIEN-PHAP.md`.

**Máy thi hành — chạy trước mỗi lần deploy:**
```bash
npm run build                                 # prebuild tự chạy van hồ sơ + tự kiểm cổng hiến pháp
npx next start -p 3017 &                      # hai cổng dưới PHẢI đo trên bản dựng thật, KHÔNG trên dev
npm run kiem-hien-phap http://localhost:3017  # 6 phép hiến pháp
npm run kiem-seo       http://localhost:3017
npm run thu-cua-nhan && npm run thu-vong-du-khach && npm run thu-uy-tin
```

Hồ sơ đi kèm: `docs/NAM-TRU-DONG-SO-20260824.md` (bàn giao năm trụ) ·
`docs/QUY-TRINH-DUYET-HO-SO.md` (5 bước duyệt hồ sơ chủ farm).

---

## DỰ ÁN

**Loại:** Standalone Next.js website (không phải HUB)  
**Stack:** Next.js 16 App Router · React 19 · TypeScript strict · Tailwind CSS v4 · Sanity CMS  
**Port local:** http://localhost:3007  
**Deploy:** Vercel (region `sin1`)  
**Mục tiêu:** Nền tảng du lịch nông nghiệp Việt Nam — kết nối khách với farmstay xác minh

---

## CẤU TRÚC THƯ MỤC

```
src/
  app/                    # Next.js App Router pages
    api/                  # Route handlers (revalidate, indexnow, og, gsc-ping)
    blog/                 # /blog và /blog/[slug]
    farmstay/             # /farmstay/[slug]
    danh-muc/             # /danh-muc/[slug]
    tags/, tac-gia/       # Dynamic routes
    ve-tac-gia/           # Trang giới thiệu đội ngũ tác giả
    dang-nhap/            # Form đăng nhập (client component + layout.tsx cho metadata)
    dang-farmstay/        # Form đăng ký farmstay (client component + layout.tsx cho metadata)
  features/
    blog/                 # Types, mock data, UI components blog
    listing/              # HomePage, FarmstayCard, FarmstayMap (dynamic)
  shared/
    ui/                   # Navbar, Footer, BreadcrumbNav, JsonLd, RelatedPosts, TableOfContents
    types/                # Shared TypeScript types
    utils/                # format, string helpers
  lib/
    sanity.ts             # Sanity client + urlFor + sanityFetch
    sanity-queries.ts     # GROQ queries + fetch helpers (graceful fallback khi chưa config)
    seo.ts                # buildMetadata() helper
    schema.ts             # JSON-LD generators (Article, FAQ, Breadcrumb, LodgingBusiness)
```

---

## QUY ƯỚC KỸ THUẬT

### Breaking changes Next.js 16
- `revalidatePath(path, "page")` — **bắt buộc 2 args**
- `revalidateTag(tag, "default")` — **bắt buộc 2 args**
- `themeColor` phải tách vào `export const viewport: Viewport`
- `params` trong Server Components là `Promise<{ slug: string }>` → phải `await params`

### TypeScript
- Strict mode ON — 0 errors cho phép
- `sanity.config.ts` exclude trong `tsconfig.json` (package `sanity` không install trong Next.js project)
- Cast khó: `as unknown as WithContext<LodgingBusiness>` khi schema-dts không compatible

### Images
- Sanity CDN đã config trong `next.config.ts` → dùng `<Image>` từ `next/image`
- Hostname: `cdn.sanity.io`

### Sanity
- Chưa có PROJECT_ID thật → `isSanityConfigured()` trả về `false`
- Mọi fetch helper đều fallback về `[]` khi chưa config
- Trang blog fallback về `MOCK_POSTS` để build không lỗi

### Leaflet (FarmstayMap)
- Dùng `next/dynamic` với `ssr: false` — Leaflet không chạy được trên server
- Import trong `features/listing/HomePage.tsx`

---

## ENV VARIABLES

```bash
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production

# Cache revalidation + webhook
REVALIDATE_SECRET=...
SANITY_WEBHOOK_SECRET=...   # Sanity webhook HMAC signing secret

# IndexNow (Bing/Yandex/CocCoc)
INDEXNOW_KEY=vnfarmstay2026indexnow

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_CLARITY_ID=...

# Search engine verification
NEXT_PUBLIC_GSC_VERIFY=...
NEXT_PUBLIC_BING_VERIFY=...
NEXT_PUBLIC_COCCOC_VERIFY=...

# GSC Indexing API
GSC_SERVICE_ACCOUNT_JSON='{...json...}'
```

---

## QUY TẮC CODE

1. **Server components mặc định** — chỉ thêm `"use client"` khi cần hooks/browser API
2. **Không hard-code URL/key** — đọc từ `process.env`
3. **ISR cho tất cả dynamic pages** — `export const revalidate = 3600`
4. **Schema JSON-LD** — mọi page quan trọng phải có `<JsonLd>` với schema phù hợp
5. **Graceful degradation** — luôn fallback khi Sanity chưa config
6. **next/image** — mọi ảnh external (Sanity CDN) phải dùng `<Image>`
7. **Accessibility** — mọi interactive element có `aria-label`, form có `<label>`
8. **prefers-reduced-motion** — đã có trong globals.css, không thêm animation cứng

---

## LỆNH THƯỜNG DÙNG

```bash
# Dev server
npm run dev          # port 3007 (PORT=3007 trong package.json)

# TypeScript check
npx tsc --noEmit

# Lint
npx eslint src/ --ext .ts,.tsx

# Build production
npm run build
```
