/**
 * Khối "Khám phá tiếp" — dùng chung cho trang vùng, trải nghiệm, mùa và tuyến.
 *
 * ⚠️ Mỗi liên kết PHẢI kèm LÝ DO nối. Bản đặt hàng cấm gợi ý nội dung ngẫu nhiên chỉ
 * để tăng lượt xem: người đọc cần biết vì sao trang này dẫn sang trang kia, và máy
 * tìm kiếm cũng đọc được ý nghĩa từ chính chữ quanh liên kết.
 *
 * Đây là thẻ `<a href>` thật, dựng ở phía máy chủ — không phải nút bấm gắn sự kiện,
 * để mọi liên kết đều thu thập được.
 */

export interface MucKhamPha {
  href: string;
  nhan: string;
  /** Nhãn nhóm ngắn: "Vùng đất", "Trải nghiệm", "Mùa", "Tuyến" */
  loai: string;
  /** Lý do trang này dẫn sang trang kia — bắt buộc, không được để trống */
  vaySao: string;
}

export function KhamPhaTiep({
  tieuDe = "Khám phá tiếp",
  dan,
  muc,
}: {
  tieuDe?: string;
  /** Một câu dẫn nói rõ đây là gợi ý có lý do, không phải danh sách ngẫu nhiên */
  dan?: string;
  muc: MucKhamPha[];
}) {
  if (muc.length === 0) return null;

  return (
    <section
      aria-labelledby="kham-pha-tiep"
      style={{
        marginTop: 56,
        paddingTop: 40,
        borderTop: "1px solid var(--border)",
      }}
    >
      <h2
        id="kham-pha-tiep"
        style={{
          fontFamily: "var(--font-display), serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: dan ? 10 : 20,
        }}
      >
        {tieuDe}
      </h2>
      {dan && (
        <p
          style={{
            color: "var(--text-dim)",
            lineHeight: 1.8,
            marginBottom: 22,
            maxWidth: 640,
          }}
        >
          {dan}
        </p>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
          gap: 14,
        }}
      >
        {muc.map((m) => (
          <a
            key={m.href}
            href={m.href}
            style={{
              display: "block",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "20px 20px",
              textDecoration: "none",
            }}
          >
            <span
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "var(--gold)",
              }}
            >
              {m.loai}
            </span>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-display), serif",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: "var(--text-primary)",
                margin: "8px 0 8px",
              }}
            >
              {m.nhan}
            </span>
            <span
              style={{
                display: "block",
                color: "var(--text-muted)",
                fontSize: "0.9rem",
                lineHeight: 1.7,
              }}
            >
              {m.vaySao}
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
