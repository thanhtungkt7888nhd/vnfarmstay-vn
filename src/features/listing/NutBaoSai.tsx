"use client";

/**
 * NÚT "THẤY THÔNG TIN SAI?" — cơ chế tự sửa của cả hệ thống (Trụ D, việc D2).
 *
 * ⛔ Nút này chỉ hiện khi kênh nhận ĐÃ MỞ (trang cha quyết định, đọc lúc dựng).
 * Nút báo lỗi mà không ai nhận được còn tệ hơn không có nút: nó tạo cảm giác an
 * toàn giả — người đọc tưởng đã báo rồi nên thôi không tìm cách khác, còn thông tin
 * sai thì cứ nằm nguyên trên web.
 *
 * Chỉ báo "đã ghi nhận" khi máy chủ trả `ok: true`, mà máy chủ chỉ trả `ok: true`
 * khi bảng tính xác nhận — cùng một luật với biểu mẫu gửi hồ sơ.
 */
import { useState } from "react";

interface Props {
  farmSlug: string;
}

export function NutBaoSai({ farmSlug }: Props) {
  const [moForm, setMoForm] = useState(false);
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState("");
  const [xong, setXong] = useState(false);

  async function guiDi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoi("");
    setDangGui(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/bao-sai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmSlug,
          saiChoNao: fd.get("saiChoNao"),
          lienHeNguoiBao: fd.get("lienHeNguoiBao"),
        }),
      });
      const kq = await res.json();
      if (res.ok && kq?.ok === true) setXong(true);
      else setLoi(kq?.loi ?? "Chưa gửi được. Xin thử lại sau ít phút.");
    } catch {
      setLoi("Không kết nối được tới máy chủ. Chữ bạn vừa gõ vẫn còn nguyên.");
    } finally {
      setDangGui(false);
    }
  }

  if (xong) {
    return (
      <p
        role="status"
        style={{
          fontSize: "0.8rem",
          color: "var(--gold)",
          lineHeight: 1.65,
          marginTop: 10,
        }}
      >
        Đã ghi nhận. Chúng tôi kiểm lại và sẽ sửa, hoặc hạ cấp xác minh xuống
        cho đúng bằng chứng đang có. Cảm ơn bạn.
      </p>
    );
  }

  if (!moForm) {
    return (
      <button
        type="button"
        onClick={() => setMoForm(true)}
        style={{
          marginTop: 10,
          /* ≥44px — vùng chạm đủ lớn trên điện thoại */
          minHeight: 44,
          padding: "10px 0",
          background: "none",
          border: "none",
          color: "var(--gold)",
          fontSize: "0.78rem",
          fontFamily: "inherit",
          cursor: "pointer",
          textAlign: "left",
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        Thấy thông tin sai? Báo cho chúng tôi →
      </button>
    );
  }

  return (
    <form onSubmit={guiDi} style={{ marginTop: 12 }}>
      <label
        htmlFor="saiChoNao"
        style={{
          display: "block",
          fontSize: "0.78rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: 6,
        }}
      >
        Thông tin nào đang sai?
      </label>
      <textarea
        id="saiChoNao"
        name="saiChoNao"
        required
        rows={3}
        placeholder="Ví dụ: số điện thoại không gọi được, farm đã đóng cửa, đường đi đã đổi…"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          background: "var(--bg-deep)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          /* 16px — dưới mức này iPhone tự phóng to trang khi chạm vào ô */
          fontSize: "16px",
          fontFamily: "inherit",
          lineHeight: 1.5,
          resize: "vertical",
        }}
      />
      <label
        htmlFor="lienHeNguoiBao"
        style={{
          display: "block",
          fontSize: "0.75rem",
          color: "var(--text-dim)",
          margin: "10px 0 6px",
        }}
      >
        Cách liên hệ lại với bạn (không bắt buộc)
      </label>
      <input
        id="lienHeNguoiBao"
        name="lienHeNguoiBao"
        style={{
          width: "100%",
          padding: "10px 12px",
          borderRadius: 8,
          background: "var(--bg-deep)",
          border: "1px solid var(--border)",
          color: "var(--text-primary)",
          fontSize: "16px",
          fontFamily: "inherit",
        }}
      />

      {loi && (
        <p
          role="alert"
          style={{
            fontSize: "0.78rem",
            color: "var(--gold-light)",
            lineHeight: 1.6,
            marginTop: 10,
          }}
        >
          {loi}
        </p>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <button
          type="submit"
          disabled={dangGui}
          style={{
            minHeight: 44,
            padding: "10px 18px",
            borderRadius: 20,
            background: dangGui ? "var(--gold-dim)" : "var(--gold)",
            color: dangGui ? "var(--text-muted)" : "var(--bg-deep)",
            fontWeight: 700,
            fontSize: "0.82rem",
            fontFamily: "inherit",
            border: "none",
            cursor: dangGui ? "wait" : "pointer",
          }}
        >
          {dangGui ? "Đang gửi…" : "Gửi lời báo"}
        </button>
        <button
          type="button"
          onClick={() => setMoForm(false)}
          style={{
            minHeight: 44,
            padding: "10px 18px",
            borderRadius: 20,
            background: "transparent",
            color: "var(--text-dim)",
            fontSize: "0.82rem",
            fontFamily: "inherit",
            border: "1px solid var(--border)",
            cursor: "pointer",
          }}
        >
          Thôi
        </button>
      </div>
    </form>
  );
}
