import type { QueDich } from "../core/queDich";
import { ThuatNgu } from "./ThuatNgu";
import { haoDongVaDienBien, type DiemHao, type MucDoThuanLoi } from "../ui/luanQue";

/**
 * "LUẬN QUẺ THEO VIỆC ĐANG HỎI" (Section 3 của `05.1. Chỉnh UI-UX.md`) — thay heading chung
 * chung "Giải thích" bằng heading gắn với chủ đề, chỉ hiện khi người dùng đã chọn một việc cụ
 * thể (có Dụng Thần). Ngôn ngữ trong "Gợi ý ứng xử" cố tình dùng "gợi ý"/"có thể" thay vì
 * khẳng định chắc chắn (mục 3, "NO FALSE CERTAINTY").
 */
export function LuanQueTheoViec({
  que,
  dungThan,
  mucDo,
  tomTat,
  diemThuan,
  diemCanLuuY,
  goiY,
  viTriHaoDong,
}: {
  que: QueDich;
  dungThan: string;
  mucDo: MucDoThuanLoi;
  tomTat: string;
  diemThuan: DiemHao[];
  diemCanLuuY: DiemHao[];
  goiY: string;
  /** Truyền khi quẻ có thể có nhiều hào động cùng lúc (Coin Casting) — mặc định đọc
   * `que.queBien` (đúng 1 hào động, luồng Mai Hoa Dịch Số). */
  viTriHaoDong?: number[];
}) {
  const bienDs = haoDongVaDienBien(que, viTriHaoDong);

  return (
    <div className="the">
      <h2>Luận quẻ theo việc đang hỏi</h2>

      <h3 className="luan-que-tieu-de">Tổng quan</h3>
      <p>{tomTat}</p>

      <h3 className="luan-que-tieu-de">
        <ThuatNgu ten="Dụng Thần" hienThi="Dụng Thần" />
      </h3>
      <p>
        Với việc đang hỏi, hệ thống lấy <strong>{dungThan}</strong> làm trọng tâm để luận (điểm số hiện tại:{" "}
        {que.diemLucThan[dungThan]}, xếp mức <strong>{mucDo.nhan}</strong>).
      </p>

      <h3 className="luan-que-tieu-de">Điểm thuận</h3>
      {diemThuan.length === 0 ? (
        <p className="hero-diem-rong">Chưa nổi bật hào nào theo hướng này.</p>
      ) : (
        <ul className="hero-diem-list">
          {diemThuan.map((d) => (
            <li key={d.lucThan}>
              ✓ Hào {d.vachs.join(", ")} — {d.lucThan}: {d.yNghia}
            </li>
          ))}
        </ul>
      )}

      <h3 className="luan-que-tieu-de">Điểm trở ngại</h3>
      {diemCanLuuY.length === 0 ? (
        <p className="hero-diem-rong">Chưa nổi bật hào nào theo hướng này.</p>
      ) : (
        <ul className="hero-diem-list">
          {diemCanLuuY.map((d) => (
            <li key={d.lucThan}>
              △ Hào {d.vachs.join(", ")} — {d.lucThan}: {d.yNghia}
            </li>
          ))}
        </ul>
      )}

      <h3 className="luan-que-tieu-de">
        <ThuatNgu ten="Hào động" hienThi="Hào động & diễn biến" />
      </h3>
      {bienDs.length > 0 ? (
        bienDs.map((bien) => (
          <p className="hao-dong-dien-bien" key={bien.vach}>
            Hào {bien.vach}: <strong>{bien.truoc}</strong>
            <span className="hero-mui-ten" aria-hidden>
              →
            </span>
            <strong>{bien.sau}</strong>
          </p>
        ))
      ) : (
        <p className="hero-diem-rong">Quẻ này không có hào động.</p>
      )}

      <h3 className="luan-que-tieu-de">Gợi ý ứng xử</h3>
      <p>{goiY}</p>
    </div>
  );
}
