/**
 * Chuẩn hoá "mục nội dung" khi xem một quẻ — cho phép người dùng lọc chỉ hiện Ý nghĩa chính,
 * hoặc chỉ Thoán Từ, hoặc chỉ Đại Tượng Truyện, v.v. — áp dụng đồng nhất cho cả 3 bản dịch giả
 * (`noiDungQue.ts`/`noiDungQueNgoTatTo.ts`/`noiDungQuePhanBoiChau.ts`) dù 3 nguồn đó tách khối
 * nội dung KHÁC NHAU (xem comment đầu mỗi file).
 *
 * Danh sách mục dưới đây lấy theo cấu trúc truyền thống của Kinh Dịch (Tự Quái/Thoán/Tượng/
 * Hào/Văn Ngôn) — đây cũng là mức chi tiết nhất mà một trong 3 nguồn (Phan Bội Châu) tách
 * được trọn vẹn. Hai nguồn còn lại không tách rời được tới mức đó nên một khối hiển thị của
 * họ có thể PHỦ NHIỀU MỤC CHUẨN cùng lúc — tầng UI cần coi một khối là "nên hiện" nếu người
 * dùng đang bật ÍT NHẤT MỘT trong các mục mà khối đó phủ, xem `hienKhoi()`.
 *
 * Bảng ánh xạ khối hiển thị hiện có ở `ChiTietQue.tsx` sang mục chuẩn:
 *
 * | Mục chuẩn         | Nguyễn Hiến Lê        | Ngô Tất Tố                        | Phan Bội Châu               |
 * |-------------------|-----------------------|------------------------------------|-------------------------------|
 * | y-nghia-chinh     | Dẫn Nhập (từ Giải nghĩa) | Dẫn Nhập (mệnh đề mở đầu)       | Dẫn Nhập (Mở Đầu + Tự Quái) |
 * | thoan-tu          | Thoán Từ              | ┐                                   | Soán Từ              |
 * | thoan-truyen      | Giảng (Thoán Từ)      | ├─ phần còn lại của "quaiTu"       | Soán Truyện          |
 * | dai-tuong-truyen  | (không có)            | ┘  (nguồn không tách rời tuyệt đối) | Đại Tượng Truyện     |
 * | hao-tu            | Hào Từ                | Hào Từ (kèm Tiểu Tượng Truyện)     | Hào Từ & Tiểu Tượng  |
 * | van-ngon-truyen   | (không có)            | ┐ gộp chung vào "dungCuu" (chỉ Càn/ | Văn Ngôn Truyện      |
 * | dung-cuu-luc      | Dụng Cửu/Lục          | ┘ Khôn, nguồn không tách rời được) | Dụng Cửu/Lục         |
 * | chu-thich         | Chú Thích             | (không có)                         | (không có)           |
 * | phu-luc           | Phụ Lục               | (không có)                         | (không có)           |
 *
 * Vì vậy lọc "chỉ hiện Đại Tượng Truyện" cho ra kết quả trung thực với dữ liệu thật của từng
 * bản: bản Phan Bội Châu hiện đúng một đoạn Đại Tượng Truyện, bản Ngô Tất Tố hiện nguyên khối
 * gộp (không có cách nào tách riêng mà không tự suy diễn/rủi ro sai), còn bản Nguyễn Hiến Lê
 * không hiện gì (nguồn không có mục này).
 */

export type MucNoiDung =
  | "y-nghia-chinh"
  | "thoan-tu"
  | "thoan-truyen"
  | "dai-tuong-truyen"
  | "hao-tu"
  | "van-ngon-truyen"
  | "dung-cuu-luc"
  | "chu-thich"
  | "phu-luc";

export const DANH_SACH_MUC_NOI_DUNG: { id: MucNoiDung; nhan: string }[] = [
  { id: "y-nghia-chinh", nhan: "Dẫn Nhập" },
  { id: "thoan-tu", nhan: "Thoán Từ" },
  { id: "thoan-truyen", nhan: "Thoán Truyện" },
  { id: "dai-tuong-truyen", nhan: "Đại Tượng Truyện" },
  { id: "hao-tu", nhan: "Hào Từ" },
  { id: "van-ngon-truyen", nhan: "Văn Ngôn Truyện" },
  { id: "dung-cuu-luc", nhan: "Dụng Cửu / Dụng Lục" },
  { id: "chu-thich", nhan: "Chú Thích" },
  { id: "phu-luc", nhan: "Phụ Lục" },
];

const KHOA_MUC_AN_DA_LUU = "qiching-muc-noi-dung-an";

/** Đọc tập mục đang bị ẨN đã lưu (nếu có). Lưu theo chiều "ẩn" (opt-out) thay vì "hiện"
 * (opt-in) để nếu sau này thêm mục chuẩn mới, mục đó mặc định HIỆN cho người dùng cũ thay vì
 * âm thầm biến mất vì không có trong danh sách "đang hiện" họ lưu từ trước. */
export function docMucAnDaLuu(): Set<MucNoiDung> {
  try {
    const raw = localStorage.getItem(KHOA_MUC_AN_DA_LUU);
    if (!raw) return new Set();
    const ds = JSON.parse(raw);
    if (!Array.isArray(ds)) return new Set();
    const hopLe = new Set(DANH_SACH_MUC_NOI_DUNG.map((m) => m.id));
    return new Set(ds.filter((id): id is MucNoiDung => hopLe.has(id)));
  } catch {
    return new Set();
  }
}

export function luuMucAn(mucAn: Set<MucNoiDung>) {
  try {
    localStorage.setItem(KHOA_MUC_AN_DA_LUU, JSON.stringify([...mucAn]));
  } catch {
    // localStorage có thể bị chặn (chế độ riêng tư) — bỏ qua, chỉ không nhớ được cho lần ghé sau.
  }
}

/** Một khối hiển thị (ví dụ khối "quaiTu" gộp của Ngô Tất Tố) có thể phủ nhiều mục chuẩn cùng
 * lúc — khối đó nên hiện nếu người dùng đang bật (không ẩn) ít nhất một trong các mục đó. */
export function hienKhoi(mucAn: Set<MucNoiDung>, ...macCac: MucNoiDung[]): boolean {
  return macCac.some((id) => !mucAn.has(id));
}
