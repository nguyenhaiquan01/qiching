# 05 – Kế hoạch và trạng thái migrate lên web

> Cập nhật theo working tree ngày 2026-08-31. Giai đoạn 1–4 của phạm vi migrate Kinh Dịch gốc đã có implementation; Giai đoạn 5 mới hoàn thành một phần.

## 1. Quyết định kiến trúc

- **Static SPA:** React + TypeScript + Vite; không backend, API hoặc database server.
- **Core chạy trong browser:** lịch âm, lập quẻ, Nạp Giáp, Lục Thân/Lục Thần, Tuần Không và vượng suy đều nằm trong `src/core/`.
- **Dữ liệu tĩnh:** bảng từ `KinhDich.sdf` được chuyển thành module TS/JSON và bundle ở build time.
- **Dữ liệu người dùng:** dùng `localStorage`; không dùng IndexedDB và không đồng bộ qua server.
- **Tác vụ dài:** tìm ngày tốt chạy bằng Web Worker.
- **Triển khai:** build thư mục `dist/`; có script Wrangler cho Cloudflare Pages. Chưa có CI/CD tự động theo `git push` trong repository.

Không migrate ASP.NET Core, EF Core, SQLite/Postgres, Docker, ClickOnce hoặc MSI vào runtime web. Mã C#/.NET 3.5 trong `legacy/` được giữ làm nguồn truy vết.

## 2. Bảng trạng thái

| Giai đoạn | Trạng thái | Kết quả hiện có | Còn thiếu |
|---|---|---|---|
| 1. Core TypeScript | Đã triển khai | `lunar.ts`, `business.ts`, `queDich.ts`, `const.ts`, model và test core | parity lịch/toàn pipeline với desktop trên tập lớn |
| 2. Dữ liệu tĩnh | Đã triển khai | `src/core/data/`, CSV trong `DBexport/`, test đối chiếu các bảng chính | test trực tiếp `CanChi.csv`; phân biệt rõ nội dung cohoc.net với dữ liệu SQL CE |
| 3. Lưu trữ client | Đã triển khai | localStorage cho quẻ theo thời gian và Coin Casting; export/import cho quẻ theo thời gian | validation schema chặt hơn; export/import Coin Casting |
| 4. React UI | Đã triển khai trong phạm vi gốc | Xem quẻ, Tìm ngày tốt, 64 quẻ, Quẻ đã lưu, Giới thiệu | component/E2E/accessibility test; hoàn tất và review phần gộp Coin Casting đang ở working tree |
| 5. Đối chiếu | Một phần | 8 test file/63 test pass; lint/build pass; fixture CSV và một số regression test | golden dataset desktop end-to-end, mốc lịch đặc biệt và test browser |

## 3. Giai đoạn 1 – Core TypeScript

### Đã làm

- `src/core/lunar.ts` dùng `getBlockLunarDate`, `getLunarDate` và `getFristZodiacHour` của `lunar-calendar-ts-vi`, bổ sung helper Can Chi giờ và quy tắc đổi ngày từ 23:00.
- `business.ts` port các hàm lập/biến quẻ, Nạp Giáp, Tuần Không, tra cứu và tìm ngày tốt.
- `queDich.ts` port model sáu hào, Thế/Ứng, Lục Thần và điểm vượng suy.
- `const.ts`, `types.ts` và các module dữ liệu thay thế hằng số/model C#.
- `timNgayTot.worker.ts` đưa vòng quét khỏi UI thread.

### Giới hạn xác minh

- `Date` dùng timezone cục bộ của browser; chưa có contract timezone IANA.
- Test lịch hiện kiểm tra shape và quy tắc 23h, chưa phải tập oracle độc lập lớn.
- `GiaiQue` chạy end-to-end nhưng kết quả vượng suy chưa được đối chiếu tự động với desktop trên hàng trăm mốc.

## 4. Giai đoạn 2 – Dữ liệu tra cứu tĩnh

Các bảng tính toán `QueKinhDich`, `Que6Hao`, `NapAm`, `LucThan`, `NguHanh` và dữ liệu Can/Chi đã được đưa vào `src/core/data/`. CSV xuất từ database gốc nằm trong `DBexport/`; `dbexport.test.ts` hiện đối chiếu năm nhóm đầu nhưng chưa đọc `CanChi.csv`.

`noiDungQue.json` là nguồn diễn giải riêng từ cohoc.net, không phải dữ liệu tính toán từ `KinhDich.sdf`. `QueCK`, form Xem ngày tổng quát và dữ liệu người dùng `InfoQue` cũ không được đưa vào engine web.

Không migrate bản ghi `InfoQue` cũ. Bản web lưu mới cặp thời điểm/bình chú và tính lại quẻ khi xem; nếu sau này cần giữ dữ liệu desktop thật thì phải export một lần bằng công cụ riêng.

## 5. Giai đoạn 3 – Lưu trữ client

| Luồng | Module/key | Trạng thái |
|---|---|---|
| Quẻ theo thời gian | `core/storage.ts` / `qiching.queInfo.v1` | lưu, tải, xóa, export/import JSON |
| Gieo đồng xu | `core/coinCasting/storage.ts` / `qiching.coinCasting.v1` | lưu raw sáu hào, tải và xóa; chưa export/import |

Hai schema cố ý tách riêng: quẻ theo thời gian có thể tính lại từ timestamp, còn quẻ đồng xu phải giữ raw casting data. Working tree hiện hợp nhất chúng ở tầng danh sách/xem lại, không hợp nhất storage schema.

Không có tài khoản hoặc đồng bộ nhiều thiết bị. Xóa cache/site data của browser có thể làm mất dữ liệu nếu chưa export.

## 6. Giai đoạn 4 – React UI

Năm mục điều hướng hiện tại:

1. **Xem quẻ:** trong working tree là orchestrator cho Theo thời gian và Gieo đồng xu; dùng chung Chủ đề/Câu hỏi và khối kết quả.
2. **Tìm ngày tốt:** quét bằng Web Worker, có tiến độ và hai chế độ bước thời gian.
3. **64 Quẻ Kinh Dịch:** danh sách và nội dung chi tiết.
4. **Quẻ đã lưu:** xem lại/xóa; working tree đang gộp hai loại quẻ ở presentation layer.
5. **Giới thiệu.**

Hình hào được vẽ bằng HTML/CSS. Màu Ngũ Hành giữ quy ước legacy nhưng được tách khỏi màu trạng thái UX. In dùng `window.print()`; không có thư viện PDF.

Phần gộp Coin Casting vẫn là thay đổi chưa commit tại thời điểm rà soát, xem [09 – Gộp Gieo đồng xu vào Xem quẻ](./09-gop-gieo-dong-xu-vao-xem-que.md).

## 7. Mở rộng sau migrate – Gieo ba đồng xu

Coin Casting không có trong WinForms gốc; đây là mở rộng sau migrate:

- ba đồng xu được gieo độc lập, không random trực tiếp bốn loại hào;
- hỗ trợ gieo trên màn hình hoặc nhập kết quả xu thật;
- adapter hỗ trợ 0–6 hào động và tái dùng `QueDich` cho Nạp Giáp/luận;
- có storage và test riêng;
- parity với engine cũ đã được test khi đúng một hào động, nhưng nhiều hào động chưa có oracle nghiệp vụ độc lập.

Tài liệu nguồn:

- [02.1 – Coin Casting Feature Specification](<./02.1.QIChing — Coin Casting Feature Specification.md>)
- [03.1 – Coin Casting UX Specification](<./03.1.QIChing — Coin Casting UX Specification.md>)
- [09 – Implementation review gộp vào Xem quẻ](./09-gop-gieo-dong-xu-vao-xem-que.md)

## 8. Giai đoạn 5 – Kiểm thử và đối chiếu

Tại lần rà soát 2026-08-31:

- `npm test`: 8/8 file, 63/63 test pass;
- `npm run lint`: pass;
- `npm run build`: pass, bundle JavaScript chính khoảng 728 kB và có cảnh báo chunk lớn;
- chưa có component/E2E test được check-in;
- chưa có golden dataset lớn đối chiếu lịch âm, Can Chi, tên quẻ, quẻ biến và điểm từng Lục Thân với desktop.

Không nên diễn giải việc fixture tĩnh khớp CSV hoặc pipeline “không throw” thành toàn bộ nghiệp vụ đã khớp 100% với desktop.

## 9. Phạm vi không migrate và backlog mới

| Hạng mục | Quyết định |
|---|---|
| ASP.NET/EF/database server/Docker | không dùng |
| ClickOnce/MSI/SVN | chỉ thuộc lịch sử desktop |
| Bình chú Chứng khoán | không migrate |
| Form Xem ngày cát/hung tổng quát | không migrate; khác trang Tìm ngày tốt theo quẻ |
| `VietnameseCalendarbak.cs` | chỉ là backup legacy |
| Tứ Trụ | không phải phần port từ form rỗng; đã chuyển thành backlog phát triển mới, xem [07](./07-tu-tru-tinh-toan.md) và [08](./08-tu-tru-thiet-ke-chuong-trinh.md) |

## 10. Thứ tự công việc còn lại

1. Hoàn tất review/commit phần gộp Coin Casting, kiểm tra lại hai luồng lưu và xem lại.
2. Tạo golden dataset từ desktop cho lịch âm và `GiaiQue`, gồm giao thừa, tháng nhuận, 22:59/23:00 và nhiều timezone runtime.
3. Thêm validation cho dữ liệu import/localStorage và invariant sáu hào Coin Casting.
4. Bổ sung test `CanChi.csv`, component/E2E và accessibility.
5. Cân nhắc lazy-load `noiDungQue.json` để giảm chunk ban đầu.
6. Chỉ triển khai Tứ Trụ sau khi chốt contract thời điểm sinh, ranh Tiết chính/Lập Xuân và sửa các blocker trong thiết kế 08.

## 11. Deployment hiện có

- `npm run deploy:uat`: build và deploy Cloudflare Pages project `qiching-uat`.
- `npm run deploy:prod`: build và deploy Cloudflare Pages project `qiching`.
- Repository chưa có workflow CI/CD được check-in; tự động deploy theo push chỉ xảy ra nếu được cấu hình ngoài repository tại nhà cung cấp hosting.

Xem thêm [06-deployment.md](./06-deployment.md).
