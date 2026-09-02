import { HinhQue } from "../components/HinhQue";
import { HoverInfo } from "../components/HoverInfo";
import type { NoiDungQueRow } from "../core/data/noiDungQue";

/** Danh sách 64 quẻ theo đúng thứ tự (tương tự cohoc.net/64-que-dich.html) — bấm vào một
 * quẻ để xem trang chi tiết, rê chuột vào ô quẻ để xem nhanh Giải nghĩa (cùng cơ chế
 * `HoverInfo` dùng ở phần Lập Quẻ/Kết quả). */
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
          <HoverInfo
            key={q.tenQueChuan}
            wrapperClassName="the-que-hover-boc"
            triggerClassName="the-que-hover-trigger"
            trigger={
              <button type="button" className="the-que" onClick={() => onChon(q)}>
                <HinhQue queThuong={q.queThuong} queHa={q.queHa} cachDong="gon" />
                <div>
                  <div className="the-que-so">Quẻ {q.soThuTu}</div>
                  <div className="the-que-ten">{q.tenQue}</div>
                </div>
              </button>
            }
          >
            <h4>Giải nghĩa</h4>
            <p>{q.giaiNghia}</p>
          </HoverInfo>
        ))}
      </div>
    </div>
  );
}
