import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

/**
 * ⚠️ 08/08/2026 — Ông ra lệnh gỡ nội dung BỊA thừa hưởng từ khung web cũ ở trang này:
 * · khối `STATS` (500+ Farmstay xác minh · 63 Tỉnh thành · 50K+ Du khách tin tưởng ·
 *   4.8★ Đánh giá trung bình) — toàn bộ tự chế, đã gỡ, KHÔNG thay bộ số khác.
 * · khối `TEAM` — Ông xác nhận "Nguyễn Thị Lan" và "Lê Văn Hùng" là người KHÔNG CÓ THẬT.
 *   Còn lại một mình Phạm Thanh Tùng thì không gọi là "đội ngũ" được, nên gộp vào phần
 *   sứ mệnh. CẤM dựng lại khối đội ngũ bằng tên tự nghĩ ra.
 */
export const metadata: Metadata = {
  title: "Về chúng tôi – vnfarmstay.vn",
  description:
    "vnfarmstay.vn — giới thiệu farmstay Việt Nam và kể câu chuyện của những vùng đất nông nghiệp. Sứ mệnh và người đứng sau.",
  alternates: { canonical: "https://vnfarmstay.vn/ve-chung-toi" },
};

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
            className="shine reveal"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            Về <em style={{ color: "var(--gold)" }}>vnfarmstay.vn</em>
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

        {/* Sứ mệnh */}
        <section id="su-menh" style={{ padding: "80px 24px" }}>
          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <h2
              style={{
                fontFamily: "var(--font-display),serif",
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
              vnfarmstay.vn ra đời để{" "}
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
            <p
              style={{
                color: "var(--text-dim)",
                lineHeight: 1.8,
                fontSize: "0.92rem",
                marginTop: 28,
              }}
            >
              Người khởi xướng và đứng sau vnfarmstay.vn là{" "}
              <strong style={{ color: "var(--text-muted)" }}>
                Phạm Thanh Tùng
              </strong>{" "}
              — Nhà Hoạch Định.
            </p>
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
                fontFamily: "var(--font-display),serif",
                fontSize: "1.8rem",
                fontWeight: 700,
                marginBottom: 16,
              }}
            >
              Liên hệ với chúng tôi
            </h2>
            {/* ⚠️ 08/08/2026 — Ông xác nhận CẢ BA kênh cũ đều KHÔNG CÓ THẬT, đã gỡ:
                email hello@vnfarmstay.vn · hotline "1800 6868 (miễn phí)" ·
                Zalo "vnfarmstay.vn Official". Để người ta gọi vào số không tồn tại
                hoặc gửi thư vào hòm thư không ai đọc còn tệ hơn là nói thẳng chưa có.
                Khi Ông cấp kênh THẬT thì đặt lại vào đúng chỗ này. */}
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: 0,
                lineHeight: 1.8,
              }}
            >
              Kênh liên hệ chính thức của vnfarmstay.vn đang được mở. Khi có,
              địa chỉ sẽ được đăng ngay tại đây — chúng tôi không muốn để lại
              một số điện thoại hay hòm thư mà bạn gọi vào lại không có ai.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
