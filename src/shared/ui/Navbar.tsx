"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Farmstay" },
  { href: "/tour-farmstay", label: "Tour Farmstay" },
  { href: "/farmstay-la-gi", label: "Farmstay là gì" },
  { href: "/blog", label: "Câu chuyện" },
  { href: "/cong-dong", label: "Cộng đồng" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex items-center gap-6 border-b px-6"
        style={{
          height: "var(--nav-h)",
          background: "rgba(15,35,24,0.95)",
          backdropFilter: "blur(16px)",
          borderColor: scrolled
            ? "oklch(0.6 0.07 125 / 0.22)"
            : "var(--border)",
          boxShadow: scrolled ? "0 4px 24px oklch(0 0 0 / 0.35)" : "none",
          transition:
            "border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease)",
        }}
        aria-label="Menu chính"
      >
        {/* Logo + tên thương hiệu */}
        <Link
          href="/"
          aria-label="vnfarmstay.vn — Trang chủ"
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Image
            src="/logo-x.png"
            alt="Vietnam Farmstay"
            width={36}
            height={36}
            priority
            style={{ height: 36, width: 36, objectFit: "contain" }}
          />
          <span
            className="hidden md:block"
            style={{
              fontFamily: "var(--font-display), serif",
              fontSize: "1rem",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1,
            }}
          >
            <span style={{ color: "var(--gold)" }}>vnfarmstay</span>
            <span style={{ color: "var(--text-dim)", fontWeight: 400 }}>
              .vn
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden flex-1 list-none items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  style={{
                    padding: "6px 14px",
                    paddingBottom: "4px",
                    fontSize: "0.85rem",
                    fontWeight: active ? 600 : 500,
                    color: active ? "var(--gold)" : "var(--text-muted)",
                    borderBottom: active
                      ? "2px solid var(--gold)"
                      : "2px solid transparent",
                    transition: "var(--transition)",
                    display: "block",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTAs */}
        <div className="ml-auto hidden items-center gap-2 md:flex">
          {/* Cụm "Thành viên" (Đăng ký thành viên · Khách du lịch · Đăng nhập) đã GỠ
              08/08/2026: web không có hệ thống tài khoản, /dang-nhap chỉ là form câm
              bấm nút không xảy ra gì. Lối vào cho chủ farmstay giữ ở nút ngay dưới đây. */}

          {/* Chủ farmstay (CTA phụ) */}
          <Link
            href="/chu-farmstay"
            style={{
              padding: "7px 18px",
              borderRadius: "20px",
              border: "1px solid rgba(212,168,83,0.45)",
              fontSize: "0.82rem",
              fontWeight: 600,
              color: "var(--gold)",
              transition: "var(--transition)",
            }}
          >
            Chủ farmstay
          </Link>

          {/* Đăng farmstay (CTA chính) */}
          <Link
            href="/dang-farmstay"
            style={{
              padding: "8px 20px",
              borderRadius: "20px",
              background: "var(--gold)",
              color: "var(--bg-deep)",
              fontSize: "0.82rem",
              fontWeight: 700,
              transition: "var(--transition)",
            }}
          >
            + Đăng farmstay
          </Link>
        </div>

        {/* Hamburger */}
        <button
          className="ml-auto flex flex-col gap-1.5 p-2 md:hidden"
          aria-label={open ? "Đóng menu" : "Mở menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span
            style={{
              width: 22,
              height: 2,
              background: "var(--text-muted)",
              display: "block",
              transform: open ? "rotate(45deg) translate(5px,5px)" : "none",
              transition: "var(--transition)",
            }}
          />
          <span
            style={{
              width: 22,
              height: 2,
              background: "var(--text-muted)",
              display: "block",
              opacity: open ? 0 : 1,
              transition: "var(--transition)",
            }}
          />
          <span
            style={{
              width: 22,
              height: 2,
              background: "var(--text-muted)",
              display: "block",
              transform: open ? "rotate(-45deg) translate(5px,-5px)" : "none",
              transition: "var(--transition)",
            }}
          />
        </button>
      </nav>

      {/* Mobile menu — slide down animation */}
      <div
        className="fixed inset-x-0 top-[62px] z-40 md:hidden"
        style={{
          background: "rgba(15,35,24,0.98)",
          backdropFilter: "blur(16px)",
          overflow: "hidden",
          maxHeight: open ? "480px" : "0",
          transition: "max-height 350ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          borderBottom: open ? "1px solid var(--border)" : "none",
        }}
        aria-hidden={!open}
      >
        <div className="flex flex-col gap-1 p-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              style={{
                padding: "12px 16px",
                borderRadius: "var(--radius-sm)",
                color:
                  pathname === link.href ? "var(--gold)" : "var(--text-muted)",
                fontWeight: pathname === link.href ? 600 : 500,
                fontSize: "0.95rem",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div
            style={{ borderTop: "1px solid var(--border)", margin: "6px 0" }}
          />

          <Link
            href="/chu-farmstay"
            onClick={() => setOpen(false)}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              color: "var(--gold)",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            Chủ farmstay
          </Link>

          <Link
            href="/dang-farmstay"
            onClick={() => setOpen(false)}
            style={{
              padding: "13px 16px",
              margin: "4px 0 8px",
              borderRadius: "var(--radius-sm)",
              background: "var(--gold)",
              color: "var(--bg-deep)",
              fontWeight: 700,
              textAlign: "center",
              fontSize: "0.9rem",
            }}
          >
            + Đăng farmstay
          </Link>
        </div>
      </div>
    </>
  );
}
