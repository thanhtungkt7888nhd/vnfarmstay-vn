/** Trang tổng trục TUYẾN — cấp cha thật của `/tuyen/[slug]`. */
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import { ogRieng } from "@/lib/site";
import { graph, collectionPageSchema, breadcrumbSchema } from "@/lib/schema";
import { TUYEN, layVung } from "@/features/kham-pha/data";
import { VoTrangTong } from "@/features/kham-pha/TrangTong";

export const metadata = buildMetadata({
  title: "Tuyến hành trình farmstay Việt Nam",
  description:
    "Ba cung đường nối các vùng nông nghiệp thành một chuyến — mỗi tuyến nói rõ vì sao các điểm dừng nối được với nhau và nên đi vào quãng nào.",
  canonical: "/tuyen",
  ogImage: ogRieng(
    "Tuyến hành trình farmstay",
    "Ba cung đường nối các vùng nông nghiệp"
  ),
});

const schemas = graph([
  collectionPageSchema({
    path: "/tuyen",
    name: "Tuyến hành trình farmstay Việt Nam",
    description: "Các cung đường nối những vùng nông nghiệp thành một chuyến.",
    items: TUYEN.map((t) => ({ name: t.ten, url: `/tuyen/${t.slug}` })),
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Tuyến hành trình", url: "/tuyen" },
  ]),
]);

export default function TuyenTongPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main id="main" style={{ background: "var(--bg-deep)" }}>
        <VoTrangTong
          kicker="Một hành trình không chỉ có một điểm dừng"
          tieuDe="Tuyến hành trình"
          dan="Ba cung đường đã được biên tập, mỗi cung giải thích được vì sao các nơi trên đó nối được với nhau."
          moDau="Khách đi farmstay thường đi theo cung đường chứ không ở lì một chỗ: khách đang ở Đông Bắc sẽ hỏi đi tiếp Tây Bắc ở đâu. Vì vậy farm bên cạnh không phải đối thủ giành một lượt khách, mà là mắt xích tiếp theo của cùng một chuyến. Một tuyến chỉ có mặt ở đây khi nói được rõ vì sao các vùng của nó đi liền được với nhau — đường bộ nối tới đâu, mùa vụ có trùng quãng không. Danh sách địa danh ghép đại không phải là tuyến."
          muc={TUYEN.map((t) => ({
            href: `/tuyen/${t.slug}`,
            ten: t.ten,
            tomTat: t.tomTat,
            phu: `${t.doDai} · ${layVung(t.vungSlugs).length} điểm dừng`,
          }))}
          trucKhac={[
            { href: "/trai-nghiem", nhan: "Xem theo việc nhà nông" },
            { href: "/mua", nhan: "Xem theo mùa" },
            { href: "/tour-farmstay", nhan: "Xem bản đồ 9 vùng" },
          ]}
        />
        <div
          style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px 40px" }}
        >
          <BreadcrumbNav
            items={[{ name: "Tuyến hành trình", href: "/tuyen" }]}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
