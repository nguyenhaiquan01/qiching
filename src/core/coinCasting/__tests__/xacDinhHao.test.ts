import { describe, expect, it } from "vitest";
import { xacDinhHaoTuXu } from "../xacDinhHao";
import type { MatXu } from "../types";

/** Mục 20 Feature Spec — QA decision table. */
describe("xacDinhHaoTuXu — decision table (mục 20 spec)", () => {
  it("3 Sấp → Lão Dương · Dương · Động", () => {
    const kq = xacDinhHaoTuXu(1, ["Sấp", "Sấp", "Sấp"]);
    expect(kq.loai).toBe("LaoDuong");
    expect(kq.amDuong).toBe("Dương");
    expect(kq.dong).toBe(true);
  });

  it("2 Sấp + 1 Ngửa → Thiếu Dương · Dương · Tĩnh", () => {
    const kq = xacDinhHaoTuXu(1, ["Sấp", "Sấp", "Ngửa"]);
    expect(kq.loai).toBe("ThieuDuong");
    expect(kq.amDuong).toBe("Dương");
    expect(kq.dong).toBe(false);
  });

  it("2 Ngửa + 1 Sấp → Thiếu Âm · Âm · Tĩnh", () => {
    const kq = xacDinhHaoTuXu(1, ["Ngửa", "Ngửa", "Sấp"]);
    expect(kq.loai).toBe("ThieuAm");
    expect(kq.amDuong).toBe("Âm");
    expect(kq.dong).toBe(false);
  });

  it("3 Ngửa → Lão Âm · Âm · Động", () => {
    const kq = xacDinhHaoTuXu(1, ["Ngửa", "Ngửa", "Ngửa"]);
    expect(kq.loai).toBe("LaoAm");
    expect(kq.amDuong).toBe("Âm");
    expect(kq.dong).toBe(true);
  });
});

describe("xacDinhHaoTuXu — permutation test (mục 20 spec): thứ tự 3 xu không ảnh hưởng kết quả", () => {
  const hoanViThieuDuong: [MatXu, MatXu, MatXu][] = [
    ["Sấp", "Sấp", "Ngửa"],
    ["Sấp", "Ngửa", "Sấp"],
    ["Ngửa", "Sấp", "Sấp"],
  ];

  it.each(hoanViThieuDuong)("%s %s %s → luôn Thiếu Dương", (...matXu) => {
    expect(xacDinhHaoTuXu(1, matXu as [MatXu, MatXu, MatXu]).loai).toBe("ThieuDuong");
  });

  const hoanViThieuAm: [MatXu, MatXu, MatXu][] = [
    ["Ngửa", "Ngửa", "Sấp"],
    ["Ngửa", "Sấp", "Ngửa"],
    ["Sấp", "Ngửa", "Ngửa"],
  ];

  it.each(hoanViThieuAm)("%s %s %s → luôn Thiếu Âm", (...matXu) => {
    expect(xacDinhHaoTuXu(1, matXu as [MatXu, MatXu, MatXu]).loai).toBe("ThieuAm");
  });
});
