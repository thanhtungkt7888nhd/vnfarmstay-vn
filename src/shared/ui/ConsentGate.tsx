"use client";

/**
 * Cổng đồng ý đo lường — PDPL "im lặng ≠ đồng ý".
 *
 * Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân đòi sự đồng ý PHẢI là hành
 * vi chủ động, rõ ràng. Trước bản này, GA4 và Clarity nạp ngay khi trang mở —
 * người dùng bị đo trước khi kịp nói gì. Component này giữ mọi script đo lường
 * lại cho tới khi có lựa chọn thật của người dùng.
 *
 * Ba trạng thái: chưa hỏi (hiện thanh mời) · đồng ý (nạp script) · từ chối
 * (không nạp gì, và KHÔNG hỏi lại — hỏi lại chính là ép đồng ý).
 *
 * Lựa chọn lưu ở localStorage chứ không cookie: bản thân việc ghi cookie khi
 * chưa có đồng ý cũng là thứ PDPL soi tới.
 */

import { useEffect, useState } from "react";
import Script from "next/script";

const KHOA = "vnfs-dong-y-do-luong";
type LuaChon = "chua-hoi" | "dong-y" | "tu-choi";

interface Props {
  gaId?: string;
  clarityId?: string;
}

export function ConsentGate({ gaId, clarityId }: Props) {
  const [luaChon, setLuaChon] = useState<LuaChon>("chua-hoi");
  /* Chỉ đọc localStorage sau khi gắn vào DOM — server không có localStorage,
     đọc sớm sẽ lệch giữa HTML dựng sẵn và HTML trình duyệt. */
  const [daGan, setDaGan] = useState(false);

  useEffect(() => {
    setDaGan(true);
    const luu = window.localStorage.getItem(KHOA);
    if (luu === "dong-y" || luu === "tu-choi") setLuaChon(luu);
  }, []);

  const chon = (gt: Exclude<LuaChon, "chua-hoi">) => {
    window.localStorage.setItem(KHOA, gt);
    setLuaChon(gt);
  };

  /* Không có ID đo lường thì không có gì để hỏi — im lặng, không làm phiền. */
  if (!gaId && !clarityId) return null;

  return (
    <>
      {luaChon === "dong-y" && (
        <>
          {gaId && (
            <>
              <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                strategy="afterInteractive"
              />
              <Script id="ga4-config" strategy="afterInteractive">
                {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}', { page_path: window.location.pathname });`}
              </Script>
            </>
          )}
          {clarityId && (
            <Script id="clarity-init" strategy="afterInteractive">
              {`(function(c,l,a,r,i,t,y){
c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", "${clarityId}");`}
            </Script>
          )}
        </>
      )}

      {daGan && luaChon === "chua-hoi" && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Xin phép đo lường truy cập"
          style={{
            position: "fixed",
            left: 16,
            right: 16,
            /* Chừa vùng an toàn máy có khuyết đáy màn hình */
            bottom: "max(16px, env(safe-area-inset-bottom))",
            zIndex: 9998,
            maxWidth: 720,
            marginInline: "auto",
            background: "var(--bg-card)",
            border: "1px solid var(--gold-border)",
            borderRadius: "var(--radius)",
            boxShadow: "var(--shadow)",
            /* Gọn lại ở khổ hẹp: đo trên 375px thấy bản padding 20/22 cao gần
               1/3 màn và che mất nút hành động chính của hero. Thanh xin phép
               là lớp phủ tạm nên che phần nào là đánh đổi không tránh được,
               nhưng không được chiếm chỗ hơn mức cần để đọc và bấm. */
            padding: "clamp(12px, 3.5vw, 20px) clamp(14px, 4vw, 22px)",
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(10px, 2.5vw, 14px)",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <p
            style={{
              flex: "1 1 320px",
              margin: 0,
              maxWidth: "none",
              textAlign: "start",
              fontSize: "clamp(0.8rem, 2.6vw, 0.88rem)",
              lineHeight: 1.6,
              color: "var(--text-muted)",
            }}
          >
            Chúng tôi chỉ đo lượt xem khi bạn đồng ý. Từ chối cũng không ảnh
            hưởng gì tới việc đọc.{" "}
            <a
              href="/chinh-sach-bao-mat"
              style={{
                color: "var(--gold)",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Chính sách bảo mật
            </a>
          </p>
          <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
            <button
              type="button"
              onClick={() => chon("tu-choi")}
              style={{
                minHeight: 44,
                padding: "0 20px",
                borderRadius: 24,
                background: "transparent",
                border: "1px solid var(--gold-border)",
                color: "var(--text-primary)",
                fontWeight: 600,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
            >
              Từ chối
            </button>
            <button
              type="button"
              onClick={() => chon("dong-y")}
              className="fx-glow"
              style={{
                minHeight: 44,
                padding: "0 24px",
                borderRadius: 24,
                background: "var(--gold)",
                border: "none",
                color: "var(--bg-deep)",
                fontWeight: 700,
                fontSize: "0.88rem",
                cursor: "pointer",
                transition: "var(--transition)",
              }}
            >
              Đồng ý
            </button>
          </div>
        </div>
      )}
    </>
  );
}
