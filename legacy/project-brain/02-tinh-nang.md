# 02 – Tính năng

Toàn bộ tính năng được truy cập từ màn hình chính `frmKinhDich` (menu **Kinh dịch**, **Xem ngày**, **Trợ giúp**) và các form phụ được mở từ đó.

## 1. Xem lịch âm & can chi theo thời gian thực

- Người dùng chọn một ngày (qua `MonthCalendar`) và một giờ (qua bộ chọn giờ `datePick`); ứng dụng lập tức:
  - Quy đổi sang **ngày âm lịch** (năm/tháng/ngày âm, có xử lý tháng nhuận).
  - Hiển thị **Can Chi của Giờ, Ngày, Tháng, Năm**.
  - Hiển thị **Tiết khí** hiện hành (24 tiết khí theo kinh độ mặt trời).
  - Hiển thị **Giờ Hoàng Đạo** của ngày đó.
- Quy tắc đổi ngày đặc thù: nếu giờ nhập là 23h trở đi, hệ thống tự động lùi sang "ngày âm lịch kế tiếp" (theo quan niệm ngày mới bắt đầu từ giờ Tý), xử lý tại `HienThiNgayAmLich`/`NgayAmLich`.
- Control `amLichControl` đóng gói lại phần hiển thị âm lịch này để tái sử dụng ở form khác (`frmLoadQue`, `frmXemNgay`).

## 2. An quẻ Kinh Dịch theo thời gian (Mai Hoa Dịch Số)

Đây là tính năng lõi của ứng dụng, nằm ở `business.XacDinhQueKinhDich` và lớp `QueDich`:

- Từ thời điểm xem quẻ, tính "số quẻ Thượng" và "số quẻ Hạ" dựa trên tổng của Chi năm + tháng (quy theo tiết lệnh nếu bật tùy chọn `Const.TietLenh`) + ngày âm lịch, chia lấy dư cho 8 (theo 8 quẻ đơn Tiên Thiên: Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn).
- Cộng thêm số giờ (quy đổi giờ ra "chi giờ") để tính quẻ Hạ và xác định **hào động** (chia dư cho 6).
- Tra ra **quẻ dịch** (một trong 64 quẻ kép, danh sách đầy đủ trong `Const.que6hao`) và **Cung** của quẻ.
- Tính **quẻ Biến**: đảo âm/dương của hào động để suy ra quẻ mới (`business.BienQue`).
- Hiển thị hình ảnh trực quan của 6 hào (hào âm/hào dương, đánh dấu hào động) bằng các `PictureBox` trên form chính.

## 3. Luận giải quẻ (Nạp Giáp – Lục Thân – Lục Thần – Tuần Không – Vượng Suy)

Sau khi có quẻ, `QueDich.NapGiap()` và `QueDich.GiaiQue()` thực hiện:

- **Nạp Giáp**: gán Địa Chi và Ngũ Hành cho từng hào (dựa trên bảng `QueKinhDich` – cột `NapGiapH1`…`NapGiapH6`).
- **Lục Thân** (Huynh Đệ, Tử Tôn, Thê Tài, Quan Quỷ, Phụ Mẫu): xác định bằng quan hệ sinh/khắc giữa Ngũ Hành của hào và Ngũ Hành của Cung quẻ.
- **Hào Thế / Hào Ứng**: tra từ bảng `Que6Hao.HaoThe`, suy ra Hào Ứng đối xứng.
- **Tuần Không**: tính "tuần không" của ngày xem quẻ (dựa trên Thiên Can – Địa Chi ngày) và đánh dấu hào nào rơi vào tuần không.
- **Lục Thần** (Thanh Long, Chu Tước, Câu Trần, Đằng Xà, Bạch Hổ, Huyền Vũ): gán tuần tự cho 6 hào bắt đầu từ vị trí ứng với Thiên Can ngày.
- **Điểm vượng/suy**: mỗi hào được cộng/trừ điểm dựa trên quan hệ sinh – khắc với Nhật Kiến (Chi ngày), Nguyệt Kiến (Chi tháng), hào động và hào biến; điểm của mỗi Lục Thân là điểm cao nhất trong các hào mang Lục Thân đó (nếu quẻ không có đủ 5 Lục Thân, phần thiếu được lấy điểm từ "Quẻ Chủ" – quẻ thuần cùng Cung).
- Kết quả được tô màu theo Ngũ Hành (Thủy=xanh dương, Hỏa=đỏ, Thổ=cam, Kim=bạc, Mộc=xanh lá) để dễ đọc trên giao diện.

## 4. Xem quẻ theo chủ đề (menu "Kinh dịch")

Menu chính cung cấp các lối tắt xem quẻ gắn với từng "việc" cụ thể – dùng chung một cơ chế an quẻ + tính điểm Lục Thân, chỉ khác Lục Thân nào được dùng làm tiêu chí:

- **Xem quẻ tình duyên**
- **Xem quẻ tiền tài**
- **Xem quẻ quan lộc**
- **Xem quẻ học hành**
- **Xem quẻ chung**
- **Xem thời tiết thiên nhiên**

## 5. Tìm ngày tốt theo quẻ dịch

Form `frmTimNgayTotTheoQueDich`:

- Người dùng chọn một việc (Lục Thân tương ứng), khoảng thời gian bắt đầu – kết thúc, và bước quét (theo giờ/2 giờ/ngày).
- Ứng dụng lặp qua từng mốc thời gian trong khoảng đó, an quẻ và tính điểm Lục Thân cho việc được chọn; nếu điểm vượt ngưỡng "vượng" (`Const.Vuong`) thì liệt kê ngày/giờ đó cùng tên quẻ, quẻ biến, và điểm số của cả 5 Lục Thân vào bảng kết quả (`DataGridView`).
- Có phím tắt "Hàng ngày" để quét theo từng ngày với ngưỡng "hung" (`Const.Hung`) thay vì vượng.
- Có thanh tiến trình (`toolStripProgressBar`) hiển thị tiến độ quét.

## 6. Lưu và tải lại thông tin quẻ đã xem

- **Lưu Quẻ** (`LuuQueMenuItem` / `toolStripSave`): cho phép người dùng ghi lại bình chú (`binhchu`) cùng thời điểm xem quẻ vào bảng `InfoQue` trong CSDL, để tra cứu lại sau này (`business.SaveQueInfo`, `dataAccess.SaveQueInfo`).
- **`frmLoadQue`**: tải danh sách các quẻ đã lưu (`InfoQue`) để xem lại.

## 7. In ấn kết quả quẻ

- Menu "Dàn trang", "Xem trước bản in", "In" trên form chính dùng `System.Drawing.Printing.PrintDocument`/`PrintPreviewDialog` để xuất bản in nội dung quẻ đang xem ra giấy hoặc PDF ảo.

## 8. Bình chú Chứng khoán theo quẻ biến (tính năng thử nghiệm)

- Có sẵn hạ tầng dữ liệu (bảng `QueCK`: Quẻ Chủ – Quẻ Biến – Chú Thích) và hàm tra cứu `business.ChuThichQueChungKhoan`, dùng ý tưởng "quẻ biến" của Kinh Dịch để đưa ra nhận định biến động thị trường chứng khoán.
- Phần sinh dữ liệu tự động (`TaoQueCK`) đã bị vô hiệu hóa (comment) trong mã nguồn – tính năng coi như đang tạm dừng, chưa hoàn thiện.

## 9. Xem quẻ cuộc đời (dự kiến, chưa hoàn thiện)

- `business.XacDinhQueCuocDoi` và constructor `QueDich(time, cuocdoi)` cài đặt một biến thể an quẻ dựa trên Thiên Can của năm sinh (Giáp, Ất, Bính...) thay vì Địa Chi năm như quẻ thông thường – dùng để luận một quẻ đại diện cho cả cuộc đời một người.
- Form giao diện tương ứng (`frmXemQueCuocDoi`, nút `toolStripQueCuocDoi`) đã có nhưng chưa gắn xử lý sự kiện, nên tính năng chưa dùng được từ giao diện.

## 10. Tứ Trụ (dự kiến, chưa triển khai)

- Có dự án con `TuTru` riêng và mục menu/nút `frmTuTru` mở form tương ứng, nhưng form này hiện chỉ là khung trống – chưa có logic lập lá số Tứ Trụ (Bát Tự).

## 11. Tiện ích khác

- **Xem ngày** (`frmXemNgay`): khung màn hình dự kiến để tra cứu cát/hung của một ngày/tháng/năm cụ thể; hiện phần xử lý còn để trống (chỉ có chú thích mô tả ý tưởng).
- **Trợ giúp / Bản quyền** (`helpToolStripMenuItem`, `aboutUsToolStripMenuItem`): hộp thoại giới thiệu ứng dụng (`AboutBox`).
- **Đo thời gian xử lý**: mỗi lần đổi ngày trên lịch, ứng dụng đo và hiển thị thời gian xử lý (`elapseTimetoolStripStatusLabel`) ở thanh trạng thái – phục vụ mục đích theo dõi hiệu năng khi phát triển.
