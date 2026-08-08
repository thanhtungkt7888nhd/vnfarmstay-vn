import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Thư viện Pháp lý Farmstay",
  description:
    "Hướng dẫn pháp lý đầy đủ cho chủ farmstay Việt Nam — giấy phép, quy định đất nông nghiệp, kinh doanh lưu trú.",
  alternates: { canonical: "https://vnfarmstay.vn/phap-ly" },
};

const LEGAL_DOCS = [
  {
    title: "Giấy phép kinh doanh lưu trú",
    desc: "Điều kiện, hồ sơ, thủ tục xin cấp phép kinh doanh dịch vụ lưu trú tại farmstay.",
    tag: "Cơ bản",
  },
  {
    title: "Quy định đất nông nghiệp",
    desc: "Sử dụng đất nông nghiệp kết hợp du lịch — những gì được phép và không được phép.",
    tag: "Đất đai",
  },
  {
    title: "Giấy phép xây dựng",
    desc: "Xây dựng công trình phụ trợ trên đất nông nghiệp — quy trình và giới hạn diện tích.",
    tag: "Xây dựng",
  },
  {
    title: "Phòng cháy chữa cháy",
    desc: "Tiêu chuẩn PCCC bắt buộc cho cơ sở lưu trú farmstay — kiểm tra và nghiệm thu.",
    tag: "An toàn",
  },
  {
    title: "Bảo vệ môi trường",
    desc: "Đánh giá tác động môi trường, xử lý chất thải, bảo tồn hệ sinh thái tại farmstay.",
    tag: "Môi trường",
  },
  {
    title: "Thuế & kế toán",
    desc: "Nghĩa vụ thuế, hóa đơn, kế toán đơn giản cho chủ farmstay quy mô nhỏ và vừa.",
    tag: "Tài chính",
  },
];

export default function PhapLyPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-deep)", minHeight: "80vh" }}>
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "64px 24px 80px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "5px 16px",
              borderRadius: 20,
              background: "var(--gold-dim)",
              border: "1px solid var(--gold-border)",
              fontSize: "0.75rem",
              fontWeight: 600,
              color: "var(--gold)",
              letterSpacing: "0.08em",
              marginBottom: 20,
            }}
          >
            MIỄN PHÍ • CẬP NHẬT LIÊN TỤC
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Thư viện <em style={{ color: "var(--gold)" }}>Pháp lý</em> Farmstay
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 560,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Tổng hợp đầy đủ quy định pháp luật liên quan đến kinh doanh farmstay
            tại Việt Nam — cập nhật theo luật mới nhất.
          </p>
        </section>

        {/* Docs grid */}
        <section style={{ padding: "60px 24px" }}>
          <div
            style={{
              maxWidth: 1000,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {LEGAL_DOCS.map((doc, idx) => (
              <div
                key={doc.title}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  padding: "28px 24px",
                  transition: "var(--transition)",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Số thứ tự Bodoni mờ thay icon emoji — mood board Dark Luxe
                    Editorial. aria-hidden vì đây là trang trí, không mang nghĩa. */}
                <div
                  aria-hidden="true"
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: "3.2rem",
                    fontWeight: 700,
                    lineHeight: 1,
                    color: "var(--gold)",
                    opacity: 0.16,
                    marginBottom: 4,
                  }}
                >
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 20,
                    background: "var(--gold-dim)",
                    border: "1px solid var(--gold-border)",
                    fontSize: "0.68rem",
                    fontWeight: 600,
                    color: "var(--gold)",
                    marginBottom: 12,
                    letterSpacing: "0.05em",
                  }}
                >
                  {doc.tag}
                </span>
                <h3
                  style={{
                    fontSize: "1rem",
                    fontWeight: 600,
                    color: "var(--text-primary)",
                    marginBottom: 10,
                    lineHeight: 1.4,
                  }}
                >
                  {doc.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.83rem",
                    color: "var(--text-dim)",
                    lineHeight: 1.6,
                  }}
                >
                  {doc.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          style={{
            textAlign: "center",
            padding: "0 24px 80px",
          }}
        >
          <div
            style={{
              maxWidth: 600,
              margin: "0 auto",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--gold-border)",
              padding: "48px 40px",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "1.6rem",
                fontWeight: 700,
                marginBottom: 12,
              }}
            >
              Cần tư vấn pháp lý riêng?
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: 28,
                lineHeight: 1.7,
              }}
            >
              Đội ngũ chuyên gia của vnfarmstay.vn sẵn sàng hỗ trợ bạn từng bước
              — từ lập hồ sơ đến vận hành hợp pháp.
            </p>
            <a
              href="/ve-chung-toi#lien-he"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                borderRadius: 20,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.9rem",
                transition: "var(--transition)",
              }}
            >
              Liên hệ tư vấn miễn phí →
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
