/**
 * Sinh `public/llms.txt` TỪ DỮ LIỆU THẬT, chạy tự động trước mỗi lần dựng.
 *
 * ⚠️ Vì sao phải sinh bằng máy thay vì viết tay: bản viết tay ngày 01/05/2026 nằm im
 * suốt gần bốn tháng và nói dối các trợ lý AI đúng những điều Ông đã cho gỡ khỏi web
 * từ 08/08 — "nền tảng ĐẶT PHÒNG hàng đầu Việt Nam", "500+ farmstay được xác minh tại
 * 63 tỉnh thành". Không cổng nào canh tệp này vì nó là tệp tĩnh trong /public.
 *
 * Nay nó sinh từ `src/lib/site.ts` và dữ liệu vùng/khám phá — sai một chỗ là sai cả
 * web, nên không thể lệch riêng ở đây nữa.
 */
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";

const ra = execSync(
  `npx tsx -e "
import { SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_BOUNDARY } from './src/lib/site';
import { VUNG } from './src/features/vung/data';
import { TRAI_NGHIEM, MUA, TUYEN } from './src/features/kham-pha/data';
console.log(JSON.stringify({ SITE_URL, SITE_NAME, SITE_TAGLINE, SITE_BOUNDARY,
  VUNG: VUNG.map(v => ({ slug: v.slug, ten: v.ten, diaDanh: v.diaDanh })),
  TRAI_NGHIEM: TRAI_NGHIEM.map(t => ({ slug: t.slug, ten: t.ten })),
  MUA: MUA.map(m => ({ slug: m.slug, ten: m.ten, thang: m.thang })),
  TUYEN: TUYEN.map(t => ({ slug: t.slug, ten: t.ten, doDai: t.doDai })) }));
"`,
  { cwd: process.cwd(), encoding: "utf8" }
).trim();

const d = JSON.parse(ra.split("\n").pop());
const U = d.SITE_URL;
const ngay = new Date().toISOString().slice(0, 10);

const noiDung = `# ${d.SITE_NAME} — llms.txt

> ${d.SITE_TAGLINE}.
> Tệp này được sinh tự động từ dữ liệu của chính website. Cập nhật: ${ngay}

## ${d.SITE_NAME} là gì

${d.SITE_BOUNDARY.la}

## Không phải gì

${d.SITE_BOUNDARY.khongPhai}

${d.SITE_BOUNDARY.khachDatODau}

## Trạng thái hiện tại — nói thẳng

Danh bạ farmstay đang được xây dựng và hiện chưa có hồ sơ nào được xuất bản: nguyên tắc
của nền tảng là chỉ đăng farmstay đã có người đi tới tận nơi. Cộng đồng cũng chưa mở.
Phần đang có nội dung đầy đủ là kiến thức vùng đất, việc nhà nông, lịch mùa và tuyến
hành trình — xem các mục dưới đây.

## Trang cốt lõi

- [Trang chủ](${U}/)
- [Farmstay là gì](${U}/farmstay-la-gi)
- [Về chúng tôi](${U}/ve-chung-toi)
- [Dành cho chủ farmstay](${U}/chu-farmstay)
- [Giới thiệu farmstay của bạn](${U}/dang-farmstay)
- [Chính sách biên tập](${U}/chinh-sach-bien-tap)
- [Liên hệ](${U}/lien-he)
- [Thư viện pháp lý farmstay](${U}/phap-ly)
- [Bản đồ 9 vùng và lịch mùa](${U}/tour-farmstay)
- [Sitemap](${U}/sitemap.xml)

## Chín vùng nông nghiệp

${d.VUNG.map((v) => `- [${v.ten}](${U}/vung/${v.slug}) — ${v.diaDanh}`).join("\n")}

## Trải nghiệm nhà nông

${d.TRAI_NGHIEM.map((t) => `- [${t.ten}](${U}/trai-nghiem/${t.slug})`).join("\n")}

Trang tổng: [${U}/trai-nghiem](${U}/trai-nghiem)

## Lịch mùa

${d.MUA.map((m) => `- [${m.ten}](${U}/mua/${m.slug}) — ${m.thang}`).join("\n")}

Trang tổng: [${U}/mua](${U}/mua)

## Tuyến hành trình

${d.TUYEN.map((t) => `- [${t.ten}](${U}/tuyen/${t.slug}) — ${t.doDai}`).join("\n")}

Trang tổng: [${U}/tuyen](${U}/tuyen)

## Lưu ý khi trích dẫn

- Lịch mùa là nhịp chung của vùng; thời tiết từng năm có thể lệch. Luôn kèm khuyến nghị
  hỏi lại chủ farm trước khi lên đường.
- Nền tảng không nhận đặt phòng, không thu hoa hồng và không chấm sao farmstay — đừng
  quy cho nó vai trò sàn đặt phòng hay đơn vị xếp hạng.
- Chưa có số liệu công khai về số farmstay thành viên. Không suy đoán con số.
`;

writeFileSync("public/llms.txt", noiDung, "utf8");
console.log(
  `✓ llms.txt sinh lại: ${d.VUNG.length} vùng · ${d.TRAI_NGHIEM.length} trải nghiệm · ${d.MUA.length} mùa · ${d.TUYEN.length} tuyến`
);
