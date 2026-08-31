import type { KetQuaHaoXu, LoaiHaoXu, MatXu } from "./types";

const NHAN_LOAI_HAO: Record<LoaiHaoXu, string> = {
  LaoDuong: "Lão Dương",
  ThieuDuong: "Thiếu Dương",
  ThieuAm: "Thiếu Âm",
  LaoAm: "Lão Âm",
};

export function nhanLoaiHao(loai: LoaiHaoXu): string {
  return NHAN_LOAI_HAO[loai];
}

const XEP_LOAI: Record<0 | 1 | 2 | 3, { loai: LoaiHaoXu; amDuong: "Dương" | "Âm"; dong: boolean }> = {
  0: { loai: "LaoDuong", amDuong: "Dương", dong: true }, // 3 Sấp
  1: { loai: "ThieuDuong", amDuong: "Dương", dong: false }, // 2 Sấp + 1 Ngửa
  2: { loai: "ThieuAm", amDuong: "Âm", dong: false }, // 2 Ngửa + 1 Sấp
  3: { loai: "LaoAm", amDuong: "Âm", dong: true }, // 3 Ngửa
};

/**
 * Port từ mục 5 + mục 14 (`resolveCoinLine`) của Feature Spec — bảng ánh xạ số mặt Ngửa sang
 * loại hào. Thứ tự 3 đồng xu không ảnh hưởng kết quả (permutation test ở mục 20 spec, xem
 * `__tests__/xacDinhHao.test.ts`).
 */
export function xacDinhHaoTuXu(viTri: 1 | 2 | 3 | 4 | 5 | 6, matXu: [MatXu, MatXu, MatXu]): KetQuaHaoXu {
  const soNgua = matXu.filter((m) => m === "Ngửa").length as 0 | 1 | 2 | 3;
  const { loai, amDuong, dong } = XEP_LOAI[soNgua];
  return { viTri, matXu, loai, amDuong, dong };
}
