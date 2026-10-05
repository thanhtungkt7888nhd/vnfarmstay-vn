/**
 * Đường vào nhận LỜI BÁO SAI THÔNG TIN về một hồ sơ farmstay (Trụ D, việc D2).
 *
 * ⛔ Chỉ trả `ok: true` khi bảng tính đã xác nhận — cùng luật với cửa nhận hồ sơ.
 * Nút báo sai mà không ai nhận được còn tệ hơn không có nút.
 *
 * Kiểm `farmSlug` phải là hồ sơ CÓ THẬT: nhận báo sai cho một mã bịa nghĩa là mở
 * cửa cho người lạ đổ chữ tuỳ ý vào bảng tính của Ông.
 */
import { NextResponse } from "next/server";
import { FARMSTAYS } from "@/features/listing/data";
import { daMoKenhNhan, nhanBaoSai } from "@/lib/nhan-ho-so";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/** Trần báo sai — rộng hơn trần gửi hồ sơ vì một người có thể thấy nhiều chỗ sai */
const TRAN_MOI_NGAY = 10;
const CUA_SO_MS = 24 * 60 * 60 * 1000;
const TRAN_CHU_SAI = 2000;
const TRAN_CHU_LIEN_HE = 200;

export async function POST(req: Request) {
  if (!daMoKenhNhan()) {
    return NextResponse.json(
      {
        ok: false,
        loi: "Kênh nhận báo lỗi chưa được mở. Xin liên hệ trực tiếp với chúng tôi.",
      },
      { status: 503 }
    );
  }

  const ip = getClientIp(req);
  if (!(await checkRateLimit(`bao-sai:${ip}`, { tran: TRAN_MOI_NGAY, cuaSoMs: CUA_SO_MS }))) {
    return NextResponse.json(
      {
        ok: false,
        loi: `Bạn đã gửi ${TRAN_MOI_NGAY} lời báo trong 24 giờ qua. Xin liên hệ trực tiếp nếu còn điều cần báo.`,
      },
      { status: 429 }
    );
  }

  let than: Record<string, unknown>;
  try {
    than = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, loi: "Không đọc được dữ liệu gửi lên." },
      { status: 400 }
    );
  }

  const farmSlug =
    typeof than.farmSlug === "string" ? than.farmSlug.trim() : "";
  const saiChoNao =
    typeof than.saiChoNao === "string" ? than.saiChoNao.trim() : "";
  const lienHe =
    typeof than.lienHeNguoiBao === "string" ? than.lienHeNguoiBao.trim() : "";

  /* Mã farm phải có thật — chặn người lạ đổ chữ tuỳ ý vào bảng tính */
  if (!FARMSTAYS.some((f) => f.slug === farmSlug)) {
    return NextResponse.json(
      { ok: false, loi: "Không tìm thấy hồ sơ farmstay này." },
      { status: 400 }
    );
  }
  if (saiChoNao === "") {
    return NextResponse.json(
      { ok: false, loi: "Xin cho biết thông tin nào đang sai." },
      { status: 400 }
    );
  }
  if (saiChoNao.length > TRAN_CHU_SAI || lienHe.length > TRAN_CHU_LIEN_HE) {
    return NextResponse.json(
      { ok: false, loi: "Nội dung dài quá mức cho phép." },
      { status: 400 }
    );
  }

  const ketQua = await nhanBaoSai({
    farmSlug,
    saiChoNao,
    lienHeNguoiBao: lienHe || undefined,
  });

  if (ketQua.trangThai !== "da-luu") {
    console.error("[bao-sai] lời báo KHÔNG lưu được:", ketQua);
    return NextResponse.json(
      {
        ok: false,
        loi: "Chúng tôi chưa ghi nhận được lời báo của bạn. Xin thử lại, hoặc liên hệ trực tiếp.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
