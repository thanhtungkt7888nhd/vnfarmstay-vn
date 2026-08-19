/**
 * Trang đích theo TUYẾN HÀNH TRÌNH — `/tuyen/[slug]`.
 *
 * "Một hành trình không chỉ có một điểm dừng" — khách du lịch nông nghiệp đi theo
 * tuyến chứ không ở một chỗ, nên đây là trục dẫn khách đi tiếp, và cũng là cơ chế
 * giới thiệu chéo giữa các thành viên trong tương lai.
 *
 * ⚠️ Mỗi tuyến BẮT BUỘC có trường `vaySaoNoiDuoc` — nếu không giải thích được vì sao
 * các vùng này nối được với nhau thì đó chỉ là một danh sách ngẫu nhiên đội lốt tuyến,
 * đúng thứ bản đặt hàng cấm ("không tạo route hời hợt chỉ để có schema").
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import { graph, collectionPageSchema, breadcrumbSchema } from "@/lib/schema";
import {
  TUYEN,
  timTuyen,
  layVung,
  TRAI_NGHIEM,
} from "@/features/kham-pha/data";
import { KhamPhaTiep, type MucKhamPha } from "@/features/kham-pha/KhamPhaTiep";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TUYEN.map((t) => ({ slug: t.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const t = timTuyen(slug);
  if (!t) return { title: "Không tìm thấy tuyến" };
  return buildMetadata({
    title: `${t.ten} — hành trình farmstay`,
    description: t.tomTat,
    canonical: `/tuyen/${slug}`,
    keywords: ["tuyến farmstay", "hành trình du lịch nông nghiệp"],
  });
}

export default async function TuyenPage({ params }: Props) {
  const { slug } = await params;
  const tuyen = timTuyen(slug);
  if (!tuyen) notFound();

  const vung = layVung(tuyen.vungSlugs);
  const traiNghiemTrenTuyen = TRAI_NGHIEM.filter((t) =>
    t.vungSlugs.some((s) => tuyen.vungSlugs.includes(s))
  );

  const schemas = graph([
    collectionPageSchema({
      path: `/tuyen/${slug}`,
      name: `${tuyen.ten} — hành trình farmstay`,
      description: tuyen.tomTat,
      items: vung.map((v) => ({ name: v.ten, url: `/vung/${v.slug}` })),
    }),
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Tuyến hành trình", url: "/tour-farmstay" },
      { name: tuyen.ten, url: `/tuyen/${slug}` },
    ]),
  ]);

  /* Lý do nối phải CỤ THỂ tới từng mục — nêu đích danh điểm dừng nào làm được việc
     ấy. Bản đầu dùng chung một câu "làm được ở ít nhất một điểm dừng" cho cả bốn thẻ:
     đó là lý do chung chung, không giúp người đọc quyết định gì, và tự vi phạm chính
     nguyên tắc "mỗi liên kết phải kèm lý do nối". */
  const khamPhaTiep: MucKhamPha[] = traiNghiemTrenTuyen.slice(0, 4).map((t) => {
    const diemDung = vung.filter((v) => t.vungSlugs.includes(v.slug));
    return {
      href: `/trai-nghiem/${t.slug}`,
      nhan: t.ten,
      loai: "Trải nghiệm",
      vaySao:
        diemDung.length === 1
          ? `Làm được ở chặng ${diemDung[0].ten}.`
          : `Làm được ở ${diemDung.length} chặng: ${diemDung.map((v) => v.ten).join(" · ")}.`,
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
          <span className="section-kicker reveal">
            {tuyen.doDai} · {vung.length} điểm dừng
          </span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {tuyen.ten}
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 640,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            {tuyen.tomTat}
          </p>
        </section>

        <div
          style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 88px" }}
        >
          <BreadcrumbNav
            items={[{ name: tuyen.ten, href: `/tuyen/${slug}` }]}
          />

          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.9,
              fontSize: "1.02rem",
              marginBottom: 34,
            }}
          >
            {tuyen.moDau}
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 16,
              marginBottom: 44,
            }}
          >
            <section
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--gold-border)",
                borderRadius: "var(--radius-lg)",
                padding: "24px 22px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 10,
                }}
              >
                Vì sao ba nơi này nối được với nhau
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                {tuyen.vaySaoNoiDuoc}
              </p>
            </section>
            <section
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "24px 22px",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  marginBottom: 10,
                }}
              >
                Đi vào quãng nào
              </h2>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.8 }}>
                {tuyen.muaHop}
              </p>
            </section>
          </div>

          <section>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 20,
              }}
            >
              Các điểm dừng theo thứ tự
            </h2>
            <ol style={{ display: "grid", gap: 14, listStyle: "none" }}>
              {vung.map((v, i) => (
                <li key={v.slug}>
                  <a
                    href={`/vung/${v.slug}`}
                    style={{
                      display: "flex",
                      gap: 16,
                      alignItems: "flex-start",
                      background: "var(--bg-card)",
                      border: "1px solid var(--border)",
                      borderRadius: "var(--radius-lg)",
                      padding: "22px 22px",
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        fontFamily: "var(--font-display), serif",
                        fontSize: "1.4rem",
                        fontWeight: 700,
                        color: "var(--gold)",
                        lineHeight: 1,
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ display: "block" }}>
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
                          color: "var(--text-muted)",
                          lineHeight: 1.75,
                        }}
                      >
                        {v.tomTat}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ol>
          </section>

          <KhamPhaTiep tieuDe="Làm gì trên đường đi" muc={khamPhaTiep} />
        </div>
      </main>
      <Footer />
    </>
  );
}
