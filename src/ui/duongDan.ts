import { NOI_DUNG_QUE, type NoiDungQueRow } from "../core/data/noiDungQue";

/**
 * URL contract của app — nơi DUY NHẤT sinh và phân giải đường dẫn, để router, link điều hướng
 * và (sau này) sitemap không bao giờ lệch nhau. Xem `project-brain/10-ke-hoach-seo.md`,
 * Giai đoạn A.
 */

/** 64 quẻ theo đúng thứ tự Kinh Dịch — dùng chung cho danh sách, điều hướng trước/sau và tra slug. */
export const DANH_SACH_QUE: NoiDungQueRow[] = NOI_DUNG_QUE.slice().sort((a, b) => a.soThuTu - b.soThuTu);

/** Bỏ dấu tiếng Việt để tạo slug ASCII: "Địa Phong Thăng" -> "dia-phong-thang". */
export function boDau(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Slug canonical của một quẻ: `<số thứ tự>-<tên không dấu>`, ví dụ `1-thuan-can`.
 *
 * Số thứ tự KHÔNG phải để trang trí mà là khóa định danh: slug hoá riêng `tenQue` chỉ unique
 * 63/64 — quẻ 1 "Thuần Càn" và quẻ 52 "Thuần Cấn" cùng ra `thuan-can`. Vì vậy việc phân giải
 * luôn dựa vào SỐ, còn phần chữ chỉ để URL đọc được và để phát hiện slug sai.
 */
export function slugQue(que: NoiDungQueRow): string {
  return `${que.soThuTu}-${boDau(que.tenQue)}`;
}

export function duongDanQue(que: NoiDungQueRow): string {
  return `/64-que/${slugQue(que)}`;
}

/** Tra quẻ theo `tenQueChuan` (khóa dùng bên phần tính toán, ví dụ "CÀN VI THIÊN"). */
export function timQueTheoTenChuan(tenQueChuan: string): NoiDungQueRow | undefined {
  return DANH_SACH_QUE.find((q) => q.tenQueChuan === tenQueChuan);
}

export type KetQuaPhanGiai =
  /** Slug khớp canonical — render bình thường. */
  | { trangThai: "khop"; que: NoiDungQueRow }
  /** Đúng quẻ nhưng slug không chuẩn (sai phần chữ, thiếu chữ, sai hoa/thường, thừa dấu) —
   * phải redirect 301-tương-đương về `duongDanChuan` thay vì âm thầm phục vụ cùng nội dung ở
   * hai URL khác nhau (tránh duplicate content). */
  | { trangThai: "canRedirect"; que: NoiDungQueRow; duongDanChuan: string }
  /** Không phân giải được ra quẻ nào — trả 404 (route catch-all). */
  | { trangThai: "khongThay" };

/**
 * Phân giải `:slug` trên route `/64-que/:slug`.
 *
 * Quy tắc: lấy phần số ở đầu làm khóa; nếu số hợp lệ (1-64) nhưng phần chữ không khớp slug
 * canonical thì redirect chứ không phục vụ. Nếu không có số hợp lệ thì thử khớp nguyên slug
 * theo tên (hỗ trợ URL cũ/gõ tay dạng `/64-que/thuan-can`) — khớp đúng một quẻ thì redirect về
 * canonical, khớp nhiều hơn một (trường hợp `thuan-can`) thì coi như không thấy vì không có
 * cách chọn đúng.
 */
export function phanGiaiSlugQue(slug: string | undefined): KetQuaPhanGiai {
  if (!slug) return { trangThai: "khongThay" };
  const chuanHoa = slug.trim().toLowerCase();

  const khopSo = /^(\d{1,2})(?:-(.*))?$/.exec(chuanHoa);
  if (khopSo) {
    const so = Number(khopSo[1]);
    const que = DANH_SACH_QUE.find((q) => q.soThuTu === so);
    if (!que) return { trangThai: "khongThay" };
    return chuanHoa === slugQue(que)
      ? { trangThai: "khop", que }
      : { trangThai: "canRedirect", que, duongDanChuan: duongDanQue(que) };
  }

  const theoTen = DANH_SACH_QUE.filter((q) => boDau(q.tenQue) === chuanHoa);
  if (theoTen.length === 1) {
    return { trangThai: "canRedirect", que: theoTen[0], duongDanChuan: duongDanQue(theoTen[0]) };
  }
  return { trangThai: "khongThay" };
}
