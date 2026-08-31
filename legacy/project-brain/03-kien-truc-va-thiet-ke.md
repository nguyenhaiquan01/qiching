# 03 – Kiến trúc và thiết kế

> Hiện trạng được đối chiếu với working tree ngày 2026-08-31. Tài liệu này mô tả bản web; mã WinForms trong `legacy/` chỉ là nguồn lịch sử và đối chiếu nghiệp vụ.

## 1. Kiến trúc tổng thể

QIChing là một **static SPA chạy hoàn toàn phía client**:

```text
Người dùng
    │
    ▼
React pages/components
    │ gọi trực tiếp
    ▼
src/core (TypeScript, không phụ thuộc React)
    ├── engine Kinh Dịch và lịch âm
    ├── Coin Casting adapter
    ├── bảng dữ liệu tĩnh
    ├── Web Worker tìm ngày tốt
    └── localStorage adapters
```

Không có backend, API, ORM hay database server. Sau khi build, toàn bộ HTML/CSS/JavaScript và dữ liệu tra cứu được phát hành dưới dạng file tĩnh.

## 2. Phân lớp

### 2.1 Tầng ứng dụng và điều hướng

- `src/App.tsx` giữ màn hình hiện tại bằng React state; dự án không dùng router.
- Năm mục điều hướng hiện tại: Xem quẻ, Tìm ngày tốt, 64 Quẻ Kinh Dịch, Quẻ đã lưu và Giới thiệu.
- Trong working tree, Gieo đồng xu đang được gộp thành một cách khởi quẻ bên trong Xem quẻ; xem [implementation review](./09-gop-gieo-dong-xu-vao-xem-que.md).

### 2.2 Tầng trang và component

- `src/pages/` điều phối state và gọi core.
- `src/components/` trình bày kết quả dùng lại; `KetQuaXemQue` là khối kết quả chung cho hai cách khởi quẻ trong working tree.
- `src/ui/` chứa logic diễn giải dành cho presentation, thuật ngữ, màu Ngũ Hành và theme. Tầng này không được coi là oracle nghiệp vụ độc lập.

### 2.3 Tầng nghiệp vụ `src/core/`

| Module | Trách nhiệm |
|---|---|
| `lunar.ts` | Bọc `lunar-calendar-ts-vi`, trả lịch âm, Can Chi, Tiết Khí và giờ Hoàng Đạo; giữ quy tắc đổi ngày từ 23:00 của legacy |
| `business.ts` | Hàm nghiệp vụ port từ `Business/business.cs`: lập/biến quẻ, Nạp Giáp, Tuần Không, tra cứu và tìm ngày tốt |
| `queDich.ts` | Aggregate chính của một quẻ: sáu hào, Cung, Thế/Ứng, Lục Thần và điểm vượng suy |
| `const.ts`, `data/` | Hằng số và bảng tra cứu tĩnh; không truy vấn database lúc chạy |
| `coinCasting/` | Mapping ba đồng xu, lập quẻ từ sáu hào, tính trường hợp 0–6 hào động và lưu raw casting data |
| `storage.ts` | Lưu quẻ theo thời gian bằng `localStorage` |
| `timNgayTot.worker.ts` | Quét khoảng thời gian ngoài UI thread và gửi tiến độ/kết quả về trang |

Core không import React. Riêng storage và worker phụ thuộc Web APIs (`localStorage`, `self`, `postMessage`) nên không phải package thuần môi trường Node tuyệt đối.

## 3. Luồng lập quẻ

### 3.1 Theo thời gian

```text
Date local
  → tinhAmLich()
  → new QueDich(time)
  → giaiQue() hoặc giaiQueCuocDoi()
  → Quẻ Chính/Quẻ Biến + sáu hào + điểm Lục Thân
  → KetQuaXemQue
```

`QueDich` giữ cách đánh số legacy: mảng `hao` có phần tử đệm ở index 0, Hào 1–6 nằm ở index 1–6. Đối tượng được hoàn thiện qua các phương thức có mutation (`napGiap`, `bienQue`, `giaiQue`); UI không nên tự tái tạo các bước này.

### 3.2 Gieo ba đồng xu

```text
6 × (3 mặt Ngửa/Sấp)
  → xacDinhHaoTuXu()
  → lapQueTuCoinCasting()
  → new QueDich(time, queThuong, queHa)
  → tính điểm cho tập 0–6 hào động
  → cùng model kết quả với nhánh Theo thời gian
```

Adapter không gọi `QueDich.giaiQue()` vì hàm legacy giả định đúng một hào động. Khi không có hào động, `queBien` là `null`; khi có nhiều hào động, mọi vị trí động được đảo để tạo Quẻ Biến.

Yêu cầu nghiệp vụ và UX gốc của nhánh này nằm ở [02.1 – Coin Casting Feature Specification](<./02.1.QIChing — Coin Casting Feature Specification.md>) và [03.1 – Coin Casting UX Specification](<./03.1.QIChing — Coin Casting UX Specification.md>).

## 4. Dữ liệu và lưu trữ

### 4.1 Dữ liệu tra cứu

- Các bảng dùng để tính toán nằm trong `src/core/data/*.ts`; phần lớn được đối chiếu với CSV trong `DBexport/` xuất từ `KinhDich.sdf`.
- `noiDungQue.json` là nội dung diễn giải lấy từ cohoc.net, chỉ dùng để hiển thị; đây không phải dữ liệu tính toán từ database desktop.
- Dữ liệu được bundle ở build time. Không có cache hoặc truy vấn từ xa lúc chạy.

### 4.2 Dữ liệu người dùng

Hai schema được giữ riêng vì không thể tái tạo theo cùng cách:

| Key | Nội dung | Cách xem lại |
|---|---|---|
| `qiching.queInfo.v1` | thời điểm + bình chú của quẻ theo thời gian | tính lại quẻ từ thời điểm |
| `qiching.coinCasting.v1` | raw sáu hào, cách gieo, chủ đề/câu hỏi và tên quẻ | dựng lại từ raw casting data |

Working tree hợp nhất hai nguồn ở tầng hiển thị, không ép chúng vào một schema. Export/import JSON hiện chỉ hỗ trợ kho quẻ theo thời gian.

## 5. Ranh giới và invariant cần bảo vệ

- `Date` hiện được hiểu theo timezone cục bộ của browser. Chưa có contract timezone IANA hoặc chuẩn hóa giờ mặt trời.
- Quy tắc đổi ngày từ 23:00 là hành vi legacy của engine Kinh Dịch; không được mặc định tái dùng cho Tứ Trụ.
- Coin Casting cần đúng sáu hào theo thứ tự Hào 1 → Hào 6. Adapter hiện mới kiểm tra độ dài, chưa kiểm tra vị trí trùng/sai thứ tự.
- Dữ liệu đọc từ `localStorage` có thể bị sửa ngoài ứng dụng; validation schema hiện còn mỏng.
- Các câu diễn giải trong `src/ui/` phải dựa trên output và ngưỡng của core, không phát minh công thức tính mới.

## 6. Kiểm thử và khả năng thay thế

- Vitest kiểm tra core, dữ liệu, storage và Coin Casting.
- Coin Casting có parity test với engine theo thời gian khi đúng một hào động; các trường hợp nhiều hào động chưa có oracle độc lập.
- `dbexport.test.ts` so các bảng chính với CSV, nhưng chưa bao phủ trực tiếp `CanChi.csv`.
- Chưa có component/E2E test được check-in và chưa có golden dataset lớn so toàn pipeline với desktop.
- Vì static SPA không có server làm lớp kiểm soát thứ hai, regression test của core là ranh giới an toàn chính.

## 7. Tứ Trụ là bounded context riêng

Tứ Trụ chưa được triển khai trong `src/core/`. Khi phát triển, không nên ghép trực tiếp vào `lunar.ts` hiện tại vì yêu cầu ranh Tiết chính/Lập Xuân, timezone và thời điểm giao tiết chặt hơn engine Kinh Dịch. Nguồn hiện có:

- [07 – Mô hình tính toán Tứ Trụ](./07-tu-tru-tinh-toan.md)
- [08 – Thiết kế chương trình Tứ Trụ](./08-tu-tru-thiet-ke-chuong-trinh.md)

## 8. Nguồn sự thật

Không dùng một thứ tự duy nhất cho mọi loại câu hỏi:

- **Trạng thái đã triển khai:** code và test của đúng working tree là bằng chứng; tài liệu phải mô tả lại trung thực kể cả khi code còn lỗi.
- **Hành vi mong muốn:** đặc tả đã duyệt/acceptance criteria đứng trước implementation; test chỉ là bằng chứng đạt yêu cầu khi assertion kiểm tra đúng rule đó.
- **Độ đúng nghiệp vụ:** ưu tiên rule và fixture có nguồn độc lập đã xác minh. Test tự nhất quán hoặc kết quả “không throw” không phải oracle.
- **Legacy:** WinForms/Excel là nguồn parity và truy vết. Không mặc nhiên coi là rule đúng ở vùng đã ghi nhận lỗi hoặc chưa có xác minh độc lập.

## 9. Register rủi ro sau code review

| Mức | Rủi ro | Nơi theo dõi |
|---|---|---|
| Blocker | Top nav vẫn cho rời phiên Coin Casting không xác nhận | [09, B2](./09-gop-gieo-dong-xu-vao-xem-que.md) |
| Regression risk | Callback huỷ đã reset `dangGieoDoDang`, nhưng chưa có UI test bảo vệ fix | [09, B1](./09-gop-gieo-dong-xu-vao-xem-que.md) |
| Blocker nghiệp vụ | Điểm vượng suy cho nhiều hào động chưa có oracle độc lập | [09, B3](./09-gop-gieo-dong-xu-vao-xem-que.md) |
| Cao | Storage Coin không validate invariant và thiếu context `vietTrucTiep`; xem lại có thể đổi Dụng Thần | [09, B4](./09-gop-gieo-dong-xu-vao-xem-que.md) |
| Cao | Artifact Cloudflare hiện hữu không truy vết chắc chắn về source SHA | [06, mục 4](./06-deployment.md) |
| Trung bình | CTA thời gian, Hero không hào động, tooltip keyboard/touch và responsive còn gap | [09, mục 7](./09-gop-gieo-dong-xu-vao-xem-que.md) |
| Trung bình | Import thời gian/schema storage, Worker và phân phối random chưa có kiểm thử đủ chặt | Chưa có release gate tự động; bổ sung ở backlog test |
| Trung bình | Bundle chính vượt ngưỡng 500 kB; Google Fonts là phụ thuộc mạng runtime | [04](./04-cong-nghe-su-dung.md), [06](./06-deployment.md) |
