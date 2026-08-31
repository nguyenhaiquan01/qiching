# 04 – Công nghệ sử dụng

> Phiên bản và trạng thái được đối chiếu với `package.json`, cấu hình và working tree ngày 2026-08-31.

## 1. Stack bản web

| Nhóm | Công nghệ | Vai trò |
|---|---|---|
| UI runtime | React `19.2.8`, React DOM `19.2.8` | Render static SPA |
| Ngôn ngữ | TypeScript `~6.0.2` | Core, UI, worker và test |
| Build/dev server | Vite `8.2.2`, `@vitejs/plugin-react` `^6.1.0` | Dev server và production bundle |
| Lịch âm | `lunar-calendar-ts-vi` `^1.0.2` | Chuyển đổi âm lịch, Can Chi, Tiết Khí và giờ Hoàng Đạo qua wrapper `src/core/lunar.ts` |
| Test | Vitest `^4.1.11` | Unit/regression test trong môi trường Node mặc định |
| Lint | Oxlint `^1.79.0` | Static analysis, gồm rule React hooks |
| Deploy CLI | Wrangler `^4.127.1` | Deploy trực tiếp lên Cloudflare Pages |

`tsconfig.app.json` target ES2023 và dùng DOM APIs. Môi trường build/deploy cần **Node.js >=22.12** để đồng thời thỏa Vite 8 và Wrangler 4; repository chưa pin Node bằng `engines` hoặc `.nvmrc`.

## 2. Kiến trúc runtime

- Static SPA: không backend, API, ORM hay database server.
- Dữ liệu tra cứu được import từ module TS/JSON và bundle cùng ứng dụng.
- Điều hướng bằng React state, không dùng React Router.
- Tìm ngày tốt chạy trong Web Worker để tránh chặn UI thread.
- Dữ liệu người dùng lưu bằng `localStorage`; code hiện không dùng IndexedDB.
- In dùng `window.print()`, chia sẻ văn bản dùng Clipboard API.
- Hình hào được dựng bằng HTML/CSS, không dùng bitmap WinForms trong runtime web.

## 3. Tổ chức mã nguồn

| Thư mục | Nội dung |
|---|---|
| `src/core/` | engine TypeScript và adapter Web API, không phụ thuộc React |
| `src/core/data/` | bảng tính toán và nội dung tra cứu tĩnh |
| `src/core/coinCasting/` | model, mapping xu, adapter, storage và test gieo đồng xu |
| `src/pages/` | page-level state/orchestration |
| `src/components/` | component trình bày dùng lại |
| `src/ui/` | diễn giải dành cho UI, thuật ngữ, màu và theme |
| `DBexport/` | CSV đối chiếu dữ liệu SQL CE gốc |
| `legacy/` | source C# desktop và tài liệu nghiệp vụ |

## 4. Lưu trữ phía client

| Key `localStorage` | Loại dữ liệu |
|---|---|
| `qiching.queInfo.v1` | quẻ theo thời gian: ISO timestamp và bình chú |
| `qiching.coinCasting.v1` | raw sáu hào gieo xu, metadata và kết quả nhận diện |

Không có đồng bộ server. Export/import JSON hiện chỉ áp dụng cho quẻ theo thời gian; dữ liệu Coin Casting chưa có cơ chế backup tương ứng.

## 5. Lệnh phát triển và kiểm tra

| Lệnh | Tác dụng |
|---|---|
| `npm run dev` | chạy Vite dev server |
| `npm test` | chạy toàn bộ Vitest một lần |
| `npm run lint` | chạy Oxlint |
| `npm run build` | chạy `tsc -b` rồi tạo bundle production vào `dist/` |
| `npm run preview` | phục vụ local bundle production |
| `npm run deploy:uat` | build và deploy project Cloudflare Pages `qiching-uat` |
| `npm run deploy:prod` | build và deploy project Cloudflare Pages `qiching` |

Tại lần rà soát 2026-08-31, test, lint và build đều pass. Production JavaScript chính khoảng 728 kB minified; Vite cảnh báo chunk vượt 500 kB. `noiDungQue.json` là phần lớn dung lượng và có thể tách bằng lazy loading nếu cần.

## 6. Kiểm thử hiện có và khoảng trống

- 8 test file, 63 test tại thời điểm rà soát.
- Bao phủ core Mai Hoa Dịch Số, dữ liệu tĩnh chính, storage và Coin Casting.
- Storage test tự cấp mock `localStorage`; chưa chạy trong browser thật.
- Chưa có component test, accessibility test hay E2E test được check-in.
- Chưa có tập golden result lớn chạy song song với desktop cho lịch âm và toàn bộ pipeline luận quẻ.
- `dbexport.test.ts` chưa đối chiếu trực tiếp `CanChi.csv` và tự skip khi fixture không tồn tại.

## 7. Build và deployment

`vite.config.ts` hiện chỉ đăng ký React plugin, chưa cấu hình `base`, PWA hoặc custom code splitting. Hai script Wrangler là cơ chế deploy có sẵn; repository chưa có workflow CI/CD được check-in để tự deploy theo `git push`.

Xem runbook và trạng thái Cloudflare đã kiểm chứng tại [06-deployment.md](./06-deployment.md). Trạng thái script thực tế cũng được phản ánh trực tiếp từ `package.json`.

## 8. Công nghệ legacy

Bản desktop được giữ trong `legacy/` dùng:

- C# và .NET Framework 3.5;
- Windows Forms;
- SQL Server Compact Edition (`KinhDich.sdf`);
- typed DataSet/TableAdapter;
- ClickOnce và project MSI `.vdproj`.

Các công nghệ này không nằm trong runtime hoặc pipeline build của bản web. ASP.NET Core, EF Core, Docker, database server và thư viện PDF cũng không được dùng.
