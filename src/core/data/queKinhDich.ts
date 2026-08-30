/**
 * Bảng QueKinhDich (8 dòng) — Nạp Giáp Bát Quái: Địa Chi gán cho hào 1-6 của mỗi quẻ đơn.
 *
 * Nguồn: export trực tiếp từ `KinhDich.sdf` gốc ra CSV (`DBexport/QueKinhDich.csv`, cột mô
 * tả ở `DBexport/QueKinhDich.columns`) — không phải suy luận/cổ điển, đây là dữ liệu THẬT của
 * chính ứng dụng gốc. Đã đối chiếu độc lập lần hai bằng cách đọc trực tiếp bytes nhị phân của
 * `KinhDich.sdf` qua thư viện `sqlce` (Python) và cho kết quả giống hệt — cùng khớp cấu trúc
 * nhị phân chuẩn của quẻ đơn (Hao1/2/3: Càn=1,1,1 ... Khôn=0,0,0) và Ngũ Hành ảnh tượng
 * (TenQueKinhDich: Càn=Thiên, Đoài=Trạch, Ly=Hỏa, Chấn=Lôi, Tốn=Phong, Khảm=Thủy, Cấn=Sơn,
 * Khôn=Địa).
 */
import type { QueKinhDichRow } from "../types";

export const QUE_KINH_DICH: QueKinhDichRow[] = [
  {
    tenQue: "Càn", hao1: 1, hao2: 1, hao3: 1, tenQueKinhDich: "Thiên",
    napGiapH1: "Tý", napGiapH2: "Dần", napGiapH3: "Thìn",
    napGiapH4: "Ngọ", napGiapH5: "Thân", napGiapH6: "Tuất",
  },
  {
    tenQue: "Đoài", hao1: 1, hao2: 1, hao3: 0, tenQueKinhDich: "Trạch",
    napGiapH1: "Tỵ", napGiapH2: "Mão", napGiapH3: "Sửu",
    napGiapH4: "Hợi", napGiapH5: "Dậu", napGiapH6: "Mùi",
  },
  {
    tenQue: "Ly", hao1: 1, hao2: 0, hao3: 1, tenQueKinhDich: "Hỏa",
    napGiapH1: "Mão", napGiapH2: "Sửu", napGiapH3: "Hợi",
    napGiapH4: "Dậu", napGiapH5: "Mùi", napGiapH6: "Tỵ",
  },
  {
    tenQue: "Chấn", hao1: 1, hao2: 0, hao3: 0, tenQueKinhDich: "Lôi",
    napGiapH1: "Tý", napGiapH2: "Dần", napGiapH3: "Thìn",
    napGiapH4: "Ngọ", napGiapH5: "Thân", napGiapH6: "Tuất",
  },
  {
    tenQue: "Tốn", hao1: 0, hao2: 1, hao3: 1, tenQueKinhDich: "Phong",
    napGiapH1: "Sửu", napGiapH2: "Hợi", napGiapH3: "Dậu",
    napGiapH4: "Mùi", napGiapH5: "Tỵ", napGiapH6: "Mão",
  },
  {
    tenQue: "Khảm", hao1: 0, hao2: 1, hao3: 0, tenQueKinhDich: "Thủy",
    napGiapH1: "Dần", napGiapH2: "Thìn", napGiapH3: "Ngọ",
    napGiapH4: "Thân", napGiapH5: "Tuất", napGiapH6: "Tý",
  },
  {
    tenQue: "Cấn", hao1: 0, hao2: 0, hao3: 1, tenQueKinhDich: "Sơn",
    napGiapH1: "Thìn", napGiapH2: "Ngọ", napGiapH3: "Thân",
    napGiapH4: "Tuất", napGiapH5: "Tý", napGiapH6: "Dần",
  },
  {
    tenQue: "Khôn", hao1: 0, hao2: 0, hao3: 0, tenQueKinhDich: "Địa",
    napGiapH1: "Mùi", napGiapH2: "Tỵ", napGiapH3: "Mão",
    napGiapH4: "Sửu", napGiapH5: "Hợi", napGiapH6: "Dậu",
  },
];

export function timQueKinhDich(tenQue: string): QueKinhDichRow {
  const row = QUE_KINH_DICH.find((r) => r.tenQue === tenQue);
  if (!row) {
    throw new Error(`Chưa có dữ liệu QueKinhDich cho "${tenQue}".`);
  }
  return row;
}

/** Port từ dataAccess.findTenQueByHao — tra quẻ đơn theo 3 giá trị hào (0/1). */
export function timTenQueTheoHao(hao1: 0 | 1, hao2: 0 | 1, hao3: 0 | 1): string {
  const row = QUE_KINH_DICH.find((r) => r.hao1 === hao1 && r.hao2 === hao2 && r.hao3 === hao3);
  if (!row) {
    throw new Error(`Chưa có dữ liệu QueKinhDich khớp hào (${hao1},${hao2},${hao3}).`);
  }
  return row.tenQue;
}
