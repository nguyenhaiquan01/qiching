/**
 * Port từ bảng `NguHanh` trong KinhDich.sdf (dataAccess.TuongSinh/TuongKhac).
 * Quan hệ Tương Sinh/Tương Khắc Ngũ Hành là kiến thức cổ điển cố định, không có biến thể/
 * mơ hồ về thứ tự — điền trực tiếp, không cần đối chiếu lại với KinhDich.sdf gốc.
 */

/** [X, Y] nghĩa là "X sinh Y" */
const TUONG_SINH: ReadonlyArray<readonly [string, string]> = [
  ["Kim", "Thủy"],
  ["Thủy", "Mộc"],
  ["Mộc", "Hỏa"],
  ["Hỏa", "Thổ"],
  ["Thổ", "Kim"],
];

/** [X, Y] nghĩa là "X khắc Y" */
const TUONG_KHAC: ReadonlyArray<readonly [string, string]> = [
  ["Kim", "Mộc"],
  ["Mộc", "Thổ"],
  ["Thổ", "Thủy"],
  ["Thủy", "Hỏa"],
  ["Hỏa", "Kim"],
];

/** Port từ dataAccess.TuongSinh(NguHanh1, NguHanh2) */
export function tuongSinh(nguHanh1: string, nguHanh2: string): boolean {
  return TUONG_SINH.some(([x, y]) => x === nguHanh1 && y === nguHanh2);
}

/** Port từ dataAccess.TuongKhac(NguHanh1, NguHanh2) */
export function tuongKhac(nguHanh1: string, nguHanh2: string): boolean {
  return TUONG_KHAC.some(([x, y]) => x === nguHanh1 && y === nguHanh2);
}
