#!/usr/bin/env node
/** snapshot-routes.mjs — chụp HTML THẬT của từng route (fix hạng mục A1, audit gomnhalua 10/07/2026).
 *  Lý do: check-luat.mjs quét .next/ tĩnh — với CSP nonce, layout.tsx buộc render động nên .next/
 *  chỉ còn 2 trang lỗi (_global-error.html, 500.html), KHÔNG có trang thật nào → mọi cổng HTML "PASS"
 *  giả (không quét được gì thật). Script này: build đã có sẵn → `next start` tạm trên cổng rảnh →
 *  fetch từng route thật (dò từ src/app/**\/page.tsx, bỏ route [dynamic] không có slug mẫu) →
 *  lưu HTML vào .kiem-snapshot/ → tắt server. check-luat.mjs sau đó quét .kiem-snapshot/ thay vì .next/.
 *  Dùng: node snapshot-routes.mjs <thư-mục-gốc-project>
 *
 *  route-list (F-03, đề xuất nongnghiepdisan-vn 20260721): file tuỳ chọn
 *  `snapshot-routes.config.json` ở gốc project — khai route cần đăng nhập/token, không nên tự
 *  crawl. Route trong `skipRoutes` bị BỎ QUA TRƯỚC khi fetch (không tốn 15s timeout/lỗi 401 vô ích):
 *    { "skipRoutes": [ { "path": "/quan-tri", "reason": "yêu cầu đăng nhập admin" } ] }
 *  F-02: mỗi lần chạy, entry trong skipRoutes không khớp route nào còn tồn tại trong src/app/ (route
 *  nguồn đã bị xoá) bị coi là ORPHAN — chỉ CẢNH BÁO (không tự sửa file config, tránh xoá nhầm ý Ông),
 *  Ông tự dọn `snapshot-routes.config.json` khi thấy cảnh báo lặp lại. Bản thân `.kiem-snapshot/` đã
 *  được XOÁ TOÀN BỘ rồi build lại mỗi lần script chạy thành công (dòng rmSync+mkdirSync bên dưới) nên
 *  không tự tích rác giữa các lần chạy — orphan chỉ có thể phát sinh ở chính file route-list này.
 */
import { readdirSync, statSync, existsSync, readFileSync, writeFileSync, mkdirSync, rmSync, copyFileSync, realpathSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawn, execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// ---------- DẤU CHỤP (17/10/2026) ----------
// Vì sao: ngày 17/10 `wf cham --day-du` trancongthuy chấm trên ảnh chụp 28/09 (<main> 509 byte, còn cột
// chân trang đã xoá 12/10) mà vẫn in "③ 140/140 khớp"; còn dòng ngày ảnh lấy theo git log của thư mục
// này — web gitignore nó nên ngày luôn sai. Dấu chụp ghi CÂY MÃ lúc chụp (git write-tree trên chỉ mục
// tạm, gồm cả tệp chưa commit) để máy đọc so NỘI DUNG mã, không so giờ: luồng "sửa → build → chụp →
// commit" vẫn khớp, không báo oan. Ghi kèm danh sách đường loại trừ để bên đọc so đúng tập đường lúc chụp.
export const DAU_CHUP = '.dau-chup.json';
/** Đường không làm đổi HTML dựng ra (sổ sách, ghi chú) — bỏ khi so ảnh chụp với mã. */
export const NGOAI_MA = [':(exclude).kiem-snapshot', ':(exclude)_NHAT-KY', ':(exclude).claude', ':(exclude)docs', ':(exclude,glob)*.md', ':(exclude).van-tay-bo-cuc.json'];

/** Mã cây git của mọi tệp đang nằm trên đĩa (kể cả chưa commit) — chỉ mục tạm, không đụng chỉ mục thật.
 *  KHÔNG truyền NGOAI_MA vào `git add`: loại trừ một đường đã gitignore (.kiem-snapshot) làm git add thoát
 *  mã 1 ⇒ cây rỗng, máy lặng lẽ rơi về so giờ (đối chứng bắt 17/10). Sổ sách được lọc lúc so (git diff). */
export function cayMa(root) {
  const tam = join(tmpdir(), `kiem-cay-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`);
  const git = (args, env = {}) => execFileSync('git', ['-C', root, ...args], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], env: { ...process.env, ...env } }).trim();
  try {
    const chiMuc = join(git(['rev-parse', '--absolute-git-dir']), 'index');
    if (existsSync(chiMuc)) copyFileSync(chiMuc, tam);
    git(['add', '-A', '--', '.'], { GIT_INDEX_FILE: tam });
    return git(['write-tree'], { GIT_INDEX_FILE: tam });
  } catch { return null; } finally { rmSync(tam, { force: true }); }
}

/** Ghi dấu chụp vào thư mục ảnh. `goc` = { head, cay } đo LÚC BẮT ĐẦU chụp (sát lúc build nhất). */
export function dongDauChup(root, outDir, goc, them = {}) {
  const buildId = join(root, '.next', 'BUILD_ID');
  const dau = { phienBan: 1, luc: new Date().toISOString(), head: goc.head, cay: goc.cay, ngoai: NGOAI_MA,
    build: existsSync(buildId) ? statSync(buildId).mtime.toISOString() : null, ...them };
  writeFileSync(join(outDir, DAU_CHUP), JSON.stringify(dau, null, 1) + '\n');
  return dau;
}

function headHienTai(root) {
  try { return execFileSync('git', ['-C', root, 'rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return null; }
}

const LA_CHINH = (() => { try { return realpathSync(process.argv[1]) === fileURLToPath(import.meta.url); } catch { return false; } })();
if (LA_CHINH) await chinh();

async function chinh() {
  const ROOT = process.argv[2] || '.';
  const APP_DIR = join(ROOT, 'src/app');
  const OUT_DIR = join(ROOT, '.kiem-snapshot');
  const CONFIG_FILE = join(ROOT, 'snapshot-routes.config.json');

  if (!existsSync(APP_DIR)) { console.error('❌ Không tìm thấy src/app — không phải project Next.js App Router'); process.exit(2); }
  if (!existsSync(join(ROOT, '.next'))) { console.error('❌ Chưa có .next/ — chạy `npm run build` trước khi snapshot'); process.exit(2); }

  // ---------- dò route tĩnh từ src/app/**/page.tsx ----------
  const routes = new Set();
  (function walk(dir, urlPath) {
    for (const f of readdirSync(dir)) {
      const p = join(dir, f);
      if (!statSync(p).isDirectory()) continue;
      if (f.startsWith('_') || f.startsWith('.')) continue;
      if (f.includes('[')) continue; // route động không có slug mẫu — bỏ qua, kiểm tay
      const seg = f.startsWith('(') && f.endsWith(')') ? '' : `/${f}`; // route group không sinh segment URL
      const nextPath = (urlPath + seg) || '/';
      if (['page.tsx', 'page.js', 'page.jsx'].some(pf => existsSync(join(p, pf)))) routes.add(nextPath);
      walk(p, urlPath + seg);
    }
  })(APP_DIR, '');
  if (['page.tsx', 'page.js', 'page.jsx'].some(pf => existsSync(join(APP_DIR, pf)))) routes.add('/');

  if (!routes.size) { console.error('❌ Không dò được route tĩnh nào từ src/app — kiểm cấu trúc thư mục'); process.exit(2); }

  // ---------- đọc route-list skip (F-03) + cảnh báo orphan (F-02) ----------
  const skipMap = new Map(); // path → reason
  if (existsSync(CONFIG_FILE)) {
    try {
      const cfg = JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
      for (const entry of cfg.skipRoutes || []) {
        if (!entry?.path) continue;
        if (!routes.has(entry.path)) {
          console.error(`⚠️  [route-list] '${entry.path}' trong snapshot-routes.config.json không khớp route nguồn nào còn tồn tại (orphan) — Ông tự dọn file nếu route đã xoá hẳn`);
          continue;
        }
        skipMap.set(entry.path, entry.reason || 'đánh dấu skipSnapshot trong route-list');
      }
    } catch (e) { console.error(`⚠️  [route-list] không đọc được snapshot-routes.config.json (${e.message}), bỏ qua route-list`); }
  }
  const skippedByConfig = [];
  for (const p of skipMap.keys()) { routes.delete(p); skippedByConfig.push(p); }

  // Cây mã đo TRƯỚC khi chụp — sát lúc build nhất; ghi vào dấu chụp sau khi chụp xong.
  const gocMa = { head: headHienTai(ROOT), cay: cayMa(ROOT) };

  // ---------- khởi động next start tạm trên cổng rảnh ----------
  // detached:true — `npx next start` sinh tiến trình con thật `next-server` không cùng PID với
  // npx; server.kill() cũ chỉ giết npx, next-server sống mồ côi giữ pipe stdio mở → Node treo vô
  // hạn chờ pipe đóng (bug thật 11/07/2026, thấy "orphan process next-server" khi hủy CI). Fix:
  // spawn cả nhóm tiến trình riêng rồi giết CẢ NHÓM bằng process.kill(-pid).
  const PORT = 41000 + Math.floor(Math.random() * 4000);
  const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { cwd: ROOT, stdio: 'pipe', detached: true });
  let serverErr = '';
  server.stderr.on('data', d => { serverErr += d.toString(); });

  async function killServerTree() {
    try { process.kill(-server.pid, 'SIGTERM'); } catch {}
    await new Promise(r => setTimeout(r, 1500)); // đợi THẬT trước khi ép — process.exit() sau đó
    try { process.kill(-server.pid, 'SIGKILL'); } catch {} // không thể để lỡ nhịp setTimeout chưa kịp chạy
  }

  async function waitReady(timeoutMs = 30000) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      try { const r = await fetch(`http://localhost:${PORT}/`); if (r.status < 500) return true; } catch {}
      await new Promise(r => setTimeout(r, 500));
    }
    return false;
  }

  console.error(`⏱️  [snapshot] chờ next start sẵn sàng trên cổng ${PORT}...`);
  const t0 = Date.now();
  const ready = await waitReady();
  if (!ready) {
    console.error(`❌ next start không sẵn sàng sau 30s trên cổng ${PORT}\n${serverErr.slice(0, 500)}`);
    await killServerTree();
    process.exit(2);
  }
  console.error(`⏱️  [snapshot] server sẵn sàng sau ${Date.now() - t0}ms — bắt đầu fetch ${routes.size} route`);

  rmSync(OUT_DIR, { recursive: true, force: true });
  mkdirSync(OUT_DIR, { recursive: true });

  let saved = 0;
  let i = 0;
  // SKIP (F-04): route bị bỏ qua có LÝ DO ghi nhận — 403/4xx-5xx từ server thật hoặc lỗi fetch, phân
  // biệt với route bị route-list loại trước khi crawl (skippedByConfig) — không tạo file snapshot rác.
  const skippedRuntime = [];
  for (const route of routes) {
    i++;
    const tRoute = Date.now();
    console.error(`⏱️  [snapshot] (${i}/${routes.size}) bắt đầu fetch ${route}`);
    try {
      // Timeout 15s/route (bug thật 11/07/2026): fetch không giới hạn thời gian — 1 trang SSR treo
      // (vd gọi API ngoài không phản hồi trong CI) làm cả vòng lặp treo vô hạn, kéo CI treo theo.
      const res = await fetch(`http://localhost:${PORT}${route}`, { signal: AbortSignal.timeout(15000) });
      if (res.status >= 400) {
        const reason = `HTTP ${res.status}${res.status === 403 ? ' Forbidden' : ''}`;
        skippedRuntime.push({ route, reason });
        console.error(`⏭️  SKIP ${route} → ${reason}, không tạo snapshot`);
        continue;
      }
      const html = await res.text();
      const outFile = route === '/' ? join(OUT_DIR, 'index.html') : join(OUT_DIR, route.slice(1), 'index.html');
      mkdirSync(dirname(outFile), { recursive: true });
      writeFileSync(outFile, html, 'utf8');
      saved++;
      console.error(`⏱️  [snapshot] (${i}/${routes.size}) xong ${route} sau ${Date.now() - tRoute}ms`);
    } catch (e) {
      const reason = e.name === 'TimeoutError' ? 'timeout 15s' : e.message;
      skippedRuntime.push({ route, reason });
      console.error(`⏭️  SKIP ${route} → lỗi fetch (${reason}), không tạo snapshot — mất ${Date.now() - tRoute}ms`);
    }
  }
  console.error(`⏱️  [snapshot] xong toàn bộ ${routes.size} route, tổng ${Date.now() - t0}ms`);

  await killServerTree();

  const totalRoutes = routes.size + skippedByConfig.length;
  if (!saved) { console.error('❌ Không snapshot được trang thật nào — kiểm server/route'); process.exit(1); }
  if (skippedByConfig.length) console.log(`⏭️  ${skippedByConfig.length} route bỏ qua theo route-list (skipSnapshot): ${skippedByConfig.join(', ')}`);
  if (skippedRuntime.length) console.log(`⏭️  ${skippedRuntime.length} route SKIP lúc crawl: ${skippedRuntime.map(s => `${s.route} (${s.reason})`).join('; ')}`);
  const dau = dongDauChup(ROOT, OUT_DIR, gocMa, { trang: saved });
  console.log(`✅ Snapshot ${saved}/${totalRoutes} route thật vào .kiem-snapshot/ · dấu chụp ${dau.luc.slice(0, 16).replace('T', ' ')}${dau.cay ? ` · cây mã ${dau.cay.slice(0, 7)}` : ' · KHÔNG có cây mã (web không có git) — wf cham sẽ lùi về so theo giờ'}`);
  // Ép thoát ngay — không chờ event loop tự rỗng (pipe stdio của tiến trình con dù đã kill vẫn có
  // thể giữ handle thêm vài trăm ms trên CI chậm), tránh lặp lại bug treo vô hạn đã gặp.
  process.exit(0);
}
