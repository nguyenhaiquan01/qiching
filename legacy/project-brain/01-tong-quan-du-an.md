# 01 – Tổng quan dự án

> Trạng thái được đối chiếu với working tree ngày 2026-08-31. Bản web là sản phẩm đang phát triển; mã WinForms trong `legacy/` là nguồn lịch sử và đối chiếu nghiệp vụ.

## Dự án hiện tại

**QIChing** hiện gồm hai phần:

1. **Ứng dụng web chính** tại thư mục gốc: static SPA viết bằng React + TypeScript, toàn bộ tính toán chạy trong trình duyệt, không có backend/API/database server.
2. **Ứng dụng desktop gốc** trong `legacy/`: C#/.NET Framework 3.5, Windows Forms và SQL Server Compact. Phần này được giữ để truy vết thuật toán, dữ liệu và hành vi cũ; không còn là runtime của bản web.

Bản web hỗ trợ lập và luận quẻ Kinh Dịch theo hai cách khởi quẻ:

- **Theo thời gian** — Mai Hoa Dịch Số từ ngày giờ.
- **Gieo ba đồng xu** — gieo trên màn hình hoặc tự gieo xu thật, sau đó dùng chung tầng luận Lục Hào Nạp Giáp.

Các khả năng khác gồm lịch âm/Can Chi, tra cứu 64 quẻ, tìm ngày tốt, lưu và xem lại quẻ trong trình duyệt. Tứ Trụ mới có tài liệu reverse-engineering và thiết kế; chưa có module thực thi trong `src/core/`.

## Mục tiêu sản phẩm

Ứng dụng số hóa các bảng và phép tính vốn phải tra thủ công:

1. đổi ngày giờ dương lịch sang lịch âm, Can Chi, Tiết Khí và giờ Hoàng Đạo;
2. lập quẻ theo thời gian hoặc từ sáu hào gieo bằng ba đồng xu;
3. tính Quẻ Chính/Quẻ Biến, Nạp Giáp, Lục Thân, Lục Thần, Thế/Ứng và Tuần Không;
4. tính điểm vượng suy theo engine được port từ desktop;
5. trình bày kết quả theo hướng dễ đọc nhưng vẫn cho phép truy vết dữ liệu chuyên môn;
6. chạy hoàn toàn phía client và lưu dữ liệu cá nhân bằng `localStorage`.

## Trạng thái triển khai

| Hạng mục | Trạng thái |
|---|---|
| Core Mai Hoa Dịch Số/Lục Hào | Đã port sang TypeScript và chạy end-to-end |
| Dữ liệu tĩnh từ `KinhDich.sdf` | Đã đưa vào `src/core/data/`; các bảng tính toán chính có fixture CSV trong `DBexport/` |
| UI React | Đã có năm mục điều hướng chính; dùng state nội bộ, không dùng router |
| Coin Casting core | Đã có mapping xu, adapter 0–6 hào động và storage riêng |
| Gộp Coin Casting vào Xem Quẻ | **Đang triển khai trong working tree**, chưa nên coi là hoàn tất; xem [09](./09-gop-gieo-dong-xu-vao-xem-que.md) |
| Lưu quẻ | Hai schema `localStorage`; danh sách hợp nhất ở tầng UI đang được triển khai |
| Kiểm thử | 8 test file, 63 test pass; lint và production build pass tại lần rà soát này |
| Đối chiếu desktop end-to-end | Mới một phần; chưa có golden dataset lớn cho toàn bộ lịch pháp và kết quả luận |
| Tứ Trụ | Có đặc tả [07](./07-tu-tru-tinh-toan.md) và thiết kế [08](./08-tu-tru-thiet-ke-chuong-trinh.md), chưa có code |

## Cấu trúc repository

```text
nhq-iching-web/
├── src/
│   ├── core/                  # nghiệp vụ thuần TypeScript
│   │   ├── coinCasting/       # gieo xu, adapter sang QueDich, storage và test
│   │   ├── data/              # bảng tra cứu tĩnh
│   │   └── __tests__/         # test core và dữ liệu
│   ├── pages/                 # các màn hình/orchestrator
│   ├── components/            # component trình bày dùng lại
│   └── ui/                    # logic diễn giải và theme/presentation helpers
├── DBexport/                  # CSV xuất từ dữ liệu desktop để đối chiếu
├── legacy/
│   ├── QueKinhDich/           # WinForms gốc
│   ├── TuTru/                 # project Tứ Trụ gốc chỉ có form rỗng
│   └── project-brain/         # tài liệu nghiệp vụ, kiến trúc và trạng thái
├── package.json
├── vite.config.ts
└── tsconfig*.json
```

## Các giới hạn cần nhớ

- Không có tài khoản người dùng hoặc đồng bộ server; dữ liệu gắn với từng browser/profile.
- Lịch hiện dùng `Date` theo timezone môi trường chạy và quy tắc đổi ngày từ 23h của bản cũ. Đây chưa phải contract timezone đủ chặt cho Tứ Trụ.
- Test hiện mạnh ở core/data nhưng chưa có test component/E2E được check-in.
- Adapter Coin Casting có parity test khi đúng một hào động; tính đúng nghiệp vụ của cách chấm điểm khi có nhiều hào động chưa có oracle độc lập.
- Production bundle hiện khoảng 728 kB minified và Vite cảnh báo chunk chính vượt 500 kB.

## Bối cảnh legacy

Ứng dụng desktop từng được quản lý bằng SVN, phát hành qua ClickOnce/MSI và dùng SQL Server Compact. Các form `frmXemNgay`, `frmXemQueCuocDoi`, module Chứng khoán và project `TuTru` có mức hoàn thiện không đồng đều. Khi đọc code legacy phải phân biệt logic đang chạy với file backup/TODO, đặc biệt `VietnameseCalendarbak.cs`.

## Tài liệu liên quan

- [02 – Tính năng](./02-tinh-nang.md)
- [03 – Kiến trúc và thiết kế](./03-kien-truc-va-thiet-ke.md)
- [04 – Công nghệ sử dụng](./04-cong-nghe-su-dung.md)
- [05 – Kế hoạch và trạng thái migrate](./05-ke-hoach-migrate-web.md)
- [06 – Deployment](./06-deployment.md)
- [07 – Mô hình tính toán Tứ Trụ](./07-tu-tru-tinh-toan.md)
- [08 – Thiết kế chương trình Tứ Trụ](./08-tu-tru-thiet-ke-chuong-trinh.md)
- [09 – Gộp Gieo đồng xu vào Xem quẻ](./09-gop-gieo-dong-xu-vao-xem-que.md)
