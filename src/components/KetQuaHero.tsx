import type { QueDich } from "../core/queDich";
import type { DiemHao, MucDoThuanLoi } from "../ui/luanQue";

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
}: {
  que: QueDich;
  /** null khi không có Dụng Thần cụ thể (Xem tổng quan / Quẻ Cuộc Đời) — không hiển thị mức
   * độ thuận lợi giả định trong trường hợp đó, tránh gán một kết luận cho một việc không có
   * thật (đúng nguyên tắc "NO FALSE CERTAINTY" của brief). */
  mucDo: MucDoThuanLoi | null;
  tomTat: string;
  diemThuan: DiemHao[];
  diemCanLuuY: DiemHao[];
}) {
  return (
    <div className="the hero-ket-qua">
      <div className="hero-nhan">Kết quả</div>
      <div className="hero-que">
        <span className="hero-que-ten">{que.tenQueDich}</span>
        <span className="hero-mui-ten" aria-hidden>
          ↓
        </span>
        <span className="hero-que-ten hero-que-bien">{que.queDichBien?.tenQueDich}</span>
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
