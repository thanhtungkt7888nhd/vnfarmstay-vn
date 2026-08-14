import Link from "next/link";
import type { Farmstay } from "@/shared/types/farmstay";
import { formatPrice, badgeLabel } from "@/shared/utils/format";

interface Props {
  farmstay: Farmstay;
}

/* Màu badge dùng brand tokens thay vì hex cứng */
const badgeStyle: Record<string, React.CSSProperties> = {
  verified: {
    background: "oklch(0.22 0.12 132 / 0.9)",
    color: "var(--accent-ma)",
    border: "1px solid oklch(0.7 0.18 115 / 0.4)",
  },
  new: {
    background: "oklch(0.18 0.12 75 / 0.9)",
    color: "var(--gold)",
    border: "1px solid var(--gold-border)",
  },
  featured: {
    background: "oklch(0.18 0.12 75 / 0.9)",
    color: "var(--gold-light)",
    border: "1px solid var(--gold-border)",
  },
};

const REGION_GRADIENT: Record<string, string> = {
  north: "linear-gradient(135deg, #1a3d28, #2d5a3f)",
  central: "linear-gradient(135deg, #213d2e, #3d6b52)",
  south: "linear-gradient(135deg, #0f2318, #1a3d28)",
};

const REGION_LABEL: Record<string, string> = {
  north: "MIỀN BẮC",
  central: "MIỀN TRUNG",
  south: "MIỀN NAM",
};

export function FarmstayCard({ farmstay }: Props) {
  return (
    <Link href={`/farmstay/${farmstay.slug}`} className="farmstay-card">
      {/* Image placeholder — aspect-ratio 16/9 thay vì height cứng */}
      <div
        style={{
          aspectRatio: "16/9",
          background: REGION_GRADIENT[farmstay.region] ?? REGION_GRADIENT.south,
          position: "relative",
        }}
      >
        {/* Badges */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            display: "flex",
            gap: 6,
          }}
        >
          {farmstay.badges?.map((badge) => (
            <span
              key={badge}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                fontSize: "0.72rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                ...(badgeStyle[badge] ?? {
                  background: "oklch(0.22 0.05 130 / 0.9)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }),
              }}
            >
              {badgeLabel(badge)}
            </span>
          ))}
        </div>
        <span
          style={{
            position: "absolute",
            bottom: 10,
            right: 14,
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: "rgba(255,255,255,0.78)",
          }}
        >
          {REGION_LABEL[farmstay.region] ?? ""}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-dim)",
            marginBottom: 4,
          }}
        >
          {farmstay.location.toUpperCase()}
        </div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 8,
            lineHeight: 1.25,
          }}
        >
          {farmstay.name}
        </h3>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {farmstay.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--gold-dim)",
                border: "1px solid var(--gold-border)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Không có điểm đánh giá thật thì không hiện gì — không hiện "undefined★". */}
          <div>
            {farmstay.rating !== undefined && (
              <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
                {farmstay.rating}★
                {farmstay.reviewCount !== undefined &&
                  ` (${farmstay.reviewCount} đánh giá)`}
              </span>
            )}
          </div>
          <div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 700,
                color: "var(--gold)",
              }}
            >
              {formatPrice(farmstay.price)}
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
              /đêm
            </span>
          </div>
        </div>

        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
            fontSize: "0.8rem",
            color: "var(--gold)",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          Xem farm →
        </div>
      </div>
    </Link>
  );
}
