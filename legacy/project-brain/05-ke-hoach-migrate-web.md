# 05 – Kế hoạch migrate lên ứng dụng web

## Quyết định kiến trúc đã chốt (cập nhật)

- **Kiến trúc:** Static SPA — **không backend, không API, không database server**. Toàn bộ logic (an quẻ, lịch âm, vượng suy) chạy trong trình duyệt bằng TypeScript.
- **Frontend:** React + TypeScript (Vite), build ra file tĩnh.
- **Lưu trữ:** `localStorage`/IndexedDB của trình duyệt thay cho database — phù hợp vì đây là công cụ cá nhân một người dùng, không cần chia sẻ dữ liệu giữa nhiều thiết bị/người dùng qua server.
- **Bảng tra cứu tĩnh** (Thiên Can, Địa Chi, Nạp Giáp, Ngũ Hành, Lục Thân, Nạp Âm, 64 quẻ...) → nhúng thẳng vào code dưới dạng module TS (JSON/object), build-time, không cần truy vấn DB lúc chạy.
- **Không migrate:** ASP.NET Core, EF Core, SQLite/Postgres, ClickOnce, `.vdproj`/MSI installer, Docker.
- **Lý do đổi hướng:** stack cũ (ASP.NET Core + React + SQLite + Docker) có nhiều tầng công nghệ (2 ngôn ngữ, backend framework, ORM, containerize, volume persistent) không cần thiết cho một ứng dụng cá nhân/nghiên cứu ít người dùng. Static SPA loại bỏ hoàn toàn tầng server, giảm chi phí về 0 và đơn giản hóa deploy còn một lệnh `git push`.

## Đánh đổi cần lưu ý

- **Rủi ro cao nhất: kết quả lịch âm/Can Chi lệch với bản desktop.** Để giảm rủi ro này, phần chuyển đổi âm-dương/Can Chi/Tiết khí/Giờ hoàng đạo sẽ **dùng thư viện npm `lunar-calendar-ts-vi` thay vì tự viết lại** (xem Giai đoạn 1) — thư viện này là bản port TypeScript của cùng thuật toán thiên văn (Jean Meeus 1998 / Hồ Ngọc Đức) mà `VietnameseCalendar.cs`/`HQVietnameseCalendar.cs` gốc cũng dựa trên (cả hai đều dùng công thức `JulianDayNumber` + `SunLongitude` giống nhau). Vẫn bắt buộc có bộ test hồi quy đối chiếu kết quả với bản gốc trên một tập lớn mốc thời gian mẫu (xem Giai đoạn 5), vì thư viện ít người dùng, không có "social proof" về độ chính xác.
- **Phần an quẻ (Mai Hoa Dịch Số), Nạp Giáp, Lục Thân, Lục Thần, Tuần Không, vượng suy vẫn phải tự viết lại bằng TypeScript** — không có thư viện nào hỗ trợ phần nghiệp vụ đặc thù này, chỉ phần lịch âm nền tảng là tận dụng được thư viện có sẵn.
- **Đa thiết bị:** dữ liệu "quẻ đã lưu" nằm trong `localStorage` của từng trình duyệt — không tự động đồng bộ giữa máy tính và điện thoại. Nếu sau này cần đồng bộ nhiều thiết bị, có thể thêm tùy chọn export/import file JSON thủ công (không cần server).

## Giai đoạn 1 — Dựng tầng nghiệp vụ bằng TypeScript

Mục tiêu: một package TS thuần (`src/core/`), không phụ thuộc React, chỉ nhận/trả về kiểu dữ liệu thuần (string, number, Date, interface/type).

**Phần lịch âm — dùng thư viện `lunar-calendar-ts-vi` (npm, MIT) thay vì tự viết:**

- Cùng gốc thuật toán thiên văn (Jean Meeus 1998 / Hồ Ngọc Đức, dùng `JulianDayNumber` + `SunLongitude`) với `Business/VietnameseCalendar.cs`/`HQVietnameseCalendar.cs` gốc — xác nhận bằng cách đọc code cả hai bên, không chỉ tin theo README.
- API thư viện dùng được trực tiếp: `getLunarDate` (chuyển đổi âm-dương, thay `NgayAmLich.cs`), `getZodiac` (Can Chi năm/tháng/ngày), `getAirRetention(jd)` (tiết khí), `getZodiacHour`/`getFristZodiacHour` (giờ hoàng đạo).
- Thiếu Can Chi giờ riêng — tự viết thêm 1 hàm nhỏ (công thức 1 dòng, tham chiếu `HQVietnameseCalendar.cs` dòng `selestialStems[(jdn-1)*2 % 10]`).
- Vì package nhỏ/ít người dùng, **đọc trực tiếp source code** (`src/lib/util.ts`, `lunar.ts` trên GitHub, chỉ vài trăm dòng) thay vì coi là hộp đen, và bắt buộc chạy bộ test hồi quy đối chiếu với bản desktop trước khi tin dùng (xem Giai đoạn 5).
- Bỏ qua `VietnameseCalendarbak.cs` (bản backup cũ, không dùng) và toàn bộ `VietnameseCalendar.cs`/`HQVietnameseCalendar.cs`/`NgayAmLich.cs` gốc — chỉ dùng làm tài liệu đối chiếu, không port.

**Phần nghiệp vụ đặc thù — không có thư viện nào hỗ trợ, vẫn phải tự viết bằng TS**, tham chiếu logic gốc trong `QueKinhDich/Business/*.cs`:

| Nguồn tham chiếu (C#) | Vai trò | Việc cần làm khi viết lại bằng TS |
|---|---|---|
| `Business/business.cs` | Nghiệp vụ lõi: `XacDinhQueKinhDich`, `BienQue`, `NapGiap`, `TuanKhong`, `TimNgayTot`, `XacDinhQueCuocDoi`... | Viết lại thành các hàm thuần TS, giữ nguyên tên/chữ ký logic để dễ đối chiếu, đọc kỹ code C# gốc làm đặc tả. Phần `TuanKhong` gọi Can Chi ngày → lấy từ `lunar-calendar-ts-vi` thay vì tự tính. |
| `Business/QueDich.cs` | Model quẻ dịch: constructor theo thời điểm, `BienQue()`, `NapGiap()`, `GiaiQue()`, `GiaiQueCuocDoi()` | Viết lại thành class/factory function TS, đây là phần trung tâm dùng lại ở hầu hết màn hình. |
| `Business/Hao.cs`, `Business/QueInfo.cs` | Model hào, model lưu quẻ | Viết lại thành `interface`/`type` TS. |
| `Const.cs` | Bảng tra cứu tĩnh (Thiên Can, Địa Chi, Tiên Thiên, Hậu Thiên, Ngũ Hành, Lục Thân...) và ngưỡng `Vuong`/`Hung` | Chuyển thành các module TS export hằng số/object tra cứu. Bỏ mọi phần liên quan `myForm` (tham chiếu WinForms). |

Đầu ra giai đoạn này: chạy được bộ test (Vitest) xác nhận lịch âm/can chi/an quẻ khớp 100% với bản desktop trên một tập ngày giờ mẫu (khuyến nghị vài trăm mốc thời gian ngẫu nhiên, bao gồm các mốc đặc thù: giao thừa, tháng nhuận, giờ 23h-24h).

## Giai đoạn 2 — Chuẩn bị dữ liệu tra cứu tĩnh

- Export toàn bộ bảng trong `KinhDich.sdf` (`QueKinhDich`, `Que6Hao`, `CanChi`, `NguHanh`, `LucThan`, `NapAm`, `QueCK` bỏ qua vì tính năng không migrate) sang file JSON hoặc TS module tĩnh.
- Không cần DbContext/ORM — dữ liệu được import thẳng như constant trong code, bundle cùng ứng dụng lúc build.

### `InfoQue` (quẻ đã lưu của người dùng) — quyết định: không migrate

- `InfoQue` chỉ lưu cặp `(time, binhchu)` — thời điểm xem quẻ + ghi chú người dùng, không lưu kết quả quẻ (quẻ được tính lại từ `time` mỗi lần xem, vì thuật toán an quẻ xác định hoàn toàn từ ngày giờ).
- Phát hiện khi rà code: [dataAccess.cs:173](../QueKinhDich/dataAccess.cs#L173) gọi `InfoQueTA.InsertBinhChu(info.binhchu, info.time)`, nhưng phương thức `InsertBinhChu` **không tồn tại** trên `InfoQueTableAdapter` được generate trong `kinhdich.Designer.cs` (chỉ có `Insert(string p1, DateTime? p2)`). Đường gọi này xuất phát thật từ nút "Lưu Quẻ" (`frmKinhDich.cs:626` → `business.SaveQueInfo`), không phải code chết — nghĩa là tính năng lưu quẻ trên bản desktop nhiều khả năng đã lỗi (không lưu được) trong một thời gian dài trước khi phát hiện ra.
- Vì lỗi này, bảng `InfoQue` trong `KinhDich.sdf` thực tế nhiều khả năng rỗng hoặc có rất ít dòng đáng kể — không cần xây pipeline export/import cho dữ liệu này. Nếu sau này phát hiện có dữ liệu thật cần giữ, cách rẻ nhất là: thêm tạm nút "Export JSON" vào `frmLoadQue` (tận dụng đường đọc `infoQueTableAdapter.Fill()` vẫn hoạt động bình thường) chạy trên máy Windows, rồi nhập thủ công một lần vào `localStorage` qua màn hình import của bản web — không cần backend hay công cụ đọc `.sdf` chuyên dụng.

## Giai đoạn 3 — Lưu trữ phía client (thay cho API + DB)

| Chức năng | Cách triển khai (client-side) | Logic đứng sau |
|---|---|---|
| Xem lịch âm & can chi theo thời điểm | Gọi hàm TS thuần trực tiếp trong component, không qua network | `hienThiNgayAmLich`, `VietnameseCalendar` (bản TS) |
| An quẻ theo thời điểm | Gọi hàm TS thuần | `new QueDich(time)`, `.napGiap()`, `.giaiQue()` |
| Xem quẻ theo chủ đề | Cùng hàm trên, tham số `viec` chọn Lục Thân để tô đậm | Không cần route/endpoint riêng |
| Tìm ngày tốt theo quẻ dịch | Vòng lặp chạy trong Web Worker (tránh block UI thread khi quét khoảng thời gian dài), cập nhật tiến độ qua callback/postMessage | `timNgayTot` (bản TS) |
| Lưu quẻ đã xem | Ghi vào `localStorage`/IndexedDB | Hàm `saveQueInfo` đọc/ghi storage trình duyệt |
| Tải danh sách quẻ đã lưu | Đọc từ `localStorage`/IndexedDB | tương ứng `frmLoadQue` |
| Xem quẻ cuộc đời | Gọi hàm TS thuần | `xacDinhQueCuocDoi` — **hiện chưa hoàn thiện ở bản gốc**, cần hoàn thiện logic khi viết lại chứ không chỉ dịch nguyên văn. |
| In ấn kết quả | Nút "In trang" chuẩn trình duyệt (`window.print()`) hoặc export PDF phía client (ví dụ thư viện `jspdf`) | Không cần xử lý phía server |
| Tứ Trụ | **Không migrate** | Form gốc rỗng, chưa có logic |
| Bình chú Chứng khoán theo quẻ biến | **Không migrate** | Tính năng thử nghiệm đã bị comment, không có dữ liệu |
| Xem ngày (cát/hung theo ngày cụ thể) | **Không migrate** | Form gốc chưa có xử lý, chỉ có TODO |

## Giai đoạn 4 — Frontend (React + TypeScript)

Mapping form → trang (không đổi so với kế hoạch trước, chỉ khác ở chỗ component gọi thẳng hàm TS nội bộ thay vì gọi API):

| Form gốc | Trang React tương ứng |
|---|---|
| `frmKinhDich` (màn hình chính) | Trang chủ: chọn ngày/giờ, hiển thị lịch âm + quẻ + luận giải (hào, Nạp Giáp, Lục Thân, Lục Thần, Tuần Không) |
| `frmTimNgayTotTheoQueDich` | Trang "Tìm ngày tốt": form nhập khoảng thời gian + việc, bảng kết quả, progress bar cập nhật từ Web Worker |
| `frmLoadQue` | Trang "Quẻ đã lưu": danh sách + xem lại, đọc/ghi `localStorage` |
| `AboutBox` | Modal/trang "Giới thiệu" đơn giản |

Giữ nguyên cách tô màu Ngũ Hành (Thủy=xanh dương, Hỏa=đỏ, Thổ=cam, Kim=bạc, Mộc=xanh lá) và tái sử dụng trực tiếp các file ảnh gốc trong `Resources/`.

## Giai đoạn 5 — Kiểm thử & đối chiếu song song

Rủi ro lớn nhất — dù dùng thư viện `lunar-calendar-ts-vi` cho phần lịch âm hay tự viết phần an quẻ/Lục Thân — vẫn là **kết quả lệch với bản desktop**. Khuyến nghị:

1. Trước khi coi bản desktop là lỗi thời, chạy song song cả hai với cùng bộ input (danh sách ngày giờ mẫu, bao gồm các mốc đặc biệt: giao thừa, tháng nhuận, giờ 23h-24h vì có quy tắc đổi ngày đặc thù).
2. So sánh: ngày âm lịch, can chi, tên quẻ, quẻ biến, điểm vượng suy từng Lục Thân.
3. Viết bộ test tự động (Vitest) hóa toàn bộ bộ đối chiếu này, chạy lại mỗi khi sửa code — vì không còn tầng backend riêng để kiểm thử độc lập, chất lượng bộ test TS chính là tuyến phòng thủ duy nhất.
4. Chỉ khi kết quả khớp 100% trên bộ test này mới coi việc viết lại hoàn tất.

## Việc cố tình bỏ qua (không phải thiếu sót)

- ASP.NET Core, EF Core, SQLite/Postgres, Docker, ClickOnce, MSI installer, SVN → không cần trong kiến trúc static SPA.
- `TuTru`, tính năng "Xem ngày" (`frmXemNgay`), "Bình chú Chứng khoán" → chưa có logic hoàn chỉnh ở bản gốc, không nằm trong scope; ghi nhận là backlog nếu sau này cần.
- `VietnameseCalendarbak.cs` → bản backup cũ, không dùng.

## Thứ tự triển khai khuyến nghị

1. Giai đoạn 1 (viết lại logic lịch âm/an quẻ bằng TS + test hồi quy) — **làm trước tiên và kỹ nhất**, vì đây là rủi ro chính của toàn bộ phương án viết lại.
2. Giai đoạn 2 (chuẩn bị dữ liệu tra cứu tĩnh dạng JSON/TS) — có thể làm song song với giai đoạn 1.
3. Giai đoạn 3 (lưu trữ client-side) — sau khi có core logic ổn định.
4. Giai đoạn 4 (frontend) — sau khi core logic ổn định, có thể làm song song từng trang một.
5. Giai đoạn 5 (đối chiếu song song) — chạy liên tục trong suốt quá trình, không chỉ ở cuối.
</content>
</invoke>
