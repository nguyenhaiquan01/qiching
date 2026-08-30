import type { QueDich } from "../core/queDich";
import { timNoiDungQue } from "../core/data/noiDungQue";
import { classMauNguHanh } from "../ui/mauNguHanh";
import { vachAm } from "../ui/hinhQue";
import { HoverInfo } from "./HoverInfo";

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
  noiBatVach,
}: {
  que: QueDich;
  /** Lục Thân cần nhấn mạnh (tô đậm) — dùng cho tính năng "xem quẻ theo chủ đề". */
  vietNhanManh?: string;
  tieuDe?: string;
  /** Vị trí hào (1-6) cần tô đỏ cưỡng bức — dùng ở quẻ biến để khớp đúng vị trí hào động bên
   * quẻ chính (`que.queBien` của quẻ biến luôn = 0 sau khi biến, không tự tô được), giúp
   * người xem thấy ngay "hào nào động → biến thành hào nào" giữa 2 quẻ (mục 5, "phải làm
   * nổi bật transformation" của `05.1. Chỉnh UI-UX.md`). */
  noiBatVach?: number;
}) {
  const noiDung = timNoiDungQue(que.tenQueDich);

  return (
    <div className="que-dich-cot">
      {tieuDe && <div className="que-dich-cung">{tieuDe}</div>}
      <div className="que-dich-ten">
        {noiDung ? (
          <HoverInfo trigger={que.tenQueDich}>
            <h4>Giải nghĩa</h4>
            <p>{noiDung.giaiNghia}</p>
            <h4>Dịch</h4>
            <p>{noiDung.dich}</p>
            <h4>Giảng</h4>
            <p>{noiDung.giang}</p>
          </HoverInfo>
        ) : (
          que.tenQueDich
        )}
      </div>
      <div className="que-dich-cung">Cung {que.cung}</div>
      {[6, 5, 4, 3, 2, 1].map((i) => {
        const hao = que.hao[i];
        const laDong = que.queBien === i || noiBatVach === i;
        const daDam = vietNhanManh != null && hao.lucthan === vietNhanManh;
        const haoTu = noiDung?.haoTu.find((h) => h.vach === i);
        const nhan = (
          <>
            <span className={classMauNguHanh(hao.nguhanh)}>{hao.napgiap}</span>
            {hao.haoThe && <span className="huy-hieu">Thế</span>}
            {hao.haoUng && <span className="huy-hieu">Ứng</span>}
          </>
        );
        return (
          <div key={i} className={`hao-hang${laDong ? " dong" : ""}`}>
            <div className="hao-vach">
              {vachAm(que.tenQueThuong, que.tenQueHa, i) ? (
                <>
                  <span className="thanh" />
                  <span className="thanh" />
                </>
              ) : (
                <span className="thanh" />
              )}
            </div>
            <div className="hao-nhan" style={{ fontWeight: daDam ? 700 : undefined }}>
              {haoTu ? (
                <HoverInfo trigger={nhan}>
                  <h4>Hào Từ — {haoTu.nhan}</h4>
                  <p>{haoTu.noiDung}</p>
                </HoverInfo>
              ) : (
                nhan
              )}
            </div>
            <div className="hao-than">{hao.than}</div>
          </div>
        );
      })}
    </div>
  );
}
