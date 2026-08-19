/**
 * Trang đích theo TRẢI NGHIỆM — `/trai-nghiem/[slug]`.
 *
 * Trả lời đúng câu người tìm theo trục này đang hỏi: "hái chè thì đi đâu, làm gì,
 * cần biết trước điều gì". Nội dung là biên tập riêng, KHÔNG chép lại chữ của trang
 * vùng — trang vùng nói về một vùng đất, trang này nói xuyên qua nhiều vùng về một
 * việc nhà nông.
 *
 * Chỉ tồn tại những slug gom được ≥2 vùng thật (van `kiemTraDuDay` trong data.ts).
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
  TRAI_NGHIEM,
  timTraiNghiem,
  layVung,
  MUA,
} from "@/features/kham-pha/data";
import { KhamPhaTiep, type MucKhamPha } from "@/features/kham-pha/KhamPhaTiep";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return TRAI_NGHIEM.map((t) => ({ slug: t.slug }));
}

/** Chặn 404 mềm — xem ghi chú dài ở `/vung/[slug]`. */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tn = timTraiNghiem(slug);
  if (!tn) return { title: "Không tìm thấy trải nghiệm" };
  return buildMetadata({
    title: `${tn.ten} tại farmstay Việt Nam`,
    description: tn.tomTat,
    canonical: `/trai-nghiem/${slug}`,
    keywords: [tn.ten.toLowerCase(), "farmstay", "du lịch nông nghiệp"],
  });
}

export default async function TraiNghiemPage({ params }: Props) {
  const { slug } = await params;
  const tn = timTraiNghiem(slug);
  if (!tn) notFound();

  const vung = layVung(tn.vungSlugs);

  /* Mùa nào có ít nhất một vùng của trải nghiệm này đang trong độ đẹp. */
  const muaLienQuan = MUA.filter((m) =>
    m.vungSlugs.some((s) => tn.vungSlugs.includes(s))
  );

  const schemas = graph([
    collectionPageSchema({
      path: `/trai-nghiem/${slug}`,
      name: `${tn.ten} tại farmstay Việt Nam`,
      description: tn.tomTat,
      items: vung.map((v) => ({ name: v.ten, url: `/vung/${v.slug}` })),
    }),
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Trải nghiệm", url: "/tour-farmstay" },
      { name: tn.ten, url: `/trai-nghiem/${slug}` },
    ]),
  ]);

  const khamPhaTiep: MucKhamPha[] = [
    ...vung.map((v) => ({
      href: `/vung/${v.slug}`,
      nhan: v.ten,
      loai: "Vùng đất",
      vaySao: `Vùng có ${tn.ten.toLowerCase()} — ${v.tomTat}`,
    })),
    ...muaLienQuan.slice(0, 2).map((m) => {
      const trung = vung.filter((v) => m.vungSlugs.includes(v.slug));
      return {
        href: `/mua/${m.slug}`,
        nhan: m.ten,
        loai: "Mùa",
        vaySao: `${m.thang} — ${trung.map((v) => v.ten).join(" · ")} vào độ đẹp.`,
      };
    }),
  ];

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
          <span className="section-kicker reveal">Trải nghiệm nhà nông</span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            {tn.ten}
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 640,
              margin: "0 auto",
              lineHeight: 1.75,
            }}
          >
            {tn.tomTat}
          </p>
        </section>

        <div
          style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 88px" }}
        >
          <BreadcrumbNav
            items={[{ name: tn.ten, href: `/trai-nghiem/${slug}` }]}
          />

          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.9,
              fontSize: "1.02rem",
              marginBottom: 40,
            }}
          >
            {tn.moDau}
          </p>

          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 16,
              }}
            >
              Bạn thật sự làm gì khi tới nơi
            </h2>
            <ul style={{ display: "grid", gap: 12 }}>
              {tn.viecLam.map((v) => (
                <li
                  key={v}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius)",
                    padding: "16px 18px",
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                  }}
                >
                  {v}
                </li>
              ))}
            </ul>
          </section>

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
              Nên biết trước khi đi
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.85 }}>
              {tn.nenBiet}
            </p>
          </section>

          <KhamPhaTiep
            tieuDe="Đi tiếp từ đây"
            dan="Mỗi gợi ý dưới đây đều có lý do cụ thể, không phải danh sách ngẫu nhiên."
            muc={khamPhaTiep}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
