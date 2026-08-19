"use client";

/**
 * Bộ lắng nghe UỶ NHIỆM cho sự kiện đo lường — gắn một lần ở layout.
 *
 * Vì sao không gắn `onClick` vào từng nút: gần như mọi trang của web này là server
 * component. Thêm `onClick` buộc phải dán `"use client"` lên chúng, kéo cả cây giao
 * diện xuống trình duyệt và làm trang nặng thêm — trả giá hiệu năng chỉ để đếm cú bấm.
 *
 * Cách dùng: ở BẤT KỲ thành phần máy chủ nào, gắn thuộc tính dữ liệu lên thẻ:
 *
 *   <a href="…" data-su-kien="related_destination_click" data-sk-den="tay-bac">
 *
 * Bộ này bắt cú bấm khi nó nổi lên tới `document`, đọc nhãn rồi chuyển cho
 * `ghiNhan` trong `@/lib/do-luong` — nơi duy nhất chạm tới thư viện đo lường và
 * cũng là nơi tôn trọng cổng đồng ý PDPL.
 *
 * Sự kiện xem trang (`route_view`) đọc từ `data-su-kien-tai` đặt trên thẻ `<main>`.
 */

import { useEffect } from "react";
import { ghiNhan, type TenSuKien } from "@/lib/do-luong";

/** Gom mọi `data-sk-*` trên thẻ thành tham số gửi kèm sự kiện. */
function docThamSo(el: HTMLElement): Record<string, string> {
  const ra: Record<string, string> = {};
  for (const [khoa, gt] of Object.entries(el.dataset)) {
    if (khoa.startsWith("sk") && khoa !== "suKien" && gt) {
      const ten = khoa.slice(2).replace(/^[A-Z]/, (c) => c.toLowerCase());
      ra[ten] = gt;
    }
  }
  return ra;
}

export function TheoDoiSuKien() {
  useEffect(() => {
    /* Sự kiện xem trang — đọc nhãn đặt sẵn trên <main>. */
    const main = document.querySelector<HTMLElement>("main[data-su-kien-tai]");
    if (main?.dataset.suKienTai) {
      ghiNhan(main.dataset.suKienTai as TenSuKien, docThamSo(main));
    }

    /* Cú bấm — bắt ở giai đoạn nổi bọt nên phủ mọi thẻ con thêm vào sau. */
    const khiBam = (e: MouseEvent) => {
      const dich = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-su-kien]"
      );
      if (!dich?.dataset.suKien) return;
      ghiNhan(dich.dataset.suKien as TenSuKien, docThamSo(dich));
    };

    /* Gửi biểu mẫu. */
    const khiGui = (e: Event) => {
      const dich = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "form[data-su-kien-gui]"
      );
      if (!dich?.dataset.suKienGui) return;
      ghiNhan(dich.dataset.suKienGui as TenSuKien, docThamSo(dich));
    };

    document.addEventListener("click", khiBam, { passive: true });
    document.addEventListener("submit", khiGui, { passive: true });
    return () => {
      document.removeEventListener("click", khiBam);
      document.removeEventListener("submit", khiGui);
    };
  }, []);

  return null;
}
