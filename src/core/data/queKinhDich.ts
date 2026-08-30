/**
 * STUB — CẦN DỮ LIỆU THẬT TỪ KinhDich.sdf, bảng `QueKinhDich` (8 dòng, theo 8 quẻ đơn
 * Tiên Thiên: Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn — xem findThongTinQue trong
 * dataAccess.cs). Đây là bảng Nạp Giáp Bát Quái cổ điển: với mỗi quẻ đơn, gán Địa Chi cho
 * hào 1/2/3 (khi quẻ này làm quẻ Hạ) và hào 4/5/6 (khi quẻ này làm quẻ Thượng).
 *
 * KHÔNG được điền bằng suy luận/trí nhớ ở đây: chiều tăng/giảm của chuỗi Địa Chi khác nhau
 * giữa các quẻ đơn (ví dụ Càn tăng dần từ Tý, nhưng một số quẻ khác đi theo chiều nghịch),
 * nên rủi ro chép sai chiều là rất cao — sai một quẻ sẽ làm lệch Nạp Giáp của MỌI quẻ dịch
 * dùng quẻ đơn đó. Xem hướng dẫn export ở data/README.md trước khi lấp đầy mảng này.
 */
import type { QueKinhDichRow } from "../types";

export const QUE_KINH_DICH: QueKinhDichRow[] = [
  // TODO: điền 8 dòng thật, lấy từ KinhDich.sdf theo hướng dẫn ở data/README.md.
  // Ví dụ hình dạng một dòng (giá trị minh họa, CHƯA XÁC MINH — không dùng để tính thật):
  // {
  //   tenQue: "Càn",
  //   hao1: 1, hao2: 1, hao3: 1,
  //   tenQueKinhDich: "Càn vi thiên",
  //   napGiapH1: "Tý", napGiapH2: "Dần", napGiapH3: "Thìn",
  //   napGiapH4: "Ngọ", napGiapH5: "Thân", napGiapH6: "Tuất",
  // },
];

export function timQueKinhDich(tenQue: string): QueKinhDichRow {
  const row = QUE_KINH_DICH.find((r) => r.tenQue === tenQue);
  if (!row) {
    throw new Error(
      `Chưa có dữ liệu QueKinhDich cho "${tenQue}" — xem src/core/data/README.md để export từ KinhDich.sdf.`,
    );
  }
  return row;
}

/** Port từ dataAccess.findTenQueByHao — tra quẻ đơn theo 3 giá trị hào (0/1). */
export function timTenQueTheoHao(hao1: 0 | 1, hao2: 0 | 1, hao3: 0 | 1): string {
  const row = QUE_KINH_DICH.find((r) => r.hao1 === hao1 && r.hao2 === hao2 && r.hao3 === hao3);
  if (!row) {
    throw new Error(
      `Chưa có dữ liệu QueKinhDich khớp hào (${hao1},${hao2},${hao3}) — xem src/core/data/README.md.`,
    );
  }
  return row.tenQue;
}
