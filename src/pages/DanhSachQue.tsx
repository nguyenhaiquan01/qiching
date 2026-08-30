import { HinhQue } from "../components/HinhQue";
import type { NoiDungQueRow } from "../core/data/noiDungQue";

/** Danh sách 64 quẻ theo đúng thứ tự (tương tự cohoc.net/64-que-dich.html) — bấm vào một
 * quẻ để xem trang chi tiết. */
export function DanhSachQue({
  danhSach,
  onChon,
}: {
  danhSach: NoiDungQueRow[];
  onChon: (que: NoiDungQueRow) => void;
}) {
  return (
    <div className="the">
      <h2>64 Quẻ Kinh Dịch</h2>
      <div className="luoi-64-que">
        {danhSach.map((q) => (
          <button key={q.tenQueChuan} type="button" className="the-que" onClick={() => onChon(q)}>
            <HinhQue queThuong={q.queThuong} queHa={q.queHa} cachDong="gon" />
            <div>
              <div className="the-que-so">Quẻ {q.soThuTu}</div>
              <div className="the-que-ten">{q.tenQue}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
