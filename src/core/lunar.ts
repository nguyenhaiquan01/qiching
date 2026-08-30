/**
 * Bọc thư viện `lunar-calendar-ts-vi` (cùng gốc thuật toán Hồ Ngọc Đức / Meeus 1998 với
 * QueKinhDich/Business/VietnameseCalendar.cs + HQVietnameseCalendar.cs gốc — xem
 * project-brain/05-ke-hoach-migrate-web.md, Giai đoạn 1).
 *
 * Thay thế cho Business/NgayAmLich.cs: đóng gói ngày dương lịch input thành đầy đủ
 * Can Chi Năm/Tháng/Ngày/Giờ + Tiết Khí + Giờ Hoàng Đạo, áp dụng đúng quy tắc "giờ 23h
 * trở đi tính sang ngày kế tiếp" như bản gốc (HQVietnameseCalendar.NextAvailableDate).
 */
import { Lunar } from "lunar-calendar-ts-vi";
import { THIEN_CAN, DIA_CHI } from "./const";

const lunar = new Lunar();

export interface AmLich {
  ngayDuongLich: Date;
  namAm: number;
  thangAm: number;
  ngayAm: number;
  thangNhuan: boolean;

  thienCanNgay: string;
  diaChiNgay: string;
  thienCanThang: string;
  diaChiThang: string;
  thienCanNam: string;
  diaChiNam: string;
  thienCanGio: string;
  diaChiGio: string;

  tietKhi: string;
  gioHoangDao: string;
}

/**
 * Quy tắc đổi ngày đặc thù của bản gốc: nếu giờ nhập >= 23h, ngày dùng để tính Can Chi/
 * lịch âm là ngày kế tiếp (port từ HQVietnameseCalendar.NextAvailableDate, gọi lặp lại ở
 * nhiều hàm trong business.cs — ở đây gộp thành một helper dùng chung).
 */
function ngayDaChuanHoa(time: Date): Date {
  if (time.getHours() < 23) return time;
  const rolled = new Date(time);
  rolled.setDate(rolled.getDate() + 1);
  return rolled;
}

function tachCanChi(s: string): [string, string] {
  const [can, ...rest] = s.split(" ");
  return [can, rest.join(" ")];
}

/** Can Chi của giờ — không có sẵn trong lunar-calendar-ts-vi, tự viết theo công thức gốc
 * (HQVietnameseCalendar.cs, dòng comment `selestialStems[(jdn - 1) * 2 % 10]` — trùng khớp
 * với `Lunar.getFristZodiacHour` của thư viện, dùng lại thay vì viết riêng). */
function canChiGio(jdOfDay: number, hour: number): [string, string] {
  const canDauTy = lunar.getFristZodiacHour(jdOfDay); // Can của giờ Tý (23h-1h) ngày này
  const canDauTyIndex = THIEN_CAN.indexOf(canDauTy as (typeof THIEN_CAN)[number]);
  const chiIndex = Math.floor(((hour + 1) % 24) / 2) % 12;
  const canIndex = (canDauTyIndex + chiIndex + 10) % 10;
  return [THIEN_CAN[canIndex], DIA_CHI[chiIndex]];
}

/** Port từ `new NgayAmLich(time)` — điểm vào chính cho mọi tính toán lịch âm/Can Chi. */
export function tinhAmLich(time: Date): AmLich {
  const ngayTinh = ngayDaChuanHoa(time);
  const block = lunar.getBlockLunarDate(ngayTinh);

  const [thienCanNgay, diaChiNgay] = tachCanChi(block.lunarDateStr);
  const [thienCanThang, diaChiThangRaw] = tachCanChi(block.lunarMonthStr);
  const diaChiThang = diaChiThangRaw.replace(" (nhuận)", "");
  const [thienCanNam, diaChiNam] = tachCanChi(block.lunarYearStr);

  const lunarDate = lunar.getLunarDate(ngayTinh.getDate(), ngayTinh.getMonth() + 1, ngayTinh.getFullYear());
  const [thienCanGio, diaChiGio] = canChiGio(lunarDate.jd, time.getHours());

  return {
    ngayDuongLich: time,
    namAm: block.lunarYear,
    thangAm: block.lunarMonth,
    ngayAm: block.lunarDate,
    thangNhuan: lunarDate.leap === 1,
    thienCanNgay,
    diaChiNgay,
    thienCanThang,
    diaChiThang,
    thienCanNam,
    diaChiNam,
    thienCanGio,
    diaChiGio,
    tietKhi: block.airRetention,
    gioHoangDao: block.zodiacHour,
  };
}
