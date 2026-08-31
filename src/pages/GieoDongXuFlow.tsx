import { useEffect, useMemo, useState } from "react";
import type { CheDoGieo, KetQuaHaoXu, MatXu } from "../core/coinCasting/types";
import { xacDinhHaoTuXu, nhanLoaiHao } from "../core/coinCasting/xacDinhHao";
import { gieoBaDongXu } from "../core/coinCasting/gieoManHinh";
import { lapQueTuCoinCasting } from "../core/coinCasting/adapter";
import { luuGieoQue, type QueDaGieoDaLuu } from "../core/coinCasting/storage";
import { tinhAmLich } from "../core/lunar";
import { KetQuaXemQue } from "../components/KetQuaXemQue";
import { dungThanTuChuDe, mucDoThuanLoi, tomTatKetQua, diemThuanVaCanLuuY } from "../ui/luanQue";

/**
 * Nhánh "Gieo đồng xu" bên trong trang Xem Quẻ — port từ `project-brain/QIChing — Coin
 * Casting Feature/UX Specification.md`, thu gọn theo
 * `project-brain/09-gop-gieo-dong-xu-vao-xem-que.md`: bỏ 2 bước đầu (chọn "Gieo đồng xu" +
 * Chủ đề/Câu hỏi — nay thuộc `XemQue.tsx` orchestrator dùng chung với nhánh Theo Thời Gian),
 * chỉ còn Cách gieo → gieo/nhập 6 hào → hoàn tất → kết quả.
 */

type Buoc = "CACH_GIEO" | "DANG_GIEO" | "HOAN_TAT" | "XEM_KET_QUA";

const XU_RONG: [MatXu | null, MatXu | null, MatXu | null] = [null, null, null];

export function GieoDongXuFlow({
  chuDe,
  vietTrucTiep,
  cauHoi,
  gieoQueBanDau,
  onXemChiTietQue,
  onHuy,
  onDangGieoDoDangChange,
}: {
  chuDe: string;
  vietTrucTiep: string;
  cauHoi: string;
  /** Xem lại một quẻ gieo đồng xu đã lưu — nhảy thẳng vào kết quả, không gieo lại (mục 4, 6.4
   * của kế hoạch gộp). */
  gieoQueBanDau?: QueDaGieoDaLuu;
  onXemChiTietQue?: (tenQueChuan: string) => void;
  /** Gọi khi user xác nhận "Huỷ gieo quẻ" — quyết định #2: quay lại "Cách khởi quẻ" (bước đầu
   * tiên của cả màn Xem Quẻ), không chuyển thẳng sang nội dung Theo Thời Gian. */
  onHuy: () => void;
  /** Báo cho `XemQue` orchestrator biết đang gieo dở, để disable "Cách khởi quẻ" — quyết định
   * #2: không cho chuyển trực tiếp sang Theo Thời Gian khi đang gieo dở. */
  onDangGieoDoDangChange: (dangDo: boolean) => void;
}) {
  const [buoc, setBuoc] = useState<Buoc>(gieoQueBanDau ? "XEM_KET_QUA" : "CACH_GIEO");
  const [cheDoGieo, setCheDoGieo] = useState<CheDoGieo | null>(gieoQueBanDau?.cheDoGieo ?? null);
  const [hao, setHao] = useState<KetQuaHaoXu[]>(gieoQueBanDau?.hao ?? []);
  const [thoiDiemLuanQue, setThoiDiemLuanQue] = useState<Date | null>(
    gieoQueBanDau ? new Date(gieoQueBanDau.createdAt) : null,
  );

  // Mode "Gieo trên màn hình": kết quả 1 lần gieo, chờ user bấm "Tiếp tục" mới commit vào `hao`.
  const [dangGieo, setDangGieo] = useState(false);
  const [ketQuaManHinh, setKetQuaManHinh] = useState<KetQuaHaoXu | null>(null);

  // Mode "Tôi tự gieo": 3 lựa chọn Ngửa/Sấp đang nhập cho hào hiện tại.
  const [xuVatLy, setXuVatLy] = useState<[MatXu | null, MatXu | null, MatXu | null]>(XU_RONG);

  const [daLuu, setDaLuu] = useState(false);
  const [hienLichSu, setHienLichSu] = useState(false);
  const [hienTroGiup, setHienTroGiup] = useState(false);
  const [xacNhanHuy, setXacNhanHuy] = useState(false);

  useEffect(() => {
    onDangGieoDoDangChange(buoc === "DANG_GIEO" || buoc === "HOAN_TAT");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buoc]);

  const viTriHienTai = (hao.length + 1) as 1 | 2 | 3 | 4 | 5 | 6;
  const dungThan = dungThanTuChuDe(chuDe, vietTrucTiep);

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

  const batDauLaiGieo = () => {
    setBuoc("CACH_GIEO");
    setCheDoGieo(null);
    setHao([]);
    setThoiDiemLuanQue(null);
    setKetQuaManHinh(null);
    setXuVatLy(XU_RONG);
    setDaLuu(false);
    setHienLichSu(false);
    setXacNhanHuy(false);
  };

  const huyGieo = () => {
    if (hao.length > 0 && !xacNhanHuy) {
      setXacNhanHuy(true);
      return;
    }
    onHuy();
  };

  const luuQue = () => {
    if (!ketQuaLapQue || !thoiDiemLuanQue || !cheDoGieo) return;
    luuGieoQue({
      cheDoGieo,
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

  const provenance = `Ba đồng xu · ${cheDoGieo === "MAN_HINH" ? "Gieo trên màn hình" : "Tôi tự gieo"}`;

  return (
    <div>
      {buoc !== "XEM_KET_QUA" && (
        <div className="hang-form khong-in" style={{ justifyContent: "flex-end", marginBottom: 8 }}>
          {!xacNhanHuy ? (
            <button type="button" className="nut-nho" onClick={huyGieo}>
              Huỷ gieo quẻ
            </button>
          ) : (
            <>
              <span className="hero-diem-rong">Tiến độ hiện tại sẽ mất, bạn có chắc chắn?</span>
              <button type="button" className="nut-nho" onClick={() => setXacNhanHuy(false)}>
                Không
              </button>
              <button type="button" className="nut nguy-hiem" onClick={onHuy}>
                Huỷ luôn
              </button>
            </>
          )}
        </div>
      )}

      {buoc === "CACH_GIEO" && (
        <div className="the">
          <h2>Cách gieo</h2>
          <div className="coin-mode-grid">
            <button
              type="button"
              className="coin-mode-card"
              onClick={() => {
                setCheDoGieo("MAN_HINH");
                setBuoc("DANG_GIEO");
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
                setBuoc("DANG_GIEO");
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
            Cách khởi quẻ: {provenance}
          </p>
          <div className="hanh-dong" style={{ marginTop: 12 }}>
            <button type="button" className="nut" onClick={() => setBuoc("XEM_KET_QUA")}>
              Xem quẻ
            </button>
          </div>
        </div>
      )}

      {buoc === "XEM_KET_QUA" && que && ketQuaLapQue && amLich && (
        <KetQuaXemQue
          que={que}
          amLich={amLich}
          dungThan={dungThan}
          mucDo={mucDo}
          tomTat={tomTat}
          diemThuan={thuan}
          diemCanLuuY={canLuuY}
          viTriHaoDong={ketQuaLapQue.viTriHaoDong}
          provenance={provenance}
          onXemChiTietQue={onXemChiTietQue}
        >
          <div className="the khong-in">
            {cauHoi && <p className="que-dich-cung">Câu hỏi: "{cauHoi}"</p>}
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
            <button type="button" className="nut phu" onClick={batDauLaiGieo}>
              Gieo quẻ mới
            </button>
            <button type="button" className="nut phu" onClick={() => window.print()}>
              In
            </button>
          </div>
        </KetQuaXemQue>
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
