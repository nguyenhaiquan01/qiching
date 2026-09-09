import { DANH_SACH_MUC_NOI_DUNG, type MucNoiDung } from "../ui/mucNoiDungQue";

/** Bộ chọn "mục nội dung muốn hiện" (Ý nghĩa chính/Thoán Từ/Đại Tượng Truyện/...) — dùng
 * chung ở trang chi tiết quẻ và trang danh sách 64 quẻ, xem `ui/mucNoiDungQue.ts` để biết vì
 * sao chuẩn hoá theo mục thay vì theo từng bản dịch giả. */
export function BoLocMucNoiDung({
  mucAn,
  onDoi,
}: {
  mucAn: Set<MucNoiDung>;
  onDoi: (id: MucNoiDung) => void;
}) {
  return (
    <div className="the khong-in">
      <h2>Mục hiển thị</h2>
      <div className="hang-chip" role="group" aria-label="Chọn mục nội dung muốn hiện">
        {DANH_SACH_MUC_NOI_DUNG.map((m) => {
          const dangHien = !mucAn.has(m.id);
          return (
            <button
              key={m.id}
              type="button"
              className={`chip-loc${dangHien ? " dang-hien" : ""}`}
              onClick={() => onDoi(m.id)}
              aria-pressed={dangHien}
            >
              <span className="chip-loc-cham" aria-hidden="true" />
              {m.nhan}
            </button>
          );
        })}
      </div>
    </div>
  );
}
