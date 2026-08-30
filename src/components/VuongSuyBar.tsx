import { LUC_THAN } from "../core/const";
import { ThuatNgu } from "./ThuatNgu";

/** Thang quy đổi độ dài thanh — điểm số Lục Thân trong thực tế thường nằm trong khoảng
 * này (cộng/trừ qua tối đa vài lượt so sánh sinh/khắc); dùng để chuẩn hoá độ dài thanh,
 * KHÔNG phải một ngưỡng nghiệp vụ. */
const THANG_TOI_DA = 8;

/**
 * Trực quan hoá điểm vượng suy Lục Thân dạng thanh ngang phân cực quanh mốc 0 (mục 8 của
 * `05.1. Chỉnh UI-UX.md`) — thay cho bảng số đơn thuần. Màu thanh dùng token trạng thái UX
 * (success/danger), KHÔNG dùng màu Ngũ Hành — tránh xung đột "Hỏa=đỏ" với "đỏ=xấu" (mục 7).
 */
export function VuongSuyBar({
  diemLucThan,
  vietNhanManh,
}: {
  diemLucThan: Record<string, number>;
  vietNhanManh?: string;
}) {
  return (
    <div>
      <div className="vuong-suy-boc">
        {LUC_THAN.map((lt) => {
          const diem = diemLucThan[lt];
          const tiLe = Math.min(1, Math.abs(diem) / THANG_TOI_DA) * 50;
          return (
            <div className="vuong-suy-hang" key={lt} style={{ fontWeight: vietNhanManh === lt ? 700 : undefined }}>
              <span className="vuong-suy-nhan">{lt}</span>
              <span className="vuong-suy-truc">
                <span className="mid" />
                <span
                  className={`vuong-suy-thanh ${diem >= 0 ? "duong" : "am"}`}
                  style={diem >= 0 ? { left: "50%", width: `${tiLe}%` } : { right: "50%", width: `${tiLe}%` }}
                />
              </span>
              <span className="vuong-suy-diem">{diem}</span>
            </div>
          );
        })}
      </div>
      <p className="ghi-chu-vuong-suy">
        <ThuatNgu ten="Vượng" /> không đồng nghĩa với tốt, <ThuatNgu ten="Suy" /> không đồng nghĩa với xấu — ý nghĩa
        phụ thuộc vào việc đang hỏi và vai trò của từng Lục Thân trong quẻ.
      </p>
    </div>
  );
}
