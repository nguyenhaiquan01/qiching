import { describe, expect, it } from "vitest";
import { QueDich } from "../../queDich";
import { timQueKinhDich } from "../../data/queKinhDich";
import { lapQueTuCoinCasting } from "../adapter";
import type { KetQuaHaoXu } from "../types";

/** Dựng 1 KetQuaHaoXu tối thiểu — matXu chỉ mang tính minh hoạ, adapter chỉ đọc amDuong/dong. */
function haoXu(viTri: 1 | 2 | 3 | 4 | 5 | 6, amDuong: "Dương" | "Âm", dong: boolean): KetQuaHaoXu {
  return {
    viTri,
    matXu: amDuong === "Dương" ? ["Sấp", "Sấp", dong ? "Sấp" : "Ngửa"] : ["Ngửa", "Ngửa", dong ? "Ngửa" : "Sấp"],
    loai: dong ? (amDuong === "Dương" ? "LaoDuong" : "LaoAm") : amDuong === "Dương" ? "ThieuDuong" : "ThieuAm",
    amDuong,
    dong,
  };
}

/** Suy 6 KetQuaHaoXu (đúng vị trí hào động) khớp với một `QueDich` đã `giaiQue()` — dùng để
 * đối chiếu ngược adapter Coin Casting với engine Mai Hoa Dịch Số hiện có. */
function hao6TuQueDich(q: QueDich): KetQuaHaoXu[] {
  const ha = timQueKinhDich(q.tenQueHa);
  const thuong = timQueKinhDich(q.tenQueThuong);
  const nhiPhan: (0 | 1)[] = [ha.hao1, ha.hao2, ha.hao3, thuong.hao1, thuong.hao2, thuong.hao3];
  return nhiPhan.map((bit, idx) => {
    const viTri = (idx + 1) as 1 | 2 | 3 | 4 | 5 | 6;
    return haoXu(viTri, bit === 1 ? "Dương" : "Âm", viTri === q.queBien);
  });
}

describe("lapQueTuCoinCasting — đối chiếu với engine Mai Hoa Dịch Số hiện có (đúng 1 hào động)", () => {
  const moc = [
    new Date(2026, 0, 15, 8, 30),
    new Date(1984, 11, 16, 6, 0),
    new Date(2000, 5, 1, 23, 5),
  ];

  it.each(moc)("cùng thời điểm %s → quẻ chính/quẻ biến/điểm Lục Thân giống engine cũ", (thoiDiem) => {
    const cu = new QueDich(thoiDiem);
    cu.giaiQue();

    const hao6 = hao6TuQueDich(cu);
    const moi = lapQueTuCoinCasting(hao6, thoiDiem);

    expect(moi.viTriHaoDong).toEqual([cu.queBien]);
    expect(moi.queChinh.tenQueDich).toBe(cu.tenQueDich);
    expect(moi.queBien?.tenQueDich).toBe(cu.queDichBien?.tenQueDich);
    expect(moi.queChinh.diemLucThan).toEqual(cu.diemLucThan);
  });
});

describe("lapQueTuCoinCasting — trường hợp không có hào động (0 hào động, riêng của Coin Casting)", () => {
  it("6 hào tĩnh → không có Quẻ Biến, vẫn tính được điểm Lục Thân", () => {
    const hao6: KetQuaHaoXu[] = [
      haoXu(1, "Dương", false),
      haoXu(2, "Âm", false),
      haoXu(3, "Dương", false),
      haoXu(4, "Âm", false),
      haoXu(5, "Dương", false),
      haoXu(6, "Âm", false),
    ];
    const kq = lapQueTuCoinCasting(hao6, new Date(2026, 0, 1, 12, 0));

    expect(kq.viTriHaoDong).toEqual([]);
    expect(kq.queBien).toBeNull();
    expect(Object.values(kq.queChinh.diemLucThan).every((d) => Number.isFinite(d))).toBe(true);
  });
});

describe("lapQueTuCoinCasting — nhiều hào động cùng lúc (riêng của Coin Casting, engine cũ không hỗ trợ)", () => {
  it("2 hào động → Quẻ Biến đảo đúng cả 2 vị trí, điểm Lục Thân vẫn hữu hạn", () => {
    const hao6: KetQuaHaoXu[] = [
      haoXu(1, "Dương", false),
      haoXu(2, "Âm", false),
      haoXu(3, "Dương", true), // động
      haoXu(4, "Âm", false),
      haoXu(5, "Dương", true), // động
      haoXu(6, "Âm", false),
    ];
    const kq = lapQueTuCoinCasting(hao6, new Date(2026, 0, 1, 12, 0));

    expect(kq.viTriHaoDong).toEqual([3, 5]);
    expect(kq.queBien).not.toBeNull();
    expect(Object.values(kq.queChinh.diemLucThan).every((d) => Number.isFinite(d))).toBe(true);
  });

  it("6/6 hào động (toàn quẻ đảo ngược) vẫn lập được quẻ hợp lệ", () => {
    const hao6: KetQuaHaoXu[] = [1, 2, 3, 4, 5, 6].map((v) =>
      haoXu(v as 1 | 2 | 3 | 4 | 5 | 6, v % 2 === 0 ? "Âm" : "Dương", true),
    );
    const kq = lapQueTuCoinCasting(hao6, new Date(2026, 0, 1, 12, 0));

    expect(kq.viTriHaoDong).toEqual([1, 2, 3, 4, 5, 6]);
    expect(kq.queBien).not.toBeNull();
    expect(kq.queBien!.tenQueDich).not.toBe(kq.queChinh.tenQueDich);
  });
});

describe("lapQueTuCoinCasting — input không hợp lệ", () => {
  it("khác 6 hào → throw", () => {
    expect(() => lapQueTuCoinCasting([haoXu(1, "Dương", false)], new Date())).toThrow();
  });
});
