import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router";
import App from "./App";

/**
 * Entry dùng lúc BUILD để prerender từng route ra HTML tĩnh (Giai đoạn B của
 * `project-brain/10-ke-hoach-seo.md`). Không có server runtime nào chạy cái này — nó chỉ chạy
 * một lần trong `scripts/prerender.mjs`, kết quả đổ ra `dist/<route>/index.html`.
 *
 * Vì `renderToString` chỉ dựng một CÂY CON (vào trong `<div id="root">`) chứ không dựng cả
 * `<html>`, các thẻ metadata mà React 19 lẽ ra hoist lên `<head>` sẽ nằm lẫn trong body. Việc
 * bóc chúng ra và chèn vào `<head>` do script prerender lo — xem `tachMetadata()` ở đó.
 */
export function render(duongDan: string): string {
  return renderToString(
    <StrictMode>
      <StaticRouter location={duongDan}>
        <App />
      </StaticRouter>
    </StrictMode>,
  );
}

/** Danh sách route cần prerender, sinh từ chính URL contract để không bao giờ lệch với router. */
export { DANH_SACH_DUONG_DAN } from "./ui/duongDan";

/** Xuất thêm cho script prerender dùng khi sinh redirect slug không chuẩn. */
export { DANH_SACH_QUE, duongDanQue, boDau } from "./ui/duongDan";

/** Dùng cho prerender: nạp sẵn bản dịch mặc định (Phan Bội Châu) để HTML tĩnh có kinh văn. */
export { datDuLieuPrerender, ID_THE_DU_LIEU } from "./ui/duLieuNhung";
export { NOI_DUNG_QUE_PHAN_BOI_CHAU } from "./core/data/noiDungQuePhanBoiChau";
