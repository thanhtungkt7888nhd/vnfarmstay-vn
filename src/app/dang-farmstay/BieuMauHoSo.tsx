"use client";

/**
 * BIỂU MẪU GỬI HỒ SƠ FARMSTAY.
 *
 * ⚠️ Web này đã từng có một biểu mẫu và Ông ra lệnh GỠ HẲN 08/08/2026: nó
 * `setTimeout(1200)` rồi hiện "Đăng ký thành công" — không gửi đi đâu cả. Chủ farm
 * điền thật, thấy báo thành công, dữ liệu bốc hơi.
 *
 * Bản này khác ở đúng một điểm cốt tử: **chỉ hiện màn hình cảm ơn khi máy chủ trả
 * `ok: true`**, mà máy chủ chỉ trả `ok: true` khi bảng tính đã xác nhận nhận được.
 * Máy chủ trả lỗi thì chữ chủ farm vừa gõ VẪN CÒN NGUYÊN trong ô — không xoá trắng
 * công của người ta.
 *
 * Câu hỏi lấy thẳng từ `src/shared/types/farmstay.ts` (Trụ A). Thứ tự cũng theo đó,
 * để người duyệt đối chiếu hồ sơ gửi lên với trường cần điền không phải nhảy qua lại.
 */
import { useState } from "react";

interface MucChon {
  slug: string;
  ten: string;
}

interface Props {
  vung: MucChon[];
  traiNghiem: MucChon[];
}

const O_NHAP: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 8,
  background: "var(--bg-deep)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  /* 16px — dưới mức này iPhone tự phóng to trang khi chạm vào ô nhập */
  fontSize: "16px",
  lineHeight: 1.5,
  fontFamily: "inherit",
};

const O_NHAN: React.CSSProperties = {
  display: "block",
  fontSize: "0.85rem",
  fontWeight: 600,
  color: "var(--text-primary)",
  marginBottom: 6,
};

const GOI_Y: React.CSSProperties = {
  display: "block",
  fontSize: "0.78rem",
  color: "var(--text-dim)",
  lineHeight: 1.55,
  marginTop: 4,
};

const KHOI: React.CSSProperties = { marginBottom: 20 };

export function BieuMauHoSo({ vung, traiNghiem }: Props) {
  const [dangGui, setDangGui] = useState(false);
  const [loi, setLoi] = useState<string[]>([]);
  const [xong, setXong] = useState(false);

  async function guiDi(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoi([]);
    setDangGui(true);

    const fd = new FormData(e.currentTarget);
    const than = {
      tenFarm: fd.get("tenFarm"),
      tinh: fd.get("tinh"),
      vungSlug: fd.get("vungSlug"),
      diaChi: fd.get("diaChi"),
      cauChuyen: fd.get("cauChuyen"),
      hoTenChuFarm: fd.get("hoTenChuFarm"),
      soDienThoai: fd.get("soDienThoai"),
      zalo: fd.get("zalo"),
      webRieng: fd.get("webRieng"),
      lichMuaVu: fd.get("lichMuaVu"),
      duongDi: fd.get("duongDi"),
      ungXu: fd.get("ungXu"),
      giaThamKhao: fd.get("giaThamKhao"),
      traiNghiemSlugs: fd.getAll("traiNghiemSlugs"),
      dongYTheoDoi: fd.get("dongYTheoDoi") === "co",
    };

    try {
      const res = await fetch("/api/dang-farmstay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(than),
      });
      const ketQua = await res.json();
      /* Chỉ đổi sang màn hình cảm ơn khi máy chủ nói rõ là ĐÃ LƯU. */
      if (res.ok && ketQua?.ok === true) {
        setXong(true);
      } else {
        setLoi(
          Array.isArray(ketQua?.loi) && ketQua.loi.length > 0
            ? ketQua.loi
            : ["Chưa gửi được hồ sơ. Xin thử lại sau ít phút."]
        );
      }
    } catch {
      setLoi([
        "Không kết nối được tới máy chủ. Chữ bạn vừa điền vẫn còn nguyên — xin thử lại.",
      ]);
    } finally {
      setDangGui(false);
    }
  }

  if (xong) {
    return (
      <div
        role="status"
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--gold-border)",
          borderRadius: "var(--radius)",
          padding: "32px 28px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display),serif",
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "var(--gold)",
            marginBottom: 12,
          }}
        >
          Hồ sơ của bạn đã tới nơi
        </h2>
        <p
          style={{
            color: "var(--text-muted)",
            lineHeight: 1.75,
            fontSize: "1rem",
          }}
        >
          Chúng tôi đã lưu được hồ sơ và sẽ gọi vào số bạn để lại để kiểm tra
          thông tin trước khi đăng. Nếu có mục nào còn thiếu, chúng tôi sẽ hỏi
          bạn — chúng tôi không tự điền hộ.
        </p>
        <p
          style={{
            color: "var(--text-dim)",
            lineHeight: 1.75,
            fontSize: "0.9rem",
            marginTop: 14,
          }}
        >
          Hồ sơ mới sẽ được gắn nhãn{" "}
          <strong>
            Cấp 1 — thông tin do cơ sở cung cấp, đã kiểm tra liên hệ
          </strong>
          . Các cấp cao hơn cần khảo sát thật, không cấp theo lời khai.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={guiDi} noValidate>
      {loi.length > 0 && (
        <div
          role="alert"
          style={{
            background: "oklch(0.25 0.09 25 / 0.35)",
            border: "1px solid oklch(0.6 0.16 25 / 0.5)",
            borderRadius: 8,
            padding: "14px 16px",
            marginBottom: 20,
          }}
        >
          <p
            style={{
              fontWeight: 700,
              color: "var(--text-primary)",
              marginBottom: 6,
              fontSize: "0.9rem",
            }}
          >
            Chưa gửi được — xin xem lại:
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: 20,
              color: "var(--text-muted)",
              fontSize: "0.88rem",
              lineHeight: 1.7,
            }}
          >
            {loi.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Phần bắt buộc ── */}
      <fieldset style={{ border: "none", padding: 0, margin: "0 0 28px" }}>
        <legend
          style={{
            fontFamily: "var(--font-display),serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--gold)",
            marginBottom: 16,
            padding: 0,
          }}
        >
          Phần bắt buộc
        </legend>

        <div style={KHOI}>
          <label htmlFor="tenFarm" style={O_NHAN}>
            Tên farm
          </label>
          <input id="tenFarm" name="tenFarm" required style={O_NHAP} />
          <span style={GOI_Y}>
            Đúng như đăng ký kinh doanh, hoặc tên bạn vẫn dùng để gọi farm mình.
          </span>
        </div>

        <div style={KHOI}>
          <label htmlFor="tinh" style={O_NHAN}>
            Tỉnh / Thành phố
          </label>
          <input id="tinh" name="tinh" required style={O_NHAP} />
        </div>

        <div style={KHOI}>
          <label htmlFor="vungSlug" style={O_NHAN}>
            Vùng trải nghiệm nông nghiệp
          </label>
          <select id="vungSlug" name="vungSlug" required style={O_NHAP}>
            <option value="">— Chọn một trong 9 vùng —</option>
            {vung.map((v) => (
              <option key={v.slug} value={v.slug}>
                {v.ten}
              </option>
            ))}
          </select>
          <span style={GOI_Y}>
            Vùng quyết định farm của bạn hiện ở trang nào trên web.
          </span>
        </div>

        <div style={KHOI}>
          <label htmlFor="diaChi" style={O_NHAN}>
            Địa chỉ
          </label>
          <input id="diaChi" name="diaChi" required style={O_NHAP} />
          <span style={GOI_Y}>Xã / huyện là đủ — không cần số nhà.</span>
        </div>

        <div style={KHOI}>
          <label htmlFor="cauChuyen" style={O_NHAN}>
            Câu chuyện của bạn
          </label>
          <textarea
            id="cauChuyen"
            name="cauChuyen"
            required
            rows={6}
            style={{ ...O_NHAP, resize: "vertical" }}
          />
          <span style={GOI_Y}>
            Kể bằng lời của chính bạn — vì sao bạn về đây, farm này bắt đầu thế
            nào. Chúng tôi không viết lại cho &ldquo;hay&rdquo;; giọng của bạn
            mới là thứ khách muốn đọc.
          </span>
        </div>

        <div style={KHOI}>
          <label htmlFor="hoTenChuFarm" style={O_NHAN}>
            Họ tên bạn
          </label>
          <input
            id="hoTenChuFarm"
            name="hoTenChuFarm"
            required
            autoComplete="name"
            style={O_NHAP}
          />
        </div>

        <div style={KHOI}>
          <label htmlFor="soDienThoai" style={O_NHAN}>
            Số điện thoại
          </label>
          <input
            id="soDienThoai"
            name="soDienThoai"
            type="tel"
            required
            autoComplete="tel"
            style={O_NHAP}
          />
          <span style={GOI_Y}>
            Chúng tôi gọi vào số này để kiểm tra trước khi đăng.
          </span>
        </div>

        <div style={KHOI}>
          <p style={{ ...O_NHAN, marginBottom: 2 }}>Kênh liên hệ thứ hai</p>
          <span style={{ ...GOI_Y, marginTop: 0, marginBottom: 10 }}>
            Cần ít nhất 2 kênh để khách liên hệ thẳng với bạn. Điền Zalo hoặc
            web riêng — có cả hai thì càng tốt.
          </span>
          <div style={{ display: "grid", gap: 10 }}>
            <div>
              <label htmlFor="zalo" style={{ ...GOI_Y, marginTop: 0 }}>
                Zalo (số điện thoại hoặc đường dẫn)
              </label>
              <input id="zalo" name="zalo" style={O_NHAP} />
            </div>
            <div>
              <label htmlFor="webRieng" style={{ ...GOI_Y, marginTop: 0 }}>
                Web riêng của farm
              </label>
              <input
                id="webRieng"
                name="webRieng"
                type="url"
                placeholder="https://…"
                style={O_NHAP}
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* ── Phần khai thêm ── */}
      <fieldset style={{ border: "none", padding: 0, margin: "0 0 28px" }}>
        <legend
          style={{
            fontFamily: "var(--font-display),serif",
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "var(--gold)",
            marginBottom: 6,
            padding: 0,
          }}
        >
          Khai thêm nếu tiện
        </legend>
        <p
          style={{
            fontSize: "0.85rem",
            color: "var(--text-dim)",
            lineHeight: 1.6,
            marginBottom: 16,
          }}
        >
          Bỏ trống cũng gửi được. Chúng tôi sẽ hỏi bạn sau — chứ không tự đoán
          rồi điền hộ.
        </p>

        <div style={KHOI}>
          <p style={{ ...O_NHAN, marginBottom: 8 }}>
            Farm bạn có những trải nghiệm nào?
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: 8,
            }}
          >
            {traiNghiem.map((t) => (
              <label
                key={t.slug}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  /* Cao ≥44px — vùng chạm đủ lớn trên điện thoại */
                  minHeight: 44,
                  padding: "8px 12px",
                  borderRadius: 8,
                  border: "1px solid var(--border)",
                  color: "var(--text-muted)",
                  fontSize: "0.88rem",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="traiNghiemSlugs"
                  value={t.slug}
                  style={{ width: 18, height: 18, flexShrink: 0 }}
                />
                {t.ten}
              </label>
            ))}
          </div>
        </div>

        <div style={KHOI}>
          <label htmlFor="lichMuaVu" style={O_NHAN}>
            Mùa nào tới thì có gì?
          </label>
          <textarea
            id="lichMuaVu"
            name="lichMuaVu"
            rows={4}
            style={{ ...O_NHAP, resize: "vertical" }}
          />
          <span style={GOI_Y}>
            Càng cụ thể càng tốt — tháng mấy hoa nở, tháng mấy thu hoạch gì. Xin
            đừng viết &ldquo;mùa nào cũng đẹp&rdquo;: khách cần biết nên đi khi
            nào.
          </span>
        </div>

        <div style={KHOI}>
          <label htmlFor="duongDi" style={O_NHAN}>
            Đường tới farm
          </label>
          <textarea
            id="duongDi"
            name="duongDi"
            rows={3}
            style={{ ...O_NHAP, resize: "vertical" }}
          />
          <span style={GOI_Y}>
            Cách trung tâm huyện bao xa, đi được bằng xe gì, mùa mưa có khó
            không.
          </span>
        </div>

        <div style={KHOI}>
          <label htmlFor="ungXu" style={O_NHAN}>
            Điều khách nên và không nên làm
          </label>
          <textarea
            id="ungXu"
            name="ungXu"
            rows={3}
            style={{ ...O_NHAP, resize: "vertical" }}
          />
          <span style={GOI_Y}>
            Tập tục địa phương, chỗ nào không nên vào, điều gì cần xin phép.
          </span>
        </div>

        <div style={KHOI}>
          <label htmlFor="giaThamKhao" style={O_NHAN}>
            Giá tham khảo
          </label>
          <input
            id="giaThamKhao"
            name="giaThamKhao"
            placeholder="ví dụ: 400.000 – 800.000đ / đêm"
            style={O_NHAP}
          />
          <span style={GOI_Y}>
            Ghi thành một KHOẢNG, đừng ghi một con số cứng — giá đổi theo mùa,
            số cứng sẽ nói sai với khách. Web không bán phòng, đây chỉ để khách
            chuẩn bị.
          </span>
        </div>
      </fieldset>

      {/* ── Đồng ý theo dõi kênh + ranh giới pháp lý ── */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-sm)",
          padding: "18px 20px",
          marginBottom: 24,
        }}
      >
        <label
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            cursor: "pointer",
            minHeight: 44,
          }}
        >
          <input
            type="checkbox"
            name="dongYTheoDoi"
            value="co"
            style={{ width: 18, height: 18, marginTop: 3, flexShrink: 0 }}
          />
          <span
            style={{
              fontSize: "0.9rem",
              color: "var(--text-muted)",
              lineHeight: 1.65,
            }}
          >
            Tôi cho phép vnfarmstay theo dõi các kênh tôi đã khai ở trên để cập
            nhật thông tin điểm đến của tôi.{" "}
            <strong style={{ color: "var(--text-primary)" }}>
              Bạn không phải nhập liệu lại
            </strong>{" "}
            — cứ đăng như bình thường, chúng tôi cập nhật hộ.
          </span>
        </label>
        <p
          style={{
            fontSize: "0.8rem",
            color: "var(--text-dim)",
            lineHeight: 1.65,
            marginTop: 14,
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
          }}
        >
          <strong>Chúng tôi dùng dữ liệu này để làm gì:</strong> dựng hồ sơ farm
          của bạn trên vnfarmstay.vn và liên hệ kiểm tra thông tin.{" "}
          <strong>Công khai:</strong> tên farm, vùng, câu chuyện, mùa vụ, kênh
          liên hệ bạn muốn khách thấy. <strong>Giữ riêng:</strong> ghi chú thẩm
          định và ảnh gốc. Bạn rút lại lúc nào cũng được — nhắn cho chúng tôi
          qua trang Liên hệ. Xem thêm{" "}
          <a href="/chinh-sach-bao-mat" style={{ color: "var(--gold)" }}>
            Chính sách bảo mật
          </a>
          .
        </p>
      </div>

      <button
        type="submit"
        disabled={dangGui}
        style={{
          width: "100%",
          minHeight: 48,
          padding: "15px",
          borderRadius: 24,
          background: dangGui ? "var(--gold-dim)" : "var(--gold)",
          color: dangGui ? "var(--text-muted)" : "var(--bg-deep)",
          fontWeight: 700,
          fontSize: "0.95rem",
          border: "none",
          cursor: dangGui ? "wait" : "pointer",
          letterSpacing: "0.02em",
        }}
      >
        {dangGui ? "Đang gửi…" : "Gửi hồ sơ farm của tôi"}
      </button>
      <p
        style={{
          fontSize: "0.78rem",
          color: "var(--text-dim)",
          textAlign: "center",
          marginTop: 12,
          lineHeight: 1.6,
        }}
      >
        Miễn phí, không hoa hồng, không ràng buộc. Gửi hồ sơ không có nghĩa là
        farm được đăng ngay — chúng tôi gọi kiểm tra trước.
      </p>
    </form>
  );
}
