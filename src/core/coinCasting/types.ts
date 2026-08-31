/**
 * Kiểu dữ liệu cho tính năng "Gieo đồng xu" — port từ mục 13/14 của
 * `project-brain/QIChing — Coin Casting Feature Specification.md`. Đặt tên theo quy ước
 * tiếng Việt sẵn có của `core/` (spec ghi rõ TypeScript ở đó là "data model đề xuất", không
 * phải cú pháp bắt buộc phải chép nguyên).
 */

export type MatXu = "Ngửa" | "Sấp";

export type CheDoGieo = "MAN_HINH" | "TU_GIEO";

/** Mục 5 spec: 4 loại hào theo số mặt Ngửa trong 3 đồng xu. */
export type LoaiHaoXu = "LaoDuong" | "ThieuDuong" | "ThieuAm" | "LaoAm";

export interface KetQuaHaoXu {
  viTri: 1 | 2 | 3 | 4 | 5 | 6;
  matXu: [MatXu, MatXu, MatXu];
  loai: LoaiHaoXu;
  amDuong: "Dương" | "Âm";
  dong: boolean;
}

/** Một phiên gieo đã hoàn thành — dùng để lưu lịch sử (mục 16 spec: raw casting data). */
export interface LichSuGieoQue {
  cheDoGieo: CheDoGieo;
  hao: KetQuaHaoXu[]; // độ dài 6 — hao[0] = Hào 1 (dưới cùng) ... hao[5] = Hào 6 (trên cùng)
  chuDe?: string;
  cauHoi?: string;
  /** ISO 8601 — thời điểm xác nhận Hào 6, dùng làm mốc Nhật/Nguyệt Kiến khi luận (mục 3.2 spec). */
  createdAt: string;
}
