/**
 * Nội dung diễn giải đầy đủ của 64 quẻ dịch — Giải nghĩa, Dịch, Giảng, Hào Từ (6 hào), Dụng
 * Cửu/Lục (chỉ Càn và Khôn có), Chú Thích, Phụ Lục — theo bản dịch/giảng của Nguyễn Hiến Lê,
 * lấy từ cohoc.net/64-que-dich.html (mỗi quẻ một trang riêng, xem trường `nguon`).
 *
 * Đây là nội dung tham khảo/hiển thị, KHÔNG dùng để tính toán (khác với `queKinhDich.ts`/
 * `que6Hao.ts`) — nên không cần đối chiếu KinhDich.sdf. Trường `tenQueChuan` là cầu nối duy
 * nhất sang phần tính toán: khớp đúng với `tenQue`/`tenQueDich` mà `business.ts`/`queDich.ts`
 * dùng (ví dụ "CÀN VI THIÊN"), tra theo cặp quẻ Thượng/Hạ đối chiếu với `que6Hao.ts` — KHÔNG
 * suy theo tên hiển thị của cohoc.net (trang nguồn dùng tên khác bản gốc ở một số quẻ, ví dụ
 * "Sơn Hỏa Bí" trong khi `que6Hao.ts` — port từ chính app gốc — gọi là "SƠN HỎA BÔN").
 *
 * Vài chỗ trang nguồn viết sai chính tả nhãn hào (ví dụ "Lục cửu" thay vì "Lục tứ" ở quẻ
 * Khôn, "Thượng cữu" thay vì "Thượng cửu" ở quẻ Vị Tế) — phần Dương/Âm (Cửu/Lục) trong
 * `haoTu[].nhan` đã được tính lại từ dữ liệu quẻ đơn đã xác nhận trong `queKinhDich.ts` thay
 * vì tin theo chữ scrape được, vị trí hào (Sơ/Nhị/Tam/Tứ/Ngũ/Thượng) vẫn giữ theo thứ tự xuất
 * hiện trên trang.
 *
 * Lần scrape đầu tiên (đã sửa lại) có 2 lỗi hệ thống trên toàn bộ 64 quẻ: (1) dòng tiêu đề
 * chữ Hán của mỗi hào bị dính vào CUỐI nội dung hào liền trước thay vì đứng ĐẦU nội dung hào
 * của chính nó (với Càn/Khôn, lỗi này còn lan sang đầu `dungCuu`) — do trang nguồn không có
 * dấu ngăn cách rõ ràng giữa hai hào liên tiếp; (2) đoạn diễn giải mở rộng sau "Giải nghĩa:"
 * (nếu có) và dòng chữ Hán + phiên âm của Thoán Từ bị bỏ sót hoàn toàn, không nằm ở đâu trong
 * dữ liệu. Đã scrape lại từ `nguon` để đối chiếu và sửa cả hai: lỗi (1) sửa bằng cách dịch
 * chuyển cơ học (không cần tải lại), lỗi (2) bổ sung vào cuối `giaiNghia` và đầu `dich`.
 */
import raw from "./noiDungQue.json";

export interface HaoTuRow {
  /** Vị trí hào, 1-6 (Sơ=1 ... Thượng=6) */
  vach: number;
  /** Tên hào chuẩn hoá, ví dụ "Sơ Cửu", "Lục Tứ", "Thượng Cửu" */
  nhan: string;
  noiDung: string;
}

export interface NoiDungQueRow {
  soThuTu: number;
  /** Tên quẻ theo cách gọi của nguồn (ví dụ "Thuần Càn") */
  tenQue: string;
  /** Tên quẻ chuẩn, khớp `tenQueDich` dùng trong tính toán (ví dụ "CÀN VI THIÊN") */
  tenQueChuan: string;
  cung: string;
  queThuong: string;
  queHa: string;
  haoThe: number;
  giaiNghia: string;
  dich: string;
  giang: string;
  haoTu: HaoTuRow[];
  dungCuu: string | null;
  chuThich: string | null;
  phuLuc: string | null;
  nguon: string;
}

export const NOI_DUNG_QUE = raw as NoiDungQueRow[];

/** Tra nội dung diễn giải theo `tenQueDich` (tên chuẩn dùng trong tính toán, ví dụ từ `QueDich.tenQueDich`). */
export function timNoiDungQue(tenQueChuan: string): NoiDungQueRow | undefined {
  return NOI_DUNG_QUE.find((r) => r.tenQueChuan === tenQueChuan);
}
