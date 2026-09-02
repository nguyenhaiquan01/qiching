import type { QueDich } from "../core/queDich";
import type { DiemHao, MucDoThuanLoi } from "../ui/luanQue";
import { timNoiDungQue } from "../core/data/noiDungQue";
import { HoverInfo } from "./HoverInfo";

/**
 * Khu vực "KẾT QUẢ" (Section 2 của `05.1. Chỉnh UI-UX.md`) — visual hierarchy cao nhất của
 * trang: quẻ chính → quẻ biến, mức độ thuận lợi (không phải % xác suất giả), tóm tắt, điểm
 * thuận/cần lưu ý. Màu badge dùng token trạng thái UX (success/warning/danger), tách biệt
 * khỏi màu phân loại Ngũ Hành dùng ở phần Lục Hào chi tiết (mục 7 của brief).
 */
export function KetQuaHero({
  que,
  mucDo,
  tomTat,
  diemThuan,
  diemCanLuuY,
  onXemChiTiet,
}: {
  que: QueDich;
  /** null khi không có Dụng Thần cụ thể (Xem tổng quan / Quẻ Cuộc Đời) — không hiển thị mức
   * độ thuận lợi giả định trong trường hợp đó, tránh gán một kết luận cho một việc không có
   * thật (đúng nguyên tắc "NO FALSE CERTAINTY" của brief). */
  mucDo: MucDoThuanLoi | null;
  tomTat: string;
  diemThuan: DiemHao[];
  diemCanLuuY: DiemHao[];
  /** Bấm vào tên quẻ chính/quẻ biến để xem trang chi tiết đầy đủ (tab "64 Quẻ Kinh Dịch"),
   * hover để xem nhanh Giải nghĩa/Dịch/Giảng — cùng cơ chế với `QueDichView` ở phần "Chi tiết
   * Lục Hào" bên dưới. */
  onXemChiTiet?: (tenQueChuan: string) => void;
}) {
  return (
    <div className="the hero-ket-qua">
      <div className="hero-nhan">Kết quả</div>
      <div className="hero-que">
        <span className="hero-que-ten">
          <TenQueVoiHover tenQueDich={que.tenQueDich} onXemChiTiet={onXemChiTiet} />
        </span>
        <span className="hero-mui-ten" aria-hidden>
          ↓
        </span>
        <span className="hero-que-ten hero-que-bien">
          {que.queDichBien && (
            <TenQueVoiHover tenQueDich={que.queDichBien.tenQueDich} onXemChiTiet={onXemChiTiet} />
          )}
        </span>
      </div>
      {mucDo && <span className={`hero-badge hero-badge-${mucDo.muc}`}>{mucDo.nhan}</span>}
      <p className="hero-tom-tat">{tomTat}</p>

      <div className="hero-diem-hai-cot">
        <div>
          <h4 className="hero-diem-tieu-de thuan">Điểm thuận</h4>
          {diemThuan.length === 0 ? (
            <p className="hero-diem-rong">Chưa nổi bật hào nào theo hướng này.</p>
          ) : (
            <ul className="hero-diem-list">
              {diemThuan.slice(0, 3).map((d) => (
                <li key={d.lucThan}>
                  ✓ {d.lucThan} <span className="que-dich-cung">— {d.yNghia}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="hero-diem-tieu-de can-luu-y">Cần lưu ý</h4>
          {diemCanLuuY.length === 0 ? (
            <p className="hero-diem-rong">Chưa nổi bật hào nào theo hướng này.</p>
          ) : (
            <ul className="hero-diem-list">
              {diemCanLuuY.slice(0, 3).map((d) => (
                <li key={d.lucThan}>
                  △ {d.lucThan} <span className="que-dich-cung">— {d.yNghia}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

/** Tên quẻ + hover popup Giải nghĩa/Dịch/Giảng + (tuỳ chọn) bấm để xem trang chi tiết — trích
 * từ `QueDichView`, dùng chung logic cho cả quẻ chính lẫn quẻ biến ở khu vực Kết quả. */
function TenQueVoiHover({
  tenQueDich,
  onXemChiTiet,
}: {
  tenQueDich: string;
  onXemChiTiet?: (tenQueChuan: string) => void;
}) {
  const noiDung = timNoiDungQue(tenQueDich);
  if (!noiDung) return <>{tenQueDich}</>;

  return (
    <HoverInfo
      trigger={
        onXemChiTiet ? (
          <button type="button" className="que-dich-ten-link" onClick={() => onXemChiTiet(tenQueDich)}>
            {tenQueDich}
          </button>
        ) : (
          tenQueDich
        )
      }
    >
      <h4>Giải nghĩa</h4>
      <p>{noiDung.giaiNghia}</p>
      <h4>Thoán Từ</h4>
      {noiDung.thoanTu.hanTu && <p className="han-tu">{noiDung.thoanTu.hanTu}</p>}
      <p>{noiDung.thoanTu.dich}</p>
      <h4>Giảng (Thoán Từ)</h4>
      <p>{noiDung.thoanTu.giang}</p>
    </HoverInfo>
  );
}
