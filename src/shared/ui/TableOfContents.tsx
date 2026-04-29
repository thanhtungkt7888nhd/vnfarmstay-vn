/**
 * Table of Contents — client component, parse headings từ content.
 * Dùng trên trang blog/[slug] dài có nhiều section.
 */
"use client";

import { useEffect, useState } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  /** Selector CSS để tìm headings trong article, mặc định "article h2, article h3" */
  selector?: string;
}

/** Tự động parse h2/h3 trong bài viết và tạo TOC sticky */
export function TableOfContents({
  selector = "article h2, article h3",
}: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll(selector));
    const toc: TocItem[] = headings.map((el, idx) => {
      const id = el.id || `heading-${idx}`;
      if (!el.id) el.id = id;
      return {
        id,
        text: el.textContent ?? "",
        level: parseInt(el.tagName.charAt(1), 10),
      };
    });
    setItems(toc);
  }, [selector]);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: "-20% 0% -70% 0%" }
    );

    items.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  if (items.length < 3) return null;

  return (
    <nav
      aria-label="Mục lục"
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        padding: "20px",
        marginBottom: 32,
      }}
    >
      <p
        style={{
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "var(--text-dim)",
          letterSpacing: "0.08em",
          marginBottom: 12,
        }}
      >
        MỤC LỤC
      </p>
      <ol
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        {items.map((item) => (
          <li
            key={item.id}
            style={{
              paddingLeft: item.level === 3 ? 16 : 0,
            }}
          >
            <a
              href={`#${item.id}`}
              style={{
                fontSize: "0.82rem",
                color:
                  activeId === item.id ? "var(--gold)" : "var(--text-muted)",
                textDecoration: "none",
                lineHeight: 1.5,
                fontWeight: activeId === item.id ? 600 : 400,
                transition: "color 0.2s",
              }}
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById(item.id)
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
