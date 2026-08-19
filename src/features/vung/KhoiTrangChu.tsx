/**
 * Ba khối nội dung của trang chủ — server component, dựng 19/08/2026.
 *
 *   1. Đi theo mùa — lịch mùa cả năm, vì với farmstay thì chọn mùa trước, chọn vùng sau.
 *   2. Một hành trình không chỉ có một điểm dừng — cách nối các vùng vào một chuyến.
 *   3. Dành cho chủ farmstay — cửa vào B2B, tách rõ khỏi phần dành cho du khách.
 *
 * Cố ý KHÔNG có khối "câu chuyện mới nhất": kho bài hiện chỉ có sáu bài mẫu chưa có
 * thân bài. Đưa chúng lên trang chủ là dựng cảnh cho có vẻ đầy đặn — đúng thứ nguyên
 * tắc trung thực về trạng thái cấm. Ngày có bài thật, thêm khối ấy vào đây.
 */
import { LICH_MUA, VUNG } from "./data";

const LOI_ICH_CHU_FARM = [
  {
    h: "Hoàn toàn miễn phí",
    p: "Không phí đăng, không phí hàng tháng, không hoa hồng. Chúng ta không nhận đặt phòng nên cũng không có gì để ăn phần trăm.",
  },
  {
    h: "Được kể chuyện tử tế",
    p: "Hồ sơ nói về vùng đất, mùa vụ và nếp sống ở farm bạn — thay vì một dòng liệt kê tiện nghi khô khan.",
  },
  {
    h: "Dẫn khách về thẳng chỗ bạn",
    p: "Trang giới thiệu trỏ về website, Zalo hoặc số điện thoại của bạn. Khách đặt thẳng với bạn, theo giá và điều kiện của bạn.",
  },
  {
    h: "Giữ 100% những gì là của bạn",
    p: "Thương hiệu, website, dữ liệu, khách hàng và doanh thu đặt trực tiếp — hệ sinh thái không lấy đi thứ nào.",
  },
];

export function KhoiTrangChu() {
  /* Ba vùng liền nhau trên trục Bắc–Nam làm ví dụ cho cách nối một tuyến —
     lấy từ dữ liệu vùng thật, không bịa ra một "tuyến" chưa được biên tập. */
  const viDuTuyen = [...VUNG].sort((a, b) => a.bac - b.bac).slice(0, 3);

  return (
    <>
      {/* ── 1. Đi theo mùa ── */}
      <section
        aria-labelledby="lich-mua-heading"
        style={{
          background: "var(--bg-main)",
          padding: "80px 24px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <span className="section-kicker">Đi theo mùa</span>
          <h2
            id="lich-mua-heading"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Tháng này đi đâu thì gặp đúng vụ
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.85,
              maxWidth: 720,
              marginBottom: 30,
            }}
          >
            Nhịp làm nông quyết định chuyến đi. Đây là lịch mùa chung của cả
            nước — thời tiết mỗi năm mỗi khác, nên người biết chắc nhất vẫn là
            người đang đứng trên mảnh đất đó.
          </p>

          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              gap: 14,
            }}
          >
            {LICH_MUA.map((m) => (
              <div
                key={m.thang}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "20px 18px",
                }}
              >
                <dt
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--gold)",
                    marginBottom: 8,
                  }}
                >
                  {m.thang}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    color: "var(--text-muted)",
                    fontSize: "0.94rem",
                    lineHeight: 1.7,
                  }}
                >
                  {m.diem}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 2. Một hành trình không chỉ có một điểm dừng ── */}
      <section
        aria-labelledby="hanh-trinh-heading"
        style={{
          background: "var(--bg-deep)",
          padding: "80px 24px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <span className="section-kicker">Đi theo tuyến</span>
          <h2
            id="hanh-trinh-heading"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Một hành trình không chỉ có một điểm dừng
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.85,
              marginBottom: 26,
            }}
          >
            Khách đi farmstay thường đi theo cung đường chứ không ở lì một chỗ.
            Vì vậy mỗi trang vùng đều dẫn tiếp sang những vùng gần nó nhất — để
            farm bên cạnh là mắt xích tiếp theo của cùng một chuyến, không phải
            đối thủ giành một lượt khách. Ví dụ ở phía Bắc:
          </p>

          <ol
            style={{
              display: "grid",
              gap: 12,
              listStyle: "none",
              counterReset: "buoc",
            }}
          >
            {viDuTuyen.map((v, i) => (
              <li key={v.slug}>
                <a
                  href={`/vung/${v.slug}`}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "baseline",
                    background: "var(--bg-card)",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-lg)",
                    padding: "18px 20px",
                    textDecoration: "none",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "var(--font-display), serif",
                      fontSize: "1.3rem",
                      fontWeight: 700,
                      color: "var(--gold)",
                      flexShrink: 0,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span
                      style={{
                        display: "block",
                        fontWeight: 700,
                        color: "var(--text-primary)",
                        marginBottom: 4,
                      }}
                    >
                      {v.ten}
                    </span>
                    <span
                      style={{
                        display: "block",
                        color: "var(--text-muted)",
                        fontSize: "0.92rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {v.tomTat}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ol>

          <p style={{ marginTop: 24 }}>
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
              Xem cả 9 vùng để tự ghép tuyến →
            </a>
          </p>
        </div>
      </section>

      {/* ── 3. Dành cho chủ farmstay ── */}
      <section
        aria-labelledby="chu-farm-heading"
        style={{ background: "var(--bg-main)", padding: "80px 24px" }}
      >
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <span className="section-kicker">Dành cho chủ farmstay</span>
          <h2
            id="chu-farm-heading"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700,
              lineHeight: 1.3,
              color: "var(--text-primary)",
              marginBottom: 12,
            }}
          >
            Bạn không đăng ký vào một danh bạ
          </h2>
          <p
            style={{
              color: "var(--text-muted)",
              lineHeight: 1.85,
              maxWidth: 720,
              marginBottom: 30,
            }}
          >
            Bạn trồng cây của mình vào một khu rừng đang lớn — nơi mỗi cái cây
            bên cạnh đều làm đất của bạn màu mỡ hơn. Nguyên tắc là cộng sinh,
            không ký sinh.
          </p>

          <dl
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 16,
              marginBottom: 30,
            }}
          >
            {LOI_ICH_CHU_FARM.map((l) => (
              <div
                key={l.h}
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-lg)",
                  padding: "22px 20px",
                }}
              >
                <dt
                  style={{
                    fontFamily: "var(--font-display), serif",
                    fontSize: "1.02rem",
                    fontWeight: 700,
                    color: "var(--gold)",
                    marginBottom: 10,
                  }}
                >
                  {l.h}
                </dt>
                <dd
                  style={{
                    margin: 0,
                    color: "var(--text-muted)",
                    fontSize: "0.94rem",
                    lineHeight: 1.75,
                  }}
                >
                  {l.p}
                </dd>
              </div>
            ))}
          </dl>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            <a
              href="/dang-farmstay"
              data-su-kien="join_ecosystem_cta_click"
              data-sk-tu="trang-chu-khoi-chu-farm"
              className="fx-gradient-btn fx-glow"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                borderRadius: 24,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Giới thiệu farmstay của bạn →
            </a>
            <a
              href="/chu-farmstay"
              style={{
                display: "inline-block",
                padding: "13px 28px",
                borderRadius: 24,
                border: "1px solid var(--gold-border)",
                color: "var(--gold)",
                fontWeight: 600,
                fontSize: "0.9rem",
                textDecoration: "none",
              }}
            >
              Đọc kỹ ba bước và tiêu chí xét duyệt
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
