/**
 * Port từ QueKinhDich/Business/business.cs. Bỏ `LoadAllData` (chỉ warm cache cho DB, không
 * cần thiết khi dữ liệu đã là module TS load sẵn). `SaveQueInfo`/`ChuThichQueChungKhoan`/
 * `TaoQueCK` không port — xem project-brain/05-ke-hoach-migrate-web.md (InfoQue/QueCK
 * không migrate).
 */
import { DIA_CHI, THIEN_CAN, TIEN_THIEN, HAU_THIEN, TIET_LENH, ThoiDiem } from "./const";
import { tuongSinh, tuongKhac } from "./data/nguHanh";
import { nguHanhCua, lucThanKhoiTheoCanNgay } from "./data/canChi";
import { GIAI_NGHIA_LUC_THAN } from "./data/lucThan";
import { timQueKinhDich, timTenQueTheoHao, QUE_KINH_DICH } from "./data/queKinhDich";
import { timQue6Hao, timTenQue6Hao } from "./data/que6Hao";
import type { AmLich } from "./lunar";
import type { Hao } from "./types";

export { tuongSinh as TuongSinh, tuongKhac as TuongKhac };

/** business.cs:59-62 */
export function findThan(canNgay: string): string {
  return lucThanKhoiTheoCanNgay(canNgay);
}

/** business.cs:74-78 — findSoQueTienThien không đọc DB, chỉ tính từ vị trí trong mảng. */
export function findSoQueTienThien(quaBatQuai: string): number {
  return vitriTienThien(quaBatQuai) + 1;
}

export function findSoQueHauThien(quaBatQuai: string): number {
  return vitriHauThien(quaBatQuai) + 1;
}

export function yNghiaLucThan(lucThan: string): string {
  return GIAI_NGHIA_LUC_THAN[lucThan];
}

/** Chi năm âm lịch → chỉ số 1-12 (Tý=1 ... Hợi=12). business.cs:200-234. */
const CHI_INDEX_NAM: Record<string, number> = {
  "Tý": 1, "Sửu": 2, "Dần": 3, "Mão": 4, "Thìn": 5, "Tỵ": 6,
  "Ngọ": 7, "Mùi": 8, "Thân": 9, "Dậu": 10, "Tuất": 11, "Hợi": 12,
};

/** Chi tháng âm lịch → chỉ số 1-12, LỆCH so với Chi năm (Dần=tháng 1). business.cs:156-190. */
const CHI_INDEX_THANG: Record<string, number> = {
  "Tý": 11, "Sửu": 12, "Dần": 1, "Mão": 2, "Thìn": 3, "Tỵ": 4,
  "Ngọ": 5, "Mùi": 6, "Thân": 7, "Dậu": 8, "Tuất": 9, "Hợi": 10,
};

/** Can năm (dùng riêng cho quẻ Cuộc Đời) → chỉ số 1-10 (Giáp=1...Quý=10). business.cs:756-784. */
const CAN_INDEX_NAM: Record<string, number> = {
  "Giáp": 1, "Ất": 2, "Bính": 3, "Đinh": 4, "Mậu": 5,
  "Kỷ": 6, "Canh": 7, "Tân": 8, "Nhâm": 9, "Quý": 10,
};

interface KetQuaXacDinhQue {
  soQueThuong: number;
  soQueHa: number;
  queBien: number;
  tenQueThuong: string;
  tenQueHa: string;
}

function gioQuyDoi(hour: number): number {
  if (hour >= 23) return 1;
  const h = hour % 2 !== 0 ? (hour + 1) / 2 : hour / 2;
  return h + 1;
}

function tinhSoQueTuTong(soY: number, m: number, d: number, hour: number): KetQuaXacDinhQue {
  const soQueThuong0 = soY + m + d;
  const h = gioQuyDoi(hour);
  const soQueHa0 = soQueThuong0 + h;

  let quethuong = soQueThuong0 % 8;
  let queha = soQueHa0 % 8;
  let quebien = soQueHa0 % 6;

  quethuong = quethuong === 0 ? 7 : quethuong - 1;
  queha = queha === 0 ? 7 : queha - 1;
  if (quebien === 0) quebien = 6;

  return {
    soQueThuong: quethuong,
    soQueHa: queha,
    queBien: quebien,
    tenQueThuong: TIEN_THIEN[quethuong],
    tenQueHa: TIEN_THIEN[queha],
  };
}

/**
 * Port từ business.XacDinhQueKinhDich. `amLich` phải được tính từ `tinhAmLich(time)` —
 * đã áp dụng quy tắc đổi ngày 23h ở tầng lunar.ts, không lặp lại ở đây.
 */
export function xacDinhQueKinhDich(time: Date, amLich: AmLich): KetQuaXacDinhQue {
  let y = CHI_INDEX_NAM[amLich.diaChiNam];
  const m = CHI_INDEX_THANG[amLich.diaChiThang];
  const d = amLich.ngayAm;

  if (TIET_LENH && amLich.tietKhi.includes("Đại hàn") && m === 1) {
    y = y - 1;
  }

  return tinhSoQueTuTong(y, m, d, time.getHours());
}

/** Port từ business.XacDinhQueCuocDoi — giống trên nhưng dùng Thiên Can năm thay vì Địa Chi năm. */
export function xacDinhQueCuocDoi(time: Date, amLich: AmLich): KetQuaXacDinhQue {
  let y = CAN_INDEX_NAM[amLich.thienCanNam];
  const m = CHI_INDEX_THANG[amLich.diaChiThang];
  const d = amLich.ngayAm;

  if (TIET_LENH && amLich.tietKhi.includes("Đại hàn") && m === 1) {
    y = y - 1;
  }

  return tinhSoQueTuTong(y, m, d, time.getHours());
}

/** Port từ business.BienQue — biến hào để tính quẻ biến. */
export function bienQue(
  soQueThuong: number,
  soQueHa: number,
  queBien: number,
): { queBienThuong: string; queBienHa: string } {
  let hao1: 0 | 1, hao2: 0 | 1, hao3: 0 | 1;

  if (queBien > 3) {
    const queBienHa = TIEN_THIEN[soQueHa];
    const rowQueThuong = timQueKinhDich(TIEN_THIEN[soQueThuong]);
    hao1 = rowQueThuong.hao1;
    hao2 = rowQueThuong.hao2;
    hao3 = rowQueThuong.hao3;

    if (queBien === 4) hao1 = (1 - hao1) as 0 | 1;
    if (queBien === 5) hao2 = (1 - hao2) as 0 | 1;
    if (queBien === 6) hao3 = (1 - hao3) as 0 | 1;

    return { queBienThuong: timTenQueTheoHao(hao1, hao2, hao3), queBienHa };
  }

  const queBienThuong = TIEN_THIEN[soQueThuong];
  const rowQueHa = timQueKinhDich(TIEN_THIEN[soQueHa]);
  hao1 = rowQueHa.hao1;
  hao2 = rowQueHa.hao2;
  hao3 = rowQueHa.hao3;

  if (queBien === 1) hao1 = (1 - hao1) as 0 | 1;
  if (queBien === 2) hao2 = (1 - hao2) as 0 | 1;
  if (queBien === 3) hao3 = (1 - hao3) as 0 | 1;

  return { queBienThuong, queBienHa: timTenQueTheoHao(hao1, hao2, hao3) };
}

/** Port từ business.NapGiap — xác định Lục Thân của một hào từ quan hệ sinh/khắc Ngũ Hành. */
export function napGiapLucThan(nguHanhHao: string, nguHanhQue: string): string {
  let napgiaphao = "";
  if (nguHanhHao === nguHanhQue) napgiaphao = "Huynh Đệ";
  if (tuongSinh(nguHanhHao, nguHanhQue)) napgiaphao = "Phụ Mẫu";
  if (tuongSinh(nguHanhQue, nguHanhHao)) napgiaphao = "Tử Tôn";
  if (tuongKhac(nguHanhHao, nguHanhQue)) napgiaphao = "Quan Quỷ";
  if (tuongKhac(nguHanhQue, nguHanhHao)) napgiaphao = "Thê Tài";
  return napgiaphao;
}

/** Port từ business.findNapGiapQueThuong — Nạp Giáp cho hào 4/5/6. */
export function napGiapQueThuong(cungQue: string, queThuong: string, hao4: Hao, hao5: Hao, hao6: Hao): void {
  const nguHanhQue = nguHanhCua(cungQue);
  const row = timQueKinhDich(queThuong);

  const nguHanhHao4 = nguHanhCua(row.napGiapH4);
  const nguHanhHao5 = nguHanhCua(row.napGiapH5);
  const nguHanhHao6 = nguHanhCua(row.napGiapH6);

  hao4.lucthan = napGiapLucThan(nguHanhHao4, nguHanhQue);
  hao5.lucthan = napGiapLucThan(nguHanhHao5, nguHanhQue);
  hao6.lucthan = napGiapLucThan(nguHanhHao6, nguHanhQue);

  hao4.chi = row.napGiapH4;
  hao5.chi = row.napGiapH5;
  hao6.chi = row.napGiapH6;

  hao4.nguhanh = nguHanhHao4;
  hao5.nguhanh = nguHanhHao5;
  hao6.nguhanh = nguHanhHao6;

  hao4.napgiap = `${hao4.lucthan} ${row.napGiapH4} ${nguHanhHao4}`;
  hao5.napgiap = `${hao5.lucthan} ${row.napGiapH5} ${nguHanhHao5}`;
  hao6.napgiap = `${hao6.lucthan} ${row.napGiapH6} ${nguHanhHao6}`;
}

/** Port từ business.findNapGiapQueHa — Nạp Giáp cho hào 1/2/3. */
export function napGiapQueHa(cungQue: string, queHa: string, hao1: Hao, hao2: Hao, hao3: Hao): void {
  const nguHanhQue = nguHanhCua(cungQue);
  const row = timQueKinhDich(queHa);

  const nguHanhHao1 = nguHanhCua(row.napGiapH1);
  const nguHanhHao2 = nguHanhCua(row.napGiapH2);
  const nguHanhHao3 = nguHanhCua(row.napGiapH3);

  hao1.lucthan = napGiapLucThan(nguHanhHao1, nguHanhQue);
  hao2.lucthan = napGiapLucThan(nguHanhHao2, nguHanhQue);
  hao3.lucthan = napGiapLucThan(nguHanhHao3, nguHanhQue);

  hao1.chi = row.napGiapH1;
  hao2.chi = row.napGiapH2;
  hao3.chi = row.napGiapH3;

  hao1.nguhanh = nguHanhHao1;
  hao2.nguhanh = nguHanhHao2;
  hao3.nguhanh = nguHanhHao3;

  hao1.napgiap = `${hao1.lucthan} ${row.napGiapH1} ${nguHanhHao1}`;
  hao2.napgiap = `${hao2.lucthan} ${row.napGiapH2} ${nguHanhHao2}`;
  hao3.napgiap = `${hao3.lucthan} ${row.napGiapH3} ${nguHanhHao3}`;
}

/** Port từ business.findCungQueDich */
export function findCungQueDich(queThuong: string, queHa: string): string {
  const tenQue = findTenQue6Hao(queThuong, queHa);
  return timQue6Hao(tenQue).cung;
}

export function findTenQue6Hao(queThuong: string, queHa: string): string {
  return timTenQue6Hao(queThuong, queHa);
}

export function findHaoThe(queDich: string): number {
  return timQue6Hao(queDich).haoThe;
}

export function findNguHanh(ten: string): string {
  return nguHanhCua(ten);
}

/** Port từ business.TuanKhong — tính 2 Địa Chi rơi vào "tuần không" của ngày xem quẻ. */
export function tuanKhong(thienCanNgay: string, diaChiNgay: string): [string, string] {
  let j = DIA_CHI.indexOf(diaChiNgay as (typeof DIA_CHI)[number]);
  let i = 0;
  while (THIEN_CAN[i] !== thienCanNgay) {
    i++;
    j--;
    if (i > 9) i = 0;
    if (j < 0) j = 11;
  }
  const tuankhong1 = DIA_CHI[j - 1 < 0 ? 11 : j - 1];
  const tuankhong2 = DIA_CHI[j - 2 < 0 ? (j - 2 + 12) : j - 2];
  return [tuankhong1, tuankhong2];
}

/** business.cs:525-530 */
export function vitriTienThien(que: string): number {
  return TIEN_THIEN.indexOf(que as (typeof TIEN_THIEN)[number]);
}

/** business.cs:537-542 */
export function vitriHauThien(que: string): number {
  return HAU_THIEN.indexOf(que as (typeof HAU_THIEN)[number]);
}

/**
 * Port từ business.ThoiDiemKeTiep — ĐƠN GIẢN HÓA so với bản gốc: dùng thẳng phép cộng giờ/
 * ngày của `Date` (tự động xử lý tràn ngày/tháng/năm) thay vì hàm thủ công
 * `HQVietnameseCalendar.NextAvailableDate`, vì hai cách cho cùng một kết quả lịch dương —
 * không phải thay đổi nghiệp vụ, chỉ là dùng API chuẩn của nền tảng thay vì tự viết lại
 * phép cộng ngày thủ công.
 */
export function thoiDiemKeTiep(thoiDiem: ThoiDiem, ngay: Date): Date {
  const ket = new Date(ngay);
  switch (thoiDiem) {
    case ThoiDiem.HaiGio:
      ket.setHours(ket.getHours() + 2);
      break;
    case ThoiDiem.Gio:
      ket.setHours(ket.getHours() + 1);
      break;
    case ThoiDiem.Ngay:
      ket.setDate(ket.getDate() + 1);
      break;
    case ThoiDiem.Thang:
      ket.setDate(ket.getDate() + 31);
      break;
  }
  return ket;
}

/** Port từ business.TimNgayTot — quét khoảng thời gian tìm ngày "tốt" cho một việc (Lục Thân). */
export function timNgayTot(
  ngayBatDau: Date,
  ngayKetThuc: Date,
  viec: string,
  giaiQue: (time: Date) => Record<string, number>,
): Date[] {
  const ngayTot: Date[] = [];
  let ngayDuyet = ngayBatDau;

  while (ngayDuyet.getTime() < ngayKetThuc.getTime()) {
    const diemLucThan = giaiQue(ngayDuyet);
    if (diemLucThan[viec] > 3) ngayTot.push(new Date(ngayDuyet));
    ngayDuyet = thoiDiemKeTiep(ThoiDiem.HaiGio, ngayDuyet);
  }

  return ngayTot;
}

export { QUE_KINH_DICH };
