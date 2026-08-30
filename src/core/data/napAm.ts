/**
 * Bảng NapAm (60 dòng — Lục Thập Hoa Giáp). Dùng bởi `findNguHanhNapAm` (frmKinhDich.cs
 * tô màu ô Can Chi Giờ/Ngày/Tháng/Năm theo Ngũ Hành Nạp Âm) — không phải bảng trang trí,
 * cần cho đúng tính năng.
 *
 * 23/30 tên Nạp Âm (đánh dấu `confirmed: true`) đọc trực tiếp từ bytes thô của
 * `KinhDich.sdf` (xem `data/README.md`) — bao gồm 3 trường hợp app dùng biến thể tên khác
 * với bản phổ biến nhất thường thấy trên mạng, nên việc đối chiếu bytes thật sự có giá trị:
 * "Tuyền trung thủy" (không phải "Tỉnh tuyền thủy"), "Bích lôi hỏa" (không phải "Tích lịch
 * hỏa"), "Tang thạch mộc" (không phải "Tang đố mộc"). 7 dòng còn lại (`confirmed: false`)
 * chưa tìm thấy trực tiếp trong file — điền theo tên cổ điển phổ biến, độ rủi ro thấp vì
 * Nạp Âm Lục Thập Hoa Giáp là bảng cố định không có tranh cãi về thứ tự Can Chi, chỉ có thể
 * sai lệch nhỏ về CÁCH GỌI tên — không ảnh hưởng NguHanh (trường duy nhất được dùng để tính
 * toán; TenNapAm chỉ hiển thị).
 */

export interface NapAmRow {
  thienCan: string;
  diaChi: string;
  tenNapAm: string;
  nguHanh: string;
  /** true nếu tenNapAm được đọc trực tiếp từ bytes của KinhDich.sdf, false nếu điền theo tên cổ điển phổ biến (xem ghi chú đầu file). */
  confirmed: boolean;
}

const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const DIA_CHI = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi",
];

/** 30 tên Nạp Âm theo đúng thứ tự chu kỳ Lục Thập Hoa Giáp, mỗi tên áp dụng cho 2 cặp Can Chi liên tiếp. */
const NAP_AM_NAMES: [string, string, boolean][] = [
  ["Hải trung kim", "Kim", true],
  ["Lư trung hỏa", "Hỏa", false],
  ["Đại lâm mộc", "Mộc", true],
  ["Lộ bàng thổ", "Thổ", true],
  ["Kiếm phong kim", "Kim", true],
  ["Sơn đầu hỏa", "Hỏa", true],
  ["Giản hạ thủy", "Thủy", true],
  ["Thành đầu thổ", "Thổ", false],
  ["Bạch lạp kim", "Kim", true],
  ["Dương liễu mộc", "Mộc", true],
  ["Tuyền trung thủy", "Thủy", true],
  ["Ốc thượng thổ", "Thổ", true],
  ["Bích lôi hỏa", "Hỏa", true],
  ["Tùng bách mộc", "Mộc", true],
  ["Trường lưu thủy", "Thủy", false],
  ["Sa trung kim", "Kim", true],
  ["Sơn hạ hỏa", "Hỏa", true],
  ["Bình địa mộc", "Mộc", true],
  ["Bích thượng thổ", "Thổ", false],
  ["Kim bạc kim", "Kim", true],
  ["Phú đăng hỏa", "Hỏa", true],
  ["Thiên hà thủy", "Thủy", true],
  ["Đại dịch thổ", "Thổ", true],
  ["Thoa xuyến kim", "Kim", true],
  ["Tang thạch mộc", "Mộc", true],
  ["Đại khê thủy", "Thủy", false],
  ["Sa trung thổ", "Thổ", false],
  ["Thiên thượng hỏa", "Hỏa", true],
  ["Thạch lựu mộc", "Mộc", false],
  ["Đại hải thủy", "Thủy", true],
];

function build(): NapAmRow[] {
  const rows: NapAmRow[] = [];
  let canIndex = 0;
  let chiIndex = 0;
  for (const [tenNapAm, nguHanh, confirmed] of NAP_AM_NAMES) {
    for (let i = 0; i < 2; i++) {
      rows.push({
        thienCan: THIEN_CAN[canIndex % 10],
        diaChi: DIA_CHI[chiIndex % 12],
        tenNapAm,
        nguHanh,
        confirmed,
      });
      canIndex++;
      chiIndex++;
    }
  }
  return rows;
}

export const NAP_AM: NapAmRow[] = build();

export function timNguHanhNapAm(can: string, chi: string): string {
  const row = NAP_AM.find((r) => r.thienCan === can && r.diaChi === chi);
  if (!row) {
    throw new Error(
      `Chưa có dữ liệu NapAm cho "${can} ${chi}" — xem src/core/data/README.md để export từ KinhDich.sdf.`,
    );
  }
  return row.nguHanh;
}
