import { useState } from "react";
import "./App.css";
import { XemQue } from "./pages/XemQue";
import { Que64 } from "./pages/Que64";
import { TimNgayTot } from "./pages/TimNgayTot";
import { QueDaLuu } from "./pages/QueDaLuu";
import { GioiThieu } from "./pages/GioiThieu";

const TRANG = ["Xem quẻ", "64 Quẻ Kinh Dịch", "Tìm ngày tốt", "Quẻ đã lưu", "Giới thiệu"] as const;
type Trang = (typeof TRANG)[number];

function App() {
  const [trang, setTrang] = useState<Trang>("Xem quẻ");
  const [thoiDiemXem, setThoiDiemXem] = useState<Date | undefined>(undefined);

  const xemLaiQue = (time: Date) => {
    setThoiDiemXem(time);
    setTrang("Xem quẻ");
  };

  return (
    <div className="app-shell">
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
        {trang === "Xem quẻ" && <XemQue key={thoiDiemXem?.getTime()} thoiDiemBanDau={thoiDiemXem} />}
        {trang === "64 Quẻ Kinh Dịch" && <Que64 />}
        {trang === "Tìm ngày tốt" && <TimNgayTot />}
        {trang === "Quẻ đã lưu" && <QueDaLuu onXemLai={xemLaiQue} />}
        {trang === "Giới thiệu" && <GioiThieu />}
      </main>
    </div>
  );
}

export default App;
