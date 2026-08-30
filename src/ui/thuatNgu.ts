/** Giải nghĩa ngắn cho các thuật ngữ chuyên môn Lục Hào — dùng cho tooltip, tránh bắt người
 * mới tự đoán ký hiệu (mục 9 của `05.1. Chỉnh UI-UX.md`). */
export const THUAT_NGU = {
  "Dụng Thần": "Lục Thân đại diện cho việc đang hỏi — hệ thống lấy điểm vượng suy của Lục Thân này làm trọng tâm để luận cát/hung.",
  "Thế": "Hào đại diện cho bản thân người xem quẻ.",
  "Ứng": "Hào đại diện cho đối tượng hoặc hoàn cảnh liên quan đến việc đang hỏi.",
  "Lục Thân": "5 vai trò Huynh Đệ / Tử Tôn / Thê Tài / Quan Quỷ / Phụ Mẫu, gán cho mỗi hào theo quan hệ sinh khắc Ngũ Hành với Cung của quẻ.",
  "Lục Thần": "Thanh Long / Chu Tước / Câu Trần / Đằng Xà / Bạch Hổ / Huyền Vũ — gán tuần tự cho 6 hào theo Can ngày, bổ sung sắc thái luận giải.",
  "Hào động": "Hào bị biến đổi (dương thành âm hoặc ngược lại), sinh ra quẻ biến từ quẻ chính.",
  "Nhật": "Địa Chi ngày lập quẻ (Nhật Kiến) — một trong các yếu tố sinh khắc dùng để tính điểm vượng suy từng hào.",
  "Nguyệt": "Địa Chi tháng lập quẻ (Nguyệt Kiến) — cùng vai trò với Nhật Kiến trong việc tính điểm vượng suy.",
  "Vượng": "Điểm số cao — hào/Lục Thân được Nhật, Nguyệt, hào động sinh hoặc trợ giúp nhiều.",
  "Suy": "Điểm số thấp — hào/Lục Thân bị Nhật, Nguyệt, hào động khắc chế hoặc không được sinh trợ.",
} as const;

export type TenThuatNgu = keyof typeof THUAT_NGU;
