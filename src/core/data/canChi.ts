/**
 * Port từ bảng `CanChi` trong KinhDich.sdf (dataAccess.findNguHanh, dataAccess.findLucThan).
 *
 * Bảng gốc dùng chung một cột `Ten` cho cả Thiên Can, Địa Chi, VÀ tên 8 quẻ đơn — vì
 * `business.findNguHanh(ten)` được gọi với cả 3 loại tên này (xem business.cs:39-46,
 * LoadAllData). Ở đây tách rõ 3 map để dễ đọc, nhưng hàm `nguHanhCua()` export vẫn tra
 * cứu gộp cả 3 giống hành vi gốc.
 *
 * Ngũ Hành + Âm Dương của Can/Chi và Lục Thần khởi theo Can ngày là kiến thức cổ điển cố
 * định (không có biến thể) — điền trực tiếp, không cần đối chiếu lại với KinhDich.sdf gốc.
 * Ngũ Hành của 8 quẻ đơn Bát Quái cũng vậy.
 */
import { THAN } from "../const";

export const NGU_HANH_THIEN_CAN: Record<string, string> = {
  "Giáp": "Mộc", "Ất": "Mộc",
  "Bính": "Hỏa", "Đinh": "Hỏa",
  "Mậu": "Thổ", "Kỷ": "Thổ",
  "Canh": "Kim", "Tân": "Kim",
  "Nhâm": "Thủy", "Quý": "Thủy",
};

export const AM_DUONG_THIEN_CAN: Record<string, "Dương" | "Âm"> = {
  "Giáp": "Dương", "Ất": "Âm",
  "Bính": "Dương", "Đinh": "Âm",
  "Mậu": "Dương", "Kỷ": "Âm",
  "Canh": "Dương", "Tân": "Âm",
  "Nhâm": "Dương", "Quý": "Âm",
};

export const NGU_HANH_DIA_CHI: Record<string, string> = {
  "Tý": "Thủy", "Sửu": "Thổ", "Dần": "Mộc", "Mão": "Mộc",
  "Thìn": "Thổ", "Tỵ": "Hỏa", "Ngọ": "Hỏa", "Mùi": "Thổ",
  "Thân": "Kim", "Dậu": "Kim", "Tuất": "Thổ", "Hợi": "Thủy",
};

export const AM_DUONG_DIA_CHI: Record<string, "Dương" | "Âm"> = {
  "Tý": "Dương", "Sửu": "Âm", "Dần": "Dương", "Mão": "Âm",
  "Thìn": "Dương", "Tỵ": "Âm", "Ngọ": "Dương", "Mùi": "Âm",
  "Thân": "Dương", "Dậu": "Âm", "Tuất": "Dương", "Hợi": "Âm",
};

/** Ngũ Hành của 8 quẻ đơn Bát Quái. */
export const NGU_HANH_QUAI: Record<string, string> = {
  "Càn": "Kim", "Đoài": "Kim",
  "Ly": "Hỏa",
  "Chấn": "Mộc", "Tốn": "Mộc",
  "Khảm": "Thủy",
  "Cấn": "Thổ", "Khôn": "Thổ",
};

/** Port từ dataAccess.findNguHanh(ten) — tra cứu gộp Can/Chi/Quái, giống hành vi gốc. */
export function nguHanhCua(ten: string): string {
  return NGU_HANH_THIEN_CAN[ten] ?? NGU_HANH_DIA_CHI[ten] ?? NGU_HANH_QUAI[ten];
}

/**
 * Lục Thần khởi theo Thiên Can ngày (quy tắc cổ điển: Giáp Ất khởi Thanh Long, Bính Đinh
 * khởi Chu Tước, Mậu khởi Câu Trần, Kỷ khởi Đằng Xà, Canh Tân khởi Bạch Hổ, Nhâm Quý khởi
 * Huyền Vũ). Port từ dataAccess.findLucThan(canngay) — LƯU Ý: cột DB tên là `LucThan`
 * nhưng thực ra trả về Lục Thần (Const.than: Long/Tước/Trần/Xà/Hổ/Vũ), không phải Lục Thân
 * (Huynh Đệ/Tử Tôn/...) — giữ tên hàm khác biệt ở đây để tránh nhầm lẫn tên gốc gây ra.
 */
export function lucThanKhoiTheoCanNgay(thienCanNgay: string): string {
  const map: Record<string, (typeof THAN)[number]> = {
    "Giáp": "Long", "Ất": "Long",
    "Bính": "Tước", "Đinh": "Tước",
    "Mậu": "Trần",
    "Kỷ": "Xà",
    "Canh": "Hổ", "Tân": "Hổ",
    "Nhâm": "Vũ", "Quý": "Vũ",
  };
  return map[thienCanNgay];
}
