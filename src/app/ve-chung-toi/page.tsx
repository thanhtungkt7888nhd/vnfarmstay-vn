import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Về chúng tôi – Farmstay.vn",
  description:
    "Farmstay.vn — nền tảng kết nối du khách với farmstay xác minh khắp Việt Nam. Sứ mệnh, đội ngũ, câu chuyện.",
  alternates: { canonical: "https://farmstay.vn/ve-chung-toi" },
};

const TEAM = [
  {
    name: "Phạm Thanh Tùng",
    role: "Nhà sáng lập & CEO",
    emoji: "🌿",
    desc: "Nhà hoạch định farmstay với 10+ năm đồng hành cùng nông dân Việt Nam.",
  },
  {
    name: "Nguyễn Thị Lan",
    role: "Giám đốc Vận hành",
    emoji: "⚙️",
    desc: "Xây dựng quy trình xác minh farmstay đạt chuẩn chất lượng cao nhất.",
  },
  {
    name: "Lê Văn Hùng",
    role: "Trưởng nhóm Công nghệ",
    emoji: "💻",
    desc: "Xây dựng nền tảng kỹ thuật đảm bảo trải nghiệm mượt mà cho 100K+ người dùng.",
  },
];

const STATS = [
  ["500+", "Farmstay xác minh"],
  ["63", "Tỉnh thành"],
  ["50K+", "Du khách tin tưởng"],
  ["4.8★", "Đánh giá trung bình"],
];

export default function VeChungToiPage() {
  return (
    <>
      <Navbar />
      <main style={{ background: "var(--bg-deep)", minHeight: "80vh" }}>
        {/* Hero */}
        <section
          style={{
            background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
            padding: "80px 24px",
            textAlign: "center",
          }}
        >
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Về <em style={{ color: "var(--gold)" }}>Farmstay.vn</em>
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 640,
              margin: "0 auto",
              lineHeight: 1.8,
              fontSize: "1.05rem",
            }}
          >
            Chúng tôi tin rằng mỗi mảnh đất nông nghiệp Việt Nam đều mang trong
            mình một câu chuyện xứng đáng được kể — và mỗi du khách xứng đáng
            được trải nghiệm điều đó.
          </p>
        </section>

        {/* Stats */}
        <section
          style={{
            padding: "60px 24px",
            borderTop: "1px solid var(--border)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(4,1fr)",
              gap: 24,
              textAlign: "center",
            }}
          >
            {STATS.map(([num, label]) => (
              <div key={label}>
                <div
                  style={{
                    fontSize: "2.2rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    fontFamily: "var(--font-playfair),serif",
                  }}
                >
                  {num}
                </div>
                <div
                  style={{
                    fontSize: "0.82rem",
                    color: "var(--text-dim)",
                    marginTop: 6,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sứ mệnh */}
        <section id="su-menh" style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair),serif",
                fontSize: "2rem",
                fontWeight: 700,
                marginBottom: 24,
              }}
            >
              Sứ mệnh của chúng tôi
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                lineHeight: 1.9,
                fontSize: "1rem",
              }}
            >
              Farmstay.vn ra đời để{" "}
              <strong style={{ color: "var(--text-primary)" }}>kết nối</strong>{" "}
              những người muốn trải nghiệm nông nghiệp đích thực với những chủ
              farmstay tâm huyết trên khắp Việt Nam — đồng thời giúp
              <strong style={{ color: "var(--text-primary)" }}>
                {" "}
                tăng thu nhập cho nông dân
              </strong>{" "}
              và
              <strong style={{ color: "var(--text-primary)" }}>
                {" "}
                bảo tồn văn hoá bản địa
              </strong>{" "}
              thông qua du lịch có trách nhiệm.
            </p>
          </div>
        </section>

        {/* Team */}
        <section id="doi-ngu" style={{ padding: "0 24px 80px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <h2
              style={{
                fontFamily: "var(--font-playfair),serif",
                fontSize: "2rem",
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 40,
              }}
            >
              Đội ngũ
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
                gap: 24,
              }}
            >
              {TEAM.map((member) => (
                <div
                  key={member.name}
                  style={{
                    background: "var(--bg-card)",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                    padding: "32px 24px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "3rem", marginBottom: 16 }}>
                    {member.emoji}
                  </div>
                  <h3
                    style={{
                      fontWeight: 700,
                      fontSize: "1rem",
                      color: "var(--text-primary)",
                      marginBottom: 6,
                    }}
                  >
                    {member.name}
                  </h3>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: "var(--gold)",
                      fontWeight: 600,
                      marginBottom: 12,
                    }}
                  >
                    {member.role}
                  </div>
                  <p
                    style={{
                      fontSize: "0.83rem",
                      color: "var(--text-dim)",
                      lineHeight: 1.6,
                    }}
                  >
                    {member.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Liên hệ */}
        <section id="lien-he" style={{ padding: "0 24px 80px" }}>
          <div
            style={{
              maxWidth: 640,
              margin: "0 auto",
              background: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--gold-border)",
              padding: "48px 40px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-playfair),serif",
                fontSize: "1.8rem",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Liên hệ với chúng tôi
            </h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 28 }}>
              Đặt câu hỏi, hợp tác, hoặc đăng ký trở thành đối tác farmstay.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                ["📧", "Email", "hello@farmstay.vn"],
                ["📞", "Hotline", "1800 6868 (miễn phí)"],
                ["💬", "Zalo", "Farmstay.vn Official"],
              ].map(([icon, label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "12px 16px",
                    borderRadius: "var(--radius-sm)",
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border)",
                  }}
                >
                  <span
                    style={{ color: "var(--text-dim)", fontSize: "0.85rem" }}
                  >
                    {icon} {label}
                  </span>
                  <span
                    style={{
                      color: "var(--text-primary)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
