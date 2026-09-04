/**
 * Nội dung diễn giải 64 quẻ theo bản dịch Ngô Tất Tố ("Kinh Dịch"), lấy từ cohoc.net (mỗi quẻ
 * một trang riêng, xem trường `nguon`) — xem
 * legacy/project-brain/11-ke-hoach-ban-dich-ngo-tat-to-phan-boi-chau.md.
 *
 * Quyền sử dụng: Ngô Tất Tố mất năm 1954 — đã quá 50 năm bảo hộ quyền tác giả (Điều 27 Luật
 * SHTT), tác phẩm thuộc phạm vi công cộng. Không bị gate G1 của
 * legacy/project-brain/10-ke-hoach-seo.md chặn (gate đó chỉ áp dụng cho bản Nguyễn Hiến Lê).
 *
 * Schema KHÔNG tương thích với `NoiDungQueRow` (bản Nguyễn Hiến Lê) lẫn
 * `NoiDungQuePhanBoiChauRow` (bản Phan Bội Châu) — quyết định có chủ đích (Phương án B). Nguồn
 * này trình bày theo từng MỆNH ĐỀ (mỗi mệnh đề = một khối "LỜI KINH" — nguyên văn Hán + phiên
 * âm + dịch nghĩa — rồi một khối "GIẢI NGHĨA" đi kèm), mịn hơn hẳn 2 bản kia (quẻ Càn có tới 54
 * khối LỜI KINH). Phần GIẢI NGHĨA trong nguồn có thể trích nhiều nhà chú giải (Trình Di, Chu Hy,
 * "Tiên Nho"...) nhưng nhãn tác giả có hàng chục biến thể lỗi OCR khác nhau (ví dụ "Truyện của
 * Trình Di", "Truyện của Trinh Di", "Truyện của Trình Đi", "Bản nghĩa cửa Chu Hy"...) nên KHÔNG
 * tách theo tác giả — mỗi mệnh đề chỉ giữ `giaiNghia` dạng văn bản thô, gộp mọi tác giả theo
 * đúng thứ tự xuất hiện.
 *
 * Ghi chú trích xuất — dấu hiệu nội dung dùng để phân đoạn khi nguồn thiếu/lỗi nhãn:
 * - Nhãn hào trong `dichAm` của mỗi mệnh đề được dò theo đúng thứ tự Cửu/Lục đã xác nhận trong
 *   `noiDungQue.json` (không suy lại từ đầu), cùng lý do đã nêu ở `noiDungQuePhanBoiChau.ts` —
 *   nguồn này còn lỗi nhãn hào nhiều hơn (Sơ/Sở, Tứ/Tử, Ngũ/Ngủ, thậm chí có quẻ nhãn hào bị rớt
 *   hẳn — ví dụ quẻ 32 chỉ còn sót lại Tiểu Tượng Truyện của hào 1, mất hẳn Hào Từ).
 * - Càn (1)/Khôn (2): nguồn liệt kê đủ 6 Hào Từ trước, rồi tới Dụng Cửu/Dụng Lục, rồi Soán
 *   Truyện + Đại Tượng Truyện, rồi mới liệt kê lại 6 dòng Tiểu Tượng Truyện MỘT LẦN NỮA (không
 *   theo cặp với Hào Từ như các quẻ khác), tiếp đó là Văn Ngôn Truyện. Do 6 dòng Tiểu Tượng lặp
 *   lại đó không hề nhắc lại nhãn hào ("Sơ Cửu" v.v.) nên không tách lại được về đúng hào —
 *   toàn bộ đoạn từ Dụng Cửu/Dụng Lục trở đi (gồm cả Tiểu Tượng lặp lại và Văn Ngôn) được gộp
 *   nguyên vào `dungCuu` dạng một khối duy nhất, KHÔNG có field `vanNgon` riêng cho nguồn này
 *   (khác với `noiDungQuePhanBoiChau.ts`) — đây là đơn giản hoá có chủ đích, chấp nhận đánh đổi
 *   để tránh gán nhầm nội dung sang hào khác.
 */
import raw from "./noiDungQueNgoTatTo.json";

export interface LoiKinhNgoTatTo {
  /** Nguyên văn Hán tự */
  hanTu: string;
  /** Phần "Dịch âm." (phiên âm Hán Việt) */
  dichAm: string;
  /** Phần "Dịch nghĩa." (dịch nghĩa tiếng Việt) */
  dichNghia: string;
}

export interface MenhDeNgoTatTo {
  loiKinh: LoiKinhNgoTatTo;
  /** GIẢI NGHĨA đi kèm mệnh đề này — gộp mọi nhà chú giải theo thứ tự xuất hiện, rỗng nếu
   * nguồn không có (hiếm). */
  giaiNghia: string;
}

export interface HaoTuNgoTatToRow {
  /** Vị trí hào, 1-6 (Sơ=1 ... Thượng=6) */
  vach: number;
  /** Tên hào theo thứ tự chuẩn của nguồn này, ví dụ "Sơ Cửu", "Cửu Nhị" */
  nhan: string;
  /** Thường gồm 2 mệnh đề: Hào Từ rồi Tiểu Tượng Truyện — có thể chỉ còn 1 nếu nguồn rớt mất
   * một phần (xem comment đầu file). */
  menhDe: MenhDeNgoTatTo[];
}

export interface NoiDungQueNgoTatToRow {
  soThuTu: number;
  /** Tên quẻ theo cách gọi của nguồn, ví dụ "QUẺ QUẢI" */
  tenQue: string;
  /** Tên quẻ chuẩn, khớp `tenQueDich` dùng trong tính toán — lấy từ noiDungQue.json theo cùng
   * soThuTu, KHÔNG tự suy lại. */
  tenQueChuan: string;
  cung: string;
  queThuong: string;
  queHa: string;
  haoThe: number;
  /** Mọi mệnh đề TRƯỚC hào 1: Thoán Từ, Thoán Truyện, Đại Tượng Truyện — nguồn không tách rời
   * 3 phần này bằng header rõ ràng như bản Phan Bội Châu nên giữ chung một mảng. */
  quaiTu: MenhDeNgoTatTo[];
  haoTu: HaoTuNgoTatToRow[];
  /** Dụng Cửu/Dụng Lục — chỉ Càn (1) và Khôn (2) có; với 2 quẻ này còn gồm cả phần Tiểu Tượng
   * Truyện lặp lại và Văn Ngôn Truyện gộp chung (xem comment đầu file). */
  dungCuu: string | null;
  nguon: string;
}

export const NOI_DUNG_QUE_NGO_TAT_TO = raw as NoiDungQueNgoTatToRow[];

/** Tra nội dung Ngô Tất Tố theo `tenQueDich` (tên chuẩn dùng trong tính toán). */
export function timNoiDungQueNgoTatTo(tenQueChuan: string): NoiDungQueNgoTatToRow | undefined {
  return NOI_DUNG_QUE_NGO_TAT_TO.find((r) => r.tenQueChuan === tenQueChuan);
}
