/** Trang tổng trục TRẢI NGHIỆM — cấp cha thật của `/trai-nghiem/[slug]`. */
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import { graph, collectionPageSchema, breadcrumbSchema } from "@/lib/schema";
import { TRAI_NGHIEM, layVung } from "@/features/kham-pha/data";
import { VoTrangTong } from "@/features/kham-pha/TrangTong";

export const metadata = buildMetadata({
  title: "Trải nghiệm nhà nông tại farmstay Việt Nam",
  description:
    "Sáu việc nhà nông làm thử được khi đi farmstay — hái chè, mùa cà phê, ruộng bậc thang, vườn cây ăn trái, chăn nuôi, rau hoa ôn đới.",
  canonical: "/trai-nghiem",
});

const schemas = graph([
  collectionPageSchema({
    path: "/trai-nghiem",
    name: "Trải nghiệm nhà nông tại farmstay Việt Nam",
    description: "Các việc nhà nông làm thử được khi đi farmstay.",
    items: TRAI_NGHIEM.map((t) => ({
      name: t.ten,
      url: `/trai-nghiem/${t.slug}`,
    })),
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Trải nghiệm", url: "/trai-nghiem" },
  ]),
]);

export default function TraiNghiemTongPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main id="main" style={{ background: "var(--bg-deep)" }}>
        <VoTrangTong
          kicker="Đi để làm, không chỉ để xem"
          tieuDe="Trải nghiệm nhà nông"
          dan="Sáu việc nhà nông mà một chuyến farmstay cho bạn làm thật, không phải đứng nhìn."
          moDau="Khác biệt giữa đi farmstay và đi nghỉ dưỡng nằm ở chỗ bạn có nhúng tay vào việc hay không. Mỗi trục dưới đây đi xuyên qua nhiều vùng đất: cùng một việc nhà nông, nhưng ở mỗi nơi lại làm theo một cách và vào một mùa khác nhau. Chọn việc mình muốn làm trước, rồi mới xem vùng nào và tháng nào hợp."
          muc={TRAI_NGHIEM.map((t) => ({
            href: `/trai-nghiem/${t.slug}`,
            ten: t.ten,
            tomTat: t.tomTat,
            phu: `Làm được ở ${layVung(t.vungSlugs).length} vùng`,
          }))}
          trucKhac={[
            { href: "/mua", nhan: "Xem theo mùa" },
            { href: "/tuyen", nhan: "Xem theo tuyến" },
            { href: "/tour-farmstay", nhan: "Xem bản đồ 9 vùng" },
          ]}
        />
        <div
          style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px 40px" }}
        >
          <BreadcrumbNav
            items={[{ name: "Trải nghiệm", href: "/trai-nghiem" }]}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
