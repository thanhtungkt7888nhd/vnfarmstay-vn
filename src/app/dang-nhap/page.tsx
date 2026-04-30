"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { Navbar } from "@/shared/ui/Navbar";
import { Footer } from "@/shared/ui/Footer";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "var(--radius-sm)",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  outline: "none",
};

export default function DangNhapPage() {
  const [tab, setTab] = useState<"login" | "register">("login");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // TODO: kết nối auth khi có backend
  };

  return (
    <>
      <Navbar />
      <main
        style={{
          background: "var(--bg-deep)",
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 440,
            background: "var(--bg-card)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid var(--border)",
            padding: "40px 36px",
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <span
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "1.5rem",
                fontWeight: 700,
              }}
            >
              Farmstay<span style={{ color: "var(--gold)" }}>.vn</span>
            </span>
          </div>

          {/* Tabs */}
          <div
            role="tablist"
            aria-label="Chọn chức năng"
            style={{
              display: "flex",
              background: "rgba(255,255,255,0.04)",
              borderRadius: "var(--radius-sm)",
              padding: 4,
              marginBottom: 28,
            }}
          >
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1,
                  padding: "8px",
                  borderRadius: "var(--radius-sm)",
                  border: "none",
                  background: tab === t ? "var(--bg-main)" : "transparent",
                  color: tab === t ? "var(--text-primary)" : "var(--text-dim)",
                  fontWeight: tab === t ? 600 : 400,
                  fontSize: "0.88rem",
                  cursor: "pointer",
                  transition: "var(--transition)",
                }}
              >
                {t === "login" ? "Đăng nhập" : "Đăng ký"}
              </button>
            ))}
          </div>

          <form
            onSubmit={handleSubmit}
            aria-label={
              tab === "login" ? "Form đăng nhập" : "Form đăng ký tài khoản"
            }
            style={{ display: "flex", flexDirection: "column", gap: 16 }}
          >
            {tab === "register" && (
              <div>
                <label
                  htmlFor="register-name"
                  style={{
                    display: "block",
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    color: "var(--text-muted)",
                    marginBottom: 6,
                    letterSpacing: "0.05em",
                  }}
                >
                  HỌ TÊN
                </label>
                <input
                  id="register-name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  autoComplete="name"
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label
                htmlFor="auth-email"
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 6,
                  letterSpacing: "0.05em",
                }}
              >
                EMAIL
              </label>
              <input
                id="auth-email"
                type="email"
                placeholder="ban@email.com"
                autoComplete="email"
                style={inputStyle}
              />
            </div>

            <div>
              <label
                htmlFor="auth-password"
                style={{
                  display: "block",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "var(--text-muted)",
                  marginBottom: 6,
                  letterSpacing: "0.05em",
                }}
              >
                MẬT KHẨU
              </label>
              <input
                id="auth-password"
                type="password"
                placeholder="••••••••"
                autoComplete={
                  tab === "login" ? "current-password" : "new-password"
                }
                style={inputStyle}
              />
            </div>

            {tab === "login" && (
              <div style={{ textAlign: "right" }}>
                <a
                  href="#"
                  style={{ fontSize: "0.8rem", color: "var(--gold)" }}
                >
                  Quên mật khẩu?
                </a>
              </div>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "13px",
                borderRadius: 20,
                background: "var(--gold)",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.92rem",
                border: "none",
                cursor: "pointer",
                marginTop: 4,
              }}
            >
              {tab === "login" ? "Đăng nhập" : "Tạo tài khoản"}
            </button>
          </form>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid var(--border)",
              textAlign: "center",
              fontSize: "0.78rem",
              color: "var(--text-dim)",
            }}
          >
            Là chủ farmstay?{" "}
            <a href="/dang-farmstay" style={{ color: "var(--gold)" }}>
              Đăng ký farmstay →
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
