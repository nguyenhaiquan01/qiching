import type { QueDich } from "../core/queDich";
import type { AmLich } from "../core/lunar";
import { ThuatNgu } from "./ThuatNgu";

/**
 * "CĂN CỨ LUẬN QUẺ" (Section 4 của `05.1. Chỉnh UI-UX.md`) — progressive disclosure (thẻ
 * `<details>` gấp lại mặc định) cho phép người dùng đi từ KẾT LUẬN → CĂN CỨ → DỮ LIỆU GỐC,
 * đúng nguyên tắc "CONCLUSION → EVIDENCE" (mục 4).
 */
export function CanCuLuanQue({
  que,
  amLich,
  dungThan,
  viTriHaoDong,
}: {
  que: QueDich;
  amLich: AmLich;
  dungThan?: string;
  /** Truyền khi quẻ có thể có nhiều hào động cùng lúc (Coin Casting) — mặc định đọc
   * `que.queBien` (đúng 1 hào động, luồng Mai Hoa Dịch Số). */
  viTriHaoDong?: number[];
}) {
  const haoThe = que.hao.find((h) => h.haoThe);
  const haoUng = que.hao.find((h) => h.haoUng);

  return (
    <details className="can-cu">
      <summary>Căn cứ luận quẻ</summary>
      <div className="can-cu-noi-dung">
        <div className="can-cu-dong">
          <span className="can-cu-nhan">
            <ThuatNgu ten="Dụng Thần" hienThi="Dụng Thần" />
          </span>
          <span>{dungThan ?? "(không chọn — xem chung)"}</span>
        </div>
        <div className="can-cu-dong">
          <span className="can-cu-nhan">
            <ThuatNgu ten="Thế" hienThi="Thế" />
          </span>
          <span>{haoThe?.napgiap ?? "—"}</span>
        </div>
        <div className="can-cu-dong">
          <span className="can-cu-nhan">
            <ThuatNgu ten="Ứng" hienThi="Ứng" />
          </span>
          <span>{haoUng?.napgiap ?? "—"}</span>
        </div>
        <div className="can-cu-dong">
          <span className="can-cu-nhan">
            <ThuatNgu ten="Nhật" hienThi="Nhật (ngày)" />
          </span>
          <span>
            {amLich.thienCanNgay} {amLich.diaChiNgay}
          </span>
        </div>
        <div className="can-cu-dong">
          <span className="can-cu-nhan">
            <ThuatNgu ten="Nguyệt" hienThi="Nguyệt (tháng)" />
          </span>
          <span>
            {amLich.thienCanThang} {amLich.diaChiThang}
          </span>
        </div>
        <div className="can-cu-dong">
          <span className="can-cu-nhan">
            <ThuatNgu ten="Hào động" hienThi="Hào động" />
          </span>
          <span>
            {(() => {
              const ds = viTriHaoDong ?? (que.queBien >= 1 && que.queBien <= 6 ? [que.queBien] : []);
              return ds.length > 0 ? `Hào ${ds.join(", ")}` : "Không có";
            })()}
          </span>
        </div>
      </div>
    </details>
  );
}
