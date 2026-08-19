/** Trang tổng trục MÙA — cấp cha thật của `/mua/[slug]`. */
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { buildMetadata } from "@/lib/seo";
import { ogRieng } from "@/lib/site";
import { graph, collectionPageSchema, breadcrumbSchema } from "@/lib/schema";
import { MUA, layVung } from "@/features/kham-pha/data";
import { VoTrangTong } from "@/features/kham-pha/TrangTong";

export const metadata = buildMetadata({
  title: "Lịch mùa farmstay — tháng nào đi đâu",
  description:
    "Bốn quãng mùa theo nhịp canh tác nông nghiệp Việt Nam: mùa hoa, mùa nước đổ, mùa gặt, mùa thu hoạch cà phê — và vùng nào đang vào độ đẹp.",
  canonical: "/mua",
  ogImage: ogRieng("Lịch mùa farmstay", "Tháng nào đi đâu thì gặp đúng vụ"),
});

const schemas = graph([
  collectionPageSchema({
    path: "/mua",
    name: "Lịch mùa farmstay — tháng nào đi đâu",
    description: "Bốn quãng mùa theo nhịp canh tác nông nghiệp Việt Nam.",
    items: MUA.map((m) => ({ name: m.ten, url: `/mua/${m.slug}` })),
  }),
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Lịch mùa", url: "/mua" },
  ]),
]);

export default function MuaTongPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas} />
      <main id="main" style={{ background: "var(--bg-deep)" }}>
        <VoTrangTong
          kicker="Chọn mùa trước, chọn vùng sau"
          tieuDe="Lịch mùa farmstay"
          dan="Bốn quãng trong năm, chia theo nhịp canh tác chứ không theo bốn mùa khí hậu."
          moDau="Phần lớn người Việt đi chơi theo thói quen chọn nơi trước rồi mới xem đi tháng nào. Với farmstay thì ngược lại mới đúng: cùng một đồi chè, tháng có vụ và tháng vừa đốn là hai nơi hoàn toàn khác nhau. Bốn quãng dưới đây chia theo việc nhà nông đang diễn ra, nên mỗi quãng dẫn thẳng tới những vùng đang thật sự vào độ đẹp — không phải nơi đẹp quanh năm trên ảnh."
          muc={MUA.map((m) => ({
            href: `/mua/${m.slug}`,
            ten: m.ten,
            tomTat: m.tomTat,
            phu: `${m.thang} · ${layVung(m.vungSlugs).length} vùng vào độ`,
          }))}
          trucKhac={[
            { href: "/trai-nghiem", nhan: "Xem theo việc nhà nông" },
            { href: "/tuyen", nhan: "Xem theo tuyến" },
            { href: "/tour-farmstay", nhan: "Xem bản đồ 9 vùng" },
          ]}
        />
        <div
          style={{ maxWidth: 1040, margin: "0 auto", padding: "0 24px 40px" }}
        >
          <BreadcrumbNav items={[{ name: "Lịch mùa", href: "/mua" }]} />
        </div>
      </main>
      <Footer />
    </>
  );
}
