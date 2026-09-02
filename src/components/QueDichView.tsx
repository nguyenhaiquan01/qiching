import type { QueDich } from "../core/queDich";
import { timNoiDungQue } from "../core/data/noiDungQue";
import { HoverInfo } from "./HoverInfo";
import { DanhSachHaoDich } from "./DanhSachHaoDich";

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
  onXemChiTiet,
}: {
  que: QueDich;
  /** Lục Thân cần nhấn mạnh (tô đậm) — dùng cho tính năng "xem quẻ theo chủ đề". */
  vietNhanManh?: string;
  tieuDe?: string;
  /** Vị trí hào (1-6) cần tô đỏ cưỡng bức — dùng ở quẻ biến để khớp đúng vị trí hào động bên
   * quẻ chính (`que.queBien` của quẻ biến luôn = 0 sau khi biến, không tự tô được), giúp
   * người xem thấy ngay "hào nào động → biến thành hào nào" giữa 2 quẻ (mục 5, "phải làm
   * nổi bật transformation" của `05.1. Chỉnh UI-UX.md`). Nhận mảng khi có nhiều hào động
   * cùng lúc (Coin Casting, `que.queBien` không mang ý nghĩa trong trường hợp đó). */
  noiBatVach?: number | number[];
  /** Bấm vào tên quẻ để xem trang chi tiết đầy đủ (tab "64 Quẻ Kinh Dịch") — nhận
   * `tenQueChuan`. Không truyền thì tên quẻ chỉ hiện hover popup như cũ. */
  onXemChiTiet?: (tenQueChuan: string) => void;
}) {
  const noiDung = timNoiDungQue(que.tenQueDich);

  return (
    <div className="que-dich-cot">
      {tieuDe && <div className="que-dich-cung">{tieuDe}</div>}
      <div className="que-dich-ten">
        {noiDung ? (
          <HoverInfo
            trigger={
              onXemChiTiet ? (
                <button type="button" className="que-dich-ten-link" onClick={() => onXemChiTiet(que.tenQueDich)}>
                  {que.tenQueDich}
                </button>
              ) : (
                que.tenQueDich
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
        ) : (
          que.tenQueDich
        )}
      </div>
      <div className="que-dich-cung">Cung {que.cung}</div>
      <DanhSachHaoDich que={que} noiDung={noiDung} vietNhanManh={vietNhanManh} noiBatVach={noiBatVach} />
    </div>
  );
}
