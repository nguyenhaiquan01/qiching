import { useMemo, useState } from "react";
import { QueDich } from "../core/queDich";
import { tinhAmLich } from "../core/lunar";
import { AmLichView } from "../components/AmLichView";
import { QueDichView } from "../components/QueDichView";
import { giaiThichQue } from "../ui/giaiThich";
import { luuQueInfo } from "../core/storage";
import { LUC_THAN } from "../core/const";

function denChuoiNgay(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function denChuoiGio(d: Date): string {
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${h}:${m}`;
}

/** Trang chủ — port từ frmKinhDich: chọn thời điểm, xem quẻ + luận giải. */
export function XemQue({ thoiDiemBanDau }: { thoiDiemBanDau?: Date }) {
  const gio = thoiDiemBanDau ?? new Date();
  const [ngayStr, setNgayStr] = useState(denChuoiNgay(gio));
  const [gioStr, setGioStr] = useState(denChuoiGio(gio));
  const [cuocDoi, setCuocDoi] = useState(false);
  const [viec, setViec] = useState<string>("");
  const [binhChu, setBinhChu] = useState("");
  const [daLuu, setDaLuu] = useState(false);

  const thoiDiem = useMemo(() => {
    const [y, m, d] = ngayStr.split("-").map(Number);
    const [h, min] = gioStr.split(":").map(Number);
    return new Date(y, m - 1, d, h, min, 0);
  }, [ngayStr, gioStr]);

  const { que, loi } = useMemo(() => {
    try {
      const q = cuocDoi ? new QueDich(thoiDiem, true) : new QueDich(thoiDiem);
      q.giaiQue();
      return { que: q, loi: null as string | null };
    } catch (e) {
      return { que: null, loi: e instanceof Error ? e.message : String(e) };
    }
  }, [thoiDiem, cuocDoi]);
  const amLich = useMemo(() => tinhAmLich(thoiDiem), [thoiDiem]);

  const luuLai = () => {
    luuQueInfo({ time: thoiDiem, binhchu: binhChu });
    setDaLuu(true);
    setTimeout(() => setDaLuu(false), 2000);
  };

  return (
    <div>
      <div className="the khong-in">
        <h2>Thời điểm xem quẻ</h2>
        <div className="hang-form">
          <div className="truong">
            <label htmlFor="ngay">Ngày</label>
            <input id="ngay" type="date" value={ngayStr} onChange={(e) => setNgayStr(e.target.value)} />
          </div>
          <div className="truong">
            <label htmlFor="gio">Giờ</label>
            <input id="gio" type="time" value={gioStr} onChange={(e) => setGioStr(e.target.value)} />
          </div>
          <div className="truong">
            <label htmlFor="viec">Xem theo việc</label>
            <select id="viec" value={viec} onChange={(e) => setViec(e.target.value)}>
              <option value="">— Xem chung —</option>
              {LUC_THAN.map((lt) => (
                <option key={lt} value={lt}>
                  {lt}
                </option>
              ))}
            </select>
          </div>
          <label className="truong" style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <input type="checkbox" checked={cuocDoi} onChange={(e) => setCuocDoi(e.target.checked)} />
            Quẻ Cuộc Đời
          </label>
          <button className="nut phu" type="button" onClick={() => window.print()}>
            In
          </button>
        </div>
      </div>

      {loi && (
        <div className="the">
          <p style={{ color: "var(--danger)" }}>Không an được quẻ: {loi}</p>
        </div>
      )}

      {que && (
        <>
          <div className="the">
            <h2>Lịch âm</h2>
            <AmLichView amLich={amLich} />
          </div>

          <div className="the">
            <h2>Quẻ dịch</h2>
            <div className="que-dich-view">
              <QueDichView que={que} vietNhanManh={viec || undefined} tieuDe="Quẻ chính" />
              {que.queDichBien && <QueDichView que={que.queDichBien} tieuDe="Quẻ biến" />}
            </div>
          </div>

          <div className="the">
            <h2>Điểm vượng suy Lục Thân</h2>
            <div className="diem-luc-than">
              {LUC_THAN.map((lt) => (
                <div className="o" key={lt} style={{ fontWeight: viec === lt ? 700 : undefined }}>
                  <span className="nhan">{lt}</span>
                  <span className="diem">{que.diemLucThan[lt]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="the">
            <h2>Giải thích</h2>
            <p className="giai-thich">{giaiThichQue(que)}</p>
          </div>

          <div className="the khong-in">
            <h2>Lưu quẻ này</h2>
            <div className="hang-form">
              <div className="truong" style={{ flex: 1 }}>
                <label htmlFor="binhchu">Bình chú</label>
                <input
                  id="binhchu"
                  type="text"
                  placeholder="Ghi chú cho lần xem quẻ này..."
                  value={binhChu}
                  onChange={(e) => setBinhChu(e.target.value)}
                  style={{ width: "100%" }}
                />
              </div>
              <button className="nut" type="button" onClick={luuLai}>
                {daLuu ? "Đã lưu ✓" : "Lưu quẻ"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
