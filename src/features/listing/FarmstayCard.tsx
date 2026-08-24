import Image from "next/image";
import Link from "next/link";
import { timVung } from "@/features/vung/data";
import type { Farmstay } from "@/shared/types/farmstay";
import { nhanCapXacMinh } from "@/shared/utils/format";

interface Props {
  farmstay: Farmstay;
}

/**
 * Thẻ giới thiệu một farmstay.
 *
 * ⚠️ Viết lại 24/08/2026 (Trụ A). Bản cũ trưng GIÁ/ĐÊM · điểm sao · huy hiệu
 * "XÁC MINH" — bộ mặt của một sàn đặt phòng. Web này là hạ tầng dữ liệu: thứ đáng
 * trưng là farm nằm ở VÙNG nào, xác minh tới CẤP nào, và có ảnh thực địa hay không.
 */
export function FarmstayCard({ farmstay }: Props) {
  const vung = timVung(farmstay.vungSlug);
  const anhDau = farmstay.anh[0];
  const cap = nhanCapXacMinh(farmstay.capXacMinh);

  return (
    <Link href={`/farmstay/${farmstay.slug}`} className="farmstay-card">
      <div
        style={{
          aspectRatio: "16/9",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0f2318, #1a3d28)",
        }}
      >
        {/* Ảnh THỰC ĐỊA — van kiểm hồ sơ bảo đảm mọi hồ sơ đăng được đều có ≥1 ảnh */}
        <Image
          src={anhDau.url}
          alt={anhDau.moTa}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />

        {/* Cấp xác minh — thay cho huy hiệu nhị phân cũ */}
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "3px 8px",
            borderRadius: 4,
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.05em",
            background: "oklch(0.18 0.12 75 / 0.9)",
            color: "var(--gold)",
            border: "1px solid var(--gold-border)",
          }}
        >
          {cap.nhanNgan}
        </span>

        <span
          style={{
            position: "absolute",
            bottom: 10,
            right: 14,
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 1px 3px rgba(0,0,0,0.6)",
          }}
        >
          {vung?.ten.toUpperCase() ?? ""}
        </span>
      </div>

      <div style={{ padding: "16px 18px" }}>
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-dim)",
            marginBottom: 4,
          }}
        >
          {farmstay.diaChi.toUpperCase()}
        </div>
        <h3
          style={{
            fontSize: "1rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            marginBottom: 8,
            lineHeight: 1.25,
          }}
        >
          {farmstay.ten}
        </h3>

        {/* Trải nghiệm farm này có — nối vào trục "làm gì", không phải thẻ trang trí */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 6,
            marginBottom: 12,
          }}
        >
          {farmstay.traiNghiemSlugs.slice(0, 3).map((tn) => (
            <span
              key={tn}
              style={{
                padding: "3px 10px",
                borderRadius: 20,
                background: "var(--gold-dim)",
                border: "1px solid var(--gold-border)",
                fontSize: "0.72rem",
                color: "var(--text-muted)",
              }}
            >
              {tn.replace(/-/g, " ")}
            </span>
          ))}
        </div>

        {/* Số kênh liên hệ — dữ kiện thật, thay chỗ giá/đêm cũ */}
        <div
          style={{
            fontSize: "0.72rem",
            color: "var(--text-dim)",
          }}
        >
          {farmstay.lienHe.length} kênh liên hệ trực tiếp chủ farm
        </div>

        <div
          style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid var(--border)",
            fontSize: "0.8rem",
            color: "var(--gold)",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          Xem hồ sơ farm →
        </div>
      </div>
    </Link>
  );
}
