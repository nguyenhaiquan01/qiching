import { beforeEach, describe, expect, it } from "vitest";
import { luuGieoQue, taiDanhSachGieoQue, xoaGieoQue, type QueDaGieoDaLuu } from "../storage";

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

function mauQue(overrides: Partial<QueDaGieoDaLuu> = {}): QueDaGieoDaLuu {
  return {
    cheDoGieo: "MAN_HINH",
    hao: [],
    createdAt: new Date(2026, 0, 1, 12, 0).toISOString(),
    tenQueChinh: "CÀN VI THIÊN",
    tenQueBien: null,
    viTriHaoDong: [],
    ...overrides,
  };
}

describe("coinCasting/storage — quẻ gieo đồng xu đã lưu (localStorage)", () => {
  it("lưu rồi tải lại đúng dữ liệu", () => {
    luuGieoQue(mauQue({ cauHoi: "Tôi có nên đổi việc không?" }));
    const list = taiDanhSachGieoQue();
    expect(list).toHaveLength(1);
    expect(list[0].tenQueChinh).toBe("CÀN VI THIÊN");
    expect(list[0].cauHoi).toBe("Tôi có nên đổi việc không?");
  });

  it("danh sách sắp xếp mới nhất trước", () => {
    luuGieoQue(mauQue({ createdAt: new Date(2026, 0, 1).toISOString(), tenQueChinh: "Cũ" }));
    luuGieoQue(mauQue({ createdAt: new Date(2026, 0, 20).toISOString(), tenQueChinh: "Mới" }));
    const list = taiDanhSachGieoQue();
    expect(list[0].tenQueChinh).toBe("Mới");
    expect(list[1].tenQueChinh).toBe("Cũ");
  });

  it("xoá đúng bản ghi theo createdAt", () => {
    const mocXoa = new Date(2026, 0, 5).toISOString();
    luuGieoQue(mauQue({ createdAt: mocXoa }));
    luuGieoQue(mauQue({ createdAt: new Date(2026, 0, 6).toISOString() }));
    xoaGieoQue(mocXoa);
    expect(taiDanhSachGieoQue()).toHaveLength(1);
  });
});
