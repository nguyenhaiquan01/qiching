/**
 * Kiểu dữ liệu thuần TS, port từ Business/Hao.cs và Business/QueInfo.cs.
 * Không phụ thuộc React — dùng được cả trong core logic lẫn UI.
 */

/** Port từ Business/Hao.cs — mô tả một hào trong quẻ dịch. */
export interface Hao {
  /** Chuỗi hiển thị: "<lucthan> <chi> <nguhanh>", có thể có hậu tố "(Thế)"/"(Ứng)"/"- Không". */
  napgiap: string;
  /** Huynh Đệ / Tử Tôn / Thê Tài / Quan Quỷ / Phụ Mẫu */
  lucthan: string;
  /** Địa Chi được Nạp Giáp cho hào này */
  chi: string;
  /** Ngũ Hành của Địa Chi trên */
  nguhanh: string;
  haoThe: boolean;
  haoUng: boolean;
  tuanKhong: boolean;
  haoDong: boolean;
  /** Lục Thần: Thanh Long/Chu Tước/Câu Trần/Đằng Xà/Bạch Hổ/Huyền Vũ (rút gọn, xem CanChiData.than) */
  than: string;
  diemso: number;
}

export function taoHaoMoi(): Hao {
  return {
    napgiap: "",
    lucthan: "",
    chi: "",
    nguhanh: "",
    haoThe: false,
    haoUng: false,
    tuanKhong: false,
    haoDong: false,
    than: "",
    diemso: 0,
  };
}

/** Port từ Business/QueInfo.cs — bản ghi "quẻ đã lưu". Lưu vào localStorage, không phải DB. */
export interface QueInfo {
  time: Date;
  /** Bình chú — ghi chú người dùng viết cho lần xem quẻ này */
  binhchu: string;
}

/** Port từ kinhdich.xsd — dòng dữ liệu bảng QueKinhDich (8 dòng, theo 8 quẻ đơn Tiên Thiên). */
export interface QueKinhDichRow {
  tenQue: string;
  /** Hào 1/2/3 của quẻ đơn: 1 = hào dương (liền), 0 = hào âm (đứt) */
  hao1: 0 | 1;
  hao2: 0 | 1;
  hao3: 0 | 1;
  tenQueKinhDich: string;
  /** Nạp Giáp (tên Địa Chi) khi quẻ đơn này làm quẻ Hạ, hào 1/2/3 */
  napGiapH1: string;
  napGiapH2: string;
  napGiapH3: string;
  /** Nạp Giáp (tên Địa Chi) khi quẻ đơn này làm quẻ Thượng, hào 4/5/6 */
  napGiapH4: string;
  napGiapH5: string;
  napGiapH6: string;
}

/**
 * Port từ kinhdich.xsd — dòng dữ liệu bảng Que6Hao (64 dòng, theo tên quẻ kép).
 * Bảng gốc còn có cột Hao1..Hao6 (string) nhưng không có hàm nghiệp vụ nào trong
 * Business/business.cs hay Business/QueDich.cs đọc tới — Nạp Giáp thực tế lấy từ
 * bảng QueKinhDich (theo quẻ đơn), không lấy từ đây — nên không port sang TS.
 */
export interface Que6HaoRow {
  tenQue: string;
  /** Cung của quẻ (một trong 8 tên quẻ đơn Tiên Thiên) — quyết định Ngũ Hành dùng để Nạp Giáp */
  cung: string;
  queThuong: string;
  queHa: string;
  /** Vị trí hào Thế: 1-6 */
  haoThe: number;
}
