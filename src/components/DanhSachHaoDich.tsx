import type { QueDich } from "../core/queDich";
import type { NoiDungQueRow } from "../core/data/noiDungQue";
import { classMauNguHanh } from "../ui/mauNguHanh";
import { vachAm } from "../ui/hinhQue";
import { HoverInfo } from "./HoverInfo";

/**
 * 6 hàng hào của một quẻ dịch (nạp giáp, Lục Thân, Thế/Ứng), vẽ từ hào 6 (trên) xuống hào 1
 * (dưới) theo đúng quy ước truyền thống — rê chuột qua một hào để xem Hào Từ. Tách riêng từ
 * `QueDichView` để dùng chung cho cả khu vực "Xem quẻ" (có ngữ cảnh gieo quẻ, `que.queBien`
 * có thể tô đỏ hào động) lẫn trang tra cứu tĩnh "64 Quẻ Kinh Dịch" (`ChiTietQue`, luôn
 * `queBien = 0`, không có hào động).
 */
export function DanhSachHaoDich({
  que,
  noiDung,
  vietNhanManh,
  noiBatVach,
  anVach,
}: {
  que: QueDich;
  /** Nội dung Hào Từ dùng cho popup hover — không có thì chỉ hiện nạp giáp, không hover được. */
  noiDung?: NoiDungQueRow;
  /** Lục Thân cần nhấn mạnh (tô đậm) — dùng cho tính năng "xem quẻ theo chủ đề". */
  vietNhanManh?: string;
  /** Vị trí hào (1-6) cần tô đỏ cưỡng bức — xem ghi chú ở `QueDichView`. */
  noiBatVach?: number | number[];
  /** Ẩn cột vạch Âm/Dương — dùng khi trang đã vẽ hình quẻ riêng bên cạnh (`ChiTietQue`), tránh
   * lặp lại cùng một thông tin hai lần. */
  anVach?: boolean;
}) {
  return (
    <>
      {[6, 5, 4, 3, 2, 1].map((i) => {
        const hao = que.hao[i];
        const laDong =
          que.queBien === i || (Array.isArray(noiBatVach) ? noiBatVach.includes(i) : noiBatVach === i);
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
            {!anVach && (
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
            )}
            <div className="hao-than">{hao.than}</div>
          </div>
        );
      })}
    </>
  );
}
