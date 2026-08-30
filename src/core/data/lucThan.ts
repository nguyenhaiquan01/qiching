/**
 * Port từ bảng `LucThan` trong KinhDich.sdf (dataAccess.findYNghiaLucThan).
 *
 * Nguồn: export trực tiếp từ `KinhDich.sdf` gốc ra CSV (`DBexport/LucThan.csv`) — văn bản
 * giải nghĩa nguyên văn từ DB gốc, không phải diễn giải lại. Chỉ là text hiển thị (không ảnh
 * hưởng kết quả tính toán số).
 */
export const GIAI_NGHIA_LUC_THAN: Record<string, string> = {
  "Huynh Đệ": "Anh em, chị em, anh em họ, kết bạn anh em, quan hệ bè bạn",
  "Phụ Mẫu": "Về cha mẹ, người ngang với cha mẹ trở lên như chú, bác, thầy giáo, bố mẹ chồng (hoặc vơ), mẹ nuôi, bà vú. Đoán về trời đất, thành trì, nhà cửa, nhà ở, tường quách, thuyền bè, xe cộ, áo quần, vật dụng vải vóc, giấy tờ, văn chương, sách vở, văn khế",
  "Tử Tôn": "Con cái, phúc đức",
  "Thê Tài": "Đoán về vợ, anh chị em dâu, đầy tớ gái. Đoán về của cải, tài sản, tiền bạc, lương thực và những vật dụng quí báu khác.",
  "Quan Quỷ": "Đoán về công danh, cầu quan, quan phủ, trưởng quan, quỉ thần; nữ đoán về hôn nhân, vợ đoán chồng. Đoán về loạn thần, trộm cướp, tôn giáo, nghi ngờ, bệnh tật, thân thể",
};
