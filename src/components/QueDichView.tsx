import type { QueDich } from "../core/queDich";
import { QUE_KINH_DICH } from "../core/data/queKinhDich";
import { classMauNguHanh } from "../ui/mauNguHanh";

/**
 * Hiển thị 6 hào của một quẻ dịch, vẽ từ hào 6 (trên) xuống hào 1 (dưới) theo đúng quy ước
 * truyền thống. Hào động (`que.queBien`, 1-6, 0 = không có — ví dụ khi hiển thị quẻ biến)
 * được tô đỏ, giữ đúng hành vi bản gốc (frmKinhDich.HienThiThongTinQue dùng `quedich.quebien`
 * để bật `pbHaoDongN`, KHÔNG dùng field `hao[i].haoDong` — field đó không được gán ở cả bản
 * gốc lẫn bản port này).
 */
export function QueDichView({
  que,
  vietNhanManh,
  tieuDe,
}: {
  que: QueDich;
  /** Lục Thân cần nhấn mạnh (tô đậm) — dùng cho tính năng "xem quẻ theo chủ đề". */
  vietNhanManh?: string;
  tieuDe?: string;
}) {
  return (
    <div className="que-dich-cot">
      {tieuDe && <div className="que-dich-cung">{tieuDe}</div>}
      <div className="que-dich-ten">{que.tenQueDich}</div>
      <div className="que-dich-cung">Cung {que.cung}</div>
      {[6, 5, 4, 3, 2, 1].map((i) => {
        const hao = que.hao[i];
        const laDong = que.queBien === i;
        const daDam = vietNhanManh != null && hao.lucthan === vietNhanManh;
        return (
          <div key={i} className={`hao-hang${laDong ? " dong" : ""}`}>
            <div className="hao-vach">
              {isAm(que, i) ? (
                <>
                  <span className="thanh" />
                  <span className="thanh" />
                </>
              ) : (
                <span className="thanh" />
              )}
            </div>
            <div
              className="hao-nhan"
              style={{ fontWeight: daDam ? 700 : undefined }}
            >
              <span className={classMauNguHanh(hao.nguhanh)}>{hao.napgiap}</span>
              {hao.haoThe && <span className="huy-hieu">Thế</span>}
              {hao.haoUng && <span className="huy-hieu">Ứng</span>}
            </div>
            <div className="hao-than">{hao.than}</div>
          </div>
        );
      })}
    </div>
  );
}

/** Hào âm/dương suy từ chính quẻ đơn Thượng/Hạ tương ứng — chỉ dùng để vẽ vạch liền/đứt
 * (port từ frmKinhDich.HienThiThongTinQue: dùng QueKinhDichRow.Hao1/2/3 của quẻ đơn Thượng
 * cho hào 4/5/6, quẻ đơn Hạ cho hào 1/2/3). */
function isAm(que: QueDich, i: number): boolean {
  const row =
    i >= 4
      ? QUE_KINH_DICH.find((r) => r.tenQue === que.tenQueThuong)
      : QUE_KINH_DICH.find((r) => r.tenQue === que.tenQueHa);
  if (!row) return false;
  const haoTrongQueDon = i >= 4 ? i - 3 : i;
  const gia = haoTrongQueDon === 1 ? row.hao1 : haoTrongQueDon === 2 ? row.hao2 : row.hao3;
  return gia === 0;
}
