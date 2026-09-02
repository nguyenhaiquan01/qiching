import { describe, expect, it } from "vitest";
import { NOI_DUNG_QUE, timNoiDungQue } from "../data/noiDungQue";
import { QUE_6_HAO_DATA } from "../data/que6Hao";

describe("NOI_DUNG_QUE — nội dung 64 quẻ (cohoc.net)", () => {
  it("có đúng 64 dòng, tenQueChuan không trùng lặp", () => {
    expect(NOI_DUNG_QUE).toHaveLength(64);
    expect(new Set(NOI_DUNG_QUE.map((r) => r.tenQueChuan)).size).toBe(64);
  });

  it("mỗi tenQueChuan khớp đúng một dòng trong que6Hao.ts (Cung/Quẻ Thượng-Hạ/Hào Thế nhất quán)", () => {
    for (const r of NOI_DUNG_QUE) {
      const rowChuan = QUE_6_HAO_DATA.find((q) => q.tenQue === r.tenQueChuan);
      expect(rowChuan, `không tìm thấy "${r.tenQueChuan}" trong que6Hao.ts`).toBeDefined();
      expect(r.cung).toBe(rowChuan!.cung);
      expect(r.queThuong).toBe(rowChuan!.queThuong);
      expect(r.queHa).toBe(rowChuan!.queHa);
      expect(r.haoThe).toBe(rowChuan!.haoThe);
    }
  });

  it("mỗi quẻ có đủ 6 hào, đánh số 1-6 không trùng lặp", () => {
    for (const r of NOI_DUNG_QUE) {
      expect(r.haoTu).toHaveLength(6);
      expect(new Set(r.haoTu.map((h) => h.vach))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
      for (const h of r.haoTu) {
        expect(h.nhan).toBeTruthy();
        expect(h.noiDung.length).toBeGreaterThan(10);
      }
    }
  });

  it("giaiNghia/thoanTu.dich/thoanTu.giang không rỗng ở tất cả 64 quẻ", () => {
    for (const r of NOI_DUNG_QUE) {
      expect(r.giaiNghia, r.tenQueChuan).toBeTruthy();
      expect(r.thoanTu.dich, r.tenQueChuan).toBeTruthy();
      expect(r.thoanTu.giang, r.tenQueChuan).toBeTruthy();
    }
  });

  it("thoanTu.hanTu không rỗng ở mọi quẻ trừ Càn (trang nguồn thiếu)", () => {
    for (const r of NOI_DUNG_QUE) {
      if (r.tenQueChuan === "CÀN VI THIÊN") continue;
      expect(r.thoanTu.hanTu, r.tenQueChuan).toBeTruthy();
    }
  });

  it("chỉ Càn và Khôn có Dụng Cửu/Dụng Lục", () => {
    const coDungCuu = NOI_DUNG_QUE.filter((r) => r.dungCuu).map((r) => r.tenQueChuan);
    expect(new Set(coDungCuu)).toEqual(new Set(["CÀN VI THIÊN", "KHÔN VI ĐỊA"]));
  });

  it("timNoiDungQue tra đúng theo tenQueChuan", () => {
    expect(timNoiDungQue("CÀN VI THIÊN")?.tenQue).toBe("Thuần Càn");
    expect(timNoiDungQue("không tồn tại")).toBeUndefined();
  });
});
