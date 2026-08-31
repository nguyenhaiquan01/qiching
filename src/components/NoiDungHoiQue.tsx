import { CHU_DE, cauHoiViDuTheoChuDe } from "../ui/luanQue";
import { LUC_THAN } from "../core/const";

/**
 * Chủ đề/Câu hỏi — dùng chung cho cả 2 "Cách khởi quẻ" (Theo thời gian / Gieo đồng xu). Tách
 * theo `project-brain/09-gop-gieo-dong-xu-vao-xem-que.md`, mục 2 (trước đây có 2 bản gần như
 * giống hệt ở `XemQue.tsx` và `GieoDongXu.tsx`).
 */
export function NoiDungHoiQue({
  chuDe,
  onChuDeChange,
  vietTrucTiep,
  onVietTrucTiepChange,
  cauHoi,
  onCauHoiChange,
}: {
  chuDe: string;
  onChuDeChange: (v: string) => void;
  vietTrucTiep: string;
  onVietTrucTiepChange: (v: string) => void;
  cauHoi: string;
  onCauHoiChange: (v: string) => void;
}) {
  return (
    <div className="hang-form">
      <div className="truong">
        <label htmlFor="chude">Chủ đề</label>
        <select id="chude" value={chuDe} onChange={(e) => onChuDeChange(e.target.value)}>
          {CHU_DE.map((c) => (
            <option key={c.nhan} value={c.nhan}>
              {c.nhan}
            </option>
          ))}
          <option value="khac">Khác — chọn trực tiếp Lục Thân</option>
        </select>
      </div>
      {chuDe === "khac" && (
        <div className="truong">
          <label htmlFor="viectt">Lục Thân</label>
          <select id="viectt" value={vietTrucTiep} onChange={(e) => onVietTrucTiepChange(e.target.value)}>
            {LUC_THAN.map((lt) => (
              <option key={lt} value={lt}>
                {lt}
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="truong" style={{ flex: 1 }}>
        <label htmlFor="cauhoi">Câu hỏi (không bắt buộc)</label>
        <input
          id="cauhoi"
          type="text"
          placeholder={`Ví dụ: ${cauHoiViDuTheoChuDe(chuDe)}`}
          value={cauHoi}
          onChange={(e) => onCauHoiChange(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>
    </div>
  );
}
