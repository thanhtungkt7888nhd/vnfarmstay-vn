/**
 * Root loading state — hiển thị trong lúc trang chủ fetch dữ liệu farmstay.
 * Next.js dùng file này cho tất cả routes chưa có loading.tsx riêng.
 */

export default function RootLoading() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg-deep)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
      aria-label="Đang tải"
      aria-busy="true"
    >
      {/* Animated logo placeholder */}
      <div
        className="skeleton-pulse"
        style={{
          width: 120,
          height: 32,
          borderRadius: 6,
          background: "rgba(212,168,83,0.15)",
        }}
      />
      <div
        className="skeleton-pulse"
        style={{
          width: 200,
          height: 14,
          borderRadius: 4,
          background: "rgba(168,197,176,0.08)",
        }}
      />
    </div>
  );
}
