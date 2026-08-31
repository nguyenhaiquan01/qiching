# 09 – Implementation review: gộp "Gieo đồng xu" vào "Xem quẻ"

- **Trạng thái review:** đã triển khai trong working tree, còn blocker; chưa đủ cơ sở kết luận production-ready.
- **Ngày đối chiếu:** 31/08/2026.
- **Phạm vi:** code web hiện tại, bao gồm thay đổi chưa commit trong `src/App.tsx`, các page, component UI và `src/core/coinCasting/`.

Tài liệu này là bản ghi **sau triển khai**, thay cho bản kế hoạch tiền triển khai trước đây.
Hai nguồn chuẩn vẫn là:

- [`Coin Casting - merge UX.md`](<./Coin Casting - merge UX.md>) cho IA/UX gộp;
- [`02.1.QIChing — Coin Casting Feature Specification.md`](<./02.1.QIChing — Coin Casting Feature Specification.md>)
  và [`03.1.QIChing — Coin Casting UX Specification.md`](<./03.1.QIChing — Coin Casting UX Specification.md>)
  cho rule nghiệp vụ và interaction chi tiết.

Tài liệu review không hợp thức hóa sai lệch của code bằng cách thay đổi requirement. Các điểm
chưa đạt được ghi là blocker/gap để sửa hoặc xin quyết định PO/domain riêng.

## 1. Kết quả IA hiện tại

Hierarchy chính đã được gộp đúng:

```text
XEM QUẺ
  ├── CÁCH KHỞI QUẺ
  │    ├── Theo thời gian
  │    └── Gieo đồng xu
  ├── CÂU HỎI / CHỦ ĐỀ dùng chung
  └── nội dung theo cách khởi quẻ
       ├── Theo thời gian: Loại xem + Ngày/Giờ + Lập quẻ
       └── Gieo đồng xu
            └── CÁCH GIEO
                 ├── Gieo trên màn hình
                 └── Tôi tự gieo
```

`Gieo đồng xu` không còn là top-level navigation. Top navigation hiện có năm mục: Xem quẻ,
Tìm ngày tốt, 64 Quẻ Kinh Dịch, Quẻ đã lưu và Giới thiệu.

## 2. Kiến trúc đã triển khai

```text
App.tsx
├── XemQue.tsx                         orchestrator của hai cách khởi quẻ
│    ├── bộ chọn Cách khởi quẻ         JSX inline, không phải component riêng
│    ├── NoiDungHoiQue                 Chủ đề/Câu hỏi dùng chung
│    ├── nhánh Theo thời gian
│    └── GieoDongXuFlow
│         ├── bộ chọn Cách gieo        JSX inline
│         ├── DANG_GIEO
│         ├── HOAN_TAT
│         └── XEM_KET_QUA
└── QueDaLuu                           danh sách đọc gộp từ hai kho

KetQuaXemQue                            renderer kết quả dùng chung
├── KetQuaHero
├── LuanQueTheoViec
├── CanCuLuanQue
├── AmLichView / VuongSuyBar
└── QueDichView
```

Các thay đổi hiện hữu:

- `src/pages/GieoDongXu.tsx` cũ đã bị bỏ; luồng con nằm ở
  `src/pages/GieoDongXuFlow.tsx`.
- `NoiDungHoiQue.tsx` loại bỏ phần Chủ đề/Câu hỏi trùng lặp.
- `KetQuaXemQue.tsx` loại bỏ phần kết quả trùng lặp giữa hai cách khởi quẻ.
- `XemQue.tsx` nhận cả `thoiDiemBanDau` và `gieoQueBanDau`; xem lại quẻ đồng xu đi thẳng tới
  kết quả từ raw hào đã lưu, không gieo lại.
- `QueDaLuu.tsx` gộp hai danh sách ở tầng đọc/hiển thị, sắp mới nhất trước; hai schema và hai
  localStorage key vẫn tách biệt. Export/import JSON hiện chỉ áp dụng cho quẻ theo thời gian.
- Kết quả của cả hai cách đều có provenance hiển thị.

## 3. State và boundary thực tế

`XemQue.tsx` giữ:

```ts
type CachKhoiQue = "THEO_THOI_GIAN" | "GIEO_DONG_XU";
```

`GieoDongXuFlow.tsx` giữ state machine riêng:

```ts
type Buoc = "CACH_GIEO" | "DANG_GIEO" | "HOAN_TAT" | "XEM_KET_QUA";
```

`chuDe`, `vietTrucTiep` và `cauHoi` nằm ở orchestrator nên được giữ khi đổi giữa hai cách.
Ba lựa chọn `Xem một việc | Xem tổng quan | Quẻ Cuộc Đời` chỉ thuộc nhánh Theo thời gian;
nhánh Coin Casting luôn luận theo một Chủ đề/Dụng Thần. Đây là quyết định triển khai đã có từ
kế hoạch gộp, khác sơ đồ chung trong một số đoạn của merge UX source.

Dự án không dùng router. Điều hướng tiếp tục dùng `useState<Trang>` trong `App.tsx`; vì trước
đây không có URL `/gieo-dong-xu`, không có redirect/deep link cũ cần duy trì.

## 4. Conformance với merge UX

| AC | Trạng thái | Bằng chứng/ghi chú |
|---|---|---|
| AC01 – bỏ Coin khỏi top nav | Đạt | `TRANG` còn 5 mục |
| AC02 – Coin nằm trong Xem quẻ | Đạt | `XemQue` render `GieoDongXuFlow` |
| AC03-04 – section Cách khởi quẻ, đúng 2 lựa chọn | Đạt | Theo thời gian / Gieo đồng xu |
| AC05 – nhánh thời gian có Date/Time/CTA, không có Cách gieo | Đạt | Render có điều kiện theo `cach` |
| AC06-08 – nhánh Coin ẩn Date/Time, có đúng 2 Cách gieo ở tầng con | Đạt | Hai card Gieo trên màn hình / Tôi tự gieo |
| AC09 – dùng chung Câu hỏi/Chủ đề | Đạt một phần | Dùng chung `NoiDungHoiQue`; `loaiQue` không dùng chung theo quyết định nêu trên |
| AC10 – sáu hào từ dưới lên | Đạt ở core | `hao[0]` là Hào 1; có unit test mapping/adapter |
| AC11 – không reroll screen mode | Đạt | Sau khi random chỉ có `Tiếp tục` hoặc huỷ cả phiên |
| AC12 – physical nhập Ngửa/Sấp từng xu | Đạt | Chỉ enable xác nhận khi đủ ba mặt |
| AC13 – cùng nền tảng Lục Hào | Đạt một phần | Cùng `QueDich` và primitive điểm; Coin đi qua adapter riêng |
| AC14 – không duplicate interpretation logic | Đạt một phần | Không copy Nạp Giáp/Thế-Ứng; adapter lặp orchestration tính điểm cho nhiều hào động |
| AC15 – xác định provenance | Đạt ở UI, thiếu ở schema | UI phân biệt TIME/COIN mode; bản lưu Coin không có `castingMethod` tường minh |
| AC16 – mobile không horizontal scroll | Chưa xác minh | Không có UI test; `min-width: 260px` ở cột quẻ có rủi ro trên viewport rất hẹp |
| AC17 – giữ visual style | Đạt | Tái dùng theme, card và token hiện có |

## 5. Conformance rule Coin Casting

Đã có code/test cho:

- bảng bốn tổ hợp Ngửa/Sấp và permutation;
- ba lần random độc lập cho screen mode;
- đúng sáu hào, Hào 1 ở dưới cùng;
- không, một, nhiều và sáu hào động ở tầng adapter;
- không tạo Quẻ Biến giả khi không có hào động;
- lấy thời điểm xác nhận Hào 6 làm mốc Nhật/Nguyệt Kiến;
- lưu raw faces, mode, Chủ đề/Câu hỏi, quẻ chính, quẻ biến và vị trí hào động;
- tải, sắp xếp và xoá bản ghi Coin Casting.

Lần chạy review:

```text
npm test -- --run
Test Files  8 passed (8)
Tests      63 passed (63)
```

Trong 63 test có 43 test legacy và 20 test Coin Casting. Chưa có test UI/component cho việc
chuyển cách khởi quẻ, huỷ phiên, navigation, responsive hay accessibility.

## 6. Blocker và regression risk trước khi coi hoàn tất

### B1. Huỷ phiên và selector — đã sửa trong working tree, thiếu regression test

Khi bước là `DANG_GIEO` hoặc `HOAN_TAT`, child báo `dangGieoDoDang = true` để disable hai nút
Cách khởi quẻ. Bản được review ban đầu chỉ đổi `cach`, khiến cờ cha có thể còn `true` sau khi
child unmount. Working tree mới nhất đã sửa callback `onHuy` để gọi cả
`setCach("THEO_THOI_GIAN")` và `setDangGieoDoDang(false)`.

Đánh giá hiện tại: lỗi runtime đã được xử lý trong code, nhưng chưa có component/UI test cho
`bắt đầu gieo → huỷ → chọn lại Gieo đồng xu`; vì vậy vẫn giữ B1 như regression risk.

### B2. Top navigation bỏ qua bảo vệ phiên đang gieo

Chỉ bộ chọn Cách khởi quẻ bị disable. Năm nút top navigation vẫn hoạt động, nên người dùng có
thể rời `XemQue`, làm unmount luồng và mất tiến độ mà không qua confirmation `Huỷ gieo quẻ`.

Yêu cầu sửa: chặn/confirm navigation trong phiên hoặc đưa session guard lên `App`.

### B3. Chưa có oracle cho điểm vượng suy khi nhiều hào động

Engine legacy vẫn có một `queBien: number`. `core/coinCasting/adapter.ts` tự orchestration việc
cộng ảnh hưởng của tập hào động và quẻ biến bằng các primitive công khai của `QueDich`.

Test đúng một hào động đối chiếu được với engine legacy. Test hai/sáu hào động mới xác nhận
quẻ có thể tạo và điểm là số hữu hạn, chưa có expected score từ rule/domain oracle. Chưa có
tài liệu proposal/review thuật toán riêng như Section 3.1.1 của Feature Specification yêu cầu.

Yêu cầu trước khi chốt nghiệp vụ: viết rule được domain owner duyệt và fixture expected cho
0/1/2/6 hào động; không dùng việc “test pass” hiện tại làm bằng chứng điểm đã đúng.

### B4. Boundary lưu trữ không validate

`QueDaGieoDaLuu` không có `castingMethod`; phương pháp chỉ được suy ngầm từ localStorage key.
JSON đọc từ storage được ép dùng mà không validate. Adapter chỉ kiểm tra `hao.length === 6`,
không kiểm tra vị trí 1-6 đủ/đúng thứ tự/không trùng hoặc tính nhất quán giữa raw faces,
`loai`, `amDuong` và `dong`.

Schema cũng không lưu `vietTrucTiep`. Nếu `chuDe === "khac"`, lúc xem lại orchestrator dùng
Lục Thân mặc định thay vì lựa chọn đã dùng khi lưu; Dụng Thần và diễn giải vì thế có thể đổi
mà người dùng không biết.

Yêu cầu sửa: thêm versioned runtime schema/migration, `castingMethod: "THREE_COINS"`, validate
khi đọc, lưu đầy đủ context xác định Dụng Thần và normalize/reject input trước adapter.

## 7. UX và accessibility gaps

1. **No-moving-line Hero:** Quẻ Biến đúng là `null`, nhưng Hero vẫn render mũi tên tới vùng
   trống. Chỉ render transformation khi thực sự có Quẻ Biến.
2. **Kết quả từng hào:** sau screen/physical input chưa hiện hình hào và Âm/Dương tường minh
   như UX-AC-04; quẻ đang hình thành chỉ nhận hào sau khi bấm `Tiếp tục`/`Xác nhận hào`.
3. **Marker hào động:** màn chi tiết chủ yếu dùng màu đỏ; quẻ đang hình thành có chữ `Động`
   nhưng thiếu ký hiệu O/X. Cần marker bằng hình + text để dùng được ở grayscale/color-blind/
   print.
4. **Tooltip:** `HoverInfo` chỉ nghe mouse enter/leave, không có click/focus/Escape/ARIA cho
   keyboard và touch.
5. **Quẻ đã lưu:** card Coin chưa hiển thị `Hào động: ...` dù dữ liệu đã lưu trường này.
6. **Methodology/trust:** kết quả ghi provenance khởi quẻ nhưng chưa ghi rõ
   `Luận quẻ: Lục Hào Nạp Giáp` như design brief.
7. **Context có thể đổi giữa phiên:** Chủ đề/Câu hỏi vẫn editable khi đang gieo và sau khi có
   kết quả, làm Dụng Thần/bản lưu thay đổi. Cần PO quyết định cho phép reinterpret hay khóa
   context từ lúc bắt đầu gieo.
8. **CTA thời gian:** sau lần bấm `Lập quẻ` đầu tiên, sửa Date/Time làm kết quả đổi ngay vì
   `daLapQue` vẫn `true`; CTA không còn đóng vai trò commit input.
9. **Saved replay:** khi xem lại bản Coin đã lưu, nút `Lưu quẻ` vẫn có thể tạo bản ghi trùng.

## 8. Những quyết định đang được giữ

- Chuyển giữa hai cách trước khi gieo giữ nguyên Chủ đề/Câu hỏi.
- Không cho đổi trực tiếp Cách khởi quẻ từ lúc vào `DANG_GIEO` tới hết `HOAN_TAT`; muốn thoát
  phải dùng `Huỷ gieo quẻ`.
- Kết quả hai cách dùng chung renderer và luôn có provenance.
- `Quẻ đã lưu` gộp ở tầng đọc/hiển thị, không ép hai loại bản ghi vào một schema hiện tại.
- Xem lại Coin Casting dùng raw sáu hào đã lưu và không random/gieo lại.
- Không thêm router chỉ cho thay đổi IA này.

Các quyết định trên chỉ được coi là đạt trọn vẹn khi B1 có regression test và blocker B2 được sửa
kèm test navigation tương ứng.

## 9. Hành động tiếp theo

1. Thêm regression test cho fix B1; sửa B2 và thêm UI tests cho chuyển mode, huỷ, top navigation và replay.
2. Review domain B3; bổ sung proposal và fixture expected trước khi xác nhận AC22/Definition
   of Done trong Feature Specification.
3. Thêm validation/migration cho storage theo B4.
4. Hoàn thiện marker/accessibility/saved card/methodology ở mục 7.
5. Test responsive ở tối thiểu 320, 375, 768 và desktop; xác nhận không horizontal scroll.
6. Chạy lại toàn bộ 63 core tests và bộ UI test mới trước khi đóng review.
