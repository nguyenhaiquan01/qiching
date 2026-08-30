import type { AmLich } from "../core/lunar";
import { timNguHanhNapAm } from "../core/data/napAm";
import { classMauNguHanh } from "../ui/mauNguHanh";

/** Port từ amLichControl.cs — hiển thị Can Chi Giờ/Ngày/Tháng/Năm, tô màu theo Ngũ Hành Nạp
 * Âm của từng cặp Can Chi (không phải Ngũ Hành riêng của Chi), cùng ngày âm lịch/tiết khí/
 * giờ hoàng đạo. */
export function AmLichView({ amLich }: { amLich: AmLich }) {
  const oCanChi = (nhan: string, can: string, chi: string) => {
    const nguHanh = timNguHanhNapAm(can, chi);
    return (
      <div className="o">
        <span className="nhan">{nhan}</span>
        <span className={`gia-tri ${classMauNguHanh(nguHanh)}`}>
          {can} {chi}
        </span>
      </div>
    );
  };

  return (
    <div>
      <p>
        Ngày âm lịch: <strong>{amLich.ngayAm}/{amLich.thangAm}{amLich.thangNhuan ? " (nhuận)" : ""}/{amLich.namAm}</strong>
        {" — "}Tiết khí: <strong>{amLich.tietKhi}</strong>
        {" — "}Giờ hoàng đạo: <strong>{amLich.gioHoangDao}</strong>
      </p>
      <div className="luoi-can-chi">
        {oCanChi("Giờ", amLich.thienCanGio, amLich.diaChiGio)}
        {oCanChi("Ngày", amLich.thienCanNgay, amLich.diaChiNgay)}
        {oCanChi("Tháng", amLich.thienCanThang, amLich.diaChiThang)}
        {oCanChi("Năm", amLich.thienCanNam, amLich.diaChiNam)}
      </div>
    </div>
  );
}
