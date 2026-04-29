"use client";

import { useState, useMemo } from "react";
import type { Farmstay } from "@/shared/types/farmstay";
import { FarmstayCard } from "./FarmstayCard";
import { FarmstayMap } from "./FarmstayMap";

const CHIPS = [
  { label: "🌿 Tất cả", value: "all" },
  { label: "🏔️ Miền núi", value: "mien-nui" },
  { label: "🌊 Ven biển", value: "ven-bien" },
  { label: "🌾 Đồng bằng", value: "dong-bang" },
  { label: "🍃 Trà & cà phê", value: "tra-ca-phe" },
  { label: "🐄 Chăn nuôi", value: "chan-nuoi" },
  { label: "🌺 Hoa & cây cảnh", value: "hoa-cay-canh" },
  { label: "🍎 Vườn cây ăn quả", value: "vuon-cay" },
  { label: "🌿 Dược liệu", value: "duoc-lieu" },
  { label: "🏕️ Cắm trại", value: "cam-trai" },
  { label: "⭐ Mới mở", value: "new" },
];

const REGIONS = [
  { label: "🗺️ Toàn quốc", value: "all", count: "500+" },
  { label: "🏔️ Miền Bắc", value: "north", count: "198" },
  { label: "🌊 Miền Trung", value: "central", count: "154" },
  { label: "🌴 Miền Nam", value: "south", count: "148" },
];

const AMENITIES = [
  "Wifi",
  "Đón tiễn sân bay",
  "Bữa ăn nông trại",
  "Hồ bơi",
  "Thú nuôi OK",
];

interface Props {
  farmstays: Farmstay[];
}

export function HomePage({ farmstays }: Props) {
  const [activeChip, setActiveChip] = useState("all");
  const [region, setRegion] = useState("all");
  const [maxPrice, setMaxPrice] = useState(5000000);
  const [minRating, setMinRating] = useState(4);

  const filtered = useMemo(() => {
    return farmstays.filter((f) => {
      if (region !== "all" && f.region !== region) return false;
      if (f.price > maxPrice) return false;
      if (f.rating < minRating) return false;
      if (activeChip === "new" && !f.badges.includes("new")) return false;
      return true;
    });
  }, [farmstays, region, maxPrice, minRating, activeChip]);

  return (
    <>
      {/* Hero */}
      <section
        aria-label="Hero trang chủ"
        style={{
          background:
            "linear-gradient(160deg,#0f2318 0%,#1a4a2e 50%,#0f2318 100%)",
          padding: "80px 24px 0",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "inline-block",
            padding: "6px 18px",
            borderRadius: 20,
            background: "var(--gold-dim)",
            border: "1px solid var(--gold-border)",
            fontSize: "0.78rem",
            fontWeight: 600,
            color: "var(--gold)",
            letterSpacing: "0.08em",
            marginBottom: 24,
          }}
        >
          500+ Farmstay Xác Minh
        </div>
        <h1
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: 20,
            maxWidth: 700,
            margin: "0 auto 20px",
          }}
        >
          Trải nghiệm{" "}
          <em style={{ color: "var(--gold)", fontStyle: "italic" }}>
            nông nghiệp
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

        {/* Hero search */}
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            const input = (
              e.currentTarget.elements.namedItem("q") as HTMLInputElement
            )?.value;
            if (input)
              window.location.href = `/tim-kiem?q=${encodeURIComponent(input)}`;
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

        {/* Stats */}
        <div
          role="list"
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "clamp(24px, 4vw, 60px)",
            marginBottom: 60,
          }}
        >
          {[
            ["500+", "Farmstay xác minh"],
            ["63", "Tỉnh thành"],
            ["12K+", "Lượt đặt/tháng"],
            ["4.8★", "Đánh giá trung bình"],
          ].map(([num, label]) => (
            <div role="listitem" key={label} style={{ textAlign: "center" }}>
              <strong
                style={{
                  fontSize: "1.6rem",
                  fontWeight: 700,
                  color: "var(--gold)",
                  display: "block",
                }}
              >
                {num}
              </strong>
              <span style={{ fontSize: "0.78rem", color: "var(--text-dim)" }}>
                {label}
              </span>
            </div>
          ))}
        </div>

        {/* Terrain SVG */}
        <svg
          viewBox="0 0 1440 200"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ display: "block", width: "100%", height: 80 }}
        >
          <path
            d="M0,200 L0,160 Q180,100 360,130 Q540,160 720,100 Q900,40 1080,80 Q1260,120 1440,70 L1440,200 Z"
            fill="rgba(15,35,24,0.7)"
          />
          <path
            d="M0,200 L0,180 Q240,130 480,160 Q720,190 960,140 Q1200,90 1440,120 L1440,200 Z"
            fill="var(--bg-deep)"
          />
        </svg>
      </section>

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

      {/* 3-column layout */}
      <div
        id="main"
        style={{
          display: "grid",
          gridTemplateColumns: "240px 1fr 300px",
          gap: 0,
          maxWidth: "100%",
          minHeight: "60vh",
        }}
      >
        {/* Sidebar */}
        <aside
          aria-label="Bộ lọc nâng cao"
          style={{
            padding: "24px 20px",
            borderRight: "1px solid var(--border)",
            background: "var(--bg-main)",
          }}
        >
          {/* Region */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              KHU VỰC
            </div>
            {REGIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRegion(r.value)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "var(--radius-sm)",
                  background:
                    region === r.value ? "var(--gold-dim)" : "transparent",
                  border: "1px solid",
                  borderColor:
                    region === r.value ? "var(--gold-border)" : "transparent",
                  color:
                    region === r.value
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  fontSize: "0.83rem",
                  cursor: "pointer",
                  marginBottom: 4,
                  transition: "var(--transition)",
                  textAlign: "left",
                }}
              >
                {r.label}
                <span style={{ color: "var(--text-dim)", fontSize: "0.75rem" }}>
                  {r.count}
                </span>
              </button>
            ))}
          </div>

          {/* Price */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              GIÁ/ĐÊM (VNĐ)
            </div>
            <input
              type="range"
              min={0}
              max={5000000}
              step={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Giá tối đa"
              style={{ width: "100%", accentColor: "var(--gold)" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                marginTop: 4,
              }}
            >
              <span>0</span>
              <span>{maxPrice.toLocaleString("vi-VN")}đ</span>
            </div>
          </div>

          {/* Rating */}
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              ĐÁNH GIÁ TỐI THIỂU
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {[3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 20,
                    border: "1px solid",
                    borderColor:
                      minRating === r ? "var(--gold)" : "var(--border)",
                    background: minRating === r ? "var(--gold)" : "transparent",
                    color:
                      minRating === r ? "var(--bg-deep)" : "var(--text-muted)",
                    fontSize: "0.78rem",
                    fontWeight: minRating === r ? 700 : 400,
                    cursor: "pointer",
                  }}
                >
                  {r === 5 ? "5★" : `${r}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div>
            <div
              style={{
                fontSize: "0.72rem",
                fontWeight: 600,
                color: "var(--text-dim)",
                letterSpacing: "0.1em",
                marginBottom: 10,
              }}
            >
              TIỆN ÍCH
            </div>
            {AMENITIES.map((a) => (
              <label
                key={a}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 10px",
                  fontSize: "0.83rem",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" style={{ accentColor: "var(--gold)" }} />
                {a}
              </label>
            ))}
          </div>
        </aside>

        {/* Listings */}
        <main
          style={{ padding: "24px", background: "var(--bg-deep)" }}
          aria-label="Danh sách farmstay"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
              {filtered.length} farmstay phù hợp
            </p>
            <select
              style={{
                padding: "6px 12px",
                borderRadius: "var(--radius-sm)",
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "0.82rem",
                cursor: "pointer",
              }}
            >
              <option>Phổ biến nhất</option>
              <option>Giá thấp → cao</option>
              <option>Giá cao → thấp</option>
              <option>Đánh giá cao nhất</option>
            </select>
          </div>

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
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>🌿</div>
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
        </main>

        {/* Map panel */}
        <aside
          aria-label="Bản đồ farmstay"
          style={{
            borderLeft: "1px solid var(--border)",
            background: "var(--bg-main)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              padding: "16px 20px 12px",
              borderBottom: "1px solid var(--border)",
            }}
          >
            <h3
              style={{
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "var(--text-muted)",
              }}
            >
              🗺️ Bản đồ farmstay
            </h3>
            <p
              style={{
                fontSize: "0.75rem",
                color: "var(--text-dim)",
                marginTop: 2,
              }}
            >
              Click vào điểm để xem chi tiết
            </p>
          </div>
          <div style={{ flex: 1, minHeight: 400 }}>
            <FarmstayMap farmstays={filtered} />
          </div>
        </aside>
      </div>
    </>
  );
}
