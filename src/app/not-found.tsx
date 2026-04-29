import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "404 – Không tìm thấy trang" };

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg-deep)",
        padding: "40px 24px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "4rem", marginBottom: 20 }}>🌾</div>
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 700,
          color: "var(--gold)",
          marginBottom: 12,
        }}
      >
        404
      </h1>
      <p
        style={{
          color: "var(--text-muted)",
          marginBottom: 32,
          fontSize: "1.05rem",
        }}
      >
        Trang này đã đi hoạch định ở vùng quê — không tìm thấy.
      </p>
      <Link
        href="/"
        style={{
          padding: "12px 32px",
          borderRadius: 20,
          background: "var(--gold)",
          color: "var(--bg-deep)",
          fontWeight: 700,
          fontSize: "0.9rem",
        }}
      >
        Về trang chủ
      </Link>
    </div>
  );
}
