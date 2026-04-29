/**
 * Render Sanity Portable Text thành HTML — dùng trên trang chi tiết bài viết.
 * Xử lý block text, headings, bold/italic, links, ảnh inline.
 */
"use client";

import type { SanityBlock } from "@/features/blog/types";
import { urlFor } from "@/lib/sanity";

interface PortableTextRendererProps {
  /** Mảng block content từ Sanity */
  content: SanityBlock[] | unknown[];
}

/** Render marks (bold, italic, link) cho text node */
function renderMark(
  text: string,
  marks: string[],
  markDefs: Array<{ _key: string; _type: string; href?: string }>
): React.ReactNode {
  let node: React.ReactNode = text;

  for (const mark of marks) {
    const def = markDefs?.find((d) => d._key === mark);
    if (def?._type === "link" && def.href) {
      node = (
        <a
          key={mark}
          href={def.href}
          target={def.href.startsWith("http") ? "_blank" : undefined}
          rel={def.href.startsWith("http") ? "noopener noreferrer" : undefined}
          style={{ color: "var(--gold)", textDecoration: "underline" }}
        >
          {node}
        </a>
      );
    } else if (mark === "strong") {
      node = <strong key={mark}>{node}</strong>;
    } else if (mark === "em") {
      node = <em key={mark}>{node}</em>;
    } else if (mark === "code") {
      node = (
        <code
          key={mark}
          style={{
            background: "rgba(255,255,255,0.06)",
            padding: "2px 6px",
            borderRadius: 4,
            fontFamily: "monospace",
            fontSize: "0.88em",
          }}
        >
          {node}
        </code>
      );
    }
  }
  return node;
}

/** Styles cho từng heading level */
const headingStyles: Record<string, React.CSSProperties> = {
  h1: { fontSize: "1.8rem", marginTop: 40, marginBottom: 16 },
  h2: { fontSize: "1.45rem", marginTop: 36, marginBottom: 14 },
  h3: { fontSize: "1.2rem", marginTop: 28, marginBottom: 12 },
  h4: { fontSize: "1.05rem", marginTop: 24, marginBottom: 10 },
};

/** Render một block Portable Text */
function renderBlock(block: SanityBlock): React.ReactNode {
  // Ảnh
  if (block._type === "image") {
    const imgUrl = block.asset ? urlFor(block).width(760).url() : null;
    if (!imgUrl) return null;
    return (
      <figure key={block._key} style={{ margin: "32px 0" }}>
        <img
          src={imgUrl}
          alt={(block as { alt?: string }).alt ?? ""}
          style={{
            width: "100%",
            borderRadius: "var(--radius-sm)",
            display: "block",
          }}
          loading="lazy"
        />
      </figure>
    );
  }

  if (block._type !== "block" || !block.children) return null;

  const style = block.style ?? "normal";
  const markDefs = block.markDefs ?? [];

  // Render inline children
  const children = block.children.map((child, i) => (
    <span key={child._key ?? i}>
      {renderMark(child.text, child.marks ?? [], markDefs)}
    </span>
  ));

  const baseStyle: React.CSSProperties = {
    fontFamily: "var(--font-be-vietnam), sans-serif",
    color: "var(--text-primary)",
    lineHeight: 1.8,
  };

  if (style === "blockquote") {
    return (
      <blockquote
        key={block._key}
        style={{
          ...baseStyle,
          borderLeft: "3px solid var(--gold)",
          paddingLeft: 20,
          margin: "28px 0",
          color: "var(--text-muted)",
          fontStyle: "italic",
        }}
      >
        {children}
      </blockquote>
    );
  }

  if (style === "normal") {
    return (
      <p
        key={block._key}
        style={{ ...baseStyle, marginBottom: 20, fontSize: "0.97rem" }}
      >
        {children}
      </p>
    );
  }

  if (style in headingStyles) {
    // Chỉ cho phép heading tags hợp lệ
    type HeadingTag = "h1" | "h2" | "h3" | "h4";
    const validHeadings: HeadingTag[] = ["h1", "h2", "h3", "h4"];
    const Tag = validHeadings.includes(style as HeadingTag)
      ? (style as HeadingTag)
      : ("h2" as const);
    return (
      <Tag
        key={block._key}
        style={{
          ...baseStyle,
          ...headingStyles[style],
          fontFamily: "var(--font-playfair), serif",
          fontWeight: 700,
        }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <p key={block._key} style={{ ...baseStyle, marginBottom: 20 }}>
      {children}
    </p>
  );
}

/** Component chính render mảng blocks */
export function PortableTextRenderer({ content }: PortableTextRendererProps) {
  const blocks = content as SanityBlock[];

  // Gom bullet/numbered list
  const elements: React.ReactNode[] = [];
  let listBuffer: SanityBlock[] = [];
  let listType: "bullet" | "number" | null = null;

  const flushList = () => {
    if (listBuffer.length === 0) return;
    const Tag = listType === "number" ? "ol" : "ul";
    elements.push(
      <Tag
        key={`list-${elements.length}`}
        style={{ paddingLeft: 24, marginBottom: 20, lineHeight: 1.8 }}
      >
        {listBuffer.map((b) => (
          <li
            key={b._key}
            style={{
              color: "var(--text-primary)",
              marginBottom: 6,
              fontSize: "0.97rem",
            }}
          >
            {b.children?.map((child, i) => (
              <span key={child._key ?? i}>
                {renderMark(child.text, child.marks ?? [], b.markDefs ?? [])}
              </span>
            ))}
          </li>
        ))}
      </Tag>
    );
    listBuffer = [];
    listType = null;
  };

  for (const block of blocks) {
    const style = block.style ?? "normal";

    if (style === "bullet" || style === "number") {
      if (listType && listType !== style) flushList();
      listType = style as "bullet" | "number";
      listBuffer.push(block);
    } else {
      flushList();
      const rendered = renderBlock(block);
      if (rendered) elements.push(rendered);
    }
  }
  flushList();

  return <div style={{ fontSize: "0.97rem" }}>{elements}</div>;
}
