/**
 * Khung xương lúc chờ cho trang /farmstay/[slug] — hiện khi ISR dựng lại trang.
 *
 * ⚠️ Sửa 24/08/2026: khung này khai `1fr 340px` mà KHÔNG có ngắt khổ, trong khi
 * trang thật có. Trên máy 375px, cột phải 340px đẩy mép trang ra 404px ⇒ **người
 * dùng điện thoại bị trang trượt ngang trong lúc chờ**. Lỗi chỉ hiện trong khoảnh
 * khắc chờ nên không máy đo nào ngó tới — đúng bệnh "vá một nhánh, nhánh song sinh
 * vẫn hở": trang thật được vá, bản khung xương bị bỏ quên.
 *
 * Ngắt khổ dưới đây phải GIỮ TRÙNG với ngắt khổ `.detail-grid` ở trang thật; lệch
 * nhau thì lúc chờ và lúc xong nhảy bố cục.
 */

export default function FarmstayLoading() {
  return (
    <main
      style={{ background: "var(--bg-main)", minHeight: "100vh" }}
      aria-label="Đang tải thông tin farmstay"
      aria-busy="true"
    >
      {/* Hero image skeleton */}
      <div
        style={{ width: "100%", height: 480, background: "var(--bg-deep)" }}
        className="skeleton-pulse"
        aria-hidden="true"
      />

      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "40px 24px" }}>
        <div
          className="khung-cho-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: 40,
          }}
        >
          {/* Left column */}
          <div>
            <div
              style={{
                height: 40,
                width: "70%",
                background: "var(--bg-card)",
                borderRadius: 4,
                marginBottom: 16,
              }}
              className="skeleton-pulse"
            />
            <div
              style={{
                height: 20,
                width: "50%",
                background: "var(--bg-card)",
                borderRadius: 4,
                marginBottom: 32,
              }}
              className="skeleton-pulse"
            />
            {/* Content lines */}
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                style={{
                  height: 16,
                  width: i % 3 === 2 ? "60%" : "100%",
                  background: "var(--bg-card)",
                  borderRadius: 4,
                  marginBottom: 12,
                }}
                className="skeleton-pulse"
              />
            ))}
          </div>

          {/* Right: booking card skeleton */}
          <div
            style={{
              height: 320,
              background: "var(--bg-card)",
              borderRadius: "var(--radius)",
              border: "1px solid var(--border)",
            }}
            className="skeleton-pulse"
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .khung-cho-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
