/**
 * Skeleton loading state cho trang /blog — hiện trong khi ISR revalidate.
 * Next.js tự dùng file này khi data chưa sẵn.
 */

/** Skeleton card giả lập PostCard */
function SkeletonCard() {
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-sm)",
        overflow: "hidden",
      }}
      aria-hidden="true"
    >
      <div
        style={{ width: "100%", height: 200, background: "var(--bg-deep)" }}
        className="skeleton-pulse"
      />
      <div style={{ padding: "20px 20px 24px" }}>
        <div
          style={{
            height: 14,
            width: "40%",
            background: "var(--bg-deep)",
            borderRadius: 20,
            marginBottom: 12,
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: 20,
            width: "90%",
            background: "var(--bg-deep)",
            borderRadius: 4,
            marginBottom: 8,
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: 20,
            width: "70%",
            background: "var(--bg-deep)",
            borderRadius: 4,
            marginBottom: 16,
          }}
          className="skeleton-pulse"
        />
        <div
          style={{
            height: 14,
            width: "30%",
            background: "var(--bg-deep)",
            borderRadius: 4,
          }}
          className="skeleton-pulse"
        />
      </div>
    </div>
  );
}

export default function BlogLoading() {
  return (
    /* Dùng <div role="status"> chứ KHÔNG dùng <main> (sửa 19/08/2026): màn chờ này
       được gửi kèm trong cùng luồng HTML với trang thật, nên máy đo bắt được HAI thẻ
       <main> trên /blog. Trình đọc màn hình chỉ được thấy một landmark chính. */
    <div
      role="status"
      style={{ background: "var(--bg-main)", minHeight: "100vh" }}
      aria-label="Đang tải danh sách bài viết"
      aria-busy="true"
    >
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "60px 24px" }}>
        {/* Title skeleton */}
        <div
          style={{
            height: 36,
            width: 260,
            background: "var(--bg-card)",
            borderRadius: 4,
            marginBottom: 40,
          }}
          className="skeleton-pulse"
        />
        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 28,
          }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
