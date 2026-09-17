#!/usr/bin/env node
/** check-luat.mjs — Máy kiểm tự động Luật Thiết Kế Web
 *  PHIÊN BẢN: v5.5-20260710 — BẢN GỐC DUY NHẤT tại Web/CODEWEB/05-TEMPLATE-CHUAN/SO-TAY-MAY-KIEM/.
 *  ⛔ CẤM sửa bản vendor trong từng web — sửa TẠI ĐÂY rồi chạy: bash Web/CODEWEB/sync-so-tay.sh
 *  (v5.5 hợp nhất 7 fix từ nhahoachdinh 08/07 + van mềm exp.26/27/29 cho web build trước cổng màu/sơ đồ)
 *  Quét TĨNH thư mục build (HTML/CSS) — chấm các tiêu chí đo được bằng máy.
 *  Dùng:  node check-luat.mjs <thư-mục-build>   (vd: node check-luat.mjs out/ hoặc .next/server/app)
 *  Tuỳ chọn màu: npm i culori && tạo luat-pairs.json [["--fg","--bg"],...] cạnh script.
 *  Kết quả: PASS/WARN/FAIL từng mục + tổng kết. Exit 1 nếu có FAIL. Mặc định chỉ đọc — CHỈ ghi
 *  file khi gọi rõ --update-snapshot (ghi SO-TAY-MAY-KIEM/.snapshot-noidung.json, dùng cho F45/F49).
 */
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync } from 'node:fs';
import { join, extname, dirname, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

// ---------- giám sát hard-timeout (vá 20260720) ----------
// Vá 20260720 (Ông báo máy kiểm GỐC treo CPU 100%/RAM ~2GB, >6 phút không output khi quét
// .kiem-snapshot ~80KB — nghi regex catastrophic backtracking; đã vá 3 chỗ ReDoS thật tìm được ở
// aeo.11/aeo.12/layout.46, xem "Vá 20260720" quanh các cổng đó — nhưng KHÔNG chắc đã bắt đúng thủ
// phạm gốc vì không tái hiện được treo trên 11 .kiem-snapshot thật đang có). Hàng rào này đứng độc
// lập với việc có tìm đúng bug không: Node đơn luồng — 1 regex đồng bộ đang treo thì KHÔNG
// timer/Promise nào trong CÙNG tiến trình có cơ hội chạy để tự ngắt, chỉ tiến trình CHA đứng NGOÀI
// mới kill() được. Nên tự spawn lại CHÍNH MÌNH làm con (luôn bật CHECK_LUAT_TRACE để con tự in tiến
// độ từng cổng ra stderr), cha canh giờ, quá hạn thì kill -9 con + báo rõ dòng cổng cuối in ra là
// nghi phạm. Bọc NGAY TRONG file này (không tách script riêng) để mọi nơi gọi check-luat.mjs sẵn có
// (package.json/CI/2 SKILL.md) tự động được bọc, không cần sửa đường dẫn ở đâu khác (tránh lặp lỗi
// "đường dẫn script lệch" đã vá Nhóm A F53 cùng đợt).
const HARD_TIMEOUT_MS = Number(process.env.CHECK_LUAT_TIMEOUT_MS) || 90_000; // đo thật: web nặng nhất hiện có (8.7MB tổng HTML, xuyenvietfarmstay-vn) chạy hết ~1s — 90s dư biên độ ~90 lần, đổi được qua env
if (!process.env.CHECK_LUAT_CHILD) {
  const child = spawn(process.execPath, [fileURLToPath(import.meta.url), ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: { ...process.env, CHECK_LUAT_CHILD: '1', CHECK_LUAT_TRACE: '1' },
  });
  const { code } = await new Promise((resolve) => {
    const killer = setTimeout(() => {
      process.stderr.write(`\n❌ TREO — vượt hard-timeout ${(HARD_TIMEOUT_MS / 1000).toFixed(1)}s, đã kill tiến trình con.\n   → Cổng NGAY SAU dòng "+Ns [id] ..." cuối cùng ở trên là nghi phạm (CHECK_LUAT_TRACE tự bật).\n   → Đổi ngưỡng: CHECK_LUAT_TIMEOUT_MS=<ms> node check-luat.mjs ...\n`);
      child.kill('SIGKILL');
      resolve({ code: 124 }); // quy ước exit code timeout, giống lệnh `timeout` GNU
    }, HARD_TIMEOUT_MS);
    child.on('exit', (exitCode, signal) => { clearTimeout(killer); resolve({ code: signal ? 1 : (exitCode ?? 1) }); });
    child.on('error', (err) => { clearTimeout(killer); process.stderr.write(`❌ Không spawn được tiến trình con: ${err.message}\n`); resolve({ code: 1 }); });
  });
  process.exit(code);
}
// ---------- hết phần giám sát — TỪ ĐÂY LÀ TIẾN TRÌNH CON (CHECK_LUAT_CHILD=1), logic kiểm luật gốc ----------

const HERE = dirname(fileURLToPath(import.meta.url)); // thư mục chứa chính file này (dùng để tìm tu-dien-tu-ghep-vn.json cạnh script — F23)

const VERSION = 'v5.25'; // (v5.25 20260803 THÊM cổng mot.12-tuong-phan-chu-animate — đúc từ lỗi THẬT karaokeScrollText (vá 2a57a57): buộc opacity theo cuộn xuống khoảng (0,1) trên phần tử CHỮ làm tương phản tụt dưới 4.5:1, mà số opacity viết cứng chỉ đúng 1 cặp màu chữ/nền nên không chữa được bằng chỉnh số; cách vá chuẩn là animate filter blur(). Ba vòng vá mới đúng, mỗi vòng do đối chứng bắt lỗi: (1) bản đầu bỏ lọt lối viết rút gọn style opacity nên MẪU SAI vẫn PASS; (2) xét dấu hiệu chữ trên TOÀN tệp nên chấm oan 3 recipe khác trong cùng tệp — sửa thành xét vùng quanh chỗ vi phạm; (3) chấm oan hiệu ứng hiện-vào 0→1 (kineticTypographyWrap) — siết ranh giới về đáy nằm HẲN trong (0,1) vì chữ vô hình không phải lỗi tương phản, chữ mờ-nhưng-đọc-được mới là. Đối chứng 2 chiều lưu git: fixtures/mot.12-tuong-phan-chu-animate/fail (bản opacity cũ)→FAIL · pass (bản blur)→PASS. Trên template: +1 WARN THẬT (pinnedScrollSectionWrap đáy 0.5, imageScrollSequenceWrap đáy 0.3 — bọc children tuỳ ý, mờ ở rìa, cần người xác nhận không dùng cho chữ), 29 PASS·0 FAIL không đổi. Nối vào tiêu chí Tương phản WCAG 2.2 AA light+dark của CẢ luat-vn lẫn luat-qt với do_phu mot-phan NGAY trong cùng commit — không đẻ thêm cổng mồ côi, đúng bài học 78/127 cổng mồ côi đo cùng ngày.) hằng phiên bản DUY NHẤT — dùng ở cả header báo cáo (v5.24 20260728 vá LỖ GIÁM SÁT aeo.11-selfcontained + aeo.12-qa-40-60tu: cả 2 cổng chỉ biết tìm ĐÚNG MỘT tên tệp `qa-data.ts` của 05-TEMPLATE-CHUAN, web nào dùng cấu trúc FAQ riêng thì cả 2 trả WARN "Không tìm thấy qa-data.ts" rồi IM LẶNG BỎ QUA — đọc nhầm thành "web sạch" trong khi sự thật là KHÔNG CỔNG NÀO CHẠY. Bằng chứng thật: nhahoachdinh-vn-live dùng src/lib/article-faq.ts, đo trên .kiem-snapshot 35 trang ra 7 khối FAQPage / 38 cặp Q&A render THẬT — bản cũ chấm cả 38 câu bằng đúng 1 dòng "Không tìm thấy qa-data.ts", bản mới bắt 24/38 answer ngoài khoảng 40-60 từ. VÁ: thêm bộ đọc dùng chung `__docFAQ()` — đo cái web THẬT SỰ PHÁT RA (phân tích khối application/ld+json @type FAQPage trong HTML build, gộp trùng giữa các trang), `qa-data.ts` tụt xuống làm nguồn DỰ PHÒNG cho --source-only/chưa build. THÊM trạng thái phân biệt được: "web KHÔNG khai FAQ ở đâu cả" → PASS ghi rõ N/A (đã soi 3 nguồn) vs "MÁY KHÔNG ĐỌC NỔI FAQ của web này" → WARN có tiếng, tuyệt đối không im lặng — kích hoạt khi CÓ dấu hiệu FAQ (chuỗi FAQPage trong HTML · qa-data.ts · tệp nguồn tên *faq*/qa-data) mà rút được 0 cặp. RÚT `aeo.12-qa-40-60tu` khỏi NGUON_THUAN_IDS vì cổng nay đụng htmls nên --source-only không còn trùng bản full — giữ lại là khai man. Đối chứng 2 chiều lưu vào git (corpus chỉ lớn thêm, 2 mẫu qa-data.ts cũ GIỮ NGUYÊN): mỗi cổng +5 biến thể fixture — pass-html-faq (tự chứa nghĩa/đúng độ dài)→PASS · warn-html-faq (đại từ mơ hồ/quá ngắn)→WARN · pass-khong-co-faq-o-dau-ca→PASS N/A · warn-may-khong-doc-noi-nguon-ten-rieng + warn-may-khong-doc-noi-json-hong→WARN. Hai mẫu cuối là PHÉP SOI RIÊNG cho đúng nhánh N/A mới, chứng minh nó KHÔNG nuốt ca lỗi (lesson_bo_loc_chong_bao_oan_bit_loi_that). regression-luat 121/121 gate đúng cả 2 chiều. Hồi quy .kiem-snapshot template: 102 PASS·21 WARN·3 FAIL — 0 verdict đổi so bản v5.23 chạy cùng thư mục. node --check sạch.) (v5.23 20260723 vá 2 lỗ hổng lộ ra từ /nang-cap-giao-dien chạy thật trên nongnghiepdisan-vn: (1) mot.9-hieu-ung-khai-dung regex dò `recipe="..."` dùng thật chỉ nhận `[a-zA-Z0-9]+`, bỏ lọt tên có gạch nối — web tự dựng `MotionWrap.tsx` bespoke với RECIPES đặt tên kiểu "stagger-cascade"/"fade-up" (mẫu hình HỢP LỆ, xác nhận đang sống thật ở cả nongnghiepdisan-vn lẫn daiviettrahoa-vn) bị FAIL oan "hiệu ứng trên giấy" dù đã nối dây đúng; đổi character class thành `[a-zA-Z0-9-]+`. Đối chứng: dùng thật có gạch nối→PASS đúng (trước đây FAIL oan) · khai nhưng không dùng→FAIL đúng (giữ nguyên) · regression 53/53 + template .kiem-snapshot 101 PASS·22 WARN·3 FAIL không đổi. (2) Chú thích cổng mobile.29-safe-area từng chép NGUYÊN VĂN 1 ví dụ cú pháp lớp Tailwind "giá trị tuỳ ý" — `SO-TAY-MAY-KIEM/` không nằm trong `.gitignore` của web, Tailwind v4 quét CẢ file .mjs tìm token candidate, chuỗi đó khiến CSS sinh hỏng → 1 web build lỗi 500; web tự vá bằng cách đổi câu chữ trong bản vendor, nhưng `gac-nha-may.sh` so khớp md5 tuyệt đối nên báo NHẦM "lệch bản gốc" — khuyên `sync-so-tay.sh apply` sẽ ĐÈ MẤT bản vá tự vệ, tái phát lỗi 500. Vá bằng cách viết lại chú thích chỉ MÔ TẢ bằng lời, không chép nguyên văn cú pháp lớp thật — quét lại toàn file xác nhận 0 token nào còn khớp mẫu `tên-[...]` của Tailwind arbitrary-value. Đồng bộ cả 2 vá xuống mọi web vendor qua `sync-so-tay.sh apply` (web đã tự vá bug #2 giờ md5 khớp bản gốc mới, hết báo "lệch" giả). vá 2 lỗ hổng từ sổ đề xuất xuyenvietfarmstay 21/07 (project_web_factory_pha024_20260722): sec.5-error-no-stack-source đổi cách strip console.error/console.warn/reportError/Sentry.captureException sang scan ngoặc tròn LỒNG NHAU thật (không dùng regex `[^)]*`) rồi mới soi `{...}` JSX — vá false-FAIL log thuần trong callback/useEffect (vd `useEffect(() => { console.error(error.message) })`) bị bắt oan vì thân callback cũng là 1 khối `{}` giống interpolation JSX. mot.7-dna-noi-code thêm nhánh nhận diện CSS animation tự cấy hợp lệ (không chỉ MotionWrap/recipe=/MotionConfig): tìm `@keyframes` trong CSS có rule `animation:` trỏ đúng tên, lấy class của rule đó, xác nhận class có dùng làm className thật trong ≥1 file .tsx — vá bỏ lọt hiệu ứng CSS thuần (kiểu `.fog-reveal` của xuyenvietfarmstay-vn) từng bị FAIL oan vì không khớp 3 từ khoá cứng. Đối chứng 2 chiều: sec.5 3 case (console.error(error.message) trong useEffect→PASS đúng thay vì FAIL oan trước · error.message render thẳng JSX→FAIL đúng · reportError(error,{{extra:error.stack}}) ngoặc lồng→PASS đúng); mot.7 4 case (CSS animation nối dây thật→PASS · keyframes tồn tại nhưng không class nào dùng→FAIL · class có animation nhưng không .tsx nào dùng className→FAIL · MotionWrap cũ vẫn PASS). Hồi quy template: --source-only 29 PASS·1 WARN·0 FAIL (không đổi) · full .kiem-snapshot 101 PASS·22 WARN·3 FAIL (không đổi). tsc không áp dụng (file .mjs thuần, node --check sạch). Đồng thời vá `scripts/gen-llms.mjs` (không thuộc check-luat.mjs, ghi riêng): thêm safeWrite() chống ghi đè llms.txt/llms-full.txt THẬT bằng placeholder rác khi web thiếu site-config.ts (kiến trúc bespoke) — chỉ ghi khi file đích chưa tồn tại hoặc bản mới KHÔNG tệ hơn bản cũ (bản cũ không placeholder mà bản mới placeholder → SKIP, giữ nguyên). Đối chứng 3 case: file thật+thiếu config→SKIP giữ nguyên (trước đây bị đè mất, đúng sự cố xuyenvietfarmstay 21/07) · file thật+có config hợp lệ→ghi đè bình thường bằng nội dung mới tốt hơn · không có file cũ+thiếu config→ghi placeholder bình thường (không có gì để giữ). v5.21 20260722 nghiệm thu độc lập ("Ngự Sử") 28 cổng mới v5.18-v5.20 (project_luat_v5_khoang_trong_giam_sat_20260722) bằng subagent riêng KHÔNG dùng lại fixture cũ, tự dựng edge-case adversarial — bắt được 8 lỗ hổng thật, đã vá tất cả: (1) ux.18-nav-limit dùng .match() không global CHỈ lấy <nav> ĐẦU TIÊN — bỏ lọt hàng loạt vì kiến trúc nav responsive phổ biến nhất có ≥2 <nav> (desktop+mobile hamburger), nav mobile vi phạm >7 link không hề bị bắt; đổi sang matchAll duyệt hết mọi khối <nav> (dùng flatMap). (2) ux.17-card-no-nested-link ReDoS THẬT: regex `/<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<a\b/` với file có hàng chục nghìn "<a " không đóng ">" → [^>]* quét lại từ mỗi vị trí = O(n²), đo được 49s/300KB (đủ chạm gần ngưỡng hard-timeout 90s của TOÀN máy kiểm); đổi sang quét tuyến tính đếm độ sâu mở/đóng bằng 1 regex không lồng quantifier — xác nhận lại: cùng fixture ReDoS giờ chạy tức thời (0.0s delta trong CHECK_LUAT_TRACE), độ trễ 37s đo được trên toàn tiến trình đến từ 2 cổng CÓ SẴN TỪ TRƯỚC (a11y.8-skip-link, seo.36-internal-link-density) phản ứng chậm với input dị thường này — NGOÀI phạm vi 28 cổng mới, ghi nhận riêng không sửa trong đợt này. (3) vn.2-form-dia-chi false-negative: vnPattern không có \b quanh alternative khớp SUBSTRING bất kỳ — chuỗi "tinhte.vn" (tên miền công nghệ VN phổ biến) trong đoạn văn KHÔNG liên quan che giấu hoàn toàn form state/zip vi phạm thật; thêm \b quanh mọi alternative. (4)-(9) nhóm lỗi hệ thống "PASS giả qua comment/padding" ở 8 cổng: code.2-error-monitor-guard/code.3-ci-pipeline-guard/qa.3-axe-ci-guard/qa.4-console-error-guard/qa.6-lighthouse-ci-guard/qa.11-check-luat-in-ci chỉ regex toàn văn bản KHÔNG loại trừ comment (`//`/`#`) — 1 dòng TODO/comment nhắc đúng chuỗi khoá đủ để PASS giả dù chưa làm thật; thêm helper __stripJsLineComments/__stripYamlComments (chỉ strip dòng THUẦN là comment, an toàn không đụng "http://") áp dụng trước khi test. ops.2-handoff-doc-guard bị bypass bằng cách đệm "lorem ipsum filler" cho README vượt ngưỡng length<2000 dù chưa viết nội dung thật; đổi sang yêu cầu tín hiệu nội dung bàn giao thật (runbook/rollback/kiến trúc/architecture/env variable). qa.1-e2e-coverage-guard/qa.5-smoke-test-guard chỉ xét tên file/độ dài, không xét nội dung thật (file rỗng/toàn comment vẫn PASS) — thêm yêu cầu có test()/it() thật (qa.1) hoặc strip comment trước khi đo độ dài (qa.5). PHÁT HIỆN THÊM khi tự hồi quy: thêm từ khoá "deploy" vào ops.2-handoff-doc-guard làm chính template GỐC (chưa viết README thật) đổi verdict WARN→PASS SAI — vì boilerplate create-next-app gốc đã có sẵn mục "## Deploy on Vercel"; bỏ "deploy" khỏi danh sách tín hiệu ngay khi phát hiện qua hồi quy .kiem-snapshot. Đối chứng lại toàn bộ 9 fixture mới (bad→WARN đúng, good→PASS đúng) + xác nhận KHÔNG hồi quy trên .kiem-snapshot template (101 PASS·22 WARN·3 FAIL — giữ nguyên số liệu trước nghiệm thu, đúng vì mọi lỗ hổng vá đều thuộc edge-case không xuất hiện trên chính template). tsc --noEmit sạch. 20/28 cổng ban đầu đã PASS nghiệm thu ngay không cần sửa.) v5.20 20260722 vá khoảng trống giám sát nhóm 3 `code`/`green`/`ethics`/`ops`/`qa` (project_luat_v5_khoang_trong_giam_sat_20260722, nhóm 3/3 — HOÀN TẤT cả kế hoạch 3 nhóm). Artifact dự án từng khẳng định các trụ này "đã sẵn 0 token trong 05-TEMPLATE-CHUAN" (ESLint jsx-a11y, CI npm audit, Playwright...) nhưng CHƯA có cổng máy TÁI XÁC NHẬN cơ chế đó còn nguyên vẹn sau khi 1 web cụ thể tuỳ biến archetype — rủi ro tự ghi nhận "lỡ tay xoá/ghi đè". THÊM 17 cổng: code.1-manifest-guard (public/manifest.json không placeholder + khai trong metadata; favicon riêng đã có media.1-image, không viết trùng), code.2-error-monitor-guard (error-reporter.ts/@sentry được GỌI từ error.tsx/global-error.tsx, không chỉ tồn tại), code.3-ci-pipeline-guard (ci.yml còn đủ step tsc/ESLint/audit/build/E2E), code.4-custom-error-pages (not-found/error/global-error tồn tại + tuỳ biến bản sắc — SITE_NAME/Link/màu brand hex/reportError), green.1-page-weight-budget (đo trực tiếp .next/static/*.js+*.css, ghi rõ caveat "raw chưa gzip" để không hiểu nhầm là số đo Lighthouse chính xác), green.2-reduced-data (CSS có prefers-reduced-data, WARN nhẹ vì hỗ trợ trình duyệt còn hạn chế), ethics.1-no-app-lock (grep pattern smart-app-banner/interstitial ép cài app), ethics.2-no-preselected-consent (checkbox consent/marketing checked mặc định — TÁCH cổng riêng thay vì sửa priv.28-consent-gate đã kiểm chứng, an toàn hơn), ops.1-observability-guard (Vercel Analytics/Speed Insights HOẶC error-reporter/Sentry), ops.2-handoff-doc-guard (README.md không còn boilerplate create-next-app mặc định), qa.1-e2e-coverage-guard (e2e/ có spec phủ form/liên hệ/checkout), qa.2-cross-browser-guard (playwright.config.ts ≥2 project + có viewport mobile), qa.3-axe-ci-guard (e2e/a11y.spec.ts gọi axe-core thật), qa.4-console-error-guard (có spec page.on('console',...)), qa.5-smoke-test-guard (scripts/smoke.mjs tồn tại + có nội dung), qa.6-lighthouse-ci-guard (ci.yml có step Lighthouse CI + budgetPath), qa.11-check-luat-in-ci (ci.yml có step npm run check:luat). Trong lúc viết đối chứng bắt được 1 false-positive thật: code.4 ban đầu đòi SITE_NAME/Link ở MỌI file trong 3 file kiểm — global-error.tsx đúng chuẩn Next.js KHÔNG dùng Link (root layout đã hỏng, chỉ có inline style + reset()) nên báo oan trên chính template; vá bằng cách chấp nhận thêm tín hiệu màu brand hex/reportError() làm bằng chứng tuỳ biến. Phần lớn 38 tiêu chí gốc còn lại của nhóm 3 (W3C validator, Baseline widely, kiến trúc render, progressive enhancement, carbon footprint/green hosting, dark patterns chủ quan, uptime/backup/load-test dịch vụ ngoài, test pyramid/visual regression/i18n QA) là hạ tầng/dịch vụ ngoài hoặc chủ quan — KHÔNG viết cổng giả (nguyên tắc 3). Đối chứng 2 chiều (CLAUDE.md#11): 17/17 cổng có fixture bad→WARN + good→PASS (2 bộ fixture: 1 dự án giả đầy đủ src/lib/site-config.ts+package.json+.github/workflows/ci.yml+e2e/+scripts/ cho 16 cổng, 1 riêng cho green.1 với .next/static/*.js dựng tay 2 cỡ). Hồi quy .kiem-snapshot template: 88→101 PASS (+13 đúng), 18→22 WARN (+4 WARN THẬT: code.1 manifest còn placeholder, green.1 JS 956KB vượt ngưỡng tham khảo, green.2 thiếu prefers-reduced-data, ops.2 README còn boilerplate — đều là phát hiện có thật trên chính template gốc, không phải báo oan), 3 FAIL giữ nguyên. tsc --noEmit sạch. TỔNG CẢ 3 NHÓM: vn(4)+ux(7)+nhóm3(17) = 28 cổng mới, phủ phần khả thi tĩnh của 78 tiêu chí từng 0% đường kiểm.) v5.19 20260722 vá khoảng trống giám sát trụ `ux` (project_luat_v5_khoang_trong_giam_sat_20260722, nhóm 2/3 kế hoạch): trụ `ux` (21 tiêu chí) trước đợt này là bất thường DUY NHẤT trong nhóm "chốt Bước 2 AI chọn" (cùng nhóm aes/mot/layout/exp đã có cổng) mà 0 cổng máy. THÊM 7 cổng phủ 8 tiêu chí AUTO khả thi tĩnh: `ux.12-micro-states` (4/6 trạng thái vi mô hover/focus-visible/active/disabled đo được qua CSS, "loading" cần runtime nên bỏ qua), `a11y.26-touch-target` (hit target ≥24×24px WCAG 2.5.8 — DÙNG CHUNG cho cả ux#13 và a11y#5 vốn thiếu cổng riêng, chỉ bắt vi phạm RÕ height/min-height<24px khai cứng trên button/a/.btn, không chứng minh được mọi phần tử), `ux.16-hero-no-autoplay` (soi file *.tsx tên chứa "hero" tìm dấu hiệu Autoplay()/autoplay:{}/setInterval đổi slide), `ux.17-card-no-nested-link` (grep <a> lồng <a> sau khi BẮT BUỘC strip <script>/<style> — bắt được false-positive thật khi build: chuỗi "<a" xuất hiện tình cờ trong JS bundle minify khiến 4/4 trang template báo oan trước khi vá), `ux.18-nav-limit` (nav chính ≤7 link trực tiếp + có aria-current="page"), `ux.19-footer-groups` (đếm heading con h2-h4/strong trong <footer>, tối đa 4 nhóm — thông tin pháp nhân là CORE không kiểm lại), `ux.21-faq-aria-expanded` (khi có FAQPage schema, UI accordion phải có aria-expanded — TÁCH cổng riêng thay vì sửa logic aeo.24-faq-schema đã kiểm chứng, an toàn hơn tránh hồi quy). Tiêu chí #4 (typography) xác nhận ĐÃ trùng layout.20-measure-percent/mobile.28-input-zoom, không viết lại. 13 tiêu chí còn lại của ux (10 heuristics Nielsen, IA, forms validation, empty/error states, thứ bậc thị giác, nhất quán, dark mode, trust signal, forgiving interactions, deep-link, tốc độ cảm nhận, pricing table) là chủ quan/cần runtime/điều kiện hẹp — KHÔNG ép cổng giả, để dành hoặc ghi "cần mắt người". Đối chứng 2 chiều (CLAUDE.md#11): 8/8 cổng có fixture bad→WARN + good→PASS (3 bộ fixture riêng: HTML thuần cho ux.17/18/19, site-config.ts+globals.css+Hero.tsx cho ux.12/a11y.26/ux.16, FAQPage schema HTML cho ux.21). Hồi quy .kiem-snapshot template: 82→88 PASS (+6 đúng), 17→18 WARN (+1 là WARN THẬT của ux.12 trên chính template — thiếu 2/4 pseudo-class, không phải báo oan), 3 FAIL giữ nguyên. tsc --noEmit sạch. Còn lại nhóm 3 (`code`/`green`/`ethics`/`ops`/`qa` ~15 cổng) — xem checklist trong memory checkpoint.) v5.18 20260722 vá khoảng trống giám sát trụ `vn` (project_luat_v5_khoang_trong_giam_sat_20260722, nhóm 1/3 kế hoạch): trước đợt này trụ `vn` (14 tiêu chí bản địa hoá/tuân thủ VN) có 0% đường kiểm máy — THÊM 4 cổng `vn.1-chuan-tieng-viet` (charset utf-8 + dấu tiếng Việt trong nội dung hiển thị; must:true nhưng chạy WARN trước theo nguyên tắc 6, cố ý KHÔNG kiểm định dạng tiền 'đ'/ngày dd-mm-yyyy vì không đủ tín hiệu tĩnh an toàn — dễ trùng số điện thoại/mã đơn), `vn.2-form-dia-chi` (WARN nếu thấy input state/zip kiểu Mỹ mà không thấy cascade Tỉnh/Quận/Phường, N/A nếu không có form địa chỉ), `vn.3-i18n-ready` (chỉ áp khi site-config.ts khai locales.length>1, WARN nếu CSS chưa dùng margin-inline/padding-inline/inset-inline), `vn.4-intl-format` (WARN nếu thấy nối chuỗi ngày hard-code từ .getDate()/.getMonth()/.getFullYear() hoặc biến day/month/year mà không dùng Intl.DateTimeFormat/toLocaleDateString trong cùng file — regex cố ý hẹp để không báo oan trên nối URL path/breadcrumb thường gặp). 2 tiêu chí còn lại của trụ vn (#3 xác thực≤24h khi có đăng bài, #10 CDN gần VN) KHÔNG viết cổng — ghi N/A "cần kiểm tay" vì thuộc hạ tầng/thời gian thực, không đo được qua đọc source tĩnh (đúng nguyên tắc "thà không cổng còn hơn cổng báo sai"). Đối chứng 2 chiều (CLAUDE.md#11): 2 fixture (bad/good) cho vn.1/vn.2 qua HTML dựng tay + 2 fixture (bad/good) cho vn.3/vn.4 qua site-config.ts+globals.css+file .tsx dựng tay, cả 4 cổng đúng cả 2 chiều (bad→WARN, good→PASS). Hồi quy trên .kiem-snapshot template: 78→82 PASS (đúng bằng 4 cổng mới), 17 WARN·3 FAIL giữ nguyên. tsc --noEmit sạch. Còn lại nhóm 2 (`ux` 8 cổng) và nhóm 3 (`code`/`green`/`ethics`/`ops`/`qa` ~15 cổng) — xem checklist trong memory checkpoint.) v5.14 20260720 Ông báo máy kiểm GỐC treo CPU 100%/RAM ~2GB >6ph khi quét .kiem-snapshot ~80KB: (1) vá 3 chỗ ReDoS THẬT (aeo.11-selfcontained/aeo.12-qa-40-60tu/layout.46-cinema-doanvan-80tu-n6) — regex `(?:\\.|(?!\1)[\s\S])*` có 2 nhánh chồng lấn trên ký tự "\", chuỗi \ liên tiếp không đóng ngoặc nổ cấp số nhân (test tái hiện: 20 dấu \ treo >3s, fix xong 50.000 dấu \ chạy 0ms, 5 ca input hợp lệ giữ nguyên hành vi); (2) KHÔNG tái hiện được đúng kịch bản gốc trên 11 .kiem-snapshot thật đang có (kể cả bản 8.7MB, đều xong ~1s) nên KHÔNG chắc đã bắt đúng thủ phạm — thêm hàng rào độc lập với việc có tìm đúng bug không: tự spawn CHÍNH MÌNH làm tiến trình con (CHECK_LUAT_CHILD=1) + hard-timeout 90s (CHECK_LUAT_TIMEOUT_MS chỉnh được) kill -9 nếu treo + CHECK_LUAT_TRACE tự bật cho con (trước đây phải tự gõ env var mới có tiến độ từng cổng) — xem khối "giám sát hard-timeout" đầu file; v5.7: F27/F28/F30 LÔ 3 — cờ --source-only/--only; v5.8 20260715: layout.44/45/46 đúc luật riêng N4/N5/N6 thành cổng máy kiểm thật; v5.9 20260716 Đợt 3 chiến dịch hiệu ứng điện ảnh: mot.9/10/11 — mot.7/mot.8 ĐÃ CÓ TRƯỚC (dna-noi-code/signature-bo1, khác mục đích) nên 3 cổng mới đánh số tiếp 9/10/11, KHÔNG dùng số 7/8 như kế hoạch gốc gợi ý để tránh đụng hàng; v5.10 20260716 Đợt 3 chiến dịch NÂNG BẢO MẬT (swirling-jumping-pearl.md): sec.1→sec.8 — 0 cổng sec.* tồn tại trước đó nên đánh số tự do. sec.5 KHÔNG trùng resilience.8-error-leak (cổng cũ soi HTML đã build, cần .next) — sec.5 đọc thẳng error.tsx/global-error.tsx ở tầng NGUỒN, chạy được cả --source-only; v5.11 20260716 nghiệm thu độc lập ("Ngự Sử") vá 6 lỗ hổng thật trong sec.1-8: sec.2 false-PASS (guard heuristic bị `?.` optional-chaining đánh lừa, đổi sang parse đúng cấu trúc ternary) + sec.5 false-FAIL (strip console.error bằng regex không xử lý ngoặc lồng, đổi sang chỉ tính rò rỉ khi nằm trong JSX `{...}`) + sec.4 (thêm từ khoá CREDENTIAL, trừ tên public-key-theo-thiết-kế: PUBLISHABLE/SITE_KEY/CLIENT_ID/MAPS_KEY/RECAPTCHA) + sec.7 (cho phép --audit-level xuống dòng trong YAML `run: \|`) + sec.8 (thêm nhận diện `cookies()).set(`/`cookieStore.set(`/`document.cookie =`/`Cookies.set(` — idiom Next.js 16 phổ biến nhất trước đây bị bỏ lọt). Tất cả đã test tái hiện đúng kịch bản agent tìm được + verify 0 thay đổi output trên fixture/template thật (bug chỉ ở edge-case, không ảnh hưởng code hiện có); v5.12 20260719 đợt khám tổng thể Web Factory (88 phát hiện) phát hiện sec.1/sec.2 báo WARN thay vì FAIL khi next.config.ts/src/middleware.ts VẮNG MẶT HOÀN TOÀN — nghiêm trọng hơn "có nhưng sai" (0% hạ tầng bảo mật) nhưng lại được chấm nhẹ hơn vì WARN không chặn ngưỡng "0 FAIL". Ông duyệt nâng thành FAIL cho đúng 2 cổng này khi hạ tầng vắng mặt (sec.3/6/8 giữ nguyên — các cổng đó coi "chưa dùng tính năng" là N/A hợp lệ, khác bản chất với sec.1/2 vốn PHẢI có ở mọi web); v5.13 20260720 vá priv.28-consent-gate — khiếu nại mức Cao trong sổ đề xuất từ 12/07 (cổng kêu sai ở mọi web dùng ≥2 gate component khác nhau, vd <ConsentProvider> bọc UI banner + <AnalyticsGate> RIÊNG bọc tracking): .match() đơn chỉ bắt gate ĐẦU TIÊN trong layout.tsx, đổi sang matchAll duyệt hết mọi gate block. Verify: test tái hiện đúng kịch bản 2-gate (PASS đúng thay vì FAIL oan) + diff 0 thay đổi trên fixture/template (cả 2 chỉ có 1 gate, không chạm nhánh mới). v5.15 20260721 vá 5 cổng báo-oan/vá-phân-nửa từ sổ đề xuất vai 7 (12-16/07): mobile.28-input-zoom chỉ đo font-size TRÊN chính thẻ input/select/textarea hoặc rule CSS nhắm chúng (cũ grep cả trang → 35 trang WARN oan ở nhahoachdinh dù input thật ≥16px); mobile.29-safe-area quét THÊM inline style/HTML SSR (env() trong style={{}}/Tailwind arbitrary, không chỉ allCss); layout.42-font-count resolve chuỗi var() alias trước khi đếm (--font-x:var(--font-y) gộp về 1 khoá — cũ đếm 5 alias trỏ 3 font thật thành 5); aeo.11/aeo.12 dò CẢ src/data/qa-data.ts (scaffold đời cũ) không chỉ src/lib; mot.1-linear mở loại-trừ scroll-driven sang scroll() không chỉ view() + soi 300 ký tự CẢ 2 PHÍA (timeline có thể khai trước property). Đối chứng 2 chiều (CLAUDE.md #11): harness 11/11 mẫu đúng→PASS/mẫu sai→WARN + diff cũ↔mới trên template 0 đổi verdict (mot.1 4→3 WARN = loại đúng 1 scroll() thật template đang báo oan). v5.16 20260721 (đề xuất vai 7 /nang-cap-web nhahoachdinh): sec.2-csp-unsafe-eval nay dò CẢ src/proxy.ts + src/middleware.ts + bản root (Next 16.2.9+ đổi middleware.ts→proxy.ts) — web đã migrate proxy.ts trước đây FAIL oan dù CSP đủ 100%. Đối chứng 2 chiều: proxy.ts guarded→PASS · middleware unsafe-eval trần→FAIL · vắng cả 2→FAIL · template (có middleware.ts) 0 hồi quy. Template GIỮ middleware.ts vì ghim Next 16.2.4 (<16.2.9 chưa hỗ trợ proxy.ts), đã ghi lộ trình codemod vào src/middleware.ts. THÊM cổng seo.24-dynroute-sitemap: route động có generateStaticParams (sinh trang tĩnh thật) mà sitemap.ts không nhắc tới đoạn tĩnh cuối → WARN nghi sót (họ lỗi 17 trang tỉnh + danh-muc template). Đối chứng: template WARN đúng danh-muc sót → vá sitemap.ts thêm danh-muc từ CATEGORY_LABELS → PASS; fixture blog phủ→PASS, tỉnh sót→WARN. Chỉ WARN vì universe slug đôi khi từ CMS. THÊM cổng geo.23-llms-link-song: đối chiếu TĨNH từng link nội bộ trong public/llms.txt với tập route thật (page tĩnh + mẫu route động + route-handler + sitemap.ts/robots.ts) — link không khớp = WARN nghi chết (2/9 link nhahoachdinh trỏ route chết mà geo.21 chỉ đo độ dài bỏ lọt). Bỏ qua domain ngoài, không crawl HTTP (offline). Đối chứng: template 5 link→PASS; fixture khớp mẫu /blog/[slug]+route-handler+sitemap, bắt đúng 1 link chết, bỏ link google.com ngoài.) v5.17 20260722 (đợt SEO cổ điển + llms.txt động, phiên /seo-toan-dien): geo.21-llms-txt/geo.23-llms-link-song nay ưu tiên nhận src/app/llms.txt/route.ts sinh ĐỘNG (chuẩn hiện hành) thay vì chỉ đọc public/llms.txt tĩnh — web cũ chưa migrate vẫn được nhận qua file tĩnh, geo.23 bỏ qua đối chứng link khi đã có route động vì link luôn khớp route thật by construction. THÊM 6 cổng SEO cổ điển (đúc kết từ đối chiếu SEOmator/seo-audit-skill open-source): seo.30-title-length (30-60 ký tự) · seo.31-desc-length (120-160 ký tự) · seo.32-h1-single (đúng 1 H1/trang) · seo.33-heading-hierarchy (không nhảy cấp, chỉ soi <main>) · seo.34-title-unique (title không trùng giữa trang) · seo.36-internal-link-density (≥2 link nội bộ trong <main>, chống trang mồ côi). Đối chứng 2 chiều đủ cho cả 8 cổng mới/sửa.
// F27 (LÔ 3, 20260713): cờ --source-only cho phép chạy ~11+ cổng đọc nguồn (site-config.ts,
// globals.css, DESIGN-DNA.md...) TRƯỚC khi có bản build — không đòi .html. Cờ --only=<id,...>
// lọc báo cáo về đúng id cần (F28 dùng gọi thẳng deadlink.1-internal ở B3b không cần .next).
// Chế độ MẶC ĐỊNH (không truyền cờ nào) giữ NGUYÊN hành vi cũ — không đổi gì cho web đang chạy CI.
const argsRaw = process.argv.slice(2);
const SOURCE_ONLY = argsRaw.includes('--source-only');
const ONLY_IDS = (argsRaw.find(a => a.startsWith('--only=')) || '').replace('--only=', '').split(',').filter(Boolean);
// VAN 30/08/2026 — CỜ SAI PHẢI CHẾT TO, KHÔNG ĐƯỢC IM.
// Đúc từ lỗi thật: 2 skill (/nang-tc-vn, /nang-tc-qt) dạy `--only <id>` (thiếu dấu bằng) suốt thời
// gian dài. Máy KHÔNG khớp cờ ⇒ lặng lẽ BỎ BỘ LỌC và chạy TOÀN BỘ cổng: `--only seo.2-head` ra
// `29 PASS · 1 WARN · 1 FAIL` trong khi `--only=seo.2-head` đúng chỉ ra `1 PASS`. Người gọi tưởng
// đang chấm 1 tiêu chí, thật ra đang đọc điểm của mọi tiêu chí khác — GÁN NHẦM ĐIỂM, nguy hơn xanh
// giả vì con số trông vẫn hợp lý nên không ai nghi. Cùng họ với `lesson_cong_bat_0_loi_that_la_cong_rong`.
{
  const loi = [];
  if (argsRaw.includes('--only')) loi.push("`--only` THIẾU DẤU BẰNG — phải viết `--only=id1,id2`. Viết rời sẽ bị bỏ qua và máy chạy TOÀN BỘ cổng.");
  for (const a of argsRaw) {
    if (a.startsWith('--only=')) {
      // Van này TỪNG BÁO OAN chính cổng của mình (vá 05/09/2026): nó đoán "không có dấu chấm hay
      // gạch ngang ⇒ là tên trụ" — nhưng có cổng THẬT tên trần là `viewport`. Hậu quả:
      // `--only=viewport` bị máy chặn, nên tiêu chí must=1 chống-lỗi-viewport ĐANG ĐƯỢC TÍNH là đã
      // máy hoá lại KHÔNG đo lại được bằng đúng lệnh mà skill dạy; `regression-luat.mjs` cũng vì
      // thế mà báo 1 gate LỖI suốt. Nay máy ĐỌC DANH SÁCH CỔNG CỦA CHÍNH MÌNH thay vì đoán —
      // đoán bằng hình dạng chuỗi là cách van chống-gõ-nhầm quay ra cắn người dùng đúng.
      const idThat = new Set([...readFileSync(fileURLToPath(import.meta.url), 'utf8').matchAll(/\badd\('([^']+)'/g)].map(m => m[1]));
      const xau = a.slice(7).split(',').filter(Boolean).filter(x => !idThat.has(x) && !/[.\-]/.test(x));
      if (xau.length) loi.push(`\`--only=\` nhận ID CỔNG (vd \`seo.2-head\`), KHÔNG nhận tên trụ. Không phải id cổng: ${xau.join(', ')} — lọc ra 0 cổng, máy sẽ báo sạch trơn.`);
    }
  }
  if (loi.length) {
    console.error('\n⛔ CỜ DÒNG LỆNH SAI — máy DỪNG thay vì trả kết quả lạc đề:\n' + loi.map(x => '   • ' + x).join('\n') +
      '\n\n   Cách dùng đúng: node check-luat.mjs <thư-mục-build> [--source-only] [--only=id1,id2]\n');
    process.exit(2);
  }
}
// F45 (LÔ 5 nhóm A, 20260713): --update-snapshot GHI lại snapshot nội dung/route hiện tại (dùng
// sau khi B4 commit đã kiểm chắc không mất gì). KHÔNG bật mặc định — máy kiểm vốn "không sửa gì,
// chỉ đọc" (xem header file), nên việc ghi state là hành vi TÙY CHỌN, phải gọi rõ ràng.
const UPDATE_SNAPSHOT = argsRaw.includes('--update-snapshot');
const DIR = argsRaw.find(a => !a.startsWith('--'));
if (!DIR || !existsSync(DIR)) { console.error('Cách dùng: node check-luat.mjs <thư-mục-build> [--source-only] [--only=id1,id2] [--update-snapshot]'); process.exit(2); }

// Danh sách cổng "nguồn-thuần" đã VALIDATE bằng tay (F27): kết quả khi chạy --source-only trên
// project root TRÙNG với kết quả khi chạy full trên bản build cùng project (chứng cứ ở
// _NHAT-KY/nang-cap-2-skill/lo3-doi-chieu-nguon-thuan.txt). KHÔNG tự thêm id vào đây khi chưa
// đối chiếu lại bằng tay — thêm nhầm = báo PASS giả (rủi ro hơn không báo gì).
const NGUON_THUAN_IDS = [
  'aes.23-brandsync', 'aes.29-fontsync', 'aes.40-botokensync', 'aes.32-cliche',
  'hoavan.1-nguon-van-hoa', 'exp.19-mauneo-giay', 'logo.1-farmstay-default',
  // 20260728 RÚT `aeo.12-qa-40-60tu` khỏi danh sách này: cổng nay đọc FAQ từ HTML build (khối
  // FAQPage) nên --source-only KHÔNG còn cho kết quả trùng bản full — giữ trong đây là khai man.
  'dep.1-import-khop-package', 'priv.28-consent-gate', 'layout.24-spacing-boi8',
  'a11y.25-contrast', 'exp.25-score-filled', 'exp.26-mau-ong-chon', 'exp.27-mau-khop-luachon',
  'exp.29-sodo-ong-chon', 'exp.31-archetype-ready', 'exp.32-phaply-ton-tai',
  'layout.41-lh-headline-vn', 'layout.42-font-count-vn', // F20/F21 LÔ 9 20260714 — đối chiếu tay OK (báo cáo dưới)
  'seo.24-dynroute-sitemap', // 20260721 — chỉ đọc src/app (page.tsx) + sitemap.ts, không đụng html/css
  'mot.12-tuong-phan-chu-animate', // 20260803 — chỉ đọc tệp .tsx nguồn (recipe motion), không đụng html/css
  'geo.23-llms-link-song',   // 20260721 — chỉ đọc public/llms.txt + src/app + site-config, không đụng html/css
  'sec.1-header-baseline', 'sec.2-csp-unsafe-eval', 'sec.3-ratelimit-post', 'sec.4-no-secret-in-public-env',
  'sec.5-error-no-stack-source', 'sec.6-form-honeypot-server', 'sec.7-ci-npm-audit', 'sec.8-cookie-via-helper',
  // 20260811 — sec.9 chỉ đọc next.config.* + middleware/proxy (nguồn), không đụng html/css: đối chiếu
  // tay OK, chạy --source-only cho kết quả trùng bản đầy đủ.
  'sec.9-csp-referrer',
  // Đợt 3 chiến dịch NÂNG BẢO MẬT 20260716: cả 8 cổng chỉ đọc source (next.config.ts/middleware.ts/
  // route.ts/error.tsx/.env.example/workflows), không đụng htmls/csss — đối chiếu tay --source-only
  // vs full trên cotichlua-test-nangcap-vn (.kiem-snapshot) VÀ trên chính 05-TEMPLATE-CHUAN: 2 lần
  // đều ra KẾT QUẢ GIỐNG HỆT (6P·2W·0F fixture; 8P·0W·0F template).
];

// F01b (LÔ 9 đợt 2, 20260714): 5 id đổi tên vì mượn nhầm số của trụ khác — bảng tra id CŨ→MỚI
// để báo cáo/log quá khứ (đã lưu id cũ) vẫn dò lại được ý nghĩa. Không dùng ở logic runtime nào —
// thuần tài liệu tra cứu.
const ID_ALIAS_F01b = {
  'aes.30-botokensync': 'aes.40-botokensync',
  'aes.31-kicker-mono': 'aes.41-kicker-mono',
  'layout.1-container': 'layout.23-container',
  'layout.21-spacing-boi8': 'layout.24-spacing-boi8',
  'exp.30-mauneo-giay': 'exp.19-mauneo-giay',
  // Rà soát lại 14/07/2026: exp.30 vẫn còn va chạm — 1 cổng CŨ có sẵn từ trước đợt
  // (exp.30-sodo-route-hop-le) + 1 cổng MỚI tự LÔ 7 vô tình chọn trùng số (exp.30-so-mau-that).
  // exp chỉ có 18 mục thật trong luật gốc — cả 2 đều là số ảo, đổi sang số trống kế tiếp.
  'exp.30-sodo-route-hop-le': 'exp.20-sodo-route-hop-le',
  'exp.30-so-mau-that': 'exp.21-so-mau-that',
};

// ---------- gom file ----------
// F27: chế độ --source-only KHÔNG đi bộ toàn cây (project root có node_modules/.next rất nặng và
// không cần) — chỉ dựa vào globalsCss (đọc thẳng src/app/globals.css, xem dưới) + đọc file nguồn
// trực tiếp trong từng cổng. htmls/csss để rỗng có chủ đích.
const files = [];
if (!SOURCE_ONLY) (function walk(d){ for (const f of readdirSync(d)) {
  const p = join(d, f); const s = statSync(p);
  if (s.isDirectory()) { if (!/node_modules|\.git/.test(f)) walk(p); }
  else if (['.html', '.css'].includes(extname(f))) files.push(p);
}})(DIR);
const htmlsRaw = files.filter(f => f.endsWith('.html')).map(f => ({ f, src: readFileSync(f, 'utf8') }));
let csss  = files.filter(f => f.endsWith('.css' )).map(f => ({ f, src: readFileSync(f, 'utf8') }));
if (!SOURCE_ONLY && !htmlsRaw.length) { console.error('❌ FAIL: Không tìm thấy .html — với Next.js hãy trỏ vào .kiem-snapshot/ (chạy snapshot-routes.mjs trước) hoặc export/prerender/'); process.exit(1); }

// Guard "0 trang thật = FAIL" (A1, audit gomnhalua 10/07/2026): .next/ khi CSP nonce bắt render
// động chỉ còn lại trang LỖI (_global-error, 500, 404, _not-found) — nếu TOÀN BỘ htmls quét được
// đều là trang lỗi thì không có gì thật để chấm, phải FAIL ngay thay vì chạy 25 cổng trên dữ liệu rỗng.
// Bỏ qua guard này ở --source-only: chưa build thì dĩ nhiên chưa có .html, đó là điều kiện bình thường.
const TRANG_LOI_RE = /_global-error|(^|\/)500\.html$|(^|\/)404\.html$|_not-found/i;
const htmls = htmlsRaw.filter(h => !TRANG_LOI_RE.test(h.f));
if (!SOURCE_ONLY && !htmls.length) {
  console.error(`❌ FAIL: ${htmlsRaw.length} .html quét được đều là trang LỖI (${htmlsRaw.map(h => h.f).join(', ')}) — không có trang thật nào để kiểm.`);
  console.error('   → Với Next.js dynamic render (CSP nonce): chạy `npm run check:luat` từ trong thư mục web (script này tự snapshot rồi trỏ vào .kiem-snapshot/; web mới KHÔNG có tệp .mjs cục bộ — rsync loại từ 21/07/2026)');
  process.exit(1);
}
// F1 (audit 12/07 đợt 2): khi quét .kiem-snapshot/ (quy trình BẮT BUỘC cho Next.js), CSS thật nằm ở
// chunk /_next/static ngoài snapshot → csss=[] và allCss chỉ còn <style> critical inline. Hệ quả:
// aes.27-banned bỏ lọt font cấm (PASS oan) + layout.18-wrap báo thiếu text-wrap (WARN oan). Bù bằng
// cách đọc THẲNG src/app/globals.css (+ @import 1 tầng, bỏ comment, seen-set) từ project gốc — đúng
// cách cổng a11y.25 vẫn làm. (Không thay được chunk minified nhưng phủ nguồn luật quan trọng nhất.)
/**
 * BỎ CHÚ THÍCH — bộ quét CÓ TRẠNG THÁI, NGUỒN DUY NHẤT cho mọi cổng. Đặt ở đây để không cổng nào
 * phải tự chế lại (một luật chép ở nhiều nơi = vá một nơi, hở những nơi kia).
 *
 * VÌ SAO PHẢI CÓ (sự cố thật 11→15/08/2026): trước đây mỗi cổng tự bỏ chú thích bằng biểu thức mẫu
 * `/\/\*[\s\S]*?\*\//g`. Biểu thức mẫu KHÔNG phân biệt nổi chuỗi với chú thích, nên chuỗi
 * `"https://*.tile.openstreetmap.org"` (có `/` và `*` liền nhau) bị hiểu là MỞ chú thích khối, rồi
 * ngoạm tới dấu-đóng-chú-thích thật ở cuối tệp — nuốt trọn dòng khai Content-Security-Policy.
 * (KHÔNG viết dấu đóng đó ra đây dạng ký tự: nó sẽ đóng sớm chính chú thích này — vừa trả giá
 * đúng lỗi ấy lúc viết, 15/08/2026.) Hậu quả: cổng
 * sec.9 báo oan "template thiếu CSP" suốt 4 ngày, lời báo oan đó đi vào sổ, vào memory, rồi thành
 * câu hỏi trình lên Ông. CỔNG SAI NGUY HIỂM HƠN KHÔNG CÓ CỔNG, VÌ NÓ ĐƯỢC TIN.
 *
 * @param {string} s    mã nguồn cần bỏ chú thích
 * @param {'js'|'css'}  kieu — 'js' cắt cả `//…` tới hết dòng · 'css' KHÔNG cắt `//`
 *                      (CSS không có chú thích dòng; cắt là ăn mất `url(https://…)`).
 */
function boChuThichChung(s, kieu = 'js') {
  let out = '', i = 0; const n = s.length;
  while (i < n) {
    const c = s[i], c2 = s[i + 1];
    // Trong dấu nháy thì KHÔNG có chú thích nào cả — chép nguyên văn. Đây đúng chỗ biểu thức
    // mẫu bị mù, vì mọi địa chỉ mạng đều nằm trong chuỗi.
    if (c === '"' || c === "'" || c === '`') {
      out += c; i++;
      while (i < n) {
        if (s[i] === '\\') { out += s[i] + (s[i + 1] ?? ''); i += 2; continue; }
        out += s[i];
        if (s[i] === c) { i++; break; }
        i++;
      }
      continue;
    }
    if (c === '/' && c2 === '*') { i += 2; while (i < n && !(s[i] === '*' && s[i + 1] === '/')) i++; i += 2; continue; }
    if (kieu === 'js' && c === '/' && c2 === '/') { while (i < n && s[i] !== '\n') i++; continue; }
    out += c; i++;
  }
  return out;
}

const globalsCss = (() => {
  let d = DIR;
  for (let i = 0; i < 5; i++) {
    const gp = join(d, 'src/app/globals.css');
    if (existsSync(gp)) {
      let acc = '', queue = [readFileSync(gp, 'utf8')]; const seen = new Set(); const baseDir = dirname(gp);
      while (queue.length) {
        const txt = queue.shift(); acc += '\n' + txt;
        for (const m of boChuThichChung(txt, 'css').matchAll(/@import\s+['"]([^'"]+)['"]/g)) {
          const ip = join(baseDir, m[1]);
          if (seen.has(ip) || !existsSync(ip)) continue;
          seen.add(ip); queue.push(readFileSync(ip, 'utf8'));
        }
      }
      return acc;
    }
    d = join(d, '..');
  }
  return '';
})();
const allCss = csss.map(c => c.src).join('\n') + htmls.map(h => (h.src.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || []).join('\n')).join('\n') + '\n' + globalsCss;

// văn bản nhìn thấy (bỏ script/style/thẻ/comment) — heuristic đủ dùng cho kiểm tĩnh
const visText = h => h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ');

// nội dung trong <main>...</main> — dùng cho cổng SEO cổ điển (heading/link) để loại nhiễu
// Navbar/Footer lặp lại ở MỌI trang; không có <main> (trang lỗi/lạ) → fallback cả trang.
const mainOf = h => (h.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || [null, h])[1];
// content="..." của 1 thẻ <meta> theo tên, KHÔNG phụ thuộc thứ tự thuộc tính name=/content=.
const metaContent = (h, name) => {
  for (const m of h.matchAll(/<meta\s+([^>]*)>/gi)) {
    const attrs = m[1];
    if (new RegExp(`\\bname=["']${name}["']`, 'i').test(attrs)) {
      const c = attrs.match(/\bcontent=["']([^"']*)["']/i);
      if (c) return c[1];
    }
  }
  return null;
};

// ---------- khung chấm ----------
const __T0 = Date.now();
// Đặt CHECK_LUAT_TRACE=1 để in tiến độ TỪNG cổng ra stderr — công cụ CHẨN ĐOÁN khi máy kiểm treo:
// cổng CUỐI in ra = cổng NGAY TRƯỚC chỗ treo (chính cách khoanh được bug @import phình RAM 12/07/2026).
const R = []; const add = (id, level, msg) => {
  if (process.env.CHECK_LUAT_TRACE) process.stderr.write(`+${((Date.now() - __T0) / 1000).toFixed(1)}s ${id} ${level}\n`);
  R.push({ id, level, msg });
};
const per = (arr, fn) => arr.flatMap(({ f, src }) => { const r = fn(src, f); return r ? [ { f, ...r } ] : []; });

// 1. aes.34 — ngoặc thẳng trong văn bản
{ const bad = per(htmls, (s, f) => { const t = visText(s); const n = (t.match(/(^|[\s(])["'](?=\S)/g) || []).length; return n ? { n } : null; });
  bad.length ? add('aes.34-quote', 'WARN', `Ngoặc thẳng còn trong văn bản: ${bad.map(b => `${b.f}(${b.n})`).slice(0,5).join(', ')} → chạy hàm tinhChinh() (RECIPE 02 B5)`) : add('aes.34-quote', 'PASS', 'Không còn ngoặc thẳng trong văn bản'); }

// 2. aes.34 — '...' thay vì …
{ const bad = per(htmls, s => { const n = (visText(s).match(/\.\.\./g) || []).length; return n ? { n } : null; });
  bad.length ? add('aes.34-ellipsis', 'WARN', `Còn "..." thay vì "…" ở ${bad.length} trang`) : add('aes.34-ellipsis', 'PASS', 'Ba chấm dùng ký tự …'); }

// 3. aes.32 — nhấn chồng strong><em
{ const bad = per(htmls, s => { const n = (s.match(/<strong[^>]*>\s*<em|<em[^>]*>\s*<strong/gi) || []).length; return n ? { n } : null; });
  bad.length ? add('aes.32-double', 'FAIL', `Nhấn chồng đậm+nghiêng ở ${bad.map(b => b.f).slice(0,5).join(', ')}`) : add('aes.32-double', 'PASS', 'Không nhấn chồng đậm+nghiêng'); }

// 4. aes.32 — gạch chân ngoài link (CSS heuristic)
{ const m = allCss.match(/([^{}]+)\{[^}]*text-decoration[^}:;]*:\s*underline[^}]*\}/g) || [];
  const bad = m.filter(r => !/(^|[\s,>~+)])a[\s.:,#[{]|\ba\b/.test(r.split('{')[0]));
  bad.length ? add('aes.32-underline', 'WARN', `${bad.length} rule gạch chân không thuộc thẻ a — kiểm tay`) : add('aes.32-underline', 'PASS', 'Gạch chân chỉ ở link'); }

// 5. aes.33 — uppercase thiếu letter-spacing (trong cùng block)
{ const m = allCss.match(/\{[^}]*text-transform\s*:\s*uppercase[^}]*\}/g) || [];
  const bad = m.filter(b => !/letter-spacing/.test(b));
  bad.length ? add('aes.33-caps', 'WARN', `${bad.length} block uppercase thiếu letter-spacing (+.05–.12em)`) : add('aes.33-caps', 'PASS', 'Uppercase đều có giãn chữ'); }

// 6. aes.28 — đếm họ font thật dùng
{ const fams = new Set((allCss.match(/@font-face\s*\{[^}]*font-family\s*:\s*['"]?([^'";}]+)/g) || []).map(x => x.replace(/.*font-family\s*:\s*['"]?/, '').trim().replace(/[\s-]?fallback$/i, '')));
  fams.size > 3 ? add('aes.28-fonts', 'WARN', `${fams.size} họ @font-face (${[...fams].join(', ')}) — chuẩn ≤2 (+mono)`) : add('aes.28-fonts', 'PASS', `Họ chữ: ${[...fams].join(', ') || '(system)'}`); }

// 7. aes.27 — cấm font trong luật stack
{ /space grotesk|(?<![-\w])inter(?!\s*tight)(?![-\w])/i.test(allCss.match(/font-family[^;}]*/gi)?.join(' ') || '')
    ? add('aes.27-banned', 'FAIL', 'Phát hiện Space Grotesk/Inter — luật stack cấm')
    : add('aes.27-banned', 'PASS', 'Không dùng font bị cấm'); }

// 8. layout.18 — có <table>/giá mà thiếu tabular-nums
{ const hasTable = htmls.some(h => /<table/i.test(h.src));
  if (hasTable) /tabular-nums/.test(allCss) ? add('layout.18-num', 'PASS', 'Bảng có tabular-nums') : add('layout.18-num', 'WARN', 'Có <table> nhưng CSS thiếu font-variant-numeric:tabular-nums');
  else add('layout.18-num', 'PASS', 'Không có bảng — N/A'); }

// 8b. aes.35 — F15 (LÔ 4, 20260713): hero dùng clamp() cho font-size (Điều 8 — chống vỡ chữ
// mobile↔desktop). Heuristic tĩnh: tìm block CSS có selector chứa "hero", nếu có khai font-size
// thì phải dùng clamp(); không có block hero nào trong CSS → N/A (hero có thể chỉ dùng Tailwind
// class inline, cổng này không quét được JSX — chỉ bắt CSS tùy biến, để WARN tránh báo oan).
{ const heroBlocks = allCss.match(/[^{}]*hero[^{}]*\{[^}]*\}/gi) || [];
  const withFontSize = heroBlocks.filter(b => /font-size\s*:/.test(b));
  const missingClamp = withFontSize.filter(b => !/font-size\s*:\s*clamp\(/.test(b));
  if (!withFontSize.length) add('aes.35-hero-clamp', 'PASS', 'Không có CSS tùy biến font-size cho hero (hoặc dùng class Tailwind — ngoài phạm vi cổng tĩnh) — N/A');
  else missingClamp.length
    ? add('aes.35-hero-clamp', 'WARN', `${missingClamp.length} block hero khai font-size không dùng clamp() — nguy cơ vỡ chữ mobile/desktop (Điều 8)`)
    : add('aes.35-hero-clamp', 'PASS', 'Hero dùng clamp() cho font-size'); }

// 9. mot.6/exp.7 — prefers-reduced-motion phải tồn tại nếu có animation
{ const hasAnim = /@keyframes|animation\s*:|transition\s*:/.test(allCss);
  if (hasAnim) /prefers-reduced-motion/.test(allCss) ? add('mot.6-reduced', 'PASS', 'Có khối prefers-reduced-motion') : add('mot.6-reduced', 'FAIL', 'Có animation nhưng KHÔNG có prefers-reduced-motion');
  else add('mot.6-reduced', 'PASS', 'Không animation — N/A'); }

// 10. mot.1 — linear trong transition/animation (trừ progress/marquee khó phân biệt → WARN)
// F-mot1 (20260713): loại trừ animation-timeline:view() — linear là ĐÚNG chuẩn khi animation
// chạy theo tiến độ cuộn (timeline chính là "easing" tự nhiên), không phải easing time-based lỗi.
// 20260721 (sổ đề xuất #1 vá phân nửa): mở rộng loại trừ sang cả scroll() — scroll-driven khai bằng
// `animation-timeline: scroll(...)` cũng hợp lệ y hệt view(); soi cả 300 ký tự TRƯỚC lẫn SAU vì
// khai timeline có thể đứng trước property animation trong cùng khối rule.
{ const linearMatches = [...allCss.matchAll(/(transition|animation)[^;}]*\blinear\b/g)];
  const n = linearMatches.filter(m => {
    const windowAround = allCss.slice(Math.max(0, m.index - 300), m.index + 300);
    return !/animation-timeline\s*:\s*(view|scroll)\(/.test(windowAround);
  }).length;
  n ? add('mot.1-linear', 'WARN', `${n} chỗ dùng easing linear — chỉ hợp progress/marquee`) : add('mot.1-linear', 'PASS', 'Không lạm dụng linear'); }

// 10b. mot.13 — ĐƯỜNG NẠP kho hiệu ứng CSS (thêm 08/08/2026)
// Vì sao phải có: đường ống kho→web (dong-bo-effects.mjs) CHÉP ĐƯỢC tệp effects.css tới web,
// nhưng tệp CSS chỉ sống khi globals.css @import nó. Bản cũ chỉ NHẮC BẰNG CHỮ nên không ai
// bắt được chỗ hở: đo 08/08 có 12/20 web mang tệp khớp kho 100% mà KHÔNG nạp ⇒ toàn bộ 32 lớp
// fx-* nằm chết, trong khi bảng điều khiển báo "khớp 20/20 · lệch 0" — xanh giả suốt.
// FAIL (không WARN) vì đây là lỗi CÂM: web trông vẫn chạy, chỉ là mọi hiệu ứng biến mất lặng lẽ.
{
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app'))) return d; d = join(d, '..'); } return null; })();
  const fxPath = root ? join(root, 'src/app/effects.css') : null;
  const gPath = root ? ['src/app/globals.css', 'src/styles/globals.css', 'app/globals.css'].map(p => join(root, p)).find(p => existsSync(p)) : null;
  if (!root) add('mot.13-effects-nap', 'WARN', 'Không tìm thấy thư mục src/ để kiểm đường nạp kho hiệu ứng');
  else if (!fxPath || !existsSync(fxPath)) add('mot.13-effects-nap', 'PASS', 'Web chưa vendor src/app/effects.css — N/A (chạy dong-bo-effects.mjs nếu muốn nhận kho)');
  else if (!gPath) add('mot.13-effects-nap', 'WARN', 'Có effects.css nhưng không tìm thấy globals.css để đối chiếu đường nạp');
  else {
    const cssG = readFileSync(gPath, 'utf8');
    // Đếm lớp DUY NHẤT: một lớp có thể xuất hiện nhiều dòng (.fx-x, .fx-x:hover, .fx-x::after),
    // đếm theo dòng sẽ thổi phồng con số Ông đọc (61 thay vì 30 lớp thật).
    const soLop = new Set(readFileSync(fxPath, 'utf8').match(/^\.fx-[a-z0-9-]+/gm) || []).size;
    const sach = boChuThichChung(cssG, 'css');            // bỏ chú thích trước khi đo vị trí
    const mImp = sach.match(/@import\s+(?:url\()?\s*["'][^"']*effects\.css["']/);
    // ĐƯỜNG NẠP THỨ HAI (thêm 12/08/2026): nạp THEO TRANG — component tự `import "…/effects.css"`.
    // Vì sao phải nhận: nạp qua globals.css bắt CẢ web tải kho hiệu ứng, kể cả trang không dùng
    // lớp fx- nào. Đo thật ở nhahoachdinh 12/08: 3/51 trang dùng fx-*, mà 51 trang đều gánh 23 KiB
    // ⇒ CSS gửi xuống 87 KiB chỉ dùng 16 KiB. Tách sang import theo trang là ĐÚNG hướng, nhưng
    // bản cũ của cổng chỉ biết một đường nên tố oan "fx-* nằm chết".
    // Ranh giới vẫn HẸP để không bịt lỗi thật: phải có tệp nguồn thực sự import đúng effects.css
    // thì mới tha — không có ai import thì vẫn FAIL như cũ.
    const tepNap = [];
    if (!mImp) {
      (function quet(d, sau = 0) {
        if (sau > 6) return;
        let ds = []; try { ds = readdirSync(d, { withFileTypes: true }); } catch { return; }
        for (const e of ds) {
          const p = join(d, e.name);
          if (e.isDirectory()) { if (!/node_modules|\.next|dist|\.git/.test(e.name)) quet(p, sau + 1); }
          else if (/\.(tsx?|jsx?)$/.test(e.name)) {
            try {
              if (/^\s*import\s+["'][^"']*effects\.css["']/m.test(readFileSync(p, 'utf8'))) tepNap.push(relative(root, p));
            } catch { /* tệp đọc không được thì bỏ qua */ }
          }
        }
      })(join(root, 'src'));
    }
    if (!mImp && tepNap.length) {
      add('mot.13-effects-nap', 'PASS', `Kho hiệu ứng nạp THEO TRANG (${soLop} lớp fx-*) — ${tepNap.length} tệp tự import effects.css: ${tepNap.slice(0, 3).join(' · ')}${tepNap.length > 3 ? ` …+${tepNap.length - 3}` : ''}. Trang không dùng fx-* thì không phải tải, nhẹ hơn nạp qua globals.css`);
    } else if (!mImp) {
      add('mot.13-effects-nap', 'FAIL', `Có src/app/effects.css (${soLop} lớp fx-*) nhưng ${relative(root, gPath)} KHÔNG @import và KHÔNG tệp nguồn nào tự import ⇒ toàn bộ lớp fx-* nằm chết. Vá: node Web/CODEWEB/dong-bo-effects.mjs --web=Web/<domain> --ghi`);
    } else {
      const viTriRule = sach.indexOf('{');                          // rule CSS đầu tiên
      (viTriRule !== -1 && mImp.index > viTriRule)
        ? add('mot.13-effects-nap', 'FAIL', `@import effects.css nằm SAU rule CSS đầu tiên trong ${relative(root, gPath)} — CSS bắt mọi @import đứng trước mọi rule, đặt sau là trình duyệt BỎ IM LẶNG`)
        : add('mot.13-effects-nap', 'PASS', `globals.css @import effects.css đúng vị trí — ${soLop} lớp fx-* tới được trình duyệt`);
    }
  }
}

// 11. aes.36/mobile/a11y — TEXT ALTERNATIVE cho ẢNH và ICON (WCAG 1.1.1) + kích thước chống CLS
// LÁT 2 dây chuyền máy hoá (03/08/2026): cổng cũ soi ĐÚNG 1 mệnh đề của tiêu chí luật "Mọi ảnh/icon
// có text alternative hợp lý" — chỉ đếm <img> thiếu thuộc tính alt. Bỏ lọt 5 mệnh đề:
//   (a) icon <svg> — KHÔNG phải thẻ <img> nên vô hình hoàn toàn với cổng cũ (template có 29 cái);
//   (b) <input type="image"> — WCAG 1.1.1 nêu đích danh;
//   (c) phần tử khai role="img" mà không có tên;
//   (d) alt RÁC ("image"/"photo"/tên tệp) — có alt nhưng KHÔNG "hợp lý" như tiêu chí đòi;
//   (e) ảnh/icon là nội dung DUY NHẤT của link/nút mà không có tên khả truy cập — đây là chỗ
//       alt="" (hợp lệ cho ảnh trang trí) BIẾN THÀNH lỗi thật: trình đọc màn hình đọc ra link rỗng.
// TÁCH MỨC theo hậu quả thật: mất hẳn text alternative / link không tên → FAIL; chất lượng alt và
// icon trần → WARN (nâng bừa lên FAIL ⇒ mọi web đỏ oan ⇒ cổng bị phớt lờ — bệnh "cổng đỏ vĩnh viễn").
// RANH GIỚI, không nhận vơ: alt có MÔ TẢ ĐÚNG bức ảnh hay không là mắt-Ông, máy không phán; ảnh nền
// CSS background-image mang thông tin cũng ngoài tầm HTML tĩnh.
// [[CẦN-DỮ-KIỆN]] trong alt CỐ Ý không tính ở đây — cổng content.0-placeholder đã sở hữu lỗi đó,
// một lỗi chỉ nên có một cổng chủ, tránh báo trùng làm loãng.
{ let noAlt = 0, inputImgNoAlt = 0;
  const altRac = [], svgTran = [], roleImgTran = [], linkKhongTen = [], hoCho = [];
  // ---- LÔ 4 (09/08/2026): phép đo "có giữ chỗ chống nhảy bố cục" dùng chung cho ảnh VÀ media ----
  // Bốn lối giữ chỗ đều HỢP LỆ, thiếu lối nào cũng thành báo oan:
  //   (1) thuộc tính width + height trên chính thẻ
  //   (2) aspect-ratio trong style nội tuyến
  //   (3) lớp tiện ích aspect-* (aspect-video/aspect-square/aspect-[16/9])
  //   (4) data-nimg="fill" — next/image lấp đầy khung cha, cha đã giữ chỗ
  // Lối (5) là KHUNG CHA giữ chỗ còn thẻ con chỉ `absolute inset-0 w-full h-full` — khuôn nhúng
  // đáp ứng phổ biến nhất và HOÀN TOÀN ĐÚNG. Soi riêng thẻ con sẽ chấm oan cả khuôn này, nên phải
  // ngó ngược 320 ký tự trước thẻ tìm dấu giữ chỗ của cha (kể cả mẹo padding-bottom đời cũ).
  const CHO_TREN_THE = t => (/\bwidth\s*=/.test(t) && /\bheight\s*=/.test(t))
    || /aspect-ratio/.test(t) || /aspect-(video|square|\[)/.test(t) || /data-nimg="fill"/.test(t);
  const coChoGiu = (t, src, vt) => CHO_TREN_THE(t)
    || (vt > 0 && /aspect-ratio|aspect-(video|square|\[)|padding-bottom\s*:/.test(src.slice(Math.max(0, vt - 320), vt)));
  const ALT_RAC_RE = /^(image|images|img|photo|picture|pic|graphic|thumbnail|thumb|banner|icon|logo|screenshot|untitled|placeholder|alt|alt text|spacer|blank|ảnh|hình|hình ảnh|anh|hinh)$/i;
  const TEN_TEP_RE = /\.(jpe?g|png|webp|avif|gif|svg)\s*$/i;
  const CO_NHAN = /\baria-label\s*=\s*("[^"]+"|'[^']+')/i, CO_LABELLEDBY = /\baria-labelledby\s*=\s*("[^"]+"|'[^']+')/i;
  // BỘ LỌC CHỐNG BÁO OAN — aria-hidden ở thẻ TỔ TIÊN ẩn cả cây con: một <svg> trần nằm trong
  // <div aria-hidden> là ĐÚNG chuẩn, không phải icon trần. Bản đầu của cổng này soi thuộc tính của
  // riêng thẻ <svg> nên báo oan cả 5 icon của template gốc (đều nằm trong m.div/m.span aria-hidden).
  // Nghi MÁY trước khi nghi dữ liệu — template đúng, cổng sai (bài học "cổng đỏ vĩnh viễn").
  // Bộ lọc này CÓ mẫu đối chứng riêng chứng minh nó không nuốt lỗi thật: fixtures/img-alt/
  // fail-svg-tran-ngoai-vung-an (svg trần đứng NGOÀI khối aria-hidden vẫn phải bị bắt).
  const vungAnDi = (src) => {
    const OK_BOC = /^(div|span|section|aside|nav|header|footer|li|ul|ol|p|a|button|svg|figure|picture|main|article|td|th|label|small|strong|em|i|b)$/i;
    const vung = []; const re = /<([a-z][\w-]*)\b[^>]*\baria-hidden\s*=\s*("true"|'true')[^>]*>/gi; let m;
    while ((m = re.exec(src))) {
      if (!OK_BOC.test(m[1]) || /\/>\s*$/.test(m[0])) continue;
      const con = new RegExp(`<${m[1]}\\b|</${m[1]}\\s*>`, 'gi'); con.lastIndex = m.index + m[0].length;
      let sau = 1, k; while (sau > 0 && (k = con.exec(src))) sau += k[0][1] === '/' ? -1 : 1;
      if (sau === 0) vung.push([m.index, con.lastIndex]);
    }
    return vung; };
  htmls.forEach(h => {
    const anDi = vungAnDi(h.src);
    const biAn = (i) => anDi.some(([a, b]) => i > a && i < b);
    // Con trỏ chạy tuần tự: hai thẻ GIỐNG HỆT nhau mà dùng indexOf(t) thì cái sau tra trúng vị trí
    // cái trước ⇒ tra nhầm khung cha (cha của thẻ 1 giữ chỗ, thẻ 2 không, vẫn được tha).
    let tuVt = 0;
    (h.src.match(/<img\b[^>]*>/gi) || []).forEach(t => {
      const viTri = h.src.indexOf(t, tuVt); tuVt = viTri + t.length;
      const m = t.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
      if (!/\balt\s*=/.test(t)) noAlt++;
      else { const v = ((m && (m[1] ?? m[2])) || '').trim();
        if (v && !v.includes('[[CẦN-DỮ-KIỆN]]') && (ALT_RAC_RE.test(v) || TEN_TEP_RE.test(v))) altRac.push(`${h.f} alt="${v}"`); }
      if (!coChoGiu(t, h.src, viTri)) hoCho.push(`${h.f}: <img> ${(t.match(/src\s*=\s*"([^"]{0,42})/) || [, '?'])[1]}`); });
    // LÔ 4 (09/08/2026) — tiêu chí mobile#12 đòi giữ chỗ cho ẢNH-MEDIA, không riêng <img>.
    // Nhúng video/bản đồ là thủ phạm nhảy bố cục nặng nhất: iframe YouTube/Maps không khai chỗ
    // thì cả khối nội dung bên dưới bị đẩy khi khung nhúng tải xong.
    for (const g of h.src.matchAll(/<(video|iframe|embed|object)\b[^>]*>/gi)) {
      if (!coChoGiu(g[0], h.src, g.index)) hoCho.push(`${h.f}: ${g[1]} ${(g[0].match(/src\s*=\s*"([^"]{0,42})/) || [, '(không src)'])[1]}`);
    }
    (h.src.match(/<input\b[^>]*>/gi) || []).forEach(t => {
      if (/\btype\s*=\s*("image"|'image')/i.test(t) && !/\balt\s*=\s*("[^"]+"|'[^']+')/i.test(t)) inputImgNoAlt++; });
    // <svg> trần: không aria-hidden (kể cả thừa hưởng từ tổ tiên), không nhãn, không <title> con
    for (const g of h.src.matchAll(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi)) {
      const t = g[0], mo = t.slice(0, t.indexOf('>') + 1);
      if (/\baria-hidden\s*=\s*("true"|'true')/i.test(mo) || biAn(g.index)) continue;
      if (CO_NHAN.test(mo) || CO_LABELLEDBY.test(mo) || /<title[\s>]/i.test(t)) continue;
      svgTran.push(h.f); }
    for (const g of h.src.matchAll(/<(?!svg\b)[a-z][\w-]*\b[^>]*\brole\s*=\s*("img"|'img')[^>]*>/gi)) {
      const t = g[0];
      if (biAn(g.index)) continue;
      if (!CO_NHAN.test(t) && !CO_LABELLEDBY.test(t) && !/\btitle\s*=\s*("[^"]+"|'[^']+')/i.test(t)) roleImgTran.push(h.f); }
    // link/nút mà nội dung nhìn thấy được CHỈ là ảnh/icon → bắt buộc phải có tên khả truy cập
    for (const re of [/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, /<button\b([^>]*)>([\s\S]*?)<\/button>/gi]) {
      let m; while ((m = re.exec(h.src))) {
        const [, mo, trong] = m;
        if (trong.replace(/<[^>]*>/g, ' ').replace(/&[a-z#0-9]+;/gi, ' ').trim()) continue;  // có chữ thật → đủ tên
        if (!/<img\b|<svg\b/i.test(trong)) continue;                                          // không chứa ảnh/icon → ngoài phạm vi cổng
        if (/\baria-hidden\s*=\s*("true"|'true')/i.test(mo) || biAn(m.index)) continue;        // nằm trong vùng ẩn — lỗi khác (nội dung ẩn vẫn focus được), không thuộc cổng này
        const coTen = CO_NHAN.test(mo) || CO_LABELLEDBY.test(mo) || /\btitle\s*=\s*("[^"]+"|'[^']+')/i.test(mo)
          || /<img\b[^>]*\balt\s*=\s*("[^"]+"|'[^']+')/i.test(trong)
          || /<svg\b[^>]*\baria-label\s*=\s*("[^"]+"|'[^']+')/i.test(trong) || /<title[\s>]/i.test(trong);
        if (!coTen) linkKhongTen.push(`${h.f}: ${m[0].slice(0, 70).replace(/\s+/g, ' ')}`);
      } }
  });
  const chan = [];
  if (noAlt) chan.push(`${noAlt} <img> thiếu alt`);
  if (inputImgNoAlt) chan.push(`${inputImgNoAlt} <input type="image"> thiếu alt`);
  if (linkKhongTen.length) chan.push(`${linkKhongTen.length} link/nút chỉ chứa ảnh-icon mà KHÔNG có tên khả truy cập (${linkKhongTen.slice(0, 2).join(' | ')})`);
  const canh = [];
  if (svgTran.length) canh.push(`${svgTran.length} <svg> không aria-hidden cũng không có nhãn/<title> — icon trần với trình đọc màn hình (${[...new Set(svgTran)].slice(0, 3).join(', ')})`);
  if (roleImgTran.length) canh.push(`${roleImgTran.length} phần tử role="img" thiếu aria-label`);
  if (altRac.length) canh.push(`${altRac.length} alt RÁC không mang thông tin (${altRac.slice(0, 3).join(' | ')})`);
  // ALT LẶP trên các ảnh KHÁC NHAU (thêm 13/09/2026). Bổ khuyết cuối cùng của nhóm (d): `ALT_RAC_RE`
  // chỉ bắt alt nằm trong danh sách từ rác, nên `alt="Farmstay Đà Lạt"` dán y hệt cho 12 tấm ảnh
  // khác nhau thì lọt sạch — mà nhiều nhất MỘT trong 12 cái đó tả đúng ảnh của nó.
  // CHẶT CHẼ để không báo oan: chỉ tính khi `src` KHÁC NHAU. Cùng một ảnh lặp lại (logo trong nav và
  // trong footer) thì alt giống nhau là ĐÚNG, không phải lỗi. Ảnh trang trí `alt=""` cũng không vào
  // đây vì chuỗi rỗng đã bị loại từ vòng thu thập.
  // Giữ mức WARN như cả nhóm (d): alt có tả ĐÚNG ảnh hay không vẫn là mắt-Ông, máy chỉ khoanh vùng.
  {
    const theoAlt = new Map();
    for (const h of htmls) {
      let tu = 0;
      for (const t of (h.src.match(/<img\b[^>]*>/gi) || [])) {
        const vt = h.src.indexOf(t, tu); tu = vt + t.length;
        const ma = t.match(/\balt\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
        const v = ((ma && (ma[1] ?? ma[2])) || '').trim();
        if (!v || v.includes('[[CẦN-DỮ-KIỆN]]')) continue;
        const src = (t.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')/i) || [])[1] || '';
        if (!theoAlt.has(v)) theoAlt.set(v, new Set());
        theoAlt.get(v).add(src);
      }
    }
    const lap = [...theoAlt].filter(([, srcs]) => srcs.size > 1);
    if (lap.length) canh.push(`${lap.length} alt DÙNG LẠI cho nhiều ảnh KHÁC NHAU — nhiều nhất một trong số đó tả đúng ảnh của nó ` +
      `(${lap.slice(0, 2).map(([v, s]) => `"${v.slice(0, 34)}" ×${s.size}`).join(' | ')})`);
  }
  if (chan.length) add('img-alt', 'FAIL', chan.join(' · ') + (canh.length ? ` · [kèm cảnh báo] ${canh.join(' · ')}` : ''));
  else if (canh.length) add('img-alt', 'WARN', canh.join(' · '));
  else add('img-alt', 'PASS', 'Mọi ảnh/icon (img · svg · input image · role=img) có text alternative hợp lý');
  // mobile#12 "aspect-ratio/kích thước giữ chỗ ảnh-media chống nhảy layout (CLS)" — tiêu chí BẮT
  // BUỘC nên cổng phải CHẶN được, không chỉ nhắc nhở; mức cũ WARN khiến nó không đủ tư cách khai
  // `du` dù đã soi đúng thứ lời luật đòi. Nhảy bố cục là 1 trong 3 chỉ số Core Web Vitals.
  if (hoCho.length) add('img-dim', 'FAIL', `${hoCho.length} ảnh/media KHÔNG giữ chỗ trước (gây nhảy bố cục — CLS): ${hoCho.slice(0, 5).join(' · ')}${hoCho.length > 5 ? ` (+${hoCho.length - 5})` : ''}`);
  else add('img-dim', 'PASS', 'Mọi ảnh/media (img · video · iframe · embed) đều giữ chỗ trước bằng width+height, aspect-ratio hoặc khung cha'); }

// 12. seo/aes.16 — 1 H1 duy nhất & viewport
{ const h1n = h => (h.src.match(/<h1[\s>]/gi) || []).length;
  const multi = htmls.filter(h => h1n(h) > 1);   // >1 H1
  const zero  = htmls.filter(h => h1n(h) === 0);  // F10 (audit 12/07 đợt 2): thiếu HẲN H1 cũng vi phạm — cổng cũ chỉ bắt >1 nên trang 0 H1 PASS oan
  (multi.length || zero.length)
    ? add('h1-count', 'FAIL', [multi.length ? `>1 H1 ở: ${multi.map(m => m.f).slice(0,5).join(', ')}` : '', zero.length ? `THIẾU H1 (0) ở: ${zero.map(m => m.f).slice(0,5).join(', ')}` : ''].filter(Boolean).join(' | '))
    : add('h1-count', 'PASS', 'Mỗi trang đúng 1 H1');
}

// 12b. mobile#20 "Thẻ meta viewport CHUẨN (nền tảng responsive)" — nâng cho phủ TRỌN NGHĨA
// (LÔ 3 nối cổng mồ côi 09/08/2026). Cổng cũ chỉ soi "có thẻ hay không" nên chỉ đáng `mot-phan`;
// chữ CHUẨN trong lời luật gồm ba vế, nay soi đủ cả ba:
//   (1) mọi trang có thẻ meta viewport
//   (2) content khai đủ width=device-width + initial-scale=1 — thiếu thì mobile render theo khung
//       ảo ~980px rồi thu nhỏ, mọi breakpoint đổ vỡ dù CSS viết đúng
//   (3) KHÔNG khoá phóng to (user-scalable=no · maximum-scale<5) — vi phạm WCAG 2.2 SC 1.4.4,
//       người mắt kém không phóng to được; Safari iOS bỏ qua nhưng Android/Chrome vẫn tuân
// Nhánh không có .html (--source-only): soi `export const viewport` trong layout.tsx thay vì PASS
// trắng — cổng cũ khi htmls=[] cho `every` trả true nên PASS KHÔNG CẦN BẰNG CHỨNG (lỗ N/A ngầm).
{ const theViewport = src => (src.match(/<meta[^>]+name\s*=\s*["']?viewport["']?[^>]*>/i) || [])[0] || '';
  const noiDung = tag => ((tag.match(/content\s*=\s*["']([^"']*)["']/i) || [])[1] || '').toLowerCase();
  if (htmls.length) {
    const co = htmls.map(h => ({ f: h.f, tag: theViewport(h.src) }));
    const vang = co.filter(x => !x.tag);
    const dat = co.filter(x => x.tag).map(x => ({ f: x.f, c: noiDung(x.tag) }));
    const lech = dat.filter(x => !/width\s*=\s*device-width/.test(x.c) || !/initial-scale\s*=\s*1(\.0+)?\b/.test(x.c));
    const khoa = dat.filter(x => { const ms = (x.c.match(/maximum-scale\s*=\s*([\d.]+)/) || [])[1];
      return /user-scalable\s*=\s*(no|0)\b/.test(x.c) || (ms !== undefined && parseFloat(ms) < 5); });
    const loi = [];
    if (vang.length) loi.push(`${vang.length} trang thiếu hẳn thẻ meta viewport (${vang.map(x => x.f).slice(0,3).join(', ')})`);
    if (lech.length) loi.push(`${lech.length} trang khai thiếu width=device-width hoặc initial-scale=1 (${lech.map(x => x.f).slice(0,3).join(', ')})`);
    if (khoa.length) loi.push(`${khoa.length} trang KHOÁ PHÓNG TO bằng user-scalable=no / maximum-scale<5 — vi phạm WCAG 2.2 SC 1.4.4 (${khoa.map(x => x.f).slice(0,3).join(', ')})`);
    if (loi.length) add('viewport', 'FAIL', loi.join(' · '));
    else add('viewport', 'PASS', `${htmls.length} trang đều khai meta viewport đúng chuẩn: width=device-width + initial-scale=1, để người dùng phóng to được`);
  } else {
    const rootVp = (() => { let d = DIR; for (let i = 0; i < 5; i++) { if (existsSync(join(d, 'src/app/layout.tsx'))) return d; d = join(d, '..'); } return null; })();
    const khoiVp = rootVp ? (readFileSync(join(rootVp, 'src/app/layout.tsx'), 'utf8').match(/export\s+const\s+viewport[^=]*=\s*\{[^}]*\}/i) || [])[0] || '' : '';
    if (!khoiVp) add('viewport', 'WARN', 'Nguồn layout.tsx thiếu khối `export const viewport` — soi lại trên .kiem-snapshot sau khi build (cổng cần HTML render thật mới phán được)');
    else {
      // CHỈ bắt vi phạm TƯỜNG MINH. Vắng width/initialScale KHÔNG phải lỗi: Next.js tự phát
      // `width=device-width, initial-scale=1` khi nguồn không khai (đã đối chứng trên .kiem-snapshot
      // của chính template — nguồn chỉ có themeColor+viewportFit mà HTML render ra đủ hai khoá).
      // Đòi hai khoá đó ở tầng NGUỒN là chấm oan mọi web dùng mặc định — đúng lớp lỗi "cổng đỏ
      // vĩnh viễn" đã trả giá.
      const c = khoiVp.toLowerCase().replace(/["'\s]/g, '');
      const loi = [];
      const w = (c.match(/width:([\w-]+)/) || [])[1];
      if (w !== undefined && w !== 'device-width') loi.push(`width khai "${w}" thay vì "device-width"`);
      const is = (c.match(/initialscale:([\d.]+)/) || [])[1];
      if (is !== undefined && parseFloat(is) !== 1) loi.push(`initialScale ${is} ≠ 1`);
      if (/userscalable:false/.test(c)) loi.push('khoá phóng to bằng userScalable: false — vi phạm WCAG 2.2 SC 1.4.4');
      const ms = (c.match(/maximumscale:([\d.]+)/) || [])[1];
      if (ms !== undefined && parseFloat(ms) < 5) loi.push(`maximumScale ${ms} < 5 — khoá phóng to, vi phạm WCAG 2.2 SC 1.4.4`);
      if (loi.length) add('viewport', 'FAIL', `Khối export const viewport trong layout.tsx sai chuẩn: ${loi.join(' · ')}`);
      else add('viewport', 'PASS', 'layout.tsx khai export const viewport hợp chuẩn: không đè sai width/initial-scale, không khoá phóng to');
    }
  } }

// 13. aes.30 — text-wrap hiện diện
{ /text-wrap\s*:\s*balance/.test(allCss) && /text-wrap\s*:\s*pretty/.test(allCss)
    ? add('layout.18-wrap', 'PASS', 'Có text-wrap balance + pretty')
    : add('layout.18-wrap', 'WARN', 'Thiếu text-wrap:balance (tít) / pretty (thân)'); }

// 14. aes.23-contrast — ĐÃ GỘP vào a11y.25-contrast (A2, audit gomnhalua 10/07/2026).
// Cổng cũ ở đây gọi wcagContrast(parse(fg), parse(bg)) với fg/bg là TÊN BIẾN CSS ("--fg") chứ
// không phải giá trị màu — parse() trả undefined, wcagContrast(undefined,undefined) = NaN,
// "NaN < 4.5" luôn false → cổng LUÔN PASS giả bất kể màu thật lệch bao nhiêu (fail-open chết).
// Cổng 25 bên dưới đọc thẳng oklch() thật từ globals.css nên giữ lại, cổng này xoá hẳn.

// 15. mot.6-js — animation JS (Framer Motion) phải tôn trọng useReducedMotion
//     check trên đơn thuần CSS (mục 9) không thấy được animation chạy bằng JS
//     (motion.div không sinh @keyframes/transition: tĩnh) — quét thêm file nguồn.
{ // B1 (audit gomnhalua 10/07/2026): file thật là motion-recipes.TSX (JSX cần .tsx) — cổng cũ chỉ
  // dò đuôi .ts nên KHÔNG BAO GIỜ tìm thấy, luôn báo "N/A" giả dù file tồn tại và có animation.
  const projectRoot = (() => { let d = DIR; for (let i = 0; i < 4; i++) {
    if (existsSync(join(d, 'src/lib/motion-recipes.tsx')) || existsSync(join(d, 'src/lib/motion-recipes.ts'))) return d;
    d = join(d, '..'); } return null; })();
  const recipePath = projectRoot
    ? (existsSync(join(projectRoot, 'src/lib/motion-recipes.tsx')) ? join(projectRoot, 'src/lib/motion-recipes.tsx') : join(projectRoot, 'src/lib/motion-recipes.ts'))
    : null;
  if (!recipePath || !existsSync(recipePath)) add('mot.6-js', 'PASS', 'Không có motion-recipes.ts(x) — N/A');
  else { const src = readFileSync(recipePath, 'utf8');
    !/motion\.(div|section|span)/.test(src) ? add('mot.6-js', 'PASS', 'motion-recipes không dùng motion.* — N/A')
    : /useReducedMotion/.test(src) ? add('mot.6-js', 'PASS', 'motion-recipes có gọi useReducedMotion')
    : add('mot.6-js', 'FAIL', 'motion-recipes dùng Framer Motion nhưng KHÔNG gọi useReducedMotion — animation JS sẽ chạy kể cả khi người dùng bật "giảm chuyển động"'); } }

{ // mot.7-dna-noi-code — B1 (audit gomnhalua 10/07/2026): trước đây DESIGN-DNA.md khai MOTION/
  // SIGNATURE MOMENT (Ông đã duyệt qua widget) nhưng motion-recipes.tsx là code CHẾT — 0 block
  // nào thật sự dùng, "trên giấy" không khớp "trên web". Chặn cứng: DNA có khai animation mà
  // KHÔNG file nào trong src/ dùng MotionWrap/recipe= thì FAIL.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'DESIGN-DNA.md'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('mot.7-dna-noi-code', 'WARN', 'Không tìm thấy DESIGN-DNA.md để kiểm'); }
  else {
    const dna = readFileSync(join(root, 'DESIGN-DNA.md'), 'utf8');
    const khaiAnimation = /MOTION [A-Z]|SIGNATURE MOMENT/i.test(dna);
    if (!khaiAnimation) { add('mot.7-dna-noi-code', 'PASS', 'DESIGN-DNA.md chưa khai MOTION/SIGNATURE MOMENT — N/A'); }
    else {
      const srcDir = join(root, 'src');
      let daNoi = false;
      const cssFiles = [], tsxFiles = [];
      if (existsSync(srcDir)) {
        (function walk(d) { if (daNoi) return; for (const f of readdirSync(d)) {
          const p = join(d, f);
          if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); }
          else if (/\.(tsx|jsx)$/.test(f) && !/motion-recipes\.tsx$/.test(f)) {
            // A2 (nhahoachdinh 11/07/2026): web tiền-factory có thể cài motion hợp lệ theo cách
            // KHÁC hệ recipe mới (vd MotionConfig reducedMotion="user" của framer-motion trực
            // tiếp) — không chỉ MotionWrap/recipe= mới tính là "đã nối dây thật".
            const src = readFileSync(p, 'utf8');
            tsxFiles.push({ p, src });
            if (/MotionWrap|recipe\s*=\s*["{]|MotionConfig/.test(src)) { daNoi = true; return; }
          } else if (/\.css$/.test(f)) { cssFiles.push(p); }
        }})(srcDir);
      }
      // 22/07/2026 (đề xuất vai 7 xuyenvietfarmstay 21/07): web kiến trúc riêng đôi khi tự cấy hiệu
      // ứng bằng CSS thuần (@keyframes + class có `animation:`) thay vì hệ recipe mới — vẫn là "đã
      // nối dây thật" nếu class đó THỰC SỰ được dùng làm className trong 1 component .tsx. Tìm tên
      // keyframes trong CSS, dò rule nào có `animation:` trỏ đúng tên đó, lấy tên class của rule, rồi
      // xác nhận class đó xuất hiện trong className của ít nhất 1 file .tsx.
      if (!daNoi && cssFiles.length) {
        const allCss = cssFiles.map(p => readFileSync(p, 'utf8')).join('\n');
        const keyframeNames = new Set([...allCss.matchAll(/@keyframes\s+([\w-]+)/g)].map(m => m[1]));
        if (keyframeNames.size) {
          const wiredClasses = new Set();
          for (const m of allCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
            const [, selector, body] = m;
            if (![...keyframeNames].some(name => new RegExp(`animation(?:-name)?\\s*:[^;]*\\b${name}\\b`).test(body))) continue;
            for (const cls of selector.matchAll(/\.([\w-]+)/g)) wiredClasses.add(cls[1]);
          }
          if (wiredClasses.size) {
            daNoi = tsxFiles.some(({ src }) => [...wiredClasses].some(cls =>
              new RegExp(`className\\s*=\\s*(?:["'\`][^"'\`]*\\b${cls}\\b|\\{[^}]*\\b${cls}\\b)`).test(src)));
          }
        }
      }
      daNoi
        ? add('mot.7-dna-noi-code', 'PASS', 'DESIGN-DNA.md khai animation VÀ có block thật dùng MotionWrap/recipe=')
        : add('mot.7-dna-noi-code', 'FAIL', 'DESIGN-DNA.md khai MOTION/SIGNATURE MOMENT nhưng KHÔNG block nào trong src/ dùng MotionWrap/recipe= — animation "trên giấy" không khớp trên web thật');
    }
  }
}

// 16. [[CẦN-DỮ-KIỆN]] lọt ra build
{ let hasPlaceholder = 0;
  htmls.forEach(h => { if (/\[\[CẦN-DỮ-KIỆN\]\]/gi.test(h.src)) hasPlaceholder++; });
  hasPlaceholder ? add('content.0-placeholder', 'FAIL', `Tìm thấy [[CẦN-DỮ-KIỆN]] ở ${hasPlaceholder} trang — phải điền trước bàn giao`)
    : add('content.0-placeholder', 'PASS', 'Không có placeholder [[CẦN-DỮ-KIỆN]]'); }

// 17. emoji lọt vào UI (cấm theo luật Điều 1)
{ let emojiCount = 0;
  // Bắt \p{Emoji_Presentation} (emoji mặc-định-màu 😀🚀) HOẶC \p{Extended_Pictographic} + U+FE0F
  // (ký hiệu text-default ép sang emoji: ❤️ ⚠️ ☀️ ✔️ ▶️). CHỈ khi có FE0F đứng ngay sau nên
  // © U+00A9 / ↗ U+2197 dạng ký hiệu văn bản (không kèm FE0F) KHÔNG bị bắt oan. Fix nhahoachdinh 08/07 + FE0F 12/07/2026.
  htmls.forEach(h => { const vis = visText(h.src); const m = vis.match(/\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/gu) || []; emojiCount += m.length; });
  emojiCount ? add('aes.1-emoji', 'FAIL', `Phát hiện ${emojiCount} emoji trong UI — luật cấm`)
    : add('aes.1-emoji', 'PASS', 'Không có emoji trong UI'); }

// 17b. dep.1-import-khop-package — mọi import package (không phải relative/node core) phải có trong package.json
//      Lỗi gốc farmstayupdate-vn: dùng framer-motion trong motion-recipes.tsx nhưng thiếu trong dependencies → build vỡ.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'package.json')) && existsSync(join(d, 'src'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('dep.1-import-khop-package', 'WARN', 'Không tìm thấy package.json + src/ cạnh nhau — bỏ qua cổng'); }
  else {
    let pkg = null; // F15 (audit 12/07 đợt 2): package.json dị dạng KHÔNG được hạ gục cả máy kiểm — WARN + bỏ cổng.
    try { pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')); }
    catch { add('dep.1-import-khop-package', 'WARN', 'package.json dị dạng (JSON hỏng) — bỏ qua cổng thay vì hạ gục máy kiểm'); }
    if (pkg) {
    const known = new Set([...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})]);
    const srcFiles = [];
    (function walk(d){ for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); }
      else if (/\.(ts|tsx|js|jsx)$/.test(f)) srcFiles.push(p);
    }})(join(root, 'src'));
    const missing = new Set();
    // Loại trừ cả module lõi Node.js KHÔNG có tiền tố node: (fs, path...) — import 'fs' hợp lệ y như 'node:fs',
    // không phải package npm. Thiếu loại trừ này → FAIL oan mọi web có script dùng fs/path (bug phát hiện 10/07/2026).
    const nodeCore = new Set(['assert','buffer','child_process','cluster','console','constants','crypto','dgram','dns','domain','events','fs','http','http2','https','module','net','os','path','perf_hooks','process','punycode','querystring','readline','repl','stream','string_decoder','sys','timers','tls','tty','url','util','v8','vm','worker_threads','zlib']);
    const builtinOrLocal = /^(react|react-dom|next|@\/|\.|node:)/;
    srcFiles.forEach(f => {
      const src = readFileSync(f, 'utf8');
      for (const m of src.matchAll(/(?:from\s+|require\()\s*["']([^"'.][^"']*)["']/g)) {
        const spec = m[1];
        if (builtinOrLocal.test(spec)) continue;
        const pkgName = spec.startsWith('@') ? spec.split('/').slice(0, 2).join('/') : spec.split('/')[0];
        if (nodeCore.has(pkgName)) continue;
        if (!known.has(pkgName)) missing.add(pkgName);
      }
    });
    missing.size
      ? add('dep.1-import-khop-package', 'FAIL', `Import package chưa khai báo trong package.json: ${[...missing].join(', ')}`)
      : add('dep.1-import-khop-package', 'PASS', 'Mọi import package đều có trong package.json'); } }
}

// 18. media.1 — favicon + og:image (MEDIA cổng)
{ const hasOg = htmls.some(h => /<meta[^>]+property=["']og:image["'][^>]*>/i.test(h.src));
  const hasFavicon = htmls.some(h => /<link[^>]*rel=["']icon["'][^>]*>/i.test(h.src));
  (hasOg && hasFavicon)
    ? add('media.1-image', 'PASS', 'Có og:image + favicon')
    : add('media.1-image', 'WARN', `Thiếu ${!hasFavicon ? 'favicon' : ''} ${!hasOg ? 'og:image' : ''}`.trim() || 'N/A'); }


// 18b. media.5-favicon-rieng — BIỂU TƯỢNG TAB phải là của CHÍNH WEB NÀY
// Ông chỉ ra 19/08/2026: "nhiều web thiết kế xong đã đẩy lên deploy mà vẫn còn là tam giác đen".
// Đo được hôm đó: 10/23 web mang đúng một tệp `favicon.ico` — md5 c30c7d42… (25.931 B), là icon
// mặc định của Next.js. Gốc lây: `05-TEMPLATE-CHUAN` mang sẵn tệp ấy nên MỌI web sinh ra đều
// thừa hưởng. Vì sao cổng cũ không bắt: `media.1-image` chỉ hỏi "HTML có thẻ <link rel=icon> chưa"
// — mà Next TỰ SINH thẻ đó cho cả icon mặc định, nên tam giác đen luôn PASS. Cổng hỏi sai câu:
// phải hỏi "icon có phải CỦA WEB NÀY không", không phải "có icon không".
// FAIL (không WARN) vì đây là lỗi ĐI RA TỚI NGƯỜI DÙNG: nó hiện trên tab trình duyệt, trên thẻ
// đánh dấu trang, trên màn hình chính điện thoại — sai là mang danh tính người khác.
{
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app')) || existsSync(join(d, 'app'))) return d; d = join(d, '..'); } return null; })();
  // Băm của các icon MẶC ĐỊNH đã biết. Giữ dạng MẢNG vì Next đổi icon mặc định theo phiên bản;
  // gặp bản mới thì thêm băm vào đây, đừng nới lỏng cổng.
  // Ảnh KHÔNG PHẢI của web này. Hai nguồn, cùng một hậu quả — tab đeo danh tính người khác:
  //   · icon mặc định Next.js (tam giác đen)
  //   · logo MẪU của 05-TEMPLATE-CHUAN — Ông chốt 19/08 "có logo thì đừng ghi chữ viết tắt", nên
  //     template nay ưu tiên logo; nếu không lọc thì web mới đeo luôn LOGO MẪU, đúng lại gốc bệnh
  //     cũ chỉ đổi hình. Thà chữ viết tắt đúng tên web còn hơn logo của người khác.
  const BAM_MAC_DINH = new Set([
    'c30c7d42707a47a3f4591831641e50dc', // favicon.ico mặc định Next.js
    'cd76df2d7f55f517de6caa91f94cc0db', // logo-icon.png mẫu của 05-TEMPLATE-CHUAN
    '9b22c1796d41d378992a28cc4a8baa4c', // logo.png mẫu
    '443d0ad41f178c0bda6d1b588a37aa6e', // logo-horizontal.png mẫu
  ]);
  if (!root) add('media.5-favicon-rieng', 'WARN', 'Không tìm thấy thư mục web để soi biểu tượng tab');
  else {
    const thuMuc = ['src/app', 'app'].map(x => join(root, x)).filter(x => existsSync(x));
    const tep = [];
    for (const t of thuMuc) for (const f of readdirSync(t)) {
      if (/^(favicon\.ico|icon\.(ico|png|jpe?g|svg|tsx|ts|js|jsx)|apple-icon\.(png|jpe?g|svg|tsx|ts|js|jsx))$/.test(f)) tep.push(join(t, f));
    }
    if (tep.length === 0) {
      add('media.5-favicon-rieng', 'FAIL', 'KHÔNG có biểu tượng tab nào (favicon.ico / icon.* / apple-icon.*) ⇒ trình duyệt hiện icon trắng hoặc icon mặc định. Vá: thêm src/app/icon.tsx tự vẽ chữ viết tắt như 05-TEMPLATE-CHUAN');
    } else {
      // ⚠️ Vá 19/08/2026 — PHẢI lọc "là TỆP" trước khi băm. Khi máy kiểm chạy trên .next/server/app,
      // `icon.tsx` là THƯ MỤC route (Next dựng biểu tượng bằng mã, không phải ảnh tĩnh) ⇒ readFileSync
      // ném EISDIR và làm GÃY TOÀN BỘ máy kiểm giữa chừng, không cổng nào sau đó chạy nữa.
      // Đây là lỗi im lặng kiểu nặng: không phải một cổng báo sai, mà là mất trắng phần còn lại.
      const laTepIcon = (f) => { try { return statSync(f).isFile(); } catch { return false; } };
      const macDinh = tep.filter(laTepIcon).filter(f => BAM_MAC_DINH.has(createHash('md5').update(readFileSync(f)).digest('hex')));
      if (macDinh.length) {
        // Hai ca khác hẳn nhau về cách sửa — đo 19/08 gặp cả hai:
        //  (a) web chưa có icon nào của mình  ⇒ phải LÀM icon.
        //  (b) web ĐÃ có icon riêng (icon.svg/icon.tsx…) nhưng còn sót favicon.ico mặc định
        //      ⇒ chỉ cần XOÁ tệp sót. Bẫy: trình duyệt vẫn tự lấy /favicon.ico nên tam giác đen
        //      thắng icon riêng — hoinghisaurieng-vn dính đúng ca này, tưởng đã làm xong từ lâu.
        const rieng = tep.filter(f => !macDinh.includes(f));
        add('media.5-favicon-rieng', 'FAIL', rieng.length
          ? `Còn SÓT icon mặc định Next.js: ${macDinh.map(f => relative(root, f)).join(' · ')} — web đã có icon riêng (${rieng.map(f => relative(root, f)).join(' · ')}) nhưng trình duyệt vẫn tự lấy /favicon.ico nên TAM GIÁC ĐEN vẫn thắng. Vá: XOÁ tệp sót đó là xong`
          : `Biểu tượng tab vẫn là ICON MẶC ĐỊNH của Next.js (tam giác đen): ${macDinh.map(f => relative(root, f)).join(' · ')} ⇒ web mang danh tính của người khác trên tab trình duyệt. Vá: xoá tệp đó, thêm src/app/icon.tsx tự vẽ logo/chữ viết tắt của web`);
      } else {
        add('media.5-favicon-rieng', 'PASS', `Biểu tượng tab riêng của web (${tep.length} tệp): ${tep.map(f => relative(root, f)).join(' · ')}`);
      }
    }
  }
}

// 19. aes.23-brandsync — --brand-h/--brand-c (globals.css) phải KHỚP brandHue/brandChroma (site-config.ts)
//     Lỗi "chuột bạch" thevietnamtea: palette lệch (nâu farmstay thay vì xanh trà) do 2 file rời nhau.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const cssPath = root ? join(root, 'src/app/globals.css') : null;
  const cfgPath = root ? join(root, 'src/lib/site-config.ts') : null;
  if (!root || !existsSync(cssPath) || !existsSync(cfgPath)) add('aes.23-brandsync', 'PASS', 'Không có site-config.ts/globals.css nguồn — N/A');
  else { const css = readFileSync(cssPath, 'utf8'), cfg = readFileSync(cfgPath, 'utf8');
    const cssH = css.match(/--brand-h\s*:\s*([\d.]+)/)?.[1], cssC = css.match(/--brand-c\s*:\s*([\d.]+)/)?.[1];
    const cfgH = cfg.match(/brandHue\s*:\s*([\d.]+)/)?.[1], cfgC = cfg.match(/brandChroma\s*:\s*([\d.]+)/)?.[1];
    const bad = [];
    if (cssH == null || cfgH == null) bad.push('thiếu --brand-h hoặc brandHue');
    else if (cssH !== cfgH) bad.push(`hue lệch: globals.css=${cssH} ≠ site-config=${cfgH}`);
    if (cssC == null || cfgC == null) bad.push('thiếu --brand-c hoặc brandChroma');
    else if (cssC !== cfgC) bad.push(`chroma lệch: globals.css=${cssC} ≠ site-config=${cfgC}`);
    bad.length ? add('aes.23-brandsync', 'FAIL', `Màu thương hiệu 2 file KHÔNG khớp — ${bad.join('; ')} (đồng bộ trước bàn giao)`)
      : add('aes.23-brandsync', 'PASS', `Màu thương hiệu đồng bộ: hue=${cssH} chroma=${cssC}`); }
}

// 19b. aes.31-mau-cung — MÃ MÀU VIẾT CỨNG trong src/ lệch màu thương hiệu (khắc 03/08/2026)
// VÌ SAO CÓ CỔNG NÀY: aes.23-brandsync ở trên chỉ so BIẾN --brand-h với site-config, nên nó MÙ
// HOÀN TOÀN với mã màu cứng ĐÈ LÊN biến. Đo trên trình duyệt thật khi dựng dakago.vn: biến --bg
// ra oklch(19% .012 260) đúng navy, nhưng nền hiện lên lại là rgba(15,35,24,.95) — xanh lá
// farmstay ĐANG THẮNG. Hệ quả: MỌI web sinh từ template đều mang màu farmstay bất kể Ông chọn
// màu gì ở cổng chọn màu, mà cả 126 cổng cũ đều xanh.
// CÁCH SOI: mọi mã hex/rgb() trong src/ → đổi sang OKLCH → lệch brandHue quá 30° thì FAIL.
// CHỐNG BÁO OAN: bỏ màu vô sắc (trắng/đen/xám — chroma thấp thì góc hue vô nghĩa), bỏ alpha 0,
// bỏ dòng chú thích, và cho phép miễn trừ qua `.mau-mien-tru.json` ở gốc web — NHƯNG mỗi mục
// miễn trừ BẮT BUỘC có `vi_sao` không rỗng, không thì không được miễn (chặn miễn trừ bừa).
// MỘT CỔNG = MỘT VERDICT: gom hết vi phạm rồi phát đúng 1 lần (regression-luat đọc PASS trước,
// cổng phát 2 dòng sẽ làm corpus mất tác dụng IM LẶNG).
{ const root = (() => { let d = DIR; for (let i = 0; i < 5; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const cfgPath = root ? join(root, 'src/lib/site-config.ts') : null;
  if (!root || !existsSync(cfgPath)) add('aes.31-mau-cung', 'PASS', 'Không có src/lib/site-config.ts — N/A');
  else {
    const brandHue = Number(readFileSync(cfgPath, 'utf8').match(/brandHue\s*:\s*([\d.]+)/)?.[1]);
    if (!Number.isFinite(brandHue)) add('aes.31-mau-cung', 'FAIL', 'site-config.ts không khai brandHue — không có mốc để đối chiếu mã màu cứng');
    else {
      // sRGB → OKLCH (Björn Ottosson). Viết tay để máy kiểm không phụ thuộc thư viện ngoài;
      // cùng hệ màu với --brand-h/brandHue/TAM_HUE toàn dự án.
      const srgbToOklch = (r, g, b) => {
        const li = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        const R = li(r), G = li(g), B = li(b);
        const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
        const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
        const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
        const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
        const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
        return { c: Math.hypot(A, Bb), h: ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360 };
      };
      const lechGoc = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
      let mienTru = [];
      const mtPath = join(root, '.mau-mien-tru.json');
      if (existsSync(mtPath)) { try { mienTru = (JSON.parse(readFileSync(mtPath, 'utf8')).mienTru || []).filter((x) => x && x.ma && String(x.vi_sao || '').trim()); } catch { /* tệp hỏng = không miễn trừ ai, an toàn hơn miễn bừa */ } }
      const duocMien = new Set(mienTru.map((x) => String(x.ma).toLowerCase()));
      const tep = [];
      (function di(d) { let ds = []; try { ds = readdirSync(d, { withFileTypes: true }); } catch { return; }
        for (const e of ds) { const p = join(d, e.name);
          if (e.isDirectory()) { if (!/node_modules|\.next|dist/.test(e.name)) di(p); }
          else if (/\.(tsx?|jsx?|css)$/.test(e.name)) tep.push(p); } })(join(root, 'src'));
      const viPham = [];
      for (const p of tep) {
        const noiDung = readFileSync(p, 'utf8');
        // Trang khai noindex là trang NỘI BỘ (bảng so màu, xem thử bố cục) — khách và Google
        // không bao giờ thấy, nên mã màu trong đó không thể làm lệch màu thương hiệu.
        // Đúc từ ca thật 06/08/2026: trang /color-preview dựng để Ông chọn màu, buộc phải viết
        // mã màu thật của TỪNG phương án, bị cổng bắt oan 66 lần.
        if (/robots\s*:\s*\{[^}]*index\s*:\s*false/.test(noiDung)) continue;
        const dong = noiDung.split('\n');
        for (let i = 0; i < dong.length; i++) {
          const d = dong[i];
          if (/^\s*(\/\/|\/\*|\*)/.test(d)) continue; // dòng chú thích — không phải màu đang chạy
          const found = [...d.matchAll(/#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b/g)].map((m) => ({ ma: '#' + m[1], rgb: (() => { let x = m[1]; if (x.length === 3) x = x.split('').map((k) => k + k).join(''); return [parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16)]; })(), a: m[1].length === 8 ? parseInt(m[1].slice(6, 8), 16) / 255 : 1 }));
          for (const m of d.matchAll(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/g))
            found.push({ ma: m[0], rgb: [+m[1], +m[2], +m[3]], a: m[4] === undefined ? 1 : Number(m[4]) });
          for (const f of found) {
            if (f.a === 0) continue;                                  // trong suốt hoàn toàn
            if (duocMien.has(f.ma.toLowerCase())) continue;
            const { c, h } = srgbToOklch(...f.rgb);
            if (c < 0.02) continue;                                   // trắng/đen/xám — góc hue vô nghĩa ở đây
            const lech = lechGoc(h, brandHue);
            // dùng relative(): root có thể là '.' khi soi từ .kiem-snapshot đi bộ lên,
            // cắt chuỗi bằng root.length+1 sẽ xén nhầm mất ký tự đầu đường dẫn
            if (lech > 30) viPham.push(`${relative(root, p)}:${i + 1} ${f.ma} (hue ${Math.round(h)}°, lệch ${Math.round(lech)}°)`);
          }
        }
      }
      viPham.length
        ? add('aes.31-mau-cung', 'FAIL', `${viPham.length} mã màu viết cứng lệch brandHue=${brandHue}° quá 30° — mã cứng ĐÈ LÊN biến --brand-*, web sẽ mang màu khác màu Ông chọn: ${viPham.slice(0, 6).join(' · ')}${viPham.length > 6 ? ` · …còn ${viPham.length - 6}` : ''}`)
        : add('aes.31-mau-cung', 'PASS', `Không mã màu cứng nào lệch brandHue=${brandHue}° quá 30° (đã soi ${tep.length} tệp nguồn${duocMien.size ? `, miễn trừ ${duocMien.size} mã có ghi lý do` : ''})`);
    }
  }
}

// 20. aes.29-fontsync — siteConfig.fonts.display/text phải nằm trong FONT_CSS_VAR (src/lib/fonts.ts),
//     không phải config chết. layout.tsx phải đọc resolveFontCssVar(), không hard-code font cố định.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const fontsPath = root ? join(root, 'src/lib/fonts.ts') : null;
  const cfgPath = root ? join(root, 'src/lib/site-config.ts') : null;
  const layoutPath = root ? join(root, 'src/app/layout.tsx') : null;
  if (!root || !existsSync(fontsPath) || !existsSync(cfgPath) || !existsSync(layoutPath)) add('aes.29-fontsync', 'PASS', 'Không có fonts.ts/site-config.ts/layout.tsx nguồn — N/A');
  else { const fontsSrc = readFileSync(fontsPath, 'utf8'), cfg = readFileSync(cfgPath, 'utf8'), layout = readFileSync(layoutPath, 'utf8');
    const known = [...fontsSrc.matchAll(/^\s*["']?([\w 'À-ỹ]+)["']?:\s*"--font-/gm)].map(m => m[1].trim());
    const display = cfg.match(/fonts:\s*{\s*display:\s*"([^"]+)"/s)?.[1];
    const text = cfg.match(/fonts:\s*{\s*display:\s*"[^"]+",\s*text:\s*"([^"]+)"/s)?.[1];
    const bad = [];
    if (!layout.includes('resolveFontCssVar')) bad.push('layout.tsx không gọi resolveFontCssVar() — nghi hard-code font cố định');
    if (display && display !== '[[CẦN-DỮ-KIỆN]]' && !known.includes(display)) bad.push(`fonts.display="${display}" không có trong FONT_CSS_VAR (fonts.ts)`);
    if (text && text !== '[[CẦN-DỮ-KIỆN]]' && !known.includes(text)) bad.push(`fonts.text="${text}" không có trong FONT_CSS_VAR (fonts.ts)`);
    bad.length ? add('aes.29-fontsync', 'FAIL', bad.join('; '))
      : add('aes.29-fontsync', 'PASS', `Font đồng bộ: display=${display ?? '(chưa điền)'} text=${text ?? '(chưa điền)'}`); }
}

// fonts.2-candidate-block — C5: 18 font ỨNG VIÊN (06-MO-RONG-PDCA.md) "0/18 đã kiểm dấu tiếng
// Việt" — CẤM dùng production tới khi kiểm dấu xong (PDCA mục A-ACT). FAIL nếu site-config.ts
// khai fonts.display/text bằng 1 tên trong CANDIDATE_FONTS_UNVERIFIED (fonts.ts).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  // D8 (11/07/2026): 12/15 kiểm dấu PASS + không lỗi type đã chuyển sang FONT_CSS_VAR (fonts.ts).
  // Josefin Sans/Comfortaa: FAIL thật (vỡ dấu). Sora: next/font/google không có subset "vietnamese"
  // (lỗi TS2322) — cần điều tra thêm, chưa phải FAIL do vỡ dấu nhưng vẫn chặn production.
  const CANDIDATES = ['Josefin Sans', 'Comfortaa', 'Sora'];
  if (!root) add('fonts.2-candidate-block', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const cfg = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    const display = cfg.match(/fonts:\s*{\s*display:\s*"([^"]+)"/s)?.[1];
    const text = cfg.match(/fonts:\s*{\s*display:\s*"[^"]+",\s*text:\s*"([^"]+)"/s)?.[1];
    const bad = [display, text].filter(f => f && CANDIDATES.includes(f));
    bad.length ? add('fonts.2-candidate-block', 'FAIL', `Font ứng viên CHƯA kiểm dấu tiếng Việt: ${bad.join(', ')} — cấm dùng production (06-MO-RONG-PDCA.md), chọn font đã kiểm trong FONT_CSS_VAR`)
      : add('fonts.2-candidate-block', 'PASS', 'Không dùng font ứng viên chưa kiểm dấu'); }
}

// mot.8-signature-bo1 — C5b: đề xuất signature theo Bộ (04-BANG-CHUYEN-DONG.md mục 3) ghi rõ
// "KHÔNG dùng B5 Blob Morph, F6 Audio cho Bộ I" (đi ngược tinh thần điềm đạm, không overshoot).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) add('mot.8-signature-bo1', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const cfg = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    const bo = cfg.match(/toHop:\s*{\s*bo:\s*"(I|II|III|IV|V|VI)"/s)?.[1];
    if (bo !== 'I') add('mot.8-signature-bo1', 'PASS', 'Không phải Bộ I — N/A');
    else { const srcDir = join(root, 'src');
      const srcFiles = [];
      (function walkSrc(d) { if (!existsSync(d)) return; for (const f of readdirSync(d)) {
        const p = join(d, f); if (f === 'node_modules') continue;
        const s = statSync(p); if (s.isDirectory()) walkSrc(p); else if (/\.(tsx|jsx)$/.test(f)) srcFiles.push(p); } })(srcDir);
      // VÁ 20260819 (dựng congot.vn): nhánh cũ `/Blob\s*Morph/i` dò chuỗi TỰ DO trên mọi .tsx nên
      // khớp đúng dòng CHÚ THÍCH "// Mã hiệu ứng: B5 — Blob Morph (...)" nằm sẵn trong
      // src/lib/motion-recipes.tsx — tệp THƯ VIỆN vendor cho MỌI web, chứa cả 105 hiệu ứng của 6 Bộ.
      // Hệ quả: mọi web chọn Bộ I đều FAIL VĨNH VIỄN dù không hề dùng hiệu ứng bị cấm (đo thật:
      // congot.vn dùng 12 recipe, không có blobMorph/f6AudioHover, vẫn FAIL). Nay soi CÁCH DÙNG THẬT
      // (prop recipe= hoặc lớp fx-) sau khi strip comment, thay vì soi tên xuất hiện trong văn bản.
      const hit = srcFiles.some(f => {
        // strip comment tại chỗ (máy này không có helper dùng chung): bỏ /* */ và dòng //
        const src = readFileSync(f, 'utf8')
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/^\s*\/\/.*$/gm, '');
        return /recipe=["'](?:f6AudioHover|blobMorph)["']/.test(src) || /fx-blob-morph|fx-f6-audio/.test(src);
      });
      hit ? add('mot.8-signature-bo1', 'FAIL', 'Bộ I dùng f6AudioHover/Blob Morph — cấm theo bảng đề xuất signature (04-BANG-CHUYEN-DONG.md mục 3)')
        : add('mot.8-signature-bo1', 'PASS', 'Bộ I không dùng signature bị cấm'); } }
}

// mot.9-hieu-ung-khai-dung — Đợt 3 chiến dịch hiệu ứng điện ảnh (20260716, kế hoạch gốc
// KE-HOACH-HIEU-UNG-DIEN-ANH-20260715.md mục 5, mã gốc kế hoạch gọi "mot.7" nhưng số đó đã dùng cho
// dna-noi-code nên đổi sang 9). Quy ước: DESIGN-DNA.md có dòng "Hiệu ứng đã chọn: tên1, tên2" (cùng
// kiểu văn phong "Màu do Ông chọn:"/"Sơ đồ web đã chọn:" đã có sẵn) — đối chiếu với `recipe="tên"`
// dùng thật trong src/. Khai mà không dùng = FAIL (bịa hiệu ứng "trên giấy", đúng tinh thần
// mot.7-dna-noi-code). Dùng mà không khai = WARN (thiếu ghi chép, chưa chắc sai). Không có dòng
// "Hiệu ứng đã chọn:" nào = WARN (web mới/cũ chưa qua cổng chọn hiệu ứng của 2 SKILL.md).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'DESIGN-DNA.md'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('mot.9-hieu-ung-khai-dung', 'WARN', 'Không tìm thấy DESIGN-DNA.md để kiểm'); }
  else {
    // Đọc CẢ DESIGN-DNA.md lẫn ANIMATION-DNA.md, và nhận CẢ HAI nhãn (vá 05/09/2026).
    // Vì sao: cổng chỉ dò nhãn CŨ «Hiệu ứng đã chọn:» — mà đo 05/09 thì KHÔNG skill nào còn dạy
    // ghi nhãn đó nữa; skill nay ghi «Hiệu ứng signature: <tên>» vào ANIMATION-DNA.md. Hệ quả:
    // 13/20 web thật không có nhãn cũ nên rơi hết vào nhánh WARN, và nhánh FAIL ("khai mà không
    // dùng") trở thành MÃ CHẾT với mọi web sinh sau khi skill đổi nhãn — cổng mất răng mà vẫn
    // trông như đang canh. Nhận cả hai nhãn thì web cũ (7 web) lẫn web mới đều được soi thật.
    const dna = readFileSync(join(root, 'DESIGN-DNA.md'), 'utf8')
      + (existsSync(join(root, 'ANIMATION-DNA.md')) ? '\n' + readFileSync(join(root, 'ANIMATION-DNA.md'), 'utf8') : '');
    const khaiLine = dna.match(/Hiệu ứng đã chọn:\s*(.+)/i) || dna.match(/Hiệu ứng signature:\s*(.+)/i);
    const srcDir = join(root, 'src');
    const srcFiles = [];
    if (existsSync(srcDir)) (function walk(d) { for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); }
      else if (/\.(tsx|jsx)$/.test(f) && !/motion-recipes\.tsx$/.test(f)) srcFiles.push(p);
    }})(srcDir);
    const allSrc = srcFiles.map(f => readFileSync(f, 'utf8')).join('\n');
    // F-nongnghiepdisan 20260723: [a-zA-Z0-9]+ bỏ lọt tên recipe có gạch nối — web tự dựng
    // MotionWrap.tsx bespoke (RECIPES: {"stagger-cascade": ..., "fade-up": ...}) là mẫu hình HỢP LỆ
    // (2 web thật đang dùng: nongnghiepdisan-vn, daiviettrahoa-vn), quy ước "Hiệu ứng đã chọn:" trong
    // DESIGN-DNA.md cũng cho phép tên tự do có gạch nối — chỉ riêng regex dò `recipe="..."` dùng thật
    // trong src/ là hẹp hơn thực tế, khiến FAIL oan "hiệu ứng trên giấy" dù đã nối dây đúng.
    const dungThat = new Set([...allSrc.matchAll(/recipe\s*=\s*["']([a-zA-Z0-9-]+)["']/g)].map(m => m[1]));
    if (!khaiLine) {
      add('mot.9-hieu-ung-khai-dung', 'WARN', dungThat.size
        ? `Dùng ${dungThat.size} hiệu ứng (${[...dungThat].slice(0,5).join(', ')}) nhưng DESIGN-DNA.md chưa có dòng "Hiệu ứng đã chọn:" — thiếu ghi chép`
        : 'DESIGN-DNA.md chưa có dòng "Hiệu ứng đã chọn:" — web chưa qua cổng chọn hiệu ứng (N/A nếu web cũ trước chiến dịch)');
    } else {
      // Cắt phần CHÚ NGUỒN trong ngoặc trước khi tách tên (vá 05/09/2026): skill dạy ghi
      // «Hiệu ứng signature: <tên> (nguồn: KHO-HIEU-UNG-CODE.md mục <số>)». Không cắt thì cả
      // cụm «goldDust (nguồn: …)» bị coi là MỘT tên hiệu ứng, không khớp `recipe="goldDust"`
      // nào ⇒ FAIL oan đúng cái web làm ĐÚNG quy ước. Mẫu đối chứng `pass-nhan-moi` bắt được
      // ngay khi vừa dựng — nếu không có mẫu thì bản vá này đã đi vào sản xuất kèm lỗi mới.
      const khaiThat = khaiLine[1].split(',').map(s => s.replace(/\([^)]*\)/g, '').trim()).filter(Boolean);
      const khaiKhongDung = khaiThat.filter(k => !dungThat.has(k));
      const dungKhongKhai = [...dungThat].filter(d => !khaiThat.includes(d));
      if (khaiKhongDung.length) add('mot.9-hieu-ung-khai-dung', 'FAIL', `DESIGN-DNA.md khai "${khaiKhongDung.join(', ')}" nhưng KHÔNG thấy recipe="..." dùng thật trong src/ — hiệu ứng "trên giấy"`);
      else if (dungKhongKhai.length) add('mot.9-hieu-ung-khai-dung', 'WARN', `Dùng thật "${dungKhongKhai.join(', ')}" nhưng DESIGN-DNA.md chưa khai — bổ sung vào dòng "Hiệu ứng đã chọn:"`);
      else add('mot.9-hieu-ung-khai-dung', 'PASS', `Khai và dùng khớp nhau: ${khaiThat.join(', ')}`);
    }
  }
}

// mot.12-tuong-phan-chu-animate — 03/08/2026, đúc từ lỗi THẬT của recipe karaokeScrollText (vá ở
// commit 2a57a57). Bệnh: buộc `opacity` xuống dưới 1 theo tiến độ cuộn TRÊN PHẦN TỬ CHỨA CHỮ — ở
// mức mờ nhất chữ trộn với nền, tương phản tụt dưới 4.5:1 (WCAG AA). Số opacity viết cứng chỉ đúng
// cho đúng 1 cặp màu chữ/nền, đổi sang web có nền khác là sai lại, nên KHÔNG chữa được bằng cách
// chỉnh số. Khác hẳn hiệu ứng hiện dần thường (0→1 rồi ở yên tại 1, không ai đọc trong lúc mờ):
// khi opacity buộc vào cuộn, người đọc DỪNG được ở mức mờ bất kỳ, lâu tuỳ họ — đó là trạng thái
// đọc thật, phải đạt chuẩn tương phản. Cách vá chuẩn: animate `filter: blur()` thay cho `opacity`
// — màu chữ và độ đục giữ nguyên 1 ở mọi khung hình nên tương phản luôn bằng mức chữ tĩnh đã kiểm.
// Ràng buộc này ghi trong 01-LUAT/SO-TAY-CONG-THUC/04-RECIPE-MOTION.md.
{ const root = (() => { let d = DIR; for (let i = 0; i < 5; i++) { if (existsSync(join(d, 'src')) || existsSync(join(d, 'lib'))) return d; d = join(d, '..'); } return null; })();
  const files = [];
  if (root) for (const base of ['src', 'lib', 'components']) {
    const p = join(root, base);
    if (!existsSync(p)) continue;
    (function walk(d) { for (const f of readdirSync(d)) {
      const q = join(d, f);
      if (statSync(q).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(q); }
      else if (/\.(tsx|jsx)$/.test(f)) files.push(q);
    }})(p);
  }
  // Dấu hiệu khối đang xử lý CHỮ (tách từ/ký tự, hoặc chỉ nhận children dạng chuỗi).
  const DAU_HIEU_CHU = /typeof\s+children\s*!==\s*['"]string['"]|\.split\(|\b(word|char|letter|glyph)\b/;
  const viPham = [];
  for (const f of files) {
    const s = readFileSync(f, 'utf8');
    if (!/useTransform/.test(s)) continue;
    for (const m of s.matchAll(/const\s+(\w+)\s*=\s*useTransform\(\s*([\w.]+)\s*,\s*\[[^\]]*\]\s*,\s*\[([^\]]*)\]/g)) {
      const [, bien, nguon, dich] = m;
      if (!/progress|scroll/i.test(nguon)) continue;               // chỉ xét cái buộc vào CUỘN
      const so = dich.split(',').map((x) => parseFloat(x.trim())).filter((x) => !Number.isNaN(x));
      // Ranh giới ĐÚNG của bệnh: đáy nằm HẲN trong khoảng (0,1) — chữ "mờ nhưng vẫn đọc được",
      // đó mới là trạng thái đọc thật phải đạt chuẩn tương phản. Đáy = 0 là hiện-vào thuần (chữ vô
      // hình rồi rõ dần): không ai đọc chữ vô hình nên KHÔNG phải lỗi tương phản — loại trừ, nếu
      // không sẽ chấm oan mọi hiệu ứng hiện-vào theo cuộn (đã bắt oan kineticTypographyWrap của
      // chính template ở bản đầu).
      if (!so.length) continue;
      const day = Math.min(...so);
      if (day <= 0 || day >= 1) continue;
      // Biến này có thật sự lái opacity? Hai lối viết đều phải bắt được — lối rút gọn
      // `style={{ opacity }}` (chỉ dùng được khi biến tên đúng là opacity) là lối phổ biến NHẤT và
      // chính bản lỗi thật đã dùng, bản đầu của cổng này bỏ lọt nó nên mẫu sai vẫn PASS.
      const laiOpacity = /^opacity/i.test(bien) || new RegExp('opacity\\s*[:=]\\s*\\{?\\s*' + bien + '\\b').test(s);
      if (!laiOpacity) continue;
      // Dấu hiệu chữ phải xét trong VÙNG QUANH chỗ vi phạm, KHÔNG phải toàn tệp: một tệp recipe
      // chung chứa hàng chục hiệu ứng, chỉ cần 1 hiệu ứng khác trong đó tách từ là mọi vi phạm
      // còn lại bị gán oan "trên phần tử chữ" (bản đầu của cổng này mắc đúng lỗi đó, chấm oan 3
      // recipe của chính template).
      const quanh = s.slice(Math.max(0, m.index - 600), m.index + 900);
      // Tên recipe = khai báo Wrap/component GẦN NHẤT phía trước (lấy cái cuối, không phải cái đầu).
      const ten = [...s.slice(0, m.index).matchAll(/(?:function|const)\s+(\w+)/g)]
        .map((x) => x[1]).filter((n) => /Wrap$/.test(n) || /^[A-Z]/.test(n)).pop() || bien;
      viPham.push({ f: f.split('/').pop(), bien, ten, min: day, chu: DAU_HIEU_CHU.test(quanh) });
    }
  }
  // ── CÙNG BỆNH, KHÁC CON ĐƯỜNG: hiệu ứng viết bằng CSS thuần (vá 06/08/2026) ──────
  // Bản đầu (03/08) chỉ soi .tsx/.jsx + mẫu `useTransform` ⇒ chỉ canh đường framer-motion. Đo 06/08:
  // chỉ 3/22 web có nhà thuốc framer, còn lối phổ biến là lớp `fx-*` trong CSS (11/13 chỗ máy neo chỉ
  // ra ở dakago-vn, 15/22 ở template đều là lối thêm-lớp). Tức cổng đang canh con đường THIỂU SỐ,
  // con đường ĐA SỐ đi qua không ai hỏi — viết đúng cái bệnh karaoke bằng CSS thì lọt sạch.
  // Ranh giới bệnh giữ Y NGUYÊN bản .tsx, không nới: chỉ tính khi animation buộc vào CUỘN
  // (`animation-timeline: scroll()/view()` — người đọc dừng được ở mức mờ bất kỳ, đó là trạng thái
  // đọc thật), và đáy opacity nằm HẲN trong (0,1). Nhờ vậy `.fx-scroll-reveal` (0→1) và
  // `.fx-fog-layer--*` (…→0) của chính template KHÔNG bị chấm oan — đã đối chứng trên cây thật.
  const cssFiles = [];
  if (root) for (const base of ['src', 'app', 'styles']) {
    const p = join(root, base);
    if (!existsSync(p)) continue;
    (function walk(d) { for (const f of readdirSync(d)) {
      const q = join(d, f);
      if (statSync(q).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(q); }
      else if (/\.css$/.test(f)) cssFiles.push(q);
    }})(p);
  }
  const CHU_TRONG_LOP = /text|word|char|letter|title|heading|headline|quote|caption|label|\bchu\b/i;
  for (const f of cssFiles) {
    const s0 = readFileSync(f, 'utf8');
    if (!/animation-timeline/.test(s0)) continue;
    // Cắt @keyframes bằng ĐẾM NGOẶC CÂN BẰNG, không dùng regex non-greedy.
    // Vì sao (báo oan THẬT bắt được trên chính template 06/08): `@keyframes fx-fog-clear-2` viết
    // nhiều dòng nên `[\s\S]*?\n\s*\}` dừng ngay ở dấu `}` đóng block con `from {`, cổng chỉ thấy
    // `opacity: 0.85` mà không thấy `to { opacity: 0 }` ⇒ tưởng đáy 0.85 và kêu oan lớp SƯƠNG NỀN
    // vốn mờ hẳn về 0. Một dấu ngoặc đọc hụt là đủ biến cổng thành máy vu oan.
    const kf = new Map();
    const vungKf = [];
    for (const m of s0.matchAll(/@keyframes\s+([\w-]+)\s*\{/g)) {
      let i = m.index + m[0].length, sau = 1;
      while (i < s0.length && sau > 0) { if (s0[i] === '{') sau++; else if (s0[i] === '}') sau--; i++; }
      kf.set(m[1], s0.slice(m.index + m[0].length, i - 1));
      vungKf.push([m.index, i]);
    }
    // Xoá vùng @keyframes khỏi bản quét rule (block lồng nhau làm regex rule khớp nhầm), giữ nguyên
    // độ dài để mọi chỉ số còn dùng được.
    let sCss = s0;
    for (const [a, b] of vungKf) sCss = sCss.slice(0, a) + ' '.repeat(b - a) + sCss.slice(b);
    for (const m of sCss.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      const than = m[2];
      if (!/animation-timeline\s*:\s*(scroll|view)\s*\(/.test(than)) continue;
      // Lấy TÊN keyframes bằng cách đối chiếu từng token với bảng @keyframes — chắc hơn đoán vị trí
      // token trong `animation: <tên> 1s linear both` (thứ tự các giá trị của thuộc tính rút gọn tự do).
      const toks = ((than.match(/animation(?:-name)?\s*:\s*([^;]+)/) || [])[1] || '').split(/[\s,]+/);
      const tenKf = toks.find((t) => kf.has(t));
      if (!tenKf) continue;
      const so = [...kf.get(tenKf).matchAll(/opacity\s*:\s*([\d.]+)/g)].map((x) => parseFloat(x[1]));
      if (!so.length) continue;
      const day = Math.min(...so);
      if (day <= 0 || day >= 1) continue;
      const sel = m[1].trim().split('\n').pop().trim();
      viPham.push({ f: f.split('/').pop(), bien: 'opacity', ten: sel, min: day,
        chu: CHU_TRONG_LOP.test(sel) || /(^|[;{\s])(color|font-size|letter-spacing|line-height)\s*:/.test(than) });
    }
  }

  const nangs = viPham.filter((v) => v.chu);
  if (nangs.length)
    add('mot.12-tuong-phan-chu-animate', 'FAIL', `${nangs.length} recipe buộc opacity theo cuộn xuống ${nangs.map((v) => v.min).join('/')} trên phần tử CHỮ (${nangs.map((v) => v.f + ":" + v.ten).join(', ')}) — chữ mờ dưới chuẩn tương phản khi người đọc dừng giữa chừng; đổi sang animate filter blur() để giữ nguyên màu+độ đục`);
  else if (viPham.length)
    add('mot.12-tuong-phan-chu-animate', 'WARN', `${viPham.length} chỗ buộc opacity theo cuộn xuống dưới 1 (${viPham.map((v) => v.f + ":" + v.ten).join(', ')}) — không thấy dấu hiệu xử lý chữ nên chỉ cảnh báo; nếu phần tử đó có chữ thì phải đổi sang blur()`);
  // "Không đo được" phải tính CẢ tệp .css — từ 06/08 cổng soi hai con đường, mà nhánh này còn đếm
  // mỗi .tsx nên web/mẫu chỉ dùng CSS thuần bị kêu "không tìm thấy nguồn" ngay sau khi cổng vừa đo
  // xong chính nó (đối chứng pass-css bắt được). Đây đúng kiểu WARN-mù: máy đã nhìn thấy mà vẫn khai
  // là không nhìn thấy, người đọc tưởng cổng chưa chạy.
  else if (!files.length && !cssFiles.length) add('mot.12-tuong-phan-chu-animate', 'WARN', 'Không tìm thấy thư mục nguồn để kiểm');
  else add('mot.12-tuong-phan-chu-animate', 'PASS', `${files.length} tệp nguồn + ${cssFiles.length} tệp CSS: không chỗ nào buộc opacity chữ theo cuộn`);
}

// mot.10-canvas-ky-luat — Đợt 3 chiến dịch hiệu ứng điện ảnh (20260716, mã gốc kế hoạch "mot.8" đã
// dùng cho signature-bo1 nên đổi sang 10). Nguyên tắc sắt 3: file dùng requestAnimationFrame(/
// getContext( phải tự pause khi tab ẩn (visibilitychange)/ngoài viewport (IntersectionObserver) —
// bắt buộc trong CHÍNH file đó (không tách được). Nhánh reduced-motion có thể nằm ở file GỌI nó
// (motion-recipes.tsx thường `if (reduce) return` trước khi tạo canvas — kể cả qua factory dùng
// chung như `makeCanvasWrap`) nên dò cả file vẽ lẫn nơi gọi trước khi kết luận thiếu.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib'))) return d; d = join(d, '..'); } return null; })();
  const srcDir = root ? join(root, 'src') : null;
  const canvasFiles = [];
  if (srcDir && existsSync(srcDir)) (function walk(d) { for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); }
    else if (/\.(ts|tsx)$/.test(f)) { const s = readFileSync(p, 'utf8');
      // Chỉ bắt file THẬT SỰ vẽ Canvas: getContext( là tín hiệu mạnh (hiếm utility non-Canvas nào
      // gọi); requestAnimationFrame( một mình quá chung chung (nhiều hook debounce/scroll dùng rAF
      // không phải hiệu ứng — false positive thật gặp trên fixture: useVisualViewport.ts, một hook
      // scroll-into-view bàn phím mobile, không phải hiệu ứng trang trí nên không cần pause/reduced).
      if (/getContext\(/.test(s) || (/requestAnimationFrame\(/.test(s) && /effects-canvas/.test(p))) canvasFiles.push({ f, p, src: s }); }
  }})(srcDir);
  if (!canvasFiles.length) add('mot.10-canvas-ky-luat', 'PASS', 'Không có file dùng requestAnimationFrame/getContext( — N/A');
  else {
    const recipesPath = root ? join(root, 'src/lib/motion-recipes.tsx') : null;
    const recipesSrc = recipesPath && existsSync(recipesPath) ? readFileSync(recipesPath, 'utf8') : '';
    const bad = [];
    for (const cf of canvasFiles) {
      const hasPause = /visibilitychange|IntersectionObserver/.test(cf.src);
      let hasReducedBranch = /reduced?-?motion|useReducedMotion/i.test(cf.src);
      if (!hasReducedBranch && recipesSrc) {
        const base = cf.f.replace(/\.(ts|tsx)$/, '');
        const importIdx = recipesSrc.search(new RegExp(`import\\(['"\`][^'"\`]*${base}['"\`]\\)`));
        if (importIdx !== -1) {
          const windowBefore = recipesSrc.slice(Math.max(0, importIdx - 400), importIdx);
          if (/reduce/i.test(windowBefore)) hasReducedBranch = true;
          else { const factoryName = windowBefore.match(/(\w+)\(\s*\(\)\s*=>\s*$/)?.[1];
            if (factoryName) { const factoryIdx = recipesSrc.indexOf(`function ${factoryName}(`);
              if (factoryIdx !== -1 && /reduce/i.test(recipesSrc.slice(factoryIdx, factoryIdx + 2500))) hasReducedBranch = true; } }
        }
      }
      if (!hasPause || !hasReducedBranch) bad.push(`${cf.f}${!hasPause ? ' (thiếu pause tab-ẩn/viewport)' : ''}${!hasReducedBranch ? ' (không thấy nhánh reduced-motion)' : ''}`);
    }
    bad.length
      ? add('mot.10-canvas-ky-luat', 'WARN', `${bad.length}/${canvasFiles.length} file Canvas thiếu kỷ luật an toàn: ${bad.slice(0,5).join('; ')}`)
      : add('mot.10-canvas-ky-luat', 'PASS', `${canvasFiles.length} file Canvas đều có pause + nhánh reduced-motion`);
  }
}

// mot.11-hieu-ung-nang-co-so-do — Đợt 3 chiến dịch hiệu ứng điện ảnh (20260716, mã gốc kế hoạch
// "mot.9"; đánh số lại 11 cho liền mạch với 9/10 vừa thêm ở trên, tránh cách số vô nghĩa). Web dùng
// ≥1 hiệu ứng NHÓM NẶNG (Nhóm I/J, khai trong `SO-TAY-MAY-KIEM/hieu-ung-nang.json`) phải ghi dòng đo
// hiệu năng thật (LCP/INP) trong DESIGN-DNA.md — buộc quy trình PHẢI đo trước khi bàn giao, không
// chỉ tin cảm giác "chắc nhẹ" (nguyên tắc sắt 2).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'DESIGN-DNA.md'))) return d; d = join(d, '..'); } return null; })();
  const manifestPath = join(HERE, 'hieu-ung-nang.json');
  if (!root || !existsSync(manifestPath)) { add('mot.11-hieu-ung-nang-co-so-do', 'PASS', 'Không đủ dữ liệu (DESIGN-DNA.md/manifest) — N/A'); }
  else {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const nang = new Set([...(manifest.nhomI || []), ...(manifest.nhomJ || [])]);
    const srcDir = join(root, 'src');
    const srcFiles = [];
    if (existsSync(srcDir)) (function walk(d) { for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); }
      else if (/\.(tsx|jsx)$/.test(f) && !/motion-recipes\.tsx$/.test(f)) srcFiles.push(p);
    }})(srcDir);
    const allSrc = srcFiles.map(f => readFileSync(f, 'utf8')).join('\n');
    const dungNang = [...nang].filter(n => new RegExp(`recipe\\s*=\\s*["']${n}["']`).test(allSrc));
    if (!dungNang.length) add('mot.11-hieu-ung-nang-co-so-do', 'PASS', 'Không dùng hiệu ứng nhóm nặng I/J — N/A');
    else {
      const dna = readFileSync(join(root, 'DESIGN-DNA.md'), 'utf8');
      const coSoDo = /(LCP|INP)[^\n]*\d/i.test(dna);
      coSoDo
        ? add('mot.11-hieu-ung-nang-co-so-do', 'PASS', `Dùng ${dungNang.join(', ')} VÀ có ghi số đo LCP/INP trong DESIGN-DNA.md`)
        : add('mot.11-hieu-ung-nang-co-so-do', 'WARN', `Dùng hiệu ứng nhóm nặng (${dungNang.join(', ')}) nhưng DESIGN-DNA.md CHƯA có dòng số đo LCP/INP thật — đo trước khi bàn giao (nguyên tắc sắt 2)`);
    }
  }
}

// ── Batch Đợt 3 chiến dịch NÂNG BẢO MẬT (20260716, kế hoạch swirling-jumping-pearl.md mục Đợt 3):
// sec.1→sec.8 đúc 8/12 tiêu chí trụ "sec — Bảo mật" (luat-qt.v5.json) vốn chỉ được AI phụ chấm CHỦ
// QUAN lúc /nang-cap-web thành cổng chặn CỨNG tự động. Tất cả 8 cổng đọc thẳng SOURCE (next.config.ts/
// middleware.ts/route.ts/error.tsx/.env.example/workflows) — KHÔNG phụ thuộc htmls/csss — nên chạy
// giống hệt nhau ở cả --source-only lẫn full (đã đối chiếu tay, xem NGUON_THUAN_IDS bên trên). ──

// sec.1-header-baseline — 4 header nền tảng OWASP phải khai trong next.config.ts. Thiếu 1 = giảm
// phòng thủ clickjacking (X-Frame-Options)/MIME-sniffing (X-Content-Type-Options)/HSTS downgrade/
// rò quyền trình duyệt (Permissions-Policy) cho MỌI trang của web.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'next.config.ts'))) return d; d = join(d, '..'); } return null; })();
  const cfgPath = root ? join(root, 'next.config.ts') : null;
  // Vá 19/07/2026 (Ông chỉ ra qua đợt khám tổng thể): vắng HẲN next.config.ts nghiêm trọng hơn "có
  // nhưng thiếu header" (không chỉ thiếu 1 header, mà thiếu CẢ CƠ CHẾ set header) — trước đây chấm
  // WARN ngang với các cổng "không đủ dữ liệu để kiểm", khiến web sống scaffold trước khi có template
  // security 0% hạ tầng vẫn lọt qua nghiệm thu vì WARN không chặn (chuẩn "0 FAIL" của quy trình).
  if (!cfgPath || !existsSync(cfgPath)) { add('sec.1-header-baseline', 'FAIL', 'KHÔNG có next.config.ts — 0% hạ tầng header bảo mật (HSTS/nosniff/Permissions-Policy/X-Frame-Options đều vắng mặt), nghiêm trọng hơn "có nhưng thiếu 1 header"'); }
  else {
    const cfg = readFileSync(cfgPath, 'utf8');
    const need = [
      ['Strict-Transport-Security (HSTS)', c => /Strict-Transport-Security/.test(c)],
      ['X-Content-Type-Options: nosniff', c => /X-Content-Type-Options/.test(c) && /nosniff/.test(c)],
      ['Permissions-Policy', c => /Permissions-Policy/.test(c)],
      ['X-Frame-Options', c => /X-Frame-Options/.test(c)],
    ];
    const missing = need.filter(([, fn]) => !fn(cfg)).map(([n]) => n);
    missing.length
      ? add('sec.1-header-baseline', 'FAIL', `next.config.ts thiếu header: ${missing.join(', ')}`)
      : add('sec.1-header-baseline', 'PASS', 'Đủ 4 header nền tảng (HSTS/nosniff/Permissions-Policy/X-Frame-Options)');
  }
}

// sec.2-csp-unsafe-eval — script-src chỉ được có 'unsafe-eval' bên trong nhánh TRUE của 1 ternary
// khoá theo biến môi trường dev (isDev/NODE_ENV) — để trần ngoài production mở cửa eval()/Function()
// chạy chuỗi tiêm được, rủi ro XSS nặng hơn hẳn unsafe-inline (lý do unsafe-inline vẫn phải giữ đã
// ghi ở middleware.ts, xem bài học Đợt 2 20260716).
// Vá 20260721 (đề xuất vai 7 /nang-cap-web nhahoachdinh): Next.js 16.2.9+ đổi quy ước
// `middleware.ts` → `proxy.ts` (hàm middleware()→proxy(), có codemod tự động; 2 file cùng tồn tại =
// build error). Cổng cũ CHỈ dò `src/middleware.ts` → web nào đã migrate sang proxy.ts (như
// nhahoachdinh-vn-live trên Next 16.2.9) bị FAIL OAN dù CSP chạy đủ 100% (đã verify sống bằng
// Playwright). Nay dò CẢ 4 vị trí hợp lệ (src/ + root, proxy trước — quy ước mới ưu tiên), leo tối đa
// 4 cấp thư mục. `middleware` vẫn được Next nhận (deprecated), nên chấp nhận cả 2 tên là ĐÚNG chuẩn.
{ const CANDS = ['src/proxy.ts', 'src/middleware.ts', 'proxy.ts', 'middleware.ts'];
  const mwPath = (() => { let d = DIR; for (let i = 0; i < 4; i++) { for (const c of CANDS) { const p = join(d, c); if (existsSync(p)) return p; } d = join(d, '..'); } return null; })();
  // Vá 19/07/2026 (cùng lý do sec.1): vắng HẲN middleware/proxy nghĩa là CSP CHƯA TỪNG được set trên bất
  // kỳ request nào — không phải "không kiểm được", mà là "chắc chắn không có". Web sống thiếu hẳn CSP
  // (0 header Content-Security-Policy trên mọi response) nghiêm trọng hơn 1 web có CSP nhưng cấu hình
  // sai — trước đây cả 2 trường hợp đều rơi vào FAIL/WARN tuỳ tình huống, giờ tách rõ: vắng mặt = FAIL.
  if (!mwPath) { add('sec.2-csp-unsafe-eval', 'FAIL', 'KHÔNG có src/proxy.ts hay src/middleware.ts — CSP chưa từng được set trên bất kỳ response nào (0% hạ tầng, không phải lỗi cấu hình)'); }
  else {
    const mw = readFileSync(mwPath, 'utf8');
    if (!/script-src/.test(mw)) { add('sec.2-csp-unsafe-eval', 'WARN', `Không thấy script-src trong ${mwPath.split('/').slice(-2).join('/')} — kiểm tay CSP có được set không`); }
    else if (!/unsafe-eval/.test(mw)) { add('sec.2-csp-unsafe-eval', 'PASS', 'script-src không có unsafe-eval'); }
    else {
      // Vá 16/07/2026 (nghiệm thu độc lập phát hiện false-PASS THẬT): heuristic cũ chỉ đo khoảng
      // cách `?`/`:` quanh vị trí "unsafe-eval" — bị `?.` optional-chaining ở gần đó đánh lừa (test
      // tái hiện: `process.env?.NODE_ENV` + unsafe-eval để trần chỗ khác vẫn báo "GUARDED"). Đổi
      // sang PARSE ĐÚNG cấu trúc ternary `<biến dev> ? "<chuỗi>" : "<chuỗi>"` — bắt buộc phải có dấu
      // nháy (") ngay sau `?` mới tính là 1 nhánh ternary thật, `?.` không có nháy ngay sau nên
      // không còn đánh lừa được. Chỉ PASS khi "unsafe-eval" nằm THẬT trong chuỗi nhánh TRUE.
      const ternaryRe = /(isDev|IS_DEV|NODE_ENV\s*!==?\s*["'`]production["'`]|process\.env\.NODE_ENV\s*!==?\s*["'`]production["'`])\s*\?\s*(["'`])((?:(?!\2)[\s\S])*?)\2\s*:\s*(["'`])(?:(?!\4)[\s\S])*?\4/g;
      let guarded = false, m;
      while ((m = ternaryRe.exec(mw))) { if (m[3].includes('unsafe-eval')) { guarded = true; break; } }
      guarded
        ? add('sec.2-csp-unsafe-eval', 'PASS', "script-src có 'unsafe-eval' nhưng nằm trong nhánh dev-only (guard isDev/NODE_ENV) — production sạch")
        : add('sec.2-csp-unsafe-eval', 'FAIL', "script-src có 'unsafe-eval' KHÔNG thấy guard môi trường dev quanh nó — có thể lọt production, mở cửa eval() cho XSS");
    }
  }
}

// seo.44-danh-tinh-domain — 20260815, Ông giao sau khi bó lại toàn bộ chỗ dính "farmstay.vn".
// BỆNH THẬT, ĐANG SỐNG: web được chép từ một web khác rồi KHÔNG AI TRỎ LẠI TÊN MIỀN. Đo 15/08:
//   · trancongthuy-vn — 10 tệp mã nguồn khai cứng "https://farmstay.vn" (rss · indexnow · webhook
//     · revalidate · og · gsc-ping · ve-tac-gia …), mà web này KHÔNG hề có src/lib/site-config.ts
//   · sanvietfarm-vn  — 3 tệp cùng loại
// Hậu quả im lặng: bản tin RSS khai web này là farmstay.vn · lệnh báo công cụ tìm kiếm gửi sang tên
// miền KHÁC nên trang mới của chính nó không bao giờ được nộp · lệnh làm mới bộ nhớ đệm nhắm sai
// tên miền nên nội dung có thể không bao giờ cập nhật. `npm run build` VẪN XANH suốt.
// Sổ đã ghi đúng bệnh này ở trandanhmanh-com: "RSS + 4 route từng khai danh tính farmstay.vn mà
// 9 cổng KHÔNG bắt" — trandanhmanh đã vá, hai web trên thì chưa, và vẫn không cổng nào bắt.
//
// CHỐNG BÁO OAN — hai giới hạn CỐ Ý, đừng gỡ:
//   ① KHÔNG quét `src/components/**`: liên kết chéo tới thực thể CÓ THẬT trong hệ sinh thái là cố
//      ý và hợp lệ (vd founder trỏ nhahoachdinh.vn, hoặc vnfarmstay.vn ↔ xuyenvietfarmstay.vn —
//      đều có tên trong 01-LUAT/ENTITY-GRAPH.json). Cổng này gác TÊN MIỀN, không gác nội dung.
//      ⚠️ ĐÍNH CHÍNH 15/08/2026: bản đầu lấy ví dụ "Cộng đồng Farmstay Việt Nam" ở chân trang
//      trancongthuy-vn làm mẫu liên-kết-hợp-lệ. Ông bác: **cộng đồng đó CHƯA CÓ**, và ENTITY-GRAPH
//      cũng không khai thực thể nào tên vậy ⇒ đó là THỰC THỂ BỊA, không phải liên kết hợp lệ.
//      Bài học: "có liên kết chéo" KHÔNG suy ra "thực thể có thật" — muốn biết thật hay bịa thì
//      tra ENTITY-GRAPH, đừng suy từ việc mã đang trỏ tới nó. Cổng này CỐ Ý không bắt loại đó
//      (khác việc), nhưng đừng ai đọc ghi chú này rồi tưởng nhãn ấy đã được xác nhận là thật.
//   ② Chỉ bắt phép GÁN vào biến DANH TÍNH, không bắt mọi lần nhắc tên miền. Khối `sameAs` trong
//      JSON-LD của web trực thuộc CÓ QUYỀN trỏ sang tên miền mẹ.
{
  const rootId = (() => { let d = DIR; for (let i = 0; i < 5; i++) { if (existsSync(join(d, 'src'))) return d; d = join(d, '..'); } return null; })();
  if (!rootId) {
    add('seo.44-danh-tinh-domain', 'WARN', 'Không tìm thấy src/ để kiểm — kiểm tay xem có tệp nào khai cứng tên miền của web khác không');
  } else {
    // Tên miền CỦA CHÍNH WEB — dò theo 3 nguồn, hết cả 3 thì WARN chứ KHÔNG đoán bừa rồi FAIL oan.
    const docNeu = (p) => (existsSync(p) ? readFileSync(p, 'utf8') : '');
    const tuCauHinh = (docNeu(join(rootId, 'src/lib/site-config.ts')).match(/https?:\/\/([a-z0-9.-]+)/i) || [])[1];
    const tuEnv = ((docNeu(join(rootId, '.env')) + docNeu(join(rootId, '.env.local'))).match(/SITE_URL\s*=\s*https?:\/\/([a-z0-9.-]+)/i) || [])[1];
    // ⛔ ĐÃ THỬ VÀ BỎ (15/08/2026): nguồn thứ 3 "suy tên miền TỪ TÊN THƯ MỤC" (trancongthuy-vn →
    // trancongthuy.vn). Nghe hợp lý, chạy thử trên web thật thì ĐẺ RA 44 BÁO OAN chỉ ở một web:
    // thư mục tên `hoinghisaurieng-vn` nhưng tên miền thật là `hoinghisaurieng.com` — cổng bèn coi
    // MỌI liên kết tới chính nhà nó là "tên miền lạ". Tên thư mục KHÔNG PHẢI nguồn sự thật về tên
    // miền (sổ hộ khẩu đã ghi đúng cạm bẫy này). Thà WARN "không biết" còn hơn FAIL hàng loạt —
    // cổng báo oan sẽ bị người ta tắt đi, rồi mất luôn cả những ca nó bắt đúng.
    // KHÔNG mất răng: hai web bệnh nặng nhất (trancongthuy-vn · sanvietfarm-vn) đều đọc được tên
    // miền từ `.env`, vẫn bị bắt đủ.
    const nhaMinh = tuCauHinh || tuEnv;
    const nguon = tuCauHinh ? 'site-config.ts' : tuEnv ? '.env' : null;

    if (!nhaMinh) {
      add('seo.44-danh-tinh-domain', 'WARN', 'Không đọc được tên miền của chính web (không có src/lib/site-config.ts lẫn SITE_URL trong .env) — cổng KHÔNG dám chấm, vì đoán sai một lần là báo oan cả web; vá gốc: khai SITE_URL trong site-config.ts như 05-TEMPLATE-CHUAN');
    } else {
      const VAI_DANH_TINH = /src\/(app\/(layout\.tsx|robots\.ts|sitemap\.ts|rss\.xml\/route\.ts|api\/[\w-]+\/route\.tsx?)|lib\/(seo|schema|site-config)\.ts)$/;
      // Tên BIẾN DANH TÍNH — bắt cả dạng gán `=` lẫn dạng thuộc tính `:`, vì cả hai đều là web
      // tự khai mình là ai (`const SITE_URL =` · `alternates: { canonical: }`).
      const BIEN_CHAT = /\b(SITE|SITE_URL|siteUrl|baseUrl|BASE_URL|SITE_ORIGIN|canonical)\s*[:=]\s*[`"']https?:\/\/([a-z0-9.-]+)/g;
      // Trong tệp VAI DANH TÍNH thì bắt thêm biến tên chung (`url`/`origin`/`host`) — NHƯNG CHỈ
      // dạng GÁN `=`, CỐ Ý bỏ dạng thuộc tính `url:`. Vì sao: bản đầu bắt cả `url:` và lập tức
      // chấm oan `founder: { name: "Phạm Thanh Tùng", url: "https://nhahoachdinh.vn" }` trong
      // layout.tsx của xuyenvietfarmstay — đó là liên kết THỰC THỂ tới trang cá nhân của chủ,
      // đúng chuẩn Entity SEO và là thứ Mạng lưới Tri thức MUỐN có. `url:` lồng trong khối
      // founder/author/publisher/sameAs là trỏ sang thực thể khác; `const url =` mới là web đang
      // tự dựng địa chỉ của CHÍNH NÓ.
      const GAN_RONG = /\b(url|origin|host)\s*=\s*[`"']https?:\/\/([a-z0-9.-]+)/g;
      const laNha = (d) => d === nhaMinh || d === `www.${nhaMinh}` || d === 'localhost' || d.endsWith('.localhost');
      const dinh = [];
      (function walk(d, sau = 0) {
        if (sau > 6) return;
        for (const f of readdirSync(d)) {
          const p = join(d, f);
          if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git|components/.test(f)) walk(p, sau + 1); continue; }
          if (!/\.(ts|tsx)$/.test(f)) continue;
          const rel = p.replace(rootId + '/', '');
          const src = boChuThichChung(readFileSync(p, 'utf8'), 'js');
          const dsRe = VAI_DANH_TINH.test(rel) ? [BIEN_CHAT, GAN_RONG] : [BIEN_CHAT];
          for (const re of dsRe) {
            re.lastIndex = 0;
            let m;
            while ((m = re.exec(src))) if (!laNha(m[2])) dinh.push(`${rel} khai ${m[1]}="${m[2]}"`);
          }
        }
      })(join(rootId, 'src'));

      const ds = [...new Set(dinh)];
      ds.length
        ? add('seo.44-danh-tinh-domain', 'FAIL', `${ds.length} chỗ khai cứng tên miền của web KHÁC (nhà mình là "${nhaMinh}", đọc từ ${nguon}): ${ds.slice(0, 6).join(' · ')}${ds.length > 6 ? ` … +${ds.length - 6}` : ''} — RSS/nộp-tìm-kiếm/làm-mới-cache sẽ nhắm sai tên miền, build vẫn xanh`)
        : add('seo.44-danh-tinh-domain', 'PASS', `Không tệp danh tính nào khai cứng tên miền lạ (nhà mình "${nhaMinh}", đọc từ ${nguon})`);
    }
  }
}

// sec.9-csp-referrer — 20260811: BỊT 2 VẾ CÒN HỞ của tiêu chí MUST "Security headers: CSP · nosniff
// · Referrer/Permissions-Policy". Trước đây tiêu chí đó khai do_phu:"mot-phan" và đúng là một phần:
//   · sec.1 kiểm HSTS/nosniff/Permissions-Policy/X-Frame-Options — KHÔNG kiểm CSP, KHÔNG kiểm Referrer.
//   · sec.2 FAIL khi VẮNG HẲN middleware, nhưng nếu CÓ middleware mà KHÔNG set CSP thì chỉ WARN
//     (dòng "Không thấy script-src") ⇒ WARN không chặn ⇒ web thiếu CSP vẫn qua nghiệm thu "0 FAIL".
//   · Referrer-Policy: KHÔNG cổng nào kiểm.
// CỐ Ý dựng cổng RIÊNG thay vì siết sec.1: siết sec.1 sẽ đổi verdict mẫu `pass/` sẵn có (chỉ khai 4
// header) ⇒ hồi quy corpus. Bài học LÔ 3: cổng đã có fixture thì mở rộng bằng cổng/biến thể MỚI,
// CẤM ghi đè pass/fail gốc.
// Soi CẢ HAI nơi hợp lệ (next.config.* và middleware/proxy) vì CSP thường đặt ở middleware còn
// Referrer-Policy thường đặt ở next.config — đòi đúng một nơi là chấm oan.
{
  // ⚠️ Bẫy đã trả giá khi dựng cổng này: tìm next.config và middleware ĐỘC LẬP nhau thì mẫu thử
  // thiếu middleware sẽ LEO LÊN đọc middleware của template — mẫu "có CSP nhưng thiếu Referrer"
  // ra PASS oan (mẫu chống-vá-quá-tay bắt được). Phải CHỐT GỐC WEB trước rồi chỉ đọc trong gốc đó.
  const CFG = ['next.config.ts', 'next.config.mjs', 'next.config.js'];
  const MW = ['src/proxy.ts', 'src/middleware.ts', 'proxy.ts', 'middleware.ts'];
  const goc = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if ([...CFG, ...MW].some((c) => existsSync(join(d, c)))) return d; d = join(d, '..'); } return null; })();
  const nguonP = goc ? [...CFG, ...MW].map((c) => join(goc, c)).filter((p) => existsSync(p)) : [];
  // Bỏ chú thích trước khi soi: chuỗi tên header nằm trong comment (`// TODO: thêm Referrer-Policy`)
  // KHÔNG phải là header đã đặt — tính vào là PASS oan. Lỗi này bắt được ngay khi dựng mẫu thử.
  // ⚠️ VÁ 15/08/2026 — BÁO OAN NẶNG, cổng này từng chấm SAI suốt từ 11/08 và làm cả một phiên tin
  // rằng "05-TEMPLATE-CHUAN thiếu hẳn CSP" rồi ghi vào sổ + trình Ông. SỰ THẬT: template CÓ CSP đầy
  // đủ ở src/middleware.ts. Thủ phạm là chính phép bỏ chú thích cũ (2 lệnh replace bằng regex):
  // chuỗi `https://*.tile.openstreetmap.org` chứa `/*` ⇒ regex khối tưởng đó là MỞ chú thích, rồi
  // ngoạm tới dấu `*/` thật ở tận dòng 47 — nuốt trọn dòng `headers.set("Content-Security-Policy")`.
  // Cùng họ với bài học cũ "chú thích khối chứa * và / liền nhau đóng chú thích sớm, chết tệp",
  // nhưng chiều ngược lại. Regex KHÔNG phân biệt nổi chuỗi với chú thích ⇒ phải quét có trạng thái.
  // Dùng BỘ QUÉT CHUNG `boChuThichChung` (khai ở đầu tệp) — CẤM tự chế lại ở đây.
  const boChuThich = (x) => boChuThichChung(x, 'js');

  const vanBan = nguonP.map((p) => boChuThich(readFileSync(p, 'utf8'))).join('\n');
  if (!vanBan) {
    add('sec.9-csp-referrer', 'FAIL', 'KHÔNG có next.config.* lẫn middleware/proxy — không nơi nào đặt được CSP hay Referrer-Policy');
  } else {
    const thieu = [];
    if (!/Content-Security-Policy/i.test(vanBan)) thieu.push('Content-Security-Policy (CSP — chính sách nguồn nội dung)');
    if (!/Referrer-Policy/i.test(vanBan)) thieu.push('Referrer-Policy (chính sách gửi kèm địa chỉ nguồn)');
    thieu.length
      ? add('sec.9-csp-referrer', 'FAIL', `Thiếu header: ${thieu.join(', ')} — soi cả next.config.* lẫn middleware/proxy đều không thấy`)
      : add('sec.9-csp-referrer', 'PASS', 'Có khai cả Content-Security-Policy và Referrer-Policy');
  }
}

// sec.3-ratelimit-post — mọi route API app/api/*/route.ts export POST (nhận input kích hoạt hành
// động bên ngoài: ping Google, revalidate cache, webhook...) nên gọi checkRateLimit() chống
// brute-force/đốt quota. WARN (heuristic — tránh báo oan route POST không thật sự nhận input công
// khai, đúng tinh thần các cổng heuristic khác trong file này).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/api'))) return d; d = join(d, '..'); } return null; })();
  const apiDir = root ? join(root, 'src/app/api') : null;
  if (!apiDir || !existsSync(apiDir)) { add('sec.3-ratelimit-post', 'PASS', 'Không có src/app/api — N/A'); }
  else {
    const routes = [];
    (function walk(d) { for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) walk(p);
      else if (f === 'route.ts') routes.push({ p, s: readFileSync(p, 'utf8') });
    }})(apiDir);
    const thieu = routes.filter(r => /export\s+async\s+function\s+POST/.test(r.s) && !/checkRateLimit/.test(r.s));
    thieu.length
      ? add('sec.3-ratelimit-post', 'WARN', `${thieu.length} route POST thiếu checkRateLimit: ${thieu.map(r => r.p.replace(root + '/', '')).join(', ')}`)
      : add('sec.3-ratelimit-post', 'PASS', `${routes.length} route API đều gọi checkRateLimit ở POST (hoặc không có POST)`);
  }
}

// sec.4-no-secret-in-public-env — biến NEXT_PUBLIC_* bị Next.js NHÚNG THẲNG vào bundle client, ai mở
// DevTools cũng đọc được — tên biến chứa key/token/password/secret là dấu hiệu nhầm biến bí mật vào
// nhóm công khai (dù giá trị thật đặt ở đâu, cứ đặt SAI TIỀN TỐ là rò rỉ).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src'))) return d; d = join(d, '..'); } return null; })();
  const srcDir = root ? join(root, 'src') : null;
  const names = new Set();
  if (srcDir && existsSync(srcDir)) (function walk(d) { for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); }
    else if (/\.(ts|tsx)$/.test(f)) { for (const m of readFileSync(p, 'utf8').matchAll(/NEXT_PUBLIC_[A-Z0-9_]+/g)) names.add(m[0]); }
  }})(srcDir);
  const envExamplePath = root ? join(root, '.env.example') : null;
  if (envExamplePath && existsSync(envExamplePath)) for (const m of readFileSync(envExamplePath, 'utf8').matchAll(/NEXT_PUBLIC_[A-Z0-9_]+/g)) names.add(m[0]);
  // Vá 16/07/2026 (nghiệm thu độc lập): (a) thêm từ khoá CREDENTIAL — bản cũ bỏ lọt kiểu tên
  // NEXT_PUBLIC_CREDENTIAL_ID; (b) trừ các tên public-key-theo-thiết-kế phổ biến (Google Maps/
  // reCAPTCHA/Stripe publishable/OAuth client id) — giá trị THẬT phải public, nhà cung cấp tự bảo vệ
  // bằng domain-restriction/scope, không phải "đặt sai tiền tố" như key/token/secret thường.
  const BAD_KEYWORD = /KEY|TOKEN|PASSWORD|SECRET|CREDENTIAL/;
  const KNOWN_PUBLIC_SAFE = /PUBLISHABLE|SITE_KEY|CLIENT_ID|MAPS_KEY|RECAPTCHA/;
  const bad = [...names].filter(n => BAD_KEYWORD.test(n) && !KNOWN_PUBLIC_SAFE.test(n));
  bad.length
    ? add('sec.4-no-secret-in-public-env', 'FAIL', `Biến công khai (NEXT_PUBLIC_*) mang tên bí mật: ${bad.join(', ')} — đổi tiền tố, dùng biến server-only`)
    : add('sec.4-no-secret-in-public-env', 'PASS', `${names.size} biến NEXT_PUBLIC_* đều không mang tên bí mật`);
}

// sec.5-error-no-stack-source — bổ sung tầng NGUỒN cho resilience.8-error-leak (cổng cũ chỉ soi HTML
// đã build, cần .next). Đọc thẳng error.tsx/global-error.tsx — chỉ được render error.digest, KHÔNG
// được nội suy error.message/error.stack ra JSX (rò rỉ chi tiết nội bộ, phục vụ dò lỗi tấn công).
// console.error(error)/reportError(error,...) vẫn hợp lệ (không hiện ra UI, chỉ log/monitoring).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app'))) return d; d = join(d, '..'); } return null; })();
  const paths = root ? ['src/app/error.tsx', 'src/app/global-error.tsx'].map(p => join(root, p)).filter(existsSync) : [];
  if (!paths.length) { add('sec.5-error-no-stack-source', 'WARN', 'Không tìm thấy error.tsx/global-error.tsx để kiểm'); }
  else {
    // Vá 16/07/2026: chỉ tính là RÒ RỈ khi error.message/error.stack nằm TRONG interpolation JSX
    // `{...}` (thứ duy nhất thật sự render ra UI). Nhưng `{...}` cũng chính là khối lệnh JS thường
    // (vd thân callback `() => { console.error(error.message) }`) — 22/07/2026 phát hiện false-FAIL
    // THẬT: log thuần trong useEffect/callback bị bắt oan vì regex không phân biệt được khối lệnh với
    // interpolation JSX. Vá: cắt bỏ HẲN nội dung bên trong các lời gọi log/monitoring hợp lệ
    // (console.error/warn, reportError, Sentry.captureException — kể cả ngoặc tròn lồng nhau) TRƯỚC
    // khi soi `{...}`, để error.message/stack nằm trong các lời gọi đó không còn tồn tại mà bị bắt.
    const stripLoggingCalls = (src) => {
      let out = src;
      for (const name of ['console.error', 'console.warn', 'reportError', 'Sentry.captureException']) {
        let idx = 0;
        while ((idx = out.indexOf(name + '(', idx)) !== -1) {
          let depth = 0, i = idx + name.length;
          for (; i < out.length; i++) {
            if (out[i] === '(') depth++;
            else if (out[i] === ')') { depth--; if (depth === 0) { i++; break; } }
          }
          out = out.slice(0, idx) + out.slice(i);
        }
      }
      return out;
    };
    const bad = paths.filter(p => /\{[^{}]*error\.(message|stack)[^{}]*\}/.test(stripLoggingCalls(readFileSync(p, 'utf8'))));
    bad.length
      ? add('sec.5-error-no-stack-source', 'FAIL', `${bad.map(p => p.replace(root + '/', '')).join(', ')} render error.message/error.stack ra UI — chỉ dùng error.digest`)
      : add('sec.5-error-no-stack-source', 'PASS', 'error.tsx/global-error.tsx chỉ hiện error.digest');
  }
}

// sec.6-form-honeypot-server — nếu web đã wire 1 route API xử lý ContactForm (nhận field honeypot
// "_trap", xem 03-KHO-LINH-KIEN/blocks/ContactForm.tsx), route đó PHẢI gọi verifyHoneypot() +
// checkRateLimit() — honeypot CHỈ ở client (field ẩn) bị bypass bằng gọi thẳng API, mất tác dụng.
// Chưa wire route nào = PASS/N-A (nhiều web dùng form bên thứ 3/Sanity, không có route riêng).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/api'))) return d; d = join(d, '..'); } return null; })();
  const apiDir = root ? join(root, 'src/app/api') : null;
  const routes = [];
  if (apiDir && existsSync(apiDir)) (function walk(d) { for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (f === 'route.ts') routes.push({ p, s: readFileSync(p, 'utf8') });
  }})(apiDir);
  const formRoutes = routes.filter(r => /_trap|verifyHoneypot/.test(r.s));
  if (!formRoutes.length) { add('sec.6-form-honeypot-server', 'PASS', 'Chưa wire route xử lý ContactForm (honeypot "_trap") — N/A'); }
  else {
    const thieu = formRoutes.filter(r => !/verifyHoneypot/.test(r.s) || !/checkRateLimit/.test(r.s));
    thieu.length
      ? add('sec.6-form-honeypot-server', 'WARN', `${thieu.map(r => r.p.replace(root + '/', '')).join(', ')} nhận field honeypot nhưng thiếu verifyHoneypot()/checkRateLimit() — bot bypass được bằng gọi thẳng API`)
      : add('sec.6-form-honeypot-server', 'PASS', `${formRoutes.length} route form đều có verifyHoneypot() + checkRateLimit()`);
  }
}

// sec.7-ci-npm-audit — CI phải có bước `npm audit` chặn lỗ hổng HIGH/CRITICAL trước khi merge, tránh
// dependency có CVE đã biết lọt vào production im lặng.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, '.github/workflows'))) return d; d = join(d, '..'); } return null; })();
  const wfDir = root ? join(root, '.github/workflows') : null;
  if (!wfDir || !existsSync(wfDir)) { add('sec.7-ci-npm-audit', 'WARN', 'Không tìm thấy .github/workflows — chưa có CI'); }
  else {
    const files = readdirSync(wfDir).filter(f => /\.ya?ml$/.test(f));
    // Vá 16/07/2026 (nghiệm thu độc lập): `[^\n]*` cũ đòi cùng 1 dòng — YAML `run: |` nhiều dòng (vd
    // `npm audit\n  --audit-level=high`) bị báo oan WARN dù có audit thật. Đổi sang cửa sổ ký tự cho
    // phép xuống dòng (không dùng `.` toàn văn để tránh khớp bừa 2 đầu quá xa nhau trong file lớn).
    const co = files.some(f => /npm audit[\s\S]{0,200}--audit-level[\s\S]{0,40}(high|critical)/i.test(readFileSync(join(wfDir, f), 'utf8')));
    co
      ? add('sec.7-ci-npm-audit', 'PASS', 'CI có bước npm audit --audit-level=high/critical')
      : add('sec.7-ci-npm-audit', 'WARN', `${files.length} workflow không thấy bước npm audit chặn HIGH/CRITICAL`);
  }
}

// sec.8-cookie-via-helper — mọi nơi set cookie riêng của web (session, A/B test...) nên đi qua
// setSecureCookie() (src/lib/secure-cookie.ts, Đợt 1 20260716) để tự động Secure+HttpOnly+SameSite —
// set thẳng `.cookies.set(` dễ quên 1 trong 3 cờ, cookie lộ qua JS (thiếu HttpOnly) hoặc gửi cả qua
// HTTP (thiếu Secure).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src'))) return d; d = join(d, '..'); } return null; })();
  const srcDir = root ? join(root, 'src') : null;
  const helperPath = root ? join(root, 'src/lib/secure-cookie.ts') : null;
  // Vá 16/07/2026 (nghiệm thu độc lập): bản cũ chỉ bắt `.cookies.set(` (property access) — bỏ lọt
  // idiom Next.js 16 App Router hay dùng nhất `(await cookies()).set(...)` (GỌI HÀM `cookies()` rồi
  // mới `.set(`, không có chuỗi ".cookies.set(" liền nhau), cùng `cookieStore.set(`/`document.cookie
  // =`/`Cookies.set(` (js-cookie).
  const COOKIE_SET_RE = /\.cookies\.set\(|cookies\(\)\)?\s*\.set\(|cookieStore\.set\(|document\.cookie\s*=|\bCookies\.set\(/g;
  // NÂNG 15/08/2026 (LÔ 5): tới hôm qua cổng này soi THỨ THAY THẾ ("nơi set cookie có đi qua
  // setSecureCookie() không") chứ chưa bao giờ soi THỨ LUẬT ĐÒI (đủ Secure + HttpOnly + SameSite).
  // Hệ quả nặng nhất: CHÍNH helper chưa từng bị kiểm — helper quên `httpOnly` thì mọi web vẫn PASS,
  // tức cổng canh cửa lại chưa bao giờ nhìn vào trong nhà. Nay soi thẳng 3 thuộc tính.
  const DU_3_CO = (s) => /\bsecure\b/i.test(s) && /\bhttp[-_]?only\b/i.test(s) && /\bsame[-_]?site\b/i.test(s);
  // Ca XOÁ cookie KHÔNG cần 3 cờ — không có ngoại lệ này thì cổng báo oan chắc chắn ở mọi nơi
  // đăng xuất/dọn phiên (đặt giá trị rỗng + hạn về 0 chính là cách xoá cookie chuẩn).
  const LA_XOA = (s) => /max[-_]?age\s*:\s*(-?\d\s*[,}]|0)/i.test(s) || /expires\s*:\s*new Date\(\s*0\s*\)/i.test(s) || /,\s*['"]{2}\s*,/.test(s);
  const helperThieu = [];
  const mayChuThieu = [];   // set cookie phía máy chủ mà thiếu cờ → lỗ thật, CHẶN
  const trinhDuyet = [];    // set cookie phía trình duyệt → về bản chất KHÔNG THỂ HttpOnly, chỉ nhắc
  const tuongDoi = (p) => p.replace(root + '/', '');

  // ① Soi CHÍNH helper trước — nó là nơi mọi cookie khác tin tưởng đi qua.
  if (helperPath && existsSync(helperPath)) {
    const src = readFileSync(helperPath, 'utf8');
    const co = { Secure: /\bsecure\b/i.test(src), HttpOnly: /\bhttp[-_]?only\b/i.test(src), SameSite: /\bsame[-_]?site\b/i.test(src) };
    const thieu = Object.entries(co).filter(([, v]) => !v).map(([k]) => k);
    if (thieu.length) helperThieu.push(`${tuongDoi(helperPath)} thiếu ${thieu.join('+')}`);
  }

  // ② Soi từng NƠI GỌI đặt cookie, không chỉ đếm tệp: một tệp có thể vừa đặt đúng vừa đặt sai.
  if (srcDir && existsSync(srcDir)) (function walk(d) { for (const f of readdirSync(d)) {
    const p = join(d, f);
    // `continue` chứ KHÔNG `return`: return thoát cả hàm walk ⇒ gặp thư mục con đầu tiên là bỏ
    // luôn phần còn lại của thư mục cha, cổng mù im lặng. (Tự bắt được lúc viết, 15/08/2026.)
    if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); continue; }
    if (!/\.(ts|tsx)$/.test(f) || p === helperPath) continue;
    const src = readFileSync(p, 'utf8');
    for (const m of src.matchAll(COOKIE_SET_RE)) {
      const cuaSo = src.slice(m.index, m.index + 400);   // đủ ôm trọn object tuỳ chọn của lời gọi
      if (LA_XOA(cuaSo)) continue;
      if (/document\.cookie|Cookies\.set/.test(m[0])) { trinhDuyet.push(`${tuongDoi(p)}`); continue; }
      if (!DU_3_CO(cuaSo)) mayChuThieu.push(`${tuongDoi(p)}`);
    }
  }})(srcDir);

  // MỘT CỔNG PHÁT MỘT VERDICT (xem ghi chú exp.32): gom hết rồi phát đúng một add().
  const nang = [...helperThieu, ...[...new Set(mayChuThieu)].map((x) => `${x} đặt cookie thiếu Secure/HttpOnly/SameSite`)];
  if (nang.length) {
    add('sec.8-cookie-via-helper', 'FAIL', `${nang.join(' · ')} — cookie thiếu cờ là lộ qua JS (thiếu HttpOnly) hoặc gửi cả qua HTTP (thiếu Secure)`);
  } else if (trinhDuyet.length) {
    add('sec.8-cookie-via-helper', 'WARN', `${[...new Set(trinhDuyet)].join(', ')} đặt cookie từ phía trình duyệt — dạng này VỀ BẢN CHẤT không thể HttpOnly; kiểm tay xem có phải cookie nhạy cảm không`);
  } else {
    add('sec.8-cookie-via-helper', 'PASS', 'Mọi nơi đặt cookie đều đủ Secure+HttpOnly+SameSite (hoặc web chưa dùng cookie riêng)');
  }
}

// hoavan.1-nguon-van-hoa — C6: web dùng .hoa-van-divider (gen-hoa-van.mjs) PHẢI có dòng
// "Hoa văn chữ ký:" kèm nguồn URL trong DESIGN-DNA.md — cổng danh dự văn hoá chống "Á Đông sáo rỗng".
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) add('hoavan.1-nguon-van-hoa', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const cssPath = join(root, 'src/app/globals.css'), dnaPath = join(root, 'DESIGN-DNA.md');
    const cssHasHoaVan = existsSync(cssPath) && readFileSync(cssPath, 'utf8').includes('HOA-VAN:START');
    if (!cssHasHoaVan) add('hoavan.1-nguon-van-hoa', 'PASS', 'Chưa dùng hoa văn chữ ký — N/A');
    else { const dnaOk = existsSync(dnaPath) && /Hoa văn chữ ký:.*https?:\/\//.test(readFileSync(dnaPath, 'utf8'));
      dnaOk ? add('hoavan.1-nguon-van-hoa', 'PASS', 'Hoa văn chữ ký có ghi nguồn URL trong DESIGN-DNA.md')
        : add('hoavan.1-nguon-van-hoa', 'FAIL', 'globals.css dùng .hoa-van-divider nhưng DESIGN-DNA.md thiếu dòng "Hoa văn chữ ký: ... nguồn: <URL>" — chạy scripts/gen-hoa-van.mjs (tự ghi) hoặc bổ sung tay'); } }
}

// ═══ BỘ ĐỌC FAQ DÙNG CHUNG cho aeo.11 + aeo.12 (vá LỖ GIÁM SÁT 20260728) ═══
// BỆNH ĐÃ VÁ: cả 2 cổng chỉ biết tìm ĐÚNG MỘT tên file `qa-data.ts` của 05-TEMPLATE-CHUAN. Web nào
// dùng cấu trúc FAQ riêng thì cả 2 trả WARN "Không tìm thấy qa-data.ts" rồi IM LẶNG BỎ QUA — đọc
// nhầm thành "web sạch", trong khi sự thật là KHÔNG CỔNG NÀO CHẠY. Bằng chứng thật (đo 28/07/2026):
// nhahoachdinh-vn-live có 15 khối FAQPage / 69 cặp Question-Answer render THẬT trong HTML build
// (dùng src/lib/article-faq.ts + src/lib/faq.ts) — 69 câu đó chưa từng được máy soi lần nào.
// CÁCH VÁ: đo cái web THẬT SỰ PHÁT RA (khối JSON-LD FAQPage trong HTML build), không đo cái mã
// trông giống tên gì. `qa-data.ts` tụt xuống làm nguồn DỰ PHÒNG (cho --source-only, chưa build).
// ⚠️ Vì cổng nay đụng `htmls`, `aeo.12-qa-40-60tu` ĐÃ ĐƯỢC RÚT khỏi NGUON_THUAN_IDS — chạy
// --source-only nó không còn cho kết quả trùng bản full, giữ trong danh sách đó là khai man.

/** Duyệt mọi nút của một cây JSON-LD (mảng, @graph lồng nhau) — trả về danh sách nút phẳng. */
function __duyetJsonLd(j, ra = []) {
  if (!j || typeof j !== 'object') return ra;
  if (Array.isArray(j)) { for (const x of j) __duyetJsonLd(x, ra); return ra; }
  ra.push(j);
  if (Array.isArray(j['@graph'])) __duyetJsonLd(j['@graph'], ra);
  return ra;
}
const __boTheHtml = (s) => String(s).replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

/**
 * Trả về mọi cặp Hỏi–Đáp của web + TRẠNG THÁI ĐỌC ĐƯỢC HAY KHÔNG.
 * `cap` cặp Q&A · `nguon` đọc từ đâu · `coDauHieuFAQ` web có khai FAQ ở đâu đó không ·
 * `mayKhongDocNoi` = CÓ dấu hiệu FAQ nhưng máy rút được 0 cặp → TUYỆT ĐỐI không được im lặng.
 */
function __docFAQ() {
  const cap = [];
  const lyDo = [];
  let coDauHieuFAQ = false, jsonHong = 0;

  // (1) NGUỒN SỰ THẬT — HTML đã build: đúng thứ web phát ra cho Google/AI đọc.
  for (const h of htmls) {
    if (/FAQPage/.test(h.src)) coDauHieuFAQ = true;
    for (const m of h.src.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
      let j; try { j = JSON.parse(m[1]); } catch { if (/FAQPage/.test(m[1])) jsonHong++; continue; }
      for (const nut of __duyetJsonLd(j)) {
        const loai = Array.isArray(nut['@type']) ? nut['@type'] : [nut['@type']];
        if (!loai.includes('FAQPage') || !Array.isArray(nut.mainEntity)) continue;
        coDauHieuFAQ = true;
        for (const q of nut.mainEntity) {
          const traLoi = q && q.acceptedAnswer && typeof q.acceptedAnswer.text === 'string' ? q.acceptedAnswer.text : '';
          if (traLoi) cap.push({ q: typeof q.name === 'string' ? q.name : '', a: __boTheHtml(traLoi) });
        }
      }
    }
  }
  // Cùng 1 FAQ lặp trên nhiều trang → gộp, để không đếm 1 câu sai thành N câu sai.
  const thay = new Set(), gop = [];
  for (const c of cap) { const k = c.q + ' ' + c.a; if (!thay.has(k)) { thay.add(k); gop.push(c) } }
  if (gop.length) return { cap: gop, nguon: `HTML build (${gop.length} cặp Q&A từ khối FAQPage)`, coDauHieuFAQ: true, mayKhongDocNoi: false, lyDo };

  // (2) DỰ PHÒNG — nguồn `qa-data.ts` của template (đường cũ, giữ nguyên cho --source-only/chưa build).
  // 20260721: dò CẢ src/lib/ LẪN src/data/ — scaffold đời cũ sinh vào src/data/.
  const qaPath = (() => { let d = DIR; for (let i = 0; i < 4; i++) {
    for (const p of ['src/lib/qa-data.ts', 'src/data/qa-data.ts']) { const fp = join(d, p); if (existsSync(fp)) return fp; }
    d = join(d, '..'); } return null; })();
  if (qaPath) {
    coDauHieuFAQ = true;
    const src = readFileSync(qaPath, 'utf8');
    // F14 + vá ReDoS 20260720 — xem chú thích lịch sử ở cuối khối aeo.12 bên dưới.
    for (const m of src.matchAll(/answer\s*:\s*(["'`])((?:\\[\s\S]|(?!\1)[^\\])*)\1/g)) cap.push({ q: '', a: m[2] });
    if (cap.length) return { cap, nguon: `${qaPath.replace(/.*\/src\//, 'src/')} (${cap.length} answer)`, coDauHieuFAQ: true, mayKhongDocNoi: false, lyDo };
    lyDo.push('tìm thấy qa-data.ts nhưng rút được 0 answer');
  }

  // (3) DẤU HIỆU KHÁC — web có tệp nguồn FAQ mang tên riêng (article-faq.ts, faq.ts…). Có tệp mà
  // không rút được cặp nào ⇒ MÁY KHÔNG ĐỌC NỔI, KHÔNG phải "web không có FAQ".
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src'))) return d; d = join(d, '..'); } return null; })();
  if (root) {
    try {
      const tep = readdirSync(join(root, 'src'), { recursive: true })
        .filter(f => typeof f === 'string' && /(^|\/)([\w-]*faq[\w-]*|qa-data)\.(ts|tsx)$/i.test(f));
      if (tep.length) { coDauHieuFAQ = true; lyDo.push(`có tệp nguồn FAQ: ${tep.slice(0, 3).join(', ')}`); }
    } catch { /* không đọc được src/ — không phải dấu hiệu FAQ */ }
  }
  if (jsonHong) lyDo.push(`${jsonHong} khối JSON-LD chứa chữ FAQPage nhưng JSON hỏng, không phân tích được`);

  return { cap: [], nguon: null, coDauHieuFAQ, mayKhongDocNoi: coDauHieuFAQ, lyDo };
}

// aeo.12-qa-40-60tu — C7: answer phải 40-60 từ (quy tắc viết đã ghi trong file, chưa
// có cổng máy kiểm) + cấm mở đầu "Để trả lời" (aeo.1 CORE-BRIEF-MAU.md).
{ const faq = __docFAQ();
  if (!faq.cap.length) {
    faq.mayKhongDocNoi
      ? add('aeo.12-qa-40-60tu', 'WARN', `MÁY KHÔNG ĐỌC NỔI FAQ của web này — web CÓ khai FAQ (${faq.lyDo.join(' · ')}) nhưng rút được 0 cặp Q&A ⇒ cổng CHƯA soi câu nào, đừng đọc thành "web sạch". Kiểm: FAQPage đã render vào HTML build chưa (chạy snapshot-routes.mjs), hoặc cấu trúc FAQ lạ cần dạy máy.`)
      : add('aeo.12-qa-40-60tu', 'PASS', 'N/A — web KHÔNG khai FAQ ở đâu cả (đã soi: khối FAQPage trong HTML build · qa-data.ts · tệp nguồn tên *faq*)');
  }
  else { const src = null; void src;
    // F14 (audit 12/07 đợt 2): bắt chuỗi theo ĐÚNG loại nháy mở (nhóm 1) + cho phép nháy khác loại bên
    // trong — regex cũ dùng [^"'`]+ nên answer chứa dấu ' bên trong bị cắt cụt → đếm từ sai (WARN oan).
    // Vá 20260720 (Ông báo máy kiểm treo CPU 100%/RAM ~2GB >6ph): (?:\\.|(?!\1)[\s\S])* có 2 nhánh
    // CHỒNG LẤN — nhánh phải vẫn khớp được ký tự "\" (chỉ loại trừ \1, không loại trừ "\\") nên 1
    // chuỗi \ liên tiếp không đóng ngoặc kép có thể chia N cách giữa 2 nhánh → nổ cấp số nhân
    // (test tái hiện: 20 dấu \ chưa đóng ngoặc đã treo >3s, xem 01-LUAT/_NHAT-KY/redos-test-20260720.mjs).
    // Fix: loại "\\" khỏi nhánh phải ([^\\] thay vì [\s\S]) — 2 nhánh hết chồng lấn, về tuyến tính.
    // Verify: 50.000 dấu \ chạy tức thì (0ms) + 5 ca input hợp lệ (chuỗi thường/escape "/'/đường dẫn
    // Windows) ra kết quả giống hệt bản cũ — không đổi hành vi trên input thật, chỉ hết đường nổ.
    const answers = faq.cap.map(c => c.a);
    const ngoaiKhoang = [], deTraLoi = [];
    for (const a of answers) { const soTu = a.trim().split(/\s+/).filter(Boolean).length;
      if (soTu < 40 || soTu > 60) ngoaiKhoang.push(soTu);
      if (/^Để trả lời/i.test(a.trim())) deTraLoi.push(a.slice(0, 30)); }
    const bad = [];
    if (ngoaiKhoang.length) bad.push(`${ngoaiKhoang.length}/${answers.length} answer ngoài khoảng 40-60 từ (${ngoaiKhoang.slice(0, 12).join(', ')}${ngoaiKhoang.length > 12 ? '…' : ''} từ) — nguồn: ${faq.nguon}`);
    if (deTraLoi.length) bad.push(`${deTraLoi.length} answer mở đầu cấm "Để trả lời...": ${deTraLoi.join(' | ')}`);
    bad.length ? add('aeo.12-qa-40-60tu', 'WARN', bad.join('; '))
      : add('aeo.12-qa-40-60tu', 'PASS', `${answers.length} answer đều 40-60 từ, không mở đầu cấm — nguồn: ${faq.nguon}`); }
}

// (cũ: exp.30-mauneo-giay, đổi tên 20260714 theo F01b — mượn nhầm số trụ khác, exp chỉ có 18 mục)
// exp.19-mauneo-giay — C1: DESIGN-DNA.md ghi "Mẫu neo: <n>" nhưng tên KHÔNG khớp record nào
// trong CATALOGUE-164.html — "mẫu chỉ nằm trên giấy" (chọn bằng mắt nhưng không ghi field thật vào code).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'DESIGN-DNA.md'))) return d; d = join(d, '..'); } return null; })();
  const dnaPath = root ? join(root, 'DESIGN-DNA.md') : null;
  // Vá F09 (audit độc lập 23/07/2026): root = thư mục web (vd Web/<domain>/), luôn nằm NGAY DƯỚI
  // Web/ trong monorepo — giống cách exp.20/exp.31 định vị CODEWEB qua join(root,'..','CODEWEB',...).
  // Dò cứng [4,5,6] cấp '..' trước đây KHÔNG BAO GIỜ trỏ đúng kho thật (đã verify: WARN trên mọi web
  // build thật) — chỉ tình cờ PASS trên fixture vì fixture tự tạo thư mục giả đúng độ sâu đoán bừa.
  const cataloguePath = root ? join(root, '..', 'CODEWEB', '02-KHO-CHAT-LIEU', 'CATALOGUE-164.html') : null;
  if (!dnaPath || !existsSync(dnaPath)) add('exp.19-mauneo-giay', 'PASS', 'Không có DESIGN-DNA.md — N/A');
  else { const dna = readFileSync(dnaPath, 'utf8');
    const m = dna.match(/Mẫu neo:\s*([^(\n]+)/);
    if (!m) add('exp.19-mauneo-giay', 'PASS', 'DESIGN-DNA.md chưa ghi Mẫu neo — N/A');
    else if (!cataloguePath || !existsSync(cataloguePath)) add('exp.19-mauneo-giay', 'WARN', 'Không tìm thấy CATALOGUE-164.html để đối chiếu — kiểm tay');
    else { const ten = m[1].trim();
      const catalogue = readFileSync(cataloguePath, 'utf8');
      const known = [...catalogue.matchAll(/n:'([^']+)'/g)].map(x => x[1]);
      known.includes(ten) ? add('exp.19-mauneo-giay', 'PASS', `Mẫu neo "${ten}" khớp record thật trong CATALOGUE-164`)
        : add('exp.19-mauneo-giay', 'WARN', `Mẫu neo "${ten}" KHÔNG khớp record nào trong CATALOGUE-164.html — mẫu chỉ nằm trên giấy`); } }
}

// layout.20-measure-percent — C3b (1/5 lỗi layout cũ): measure dùng max-width:% thay vì đơn vị
// `ch` co giãn theo cỡ chữ — vỡ trên màn hình rất rộng/hẹp. WARN, không FAIL (có ca hợp lệ: %100 grid).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/globals.css'))) return d; d = join(d, '..'); } return null; })();
  const cssPath = root ? join(root, 'src/app/globals.css') : null;
  if (!cssPath || !existsSync(cssPath)) add('layout.20-measure-percent', 'PASS', 'Không có globals.css — N/A');
  else { const css = readFileSync(cssPath, 'utf8');
    const hits = [...css.matchAll(/max-width:\s*([5-9]\d|100)%/g)];
    hits.length ? add('layout.20-measure-percent', 'WARN', `${hits.length} rule max-width:%≥50 — cân nhắc đổi sang đơn vị 'ch' cho measure văn bản (vỡ ở màn rất rộng/hẹp)`)
      : add('layout.20-measure-percent', 'PASS', 'Không thấy max-width:% lớn nghi ngờ'); }
}

// (cũ: layout.21-spacing-boi8, đổi tên 20260714 theo F01b — mượn nhầm số trụ khác, layout chỉ có 22 mục)
// layout.24-spacing-boi8 — C3b (2/5): spacing px lẻ không phải bội số 8 trong globals.css
// (vi phạm ngầm layout.19 — thang khoảng cách 8pt).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/globals.css'))) return d; d = join(d, '..'); } return null; })();
  const cssPath = root ? join(root, 'src/app/globals.css') : null;
  if (!cssPath || !existsSync(cssPath)) add('layout.24-spacing-boi8', 'PASS', 'Không có globals.css — N/A');
  else { let css = readFileSync(cssPath, 'utf8');
    // F-layout21 (20260713): bỏ khối TOUCH-TARGET (WCAG 2.5.8 44px, padding+negative-margin
    // tính tay theo đo e2e thật) — đây là spacing có chủ đích, không phải lệch thang 8pt.
    css = css.replace(/\/\*\s*TOUCH-TARGET:START[\s\S]*?TOUCH-TARGET:END\s*\*\//g, '');
    const props = [...css.matchAll(/(?:margin|padding|gap)(?:-\w+)?:\s*(\d+)px/g)].map(m => Number(m[1]));
    const bad = props.filter(n => n > 0 && n % 8 !== 0 && n % 4 !== 0);
    bad.length ? add('layout.24-spacing-boi8', 'WARN', `${bad.length} giá trị spacing px KHÔNG bội số 4/8 (${[...new Set(bad)].slice(0, 5).join(', ')}px) — cân nhắc dùng token --space-*`)
      : add('layout.24-spacing-boi8', 'PASS', 'Spacing px đều bội số 4/8'); }
}

// layout.41-lh-headline-vn — F20 (LÔ 9, GĐ-III hợp lưu bố cục chữ, 20260714): S-2 sống sót GĐ5 —
// headline ≥36px: line-height sàn tiếng Việt ≥1.1 (FAIL nếu vi phạm); nếu dòng mở đầu chữ HOA có
// dấu → cần ≥1.2 nhưng chữ headline thường đến từ nội dung động (content.*.ts) nên KHÔNG xác định
// được tĩnh — vùng 1.1–1.2 hạ thành WARN, chờ mắt người/RENDER (e2e) xác nhận trước khi chốt FAIL.
// đo lý tưởng cần Playwright/getComputedStyle (RENDER); bản này là XẤP XỈ TĨNH đọc source (chỉ
// bắt được style={{ }} inline trên <h1>, KHÔNG bắt được class Tailwind leading-*/text-*)
// [RENDER] (xấp xỉ TĨNH — xem F24 bảng phân loại cuối GD2-LUAT-UNG-VIEN.md)
{ const root = (() => { let d = DIR; for (let i = 0; i < 6; i++) { if (existsSync(join(d, 'src/app/page.tsx'))) return d; d = join(d, '..'); } return null; })();
  const candFiles = [];
  if (root) {
    const p1 = join(root, 'src/app/page.tsx'); if (existsSync(p1)) candFiles.push(p1);
    const blocksDir = join(root, 'src/components/blocks');
    if (existsSync(blocksDir)) for (const f of readdirSync(blocksDir)) if (/hero|headline/i.test(f) && f.endsWith('.tsx')) candFiles.push(join(blocksDir, f));
  }
  const hits = [];
  for (const fp of candFiles) {
    const src = readFileSync(fp, 'utf8');
    for (const m of src.matchAll(/<h1[^>]*style=\{\{([^]*?)\}\}[^>]*>/g)) {
      const styleBlk = m[1];
      const fsM = styleBlk.match(/fontSize\s*:\s*["'`]([^"'`]+)["'`]/);
      const lhM = styleBlk.match(/lineHeight\s*:\s*([\d.]+)/);
      if (!fsM || !lhM) continue;
      const nums = [...fsM[1].matchAll(/([\d.]+)(rem|px)/g)].map(x => x[2] === 'rem' ? Number(x[1]) * 16 : Number(x[1]));
      const fsPx = nums.length ? Math.max(...nums) : 0;
      if (fsPx < 36) continue; // ngoài phạm vi S-2 (chỉ áp headline ≥36px)
      hits.push({ f: fp, fsPx, lh: Number(lhM[1]) });
    }
  }
  if (!hits.length) add('layout.41-lh-headline-vn', 'PASS', 'Không tìm thấy <h1 style={{...}}> ≥36px để kiểm tĩnh (có thể dùng class Tailwind — ngoài phạm vi xấp xỉ nguồn) — N/A, đo chắc cần RENDER');
  else { const fail = hits.filter(h => h.lh < 1.1); const warn = hits.filter(h => h.lh >= 1.1 && h.lh < 1.2);
    if (fail.length) add('layout.41-lh-headline-vn', 'FAIL', `${fail.length} headline line-height <1.1 (dưới sàn tiếng Việt S-2): ${fail.map(h => `${h.f}(lh=${h.lh})`).join(', ')}`);
    else if (warn.length) add('layout.41-lh-headline-vn', 'WARN', `${warn.length} headline line-height 1.1–1.2 — đạt sàn chung, nhưng nếu dòng mở đầu chữ HOA có dấu (S-2) cần ≥1.2 — xác nhận bằng render/mắt: ${warn.map(h => `${h.f}(lh=${h.lh})`).join(', ')}`);
    else add('layout.41-lh-headline-vn', 'PASS', `${hits.length} headline line-height ≥1.2 — đạt cả sàn chung lẫn ca chữ HOA có dấu (${hits.map(h => `${h.f}:${h.lh}`).join(', ')})`); }
}

// layout.42-font-count-vn — F21 (LÔ 9, 20260714): S-4 sống sót GĐ5 (Ông hạ FAIL→WARN để quan
// sát thêm) — ≤3 font-family THẬT/viewport. Cách đếm chốt: gộp weight cùng family (chỉ lấy tên
// family, không phân biệt weight), loại font đầu tiên mỗi khai báo (bỏ phần fallback sau dấu
// phẩy), loại từ khoá generic (sans-serif/serif/...), loại khối nghi widget bên thứ 3 (cookie/
// chat) qua selector. WARN nếu >3 (KHÔNG FAIL — mức đã chốt).
// [TĨNH] — quét thuần văn bản CSS (globals.css + @import 1 tầng đã gom sẵn ở allCss).
{ const GENERIC = /^(sans-serif|serif|monospace|system-ui|ui-sans-serif|ui-serif|ui-monospace|cursive|fantasy|inherit|unset|initial|revert)$/i;
  // 20260721 (sổ đề xuất 16/07#3): resolve chuỗi var() alias TRƯỚC khi đếm — web đời cũ khai
  // `--font-nunito: var(--font-body)` rồi dùng cả var(--font-nunito) lẫn var(--font-body) ở nhiều
  // khối → đếm 2 font oan dù chỉ 1 font thật. Gộp mọi alias trỏ cùng đích về 1 khoá.
  const varMap = {};
  for (const dm of allCss.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+)[;}]/g)) varMap[dm[1].trim()] = dm[2].trim();
  const canonFont = (raw) => {
    let v = raw.trim().replace(/^['"]|['"]$/g, ''); const seen = new Set(); let mv;
    while ((mv = v.match(/^var\(\s*(--[\w-]+)/))) {
      const name = mv[1];
      if (seen.has(name) || varMap[name] === undefined) return name; // vòng lặp/var chưa định nghĩa → dùng tên var làm khoá gộp
      seen.add(name);
      v = varMap[name].split(',')[0].trim().replace(/^['"]|['"]$/g, '');
    }
    return v;
  };
  const blocks = allCss.match(/[^{}]*\{[^{}]*\}/g) || [];
  const fams = new Set();
  for (const b of blocks) {
    const sel = b.split('{')[0];
    if (/cookie|consent|chat-widget|zalo-widget|messenger|intercom|crisp|tawk/i.test(sel)) continue;
    const m = b.match(/(?<!@)font-family\s*:\s*([^;]+);/);
    if (!m) continue;
    const first = canonFont(m[1].split(',')[0]);
    if (!first || GENERIC.test(first)) continue;
    fams.add(first);
  }
  fams.size > 3
    ? add('layout.42-font-count-vn', 'WARN', `${fams.size} font-family khai dùng (${[...fams].join(', ')}) — chuẩn S-4 ≤3/viewport (gộp weight, loại fallback+widget)`)
    : add('layout.42-font-count-vn', 'PASS', `${fams.size} font-family — trong ngưỡng ≤3 (${[...fams].join(', ') || '(system)'})`); }

// layout.43-tughep-vn — F23 (LÔ 9 đợt 2, GĐ-III hợp lưu bố cục chữ, 20260714): S-1 — CẤM cắt đôi
// từ ghép tiếng Việt khi ngắt dòng headline (GD2-LUAT-UNG-VIEN.md dòng 109-122, mức Ông duyệt:
// cổng cứng FAIL). Đây là cổng TĨNH: chỉ bắt được NGẮT DÒNG THỦ CÔNG rõ ràng bằng <br>/<br/> hoặc
// \n trong chuỗi JSX của headline — KHÔNG bắt được wrap TỰ NHIÊN theo viewport (cần cổng RENDER
// riêng ở tương lai, ngoài phạm vi F23 lần này, xem [RENDER] ở bảng phân loại cuối
// GD2-LUAT-UNG-VIEN.md). Dùng lại cách tìm candFiles của F20 (h1/hero/headline trong page.tsx +
// src/components/blocks/*hero*|*headline*.tsx).
// [TĨNH — giới hạn: chỉ bắt <br>/\n thủ công, không đo wrap tự nhiên trình duyệt]
{ const tuGhepPath = join(HERE, 'tu-dien-tu-ghep-vn.json');
  const tuGhep = existsSync(tuGhepPath) ? JSON.parse(readFileSync(tuGhepPath, 'utf8')) : [];
  const root43 = (() => { let d = DIR; for (let i = 0; i < 6; i++) { if (existsSync(join(d, 'src/app/page.tsx'))) return d; d = join(d, '..'); } return null; })();
  const candFiles43 = [];
  if (root43) {
    const p1 = join(root43, 'src/app/page.tsx'); if (existsSync(p1)) candFiles43.push(p1);
    const blocksDir43 = join(root43, 'src/components/blocks');
    if (existsSync(blocksDir43)) for (const f of readdirSync(blocksDir43)) if (/hero|headline/i.test(f) && f.endsWith('.tsx')) candFiles43.push(join(blocksDir43, f));
  }
  if (!tuGhep.length) add('layout.43-tughep-vn', 'PASS', 'Không đọc được tu-dien-tu-ghep-vn.json — N/A');
  else { const cat = [];
    for (const fp of candFiles43) {
      const src = readFileSync(fp, 'utf8');
      // chỉ soi bên trong thẻ <h1 ...>...</h1> để tránh dương tính giả từ nội dung khác trong file
      for (const h1m of src.matchAll(/<h1[^>]*>([^]*?)<\/h1>/g)) {
        const inner = h1m[1];
        // gom text quanh mỗi điểm ngắt (<br>, <br/>, <br />, hoặc \n trong chuỗi JSX)
        for (const brM of inner.matchAll(/([^<>\n{}]{1,30})(?:<br\s*\/?>|\\n)([^<>\n{}]{1,30})/g)) {
          const before = brM[1].trim().split(/\s+/).pop() || '';
          const after = (brM[2].trim().split(/\s+/)[0] || '').replace(/[.,!?;:"'’”]+$/, '');
          if (!before || !after) continue;
          const cap = `${before} ${after}`.toLowerCase();
          if (tuGhep.some(tg => tg.toLowerCase() === cap)) cat.push({ f: fp, cap: `${before} ${after}` });
        }
      }
    }
    cat.length
      ? add('layout.43-tughep-vn', 'FAIL', `${cat.length} chỗ ngắt dòng thủ công (<br>/\\n) CẮT ĐÔI từ ghép tiếng Việt (S-1): ${cat.map(c => `${c.f}:"${c.cap}"`).join(', ')} — dời điểm ngắt sang ranh giới cụm từ khác`)
      : add('layout.43-tughep-vn', 'PASS', `Không phát hiện ngắt dòng thủ công cắt đôi từ ghép trong ${candFiles43.length} file headline soi được (${tuGhep.length} từ ghép trong từ điển)`); }
}

// layout.44-chapter-num-n4 — vá 15/07/2026 (audit mở rộng Nhịp/Hiệu ứng/Chữ): Nhịp N4 Chương Hồi
// (03-RECIPE-LAYOUT.md mục 1b) — "mỗi chương PHẢI có số thứ tự (.chapter-num)". Trước đây chỉ nằm
// trên giấy, không cổng nào chạm tới .chapter/.chapter-num. Cổng mới → WARN (chưa đủ dữ liệu thật
// để nâng FAIL, theo đúng cách M6 đã chốt cho các cổng mới khác).
// [TĨNH — giới hạn: chỉ đếm token class "chapter"/"chapter-num" literal trong className string,
// không bắt được class ghép qua clsx()/cn()/biến động]
{ const root44 = (() => { let d = DIR; for (let i = 0; i < 6; i++) { if (existsSync(join(d, 'src/app/page.tsx'))) return d; d = join(d, '..'); } return null; })();
  const candFiles44 = [];
  if (root44) {
    const p1 = join(root44, 'src/app/page.tsx'); if (existsSync(p1)) candFiles44.push(p1);
    const blocksDir44 = join(root44, 'src/components/blocks');
    if (existsSync(blocksDir44)) for (const f of readdirSync(blocksDir44)) if (f.endsWith('.tsx')) candFiles44.push(join(blocksDir44, f));
  }
  let chapterCount = 0, chapterNumCount = 0;
  for (const fp of candFiles44) {
    const src = readFileSync(fp, 'utf8');
    for (const m of src.matchAll(/className\s*=\s*["'`]([^"'`]*)["'`]/g)) {
      const classes = m[1].split(/\s+/);
      if (classes.includes('chapter')) chapterCount++;
      if (classes.includes('chapter-num')) chapterNumCount++;
    }
  }
  if (chapterCount === 0) add('layout.44-chapter-num-n4', 'PASS', 'Không dùng class .chapter — ngoài phạm vi Nhịp N4, N/A');
  else if (chapterNumCount < chapterCount) add('layout.44-chapter-num-n4', 'WARN', `${chapterCount} khối .chapter nhưng chỉ ${chapterNumCount} .chapter-num — Nhịp N4 yêu cầu MỖI chương có số thứ tự (03-RECIPE-LAYOUT.md mục 1b); có thể .chapter-num đặt qua class động (clsx/cn) ngoài tầm quét tĩnh, xác nhận lại bằng mắt`);
  else add('layout.44-chapter-num-n4', 'PASS', `${chapterCount} khối .chapter, ${chapterNumCount} .chapter-num — đủ số thứ tự mỗi chương`);
}

// layout.45-bento-uneven-n5 — vá 15/07/2026 (audit mở rộng Nhịp/Hiệu ứng/Chữ): Nhịp N5 Bento
// Thương Mại (03-RECIPE-LAYOUT.md mục 1b) — "không chia ô đều nhau (giống lỗi thường gặp của
// Bento S4)". Cổng mới → WARN.
// [TĨNH — giới hạn: chỉ đếm 3 tên cỡ ô chuẩn (hero-cell/cell-wide/cell) từ CSS recipe gốc; web
// tự đặt tên cỡ ô khác (không theo đúng 3 class này) sẽ không được nhận diện, báo WARN oan]
{ const root45 = (() => { let d = DIR; for (let i = 0; i < 6; i++) { if (existsSync(join(d, 'src/app/page.tsx'))) return d; d = join(d, '..'); } return null; })();
  const candFiles45 = [];
  if (root45) {
    const p1 = join(root45, 'src/app/page.tsx'); if (existsSync(p1)) candFiles45.push(p1);
    const blocksDir45 = join(root45, 'src/components/blocks');
    if (existsSync(blocksDir45)) for (const f of readdirSync(blocksDir45)) if (f.endsWith('.tsx')) candFiles45.push(join(blocksDir45, f));
  }
  let bentoPageCount = 0;
  const cellClassesUsed = new Set();
  for (const fp of candFiles45) {
    const src = readFileSync(fp, 'utf8');
    if (/\bbento-page\b/.test(src)) bentoPageCount++;
    for (const m of src.matchAll(/className\s*=\s*["'`]([^"'`]*)["'`]/g)) {
      const classes = m[1].split(/\s+/);
      if (classes.includes('hero-cell')) cellClassesUsed.add('hero-cell');
      if (classes.includes('cell-wide')) cellClassesUsed.add('cell-wide');
      if (classes.includes('cell')) cellClassesUsed.add('cell');
    }
  }
  if (bentoPageCount === 0) add('layout.45-bento-uneven-n5', 'PASS', 'Không dùng .bento-page — ngoài phạm vi Nhịp N5, N/A');
  else if (cellClassesUsed.size <= 1) add('layout.45-bento-uneven-n5', 'WARN', `Chỉ dùng ${cellClassesUsed.size} cỡ ô (${[...cellClassesUsed].join(', ') || 'không rõ'}) trong .bento-page — Nhịp N5 cấm chia ô đều nhau (03-RECIPE-LAYOUT.md mục 1b, kế thừa lỗi thường gặp Bento S4), cần ≥2 cỡ ô (hero-cell/cell-wide/cell)`);
  else add('layout.45-bento-uneven-n5', 'PASS', `${cellClassesUsed.size} cỡ ô khác nhau trong .bento-page (${[...cellClassesUsed].join(', ')}) — không chia đều`);
}

// layout.46-cinema-doanvan-80tu-n6 — vá 15/07/2026 (audit mở rộng Nhịp/Hiệu ứng/Chữ): Nhịp N6
// Toàn Màn Kịch Tính (03-RECIPE-LAYOUT.md mục 1b) — "CẤM đoạn văn liên tục >80 từ ở section dùng
// .hero-cinematic/.cinema-block, không phải gợi ý" (kế thừa nguyên văn luật Bộ III cấm đọc dài).
// Cổng mới → WARN.
// [TĨNH — giới hạn: chỉ kích hoạt khi phát hiện class .hero-cinematic/.cinema-block trong source;
// quét TOÀN BỘ chuỗi văn bản dài trong content.ts thay vì tách riêng field nào đổ vào đúng section
// N6 (nội dung động khó truy vết tĩnh chính xác 1-1) — có thể báo WARN oan nếu đoạn dài đó thực ra
// dùng ở section khác, xác nhận lại bằng mắt trước khi rút ngắn]
{ const root46 = (() => { let d = DIR; for (let i = 0; i < 6; i++) { if (existsSync(join(d, 'src/app/page.tsx'))) return d; d = join(d, '..'); } return null; })();
  const candFiles46 = [];
  if (root46) {
    const p1 = join(root46, 'src/app/page.tsx'); if (existsSync(p1)) candFiles46.push(p1);
    const blocksDir46 = join(root46, 'src/components/blocks');
    if (existsSync(blocksDir46)) for (const f of readdirSync(blocksDir46)) if (f.endsWith('.tsx')) candFiles46.push(join(blocksDir46, f));
  }
  const cinemaUsed = candFiles46.some(fp => /\b(hero-cinematic|cinema-block)\b/.test(readFileSync(fp, 'utf8')));
  if (!cinemaUsed) add('layout.46-cinema-doanvan-80tu-n6', 'PASS', 'Không dùng .hero-cinematic/.cinema-block — ngoài phạm vi Nhịp N6, N/A');
  else {
    const contentPath46 = root46 ? join(root46, 'src/lib/content.ts') : null;
    if (!contentPath46 || !existsSync(contentPath46)) add('layout.46-cinema-doanvan-80tu-n6', 'WARN', 'Dùng Nhịp N6 nhưng không tìm thấy src/lib/content.ts để đếm từ đoạn văn — kiểm tay');
    else { const src = readFileSync(contentPath46, 'utf8');
      // Vá 20260720 — cùng lỗi ReDoS đã vá ở aeo.11/aeo.12 (2 nhánh (?:\\.|(?!\1)[\s\S]) chồng lấn
      // trên ký tự "\", chuỗi \ liên tiếp không đóng ngoặc nổ cấp số nhân). Fix giống hệt: [^\\]
      // thay [\s\S] ở nhánh phải để 2 nhánh hết chồng lấn.
      const strs = [...src.matchAll(/:\s*(["'`])((?:\\[\s\S]|(?!\1)[^\\])*?)\1/g)].map(m => m[2]);
      const qua80 = strs.map(s => s.trim().split(/\s+/).filter(Boolean).length).filter(n => n > 80);
      qua80.length
        ? add('layout.46-cinema-doanvan-80tu-n6', 'WARN', `Dùng Nhịp N6 (.hero-cinematic/.cinema-block) + ${qua80.length} chuỗi trong content.ts dài >80 từ (${qua80.join(', ')} từ) — N6 cấm đoạn văn liên tục >80 từ, xác nhận đoạn nào rơi vào section N6 rồi rút gọn`)
        : add('layout.46-cinema-doanvan-80tu-n6', 'PASS', 'Dùng Nhịp N6, không có chuỗi content.ts nào >80 từ'); }
  }
}

// 21. logo.1-farmstay-default — logo FARMSTAY của template lọt nguyên vẹn ra web mới (audit
//     gomnhalua #12). So md5 public/logo*.png với md5 gốc template — trùng = chưa gọi gen-media --font.
//     Bỏ qua khi đang chạy trên chính bản gốc template (domain còn placeholder).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const cfgPath = root ? join(root, 'src/lib/site-config.ts') : null;
  const isRawTemplate = cfgPath && existsSync(cfgPath) && /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(readFileSync(cfgPath, 'utf8'));
  const TEMPLATE_LOGO_MD5 = { 'logo.png': '6e279c3b853072e90fe2d50d4017ca18', 'logo-icon.png': '4bc07e92498b69af20d60a9d0df6c29f', 'logo-horizontal.png': 'e2de42cc4f2929dd5caf2b1b179ed4fe' };
  if (!root || isRawTemplate) add('logo.1-farmstay-default', 'PASS', 'Bản gốc template — N/A');
  else { const pub = join(root, 'public');
    const bad = [];
    for (const [f, hash] of Object.entries(TEMPLATE_LOGO_MD5)) {
      const p = join(pub, f);
      if (existsSync(p) && createHash('md5').update(readFileSync(p)).digest('hex') === hash) bad.push(f);
    }
    bad.length ? add('logo.1-farmstay-default', 'FAIL', `Logo CHƯA thay khỏi mặc định template: ${bad.join(', ')} — chạy new-web.sh media (gen-media --font)`)
      : add('logo.1-farmstay-default', 'PASS', 'Logo đã thay khỏi mặc định template'); }
}

// (cũ: aes.30-botokensync, đổi tên 20260714 theo F01b — mượn nhầm số trụ khác, aes có 39 mục)
// 22. aes.40-botokensync — --dur-fast trong globals.css phải khớp Bộ đã chọn (toHop.bo) — B3,
//     trước bản này mọi web build ra đều mang số Bộ I dù chọn Bộ II/III (04-BANG-CHUYEN-DONG.md mục 5).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const cfgPath = root ? join(root, 'src/lib/site-config.ts') : null;
  const cssPath = root ? join(root, 'src/app/globals.css') : null;
  const DUR_FAST_BY_BO = { I: '200ms', II: '120ms', III: '160ms', IV: '250ms', V: '80ms', VI: '230ms' };
  if (!root || !existsSync(cfgPath) || !existsSync(cssPath)) add('aes.40-botokensync', 'PASS', 'Không có site-config.ts/globals.css nguồn — N/A');
  else { const cfg = readFileSync(cfgPath, 'utf8'), css = readFileSync(cssPath, 'utf8');
    const isRawTemplate = /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(cfg);
    const bo = cfg.match(/toHop:\s*{\s*bo:\s*"(I|II|III|IV|V|VI)"/s)?.[1];
    const cssDurFast = css.match(/--dur-fast:\s*([\d.]+ms)/)?.[1];
    if (isRawTemplate || !bo || !cssDurFast) add('aes.40-botokensync', 'PASS', 'Bản gốc template hoặc thiếu dữ kiện — N/A');
    else if (cssDurFast !== DUR_FAST_BY_BO[bo]) add('aes.40-botokensync', 'FAIL', `toHop.bo="${bo}" nhưng globals.css --dur-fast=${cssDurFast} (đúng phải ${DUR_FAST_BY_BO[bo]}) — chạy scripts/gen-tokens.mjs --site .`);
    else add('aes.40-botokensync', 'PASS', `Token động khớp Bộ ${bo} (--dur-fast=${cssDurFast})`); }
}

// (cũ: aes.31-kicker-mono, đổi tên 20260714 theo F01b)
// 23. aes.41-kicker-mono — .kicker (B4: --font-mono JetBrains) không được chứa câu tiếng Việt dài
//     (subset vietnamese JetBrains Mono thiếu vài tổ hợp dấu phức ở ký tự hiếm — kiểm độ dài thay).
{ const bad = [];
  htmls.forEach(h => { for (const m of h.src.matchAll(/class="[^"]*\bkicker\b[^"]*"[^>]*>([^<]{41,})</g)) bad.push({ f: h.f, text: m[1].trim().slice(0, 50) }); });
  bad.length ? add('aes.41-kicker-mono', 'WARN', `${bad.length} .kicker dài >40 ký tự (nên rút ngắn — font-mono không hợp câu dài): ${bad.slice(0, 3).map(b => `${b.f}:"${b.text}…"`).join('; ')}`)
    : add('aes.41-kicker-mono', 'PASS', 'Mọi .kicker đủ ngắn cho font-mono'); }

// 24. aes.32-cliche — C-clichê: 5 hex màu "AI slop" (02-KHO-CHAT-LIEU/01-BANG-MAU.md mục 3)
//     KHÔNG được dùng làm --bg/--accent trong globals.css/site-config.ts của web đã bàn giao.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const CLICHE = ['#F4F1EA', '#FAF3E0', '#FBF8F2', '#A0522D', '#7C9070'];
  if (!root) add('aes.32-cliche', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const cssPath = join(root, 'src/app/globals.css'), cfgPath = join(root, 'src/lib/site-config.ts');
    const files = [cssPath, cfgPath].filter(existsSync);
    const hits = [];
    for (const f of files) { const s = readFileSync(f, 'utf8').toUpperCase();
      for (const hex of CLICHE) if (s.includes(hex)) hits.push(`${f.split('/').pop()}:${hex}`); }
    hits.length ? add('aes.32-cliche', 'WARN', `Màu cliché "AI slop" phát hiện: ${hits.join(', ')} — dịch hue +16-19° hoặc hạ bão hoà <15% (01-BANG-MAU.md mục 3)`)
      : add('aes.32-cliche', 'PASS', 'Không dùng màu cliché AI đã biết'); }
}

// ── Tầng SEO / AEO / GEO (cổng 20–24) ──────────────────────────────────────

// 20. seo.org-schema — JSON-LD Organization/WebSite phải có trong HTML
// (từ khi CSP dùng nonce, layout.tsx buộc dynamic rendering → .next không còn HTML tĩnh
//  của trang thật để quét, chỉ còn _global-error.html/500.html. Fallback: soi source layout.tsx.)
{ const types = ['Organization','Person','LocalBusiness','WebSite'];
  const foundInHtml = htmls.some(h => types.some(t => h.src.includes(`"@type":"${t}"`) || h.src.includes(`"@type": "${t}"`)));
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const layoutPath = root ? join(root, 'src/app/layout.tsx') : null;
  // V6b (11/07/2026): fallback regex trên source chỉ tin cậy KHI KHÔNG có HTML thật đã build. Nếu
  // đang quét .kiem-snapshot (HTML render thật) mà @type vắng mặt thì đó là bằng chứng cứng — biến
  // entitySchema có thể đang bị comment/không render → FAIL, KHÔNG được để regex source cứu PASS giả.
  const hasSnapshot = /\.kiem-snapshot/.test(DIR) || htmls.some(h => /\.kiem-snapshot/.test(h.f));
  const foundInSource = layoutPath && existsSync(layoutPath)
    ? /entitySchema|organizationSchema|websiteSchema/.test(readFileSync(layoutPath, 'utf8'))
    : false;
  foundInHtml
    ? add('seo.20-org-schema', 'PASS', 'JSON-LD Organization/WebSite có trong HTML')
    : hasSnapshot
      ? add('seo.20-org-schema', 'FAIL', 'Quét .kiem-snapshot (HTML render thật) nhưng KHÔNG thấy @type Organization/WebSite — nghi entitySchema bị comment/không render, fallback source không được cứu PASS giả (Tầng A)')
      : foundInSource
        ? add('seo.20-org-schema', 'PASS', 'layout.tsx có wiring entitySchema/websiteSchema (không có .kiem-snapshot để đối chiếu — đã kiểm qua source)')
        : add('seo.20-org-schema', 'FAIL', 'Thiếu JSON-LD schema — layout.tsx phải inject entitySchema + siteSchema (Tầng A)'); }

// 21. geo.llms-txt — /llms.txt phải có nguồn phát ra nội dung: route ĐỘNG (src/app/llms.txt/route.ts,
// chuẩn hiện hành từ 22/07 — sinh từ siteConfig+sitemap-routes.generated.json+Sanity, không cần đối chứng
// link tĩnh vì luôn khớp route thật) hoặc file TĨNH public/llms.txt (web cũ chưa migrate, > 50 ký tự).
// Dò root bằng next.config.ts, KHÔNG dùng package.json — .next/package.json là stub Next.js tự sinh ({"type":"commonjs"}) sẽ đánh lừa nhận .next/ làm root. Fix từ nhahoachdinh 08/07/2026.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts')) || existsSync(join(d, 'next.config.ts'))) return d; d = join(d, '..'); } return null; })();
  const routeTs = root ? join(root, 'src/app/llms.txt/route.ts') : null;
  const llmsPath = root ? join(root, 'public', 'llms.txt') : null;
  if (!root) add('geo.21-llms-txt', 'WARN', 'Không tìm được thư mục gốc — kiểm thủ công');
  else if (routeTs && existsSync(routeTs)) add('geo.21-llms-txt', 'PASS', 'src/app/llms.txt/route.ts sinh động (chuẩn hiện hành)');
  else if (!llmsPath || !existsSync(llmsPath)) add('geo.21-llms-txt', 'WARN', 'Chưa có src/app/llms.txt/route.ts lẫn public/llms.txt — web cũ, cần migrate sang route động');
  else { const len = readFileSync(llmsPath, 'utf8').trim().length;
    len > 50
      ? add('geo.21-llms-txt', 'PASS', `public/llms.txt tĩnh tồn tại (${len} ký tự) — web cũ, nên migrate sang route động`)
      : add('geo.21-llms-txt', 'WARN', `public/llms.txt quá ngắn (${len} ký tự)`); } }

// 22. geo.ai-bots — robots.txt cho phép GPTBot + ClaudeBot + PerplexityBot
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/robots.ts')) || existsSync(join(d, 'public/robots.txt'))) return d; d = join(d, '..'); } return null; })();
  const robotsTs = root ? join(root, 'src/app/robots.ts') : null;
  const robotsTxt = root ? join(root, 'public/robots.txt') : null;
  // ---- Vá 19/08/2026 — ĐỌC CẢ BẢN WEB THẬT PHÁT RA, không chỉ đoán qua mã nguồn.
  // Điểm mù đã trả giá: web khai bot qua HÀM TRỢ GIÚP thì tên bot không bao giờ đứng cạnh chữ
  // `userAgent:`, nên phép dò tĩnh không thấy con nào — cổng FAIL oan một web khai đủ 11 nhóm
  // (đo trên robots.txt thật: 11 dòng User-Agent, có GPTBot/ClaudeBot/Google-Extended…).
  //   const luat = (userAgent) => ({ userAgent, allow: CHO, disallow: CAM });
  //   luat("GPTBot"), luat("ClaudeBot"), ...
  // Trớ trêu: chính cách viết ấy mới đúng, vì nó bảo đảm MỌI nhóm đều lặp phần cấm — nhóm chỉ khai
  // `allow` là nhóm mất sạch phần cấm (lỗi thật web đó đã vá). Cổng phạt đúng cách viết tốt hơn.
  // Bản dựng Next.js đặt robots đã render ở <DIR>/robots.txt.body (App Router) hoặc robots.txt.
  // Đọc thêm nó thì mọi cách viết đều đo được, và `chanGoc` cũng soi được nhóm thật thay vì cú pháp.
  // ⚠️ PHẢI lọc "là TỆP": trong bản dựng Next, `robots.txt` là THƯ MỤC route (mã xử lý), chỉ
  // `robots.txt.body` mới là nội dung thật. Chỉ dùng existsSync là đọc trúng thư mục → EISDIR,
  // gãy cả máy kiểm (đã vấp đúng lỗi này 19/08/2026).
  const laTep = (p) => { try { return statSync(p).isFile(); } catch { return false; } };
  const robotsDung = ['robots.txt.body', 'robots.txt'].map((f) => join(DIR, f)).filter(laTep);
  const src = (robotsTs && existsSync(robotsTs) ? readFileSync(robotsTs, 'utf8') : '') +
              (robotsTxt && existsSync(robotsTxt) ? readFileSync(robotsTxt, 'utf8') : '') +
              robotsDung.map((f) => '\n' + readFileSync(f, 'utf8')).join('');
  // ---- LÔ 4 (09/08/2026): nâng cho phủ TRỌN nghĩa tiêu chí ai#15 "Robots.txt khai báo rõ AI bot —
  // TÁCH bot tìm kiếm vs bot huấn luyện" (nhãn AUTO, must=true). Cổng cũ chỉ đếm 3 cái tên và chỉ
  // WARN: vừa hụt vế "tách nhóm" — vế chính của lời luật — vừa không đủ tư cách khai `du` vì không
  // có nhánh FAIL nào (hàng rào cấu trúc trong kiem-nha-may.mjs bác thẳng cổng không chặn nổi gì).
  // Vì sao "tách" mới là cái quan trọng: hai nhóm phục vụ hai mục đích trái nhau — bot TÌM KIẾM
  // mang người đọc tới (chặn là tự sát), bot HUẤN LUYỆN lấy nội dung nuôi mô hình (cho hay không là
  // QUYẾT ĐỊNH của chủ web). Gộp chung một nhóm `*` thì chủ web chưa hề ra quyết định nào cả.
  // Bỏ chú thích TRƯỚC khi dò tên bot: nhóm lỗi "PASS giả qua comment" đã bắt được ở 8 cổng khác —
  // tên bot nằm trong dòng chú thích không phải là khai báo thật.
  const sach = boChuThichChung(src, 'js').replace(/^\s*#.*$/gm, '');
  const TIM_KIEM = ['Googlebot', 'Bingbot', 'coccocbot', 'OAI-SearchBot', 'PerplexityBot', 'Claude-SearchBot'];
  const HUAN_LUYEN = ['GPTBot', 'Google-Extended', 'ClaudeBot', 'anthropic-ai', 'CCBot', 'Applebot-Extended', 'meta-externalagent'];
  const reKhai = (ten) => new RegExp(`user-?agent"?\\s*:\\s*\\[?\\s*"?${ten}\\b`, 'i');
  // Vá 19/08/2026 — nhận CẢ kiểu khai qua HÀM TRỢ GIÚP. Điều kiện mở đường phụ phải CHẶT, không
  // được nới thành "thấy tên bot ở đâu cũng tính": chỉ mở khi tệp thật sự dựng luật bằng hàm, tức
  // `userAgent` xuất hiện dạng THAM SỐ (`userAgent: string`) hoặc THUỘC TÍNH RÚT GỌN (`userAgent,`
  // / `userAgent}`). Kiểu viết tay `userAgent: "GPTBot"` KHÔNG khớp điều kiện này nên đường phụ
  // vẫn đóng — nhờ vậy mẫu `fail-gop-chung-mot-nhom` (chỉ khai "*") vẫn FAIL đúng.
  const dungHamTroGiup = /\buserAgent\b\s*(?::\s*string|[,}])/.test(sach);
  const khai = (ten) => reKhai(ten).test(sach) ||
    (dungHamTroGiup && new RegExp(`["']${ten}["']`).test(sach));
  // Cửa sổ = từ SAU tên bot tới ranh giới nhóm kế tiếp. KHÔNG dùng độ dài cứng: cửa sổ cứng tràn
  // sang nhóm sau rồi bắt nhầm allow:"/" của nó ⇒ PASS oan (lỗi đã vá một lần ở nhánh cũ).
  const cuaSo = (ten) => { const i = sach.search(reKhai(ten)); if (i < 0) return '';
    const con = sach.slice(i + ten.length); const kt = con.search(/user-?agent/i);
    return kt >= 0 ? con.slice(0, kt) : con.slice(0, 200); };
  const chanGoc = (ten) => { const w = cuaSo(ten);
    // F13: bắt CẢ dạng mảng `disallow: ["/"]` của robots.ts lẫn dạng chuỗi của robots.txt.
    const cam = /disallow"?\s*:\s*\[?\s*"?\/"?[\s,}\]]/i.test(w) || /Disallow:\s*\/\s*(\r?\n|$)/i.test(w);
    const cho = /\ballow"?\s*:\s*\[?\s*"?\/"?[\s,}\]]/i.test(w) || /\bAllow:\s*\/\s*(\r?\n|$)/i.test(w);
    return cam && !cho; };
  const tkKhai = TIM_KIEM.filter(khai), hlKhai = HUAN_LUYEN.filter(khai);
  const loiTach = [];
  if (!tkKhai.length) loiTach.push(`robots KHÔNG khai đích danh bot tìm kiếm nào (${TIM_KIEM.slice(0, 3).join(' · ')}…) — mọi bot dùng chung nhóm "*", không tách được nhóm nào`);
  if (!hlKhai.length) loiTach.push(`robots KHÔNG khai đích danh bot huấn luyện nào (${HUAN_LUYEN.slice(0, 4).join(' · ')}…) — chủ web chưa hề ra quyết định cho phép hay từ chối cho huấn luyện`);
  const tkBiChan = tkKhai.filter(chanGoc);
  if (tkBiChan.length) loiTach.push(`CHẶN bot TÌM KIẾM ở gốc: ${tkBiChan.join(', ')} — tự cắt đường vào của cả tìm kiếm lẫn câu trả lời AI`);
  const bots = ['GPTBot','ClaudeBot','PerplexityBot'];
  const missing = bots.filter(b => !khai(b));
  if (loiTach.length) { add('geo.22-ai-bots', 'FAIL', loiTach.join(' · ')); }
  else if (missing.length) { add('geo.22-ai-bots', 'WARN', `robots thiếu AI bots: ${missing.join(', ')}`); }
  else {
    // Có TÊN bot chưa đủ — còn phải xem bot được mở hay bị chặn ở gốc. Dùng chung phép `chanGoc`
    // ở trên: nó cắt cửa sổ theo ranh giới nhóm (không phải độ dài cứng) và đọc bản ĐÃ BỎ chú thích.
    // Bot HUẤN LUYỆN bị chặn chỉ là WARN chứ không FAIL: từ chối cho huấn luyện là QUYỀN của chủ
    // web, cổng chỉ nhắc cái giá phải trả (mất suất được trích dẫn trong câu trả lời AI).
    const blocked = bots.filter(chanGoc);
    blocked.length
      ? add('geo.22-ai-bots', 'WARN', `web CHẶN AI bot ở gốc (Disallow /): ${blocked.join(', ')} — ngược GEO/AEO`)
      : add('geo.22-ai-bots', 'PASS', `Tách bạch 2 nhóm trong robots: ${tkKhai.length} bot tìm kiếm (${tkKhai.join(', ')}) đều mở · ${hlKhai.length} bot huấn luyện (${hlKhai.join(', ')}) đã có quyết định tường minh`);
  } }

// geo.23-llms-link-song (20260721, đề xuất vai 7 /nang-cap-web nhahoachdinh) — llms.txt là VĂN BẢN
// TAY, geo.21 chỉ đo độ dài, không cổng nào xác minh TỪNG link còn sống → link nội bộ trỏ route
// KHÔNG tồn tại/đã đổi (2/9 link nhahoachdinh trỏ route chết) lọt im lặng. Cổng đối chiếu tĩnh: trích
// path nội bộ trong llms.txt (link chứa domain của web, hoặc path tương đối "/…") → khớp với tập
// route THẬT (page.tsx tĩnh + mẫu route động [slug] + route-handler route.ts như /rss.xml,/llms.txt +
// metadata sitemap.ts→/sitemap.xml, robots.ts→/robots.txt). Không khớp = WARN (nghi link chết). Bỏ
// qua domain ngoài (không crawl HTTP — chạy offline lúc build). Không FAIL: llms.txt có thể trỏ trang
// CMS chưa build; WARN đủ để lộ ở báo cáo B2/B5.
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'public/llms.txt')) || existsSync(join(d, 'src/app/llms.txt/route.ts'))) return d; d = join(d, '..'); } return null; })();
  const llmsP = root ? join(root, 'public/llms.txt') : null;
  const dynRoute = root ? join(root, 'src/app/llms.txt/route.ts') : null;
  const appDir = root ? join(root, 'src/app') : null;
  if (dynRoute && existsSync(dynRoute)) {
    add('geo.23-llms-link-song', 'PASS', 'llms.txt sinh động từ route.ts (link luôn khớp route thật by construction) — bỏ qua đối chứng tĩnh');
  } else if (llmsP && existsSync(llmsP) && appDir && existsSync(appDir)) {
    // domain của web (tách link nội bộ vs ngoài) — placeholder [[CẦN-DỮ-KIỆN]] vẫn coi là nội bộ
    let domain = '';
    const scP = join(root, 'src/lib/site-config.ts');
    if (existsSync(scP)) { const m = readFileSync(scP, 'utf8').match(/domain:\s*["'`]([^"'`]+)["'`]/); if (m) domain = m[1]; }
    // tập route thật
    const staticR = new Set(['/']); const dynPat = []; // dynPat: mảng segment, seg động chứa "["
    (function walk(dir, urlPath) {
      let entries; try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const f of entries) {
        if (!f.isDirectory() || f.name.startsWith('_') || f.name.startsWith('.')) continue;
        const seg = f.name.startsWith('(') && f.name.endsWith(')') ? '' : `/${f.name}`;
        const u = urlPath + seg; const p = join(dir, f.name);
        const hasPage = ['page.tsx','page.ts','page.jsx'].some(x => existsSync(join(p, x)));
        const hasRoute = ['route.ts','route.tsx','route.js'].some(x => existsSync(join(p, x)));
        if ((hasPage || hasRoute) && u) { u.includes('[') ? dynPat.push(u.split('/').filter(Boolean)) : staticR.add(u); }
        walk(p, u);
      }
    })(appDir, '');
    if (existsSync(join(appDir, 'sitemap.ts'))) staticR.add('/sitemap.xml');
    if (existsSync(join(appDir, 'robots.ts'))) staticR.add('/robots.txt');
    // khớp 1 path với tập route
    const khop = (path) => {
      const P = path.replace(/\/+$/, '') || '/';
      if (staticR.has(P)) return true;
      const segs = P.split('/').filter(Boolean);
      return dynPat.some(pat => {
        const catchAll = pat.some(s => s.startsWith('[...'));
        if (!catchAll && pat.length !== segs.length) return false;
        if (catchAll && segs.length < pat.length - 1) return false;
        return pat.every((ps, i) => ps.startsWith('[') || ps === segs[i]);
      });
    };
    // trích link markdown [nhãn](url) + link trần https, lọc nội bộ, lấy path
    const llms = readFileSync(llmsP, 'utf8');
    const urls = [...llms.matchAll(/\]\(([^)]+)\)/g)].map(m => m[1].trim());
    const internal = [];
    for (const raw of urls) {
      let path = null;
      if (raw.startsWith('/')) path = raw;
      else if (domain && raw.includes(domain)) path = raw.slice(raw.indexOf(domain) + domain.length) || '/';
      if (path === null) continue; // domain ngoài — bỏ qua
      path = path.split('#')[0].split('?')[0]; // bỏ anchor/query
      if (path === '') path = '/';
      internal.push(path);
    }
    const chet = [...new Set(internal.filter(p => !khop(p)))];
    if (internal.length === 0) add('geo.23-llms-link-song', 'PASS', 'llms.txt không có link nội bộ để đối chiếu (có thể còn placeholder)');
    else if (chet.length === 0) add('geo.23-llms-link-song', 'PASS', `${internal.length} link nội bộ trong llms.txt đều khớp route thật`);
    else add('geo.23-llms-link-song', 'WARN', `llms.txt có link nội bộ KHÔNG khớp route nào (nghi link chết/đổi): ${chet.join(', ')} — sửa hoặc xoá khỏi llms.txt`);
  } }

// 23. seo.sitemap — sitemap.xml phải có ≥1 <url>
// .isFile() bắt buộc — Next.js sinh sitemap.xml dạng THƯ MỤC trong .next, readFileSync sẽ crash EISDIR. Fix từ nhahoachdinh 08/07/2026.
{ const sitemapInBuild = htmls.map(h => h.f.replace(/index\.html$/, '')).map(d => join(d, 'sitemap.xml')).find(p => existsSync(p) && statSync(p).isFile());
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/sitemap.ts'))) return d; d = join(d, '..'); } return null; })();
  const hasSitemapTs = root && existsSync(join(root, 'src/app/sitemap.ts'));
  if (sitemapInBuild) { const n = (readFileSync(sitemapInBuild, 'utf8').match(/<url>/g) || []).length;
    n >= 1 ? add('seo.23-sitemap', 'PASS', `sitemap.xml có ${n} <url>`) : add('seo.23-sitemap', 'WARN', 'sitemap.xml rỗng (<url> = 0)'); }
  else if (hasSitemapTs) add('seo.23-sitemap', 'PASS', 'src/app/sitemap.ts tồn tại — Next.js tự sinh sitemap khi deploy');
  else add('seo.23-sitemap', 'WARN', 'Không tìm thấy sitemap.ts — thêm src/app/sitemap.ts'); }

// seo.24-dynroute-sitemap (20260721, đề xuất vai 7 /nang-cap-web nhahoachdinh) — route ĐỘNG có
// generateStaticParams() sinh trang tĩnh THẬT (Google nên index) nhưng KHÔNG được sitemap.ts nhắc
// tới → sót khỏi sitemap ÂM THẦM (đúng họ lỗi 17 trang tỉnh /ban-do-du-an/[province-slug] +
// vụ danh-muc template). gen-sitemap-routes.mjs CỐ Ý bỏ mọi thư mục có "[" → route động PHẢI được
// sitemap.ts tự thêm tay (như /blog/[slug]). Cổng đối chiếu: mỗi route động CÓ generateStaticParams,
// lấy đoạn tĩnh cuối trước "[" (blog, danh-muc, ban-do-du-an) — nếu sitemap.ts KHÔNG chứa token đó →
// WARN (nghi sót). Chỉ WARN (không FAIL): universe slug đôi khi từ CMS, không chặn cứng "0 FAIL".
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/sitemap.ts'))) return d; d = join(d, '..'); } return null; })();
  const appDir = root ? join(root, 'src/app') : null;
  if (appDir && existsSync(appDir)) {
    const sitemapSrc = readFileSync(join(root, 'src/app/sitemap.ts'), 'utf8');
    const dynWithGsp = []; // { route, token }
    (function walk(dir, urlPath) {
      let entries; try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
      for (const f of entries) {
        if (!f.isDirectory()) continue;
        if (f.name.startsWith('_') || f.name.startsWith('.') || f.name === 'api') continue;
        const isDyn = f.name.includes('[');
        const seg = f.name.startsWith('(') && f.name.endsWith(')') ? '' : `/${f.name}`;
        const nextUrl = urlPath + seg;
        const p = join(dir, f.name);
        const pageF = ['page.tsx', 'page.ts', 'page.jsx'].map(x => join(p, x)).find(existsSync);
        if (isDyn && pageF && /export\s+(async\s+)?function\s+generateStaticParams|generateStaticParams\s*[:=]/.test(readFileSync(pageF, 'utf8'))) {
          // đoạn tĩnh cuối trước segment "[" đầu tiên trong đường dẫn
          const segs = nextUrl.split('/').filter(Boolean);
          const firstDynIdx = segs.findIndex(s => s.includes('['));
          const token = firstDynIdx > 0 ? segs[firstDynIdx - 1] : null;
          if (token) dynWithGsp.push({ route: nextUrl, token });
        }
        walk(p, nextUrl);
      }
    })(appDir, '');
    const sot = dynWithGsp.filter(({ token }) => !sitemapSrc.includes(token));
    if (dynWithGsp.length === 0) add('seo.24-dynroute-sitemap', 'PASS', 'không có route động generateStaticParams cần đối chiếu');
    else if (sot.length === 0) add('seo.24-dynroute-sitemap', 'PASS', `${dynWithGsp.length} route động generateStaticParams đều được sitemap.ts nhắc tới`);
    else add('seo.24-dynroute-sitemap', 'WARN', `route động có generateStaticParams nhưng sitemap.ts KHÔNG nhắc tới (nghi sót khỏi sitemap): ${sot.map(s => s.route).join(', ')} — thêm URL các trang này vào sitemap.ts`);
  } }

// 24. aeo.faq-schema — FAQ schema nên có (WARN nếu qa-data.ts rỗng)
// F42 (LÔ 5 nhóm A, 20260713): thêm 1 nhánh FAIL THẬT — trước đây cổng này 100% WARN, web có thể
// 0 câu hỏi (Q&A/FAQ TRỐNG HOÀN TOÀN) mà vẫn "đã kiểm luật" (THAM-DINH F42). Chỉ FAIL cứng khi
// qa-data.ts TỒN TẠI nhưng đúng 0 câu hỏi (trống hoàn toàn) — file chưa tồn tại hoặc có vài câu
// chưa đủ 4 vẫn giữ WARN (an toàn, tránh FAIL oan web đang làm dở).
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/qa-data.ts'))) return d; d = join(d, '..'); } return null; })();
  const qaPath = root ? join(root, 'src/lib/qa-data.ts') : null;
  const faqInHtml = htmls.some(h => h.src.includes('"@type":"FAQPage"') || h.src.includes('"@type": "FAQPage"'));
  if (faqInHtml) { add('aeo.24-faq-schema', 'PASS', 'FAQ schema (FAQPage) có trong HTML'); }
  else if (!qaPath || !existsSync(qaPath)) { add('aeo.24-faq-schema', 'WARN', 'Chưa có src/lib/qa-data.ts — thêm Q&A seeds để inject FAQPage schema'); }
  else { const src = readFileSync(qaPath, 'utf8');
    const qCount = (src.match(/question\s*:/g) || []).length;
    const hasReal = qCount >= 4 && !src.includes('[[CẦN');
    if (hasReal) add('aeo.24-faq-schema', 'WARN', 'qa-data.ts có dữ liệu nhưng FAQPage chưa thấy trong build HTML — kiểm page.tsx inject');
    else if (qCount === 0) add('aeo.24-faq-schema', 'FAIL', 'qa-data.ts KHÔNG có câu hỏi nào (0 Q&A) — FAQ/AEO/GEO trống hoàn toàn, phải điền ≥4 Q&A seeds trước bàn giao (F42, LÔ 5 20260713)');
    else add('aeo.24-faq-schema', 'WARN', `qa-data.ts mới có ${qCount}/4 câu — điền đủ ≥4 Q&A seeds để hưởng FAQ rich results (Google/AI)`); } }

// ── Tầng Design (cổng 25) ───────────────────────────────────────────────────

// 25. a11y.contrast — WCAG AA contrast cho các cặp màu brand (culori + luat-pairs.json)
{ const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/globals.css'))) return d; d = join(d, '..'); } return null; })();
  const pairsPath = root ? join(HERE, 'luat-pairs.json') : null;
  const cssPath   = root ? join(root, 'src/app/globals.css')        : null;
  // 7 cặp token CHUẨN của template — nhúng sẵn để web dùng token chuẩn LUÔN được đo contrast dù thiếu
  // luat-pairs.json (trước đây thiếu file = WARN rồi bỏ qua IM LẶNG → a11y bắt buộc lọt lưới). Web dùng
  // token khác chuẩn: cặp không resolve rơi vào nhánh WARN "kiểm tay" sẵn có, không bao giờ skip im lặng.
  const DEFAULT_PAIRS = [["--fg","--bg","body text","AAA"],["--fg-muted","--bg","muted"],["--accent","--bg","accent link"],["--fg","--bg-card","text on card","AAA"],["--fg","--bg-subtle","text on subtle"],["--on-accent","--accent","text on button"],["--fg","--bg-main","text on main"]];
  if (!root) {
    add('a11y.25-contrast', 'WARN', 'Không tìm thấy src/app/globals.css — không đủ dữ kiện đo contrast, kiểm tay');
  } else {
    try {
      // Resolve culori từ node_modules bên cạnh script (templateweb devDep)
      const { wcagLuminance } = await import('culori/fn');
      const { parse } = await import('culori');
      // Đọc globals.css + GỘP mọi file được @import (cùng thư mục src/app/) — vì web dùng
      // design-token 2 tầng: globals.css chỉ alias qua var(), giá trị #hex thật nằm ở file
      // được import (vd heritage-paper.css). Không gộp → checker tưởng token vô nghĩa → FAIL oan.
      const cssDir = dirname(cssPath);
      const importRe = /@import\s+(?:url\(\s*)?["']([^"')]+)["']\s*\)?[^;]*;/g;
      // Gom @import transitive AN TOÀN. 2 bẫy đã gây treo vô hạn (RAM ~2GB, effects.css 20260711):
      //  (1) không bỏ comment → khớp nhầm `@import` ví dụ nằm trong /* chú thích */;
      //  (2) không có seen-set + nối chuỗi lúc đang exec → 1 file "tự import" (dù chỉ trong comment)
      //      hay 2 file import vòng tròn = phình chuỗi vô tận. Duyệt theo hàng đợi + seen-set để chặn.
      const stripComments = s => boChuThichChung(s, 'css');
      let cssContent = readFileSync(cssPath, 'utf8');
      const seen = new Set([cssPath]);
      const queue = [cssContent];
      for (let head = 0; head < queue.length; head++) {
        const body = stripComments(queue[head]);
        let im; importRe.lastIndex = 0;
        while ((im = importRe.exec(body)) !== null) {
          const impPath = join(cssDir, im[1]);
          if (seen.has(impPath) || !existsSync(impPath)) continue;
          seen.add(impPath);
          const txt = readFileSync(impPath, 'utf8');
          cssContent += '\n' + txt; queue.push(txt);
        }
      }
      const pairs = (pairsPath && existsSync(pairsPath)) ? JSON.parse(readFileSync(pairsPath, 'utf8')) : DEFAULT_PAIRS;

      // A2 (audit gomnhalua 10/07/2026): token thật của template dùng
      // `--fg: light-dark(oklch(22% 0.012 var(--brand-h)), oklch(94% 0.008 var(--brand-h)));`
      // — 2 lỗi cũ khiến cổng chết: (1) oklch() tham chiếu var(--brand-h) chưa thay giá trị thật
      // trước khi culori parse (culori không hiểu var()); (2) chỉ đọc light-dark() nhánh đầu (light),
      // bỏ qua nhánh dark — không kiểm được contrast theme tối.

      // Lấy nguyên văn khai báo của 1 biến CSS (từ dấu ":" tới dấu ";" đóng, không cần cân ngoặc
      // vì mọi khai báo màu ở đây kết thúc bằng 1 dấu ";" duy nhất).
      function getDeclaration(varName) {
        const esc = varName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        const m = cssContent.match(new RegExp(`${esc}\\s*:\\s*([\\s\\S]*?);`));
        return m ? m[1].trim() : null;
      }
      // F12 (audit 12/07 đợt 2): biến này có được khai lại trong 1 khối theme TỐI riêng
      // ([data-theme=dark] / .dark / @media prefers-color-scheme:dark)? getDeclaration chỉ lấy khai báo
      // ĐẦU (light); web khai dark bằng override (không light-dark()) sẽ bị bỏ kiểm nền tối → PASS oan.
      function hasDarkOverride(varName) {
        const esc = varName.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
        return new RegExp(`(?:\\[data-theme\\s*=\\s*["']?dark["']?\\]|\\.dark\\b|prefers-color-scheme\\s*:\\s*dark)[\\s\\S]{0,600}?${esc}\\s*:`, 'i').test(cssContent);
      }
      // Thay đệ quy mọi var(--x) bằng giá trị thật (chỉ cần 1 tầng cho --brand-h/--brand-c/--accent...
      // vì đây là hằng số đơn, không phải light-dark()/oklch() lồng nhau).
      function substituteVars(text, depth = 0) {
        if (depth > 4) return text;
        return text.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, v) => {
          const d = getDeclaration(v);
          if (!d || /light-dark\(/.test(d)) return '0';
          return substituteVars(d, depth + 1);
        });
      }
      // Tách 2 tham số top-level của light-dark(a, b) — an toàn với oklch(...) lồng bên trong
      // vì oklch() hiện đại dùng dấu cách chứ không dùng dấu phẩy.
      function splitTopLevel(s) {
        const parts = []; let depth = 0, cur = '';
        for (const ch of s) {
          if (ch === '(') depth++; if (ch === ')') depth--;
          if (ch === ',' && depth === 0) { parts.push(cur); cur = ''; } else cur += ch;
        }
        parts.push(cur);
        return parts.map(p => p.trim());
      }
      // Trả về { light, dark } — 2 màu culori đã parse, hoặc null nếu không resolve được.
      function resolveVar(varName, depth = 0) {
        if (depth > 4) return null;
        // F2 (audit 12/07 đợt 2): cặp màu dạng GIÁ TRỊ LITERAL (không phải tên biến "--x") — vd
        // luat-pairs.mau.json ["#1D375A","#FDFBF5"] / "oklch(...)". getDeclaration chỉ tìm KHAI BÁO biến
        // nên literal luôn trả null → cặp rơi vào 'unresolved', cổng a11y bắt buộc âm thầm không đo. Parse thẳng.
        if (!varName.startsWith('--')) { const c = parse(varName); return c ? { light: c, dark: c } : null; }
        let decl = getDeclaration(varName);
        if (!decl) return null;
        // Alias thuần kiểu `--bg-main: var(--bg-subtle);` — đệ quy thẳng để giữ nguyên
        // cặp light-dark của biến gốc (substituteVars phía dưới cố tình CHẶN light-dark lồng
        // trong oklch(), nhưng đây không phải trường hợp đó — cả khai báo chỉ là 1 tham chiếu).
        const alias = decl.match(/^var\(\s*(--[\w-]+)\s*\)$/);
        if (alias) return resolveVar(alias[1], depth + 1);
        decl = substituteVars(decl);
        const ld = decl.match(/light-dark\(([\s\S]*)\)\s*$/);
        if (ld) {
          const [lightRaw, darkRaw] = splitTopLevel(ld[1]);
          if (!lightRaw || !darkRaw) return null;
          const light = parse(lightRaw), dark = parse(darkRaw);
          return (light && dark) ? { light, dark } : null;
        }
        const oklchMatch = decl.match(/oklch\([^)]*\)/);
        const single = parse(oklchMatch ? oklchMatch[0] : decl);
        if (!single) return null;
        // F12: token đơn (không light-dark()) — đánh dấu nếu web có override theme tối chưa gộp được,
        // để cổng WARN "kiểm tay" thay vì PASS ngầm cho nền tối.
        return { light: single, dark: single, darkOverride: hasDarkOverride(varName) };
      }
      function contrastRatio(c1, c2) {
        const l1 = wcagLuminance(c1), l2 = wcagLuminance(c2);
        const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
        return (hi + 0.05) / (lo + 0.05);
      }

      // fail-closed (A2): trước đây "không parse được" chỉ WARN rồi bỏ qua cặp đó — nghĩa là
      // đúng những cặp lỗi/khó nhất lại KHÔNG được kiểm gì cả. Giờ không resolve được = FAIL,
      // buộc phải sửa token hoặc sửa máy kiểm, không được lặng lẽ trôi qua.
      // Tách 2 loại vấn đề: (1) contrast THẬT vi phạm ngưỡng → FAIL cứng;
      // (2) không resolve được token màu (dù đã đọc chéo file @import) → WARN "kiểm tay",
      // KHÔNG FAIL oan — vì token có thể được định nghĩa ở file import khác/JS mà checker
      // chưa gom được, chứ chưa chắc là lỗi tương phản.
      const fails = [], unresolved = [];
      for (const [fg, bg, label, level] of pairs) {
        const fgC = resolveVar(fg), bgC = resolveVar(bg);
        const tag = label || `${fg}/${bg}`;
        if (!fgC || !bgC) { unresolved.push(tag); continue; }
        const threshold = level === 'AAA' ? 7 : 4.5;
        // F12: có override theme tối chưa gộp được → chỉ đo light, đẩy vào WARN "kiểm tay" (không PASS ngầm dark)
        const darkUnsure = fgC.darkOverride || bgC.darkOverride;
        for (const theme of (darkUnsure ? ['light'] : ['light', 'dark'])) {
          const ratio = contrastRatio(fgC[theme], bgC[theme]);
          if (ratio < threshold) fails.push(`${tag} [${theme}]: ${ratio.toFixed(2)}:1 (< ${threshold} ${level === 'AAA' ? 'AAA' : 'AA'})`);
        }
        if (darkUnsure) unresolved.push(`${tag} [theme tối override — kiểm tay]`);
      }
      if (fails.length)
        add('a11y.25-contrast', 'FAIL', `Contrast vi phạm: ${fails.join(' | ')}`);
      else if (unresolved.length)
        add('a11y.25-contrast', 'WARN', `${unresolved.join(', ')}: không resolve được token màu (có thể định nghĩa ở file import/JS) — kiểm tay`);
      else
        add('a11y.25-contrast', 'PASS', `${pairs.length} cặp màu brand đạt ngưỡng ở CẢ 2 theme light+dark (AAA cho nội dung đọc chính, AA cho UI phụ)`);
    } catch (e) {
      // Phân biệt HỎNG HẠ TẦNG với WEB SAI MÀU — hai thứ chữa hoàn toàn khác nhau (11/09/2026).
      // Bệnh thật: đợt dọn ổ đầy 07/09 xoá `node_modules` nhiều repo, mất luôn `culori` (vốn ĐÃ khai
      // trong package.json). Cổng đỏ, đối chứng hồi quy đỏ theo — và lời khai cũ chỉ nói "phải sửa
      // trước bàn giao", nghe như WEB sai màu, nên người đọc đi soi `globals.css` thay vì cài lại thư
      // viện. Giữ nguyên mức FAIL (không đo được thì KHÔNG được đọc thành đạt), chỉ nói rõ CHỮA Ở ĐÂU.
      const thieuThuVien = e.code === 'ERR_MODULE_NOT_FOUND' || /Cannot find (module|package)/i.test(e.message || '');
      add('a11y.25-contrast', 'FAIL', thieuThuVien
        ? `HỎNG HẠ TẦNG, KHÔNG phải web sai màu: thiếu thư viện culori (đã khai trong package.json) nên không đo được tương phản. Chữa: cd vào thư mục web rồi chạy \`npm ci\` — đừng đi sửa globals.css.`
        : `culori không load được (${e.message?.slice(0, 80)}) — không kiểm được contrast, phải sửa trước bàn giao`);
    }
  }
}

// 25b. a11y.25b-contrast-render — tương phản đo trên TRANG ĐÃ RENDER (pixel thật).
// Bù đúng chỗ mù của cổng 25 ở trên: cổng 25 chỉ đọc cặp token khai trong globals.css, nên chữ chìm
// sinh ra lúc render (gradient, opacity, background-clip:text, -webkit-text-fill-color) KHÔNG bao giờ
// lộ ra. Bằng chứng 03/08/2026: nhahoachdinh.vn ra 92 PASS / 0 FAIL trong khi máy đo pixel tìm ~90 chỗ
// chữ chìm, gồm nhãn cửa của toàn bộ 247 bài viết (1,29:1) và tiêu đề trang chủ.
// KHÔNG đo tại chỗ vì phép đo cần trình duyệt + server sống; cổng này đọc kết quả mà
// `do-tuong-phan.mjs --ghi-ket-qua` để lại. Thiếu kết quả thì WARN "CHƯA ĐO" — CẤM PASS: im lặng
// chính là bệnh đang chữa (cùng vệt sự cố sitemap rỗng 19/07 — xanh mà rỗng).
// Một cổng = MỘT verdict: mỗi nhánh dưới đây gọi add() đúng một lần (regression-luat.mjs đọc PASS trước).
{
  const rootTP = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'package.json'))) return d; d = join(d, '..'); } return null; })();
  const fileKQ = rootTP ? join(rootTP, '.do-tuong-phan.json') : null;
  if (!fileKQ || !existsSync(fileKQ)) {
    add('a11y.25b-contrast-render', 'WARN', 'CHƯA ĐO tương phản trên trang render — chạy `PORT=<port> npm run do:tuong-phan` từ trong thư mục web (web mới KHÔNG có tệp .mjs cục bộ — rsync loại từ 21/07/2026; npm script đã trỏ sẵn bản gốc). Cổng a11y.25 ở trên CHỈ soi token màu trong globals.css, KHÔNG thấy chữ chìm do gradient/opacity.');
  } else {
    try {
      const kq = JSON.parse(readFileSync(fileKQ, 'utf8'));
      const soNgay = Math.floor((Date.now() - new Date(kq.ngay)) / 86400000);
      // Mã giao diện có đổi sau lần đo không? Lấy mốc sửa mới nhất của globals.css và src/app.
      const mocDo = new Date(kq.ngay).getTime();
      const moiHonKetQua = ['src/app/globals.css', 'src/app', 'src'].some(p => {
        try { return statSync(join(rootTP, p)).mtimeMs > mocDo; } catch { return false; }
      });
      if (kq.truot > 0) {
        const vd = (kq.chi_tiet_truot || []).slice(0, 3).map(x => `"${x.chu}" ${x.ti_le}:1 < ${x.nguong}`).join(' | ');
        add('a11y.25b-contrast-render', 'FAIL', `${kq.truot}/${kq.do_duoc} phần tử chữ dưới ngưỡng trên trang render: ${vd}`);
      } else if (!kq.do_duoc) {
        add('a11y.25b-contrast-render', 'WARN', `Kết quả đo RỖNG (0 phần tử đo được, ${kq.bo_qua} bỏ qua) — bộ chọn không khớp gì, đo lại với --chon rộng hơn`);
      } else if (moiHonKetQua) {
        // Căn cứ "kết quả lỗi thời" phải là MÃ ĐÃ ĐỔI SAU LẦN ĐO, không phải "đã bao nhiêu ngày":
        // số ngày là võ đoán (web không đụng tới thì kết quả 3 tháng vẫn đúng), và nó làm mẫu đối
        // chứng TỰ MỤC sau vài tuần rồi bắt hồi quy đỏ giả — bẫy đã thấy trước khi dựng corpus.
        add('a11y.25b-contrast-render', 'WARN', `Mã giao diện đã sửa SAU lần đo (${soNgay} ngày trước) — kết quả không còn đại diện, đo lại`);
      } else {
        add('a11y.25b-contrast-render', 'PASS', `${kq.do_duoc} phần tử chữ đạt ngưỡng trên trang render thật (${(kq.routes || []).length} route, ${kq.kho}), đo ${soNgay} ngày trước`);
      }
    } catch (e) {
      add('a11y.25b-contrast-render', 'WARN', `Không đọc được .do-tuong-phan.json (${e.message?.slice(0, 60)}) — đo lại`);
    }
  }
}

// ── Batch L: Mobile checks ──────────────────────────────────────────────────
{ // mobile.28: input font-size ≥ 16px (chặn iOS zoom)
  // A5 (audit gomnhalua 10/07/2026): regex cũ `(1[0-3]|[0-9])` chỉ khớp 0-9px và 10-13px — LỌT
  // 14px/15px vì thiếu nhánh "14|15". Đổi sang parse số thật rồi so sánh <16.
  // 20260721 (sổ đề xuất 16/07#1): CHỈ đo font-size TRÊN CHÍNH thẻ input/select/textarea (inline
  // style) HOẶC rule CSS nhắm các thẻ đó — cũ grep font-size CẢ TRANG nên bắt oan chữ nhỏ
  // caption/dropdown (35 trang WARN oan ở nhahoachdinh dù mọi input thật ≥16px, e2e computed-style
  // xác nhận). iOS chỉ zoom khi CHÍNH ô nhập <16px, không liên quan cỡ chữ nơi khác trên trang.
  const smallPx = s => [...s.matchAll(/font-size:\s*([\d.]+)px/g)].some(m => parseFloat(m[1]) < 16);
  const cssInputBad = (allCss.match(/[^{}]*\{[^{}]*\}/g) || []).some(b => {
    const sel = b.split('{')[0];
    if (!/(^|[\s,>+~(])(input|select|textarea)\b|\[type\s*=/i.test(sel)) return false;
    return smallPx(b);
  });
  const bad = htmls.filter(h => {
    const tags = h.src.match(/<(?:input|select|textarea)\b[^>]*>/gi);
    if (!tags) return false;
    return cssInputBad || tags.some(smallPx); // rule CSS global nhắm input <16px HOẶC inline trên chính thẻ
  });
  bad.length ? add('mobile.28-input-zoom', 'WARN', `${bad.length} trang có input/select/textarea <16px (đo trên chính thẻ hoặc rule CSS nhắm input) — iOS sẽ tự zoom`) : add('mobile.28-input-zoom', 'PASS', 'Input font-size hợp lệ'); }
{ // mobile.22: cấm user-scalable/maximum-scale
  // F11 (audit 12/07 đợt 2): regex cũ chỉ bắt literal 'no' và '1' → lọt user-scalable=0 (khoá zoom y hệt 'no')
  // và maximum-scale=0.5/1.0 (đều <2, chặn phóng to). Bắt cả 2; maximum-scale=10 (cho phép) vẫn KHÔNG khớp.
  const bad = htmls.filter(h => /user-scalable\s*=\s*(no|0)|maximum-scale\s*=\s*(1(\.0+)?|0?\.\d+)(?!\d)/i.test(h.src));
  bad.length ? add('mobile.22-pinch', 'FAIL', `${bad.length} trang khoá pinch-zoom — vi phạm WCAG 1.4.4`) : add('mobile.22-pinch', 'PASS', 'Không khoá pinch-zoom'); }
{ // mobile.14: manifest không khoá orientation
  // BUG đã vá 20260707: dùng biến `rootDir` chưa từng định nghĩa → luôn throw, try/catch nuốt lỗi,
  // gate luôn báo PASS giả không thật sự đọc manifest.json. Sửa dùng đúng pattern `root` IIFE dò từ DIR.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'public/manifest.json'))) return d; d = join(d, '..'); } return null; })();
  const mf = root ? (() => { try { return JSON.parse(readFileSync(join(root, 'public/manifest.json'), 'utf8')); } catch { return null; } })() : null;
  !root
    ? add('mobile.14-orientation', 'WARN', 'Không tìm thấy public/manifest.json để kiểm')
    : mf?.orientation
      ? add('mobile.14-orientation', 'FAIL', 'manifest.json khoá orientation — vi phạm WCAG 1.3.4')
      : add('mobile.14-orientation', 'PASS', 'Manifest không khoá orientation'); }
{ // a11y.8: skip-link
  const bad = htmls.filter(h => !/<a[^>]+skip-link|<a[^>]+href="#main/.test(h.src));
  bad.length > htmls.length / 2 ? add('a11y.8-skip-link', 'WARN', 'Phần lớn trang không có skip-link — thêm vào layout.tsx') : add('a11y.8-skip-link', 'PASS', 'Skip-link tìm thấy'); }
{ // a11y.2: không có outline:none tắt focus
  const bad = allCss.match(/outline\s*:\s*none\s*(?!\s*\/\*[^*]*\*\/)/g) || [];
  bad.length > 2 ? add('a11y.2-outline', 'WARN', `${bad.length} chỗ outline:none — kiểm có :focus-visible thay thế`) : add('a11y.2-outline', 'PASS', 'Không lạm dụng outline:none'); }
{ // layout.1: có .article-layout hoặc max-width token
  const has = /\.article-layout|\.article-prose/.test(allCss);
  has ? add('layout.23-container', 'PASS', '.article-layout/.article-prose có trong CSS') : add('layout.23-container', 'WARN', 'Chưa có .article-layout — dùng CSS container tokenised'); }
{ // layout.20: text-box-trim / margin-trim @supports
  // Vá 20260818 — LỖI THẬT nhahoachdinh.vn: cổng cũ chỉ hỏi "CSS có chữ text-box-trim không" nên
  // web PASS trong khi màn hình đang xén cụt dấu tiếng Việt ở 7 chỗ ("Cần Chuẩn Bị" hiện ra
  // "Cân Chuân Bi"). Gốc: trim hạ mép hộp chữ xuống cap-height/baseline, nên dấu (ấ ề ộ ữ) thò RA
  // NGOÀI hộp; heading nào có mặt nạ overflow (line-clamp, overflow-hidden, truncate, hoặc inline
  // overflow:hidden làm mặt nạ hiệu ứng trượt) thì phần thò ra bị cắt mất.
  // Nay cổng soi tiếp: có trim cho heading + heading thật sự bị mặt nạ + CSS chưa gỡ trim ⇒ FAIL.
  // 'gold-shine' thêm 20/08/2026 — NGÒI NỔ THỨ BA: `background-clip: text` (chữ ánh kim) cũng cắt
  // chữ theo hộp ĐÃ TRIM, KHÔNG cần overflow ẩn. Đo thật trên nhahoachdinh.vn: tiêu đề
  // "Bộ sách mới đang hoàn thiện" hiện ra "Bô sách mới" — mất dấu nặng. Cổng bản 18/08 bỏ lọt
  // vì chỉ soi overflow. Lớp ánh kim dùng chung ở template tên `.gold-shine`.
  const MAT_NA = ['line-clamp-1', 'line-clamp-2', 'line-clamp-3', 'line-clamp-4', 'overflow-hidden', 'truncate', 'gold-shine'];
  const coTrim = /text-box-trim|margin-trim/.test(allCss);
  if (!coTrim) { add('layout.20-trim', 'WARN', 'Thiếu text-box-trim — căn quang học heading chưa tốt'); }
  else {
    // Trim có ÁP CHO HEADING không? Web chỉ trim nút (.btn-*) thì heading bị clamp cũng vô hại.
    const khoi = [...allCss.matchAll(/([^{}]{1,600})\{([^{}]*text-box-trim\s*:\s*[^;}]+)[^{}]*\}/gi)];
    const trimChoHeading = khoi.some(m => !/text-box-trim\s*:\s*none/i.test(m[2]) && /(^|,)\s*h[1-4]\b/i.test(' ' + m[1].replace(/\s+/g, ' ')));
    // CSS đã gỡ trim cho những loại mặt nạ nào?
    const daGo = new Set();
    for (const m of khoi) {
      if (!/text-box-trim\s*:\s*none/i.test(m[2])) continue;
      for (const t of MAT_NA) if (m[1].includes(t)) daGo.add(t);
    }
    const goInline = /text-box-trim\s*:\s*none/i.test(allCss) && /\.trim-off\b/.test(allCss);
    // Heading nào trong HTML thật đang đeo mặt nạ?
    const dinh = new Set(); const viDu = []; let soInline = 0;
    for (const h of htmls) {
      for (const the of h.src.match(/<h[1-4]\b[^>]*>/gi) || []) {
        const cls = (the.match(/class\s*=\s*"([^"]*)"/i) || ['', ''])[1];
        const st = (the.match(/style\s*=\s*"([^"]*)"/i) || ['', ''])[1];
        for (const t of MAT_NA) if (new RegExp(`(^|\\s)${t}(\\s|$)`).test(cls) && !daGo.has(t)) {
          dinh.add(t); if (viDu.length < 4) viDu.push(`${h.rel || h.file || 'html'}: ${the.slice(0, 60)}`);
        }
        if (/overflow\s*:\s*hidden/i.test(st) && !/\btrim-off\b/.test(cls) && !goInline) soInline++;
      }
    }
    if (!trimChoHeading) add('layout.20-trim', 'PASS', 'text-box-trim có trong CSS, không áp cho h1-h4 nên không có nguy cơ xén dấu');
    else if (dinh.size || soInline) {
      const ly = [];
      if (dinh.size) ly.push(`mặt nạ chưa gỡ: ${[...dinh].join(' · ')}`);
      if (soInline) ly.push(`${soInline} heading có inline overflow:hidden mà thiếu class .trim-off`);
      add('layout.20-trim', 'FAIL', `text-box-trim áp cho h1-h4 nhưng ${ly.join(' | ')} ⇒ DẤU tiếng Việt bị xén cụt (ấ→â, ộ→ô). Thêm rule gỡ: :is(h1,h2,h3,h4):is(.line-clamp-2,.overflow-hidden,.truncate,.trim-off){text-box-trim:none;text-box-edge:auto}${viDu.length ? ' — ví dụ: ' + viDu.join(' · ') : ''}`);
    }
    else add('layout.20-trim', 'PASS', 'text-box-trim áp cho heading và mọi heading có mặt nạ overflow đều đã được gỡ trim — dấu tiếng Việt không bị xén');
  } }
{ // perf: cấm <img> thô trong .tsx source (dùng next/image thay thế)
  // BUG đã vá 20260707: dùng biến `rootDir` chưa từng định nghĩa → luôn throw, try/catch nuốt lỗi,
  // gate luôn báo PASS giả không thật sự quét source nào. Sửa dùng đúng pattern `root` IIFE dò từ DIR.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app'))) return d; d = join(d, '..'); } return null; })();
  const srcFiles = root ? (() => { try { return readdirSync(join(root, 'src'), { recursive: true }).filter(f => f.endsWith('.tsx')).map(f => readFileSync(join(root, 'src', f), 'utf8')); } catch { return []; } })() : [];
  const bad = srcFiles.filter(s => /<img\s/.test(s));
  !root
    ? add('perf.4-raw-img', 'WARN', 'Không tìm thấy thư mục src/ để kiểm')
    : bad.length ? add('perf.4-raw-img', 'WARN', `${bad.length} file .tsx dùng <img> thô — dùng next/image cho AVIF/WebP/CLS`) : add('perf.4-raw-img', 'PASS', 'Không dùng <img> thô trong .tsx'); }
{ // resilience: không lộ error.message/stack ra UI
  const errLeak = htmls.filter(h => /error\.message|error\.stack|\[object Error\]/.test(h.src));
  errLeak.length ? add('resilience.8-error-leak', 'FAIL', `${errLeak.length} trang lộ error.message/stack — ẩn đi trước deploy`) : add('resilience.8-error-leak', 'PASS', 'Không lộ error details ra HTML'); }
{ // mobile: kiểm safe-area env() tồn tại
  // 20260721 (sổ đề xuất 16/07#2): quét THÊM inline style/HTML SSR — nhiều web khai safe-area qua
  // style={{ }} inline (MobileBottomNav) hoặc giá trị Tailwind tuỳ ý cho khoảng đệm dưới an toàn,
  // KHÔNG nằm trong allCss (chỉ gồm file CSS + <style>) → WARN oan dù đã hỗ trợ đầy đủ.
  // (F-nongnghiepdisan 20260723: dòng chú thích này TỪNG viết ra ví dụ cú pháp thật của lớp Tailwind
  // "giá trị tuỳ ý" cho khoảng đệm dưới — SO-TAY-MAY-KIEM không bị .gitignore, Tailwind v4 quét CẢ file
  // .mjs tìm token candidate, chuỗi đó từng khiến 1 web build lỗi 500; web tự vá bằng cách đổi câu chữ,
  // nhưng gac-nha-may.sh lại báo "lệch bản gốc" vì so khớp md5 tuyệt đối — giữ nguyên bài học: MÔ TẢ
  // bằng lời, KHÔNG bao giờ chép nguyên văn cú pháp lớp Tailwind thật vào chú thích trong SO-TAY-MAY-KIEM/,
  // kể cả khi đang giải thích lý do tránh nó — chép ví dụ để dặn dò lại tái tạo đúng thứ đang cảnh báo.)
  const has = /env\(safe-area-inset/.test(allCss) || htmls.some(h => /env\(safe-area-inset/.test(h.src));
  has ? add('mobile.29-safe-area', 'PASS', 'safe-area-inset env() có trong CSS/inline') : add('mobile.29-safe-area', 'WARN', 'Chưa có env(safe-area-inset) — notch/bottom-bar chưa hỗ trợ'); }

// ── Batch Đợt 3 (20260707): SEO HEAD gates + AEO self-contained + i18n physical class ──
{ // seo.2: HEAD đủ — title + canonical (BẮT BUỘC → FAIL) · OG + Twitter Card (chia sẻ → WARN)
  // Vá 31/07/2026 (GĐ C, máy hoá tiêu chí "HTML HEAD đủ: Title · meta description · canonical · OG ·
  // Twitter Card"). Hai chỗ hụt khiến tiêu chí mãi ở mức "phủ MỘT PHẦN":
  //   (1) THIẾU MỆNH ĐỀ — luật đòi 5 thứ, cổng cũ chỉ soi 4 (không hề soi Twitter Card).
  //   (2) KHÔNG CHẶN ĐƯỢC GÌ — cổng chỉ có nhánh WARN. Theo hàng rào cấu trúc trong kiem-nha-may.mjs,
  //       cổng không có nhánh FAIL thì KHÔNG bao giờ được tính là đã máy hoá đủ, và điều đó đúng: chỉ
  //       nhắc nhở thì không phải cổng.
  // Vì vậy TÁCH MỨC theo hậu quả thật, KHÔNG đồng loạt nâng lên FAIL (nâng bừa sẽ làm mọi web đỏ oan
  // rồi bị phớt lờ — đúng bệnh "cổng đỏ vĩnh viễn cũng bịt lỗi thật"):
  //   · thiếu <title> hoặc canonical = lỗi kỹ thuật thật (mất tiêu đề trên SERP · nguy cơ trùng lặp
  //     nội dung do không khai bản chính) → FAIL.
  //   · đủ 2 thứ trên nhưng thiếu OG/Twitter = chỉ hỏng thẻ xem trước khi chia sẻ → giữ WARN.
  // Trang khai noindex (trang nội bộ: demo, xem trước, cảm ơn…) KHÔNG cần canonical — công cụ tìm
  // kiếm không lập chỉ mục thì không có gì để chỉ về bản chính. Bộ lọc cố ý HẸP: chỉ tha đúng vế
  // canonical, vẫn đòi <title> như mọi trang (bộ lọc chống báo oan rất dễ bịt luôn lỗi thật — có mẫu
  // đối chứng `fail-noindex-thieu-title` canh đúng chỗ này).
  const laNoindex = (src) => /<meta[^>]+name="robots"[^>]*content="[^"]*noindex/i.test(src);
  const thieuLoi = htmls.filter(h =>
    !(/<title>[^<]{3,}<\/title>/.test(h.src)
      && (laNoindex(h.src) || /<link[^>]+rel="canonical"/.test(h.src))));
  // meta description soi ở ĐÂY chứ không ở seo.31: seo.31 chỉ chấm ĐỘ DÀI của description đã có
  // (`.filter(Boolean)`), nên trang thiếu HẲN description lọt qua cả hai cổng — lỗ này lộ ra đúng lúc
  // đối chiếu từng mệnh đề của tiêu chí "HTML HEAD đủ" để khai `do_phu: "du"`.
  const thieuPhu = htmls.filter(h =>
    !(/<meta[^>]+property="og:title"/.test(h.src)
      && /<meta[^>]+property="og:description"/.test(h.src)
      && /<meta[^>]+name="twitter:card"/.test(h.src)
      && metaContent(h.src, 'description')));
  thieuLoi.length
    ? add('seo.2-head', 'FAIL', `${thieuLoi.length}/${htmls.length} trang thiếu <title> hoặc canonical: ${thieuLoi.map(b => b.f).slice(0,5).join(', ')}`)
    : thieuPhu.length
      ? add('seo.2-head', 'WARN', `${thieuPhu.length}/${htmls.length} trang đủ title+canonical nhưng thiếu meta description hoặc og:title/og:description/twitter:card: ${thieuPhu.map(b => b.f).slice(0,5).join(', ')}`)
      : add('seo.2-head', 'PASS', 'Mọi trang đủ title + canonical + meta description + OG title/description + twitter:card'); }

// ── SEO cổ điển (20260722, đúc kết từ đối chiếu SEOmator/seo-audit-skill open-source — core-title-length/
// core-h1-single/content-heading-hierarchy/content-title-unique/links-orphan-pages): 6 cổng bù chỗ trống
// seo.2 chỉ kiểm CÓ/KHÔNG chứ không kiểm ĐỘ DÀI/CẤU TRÚC/TRÙNG LẶP. Đều WARN (không FAIL) vì đây là
// khuyến nghị chất lượng, không phải lỗi kỹ thuật chặn crawl — đúng tinh thần các cổng seo.* hiện có.
{ // seo.30: title nên 30–60 ký tự (dưới 30 quá cụt mất cơ hội từ khoá phụ, trên 60 SERP cắt cụt)
  const bad = htmls.map(h => { const m = h.src.match(/<title>([^<]{1,})<\/title>/); return m ? { f: h.f, len: m[1].trim().length } : null; })
    .filter(Boolean).filter(t => t.len < 30 || t.len > 60);
  bad.length
    ? add('seo.30-title-length', 'WARN', `${bad.length} trang có title ngoài khoảng 30–60 ký tự: ${bad.map(b => `${b.f}(${b.len})`).slice(0, 5).join(', ')}`)
    : add('seo.30-title-length', 'PASS', 'Mọi title trong khoảng 30–60 ký tự'); }

{ // seo.31: meta description nên 120–160 ký tự (chuẩn hiển thị SERP, không phụ thuộc thứ tự thuộc tính)
  const bad = htmls.map(h => { const d = metaContent(h.src, 'description'); return d ? { f: h.f, len: d.trim().length } : null; })
    .filter(Boolean).filter(d => d.len < 120 || d.len > 160);
  bad.length
    ? add('seo.31-desc-length', 'WARN', `${bad.length} trang có meta description ngoài khoảng 120–160 ký tự: ${bad.map(b => `${b.f}(${b.len})`).slice(0, 5).join(', ')}`)
    : add('seo.31-desc-length', 'PASS', 'Mọi meta description trong khoảng 120–160 ký tự'); }

{ // seo.32: mỗi trang phải có ĐÚNG 1 thẻ <h1> — 0 = mất tín hiệu chủ đề, >1 = loãng trọng số
  const bad = htmls.map(h => ({ f: h.f, n: (mainOf(h.src).match(/<h1[\s>]/gi) || []).length })).filter(x => x.n !== 1);
  bad.length
    ? add('seo.32-h1-single', 'WARN', `${bad.length} trang không có đúng 1 H1: ${bad.map(b => `${b.f}(${b.n})`).slice(0, 5).join(', ')}`)
    : add('seo.32-h1-single', 'PASS', 'Mọi trang có đúng 1 H1'); }

{ // seo.33: thứ bậc heading không nhảy cấp (H1→H3 bỏ qua H2) — chỉ soi trong <main>, tránh nhiễu
  // heading trang trí trong Navbar/Footer lặp lại mọi trang.
  const bad = htmls.map(h => {
    const levels = [...mainOf(h.src).matchAll(/<h([1-6])[\s>]/gi)].map(m => Number(m[1]));
    let maxSeen = 0;
    for (const lv of levels) { if (lv > maxSeen + 1) return { f: h.f, tu: maxSeen, den: lv }; maxSeen = Math.max(maxSeen, lv); }
    return null;
  }).filter(Boolean);
  bad.length
    ? add('seo.33-heading-hierarchy', 'WARN', `${bad.length} trang nhảy cấp heading: ${bad.map(b => `${b.f}(H${b.tu}→H${b.den})`).slice(0, 5).join(', ')}`)
    : add('seo.33-heading-hierarchy', 'PASS', 'Không trang nào nhảy cấp heading'); }

{ // seo.34: title không trùng giữa các trang khác nhau (trùng = Google khó phân biệt trang nào đúng ý)
  const byTitle = new Map();
  for (const h of htmls) { const m = h.src.match(/<title>([^<]{1,})<\/title>/); if (!m) continue;
    const t = m[1].trim(); if (!byTitle.has(t)) byTitle.set(t, []); byTitle.get(t).push(h.f); }
  const trung = [...byTitle.entries()].filter(([, files]) => files.length > 1);
  trung.length
    ? add('seo.34-title-unique', 'WARN', `${trung.length} title trùng giữa nhiều trang: ${trung.map(([t, files]) => `"${t}"(${files.join('+')})`).slice(0, 5).join(', ')}`)
    : add('seo.34-title-unique', 'PASS', 'Mọi title đều duy nhất'); }

{ // seo.36: nội dung chính (<main>) nên có ≥2 link nội bộ trỏ trang KHÁC — chống "trang mồ côi"/bài viết
  // không liên kết chéo (backlink density nội bộ, đề xuất Ông 22/07). Bỏ qua trang pháp lý (điều khoản/
  // chính sách) — bản chất không cần liên kết chéo.
  const boQua = /dieu-khoan|chinh-sach/i;
  const bad = htmls.filter(h => !boQua.test(h.f)).map(h => {
    const hrefs = [...mainOf(h.src).matchAll(/<a\s[^>]*href=["']([^"']+)["']/gi)].map(m => m[1]);
    const noiBo = new Set(hrefs.filter(u => u.startsWith('/') && u !== '/' ).map(u => u.split(/[?#]/)[0]));
    return { f: h.f, n: noiBo.size };
  }).filter(x => x.n < 2);
  bad.length
    ? add('seo.36-internal-link-density', 'WARN', `${bad.length} trang có <2 link nội bộ trong nội dung chính: ${bad.map(b => `${b.f}(${b.n})`).slice(0, 5).join(', ')} — thêm liên kết chéo tới bài/trang liên quan`)
    : add('seo.36-internal-link-density', 'PASS', 'Mọi trang nội dung có ≥2 link nội bộ trong <main>'); }

// ---------- vn.1-4 — vá khoảng trống giám sát trụ `vn` (0% đường kiểm trước 22/07, xem
// project_luat_v5_khoang_trong_giam_sat_20260722) — chỉ 4/14 tiêu chí đủ tín hiệu tĩnh đáng tin,
// còn lại (#3 xác thực≤24h, #10 CDN hạ tầng) ghi N/A trong REMEDY thay vì ép cổng giả.
const __rootTuSiteConfig = () => { let d = DIR; for (let i = 0; i < 5; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; };
// Nghiệm thu độc lập 22/07 (agent "Ngự Sử") bắt được nhóm lỗi hệ thống: 6 cổng nhóm code/qa chỉ
// regex TOÀN VĂN BẢN, không loại trừ comment (// hoặc #) — dev chỉ cần viết TODO nhắc đúng chuỗi
// khoá là qua cổng dù chưa làm thật. Strip comment CHỈ khi cả dòng là comment (an toàn, không đụng
// "http://" hay code thật có // ở giữa dòng).
const __stripJsLineComments = s => boChuThichChung(s, 'js');
const __stripYamlComments = s => s.replace(/^\s*#.*$/gm, '');

{ // a11y.9-khai-ngon-ngu (khắc 13/09/2026) — ĐIỀN Ổ CẮM LUẬT BỎ TRỐNG, không đẻ tiêu chí mới.
  // Tiêu chí `a11y.9` "Khai báo ngôn ngữ trang" (WCAG 3.1.1) có trong CẢ HAI bộ luật với must:true ·
  // label:AUTO · chi_phi_may_hoa:"rẻ" — tức chính bộ luật đã khai đây là thứ BẮT BUỘC và MÁY ĐO
  // ĐƯỢC — nhưng `cong: null` từ 25/07/2026, khi Ngự Sử bác một mối nối SAI NGHĨA (cổng viewport chỉ
  // kiểm thẻ meta viewport, không kiểm lang) rồi để ổ trống từ đó.
  // BỆNH THẬT đo 13/09: `lang="vi"` và `og:locale:"vi_VN"` ĐÓNG CỨNG trong layout.tsx, còn
  // `siteConfig.market` thì KHÔNG TỆP NÀO đọc — ghi rồi nằm chết. Nên web khai `market:"QT"` với nội
  // dung tiếng Anh vẫn tự nhận là trang tiếng Việt, và cả 132 cổng im lặng. Hại ở hai đầu: Google
  // nhận sai tín hiệu ngôn ngữ · trình đọc màn hình đọc chữ Anh bằng giọng Việt.
  // Chạy WARN trước theo nguyên tắc 6 (CLAUDE.md#11) — cổng mới chưa nâng FAIL ngay.
  const root = __rootTuSiteConfig();
  const cfg = root && existsSync(join(root, 'src/lib/site-config.ts'))
    ? readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8') : '';
  const ngonNgu = (cfg.match(/locales:\s*\[\s*["']([a-zA-Z-]+)["']/)?.[1] ?? 'vi').toLowerCase();
  const goc = (x) => String(x).split('-')[0].toLowerCase();
  if (!htmls.length) {
    add('a11y.9-khai-ngon-ngu', 'PASS', 'Không có .html để kiểm — N/A (--source-only)');
  } else {
    const thieu = [], lech = [];
    for (const h of htmls) {
      const m = h.src.match(/<html[^>]*\blang=["']([^"']+)["']/i);
      if (!m) { thieu.push(h.f.split('/').pop()); continue; }
      if (goc(m[1]) !== goc(ngonNgu)) lech.push(`${h.f.split('/').pop()}: lang="${m[1]}" ≠ locales[0]="${ngonNgu}"`);
    }
    if (thieu.length) add('a11y.9-khai-ngon-ngu', 'WARN', `${thieu.length} trang KHÔNG khai <html lang> (WCAG 3.1.1): ${thieu.slice(0, 4).join(' · ')}`);
    else if (lech.length) add('a11y.9-khai-ngon-ngu', 'WARN', `${lech.length} trang khai lang LỆCH site-config.locales[0]: ${lech.slice(0, 3).join(' · ')} — web tự nhận sai ngôn ngữ`);
    else add('a11y.9-khai-ngon-ngu', 'PASS', `${htmls.length} trang đều khai <html lang="${ngonNgu}"> khớp site-config.locales[0]`);
  }
}

{ // vn.1-chuan-tieng-viet — must:true nhưng theo nguyên tắc 6 (CLAUDE.md#11) chạy WARN trước, chưa
  // nâng FAIL. Chỉ 2 tín hiệu AN TOÀN (không báo oan): charset utf-8 + có dấu tiếng Việt trong nội
  // dung hiển thị. Bỏ kiểm 'đ'/ngày dd-mm-yyyy khỏi cổng này — số tiền/ngày lẫn với số điện thoại/
  // mã đơn hàng quá nhiều dạng, ép regex sẽ báo oan (nguyên tắc 3: thà không cổng còn hơn cổng giả).
  const root = __rootTuSiteConfig();
  const market = root ? (readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8').match(/market:\s*"([^"]+)"/)?.[1] ?? 'VN') : 'VN';
  if (market === 'QT') add('vn.1-chuan-tieng-viet', 'PASS', 'market=QT — N/A (trụ vn chỉ áp VN/ca-hai)');
  else if (!htmls.length) add('vn.1-chuan-tieng-viet', 'PASS', 'Không có .html để kiểm — N/A (--source-only)');
  else {
    const issues = [];
    if (!htmls.every(h => /<meta[^>]+charset=["']?utf-8["']?/i.test(h.src))) issues.push('thiếu <meta charset="utf-8"> ở ≥1 trang');
    const allVisText = htmls.map(h => visText(h.src)).join(' ');
    if (!/[ăâđêôơưÁÀẢÃẠẤẦẨẪẬẮẰẲẴẶÉÈẺẼẸẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌỐỒỔỖỘỚỜỞỠỢÚÙỦŨỤỨỪỬỮỰÝỲỶỸỴ]/i.test(allVisText)) issues.push('không phát hiện dấu tiếng Việt trong nội dung hiển thị — kiểm font/encoding');
    if (/\bmm\/dd\/yyyy\b/i.test(allVisText)) issues.push('còn placeholder ngày kiểu Mỹ "mm/dd/yyyy" (VN dùng dd/mm/yyyy)');
    issues.length ? add('vn.1-chuan-tieng-viet', 'WARN', `${issues.join('; ')} — riêng định dạng tiền 'đ'/ngày dd-mm-yyyy cần kiểm tay (không đủ tín hiệu tĩnh an toàn)`)
      : add('vn.1-chuan-tieng-viet', 'PASS', 'UTF-8 + dấu tiếng Việt ổn (định dạng tiền/ngày vẫn cần kiểm tay)'); }
}

{ // vn.2-form-dia-chi — WARN nếu thấy input tên kiểu Mỹ (state/zip/postal-code) mà KHÔNG thấy dấu
  // hiệu cascade Tỉnh/Quận/Phường VN gần đó trong cùng trang; N/A nếu trang không có form địa chỉ.
  if (!htmls.length) add('vn.2-form-dia-chi', 'PASS', 'Không có .html — N/A (--source-only)');
  else {
    const usPattern = /name=["'](state|zip|postal[_-]?code)["']/i;
    // Nghiệm thu độc lập 22/07 bắt được false-negative: KHÔNG có \b quanh "tinh"/"quan"/... khớp
    // substring bất kỳ — chuỗi "tinhte.vn" (tên miền công nghệ VN phổ biến) trong 1 đoạn văn KHÔNG
    // liên quan tới form địa chỉ vẫn khớp, che giấu vi phạm state/zip thật. Thêm \b quanh MỌI alternative.
    const vnPattern = /\btinh\b|\bquan\b|\bhuyen\b|\bphuong\b|\bxa\b|\bprovince\b|\bdistrict\b|\bward\b/i;
    const bad = htmls.filter(h => usPattern.test(h.src) && !vnPattern.test(h.src));
    bad.length
      ? add('vn.2-form-dia-chi', 'WARN', `${bad.length} trang có input địa chỉ kiểu Mỹ (state/zip) mà không thấy cascade Tỉnh/Quận/Phường: ${bad.map(b => b.f).slice(0, 5).join(', ')}`)
      : add('vn.2-form-dia-chi', 'PASS', 'Không phát hiện form địa chỉ kiểu Mỹ thiếu cascade VN (hoặc không có form địa chỉ nào)'); }
}

{ // vn.3-i18n-ready — chỉ áp khi site-config.ts khai locales.length > 1 (đã có tham vọng đa ngôn
  // ngữ); locales mặc định chỉ ["vi"] → N/A, không ép mọi web 1-ngôn-ngữ phải dùng logical properties.
  const root = __rootTuSiteConfig();
  const locales = root ? ((readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8').match(/locales:\s*\[([^\]]*)\]/)?.[1] ?? '"vi"').split(',').filter(s => s.trim()).length) : 1;
  if (locales <= 1) add('vn.3-i18n-ready', 'PASS', 'locales chỉ có 1 (mặc định "vi") — N/A, chưa có tham vọng đa ngôn ngữ');
  else { const hasLogical = /margin-inline|padding-inline|inset-inline/.test(allCss);
    hasLogical ? add('vn.3-i18n-ready', 'PASS', 'locales>1 và CSS đã dùng logical properties')
      : add('vn.3-i18n-ready', 'WARN', `locales=${locales} (>1) nhưng CSS chưa thấy margin-inline/padding-inline/inset-inline — rà lại trước khi thêm ngôn ngữ mới`); }
}

{ // vn.4-intl-format — WARN nếu thấy nối chuỗi ngày hard-code từ .getDate()/.getMonth()/.getFullYear()
  // hoặc biến day/month/year mà KHÔNG dùng Intl.DateTimeFormat/toLocaleDateString trong cùng file.
  // Regex CHỦ Ý hẹp (đòi .get*()/tên biến ngày-tháng-năm rõ ràng) — tránh báo oan trên mọi template
  // literal nối 3 đoạn có dấu / khác (URL path, breadcrumb...).
  const root = __rootTuSiteConfig();
  if (!root) add('vn.4-intl-format', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const srcDir = join(root, 'src'); const srcFiles = [];
    (function walkSrc(d) { if (!existsSync(d)) return; for (const f of readdirSync(d)) {
      const p = join(d, f); if (f === 'node_modules') continue;
      const s = statSync(p); if (s.isDirectory()) walkSrc(p); else if (/\.(ts|tsx)$/.test(f)) srcFiles.push(p); } })(srcDir);
    const bad = [];
    for (const f of srcFiles) { const s = readFileSync(f, 'utf8');
      const hasHardcode = /\$\{[^}]*\.get(?:Date|Month|FullYear)\(\)[^}]*\}\s*\/\s*\$\{[^}]*\.get(?:Date|Month|FullYear)\(\)[^}]*\}\s*\/\s*\$\{[^}]*\.get(?:Date|Month|FullYear)\(\)[^}]*\}/.test(s)
        || /\$\{\s*(?:day|ngay)\s*\}\s*\/\s*\$\{\s*(?:month|thang)\s*\}\s*\/\s*\$\{\s*(?:year|nam)\s*\}/i.test(s);
      const hasIntl = /Intl\.(?:DateTimeFormat|NumberFormat)|toLocaleDateString|toLocaleString/.test(s);
      if (hasHardcode && !hasIntl) bad.push(f.replace(root + '/', '')); }
    bad.length ? add('vn.4-intl-format', 'WARN', `${bad.length} file có chuỗi nối ngày hard-code mà không dùng Intl API: ${bad.slice(0, 5).join(', ')}`)
      : add('vn.4-intl-format', 'PASS', 'Không tìm thấy hard-code nối ngày đáng ngờ (hoặc đã dùng Intl API)'); }
}

// ---------- ux — vá khoảng trống giám sát trụ `ux` (21 tiêu chí, 0 cổng trước 22/07 dù cùng nhóm
// "chốt Bước 2 AI chọn" với aes/mot/layout/exp — bất thường đã ghi nhận trong checkpoint). #4 typo-
// graphy đã trùng layout.20-measure-percent/mobile.28-input-zoom (không viết lại). #13 hit-target
// dùng chung cổng a11y.26 (đặt tên theo trụ a11y vì gốc từ WCAG 2.5.8). #21 FAQ aria-expanded tách
// cổng riêng ux.21 để không đụng logic FAIL/WARN đã kiểm chứng của aeo.24-faq-schema.
{ // ux.12-micro-states — 6 trạng thái vi mô. "loading" cần aria-busy runtime, không đo được tĩnh —
  // cổng này chỉ kiểm 4/6 trạng thái CSS đo được: hover/focus-visible/active/disabled.
  const need = ['hover', 'focus-visible', 'active', 'disabled'];
  const missing = need.filter(s => !new RegExp(`:${s}\\b`).test(allCss));
  missing.length ? add('ux.12-micro-states', 'WARN', `CSS thiếu pseudo-class: ${missing.join(', ')} — audit design system đủ 4/6 trạng thái đo được tĩnh (loading cần kiểm runtime)`)
    : add('ux.12-micro-states', 'PASS', 'CSS có đủ 4/6 trạng thái vi mô đo được tĩnh (hover/focus-visible/active/disabled)');
}

{ // a11y.26-touch-target — ux #13 + a11y #5 (WCAG 2.5.8 hit target ≥24×24px), dùng CHUNG 1 cổng cho
  // cả 2 trụ. Static CSS không chứng minh được MỌI phần tử ≥24px (padding+content biến thiên) — chỉ
  // bắt vi phạm RÕ: rule nhắm phần tử tương tác khai cứng height/min-height <24px.
  const blocks = [...allCss.matchAll(/([^{}]+)\{([^}]*)\}/g)];
  const isInteractive = sel => /(?:^|[\s,>+~])(button|a|\.btn)(?:[.:\[#]|\s|,|$)/i.test(sel) || /role=["']?button["']?/i.test(sel);
  const bad = [];
  for (const [, sel, body] of blocks) { if (!isInteractive(sel)) continue;
    const m = body.match(/\b(?:min-height|height)\s*:\s*(\d+(?:\.\d+)?)px/);
    if (m && Number(m[1]) < 24) bad.push(`${sel.trim().slice(0, 40)} (${m[1]}px)`); }
  bad.length ? add('a11y.26-touch-target', 'WARN', `${bad.length} rule khai height/min-height <24px trên phần tử tương tác: ${bad.slice(0, 5).join(', ')} — WCAG 2.5.8 khuyến nghị ≥24×24px`)
    : add('a11y.26-touch-target', 'PASS', 'Không thấy rule khai cứng chiều cao <24px trên nút/link (heuristic — chỉ bắt vi phạm rõ, không chứng minh MỌI phần tử)');
}

{ // ux.16-hero-no-autoplay — Hero cấm carousel tự chạy (RECIPE 06 §1). Soi các file .tsx/.jsx có
  // "hero" trong tên tìm dấu hiệu autoplay (thư viện embla/swiper Autoplay hoặc setInterval tự đổi slide).
  const root = __rootTuSiteConfig();
  if (!root) add('ux.16-hero-no-autoplay', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const srcDir = join(root, 'src'); const srcFiles = [];
    (function walkSrc(d) { if (!existsSync(d)) return; for (const f of readdirSync(d)) {
      const p = join(d, f); if (f === 'node_modules') continue;
      const s = statSync(p); if (s.isDirectory()) walkSrc(p); else if (/\.(tsx|jsx)$/.test(f)) srcFiles.push(p); } })(srcDir);
    const heroFiles = srcFiles.filter(f => /hero/i.test(f));
    const bad = heroFiles.filter(f => { const s = readFileSync(f, 'utf8');
      return /Autoplay\s*\(|autoplay\s*:\s*\{|autoPlay\s*=\s*\{?\s*true|setInterval\s*\([^)]*\)[\s\S]{0,80}(?:setSlide|setIndex|setActive|next\(\))/i.test(s); });
    bad.length ? add('ux.16-hero-no-autoplay', 'WARN', `${bad.length} file Hero có dấu hiệu carousel tự chạy: ${bad.map(f => f.replace(root + '/', '')).join(', ')} — cấm autoplay ở Hero (rubric ux#16)`)
      : (heroFiles.length ? add('ux.16-hero-no-autoplay', 'PASS', 'Hero không thấy dấu hiệu autoplay carousel') : add('ux.16-hero-no-autoplay', 'PASS', 'Không tìm thấy file Hero — N/A')); }
}

{ // ux.17-card-no-nested-link — <a> lồng <a> vi phạm HTML spec + gây click mơ hồ. Cổng MỚI chạy WARN
  // trước (nguyên tắc 6), dù đây là lỗi HTML thật. PHẢI bỏ <script>/<style> trước khi soi — chuỗi
  // "<a" xuất hiện tình cờ trong JS bundle minify (vd biến "a" trong code hydration React) từng gây
  // báo oan 4/4 trang template (đối chứng bắt được lỗi này trước khi commit).
  // Nghiệm thu độc lập 22/07 bắt ReDoS THẬT trong regex ban đầu /<a\b[^>]*>(?:(?!<\/a>)[\s\S])*?<a\b/:
  // file có hàng chục nghìn lần "<a " KHÔNG đóng ">" khiến [^>]* phải quét lại từ mỗi vị trí → O(n²)
  // (đo được 49s trên file 300KB dạng lỗi này, đủ chạm hard-timeout 90s của toàn máy kiểm). Đổi sang
  // quét tuyến tính bằng 1 regex KHÔNG lồng quantifier (đếm độ sâu mở/đóng <a>), an toàn O(n).
  if (!htmls.length) add('ux.17-card-no-nested-link', 'PASS', 'Không có .html — N/A (--source-only)');
  else { const stripScriptStyle = h => h.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    const hasNestedA = s => { let depth = 0; const tagRe = /<\/?a\b[^>]*>/gi; let m;
      while ((m = tagRe.exec(s))) { if (m[0][1] === '/') { if (depth > 0) depth--; }
        else { if (depth > 0) return true; depth++; } }
      return false; };
    const bad = htmls.filter(h => hasNestedA(stripScriptStyle(h.src)));
    bad.length ? add('ux.17-card-no-nested-link', 'WARN', `${bad.length} trang có <a> lồng <a>: ${bad.map(b => b.f).slice(0, 5).join(', ')} — vi phạm HTML spec, gây click mơ hồ`)
      : add('ux.17-card-no-nested-link', 'PASS', 'Không phát hiện <a> lồng <a>'); }
}

{ // ux.18-nav-limit — nav chính ≤7 mục trực tiếp + mục đang đứng có aria-current="page".
  // Nghiệm thu độc lập 22/07 bắt bỏ lọt hàng loạt: .match() không global chỉ lấy <nav> ĐẦU TIÊN,
  // trong khi kiến trúc nav responsive phổ biến NHẤT có ≥2 <nav> (desktop + mobile hamburger) —
  // nav mobile vi phạm >7 link không hề bị bắt. Đổi sang matchAll duyệt hết MỌI khối <nav>.
  if (!htmls.length) add('ux.18-nav-limit', 'PASS', 'Không có .html — N/A (--source-only)');
  else { const navBlocks = htmls.flatMap(h => [...h.src.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi)].map(m => m[0]));
    if (!navBlocks.length) add('ux.18-nav-limit', 'PASS', 'Không tìm thấy <nav> — N/A');
    else { const issues = [];
      const over = navBlocks.filter(n => (n.match(/<a\b/gi) || []).length > 7);
      if (over.length) issues.push(`${over.length} khối <nav> có >7 link trực tiếp`);
      if (!htmls.some(h => /aria-current=["']page["']/i.test(h.src))) issues.push('không thấy aria-current="page" ở bất kỳ trang nào');
      issues.length ? add('ux.18-nav-limit', 'WARN', issues.join('; ')) : add('ux.18-nav-limit', 'PASS', 'Nav chính ≤7 mục và có aria-current="page"'); } }
}

{ // ux.19-footer-groups — footer tối đa 3-4 nhóm link (không 'bãi link' SEO). Đếm nhóm bằng heading
  // con (h2-h4/strong) trong <footer>. Thông tin pháp nhân là tiêu chí CORE (Ông duyệt nội dung, xem
  // vn item#2) — KHÔNG kiểm lại ở đây, tránh trùng lặp cổng.
  if (!htmls.length) add('ux.19-footer-groups', 'PASS', 'Không có .html — N/A (--source-only)');
  else { const footers = htmls.map(h => (h.src.match(/<footer\b[^>]*>[\s\S]*?<\/footer>/i) || [null])[0]).filter(Boolean);
    if (!footers.length) add('ux.19-footer-groups', 'PASS', 'Không tìm thấy <footer> — N/A');
    else { const bad = footers.filter(f => (f.match(/<h[2-4]\b|<strong\b/gi) || []).length > 4);
      bad.length ? add('ux.19-footer-groups', 'WARN', `${bad.length} footer có >4 nhóm (heading con) — gộp lại tối đa 3-4 nhóm, tránh 'bãi link' SEO`)
        : add('ux.19-footer-groups', 'PASS', 'Footer ≤4 nhóm link'); } }
}

{ // ux.21-faq-aria-expanded — mở rộng ý #21 (FAQ/Accordion) cạnh aeo.24-faq-schema: khi trang có
  // FAQPage schema, UI accordion phải dùng <button aria-expanded> đúng chuẩn.
  if (!htmls.length) add('ux.21-faq-aria-expanded', 'PASS', 'Không có .html — N/A (--source-only)');
  else { const faqPages = htmls.filter(h => h.src.includes('"@type":"FAQPage"') || h.src.includes('"@type": "FAQPage"'));
    if (!faqPages.length) add('ux.21-faq-aria-expanded', 'PASS', 'Không có trang FAQPage schema — N/A');
    else { const bad = faqPages.filter(h => !/aria-expanded=["'](?:true|false)["']/i.test(h.src));
      bad.length ? add('ux.21-faq-aria-expanded', 'WARN', `${bad.length} trang có FAQPage schema nhưng UI accordion không thấy aria-expanded: ${bad.map(b => b.f).slice(0, 5).join(', ')}`)
        : add('ux.21-faq-aria-expanded', 'PASS', 'Trang FAQ có aria-expanded trên accordion'); } }
}

// ---------- code/green/ethics/ops/qa — vá khoảng trống giám sát nhóm 3 (38 tiêu chí, nhóm 3/3 kế
// hoạch project_luat_v5_khoang_trong_giam_sat_20260722). Khác nhóm 1/2: đây là các trụ mà artifact
// dự án từng khẳng định "đã sẵn 0 token trong 05-TEMPLATE-CHUAN" (ESLint jsx-a11y, CI npm audit,
// Playwright...) nhưng CHƯA có cổng máy TÁI XÁC NHẬN cơ chế đó còn nguyên vẹn sau khi 1 web cụ thể
// tuỳ biến archetype (rủi ro tự ghi nhận: lỡ tay xoá/ghi đè). Phần lớn 38 tiêu chí gốc là hạ tầng/
// dịch vụ ngoài (W3C validator, UptimeRobot, k6, websitecarbon.com...) không đo được qua đọc source
// tĩnh — chỉ viết cổng cho phần khả thi thật (nguyên tắc 3).

{ // code.1-manifest-guard — code#5 (favicon/manifest/PWA). Favicon riêng đã có media.1-image, cổng
  // này CHỈ kiểm public/manifest.json tồn tại + không còn placeholder + được khai trong metadata.
  const root = __rootTuSiteConfig();
  const manifestPath = root ? join(root, 'public/manifest.json') : null;
  if (!manifestPath || !existsSync(manifestPath)) add('code.1-manifest-guard', 'WARN', 'Không tìm thấy public/manifest.json');
  else { const m = readFileSync(manifestPath, 'utf8');
    const layoutPath = join(root, 'src/app/layout.tsx');
    const wired = existsSync(layoutPath) && /manifest:\s*["']\/manifest\.json["']/.test(readFileSync(layoutPath, 'utf8'));
    if (m.includes('[[CẦN-DỮ-KIỆN]]')) add('code.1-manifest-guard', 'WARN', 'manifest.json còn placeholder [[CẦN-DỮ-KIỆN]] — điền tên/mô tả PWA thật trước bàn giao');
    else if (!wired) add('code.1-manifest-guard', 'WARN', 'manifest.json tồn tại nhưng layout.tsx không khai manifest: "/manifest.json"');
    else add('code.1-manifest-guard', 'PASS', 'manifest.json đầy đủ + đã khai trong metadata'); }
}

{ // code.2-error-monitor-guard — code#6 (giám sát lỗi, must:true). Kiểm src/lib/error-reporter.ts
  // (hoặc @sentry/* thật) tồn tại và ĐƯỢC GỌI từ error.tsx/global-error.tsx.
  const root = __rootTuSiteConfig();
  if (!root) add('code.2-error-monitor-guard', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const reporterPath = join(root, 'src/lib/error-reporter.ts');
    const pkg = existsSync(join(root, 'package.json')) ? readFileSync(join(root, 'package.json'), 'utf8') : '';
    const hasSentryPkg = /@sentry\//.test(pkg);
    const hasReporter = existsSync(reporterPath);
    if (!hasReporter && !hasSentryPkg) add('code.2-error-monitor-guard', 'WARN', 'Không thấy src/lib/error-reporter.ts hoặc @sentry/* — chưa có giám sát lỗi');
    else { const errorTsx = join(root, 'src/app/error.tsx'), globalErrorTsx = join(root, 'src/app/global-error.tsx');
      // Nghiệm thu độc lập 22/07: strip comment trước khi test — trước đó 1 dòng "// TODO: call
      // reportError(e) here later" đủ để qua cổng dù chưa gọi thật.
      const called = [errorTsx, globalErrorTsx].some(p => existsSync(p) && /reportError\s*\(|Sentry\.captureException/.test(__stripJsLineComments(readFileSync(p, 'utf8'))));
      called ? add('code.2-error-monitor-guard', 'PASS', 'error-reporter/Sentry được gọi từ error.tsx/global-error.tsx')
        : add('code.2-error-monitor-guard', 'WARN', 'Có error-reporter/Sentry nhưng KHÔNG thấy gọi từ error.tsx/global-error.tsx — kiểm có bị xoá lúc tuỳ biến không'); } }
}

{ // code.3-ci-pipeline-guard — code#8 (CI/CD). Kiểm .github/workflows/ci.yml còn đủ step chính
  // (tsc, ESLint, npm audit, Build, E2E) — phòng lỗi lỡ xoá step lúc tuỳ biến archetype.
  const root = __rootTuSiteConfig();
  const ciPath = root ? join(root, '.github/workflows/ci.yml') : null;
  if (!ciPath || !existsSync(ciPath)) add('code.3-ci-pipeline-guard', 'WARN', 'Không tìm thấy .github/workflows/ci.yml');
  else { const ci = __stripYamlComments(readFileSync(ciPath, 'utf8')); // strip # — nghiệm thu độc lập bắt được comment liệt kê tên step chưa chạy thật vẫn qua cổng
    const need = [['tsc --noEmit', /tsc\s+--noEmit/], ['ESLint', /npm run lint/], ['npm audit', /npm audit/], ['Build', /npm run build/], ['E2E', /test:e2e|playwright test/]];
    const missing = need.filter(([, re]) => !re.test(ci)).map(([n]) => n);
    missing.length ? add('code.3-ci-pipeline-guard', 'WARN', `ci.yml thiếu step: ${missing.join(', ')}`)
      : add('code.3-ci-pipeline-guard', 'PASS', 'ci.yml còn đủ step chính (tsc/ESLint/audit/build/E2E)'); }
}

{ // code.4-custom-error-pages — code#9 (trang lỗi 404/500 tuỳ biến đúng bản sắc). Kiểm not-found.tsx
  // + error.tsx/global-error.tsx tồn tại và có nhắc SITE_NAME/nút quay lại (không phải trang trắng mặc định).
  const root = __rootTuSiteConfig();
  if (!root) add('code.4-custom-error-pages', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const paths = ['src/app/not-found.tsx', 'src/app/error.tsx', 'src/app/global-error.tsx'].map(p => join(root, p));
    const missing = paths.filter(p => !existsSync(p));
    if (missing.length) add('code.4-custom-error-pages', 'WARN', `Thiếu file: ${missing.map(p => p.replace(root + '/', '')).join(', ')}`);
    else { // "tuỳ biến" = có SITE_NAME/Link về trang chủ HOẶC màu brand hex cứng HOẶC gọi reportError
      // (global-error.tsx đúng chuẩn Next.js KHÔNG dùng Link vì root layout đã hỏng — chỉ inline
      // style/reset() — ép đòi SITE_NAME/Link ở đây từng báo oan trên chính template lúc viết cổng).
      const bland = paths.filter(p => !/SITE_NAME|Link\s+href|#[0-9a-fA-F]{3,6}|reportError\s*\(/.test(readFileSync(p, 'utf8')));
      bland.length ? add('code.4-custom-error-pages', 'WARN', `${bland.map(p => p.replace(root + '/', '')).join(', ')} có vẻ chưa tuỳ biến bản sắc (không thấy SITE_NAME/Link/màu brand/reportError)`)
        : add('code.4-custom-error-pages', 'PASS', 'not-found/error/global-error đều tồn tại và có tuỳ biến bản sắc'); } }
}

{ // green.1-page-weight-budget — green#2 (must:true). csss[]/htmls quét được qua .kiem-snapshot
  // KHÔNG chứa JS chunk thật (F1, xem đầu file) — đo trực tiếp .next/static (độc lập DIR truyền
  // vào, cần build thật) thay vì đo qua allCss/htmls.
  const root = __rootTuSiteConfig();
  const staticDir = root ? join(root, '.next/static') : null;
  // FAIL-OPEN đã vá 05/09/2026: nhánh này trước đây trả PASS cho MỌI trường hợp thiếu
  // .next/static. Hệ quả thật: mẫu đối chứng `fail` mất tệp .next (lỗi thứ tự .gitignore —
  // ngoại lệ đặt TRƯỚC dòng chặn nên bị ghi đè) và được chấm PASS suốt từ 26/07/2026;
  // regression-luat báo 'fail→PASS [SAI]' mà không ai chạy để thấy. Nay chỉ N/A khi CỐ Ý chạy
  // --source-only; chạy đầy đủ mà thiếu build là KHÔNG ĐO ĐƯỢC — phải có tiếng, không im lặng.
  if (!staticDir || !existsSync(staticDir)) add('green.1-page-weight-budget', SOURCE_ONLY ? 'PASS' : 'WARN', SOURCE_ONLY ? 'Không có .next/static (--source-only) — N/A đúng chế độ' : 'Không có .next/static — CHƯA ĐO ĐƯỢC cân nặng trang; build rồi chạy lại, KHÔNG kết luận là đạt');
  else { let totalJs = 0, totalCss = 0;
    (function walkStatic(d) { for (const f of readdirSync(d)) { const p = join(d, f); const s = statSync(p);
      if (s.isDirectory()) walkStatic(p); else if (f.endsWith('.js')) totalJs += s.size; else if (f.endsWith('.css')) totalCss += s.size; } })(staticDir);
    const jsKB = Math.round(totalJs / 1024), cssKB = Math.round(totalCss / 1024);
    // Ngưỡng 300KB RAW (chưa gzip) — REMEDY gốc ghi ≤200KB NÉN; disk size luôn lớn hơn gzip nên nới
    // ngưỡng, ghi rõ caveat trong message để không hiểu nhầm là số đo chính xác kiểu Lighthouse.
    jsKB > 300 ? add('green.1-page-weight-budget', 'WARN', `.next/static: JS ${jsKB}KB (raw, chưa gzip) + CSS ${cssKB}KB — vượt ngưỡng tham khảo 300KB raw (≈200KB gzip), rà bundle/code-split; đo chính xác bằng Lighthouse`)
      : add('green.1-page-weight-budget', 'PASS', `.next/static: JS ${jsKB}KB · CSS ${cssKB}KB (raw) — trong ngân sách tham khảo`); }
}

{ // green.2-reduced-data — green#5 (must:false). WARN nhẹ, hỗ trợ trình duyệt còn hạn chế nên không bắt buộc.
  /prefers-reduced-data/.test(allCss) ? add('green.2-reduced-data', 'PASS', 'CSS có prefers-reduced-data')
    : add('green.2-reduced-data', 'WARN', 'CSS chưa có prefers-reduced-data — cân nhắc giảm media cho người dùng bật tiết kiệm dữ liệu (hỗ trợ trình duyệt còn hạn chế, không bắt buộc)');
}

{ // ethics.1-no-app-lock — ethics#7 (must:true). Grep nguồn tìm pattern smart-app-banner/interstitial ép cài app.
  const root = __rootTuSiteConfig();
  if (!root) add('ethics.1-no-app-lock', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const srcDir = join(root, 'src'); const srcFiles = [];
    (function walkSrc(d) { if (!existsSync(d)) return; for (const f of readdirSync(d)) {
      const p = join(d, f); if (f === 'node_modules') continue;
      const s = statSync(p); if (s.isDirectory()) walkSrc(p); else if (/\.(tsx|jsx|ts)$/.test(f)) srcFiles.push(p); } })(srcDir);
    const bad = srcFiles.filter(f => /smart-?app-?banner|AppInstallBanner|SmartAppBanner|app-install-interstitial/i.test(readFileSync(f, 'utf8')));
    bad.length ? add('ethics.1-no-app-lock', 'WARN', `${bad.length} file có dấu hiệu banner/interstitial ép cài app: ${bad.map(f => f.replace(root + '/', '')).join(', ')} — web phải dùng đầy đủ không cần cài app (ethics#7)`)
      : add('ethics.1-no-app-lock', 'PASS', 'Không phát hiện pattern ép cài app/interstitial chặn nội dung'); }
}

{ // ethics.2-no-preselected-consent — ethics#2 (đồng thuận trung thực). Tách cổng RIÊNG thay vì sửa
  // priv.28-consent-gate đã kiểm chứng (v5.13 từng vá lỗi thật ở đó) — an toàn hơn, tránh hồi quy.
  if (!htmls.length) add('ethics.2-no-preselected-consent', 'PASS', 'Không có .html — N/A (--source-only)');
  else { const bad = htmls.filter(h => /<input[^>]*type=["']checkbox["'][^>]*(?:consent|marketing|tracking|newsletter)[^>]*\schecked\b/i.test(h.src)
      || /<input[^>]*\schecked\b[^>]*(?:consent|marketing|tracking|newsletter)/i.test(h.src));
    bad.length ? add('ethics.2-no-preselected-consent', 'WARN', `${bad.length} trang có checkbox consent/marketing checked mặc định: ${bad.map(b => b.f).slice(0, 5).join(', ')} — vi phạm "im lặng ≠ đồng ý"`)
      : add('ethics.2-no-preselected-consent', 'PASS', 'Không phát hiện checkbox consent tích sẵn'); }
}

{ // ops.1-observability-guard — ops#5 (logging/RUM). Tín hiệu error-reporter/Sentry (code.2) HOẶC
  // Vercel Analytics/Speed Insights wiring trong package.json.
  const root = __rootTuSiteConfig();
  if (!root) add('ops.1-observability-guard', 'PASS', 'Không có site-config.ts nguồn — N/A');
  else { const pkg = existsSync(join(root, 'package.json')) ? readFileSync(join(root, 'package.json'), 'utf8') : '';
    const hasVercelAnalytics = /@vercel\/analytics|@vercel\/speed-insights/.test(pkg);
    const hasErrorReporter = existsSync(join(root, 'src/lib/error-reporter.ts')) || /@sentry\//.test(pkg);
    (hasVercelAnalytics || hasErrorReporter)
      ? add('ops.1-observability-guard', 'PASS', `Có tín hiệu observability: ${[hasVercelAnalytics && 'Vercel Analytics/Speed Insights', hasErrorReporter && 'error-reporter/Sentry'].filter(Boolean).join(' + ')}`)
      : add('ops.1-observability-guard', 'WARN', 'Không thấy Vercel Analytics/Speed Insights lẫn error-reporter/Sentry — chưa có observability cơ bản'); }
}

{ // ops.2-handoff-doc-guard — ops#6 (tài liệu bàn giao). README.md phải tồn tại và KHÔNG còn nguyên
  // boilerplate create-next-app mặc định.
  const root = __rootTuSiteConfig();
  const readmePath = root ? join(root, 'README.md') : null;
  if (!readmePath || !existsSync(readmePath)) add('ops.2-handoff-doc-guard', 'WARN', 'Không tìm thấy README.md');
  else { const s = readFileSync(readmePath, 'utf8');
    // Nghiệm thu độc lập 22/07: điều kiện length<2000 dễ bị "đệm chữ" (thêm filler text) để bypass
    // mà không viết nội dung thật. Đổi sang: còn câu boilerplate GỐC + KHÔNG có tín hiệu nội dung
    // bàn giao thật (kiến trúc/deploy/runbook/env) mới coi là chưa tuỳ biến.
    const hasBoilerplateSentence = /bootstrapped with \[`create-next-app`\]/.test(s);
    // "deploy" KHÔNG dùng làm tín hiệu — boilerplate create-next-app gốc đã có sẵn mục
    // "## Deploy on Vercel", dùng từ này sẽ PASS giả ngay trên README chưa tuỳ biến gì (bắt được
    // khi hồi quy .kiem-snapshot template đổi verdict WARN→PASS ngay sau khi thêm "deploy").
    const hasHandoffSignal = /runbook|rollback|kiến trúc|architecture|env(?:ironment)?\s*variable/i.test(s);
    const isBoilerplate = hasBoilerplateSentence && !hasHandoffSignal;
    isBoilerplate ? add('ops.2-handoff-doc-guard', 'WARN', 'README.md còn nguyên boilerplate create-next-app — viết tài liệu bàn giao thật (kiến trúc, env, runbook deploy/rollback)')
      : add('ops.2-handoff-doc-guard', 'PASS', 'README.md đã tuỳ biến (không còn boilerplate mặc định)'); }
}

{ // qa.1-e2e-coverage-guard — qa#2 (E2E luồng nghiệp vụ then chốt). e2e/ có spec phủ luồng form/liên hệ.
  const root = __rootTuSiteConfig();
  const e2eDir = root ? join(root, 'e2e') : null;
  if (!e2eDir || !existsSync(e2eDir)) add('qa.1-e2e-coverage-guard', 'WARN', 'Không tìm thấy thư mục e2e/');
  else { const specs = readdirSync(e2eDir).filter(f => /\.spec\.ts$/.test(f));
    // Nghiệm thu độc lập 22/07: chỉ xét TÊN FILE, file rỗng vẫn PASS. Thêm điều kiện nội dung thật
    // (có test()/it() sau khi strip comment) để loại spec rỗng/chỉ có TODO.
    const formSpecs = specs.filter(f => /form|contact|checkout|dang-ky/i.test(f)
      && /\b(?:test|it)\s*\(/.test(__stripJsLineComments(readFileSync(join(e2eDir, f), 'utf8'))));
    formSpecs.length ? add('qa.1-e2e-coverage-guard', 'PASS', `E2E có spec phủ luồng form/liên hệ: ${formSpecs.join(', ')}`)
      : add('qa.1-e2e-coverage-guard', 'WARN', `e2e/ có ${specs.length} spec nhưng không thấy spec NÀO (có nội dung thật) phủ luồng form/liên hệ/checkout`); }
}

{ // qa.2-cross-browser-guard — qa#3 (ma trận cross-browser). playwright.config.ts cần ≥2 project
  // browser + có project mobile viewport.
  const root = __rootTuSiteConfig();
  const cfgPath = root ? join(root, 'playwright.config.ts') : null;
  if (!cfgPath || !existsSync(cfgPath)) add('qa.2-cross-browser-guard', 'WARN', 'Không tìm thấy playwright.config.ts');
  else { const s = readFileSync(cfgPath, 'utf8');
    const projectsBlock = (s.match(/projects:\s*\[([\s\S]*?)\n\s*\]/) || [, ''])[1];
    const projectCount = (projectsBlock.match(/name:\s*["'][\w-]+["']/g) || []).length;
    const hasMobile = /devices\[["'][^"']*(?:Pixel|iPhone|Mobile)[^"']*["']\]/.test(projectsBlock);
    (projectCount >= 2 && hasMobile)
      ? add('qa.2-cross-browser-guard', 'PASS', `${projectCount} project + có viewport mobile`)
      : add('qa.2-cross-browser-guard', 'WARN', `playwright.config.ts có ${projectCount} project, mobile viewport=${hasMobile ? 'có' : 'KHÔNG'} — cần ≥2 browser + ≥1 mobile`); }
}

{ // qa.3-axe-ci-guard — qa#4 (axe-core trong CI). e2e/a11y.spec.ts tồn tại + gọi axe.
  const root = __rootTuSiteConfig();
  const a11yPath = root ? join(root, 'e2e/a11y.spec.ts') : null;
  if (!a11yPath || !existsSync(a11yPath)) add('qa.3-axe-ci-guard', 'WARN', 'Không tìm thấy e2e/a11y.spec.ts');
  else { const s = __stripJsLineComments(readFileSync(a11yPath, 'utf8')); // strip comment — nghiệm thu độc lập bắt được comment-only vẫn qua cổng
    (/AxeBuilder|axe-core|@axe-core/.test(s) && /\b(?:test|it)\s*\(/.test(s) && s.trim().length > 100)
      ? add('qa.3-axe-ci-guard', 'PASS', 'e2e/a11y.spec.ts có gọi axe-core')
      : add('qa.3-axe-ci-guard', 'WARN', 'e2e/a11y.spec.ts tồn tại nhưng không thấy gọi axe-core (hoặc file rỗng) — kiểm có bị xoá nội dung lúc tuỳ biến không'); }
}

{ // qa.4-console-error-guard — qa#6 (không console error production). Cần ≥1 spec Playwright lắng
  // nghe page.on('console', ...).
  const root = __rootTuSiteConfig();
  const e2eDir = root ? join(root, 'e2e') : null;
  if (!e2eDir || !existsSync(e2eDir)) add('qa.4-console-error-guard', 'WARN', 'Không tìm thấy thư mục e2e/');
  else { const specs = readdirSync(e2eDir).filter(f => /\.spec\.ts$/.test(f));
    // strip comment — nghiệm thu độc lập bắt được comment nhắc page.on('console'...) vẫn qua cổng dù không gọi thật
    const hit = specs.some(f => /page\.on\(\s*["']console["']/.test(__stripJsLineComments(readFileSync(join(e2eDir, f), 'utf8'))));
    hit ? add('qa.4-console-error-guard', 'PASS', 'Có spec Playwright bắt console error')
      : add('qa.4-console-error-guard', 'WARN', 'Không thấy spec nào page.on("console", ...) — thêm kiểm tra console error vào E2E'); }
}

{ // qa.5-smoke-test-guard — qa#7 (smoke test sau deploy). scripts/smoke.mjs tồn tại + không rỗng.
  const root = __rootTuSiteConfig();
  const smokePath = root ? join(root, 'scripts/smoke.mjs') : null;
  // strip comment trước khi đo độ dài — nghiệm thu độc lập bắt được 1 dòng comment TODO >50 ký tự vẫn qua cổng
  (smokePath && existsSync(smokePath) && __stripJsLineComments(readFileSync(smokePath, 'utf8')).trim().length > 50)
    ? add('qa.5-smoke-test-guard', 'PASS', 'scripts/smoke.mjs tồn tại và có nội dung')
    : add('qa.5-smoke-test-guard', 'WARN', 'Không tìm thấy scripts/smoke.mjs (hoặc rỗng) — cần smoke test tự động sau deploy');
}

{ // qa.6-lighthouse-ci-guard — qa#10 (Lighthouse CI budget). ci.yml còn step Lighthouse CI + budgetPath.
  const root = __rootTuSiteConfig();
  const ciPath = root ? join(root, '.github/workflows/ci.yml') : null;
  if (!ciPath || !existsSync(ciPath)) add('qa.6-lighthouse-ci-guard', 'WARN', 'Không tìm thấy .github/workflows/ci.yml');
  else { const s = __stripYamlComments(readFileSync(ciPath, 'utf8')); // strip # — nghiệm thu độc lập bắt được comment "đã cân nhắc nhưng không dùng" vẫn qua cổng
    (/Lighthouse CI/.test(s) && /budgetPath/.test(s))
      ? add('qa.6-lighthouse-ci-guard', 'PASS', 'ci.yml có step Lighthouse CI với budgetPath')
      : add('qa.6-lighthouse-ci-guard', 'WARN', 'ci.yml thiếu step Lighthouse CI hoặc budgetPath — hiệu năng không được chặn hồi quy tự động'); }
}

{ // qa.11-check-luat-in-ci — qa#11 (chạy check-luat.mjs trong CI trước bàn giao).
  const root = __rootTuSiteConfig();
  const ciPath = root ? join(root, '.github/workflows/ci.yml') : null;
  if (!ciPath || !existsSync(ciPath)) add('qa.11-check-luat-in-ci', 'WARN', 'Không tìm thấy .github/workflows/ci.yml');
  else { /npm run check:luat/.test(__stripYamlComments(readFileSync(ciPath, 'utf8'))) // strip # — nghiệm thu độc lập bắt được comment "removed: npm run check:luat" vẫn qua cổng
      ? add('qa.11-check-luat-in-ci', 'PASS', 'ci.yml có step chạy npm run check:luat trước bàn giao')
      : add('qa.11-check-luat-in-ci', 'WARN', 'ci.yml KHÔNG thấy step "npm run check:luat" — thêm vào pipeline Build trước Lighthouse'); }
}

{ // aeo.11: answer tự-đủ-nghĩa — cấm mở đầu bằng đại từ mơ hồ (mất nghĩa khi LLM trích rời ngữ cảnh).
  // 20260728: dùng chung bộ đọc `__docFAQ()` với aeo.12 — đọc FAQ web THẬT SỰ phát ra (khối FAQPage
  // trong HTML build), `qa-data.ts` chỉ còn là nguồn dự phòng. Xem chú thích đầy đủ ở khối aeo.12.
  const faq = __docFAQ();
  if (!faq.cap.length) {
    faq.mayKhongDocNoi
      ? add('aeo.11-selfcontained', 'WARN', `MÁY KHÔNG ĐỌC NỔI FAQ của web này — web CÓ khai FAQ (${faq.lyDo.join(' · ')}) nhưng rút được 0 cặp Q&A ⇒ cổng CHƯA soi câu nào, đừng đọc thành "web sạch".`)
      : add('aeo.11-selfcontained', 'PASS', 'N/A — web KHÔNG khai FAQ ở đâu cả (đã soi: khối FAQPage trong HTML build · qa-data.ts · tệp nguồn tên *faq*)');
  }
  else {
    const answers = faq.cap.map(c => c.a);
    const vagueStart = /^(Đây|Nó|Điều này|Đó|Cái này)\b/i;
    const bad = answers.filter(a => vagueStart.test(a.trim()));
    bad.length
      ? add('aeo.11-selfcontained', 'WARN', `${bad.length}/${answers.length} answer mở đầu bằng đại từ mơ hồ ("Đây/Nó/Điều này"...) — LLM trích rời ngữ cảnh sẽ mất nghĩa, viết lại có chủ ngữ rõ. Nguồn: ${faq.nguon}`)
      : add('aeo.11-selfcontained', 'PASS', `${answers.length} answer đều tự-đủ-nghĩa — nguồn: ${faq.nguon}`); } }

{ // intl.5: cấm class Tailwind vật lý (ml-/mr-/text-left/text-right) tái nhiễm — dùng logical (ms-/me-)
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app'))) return d; d = join(d, '..'); } return null; })();
  const srcFiles2 = root ? (() => { try { return readdirSync(join(root, 'src'), { recursive: true }).filter(f => f.endsWith('.tsx')).map(f => ({ f, s: readFileSync(join(root, 'src', f), 'utf8') })); } catch { return []; } })() : [];
  const physicalRe = /\bclassName="[^"]*\b(ml-|mr-|pl-|pr-|text-left|text-right)\d?/;
  const bad = srcFiles2.filter(({ s }) => physicalRe.test(s));
  !root
    ? add('intl.5-logical', 'WARN', 'Không tìm thấy thư mục src/ để kiểm')
    : bad.length
      ? add('intl.5-logical', 'WARN', `${bad.length} file dùng class vật lý (ml-/mr-/pl-/pr-/text-left/text-right) — đổi sang ms-/me-/ps-/pe- để tự đảo RTL`)
      : add('intl.5-logical', 'PASS', 'Không dùng class Tailwind vật lý — sẵn sàng RTL'); }

// ── Batch Đợt 4 (20260707): chống AI-slop content ───────────────────────────
{ // content.14: cấm cụm mở đầu sáo rỗng kiểu AI-generic trong content.ts/qa-data.ts/archetype-data.ts
  // F38 (LÔ 5 nhóm A, 20260713): mở rộng thêm archetype-data.ts — 4/5 archetype dùng file này làm
  // nguồn nội dung trang chủ thật, trước đây cổng này MÙ hoàn toàn với nó (phát hiện nghiêm trọng).
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/content.ts')) || existsSync(join(d, 'src/lib/archetype-data.ts'))) return d; d = join(d, '..'); } return null; })();
  const SLOP = [
    /Trong (thế giới|thời đại) (hiện đại|ngày nay|số hoá)/i,
    /Không thể phủ nhận rằng/i,
    /Với sự phát triển (không ngừng )?của/i,
    /Như chúng ta đã biết/i,
    /Trong bối cảnh (hiện nay|ngày nay)/i,
    /Có thể nói rằng/i,
    /Đóng vai trò (quan trọng|then chốt|thiết yếu) trong việc/i,
    // -- F41 20260713: mở rộng ngân hàng cụm sáo rỗng AI (VI + EN) --
    /Hãy cùng (khám phá|tìm hiểu)/i,
    /Không chỉ .{0,30}mà còn/i,
    /Một trong những (yếu tố|điều|lý do) quan trọng nhất/i,
    /Tóm lại,? (có thể thấy|chúng ta thấy)/i,
    /Nói (một cách khác|cách khác)/i,
    /Chính vì (vậy|thế|lẽ đó)/i,
    /Trở thành (một trong những|lựa chọn hàng đầu)/i,
    /Mang lại (những )?trải nghiệm (tuyệt vời|khó quên|đáng nhớ)/i,
    /Là (điểm đến|lựa chọn) (lý tưởng|hoàn hảo)/i,
    /in today'?s (fast-paced|digital|modern) world/i,
    /it'?s (important|worth noting|essential) to/i,
    /unlock (the|your) (potential|full potential)/i,
    /a testament to/i,
    /whether you'?re .{0,30}or/i,
    /at the end of the day/i,
    /dive (deep )?into/i,
    /game[- ]changer/i,
  ];
  if (!root) { add('content.14-aislop', 'WARN', 'Không tìm thấy content.ts/archetype-data.ts để kiểm'); }
  else {
    const files = ['src/lib/content.ts', 'src/lib/qa-data.ts', 'src/lib/archetype-data.ts'].map(f => join(root, f)).filter(existsSync);
    const hits = [];
    for (const f of files) { const s = readFileSync(f, 'utf8');
      for (const re of SLOP) { const m = s.match(re); if (m) hits.push(`${f.split('/').pop()}: "${m[0]}"`); } }
    hits.length
      ? add('content.14-aislop', 'WARN', `${hits.length} cụm mở đầu sáo rỗng kiểu AI-generic: ${hits.slice(0,5).join(' | ')} — viết lại cụ thể, có dữ kiện thật`)
      : add('content.14-aislop', 'PASS', 'Không thấy cụm mở đầu sáo rỗng AI-generic thường gặp'); } }

{ // content.3-suthat-kiemchung (Phase 2, 08/07/2026) — mỗi suThatThuongHieu[] phải có ≥1 chữ số
  // (số liệu/mốc thời gian) — heuristic, WARN chứ không FAIL vì có ca hợp lệ chỉ có tên riêng.
  // Xem 01-LUAT/SO-TAY-CONG-THUC/08-QUY-TAC-SU-THAT.md.
  // F38 (LÔ 5 nhóm A, 20260713): mở rộng thêm archetype-data.ts (4/5 archetype dùng làm nguồn nội
  // dung trang chủ thật — trước đây content.3 MÙ hoàn toàn với nó, phát hiện nghiêm trọng). File
  // này không có field suThat/nguồn cấu trúc như content.ts nên chỉ dò heuristic: câu văn trong
  // chuỗi có số liệu + đơn vị định lượng (năm/triệu/tỷ/%/khách hàng/dự án/giải thưởng) — không
  // ép buộc phải có nguồn (archetype-data.ts chưa có field nguồn thống nhất), chỉ nêu ra để kiểm tay.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/content.ts')) || existsSync(join(d, 'src/lib/archetype-data.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('content.3-suthat-kiemchung', 'WARN', 'Không tìm thấy content.ts/archetype-data.ts để kiểm'); }
  else {
    const contentPath = join(root, 'src/lib/content.ts');
    const src = existsSync(contentPath) ? readFileSync(contentPath, 'utf8') : '';
    const m = src.match(/suThatThuongHieu:\s*\[([\s\S]*?)\]/);
    const block = m ? m[1] : '';
    const entries = [...block.matchAll(/suThat:\s*["'`]([^"'`]*)["'`]/g)].map(x => x[1]).filter(s => s !== 'CAN_DU_KIEN' && s.trim());
    const archPath = join(root, 'src/lib/archetype-data.ts');
    const archClaims = existsSync(archPath)
      ? [...readFileSync(archPath, 'utf8').matchAll(/["'`]([^"'`]{6,220}?\d[^"'`]{0,220}?(năm|triệu|tỷ|%|khách hàng|dự án|giải thưởng)[^"'`]{0,80})["'`]/gi)].map(x => x[1])
      : [];
    if (!entries.length && !archClaims.length) { add('content.3-suthat-kiemchung', 'WARN', 'suThatThuongHieu[]/archetype-data.ts rỗng hoặc chưa điền — mục 16 CORE-BRIEF chưa có dữ kiện'); }
    else {
      const noSo = entries.filter(e => !/\d/.test(e));
      const parts = [];
      if (entries.length) parts.push(noSo.length ? `${noSo.length}/${entries.length} sự thật content.ts không có chữ số` : `${entries.length} sự thật content.ts đều có số liệu/mốc`);
      if (archClaims.length) parts.push(`${archClaims.length} câu archetype-data.ts có số liệu định lượng — kiểm tay có phải dữ kiện thật, không bịa (máy chưa có field nguồn thống nhất để tự đối chiếu)`);
      (noSo.length || archClaims.length)
        ? add('content.3-suthat-kiemchung', 'WARN', parts.join('; '))
        : add('content.3-suthat-kiemchung', 'PASS', parts.join('; ') || 'Không có số liệu cần kiểm chứng');
    }
  }
}

{ // content.3b-nguon-trong — F39 (LÔ 5 nhóm A, 20260713): field `nguon` tồn tại trong type
  // CoreBriefContent (suThatThuongHieu/duKienNoiDung/khoSoLieuTrichDan đều có nguon: string) nhưng
  // check-luat.mjs CHƯA BAO GIỜ đọc nó — số liệu có thể bịa mà content.3 vẫn PASS vì chỉ soi có
  // chữ số hay không, không soi có nguồn hay không. Cổng WARN (không FAIL — nhiều nguồn hợp lệ là
  // "phỏng vấn nội bộ"/"số liệu công ty" không phải URL, ép buộc format cụ thể dễ FAIL oan).
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/content.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('content.3b-nguon-trong', 'WARN', 'Không tìm thấy content.ts để kiểm'); }
  else {
    const src = readFileSync(join(root, 'src/lib/content.ts'), 'utf8');
    // 3 mảng cùng shape { <key>: string, nguon: string } — key claim khác nhau theo mục CORE-BRIEF.
    const ARRAYS = [
      { field: 'suThatThuongHieu', claimKey: 'suThat' },
      { field: 'duKienNoiDung', claimKey: 'soLieu' },
      { field: 'khoSoLieuTrichDan', claimKey: 'soLieu' },
    ];
    const rong = [];
    let tongSoCoSo = 0, tongDaKiem = 0;
    for (const { field, claimKey } of ARRAYS) {
      const m = src.match(new RegExp(`${field}:\\s*\\[([\\s\\S]*?)\\]`));
      if (!m) continue;
      // Tách từng object { claimKey: "...", nguon: "..." } trong mảng — bắt cặp claim+nguon liền kề.
      const objs = [...m[1].matchAll(new RegExp(`${claimKey}:\\s*["'\`]([^"'\`]*)["'\`][\\s\\S]{0,10}?nguon:\\s*["'\`]([^"'\`]*)["'\`]`, 'g'))];
      for (const [, claim, nguon] of objs) {
        if (claim === 'CAN_DU_KIEN' || !claim.trim() || !/\d/.test(claim)) continue; // chỉ xét claim có số liệu cụ thể
        tongSoCoSo++;
        const nguonRong = !nguon || !nguon.trim() || nguon.trim() === 'CAN_DU_KIEN' || nguon.includes('[[CẦN-DỮ-KIỆN]]');
        if (nguonRong) rong.push(`${field}.${claimKey}="${claim.slice(0, 40)}"`);
        else tongDaKiem++;
      }
    }
    rong.length
      ? add('content.3b-nguon-trong', 'WARN', `${rong.length}/${tongSoCoSo} số liệu có chữ số nhưng field nguon RỖNG/placeholder — không kiểm chứng được, có thể bịa: ${rong.slice(0, 5).join(' | ')}`)
      : add('content.3b-nguon-trong', 'PASS', tongSoCoSo ? `${tongDaKiem}/${tongSoCoSo} số liệu đều có nguồn kèm theo` : 'Chưa có số liệu cụ thể nào cần kiểm nguồn — N/A');
  }
}

{ // exp.25: cấm [[CẦN-DỮ-KIỆN]] sót trong EXP-SCORE.md/DESIGN-DNA.md — CHỈ áp cho web đã scaffold
  // thật (domain thật đã điền), không áp cho chính templateweb gốc (domain vẫn là placeholder).
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('exp.25-score-filled', 'WARN', 'Không tìm thấy site-config.ts để kiểm'); }
  else {
    const cfgSrc = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    const isRawTemplate = /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(cfgSrc);
    if (isRawTemplate) { add('exp.25-score-filled', 'PASS', 'templateweb gốc (domain chưa điền) — N/A, gate chỉ áp cho web đã scaffold'); }
    else {
      const files = ['EXP-SCORE.md', 'DESIGN-DNA.md'].map(f => join(root, f)).filter(existsSync);
      const bad = files.filter(f => readFileSync(f, 'utf8').includes('[[CẦN-DỮ-KIỆN'));
      bad.length
        ? add('exp.25-score-filled', 'FAIL', `${bad.map(f => f.split('/').pop()).join(', ')} còn placeholder [[CẦN-DỮ-KIỆN]] — điền trước khi bàn giao (exp.1/exp.16 MUST)`)
        : add('exp.25-score-filled', 'PASS', 'EXP-SCORE.md/DESIGN-DNA.md đã điền đủ, không còn placeholder'); } }
}

{ // exp.26: cổng chọn màu Phase 3 — DESIGN-DNA.md PHẢI có dòng "Màu do Ông chọn:" (Ông bấm qua widget,
  // không phải AI tự set). CHỈ áp cho web đã scaffold thật, không áp cho templateweb gốc.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('exp.26-mau-ong-chon', 'WARN', 'Không tìm thấy site-config.ts để kiểm'); }
  else {
    const cfgSrc = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    const isRawTemplate = /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(cfgSrc);
    const dnaPath = join(root, 'DESIGN-DNA.md');
    // Web build TRƯỚC cổng màu 08/07/2026 không có .buildstate.json → hạ FAIL thành WARN
    // (không FAIL oan web cũ); web mới qua /bat-dau-web luôn có buildstate → giữ FAIL chặn cứng.
    const truocCong = !existsSync(join(root, '.buildstate.json'));
    const mucLoi = truocCong ? 'WARN' : 'FAIL';
    const ghiChuCu = truocCong ? ' (web build trước cổng màu 08/07/2026 — bổ sung DESIGN-DNA.md khi tiện)' : '';
    if (isRawTemplate) { add('exp.26-mau-ong-chon', 'PASS', 'templateweb gốc — N/A, gate chỉ áp cho web đã scaffold'); }
    else if (!existsSync(dnaPath)) { add('exp.26-mau-ong-chon', mucLoi, `Thiếu DESIGN-DNA.md${ghiChuCu}`); }
    else {
      const dna = readFileSync(dnaPath, 'utf8');
      /Màu do Ông chọn:/.test(dna)
        ? add('exp.26-mau-ong-chon', 'PASS', 'DESIGN-DNA.md có dòng xác nhận Ông đã chọn màu qua widget')
        : add('exp.26-mau-ong-chon', mucLoi, `DESIGN-DNA.md thiếu dòng "Màu do Ông chọn:" — nghi AI tự set màu, bỏ qua cổng Bước 2b${ghiChuCu}`); } }
}

{ // exp.27: đối chiếu brandHue/brandChroma (site-config.ts) có khớp đúng phương án ghi trong
  // DESIGN-DNA.md không — chống trường hợp ghi log "đã hỏi Ông" giả nhưng code lại set màu khác.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('exp.27-mau-khop-luachon', 'WARN', 'Không tìm thấy site-config.ts để kiểm'); }
  else {
    const cfgSrc = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    const isRawTemplate = /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(cfgSrc);
    const dnaPath = join(root, 'DESIGN-DNA.md');
    if (isRawTemplate) { add('exp.27-mau-khop-luachon', 'PASS', 'templateweb gốc — N/A, gate chỉ áp cho web đã scaffold'); }
    else if (!existsSync(dnaPath)) { add('exp.27-mau-khop-luachon', 'WARN', 'Thiếu DESIGN-DNA.md — kiểm ở exp.26'); }
    else {
      const dna = readFileSync(dnaPath, 'utf8');
      // V6c (11/07/2026): Ông đã mở khoá Bộ IV-VI + Hue H7-H12 → regex phải nhận đủ.
      // Thứ tự nhánh Bộ an toàn nhờ neo phía sau (—/dấu nháy): I{1,3} thử "I" trong "IV" rồi
      // backtrack sang IV khi ký tự kế không phải neo. Hue H(1[0-2]|[1-9]) khớp H1-H12.
      const dongMau = dna.match(/Màu do Ông chọn:.*Nhóm\s*(I{1,3}|IV|V|VI)\s*—\s*(H(?:1[0-2]|[1-9]))/i);
      const cfgHue = cfgSrc.match(/\bhue\s*:\s*["'`](H(?:1[0-2]|[1-9]))["'`]/)?.[1];
      const cfgBo = cfgSrc.match(/\bbo\s*:\s*["'`](I{1,3}|IV|V|VI)["'`]/)?.[1];
      if (!dongMau) { add('exp.27-mau-khop-luachon', 'WARN', 'Không đọc được Nhóm/Hue từ dòng "Màu do Ông chọn:" — kiểm tay'); }
      else {
        const [, boGhi, hueGhi] = dongMau;
        // Cùng van mềm exp.26: web trước cổng màu (không .buildstate.json) → WARN thay vì FAIL.
        const mucLech = existsSync(join(root, '.buildstate.json')) ? 'FAIL' : 'WARN';
        (boGhi === cfgBo && hueGhi === cfgHue)
          ? add('exp.27-mau-khop-luachon', 'PASS', `site-config.ts (${cfgBo}-${cfgHue}) khớp DESIGN-DNA.md (${boGhi}-${hueGhi})`)
          : add('exp.27-mau-khop-luachon', mucLech, `LỆCH — DESIGN-DNA.md ghi ${boGhi}-${hueGhi} nhưng site-config.ts đang set ${cfgBo}-${cfgHue}`); } } }
}

{ // priv.28: cookie consent phải GATE analytics — PDPL 2026 "im lặng ≠ đồng ý".
  // Nếu layout.tsx tải script GA4 (gtag) hoặc Microsoft Clarity mà KHÔNG có cơ chế
  // consent nào bọc quanh (AnalyticsGate/ConsentProvider/ConsentBanner...) → FAIL.
  // Không có GA_ID/CLARITY_ID nào cả (chưa cấu hình analytics) → PASS, không có gì để gate.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app/layout.tsx'))) return d; d = join(d, '..'); } return null; })();
  const layoutPath = root ? join(root, 'src/app/layout.tsx') : null;
  if (!root || !layoutPath || !existsSync(layoutPath)) {
    add('priv.28-consent-gate', 'WARN', 'Không tìm thấy src/app/layout.tsx để kiểm');
  } else {
    const layoutSrc = readFileSync(layoutPath, 'utf8');
    const trackingRe = /googletagmanager\.com\/gtag|clarity\.ms\/tag|gtag\(['"]config['"]/;
    const coScriptTracking = trackingRe.test(layoutSrc);
    if (!coScriptTracking) {
      add('priv.28-consent-gate', 'PASS', 'Không tải script GA4/Clarity trong layout.tsx — không có gì cần gate');
    } else {
      // V6a (11/07/2026): siết heuristic — không đủ khi chỉ thấy chữ "consent" bất kỳ (comment trùng
      // chữ cũng lọt). Yêu cầu script tracking THẬT SỰ nằm TRONG khối gate component
      // (<AnalyticsGate>/<ConsentGate>/<ConsentProvider>) hoặc sau điều kiện consent === "granted".
      // Vá 20260720 (đợt khám tổng thể — khiếu nại mức Cao ghi trong sổ từ 12/07, chưa vá): .match()
      // đơn chỉ bắt gate ĐẦU TIÊN trong layout.tsx — web dùng 2 gate khác nhau cho 2 mục đích (vd
      // <ConsentProvider> bọc UI banner cookie chung + <AnalyticsGate> RIÊNG bọc script GA4/Clarity)
      // mà gate chứa tracking nằm SAU gate không chứa tracking trong source → FAIL oan. Đổi sang
      // matchAll, duyệt HẾT các gate block, PASS nếu BẤT KỲ gate nào chứa tracking thật.
      const gateBlocks = [...layoutSrc.matchAll(/<(AnalyticsGate|ConsentGate|ConsentProvider)\b[\s\S]*?<\/\1>/g)];
      const gateWithTracking = gateBlocks.find(m => trackingRe.test(m[0]));
      const trackingInGate = !!gateWithTracking;
      const consentCond = /consent(?:Granted|Given|Accepted)?\s*(?:===?\s*["']granted["']\s*)?&&[\s\S]{0,400}?(?:googletagmanager|clarity\.ms|gtag\()/i.test(layoutSrc);
      if (trackingInGate || consentCond) {
        add('priv.28-consent-gate', 'PASS', trackingInGate
          ? `layout.tsx bọc script GA4/Clarity trong <${gateWithTracking[1]}> — gate consent thật${gateBlocks.length > 1 ? ` (${gateBlocks.length} gate block, đã soát hết)` : ''}`
          : 'layout.tsx tải GA4/Clarity sau điều kiện consent granted — gate thật');
      } else {
        add('priv.28-consent-gate', 'FAIL', 'layout.tsx tải GA4/Clarity nhưng script KHÔNG nằm trong khối gate (<AnalyticsGate>/<ConsentGate>/<ConsentProvider>) và không sau điều kiện consent granted — vi phạm PDPL "im lặng ≠ đồng ý" (chữ "consent" trong comment không tính)');
      }
    }
  }
}

{ // exp.29: DESIGN-DNA.md phải có dòng xác nhận Ông đã chọn sơ đồ web qua widget (Bước 2c) —
  // chống trường hợp AI tự dựng route/nav mà không qua cổng chặn cứng.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('exp.29-sodo-ong-chon', 'WARN', 'Không tìm thấy site-config.ts để kiểm'); }
  else {
    const cfgSrc = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    const isRawTemplate = /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(cfgSrc);
    const dnaPath = join(root, 'DESIGN-DNA.md');
    if (isRawTemplate) { add('exp.29-sodo-ong-chon', 'PASS', 'templateweb gốc — N/A, gate chỉ áp cho web đã scaffold'); }
    // Van mềm đồng bộ exp.26/27: web trước cổng (không .buildstate.json) → WARN thay vì FAIL.
    else if (!existsSync(dnaPath)) { add('exp.29-sodo-ong-chon', existsSync(join(root, '.buildstate.json')) ? 'FAIL' : 'WARN', 'Thiếu DESIGN-DNA.md'); }
    else {
      const dna = readFileSync(dnaPath, 'utf8');
      /Sơ đồ web đã chọn:/.test(dna)
        ? add('exp.29-sodo-ong-chon', 'PASS', 'DESIGN-DNA.md có dòng xác nhận Ông đã chọn sơ đồ web qua widget')
        : add('exp.29-sodo-ong-chon', 'WARN', 'DESIGN-DNA.md thiếu dòng "Sơ đồ web đã chọn:" — web build trước 10/07/2026 chưa qua cổng này, chỉ WARN không chặn'); } }
}

{ // exp.30: mọi route trong .buildstate.json.routeDayDu phải nằm trong bảng route thật của
  // ARCHETYPE.md tương ứng — chống AI tự bịa route ngoài archetype khi "sáng tạo" phương án sơ đồ (Bước 2c).
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, '.buildstate.json'))) return d; d = join(d, '..'); } return null; })();
  const buildstatePath = root ? join(root, '.buildstate.json') : null;
  const profilePath = root ? join(root, 'content-profile.yaml') : null;
  if (!root || !existsSync(buildstatePath)) {
    add('exp.20-sodo-route-hop-le', 'WARN', 'Không tìm thấy .buildstate.json để kiểm (web build trước 10/07/2026 hoặc templateweb gốc)');
  } else {
    let bs = null; // F15 (audit 12/07 đợt 2): .buildstate.json dị dạng KHÔNG được hạ gục cả máy kiểm.
    try { bs = JSON.parse(readFileSync(buildstatePath, 'utf8')); }
    catch { add('exp.20-sodo-route-hop-le', 'WARN', '.buildstate.json dị dạng (JSON hỏng) — bỏ qua cổng thay vì hạ gục máy kiểm'); }
    if (!bs) {
      /* đã WARN ở trên — bỏ qua cổng an toàn */
    } else if (!bs.routeDayDu) {
      add('exp.20-sodo-route-hop-le', 'WARN', '.buildstate.json thiếu field routeDayDu — chưa qua Bước 2c bản mới');
    } else if (!profilePath || !existsSync(profilePath)) {
      add('exp.20-sodo-route-hop-le', 'WARN', 'Không tìm thấy content-profile.yaml để lấy archetype');
    } else {
      const archetypeId = readFileSync(profilePath, 'utf8').match(/^archetype:\s*["']?([\w-]+)["']?/m)?.[1];
      const archetypeMdPath = archetypeId ? join(root, '..', 'CODEWEB', '04-ARCHETYPE', archetypeId, 'ARCHETYPE.md') : null;
      if (!archetypeMdPath || !existsSync(archetypeMdPath)) {
        add('exp.20-sodo-route-hop-le', 'WARN', `Không tìm thấy ARCHETYPE.md cho archetype "${archetypeId}"`);
      } else {
        const archetypeMd = readFileSync(archetypeMdPath, 'utf8');
        // Bug đã vá (A1, audit gomnhalua 10/07/2026): regex cũ `\|\s*`([^`]+)`` chỉ bắt route NGAY
        // SAU dấu | đầu ô — 1 ô nhiều route kiểu "`/a`, `/b`" chỉ đọc được `/a`, bỏ sót `/b` → FAIL
        // oan route hợp lệ. Regex mới bắt MỌI cụm trong backtick, không cần đứng ngay sau `|`.
        const routeThoRaw = [...archetypeMd.matchAll(/`([^`]+)`/g)]
          .map((m) => m[1].trim().split(' ')[0])
          .filter((r) => r.startsWith('/'));
        // Route tĩnh: so khớp CHÍNH XÁC (vd "/"). Route động (có "[slug]"): so khớp tiền tố trước dấu "[".
        const routeTinh = new Set(routeThoRaw.filter((r) => !r.includes('[')));
        const tienToDong = routeThoRaw.filter((r) => r.includes('[')).map((r) => r.slice(0, r.indexOf('[')));
        // Route động cấp gốc "/[slug]" có tiền tố "/" (độ dài 1). Nó phục vụ MỌI route 1 cấp, nên không
        // dùng làm tiền tố khớp bừa; thay vào đó, khi archetype CÓ catch-all gốc thì tha các route 1 CẤP
        // (lastIndexOf('/')===0) — vẫn FAIL route NHIỀU cấp bịa (catch-all gốc chỉ phủ 1 segment).
        const hasRootCatchAll = tienToDong.some((tt) => tt === '' || tt === '/');
        const routeBia = bs.routeDayDu.filter((r) => {
          if (routeTinh.has(r)) return false;
          if (tienToDong.some((tt) => tt.length > 1 && r.startsWith(tt))) return false;
          if (hasRootCatchAll && r.lastIndexOf('/') === 0) return false;
          return true;
        });
        routeBia.length === 0
          ? add('exp.20-sodo-route-hop-le', 'PASS', `Toàn bộ ${bs.routeDayDu.length} route trong routeDayDu khớp bảng route archetype "${archetypeId}"`)
          : add('exp.20-sodo-route-hop-le', 'FAIL', `Route KHÔNG có trong ARCHETYPE.md "${archetypeId}" — nghi AI bịa route khi đề xuất sơ đồ: ${routeBia.join(', ')}`);
      }
    }
  }
}

{ // exp.33-sodo-khop-luachon (khắc 05/09/2026) — SƠ ĐỒ Ông bấm chọn ở Bước 2c có được web tôn
  // trọng không. Cặp song sinh của exp.29 ("Ông ĐÃ chọn") giống cặp exp.26 → exp.27 bên màu.
  //
  // VÌ SAO PHẢI CÓ: trước cổng này KHÔNG máy nào so `danhSachTab` với nav thật — hai chuỗi
  // `navLinks` và `danhSachTab` không hề xuất hiện trong cả tệp máy kiểm. exp.29 chỉ dò MỘT DÒNG
  // CHỮ trong DESIGN-DNA (cổng tự khai), exp.20 so lựa chọn với CATALOG archetype chứ không so với
  // web. Ca thật đã nổ: web queli-vn — Ông chọn 6 tab, Navbar chỉ 4 mục, và 3 route Ông chọn
  // (/ve-toi, /hanh-trinh, /blog) KHÔNG TỒN TẠI trong src/app; cả 3 cổng liên quan vẫn PASS, sổ ghi
  // "127 PASS · 0 FAIL".
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, '.buildstate.json'))) return d; d = join(d, '..'); } return null; })();
  const ID = 'exp.33-sodo-khop-luachon';
  if (!root) {
    add(ID, 'WARN', 'Không tìm thấy .buildstate.json — web dựng trước cổng 2c, KHÔNG kết luận là đạt');
  } else {
    let bs = null;
    try { bs = JSON.parse(readFileSync(join(root, '.buildstate.json'), 'utf8')); }
    catch { add(ID, 'WARN', '.buildstate.json dị dạng (JSON hỏng) — bỏ qua cổng thay vì hạ gục máy kiểm'); }
    const tab = bs && bs.danhSachTab;
    const navFile = ['src/shared/ui/Navbar.tsx', 'src/components/Navbar.tsx'].map((r) => join(root, r)).find(existsSync);
    if (!bs) { /* đã WARN */ }
    else if (!Array.isArray(tab) || tab.length === 0) {
      add(ID, 'WARN', '.buildstate.json thiếu danhSachTab — chưa qua Bước 2c bản mới, KHÔNG kết luận là đạt');
    } else if (!navFile) {
      add(ID, 'WARN', 'Không thấy Navbar.tsx để đối chiếu — kiến trúc nav riêng, KHÔNG kết luận là đạt');
    } else {
      // Kiến trúc nav RIÊNG có thật: thevietnamtea-com không có chữ `navLinks` nào, nav khai ở
      // `src/lib/site-nav.ts` (`navSections` với label/items). Đọc kèm tệp đó thì cổng vẫn kiểm
      // được thay vì bó tay — soi thiếu một đường là mù, mà mù thì tuyệt đối không được PASS.
      const fileNavPhu = ['src/lib/site-nav.ts', 'src/lib/nav.ts', 'src/config/nav.ts'].map((r) => join(root, r)).filter(existsSync);
      const ma = readFileSync(navFile, 'utf8') + fileNavPhu.map((f) => '\n' + readFileSync(f, 'utf8')).join('');
      // BẪY 1 (đo thật trên dakago-vn + queli-vn — 2/3 web dạng A dính): tab Ông chọn có thể nằm
      // NGOÀI mảng navLinks, ở `const CTA` hoặc một thẻ <a href> cứng trong thân Navbar. Đọc mỗi
      // mảng navLinks là buộc tội oan. Gom TẬP HỢP đích từ cả ba nguồn.
      const khoiNav = ma.match(/const navLinks[^=]*=\s*\[([\s\S]*?)\n\];/);
      const hrefNav = new Set();
      if (khoiNav) for (const m of khoiNav[1].matchAll(/href:\s*["'`]([^"'`]+)["'`]/g)) hrefNav.add(m[1]);
      for (const m of ma.matchAll(/href[:=]\s*["'{]?\s*["'`]?([/#][^"'`}\s]*)["'`]?/g)) hrefNav.add(m[1]);
      const nhanNav = new Set();
      if (khoiNav) for (const m of khoiNav[1].matchAll(/label:\s*["'`]([^"'`]+)["'`]/g)) nhanNav.add(m[1]);
      for (const m of ma.matchAll(/label:\s*["'`]([^"'`]+)["'`]/g)) nhanNav.add(m[1]);

      const chuanRoute = (r) => String(r).trim().toLowerCase().replace(/\/+$/, '') || '/';
      const chuanNhan = (n) => String(n).normalize('NFC').trim().toLocaleLowerCase('vi');
      const dangA = typeof tab[0] === 'object' && tab[0] !== null;

      let thieu = [];
      if (dangA) {
        const cheNav = new Set([...hrefNav].map(chuanRoute));
        thieu = tab.filter((t) => t && t.route && !cheNav.has(chuanRoute(t.route)))
                   .map((t) => `${t.route}${t.nhan ? ` (${t.nhan})` : ''}`);
      } else {
        // DẠNG B (thevietnamtea-com): danhSachTab là mảng CHUỖI TRẦN chỉ có nhãn, không có route.
        // So bằng NHÃN, giữ nguyên dấu tiếng Việt — bóc dấu sẽ gộp nhầm hai nhãn khác nhau.
        const cheNhan = new Set([...nhanNav].map(chuanNhan));
        thieu = tab.filter((t) => typeof t === 'string' && !cheNhan.has(chuanNhan(t)));
      }

      // Van chống BÁO OAN phải theo ĐÚNG DẠNG đang so: dạng A so href thì thiếu href mới là mù;
      // dạng B so nhãn thì thiếu NHÃN mới là mù. Bản đầu chỉ kiểm "rỗng cả hai" nên
      // thevietnamtea-com (dạng B, có href nhưng không rút được nhãn nào) bị so với tập rỗng và
      // lãnh FAIL oan — đúng bẫy "kiến trúc nav riêng" đã lường trước mà vẫn sập.
      const muTit = dangA ? hrefNav.size === 0 : nhanNav.size === 0;
      if (muTit) {
        add(ID, 'WARN', `Đọc được ${tab.length} tab trong sổ nhưng KHÔNG rút được ${dangA ? 'href' : 'nhãn'} nào từ nav (kiến trúc nav riêng) — KHÔNG kết luận là đạt`);
      } else if (thieu.length) {
        // Thông điệp CỐ Ý TRUNG LẬP: đo thật trên queli-vn cho thấy bên sai có thể là SỔ chứ không
        // phải web — DESIGN-DNA.md:136 ghi Ông đã duyệt sơ đồ mới ngày 20260819 mà .buildstate.json
        // chưa cập nhật. Viết "Navbar sai" là buộc tội oan chính quyết định của Ông.
        add(ID, 'FAIL', `danhSachTab và nav thật LỆCH nhau — ${thieu.length}/${tab.length} mục Ông chọn không có trong nav: ${thieu.join(' · ')}. Một trong hai chưa cập nhật: sửa navLinks cho khớp sổ, HOẶC cập nhật danhSachTab nếu Ông đã duyệt sơ đồ mới (ghi rõ trong DESIGN-DNA.md).`);
      } else {
        add(ID, 'PASS', `Cả ${tab.length} mục Ông chọn ở Bước 2c đều có mặt trong nav thật (dạng ${dangA ? 'route' : 'nhãn'})`);
      }
    }
  }
}

{ // seo.46-su-kien-co-schema (khắc 13/09/2026) — web SỰ KIỆN có khai dữ liệu có cấu trúc không.
  // BỆNH: `eventSchema()` nằm sẵn trong `src/lib/schema.ts` và `siteConfig.events` đã khai đúng hình
  // dạng dữ liệu, nhưng đo 13/09 thì KHÔNG TỆP NÀO trong khuôn gọi nó — hàm là mã chết. Web sự kiện
  // ra đời không có Event schema ⇒ Google không biết đây là sự kiện, mất luôn thẻ kết quả giàu
  // (ngày · địa điểm · vé) vốn là thứ đáng giá nhất với đúng loại web này. FORM đã hỏi Ông ngày, địa
  // điểm, giá vé từ đầu rồi để đó.
  // VAN CHỐNG BÁO OAN — quan trọng hơn cả cổng: archetype sự kiện mà CHƯA có ngày thật thì KHÔNG
  // được đòi Event schema. Dữ liệu mẫu cố ý để `ngayBatDau: null`, vì phát một Event schema mang ngày
  // giữ chỗ là CÔNG BỐ VỚI GOOGLE một sự kiện không có thật — tội nặng hơn hẳn thiếu schema.
  // Vì vậy cổng chỉ đòi khi ĐÃ CÓ NGÀY THẬT trong `src/lib/archetype-data.ts`.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  let bs = null;
  try { bs = JSON.parse(readFileSync(join(root, '.buildstate.json'), 'utf8')); } catch { /* web cũ hoặc không có sổ */ }
  const laSuKien = bs && /su-kien/.test(String(bs.archetype || ''));
  if (root && laSuKien) {
    const fData = join(root, 'src/lib/archetype-data.ts');
    const ma = existsSync(fData) ? readFileSync(fData, 'utf8') : '';
    // Ngày THẬT = chuỗi trong nháy, không phải `null` và không phải marker cần-dữ-kiện.
    const mNgay = ma.match(/ngayBatDau\s*:\s*["']([^"']+)["']/);
    const coNgayThat = Boolean(mNgay && !/CẦN-DỮ-KIỆN|CAN_DU_KIEN/.test(mNgay[1]));
    const coEvent = htmls.some(h => h.src.includes('"@type":"Event"') || h.src.includes('"@type": "Event"'));
    if (!coNgayThat) {
      add('seo.46-su-kien-co-schema', 'PASS', 'Web sự kiện chưa có ngày thật — ĐÚNG khi không phát Event schema (phát schema mang ngày giữ chỗ là công bố một sự kiện không có thật)');
    } else if (coEvent) {
      add('seo.46-su-kien-co-schema', 'PASS', `Web sự kiện có ngày thật (${mNgay[1]}) và đã khai Event schema trong HTML`);
    } else {
      add('seo.46-su-kien-co-schema', 'FAIL', `Web sự kiện đã có ngày thật (${mNgay[1]}) nhưng HTML KHÔNG có "@type":"Event" — ` +
        'Google không nhận ra đây là sự kiện, mất thẻ kết quả giàu (ngày·địa điểm·vé). ' +
        'Chữa: trang chủ archetype su-kien gọi eventSchema() từ src/lib/schema.ts, bọc trong <JsonLd>');
    }
  }
}

{ // seo.45-thuc-the-khai-ro (khắc 05/09/2026) — web KHAI VỚI GOOGLE nó là loại thực thể gì.
  // BỆNH THẬT, ĐANG SỐNG. `siteConfig.schemaType` là khoá TUỲ CHỌN, không khai thì layout.tsx âm
  // thầm rơi về `organizationSchema()` (`schemaType ?? "Organization"`). Mà đo 05/09/2026:
  //   · `/bat-dau-web` nhắc tới `schemaType` đúng 0 lần · `new-web.sh` đặt nó đúng 0 lần
  //   · 4/12 web thật KHÔNG khai gì — trong đó `trancongthuy-vn` là hồ sơ cá nhân của một luật sư
  //     (178 tiểu luận pháp lý mang tên ông) đang tự khai với Google mình là một TỔ CHỨC.
  // Hậu quả im lặng: Google dựng sai thực thể trong Knowledge Graph — tên người bị gắn vào khuôn
  // doanh nghiệp, `sameAs` trỏ về hồ sơ cá nhân nhưng kiểu lại là Organization nên tín hiệu tự mâu
  // thuẫn. Build xanh, `check:luat` xanh, mắt Ông nhìn trang cũng không thấy gì — đây là loại lỗi
  // chỉ máy đọc mới thấy. Nối vào tiêu chí luật `seo.3` (Schema.org JSON-LD KHỚP NỘI DUNG).
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  // Ghi id NGUYÊN VĂN trong từng add() (không dùng biến): Người Gác Nhà Máy dò cổng bằng chuỗi
  // literal `add('<id>',` — cổng viết qua biến là VÔ HÌNH với bộ đếm độ phủ, và cũng không grep ra
  // được (đúng bài học `check-luat.mjs` có 0 lần chữ `matTien` trong khi cổng mặt tiền vẫn "tồn tại").
  if (!root) {
    add('seo.45-thuc-the-khai-ro', 'WARN', 'Không thấy src/lib/site-config.ts — kiến trúc riêng, KHÔNG kết luận là đạt');
  } else {
    const cfg = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    // Chỉ nhận lần khai có GIÁ TRỊ trong nháy — dòng `schemaType?: "Organization" | "Person" | …`
    // của khối INTERFACE nằm TRƯỚC object thật, dò thô là nhận nhầm khai báo kiểu thành lời khai.
    const khai = [...cfg.matchAll(/schemaType\s*:\s*"(Organization|Person|LocalBusiness)"/g)].map(m => m[1]);
    let bs = null;
    try { bs = JSON.parse(readFileSync(join(root, '.buildstate.json'), 'utf8')); } catch { /* web cũ, không có sổ */ }
    const kieuNguoi = bs && /ho-so-chuyen-gia|chuyen-gia-ca-nhan/.test(String(bs.archetype || ''));
    if (!khai.length) {
      add('seo.45-thuc-the-khai-ro', 'FAIL', 'site-config.ts KHÔNG khai schemaType ⇒ web âm thầm tự nhận là "Organization" với Google. ' +
        'Không ai quyết định danh tính của web này. Khai rõ một trong: Organization | Person | LocalBusiness (web sự kiện vẫn khai tổ chức/người vận hành — bản thân Sự kiện là thực thể cấp TRANG, cổng seo.46 canh)');
    } else if (kieuNguoi && khai[0] !== 'Person') {
      add('seo.45-thuc-the-khai-ro', 'WARN', `archetype "${bs.archetype}" là hồ sơ MỘT CON NGƯỜI nhưng schemaType khai "${khai[0]}" — ` +
        'nhiều khả năng sai thực thể. Cần Ông xác nhận: đây là hồ sơ cá nhân (Person) hay trang chuyên gia của một tổ chức?');
    } else {
      add('seo.45-thuc-the-khai-ro', 'PASS', `schemaType khai rõ "${khai[0]}"${bs && bs.archetype ? ` (archetype "${bs.archetype}")` : ''}`);
    }
  }
}

{ // exp.34-font-khop-luachon (khắc 05/09/2026) — CẶP FONT Ông bấm chọn ở Bước 2b′ có đúng là
  // font web đang dùng không. Em ruột của exp.27-mau-khop-luachon bên màu.
  //
  // VÌ SAO KHÔNG NỚI aes.29-fontsync: cổng đó trả lời câu KHÁC — "tên font có nạp được không" —
  // và phải áp cho MỌI web kể cả web không có .buildstate.json. Nó đọc fonts.ts + site-config.ts +
  // layout.tsx và KHÔNG hề chạm .buildstate.json, nên lựa chọn của Ông chưa bao giờ được đối chiếu.
  // Gộp hai việc vào một cổng là một verdict cho hai lỗi độc lập.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, '.buildstate.json'))) return d; d = join(d, '..'); } return null; })();
  const ID = 'exp.34-font-khop-luachon';
  const chuanFont = (x) => String(x || '').normalize('NFC').toLowerCase().replace(/[^a-z0-9à-ỹ]/gi, '');
  if (!root) {
    add(ID, 'WARN', 'Không tìm thấy .buildstate.json — web dựng trước cổng 2b′, KHÔNG kết luận là đạt');
  } else {
    let bs = null;
    try { bs = JSON.parse(readFileSync(join(root, '.buildstate.json'), 'utf8')); }
    catch { add(ID, 'WARN', '.buildstate.json dị dạng (JSON hỏng) — bỏ qua cổng thay vì hạ gục máy kiểm'); }
    const chon = bs && bs.fonts;
    const cfgPath = join(root, 'src/lib/site-config.ts');
    if (!bs) { /* đã WARN */ }
    else if (!chon || (!chon.display && !chon.text)) {
      add(ID, 'WARN', '.buildstate.json thiếu khoá fonts — chưa qua Bước 2b′ bản mới, KHÔNG kết luận là đạt');
    } else if (!existsSync(cfgPath)) {
      add(ID, 'WARN', 'Không thấy src/lib/site-config.ts để đối chiếu — kiến trúc riêng, KHÔNG kết luận là đạt');
    } else {
      const cfg = readFileSync(cfgPath, 'utf8');
      // BẪY 1 (đo thật: oan cả 3 web dạng có sổ): `fonts: { display: string; text: string; }` của
      // khối INTERFACE nằm TRƯỚC object literal thật. Lấy khối `fonts:` đầu tiên là ra rỗng ⇒ FAIL
      // oan. Duyệt mọi khối, chỉ nhận khối có GIÁ TRỊ trong nháy.
      // BẪY 2 (dakago-vn): có dòng chú thích `// Noto vì web làm 3 ngữ…` xen ngay dưới `fonts: {`,
      // nên mọi regex xâu chuỗi kiểu `fonts:\s*\{\s*display:` đều trượt — đây đúng chỗ aes.29 đang
      // mù. Cắt CỬA SỔ rồi dò `display:`/`text:` ĐỘC LẬP.
      let webDisplay = null, webText = null;
      for (const m of cfg.matchAll(/\bfonts\s*:\s*\{/g)) {
        const cua = cfg.slice(m.index, m.index + 800);
        const d = cua.match(/\bdisplay\s*:\s*["'`]([^"'`]+)["'`]/);
        const t = cua.match(/\btext\s*:\s*["'`]([^"'`]+)["'`]/);
        if (d || t) { webDisplay = d ? d[1] : webDisplay; webText = t ? t[1] : webText; break; }
      }
      if (!webDisplay && !webText) {
        add(ID, 'WARN', 'Không rút được cặp font từ site-config.ts (chỉ thấy khai kiểu, không thấy giá trị) — KHÔNG kết luận là đạt');
      } else {
        const lech = [];
        for (const [khoa, ten] of [['display', 'chữ tiêu đề'], ['text', 'chữ thân bài']]) {
          const oChon = chon[khoa], oWeb = khoa === 'display' ? webDisplay : webText;
          if (!oChon || oChon === '[[CẦN-DỮ-KIỆN]]') continue;         // Ông chưa chốt ô này — không phán
          if (!oWeb) { lech.push(`${ten}: sổ ghi "${oChon}" mà site-config.ts không khai`); continue; }
          // BẪY 3: "Be Vietnam Pro" / "Be_Vietnam_Pro" / "beVietnamPro" là CÙNG một font. Chuẩn hoá
          // bỏ mọi ký tự không phải chữ-số. Đã kiểm chuẩn hoá KHÔNG gộp bừa: "Cormorant Infant" vẫn
          // khác "Cormorant Garamond", "Noto Serif" vẫn khác "Noto Sans" — nếu gộp hết thì cổng rỗng.
          if (chuanFont(oChon) !== chuanFont(oWeb)) lech.push(`${ten}: Ông chọn "${oChon}" — web dùng "${oWeb}"`);
        }
        lech.length
          ? add(ID, 'FAIL', `Cặp font Ông chọn ở Bước 2b′ KHÔNG khớp font web đang dùng — ${lech.join(' · ')}. Một trong hai chưa cập nhật: sửa site-config.ts cho khớp sổ, HOẶC cập nhật .buildstate.json nếu Ông đã duyệt font mới (ghi rõ trong DESIGN-DNA.md).`)
          : add(ID, 'PASS', `Cặp font web dùng khớp đúng lựa chọn Bước 2b′ của Ông (${[webDisplay, webText].filter(Boolean).join(' + ')})`);
      }
    }
  }
}

{ // exp.35-nhip-khop-luachon (khắc 05/09/2026) — NHỊP Ông chốt ở Bước 2b‴ có thật sự được dựng
  // không. Cái thứ ba trong bộ "Ông bấm chọn xong, web có tôn trọng không" (cùng exp.33 sơ đồ,
  // exp.34 font).
  //
  // VÌ SAO CẦN: chuỗi "nhip" xuất hiện ĐÚNG 0 LẦN trong cả tệp máy kiểm. Ba cổng layout.44/45/46
  // quyết định N/A bằng TÊN CLASS CÓ TRONG MÃ, không đọc sổ: web chọn Nhịp N4 mà KHÔNG dựng
  // `.chapter` nào thì layout.44 tự chấm "Không dùng class .chapter — ngoài phạm vi Nhịp N4, N/A"
  // rồi PASS. Tức đúng lúc Nhịp Ông chọn KHÔNG được dựng thì cổng lại im nhất. Cổng này lật ngược
  // câu hỏi: SỔ nói Nhịp gì, và mã có dấu hiệu của Nhịp ấy không.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, '.buildstate.json'))) return d; d = join(d, '..'); } return null; })();
  const ID = 'exp.35-nhip-khop-luachon';
  // Chỉ khai những Nhịp CÓ dấu hiệu cấu trúc đo được bằng mã tĩnh — mượn đúng dấu hiệu mà
  // layout.44/45/46 đã định nghĩa, để hai bên không nói hai thứ tiếng. Nhịp khác chưa có dấu hiệu
  // thì nói thẳng là chưa đo được, KHÔNG bịa ra phép đo rồi PASS bừa.
  // MỞ RỘNG 13/09/2026 — từ 3 lên 10 Nhịp. Bản cũ chỉ dò N4/N5/N6, nên 7 Nhịp còn lại (N7–N13) đều
  // rơi vào nhánh "chưa có dấu hiệu đo được" dù sổ công thức 03-RECIPE-LAYOUT.md ĐÃ ĐỊNH NGHĨA CSS
  // thật cho từng cái (mục 1c cho N13, mục 1d cho N7–N12), mỗi Nhịp còn có NEO là web đã build thật.
  // Giữ nguyên nguyên tắc của cổng: MƯỢN đúng dấu hiệu sổ công thức đã khai, KHÔNG tự nghĩ ra phép đo.
  // Mỗi mẫu dưới đây đối chiếu được về đúng dòng CSS trong sổ — không có cái nào do máy tự đặt.
  const DAU_HIEU_NHIP = {
    N4: { ten: 'Chương đánh số', re: /\bchapter\b/ },
    N5: { ten: 'Bento lệch ô', re: /\bbento-page\b/ },
    N6: { ten: 'Toàn màn điện ảnh', re: /\b(hero-cinematic|cinema-block)\b/ },
    N7: { ten: 'Song ngữ đối xứng', re: /\blang-(switch|status)\b/ },
    N8: { ten: 'Danh mục sản phẩm', re: /\bcatalog-(toolbar|layout|grid|card)\b/ },
    N9: { ten: 'Bảng số liệu đậm', re: /\bdata-table-(wrap|scroll)\b/ },
    N10: { ten: 'Sự kiện một trang', re: /\bevent-(hero|countdown|sticky-cta|scarcity-badge)\b/ },
    N11: { ten: 'Hồ sơ chuyên gia', re: /\bprofile-(hero|timeline)\b/ },
    N12: { ten: 'Tạp chí ảnh', re: /\bphoto-(masonry|group|caption-overlay)\b/ },
    // N13 neo bằng THUỘC TÍNH ARIA chứ không phải class — sổ công thức mục 1c khai thẳng
    // `[role="tablist"]` / `[role="tabpanel"][hidden]`, và đó cũng là hành vi bắt buộc của Nhịp này.
    N13: { ten: 'Tab hệ thống', re: /role=["']tablist["']|role=["']tabpanel["']/ },
  };
  if (!root) {
    add(ID, 'WARN', 'Không tìm thấy .buildstate.json — web dựng trước cổng 2b‴, KHÔNG kết luận là đạt');
  } else {
    let bs = null;
    try { bs = JSON.parse(readFileSync(join(root, '.buildstate.json'), 'utf8')); }
    catch { add(ID, 'WARN', '.buildstate.json dị dạng (JSON hỏng) — bỏ qua cổng thay vì hạ gục máy kiểm'); }
    const nhipTho = bs && bs.nhip;
    // Khoá `nhip` là CHUỖI TỰ DO chứa mã N (đo thật: "N4" · "N6" · có web ghi kèm mô tả), không phải
    // enum — rút mã bằng regex thay vì so bằng nhau.
    const ma = nhipTho ? String(nhipTho).match(/\bN(\d+)\b/) : null;
    if (!bs) { /* đã WARN */ }
    else if (!nhipTho) {
      add(ID, 'WARN', '.buildstate.json thiếu khoá nhip — chưa qua Bước 2b‴ bản mới, KHÔNG kết luận là đạt');
    } else if (!ma) {
      add(ID, 'WARN', `Không rút được mã Nhịp từ "${String(nhipTho).slice(0, 40)}" — KHÔNG kết luận là đạt`);
    } else {
      const key = 'N' + ma[1];
      const dh = DAU_HIEU_NHIP[key];
      if (!dh) {
        add(ID, 'WARN', `Nhịp ${key} chưa có dấu hiệu cấu trúc đo được bằng mã tĩnh — cổng KHÔNG kết luận là đạt (chỉ ${Object.keys(DAU_HIEU_NHIP).join('/')} đo được)`);
      } else {
        const srcDir = join(root, 'src');
        const srcFiles = [];
        (function walkSrc(d) { if (!existsSync(d)) return; for (const f of readdirSync(d)) {
          const p2 = join(d, f); if (f === 'node_modules') continue;
          const st = statSync(p2); if (st.isDirectory()) walkSrc(p2); else if (/\.(tsx|jsx|css)$/.test(f)) srcFiles.push(p2); } })(srcDir);
        const coDau = srcFiles.some((f) => dh.re.test(readFileSync(f, 'utf8')));
        // MỨC LÀ **WARN**, KHÔNG PHẢI FAIL — và đây là quyết định có cân nhắc, không phải nới tay.
        // Dấu hiệu ở trên là TÊN CLASS của recipe chuẩn (03-RECIPE-LAYOUT.md). Vắng nó có HAI nghĩa
        // mà mã tĩnh KHÔNG phân biệt nổi: (a) web không dựng Nhịp đã chốt — lỗi thật; (b) web dựng
        // đúng nhịp ấy bằng cách khác — đo thật: dakago-vn chọn N6 "toàn màn" và dựng bằng
        // `min-h-screen`/`100vh` chứ không dùng class `hero-cinematic`. Chấm FAIL ở ranh giới này là
        // buộc tội oan; mà cổng buộc tội oan thì lần sau người ta bỏ qua nó, rồi nó bịt luôn lỗi thật.
        // Dù chỉ WARN, cổng vẫn hơn hẳn hiện trạng: layout.44/45/46 trước đây IM LẶNG PASS "N/A"
        // đúng vào lúc Nhịp Ông chọn không được dựng.
        coDau
          ? add(ID, 'PASS', `Nhịp ${key} (${dh.ten}) Ông chọn ở Bước 2b‴ có dấu hiệu recipe chuẩn trong mã`)
          : add(ID, 'WARN', `Sổ ghi Ông chọn Nhịp ${key} (${dh.ten}) nhưng KHÔNG tệp nguồn nào mang class recipe chuẩn của Nhịp đó. Hai khả năng máy KHÔNG phân biệt được: web chưa dựng Nhịp đã chốt, HOẶC dựng bằng cách khác (vd min-h-screen thay cho .hero-cinematic). Cần mắt Ông xác nhận — CẤM đọc thành "đạt".`);
      }
    }
  }
}

{ // exp.28-moodboard-khop-build — LÔ 7 nhóm 1 (F62+F07, 13/07/2026): Bước 3d cho Ông chọn mood
  // board = 3 từ cảm xúc qua widget, nhưng "chọn xong không ai kiểm lại có khớp không" (F07/F62 —
  // trước LÔ 7, 0 cổng máy đối chiếu). Gate mềm: DESIGN-DNA.md ghi dòng "Mood board:" (3 từ cảm
  // xúc, phân tách bằng · , /) → mỗi từ phải có ÍT NHẤT 1 lần được nhắc lại/áp ngược đâu đó khác
  // trong chính DESIGN-DNA.md (phần lý giải MÀU/MOTION/hoa văn...) — nếu chọn xong rồi bỏ xó
  // (không áp ngược vào lý giải thiết kế) thì từ đó chỉ tồn tại đúng 1 lần → bắt được F62.
  // Chưa có field "Mood board:" (web build trước cổng LÔ 7) → WARN mềm, không FAIL oan web cũ.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('exp.28-moodboard-khop-build', 'WARN', 'Không tìm thấy site-config.ts để kiểm'); }
  else {
    const cfgSrc = readFileSync(join(root, 'src/lib/site-config.ts'), 'utf8');
    const isRawTemplate = /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(cfgSrc);
    const dnaPath = join(root, 'DESIGN-DNA.md');
    if (isRawTemplate) { add('exp.28-moodboard-khop-build', 'PASS', 'templateweb gốc — N/A, gate chỉ áp cho web đã scaffold'); }
    else if (!existsSync(dnaPath)) { add('exp.28-moodboard-khop-build', 'WARN', 'Thiếu DESIGN-DNA.md — chưa qua cổng mood board'); }
    else {
      const dna = readFileSync(dnaPath, 'utf8');
      const dong = dna.match(/Mood board:\s*([^\n]+)/i);
      if (!dong) { add('exp.28-moodboard-khop-build', 'WARN', 'DESIGN-DNA.md chưa có dòng "Mood board:" — web build trước cổng LÔ 7, bổ sung khi tiện'); }
      else {
        const tuCamXuc = dong[1].split(/[·,/]/).map(t => t.trim()).filter(Boolean);
        const phanConLai = dna.slice(dong.index + dong[0].length);
        const khongApNguoc = tuCamXuc.filter(tu => tu.length >= 2 && !phanConLai.toLowerCase().includes(tu.toLowerCase()));
        khongApNguoc.length
          ? add('exp.28-moodboard-khop-build', 'WARN', `Mood board "${tuCamXuc.join(' · ')}" — từ [${khongApNguoc.join(', ')}] KHÔNG thấy nhắc lại ở phần lý giải MÀU/MOTION khác trong DESIGN-DNA.md — nghi chọn xong không áp ngược`)
          : add('exp.28-moodboard-khop-build', 'PASS', `Mood board "${tuCamXuc.join(' · ')}" đều được áp ngược vào lý giải thiết kế`); }
    }
  }
}

// exp.21-so-mau-that — LÔ 7 nhóm 1 (F08, 13/07/2026): exp.19-mauneo-giay (cũ: exp.30-mauneo-giay,
// đổi tên 20260714 F01b) chỉ so TÊN mẫu neo,
// không kiểm palette thật có khớp hue đã khai không. Gate này tính khoảng cách màu deltaE (CIE76,
// không cần thư viện ngoài) giữa màu hex CỨNG (không đi qua token var(--brand-h)) tìm thấy quanh
// hero/CTA trong globals.css với màu THAM CHIẾU dựng từ brandHue/brandChroma (site-config.ts) —
// bắt trường hợp component hard-code hex lệch tông so với hue Ông đã chọn (token oklch(var(--brand-h))
// luôn tự khớp nên KHÔNG cần soi — chỉ soi hex/rgb cứng nằm ngoài hệ token).
{
  // oklch(L 0-1, C, H độ) -> sRGB [0,1] (xấp xỉ chuẩn Björn Ottosson, đủ dùng để dựng màu tham chiếu).
  const oklchToSrgb = (L, C, Hdeg) => {
    const h = Hdeg * Math.PI / 180;
    const a = C * Math.cos(h), b = C * Math.sin(h);
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.2914855480 * b;
    const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
    const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
    const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
    const bl = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;
    const gam = x => x <= 0.0031308 ? 12.92 * x : 1.055 * Math.abs(x) ** (1 / 2.4) * Math.sign(x) - 0.055;
    return [r, g, bl].map(gam).map(x => Math.min(1, Math.max(0, x)));
  };
  // sRGB [0,1] -> CIE Lab (D65), công thức chuẩn — dùng để tính deltaE CIE76.
  const srgbToLab = ([r, g, b]) => {
    const lin = x => x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
    const [R, G, B] = [r, g, b].map(lin);
    const X = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
    const Y = (R * 0.2126 + G * 0.7152 + B * 0.0722) / 1.0;
    const Z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
    const f = t => t > 0.008856 ? Math.cbrt(t) : (7.787 * t + 16 / 116);
    const [fx, fy, fz] = [X, Y, Z].map(f);
    return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)];
  };
  const hexToSrgb = hex => { const n = hex.replace('#', ''); const full = n.length === 3 ? [...n].map(c => c + c).join('') : n;
    const v = parseInt(full, 16); return [(v >> 16 & 255) / 255, (v >> 8 & 255) / 255, (v & 255) / 255]; };
  const deltaE76 = (lab1, lab2) => Math.sqrt(lab1.reduce((s, v, i) => s + (v - lab2[i]) ** 2, 0));

  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const cfgPath = root ? join(root, 'src/lib/site-config.ts') : null;
  if (!root || !cfgPath || !existsSync(cfgPath) || !globalsCss) {
    add('exp.21-so-mau-that', 'PASS', 'Không có site-config.ts/globals.css nguồn — N/A');
  } else {
    const cfg = readFileSync(cfgPath, 'utf8');
    const cfgH = Number(cfg.match(/brandHue\s*:\s*([\d.]+)/)?.[1]);
    const cfgC = Number(cfg.match(/brandChroma\s*:\s*([\d.]+)/)?.[1]);
    if (!Number.isFinite(cfgH) || !Number.isFinite(cfgC)) {
      add('exp.21-so-mau-that', 'PASS', 'Không đọc được brandHue/brandChroma số — N/A (dùng namespace "Nhóm-Hue", kiểm ở exp.27)');
    } else {
      // Chỉ soi khối CSS đặt tên hero/cta/btn-primary — vùng "màu neo" Ông thấy đầu tiên trên trang.
      const khoiHeroCta = [...globalsCss.matchAll(/\.[\w-]*(?:hero|cta|btn-primary)[\w-]*\s*\{[^}]*\}/gi)].map(m => m[0]);
      const hexCung = [...new Set(khoiHeroCta.join('\n').match(/#[0-9a-fA-F]{3,6}\b/g) || [])];
      if (!hexCung.length) {
        add('exp.21-so-mau-that', 'PASS', 'Không có hex cứng ngoài hệ token oklch(var(--brand-h)) quanh hero/CTA — N/A');
      } else {
        const labThamChieu = srgbToLab(oklchToSrgb(0.55, cfgC, cfgH));
        const NGUONG = 10; // né oan do browser render/opacity/gradient overlay (yêu cầu LÔ 7)
        const lech = hexCung.map(hex => {
          const lab = srgbToLab(hexToSrgb(hex));
          return { hex, dE: Math.round(deltaE76(lab, labThamChieu) * 10) / 10 };
        }).filter(x => x.dE > NGUONG);
        lech.length
          ? add('exp.21-so-mau-that', 'WARN', `Màu hex cứng quanh hero/CTA lệch tông xa hue đã khai (brandHue=${cfgH}): ${lech.map(x => `${x.hex}(ΔE≈${x.dE})`).join(', ')} — kiểm lại có đúng chủ đích không`)
          : add('exp.21-so-mau-that', 'PASS', `${hexCung.length} màu hex cứng quanh hero/CTA đều trong ngưỡng ΔE≤${NGUONG} so hue đã khai`);
      }
    }
  }
}

{ // exp.31: archetype-ready — CẢNH BÁO nếu web build từ archetype CHƯA có bản thi công route thật.
  // Đọc archetype từ content-profile.yaml, tra dòng máy-đọc "TRẠNG THÁI:" trong ARCHETYPE.md.
  // WARN thôi (không FAIL) + phòng thủ: không tìm thấy file archetype (bản vendor đã tách khỏi
  // CODEWEB) → bỏ qua im lặng, TUYỆT ĐỐI không crash / FAIL nhầm cho web cũ.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'content-profile.yaml'))) return d; d = join(d, '..'); } return null; })();
  const profilePath = root ? join(root, 'content-profile.yaml') : null;
  if (!root || !profilePath || !existsSync(profilePath)) {
    add('exp.31-archetype-ready', 'PASS', 'Không tìm thấy content-profile.yaml — N/A, bỏ qua cổng archetype-ready');
  } else {
    const archetypeId = readFileSync(profilePath, 'utf8').match(/^archetype:\s*["']?([\w-]+)["']?/m)?.[1];
    const archetypeMdPath = archetypeId ? join(root, '..', 'CODEWEB', '04-ARCHETYPE', archetypeId, 'ARCHETYPE.md') : null;
    if (!archetypeId || !archetypeMdPath || !existsSync(archetypeMdPath)) {
      add('exp.31-archetype-ready', 'PASS', `Không định vị được ARCHETYPE.md${archetypeId ? ` cho "${archetypeId}"` : ' (chưa khai archetype)'} — bỏ qua im lặng, N/A`);
    } else {
      const trangThai = readFileSync(archetypeMdPath, 'utf8').match(/^TRẠNG THÁI:\s*(.+)$/m)?.[1]?.trim() || '';
      /CHƯA SẴN SÀNG/i.test(trangThai)
        ? add('exp.31-archetype-ready', 'WARN', `web build từ archetype "${archetypeId}" chưa có bản thi công route thật (TRẠNG THÁI: ${trangThai}) — route/nav có thể chưa chuẩn, kiểm tay`)
        : add('exp.31-archetype-ready', 'PASS', `archetype "${archetypeId}" đã SẴN SÀNG (có bản thi công route thật)`);
    }
  }
}

{ // exp.32: phaply-ton-tai — gác SỰ TỒN TẠI của BỘ TRANG PHÁP LÝ. Lời luật đòi ĐỦ BA vế
  // "Terms · Privacy · Liên hệ"; bản cũ (tới 13/08/2026) chỉ soi vế Privacy nên khai `do_phu:"mot-phan"`.
  // NÂNG 14/08/2026 (LÔ 5 nối cổng): soi đủ cả ba, rồi mới đủ tư cách khai "du".
  //
  // MỘT CỔNG — MỘT VERDICT: cố ý gom ba vế rồi phát ĐÚNG MỘT add() ở cuối, KHÔNG add() riêng từng vế.
  // Vì `regression-luat.mjs` (vá VIỆC 0, 08/08) coi một cổng phát hai verdict TRÁI NGƯỢC là lỗi —
  // PASS cho Privacy + FAIL cho Terms trong cùng id sẽ làm corpus kêu oan, và người đọc báo cáo cũng
  // không biết rốt cuộc cổng phán gì.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app'))) return d; d = join(d, '..'); } return null; })();
  if (!root) {
    add('exp.32-phaply-ton-tai', 'WARN', 'Không tìm thấy src/app để kiểm — kiểm tay bộ trang pháp lý (điều khoản · bảo mật · liên hệ)');
  } else {
    const appDir = join(root, 'src/app');
    const hasPage = (dir) => ['page.tsx', 'page.js', 'page.jsx', 'page.mdx'].some((f) => existsSync(join(dir, f)));
    const isDir = (p) => existsSync(p) && statSync(p).isDirectory();
    // F4 (audit 12/07 đợt 2): trang pháp lý có thể nằm trong route group Next.js `(legal)/` — group
    // KHÔNG đổi URL nên /chinh-sach-bao-mat vẫn chạy. Quét 1 tầng group, nếu không sẽ FAIL oan.
    const groups = readdirSync(appDir).filter((f) => f.startsWith('(') && f.endsWith(')') && isDir(join(appDir, f)));
    const basesToScan = [appDir, ...groups.map((g) => join(appDir, g))];
    // Tìm route theo BỘ TÊN hợp lệ, KHÔNG khoá cứng vào đúng 1 slug: web đặt /quyen-rieng-tu vẫn là
    // có trang, chỉ lệch chuẩn đặt tên ⇒ nhắc chứ không đánh trượt.
    const timRoute = (re, chuan) => {
      for (const base of basesToScan) {
        if (hasPage(join(base, chuan))) return { ten: chuan, chuanHoa: true };
        const alt = readdirSync(base).find((f) => re.test(f) && isDir(join(base, f)) && hasPage(join(base, f)));
        if (alt) return { ten: alt, chuanHoa: alt === chuan };
      }
      return null;
    };
    const PRIV_RE = /^(chinh-sach-bao-mat|bao-mat|quyen-rieng-tu|chinh-sach-quyen-rieng-tu|dieu-khoan-bao-mat|privacy(-policy)?)$/i;
    const TERM_RE = /^(dieu-khoan|dieu-khoan-su-dung|dieu-khoan-dich-vu|quy-dinh-su-dung|terms(-of-(service|use))?|tos)$/i;
    const LIENHE_RE = /^(lien-he|lien-he-tu-van|contact(-us)?)$/i;

    const priv = timRoute(PRIV_RE, 'chinh-sach-bao-mat');
    const term = timRoute(TERM_RE, 'dieu-khoan');
    let lienHe = timRoute(LIENHE_RE, 'lien-he');

    // VẾ LIÊN HỆ CHẤP CẢ NEO TRONG TRANG — KHÔNG đòi bắt buộc phải là route riêng. Bằng chứng thật:
    // chính 05-TEMPLATE-CHUAN đưa liên hệ thành `<section id="lien-he">` trong /ve-chung-toi, còn
    // Navbar+Footer trỏ "/ve-chung-toi#lien-he". Người dùng tới được nơi liên hệ ⇒ lời luật đã thoả;
    // đòi route riêng là chấm oan đúng cái template chuẩn của nhà máy. (Đã xác minh tay 14/08/2026.)
    let lienHeQuaNeo = false;
    if (!lienHe) {
      const NEO_RE = /\bid\s*=\s*[{]?["'](lien-he|lienhe|contact)["'][}]?/i;
      const quet = (dir, sau = 0) => {
        if (sau > 4) return false;
        for (const f of readdirSync(dir)) {
          const p = join(dir, f);
          if (isDir(p)) { if (f !== 'api' && quet(p, sau + 1)) return true; continue; }
          if (!/^page\.(tsx|jsx|js|mdx)$/.test(f)) continue;
          if (NEO_RE.test(readFileSync(p, 'utf8'))) return true;
        }
        return false;
      };
      lienHeQuaNeo = quet(appDir);
      if (lienHeQuaNeo) lienHe = { ten: 'neo #lien-he trong trang', chuanHoa: true };
    }

    const thieu = [];
    if (!priv) thieu.push('chính sách bảo mật (src/app/chinh-sach-bao-mat/page.tsx) — PDPL 2026 bắt buộc');
    if (!term) thieu.push('điều khoản sử dụng (src/app/dieu-khoan/page.tsx)');
    if (!lienHe) thieu.push('liên hệ (route /lien-he HOẶC mục id="lien-he" trong một trang)');
    const lechChuan = [priv, term, lienHe].filter((x) => x && !x.chuanHoa).map((x) => `"${x.ten}"`);

    if (thieu.length) {
      add('exp.32-phaply-ton-tai', 'FAIL', `THIẾU ${thieu.length}/3 trang pháp lý: ${thieu.join(' · ')} — không được xoá/bỏ trang pháp lý`);
    } else if (lechChuan.length) {
      add('exp.32-phaply-ton-tai', 'WARN', `Đủ 3 trang pháp lý nhưng slug lệch chuẩn: ${lechChuan.join(', ')} — nên đổi về chuẩn để đồng bộ Footer/sitemap`);
    } else {
      add('exp.32-phaply-ton-tai', 'PASS', `Đủ bộ 3 trang pháp lý: điều khoản · bảo mật · liên hệ${lienHeQuaNeo ? ' (liên hệ dạng neo trong trang)' : ''}`);
    }
  }
}

{ // dead-link.1: link nội bộ chết — A4 (audit gomnhalua 10/07/2026). Lỗi gốc: Navbar/Footer/
  // BottomNav hard-code "/ve-chung-toi" nhưng archetype scaffold ra route tên khác (vd "/ve-toi")
  // → 6 vị trí điều hướng trỏ vào trang không tồn tại. Quét SOURCE .tsx (không phải HTML build)
  // để báo được đúng file:dòng cho người sửa, đối chiếu với cây route thật trong src/app.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('deadlink.1-internal', 'WARN', 'Không tìm thấy src/app để kiểm link nội bộ'); }
  else {
    const appDir = join(root, 'src/app');
    const realRoutes = new Set(); const dynamicPrefixes = [];
    (function walk(d, urlPath) { for (const f of readdirSync(d)) {
      const p = join(d, f); if (!statSync(p).isDirectory()) continue;
      if (f.startsWith('_') || f.startsWith('.') || f === 'api') continue;
      if (f.includes('[')) { dynamicPrefixes.push(urlPath || '/'); continue; }
      const seg = f.startsWith('(') && f.endsWith(')') ? '' : `/${f}`;
      const next = urlPath + seg;
      // page.tsx = trang thường; route.ts = route handler (vd rss.xml/route.ts → /rss.xml)
      if (['page.tsx', 'page.ts', 'page.jsx', 'route.ts', 'route.tsx'].some(pf => existsSync(join(p, pf)))) realRoutes.add(next || '/');
      walk(p, next);
    }})(appDir, '');
    if (existsSync(join(appDir, 'page.tsx'))) realRoutes.add('/');
    // File đặc biệt Next.js sinh route riêng không nằm trong thư mục con: sitemap.ts→/sitemap.xml,
    // robots.ts→/robots.txt, manifest.ts→/manifest.webmanifest.
    if (existsSync(join(appDir, 'sitemap.ts'))) realRoutes.add('/sitemap.xml');
    if (existsSync(join(appDir, 'robots.ts'))) realRoutes.add('/robots.txt');
    if (existsSync(join(appDir, 'manifest.ts'))) realRoutes.add('/manifest.webmanifest');

    // F3 (audit 12/07 đợt 2): route động cấp gốc src/app/[x]/ đẩy dynamicPrefixes '/'. Nó phục vụ MỌI
    // route 1 CẤP (vd /suoi-cat-dai-lao của archetype farmstay-du-lich) — đồng bộ với exp.30: tha route
    // 1-cấp khi có catch-all/route-động gốc, vẫn FAIL route NHIỀU cấp bịa (gốc chỉ phủ 1 segment).
    const hasRootDynamic = dynamicPrefixes.some(dp => dp === '/' || dp === '');

    const srcFiles = [];
    (function walk(d){ for (const f of readdirSync(d)) {
      const p = join(d, f);
      if (statSync(p).isDirectory()) { if (!/node_modules|\.next|\.git/.test(f)) walk(p); }
      else if (/\.(tsx|jsx)$/.test(f)) srcFiles.push(p);
    }})(join(root, 'src'));

    const bad = [];
    for (const f of srcFiles) {
      const lines = readFileSync(f, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (/^\s*(\*|\/\/)/.test(line)) return; // bỏ dòng comment/JSDoc — href ví dụ trong tài liệu, không phải link thật
        // Bắt cả JSX href="..." lẫn object-literal { href: "..." } (nav config kiểu Footer/BottomNav).
        for (const m of line.matchAll(/\bhref\s*[:=]\s*"(\/[^"]*)"/g)) {
          const raw = m[1];
          if (/^\/(api|_next)\//.test(raw)) continue; // asset/route handler nội bộ, không phải page
          const route = raw.split(/[?#]/)[0] || '/';
          // Route handler hợp lệ (sitemap.ts→/sitemap.xml, rss.xml/route.ts, robots.ts→/robots.txt...) ĐÃ
          // nằm trong realRoutes dù có đuôi .xml/.txt — phải nhận là link thật TRƯỚC nhánh kiểm đuôi-asset,
          // nếu không sẽ bị bắt oan là "asset thiếu trong public/" (false-positive Footer, A4 đợt 2).
          if (realRoutes.has(route)) continue;
          if (/\.[a-z0-9]{2,5}$/i.test(route)) { // có đuôi file (.json/.jpg/...) = asset tĩnh trong public/, không phải route trang
            if (!existsSync(join(root, 'public', route))) {
              bad.push(`${f.replace(root + '/', '')}:${i + 1} → "${raw}" (asset "${route}" không tồn tại trong public/)`);
            }
            continue;
          }
          if (realRoutes.has(route)) continue;
          if (dynamicPrefixes.some(dp => route.startsWith(dp) && dp.length > 1)) continue;
          if (hasRootDynamic && route.lastIndexOf('/') === 0) continue; // F3: route 1-cấp do route động gốc phục vụ
          bad.push(`${f.replace(root + '/', '')}:${i + 1} → "${raw}" (route "${route}" không có page.tsx thật)`);
        }
      });
    }
    bad.length
      ? add('deadlink.1-internal', 'FAIL', `${bad.length} link nội bộ trỏ route không tồn tại: ${bad.slice(0, 8).join(' | ')}${bad.length > 8 ? ' …' : ''}`)
      : add('deadlink.1-internal', 'PASS', `${realRoutes.size} route thật — không có link nội bộ chết`);
  }
}

{ // e2e.33-daxac-chay — N2 (11/07/2026): bằng chứng e2e ĐÃ CHẠY THẬT trong build hiện tại.
  // Bối cảnh: từng có tình trạng "không ai biết e2e chưa chạy" — port dev lệch làm Playwright timeout
  // im lặng, test coi như xanh mà thật ra chưa chạm trang nào. Cổng này soi report Playwright:
  //  - web KHÔNG có e2e spec → PASS N/A.
  //  - có e2e mà THIẾU report / report cũ hơn build / 0 test / status != passed → WARN (không FAIL cứng
  //    vì e2e có thể chạy tách CI, không phải mọi build local đều chạy e2e).
  // Playwright luôn ghi test-results/.last-run.json ({status, failedTests}) sau mỗi lần chạy (mọi reporter);
  // nếu web bật json reporter thì có thêm playwright-report/results.json (đếm được số test).
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'playwright.config.ts')) || existsSync(join(d, 'playwright.config.js'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('e2e.33-daxac-chay', 'PASS', 'Không có playwright.config — web không dùng e2e, N/A'); }
  else {
    const e2eDir = ['e2e', 'tests', 'test'].map(x => join(root, x)).find(p => existsSync(p) && statSync(p).isDirectory());
    const specs = e2eDir ? readdirSync(e2eDir).filter(f => /\.spec\.(ts|js|tsx|jsx)$/.test(f)) : [];
    if (!specs.length) { add('e2e.33-daxac-chay', 'PASS', 'Có playwright.config nhưng không có file *.spec — không có e2e để xác minh, N/A'); }
    else {
      const lastRunPath = join(root, 'test-results', '.last-run.json');
      const resultsPath = join(root, 'playwright-report', 'results.json');
      const reportPath = existsSync(lastRunPath) ? lastRunPath : (existsSync(resultsPath) ? resultsPath : null);
      // Mốc "build": mtime của .next (nếu đã build) — bằng chứng e2e phải MỚI HƠN build này.
      const nextDir = join(root, '.next');
      const buildTime = existsSync(nextDir) ? statSync(nextDir).mtimeMs : 0;
      const canhBaoPort = ' (cổng port có thể lệch làm e2e timeout im lặng — kiểm baseURL/webServer trong playwright.config)';
      if (!reportPath) {
        add('e2e.33-daxac-chay', 'WARN', `${specs.length} file e2e spec nhưng KHÔNG thấy report (test-results/.last-run.json) — e2e CHƯA XÁC NHẬN CHẠY${canhBaoPort}`);
      } else {
        const reportTime = statSync(reportPath).mtimeMs;
        const stale = buildTime > 0 && reportTime < buildTime;
        let count = null, status = null;
        try { const rep = JSON.parse(readFileSync(reportPath, 'utf8'));
          status = rep.status ?? null;
          if (rep.stats && typeof rep.stats.expected === 'number') count = rep.stats.expected + (rep.stats.unexpected || 0) + (rep.stats.flaky || 0);
          else if (Array.isArray(rep.suites)) count = rep.suites.length;
        } catch { /* report hỏng — coi như chưa xác nhận */ }
        if (stale) {
          add('e2e.33-daxac-chay', 'WARN', `report e2e (${reportPath.split('/').slice(-2).join('/')}) CŨ HƠN .next build — e2e chạy trước lần build này, CHƯA xác nhận cho build hiện tại${canhBaoPort}`);
        } else if (count === 0) {
          add('e2e.33-daxac-chay', 'WARN', `report e2e ghi 0 test chạy — e2e KHÔNG chạm spec nào${canhBaoPort}`);
        } else if (status && status !== 'passed') {
          add('e2e.33-daxac-chay', 'WARN', `report e2e status="${status}" (không phải passed) — e2e chưa xanh, kiểm lại`);
        } else {
          add('e2e.33-daxac-chay', 'PASS', `e2e đã chạy thật${count != null ? ` (${count} test)` : ''}${status ? ` status=${status}` : ''}, report mới hơn build`);
        }
      }
    }
  }
}

{ // copy.34-chong-sao-chep — mảng D (11/07/2026): gác lớp CHỐNG SAO CHÉP đã dựng ở Đợt 9-D.
  // Chống copy là lớp phòng vệ (không chặn render, không hại SEO) nên cổng này chấm theo bậc:
  //  - schema copyrightHolder/copyrightYear (giúp search engine/AI hiểu chủ sở hữu) = CỐT LÕI → thiếu là FAIL.
  //  - fingerprint meta (copyright + x-origin trong <head>), banner anti-mirror, OG đóng dấu domain = lớp phụ → thiếu là WARN.
  // Web chưa scaffold domain thật (placeholder) vẫn phải có sẵn khung code này từ template.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  if (!root) { add('copy.34-chong-sao-chep', 'WARN', 'Không tìm được thư mục gốc — kiểm thủ công lớp chống copy'); }
  else {
    const rd = p => { const f = join(root, p); return existsSync(f) ? readFileSync(f, 'utf8') : ''; };
    const schema = rd('src/lib/schema.ts');
    const layout = rd('src/app/layout.tsx');
    const og = rd('src/app/api/og/route.tsx');
    // CỐT LÕI: schema khai copyrightHolder + copyrightYear (không chỉ chuỗi rời — phải nằm trong schema).
    const coreOk = /copyrightHolder/.test(schema) && /copyrightYear/.test(schema);
    // Lớp phụ:
    const missing = [];
    if (!(/name=["']copyright["']/.test(layout) && /name=["']x-origin["']/.test(layout))) missing.push('fingerprint <meta copyright/x-origin> trong layout.tsx');
    if (!/anti-mirror/.test(layout)) missing.push('banner anti-mirror (Script id="anti-mirror") trong layout.tsx');
    if (!/OG_DOMAIN|new URL\(SITE_URL\)\.host/.test(og)) missing.push('OG đóng dấu domain trong api/og/route.tsx');
    if (!coreOk) {
      add('copy.34-chong-sao-chep', 'FAIL', 'schema.ts THIẾU copyrightHolder/copyrightYear — search engine/AI không xác định được chủ sở hữu nội dung (cốt lõi chống copy mảng D). Bổ sung copyrightFields vào organization/website/article schema');
    } else if (missing.length) {
      add('copy.34-chong-sao-chep', 'WARN', `schema copyright OK nhưng thiếu lớp phụ chống copy: ${missing.join(' · ')} — sync từ 05-TEMPLATE-CHUAN (Đợt 9-D)`);
    } else {
      add('copy.34-chong-sao-chep', 'PASS', 'Đủ lớp chống copy mảng D: schema copyrightHolder/Year + fingerprint meta + anti-mirror + OG domain');
    }
  }
}

// ── LÔ 5 nhóm A (20260713): snapshot nội dung/route — nền cho F45 (không mất nội dung) và
// F49 (route xoá phải có redirect 301). Ghi state CHỈ khi gọi --update-snapshot (mặc định vẫn
// đọc-thuần theo đúng nguyên tắc "không sửa gì" của máy kiểm — xem header file).
{
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/app'))) return d; d = join(d, '..'); } return null; })();
  if (!root) {
    add('content.40-khong-mat-noi-dung', 'WARN', 'Không tìm thấy src/app để kiểm');
    add('seo.35-route-redirect', 'WARN', 'Không tìm thấy src/app để kiểm');
  } else {
    const snapPath = join(root, 'SO-TAY-MAY-KIEM', '.snapshot-noidung.json');
    // liệt kê route thật: thư mục dưới src/app có page.tsx/page.ts, bỏ qua api/
    const routes = [];
    (function walk(d, rel) {
      if (!existsSync(d)) return;
      for (const f of readdirSync(d)) {
        const p = join(d, f);
        let st; try { st = statSync(p); } catch { continue; }
        if (st.isDirectory()) { if (f !== 'api') walk(p, rel + '/' + f); }
        else if (f === 'page.tsx' || f === 'page.ts') routes.push(rel || '/');
      }
    })(join(root, 'src/app'), '');
    routes.sort();

    const contentPath = join(root, 'src/lib/content.ts');
    const archPath = join(root, 'src/lib/archetype-data.ts');
    const contentChars = (existsSync(contentPath) ? readFileSync(contentPath, 'utf8').length : 0)
      + (existsSync(archPath) ? readFileSync(archPath, 'utf8').length : 0);

    const prev = existsSync(snapPath) ? (() => { try { return JSON.parse(readFileSync(snapPath, 'utf8')); } catch { return null; } })() : null;

    // content.40-khong-mat-noi-dung — F45: luật "THÊM không XOÁ" trước đây 100% tự giác, không máy
    // nào đo. FAIL cứng chỉ áp khi chạy CÙNG lúc với --update-snapshot (đúng thời điểm B4 kiểm
    // trước khi ghi snapshot mới, kế hoạch LÔ 5 ghi rõ "FAIL cứng ngay sau mỗi lần commit B4");
    // check:luat chạy THƯỜNG (không cờ) giữ WARN để không chặn oan khi chưa có snapshot hoặc web
    // đang refactor hợp lệ (gộp route/rút gọn nội dung có chủ đích, sẽ giải trình trong báo cáo).
    if (!prev) {
      add('content.40-khong-mat-noi-dung', 'WARN', `Chưa có snapshot trước đó (hiện tại ${routes.length} route, ${contentChars} ký tự nội dung nguồn) — chạy --update-snapshot sau khi xác nhận nội dung hiện tại đúng để bắt đầu theo dõi`);
    } else {
      const routeDrop = prev.routeCount - routes.length;
      const charDrop = prev.contentChars - contentChars;
      const charDropPct = prev.contentChars ? charDrop / prev.contentChars : 0;
      const mat = routeDrop > 0 || charDropPct > 0.1; // mất route HOẶC giảm >10% nội dung nguồn
      if (mat) {
        const level = UPDATE_SNAPSHOT ? 'FAIL' : 'WARN';
        add('content.40-khong-mat-noi-dung', level, `So với snapshot trước (${prev.ts}): route ${prev.routeCount}→${routes.length}${routeDrop > 0 ? ` (MẤT ${routeDrop})` : ''}, nội dung ${prev.contentChars}→${contentChars} ký tự${charDrop > 0 ? ` (giảm ${(charDropPct * 100).toFixed(0)}%)` : ''} — có thể vi phạm luật THÊM-không-XOÁ, kiểm lại có chủ đích không (F45)`);
      } else {
        add('content.40-khong-mat-noi-dung', 'PASS', `Không mất route/nội dung so với snapshot trước (route ${prev.routeCount}→${routes.length}, nội dung ${prev.contentChars}→${contentChars} ký tự)`);
      }
    }

    // seo.35-route-redirect — F49: route có trong snapshot cũ nhưng biến mất ở lần chạy này phải
    // có redirect 301 tương ứng khai trong next.config.ts. WARN (không FAIL — chưa validate hết
    // mọi cú pháp redirects() có thể viết, ưu tiên an toàn tránh chặn oan; TODO Ông quyết nâng FAIL
    // khi logic đối chiếu đã được xác nhận đủ tin cậy qua vài đợt chạy thật).
    if (!prev) {
      add('seo.35-route-redirect', 'WARN', 'Chưa có snapshot trước đó để đối chiếu route bị xoá — chạy --update-snapshot để bắt đầu theo dõi');
    } else {
      const routeSet = new Set(routes);
      const bienMat = Array.isArray(prev.routes) ? prev.routes.filter(r => !routeSet.has(r)) : [];
      if (!bienMat.length) {
        add('seo.35-route-redirect', 'PASS', 'Không có route nào biến mất so với snapshot trước — N/A');
      } else {
        const cfgPath = join(root, 'next.config.ts');
        const cfgSrc = existsSync(cfgPath) ? readFileSync(cfgPath, 'utf8') : '';
        const khongCoRedirect = bienMat.filter(r => !cfgSrc.includes(r));
        khongCoRedirect.length
          ? add('seo.35-route-redirect', 'WARN', `${khongCoRedirect.length} route đã XOÁ nhưng KHÔNG thấy khai redirect 301 trong next.config.ts: ${khongCoRedirect.slice(0, 5).join(', ')} — mất SEO/backlink âm thầm, thêm redirects() (F49)`)
          : add('seo.35-route-redirect', 'PASS', `${bienMat.length} route đã xoá đều có redirect 301 khai trong next.config.ts`);
      }
    }

    if (UPDATE_SNAPSHOT) {
      try { writeFileSync(snapPath, JSON.stringify({ ts: new Date().toISOString(), routeCount: routes.length, routes, contentChars }, null, 2)); }
      catch { /* ghi snapshot lỗi không chặn kết quả kiểm luật */ }
    }
  }
}

{ // content.15-so-khoi-trangchu — F09: "≥5-6 khối nội dung phân biệt ở trang chủ" trước đây chỉ
  // dặn AI tự đếm, không máy nào đo (THAM-DINH F09). Heuristic: đếm thẻ <section trong
  // src/app/page.tsx — có thể ĐẾM THIẾU với archetype ghép khối bằng component không dùng
  // <section> (vd <Hero/>, <FaqSection/>...), nên WARN chứ không FAIL để tránh chặn oan.
  const root = (() => { let d = DIR; for (let i = 0; i < 4; i++) { if (existsSync(join(d, 'src/lib/site-config.ts'))) return d; d = join(d, '..'); } return null; })();
  const pagePath = root ? join(root, 'src/app/page.tsx') : null;
  if (!root || !pagePath || !existsSync(pagePath)) { add('content.15-so-khoi-trangchu', 'WARN', 'Không tìm thấy src/app/page.tsx để kiểm'); }
  else {
    const cfgPath = join(root, 'src/lib/site-config.ts');
    const isRawTemplate = existsSync(cfgPath) && /domain\s*:\s*["'`]\[\[CẦN-DỮ-KIỆN\]\]["'`]/.test(readFileSync(cfgPath, 'utf8'));
    if (isRawTemplate) { add('content.15-so-khoi-trangchu', 'PASS', 'templateweb gốc (domain chưa điền) — N/A, gate chỉ áp cho web đã scaffold'); }
    else {
      const pageSrc = readFileSync(pagePath, 'utf8');
      const soKhoi = (pageSrc.match(/<section[\s>]/g) || []).length;
      // Đếm thêm component viết hoa gọi trực tiếp trong return (heuristic bổ sung cho archetype
      // không dùng <section>) — chỉ để tham khảo trong thông điệp, KHÔNG cộng vào ngưỡng ≥5 chính
      // thức (tránh đếm trùng/đếm nhầm helper/wrapper không phải khối nội dung).
      soKhoi >= 5
        ? add('content.15-so-khoi-trangchu', 'PASS', `${soKhoi} khối <section> ở trang chủ (≥5)`)
        : add('content.15-so-khoi-trangchu', 'WARN', `Chỉ đếm được ${soKhoi} khối <section> ở trang chủ (<5) — nếu trang dùng component khối không phải <section> thì kiểm tay lại, máy có thể đếm thiếu (F09)`);
    }
  }
}

// --------- content.41-khong-so-lieu-bia — CHẶN NỘI DUNG BỊA QUAY LẠI KHUNG (Ông ra lệnh 04/08/2026)
// Vì sao: khung dùng chung (05-TEMPLATE-CHUAN + 04-ARCHETYPE) từng mang sẵn số liệu/nhân sự/liên hệ
// BỊA, nên MỌI web sinh ra đều thừa hưởng. xuyenvietfarmstay.vn phải gỡ cả tính năng /farmstay/[slug]
// (chạy bằng mock) và thay lại toàn bộ số liệu + đội ngũ + hotline ở /ve-chung-toi.
// Cổng soi HTML ĐÃ RENDER — tức soi đúng thứ khách nhìn thấy, không phải ý định trong mã.
// RANH GIỚI, cố ý hẹp để không báo oan: chỉ bắt mẫu ĐÃ TỪNG XUẤT HIỆN THẬT + mẫu số-liệu-marketing
// có đơn vị người/khách/tỉnh/sao. KHÔNG bắt số trung tính (giá, năm, số bài) — web thật đầy số hợp lệ.
{
  const MAU_BIA = [
    // Số liệu marketing tự chế — dạng "N+ <đơn vị người/địa bàn>" và "N.N★"
    { re: /\b\d{2,}\s*[K|k]?\+\s*(farmstay|du khách|khách hàng|người dùng|người|học viên|đối tác|dự án|tỉnh|tỉnh thành)\b/gi, ten: 'số liệu marketing tự chế' },
    { re: /\b\d{1,3}\s*(tỉnh thành|tỉnh\/thành)\b/gi, ten: 'số tỉnh thành tự chế' },
    { re: /\b[0-5][.,]\d\s*(★|sao)\b/gi, ten: 'điểm đánh giá tự chế' },
    { re: /\b\d{2,3}\s*%\s*(hài lòng|khách hàng|người dùng|quay lại)\b/gi, ten: 'tỉ lệ hài lòng tự chế' },
    // Liên hệ mẫu đã xuất hiện thật
    { re: /hello@farmstay\.vn|1800\s?6868|Farmstay\.vn Official/gi, ten: 'liên hệ mẫu bịa' },
    // Người mẫu đã xuất hiện thật trong khung
    { re: /GS\.\s*Nguyễn Văn A|Diễn giả [AB]\b|Nguyễn Thị Lan\s*[—-]|Lê Văn Hùng\s*[—-]/gi, ten: 'tên người mẫu bịa' },
    // Listing mock đã xuất hiện thật
    { re: /Đồi Chè Sunrise|Ruộng Bậc Thang Heritage|Robusta Kon Tum/gi, ten: 'dữ liệu listing mock' },
  ];
  // MIỄN TRỪ có kiểm chứng: số liệu đã được Ông xác nhận và ghi vào ENTITY-GRAPH.json (nguồn sự
  // thật DUY NHẤT của hệ sinh thái) thì KHÔNG phải số bịa. Đúc từ ca thật 06/08/2026: bài hợp tác
  // trên trandanhmanh.com ghi "17 tỉnh thành" của hành trình Xuyên Việt Farmstay 2026 — số có
  // nguồn (suKienDinhKy, gốc src/lib/xvf-2026-itinerary.ts) nhưng vẫn bị cổng bắt oan.
  // Ranh giới cố ý HẸP để không bịt lỗi thật (lesson_bo_loc_chong_bao_oan_bit_loi_that): chỉ tha
  // đúng chuỗi XUẤT HIỆN NGUYÊN VĂN trong sổ — mà chỉ Ông duyệt mới ghi được vào sổ.
  // ⚠️ PHẢI tìm cả đường NỘI BỘ repo web, không chỉ đường monorepo. Gốc bệnh đã trả giá
  // (11/08/2026, nhahoachdinh PR #25): GitHub Actions checkout repo web ĐỘC LẬP nên 3 đường
  // '../CODEWEB/...' không tồn tại ⇒ sổ rỗng ⇒ không tha gì ⇒ cổng FAIL trên CI trong khi
  // chạy local vẫn xanh (vì local có monorepo). Ca "local xanh / CI đỏ" kinh điển, chặn deploy
  // 132 commit. Đường nội bộ đặt TRƯỚC để bản vendor trong repo là nguồn máy CI đọc được.
  let soThatDaXacNhan = '';
  try {
    const fsg = await import('node:fs');
    const pg = await import('node:path');
    for (const ung of [
      'SO-TAY/ENTITY-GRAPH.json',
      'SO-TAY-MAY-KIEM/ENTITY-GRAPH.json',
      '../CODEWEB/01-LUAT/ENTITY-GRAPH.json',
      '../01-LUAT/ENTITY-GRAPH.json',
      '../../CODEWEB/01-LUAT/ENTITY-GRAPH.json',
    ]) {
      const p = pg.resolve(process.cwd(), ung);
      if (fsg.existsSync(p)) { soThatDaXacNhan = fsg.readFileSync(p, 'utf8'); break; }
    }
  } catch { /* không có sổ thì cổng chạy như cũ, không tha gì cả */ }

  const dinh = [];
  for (const { f, src } of htmls) {
    const text = src.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ');
    for (const { re, ten } of MAU_BIA) {
      re.lastIndex = 0;
      let m;
      while ((m = re.exec(text))) {
        const chuoi = m[0].trim();
        // Chuỗi có nguyên văn trong sổ thực thể ⇒ dữ kiện thật, bỏ qua và tìm tiếp
        if (soThatDaXacNhan && soThatDaXacNhan.includes(chuoi)) continue;
        dinh.push(`${f}: ${ten} — "${chuoi.slice(0, 40)}"`);
        break;
      }
    }
  }
  dinh.length === 0
    ? add('content.41-khong-so-lieu-bia', 'PASS', 'Không thấy số liệu/nhân sự/liên hệ mẫu bịa trong HTML đã render')
    : add('content.41-khong-so-lieu-bia', 'FAIL', `${dinh.length} chỗ NỘI DUNG BỊA lọt ra trang: ${dinh.slice(0, 5).join(' · ')}${dinh.length > 5 ? ` (+${dinh.length - 5})` : ''} — thay bằng dữ kiện THẬT hoặc ẩn hẳn phần đó, CẤM thay số bịa bằng số bịa khác`);
}

// --------- seo.43-sitemap-url-song — SITEMAP KHÔNG ĐƯỢC KHAI URL CHẾT (đúc từ lỗi THẬT 06/08/2026)
// Vì sao: trandanhmanh.com giữ danh sách slug VIẾT CỨNG trong sitemap.ts từ thời dựng web. Không
// slug nào trùng bài thật ⇒ sitemap khai 6 URL 404 với Google và bỏ sót TOÀN BỘ 7 bài đang sống.
// Suốt thời gian đó: build xanh · tsc sạch · check-luat 0 FAIL · từng trang thật vẫn HTTP 200 —
// KHÔNG một tín hiệu nào báo động, vì chưa cổng nào đối chiếu sitemap với trang đã build.
// Cùng họ với sự cố sitemap RỖNG 19/07 ở nhahoachdinh (Web/CLAUDE.md mục Deploy, điểm mù #3).
// Phép đo TĨNH: mỗi <loc> trong sitemap phải có tệp .html tương ứng trong thư mục build.
// Chiều ngược lại chỉ WARN — trang noindex/tiện ích được phép vắng mặt trong sitemap có chủ đích.
if (DIR && htmls.length) {
  const fsx = await import('node:fs');
  const pathx = await import('node:path');
  const fSitemap = ['sitemap.xml.body', 'sitemap.xml']
    .map(t => pathx.join(DIR, t))
    .find(p => { try { return fsx.existsSync(p) && fsx.statSync(p).isFile(); } catch { return false; } });

  if (!fSitemap) {
    add('seo.43-sitemap-url-song', 'WARN', 'Không thấy sitemap trong thư mục build — web chưa khai sitemap.ts, hoặc chạy máy kiểm trên thư mục không phải .next/server/app');
  } else {
    const xml = fsx.readFileSync(fSitemap, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
    /** URL → đường dẫn tệp html mà Next sinh ra: "/" → index.html · "/a/b" → a/b.html */
    const duongDan = (u) => {
      const p = u.replace(/^https?:\/\/[^/]+/, '').replace(/[?#].*$/, '').replace(/\/+$/, '');
      return p === '' ? 'index' : p.replace(/^\//, '');
    };
    const fileCuaUrl = (u) => pathx.join(DIR, duongDan(u) + '.html');
    // Vá 19/08/2026 — KHÔNG phải trang nào cũng có .html dựng sẵn.
    // Route DỰNG-THEO-YÊU-CẦU (Next đánh dấu ƒ Dynamic: trang có form, đọc cookie/header, hoặc
    // gọi dữ liệu lúc chạy) thì bản dựng chỉ có THƯ MỤC chứa mã xử lý, không có tệp .html. Cổng cũ
    // đòi .html nên khai oan URL đó là "trang chết ⇒ Google sẽ nhận 404", trong khi gọi thử trả 200.
    // Đã trả giá: /dang-ky-tai-tro — trang ĐĂNG KÝ TÀI TRỢ, tức trang ra tiền — bị khai là chết.
    // Có thư mục route trong bản dựng = Next CÓ dựng trang đó, chỉ là dựng lúc có người vào.
    const coRouteDong = (u) => { const d = pathx.join(DIR, duongDan(u));
      try { return fsx.existsSync(d) && fsx.statSync(d).isDirectory(); } catch { return false; } };
    const chet = locs.filter(u => !fsx.existsSync(fileCuaUrl(u)) && !coRouteDong(u));
    if (locs.length === 0) {
      add('seo.43-sitemap-url-song', 'FAIL', 'Sitemap RỖNG 0 URL — Google không nhận được trang nào (đúng sự cố 19/07/2026); kiểm hàm sitemap() có await đủ dữ liệu chưa');
    } else if (chet.length) {
      add('seo.43-sitemap-url-song', 'FAIL', `${chet.length}/${locs.length} URL trong sitemap KHÔNG có trang thật (Google sẽ nhận 404): ${chet.slice(0, 5).map(u => u.replace(/^https?:\/\/[^/]+/, '') || '/').join(' · ')}${chet.length > 5 ? ` (+${chet.length - 5})` : ''} — sinh sitemap từ chính nguồn sinh trang, đừng viết cứng danh sách slug`);
    } else {
      const trongSitemap = new Set(locs.map(u => fileCuaUrl(u)));
      const sot = htmls.map(h => pathx.join(DIR, h.f.replace(/^.*?server\/app\//, ''))).filter(f => !trongSitemap.has(f));
      chet.length === 0 && sot.length > 3
        ? add('seo.43-sitemap-url-song', 'WARN', `${locs.length} URL sitemap đều sống, nhưng ${sot.length} trang đã build KHÔNG có trong sitemap — kiểm xem có trang thật bị bỏ sót không (trang noindex/tiện ích vắng mặt là hợp lệ)`)
        : add('seo.43-sitemap-url-song', 'PASS', `${locs.length}/${locs.length} URL trong sitemap đều có trang thật đã build`);
    }
  }
}

// ---------- báo cáo ----------
// F27/F28: --only=<id,...> lọc đúng id yêu cầu (khớp CHÍNH XÁC full id, vd deadlink.1-internal).
// --source-only (không kèm --only) chỉ hiện các cổng đã VALIDATE (NGUON_THUAN_IDS) — mọi cổng
// khác bị ẩn thay vì báo PASS giả (vì htmls/csss rỗng sẽ trôi qua trót lọt = sai).
const Rout = ONLY_IDS.length ? R.filter(r => ONLY_IDS.includes(r.id))
  : SOURCE_ONLY ? R.filter(r => NGUON_THUAN_IDS.includes(r.id))
  : R;
const soAn = R.length - Rout.length;

const icon = { PASS: '✅', WARN: '⚠️ ', FAIL: '❌' };
const modeTxt = ONLY_IDS.length ? `--only=${ONLY_IDS.join(',')}` : SOURCE_ONLY ? '--source-only' : 'full';
console.log(`\n━━ CHECK-LUAT ${VERSION} [${modeTxt}] — ${DIR} — ${htmls.length} html · ${csss.length} css ━━`);
for (const r of Rout) console.log(`${icon[r.level]} [${r.id}] ${r.msg}`);
if (soAn) console.log(`\n(ẩn ${soAn} cổng chưa validate cho ${modeTxt} — chạy chế độ full sau khi build để xem đủ)`);
const n = l => Rout.filter(r => r.level === l).length;
console.log(`\nTỔNG: ${n('PASS')} PASS · ${n('WARN')} WARN · ${n('FAIL')} FAIL`);
console.log(n('FAIL') ? '→ FAIL phải sửa trước bàn giao (qa.11); WARN phải giải trình trong báo cáo.' : '→ Máy kiểm sạch. Các tiêu chí cần mắt người vẫn kiểm theo trường k trong luật.');
process.exit(n('FAIL') ? 1 : 0);
