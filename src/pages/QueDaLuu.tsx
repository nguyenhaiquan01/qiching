import { useRef, useState } from "react";
import {
  taiDanhSachQueDaLuu,
  xoaQueInfo,
  exportQueInfoJSON,
  importQueInfoJSON,
} from "../core/storage";
import { taiDanhSachGieoQue, xoaGieoQue, type QueDaGieoDaLuu } from "../core/coinCasting/storage";
import type { QueInfo } from "../core/types";

type DongDaLuu =
  | { loai: "THEO_THOI_GIAN"; thoiDiem: number; info: QueInfo }
  | { loai: "GIEO_DONG_XU"; thoiDiem: number; info: QueDaGieoDaLuu };

/**
 * Trang "Quẻ đã lưu" — port từ frmLoadQue, đọc/ghi localStorage thay cho bảng InfoQue. Gộp
 * chung cả 2 kho lưu trữ (Theo Thời Gian + Gieo Đồng Xu) thành 1 danh sách — quyết định #4,
 * `project-brain/09-gop-gieo-dong-xu-vao-xem-que.md`. Chỉ gộp ở tầng đọc/hiển thị; 2 hàm lưu/
 * tải gốc (`core/storage.ts`, `core/coinCasting/storage.ts`) giữ nguyên, không ép chung schema.
 */
export function QueDaLuu({
  onXemLaiTheoThoiGian,
  onXemLaiGieoDongXu,
}: {
  onXemLaiTheoThoiGian: (time: Date) => void;
  onXemLaiGieoDongXu: (gieoQue: QueDaGieoDaLuu) => void;
}) {
  const [dsThoiGian, setDsThoiGian] = useState<QueInfo[]>(() => taiDanhSachQueDaLuu());
  const [dsGieoDongXu, setDsGieoDongXu] = useState<QueDaGieoDaLuu[]>(() => taiDanhSachGieoQue());
  const [loi, setLoi] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const lamMoi = () => {
    setDsThoiGian(taiDanhSachQueDaLuu());
    setDsGieoDongXu(taiDanhSachGieoQue());
  };

  const xoaTheoThoiGian = (time: Date) => {
    xoaQueInfo(time);
    setDsThoiGian(taiDanhSachQueDaLuu());
  };

  const xoaGieoDongXu = (createdAt: string) => {
    xoaGieoQue(createdAt);
    setDsGieoDongXu(taiDanhSachGieoQue());
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

  const danhSachGop: DongDaLuu[] = [
    ...dsThoiGian.map((info) => ({ loai: "THEO_THOI_GIAN" as const, thoiDiem: info.time.getTime(), info })),
    ...dsGieoDongXu.map((info) => ({
      loai: "GIEO_DONG_XU" as const,
      thoiDiem: new Date(info.createdAt).getTime(),
      info,
    })),
  ].sort((a, b) => b.thoiDiem - a.thoiDiem);

  return (
    <div>
      <div className="the khong-in">
        <h2>Quẻ đã lưu</h2>
        <div className="hang-form">
          <button className="nut phu" type="button" onClick={xuatFile} disabled={dsThoiGian.length === 0}>
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
        <p className="hero-diem-rong">Xuất/Nhập file JSON chỉ áp dụng cho quẻ lập theo thời gian.</p>
        {loi && <p style={{ color: "var(--danger)" }}>Nhập thất bại: {loi}</p>}
      </div>

      <div className="the">
        {danhSachGop.length === 0 ? (
          <p className="trong-rong">Chưa lưu quẻ nào — sang trang "Xem quẻ" và bấm "Lưu quẻ".</p>
        ) : (
          <div className="danh-sach-luu">
            {danhSachGop.map((dong) =>
              dong.loai === "THEO_THOI_GIAN" ? (
                <div className="dong-luu" key={`t-${dong.info.time.toISOString()}`}>
                  <span className="thoi-diem">{dong.info.time.toLocaleString("vi-VN")}</span>
                  <span className="que-dich-cung">Theo thời gian</span>
                  <span className="binh-chu">{dong.info.binhchu || "(không có ghi chú)"}</span>
                  <button className="nut phu" type="button" onClick={() => onXemLaiTheoThoiGian(dong.info.time)}>
                    Xem lại
                  </button>
                  <button className="nut nguy-hiem" type="button" onClick={() => xoaTheoThoiGian(dong.info.time)}>
                    Xoá
                  </button>
                </div>
              ) : (
                <div className="dong-luu" key={`c-${dong.info.createdAt}`}>
                  <span className="thoi-diem">{new Date(dong.info.createdAt).toLocaleString("vi-VN")}</span>
                  <span className="que-dich-cung">
                    Ba đồng xu · {dong.info.cheDoGieo === "MAN_HINH" ? "Gieo trên màn hình" : "Tôi tự gieo"}
                  </span>
                  <span className="binh-chu">
                    {dong.info.tenQueChinh}
                    {dong.info.tenQueBien ? ` → ${dong.info.tenQueBien}` : ""}
                    {dong.info.cauHoi ? ` — "${dong.info.cauHoi}"` : ""}
                  </span>
                  <button className="nut phu" type="button" onClick={() => onXemLaiGieoDongXu(dong.info)}>
                    Xem lại
                  </button>
                  <button className="nut nguy-hiem" type="button" onClick={() => xoaGieoDongXu(dong.info.createdAt)}>
                    Xoá
                  </button>
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
