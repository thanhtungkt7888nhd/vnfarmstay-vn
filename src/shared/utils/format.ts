/** Định dạng giá VNĐ: 850000 → "850.000đ" */
export function formatPrice(price: number): string {
  return price.toLocaleString("vi-VN") + "đ";
}

/** Badge label */
export function badgeLabel(badge: string): string {
  const map: Record<string, string> = {
    verified: "XÁC MINH",
    new: "MỚI",
    featured: "TIÊU BIỂU",
  };
  return map[badge] ?? badge.toUpperCase();
}
