import { vachAm } from "../ui/hinhQue";

/** Vẽ hình 6 vạch của một quẻ kép theo Quẻ Thượng/Hạ — dùng ở trang tra cứu tĩnh (không gắn
 * với thời điểm/Nạp Giáp cụ thể, khác với hình vẽ trong `QueDichView`). */
export function HinhQue({
  queThuong,
  queHa,
  cachDong,
}: {
  queThuong: string;
  queHa: string;
  /** Kích cỡ nhỏ gọn — dùng ở danh sách; mặc định cỡ vừa dùng ở trang chi tiết. */
  cachDong?: "gon";
}) {
  return (
    <div className={`hinh-que${cachDong === "gon" ? " gon" : ""}`}>
      {[6, 5, 4, 3, 2, 1].map((vach) => (
        <div className="hao-vach" key={vach}>
          {vachAm(queThuong, queHa, vach) ? (
            <>
              <span className="thanh" />
              <span className="thanh" />
            </>
          ) : (
            <span className="thanh" />
          )}
        </div>
      ))}
    </div>
  );
}
