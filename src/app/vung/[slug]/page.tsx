/**
 * Trang đích theo VÙNG ĐẤT — `/vung/[slug]`, dựng 19/08/2026.
 *
 * Đây KHÔNG phải lưới thẻ đổi tên tiêu đề. Mỗi trang có: phần giới thiệu riêng về
 * vùng, nông sản làm nên bản sắc, nhịp mùa vụ, việc nhà nông làm thử được, cách đi
 * và thời điểm phù hợp, cách ứng xử tôn trọng địa phương, rồi dẫn tiếp sang các vùng
 * lân cận theo khoảng cách địa lý thật.
 *
 * Danh sách farmstay của vùng hiện RỖNG (chưa có hồ sơ nào đã đi tới tận nơi) — khối
 * ấy tự ẩn và trang nói thẳng trạng thái, đúng nguyên tắc "thà nói chưa có còn hơn
 * dựng cảnh cho có vẻ đông vui". Trang vẫn đáng index vì phần biên tập vùng đất là
 * nội dung thật và hữu ích, không phụ thuộc vào việc đã có farmstay hay chưa.
 */
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import {
  graph,
  collectionPageSchema,
  breadcrumbSchema,
  type CollectionItem,
} from "@/lib/schema";
import {
  VUNG,
  timVung,
  vungLanCan,
  NGAY_CAP_NHAT_VUNG,
} from "@/features/vung/data";
import { FARMSTAYS } from "@/features/listing/data";
import {
  traiNghiemTheoVung,
  muaTheoVung,
  tuyenTheoVung,
} from "@/features/kham-pha/data";
import { KhamPhaTiep, type MucKhamPha } from "@/features/kham-pha/KhamPhaTiep";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return VUNG.map((v) => ({ slug: v.slug }));
}

/**
 * Chỉ 9 slug trong `generateStaticParams` được phục vụ; mọi slug khác trả HTTP 404 THẬT.
 *
 * ⚠️ Bắt buộc phải có dòng này. Đo 19/08/2026: khi thiếu nó, `/vung/khong-co-that`
 * trả mã **200** kèm trang "Không tìm thấy vùng" — `notFound()` một mình KHÔNG đủ,
 * vì Next vẫn dựng trang theo yêu cầu rồi trả mã thành công. Với máy tìm kiếm đó là
 * "404 mềm": nó tưởng mọi đường dẫn bịa đều là trang thật, và index cả rác.
 */
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const vung = timVung(slug);
  if (!vung) return { title: "Không tìm thấy vùng" };

  return buildMetadata({
    // Không tự nối đuôi thương hiệu vào đây: `layout.tsx` đã có khuôn
    // `%s | vnfarmstay.vn`, nối thêm sẽ thành hai đuôi chồng nhau và tiêu đề dài
    // quá mức hiển thị trên trang kết quả tìm kiếm.
    title: `Farmstay tại ${vung.ten}`,
    description: `${vung.tomTat} Nông sản: ${vung.nongSan}. ${vung.muaDep}.`,
    canonical: `/vung/${vung.slug}`,
    updatedAt: NGAY_CAP_NHAT_VUNG,
    keywords: [
      `farmstay ${vung.ten.toLowerCase()}`,
      "du lịch nông nghiệp",
      ...vung.diaDanh.split(" · ").map((d) => `farmstay ${d.toLowerCase()}`),
    ],
  });
}

export default async function VungPage({ params }: Props) {
  const { slug } = await params;
  const vung = timVung(slug);
  if (!vung) notFound();

  /* Farmstay thuộc vùng này — chưa có hồ sơ nào, nên mảng rỗng và khối tự ẩn. */
  const farmstayCuaVung: CollectionItem[] = FARMSTAYS.filter((f) =>
    vung.diaDanh.toLowerCase().includes(f.province.toLowerCase())
  ).map((f) => ({ name: f.name, url: `/farmstay/${f.slug}` }));

  const lanCan = vungLanCan(vung.slug);

  /* Mạng lưới hai chiều: trang vùng dẫn sang ba trục kia, và ba trục kia dẫn ngược
     lại đây. Mỗi liên kết kèm lý do nối — không gợi ý ngẫu nhiên để tăng lượt xem. */
  const khamPhaTiep: MucKhamPha[] = [
    ...tuyenTheoVung(vung.slug).map((t) => ({
      href: `/tuyen/${t.slug}`,
      nhan: t.ten,
      loai: "Tuyến",
      vaySao: `${vung.ten} là một điểm dừng trên tuyến này — ${t.doDai.toLowerCase()}.`,
    })),
    ...traiNghiemTheoVung(vung.slug).map((t) => ({
      href: `/trai-nghiem/${t.slug}`,
      nhan: t.ten,
      loai: "Trải nghiệm",
      vaySao: `Làm được ở ${vung.ten}, và ở cả những vùng khác cùng nghề.`,
    })),
    ...muaTheoVung(vung.slug).map((m) => ({
      href: `/mua/${m.slug}`,
      nhan: m.ten,
      loai: "Mùa",
      vaySao: `${m.thang} — quãng ${vung.ten} vào độ đẹp.`,
    })),
  ];

  const schemas = graph([
    collectionPageSchema({
      path: `/vung/${vung.slug}`,
      name: `Farmstay tại ${vung.ten}`,
      description: vung.tomTat,
      items: farmstayCuaVung,
    }),
    breadcrumbSchema([
      { name: "Trang chủ", url: "/" },
      { name: "Bản đồ vùng", url: "/tour-farmstay" },
      { name: vung.ten, url: `/vung/${vung.slug}` },
    ]),
  ]);

  const khoi = [
    { nhan: "Nông sản làm nên bản sắc", noiDung: vung.nongSan },
    { nhan: "Mùa đẹp nhất", noiDung: vung.muaDep },
    { nhan: "Cách đi và thời điểm", noiDung: vung.cachDi },
    { nhan: "Ứng xử tôn trọng địa phương", noiDung: vung.ungXu },
  ];

  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main
        id="main"
        data-su-kien-tai="route_view"
        data-sk-vung={vung.slug}
        style={{ background: "var(--bg-deep)" }}
      >
        <section
          className="plasma-bg motif-x"
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "64px 24px 72px",
            textAlign: "center",
          }}
        >
          <span className="section-kicker reveal">{vung.diaDanh}</span>
          <h1
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.9rem, 4vw, 2.9rem)",
              fontWeight: 700,
              marginBottom: 18,
              maxWidth: 820,
              margin: "0 auto 18px",
            }}
          >
            Farmstay tại {vung.ten}
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 640,
              margin: "0 auto",
              lineHeight: 1.8,
            }}
          >
            {vung.tomTat}
          </p>
        </section>

        <div
          style={{ maxWidth: 880, margin: "0 auto", padding: "36px 24px 88px" }}
        >
          <BreadcrumbNav
            items={[
              { name: "Bản đồ vùng", href: "/tour-farmstay" },
              { name: vung.ten, href: `/vung/${vung.slug}` },
            ]}
          />

          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Điều gì làm nên vùng đất này
            </h2>
            <p style={{ color: "var(--text-muted)", lineHeight: 1.9 }}>
              {vung.dacTrung}
            </p>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 18,
              }}
            >
              Cần biết trước khi đi
            </h2>
            {/* 4 thẻ ⇒ lưới 2 cột. Trước đó `minmax(260px,1fr)` cho ra 3 cột trong
                khung 880px, nên thẻ thứ tư rơi xuống một mình và để trống hai ô. */}
            <dl
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
                gap: 16,
              }}
            >
              {khoi.map((k) => (
                <div
                  key={k.nhan}
                  style={{
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "22px 20px",
                  }}
                >
                  <dt
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--gold)",
                      marginBottom: 10,
                    }}
                  >
                    {k.nhan}
                  </dt>
                  <dd
                    style={{
                      margin: 0,
                      color: "var(--text-muted)",
                      lineHeight: 1.8,
                      fontSize: "0.95rem",
                    }}
                  >
                    {k.noiDung}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <section style={{ marginBottom: 40 }}>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 14,
              }}
            >
              Việc nhà nông làm thử được ở đây
            </h2>
            <ul style={{ display: "grid", gap: 10 }}>
              {vung.viecNhaNong.map((v) => (
                <li
                  key={v}
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.8,
                    paddingLeft: 18,
                    borderLeft: "2px solid var(--gold-border)",
                  }}
                >
                  {v}
                </li>
              ))}
            </ul>
          </section>

          {/* Danh sách farmstay của vùng — hiện chưa có hồ sơ nào. */}
          <section
            style={{
              marginBottom: 40,
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius-lg)",
              padding: "26px 24px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Farmstay ở {vung.ten}
            </h2>
            {farmstayCuaVung.length > 0 ? (
              <ul style={{ display: "grid", gap: 10 }}>
                {farmstayCuaVung.map((f) => (
                  <li key={f.url}>
                    <a href={f.url} style={{ color: "var(--gold)" }}>
                      {f.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <p
                  style={{
                    color: "var(--text-muted)",
                    lineHeight: 1.85,
                    marginBottom: 16,
                  }}
                >
                  Chưa có hồ sơ farmstay nào của vùng này trên trang. Chúng ta
                  chỉ đăng những nơi đã đi tới tận nơi, nên danh sách sẽ dày lên
                  từng cái một chứ không đầy ngay.
                </p>
                <a
                  href="/dang-farmstay"
                  data-su-kien="join_ecosystem_cta_click"
                  data-sk-tu={`vung/${vung.slug}`}
                  style={{
                    display: "inline-block",
                    padding: "11px 22px",
                    borderRadius: 22,
                    border: "1px solid var(--gold-border)",
                    color: "var(--gold)",
                    fontWeight: 600,
                    fontSize: "0.88rem",
                    textDecoration: "none",
                  }}
                >
                  Bạn có farmstay ở {vung.ten}? Giới thiệu với chúng ta →
                </a>
              </>
            )}
          </section>

          {/* Điểm đến tiếp theo — chọn theo khoảng cách địa lý thật, không ngẫu nhiên */}
          <section>
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.35rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 6,
              }}
            >
              Điểm đến tiếp theo trên hành trình
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "0.9rem",
                marginBottom: 18,
              }}
            >
              Hai vùng gần {vung.ten} nhất — nối được vào cùng một chuyến đi.
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
                gap: 16,
              }}
            >
              {lanCan.map((v) => (
                <a
                  key={v.slug}
                  href={`/vung/${v.slug}`}
                  data-su-kien="related_destination_click"
                  data-sk-tu={vung.slug}
                  data-sk-den={v.slug}
                  style={{
                    display: "block",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "22px 20px",
                    textDecoration: "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.05rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      display: "block",
                      marginBottom: 8,
                    }}
                  >
                    {v.ten}
                  </span>
                  <span
                    style={{
                      color: "var(--text-muted)",
                      fontSize: "0.9rem",
                      lineHeight: 1.75,
                    }}
                  >
                    {v.tomTat}
                  </span>
                </a>
              ))}
            </div>

            <KhamPhaTiep
              tieuDe="Điểm đến tiếp theo trên hành trình"
              dan="Gợi ý theo tuyến đi, theo việc nhà nông và theo nhịp mùa — mỗi mục nói rõ vì sao nó liên quan tới vùng này."
              muc={khamPhaTiep}
            />

            <p
              style={{
                marginTop: 28,
                color: "var(--text-dim)",
                fontSize: "0.88rem",
              }}
            >
              Nội dung vùng rà soát lần cuối 19/08/2026. Lịch mùa là nhịp chung
              của vùng — thời tiết mỗi năm mỗi khác, nên hãy hỏi lại chủ farm
              trước khi đặt vé.{" "}
              <a href="/tour-farmstay" style={{ color: "var(--gold)" }}>
                Xem bản đồ đủ 9 vùng →
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
