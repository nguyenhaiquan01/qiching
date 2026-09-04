import { describe, expect, it } from "vitest";
import {
  DANH_SACH_QUE,
  boDau,
  duongDanQue,
  phanGiaiSlugQue,
  slugQue,
  timQueTheoTenChuan,
} from "../duongDan";

describe("boDau", () => {
  it("bỏ dấu tiếng Việt và đưa về slug ASCII", () => {
    expect(boDau("Địa Phong Thăng")).toBe("dia-phong-thang");
    expect(boDau("Thuần Càn")).toBe("thuan-can");
    expect(boDau("Lôi Trạch Quy Muội")).toBe("loi-trach-quy-muoi");
  });

  it("xử lý được đ/Đ — thứ ký tự `normalize('NFD')` không tách ra dấu", () => {
    expect(boDau("Đoài")).toBe("doai");
    expect(boDau("đồng")).toBe("dong");
  });
});

describe("slugQue", () => {
  it("gồm số thứ tự ở đầu", () => {
    const que1 = DANH_SACH_QUE[0];
    expect(que1.soThuTu).toBe(1);
    expect(slugQue(que1)).toBe("1-thuan-can");
  });

  it("mọi slug của 64 quẻ đều duy nhất", () => {
    const tatCa = DANH_SACH_QUE.map(slugQue);
    expect(new Set(tatCa).size).toBe(64);
  });

  it("chính là lý do phải có số: bỏ số đi thì đụng nhau", () => {
    // Quẻ 1 "Thuần Càn" và quẻ 52 "Thuần Cấn" cùng ra `thuan-can`.
    const chiTen = DANH_SACH_QUE.map((q) => boDau(q.tenQue));
    expect(new Set(chiTen).size).toBe(63);
  });
});

describe("phanGiaiSlugQue", () => {
  it("khớp chính xác slug canonical", () => {
    const kq = phanGiaiSlugQue("46-dia-phong-thang");
    expect(kq.trangThai).toBe("khop");
    if (kq.trangThai === "khop") expect(kq.que.soThuTu).toBe(46);
  });

  it("phân giải được cả 64 slug canonical", () => {
    for (const que of DANH_SACH_QUE) {
      const kq = phanGiaiSlugQue(slugQue(que));
      expect(kq.trangThai).toBe("khop");
      if (kq.trangThai === "khop") expect(kq.que.tenQueChuan).toBe(que.tenQueChuan);
    }
  });

  it("phân biệt được quẻ 1 và quẻ 52 dù phần chữ giống hệt nhau", () => {
    const q1 = phanGiaiSlugQue("1-thuan-can");
    const q52 = phanGiaiSlugQue("52-thuan-can");
    expect(q1.trangThai).toBe("khop");
    expect(q52.trangThai).toBe("khop");
    if (q1.trangThai === "khop" && q52.trangThai === "khop") {
      expect(q1.que.soThuTu).toBe(1);
      expect(q52.que.soThuTu).toBe(52);
      expect(q1.que.tenQueChuan).not.toBe(q52.que.tenQueChuan);
    }
  });

  it("chỉ có số thì redirect về canonical", () => {
    const kq = phanGiaiSlugQue("46");
    expect(kq.trangThai).toBe("canRedirect");
    if (kq.trangThai === "canRedirect") {
      expect(kq.que.soThuTu).toBe(46);
      expect(kq.duongDanChuan).toBe("/64-que/46-dia-phong-thang");
    }
  });

  it("số đúng nhưng phần chữ SAI thì coi như không tồn tại, không redirect", () => {
    // Hosting không có file tĩnh cho URL bịa ra nên trả 404; client phải nói cùng một thứ, nếu
    // không sẽ vừa lệch hydration vừa cho URL bịa "sống" bằng 301.
    for (const slug of ["46-sai-be-bet", "46-dia-phong", "46-"]) {
      expect(phanGiaiSlugQue(slug).trangThai).toBe("khongThay");
    }
  });

  it("slug chỉ có tên, khớp duy nhất một quẻ thì redirect về canonical", () => {
    const kq = phanGiaiSlugQue("dia-phong-thang");
    expect(kq.trangThai).toBe("canRedirect");
    if (kq.trangThai === "canRedirect") expect(kq.duongDanChuan).toBe("/64-que/46-dia-phong-thang");
  });

  it("slug chỉ có tên nhưng khớp 2 quẻ thì coi như không thấy — không đoán bừa", () => {
    expect(phanGiaiSlugQue("thuan-can").trangThai).toBe("khongThay");
  });

  it("số ngoài khoảng 1-64 và rác thì không thấy", () => {
    for (const slug of ["0-abc", "65-abc", "99", "khong-ton-tai", ""]) {
      expect(phanGiaiSlugQue(slug).trangThai).toBe("khongThay");
    }
    expect(phanGiaiSlugQue(undefined).trangThai).toBe("khongThay");
  });

  it("không phân biệt hoa thường và bỏ qua khoảng trắng thừa", () => {
    expect(phanGiaiSlugQue("  46-DIA-PHONG-THANG  ").trangThai).toBe("khop");
  });
});

describe("timQueTheoTenChuan", () => {
  it("tra được theo tên chuẩn dùng bên phần tính toán", () => {
    const que = timQueTheoTenChuan("CÀN VI THIÊN");
    expect(que?.soThuTu).toBe(1);
    expect(duongDanQue(que!)).toBe("/64-que/1-thuan-can");
  });

  it("mọi tenQueChuan đều tra ngược ra được đường dẫn", () => {
    for (const que of DANH_SACH_QUE) {
      expect(timQueTheoTenChuan(que.tenQueChuan)).toBeDefined();
    }
  });
});
