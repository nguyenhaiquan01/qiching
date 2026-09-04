import type { NoiDungQueRow } from "../core/data/noiDungQue";

/** Hằng số và hàm sinh nội dung metadata — tách khỏi `MetaTrang.tsx` để file đó chỉ export
 * component (yêu cầu của react-refresh). */

export const GOC = "https://qiching.org";

export const OG_MAC_DINH = `${GOC}/og-image.png`;

/**
 * Mô tả cho trang chi tiết một quẻ.
 *
 * CỐ Ý không trích tự động 1-2 câu đầu của `giaiNghia`: đó là văn bản bên thứ ba chưa
 * copyedit và chưa rõ quyền sử dụng (gate G1/G2 đang đóng băng), đưa vào snippet là đẩy đúng
 * phần nội dung có vấn đề ra kết quả tìm kiếm — yêu cầu 4 của Giai đoạn C. Thay vào đó dùng
 * dữ liệu định danh/cấu trúc do chính app tính: số thứ tự, tên, nội/ngoại quái, cung.
 */
export function moTaQue(que: NoiDungQueRow): string {
  return (
    `Quẻ số ${que.soThuTu} — ${que.tenQue} (${que.tenQueChuan}). ` +
    `Nội quái ${que.queHa}, ngoại quái ${que.queThuong}, cung ${que.cung}. ` +
    `Tra cứu cấu trúc quẻ, Thoán Từ và Hào Từ đầy đủ 6 hào trên QIChing.`
  );
}

