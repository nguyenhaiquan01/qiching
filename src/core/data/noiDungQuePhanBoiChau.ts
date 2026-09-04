/**
 * Nội dung diễn giải 64 quẻ theo bản dịch Phan Bội Châu ("Quốc Văn Chu Dịch"), lấy từ
 * cohoc.net (mỗi quẻ một trang riêng, xem trường `nguon`) — xem
 * legacy/project-brain/11-ke-hoach-ban-dich-ngo-tat-to-phan-boi-chau.md.
 *
 * Quyền sử dụng: Phan Bội Châu mất năm 1940 — đã quá 50 năm bảo hộ quyền tác giả (Điều 27
 * Luật SHTT), tác phẩm thuộc phạm vi công cộng. Không bị gate G1 của
 * legacy/project-brain/10-ke-hoach-seo.md chặn (gate đó chỉ áp dụng cho bản Nguyễn Hiến Lê).
 *
 * Schema KHÔNG tương thích với `NoiDungQueRow` (bản Nguyễn Hiến Lê, `noiDungQue.ts`) — đây là
 * quyết định có chủ đích (Phương án B trong tài liệu kế hoạch): giữ đúng cấu trúc mục lớn của
 * nguồn (Tự Quái/Soán Từ/Soán Truyện/Đại Tượng Truyện/Hào Từ) thay vì gộp phẳng cho khớp bản
 * Nguyễn Hiến Lê. Muốn hiển thị chung một layout, tầng UI phải tự biết render đúng theo từng
 * schema, không suy diễn field lẫn nhau.
 *
 * Ghi chú trích xuất — các trường hợp KHÔNG suy được từ header rõ ràng của nguồn (nguồn không
 * luôn ghi nhãn mục bằng chữ hoa, và một số trang thiếu hẳn nhãn), phải dò theo dấu hiệu nội
 * dung (tương tự cách đã làm với Thoán Từ ở `noiDungQue.ts`):
 * - `tuQuai`: null ở quẻ 1 (Càn) và quẻ 2 (Khôn) — bản thân nguồn không có mục này cho 2 quẻ
 *   mở đầu (không có "quẻ trước" để lập luận theo Tự Quái Truyện).
 * - Nhãn hào (`haoTu[].nhan`) được TÍNH LẠI theo đúng thứ tự Cửu/Lục đã xác nhận trong
 *   `noiDungQue.json` (bản Nguyễn Hiến Lê — cùng một quẻ vật lý nên Dương/Âm từng hào giống
 *   nhau giữa mọi bản dịch), viết theo thứ tự chuẩn của nguồn này (ví dụ "Cửu Nhị", KHÔNG phải
 *   "Nhị Cửu" như cách `noiDungQue.json` tự ghi lại theo thứ tự hiển thị gốc của nó) — không tin
 *   theo chữ scrape được vì nguồn có nhiều lỗi chính tả nhãn hào (Sơ/Sở, Cửu/Cứu...).
 * - `vanNgon`/`dungCuu` chỉ khác `null` ở quẻ 1, quẻ 2.
 */
import raw from "./noiDungQuePhanBoiChau.json";

export interface HaoTuPhanBoiChauRow {
  /** Vị trí hào, 1-6 (Sơ=1 ... Thượng=6) */
  vach: number;
  /** Tên hào theo thứ tự chuẩn của nguồn này, ví dụ "Sơ Cửu", "Cửu Nhị", "Thượng Lục" */
  nhan: string;
  /** Hào Từ + Tiểu Tượng Truyện của hào này, gộp theo đúng thứ tự xuất hiện trên trang */
  noiDung: string;
}

export interface NoiDungQuePhanBoiChauRow {
  soThuTu: number;
  /** Tên quẻ theo cách gọi của nguồn, ví dụ "QUẺ TRẠCH THIÊN QUẢI" */
  tenQue: string;
  /** Tên quẻ chuẩn, khớp `tenQueDich` dùng trong tính toán — lấy từ noiDungQue.json theo
   * cùng soThuTu, KHÔNG tự suy lại (tránh lệch nếu nguồn đặt tên khác). */
  tenQueChuan: string;
  cung: string;
  queThuong: string;
  queHa: string;
  haoThe: number;
  /** Tự Quái Truyện — null ở quẻ 1, 2 (xem comment đầu file). */
  tuQuai: string | null;
  /** Soán Từ (Thoán Từ): Hán tự + phiên âm + giảng, gộp theo đúng thứ tự xuất hiện. */
  soanTu: string;
  /** Soán Truyện (Thoán Truyện). */
  soanTruyen: string;
  /** Đại Tượng Truyện. */
  daiTuongTruyen: string;
  haoTu: HaoTuPhanBoiChauRow[];
  /** Văn Ngôn Truyện — chỉ Càn (1) và Khôn (2) có. */
  vanNgon: string | null;
  /** Dụng Cửu/Dụng Lục — chỉ Càn (1) và Khôn (2) có. */
  dungCuu: string | null;
  nguon: string;
}

export const NOI_DUNG_QUE_PHAN_BOI_CHAU = raw as NoiDungQuePhanBoiChauRow[];

/** Tra nội dung Phan Bội Châu theo `tenQueDich` (tên chuẩn dùng trong tính toán). */
export function timNoiDungQuePhanBoiChau(tenQueChuan: string): NoiDungQuePhanBoiChauRow | undefined {
  return NOI_DUNG_QUE_PHAN_BOI_CHAU.find((r) => r.tenQueChuan === tenQueChuan);
}
