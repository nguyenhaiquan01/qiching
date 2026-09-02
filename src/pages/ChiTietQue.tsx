import { useEffect } from "react";
import { HinhQue } from "../components/HinhQue";
import type { NoiDungQueRow } from "../core/data/noiDungQue";

/** Trang chi tiết một quẻ — tương tự cấu trúc trang cohoc.net/&lt;ten-que&gt;.html: đồ hình,
 * Giải nghĩa, Dịch, Giảng, Hào Từ đầy đủ 6 hào, Dụng Cửu/Lục và Chú Thích (nếu có). */
export function ChiTietQue({
  que,
  quaTruoc,
  quaSau,
  onChon,
  onVeDanhSach,
}: {
  que: NoiDungQueRow;
  quaTruoc?: NoiDungQueRow;
  quaSau?: NoiDungQueRow;
  onChon: (que: NoiDungQueRow) => void;
  onVeDanhSach: () => void;
}) {
  // Cuộn lên đầu trang mỗi khi chuyển sang xem một quẻ khác — tránh vẫn ở vị trí cuộn cũ
  // (ví dụ khi bấm tên quẻ từ trang Xem quẻ, hoặc bấm quẻ trước/sau).
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [que.tenQueChuan]);

  return (
    <div>
      <div className="hang-form khong-in" style={{ marginBottom: 12 }}>
        <button className="nut phu" type="button" onClick={onVeDanhSach}>
          ← Danh sách 64 quẻ
        </button>
        {quaTruoc && (
          <button className="nut phu" type="button" onClick={() => onChon(quaTruoc)}>
            ‹ {quaTruoc.soThuTu}. {quaTruoc.tenQue}
          </button>
        )}
        {quaSau && (
          <button className="nut phu" type="button" onClick={() => onChon(quaSau)}>
            {quaSau.soThuTu}. {quaSau.tenQue} ›
          </button>
        )}
      </div>

      <div className="the">
        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>
          <HinhQue queThuong={que.queThuong} queHa={que.queHa} />
          <div>
            <div className="que-dich-cung">Quẻ số {que.soThuTu}</div>
            <div className="que-dich-ten" style={{ fontSize: "1.3rem" }}>
              {que.tenQue}
            </div>
            <div className="que-dich-cung">{que.tenQueChuan}</div>
            <div className="que-dich-cung">
              Nội quái: {que.queHa} — Ngoại quái: {que.queThuong} — Cung {que.cung}
            </div>
          </div>
        </div>
      </div>

      <div className="the">
        <h2>Giải nghĩa</h2>
        <p className="giai-thich">{que.giaiNghia}</p>
      </div>

      <div className="the">
        <h2>Thoán Từ</h2>
        {que.thoanTu.hanTu && <p className="han-tu">{que.thoanTu.hanTu}</p>}
        <p className="giai-thich">{que.thoanTu.dich}</p>
      </div>

      <div className="the">
        <h2>Giảng (Thoán Từ)</h2>
        <p className="giai-thich">{que.thoanTu.giang}</p>
      </div>

      <div className="the">
        <h2>Hào Từ</h2>
        {que.haoTu
          .slice()
          .sort((a, b) => a.vach - b.vach)
          .map((h) => (
            <div key={h.vach} className="hao-tu-chi-tiet">
              <h3>
                Hào {h.vach} — {h.nhan}
              </h3>
              <p className="giai-thich">{h.noiDung}</p>
            </div>
          ))}
      </div>

      {que.dungCuu && (
        <div className="the">
          <h2>Dụng Cửu / Dụng Lục</h2>
          <p className="giai-thich">{que.dungCuu}</p>
        </div>
      )}

      {que.chuThich && (
        <div className="the">
          <h2>Chú Thích</h2>
          <p className="giai-thich">{que.chuThich}</p>
        </div>
      )}

      {que.phuLuc && (
        <div className="the">
          <h2>Phụ Lục</h2>
          <p className="giai-thich">{que.phuLuc}</p>
        </div>
      )}

      <p className="que-dich-cung khong-in">
        Nguồn:{" "}
        <a href={que.nguon} target="_blank" rel="noreferrer">
          {que.nguon}
        </a>
      </p>
    </div>
  );
}
