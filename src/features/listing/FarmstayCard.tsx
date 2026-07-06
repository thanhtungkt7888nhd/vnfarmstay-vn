import Link from "next/link";
import type { Farmstay } from "@/shared/types/farmstay";
import { formatPrice, badgeLabel } from "@/shared/utils/format";

interface Props {
  farmstay: Farmstay;
}

const badgeColors: Record<string, string> = {
  verified: "#2563eb",
  new: "#7c3aed",
  featured: "#b45309",
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
    <Link
      href={`/farmstay/${farmstay.slug}`}
      style={{
        background: "var(--bg-card)",
        borderRadius: "var(--radius)",
        border: "1px solid var(--border)",
        overflow: "hidden",
        transition: "var(--transition)",
        display: "block",
      }}
    >
      {/* Image placeholder */}
      <div
        style={{
          height: 200,
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
          {farmstay.badges.map((badge) => (
            <span
              key={badge}
              style={{
                padding: "3px 8px",
                borderRadius: 4,
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.05em",
                background: badgeColors[badge] ?? "#374151",
                color: "#fff",
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
            fontSize: "0.7rem",
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
            fontSize: "0.98rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 8,
            lineHeight: 1.35,
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
          <div>
            <span style={{ fontSize: "0.72rem", color: "var(--text-dim)" }}>
              {farmstay.rating}★ ({farmstay.reviewCount} đánh giá)
            </span>
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
      </div>
    </Link>
  );
}
