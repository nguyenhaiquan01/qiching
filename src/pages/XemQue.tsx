import { useMemo, useState } from "react";
import { QueDich } from "../core/queDich";
import { tinhAmLich } from "../core/lunar";
import { luuQueInfo } from "../core/storage";
import { LUC_THAN } from "../core/const";
import { CHU_DE, dungThanTuChuDe, mucDoThuanLoi, tomTatKetQua, diemThuanVaCanLuuY } from "../ui/luanQue";
import { NoiDungHoiQue } from "../components/NoiDungHoiQue";
import { KetQuaXemQue } from "../components/KetQuaXemQue";
import { GieoDongXuFlow } from "./GieoDongXuFlow";
import type { QueDaGieoDaLuu } from "../core/coinCasting/storage";

type LoaiQue = "mot-viec" | "tong-quan" | "cuoc-doi";
type CachKhoiQue = "THEO_THOI_GIAN" | "GIEO_DONG_XU";

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
 * Trang chủ — port từ frmKinhDich, thiết kế lại theo `project-brain/05.1-chinh-ui-ux.md`:
 * Câu hỏi → Kết quả → Luận giải → Căn cứ → Chi tiết chuyên môn, thay vì chỉ hiển thị dữ liệu
 * thô rồi để người dùng tự diễn giải.
 *
 * Đóng vai trò orchestrator cho cả 2 "Cách khởi quẻ" (Theo thời gian / Gieo đồng xu) — gộp
 * theo `project-brain/09-gop-gieo-dong-xu-vao-xem-que.md`: "Gieo đồng xu" không còn là trang
 * top-level riêng, mà là 1 trong 2 lựa chọn ở đây, dùng chung Chủ đề/Câu hỏi và khối kết quả
 * với nhánh Theo Thời Gian.
 */
export function XemQue({
  thoiDiemBanDau,
  gieoQueBanDau,
  onXemChiTietQue,
}: {
  thoiDiemBanDau?: Date;
  /** Xem lại một quẻ gieo đồng xu đã lưu (từ trang "Quẻ đã lưu") — nhảy thẳng vào kết quả. */
  gieoQueBanDau?: QueDaGieoDaLuu;
  /** Điều hướng sang trang chi tiết của một quẻ (tab "64 Quẻ Kinh Dịch") — dùng khi người
   * dùng bấm vào tên quẻ chính/quẻ biến ở phần "Chi tiết Lục Hào". */
  onXemChiTietQue?: (tenQueChuan: string) => void;
}) {
  const [cach, setCach] = useState<CachKhoiQue>(gieoQueBanDau ? "GIEO_DONG_XU" : "THEO_THOI_GIAN");
  const [dangGieoDoDang, setDangGieoDoDang] = useState(false);

  // Chủ đề/Câu hỏi — dùng chung cho cả 2 cách, sống ở đây để giữ nguyên khi chuyển qua lại
  // (quyết định #1, project-brain/09-gop-gieo-dong-xu-vao-xem-que.md).
  const [chuDe, setChuDe] = useState<string>(gieoQueBanDau?.chuDe ?? CHU_DE[0].nhan);
  const [vietTrucTiep, setVietTrucTiep] = useState<string>(LUC_THAN[0]);
  const [cauHoi, setCauHoi] = useState(gieoQueBanDau?.cauHoi ?? "");

  // --- Nhánh "Theo thời gian" ---
  const gio = thoiDiemBanDau ?? new Date();
  const [ngayStr, setNgayStr] = useState(denChuoiNgay(gio));
  const [gioStr, setGioStr] = useState(denChuoiGio(gio));
  const [loaiQue, setLoaiQue] = useState<LoaiQue>("mot-viec");
  const [binhChu, setBinhChu] = useState("");
  const [daLuu, setDaLuu] = useState(false);
  const [daChep, setDaChep] = useState(false);
  const [daLapQue, setDaLapQue] = useState(thoiDiemBanDau != null);

  const dungThan = loaiQue === "mot-viec" ? dungThanTuChuDe(chuDe, vietTrucTiep) : undefined;

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
    luuQueInfo({
      time: thoiDiem,
      binhchu: binhChu,
      chuDe: loaiQue === "mot-viec" ? chuDe : undefined,
      cauHoi: cauHoi || undefined,
    });
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
        <h2>Cách khởi quẻ</h2>
        <div className="coin-mode-grid">
          <button
            type="button"
            className={`coin-mode-card${cach === "THEO_THOI_GIAN" ? " active" : ""}`}
            disabled={dangGieoDoDang}
            onClick={() => setCach("THEO_THOI_GIAN")}
          >
            <strong>Theo thời gian</strong>
            <span>Mai Hoa Dịch Số</span>
          </button>
          <button
            type="button"
            className={`coin-mode-card${cach === "GIEO_DONG_XU" ? " active" : ""}`}
            disabled={dangGieoDoDang}
            onClick={() => setCach("GIEO_DONG_XU")}
          >
            <strong>Gieo đồng xu</strong>
            <span>Ba đồng xu · Sáu lần</span>
          </button>
        </div>
      </div>

      <div className="the khong-in">
        <h2>Câu hỏi</h2>

        {cach === "THEO_THOI_GIAN" && (
          <div className="hang-form loai-que-radio" style={{ marginBottom: 20 }}>
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
        )}

        {(cach === "GIEO_DONG_XU" || loaiQue === "mot-viec") && (
          <NoiDungHoiQue
            chuDe={chuDe}
            onChuDeChange={setChuDe}
            vietTrucTiep={vietTrucTiep}
            onVietTrucTiepChange={setVietTrucTiep}
            cauHoi={cauHoi}
            onCauHoiChange={setCauHoi}
          />
        )}

        {cach === "THEO_THOI_GIAN" && (
          <div className="hang-form" style={{ marginTop: 20 }}>
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
        )}
      </div>

      {cach === "THEO_THOI_GIAN" && (
        <>
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
            <KetQuaXemQue
              que={que}
              amLich={amLich}
              dungThan={dungThan}
              mucDo={mucDo}
              tomTat={tomTat}
              diemThuan={thuan}
              diemCanLuuY={canLuuY}
              provenance="Theo thời gian"
              onXemChiTietQue={onXemChiTietQue}
            >
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
                <button className="nut phu" type="button" onClick={() => window.print()}>
                  In
                </button>
              </div>
            </KetQuaXemQue>
          )}
        </>
      )}

      {cach === "GIEO_DONG_XU" && (
        <GieoDongXuFlow
          chuDe={chuDe}
          vietTrucTiep={vietTrucTiep}
          cauHoi={cauHoi}
          gieoQueBanDau={gieoQueBanDau}
          onXemChiTietQue={onXemChiTietQue}
          onHuy={() => {
            // GieoDongXuFlow unmount ngay khi cach đổi — effect báo `dangGieoDoDang` của nó
            // không kịp chạy cleanup, nên phải tự reset ở đây (bug B1,
            // project-brain/09-gop-gieo-dong-xu-vao-xem-que.md).
            setCach("THEO_THOI_GIAN");
            setDangGieoDoDang(false);
          }}
          onDangGieoDoDangChange={setDangGieoDoDang}
        />
      )}
    </div>
  );
}
