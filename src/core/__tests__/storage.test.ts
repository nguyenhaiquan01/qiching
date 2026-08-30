import { beforeEach, describe, expect, it } from "vitest";
import { luuQueInfo, taiDanhSachQueDaLuu, xoaQueInfo, exportQueInfoJSON, importQueInfoJSON } from "../storage";

/**
 * vitest chạy môi trường "node" mặc định (không có DOM) nên tự cấp một localStorage giả tối
 * thiểu cho test — storage.ts đã tự phòng thủ trường hợp `localStorage === undefined` (SSR),
 * nhưng cần localStorage thật (dù giả lập) để test được hành vi đọc/ghi thực sự.
 */
function taoLocalStorageGia(): Storage {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
    removeItem: (key: string) => void data.delete(key),
    clear: () => data.clear(),
    key: (index: number) => Array.from(data.keys())[index] ?? null,
    get length() {
      return data.size;
    },
  } as Storage;
}

beforeEach(() => {
  (globalThis as { localStorage?: Storage }).localStorage = taoLocalStorageGia();
});

describe("storage — quẻ đã lưu (localStorage)", () => {
  it("lưu rồi tải lại đúng thời điểm + bình chú", () => {
    const time = new Date(2024, 1, 10, 10, 0, 0);
    luuQueInfo({ time, binhchu: "Xem quẻ công việc" });

    const list = taiDanhSachQueDaLuu();
    expect(list).toHaveLength(1);
    expect(list[0].time.getTime()).toBe(time.getTime());
    expect(list[0].binhchu).toBe("Xem quẻ công việc");
  });

  it("danh sách sắp xếp mới nhất trước", () => {
    luuQueInfo({ time: new Date(2024, 1, 1), binhchu: "Cũ" });
    luuQueInfo({ time: new Date(2024, 1, 20), binhchu: "Mới" });

    const list = taiDanhSachQueDaLuu();
    expect(list.map((r) => r.binhchu)).toEqual(["Mới", "Cũ"]);
  });

  it("xoá theo thời điểm", () => {
    const time = new Date(2024, 1, 10);
    luuQueInfo({ time, binhchu: "Sẽ bị xoá" });
    expect(taiDanhSachQueDaLuu()).toHaveLength(1);

    xoaQueInfo(time);
    expect(taiDanhSachQueDaLuu()).toHaveLength(0);
  });

  it("export rồi import lại cho cùng kết quả", () => {
    luuQueInfo({ time: new Date(2024, 1, 10), binhchu: "A" });
    luuQueInfo({ time: new Date(2024, 1, 11), binhchu: "B" });

    const json = exportQueInfoJSON();
    (globalThis as { localStorage?: Storage }).localStorage = taoLocalStorageGia();
    importQueInfoJSON(json);

    expect(taiDanhSachQueDaLuu()).toHaveLength(2);
  });

  it("import từ chuỗi JSON không đúng định dạng thì báo lỗi rõ ràng", () => {
    expect(() => importQueInfoJSON("{}")).toThrow();
    expect(() => importQueInfoJSON('[{"time": 123}]')).toThrow();
  });
});
