/**
 * Khối "Khám phá theo vùng" trên trang chủ — server component, dựng 19/08/2026.
 *
 * Cố ý KHÔNG import dữ liệu 9 vùng thẳng vào `HomePage.tsx`: tệp đó là client
 * component, nên toàn bộ chữ của 9 vùng sẽ bị đóng gói lần thứ hai vào tệp JavaScript
 * gửi xuống trình duyệt, dù nó đã nằm sẵn trong HTML. Render ở phía máy chủ rồi truyền
 * xuống dưới dạng nội dung con thì người dùng chỉ tải một lần.
 *
 * Mỗi vùng là một thẻ `<a href>` thật — máy tìm kiếm đi theo được, không phải khối
 * `div` bắt sự kiện bấm chuột.
 */
import { VUNG } from "./data";

export function KhamPhaTheoVung() {
  return (
    <section
      aria-labelledby="kham-pha-vung-heading"
      style={{
        background: "var(--bg-deep)",
        padding: "80px 24px",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto" }}>
        <span className="section-kicker">Khám phá theo vùng đất</span>
        <h2
          id="kham-pha-vung-heading"
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(1.4rem, 3vw, 2rem)",
            fontWeight: 700,
            lineHeight: 1.3,
            color: "var(--text-primary)",
            marginBottom: 12,
          }}
        >
          Chín vùng nông nghiệp, chín nhịp mùa vụ khác nhau
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            lineHeight: 1.85,
            maxWidth: 720,
            marginBottom: 32,
          }}
        >
          Với farmstay thì chọn mùa trước, chọn vùng sau — cùng một đồi chè,
          tháng có vụ và tháng vừa đốn là hai nơi hoàn toàn khác nhau. Mỗi vùng
          dưới đây có trang riêng nói rõ nông sản, mùa đẹp nhất, việc nhà nông
          làm thử được và cách đi.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
            gap: 16,
          }}
        >
          {VUNG.map((v) => (
            <a
              key={v.slug}
              href={`/vung/${v.slug}`}
              style={{
                display: "block",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-lg)",
                padding: "22px 20px",
                textDecoration: "none",
                transition: "var(--transition)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-display), serif",
                  fontSize: "1.08rem",
                  fontWeight: 700,
                  color: "var(--text-primary)",
                  display: "block",
                  marginBottom: 6,
                  lineHeight: 1.35,
                }}
              >
                {v.ten}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "0.74rem",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  color: "var(--gold)",
                  fontWeight: 600,
                  marginBottom: 12,
                }}
              >
                {v.diaDanh}
              </span>
              <span
                style={{
                  display: "block",
                  color: "var(--text-muted)",
                  fontSize: "0.92rem",
                  lineHeight: 1.75,
                  marginBottom: 12,
                }}
              >
                {v.tomTat}
              </span>
              <span
                style={{
                  display: "block",
                  color: "var(--accent-ma)",
                  fontSize: "0.85rem",
                  lineHeight: 1.6,
                }}
              >
                {v.muaDep}
              </span>
            </a>
          ))}
        </div>

        <p style={{ marginTop: 28 }}>
          <a
            href="/tour-farmstay"
            style={{
              display: "inline-block",
              padding: "12px 26px",
              borderRadius: 24,
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
            }}
          >
            Xem bản đồ vùng kèm lịch mùa cả năm →
          </a>
        </p>
      </div>
    </section>
  );
}
