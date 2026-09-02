/**
 * Lưu trữ phía client cho "quẻ đã xem" — thay cho bảng `InfoQue` trong `KinhDich.sdf` +
 * `dataAccess.SaveQueInfo`/`business.SaveQueInfo` của bản gốc (xem
 * project-brain/05-ke-hoach-migrate-web.md, Giai đoạn 3).
 *
 * Chỉ lưu `(time, binhchu)` giống đúng bản gốc, cộng thêm `chuDe`/`cauHoi` nếu người dùng có
 * nhập ở "Câu hỏi" (mở rộng so với bản gốc, vốn không có 2 trường này). Quẻ được tính lại từ
 * `time` mỗi lần xem (an quẻ xác định hoàn toàn từ ngày giờ), không lưu kết quả quẻ. Không
 * migrate dữ liệu cũ từ `InfoQue` (xem lý do ở kế hoạch migrate: tính năng lưu quẻ trên bản
 * desktop nhiều khả năng đã lỗi từ lâu, bảng gốc gần như rỗng).
 *
 * `createdAt` (thời điểm thực tế bấm "Lưu quẻ") là khoá dùng để sắp xếp/hiển thị/xoá trong
 * "Quẻ đã lưu" — tách khỏi `time` vì "Ngày lập quẻ" có thể bị người dùng chỉnh tay thành một
 * thời điểm bất kỳ trong quá khứ/tương lai để an quẻ, không phản ánh lúc bản ghi được tạo.
 */
import type { QueInfo } from "./types";

const STORAGE_KEY = "qiching.queInfo.v1";

interface StoredQueInfo {
  time: string; // ISO 8601 — Date không serialize được trực tiếp qua JSON
  binhchu: string;
  chuDe?: string;
  cauHoi?: string;
  createdAt: string;
}

function docTatCa(): StoredQueInfo[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function ghiTatCa(rows: StoredQueInfo[]): void {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
}

/**
 * Port từ business.SaveQueInfo — lưu một quẻ đã xem (thời điểm + bình chú), mở rộng thêm
 * chủ đề/câu hỏi nếu người dùng có nhập ở "Câu hỏi" (không có trong bản gốc). `createdAt`
 * do hàm này tự sinh tại đúng lúc gọi (lúc bấm "Lưu quẻ"), không nhận từ caller.
 */
export function luuQueInfo(info: Omit<QueInfo, "createdAt">): void {
  const rows = docTatCa();
  rows.push({
    time: info.time.toISOString(),
    binhchu: info.binhchu,
    ...(info.chuDe ? { chuDe: info.chuDe } : {}),
    ...(info.cauHoi ? { cauHoi: info.cauHoi } : {}),
    createdAt: new Date().toISOString(),
  });
  ghiTatCa(rows);
}

/**
 * Port từ frmLoadQue — tải danh sách quẻ đã lưu, mới nhất trước theo `createdAt`. Bản ghi cũ
 * (lưu trước khi có `createdAt`) dùng tạm `time` làm phương án dự phòng.
 */
export function taiDanhSachQueDaLuu(): QueInfo[] {
  return docTatCa()
    .map((r) => ({
      time: new Date(r.time),
      binhchu: r.binhchu,
      chuDe: r.chuDe,
      cauHoi: r.cauHoi,
      createdAt: new Date(r.createdAt ?? r.time),
    }))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/** Xoá một quẻ đã lưu theo `createdAt` chính xác (dùng làm khoá vì không có id riêng). */
export function xoaQueInfo(createdAt: Date): void {
  const rows = docTatCa().filter((r) => (r.createdAt ?? r.time) !== createdAt.toISOString());
  ghiTatCa(rows);
}

/** Export toàn bộ quẻ đã lưu ra JSON — dùng cho tính năng đồng bộ thủ công nhiều thiết bị. */
export function exportQueInfoJSON(): string {
  return JSON.stringify(docTatCa(), null, 2);
}

/** Import quẻ đã lưu từ JSON (ghi đè toàn bộ) — mặt còn lại của export thủ công. */
export function importQueInfoJSON(json: string): void {
  const parsed = JSON.parse(json);
  if (!Array.isArray(parsed)) throw new Error("File import không đúng định dạng — cần một mảng JSON.");
  for (const row of parsed) {
    if (typeof row.time !== "string" || typeof row.binhchu !== "string") {
      throw new Error("File import không đúng định dạng — mỗi dòng cần có time và binhchu dạng chuỗi.");
    }
  }
  ghiTatCa(parsed);
}
