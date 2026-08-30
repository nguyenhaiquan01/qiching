/**
 * Bảng NapAm (60 dòng — Lục Thập Hoa Giáp). Dùng bởi `findNguHanhNapAm` (frmKinhDich.cs
 * tô màu ô Can Chi Giờ/Ngày/Tháng/Năm theo Ngũ Hành Nạp Âm) — không phải bảng trang trí,
 * cần cho đúng tính năng.
 *
 * Nguồn: export trực tiếp từ `KinhDich.sdf` gốc ra CSV (`DBexport/NapAm.csv`) — toàn bộ 30
 * tên Nạp Âm đều là dữ liệu thật, không phải suy luận cổ điển. Một vài tên khác với bản phổ
 * biến nhất thường thấy ("Lô trung hỏa" không phải "Lư trung hỏa", "Tuyền trung thủy" không
 * phải "Tỉnh tuyền thủy", "Bích lôi hỏa" không phải "Tích lịch hỏa", "Tang thạch mộc" không
 * phải "Tang đố mộc") — đúng như cách app gốc gọi, không chuẩn hoá lại theo tên phổ biến hơn.
 */

export interface NapAmRow {
  thienCan: string;
  diaChi: string;
  tenNapAm: string;
  nguHanh: string;
}

const THIEN_CAN = ["Giáp", "Ất", "Bính", "Đinh", "Mậu", "Kỷ", "Canh", "Tân", "Nhâm", "Quý"];
const DIA_CHI = [
  "Tý", "Sửu", "Dần", "Mão", "Thìn", "Tỵ", "Ngọ", "Mùi", "Thân", "Dậu", "Tuất", "Hợi",
];

/** 30 tên Nạp Âm theo đúng thứ tự chu kỳ Lục Thập Hoa Giáp, mỗi tên áp dụng cho 2 cặp Can Chi liên tiếp. */
const NAP_AM_NAMES: [string, string][] = [
  ["Hải trung kim", "Kim"],
  ["Lô trung hỏa", "Hỏa"],
  ["Đại lâm mộc", "Mộc"],
  ["Lộ bàng thổ", "Thổ"],
  ["Kiếm phong kim", "Kim"],
  ["Sơn đầu hỏa", "Hỏa"],
  ["Giản hạ thủy", "Thủy"],
  ["Thành đầu thổ", "Thổ"],
  ["Bạch lạp kim", "Kim"],
  ["Dương liễu mộc", "Mộc"],
  ["Tuyền trung thủy", "Thủy"],
  ["Ốc thượng thổ", "Thổ"],
  ["Bích lôi hỏa", "Hỏa"],
  ["Tùng bách mộc", "Mộc"],
  ["Trường lưu thủy", "Thủy"],
  ["Sa trung kim", "Kim"],
  ["Sơn hạ hỏa", "Hỏa"],
  ["Bình địa mộc", "Mộc"],
  ["Bích thượng thổ", "Thổ"],
  ["Kim bạc kim", "Kim"],
  ["Phú đăng hỏa", "Hỏa"],
  ["Thiên hà thủy", "Thủy"],
  ["Đại dịch thổ", "Thổ"],
  ["Thoa xuyến kim", "Kim"],
  ["Tang thạch mộc", "Mộc"],
  ["Đại khê thủy", "Thủy"],
  ["Sa trung thổ", "Thổ"],
  ["Thiên thượng hỏa", "Hỏa"],
  ["Thạch Lựu mộc", "Mộc"],
  ["Đại hải thủy", "Thủy"],
];

function build(): NapAmRow[] {
  const rows: NapAmRow[] = [];
  let canIndex = 0;
  let chiIndex = 0;
  for (const [tenNapAm, nguHanh] of NAP_AM_NAMES) {
    for (let i = 0; i < 2; i++) {
      rows.push({
        thienCan: THIEN_CAN[canIndex % 10],
        diaChi: DIA_CHI[chiIndex % 12],
        tenNapAm,
        nguHanh,
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
    throw new Error(`Chưa có dữ liệu NapAm cho "${can} ${chi}".`);
  }
  return row.nguHanh;
}
