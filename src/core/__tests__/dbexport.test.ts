import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { QUE_KINH_DICH } from "../data/queKinhDich";
import { QUE_6_HAO_DATA } from "../data/que6Hao";
import { NAP_AM } from "../data/napAm";
import { GIAI_NGHIA_LUC_THAN } from "../data/lucThan";
import { tuongSinh, tuongKhac } from "../data/nguHanh";

/**
 * Test hồi quy đối chiếu trực tiếp với `DBexport/*.csv` — export thật từ `KinhDich.sdf` gốc
 * (không phải suy luận cổ điển). Đây là bộ test Giai đoạn 5 của kế hoạch migrate: nếu ai đó
 * sửa nhầm một giá trị trong `src/core/data/*.ts`, test này sẽ phát hiện ngay vì so trực
 * tiếp với nguồn gốc, không chỉ tự-nhất-quán nội bộ.
 *
 * Nếu thư mục `DBexport/` không tồn tại (ví dụ máy CI không có file export), các describe
 * dưới đây tự skip thay vì fail — export này là tài liệu tham chiếu cục bộ, không phải file
 * bắt buộc phải commit.
 */

const projectRoot = path.resolve(fileURLToPath(new URL("../../../", import.meta.url)));
const dbExportDir = path.join(projectRoot, "DBexport");

function parseCsv(content: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if (inQuotes) {
      if (ch === '"') {
        if (content[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && content[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...dataRows] = rows;
  return dataRows.map((r) => Object.fromEntries(header.map((h, i) => [h, r[i] ?? ""])));
}

function readCsvFixture(name: string): Record<string, string>[] | null {
  const filePath = path.join(dbExportDir, name);
  try {
    return parseCsv(readFileSync(filePath, "utf-8"));
  } catch {
    return null;
  }
}

const queKinhDichCsv = readCsvFixture("QueKinhDich.csv");
const que6HaoCsv = readCsvFixture("Que6Hao.csv");
const napAmCsv = readCsvFixture("NapAm.csv");
const lucThanCsv = readCsvFixture("LucThan.csv");
const nguHanhCsv = readCsvFixture("NguHanh.csv");

describe.skipIf(!queKinhDichCsv)("QueKinhDich.ts khớp DBexport/QueKinhDich.csv", () => {
  it("khớp toàn bộ 8 dòng", () => {
    for (const row of queKinhDichCsv!) {
      const match = QUE_KINH_DICH.find((r) => r.tenQue === row.TenQue);
      expect(match, `thiếu dòng cho "${row.TenQue}"`).toBeDefined();
      expect(match!.hao1).toBe(Number(row.Hao1));
      expect(match!.hao2).toBe(Number(row.Hao2));
      expect(match!.hao3).toBe(Number(row.Hao3));
      expect(match!.tenQueKinhDich).toBe(row.TenQueKinhDich);
      expect(match!.napGiapH1).toBe(row.NapGiapH1);
      expect(match!.napGiapH2).toBe(row.NapGiapH2);
      expect(match!.napGiapH3).toBe(row.NapGiapH3);
      expect(match!.napGiapH4).toBe(row.NapGiapH4);
      expect(match!.napGiapH5).toBe(row.NapGiapH5);
      expect(match!.napGiapH6).toBe(row.NapGiapH6);
    }
  });
});

describe.skipIf(!que6HaoCsv)("que6Hao.ts khớp DBexport/Que6Hao.csv", () => {
  it("khớp Cung/Quẻ Thượng/Quẻ Hạ/Hào Thế toàn bộ 64 dòng", () => {
    for (const row of que6HaoCsv!) {
      const match = QUE_6_HAO_DATA.find((r) => r.tenQue === row.TenQue);
      expect(match, `thiếu dòng cho "${row.TenQue}"`).toBeDefined();
      expect(match!.cung).toBe(row.Cung);
      expect(match!.queThuong).toBe(row.QueThuong);
      expect(match!.queHa).toBe(row.QueHa);
      expect(match!.haoThe).toBe(Number(row.HaoThe));
    }
  });
});

describe.skipIf(!napAmCsv)("napAm.ts khớp DBexport/NapAm.csv", () => {
  it("khớp tên Nạp Âm + Ngũ Hành toàn bộ 60 dòng", () => {
    for (const row of napAmCsv!) {
      const match = NAP_AM.find((r) => r.thienCan === row.ThienCan && r.diaChi === row.DiaChi);
      expect(match, `thiếu dòng cho "${row.ThienCan} ${row.DiaChi}"`).toBeDefined();
      expect(match!.tenNapAm).toBe(row.TenNapAm.trim());
      expect(match!.nguHanh).toBe(row.NguHanh);
    }
  });
});

describe.skipIf(!lucThanCsv)("lucThan.ts khớp DBexport/LucThan.csv", () => {
  it("khớp văn bản giải nghĩa nguyên văn", () => {
    for (const row of lucThanCsv!) {
      expect(GIAI_NGHIA_LUC_THAN[row.lucthan]).toBe(row.giainghia);
    }
  });
});

describe.skipIf(!nguHanhCsv)("nguHanh.ts khớp DBexport/NguHanh.csv", () => {
  it("khớp quan hệ Tương Sinh/Tương Khắc", () => {
    for (const row of nguHanhCsv!) {
      expect(tuongSinh(row.NguHanh, row.TuongSinh)).toBe(true);
      expect(tuongKhac(row.NguHanh, row.TuongKhac)).toBe(true);
    }
  });
});
