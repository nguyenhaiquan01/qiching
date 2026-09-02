import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";

const KHOANG_CACH = 6;
const LE_VIEWPORT = 8;
const RONG_TOI_DA = 420;
const CHIEU_CAO_TOI_THIEU = 120;

interface ViTriBang {
  left: number;
  top?: number;
  bottom?: number;
  maxHeight: number;
  width: number;
}

/**
 * Bọc một phần tử để hiện bảng thông tin khi rê chuột qua (dùng cho hover xem Giải nghĩa/
 * Dịch/Giảng của quẻ và Hào Từ của từng hào). Gắn onMouseEnter/onMouseLeave trên chính
 * wrapper (bao gồm cả trigger lẫn panel) thay vì dùng CSS `:hover` thuần — panel vẫn là phần
 * tử con trong DOM nên rê chuột từ trigger xuống panel không bị tính là "rời khỏi" wrapper.
 *
 * Panel định vị `position: fixed` (tính toán bằng JS theo `getBoundingClientRect` của trigger)
 * thay vì `absolute` — nếu dùng `absolute`, phần overflow của panel (nội dung dài) vẫn cộng
 * vào chiều cao cuộn của trang dù chỉ là hover, khiến trang bị "giật"/dịch chuyển khi rê chuột
 * vào các quẻ ở hàng cuối lưới 64 quẻ. `fixed` tách hẳn panel khỏi luồng layout của trang, và
 * panel tự lật lên trên khi không đủ chỗ bên dưới, luôn nằm gọn trong viewport.
 */
export function HoverInfo({
  trigger,
  children,
  triggerClassName,
  wrapperClassName,
}: {
  trigger: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
  /** Thêm class cho span bọc ngoài (`hover-boc`) — dùng khi vùng rê chuột cần to hơn/khác
   * mặc định inline-block, ví dụ bọc trọn một ô thẻ trong lưới. */
  wrapperClassName?: string;
}) {
  const [viTri, setViTri] = useState<ViTriBang | null>(null);
  const wrapRef = useRef<HTMLSpanElement>(null);

  // Đóng panel nếu trang cuộn/đổi kích thước trong lúc đang hiện — vị trí `fixed` không tự
  // bám theo trigger khi đó, đóng đi tránh panel "trôi" lệch khỏi vị trí.
  const dangHien = viTri !== null;
  useEffect(() => {
    if (!dangHien) return;
    const dong = () => setViTri(null);
    window.addEventListener("scroll", dong, { passive: true, capture: true });
    window.addEventListener("resize", dong);
    return () => {
      window.removeEventListener("scroll", dong, true);
      window.removeEventListener("resize", dong);
    };
  }, [dangHien]);

  const moChuot = () => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const rong = Math.min(RONG_TOI_DA, window.innerWidth - LE_VIEWPORT * 2);
    const left = Math.min(Math.max(rect.left, LE_VIEWPORT), window.innerWidth - rong - LE_VIEWPORT);

    const choDuoi = window.innerHeight - rect.bottom - KHOANG_CACH - LE_VIEWPORT;
    const choTren = rect.top - KHOANG_CACH - LE_VIEWPORT;

    if (choDuoi >= CHIEU_CAO_TOI_THIEU || choDuoi >= choTren) {
      setViTri({ left, top: rect.bottom + KHOANG_CACH, maxHeight: Math.max(CHIEU_CAO_TOI_THIEU, choDuoi), width: rong });
    } else {
      setViTri({
        left,
        bottom: window.innerHeight - rect.top + KHOANG_CACH,
        maxHeight: Math.max(CHIEU_CAO_TOI_THIEU, choTren),
        width: rong,
      });
    }
  };

  const dongChuot = () => setViTri(null);

  const style: CSSProperties | undefined = viTri
    ? {
        left: viTri.left,
        top: viTri.top,
        bottom: viTri.bottom,
        maxHeight: viTri.maxHeight,
        width: viTri.width,
      }
    : undefined;

  return (
    <span
      ref={wrapRef}
      className={`hover-boc${wrapperClassName ? ` ${wrapperClassName}` : ""}`}
      onMouseEnter={moChuot}
      onMouseLeave={dongChuot}
    >
      <span className={`hover-trigger${triggerClassName ? ` ${triggerClassName}` : ""}`}>
        {trigger}
      </span>
      {viTri && (
        <div className="hover-bang" style={style}>
          {children}
        </div>
      )}
    </span>
  );
}
