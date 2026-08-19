/**
 * Trang đích theo MÙA — `/mua/[slug]`.
 *
 * Profile gọi lịch mùa là xương sống của cả hệ thống nội dung: người đi farmstay nên
 * CHỌN MÙA TRƯỚC rồi mới chọn vùng, ngược với thói quen đi chơi thông thường. Bốn
 * trang này phục vụ đúng thứ tự đó — vào bằng câu hỏi "tháng này đi đâu".
 *
 * Bốn quãng chia theo NHỊP CANH TÁC, không theo bốn mùa khí hậu.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import { graph, collectionPageSchema, breadcrumbSchema } from "@/lib/schema";
import { MUA, timMua, layVung, TRAI_NGHIEM } from "@/features/kham-pha/data";
import { KhamPhaTiep, type MucKhamPha } from "@/features/kham-pha/KhamPhaTiep";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return MUA.map((m) => ({ slug: m.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const mua = timMua(slug);
  if (!mua) return { title: "Không tìm thấy mùa" };
  /* Tiêu đề dùng `thang` chứ không dùng `ten` dài: máy kiểm đo được 3/4 trang mùa
     có tiêu đề 73–80 ký tự, quá ngưỡng dễ bị cắt trong kết quả tìm kiếm. */
  return buildMetadata({
    title: `Đi farmstay ${mua.thang.toLowerCase()}`,
    description: mua.tomTat,
    canonical: `/mua/${slug}`,
    keywords: ["lịch mùa farmstay", "du lịch nông nghiệp theo mùa"],
  });
}

export default async function MuaPage({ params }: Props) {
  const { slug } = await params;
  const mua = timMua(slug);
  if (!mua) notFound();

  const vung = layVung(mua.vungSlugs);
  const traiNghiemLienQuan = TRAI_NGHIEM.filter((t) =>
    t.vungSlugs.some((s) => mua.vungSlugs.includes(s))
  );

  const schemas = graph([
    collectionPageSchema({
      path: `/mua/${slug}`,
      name: `${mua.ten} — đi farmstay ở đâu`,
      description: mua.tomTat,
      items: vung.map((v) => ({ name: v.ten, url: `/vung/${v.slug}` })),
    }),
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Lịch mùa", url: "/tour-farmstay" },
      { name: mua.ten, url: `/mua/${slug}` },
    ]),
  ]);

  /* Lý do nối nêu đích danh vùng nào — xem ghi chú cùng nội dung ở `/tuyen/[slug]`. */
  const khamPhaTiep: MucKhamPha[] = traiNghiemLienQuan.slice(0, 4).map((t) => {
    const noiLam = vung.filter((v) => t.vungSlugs.includes(v.slug));
    return {
      href: `/trai-nghiem/${t.slug}`,
      nhan: t.ten,
      loai: "Trải nghiệm",
      vaySao: `Quãng này làm được ở ${noiLam.map((v) => v.ten).join(" · ")}.`,
    };
  });

  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main id="main" style={{ background: "var(--bg-deep)" }}>
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "64px 24px 72px",
            textAlign: "center",
          }}
        >
          <span className="section-kicker reveal">{mua.thang}</span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {mua.ten}
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 640,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            {mua.tomTat}
          </p>
        </section>

        <div
          style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 88px" }}
        >
          <BreadcrumbNav items={[{ name: mua.ten, href: `/mua/${slug}` }]} />

          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.9,
              fontSize: "1.02rem",
              marginBottom: 34,
            }}
          >
            {mua.moDau}
          </p>

          <section
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius-lg)",
              padding: "26px 24px",
              marginBottom: 44,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.15rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Nhịp việc nhà nông trong quãng này
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.85 }}>
              {mua.nhipViec}
            </p>
          </section>

          <section style={{ marginBottom: 12 }}>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Vùng nào đang vào độ đẹp
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                lineHeight: 1.8,
                marginBottom: 20,
                maxWidth: 660,
              }}
            >
              Lịch mùa là nhịp chung của vùng, còn thời tiết mỗi năm mỗi khác.
              Người biết chắc nhất luôn là người đang đứng trên mảnh đất đó —
              hỏi chủ farm trước khi đặt vé.
            </p>
            <div style={{ display: "grid", gap: 14 }}>
              {vung.map((v) => (
                <a
                  key={v.slug}
                  href={`/vung/${v.slug}`}
                  style={{
                    display: "block",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "22px 22px",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.1rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      marginBottom: 6,
                    }}
                  >
                    {v.ten}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: "0.78rem",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: 10,
                    }}
                  >
                    {v.diaDanh}
                  </span>
                  <span
                    style={{
                      display: "block",
                      color: "var(--text-muted)",
                      lineHeight: 1.75,
                    }}
                  >
                    {v.muaDep}
                  </span>
                </a>
              ))}
            </div>
          </section>

          <KhamPhaTiep
            tieuDe="Việc nhà nông làm được trong quãng này"
            muc={khamPhaTiep}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
