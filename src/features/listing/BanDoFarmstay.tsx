"use client";

/**
 * KHỐI BẢN ĐỒ — vỏ bọc nối `FarmstayMap` (Leaflet) vào trang vùng và trang hồ sơ.
 *
 * ⚠️ `FarmstayMap.tsx` dựng xong từ lâu, chạy được, dùng bản đồ OpenStreetMap thật —
 * mà **không nơi nào gọi tới**. Mồ côi hoàn toàn. Tệp này là đường vào của nó.
 *
 * Ba điều kiện Trụ C đòi, làm bằng cấu trúc chứ không bằng lời hứa:
 *
 * ① **Không tự tải khi chưa cuộn tới.** Leaflet + ảnh ô bản đồ là gánh nặng thật;
 *    tải sẵn cho người không bao giờ cuộn xuống là phí băng thông của họ. Dùng
 *    `IntersectionObserver` — chỉ nạp khi khối sắp lọt vào màn hình.
 *
 * ② **Có bản thay thế cho bàn phím và trình đọc màn hình.** Bản đồ Leaflet là khối
 *    ảnh động, người dùng bàn phím không rê được. Danh sách liên kết bên dưới KHÔNG
 *    phải phụ lục — nó là đường đi song song, luôn hiện, chạy cả khi JavaScript tắt.
 *
 * ③ **Không farm nào ⇒ khối tự ẩn.** Bản đồ trống là vỏ rỗng — thà không có.
 */
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Farmstay } from "@/shared/types/farmstay";

/* Leaflet đụng `window` nên không dựng được ở máy chủ */
const FarmstayMap = dynamic(
  () => import("./FarmstayMap").then((m) => m.FarmstayMap),
  { ssr: false }
);

interface Props {
  farmstays: Farmstay[];
  tieuDe: string;
  /** Câu dẫn dưới tiêu đề — mỗi trang một cách nói */
  moTa?: string;
}

export function BanDoFarmstay({ farmstays, tieuDe, moTa }: Props) {
  const oRef = useRef<HTMLDivElement>(null);
  const [daVaoManHinh, setDaVaoManHinh] = useState(false);

  useEffect(() => {
    const o = oRef.current;
    if (!o || daVaoManHinh) return;

    /* Trình duyệt quá cũ không có IntersectionObserver ⇒ nạp luôn, thà nặng
       còn hơn người ta không bao giờ thấy bản đồ. */
    if (typeof IntersectionObserver === "undefined") {
      setDaVaoManHinh(true);
      return;
    }

    const theoDoi = new IntersectionObserver(
      (muc) => {
        if (muc.some((m) => m.isIntersecting)) {
          setDaVaoManHinh(true);
          theoDoi.disconnect();
        }
      },
      /* Nạp sớm trước 300px để bản đồ kịp hiện lúc người ta cuộn tới */
      { rootMargin: "300px" }
    );
    theoDoi.observe(o);
    return () => theoDoi.disconnect();
  }, [daVaoManHinh]);

  /* ③ Không có farm nào thì không có gì để chỉ — ẩn hẳn khối */
  if (farmstays.length === 0) return null;

  return (
    <section aria-label={tieuDe} style={{ paddingTop: 32, paddingBottom: 36 }}>
      <h2
        style={{
          fontFamily: "var(--font-display),serif",
          fontSize: "1.3rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          marginBottom: moTa ? 6 : 16,
        }}
      >
        {tieuDe}
      </h2>
      {moTa && (
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: "0.9rem",
            lineHeight: 1.65,
            marginBottom: 16,
          }}
        >
          {moTa}
        </p>
      )}

      <div
        ref={oRef}
        /* `aria-hidden` vì danh sách bên dưới đã chở đúng thông tin này ở dạng
           trình đọc màn hình dùng được — để cả hai cùng đọc là bắt người ta
           nghe hai lần cùng một thứ. */
        aria-hidden="true"
        style={{
          height: 380,
          borderRadius: "var(--radius-sm)",
          overflow: "hidden",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
        }}
      >
        {daVaoManHinh && <FarmstayMap farmstays={farmstays} />}
      </div>

      {/* ② Đường đi song song — luôn hiện, chạy cả khi JavaScript tắt */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: "14px 0 0",
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {farmstays.map((f) => (
          <li key={f.slug}>
            <Link
              href={`/farmstay/${f.slug}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                /* ≥44px — vùng chạm đủ lớn trên điện thoại */
                minHeight: 44,
                padding: "8px 14px",
                borderRadius: 20,
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                textDecoration: "none",
              }}
            >
              {f.ten}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
