import type { NoiDungQueRow } from "../core/data/noiDungQue";
import { duongDanQue } from "./duongDan";
import { GOC, OG_MAC_DINH, moTaQue } from "./metaNoiDung";

/**
 * Metadata theo từng route — xem `project-brain/10-ke-hoach-seo.md` Giai đoạn C.
 *
 * React 19 tự hoist `<title>`, `<meta>`, `<link>` render từ component lên `<head>` nên không
 * cần `react-helmet`. Vì thế `index.html` KHÔNG còn giữ title/description/canonical/OG tĩnh:
 * để cả hai nơi cùng khai sẽ thành metadata trùng và mâu thuẫn (yêu cầu 1 của Giai đoạn C).
 * Thẻ `google-site-verification` thì vẫn nằm ở `index.html` vì nó không đổi theo route.
 *
 * Bot xem trước liên kết không chạy JavaScript chỉ đọc được các thẻ này sau khi trang được
 * prerender (Giai đoạn B) — trước đó chúng chỉ phục vụ tab trình duyệt và Googlebot.
 */

export function MetaTrang({
  tieuDe,
  moTa,
  duongDan,
  khongIndex = false,
}: {
  tieuDe: string;
  moTa: string;
  /** Đường dẫn tuyệt đối trong site, ví dụ `/64-que`. Canonical luôn tự trỏ về chính nó. */
  duongDan: string;
  khongIndex?: boolean;
}) {
  const url = `${GOC}${duongDan === "/" ? "/" : duongDan}`;
  return (
    <>
      <title>{tieuDe}</title>
      <meta name="description" content={moTa} />
      <link rel="canonical" href={url} />
      {khongIndex && <meta name="robots" content="noindex, follow" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="QIChing" />
      <meta property="og:locale" content="vi_VN" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={tieuDe} />
      <meta property="og:description" content={moTa} />
      <meta property="og:image" content={OG_MAC_DINH} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="QIChing — Hiểu Dịch · Hiểu Thời · Hiểu Mình" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={tieuDe} />
      <meta name="twitter:description" content={moTa} />
      <meta name="twitter:image" content={OG_MAC_DINH} />
    </>
  );
}

export function MetaQue({ que }: { que: NoiDungQueRow }) {
  return (
    <MetaTrang
      tieuDe={`Quẻ ${que.soThuTu} ${que.tenQue} (${que.tenQueChuan}) — Kinh Dịch | QIChing`}
      moTa={moTaQue(que)}
      duongDan={duongDanQue(que)}
      // ĐƯỢC index từ 2026-09-04: gate G1 mở với phạm vi "bản Phan Bội Châu" — bản dịch đã hết
      // thời hạn bảo hộ (tác giả mất 1940, đời + 50 năm) và cũng chính là bản được prerender
      // vào HTML tĩnh, tức bản mà công cụ tìm kiếm đọc. Xem mục 3.1 của kế hoạch SEO.
    />
  );
}
