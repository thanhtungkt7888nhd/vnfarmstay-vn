"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navLinks = [
  { href: "/", label: "Khám phá" },
  { href: "/phap-ly", label: "Pháp lý" },
  { href: "/cong-dong", label: "Cộng đồng" },
  { href: "/ve-chung-toi", label: "Về chúng tôi" },
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
          aria-label="Farmstay.vn trang chủ"
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "var(--gold)",
            letterSpacing: "0.03em",
            whiteSpace: "nowrap",
          }}
        >
          Farmstay
          <span style={{ color: "var(--text-primary)", fontStyle: "italic" }}>
            .vn
          </span>
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

        {/* CTA buttons */}
        <div className="ml-auto hidden items-center gap-3 md:flex">
          <Link
            href="/dang-nhap"
            style={{
              padding: "7px 18px",
              borderRadius: "20px",
              border: "1px solid var(--border)",
              fontSize: "0.82rem",
              fontWeight: 500,
              color: "var(--text-muted)",
              transition: "var(--transition)",
            }}
          >
            Đăng nhập
          </Link>
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
          className="fixed inset-x-0 top-[62px] z-40 flex flex-col gap-2 p-4 md:hidden"
          style={{
            background: "rgba(15,35,24,0.98)",
            backdropFilter: "blur(16px)",
          }}
        >
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
          <Link
            href="/dang-farmstay"
            onClick={() => setOpen(false)}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              color: "var(--gold)",
              fontWeight: 700,
            }}
          >
            + Đăng farmstay
          </Link>
        </div>
      )}
    </>
  );
}
