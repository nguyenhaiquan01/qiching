import { describe, expect, it } from "vitest";
import * as business from "../business";
import { tinhAmLich } from "../lunar";

/**
 * que6Hao/napAm đã điền dữ liệu thật (đối chiếu bytes KinhDich.sdf, xem data/README.md) nên
 * có test riêng bên dưới. queKinhDich (Nạp Giáp Bát Quái) vẫn còn stub — pipeline GiaiQue
 * end-to-end (cần cả 3 bảng) vẫn chờ ở test.todo cuối file.
 */

describe("Ngũ Hành tương sinh/tương khắc", () => {
  it("Kim sinh Thủy", () => {
    expect(business.TuongSinh("Kim", "Thủy")).toBe(true);
    expect(business.TuongSinh("Thủy", "Kim")).toBe(false);
  });

  it("Kim khắc Mộc", () => {
    expect(business.TuongKhac("Kim", "Mộc")).toBe(true);
    expect(business.TuongKhac("Mộc", "Kim")).toBe(false);
  });
});

describe("findNguHanh — tra Ngũ Hành theo tên Can/Chi/Quái", () => {
  it("Thiên Can", () => {
    expect(business.findNguHanh("Giáp")).toBe("Mộc");
    expect(business.findNguHanh("Nhâm")).toBe("Thủy");
  });

  it("Địa Chi", () => {
    expect(business.findNguHanh("Tý")).toBe("Thủy");
    expect(business.findNguHanh("Dần")).toBe("Mộc");
  });

  it("Quẻ đơn Bát Quái", () => {
    expect(business.findNguHanh("Càn")).toBe("Kim");
    expect(business.findNguHanh("Khôn")).toBe("Thổ");
  });
});

describe("vị trí quẻ đơn", () => {
  it("Tiên Thiên", () => {
    expect(business.vitriTienThien("Càn")).toBe(0);
    expect(business.vitriTienThien("Khôn")).toBe(7);
  });

  it("Hậu Thiên", () => {
    expect(business.vitriHauThien("Ly")).toBe(0);
    expect(business.vitriHauThien("Khảm")).toBe(7);
  });
});

describe("Tuần Không", () => {
  it("ngày Giáp Tý → tuần không Tuất, Hợi (không quan trọng thứ tự — chỉ dùng so khớp)", () => {
    const [tk1, tk2] = business.tuanKhong("Giáp", "Tý");
    expect(new Set([tk1, tk2])).toEqual(new Set(["Tuất", "Hợi"]));
  });
});

describe("findThan — Lục Thần khởi theo Can ngày", () => {
  it("Giáp/Ất khởi Thanh Long", () => {
    expect(business.findThan("Giáp")).toBe("Long");
    expect(business.findThan("Ất")).toBe("Long");
  });

  it("Nhâm/Quý khởi Huyền Vũ", () => {
    expect(business.findThan("Nhâm")).toBe("Vũ");
    expect(business.findThan("Quý")).toBe("Vũ");
  });
});

describe("tinhAmLich — bọc lunar-calendar-ts-vi", () => {
  it("trả về đủ Can Chi Năm/Tháng/Ngày/Giờ + Tiết Khí + Giờ Hoàng Đạo", () => {
    const am = tinhAmLich(new Date(2024, 1, 10, 10, 0, 0)); // 10/2/2024
    expect(am.thienCanNgay).toBeTruthy();
    expect(am.diaChiNgay).toBeTruthy();
    expect(am.thienCanThang).toBeTruthy();
    expect(am.diaChiThang).toBeTruthy();
    expect(am.thienCanNam).toBeTruthy();
    expect(am.diaChiNam).toBeTruthy();
    expect(am.thienCanGio).toBeTruthy();
    expect(am.diaChiGio).toBeTruthy();
    expect(am.tietKhi).toBeTruthy();
    expect(am.gioHoangDao).toBeTruthy();
  });

  it("quy tắc đổi ngày: 23h tính sang Can Chi ngày của ngày kế tiếp", () => {
    const truoc23h = tinhAmLich(new Date(2024, 1, 10, 22, 59, 0));
    const sau23h = tinhAmLich(new Date(2024, 1, 10, 23, 0, 0));
    const ngayHomSau = tinhAmLich(new Date(2024, 1, 11, 10, 0, 0));
    expect(sau23h.diaChiNgay).toBe(ngayHomSau.diaChiNgay);
    expect(sau23h.diaChiNgay).not.toBe(truoc23h.diaChiNgay);
  });
});

describe("Que6Hao — Cung/Quẻ Thượng-Hạ/Hào Thế (đối chiếu bytes KinhDich.sdf)", () => {
  it("quẻ thuần: Cung = chính quẻ đó, Hào Thế = 6", () => {
    expect(business.findCungQueDich("Khảm", "Khảm")).toBe("Khảm");
    expect(business.findHaoThe("KHẢM VI THỦY")).toBe(6);
  });

  it("Phong Địa Quan (Càn cung, tứ thế) — đối chiếu trực tiếp bytes gốc", () => {
    expect(business.findTenQue6Hao("Tốn", "Khôn")).toBe("PHONG ĐỊA QUAN");
    expect(business.findCungQueDich("Tốn", "Khôn")).toBe("Càn");
    expect(business.findHaoThe("PHONG ĐỊA QUAN")).toBe(4);
  });

  it("Sơn Phong Cổ (Tốn cung, quy hồn — hạ quái quay về chính cung)", () => {
    expect(business.findTenQue6Hao("Cấn", "Tốn")).toBe("SƠN PHONG CỔ");
    expect(business.findCungQueDich("Cấn", "Tốn")).toBe("Tốn");
    expect(business.findHaoThe("SƠN PHONG CỔ")).toBe(3);
  });

  it("mỗi Hào Thế nằm trong khoảng 1-6", () => {
    expect(business.findHaoThe("CÀN VI THIÊN")).toBeGreaterThanOrEqual(1);
    expect(business.findHaoThe("CÀN VI THIÊN")).toBeLessThanOrEqual(6);
  });
});

describe.todo(
  "GiaiQue end-to-end đối chiếu với bản desktop — CẦN điền dữ liệu thật vào " +
    "src/core/data/queKinhDich.ts trước (Nạp Giáp Bát Quái — xem data/README.md), " +
    "sau đó viết bộ test hồi quy quét nhiều mốc thời gian so với kết quả bản C# gốc " +
    "(project-brain/05-ke-hoach-migrate-web.md, Giai đoạn 5).",
);
