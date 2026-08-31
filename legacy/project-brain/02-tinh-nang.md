# 02 – Tính năng

> Tài liệu này mô tả bản web hiện tại. Các chức năng chỉ tồn tại trong WinForms gốc được tách riêng ở cuối tài liệu.

## 1. Điều hướng

`src/App.tsx` dùng state React thay cho router. Năm mục cấp cao hiện tại là:

1. Xem quẻ
2. Tìm ngày tốt
3. 64 Quẻ Kinh Dịch
4. Quẻ đã lưu
5. Giới thiệu

Không có URL riêng cho từng màn hình, deep link hay browser history. Trong working tree hiện tại, **Gieo đồng xu đã được bỏ khỏi top navigation và chuyển vào bên trong Xem quẻ**.

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

## 8. Trình bày và khả năng sử dụng

- Responsive CSS và dark mode theo `prefers-color-scheme`.
- Màu Ngũ Hành tách khỏi màu trạng thái UX.
- Tooltip thuật ngữ và nội dung quẻ.
- In bằng trình duyệt; không có engine PDF riêng.
- Không có bộ test UI/accessibility tự động được check-in. Tooltip hover hiện chưa đầy đủ cho keyboard/touch.

## 9. Trạng thái kiểm thử

Tại lần rà soát 2026-08-31:

- `npm test`: 8/8 file, 63/63 test pass.
- `npm run lint`: pass.
- `npm run build`: pass.
- Chưa có component/E2E test trong repository.
- Chưa có golden dataset lớn đối chiếu toàn pipeline với desktop.

## 10. Chưa triển khai hoặc chỉ thuộc legacy

| Tính năng | Trạng thái bản web |
|---|---|
| Tứ Trụ | Chưa có code; xem tài liệu 07/08 |
| Bình chú Chứng khoán | Không migrate |
| Form Xem ngày cát/hung tổng quát | Không migrate; khác với trang Tìm ngày tốt theo quẻ đã có |
| ClickOnce/MSI/SQL CE | Chỉ thuộc desktop legacy |
| Đồng bộ dữ liệu nhiều thiết bị | Chưa có backend; phải dùng export/import thủ công nơi được hỗ trợ |
