/**
 * Biểu tượng tab (32×32) — LOGO CỦA CHÍNH WEB NÀY.
 * Sinh bởi scripts/sua-bieu-tuong-tab.mjs (19/08/2026), thay icon mặc định Next.js (tam giác đen).
 */
import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const buf = readFileSync(join(process.cwd(), "public/logo-icon.png"));
  const uri = `data:image/png;base64,${buf.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 6,
        display: "flex",
        // Dùng ẢNH NỀN chứ không thẻ <img>: mỗi web cấu hình eslint một kiểu, có web khai quy tắc
        // no-img-element có web không — dòng tắt cảnh báo trỏ tới quy tắc không tồn tại làm HOOK
        // pre-commit gãy (đã trả giá 19/08 trên dakago-vn). Ảnh nền tránh hẳn chuyện đó.
        backgroundImage: `url(${uri})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    />,
    { ...size }
  );
}
