import { useEffect, useRef, useState } from "react";
import { LUC_THAN, VUONG, HUNG, ThoiDiem } from "../core/const";
import type { DongKetQua, ThongDiepTuWorker, YeuCauTimNgayTot } from "../core/timNgayTot.worker";

function themNgay(ngay: string, soNgay: number): string {
  const d = new Date(ngay);
  d.setDate(d.getDate() + soNgay);
  return d.toISOString().slice(0, 10);
}

/** Trang "Tìm ngày tốt" — port từ frmTimNgayTotTheoQueDich, chạy vòng quét trong Web Worker. */
export function TimNgayTot() {
  const homNay = new Date().toISOString().slice(0, 10);
  const [ngayBatDau, setNgayBatDau] = useState(homNay);
  const [ngayKetThuc, setNgayKetThuc] = useState(themNgay(homNay, 15));
  const [gioHangNgay, setGioHangNgay] = useState("12:00");
  const [viec, setViec] = useState<string>(LUC_THAN[0]);

  const [dangChay, setDangChay] = useState(false);
  const [tienDo, setTienDo] = useState({ daXuLy: 0, uocLuongTong: 1 });
  const [ketQua, setKetQua] = useState<DongKetQua[]>([]);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => () => workerRef.current?.terminate(), []);

  const chayQuet = (thoiDiem: ThoiDiem, nguong: number, batDau: Date, ketThuc: Date) => {
    workerRef.current?.terminate();
    setKetQua([]);
    setTienDo({ daXuLy: 0, uocLuongTong: 1 });
    setDangChay(true);

    const worker = new Worker(new URL("../core/timNgayTot.worker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent<ThongDiepTuWorker>) => {
      const msg = e.data;
      if (msg.type === "tienDo") {
        setTienDo({ daXuLy: msg.daXuLy, uocLuongTong: msg.uocLuongTong });
      } else if (msg.type === "ketQua") {
        setKetQua((cu) => [...cu, msg.dong]);
      } else if (msg.type === "xong") {
        setDangChay(false);
      }
    };

    const yeuCau: YeuCauTimNgayTot = {
      ngayBatDauIso: batDau.toISOString(),
      ngayKetThucIso: ketThuc.toISOString(),
      viec,
      nguong,
      thoiDiem,
    };
    worker.postMessage(yeuCau);
  };

  const timNgayTotClick = () => {
    chayQuet(ThoiDiem.HaiGio, VUONG, new Date(`${ngayBatDau}T00:00:00`), new Date(`${ngayKetThuc}T00:00:00`));
  };

  const hangNgayClick = () => {
    chayQuet(
      ThoiDiem.Ngay,
      HUNG,
      new Date(`${ngayBatDau}T${gioHangNgay}:00`),
      new Date(`${ngayKetThuc}T${gioHangNgay}:00`),
    );
  };

  const dungLai = () => {
    workerRef.current?.terminate();
    setDangChay(false);
  };

  const phanTramTienDo = Math.min(100, Math.round((tienDo.daXuLy / tienDo.uocLuongTong) * 100));

  return (
    <div>
      <div className="the">
        <h2>Tìm ngày tốt theo quẻ dịch</h2>
        <div className="hang-form">
          <div className="truong">
            <label htmlFor="tu-ngay">Từ ngày</label>
            <input id="tu-ngay" type="date" value={ngayBatDau} onChange={(e) => setNgayBatDau(e.target.value)} />
          </div>
          <div className="truong">
            <label htmlFor="den-ngay">Đến ngày</label>
            <input id="den-ngay" type="date" value={ngayKetThuc} onChange={(e) => setNgayKetThuc(e.target.value)} />
          </div>
          <div className="truong">
            <label htmlFor="viec">Việc</label>
            <select id="viec" value={viec} onChange={(e) => setViec(e.target.value)}>
              {LUC_THAN.map((lt) => (
                <option key={lt} value={lt}>
                  {lt}
                </option>
              ))}
            </select>
          </div>
          <button className="nut" type="button" disabled={dangChay} onClick={timNgayTotClick}>
            Tìm ngày tốt (quét 2 giờ/lần)
          </button>
        </div>

        <div className="hang-form" style={{ marginTop: 12 }}>
          <div className="truong">
            <label htmlFor="gio-hang-ngay">Giờ trong ngày</label>
            <input
              id="gio-hang-ngay"
              type="time"
              value={gioHangNgay}
              onChange={(e) => setGioHangNgay(e.target.value)}
            />
          </div>
          <button className="nut phu" type="button" disabled={dangChay} onClick={hangNgayClick}>
            Hàng ngày (ngưỡng Hung)
          </button>
          {dangChay && (
            <button className="nut nguy-hiem" type="button" onClick={dungLai}>
              Dừng
            </button>
          )}
        </div>

        {dangChay && (
          <div className="thanh-tien-do">
            <div className="lap" style={{ width: `${phanTramTienDo}%` }} />
          </div>
        )}
      </div>

      <div className="the">
        <h2>Kết quả ({ketQua.length})</h2>
        {ketQua.length === 0 ? (
          <p className="trong-rong">{dangChay ? "Đang quét..." : "Chưa có kết quả — bấm một trong hai nút quét ở trên."}</p>
        ) : (
          <div className="bang-ket-qua-boc">
            <table className="bang-ket-qua">
              <thead>
                <tr>
                  <th>Ngày giờ</th>
                  <th>Quẻ dịch</th>
                  <th>Quẻ biến</th>
                  <th>{viec}</th>
                  {LUC_THAN.map((lt) => (
                    <th key={lt}>{lt}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ketQua.map((r) => (
                  <tr key={r.thoiGianIso}>
                    <td>{new Date(r.thoiGianIso).toLocaleString("vi-VN")}</td>
                    <td>{r.tenQueDich}</td>
                    <td>{r.tenQueBien}</td>
                    <td>
                      <strong>{r.diemViec}</strong>
                    </td>
                    {LUC_THAN.map((lt) => (
                      <td key={lt}>{r.diemLucThan[lt]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
