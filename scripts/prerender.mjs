/**
 * Prerender toàn bộ route hợp lệ ra HTML tĩnh — Giai đoạn B của
 * `legacy/project-brain/10-ke-hoach-seo.md`.
 *
 * Chạy sau `vite build` (client) và `vite build --ssr` (server). Với mỗi route:
 *   1. dựng HTML bằng `renderToString` từ `src/entry-server.tsx`
 *   2. BÓC các thẻ metadata ra khỏi body rồi chèn vào `<head>` — cần bước này vì
 *      `renderToString` chỉ dựng cây con nên React không có `<head>` để hoist vào
 *   3. ghi ra `dist/<route>/index.html`
 * Cuối cùng ghi `dist/404.html` để URL không hợp lệ trả HTTP 404 THẬT thay vì SPA fallback.
 *
 * Script tự kiểm tra và FAIL nếu phát hiện sai sót (yêu cầu "build phải fail nếu..." trong kế
 * hoạch): thiếu file route, thẻ metadata còn sót trong body, hay số lượng title/canonical sai.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const GOC_DU_AN = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const THU_MUC_DIST = join(GOC_DU_AN, "dist");

/** Các thẻ được phép nằm trong `<head>`; đúng những thẻ React render qua `MetaTrang`. */
const THE_METADATA = /<title>[\s\S]*?<\/title>|<meta\b[^>]*\/?>|<link\b[^>]*rel="canonical"[^>]*\/?>/g;

/**
 * Tách metadata khỏi phần thân đã render.
 *
 * Trả về `{ than, metadata }`. Chỉ bóc những thẻ khớp `THE_METADATA` — cố tình KHÔNG dùng
 * parser HTML đầy đủ để tránh thêm phụ thuộc; đổi lại phải kiểm tra kết quả ở cuối script.
 */
function tachMetadata(html) {
  const metadata = html.match(THE_METADATA) ?? [];
  const than = html.replace(THE_METADATA, "");
  return { than, metadata };
}

function kiemTraMetadata(duongDan, metadata) {
  const loi = [];
  const demTitle = metadata.filter((t) => t.startsWith("<title")).length;
  const demCanonical = metadata.filter((t) => t.includes('rel="canonical"')).length;
  const demMoTa = metadata.filter((t) => t.includes('name="description"')).length;
  if (demTitle !== 1) loi.push(`có ${demTitle} thẻ <title> (phải đúng 1)`);
  if (demCanonical !== 1) loi.push(`có ${demCanonical} thẻ canonical (phải đúng 1)`);
  if (demMoTa !== 1) loi.push(`có ${demMoTa} thẻ description (phải đúng 1)`);
  return loi.map((l) => `  ${duongDan}: ${l}`);
}

async function main() {
  const mauHtml = readFileSync(join(THU_MUC_DIST, "index.html"), "utf-8");
  const { render, DANH_SACH_DUONG_DAN } = await import(
    pathToFileURL(join(GOC_DU_AN, "dist-ssr", "entry-server.js")).href
  );

  if (!mauHtml.includes('<div id="root"></div>')) {
    throw new Error("Không tìm thấy `<div id=\"root\"></div>` trong dist/index.html — mẫu HTML đã đổi?");
  }

  const loi = [];
  const daGhi = [];

  for (const duongDan of [...DANH_SACH_DUONG_DAN, "/404"]) {
    const { than, metadata } = tachMetadata(render(duongDan));

    if (/<title|<meta\b|rel="canonical"/.test(than)) {
      loi.push(`  ${duongDan}: còn thẻ metadata sót lại trong <body> sau khi bóc`);
    }
    loi.push(...kiemTraMetadata(duongDan, metadata));

    const html = mauHtml
      .replace("</head>", `  ${metadata.join("\n    ")}\n  </head>`)
      .replace('<div id="root"></div>', `<div id="root">${than}</div>`);

    // `/404` -> dist/404.html (Cloudflare Pages dùng file này cho mọi URL không khớp).
    // Route khác -> dist/<path>/index.html
    const dich =
      duongDan === "/404"
        ? join(THU_MUC_DIST, "404.html")
        : duongDan === "/"
          ? join(THU_MUC_DIST, "index.html")
          : join(THU_MUC_DIST, duongDan.slice(1), "index.html");
    mkdirSync(dirname(dich), { recursive: true });
    writeFileSync(dich, html, "utf-8");
    daGhi.push(dich.replace(THU_MUC_DIST + "/", ""));
  }

  // Kiểm tra lại trên file thật: mọi route hợp lệ PHẢI có file, nếu thiếu mà vẫn thêm 404.html
  // thì route đó sẽ thành 404 thật khi lên Cloudflare.
  for (const duongDan of DANH_SACH_DUONG_DAN) {
    const f = join(THU_MUC_DIST, duongDan === "/" ? "index.html" : join(duongDan.slice(1), "index.html"));
    if (!existsSync(f)) loi.push(`  ${duongDan}: THIẾU file HTML — không được thêm 404.html khi còn thiếu`);
  }

  if (loi.length) {
    console.error("\n✗ Prerender phát hiện lỗi:\n" + loi.join("\n") + "\n");
    process.exit(1);
  }

  // --- Redirect cho các slug không chuẩn ---
  // Từ khi có `404.html`, SPA fallback tắt: `/64-que/46` không còn file nên sẽ trả 404 thay vì
  // được router nắn về canonical như trước. Vì vậy sinh redirect Ở TẦNG HOSTING. Dùng được vì
  // `_redirects` của Pages có hỗ trợ redirect theo ĐƯỜNG DẪN (đã kiểm chứng 2026-09-03; chỉ
  // phần match theo hostname là không hỗ trợ — xem `public/_redirects`).
  const { DANH_SACH_QUE, duongDanQue, boDau } = await import(
    pathToFileURL(join(GOC_DU_AN, "dist-ssr", "entry-server.js")).href
  ).then((m) => m.duongDan ?? m);

  const luat = [];

  // Chuẩn hoá dấu "/" thừa ở cuối ngay tại hosting. Nếu để client tự nắn thì trên URL có dấu
  // "/" người dùng sẽ thấy một lần điều hướng ngay lúc hydrate -> React báo mismatch. Ép về
  // canonical trước khi app chạy là sạch hơn.
  for (const d of DANH_SACH_DUONG_DAN) if (d !== "/") luat.push(`${d}/ ${d} 301`);

  const demTen = new Map();
  for (const q of DANH_SACH_QUE) demTen.set(boDau(q.tenQue), (demTen.get(boDau(q.tenQue)) ?? 0) + 1);
  for (const q of DANH_SACH_QUE) {
    const dich = duongDanQue(q);
    luat.push(`/64-que/${q.soThuTu} ${dich} 301`);
    // Chỉ thêm alias theo tên khi tên đó là duy nhất: "thuan-can" trùng giữa quẻ 1 và 52 nên
    // không có cách chọn đúng, để nguyên cho ra 404 còn hơn đoán bừa.
    const ten = boDau(q.tenQue);
    if (demTen.get(ten) === 1) luat.push(`/64-que/${ten} ${dich} 301`);
  }

  const duongDanRedirects = join(THU_MUC_DIST, "_redirects");
  const goc = existsSync(duongDanRedirects) ? readFileSync(duongDanRedirects, "utf-8").trimEnd() : "";
  writeFileSync(
    duongDanRedirects,
    `${goc}\n\n# --- Sinh tự động bởi scripts/prerender.mjs, đừng sửa tay ---\n` +
      `# Slug không chuẩn -> URL canonical. Cần từ khi có 404.html (SPA fallback tắt).\n` +
      luat.join("\n") +
      "\n",
    "utf-8",
  );
  console.log(`✓ Đã sinh ${luat.length} redirect slug không chuẩn vào dist/_redirects`);

  console.log(`✓ Đã prerender ${daGhi.length} file (gồm 404.html)`);
  console.log(`  ${DANH_SACH_DUONG_DAN.length} route hợp lệ + trang 404`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
