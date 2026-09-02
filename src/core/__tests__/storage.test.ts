import { beforeEach, describe, expect, it, vi } from "vitest";
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

  it("lưu kèm chủ đề/câu hỏi nếu có", () => {
    const time = new Date(2024, 1, 10, 10, 0, 0);
    luuQueInfo({ time, binhchu: "", chuDe: "Công danh", cauHoi: "Năm nay có thăng chức không?" });

    const list = taiDanhSachQueDaLuu();
    expect(list[0].chuDe).toBe("Công danh");
    expect(list[0].cauHoi).toBe("Năm nay có thăng chức không?");
  });

  it("không có chủ đề/câu hỏi thì không lưu 2 trường này", () => {
    luuQueInfo({ time: new Date(2024, 1, 10), binhchu: "Không có câu hỏi" });

    const list = taiDanhSachQueDaLuu();
    expect(list[0].chuDe).toBeUndefined();
    expect(list[0].cauHoi).toBeUndefined();
  });

  it("danh sách sắp xếp theo thời điểm LƯU (createdAt) mới nhất trước, không phải theo 'Ngày lập quẻ'", () => {
    // "Ngày lập quẻ" (time) của bản ghi lưu trước lại ở tương lai xa hơn — nhưng vì lưu trước
    // (createdAt sớm hơn) nên phải xếp sau bản ghi lưu sau.
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 5, 1));
    luuQueInfo({ time: new Date(2030, 1, 1), binhchu: "Lưu trước, lập quẻ cho ngày xa" });
    vi.setSystemTime(new Date(2024, 5, 2));
    luuQueInfo({ time: new Date(2020, 1, 1), binhchu: "Lưu sau, lập quẻ cho ngày gần" });
    vi.useRealTimers();

    const list = taiDanhSachQueDaLuu();
    expect(list.map((r) => r.binhchu)).toEqual(["Lưu sau, lập quẻ cho ngày gần", "Lưu trước, lập quẻ cho ngày xa"]);
    expect(list[0].createdAt.getTime()).toBeGreaterThan(list[1].createdAt.getTime());
  });

  it("xoá theo createdAt", () => {
    luuQueInfo({ time: new Date(2024, 1, 10), binhchu: "Sẽ bị xoá" });
    const [{ createdAt }] = taiDanhSachQueDaLuu();
    expect(taiDanhSachQueDaLuu()).toHaveLength(1);

    xoaQueInfo(createdAt);
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

  it("bản ghi cũ import từ JSON không có createdAt thì dùng time làm phương án dự phòng", () => {
    const time = new Date(2024, 1, 10);
    importQueInfoJSON(JSON.stringify([{ time: time.toISOString(), binhchu: "Bản ghi cũ" }]));

    const list = taiDanhSachQueDaLuu();
    expect(list[0].createdAt.getTime()).toBe(time.getTime());
  });

  it("import từ chuỗi JSON không đúng định dạng thì báo lỗi rõ ràng", () => {
    expect(() => importQueInfoJSON("{}")).toThrow();
    expect(() => importQueInfoJSON('[{"time": 123}]')).toThrow();
  });
});
