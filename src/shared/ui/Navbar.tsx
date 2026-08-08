"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Farmstay" },
  { href: "/blog", label: "Câu chuyện" },
  { href: "/cong-dong", label: "Cộng đồng" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <nav
        className="sticky top-0 z-50 flex items-center gap-6 border-b px-6"
        style={{
          height: "var(--nav-h)",
          background: "rgba(15,35,24,0.95)",
          backdropFilter: "blur(16px)",
          borderColor: "var(--border)",
        }}
        aria-label="Menu chính"
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Vietnam Farmstay — Trang chủ"
          style={{ flexShrink: 0, display: "flex", alignItems: "center" }}
        >
          <Image
            src="/logo-x.png"
            alt="Vietnam Farmstay"
            width={36}
            height={36}
            priority
            style={{ height: 36, width: 36, objectFit: "contain" }}
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden flex-1 list-none items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                aria-current={pathname === link.href ? "page" : undefined}
                style={{
                  padding: "6px 14px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color:
                    pathname === link.href
                      ? "var(--text-primary)"
                      : "var(--text-muted)",
                  background:
                    pathname === link.href
                      ? "rgba(168,197,176,0.1)"
                      : "transparent",
                  transition: "var(--transition)",
                  display: "block",
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
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

      {/* Mobile menu */}
      {open && (
        <div
          className="fixed inset-x-0 top-[62px] z-40 flex flex-col gap-1 p-4 md:hidden"
          style={{
            background: "rgba(15,35,24,0.98)",
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ padding: "8px 16px 4px" }}>
            <Image
              src="/logo-x.png"
              alt="Vietnam Farmstay"
              width={30}
              height={30}
              style={{ height: 30, width: 30 }}
            />
          </div>

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
                fontWeight: 500,
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
            }}
          >
            Chủ farmstay
          </Link>

          <Link
            href="/dang-farmstay"
            onClick={() => setOpen(false)}
            style={{
              padding: "13px 16px",
              margin: "4px 0 0",
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
      )}
    </>
  );
}
