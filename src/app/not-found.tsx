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
      {/* Mô-típ X — hoa văn chữ ký thương hiệu, thay emoji (LUẬT THIẾT KẾ: không emoji) */}
      <svg
        width="56"
        height="56"
        viewBox="0 0 28 28"
        aria-hidden="true"
        style={{ marginBottom: 20 }}
      >
        <line
          x1="2"
          y1="2"
          x2="26"
          y2="26"
          stroke="var(--accent-ma)"
          strokeWidth="1.2"
          className="fx-line-draw"
        />
        <line
          x1="26"
          y1="2"
          x2="2"
          y2="26"
          stroke="var(--accent-ma)"
          strokeWidth="1.2"
          className="fx-line-draw"
        />
        <circle cx="14" cy="14" r="3" fill="var(--gold)" />
      </svg>
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
          fontSize: "0.95rem",
        }}
      >
        Về trang chủ
      </Link>
    </div>
  );
}
