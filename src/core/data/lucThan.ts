/**
 * Port từ bảng `LucThan` trong KinhDich.sdf (dataAccess.findYNghiaLucThan).
 *
 * CHƯA ĐỐI CHIẾU VỚI KinhDich.sdf GỐC — đây là văn bản giải nghĩa tự viết theo ý nghĩa cổ
 * điển thông thường của từng Lục Thân, có thể khác cách diễn đạt với văn bản gốc trong DB.
 * Vì đây chỉ là text hiển thị (không ảnh hưởng đến kết quả tính toán số), rủi ro thấp hơn
 * nhiều so với các bảng dữ liệu số/phân loại — nhưng vẫn nên thay bằng văn bản gốc nếu có.
 */
export const GIAI_NGHIA_LUC_THAN: Record<string, string> = {
  "Huynh Đệ": "Anh em, bạn bè, người cùng vai vế; đại diện cho sự tranh giành, hao tài, cạnh tranh.",
  "Tử Tôn": "Con cháu, phúc thần, đại diện cho sự sinh sôi, giải trừ tai ương, khắc chế Quan Quỷ.",
  "Thê Tài": "Vợ, tiền tài, của cải; đại diện cho tài lộc, vật chất.",
  "Quan Quỷ": "Quan chức, bệnh tật, tai ương; đại diện cho công danh, chức vị, nhưng cũng là điềm xấu/bệnh tật.",
  "Phụ Mẫu": "Cha mẹ, người trên, văn thư, nhà cửa; đại diện cho sự che chở, học hành, giấy tờ.",
};
