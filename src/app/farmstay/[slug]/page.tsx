/**
 * HỒ SƠ SỐ FARMSTAY — trang thực thể của một farm.
 *
 * ⚠️ Viết lại 24/08/2026 (Trụ A + C). Bản cũ là trang của một SÀN ĐẶT PHÒNG:
 * cột phải có bộ chọn ngày nhận/trả phòng, chọn số khách, nút "Đặt phòng ngay",
 * bảng tính tiền kèm **"Phí dịch vụ" 12%** và dòng "Miễn phí huỷ phòng trước 48
 * giờ · Xác nhận trong 2h". Web không nhận đặt phòng, không thu đồng nào, không
 * xác nhận gì — mỗi dòng trong đó là một lời hứa sai (Điều I + Điều VI, và điều
 * cấm số 2: cấm thu hoa hồng đặt phòng).
 *
 * Khối "Câu chuyện của chúng tôi" cũ còn tệ hơn: nó là VĂN MẪU ghép từ tên farm
 * và tên tỉnh ("<tên> ra đời từ tình yêu với mảnh đất <tỉnh>…"), dùng chung cho
 * mọi farm. Nay thay bằng `cauChuyen` — lời chủ farm, ngôi thứ nhất.
 *
 * Trang này giờ làm đúng một việc: trưng dữ kiện thật của farm, rồi DẪN KHÁCH VỀ
 * chủ farm qua kênh liên hệ của chính họ.
 */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { FARMSTAYS } from "@/features/listing/data";
import { timMua, timTraiNghiem } from "@/features/kham-pha/data";
import { timVung } from "@/features/vung/data";
import type { KenhLienHe } from "@/shared/types/farmstay";
import { dinhDangKhoangGia, nhanCapXacMinh } from "@/shared/utils/format";
import { farmstaySchema, breadcrumbSchema } from "@/lib/schema";
import { buildMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return FARMSTAYS.map((f) => ({ slug: f.slug }));
}

/**
 * Chỉ các slug farmstay CÓ THẬT được phục vụ; slug khác trả HTTP 404 thật.
 *
 * ⚠️ Máy kiểm `scripts/kiem-seo.mjs` bắt được 19/08/2026: `/farmstay/khong-co-that`
 * trả mã **200**. `notFound()` một mình không đủ — Next vẫn dựng trang theo yêu cầu
 * rồi trả mã thành công, nên máy tìm kiếm tưởng mọi đường dẫn bịa đều là trang thật.
 * Danh sách farmstay hiện rỗng, nghĩa là MỌI đường dẫn dưới /farmstay/ đều phải 404.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const farmstay = FARMSTAYS.find((f) => f.slug === slug);
  if (!farmstay) return { title: "Không tìm thấy farmstay" };
  const vung = timVung(farmstay.vungSlug);
  return buildMetadata({
    title: farmstay.ten,
    description: `Hồ sơ ${farmstay.ten} tại ${farmstay.diaChi}, ${farmstay.tinh}${
      vung ? ` — ${vung.ten}` : ""
    }. Mùa vụ, đường đi, ứng xử tại chỗ và kênh liên hệ trực tiếp chủ farm.`,
    canonical: `/farmstay/${farmstay.slug}`,
    keywords: [farmstay.tinh, vung?.ten ?? "", "farmstay"].filter(Boolean),
  });
}

/** Đường dẫn bấm được của một kênh liên hệ — điện thoại thành `tel:`, Zalo thành link Zalo */
function duongDanKenh(k: KenhLienHe): string {
  const gt = k.giaTri.trim();
  if (k.loai === "dien-thoai") return `tel:${gt.replace(/[^\d+]/g, "")}`;
  if (k.loai === "zalo") {
    return /^https?:\/\//.test(gt)
      ? gt
      : `https://zalo.me/${gt.replace(/[^\d]/g, "")}`;
  }
  return gt;
}

const NHAN_KENH: Record<KenhLienHe["loai"], string> = {
  zalo: "Nhắn Zalo cho chủ farm",
  "dien-thoai": "Gọi chủ farm",
  "web-rieng": "Mở web riêng của farm",
  "google-business": "Xem hồ sơ Google của farm",
};

/** Kênh dẫn ra NGOÀI web — cần rel an toàn và tên sự kiện đo riêng */
function laKenhNgoai(loai: KenhLienHe["loai"]): boolean {
  return loai === "web-rieng" || loai === "google-business";
}

export default async function FarmstayDetailPage({ params }: Props) {
  const { slug } = await params;
  const farmstay = FARMSTAYS.find((f) => f.slug === slug);
  if (!farmstay) notFound();

  const vung = timVung(farmstay.vungSlug);
  const cap = nhanCapXacMinh(farmstay.capXacMinh);
  const anhDau = farmstay.anh[0];
  const url = `${SITE_URL}/farmstay/${farmstay.slug}`;
  const webRieng = farmstay.lienHe.find((k) => k.loai === "web-rieng")?.giaTri;
  const soDienThoai = farmstay.lienHe.find(
    (k) => k.loai === "dien-thoai"
  )?.giaTri;

  const schemas = [
    farmstaySchema({
      /* Mã định danh cố định — Master Prompt mục 7: mỗi farm là một thực thể */
      id: `${url}#place`,
      name: farmstay.ten,
      description: farmstay.cauChuyen,
      url,
      imageUrl: anhDau.url.startsWith("http")
        ? anhDau.url
        : `${SITE_URL}${anhDau.url}`,
      address: farmstay.diaChi,
      province: farmstay.tinh,
      geo: farmstay.toaDo,
      khoangGia: farmstay.giaThamKhao
        ? {
            tuVND: farmstay.giaThamKhao.tuVND,
            denVND: farmstay.giaThamKhao.denVND,
          }
        : undefined,
      officialUrl: webRieng,
      telephone: soDienThoai,
    }),
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      ...(vung ? [{ name: vung.ten, url: `/vung/${vung.slug}` }] : []),
      { name: farmstay.ten, url: `/farmstay/${farmstay.slug}` },
    ]),
  ];

  /* Chữ tiêu đề chung cho mọi khối — gom một chỗ để nhịp thị giác đều nhau */
  const kieuH2: React.CSSProperties = {
    fontFamily: "var(--font-display),serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: "var(--text-primary)",
    marginBottom: 16,
  };
  const kieuKhoi: React.CSSProperties = {
    paddingTop: 32,
    paddingBottom: 36,
    borderBottom: "1px solid var(--border)",
  };

  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />

      <main
        id="main"
        data-su-kien-tai="farmstay_profile_view"
        style={{ background: "var(--bg-deep)" }}
      >
        {/* ── HERO: ảnh THỰC ĐỊA, không còn nền gradient theo 3 miền ── */}
        <div style={{ position: "relative", height: 480, overflow: "hidden" }}>
          <Image
            src={anhDau.url}
            alt={anhDau.moTa}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(15,35,24,0.96) 0%, rgba(15,35,24,0.25) 55%, rgba(15,35,24,0.35) 100%)",
            }}
          />

          {/* Cấp xác minh — thay huy hiệu nhị phân "✓ XÁC MINH" cũ */}
          <span
            style={{
              position: "absolute",
              top: 24,
              left: 24,
              padding: "5px 14px",
              borderRadius: 4,
              fontSize: "0.72rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              background: "var(--gold)",
              color: "var(--bg-deep)",
            }}
          >
            {cap.nhanNgan}
          </span>

          <div
            style={{ position: "absolute", bottom: 32, left: 32, right: 32 }}
          >
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                color: "var(--gold)",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              {farmstay.diaChi} · {farmstay.tinh}
              {vung ? ` · ${vung.ten}` : ""}
            </p>
            <h1
              className="shine reveal"
              style={{
                fontFamily: "var(--font-display),serif",
                fontSize: "clamp(1.8rem,4vw,2.8rem)",
                fontWeight: 700,
                color: "#fff",
                lineHeight: 1.15,
                marginBottom: 12,
                maxWidth: 680,
              }}
            >
              {farmstay.ten}
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "0.9rem",
                maxWidth: 680,
              }}
            >
              {cap.nhanDay}
            </p>
          </div>
        </div>

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 24px 80px",
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 48,
            alignItems: "start",
          }}
          className="detail-grid"
        >
          {/* ── CỘT TRÁI: dữ kiện thật của farm ── */}
          <div>
            <div style={{ paddingTop: 36 }}>
              <BreadcrumbNav
                items={
                  vung
                    ? [{ name: vung.ten, href: `/vung/${vung.slug}` }]
                    : [{ name: "Tìm kiếm", href: "/tim-kiem" }]
                }
              />
            </div>

            {/* Câu chuyện — LỜI CHỦ FARM, không phải văn mẫu ghép tên tỉnh */}
            <section style={{ ...kieuKhoi, marginTop: 8, paddingTop: 0 }}>
              <h2 style={kieuH2}>Câu chuyện của chủ farm</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.85,
                  fontSize: "1rem",
                  whiteSpace: "pre-line",
                }}
              >
                {farmstay.cauChuyen}
              </p>
            </section>

            {/* Lịch mùa vụ — mỗi mùa nối sang trang mùa tương ứng */}
            <section style={kieuKhoi}>
              <h2 style={kieuH2}>Mùa nào tới thì có gì</h2>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 14 }}
              >
                {farmstay.lichMuaVu.map((m) => {
                  const mua = timMua(m.muaSlug);
                  return (
                    <div
                      key={m.muaSlug}
                      style={{
                        background: "var(--bg-card)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-sm)",
                        padding: "16px 20px",
                      }}
                    >
                      <Link
                        href={`/mua/${m.muaSlug}`}
                        style={{
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          color: "var(--gold)",
                          textTransform: "uppercase",
                          textDecoration: "none",
                        }}
                      >
                        {mua?.ten ?? m.muaSlug}
                      </Link>
                      <p
                        style={{
                          marginTop: 6,
                          fontSize: "0.92rem",
                          color: "var(--text-muted)",
                          lineHeight: 1.7,
                        }}
                      >
                        {m.coGi}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Trải nghiệm — nối vào trục "làm gì" của web */}
            {farmstay.traiNghiemSlugs.length > 0 && (
              <section style={kieuKhoi}>
                <h2 style={kieuH2}>Trải nghiệm nông nghiệp tại đây</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(200px, 1fr))",
                    gap: 12,
                  }}
                >
                  {farmstay.traiNghiemSlugs.map((tn) => {
                    const t = timTraiNghiem(tn);
                    return (
                      <Link
                        key={tn}
                        href={`/trai-nghiem/${tn}`}
                        style={{
                          background: "var(--bg-card)",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          textDecoration: "none",
                        }}
                      >
                        {/* Chấm gold thay icon emoji (LUẬT no-emoji) */}
                        <span
                          aria-hidden="true"
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: "var(--gold)",
                            flexShrink: 0,
                          }}
                        />
                        <span
                          style={{
                            fontSize: "0.88rem",
                            color: "var(--text-muted)",
                            fontWeight: 500,
                          }}
                        >
                          {t?.ten ?? tn.replace(/-/g, " ")}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Đường đi + Ứng xử — hai trường bắt buộc của Master Prompt */}
            <section style={kieuKhoi}>
              <h2 style={kieuH2}>Đường tới farm</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.85,
                  fontSize: "1rem",
                }}
              >
                {farmstay.duongDi}
              </p>
            </section>

            <section style={kieuKhoi}>
              <h2 style={kieuH2}>Ứng xử tại chỗ</h2>
              <p
                style={{
                  color: "var(--text-muted)",
                  lineHeight: 1.85,
                  fontSize: "1rem",
                }}
              >
                {farmstay.ungXu}
              </p>
            </section>

            {/* Ảnh thực địa còn lại — ảnh đầu đã dùng làm hero */}
            {farmstay.anh.length > 1 && (
              <section style={{ ...kieuKhoi, borderBottom: "none" }}>
                <h2 style={kieuH2}>Ảnh thực địa</h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: 12,
                  }}
                >
                  {farmstay.anh.slice(1).map((a) => (
                    <figure key={a.url} style={{ margin: 0 }}>
                      <div
                        style={{
                          position: "relative",
                          aspectRatio: "4/3",
                          borderRadius: "var(--radius-sm)",
                          overflow: "hidden",
                          border: "1px solid var(--border)",
                        }}
                      >
                        <Image
                          src={a.url}
                          alt={a.moTa}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          style={{ objectFit: "cover" }}
                        />
                      </div>
                      <figcaption
                        style={{
                          marginTop: 6,
                          fontSize: "0.78rem",
                          color: "var(--text-dim)",
                          lineHeight: 1.5,
                        }}
                      >
                        {a.moTa}
                        {a.nguoiChup ? ` — ảnh: ${a.nguoiChup}` : ""}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── CỘT PHẢI: LIÊN HỆ TRỰC TIẾP — thay trọn bộ máy đặt phòng cũ ── */}
          <div style={{ paddingTop: 36 }}>
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                padding: "28px",
                position: "sticky",
                top: 82,
                boxShadow: "var(--shadow)",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display),serif",
                  fontSize: "1.15rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 6,
                }}
              >
                Liên hệ thẳng chủ farm
              </h2>
              {/* Nói rõ ranh giới NGAY chỗ khách sắp bấm — không giấu xuống chân trang */}
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "var(--text-dim)",
                  lineHeight: 1.6,
                  marginBottom: 20,
                }}
              >
                vnfarmstay.vn không nhận đặt phòng và không thu hoa hồng. Mọi
                thoả thuận là giữa bạn và chủ farm.
              </p>

              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {farmstay.lienHe.map((k, i) => {
                  const ngoai = laKenhNgoai(k.loai);
                  const chinh = i === 0;
                  return (
                    <a
                      key={`${k.loai}-${k.giaTri}`}
                      href={duongDanKenh(k)}
                      /* Tên sự kiện đã khai sẵn trong `src/lib/do-luong.ts` từ lâu
                         mà chưa nút nào gắn ⇒ chưa bắn lần nào. Nay gắn thật. */
                      data-su-kien={
                        ngoai
                          ? "external_booking_click"
                          : "direct_contact_click"
                      }
                      data-sk-kenh={k.loai}
                      data-sk-farm={farmstay.slug}
                      {...(ngoai
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: chinh ? "15px" : "13px",
                        borderRadius: 20,
                        textAlign: "center",
                        textDecoration: "none",
                        fontWeight: chinh ? 700 : 600,
                        fontSize: chinh ? "0.95rem" : "0.88rem",
                        letterSpacing: "0.02em",
                        transition: "var(--transition)",
                        background: chinh ? "var(--gold)" : "transparent",
                        color: chinh ? "var(--bg-deep)" : "var(--text-muted)",
                        border: chinh ? "none" : "1px solid var(--border)",
                      }}
                    >
                      {k.nhan ?? NHAN_KENH[k.loai]}
                    </a>
                  );
                })}
              </div>

              {/* Giá THAM KHẢO — chỉ hiện khi chủ farm có cấp, kèm ngày cập nhật */}
              {farmstay.giaThamKhao && (
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: "1px solid var(--border)",
                  }}
                >
                  <p
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: "var(--text-dim)",
                      marginBottom: 4,
                    }}
                  >
                    GIÁ THAM KHẢO
                  </p>
                  <p
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                    }}
                  >
                    {dinhDangKhoangGia(
                      farmstay.giaThamKhao.tuVND,
                      farmstay.giaThamKhao.denVND
                    )}
                  </p>
                  <p
                    style={{
                      fontSize: "0.73rem",
                      color: "var(--text-dim)",
                      marginTop: 4,
                      lineHeight: 1.5,
                    }}
                  >
                    Chủ farm cập nhật ngày {farmstay.giaThamKhao.ngayCapNhat}.
                    Hỏi lại chủ farm trước khi đi.
                  </p>
                </div>
              )}
            </div>

            {/* Xuất xứ dữ kiện — Điều IV: mọi dữ kiện truy được về nguồn */}
            <div
              style={{
                marginTop: 16,
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-sm)",
                padding: "20px 24px",
              }}
            >
              <p
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: "var(--text-dim)",
                  marginBottom: 10,
                }}
              >
                HỒ SƠ NÀY DỰA TRÊN ĐÂU
              </p>
              <dl
                style={{
                  margin: 0,
                  fontSize: "0.8rem",
                  color: "var(--text-muted)",
                  lineHeight: 1.7,
                }}
              >
                <div>
                  <dt style={{ display: "inline", color: "var(--text-dim)" }}>
                    Cấp xác minh:{" "}
                  </dt>
                  <dd style={{ display: "inline", margin: 0 }}>
                    <Link
                      href="/phuong-phap-xac-minh"
                      style={{ color: "var(--gold)" }}
                    >
                      {cap.nhanDay}
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt style={{ display: "inline", color: "var(--text-dim)" }}>
                    Nguồn dữ kiện:{" "}
                  </dt>
                  <dd style={{ display: "inline", margin: 0 }}>
                    {farmstay.nguon.replace(/-/g, " ")}
                  </dd>
                </div>
                <div>
                  <dt style={{ display: "inline", color: "var(--text-dim)" }}>
                    Lấy ngày:{" "}
                  </dt>
                  <dd style={{ display: "inline", margin: 0 }}>
                    {farmstay.ngayDo}
                  </dd>
                </div>
                <div>
                  <dt style={{ display: "inline", color: "var(--text-dim)" }}>
                    Rà soát gần nhất:{" "}
                  </dt>
                  <dd style={{ display: "inline", margin: 0 }}>
                    {farmstay.ngayRaSoat}
                  </dd>
                </div>
              </dl>
              {/* Nói cả thứ cấp này KHÔNG bảo đảm — Điều V */}
              <p
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid var(--border)",
                  fontSize: "0.75rem",
                  color: "var(--text-dim)",
                  lineHeight: 1.6,
                }}
              >
                Cấp này <strong>không</strong> bảo đảm: {cap.khongBaoDam}
              </p>
              <p style={{ marginTop: 10 }}>
                <Link
                  href={`/lien-he?ve=${encodeURIComponent(farmstay.slug)}`}
                  style={{ fontSize: "0.78rem", color: "var(--gold)" }}
                >
                  Thấy thông tin sai? Báo cho chúng tôi →
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 768px) {
          .detail-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
