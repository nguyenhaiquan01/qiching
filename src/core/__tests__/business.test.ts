import { describe, expect, it } from "vitest";
import * as business from "../business";
import { tinhAmLich } from "../lunar";
import { QueDich } from "../queDich";
import { LUC_THAN } from "../const";

/**
 * Toàn bộ dữ liệu tra cứu (queKinhDich/que6Hao/napAm) đã điền dữ liệu thật, đối chiếu với
 * KinhDich.sdf gốc — xem data/README.md. Pipeline GiaiQue end-to-end test ở cuối file.
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

describe("GiaiQue end-to-end — an quẻ + luận giải chạy trọn pipeline không throw", () => {
  const moiNgayGio = [
    new Date(2024, 1, 10, 10, 0, 0), // ngày giờ thường
    new Date(2024, 1, 9, 23, 30, 0), // qua giờ 23h — đổi ngày âm lịch
    new Date(2000, 0, 1, 0, 0, 0),
    new Date(2025, 11, 31, 13, 45, 0),
  ];

  it.each(moiNgayGio)("an quẻ + giải quẻ cho %s không throw, kết quả hợp lệ", (time) => {
    const que = new QueDich(time);
    expect(() => que.giaiQue()).not.toThrow();

    // Đủ 5 Lục Thân, mỗi Lục Thân có điểm số hữu hạn (không còn NEGATIVE_INFINITY placeholder)
    for (const lt of LUC_THAN) {
      expect(Number.isFinite(que.diemLucThan[lt])).toBe(true);
    }

    // Hào 1-6 đều đã được Nạp Giáp: có lucthan/chi/nguhanh/napgiap không rỗng
    for (let i = 1; i <= 6; i++) {
      const hao = que.hao[i];
      expect(hao.lucthan).not.toBe("");
      expect(hao.chi).not.toBe("");
      expect(hao.nguhanh).not.toBe("");
      expect(hao.napgiap).toContain(hao.chi);
    }

    // Đúng một hào Thế, một hào Ứng, hai vị trí khác nhau
    const haoThePositions = [1, 2, 3, 4, 5, 6].filter((i) => que.hao[i].haoThe);
    const haoUngPositions = [1, 2, 3, 4, 5, 6].filter((i) => que.hao[i].haoUng);
    expect(haoThePositions).toHaveLength(1);
    expect(haoUngPositions).toHaveLength(1);
    expect(haoThePositions[0]).not.toBe(haoUngPositions[0]);
  });

  it("giaiQueCuocDoi cũng chạy được không throw", () => {
    const que = new QueDich(new Date(1990, 5, 15), true);
    expect(() => que.giaiQueCuocDoi()).not.toThrow();
    for (const lt of LUC_THAN) {
      expect(Number.isFinite(que.diemLucThan[lt])).toBe(true);
    }
  });

  it("biến quẻ (BienQue) cho ra quẻ đơn hợp lệ, khác quẻ gốc theo đúng hào động", () => {
    const que = new QueDich(new Date(2024, 5, 1, 14, 0, 0));
    const queThuongTruoc = que.tenQueThuong;
    const queHaTruoc = que.tenQueHa;
    que.bienQue();
    // Sau biến quẻ, ít nhất một trong hai quẻ đơn phải khác với trước (trừ khi hào động
    // trùng đúng giá trị cũ — về lý thuyết luôn đổi vì đảo bit 0/1)
    expect(que.tenQueThuong !== queThuongTruoc || que.tenQueHa !== queHaTruoc).toBe(true);
  });
});

/**
 * TODO (khuyến nghị, chưa bắt buộc — xem data/README.md): viết thêm test hồi quy so sánh
 * GiaiQue với kết quả CHẠY THẬT trên bản desktop (không chỉ kiểm tra không throw + hợp lệ về
 * cấu trúc như trên) trên nhiều mốc thời gian mẫu đặc thù (giao thừa, tháng nhuận, giờ
 * 23h-24h) — Giai đoạn 5 của kế hoạch migrate. Hiện độ tin cậy đến từ việc dữ liệu tra cứu đã
 * đối chiếu trực tiếp với KinhDich.sdf gốc (xem data/README.md), không phải từ so sánh kết
 * quả tính toán end-to-end với desktop.
 */
