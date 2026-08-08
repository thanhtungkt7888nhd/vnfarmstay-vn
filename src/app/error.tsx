"use client";
/**
 * Trang lỗi 500 — hiển thị khi server component throw error.
 * Phải là Client Component để Next.js có thể recovery.
 */
import { useEffect } from "react";
import Link from "next/link";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    // Log lỗi để monitoring (có thể gửi Sentry sau này)
    console.error("[vnfarmstay.vn Error]", error);
  }, [error]);

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
        />
        <line
          x1="26"
          y1="2"
          x2="2"
          y2="26"
          stroke="var(--accent-ma)"
          strokeWidth="1.2"
        />
        <circle cx="14" cy="14" r="3" fill="var(--gold)" />
      </svg>

      {/* Code */}
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: 700,
          color: "var(--gold)",
          marginBottom: 12,
        }}
      >
        500
      </h1>

      {/* Title */}
      <h2
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 16,
        }}
      >
        Có lỗi xảy ra
      </h2>

      {/* Description */}
      <p
        style={{
          color: "var(--text-muted)",
          maxWidth: 480,
          lineHeight: 1.7,
          marginBottom: 40,
        }}
      >
        Máy chủ gặp sự cố tạm thời. Vui lòng thử lại sau vài giây — chúng tôi đã
        ghi nhận và đang xử lý.
      </p>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: 16,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={reset}
          style={{
            padding: "12px 28px",
            borderRadius: "var(--radius-sm)",
            background: "var(--gold)",
            color: "#0f2318",
            fontWeight: 700,
            fontSize: "0.95rem",
            border: "none",
            cursor: "pointer",
            transition: "var(--transition)",
          }}
          aria-label="Thử lại trang"
        >
          Thử lại
        </button>

        <Link
          href="/"
          style={{
            padding: "12px 28px",
            borderRadius: "var(--radius-sm)",
            border: "1px solid var(--gold-border)",
            color: "var(--text-muted)",
            fontSize: "0.95rem",
            display: "inline-block",
          }}
        >
          Về trang chủ
        </Link>
      </div>

      {/* Error digest for support */}
      {error.digest && (
        <p
          style={{
            marginTop: 48,
            fontSize: "0.75rem",
            color: "var(--text-dim)",
            opacity: 0.6,
          }}
        >
          Mã lỗi: {error.digest}
        </p>
      )}
    </div>
  );
}
