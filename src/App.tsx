import { useState } from "react";
import "./App.css";
import "./ui/stitch-theme.css";
import { XemQue } from "./pages/XemQue";
import { Que64 } from "./pages/Que64";
import { TimNgayTot } from "./pages/TimNgayTot";
import { QueDaLuu } from "./pages/QueDaLuu";
import { GioiThieu } from "./pages/GioiThieu";

const TRANG = ["Xem quẻ", "Tìm ngày tốt", "64 Quẻ Kinh Dịch", "Quẻ đã lưu", "Giới thiệu"] as const;
type Trang = (typeof TRANG)[number];

function App() {
  const [trang, setTrang] = useState<Trang>("Xem quẻ");
  const [thoiDiemXem, setThoiDiemXem] = useState<Date | undefined>(undefined);
  const [queMoDau, setQueMoDau] = useState<string | undefined>(undefined);

  const xemLaiQue = (time: Date) => {
    setThoiDiemXem(time);
    setTrang("Xem quẻ");
  };

  const xemChiTietQue = (tenQueChuan: string) => {
    setQueMoDau(tenQueChuan);
    setTrang("64 Quẻ Kinh Dịch");
  };

  return (
    <div className="app-shell theme-stitch">
      <header className="app-header">
        <h1>QIChing</h1>
      </header>
      <nav className="app-nav khong-in">
        {TRANG.map((t) => (
          <button key={t} type="button" className={t === trang ? "active" : ""} onClick={() => setTrang(t)}>
            {t}
          </button>
        ))}
      </nav>
      <main>
        {trang === "Xem quẻ" && (
          <XemQue key={thoiDiemXem?.getTime()} thoiDiemBanDau={thoiDiemXem} onXemChiTietQue={xemChiTietQue} />
        )}
        {trang === "64 Quẻ Kinh Dịch" && <Que64 queMoDau={queMoDau} />}
        {trang === "Tìm ngày tốt" && <TimNgayTot />}
        {trang === "Quẻ đã lưu" && <QueDaLuu onXemLai={xemLaiQue} />}
        {trang === "Giới thiệu" && <GioiThieu />}
      </main>
    </div>
  );
}

export default App;
