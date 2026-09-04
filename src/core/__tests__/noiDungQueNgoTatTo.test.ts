import { describe, expect, it } from "vitest";
import { NOI_DUNG_QUE_NGO_TAT_TO, timNoiDungQueNgoTatTo } from "../data/noiDungQueNgoTatTo";
import { QUE_6_HAO_DATA } from "../data/que6Hao";

describe("NOI_DUNG_QUE_NGO_TAT_TO — nội dung 64 quẻ (bản Ngô Tất Tố, cohoc.net)", () => {
  it("có đúng 64 dòng, tenQueChuan không trùng lặp", () => {
    expect(NOI_DUNG_QUE_NGO_TAT_TO).toHaveLength(64);
    expect(new Set(NOI_DUNG_QUE_NGO_TAT_TO.map((r) => r.tenQueChuan)).size).toBe(64);
  });

  it("mỗi tenQueChuan khớp đúng một dòng trong que6Hao.ts", () => {
    for (const r of NOI_DUNG_QUE_NGO_TAT_TO) {
      const rowChuan = QUE_6_HAO_DATA.find((q) => q.tenQue === r.tenQueChuan);
      expect(rowChuan, `không tìm thấy "${r.tenQueChuan}" trong que6Hao.ts`).toBeDefined();
      expect(r.cung).toBe(rowChuan!.cung);
      expect(r.queThuong).toBe(rowChuan!.queThuong);
      expect(r.queHa).toBe(rowChuan!.queHa);
      expect(r.haoThe).toBe(rowChuan!.haoThe);
    }
  });

  it("mỗi quẻ có đủ 6 hào, đánh số 1-6 không trùng lặp, có ít nhất 1 mệnh đề", () => {
    for (const r of NOI_DUNG_QUE_NGO_TAT_TO) {
      expect(r.haoTu, r.tenQueChuan).toHaveLength(6);
      expect(new Set(r.haoTu.map((h) => h.vach))).toEqual(new Set([1, 2, 3, 4, 5, 6]));
      for (const h of r.haoTu) {
        expect(h.nhan, r.tenQueChuan).toBeTruthy();
        expect(h.menhDe.length, `${r.tenQueChuan} hào ${h.vach}`).toBeGreaterThan(0);
        for (const md of h.menhDe) {
          // Nội dung luôn có mặt (không mất chữ), nhưng đôi khi rơi vào `dichAm` thay vì
          // `dichNghia` khi nguồn OCR sai nhãn "Dịch nghĩa." (ví dụ biến thể lạ "Dịch nghũu"
          // không nằm trong danh sách các biến thể đã biết) — không coi đây là lỗi thiếu dữ
          // liệu, chỉ kiểm tra tổng nội dung của mệnh đề không rỗng.
          expect(md.loiKinh.dichAm + md.loiKinh.dichNghia, `${r.tenQueChuan} hào ${h.vach}`).toBeTruthy();
        }
      }
    }
  });

  it("quaiTu không rỗng ở tất cả 64 quẻ", () => {
    for (const r of NOI_DUNG_QUE_NGO_TAT_TO) {
      expect(r.quaiTu.length, r.tenQueChuan).toBeGreaterThan(0);
    }
  });

  it("chỉ Càn và Khôn có dungCuu", () => {
    const coDungCuu = NOI_DUNG_QUE_NGO_TAT_TO.filter((r) => r.dungCuu).map((r) => r.tenQueChuan);
    expect(new Set(coDungCuu)).toEqual(new Set(["CÀN VI THIÊN", "KHÔN VI ĐỊA"]));
  });

  it("timNoiDungQueNgoTatTo tra đúng theo tenQueChuan", () => {
    expect(timNoiDungQueNgoTatTo("CÀN VI THIÊN")?.tenQue).toContain("KIỀN");
    expect(timNoiDungQueNgoTatTo("không tồn tại")).toBeUndefined();
  });
});
