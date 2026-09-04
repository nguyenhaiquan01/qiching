import type { ReactNode } from "react";
import type { QueDich } from "../core/queDich";
import type { AmLich } from "../core/lunar";
import { KetQuaHero } from "./KetQuaHero";
import { LuuYThamKhao } from "./LuuYThamKhao";
import { LuanQueTheoViec } from "./LuanQueTheoViec";
import { CanCuLuanQue } from "./CanCuLuanQue";
import { AmLichView } from "./AmLichView";
import { VuongSuyBar } from "./VuongSuyBar";
import { QueDichView } from "./QueDichView";
import { goiYUngXu, type DiemHao, type MucDoThuanLoi } from "../ui/luanQue";

/**
 * Khối kết quả (Hero → Luận → Căn cứ → Lịch âm → Vượng suy → Lục Hào → Provenance) — dùng
 * chung cho cả 2 "Cách khởi quẻ". Tách theo `project-brain/09-gop-gieo-dong-xu-vao-xem-que.md`,
 * mục 2 (trước đây lặp lại gần như nguyên văn giữa `XemQue.tsx` và `GieoDongXu.tsx`).
 *
 * Phần "hành động" (Lưu quẻ/Chia sẻ/Ghi chú ở Theo Thời Gian, Lịch sử gieo/Gieo quẻ mới ở Gieo
 * Đồng Xu) KHÔNG gộp vào đây — đó là nội dung thực sự khác nhau giữa 2 luồng, không phải logic
 * trùng lặp — truyền qua `children`.
 */
export function KetQuaXemQue({
  que,
  amLich,
  dungThan,
  mucDo,
  tomTat,
  diemThuan,
  diemCanLuuY,
  viTriHaoDong,
  provenance,
  onXemChiTietQue,
  children,
}: {
  que: QueDich;
  amLich: AmLich;
  dungThan?: string;
  mucDo: MucDoThuanLoi | null;
  tomTat: string;
  diemThuan: DiemHao[];
  diemCanLuuY: DiemHao[];
  /** Truyền khi quẻ có thể có nhiều hào động cùng lúc (Coin Casting) — không truyền thì các
   * component con tự đọc `que.queBien` (Theo Thời Gian, luôn đúng 1 hào động). */
  viTriHaoDong?: number[];
  /** Luôn hiển thị — quyết định #3, `project-brain/09-gop-gieo-dong-xu-vao-xem-que.md`: "Theo
   * thời gian" hoặc "Ba đồng xu · Gieo trên màn hình" v.v. */
  provenance: string;
  onXemChiTietQue?: (tenQueChuan: string) => void;
  children?: ReactNode;
}) {
  return (
    <>
      <KetQuaHero
        que={que}
        mucDo={mucDo}
        tomTat={tomTat}
        diemThuan={diemThuan}
        diemCanLuuY={diemCanLuuY}
        onXemChiTiet={onXemChiTietQue}
      />

      {dungThan && mucDo && (
        <LuanQueTheoViec
          que={que}
          dungThan={dungThan}
          mucDo={mucDo}
          tomTat={tomTat}
          diemThuan={diemThuan}
          diemCanLuuY={diemCanLuuY}
          goiY={goiYUngXu(mucDo.muc)}
          viTriHaoDong={viTriHaoDong}
        />
      )}

      <div className="the khong-in">
        <CanCuLuanQue que={que} amLich={amLich} dungThan={dungThan} viTriHaoDong={viTriHaoDong} />
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
          <QueDichView
            que={que}
            vietNhanManh={dungThan}
            tieuDe="Quẻ chính"
            noiBatVach={viTriHaoDong}
            onXemChiTiet={onXemChiTietQue}
          />
          {que.queDichBien && (
            <QueDichView
              que={que.queDichBien}
              tieuDe="Quẻ biến"
              noiBatVach={viTriHaoDong ?? que.queBien}
              onXemChiTiet={onXemChiTietQue}
            />
          )}
        </div>
      </div>

      <div className="the khong-in">
        <p className="que-dich-cung">Cách khởi quẻ: {provenance}</p>
      </div>

      {children}

      <LuuYThamKhao />
    </>
  );
}
