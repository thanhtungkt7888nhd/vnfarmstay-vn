"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Farmstay" },
  { href: "/blog", label: "Câu chuyện" },
  { href: "/cong-dong", label: "Cộng đồng" },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [memberOpen, setMemberOpen] = useState(false);
  const memberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (memberRef.current && !memberRef.current.contains(e.target as Node)) {
        setMemberOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

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
          {/* Thành viên dropdown */}
          <div ref={memberRef} style={{ position: "relative" }}>
            <button
              onClick={() => setMemberOpen(!memberOpen)}
              aria-label="Thành viên"
              aria-expanded={memberOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                borderRadius: "20px",
                border: "1px solid var(--border)",
                fontSize: "0.82rem",
                fontWeight: 500,
                color: "var(--text-muted)",
                background: "transparent",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
            >
              {/* User icon */}
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              Thành viên
            </button>

            {memberOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  background: "var(--bg-card)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "8px",
                  minWidth: 220,
                  zIndex: 60,
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  style={{
                    padding: "4px 10px 8px",
                    fontSize: "0.72rem",
                    color: "var(--text-dim)",
                    fontWeight: 600,
                    letterSpacing: ".05em",
                    textTransform: "uppercase",
                  }}
                >
                  Đăng ký thành viên
                </div>
                <Link
                  href="/dang-nhap?role=traveler"
                  onClick={() => setMemberOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "var(--text-primary)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      display: "block",
                      color: "var(--text-dim)",
                      marginBottom: 2,
                    }}
                  >
                    Tôi là
                  </span>
                  Khách du lịch
                </Link>
                <Link
                  href="/chu-farmstay"
                  onClick={() => setMemberOpen(false)}
                  style={{
                    display: "block",
                    padding: "10px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    color: "var(--gold)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.72rem",
                      display: "block",
                      color: "var(--text-dim)",
                      marginBottom: 2,
                    }}
                  >
                    Tôi là
                  </span>
                  Chủ farmstay
                </Link>
                <div
                  style={{
                    borderTop: "1px solid var(--border)",
                    margin: "4px 0",
                  }}
                />
                <Link
                  href="/dang-nhap"
                  onClick={() => setMemberOpen(false)}
                  style={{
                    display: "block",
                    padding: "8px 10px",
                    borderRadius: "var(--radius-sm)",
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                  }}
                >
                  Đã có tài khoản? Đăng nhập
                </Link>
              </div>
            )}
          </div>

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

          <div
            style={{
              padding: "4px 16px",
              fontSize: "0.72rem",
              color: "var(--text-dim)",
              fontWeight: 600,
              letterSpacing: ".05em",
              textTransform: "uppercase",
            }}
          >
            Thành viên
          </div>
          <Link
            href="/dang-nhap?role=traveler"
            onClick={() => setOpen(false)}
            style={{
              padding: "12px 16px",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            Khách du lịch
          </Link>
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
            href="/dang-nhap"
            onClick={() => setOpen(false)}
            style={{
              padding: "10px 16px",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-dim)",
              fontSize: "0.82rem",
            }}
          >
            Đăng nhập
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
