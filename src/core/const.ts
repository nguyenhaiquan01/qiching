/**
 * Port nguyên văn từ QueKinhDich/Const.cs (bỏ `myForm` — tham chiếu WinForms không cần trong web).
 * Đây là các hằng số/bảng tra cứu literal có sẵn trong mã nguồn C#, không phải dữ liệu trong
 * KinhDich.sdf — nên port trực tiếp, không cần đối chiếu lại.
 */

export const TIET_LENH = false;
export const VUONG = 3;
export const HUNG = -8;

export const ThoiDiem = {
  Nam: "Nam",
  Thang: "Thang",
  Ngay: "Ngay",
  Gio: "Gio",
  HaiGio: "HaiGio",
} as const;
export type ThoiDiem = (typeof ThoiDiem)[keyof typeof ThoiDiem];

/** Const.cs:25 */
export const THIEN_CAN = [
  "Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý",
] as const;

/** Const.cs:26 */
export const DIA_CHI = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi",
] as const;

/** Const.cs:28-30 — 8 quẻ đơn theo thứ tự Tiên Thiên */
export const TIEN_THIEN = [
  "Càn", "Đoài", "Ly", "Chấn", "Tốn", "Khảm", "Cấn", "Khôn",
] as const;

/** Const.cs:32-34 — 8 quẻ đơn theo thứ tự Hậu Thiên */
export const HAU_THIEN = [
  "Ly", "Tốn", "Chấn", "Cấn", "Khôn", "Đoài", "Càn", "Khảm",
] as const;

/** Const.cs:36-38 */
export const NGU_HANH = ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ"] as const;

/** Const.cs:40 — Lục Thần, lặp lại 2 lần để cycle qua 6 hào từ vị trí khởi bất kỳ */
export const THAN = [
  "Long", "Tước", "Trần", "Xà", "Hổ", "Vũ",
  "Long", "Tước", "Trần", "Xà", "Hổ", "Vũ",
] as const;

/** Const.cs:41 */
export const LUC_THAN = ["Huynh Đệ", "Tử Tôn", "Thê Tài", "Quan Quỷ", "Phụ Mẫu"] as const;

/** Const.cs:42-106 — tên đầy đủ 64 quẻ kép, đúng thứ tự gốc (index dùng để tra Que6Hao). */
export const QUE_6_HAO = [
  "CÀN VI THIÊN", "THIÊN PHONG CẤU", "THIÊN SƠN ĐỘN", "THIÊN ĐỊA BỈ",
  "PHONG ĐỊA QUAN", "SƠN ĐỊA BÁC", "HỎA ĐỊA TẤN", "HỎA THIÊN ĐẠI HỮU",
  "ĐOÀI VI TRẠCH", "TRẠCH THỦY KHỐN", "TRẠCH ĐỊA TỤY", "TRẠCH SƠN HÀM",
  "THỦY SƠN KIỀN", "ĐỊA SƠN KHIÊM", "LÔI SƠN TIỂU QUÁ", "LÔI TRẠCH QUY MUỘI",
  "LY VI HỎA", "HỎA SƠN LỮ", "HỎA PHONG ĐỈNH", "HỎA THỦY VỊ TẾ",
  "SƠN THỦY MÔNG", "PHONG THỦY HOÁN", "THIÊN THỦY TỤNG", "THIÊN HỎA ĐỒNG NHÂN",
  "CHẤN VI LÔI", "LÔI ĐỊA DỰ", "LÔI THỦY GIẢI", "LÔI PHONG HẰNG",
  "ĐỊA PHONG THĂNG", "THỦY PHONG TỈNH", "TRẠCH PHONG ĐẠI QUÁ", "TRẠCH LÔI TÙY",
  "TỐN VI PHONG", "PHONG THIÊN TIỂU SÚC", "PHONG HỎA GIA NHÂN", "PHONG LÔI ÍCH",
  "THIÊN LÔI VÔ VỌNG", "HỎA LÔI PHỆ HẠP", "SƠN LÔI DI", "SƠN PHONG CỔ",
  "KHẢM VI THỦY", "THỦY TRẠCH TIẾT", "THỦY LÔI TRUÂN", "THỦY HOẢ KÝ TẾ",
  "TRẠCH HỎA CÁCH", "LÔI HỎA PHONG", "ĐỊA HỎA MINH DI", "ĐỊA THỦY SƯ",
  "CẤN VI SƠN", "SƠN HỎA BÔN", "SƠN THIÊN ĐẠI SÚC", "SƠN TRẠCH TỔN",
  "HỎA TRẠCH KHUÊ", "THIÊN TRẠCH LÝ", "PHONG TRẠCH TRUNG PHÙ", "PHONG SƠN TIỆM",
  "KHÔN VI ĐỊA", "ĐỊA LÔI PHỤC", "ĐỊA TRẠCH LÂM", "ĐỊA THIÊN THÁI",
  "LÔI THIÊN ĐẠI TRÁNG", "TRẠCH THIÊN QUẢI", "THỦY THIÊN NHU", "THỦY ĐỊA TỶ",
] as const;
