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
 * Schema 2026-09 — Tách Hán tự khỏi phần dịch/giảng (Phương án B): Thay vì `soanTu` và
 * `daiTuongTruyen` là string ghép chứa cả Hán tự + dịch + giảng, đã restructure thành object
 * { hanViet, hanTu, dichGiang } để:
 * - Hỗ trợ toggle show/hide Hán tự độc lập
 * - Cho phép nhiều mức độ khó (dễ = Việt + giảng; trung bình = Hán tự + Việt; khó = chỉ Hán tự)
 * - Bảo tồn toàn bộ nội dung gốc Phan Bội Châu
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
 *
 * Audit đối chiếu ngược (2026-09) — đã tải lại HTML gốc của 5 trang bên dưới bằng `curl` để xác
 * nhận trước khi sửa, không suy đoán:
 * - `tenQue` của quẻ 4/36 có lỗi chính tả sẵn ở nguồn ("QUỂ"/"QUÉ" thay vì "QUẺ"; quẻ 36 còn có
 *   "HÓA" thay vì "HỎA"), quẻ 5/33 nguồn thiếu hẳn tiền tố "QUẺ " — đã copyedit cả 4 quẻ (cùng
 *   tinh thần không tin nguyên văn scrape có lỗi rõ ràng như đã làm với nhãn hào ở trên).
 * - `soanTu` của quẻ 1 (Càn) thiếu dòng chữ Hán ở nguồn (trang không có chữ Hán nào trước "彖曰"
 *   mở đầu Soán Truyện) — đã bổ sung "乾元亨利貞." (theo đúng quy ước dấu câu nguồn này dùng cho
 *   Soán Từ ngắn không có mệnh đề phụ, ví dụ quẻ 58 Đoài "兌亨利貞.") vì đây là nội dung Soán Từ
 *   kinh điển chuẩn, không phải suy diễn.
 */
import type { CardContent } from "../types";
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
  /** Đoạn mở đầu của trang (ví dụ "Kiền trên; Khảm dưới..."), trước mục Tự Quái/Soán Từ. Ở
   * quẻ 1, 2 (không có Tự Quái) đoạn này đi thẳng tới Soán Từ, vẫn có nội dung, không null. */
  moDau: string | null;
  /** Tự Quái Truyện — null ở quẻ 1, 2 (xem comment đầu file). */
  tuQuai: string | null;
  /** Soán Từ (Thoán Từ): Tách Hán tự khỏi phần dịch/giảng (Phương án B, 2026-09).
   * Mỗi thành phần independ: hanViet (dịch Hán tự), hanTu (Hán tự gốc), dichGiang (giảng).
   * Cho phép UI toggle show/hide theo mức độ khó. */
  soanTu: CardContent;
  /** Soán Truyện (Thoán Truyện). */
  soanTruyen: string;
  /** Đại Tượng Truyện: Tách Hán tự khỏi phần dịch/giảng (schema như soanTu). */
  daiTuongTruyen: CardContent;
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
