import { Link } from "react-router";
import { HinhQue } from "../components/HinhQue";
import { HoverInfo } from "../components/HoverInfo";
import type { NoiDungQueRow } from "../core/data/noiDungQue";
import { duongDanQue } from "../ui/duongDan";

/** Danh sách 64 quẻ theo đúng thứ tự (tương tự cohoc.net/64-que-dich.html) — bấm vào một
 * quẻ để xem trang chi tiết, rê chuột vào ô quẻ để xem nhanh Giải nghĩa + Thoán Từ (cùng cơ
 * chế `HoverInfo` dùng ở phần Lập Quẻ/Kết quả).
 *
 * Mỗi ô là `<Link>` (tức `<a href>` thật) chứ không phải `<button>`: đây là 64 đường đi duy
 * nhất từ trang danh sách tới từng trang quẻ, không có link thật thì bot không bò tới được —
 * xem `project-brain/10-ke-hoach-seo.md` Giai đoạn A. */
export function DanhSachQue({ danhSach }: { danhSach: NoiDungQueRow[] }) {
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
              <Link className="the-que" to={duongDanQue(q)}>
                <HinhQue queThuong={q.queThuong} queHa={q.queHa} cachDong="gon" />
                <div>
                  <div className="the-que-so">Quẻ {q.soThuTu}</div>
                  <div className="the-que-ten">{q.tenQue}</div>
                </div>
              </Link>
            }
          >
            <h4>Giải nghĩa</h4>
            <p>{q.giaiNghia}</p>
            <h4>Thoán Từ</h4>
            {q.thoanTu.hanTu && <p className="han-tu">{q.thoanTu.hanTu}</p>}
            <p>{q.thoanTu.dich}</p>
          </HoverInfo>
        ))}
      </div>
    </div>
  );
}
