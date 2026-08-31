import { QueDich } from "../queDich";
import { tinhAmLich } from "../lunar";
import * as business from "../business";
import { timTenQueTheoHao } from "../data/queKinhDich";
import type { KetQuaHaoXu } from "./types";

export interface KetQuaLapQueCoinCasting {
  queChinh: QueDich;
  /** null khi không có hào động — trạng thái hợp lệ (mục 11 Feature Spec: "không cần tạo một
   * Quẻ Biến giả chỉ để giống Quẻ Chính"). */
  queBien: QueDich | null;
  /** 1-6, rỗng nếu không có hào động nào. */
  viTriHaoDong: number[];
}

/**
 * Chuyển 6 `KetQuaHaoXu` (từ Coin Casting) thành `QueDich` đầy đủ (Cung/Nạp Giáp/Thế-Ứng/
 * Tuần Không/Lục Thần/điểm vượng suy).
 *
 * KHÔNG đi qua `QueDich.giaiQue()`/`bienQue()` — hai hàm đó giả định đúng 1 hào động
 * (`this.queBien: number`), trong khi Coin Casting có thể ra 0, 1, hoặc nhiều hào động cùng
 * lúc (xem `project-brain/QIChing — Coin Casting Feature Specification.md`, mục 3.1.1).
 *
 * Thay vào đó tái dùng trực tiếp constructor tường minh `QueDich(time, queThuong, queHa)` —
 * constructor này không phụ thuộc quẻ được lập bằng phương pháp nào, nên dùng đúng cho cả
 * quẻ chính lẫn quẻ biến của Coin Casting.
 */
export function lapQueTuCoinCasting(hao6: KetQuaHaoXu[], thoiDiemLuanQue: Date): KetQuaLapQueCoinCasting {
  if (hao6.length !== 6) {
    throw new Error(`Cần đúng 6 hào để lập quẻ, hiện có ${hao6.length}.`);
  }

  const nhiPhanChinh = hao6.map((h) => (h.amDuong === "Dương" ? 1 : 0)) as (0 | 1)[];
  const viTriHaoDong = hao6.filter((h) => h.dong).map((h) => h.viTri);

  // Hào 1-3 = quẻ Hạ, Hào 4-6 = quẻ Thượng (đúng quy ước napGiapQueThuong/napGiapQueHa hiện có).
  const queChinh = new QueDich(
    thoiDiemLuanQue,
    timTenQueTheoHao(nhiPhanChinh[3], nhiPhanChinh[4], nhiPhanChinh[5]),
    timTenQueTheoHao(nhiPhanChinh[0], nhiPhanChinh[1], nhiPhanChinh[2]),
  );

  let queBien: QueDich | null = null;
  if (viTriHaoDong.length > 0) {
    const nhiPhanBien = hao6.map((h, i) => (h.dong ? ((1 - nhiPhanChinh[i]) as 0 | 1) : nhiPhanChinh[i]));
    queBien = new QueDich(
      thoiDiemLuanQue,
      timTenQueTheoHao(nhiPhanBien[3], nhiPhanBien[4], nhiPhanBien[5]),
      timTenQueTheoHao(nhiPhanBien[0], nhiPhanBien[1], nhiPhanBien[2]),
    );
  }

  tinhVuongSuyCoinCasting(queChinh, queBien, viTriHaoDong, thoiDiemLuanQue);

  return { queChinh, queBien, viTriHaoDong };
}

/**
 * Tổng quát hoá `QueDich.tinhDiemHao(true)` cho N hào động (0..6) thay vì đúng 1 — cùng cấu
 * trúc điểm với bản gốc (Nhật Kiến, Nguyệt Kiến, ngũ hành từng hào động, ngũ hành hào biến
 * cùng vị trí), chỉ khác ở chỗ lặp qua TẬP hào động thay vì một chỉ số `queBien` duy nhất.
 *
 * Không sửa logic đã có trong `queDich.ts`/`business.ts` — chỉ tái dùng `tinhDiemMotHao`/
 * `tinhDiemHao`/`tinhDiemLucThan` (đã nới sang public, xem `queDich.ts`) nguyên trạng cho
 * phần Quẻ Chủ. Khi `viTriHaoDong` có đúng 1 phần tử, vòng lặp bên dưới cho kết quả giống hệt
 * `tinhDiemHao(true)` gốc — xem test đối chiếu ở `__tests__/adapter.test.ts`.
 */
function tinhVuongSuyCoinCasting(
  queChinh: QueDich,
  queBien: QueDich | null,
  viTriHaoDong: number[],
  thoiDiem: Date,
): void {
  const amLich = tinhAmLich(thoiDiem);
  const nguHanhNgay = business.findNguHanh(amLich.diaChiNgay);
  const nguHanhThang = business.findNguHanh(amLich.diaChiThang);

  const queChu = new QueDich(thoiDiem, queChinh.cung, queChinh.cung);
  queChu.tinhDiemHao(false);
  queChu.tinhDiemLucThan();
  queChinh.queChu = queChu;

  for (let i = 1; i < 7; i++) {
    queChinh.tinhDiemMotHao(nguHanhNgay, queChinh.hao[i]);
    queChinh.tinhDiemMotHao(nguHanhThang, queChinh.hao[i]);

    for (const viTri of viTriHaoDong) {
      queChinh.tinhDiemMotHao(queChinh.hao[viTri].nguhanh, queChinh.hao[i]);
    }

    if (queBien) {
      queChinh.tinhDiemMotHao(queBien.hao[i].nguhanh, queChinh.hao[i]);
    }
  }

  queChinh.tinhDiemLucThan();
}
