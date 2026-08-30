# 01 – Tổng quan dự án

## Dự án là gì

**QIChing** (tên module chính trong mã nguồn là `QueKinhDich`, namespace `KinhDich`) là một ứng dụng desktop viết bằng C#/.NET, dùng để **an quẻ và luận giải quẻ Kinh Dịch theo phương pháp Mai Hoa Dịch Số** (bấm quẻ theo ngày giờ), kết hợp chặt chẽ với **lịch âm Việt Nam** (ngày, giờ, tháng, năm theo can chi, tiết khí, giờ hoàng đạo). Ngoài quẻ dịch, dự án còn có các chức năng phụ trợ như xem ngày tốt xấu, xem quẻ theo từng chủ đề cuộc sống (tình duyên, tiền tài, quan lộc, học hành), và một module Tứ Trụ đang ở dạng phôi (chưa triển khai).

Đây là một ứng dụng cá nhân/nghiên cứu, phục vụ người dùng có kiến thức hoặc quan tâm đến Kinh Dịch, Nạp Giáp, Lục Thân, Lục Thần – không phải phần mềm thương mại có đội ngũ vận hành.

## Mục tiêu và bài toán giải quyết

Việc an quẻ Kinh Dịch và luận đoán vượng suy của các hào đòi hỏi tra cứu thủ công rất nhiều bảng dữ liệu cố định (64 quẻ, Nạp Giáp từng hào, Ngũ Hành tương sinh/tương khắc, Lục Thân, Lục Thần, Tuần Không...) và các phép tính lịch âm phức tạp (không thể suy ra trực tiếp từ lịch dương). Ứng dụng số hóa toàn bộ các bảng tra cứu này và tự động hóa quy trình:

1. Từ một thời điểm (ngày giờ dương lịch) → quy đổi ra ngày âm lịch, can chi ngày/tháng/năm/giờ.
2. Từ ngày giờ đó → an quẻ Thượng, quẻ Hạ, xác định hào động và quẻ biến theo thuật Mai Hoa Dịch Số.
3. Từ quẻ → tra Nạp Giáp cho từng hào, xác định hào Thế/Ứng, Tuần Không, Lục Thần.
4. Tính điểm vượng/suy cho từng Lục Thân (Huynh Đệ, Tử Tôn, Thê Tài, Quan Quỷ, Phụ Mẫu) dựa trên quan hệ sinh – khắc giữa Nhật Kiến, Nguyệt Kiến, hào động, hào biến và bản mệnh của từng hào.
5. Cho phép quét một khoảng thời gian để tìm ra những ngày "tốt" cho một việc cụ thể, dựa trên điểm vượng suy của Lục Thân tương ứng.

## Bối cảnh kỹ thuật & lịch sử

- Mã nguồn được quản lý bằng **SVN** (không phải Git) – các thư mục `.svn` xuất hiện ở hầu hết mọi nơi trong cây thư mục.
- Ứng dụng được xây dựng trên **.NET Framework 3.5 / Windows Forms**, dùng **SQL Server Compact Edition (.sdf)** làm nơi lưu trữ toàn bộ dữ liệu tra cứu tĩnh (64 quẻ, Ngũ Hành, Nạp Âm, Lục Thân...).
- Có tài liệu đặc tả ngắn `QIChing specification 2012.docx`, cho thấy dự án đã tồn tại và được phát triển ít nhất từ năm 2012.
- File `QIChing.application` cùng các thuộc tính `ApplicationVersion`, `UpdateEnabled` trong file dự án cho thấy ứng dụng từng được phát hành qua cơ chế **ClickOnce**; ngoài ra còn có một dự án cài đặt kiểu MSI (`QIChingSetup`) tạo ra `setup.exe`/`QIChingSetup.msi` để phát hành offline.
- Đây là ứng dụng **desktop, chạy độc lập trên máy Windows của một người dùng**, không có kiến trúc client‑server, không có tầng web hay API.

## Cấu trúc thư mục cấp cao

```
trunk/
├── QueKinhDich.sln            # Solution Visual Studio, gộp 3 project chính
├── QueKinhDich/                # Ứng dụng chính (WinForms) – xem 03 & 04
│   ├── Business/                # Tầng nghiệp vụ: an quẻ, lịch âm, ngũ hành...
│   ├── UserControl/              # Control tái sử dụng (bảng âm lịch)
│   ├── Resources/                # Icon, hình ảnh hào âm/dương
│   ├── kinhdich.xsd              # Typed DataSet – schema dữ liệu tra cứu
│   ├── KinhDich.sdf              # Cơ sở dữ liệu SQL CE chứa dữ liệu tra cứu
│   └── frm*.cs                   # Các màn hình (form) của ứng dụng
├── TuTru/                       # Dự án Tứ Trụ – mới có khung form, CHƯA có logic
├── VCTest/                       # Test đơn vị cho thư viện lịch âm (VietnameseCalendar)
└── QIChingSetup/                # Dự án đóng gói cài đặt (MSI/.vdproj)
```

## Trạng thái hoàn thiện

Không phải mọi tính năng nhìn thấy trên giao diện đều đã có logic đầy đủ. Một số điểm đáng lưu ý khi tiếp cận dự án:

- **`TuTru` (Tứ Trụ)** chỉ có `Form1` rỗng, chưa có bất kỳ logic nghiệp vụ nào – đây là tính năng dự kiến nhưng chưa triển khai.
- **`frmXemNgay` (Xem ngày)** và **`frmXemQueCuocDoi` (Xem quẻ cuộc đời)** có khung form nhưng phần xử lý còn để trống hoặc chỉ là chú thích TODO.
- Chức năng **tra cứu chú thích quẻ theo Chứng khoán** (`ChuThichQueChungKhoan`, bảng `QueCK`) tồn tại trong tầng dữ liệu nhưng phần sinh dữ liệu (`TaoQueCK`) đã bị comment lại, cho thấy đây là tính năng thử nghiệm nửa chừng.
- Có file `VietnameseCalendarbak.cs` (bản sao lưu cũ của thư viện lịch âm) vẫn còn nằm trong mã nguồn, không được biên dịch cùng logic hiện hành – cần lưu ý khi đọc code để không nhầm với bản đang dùng.

Xem chi tiết từng tính năng tại [02-tinh-nang.md](./02-tinh-nang.md), kiến trúc tại [03-kien-truc-va-thiet-ke.md](./03-kien-truc-va-thiet-ke.md), và công nghệ sử dụng tại [04-cong-nghe-su-dung.md](./04-cong-nghe-su-dung.md).
