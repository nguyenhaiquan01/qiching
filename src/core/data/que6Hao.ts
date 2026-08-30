/**
 * Bảng Que6Hao (64 dòng) — Cung, Quẻ Thượng/Hạ, Hào Thế của mỗi quẻ dịch.
 *
 * Dữ liệu này được đối chiếu trực tiếp với `KinhDich.sdf` (đọc bytes thô của file SQL CE —
 * xem `data/README.md`), không hand-fabricate: vị trí Hào Thế và cặp Quẻ Thượng/Hạ cho
 * nhiều dòng (rải đều cả 8 Cung) được xác nhận khớp 100% với dữ liệu thật đọc được từ file
 * (ví dụ "PHONG ĐỊA QUAN" có "(Thế)" gắn ở hào thứ 4 trong bytes gốc, khớp HaoThe=4 suy ra
 * ở đây). Từ các điểm đối chiếu đó suy ra công thức chung cho toàn bộ 64 dòng:
 * - Cung: 8 quẻ nhóm liên tiếp trong Const.que6hao (đúng thứ tự Tiên Thiên Càn, Đoài, Ly,
 *   Chấn, Tốn, Khảm, Cấn, Khôn) — mỗi nhóm 8 quẻ dùng chung 1 Cung là quẻ đơn đầu nhóm.
 * - Quẻ Thượng/Hạ: suy từ chính tên quẻ kép (từ đầu = ảnh tượng quẻ Thượng, từ hai = ảnh
 *   tượng quẻ Hạ; riêng 8 quẻ "X VI Y" là quẻ thuần, Thượng=Hạ=X).
 * - Hào Thế theo vị trí trong nhóm 8 (Bát Cung Quái): Thuần=6, Nhất Thế=1, Nhị Thế=2, Tam
 *   Thế=3, Tứ Thế=4, Ngũ Thế=5, Du Hồn=4, Quy Hồn=3 — khớp với mọi điểm đối chiếu bytes.
 */
import type { Que6HaoRow } from "../types";

export const QUE_6_HAO_DATA: Que6HaoRow[] = [
  { tenQue: "CÀN VI THIÊN", cung: "Càn", queThuong: "Càn", queHa: "Càn", haoThe: 6 },
  { tenQue: "THIÊN PHONG CẤU", cung: "Càn", queThuong: "Càn", queHa: "Tốn", haoThe: 1 },
  { tenQue: "THIÊN SƠN ĐỘN", cung: "Càn", queThuong: "Càn", queHa: "Cấn", haoThe: 2 },
  { tenQue: "THIÊN ĐỊA BỈ", cung: "Càn", queThuong: "Càn", queHa: "Khôn", haoThe: 3 },
  { tenQue: "PHONG ĐỊA QUAN", cung: "Càn", queThuong: "Tốn", queHa: "Khôn", haoThe: 4 },
  { tenQue: "SƠN ĐỊA BÁC", cung: "Càn", queThuong: "Cấn", queHa: "Khôn", haoThe: 5 },
  { tenQue: "HỎA ĐỊA TẤN", cung: "Càn", queThuong: "Ly", queHa: "Khôn", haoThe: 4 },
  { tenQue: "HỎA THIÊN ĐẠI HỮU", cung: "Càn", queThuong: "Ly", queHa: "Càn", haoThe: 3 },

  { tenQue: "ĐOÀI VI TRẠCH", cung: "Đoài", queThuong: "Đoài", queHa: "Đoài", haoThe: 6 },
  { tenQue: "TRẠCH THỦY KHỐN", cung: "Đoài", queThuong: "Đoài", queHa: "Khảm", haoThe: 1 },
  { tenQue: "TRẠCH ĐỊA TỤY", cung: "Đoài", queThuong: "Đoài", queHa: "Khôn", haoThe: 2 },
  { tenQue: "TRẠCH SƠN HÀM", cung: "Đoài", queThuong: "Đoài", queHa: "Cấn", haoThe: 3 },
  { tenQue: "THỦY SƠN KIỀN", cung: "Đoài", queThuong: "Khảm", queHa: "Cấn", haoThe: 4 },
  { tenQue: "ĐỊA SƠN KHIÊM", cung: "Đoài", queThuong: "Khôn", queHa: "Cấn", haoThe: 5 },
  { tenQue: "LÔI SƠN TIỂU QUÁ", cung: "Đoài", queThuong: "Chấn", queHa: "Cấn", haoThe: 4 },
  { tenQue: "LÔI TRẠCH QUY MUỘI", cung: "Đoài", queThuong: "Chấn", queHa: "Đoài", haoThe: 3 },

  { tenQue: "LY VI HỎA", cung: "Ly", queThuong: "Ly", queHa: "Ly", haoThe: 6 },
  { tenQue: "HỎA SƠN LỮ", cung: "Ly", queThuong: "Ly", queHa: "Cấn", haoThe: 1 },
  { tenQue: "HỎA PHONG ĐỈNH", cung: "Ly", queThuong: "Ly", queHa: "Tốn", haoThe: 2 },
  { tenQue: "HỎA THỦY VỊ TẾ", cung: "Ly", queThuong: "Ly", queHa: "Khảm", haoThe: 3 },
  { tenQue: "SƠN THỦY MÔNG", cung: "Ly", queThuong: "Cấn", queHa: "Khảm", haoThe: 4 },
  { tenQue: "PHONG THỦY HOÁN", cung: "Ly", queThuong: "Tốn", queHa: "Khảm", haoThe: 5 },
  { tenQue: "THIÊN THỦY TỤNG", cung: "Ly", queThuong: "Càn", queHa: "Khảm", haoThe: 4 },
  { tenQue: "THIÊN HỎA ĐỒNG NHÂN", cung: "Ly", queThuong: "Càn", queHa: "Ly", haoThe: 3 },

  { tenQue: "CHẤN VI LÔI", cung: "Chấn", queThuong: "Chấn", queHa: "Chấn", haoThe: 6 },
  { tenQue: "LÔI ĐỊA DỰ", cung: "Chấn", queThuong: "Chấn", queHa: "Khôn", haoThe: 1 },
  { tenQue: "LÔI THỦY GIẢI", cung: "Chấn", queThuong: "Chấn", queHa: "Khảm", haoThe: 2 },
  { tenQue: "LÔI PHONG HẰNG", cung: "Chấn", queThuong: "Chấn", queHa: "Tốn", haoThe: 3 },
  { tenQue: "ĐỊA PHONG THĂNG", cung: "Chấn", queThuong: "Khôn", queHa: "Tốn", haoThe: 4 },
  { tenQue: "THỦY PHONG TỈNH", cung: "Chấn", queThuong: "Khảm", queHa: "Tốn", haoThe: 5 },
  { tenQue: "TRẠCH PHONG ĐẠI QUÁ", cung: "Chấn", queThuong: "Đoài", queHa: "Tốn", haoThe: 4 },
  { tenQue: "TRẠCH LÔI TÙY", cung: "Chấn", queThuong: "Đoài", queHa: "Chấn", haoThe: 3 },

  { tenQue: "TỐN VI PHONG", cung: "Tốn", queThuong: "Tốn", queHa: "Tốn", haoThe: 6 },
  { tenQue: "PHONG THIÊN TIỂU SÚC", cung: "Tốn", queThuong: "Tốn", queHa: "Càn", haoThe: 1 },
  { tenQue: "PHONG HỎA GIA NHÂN", cung: "Tốn", queThuong: "Tốn", queHa: "Ly", haoThe: 2 },
  { tenQue: "PHONG LÔI ÍCH", cung: "Tốn", queThuong: "Tốn", queHa: "Chấn", haoThe: 3 },
  { tenQue: "THIÊN LÔI VÔ VỌNG", cung: "Tốn", queThuong: "Càn", queHa: "Chấn", haoThe: 4 },
  { tenQue: "HỎA LÔI PHỆ HẠP", cung: "Tốn", queThuong: "Ly", queHa: "Chấn", haoThe: 5 },
  { tenQue: "SƠN LÔI DI", cung: "Tốn", queThuong: "Cấn", queHa: "Chấn", haoThe: 4 },
  { tenQue: "SƠN PHONG CỔ", cung: "Tốn", queThuong: "Cấn", queHa: "Tốn", haoThe: 3 },

  { tenQue: "KHẢM VI THỦY", cung: "Khảm", queThuong: "Khảm", queHa: "Khảm", haoThe: 6 },
  { tenQue: "THỦY TRẠCH TIẾT", cung: "Khảm", queThuong: "Khảm", queHa: "Đoài", haoThe: 1 },
  { tenQue: "THỦY LÔI TRUÂN", cung: "Khảm", queThuong: "Khảm", queHa: "Chấn", haoThe: 2 },
  { tenQue: "THỦY HOẢ KÝ TẾ", cung: "Khảm", queThuong: "Khảm", queHa: "Ly", haoThe: 3 },
  { tenQue: "TRẠCH HỎA CÁCH", cung: "Khảm", queThuong: "Đoài", queHa: "Ly", haoThe: 4 },
  { tenQue: "LÔI HỎA PHONG", cung: "Khảm", queThuong: "Chấn", queHa: "Ly", haoThe: 5 },
  { tenQue: "ĐỊA HỎA MINH DI", cung: "Khảm", queThuong: "Khôn", queHa: "Ly", haoThe: 4 },
  { tenQue: "ĐỊA THỦY SƯ", cung: "Khảm", queThuong: "Khôn", queHa: "Khảm", haoThe: 3 },

  { tenQue: "CẤN VI SƠN", cung: "Cấn", queThuong: "Cấn", queHa: "Cấn", haoThe: 6 },
  { tenQue: "SƠN HỎA BÔN", cung: "Cấn", queThuong: "Cấn", queHa: "Ly", haoThe: 1 },
  { tenQue: "SƠN THIÊN ĐẠI SÚC", cung: "Cấn", queThuong: "Cấn", queHa: "Càn", haoThe: 2 },
  { tenQue: "SƠN TRẠCH TỔN", cung: "Cấn", queThuong: "Cấn", queHa: "Đoài", haoThe: 3 },
  { tenQue: "HỎA TRẠCH KHUÊ", cung: "Cấn", queThuong: "Ly", queHa: "Đoài", haoThe: 4 },
  { tenQue: "THIÊN TRẠCH LÝ", cung: "Cấn", queThuong: "Càn", queHa: "Đoài", haoThe: 5 },
  { tenQue: "PHONG TRẠCH TRUNG PHÙ", cung: "Cấn", queThuong: "Tốn", queHa: "Đoài", haoThe: 4 },
  { tenQue: "PHONG SƠN TIỆM", cung: "Cấn", queThuong: "Tốn", queHa: "Cấn", haoThe: 3 },

  { tenQue: "KHÔN VI ĐỊA", cung: "Khôn", queThuong: "Khôn", queHa: "Khôn", haoThe: 6 },
  { tenQue: "ĐỊA LÔI PHỤC", cung: "Khôn", queThuong: "Khôn", queHa: "Chấn", haoThe: 1 },
  { tenQue: "ĐỊA TRẠCH LÂM", cung: "Khôn", queThuong: "Khôn", queHa: "Đoài", haoThe: 2 },
  { tenQue: "ĐỊA THIÊN THÁI", cung: "Khôn", queThuong: "Khôn", queHa: "Càn", haoThe: 3 },
  { tenQue: "LÔI THIÊN ĐẠI TRÁNG", cung: "Khôn", queThuong: "Chấn", queHa: "Càn", haoThe: 4 },
  { tenQue: "TRẠCH THIÊN QUẢI", cung: "Khôn", queThuong: "Đoài", queHa: "Càn", haoThe: 5 },
  { tenQue: "THỦY THIÊN NHU", cung: "Khôn", queThuong: "Khảm", queHa: "Càn", haoThe: 4 },
  { tenQue: "THỦY ĐỊA TỶ", cung: "Khôn", queThuong: "Khảm", queHa: "Khôn", haoThe: 3 },
];

export function timQue6Hao(tenQue: string): Que6HaoRow {
  const row = QUE_6_HAO_DATA.find((r) => r.tenQue === tenQue);
  if (!row) {
    throw new Error(
      `Chưa có dữ liệu Que6Hao cho "${tenQue}" — xem src/core/data/README.md để export từ KinhDich.sdf.`,
    );
  }
  return row;
}

/** Port từ dataAccess.findTenQue6Hao(quethuong, queha) — tra tên quẻ kép từ 2 quẻ đơn. */
export function timTenQue6Hao(queThuong: string, queHa: string): string {
  const row = QUE_6_HAO_DATA.find((r) => r.queThuong === queThuong && r.queHa === queHa);
  if (!row) {
    throw new Error(
      `Chưa có dữ liệu Que6Hao khớp quẻ Thượng="${queThuong}", Hạ="${queHa}" — xem src/core/data/README.md.`,
    );
  }
  return row.tenQue;
}
