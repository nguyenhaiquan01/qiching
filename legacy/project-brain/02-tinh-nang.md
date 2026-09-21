# 02 – Tính năng

> Tài liệu này mô tả bản web hiện tại. Các chức năng chỉ tồn tại trong WinForms gốc được tách riêng ở cuối tài liệu.

## 1. Điều hướng

`src/App.tsx` dùng `react-router` (khác mô tả gốc của tài liệu này — xem `src/ui/duongDan.ts` cho
danh sách route tĩnh dùng để prerender). Bảy mục cấp cao hiện tại là:

1. Xem quẻ (`/`)
2. Tìm ngày tốt (`/tim-ngay-tot`)
3. 64 Quẻ Kinh Dịch (`/64-que`)
4. Quẻ đã lưu (`/que-da-luu`)
5. 🧠 Học ghi nhớ (`/hoc-ghi-nho`) — xem mục 8
6. Hướng dẫn (`/huong-dan`)
7. Giới thiệu (`/gioi-thieu`)

Mỗi mục là URL thật (deep link/F5 hoạt động), trừ khi route đó thiếu trong danh sách prerender
tĩnh `DUONG_DAN_TINH` (`src/ui/duongDan.ts`) — thiếu thì trả 404 thật vì site đã tắt SPA fallback
(xem `10-ke-hoach-seo.md` Giai đoạn B). **Gieo đồng xu đã được bỏ khỏi top navigation và chuyển
vào bên trong Xem quẻ**.

## 2. Xem quẻ

### 2.1 Hai cách khởi quẻ

`XemQue.tsx` là orchestrator cho hai nhánh:

- **Theo thời gian**: chọn loại xem, ngày/giờ rồi lập quẻ bằng Mai Hoa Dịch Số.
- **Gieo đồng xu**: chọn gieo trên màn hình hoặc tự gieo; thực hiện sáu lần từ Hào 1 ở dưới lên Hào 6 ở trên.

Chủ đề và câu hỏi được dùng chung qua `NoiDungHoiQue`. Khối kết quả được dùng chung qua `KetQuaXemQue`. Phần gộp IA này đang ở working tree chưa commit và còn các gap được ghi tại [09](./09-gop-gieo-dong-xu-vao-xem-que.md).

### 2.2 Khởi quẻ theo thời gian

Nhánh này hỗ trợ:

- **Xem một việc**: chọn chủ đề hoặc chọn trực tiếp Lục Thân làm Dụng Thần.
- **Xem tổng quan**: không chọn một Dụng Thần duy nhất.
- **Quẻ Cuộc Đời**: gọi biến thể `QueDich(..., true)` và `giaiQueCuocDoi()`.
- Chọn ngày và giờ, sau đó tính Quẻ Chính, một hào động và Quẻ Biến.
- Lưu thời điểm + ghi chú, chép nội dung chia sẻ vào clipboard và in bằng `window.print()`.

### 2.3 Khởi quẻ bằng ba đồng xu

Core Coin Casting nằm trong `src/core/coinCasting/`:

- `gieoManHinh.ts`: gieo độc lập ba đồng xu với xác suất 1/2 mỗi mặt.
- `xacDinhHao.ts`: ánh xạ bốn kết quả Lão Dương/Thiếu Dương/Thiếu Âm/Lão Âm.
- `adapter.ts`: chuyển sáu hào thành `QueDich`, hỗ trợ cấu trúc 0–6 hào động.
- `storage.ts`: lưu raw sáu hào, cách gieo, chủ đề/câu hỏi và kết quả nhận diện.

Hai cách gieo:

- **Gieo trên màn hình**: mỗi lần sinh đúng một bộ ba mặt xu; người dùng xác nhận để thêm hào, không có nút gieo lại kết quả đang chờ.
- **Tôi tự gieo**: người dùng nhập Ngửa/Sấp của ba đồng xu thật rồi xác nhận hào.

Sau Hào 6, thời điểm xác nhận được dùng làm Nhật/Nguyệt Kiến cho tầng luận. Quẻ không có hào động là trạng thái hợp lệ; nhiều hào động được đảo đồng thời khi tạo Quẻ Biến.

**Giới hạn xác minh:** parity với engine cũ đã được test khi đúng một hào động. Các test nhiều hào động mới chứng minh cấu trúc/quẻ hợp lệ và điểm hữu hạn, chưa phải oracle nghiệp vụ độc lập.

## 3. Kết quả và luận quẻ dùng chung

`KetQuaXemQue` ghép các phần:

1. Hero Quẻ Chính → Quẻ Biến, mức độ thuận lợi và tóm tắt.
2. Luận theo việc đang hỏi nếu có Dụng Thần.
3. Căn cứ luận quẻ.
4. Lịch âm/Can Chi/Tiết Khí/Giờ Hoàng Đạo.
5. Điểm vượng suy năm Lục Thân.
6. Chi tiết sáu hào, Nạp Giáp, Thế/Ứng, Tuần Không và Lục Thần.
7. Provenance: Theo thời gian hoặc Ba đồng xu + cách gieo.

Tên Quẻ Chính/Quẻ Biến có thể mở nội dung tra cứu đầy đủ của quẻ; hover hiện phần Giải nghĩa/Dịch/Giảng.

Các câu kết luận UI dùng ngưỡng `VUONG=3` và `HUNG=-8` đã có trong engine. Đây là lớp trình bày, không phải mô hình dự báo xác suất.

## 4. Lịch âm và Can Chi

`tinhAmLich()` bọc `lunar-calendar-ts-vi` để trả:

- ngày/tháng/năm âm và tháng nhuận;
- Can Chi Giờ/Ngày/Tháng/Năm;
- Tiết Khí;
- Giờ Hoàng Đạo.

Quy tắc legacy được giữ: từ 23:00, ngày dùng để tính Can Chi/lịch âm được chuyển sang ngày kế tiếp. Hàm hiện đọc timezone cục bộ từ `Date`; chưa có input timezone IANA.

## 5. Tìm ngày tốt

`TimNgayTot.tsx` gửi yêu cầu sang `timNgayTot.worker.ts` để không chặn UI. Người dùng chọn:

- Lục Thân cần xét;
- khoảng thời gian;
- quét mỗi hai giờ với ngưỡng Vượng, hoặc quét hàng ngày theo một giờ cố định với ngưỡng Hung.

Worker trả tiến độ và danh sách mốc đạt điều kiện cùng tên quẻ, quẻ biến và điểm Lục Thân.

## 6. Tra cứu 64 quẻ

`Que64.tsx` kết hợp danh sách và chi tiết:

- lưới 64 quẻ theo dữ liệu Bát Cung;
- Giải nghĩa, Dịch, Giảng;
- sáu hào và Dụng Cửu/Dụng Lục khi có;
- mở trực tiếp từ tên quẻ trong màn kết quả.

Dữ liệu nội dung nằm trong `src/core/data/noiDungQue.json`; đây là nguồn diễn giải riêng, không phải dữ liệu tính toán từ `KinhDich.sdf`.

## 7. Quẻ đã lưu

Có hai kho `localStorage` độc lập:

- `qiching.queInfo.v1`: quẻ theo thời gian, lưu `(time, binhchu)` và tính lại khi xem.
- `qiching.coinCasting.v1`: quẻ gieo đồng xu, phải lưu raw sáu hào vì không thể tái tạo từ timestamp.

Working tree hiện gộp hai kho ở tầng hiển thị, sắp mới nhất trước và cho xem lại/xóa đúng loại. Export/import JSON **chỉ áp dụng cho quẻ theo thời gian**; Coin Casting chưa có export/import.

## 8. Học ghi nhớ

`HocGhiNho.tsx` (`/hoc-ghi-nho`) là trình duyệt thẻ ghi nhớ (flashcard) cho Soán Từ và Đại Tượng
Truyện của 64 quẻ, nguồn dữ liệu cố định bản **Phan Bội Châu**
(`src/core/data/noiDungQuePhanBoiChau.json`) — không đổi được sang bản Nguyễn Hiến Lê/Ngô Tất Tố.

### 8.1 Chọn nội dung

Trước khi vào phiên ôn, người dùng chọn:

- **Loại nội dung**: Soán Từ và/hoặc Đại Tượng Truyện (mặc định bật cả hai).
- **Quẻ cụ thể**: lưới 8×8 (`QueSelectionGrid.tsx`, dùng lại `HinhQue` — cùng component vẽ
  hexagram đen ở mục 6 — và tên quẻ từ `noiDungQue.json` để khớp đúng định dạng hiển thị ở trang
  Tra cứu). Mặc định chọn cả 64 quẻ; có nút Random 5/10/20, Tất cả 64, Bỏ tất cả.

Số thẻ của phiên = số quẻ đã chọn × số loại nội dung đã chọn (tối đa 128 = 64 × 2).

### 8.2 Phiên ôn tập

Mỗi thẻ (`LearnCard.tsx`) hiển thị:

- Tên quẻ + hình hexagram (`HexagramDisplay.tsx`, cũng dùng lại `HinhQue`) — luôn hiện, kể cả
  trước khi lật thẻ.
- 3 mức độ khó chọn được ngay trên thẻ — **Dễ** (chỉ dịch + giảng), **Trung bình** (Hán tự + dịch
  + giảng, mặc định), **Khó** (chỉ Hán tự) — quyết định nội dung hiện ra sau khi lật thẻ.
- Bấm vào thân thẻ để lật xem đáp án, sau đó tự đánh giá **Nhớ** hoặc **Quên**.

Điều hướng trong phiên: nút "← Quay lại"/"Tiếp theo →", ô nhập số để nhảy thẳng tới thẻ bất kỳ,
thanh tiến độ + số Nhớ/Quên/đã review, nút "↻ Quay lại từ đầu" (reset đúng phiên đang chọn) và
"⚙️ Thay đổi nội dung" (quay về màn 8.1).

### 8.3 Giới hạn hiện tại

- **Chưa phải spaced repetition thật**: không có thuật toán lên lịch ôn lại (không Leitner box,
  không SM-2), không phân biệt thẻ "mới" hay "đến hạn" — chỉ là duyệt tuần tự theo đúng thứ tự đã
  chọn, đếm Nhớ/Quên cho biết chứ không ảnh hưởng thứ tự/tần suất thẻ nào.
- **Không lưu trữ**: không dùng `localStorage` — rời trang hoặc F5 là mất hết lựa chọn nội dung,
  quẻ đã chọn và kết quả Nhớ/Quên; phải chọn lại từ đầu mỗi lần vào trang.
- Chưa có Hào Từ (384 hào) — chỉ Soán Từ và Đại Tượng Truyện.
- Chưa có liên kết chéo từ thẻ ôn tập sang trang tra cứu chi tiết quẻ (mục 6).

Xem đặc tả gốc (Spaced Repetition đầy đủ, chưa triển khai) và đối chiếu chi tiết từng điểm lệch ở
[13-hoc-ghi-nho-soan-tu-dai-tuong.md](./13-hoc-ghi-nho-soan-tu-dai-tuong.md).

### 8.4 Dữ liệu

`daiTuongTruyen`/`soanTu` trong `noiDungQuePhanBoiChau.json` dùng schema tách riêng
`{ hanViet, hanTu, dichGiang }`. Đã phát hiện và sửa lỗi lệch field ở 7/64 quẻ (6, 9, 23, 27, 31,
49, 53 — `hanViet` bị gán nhầm thành chữ Hán, `hanTu` bị gán nhầm thành câu đầu phần giảng) do lỗi
script trích xuất gốc; xem comment "Audit đối chiếu ngược (2026-09, đợt 2)" đầu
`src/core/data/noiDungQuePhanBoiChau.ts`.

## 9. Trình bày và khả năng sử dụng

- Responsive CSS và dark mode theo `prefers-color-scheme`.
- Màu Ngũ Hành tách khỏi màu trạng thái UX.
- Tooltip thuật ngữ và nội dung quẻ.
- In bằng trình duyệt; không có engine PDF riêng.
- Không có bộ test UI/accessibility tự động được check-in. Tooltip hover hiện chưa đầy đủ cho keyboard/touch.

## 10. Trạng thái kiểm thử

Tại lần rà soát 2026-09-21:

- `npm test`: 11/11 file, 118/118 test pass.
- `npm run lint`: pass (chỉ còn vài warning không chặn build, không liên quan tính năng mới).
- `npm run build`: pass.
- Chưa có component/E2E test trong repository (bao gồm cả `HocGhiNho`/`LearnCard`/
  `QueSelectionGrid` — mục 8 mới thêm, hiện không có test tự động, chỉ được kiểm tra thủ công
  bằng Playwright ngoài luồng CI khi review).
- Chưa có golden dataset lớn đối chiếu toàn pipeline với desktop.

## 11. Chưa triển khai hoặc chỉ thuộc legacy

| Tính năng | Trạng thái bản web |
|---|---|
| Tứ Trụ | Chưa có code; xem tài liệu 07/08 |
| Bình chú Chứng khoán | Không migrate |
| Form Xem ngày cát/hung tổng quát | Không migrate; khác với trang Tìm ngày tốt theo quẻ đã có |
| ClickOnce/MSI/SQL CE | Chỉ thuộc desktop legacy |
| Đồng bộ dữ liệu nhiều thiết bị | Chưa có backend; phải dùng export/import thủ công nơi được hỗ trợ |
