#!/usr/bin/env node
/**
 * check-orphans.mjs — Lệnh 18-MEGA: Kiểm tra orphan pages.
 *
 * Một trang được coi là "orphan" nếu không có trang nào khác link đến nó
 * (ngoại trừ Navbar + Footer). Script này quét toàn bộ src/app/**\/page.tsx
 * và kiểm tra xem mỗi route có được link từ ít nhất 1 trang khác không.
 *
 * Cách dùng:
 *   node scripts/check-orphans.mjs
 *   node scripts/check-orphans.mjs --verbose
 */

import { readFileSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ROOT = join(__dirname, "..");
const APP_DIR = join(ROOT, "src/app");
const SRC_DIR = join(ROOT, "src");
const VERBOSE = process.argv.includes("--verbose");

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Đệ quy lấy tất cả file với extension cho trước */
function walkDir(dir, ext = ".tsx") {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...walkDir(full, ext));
    } else if (full.endsWith(ext)) {
      results.push(full);
    }
  }
  return results;
}

/** Chuyển đường dẫn file page.tsx → route string */
function fileToRoute(filePath) {
  const rel = relative(APP_DIR, filePath);
  // Loại bỏ "page.tsx" ở cuối
  let route = rel.replace(/\/page\.tsx$/, "").replace(/^page\.tsx$/, "");
  // Dynamic segments: [slug] → :slug
  route = route.replace(/\[([^\]]+)\]/g, ":$1");
  return "/" + route;
}

/** Trích xuất tất cả href từ nội dung file */
function extractLinks(content) {
  const links = new Set();

  /** Xử lý 1 href string: validate và thêm vào set */
  function addLink(href) {
    if (href && href.startsWith("/") && !href.startsWith("//")) {
      links.add(href.split("?")[0].split("#")[0]);
    }
  }

  // 1. JSX attribute: href="/..." hoặc href='...'
  const hrefJsxRe = /href=["']([^"']+)["']/g;
  let m;
  while ((m = hrefJsxRe.exec(content)) !== null) addLink(m[1]);

  // 2. Object literal: href: "/..." hoặc href: '...' (dùng trong data arrays)
  const hrefObjRe = /href\s*:\s*["'`]([^"'`]+)["'`]/g;
  while ((m = hrefObjRe.exec(content)) !== null) addLink(m[1]);

  // 3. router.push / redirect / Link as string
  const routerRe = /(?:router\.push|redirect)\s*\(\s*["'`]([^"'`]+)["'`]/g;
  while ((m = routerRe.exec(content)) !== null) addLink(m[1]);

  return links;
}

// ── Các route luôn "không orphan" (navigation toàn site) ─────────────────────

const ALWAYS_REACHABLE = new Set([
  "/",
  "/tim-kiem",
  "/blog",
  "/phap-ly",
  "/cong-dong",
  "/ve-chung-toi",
  "/dang-farmstay",
  "/dang-nhap",
  "/dieu-khoan",
  "/chinh-sach-bao-mat",
  "/not-found",
]);

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  // 1. Thu thập tất cả routes từ page.tsx files
  const pageFiles = walkDir(APP_DIR).filter((f) => f.endsWith("page.tsx"));

  const routes = pageFiles
    .map((f) => ({ file: f, route: fileToRoute(f) }))
    .filter(({ route }) => {
      // Bỏ API routes, studio, ...
      return !route.startsWith("/api") && !route.startsWith("/studio");
    });

  console.log(`\n📄 Tổng số routes tìm thấy: ${routes.length}`);
  if (VERBOSE) {
    routes.forEach(({ route }) => console.log(`  ${route}`));
  }

  // 2. Thu thập tất cả links từ source files
  const allSourceFiles = [
    ...walkDir(SRC_DIR, ".tsx"),
    ...walkDir(SRC_DIR, ".ts"),
  ];

  const allLinks = new Set();
  for (const file of allSourceFiles) {
    try {
      const content = readFileSync(file, "utf-8");
      for (const link of extractLinks(content)) {
        allLinks.add(link);
      }
    } catch {
      // Bỏ qua file không đọc được
    }
  }

  if (VERBOSE) {
    console.log(`\n🔗 Tổng số unique links tìm thấy: ${allLinks.size}`);
  }

  // 3. Phân loại routes
  const orphans = [];
  const dynamic = [];
  const reachable = [];

  for (const { route } of routes) {
    if (ALWAYS_REACHABLE.has(route)) {
      reachable.push(route);
      continue;
    }

    // Dynamic route (có :param) → không thể kiểm tra tĩnh hoàn toàn
    if (route.includes(":")) {
      const base = route.split("/:")[0];
      const isLinked = [...allLinks].some(
        (l) => l === base || l.startsWith(base + "/")
      );
      if (isLinked) {
        reachable.push(route);
      } else {
        dynamic.push(route);
      }
      continue;
    }

    // Static route
    if (allLinks.has(route)) {
      reachable.push(route);
    } else {
      orphans.push(route);
    }
  }

  // 4. Report
  console.log("\n" + "─".repeat(60));

  if (reachable.length > 0) {
    console.log(`\n✅ Có liên kết đến (${reachable.length} routes):`);
    if (VERBOSE) reachable.forEach((r) => console.log(`   ${r}`));
  }

  if (dynamic.length > 0) {
    console.log(`\n⚡ Dynamic routes — cần kiểm tra thủ công (${dynamic.length}):`);
    dynamic.forEach((r) => console.log(`   ${r}`));
  }

  if (orphans.length > 0) {
    console.log(`\n⚠️  ORPHAN PAGES — không có link nào trỏ đến (${orphans.length}):`);
    orphans.forEach((r) => console.log(`   ❌ ${r}`));
    console.log(`\n   → Thêm internal link đến các trang trên từ:`);
    console.log(`     - Navbar (/src/shared/ui/Navbar.tsx)`);
    console.log(`     - Footer (/src/shared/ui/Footer.tsx)`);
    console.log(`     - Trang liên quan (blog listing, homepage, v.v.)\n`);
  } else {
    console.log("\n🎉 Không có orphan pages! Tất cả routes đều có ít nhất 1 link đến.\n");
  }

  console.log("─".repeat(60));
  console.log(
    `\nSummary: ${reachable.length} reachable | ${dynamic.length} dynamic (manual check) | ${orphans.length} orphan\n`
  );

  // Exit code 1 nếu có orphan (để dùng trong CI)
  if (orphans.length > 0) process.exit(1);
}

main();
