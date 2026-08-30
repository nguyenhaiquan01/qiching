import { describe, expect, it } from "vitest";
import { QUE_6_HAO_DATA } from "../data/que6Hao";
import { TIEN_THIEN } from "../const";

/**
 * Test tự-nhất-quán cho toàn bộ 64 dòng Que6Hao (không chỉ vài dòng đối chiếu bytes trực
 * tiếp ở business.test.ts) — bắt lỗi gõ nhầm Cung/HaoThe khi sửa file dữ liệu sau này.
 */
describe("QUE_6_HAO_DATA — tự nhất quán trên toàn bộ 64 dòng", () => {
  it("có đúng 64 dòng, tên quẻ không trùng lặp", () => {
    expect(QUE_6_HAO_DATA).toHaveLength(64);
    expect(new Set(QUE_6_HAO_DATA.map((r) => r.tenQue)).size).toBe(64);
  });

  it("Cung/Quẻ Thượng/Quẻ Hạ đều là 1 trong 8 quẻ đơn Tiên Thiên", () => {
    for (const row of QUE_6_HAO_DATA) {
      expect(TIEN_THIEN).toContain(row.cung);
      expect(TIEN_THIEN).toContain(row.queThuong);
      expect(TIEN_THIEN).toContain(row.queHa);
    }
  });

  it("Hào Thế trong khoảng 1-6", () => {
    for (const row of QUE_6_HAO_DATA) {
      expect(row.haoThe).toBeGreaterThanOrEqual(1);
      expect(row.haoThe).toBeLessThanOrEqual(6);
    }
  });

  it("mỗi Cung có đúng 8 quẻ, và quẻ thuần (queThuong=queHa=cung) có Hào Thế=6", () => {
    for (const cung of TIEN_THIEN) {
      const rows = QUE_6_HAO_DATA.filter((r) => r.cung === cung);
      expect(rows).toHaveLength(8);
      const thuan = rows.find((r) => r.queThuong === cung && r.queHa === cung);
      expect(thuan).toBeDefined();
      expect(thuan!.haoThe).toBe(6);
    }
  });

  it("mỗi Cung có Hào Thế phủ đúng tập {1,2,3(x2),4(x2),5,6} theo lý thuyết Bát Cung Quái", () => {
    for (const cung of TIEN_THIEN) {
      const haoThes = QUE_6_HAO_DATA.filter((r) => r.cung === cung)
        .map((r) => r.haoThe)
        .sort((a, b) => a - b);
      expect(haoThes).toEqual([1, 2, 3, 3, 4, 4, 5, 6]);
    }
  });
});
