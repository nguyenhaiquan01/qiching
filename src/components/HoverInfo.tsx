import { useState, type ReactNode } from "react";

/**
 * Bọc một phần tử để hiện bảng thông tin khi rê chuột qua (dùng cho hover xem Giải nghĩa/
 * Dịch/Giảng của quẻ và Hào Từ của từng hào). Gắn onMouseEnter/onMouseLeave trên chính
 * wrapper (bao gồm cả trigger lẫn panel) thay vì dùng CSS `:hover` thuần — panel định vị
 * `position: absolute` nên có thể nằm ngoài khung layout của trigger, nhưng vẫn là phần tử
 * con trong DOM nên rê chuột từ trigger xuống panel không bị tính là "rời khỏi" wrapper.
 */
export function HoverInfo({
  trigger,
  children,
  triggerClassName,
}: {
  trigger: ReactNode;
  children: ReactNode;
  triggerClassName?: string;
}) {
  const [hien, setHien] = useState(false);

  return (
    <span
      className="hover-boc"
      onMouseEnter={() => setHien(true)}
      onMouseLeave={() => setHien(false)}
    >
      <span className={`hover-trigger${triggerClassName ? ` ${triggerClassName}` : ""}`}>
        {trigger}
      </span>
      {hien && <div className="hover-bang">{children}</div>}
    </span>
  );
}
