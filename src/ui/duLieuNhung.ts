import type { NoiDungQuePhanBoiChauRow } from "../core/data/noiDungQuePhanBoiChau";

/**
 * Nhúng sẵn bản dịch mặc định của MỘT quẻ vào chính trang đã prerender.
 *
 * Vì sao cần: bản Phan Bội Châu là bản mặc định (được index) nhưng dữ liệu 64 quẻ nặng ~480KB
 * gzip nên không thể bundle tĩnh — làm vậy sẽ đẩy bundle chính từ ~245KB lên ~725KB. Mà nếu chỉ
 * lazy-load trong `useEffect` như hai bản còn lại thì effect KHÔNG chạy lúc prerender, HTML tĩnh
 * sẽ không có chữ nào của kinh văn — đúng thứ Giai đoạn B sinh ra để tránh.
 *
 * Cách giải: mỗi trang chỉ nhúng dữ liệu của CHÍNH quẻ đó (~7KB gzip) vào một thẻ
 * `<script type="application/json">`. Nhờ vậy:
 *   - lúc prerender: đọc từ biến do `scripts/prerender.mjs` nạp vào (`datDuLieuPrerender`)
 *   - lúc hydrate ở client: đọc đồng bộ từ thẻ script ngay trong lần render đầu, nên khớp HTML
 *     server, không gây hydration mismatch
 *   - khi người dùng tự đổi sang quẻ khác/bản dịch khác: rơi về cơ chế lazy-load sẵn có
 */

export const ID_THE_DU_LIEU = "du-lieu-que-pbc";

let duLieuPrerender: Map<string, NoiDungQuePhanBoiChauRow> | undefined;

/** Chỉ dùng trong `scripts/prerender.mjs`, trước khi render từng route. */
export function datDuLieuPrerender(m: Map<string, NoiDungQuePhanBoiChauRow>): void {
  duLieuPrerender = m;
}

/** Đọc bản Phan Bội Châu của một quẻ nếu đã có sẵn — không có thì trả `undefined` để nơi gọi
 * rơi về lazy-load. */
export function docBanPhanBoiChauNhung(tenQueChuan: string): NoiDungQuePhanBoiChauRow | undefined {
  if (duLieuPrerender) return duLieuPrerender.get(tenQueChuan);
  if (typeof document === "undefined") return undefined;
  const the = document.getElementById(ID_THE_DU_LIEU);
  if (!the?.textContent) return undefined;
  try {
    const duLieu = JSON.parse(the.textContent) as NoiDungQuePhanBoiChauRow;
    return duLieu?.tenQueChuan === tenQueChuan ? duLieu : undefined;
  } catch {
    return undefined;
  }
}
