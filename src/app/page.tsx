import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { JsonLd } from "@/shared/ui/JsonLd";
import { HomePage } from "@/features/listing/HomePage";
import { FARMSTAYS } from "@/features/listing/data";
import { KhamPhaTheoVung } from "@/features/vung/KhamPhaTheoVung";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
} from "@/lib/site";
import {
  graph,
  organizationSchema,
  websiteSchema,
  webPageSchema,
} from "@/lib/schema";

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/` },
};

/**
 * `@graph` cấp website — chỉ đặt ở trang chủ và /ve-chung-toi, không lặp toàn site.
 * `SearchAction` chỉ khai khi danh bạ CÓ dữ liệu: tìm kiếm trên tập rỗng luôn trả
 * về không kết quả, khai với Google là hứa một chức năng không tồn tại.
 */
const homeSchema = graph([
  organizationSchema(),
  websiteSchema(FARMSTAYS.length > 0),
  webPageSchema({
    path: "/",
    name: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  }),
]);

export default function Home() {
  return (
    <>
      <Navbar />
      <JsonLd schema={homeSchema} />
      <HomePage farmstays={FARMSTAYS} khoiMayChu={<KhamPhaTheoVung />} />
      <Footer />
    </>
  );
}
