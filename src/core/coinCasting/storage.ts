/**
 * Lưu trữ phía client cho "quẻ gieo đồng xu đã lưu" — port từ mục 16 (Persistence) của
 * `project-brain/QIChing — Coin Casting Feature Specification.md`. Tách riêng khỏi
 * `core/storage.ts` (lưu quẻ theo thời gian, chỉ có `{time, binhchu}`) vì raw casting data có
 * cấu trúc khác hẳn — không tái tạo được quẻ chỉ từ `createdAt` như luồng Mai Hoa Dịch Số.
 */
import type { CheDoGieo, KetQuaHaoXu } from "./types";

const STORAGE_KEY = "qiching.coinCasting.v1";

export interface QueDaGieoDaLuu {
  cheDoGieo: CheDoGieo;
  hao: KetQuaHaoXu[];
  chuDe?: string;
  cauHoi?: string;
  createdAt: string; // ISO — mục 3.2 spec: mốc Nhật/Nguyệt Kiến khi luận, không phải casting input
  tenQueChinh: string;
  tenQueBien: string | null;
  viTriHaoDong: number[];
}

function docTatCa(): QueDaGieoDaLuu[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function ghiTatCa(rows: QueDaGieoDaLuu[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

export function luuGieoQue(reading: QueDaGieoDaLuu): void {
  const rows = docTatCa();
  rows.push(reading);
  ghiTatCa(rows);
}

/** Mới nhất trước — cùng quy ước với `core/storage.ts#taiDanhSachQueDaLuu`. */
export function taiDanhSachGieoQue(): QueDaGieoDaLuu[] {
  return docTatCa().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function xoaGieoQue(createdAt: string): void {
  ghiTatCa(docTatCa().filter((r) => r.createdAt !== createdAt));
}
