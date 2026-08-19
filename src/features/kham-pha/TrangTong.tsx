/**
 * Khung dùng chung cho ba TRANG TỔNG: `/trai-nghiem`, `/mua`, `/tuyen`.
 *
 * Vì sao cần: ba trục này sinh ra trang con trước, trang tổng sau — nên tới 19/08/2026
 * breadcrumb của chúng phải mượn tạm `/tour-farmstay` làm cấp cha, và người đọc không
 * có chỗ nào xem cả trục một lượt. Trang tổng bịt đúng hai chỗ hở đó.
 *
 * Mỗi trang tổng vẫn phải có phần dẫn riêng — không được là lưới thẻ trơ trọi, vì như
 * vậy chính nó lại thành trang mỏng.
 */

export interface MucTong {
  href: string;
  ten: string;
  tomTat: string;
  /** Dòng phụ dưới tóm tắt: khoảng thời gian, số điểm dừng, số vùng… */
  phu: string;
}

export function LuoiTong({ muc }: { muc: MucTong[] }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
        gap: 16,
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
            padding: "24px 22px",
            textDecoration: "none",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "1.2rem",
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 10,
            }}
          >
            {m.ten}
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.75,
              marginBottom: 12,
            }}
          >
            {m.tomTat}
          </p>
          <span
            style={{
              display: "block",
              color: "var(--gold)",
              fontSize: "0.8rem",
              fontWeight: 600,
            }}
          >
            {m.phu}
          </span>
        </a>
      ))}
    </div>
  );
}

/** Vỏ trang tổng — hero, dẫn nhập, lưới, rồi lối sang hai trục còn lại. */
export function VoTrangTong({
  kicker,
  tieuDe,
  dan,
  moDau,
  muc,
  trucKhac,
}: {
  kicker: string;
  tieuDe: string;
  /** Câu dưới tiêu đề trong hero */
  dan: string;
  /** Đoạn dẫn nhập riêng của trục này — bắt buộc, để trang tổng không thành trang mỏng */
  moDau: string;
  muc: MucTong[];
  trucKhac: { href: string; nhan: string }[];
}) {
  return (
    <>
      <section
        className="plasma-bg motif-x"
        style={{
          background: "linear-gradient(160deg,#0f2318,#1a3d28 60%,#0f2318)",
          padding: "64px 24px 72px",
          textAlign: "center",
        }}
      >
        <span className="section-kicker reveal">{kicker}</span>
        <h1
          className="shine reveal"
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 700,
            marginBottom: 16,
          }}
        >
          {tieuDe}
        </h1>
        <p
          style={{
            color: "var(--text-muted)",
            maxWidth: 640,
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          {dan}
        </p>
      </section>

      <div
        style={{ maxWidth: 1040, margin: "0 auto", padding: "40px 24px 88px" }}
      >
        <p
          style={{
            color: "var(--text-muted)",
            lineHeight: 1.9,
            fontSize: "1.02rem",
            maxWidth: 760,
            marginBottom: 36,
          }}
        >
          {moDau}
        </p>

        <LuoiTong muc={muc} />

        <p
          style={{
            marginTop: 40,
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          {trucKhac.map((t) => (
            <a
              key={t.href}
              href={t.href}
              style={{
                display: "inline-block",
                padding: "11px 22px",
                borderRadius: 22,
                border: "1px solid var(--gold-border)",
                color: "var(--gold)",
                fontWeight: 600,
                fontSize: "0.88rem",
                textDecoration: "none",
              }}
            >
              {t.nhan} →
            </a>
          ))}
        </p>
      </div>
    </>
  );
}
