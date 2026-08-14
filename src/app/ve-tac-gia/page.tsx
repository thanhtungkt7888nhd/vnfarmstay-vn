/**
 * Trang giới thiệu tác giả — Phạm Thanh Tùng, Nhà Hoạch Định, người sáng lập vnfarmstay.vn.
 * E-E-A-T signal quan trọng: Google cần biết ai đứng sau nội dung.
 */
import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";
import { BreadcrumbNav } from "@/shared/ui/BreadcrumbNav";
import { JsonLd } from "@/shared/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import type { WithContext, Person } from "schema-dts";

export const metadata: Metadata = {
  title: "Về tác giả — Phạm Thanh Tùng | vnfarmstay.vn",
  description:
    "Phạm Thanh Tùng — Nhà Hoạch Định, người sáng lập vnfarmstay.vn. Chuyên gia hoạch định chiến lược nông nghiệp sinh thái và du lịch nông thôn Việt Nam.",
  openGraph: {
    title: "Phạm Thanh Tùng — Nhà Hoạch Định | vnfarmstay.vn",
    description:
      "Người sáng lập vnfarmstay.vn — nền tảng du lịch nông nghiệp đích thực Việt Nam.",
    type: "profile",
  },
};

const founderSchema: WithContext<Person> = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Phạm Thanh Tùng",
  alternateName: "Nhà Hoạch Định",
  jobTitle: "Người sáng lập & Nhà Hoạch Định",
  description:
    "Người sáng lập vnfarmstay.vn — nền tảng kết nối du khách với farmstay xác minh khắp Việt Nam. Chuyên gia hoạch định chiến lược nông nghiệp sinh thái và phát triển du lịch nông thôn bền vững.",
  url: "https://vnfarmstay.vn/ve-tac-gia",
  sameAs: ["https://nhahoachdinh.vn"],
};

const schemas = [
  founderSchema,
  breadcrumbSchema([
    { name: "Trang chủ", url: "/" },
    { name: "Về tác giả", url: "/ve-tac-gia" },
  ]),
];

const expertise = [
  "Hoạch định chiến lược",
  "Nông nghiệp sinh thái",
  "Du lịch nông thôn",
  "Phát triển bền vững",
  "Mô hình farmstay",
];

export default function VeTacGiaPage() {
  return (
    <>
      <Navbar />
      <JsonLd schema={schemas as unknown as Record<string, unknown>[]} />

      <main
        id="main"
        style={{ background: "var(--bg-main)", minHeight: "100vh" }}
      >
        {/* Hero */}
        <section
          className="plasma-bg motif-x"
          style={{
            background: "var(--bg-deep)",
            borderBottom: "1px solid var(--border)",
            padding: "64px 24px 48px",
            textAlign: "center",
          }}
        >
          <div style={{ maxWidth: 720, margin: "0 auto" }}>
            <p
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                color: "var(--gold)",
                marginBottom: 16,
                textTransform: "uppercase",
              }}
            >
              Người sáng lập
            </p>
            <span className="section-kicker reveal">Người sáng lập</span>
            <h1
              className="shine reveal"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(2rem, 5vw, 3rem)",
                fontWeight: 700,
                color: "var(--text-primary)",
                lineHeight: 1.15,
                marginBottom: 12,
              }}
            >
              Phạm Thanh Tùng
            </h1>
            <p
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.1rem",
                fontStyle: "italic",
                color: "var(--gold)",
                marginBottom: 20,
              }}
            >
              Nhà Hoạch Định
            </p>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                lineHeight: 1.7,
                maxWidth: 560,
                margin: "0 auto",
              }}
            >
              Người xây dựng vnfarmstay.vn từ ý tưởng đến nền tảng — với niềm
              tin rằng du lịch nông nghiệp đích thực là tương lai của du lịch
              Việt Nam.
            </p>
          </div>
        </section>

        <div
          style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px" }}
        >
          <BreadcrumbNav
            items={[{ name: "Về tác giả", href: "/ve-tac-gia" }]}
          />

          {/* Profile card chính */}
          <article
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "48px",
              marginTop: 16,
            }}
          >
            {/* Avatar + tên */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 28,
                marginBottom: 36,
                flexWrap: "wrap",
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "var(--gold-dim)",
                  border: "2px solid var(--gold-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--font-display), serif",
                  color: "var(--gold)",
                  fontSize: "2.8rem",
                  flexShrink: 0,
                }}
              >
                X
              </div>
              <div>
                <h2
                  className="section-heading"
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: "1.6rem",
                    fontWeight: 700,
                    color: "var(--text-primary)",
                    marginBottom: 4,
                  }}
                >
                  Phạm Thanh Tùng
                </h2>
                <p
                  style={{
                    color: "var(--gold)",
                    fontSize: "1rem",
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  Nhà Hoạch Định · Người sáng lập vnfarmstay.vn
                </p>
                <a
                  href="https://nhahoachdinh.vn"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--text-dim)",
                    fontSize: "0.8rem",
                    textDecoration: "underline",
                    textUnderlineOffset: 3,
                  }}
                >
                  nhahoachdinh.vn ↗
                </a>
              </div>
            </div>

            {/* Bio */}
            <div
              style={{
                borderTop: "1px solid var(--border)",
                paddingTop: 32,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                }}
              >
                Phạm Thanh Tùng là người sáng lập và Nhà Hoạch Định đứng sau
                vnfarmstay.vn — nền tảng kết nối du khách với farmstay xác minh
                khắp Việt Nam. Với tư duy hoạch định chiến lược dài hạn, ông xây
                dựng vnfarmstay.vn không chỉ là một trang đặt phòng, mà là hệ
                sinh thái thông tin đáng tin cậy cho cả du khách lẫn chủ
                farmstay.
              </p>
              <p
                style={{
                  color: "var(--text-muted)",
                  fontSize: "1rem",
                  lineHeight: 1.8,
                }}
              >
                Mọi nội dung trên vnfarmstay.vn — từ bài review thực tế, hướng
                dẫn pháp lý, đến chiến lược vận hành — đều được hoạch định theo
                một tiêu chuẩn biên tập nhất quán: chính xác, có chiều sâu, và
                có giá trị thực cho người đọc.
              </p>
            </div>

            {/* Expertise tags */}
            <div
              style={{
                marginTop: 28,
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
              }}
            >
              {expertise.map((tag) => (
                <span
                  key={tag}
                  style={{
                    background: "rgba(212,168,83,0.1)",
                    border: "1px solid var(--gold-border)",
                    color: "var(--gold)",
                    fontSize: "0.8rem",
                    fontWeight: 600,
                    padding: "5px 14px",
                    borderRadius: 20,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Các tác giả khác — placeholder */}
          <section style={{ marginTop: 56 }} aria-label="Các tác giả khác">
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.2rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 8,
              }}
            >
              Các tác giả & chuyên gia cộng tác
            </h2>
            <p
              style={{
                color: "var(--text-dim)",
                fontSize: "1rem",
                lineHeight: 1.7,
              }}
            >
              Ngoài người sáng lập, vnfarmstay.vn cộng tác với các chuyên gia
              pháp lý, vận hành, và những chủ farmstay có kinh nghiệm thực
              chiến. Danh sách tác giả cộng tác sẽ được cập nhật tại đây.
            </p>
          </section>

          {/* CTA */}
          <section
            style={{
              marginTop: 48,
              background: "var(--bg-deep)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius)",
              padding: "40px",
              textAlign: "center",
            }}
            aria-label="Liên hệ"
          >
            <h2
              className="section-heading"
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                marginBottom: 12,
              }}
            >
              Muốn cộng tác hoặc góp ý?
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "1rem",
                maxWidth: 460,
                margin: "0 auto 24px",
                lineHeight: 1.7,
              }}
            >
              Nếu bạn là chuyên gia nông nghiệp, chủ farmstay, hoặc muốn đóng
              góp nội dung có chiều sâu — hãy liên hệ trực tiếp.
            </p>
            <a
              href="/ve-chung-toi#lien-he"
              style={{
                display: "inline-block",
                background: "var(--gold)",
                color: "#0f2318",
                fontWeight: 700,
                fontSize: "0.95rem",
                padding: "12px 28px",
                borderRadius: "var(--radius-sm)",
                textDecoration: "none",
                transition: "var(--transition)",
              }}
            >
              Liên hệ ngay
            </a>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
