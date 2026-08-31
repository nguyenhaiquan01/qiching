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
 * Regression snapshot cho luồng "Tìm ngày tốt" (quét nhiều mốc thời gian, hiển thị Quẻ dịch +
 * Quẻ biến ở bảng kết quả). 16 mốc dưới đây lấy từ đúng bảng kết quả thật hiển thị trên UAT
 * (quét 2 giờ/lần, chủ đề Công việc/Công danh, 31/8-15/9/2026) — đã đối chiếu độc lập bằng
 * cách tính trực tiếp qua `new QueDich(time); q.giaiQue()` trước khi đưa vào đây, khớp đúng
 * 16/16 dòng. Đây là test hồi quy (khoá lại giá trị hiện tại để phát hiện thay đổi ngoài ý
 * muốn), KHÔNG PHẢI đối chiếu độc lập với bản desktop gốc (xem TODO bên dưới).
 */
describe("Quẻ dịch/Quẻ biến theo thời điểm — đối chiếu bảng kết quả \"Tìm ngày tốt\" thật", () => {
  const cac: [string, string, string][] = [
    ["2026-08-31T02:00", "THIÊN HỎA ĐỒNG NHÂN", "LY VI HỎA"],
    ["2026-08-31T04:00", "THIÊN LÔI VÔ VỌNG", "TRẠCH LÔI TÙY"],
    ["2026-08-31T20:00", "THIÊN LÔI VÔ VỌNG", "THIÊN TRẠCH LÝ"],
    ["2026-09-01T02:00", "TRẠCH LÔI TÙY", "THIÊN LÔI VÔ VỌNG"],
    ["2026-09-01T04:00", "TRẠCH PHONG ĐẠI QUÁ", "TRẠCH THIÊN QUẢI"],
    ["2026-09-01T20:00", "TRẠCH PHONG ĐẠI QUÁ", "TRẠCH THỦY KHỐN"],
    ["2026-09-03T00:00", "LÔI PHONG HẰNG", "LÔI THIÊN ĐẠI TRÁNG"],
    ["2026-09-03T02:00", "LÔI THỦY GIẢI", "LÔI ĐỊA DỰ"],
    ["2026-09-03T14:00", "CHẤN VI LÔI", "LÔI TRẠCH QUY MUỘI"],
    ["2026-09-03T16:00", "LÔI PHONG HẰNG", "LÔI THỦY GIẢI"],
    ["2026-09-03T22:00", "LÔI ĐỊA DỰ", "HỎA ĐỊA TẤN"],
    ["2026-09-04T20:00", "PHONG ĐỊA QUAN", "THỦY ĐỊA TỶ"],
    ["2026-09-05T12:00", "THỦY PHONG TỈNH", "KHẢM VI THỦY"],
    ["2026-09-06T08:00", "SƠN LÔI DI", "SƠN TRẠCH TỔN"],
    ["2026-09-06T10:00", "SƠN PHONG CỔ", "SƠN THỦY MÔNG"],
    ["2026-09-07T08:00", "ĐỊA PHONG THĂNG", "ĐỊA THỦY SƯ"],
  ];

  it.each(cac)("%s → Quẻ dịch %s, Quẻ biến %s", (isoNgayGio, tenQueDich, tenQueBien) => {
    const [ngay, gio] = isoNgayGio.split("T");
    const [y, m, d] = ngay.split("-").map(Number);
    const [h, min] = gio.split(":").map(Number);
    const que = new QueDich(new Date(y, m - 1, d, h, min, 0));
    que.giaiQue();

    expect(que.tenQueDich).toBe(tenQueDich);
    expect(que.queDichBien?.tenQueDich).toBe(tenQueBien);
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
