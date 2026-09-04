import { describe, expect, it } from "vitest";
import { NOI_DUNG_QUE_PHAN_BOI_CHAU, timNoiDungQuePhanBoiChau } from "../data/noiDungQuePhanBoiChau";
import { QUE_6_HAO_DATA } from "../data/que6Hao";

describe("NOI_DUNG_QUE_PHAN_BOI_CHAU — nội dung 64 quẻ (bản Phan Bội Châu, cohoc.net)", () => {
  it("có đúng 64 dòng, tenQueChuan không trùng lặp", () => {
    expect(NOI_DUNG_QUE_PHAN_BOI_CHAU).toHaveLength(64);
    expect(new Set(NOI_DUNG_QUE_PHAN_BOI_CHAU.map((r) => r.tenQueChuan)).size).toBe(64);
  });

  it("mỗi tenQueChuan khớp đúng một dòng trong que6Hao.ts", () => {
    for (const r of NOI_DUNG_QUE_PHAN_BOI_CHAU) {
      const rowChuan = QUE_6_HAO_DATA.find((q) => q.tenQue === r.tenQueChuan);
      expect(rowChuan, `không tìm thấy "${r.tenQueChuan}" trong que6Hao.ts`).toBeDefined();
      expect(r.cung).toBe(rowChuan!.cung);
      expect(r.queThuong).toBe(rowChuan!.queThuong);
      expect(r.queHa).toBe(rowChuan!.queHa);
      expect(r.haoThe).toBe(rowChuan!.haoThe);
    }
  });

  it("mỗi quẻ có đủ 6 hào, đánh số 1-6 không trùng lặp, nội dung không rỗng", () => {
    for (const r of NOI_DUNG_QUE_PHAN_BOI_CHAU) {
      expect(r.haoTu, r.tenQueChuan).toHaveLength(6);
      expect(new Set(r.haoTu.map((h) => h.vach))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
      for (const h of r.haoTu) {
        expect(h.nhan, r.tenQueChuan).toBeTruthy();
        expect(h.noiDung, `${r.tenQueChuan} hào ${h.vach}`).toBeTruthy();
      }
    }
  });

  it("soanTu/soanTruyen/daiTuongTruyen không rỗng ở tất cả 64 quẻ", () => {
    for (const r of NOI_DUNG_QUE_PHAN_BOI_CHAU) {
      expect(r.soanTu, r.tenQueChuan).toBeTruthy();
      expect(r.soanTruyen, r.tenQueChuan).toBeTruthy();
      expect(r.daiTuongTruyen, r.tenQueChuan).toBeTruthy();
    }
  });

  it("tuQuai chỉ rỗng ở Càn và Khôn", () => {
    const khongCoTuQuai = NOI_DUNG_QUE_PHAN_BOI_CHAU.filter((r) => !r.tuQuai).map((r) => r.tenQueChuan);
    expect(new Set(khongCoTuQuai)).toEqual(new Set(["CÀN VI THIÊN", "KHÔN VI ĐỊA"]));
  });

  it("chỉ Càn và Khôn có vanNgon/dungCuu", () => {
    const coVanNgon = NOI_DUNG_QUE_PHAN_BOI_CHAU.filter((r) => r.vanNgon).map((r) => r.tenQueChuan);
    const coDungCuu = NOI_DUNG_QUE_PHAN_BOI_CHAU.filter((r) => r.dungCuu).map((r) => r.tenQueChuan);
    expect(new Set(coVanNgon)).toEqual(new Set(["CÀN VI THIÊN", "KHÔN VI ĐỊA"]));
    expect(new Set(coDungCuu)).toEqual(new Set(["CÀN VI THIÊN", "KHÔN VI ĐỊA"]));
  });

  it("timNoiDungQuePhanBoiChau tra đúng theo tenQueChuan", () => {
    expect(timNoiDungQuePhanBoiChau("CÀN VI THIÊN")?.tenQue).toContain("CÀN");
    expect(timNoiDungQuePhanBoiChau("không tồn tại")).toBeUndefined();
  });
});
