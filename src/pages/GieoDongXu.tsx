import { useMemo, useState } from "react";
import type { CheDoGieo, KetQuaHaoXu, MatXu } from "../core/coinCasting/types";
import { xacDinhHaoTuXu, nhanLoaiHao } from "../core/coinCasting/xacDinhHao";
import { gieoBaDongXu } from "../core/coinCasting/gieoManHinh";
import { lapQueTuCoinCasting } from "../core/coinCasting/adapter";
import { luuGieoQue } from "../core/coinCasting/storage";
import { tinhAmLich } from "../core/lunar";
import { CanCuLuanQue } from "../components/CanCuLuanQue";
import { AmLichView } from "../components/AmLichView";
import { KetQuaHero } from "../components/KetQuaHero";
import { LuanQueTheoViec } from "../components/LuanQueTheoViec";
import { VuongSuyBar } from "../components/VuongSuyBar";
import { QueDichView } from "../components/QueDichView";
import { CHU_DE, mucDoThuanLoi, tomTatKetQua, goiYUngXu, diemThuanVaCanLuuY } from "../ui/luanQue";
import { LUC_THAN } from "../core/const";

/**
 * Trang "Gieo đồng xu" — port từ `project-brain/QIChing — Coin Casting Feature
 * Specification.md` + `... UX Specification.md`. Luồng: chọn chế độ gieo → chủ đề/câu hỏi →
 * gieo/nhập 6 hào (từ dưới lên) → màn hoàn tất → xem kết quả (tái dùng đúng các component
 * hiển thị của trang Xem Quẻ — KetQuaHero/LuanQueTheoViec/CanCuLuanQue/AmLichView/
 * VuongSuyBar/QueDichView).
 */

type Buoc = "CHON_CHE_DO" | "BOI_CANH" | "DANG_GIEO" | "HOAN_TAT" | "XEM_KET_QUA";

const XU_RONG: [MatXu | null, MatXu | null, MatXu | null] = [null, null, null];

export function GieoDongXu({ onXemChiTietQue }: { onXemChiTietQue?: (tenQueChuan: string) => void }) {
  const [buoc, setBuoc] = useState<Buoc>("CHON_CHE_DO");
  const [cheDoGieo, setCheDoGieo] = useState<CheDoGieo | null>(null);
  const [chuDe, setChuDe] = useState<string>(CHU_DE[0].nhan);
  const [vietTrucTiep, setVietTrucTiep] = useState<string>(LUC_THAN[0]);
  const [cauHoi, setCauHoi] = useState("");

  const [hao, setHao] = useState<KetQuaHaoXu[]>([]);
  const [thoiDiemLuanQue, setThoiDiemLuanQue] = useState<Date | null>(null);

  // Mode "Gieo trên màn hình": kết quả 1 lần gieo, chờ user bấm "Tiếp tục" mới commit vào `hao`.
  const [dangGieo, setDangGieo] = useState(false);
  const [ketQuaManHinh, setKetQuaManHinh] = useState<KetQuaHaoXu | null>(null);

  // Mode "Tôi tự gieo": 3 lựa chọn Ngửa/Sấp đang nhập cho hào hiện tại.
  const [xuVatLy, setXuVatLy] = useState<[MatXu | null, MatXu | null, MatXu | null]>(XU_RONG);

  const [daLuu, setDaLuu] = useState(false);
  const [hienLichSu, setHienLichSu] = useState(false);
  const [hienTroGiup, setHienTroGiup] = useState(false);

  const viTriHienTai = (hao.length + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  const dungThan = chuDe === "khac" ? vietTrucTiep : CHU_DE.find((c) => c.nhan === chuDe)?.lucThan;

  const ketQuaLapQue = useMemo(() => {
    if (buoc !== "HOAN_TAT" && buoc !== "XEM_KET_QUA") return null;
    if (!thoiDiemLuanQue || hao.length !== 6) return null;
    return lapQueTuCoinCasting(hao, thoiDiemLuanQue);
  }, [buoc, thoiDiemLuanQue, hao]);

  const amLich = useMemo(() => (thoiDiemLuanQue ? tinhAmLich(thoiDiemLuanQue) : null), [thoiDiemLuanQue]);

  if (ketQuaLapQue) {
    ketQuaLapQue.queChinh.queDichBien = ketQuaLapQue.queBien ?? undefined;
  }
  const que = ketQuaLapQue?.queChinh ?? null;
  const mucDo = que && dungThan ? mucDoThuanLoi(que.diemLucThan[dungThan]) : null;
  const tomTat = tomTatKetQua(mucDo?.muc ?? null);
  const { thuan, canLuuY } = que ? diemThuanVaCanLuuY(que) : { thuan: [], canLuuY: [] };

  const guiHao = (matXu: [MatXu, MatXu, MatXu]) => {
    const ketQua = xacDinhHaoTuXu(viTriHienTai, matXu);
    const haoMoi = [...hao, ketQua];
    setHao(haoMoi);
    setXuVatLy(XU_RONG);
    if (haoMoi.length === 6) {
      setThoiDiemLuanQue(new Date());
      setBuoc("HOAN_TAT");
    }
  };

  const gieoManHinhClick = () => {
    setDangGieo(true);
    window.setTimeout(() => {
      setKetQuaManHinh(xacDinhHaoTuXu(viTriHienTai, gieoBaDongXu()));
      setDangGieo(false);
    }, 700);
  };

  const tiepTucManHinh = () => {
    if (!ketQuaManHinh) return;
    const haoMoi = [...hao, ketQuaManHinh];
    setHao(haoMoi);
    setKetQuaManHinh(null);
    if (haoMoi.length === 6) {
      setThoiDiemLuanQue(new Date());
      setBuoc("HOAN_TAT");
    }
  };

  const batDauLai = () => {
    setBuoc("CHON_CHE_DO");
    setCheDoGieo(null);
    setChuDe(CHU_DE[0].nhan);
    setCauHoi("");
    setHao([]);
    setThoiDiemLuanQue(null);
    setKetQuaManHinh(null);
    setXuVatLy(XU_RONG);
    setDaLuu(false);
    setHienLichSu(false);
  };

  const luuQue = () => {
    if (!ketQuaLapQue || !thoiDiemLuanQue) return;
    luuGieoQue({
      cheDoGieo: cheDoGieo!,
      hao,
      chuDe,
      cauHoi: cauHoi || undefined,
      createdAt: thoiDiemLuanQue.toISOString(),
      tenQueChinh: ketQuaLapQue.queChinh.tenQueDich,
      tenQueBien: ketQuaLapQue.queBien?.tenQueDich ?? null,
      viTriHaoDong: ketQuaLapQue.viTriHaoDong,
    });
    setDaLuu(true);
    window.setTimeout(() => setDaLuu(false), 2000);
  };

  return (
    <div>
      {buoc === "CHON_CHE_DO" && (
        <div className="the">
          <h2>Gieo quẻ bằng đồng xu</h2>
          <p className="hero-tom-tat">
            Gieo ba đồng xu sáu lần để lập sáu hào của quẻ, theo thứ tự từ dưới lên.
          </p>
          <div className="coin-mode-grid">
            <button
              type="button"
              className="coin-mode-card"
              onClick={() => {
                setCheDoGieo("MAN_HINH");
                setBuoc("BOI_CANH");
              }}
            >
              <strong>Gieo trên màn hình</strong>
              <span>QIChing sẽ gieo ba đồng xu cho từng hào.</span>
            </button>
            <button
              type="button"
              className="coin-mode-card"
              onClick={() => {
                setCheDoGieo("TU_GIEO");
                setBuoc("BOI_CANH");
              }}
            >
              <strong>Tôi tự gieo</strong>
              <span>Gieo ba đồng xu thật và nhập kết quả Ngửa/Sấp.</span>
            </button>
          </div>
          <button type="button" className="nut-nho" onClick={() => setHienTroGiup((v) => !v)}>
            ⓘ Cách gieo ba đồng xu
          </button>
          {hienTroGiup && (
            <div className="can-cu-noi-dung" style={{ marginTop: 12 }}>
              <p>
                Mỗi lần gieo sử dụng ba đồng xu. QIChing quy ước mặt có chữ là <strong>Ngửa</strong>, mặt không
                chữ hoặc hoa văn là <strong>Sấp</strong>. Gieo tổng cộng sáu lần — lần đầu tạo Hào 1 ở dưới cùng,
                các hào tiếp theo lập dần lên trên.
              </p>
              <table className="bang-ket-qua">
                <thead>
                  <tr>
                    <th>Kết quả</th>
                    <th>Hào</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>3 Sấp</td>
                    <td>Lão Dương · Động</td>
                  </tr>
                  <tr>
                    <td>2 Sấp + 1 Ngửa</td>
                    <td>Thiếu Dương · Tĩnh</td>
                  </tr>
                  <tr>
                    <td>2 Ngửa + 1 Sấp</td>
                    <td>Thiếu Âm · Tĩnh</td>
                  </tr>
                  <tr>
                    <td>3 Ngửa</td>
                    <td>Lão Âm · Động</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {buoc === "BOI_CANH" && (
        <div className="the">
          <h2>Trước khi gieo quẻ</h2>
          <div className="hang-form">
            <div className="truong">
              <label htmlFor="cc-chude">Chủ đề</label>
              <select id="cc-chude" value={chuDe} onChange={(e) => setChuDe(e.target.value)}>
                {CHU_DE.map((c) => (
                  <option key={c.nhan} value={c.nhan}>
                    {c.nhan}
                  </option>
                ))}
                <option value="khac">Khác — chọn trực tiếp Lục Thân</option>
              </select>
            </div>
            {chuDe === "khac" && (
              <div className="truong">
                <label htmlFor="cc-lucthan">Lục Thân</label>
                <select id="cc-lucthan" value={vietTrucTiep} onChange={(e) => setVietTrucTiep(e.target.value)}>
                  {LUC_THAN.map((lt) => (
                    <option key={lt} value={lt}>
                      {lt}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="truong" style={{ flex: 1 }}>
              <label htmlFor="cc-cauhoi">Câu hỏi (không bắt buộc)</label>
              <input
                id="cc-cauhoi"
                type="text"
                placeholder="Ví dụ: Tôi có nên nhận công việc mới này không?"
                value={cauHoi}
                onChange={(e) => setCauHoi(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
          <p className="hero-diem-rong" style={{ marginTop: 12 }}>
            Hãy giữ câu hỏi trong tâm trí trong quá trình gieo sáu hào.
          </p>
          <div className="hanh-dong" style={{ marginTop: 12 }}>
            <button type="button" className="nut" onClick={() => setBuoc("DANG_GIEO")}>
              Tiếp tục
            </button>
          </div>
        </div>
      )}

      {buoc === "DANG_GIEO" && cheDoGieo === "MAN_HINH" && (
        <div className="the">
          <h2>Gieo trên màn hình</h2>
          <p className="hero-nhan" style={{ textAlign: "center" }}>
            HÀO {viTriHienTai} / 6 {viTriHienTai === 1 && "— Hào dưới cùng"}
          </p>

          {!ketQuaManHinh ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div className="coin-row">
                <span className="coin-face">◯</span>
                <span className="coin-face">◯</span>
                <span className="coin-face">◯</span>
              </div>
              <button type="button" className="nut" disabled={dangGieo} onClick={gieoManHinhClick}>
                {dangGieo ? "Đang gieo…" : "Gieo"}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div className="coin-row">
                {ketQuaManHinh.matXu.map((m, i) => (
                  <span className="coin-face" key={i}>
                    {m}
                  </span>
                ))}
              </div>
              <p className="hero-tom-tat" style={{ margin: "12px 0 4px" }}>
                {ketQuaManHinh.matXu.filter((m) => m === "Sấp").length} Sấp ·{" "}
                {ketQuaManHinh.matXu.filter((m) => m === "Ngửa").length} Ngửa
              </p>
              <p className="hero-que-ten" style={{ fontSize: "1.3rem" }}>
                {nhanLoaiHao(ketQuaManHinh.loai)}
              </p>
              {ketQuaManHinh.dong && <span className="hero-badge hero-badge-canThanTrong">HÀO ĐỘNG</span>}
              {!ketQuaManHinh.dong && <p className="hero-diem-rong">Hào tĩnh</p>}
              <div style={{ marginTop: 16 }}>
                <button type="button" className="nut" onClick={tiepTucManHinh}>
                  Tiếp tục
                </button>
              </div>
            </div>
          )}

          <QueDangHinhThanh hao={hao} />
        </div>
      )}

      {buoc === "DANG_GIEO" && cheDoGieo === "TU_GIEO" && (
        <div className="the">
          <h2>Tôi tự gieo</h2>
          <p className="hero-nhan" style={{ textAlign: "center" }}>
            HÀO {viTriHienTai} / 6 {viTriHienTai === 1 && "— Hào dưới cùng"}
          </p>
          <p className="hero-diem-rong" style={{ textAlign: "center" }}>
            Hãy gieo ba đồng xu thật, sau đó chọn mặt của từng đồng xu.
          </p>

          <div className="coin-select-grid">
            {[0, 1, 2].map((i) => (
              <div key={i} className="coin-select-col">
                <div className="hero-nhan">Xu {i + 1}</div>
                {(["Ngửa", "Sấp"] as MatXu[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    className={`coin-select-btn${xuVatLy[i] === m ? " active" : ""}`}
                    onClick={() =>
                      setXuVatLy((prev) => {
                        const moi = [...prev] as typeof prev;
                        moi[i] = m;
                        return moi;
                      })
                    }
                  >
                    {m}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {xuVatLy.every((m) => m !== null) && (
            <div style={{ textAlign: "center", marginTop: 16 }}>
              {(() => {
                const kq = xacDinhHaoTuXu(viTriHienTai, xuVatLy as [MatXu, MatXu, MatXu]);
                return (
                  <>
                    <p className="hero-tom-tat">Bạn đã gieo: {xuVatLy.join(" · ")}</p>
                    <p className="hero-que-ten" style={{ fontSize: "1.3rem" }}>
                      {nhanLoaiHao(kq.loai)}
                    </p>
                    {kq.dong ? (
                      <span className="hero-badge hero-badge-canThanTrong">HÀO ĐỘNG</span>
                    ) : (
                      <p className="hero-diem-rong">Hào tĩnh</p>
                    )}
                  </>
                );
              })()}
            </div>
          )}

          <div className="hanh-dong" style={{ marginTop: 16 }}>
            <button
              type="button"
              className="nut"
              disabled={xuVatLy.some((m) => m === null)}
              onClick={() => guiHao(xuVatLy as [MatXu, MatXu, MatXu])}
            >
              Xác nhận hào
            </button>
          </div>

          <QueDangHinhThanh hao={hao} />
        </div>
      )}

      {buoc === "HOAN_TAT" && ketQuaLapQue && (
        <div className="the">
          <h2>Quẻ đã lập</h2>
          <QueDangHinhThanh hao={hao} />
          {ketQuaLapQue.viTriHaoDong.length > 0 ? (
            <>
              <p className="hero-nhan" style={{ marginTop: 16 }}>
                {ketQuaLapQue.viTriHaoDong.length} HÀO ĐỘNG
              </p>
              <ul className="hero-diem-list">
                {ketQuaLapQue.viTriHaoDong.map((vt) => (
                  <li key={vt}>
                    Hào {vt}: {hao[vt - 1].amDuong} → {hao[vt - 1].amDuong === "Dương" ? "Âm" : "Dương"}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <>
              <p className="hero-nhan" style={{ marginTop: 16 }}>
                KHÔNG CÓ HÀO ĐỘNG
              </p>
              <p className="hero-diem-rong">Sáu hào đều ở trạng thái tĩnh.</p>
            </>
          )}
          <p className="que-dich-cung" style={{ marginTop: 12 }}>
            Cách khởi quẻ: Ba đồng xu · {cheDoGieo === "MAN_HINH" ? "Gieo trên màn hình" : "Tôi tự gieo"}
          </p>
          <div className="hanh-dong" style={{ marginTop: 12 }}>
            <button type="button" className="nut" onClick={() => setBuoc("XEM_KET_QUA")}>
              Xem quẻ
            </button>
          </div>
        </div>
      )}

      {buoc === "XEM_KET_QUA" && que && ketQuaLapQue && amLich && (
        <>
          <KetQuaHero que={que} mucDo={mucDo} tomTat={tomTat} diemThuan={thuan} diemCanLuuY={canLuuY} />

          {dungThan && mucDo && (
            <LuanQueTheoViec
              que={que}
              dungThan={dungThan}
              mucDo={mucDo}
              tomTat={tomTat}
              diemThuan={thuan}
              diemCanLuuY={canLuuY}
              goiY={goiYUngXu(mucDo.muc)}
              viTriHaoDong={ketQuaLapQue.viTriHaoDong}
            />
          )}

          <div className="the khong-in">
            <CanCuLuanQue que={que} amLich={amLich} dungThan={dungThan} viTriHaoDong={ketQuaLapQue.viTriHaoDong} />
          </div>

          <div className="the">
            <h2>Lịch âm</h2>
            <AmLichView amLich={amLich} />
          </div>

          <div className="the">
            <h2>Điểm vượng suy Lục Thân</h2>
            <VuongSuyBar diemLucThan={que.diemLucThan} vietNhanManh={dungThan} />
          </div>

          <div className="the">
            <h2>Chi tiết Lục Hào</h2>
            <div className="que-dich-view">
              <QueDichView
                que={que}
                vietNhanManh={dungThan}
                tieuDe="Quẻ chính"
                noiBatVach={ketQuaLapQue.viTriHaoDong}
                onXemChiTiet={onXemChiTietQue}
              />
              {ketQuaLapQue.queBien && (
                <QueDichView
                  que={ketQuaLapQue.queBien}
                  tieuDe="Quẻ biến"
                  noiBatVach={ketQuaLapQue.viTriHaoDong}
                  onXemChiTiet={onXemChiTietQue}
                />
              )}
            </div>
          </div>

          <div className="the khong-in">
            <p className="que-dich-cung">
              Cách khởi quẻ: Ba đồng xu · {cheDoGieo === "MAN_HINH" ? "Gieo trên màn hình" : "Tôi tự gieo"}
              <br />
              Luận quẻ: Lục Hào Nạp Giáp
            </p>
            {cauHoi && <p className="que-dich-cung">Câu hỏi: “{cauHoi}”</p>}
            <button type="button" className="nut-nho" onClick={() => setHienLichSu((v) => !v)}>
              {hienLichSu ? "Ẩn" : "Xem"} lịch sử gieo
            </button>
            {hienLichSu && (
              <ul className="hero-diem-list" style={{ marginTop: 8 }}>
                {[...hao]
                  .slice()
                  .reverse()
                  .map((h) => (
                    <li key={h.viTri}>
                      Hào {h.viTri}: {h.matXu.join(" · ")} — {nhanLoaiHao(h.loai)}
                      {h.dong ? " · Động" : ""}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="the khong-in hanh-dong">
            <button type="button" className="nut" onClick={luuQue}>
              {daLuu ? "Đã lưu ✓" : "Lưu quẻ"}
            </button>
            <button type="button" className="nut phu" onClick={batDauLai}>
              Gieo quẻ mới
            </button>
            <button type="button" className="nut-nho" onClick={() => window.print()}>
              In
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/** Mục 13 UX Spec — "Quẻ đang hình thành": hiển thị tiến độ 6 hào, hào trên chưa gieo để trống. */
function QueDangHinhThanh({ hao }: { hao: KetQuaHaoXu[] }) {
  return (
    <div style={{ marginTop: 20 }}>
      <div className="hero-nhan">Quẻ đang hình thành ({hao.length}/6)</div>
      <div className="que-dich-cot" style={{ minWidth: 0 }}>
        {[6, 5, 4, 3, 2, 1].map((vt) => {
          const h = hao[vt - 1];
          return (
            <div key={vt} className={`hao-hang${h?.dong ? " dong" : ""}`}>
              <div className="hao-vach">
                {!h ? (
                  <span className="thanh" style={{ background: "var(--border)" }} />
                ) : h.amDuong === "Âm" ? (
                  <>
                    <span className="thanh" />
                    <span className="thanh" />
                  </>
                ) : (
                  <span className="thanh" />
                )}
              </div>
              <div className="hao-nhan">Hào {vt}</div>
              {h?.dong && <div className="hao-than">Động</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
