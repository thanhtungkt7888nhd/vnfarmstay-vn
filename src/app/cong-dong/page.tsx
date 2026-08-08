import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Cộng đồng Farmstay Việt Nam",
  description:
    "Kết nối với cộng đồng chủ farmstay và du khách — chia sẻ kinh nghiệm, hỏi đáp, sự kiện.",
  alternates: { canonical: "https://vnfarmstay.vn/cong-dong" },
};

/**
 * ⚠️ 08/08/2026 — Ông ra lệnh xoá sạch nội dung BỊA thừa hưởng từ khung web cũ.
 * Trang này từng có: 3 bài đăng ký tên người KHÔNG CÓ THẬT ("Nguyễn Văn An — Chủ Đồi Chè
 * Mộc Châu", "Trần Thị Bình — Du khách Hà Nội", "Lê Hoàng Minh — Chủ Heritage Farm Yên
 * Bái"), kèm lượt thích/bình luận tự chế (47·12 · 89·23 · 34·41), và 3 SỰ KIỆN chưa từng
 * diễn ra với ngày giờ, địa điểm cụ thể (15/05 Workshop · 22/05 Gặp mặt · 01/06 Tour).
 * Hai người trong số đó còn "kể chuyện" về đúng những farmstay giả đã xoá khỏi data.ts.
 *
 * Chat cộng đồng là hạng mục ROADMAP (cần backend + AI trả lời tự động) — chưa dựng.
 * CẤM đổ bài mẫu/sự kiện mẫu vào đây cho trang đỡ trống.
 */

export default function CongDongPage() {
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
          <h1
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Cộng đồng <em style={{ color: "var(--gold)" }}>Farmstay</em> Việt
            Nam
          </h1>
          <p
            style={{
              color: "var(--text-muted)",
              maxWidth: 520,
              margin: "0 auto 32px",
              lineHeight: 1.7,
            }}
          >
            Nơi chủ farmstay và du khách kết nối, chia sẻ, cùng nhau xây dựng
            nền du lịch nông nghiệp bền vững.
          </p>
        </section>

        <div
          style={{ maxWidth: 640, margin: "0 auto", padding: "56px 24px 80px" }}
        >
          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.8,
              textAlign: "center",
            }}
          >
            Chỗ này sẽ là nơi chủ farmstay và người đi hỏi nhau những câu rất
            thật: mùa nào nên đi, giống cây nào hợp đất, khách đông thì xoay xở
            ra sao.
          </p>
          <p
            style={{
              color: "var(--text-dim)",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Chúng tôi <strong>chưa mở</strong> — và cũng không dựng sẵn vài bài
            đăng cho có vẻ đông vui. Khi nào cộng đồng mở thật, bạn sẽ thấy nó ở
            đây.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
