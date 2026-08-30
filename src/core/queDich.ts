/**
 * Port từ QueKinhDich/Business/QueDich.cs. Giữ nguyên cách đánh số hào 1-6 (mảng `hao` có
 * 7 phần tử, index 0 không dùng) để dễ đối chiếu trực tiếp với code C# gốc khi review.
 */
import { LUC_THAN, THAN } from "./const";
import { taoHaoMoi, type Hao } from "./types";
import { tinhAmLich, type AmLich } from "./lunar";
import * as business from "./business";

export class QueDich {
  hao: Hao[];
  diemLucThan: Record<string, number> = {};

  soQueThuong = 0;
  soQueHa = 0;
  queBien = 0;
  cung = "";
  tenQueThuong = "";
  tenQueHa = "";
  tenQueDich = "";

  private haoThe = 0;
  private haoUng = 0;
  private amLich: AmLich;

  queDichBien?: QueDich;
  queChu?: QueDich;

  /** Port từ constructor `QueDich(DateTime time)` — an quẻ theo thời điểm dương lịch. */
  constructor(time: Date);
  /** Port từ constructor `QueDich(DateTime time, string quethuong, string queha)`. */
  constructor(time: Date, queThuong: string, queHa: string);
  /** Port từ constructor `QueDich(DateTime time, bool cuocdoi)` — quẻ Cuộc Đời. */
  constructor(time: Date, cuocDoi: true);
  constructor(time: Date, arg2?: string | true, arg3?: string) {
    this.hao = [taoHaoMoi(), taoHaoMoi(), taoHaoMoi(), taoHaoMoi(), taoHaoMoi(), taoHaoMoi(), taoHaoMoi()];
    for (const lt of LUC_THAN) this.diemLucThan[lt] = Number.NEGATIVE_INFINITY;
    this.amLich = tinhAmLich(time);

    if (typeof arg2 === "string" && typeof arg3 === "string") {
      // QueDich(time, quethuong, queha)
      this.tenQueThuong = arg2;
      this.tenQueHa = arg3;
      this.queBien = 0;
      this.soQueThuong = business.vitriTienThien(arg2);
      this.soQueHa = business.vitriTienThien(arg3);
      this.tenQueDich = business.findTenQue6Hao(this.tenQueThuong, this.tenQueHa);
      this.cung = business.findCungQueDich(this.tenQueThuong, this.tenQueHa);
      this.napGiap();
      return;
    }

    if (arg2 === true) {
      // QueDich(time, cuocdoi)
      const kq = business.xacDinhQueCuocDoi(time, this.amLich);
      this.soQueThuong = kq.soQueThuong;
      this.soQueHa = kq.soQueHa;
      this.queBien = kq.queBien;
      this.tenQueThuong = kq.tenQueThuong;
      this.tenQueHa = kq.tenQueHa;
      this.tenQueDich = business.findTenQue6Hao(this.tenQueThuong, this.tenQueHa);
      this.cung = business.findCungQueDich(this.tenQueThuong, this.tenQueHa);
      this.napGiap();
      return;
    }

    // QueDich(time)
    const kq = business.xacDinhQueKinhDich(time, this.amLich);
    this.soQueThuong = kq.soQueThuong;
    this.soQueHa = kq.soQueHa;
    this.queBien = kq.queBien;
    this.tenQueThuong = kq.tenQueThuong;
    this.tenQueHa = kq.tenQueHa;
    this.tenQueDich = business.findTenQue6Hao(this.tenQueThuong, this.tenQueHa);
    this.cung = business.findCungQueDich(this.tenQueThuong, this.tenQueHa);
    this.napGiap();
  }

  /** Port từ QueDich.BienQue() */
  bienQue(): void {
    const { queBienThuong, queBienHa } = business.bienQue(this.soQueThuong, this.soQueHa, this.queBien);
    this.tenQueThuong = queBienThuong;
    this.tenQueHa = queBienHa;
    this.tenQueDich = business.findTenQue6Hao(this.tenQueThuong, this.tenQueHa);

    this.soQueThuong = business.findSoQueTienThien(this.tenQueThuong) - 1;
    this.soQueHa = business.findSoQueTienThien(this.tenQueHa) - 1;
    this.queBien = 0;

    this.napGiap();
  }

  private tinhTuanKhong(): void {
    const [tk1, tk2] = business.tuanKhong(this.amLich.thienCanNgay, this.amLich.diaChiNgay);
    for (let i = 1; i < 7; i++) this.hao[i].tuanKhong = false;
    for (let i = 1; i < 7; i++) {
      if (this.hao[i].chi === tk1 || this.hao[i].chi === tk2) this.hao[i].tuanKhong = true;
    }
    for (let i = 1; i < 7; i++) {
      if (this.hao[i].tuanKhong) this.hao[i].napgiap += "- Không";
    }
  }

  private tinhThan(): void {
    const thanHao1 = business.findThan(this.amLich.thienCanNgay);
    let j = THAN.indexOf(thanHao1 as (typeof THAN)[number]);
    for (let i = 1; i < 7; i++) {
      this.hao[i].than = THAN[j];
      j++;
    }
  }

  /** Port từ QueDich.NapGiap() */
  napGiap(): void {
    business.napGiapQueThuong(this.cung, this.tenQueThuong, this.hao[4], this.hao[5], this.hao[6]);
    business.napGiapQueHa(this.cung, this.tenQueHa, this.hao[1], this.hao[2], this.hao[3]);

    this.haoThe = business.findHaoThe(this.tenQueDich);
    const map: Record<number, number> = { 6: 3, 5: 2, 4: 1, 3: 6, 2: 5, 1: 4 };
    this.haoUng = map[this.haoThe];

    this.hao[this.haoThe].napgiap += " (Thế)";
    this.hao[this.haoThe].haoThe = true;
    this.hao[this.haoUng].napgiap += " (Ứng)";
    this.hao[this.haoUng].haoUng = true;

    this.tinhTuanKhong();
    this.tinhThan();
  }

  private tinhDiemMotHao(nguHanh: string, hao: Hao): void {
    if (nguHanh === hao.nguhanh) {
      hao.diemso += 2;
    } else if (business.TuongSinh(nguHanh, hao.nguhanh)) {
      hao.diemso += 2;
    } else if (business.TuongSinh(hao.nguhanh, nguHanh)) {
      hao.diemso -= 1; // mất sức do sinh
    } else if (business.TuongKhac(hao.nguhanh, nguHanh)) {
      hao.diemso -= 1; // mất sức do khắc
    } else if (business.TuongKhac(nguHanh, hao.nguhanh)) {
      hao.diemso -= 2; // bị ngày khắc
    }
  }

  private tinhDiemLucThan(): void {
    for (let i = 1; i < 7; i++) {
      const hienThoi = this.diemLucThan[this.hao[i].lucthan];
      this.diemLucThan[this.hao[i].lucthan] = Math.max(hienThoi, this.hao[i].diemso);
    }

    for (const [key, value] of Object.entries({ ...this.diemLucThan })) {
      if (value === Number.NEGATIVE_INFINITY) {
        // Không có hào nào mang Lục Thân này — lấy điểm từ Quẻ Chủ
        this.diemLucThan[key] = this.queChu!.diemLucThan[key];
      }
    }
  }

  private tinhDiemHao(laQueChu: boolean): void {
    for (let i = 1; i < 7; i++) {
      const nguHanhNgay = business.findNguHanh(this.amLich.diaChiNgay);
      this.tinhDiemMotHao(nguHanhNgay, this.hao[i]);

      const nguHanhThang = business.findNguHanh(this.amLich.diaChiThang);
      this.tinhDiemMotHao(nguHanhThang, this.hao[i]);

      // hao[0] là phần tử placeholder (nguhanh="") — khi queBien=0 (trường hợp Quẻ Chủ),
      // hành vi này khớp với bản gốc: hao[quebien].nguhanh trả về chuỗi rỗng.
      const nguHanhHaoDong = this.hao[this.queBien].nguhanh;
      this.tinhDiemMotHao(nguHanhHaoDong, this.hao[i]);

      if (laQueChu) {
        const nguHanhHaoBien = this.queDichBien!.hao[i].nguhanh;
        this.tinhDiemMotHao(nguHanhHaoBien, this.hao[i]);
      }
    }
  }

  /** Port từ QueDich.GiaiQue() — tính điểm vượng suy cho từng Lục Thân của quẻ. */
  giaiQue(): void {
    this.queDichBien = new QueDich(this.amLich.ngayDuongLich);
    this.queDichBien.bienQue();

    this.queChu = new QueDich(this.amLich.ngayDuongLich, this.cung, this.cung);
    this.queChu.tinhDiemHao(false);
    this.queChu.tinhDiemLucThan();

    this.tinhDiemHao(true);
    this.tinhDiemLucThan();
  }

  /** Port từ QueDich.GiaiQueCuocDoi() */
  giaiQueCuocDoi(): void {
    this.queDichBien = new QueDich(this.amLich.ngayDuongLich, true);
    this.queDichBien.bienQue();

    this.queChu = new QueDich(this.amLich.ngayDuongLich, this.cung, this.cung);
    this.queChu.tinhDiemHao(false);
    this.queChu.tinhDiemLucThan();

    this.tinhDiemHao(true);
    this.tinhDiemLucThan();
  }
}
