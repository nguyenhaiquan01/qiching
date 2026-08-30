import { QUE_KINH_DICH } from "../core/data/queKinhDich";

/**
 * Hào âm/dương của một quẻ kép, suy từ chính 2 quẻ đơn Thượng/Hạ cấu thành (không cần tính
 * theo thời điểm/Nạp Giáp) — dùng để vẽ hình quẻ (6 vạch) ở trang tra cứu tĩnh "64 Quẻ Kinh
 * Dịch". Cùng logic với `isAm` trong `QueDichView.tsx` (ở đó nhận vào một `QueDich` đã tính
 * theo thời điểm cụ thể), tách riêng ra đây để dùng được mà không cần an quẻ theo ngày giờ.
 */
export function vachAm(queThuong: string, queHa: string, vach: number): boolean {
  const row =
    vach >= 4
      ? QUE_KINH_DICH.find((r) => r.tenQue === queThuong)
      : QUE_KINH_DICH.find((r) => r.tenQue === queHa);
  if (!row) return false;
  const haoTrongQueDon = vach >= 4 ? vach - 3 : vach;
  const gia = haoTrongQueDon === 1 ? row.hao1 : haoTrongQueDon === 2 ? row.hao2 : row.hao3;
  return gia === 0;
}
