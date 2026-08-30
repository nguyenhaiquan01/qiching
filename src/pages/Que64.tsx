import { useState } from "react";
import { NOI_DUNG_QUE, type NoiDungQueRow } from "../core/data/noiDungQue";
import { DanhSachQue } from "./DanhSachQue";
import { ChiTietQue } from "./ChiTietQue";

const DANH_SACH = NOI_DUNG_QUE.slice().sort((a, b) => a.soThuTu - b.soThuTu);

/** Tab "64 Quẻ Kinh Dịch" — danh sách + chi tiết, tương tự cohoc.net/64-que-dich.html. */
export function Que64() {
  const [dangXem, setDangXem] = useState<NoiDungQueRow | null>(null);

  if (!dangXem) {
    return <DanhSachQue danhSach={DANH_SACH} onChon={setDangXem} />;
  }

  const viTri = DANH_SACH.findIndex((q) => q.tenQueChuan === dangXem.tenQueChuan);
  return (
    <ChiTietQue
      que={dangXem}
      quaTruoc={viTri > 0 ? DANH_SACH[viTri - 1] : undefined}
      quaSau={viTri < DANH_SACH.length - 1 ? DANH_SACH[viTri + 1] : undefined}
      onChon={setDangXem}
      onVeDanhSach={() => setDangXem(null)}
    />
  );
}
