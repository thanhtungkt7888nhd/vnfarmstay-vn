/**
 * Dynamic OG image generator — /api/og?title=...&subtitle=...
 * Dùng @vercel/og (Next.js ImageResponse) để tạo ảnh 1200×630px.
 * Hiển thị logo + tiêu đề + nền gradient xanh đậm của vnfarmstay.vn.
 */
import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") ?? "vnfarmstay.vn";
  const subtitle =
    searchParams.get("subtitle") ??
    "Trải nghiệm nông nghiệp đích thực Việt Nam";

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "flex-end",
        padding: "64px 72px",
        background:
          "linear-gradient(135deg, #0a1a0f 0%, #0f2318 60%, #1a3a25 100%)",
        fontFamily: "serif",
      }}
    >
      {/* Decorative top bar */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: "#c4a046",
        }}
      />

      {/* Logo */}
      <div
        style={{
          position: "absolute",
          top: 48,
          left: 72,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "#e8d5a3", fontSize: 22, fontWeight: 700 }}>
          Farmstay
        </span>
        <span style={{ color: "#c4a046", fontSize: 22, fontWeight: 700 }}>
          .vn
        </span>
      </div>

      {/* Decorative leaf */}
      <div
        style={{
          position: "absolute",
          right: 72,
          top: "50%",
          fontSize: 160,
          opacity: 0.06,
          transform: "translateY(-50%)",
        }}
      >
        🌿
      </div>

      {/* Title */}
      <div
        style={{
          fontSize: title.length > 60 ? 38 : 48,
          fontWeight: 700,
          color: "#e8d5a3",
          lineHeight: 1.25,
          marginBottom: 20,
          maxWidth: 900,
        }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <div
        style={{
          fontSize: 22,
          color: "#8aab94",
          lineHeight: 1.5,
          maxWidth: 760,
        }}
      >
        {subtitle}
      </div>

      {/* Bottom divider */}
      <div
        style={{
          position: "absolute",
          bottom: 48,
          right: 72,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <span style={{ color: "#c4a046", fontSize: 14 }}>vnfarmstay.vn</span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
