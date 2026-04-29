import type { Metadata } from "next";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

export const metadata: Metadata = {
  title: "Cộng đồng Farmstay Việt Nam",
  description:
    "Kết nối với cộng đồng chủ farmstay và du khách — chia sẻ kinh nghiệm, hỏi đáp, sự kiện.",
  alternates: { canonical: "https://farmstay.vn/cong-dong" },
};

const POSTS = [
  {
    avatar: "🌿",
    author: "Nguyễn Văn An",
    role: "Chủ Đồi Chè Mộc Châu",
    time: "2 giờ trước",
    content:
      "Mùa chè tháng 4 đẹp lắm anh chị ơi! Lá chè mới búp, màu xanh non mướt. Farmstay mình đang có khuyến mãi 20% cho đoàn từ 4 người. Ai muốn trải nghiệm hái chè buổi sáng sớm thì inbox nhé!",
    likes: 47,
    comments: 12,
    tag: "Chia sẻ",
  },
  {
    avatar: "☕",
    author: "Trần Thị Bình",
    role: "Du khách · Hà Nội",
    time: "5 giờ trước",
    content:
      "Vừa về từ Kon Tum. Vườn cà phê Robusta tuyệt vời, buổi sáng ngồi uống cà phê vừa rang ngay tại chỗ, nhìn ra đồi cà phê — trải nghiệm không thể quên. Cảm ơn anh chủ đã chỉ tận tình cách rang!",
    likes: 89,
    comments: 23,
    tag: "Review",
  },
  {
    avatar: "🌾",
    author: "Lê Hoàng Minh",
    role: "Chủ Heritage Farm Yên Bái",
    time: "1 ngày trước",
    content:
      "Hỏi anh chị chủ farmstay: Mọi người dùng phần mềm gì để quản lý đặt phòng? Hiện tại mình đang ghi tay vào sổ, khách đông quá không xuể. Đang tìm giải pháp phù hợp quy mô nhỏ.",
    likes: 34,
    comments: 41,
    tag: "Hỏi đáp",
  },
];

const EVENTS = [
  {
    date: "15/05",
    title: "Workshop: Xây dựng thương hiệu Farmstay",
    location: "Online · Zoom",
    icon: "🎯",
  },
  {
    date: "22/05",
    title: "Gặp mặt chủ Farmstay Miền Bắc",
    location: "Hà Nội · Quán trà Nhà Hoạch Định",
    icon: "🤝",
  },
  {
    date: "01/06",
    title: "Farmstay Tour: Khám phá Sa Đéc",
    location: "Đồng Tháp",
    icon: "🚌",
  },
];

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
              fontFamily: "var(--font-playfair), serif",
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
          <button
            style={{
              padding: "12px 32px",
              borderRadius: 20,
              background: "var(--gold)",
              color: "var(--bg-deep)",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
          >
            ✍️ Đăng bài
          </button>
        </section>

        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "48px 24px",
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 32,
          }}
        >
          {/* Feed */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {POSTS.map((post, i) => (
              <article
                key={i}
                style={{
                  background: "var(--bg-card)",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--border)",
                  padding: "24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    alignItems: "flex-start",
                    marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: "2rem", lineHeight: 1 }}>
                    {post.avatar}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        flexWrap: "wrap",
                      }}
                    >
                      <strong
                        style={{
                          fontSize: "0.92rem",
                          color: "var(--text-primary)",
                        }}
                      >
                        {post.author}
                      </strong>
                      <span
                        style={{
                          padding: "2px 8px",
                          borderRadius: 20,
                          background: "var(--gold-dim)",
                          border: "1px solid var(--gold-border)",
                          fontSize: "0.68rem",
                          color: "var(--gold)",
                          fontWeight: 600,
                        }}
                      >
                        {post.tag}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "var(--text-dim)",
                        marginTop: 2,
                      }}
                    >
                      {post.role} · {post.time}
                    </div>
                  </div>
                </div>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "var(--text-muted)",
                    lineHeight: 1.7,
                    marginBottom: 16,
                  }}
                >
                  {post.content}
                </p>
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    fontSize: "0.8rem",
                    color: "var(--text-dim)",
                  }}
                >
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-dim)",
                      cursor: "pointer",
                    }}
                  >
                    ♡ {post.likes}
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-dim)",
                      cursor: "pointer",
                    }}
                  >
                    💬 {post.comments}
                  </button>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      color: "var(--text-dim)",
                      cursor: "pointer",
                    }}
                  >
                    ↗ Chia sẻ
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Sidebar events */}
          <aside>
            <div
              style={{
                background: "var(--bg-card)",
                borderRadius: "var(--radius)",
                border: "1px solid var(--border)",
                padding: "24px",
                position: "sticky",
                top: 80,
              }}
            >
              <h3
                style={{
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  letterSpacing: "0.08em",
                  marginBottom: 20,
                }}
              >
                📅 SỰ KIỆN SẮP TỚI
              </h3>
              {EVENTS.map((ev, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom: 20,
                    paddingBottom: 20,
                    borderBottom:
                      i < EVENTS.length - 1
                        ? "1px solid var(--border)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      minWidth: 44,
                      height: 44,
                      borderRadius: "var(--radius-sm)",
                      background: "var(--gold-dim)",
                      border: "1px solid var(--gold-border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      textAlign: "center",
                      lineHeight: 1.2,
                    }}
                  >
                    {ev.date}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        marginBottom: 4,
                      }}
                    >
                      {ev.icon} {ev.title}
                    </div>
                    <div
                      style={{ fontSize: "0.75rem", color: "var(--text-dim)" }}
                    >
                      {ev.location}
                    </div>
                  </div>
                </div>
              ))}
              <a
                href="#"
                style={{
                  fontSize: "0.82rem",
                  color: "var(--gold)",
                  display: "block",
                  textAlign: "center",
                }}
              >
                Xem tất cả sự kiện →
              </a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}
