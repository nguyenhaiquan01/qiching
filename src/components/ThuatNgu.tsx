import { HoverInfo } from "./HoverInfo";
import { THUAT_NGU, type TenThuatNgu } from "../ui/thuatNgu";

/** Thuật ngữ chuyên môn kèm biểu tượng ⓘ — hover để xem giải nghĩa ngắn, không mở modal lớn
 * (mục 9 của `05.1. Chỉnh UI-UX.md`). */
export function ThuatNgu({ ten, hienThi }: { ten: TenThuatNgu; hienThi?: string }) {
  return (
    <HoverInfo
      trigger={
        <>
          {hienThi ?? ten}
          <span className="thuat-ngu-icon">ⓘ</span>
        </>
      }
    >
      <p>{THUAT_NGU[ten]}</p>
    </HoverInfo>
  );
}
