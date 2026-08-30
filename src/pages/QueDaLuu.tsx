import { useRef, useState } from "react";
import {
  taiDanhSachQueDaLuu,
  xoaQueInfo,
  exportQueInfoJSON,
  importQueInfoJSON,
} from "../core/storage";
import type { QueInfo } from "../core/types";

/** Trang "Quẻ đã lưu" — port từ frmLoadQue, đọc/ghi localStorage thay cho bảng InfoQue. */
export function QueDaLuu({ onXemLai }: { onXemLai: (time: Date) => void }) {
  const [danhSach, setDanhSach] = useState<QueInfo[]>(() => taiDanhSachQueDaLuu());
  const [loi, setLoi] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lamMoi = () => setDanhSach(taiDanhSachQueDaLuu());

  const xoa = (time: Date) => {
    xoaQueInfo(time);
    lamMoi();
  };

  const xuatFile = () => {
    const json = exportQueInfoJSON();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `qiching-que-da-luu-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const nhapFile = (file: File) => {
    setLoi(null);
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importQueInfoJSON(String(reader.result));
        lamMoi();
      } catch (e) {
        setLoi(e instanceof Error ? e.message : String(e));
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <div className="the khong-in">
        <h2>Quẻ đã lưu</h2>
        <div className="hang-form">
          <button className="nut phu" type="button" onClick={xuatFile} disabled={danhSach.length === 0}>
            Xuất ra file JSON
          </button>
          <button className="nut phu" type="button" onClick={() => fileInputRef.current?.click()}>
            Nhập từ file JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            style={{ display: "none" }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) nhapFile(file);
              e.target.value = "";
            }}
          />
        </div>
        {loi && <p style={{ color: "var(--danger)" }}>Nhập thất bại: {loi}</p>}
      </div>

      <div className="the">
        {danhSach.length === 0 ? (
          <p className="trong-rong">Chưa lưu quẻ nào — sang trang "Xem quẻ" và bấm "Lưu quẻ".</p>
        ) : (
          <div className="danh-sach-luu">
            {danhSach.map((info) => (
              <div className="dong-luu" key={info.time.toISOString()}>
                <span className="thoi-diem">{info.time.toLocaleString("vi-VN")}</span>
                <span className="binh-chu">{info.binhchu || "(không có ghi chú)"}</span>
                <button className="nut phu" type="button" onClick={() => onXemLai(info.time)}>
                  Xem lại
                </button>
                <button className="nut nguy-hiem" type="button" onClick={() => xoa(info.time)}>
                  Xoá
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
