"use client";

import { useState, useMemo } from "react";
import type { Farmstay } from "@/shared/types/farmstay";
import { FarmstayCard } from "./FarmstayCard";

const CHIPS = [
  { label: "Tất cả", value: "all" },
  { label: "Miền núi", value: "mien-nui" },
  { label: "Ven biển", value: "ven-bien" },
  { label: "Đồng bằng", value: "dong-bang" },
  { label: "Trà & cà phê", value: "tra-ca-phe" },
  { label: "Chăn nuôi", value: "chan-nuoi" },
  { label: "Hoa & cây cảnh", value: "hoa-cay-canh" },
  { label: "Vườn cây ăn quả", value: "vuon-cay" },
  { label: "Dược liệu", value: "duoc-lieu" },
  { label: "Cắm trại", value: "cam-trai" },
  { label: "Mới mở", value: "new" },
];

/** Số đếm mỗi khu vực tính từ dữ liệu THẬT — không khai số cứng. */
const REGIONS = [
  { label: "Toàn quốc", value: "all" },
  { label: "Miền Bắc", value: "north" },
  { label: "Miền Trung", value: "central" },
  { label: "Miền Nam", value: "south" },
];

interface Props {
  farmstays: Farmstay[];
  initialQuery?: string;
}

export function HomePage({ farmstays, initialQuery = "" }: Props) {
  /**
   * Chưa có farmstay THẬT nào ⇒ ẩn toàn bộ bộ máy tìm/lọc/danh sách.
   * Ông ra lệnh 08/08/2026: khung rỗng có tiêu đề còn tệ hơn không có khung.
   * Máy lọc vẫn nằm nguyên trong mã, tự sống lại khi `FARMSTAYS` có dữ liệu thật.
   */
  const hasFarmstays = farmstays.length > 0;
  const [activeChip, setActiveChip] = useState("all");
  const [region, setRegion] = useState("all");
  const [query, setQuery] = useState(initialQuery);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return farmstays.filter((f) => {
      if (region !== "all" && f.region !== region) return false;
      if (activeChip === "new" && !f.badges?.includes("new")) return false;
      if (q) {
        const hay =
          `${f.name} ${f.location} ${f.province} ${f.tags.join(" ")}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [farmstays, region, activeChip, query]);

  return (
    /* `id="main"` là đích của liên kết bỏ qua "Chuyển đến nội dung chính" ở / và /tim-kiem,
       và là landmark <main> duy nhất của trang — phải luôn tồn tại kể cả khi chưa có farmstay. */
    <main id="main">
      {/* Hero */}
      {/* plasma-bg = I6 Bong Bóng Huyền Ảo · motif-x = hoa văn X Nút Gold —
          DNA chốt 20260807: cả hai áp cho section nền dark, chồng layer
          (blob z-0, hoa văn nền, nội dung z-1). Trước 08/08 hai lớp này chỉ
          nằm trong globals.css mà chưa gắn vào thẻ nào. */}
      <section
        aria-label="Hero trang chủ"
        className="plasma-bg motif-x fx-gold-dust"
        style={{
          background:
            "linear-gradient(160deg,#0f2318 0%,#1a4a2e 50%,#0f2318 100%)",
          padding: "80px 24px 180px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* shine = I5 Metallic Shine — DNA: áp cho MỌI headline cùng vai trò.
            reveal = nhịp Bộ IV trầm sang, phần tử nổi lên có chủ đích. */}
        <h1
          className="shine reveal"
          style={{
            fontFamily: "var(--font-display), serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: 700,
            margin: "0 auto 20px",
          }}
        >
          Trải nghiệm{" "}
          <em className="fx-gradient-text-gold" style={{ fontStyle: "italic" }}>
            {/* nbsp giữ từ ghép "nông nghiệp" không bị bẻ đôi ở khổ hẹp (cổng S-1) */}
            nông&nbsp;nghiệp
          </em>
          <br />
          đích thực Việt Nam
        </h1>
        <p
          style={{
            fontSize: "1.05rem",
            color: "var(--text-muted)",
            maxWidth: 600,
            margin: "0 auto 32px",
            lineHeight: 1.7,
          }}
        >
          Khám phá farmstay từ Hà Giang đến Cà Mau – ruộng bậc thang, đồi chè,
          vườn cà phê, văn hoá bản địa chưa bị thương mại hoá
        </p>

        {/* Hero search — chỉ hiện khi có farmstay để tìm */}
        {hasFarmstays && (
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const input =
                (e.currentTarget.elements.namedItem("q") as HTMLInputElement)
                  ?.value ?? "";
              setQuery(input);
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.searchParams.set("q", input);
                window.history.replaceState(null, "", url.toString());
              }
              const el = document.getElementById("main-listing");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            style={{
              display: "flex",
              maxWidth: 520,
              margin: "0 auto 40px",
              borderRadius: 30,
              overflow: "hidden",
              border: "1px solid var(--gold-border)",
              background: "rgba(255,255,255,0.05)",
            }}
          >
            <label htmlFor="searchInput" className="sr-only">
              Tìm kiếm farmstay
            </label>
            <input
              id="searchInput"
              name="q"
              type="search"
              defaultValue={initialQuery}
              placeholder="Tìm farmstay, vùng đất, trải nghiệm…"
              autoComplete="off"
              style={{
                flex: 1,
                padding: "14px 20px",
                background: "transparent",
                border: "none",
                outline: "none",
                color: "var(--text-primary)",
                fontSize: "0.9rem",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "14px 28px",
                background: "var(--gold)",
                color: "var(--bg-deep)",
                border: "none",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.88rem",
                transition: "var(--transition)",
              }}
            >
              Tìm ngay
            </button>
          </form>
        )}

        {/* Lời mời thay cho bộ số cũ (500+ farmstay · 63 tỉnh · 12K+ lượt đặt · 4.8★
            — Ông xác nhận 08/08/2026 toàn bộ là số tự chế, đã gỡ, KHÔNG thay số khác) */}
        {!hasFarmstays && (
          <div style={{ maxWidth: 560, margin: "0 auto 60px" }}>
            <p
              style={{
                fontSize: "0.95rem",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              Danh bạ farmstay đang được xây dựng. Chúng tôi chỉ đăng những
              farmstay đã đi tới tận nơi — nên trang này còn trống, và sẽ dày
              lên từng cái một.
            </p>
            <a
              href="/chu-farmstay"
              className="fx-gradient-btn fx-glow"
              style={{
                display: "inline-block",
                padding: "12px 28px",
                borderRadius: 24,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.88rem",
                textDecoration: "none",
                transition: "var(--transition)",
              }}
            >
              Bạn có farmstay? Giới thiệu với chúng tôi →
            </a>
          </div>
        )}

        {/* Địa hình 3 lớp — xa-gần, cao-thấp, tốc độ / chiều khác nhau
            width:300% + translateX(-33.333%) = cuộn 1 container-width → tile liền mạch
            Y giống nhau ở X=0 và X=1200 để không giật khi lặp */}
        <style>{`
          .hero-waves {
            position: absolute; left: 0; right: 0; bottom: 0;
            height: 160px; overflow: hidden; pointer-events: none;
          }
          .hero-wave {
            position: absolute; left: 0; bottom: 0;
            width: 300%; height: 100%;
          }
          @keyframes wave-scroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-33.333%); }
          }
          .hero-wave-1 { animation: wave-scroll 32s linear infinite; }
          .hero-wave-2 { animation: wave-scroll 20s linear infinite reverse; }
          .hero-wave-3 { animation: wave-scroll 14s linear infinite; }
          @media (prefers-reduced-motion: reduce) {
            .hero-wave { animation: none !important; }
          }
        `}</style>
        <div className="hero-waves" aria-hidden="true">
          {/* Lớp 1 — xa nhất, đỉnh cao nhất, chậm nhất */}
          <svg
            className="hero-wave hero-wave-1"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
          >
            <path
              d="M0,95 C100,45 260,110 420,38 C550,5 670,100 810,28 C940,2 1080,90 1200,95 L1200,160 L0,160 Z"
              fill="rgba(15,35,24,0.48)"
            />
          </svg>
          {/* Lớp 2 — tầng giữa, ngược chiều, đỉnh vừa */}
          <svg
            className="hero-wave hero-wave-2"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
          >
            <path
              d="M0,108 C150,72 310,125 470,85 C620,52 770,118 930,78 C1060,52 1150,100 1200,108 L1200,160 L0,160 Z"
              fill="rgba(10,28,18,0.82)"
            />
          </svg>
          {/* Lớp 3 — gần nhất, đỉnh thấp, che đáy hoàn toàn */}
          <svg
            className="hero-wave hero-wave-3"
            viewBox="0 0 1200 160"
            preserveAspectRatio="none"
          >
            <path
              d="M0,128 C180,112 400,138 600,120 C790,105 980,136 1120,122 C1165,116 1188,125 1200,128 L1200,160 L0,160 Z"
              fill="var(--bg-deep)"
            />
          </svg>
        </div>
      </section>

      {/* ── Câu chuyện thương hiệu — nguồn: vnfarmstay-nen-tang-thuong-hieu-v2.md
          (Ông cấp 08/08/2026). Du khách chạm trang chủ trước tiên, nên lẽ sống phải
          nói ở đây chứ không đợi họ bấm sang /ve-chung-toi. ── */}
      <section
        aria-label="Lẽ sống của vnfarmstay.vn"
        style={{
          background: "var(--bg-deep)",
          padding: "84px 24px",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <span className="section-kicker">Vì sao có trang này</span>
          <h2
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "clamp(1.5rem, 3.2vw, 2.3rem)",
              fontWeight: 700,
              lineHeight: 1.35,
              color: "var(--text-primary)",
              marginBottom: 26,
            }}
          >
            Một cây đứng riêng thì đổ.
            <br />
            <em style={{ color: "var(--gold)" }}>
              Một khu rừng thì có tên trên bản đồ.
            </em>
          </h2>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.85,
              maxWidth: 700,
              margin: "0 auto 20px",
            }}
          >
            Việt Nam có hàng nghìn farmstay, mỗi nơi giữ một thứ mà không resort
            nào mua được. Giá trị là thật — nhưng gõ tên lên Google thường không
            có gì cả. Chúng ta không thua vì thiếu giá trị.{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              Chúng ta thua vì đứng rời nhau.
            </strong>
          </p>

          <p
            style={{
              color: "var(--text-muted)",
              fontSize: "1rem",
              lineHeight: 1.85,
              maxWidth: 700,
              margin: "0 auto 34px",
            }}
          >
            vnfarmstay.vn không phải sàn đặt phòng, cũng không phải danh bạ. Đây
            là{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              hạ tầng chung của cộng đồng Farmstay Việt Nam
            </strong>{" "}
            — nơi mỗi thành viên giữ nguyên bản sắc riêng, nhưng cùng liên kết
            vào một lõi để tín nhiệm và lượt tiếp cận chảy qua lại giữa mọi mắt
            xích.
          </p>

          <div
            className="fx-tilt-glow"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--gold-border)",
              borderRadius: "var(--radius-lg)",
              padding: "32px 30px",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "var(--gold)",
                marginBottom: 14,
              }}
            >
              Đích đến chung
            </div>
            <p
              style={{
                fontFamily: "var(--font-display), serif",
                fontSize: "clamp(1.05rem, 2.2vw, 1.35rem)",
                fontWeight: 700,
                lineHeight: 1.55,
                color: "var(--text-primary)",
              }}
            >
              Đưa Việt Nam định vị thành{" "}
              <em style={{ color: "var(--gold)" }}>
                Quốc Gia Du Lịch Nông Nghiệp
              </em>{" "}
              trên bản đồ thế giới — nơi mỗi vùng đất kể câu chuyện riêng qua
              nông sản, văn hoá và trải nghiệm bản địa.
            </p>
          </div>

          <a
            href="/ve-chung-toi"
            style={{
              display: "inline-block",
              padding: "12px 28px",
              borderRadius: 24,
              border: "1px solid var(--gold-border)",
              color: "var(--gold)",
              fontWeight: 600,
              fontSize: "0.9rem",
              textDecoration: "none",
              transition: "var(--transition)",
            }}
          >
            Đọc trọn câu chuyện của chúng ta →
          </a>
        </div>
      </section>

      {hasFarmstays && (
        <>
          {/* Filter chips */}
          <div
            role="toolbar"
            aria-label="Lọc farmstay"
            style={{
              display: "flex",
              gap: 8,
              padding: "16px 24px",
              overflowX: "auto",
              scrollbarWidth: "none",
              background: "var(--bg-deep)",
              borderBottom: "1px solid var(--border)",
            }}
          >
            {CHIPS.map((chip) => (
              <button
                key={chip.value}
                aria-pressed={activeChip === chip.value}
                onClick={() => setActiveChip(chip.value)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 20,
                  border: "1px solid",
                  borderColor:
                    activeChip === chip.value ? "var(--gold)" : "var(--border)",
                  background:
                    activeChip === chip.value ? "var(--gold)" : "transparent",
                  color:
                    activeChip === chip.value
                      ? "var(--bg-deep)"
                      : "var(--text-muted)",
                  fontSize: "0.82rem",
                  fontWeight: activeChip === chip.value ? 700 : 400,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  transition: "var(--transition)",
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Listing */}
          <div
            id="main-listing"
            style={{ maxWidth: "100%", minHeight: "60vh" }}
          >
            {/* Listings */}
            <section
              style={{ padding: "24px", background: "var(--bg-deep)" }}
              aria-label="Danh sách farmstay"
            >
              {/* Vùng miền lọc nhanh */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 20,
                  flexWrap: "wrap",
                }}
              >
                {REGIONS.map((r) => (
                  <button
                    key={r.value}
                    onClick={() => setRegion(r.value)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: "1px solid",
                      borderColor:
                        region === r.value ? "var(--gold)" : "var(--border)",
                      background:
                        region === r.value ? "var(--gold-dim)" : "transparent",
                      color:
                        region === r.value
                          ? "var(--gold)"
                          : "var(--text-muted)",
                      fontSize: "0.82rem",
                      fontWeight: region === r.value ? 600 : 400,
                      cursor: "pointer",
                      transition: "var(--transition)",
                    }}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--text-muted)",
                  marginBottom: 20,
                }}
              >
                {filtered.length} farmstay
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))",
                  gap: 20,
                }}
              >
                {filtered.map((f) => (
                  <FarmstayCard key={f.id} farmstay={f} />
                ))}
              </div>

              {filtered.length === 0 && (
                <div
                  style={{
                    textAlign: "center",
                    padding: "60px 0",
                    color: "var(--text-dim)",
                  }}
                >
                  <p>Không có farmstay phù hợp với bộ lọc hiện tại.</p>
                </div>
              )}

              {filtered.length > 0 && (
                <div style={{ textAlign: "center", marginTop: 32 }}>
                  <button
                    style={{
                      padding: "12px 32px",
                      borderRadius: 20,
                      background: "var(--gold-dim)",
                      border: "1px solid var(--gold-border)",
                      color: "var(--gold)",
                      fontWeight: 600,
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      transition: "var(--transition)",
                    }}
                  >
                    Xem thêm farmstay ↓
                  </button>
                </div>
              )}
            </section>
          </div>
        </>
      )}
    </main>
  );
}
