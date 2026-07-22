# Architecture — vnfarmstay.vn

## Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS v4
- **CMS:** Sanity (planned)
- **Hosting:** Vercel + Cloudflare
- **Form:** React Hook Form + Zod
- **State:** Zustand

## Cấu trúc thư mục
```
src/
  app/           # Next.js App Router (pages, layouts, API routes)
  features/      # Feature modules (booking, search, listing, auth)
  shared/        # Dùng chung ≥ 2 nơi (ui, hooks, utils, types)
  lib/           # Cấu hình thư viện bên thứ ba
  styles/        # Global styles
```

## Port localhost: 3007 (cố định, không đổi)
