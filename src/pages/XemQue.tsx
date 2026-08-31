import { useMemo, useState } from "react";
import { QueDich } from "../core/queDich";
import { tinhAmLich } from "../core/lunar";
import { AmLichView } from "../components/AmLichView";
import { QueDichView } from "../components/QueDichView";
import { KetQuaHero } from "../components/KetQuaHero";
import { LuanQueTheoViec } from "../components/LuanQueTheoViec";
import { CanCuLuanQue } from "../components/CanCuLuanQue";
import { VuongSuyBar } from "../components/VuongSuyBar";
import { luuQueInfo } from "../core/storage";
import { LUC_THAN } from "../core/const";
import { CHU_DE, mucDoThuanLoi, tomTatKetQua, goiYUngXu, diemThuanVaCanLuuY } from "../ui/luanQue";

type LoaiQue = "mot-viec" | "tong-quan" | "cuoc-doi";

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

/**
 * Trang chủ — port từ frmKinhDich, thiết kế lại theo `project-brain/05.1. Chỉnh UI-UX.md`:
 * Câu hỏi → Kết quả → Luận giải → Căn cứ → Chi tiết chuyên môn, thay vì chỉ hiển thị dữ liệu
 * thô rồi để người dùng tự diễn giải.
 */
export function XemQue({
  thoiDiemBanDau,
  onXemChiTietQue,
}: {
  thoiDiemBanDau?: Date;
  /** Điều hướng sang trang chi tiết của một quẻ (tab "64 Quẻ Kinh Dịch") — dùng khi người
   * dùng bấm vào tên quẻ chính/quẻ biến ở phần "Chi tiết Lục Hào". */
  onXemChiTietQue?: (tenQueChuan: string) => void;
}) {
  const gio = thoiDiemBanDau ?? new Date();
  const [ngayStr, setNgayStr] = useState(denChuoiNgay(gio));
  const [gioStr, setGioStr] = useState(denChuoiGio(gio));
  const [loaiQue, setLoaiQue] = useState<LoaiQue>("mot-viec");
  const [chuDe, setChuDe] = useState<string>(CHU_DE[0].nhan);
  const [vietTrucTiep, setVietTrucTiep] = useState<string>(LUC_THAN[0]);
  const [cauHoi, setCauHoi] = useState("");
  const [binhChu, setBinhChu] = useState("");
  const [daLuu, setDaLuu] = useState(false);
  const [daChep, setDaChep] = useState(false);
  const [daLapQue, setDaLapQue] = useState(thoiDiemBanDau != null);

  const dungThan =
    loaiQue === "mot-viec" ? (chuDe === "khac" ? vietTrucTiep : CHU_DE.find((c) => c.nhan === chuDe)?.lucThan) : undefined;

  const thoiDiem = useMemo(() => {
    const [y, m, d] = ngayStr.split("-").map(Number);
    const [h, min] = gioStr.split(":").map(Number);
    return new Date(y, m - 1, d, h, min, 0);
  }, [ngayStr, gioStr]);

  const { que, loi } = useMemo(() => {
    try {
      if (loaiQue === "cuoc-doi") {
        const q = new QueDich(thoiDiem, true);
        q.giaiQueCuocDoi();
        return { que: q, loi: null as string | null };
      }
      const q = new QueDich(thoiDiem);
      q.giaiQue();
      return { que: q, loi: null as string | null };
    } catch (e) {
      return { que: null, loi: e instanceof Error ? e.message : String(e) };
    }
  }, [thoiDiem, loaiQue]);
  const amLich = useMemo(() => tinhAmLich(thoiDiem), [thoiDiem]);

  const mucDo = que && dungThan ? mucDoThuanLoi(que.diemLucThan[dungThan]) : null;
  const tomTat = tomTatKetQua(mucDo?.muc ?? null);
  const { thuan, canLuuY } = que ? diemThuanVaCanLuuY(que) : { thuan: [], canLuuY: [] };

  const luuLai = () => {
    luuQueInfo({ time: thoiDiem, binhchu: binhChu });
    setDaLuu(true);
    setTimeout(() => setDaLuu(false), 2000);
  };

  const chiaSe = () => {
    if (!que) return;
    const dong = [
      `Quẻ dịch: ${que.tenQueDich} → ${que.queDichBien?.tenQueDich ?? ""}`,
      cauHoi ? `Câu hỏi: ${cauHoi}` : null,
      `Thời điểm: ${thoiDiem.toLocaleString("vi-VN")}`,
    ].filter(Boolean);
    navigator.clipboard.writeText(dong.join("\n"));
    setDaChep(true);
    setTimeout(() => setDaChep(false), 2000);
  };

  return (
    <div>
      <div className="the khong-in">
        <h2>Câu hỏi</h2>
        <div className="hang-form loai-que-radio">
          <label>
            <input type="radio" checked={loaiQue === "mot-viec"} onChange={() => setLoaiQue("mot-viec")} />
            Xem một việc
          </label>
          <label>
            <input type="radio" checked={loaiQue === "tong-quan"} onChange={() => setLoaiQue("tong-quan")} />
            Xem tổng quan
          </label>
          <label>
            <input type="radio" checked={loaiQue === "cuoc-doi"} onChange={() => setLoaiQue("cuoc-doi")} />
            Quẻ Cuộc Đời
          </label>
        </div>

        {loaiQue === "mot-viec" && (
          <div className="hang-form">
            <div className="truong">
              <label htmlFor="chude">Chủ đề</label>
              <select id="chude" value={chuDe} onChange={(e) => setChuDe(e.target.value)}>
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
                <label htmlFor="viectt">Lục Thân</label>
                <select id="viectt" value={vietTrucTiep} onChange={(e) => setVietTrucTiep(e.target.value)}>
                  {LUC_THAN.map((lt) => (
                    <option key={lt} value={lt}>
                      {lt}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="truong" style={{ flex: 1 }}>
              <label htmlFor="cauhoi">Câu hỏi (không bắt buộc)</label>
              <input
                id="cauhoi"
                type="text"
                placeholder="Ví dụ: Tôi có nên nhận công việc mới này không?"
                value={cauHoi}
                onChange={(e) => setCauHoi(e.target.value)}
                style={{ width: "100%" }}
              />
            </div>
          </div>
        )}

        <div className="hang-form">
          <div className="truong">
            <label htmlFor="ngay">Ngày lập quẻ</label>
            <input id="ngay" type="date" value={ngayStr} onChange={(e) => setNgayStr(e.target.value)} />
          </div>
          <div className="truong">
            <label htmlFor="gio">Giờ</label>
            <input id="gio" type="time" value={gioStr} onChange={(e) => setGioStr(e.target.value)} />
          </div>
          <button className="nut" type="button" onClick={() => setDaLapQue(true)}>
            Lập quẻ
          </button>
        </div>
      </div>

      {loi && (
        <div className="the">
          <p style={{ color: "var(--danger)" }}>Không an được quẻ: {loi}</p>
        </div>
      )}

      {!daLapQue && !loi && (
        <div className="the">
          <p className="trong-rong">Điền thông tin ở trên rồi bấm "Lập quẻ" để xem kết quả.</p>
        </div>
      )}

      {que && daLapQue && (
        <>
          <KetQuaHero que={que} mucDo={mucDo} tomTat={tomTat} diemThuan={thuan} diemCanLuuY={canLuuY} />

          {loaiQue === "mot-viec" && dungThan && mucDo && (
            <LuanQueTheoViec
              que={que}
              dungThan={dungThan}
              mucDo={mucDo}
              tomTat={tomTat}
              diemThuan={thuan}
              diemCanLuuY={canLuuY}
              goiY={goiYUngXu(mucDo.muc)}
            />
          )}

          <div className="the khong-in">
            <CanCuLuanQue que={que} amLich={amLich} dungThan={dungThan} />
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
            <p className="chu-giai khong-in">
              <span className="chu-giai-muc">
                <span className="hao-vach mau-chu-giai">
                  <span className="thanh" />
                </span>
                Dương
              </span>
              <span className="chu-giai-muc">
                <span className="hao-vach mau-chu-giai">
                  <span className="thanh" />
                  <span className="thanh" />
                </span>
                Âm
              </span>
              <span className="chu-giai-muc">
                <span className="cham-mau" style={{ background: "var(--danger)" }} /> Hào động
              </span>
              <span className="chu-giai-muc">
                <span className="huy-hieu">Thế</span> Bản thân người hỏi
              </span>
              <span className="chu-giai-muc">
                <span className="huy-hieu">Ứng</span> Đối tượng/hoàn cảnh liên quan
              </span>
            </p>
            <div className="que-dich-view">
              <QueDichView que={que} vietNhanManh={dungThan} tieuDe="Quẻ chính" onXemChiTiet={onXemChiTietQue} />
              {que.queDichBien && (
                <QueDichView
                  que={que.queDichBien}
                  tieuDe="Quẻ biến"
                  noiBatVach={que.queBien}
                  onXemChiTiet={onXemChiTietQue}
                />
              )}
            </div>
          </div>

          <div className="the khong-in hanh-dong">
            <div className="truong" style={{ flex: 1 }}>
              <label htmlFor="binhchu">Ghi chú</label>
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
            <button className="nut phu" type="button" onClick={chiaSe}>
              {daChep ? "Đã chép ✓" : "Chia sẻ"}
            </button>
            <button className="nut-nho" type="button" onClick={() => window.print()}>
              In
            </button>
          </div>
        </>
      )}
    </div>
  );
}
