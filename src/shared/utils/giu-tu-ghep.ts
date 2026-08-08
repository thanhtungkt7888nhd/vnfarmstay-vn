/**
 * Giữ từ ghép tiếng Việt không bị xuống dòng cắt đôi trong tiêu đề.
 *
 * Vì sao cần: trình duyệt tự bẻ dòng ở mọi dấu cách, nên "nông nghiệp" hay
 * "sinh thái" rất hay bị tách ra hai dòng ở khổ màn hẹp — mắt đọc vấp, và
 * cổng S-1 của máy đo bố cục chữ chấm FAIL. Cách vá đúng là thay dấu cách
 * bên trong từ ghép bằng khoảng trắng không ngắt (U+00A0), KHÔNG dùng <br>
 * (bẻ dòng cứng sẽ vỡ ở khổ màn khác).
 *
 * Từ điển dùng chung với máy đo (SO-TAY-MAY-KIEM/tu-dien-tu-ghep-vn.json) nên
 * hàm này và cổng kiểm luôn nói cùng một thứ tiếng.
 */
import tuDien from "./tu-dien-tu-ghep-vn.json";

const NBSP = "\u00A0";

/** Từ dài đặt trước để "đa dạng sinh học" thắng "sinh học" khi cả hai cùng khớp. */
const TU_GHEP: string[] = [...(tuDien as string[])].sort(
  (a, b) => b.length - a.length
);

const thoat = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const MAU = new RegExp(`(${TU_GHEP.map(thoat).join("|")})`, "gi");

/**
 * Trả về chuỗi đã thay dấu cách trong từ ghép bằng U+00A0.
 * Dùng cho tiêu đề (H1/H2/tiêu đề thẻ) — không dùng cho đoạn văn dài,
 * vì đoạn văn nhiều dòng cần được bẻ tự do để căn đều hai bên.
 */
export function giuTuGhep(text: string): string {
  if (!text) return text;
  return text.replace(MAU, (khop) => khop.replace(/\s+/g, NBSP));
}
