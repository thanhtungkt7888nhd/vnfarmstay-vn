/**
 * Component breadcrumb navigation — dùng trên trang blog, farmstay, danh mục.
 * Không cần JSON-LD ở đây — schema được inject qua JsonLd trong page.tsx.
 */

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
}

/** Render breadcrumb với separator "›" */
export function BreadcrumbNav({ items }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      style={{
        marginBottom: 20,
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 4,
      }}
    >
      <a
        href="/"
        style={{
          color: "var(--text-dim)",
          fontSize: "0.8rem",
          textDecoration: "none",
        }}
      >
        Trang chủ
      </a>
      {items.map((item) => (
        <span
          key={item.href}
          style={{ display: "flex", alignItems: "center", gap: 4 }}
        >
          <span style={{ color: "var(--text-dim)", fontSize: "0.8rem" }}>
            ›
          </span>
          <a
            href={item.href}
            style={{
              color: "var(--text-dim)",
              fontSize: "0.8rem",
              textDecoration: "none",
            }}
          >
            {item.name}
          </a>
        </span>
      ))}
    </nav>
  );
}
