# 07 – Mô hình tính toán Tứ Trụ (đặc tả từ file Excel tham khảo)

> **Trạng thái sau code review 2026-08-31:** repository chưa có `src/core/tuTru/` hay UI Tứ Trụ. Tài liệu này là kết quả reverse-engineer workbook, không phải bằng chứng độc lập rằng mọi rule đúng với một trường phái Bát Tự. Các mục ghi “rule workbook” chỉ cam kết phản ánh công thức/bảng của file nguồn; các rule đã sửa, suy diễn hoặc còn tranh luận phải có nguồn nghiệp vụ và test vector riêng trước khi đưa vào sản phẩm.

## Bối cảnh

Trong mã nguồn desktop gốc, `TuTru/` (xem [`01-tong-quan-du-an.md`](./01-tong-quan-du-an.md)) chỉ có một `Form1` rỗng — **chưa từng có logic nghiệp vụ Tứ Trụ nào được lập trình**. Tài liệu này xây dựng lại đặc tả luật tính Tứ Trụ (Bát Tự) bằng cách đọc ngược (reverse-engineer) một file Excel tham khảo do người dùng cung cấp, dùng làm nền tảng nếu sau này triển khai tính năng Tứ Trụ (tương tự cách tài liệu [`05.1-chinh-ui-ux.md`](./05.1-chinh-ui-ux.md) đã dẫn dắt việc redesign trang Xem Quẻ).

**Nguồn**: file `Tu tru new.xlsx` (không nằm trong repo, do người dùng lưu cục bộ). Workbook có hàng chục sheet trùng cấu trúc (`Tam`, `HQ (2)`, `T.Nam`, `Duong`, `MeHav2`, `MeHav3`, `ADung`, `Thev5`, `Thev6`, `Dung`, `ThoSV`, `Vanv3`, `Vanv4`, `BNv4`, `bnV5`, `Vietv3`, `Uyen2`, `PhuAnh`, `Me Ha`, `VN`, `Bo Quoc`, `CTG`, `Donacoop`...) — mỗi sheet là **lá số của một người**, dùng chung một template công thức. Tài liệu này đặc tả theo sheet **`HQ (2)`** (bản mới nhất, đầy đủ cột nhất) như người dùng yêu cầu, và hai sheet dữ liệu tra cứu dùng làm input:

- **`TC tang`** — bảng Tàng Can trong Địa Chi + bảng Âm Dương/Ngũ Hành của Thiên Can.
- **`NN-TC`** — bảng Thập Thần, bảng Vòng Trường Sinh, bảng Ngũ Hợp Thiên Can, bảng quan hệ Hình/Xung/Hại/Phá/Hợp giữa Địa Chi.

Ký hiệu ô dùng xuyên suốt tài liệu là toạ độ trong sheet `HQ (2)` trừ khi ghi rõ tên sheet khác.

Khi đọc tài liệu cần phân biệt ba loại thông tin:

- **Rule workbook**: công thức hoặc bảng tĩnh thực sự tồn tại trong file Excel.
- **Lỗi workbook**: công thức/validation/tham chiếu đang hỏng; phải ghi nhận để không sao chép sang code.
- **Rule cần triển khai**: nghiệp vụ Bát Tự mà workbook không tính; cần đặc tả và kiểm thử riêng trước khi viết code.

## a) Hợp đồng đầu vào thực tế — vùng A1:D8

| Ô | Nhãn | Giá trị mẫu | Trạng thái thực tế |
|---|---|---|---|
| B1 | Họ tên | `Tam` | text tự do |
| B2 | Giới tính | `Nam` | dropdown `Nam`/`Nữ`; được C8 dùng để xác định chiều Đại Vận |
| B3 | Năm sinh | `1984` | prompt validation ghi **"Năm sinh theo âm lịch"**; chỉ A69 dùng làm năm bắt đầu bảng niên vận |
| B4 | Tháng sinh | `12` | prompt ghi **"Tháng sinh theo âm lịch"**; không có công thức nào tham chiếu |
| B5 | Ngày sinh | `16` | prompt ghi **"Ngày sinh theo âm lịch"**; không có công thức nào tham chiếu |
| B6 | Giờ sinh | `6` | prompt ghi **"Giờ sinh theo âm lịch"**; không có công thức nào tham chiếu |
| C3:D6 | Can–Chi bốn trụ | Giáp Tí / Đinh Sửu / Ất Tị / Canh Thìn | tám input tay độc lập; đây mới là input trực tiếp của hầu hết công thức |
| B7 | Tiết chính | `Lập xuân` | input tay; không được công thức nào sử dụng |
| B8 | Số ngày tính khởi vận | `14` | input tay; D8 dùng làm offset tạo nhãn tuổi Đại Vận |

Các validation tại B3:B6 chỉ chứa lời nhắc (`type=None`), không ràng buộc miền giá trị. Workbook vì vậy không bảo đảm B3:B6 hợp lệ hoặc nhất quán với C3:D6. Mẫu hiện tại cũng cho thấy không thể suy ngược an toàn: nếu B6 được hiểu là `06:00` theo cách chia giờ dân dụng thông thường thì Chi giờ thuộc giờ Mão, trong khi D6 đang là `Thìn`.

Bộ `1984/12/16` và ba trụ Năm/Tháng/Ngày trong mẫu khớp với **ngày âm lịch** 16/12/1984 theo thuật toán lịch Việt Nam đang dùng trong project tại UTC+7 (tương ứng `1985-01-06` dương lịch), không phải ngày dương `1984-12-16`. Vì vậy không được dùng cột B như contract ngày giờ dương lịch của một implementation mới.

## b) Can Chi bốn trụ — input tay C3:D6, không phải kết quả công thức

| Hàng | Trụ | C (Thiên Can) | D (Địa Chi) |
|---|---|---|---|
| 3 | Năm | Giáp | Tí |
| 4 | Tháng | Đinh | Sửu |
| 5 | Ngày | Ất | Tị |
| 6 | Giờ | Canh | Thìn |

Tám ô C3:D6 đều là giá trị tĩnh. Workbook không có dependency từ B3:B6 sang C3:D6 và không tự thực hiện bất kỳ bước đổi lịch hoặc an trụ nào. Bốn trụ thô dùng cho các mục sau là: Năm = C3/D3, Tháng = C4/D4, Ngày = C5/D5, Giờ = C6/D6.

Nếu sản phẩm mới nhận ngày giờ **dương lịch**, cần một lớp `FourPillarsCalendar` riêng với contract tối thiểu gồm ngày, giờ, phút, múi giờ IANA và chính sách xử lý giờ Tý. Nếu nghiệp vụ chọn hiệu chỉnh theo giờ mặt trời thực, contract phải có thêm nơi sinh/kinh độ và công thức hiệu chỉnh được chốt rõ. Lớp này phải:

1. tính trụ Năm theo ranh Lập Xuân;
2. tính trụ Tháng theo thời điểm chính xác của 12 Tiết chính, không theo mùng 1 âm lịch;
3. tính trụ Ngày và trụ Giờ theo quy ước đã chốt;
4. chuẩn hoá chính tả Địa Chi giữa code (`Tý`, `Tỵ`) và workbook (`Tí`, `Tị`).

Không được tái dùng **trực tiếp** toàn bộ output của [`tinhAmLich()`](../../src/core/lunar.ts): hàm hiện lấy `lunarMonthStr` và `lunarYearStr` theo tháng/năm âm lịch, nên sai ranh trụ Năm/Tháng Bát Tự quanh Lập Xuân và các Tiết chính. Có thể tái sử dụng các primitive thiên văn/lịch phù hợp sau khi có test vector cho từng ca biên.

## c) Tiết chính và mốc khởi Đại Vận — A7:D8

`B7` có dropdown 12 Tiết chính: Lập xuân, Kinh trập, Thanh minh, Lập hạ, Mang chủng, Tiểu thử, Lập thu, Bạch lộ, Hàn lộ, Lập đông, Đại tuyết, Tiểu hàn. Validation này cũng được áp vào B9, một ô đang trống và không được dùng. Trong `HQ (2)`, **không có công thức nào tham chiếu B7**; D4 vẫn là input tay và B8 cũng không được suy ra từ B7.

Vai trò nghiệp vụ cần triển khai trong code, nhưng chưa có trong workbook:

1. Chi tháng đổi tại 12 Tiết chính theo mapping: Lập xuân→Dần, Kinh trập→Mão, Thanh minh→Thìn, Lập hạ→Tị, Mang chủng→Ngọ, Tiểu thử→Mùi, Lập thu→Thân, Bạch lộ→Dậu, Hàn lộ→Tuất, Lập đông→Hợi, Đại tuyết→Tí, Tiểu hàn→Sửu.
2. Sau khi C8 xác định Thuận/Nghịch từ giới tính và âm/dương Can năm (xem mục g), rule nghiệp vụ đề xuất là đếm tới **Tiết chính kế tiếp khi Thuận** hoặc **Tiết chính trước đó khi Nghịch**; cần xác nhận bằng nguồn nghiệp vụ và test vector, vì workbook không tự thực hiện bước này.
3. Phải dùng thời điểm giao tiết chính xác. Workbook không có một civil datetime đầy đủ, nhất quán và có múi giờ, nên không phân loại được ca sinh gần ranh giao tiết.

Rule Excel còn lại là `D8 = ROUND(B8/3,0)`. Đây là phép xấp xỉ làm mất phần tháng/ngày của thời điểm khởi vận; mục g mô tả thêm cách workbook sử dụng kết quả này.

## d) Thống kê thô Thập Thần — vùng I2:M13

Khối này có nhãn `I2 = "Thống kê tứ trụ"`. Nó **không tính mạnh/yếu Ngũ Hành** theo nghĩa vượng suy; nó chỉ đếm tần suất 10 Thập Thần xuất hiện trong một vùng ô. Thập Thần là 5 cặp quan hệ sinh/khắc/đồng giữa Ngũ Hành của từng Can với **Nhật Can**:

| Nhóm Thập Thần | J (nhãn) | Quan hệ Ngũ Hành với Nhật Can |
|---|---|---|
| Tỉ + Kiếp | Tỉ / Kiếp | Cùng hành (Tỉ = cùng âm dương, Kiếp = khác âm dương) — "ngang vai" |
| Thực + Thương | Thực / Thương | Hành do Nhật Can **sinh ra** — "ta sinh" |
| Tài | Thiên tài / Chính tài | Hành bị Nhật Can **khắc** — "ta khắc" |
| Quan + Sát | Sát / Quan | Hành **khắc** Nhật Can — "khắc ta" |
| Kiêu + Ấn | Kiêu / Ấn | Hành **sinh ra** Nhật Can — "sinh ta" |

Công thức cụ thể:

- `I3 = VLOOKUP($G$19, NguhanhThiencan, 3, FALSE)` — Ngũ Hành (kèm Âm/Dương) của Nhật Can, ví dụ Nhật Can "Ất" → "Âm mộc". `NguhanhThiencan` là tên vùng trỏ tới `'TC tang'!D17:F36` (bảng Thiên Can → Âm Dương → Ngũ Hành, xem mục e). `G19` là Ngày Can, lấy từ mục (e).
- `K3:K12 = COUNTIF($A$18:$Q$21, <nhãn Thập Thần>)` — đếm 3 Thiên Can lộ ở hàng 18 (Năm/Tháng/Giờ, không tính Nhật Chủ) và các Thập Thần thực sự có mặt ở hàng 21.
- `L3, L5, L7, L9, L11 = tổng theo cặp` (ví dụ `L3 = K3+K4` cho Tỉ+Kiếp) — đây là **số lần xuất hiện**, không phải điểm vượng suy.
- `M3, M5, M7, M9, M11 = L / $M$13` — tỷ lệ % của mỗi nhóm trên tổng.
- `M13 = SUM(L3:L12)` — tổng số lần được đếm; mỗi Can có trọng số 1, không xét vị trí, mùa, khoảng cách, đắc căn hoặc điều kiện hợp hóa.

Kết quả mẫu hiện có `M13=12`, nhưng con số này đã thiếu Tàng Can thứ ba của Chi giờ Thìn. Nếu lấy đủ Quý ở trụ Giờ thì mẫu có thêm một Kiêu và tổng phải là 13. Vì vậy không dùng trực tiếp tỷ lệ đang cache làm test chuẩn.

Khối phụ ở hàng 34–41 cũng chưa hoàn chỉnh: `A34` phân loại "Được lệnh" từ I18, nhưng `C34 = IF(1=1,"Đắc địa",...)` luôn trả "Đắc địa" và hàng 37–41 chỉ có nhãn Ngũ Hành, không có công thức. Không được port C34 hoặc coi khối này là phép tính vượng suy đã hoàn thiện.

## e) Bảng Tứ Trụ chính — vùng A16:K22, dùng sheet `TC tang` làm input

Nhãn hàng 16: `A16 = "Năm sinh"`, `D16 = "Tháng sinh"`, `G16 = "ngày sinh"`, `J16 = "Giờ sinh"`.

### Hàng 19 — bốn trụ Can-Chi + trạng thái "tọa" của 3 trụ đầu

| Cột | Công thức | Ý nghĩa |
|---|---|---|
| A19 | `=C3` | Năm Can |
| B19 | `=D3` | Năm Chi |
| C19 | `INDEX(vongtruongsinh, MATCH(B19,...), MATCH(A19,...))` | Trạng thái Trường Sinh của **Năm Can tọa Năm Chi** |
| D19 | `=C4` | Tháng Can |
| E19 | `=D4` | Tháng Chi |
| F19 | `INDEX(vongtruongsinh, MATCH(E19,...), MATCH(D19,...))` | Trạng thái Trường Sinh của **Tháng Can tọa Tháng Chi** |
| G19 | `=C5` | **Ngày Can — Nhật Chủ / bản mệnh** |
| H19 | `=D5` | Ngày Chi |
| I19 | `INDEX(vongtruongsinh, MATCH(H19,...), MATCH(G19,...))` | Trạng thái Trường Sinh của **Nhật Chủ tọa Ngày Chi** |
| J19 | `=C6` | Giờ Can |
| K19 | `=D6` | Giờ Chi |

(Trụ Giờ không có ô "tọa" riêng ở hàng này — bảng dừng ở cột K.)

`vongtruongsinh` là tên vùng trỏ tới `'NN-TC'!A26:K38`: hàng 26 là 10 Thiên Can, cột A27:A38 là 12 Địa Chi (Tí→Hợi); mỗi ô giao là 1 trong 12 trạng thái Vòng Trường Sinh (Trường sinh, Mộc dục, Quan đới, Lâm quan, Đế vượng, Suy, Bệnh, Tử, Mộ, Tuyệt, Thai, Dưỡng) của Can đó khi đứng trên Chi đó.

### Hàng 18 — Thập Thần lộ ra của 3 Can (so với Nhật Chủ) + một số trạng thái Trường Sinh chéo trụ

| Cột | Công thức | Ý nghĩa |
|---|---|---|
| A18 | `INDEX('NN-TC'!A1:K11, MATCH($G$19,...), MATCH(A19,...))` | Thập Thần của **Năm Can** so với Nhật Chủ |
| C18 | `INDEX(vongtruongsinh, MATCH(E19,...), MATCH(A19,...))` | Trạng thái Trường Sinh của Năm Can khi đứng trên Chi Tháng |
| D18 | `INDEX('NN-TC'!A1:K11, MATCH($G$19,...), MATCH(D19,...))` | Thập Thần của **Tháng Can** so với Nhật Chủ |
| F18 | `INDEX(vongtruongsinh, MATCH(E19,...), MATCH(D19,...))` | (trùng F19 — Tháng Can tọa Tháng Chi) |
| G18 | `"Nhật Nguyên"` | nhãn tĩnh đánh dấu cột Ngày là Nhật Chủ |
| I18 | `INDEX(vongtruongsinh, MATCH(E19,...), MATCH(G19,...))` | **Trạng thái Trường Sinh của Nhật Chủ khi đứng trên Chi Tháng** — quan trọng: đây là căn cứ trực tiếp cho việc xét "được lệnh/không được lệnh" (ô `A34`, ngoài phạm vi tài liệu) |
| J18 | `INDEX('NN-TC'!A1:K11, MATCH($G$19,...), MATCH(J19,...))` | Thập Thần của **Giờ Can** so với Nhật Chủ |

`'NN-TC'!A1:K11` là bảng Thập Thần: hàng 1 và cột A liệt kê 10 Thiên Can (Nhật Nguyên theo hàng, Can cần so theo cột), giao điểm là 1 trong 10 Thập Thần (Tỉ, Kiếp, Thực, Thương, Thiên tài, Chính tài, Sát, Quan, Kiêu, Ấn).

### Hàng 20 — Tàng Can trong từng Địa Chi, tra từ sheet `TC tang`

`'TC tang'!A2:D13` là bảng tĩnh 12 Địa Chi → tối đa 3 Tàng Can. Ba cột B/C/D **không có tiêu đề trong sheet**, nên rule trích xuất chắc chắn chỉ là Tàng Can thứ 1/2/3. Việc gọi chúng là bản khí/trung khí/dư khí là diễn giải nghiệp vụ bên ngoài workbook.

| Địa Chi | Tàng Can 1 | Tàng Can 2 | Tàng Can 3 |
|---|---|---|---|
| Tí | Quý | — | — |
| Sửu | Kỷ | Quý | Tân |
| Dần | Giáp | Bính | Mậu |
| Mão | Ất | — | — |
| Thìn | Mậu | Ất | Quý |
| Tị | Bính | Mậu | Canh |
| Ngọ | Đinh | Kỷ | — |
| Mùi | Kỷ | Đinh | Ất |
| Thân | Canh | Mậu | Nhâm |
| Dậu | Tân | — | — |
| Tuất | Mậu | Đinh | Tân |
| Hợi | Nhâm | Giáp | — |

Sheet không chứa trọng số cho ba vị trí. Tàng Can không tồn tại là ô trống; `VLOOKUP` của Excel có thể trả `0`, nhưng model mới phải chuẩn hoá thành `null`, không coi `0` là một Can. Ký pháp `2..4` dưới đây là cách viết rút gọn cho ba công thức có chỉ số cột 2, 3, 4; không phải cú pháp Excel nguyên văn.

| Cột | Tra cứu rút gọn | Ý nghĩa |
|---|---|---|
| A20:C20 | `VLOOKUP(B19,'TC tang'!A2:D13,2..4,FALSE)` | ba slot của **Năm Chi** |
| D20:F20 | `VLOOKUP(E19,'TC tang'!A2:D13,2..4,FALSE)` | ba slot của **Tháng Chi** |
| G20:I20 | `VLOOKUP(H19,'TC tang'!A2:D13,2..4,FALSE)` | ba slot của **Ngày Chi** |
| J20:K20 | `VLOOKUP(K19,'TC tang'!A2:D13,2..3,FALSE)` | chỉ hai slot đầu của **Giờ Chi** |

Trụ Giờ thiếu hoàn toàn slot thứ ba do layout chỉ dừng ở cột K. Đây là lỗi dữ liệu thực tế: K19 hiện là Thìn, bảng nguồn trả Mậu/Ất/Quý nhưng hàng 20 chỉ giữ Mậu/Ất và làm rơi Quý. Model mới phải biểu diễn mỗi trụ bằng cùng một cấu trúc `hiddenStems[0..2]`, không mô phỏng giới hạn cột của Excel.

### Hàng 21 — Thập Thần của từng Tàng Can (so với Nhật Chủ)

Mỗi ô hàng 21 tra `'NN-TC'!A1:K11` với hàng = `$G$19` (Nhật Chủ), cột = Tàng Can tương ứng ở hàng 20. Công thức có guard `0`/chuỗi rỗng nên các slot không tồn tại thường trả rỗng. Cách guard không nhất quán là chi tiết Excel; code mới chỉ cần xử lý một giá trị `null` duy nhất.

### Hàng 22 — Trạng thái Trường Sinh của từng Tàng Can, đối chiếu với lệnh Tháng

Mỗi ô hàng 22 dùng `INDEX(vongtruongsinh, MATCH($E$19,...), MATCH(X20,...))`: Chi tháng E19 là hàng tra cố định, Tàng Can ở hàng 20 là cột tra. Đây là trạng thái Vòng Trường Sinh của Tàng Can theo Chi tháng, không phải trạng thái tại Chi đang chứa nó.

**Lỗi workbook**: hàng 22 không có guard ô trống. Với mẫu hiện tại, B20=0 và C20="" làm `B22` và `C22` trả `#N/A`. Khi migrate, chỉ lookup khi Tàng Can khác `null`; slot trống phải trả `null`, không phát sinh lỗi.

## f) Quan hệ giữa các trụ — vùng T14:AB17

### Ngũ Hợp Thiên Can và quan hệ `khắc` (T15:W17)

6 ô, đúng đủ 6 cặp trong 4 trụ (Năm-Tháng, Năm-Ngày, Năm-Giờ, Tháng-Ngày, Tháng-Giờ, Ngày-Giờ):

| Ô | Công thức | Cặp Can được so |
|---|---|---|
| U15 | `INDEX(TCNguHop, MATCH(A19,'NN-TC'!A41:A51,0), MATCH(D19,'NN-TC'!A41:K41,0))` | Năm Can (A19) × Tháng Can (D19) |
| V15 | tương tự, `MATCH(G19,...)` | Năm Can × Ngày Can (G19) |
| W15 | tương tự, `MATCH(J19,...)` | Năm Can × Giờ Can (J19) |
| V16 | `MATCH(D19,...)` hàng, `MATCH(G19,...)` cột | Tháng Can × Ngày Can |
| W16 | tương tự | Tháng Can × Giờ Can |
| W17 | tương tự | Ngày Can × Giờ Can |

Tên đúng của năm cặp là **Ngũ Hợp Thiên Can**; số 6 ở đây là số cặp trụ `C(4,2)`, không phải "Lục Hợp". Công thức lookup cho ba dạng output:

- `0` khi ô tương ứng trong ma trận đang trống và Excel trả/hiển thị ô trống đó như số 0;
- `"khắc"` tại các cặp được bảng đánh dấu khắc;
- `Thổ/Kim/Thủy/Mộc/Hỏa` tại Giáp–Kỷ, Ất–Canh, Bính–Tân, Đinh–Nhâm, Mậu–Quý.

Tên hành chỉ là kết quả lookup của cặp Ngũ Hợp, **không chứng minh cặp Can đã đủ điều kiện hóa**. Ví dụ `W17="Kim"` chỉ có nghĩa bảng tra Ất–Canh trả về Kim.

### Tam Hợp / Tam Hội / Bán Hợp Địa Chi (Y15:AB17) — **BỊ LỖI, KHÔNG DÙNG ĐƯỢC**

| Ô | Công thức | Ba Chi được so |
|---|---|---|
| Z15 | `=tamhop(B19,E19,H19)` | Năm-Tháng-Ngày |
| AA15 | `=tamhop(B19,E19,K19)` | Năm-Tháng-Giờ |
| AB15 | `=tamhop(E19,H19,K19)` | Tháng-Ngày-Giờ |
| — | *(không có ô/công thức)* | **Năm-Ngày-Giờ** |

Workbook chứa ba lời gọi cho 3 trong 4 tổ hợp chọn ba trụ, nhưng chưa kiểm tra được tổ hợp nào vì cả ba đều trả `#NAME?`. File `.xlsx` không chứa VBA hay defined name định nghĩa `tamhop`. `Y16="Tam hội"` và `Y17="Bán hợp"` chỉ là nhãn, không có công thức.

Nếu migrate, phải đặc tả riêng Tam Hợp, Tam Hội, Bán Hợp và điều kiện hóa; không coi ba lời gọi hỏng là source of truth. Bốn bộ Tam Hợp được các công thức Thần Sát dùng làm nhóm là Dần–Ngọ–Tuất, Thân–Tí–Thìn, Tị–Dậu–Sửu và Hợi–Mão–Mùi.

## g) Đại Vận — hàng 8, 24–32

| Ô | Công thức | Ý nghĩa |
|---|---|---|
| B8 | *(giá trị tĩnh, ví dụ 14)* | Số ngày nhập tay; comment chỉ nói đếm tới tiết khí của tháng trước hoặc sau tùy âm/dương năm và giới tính, không xác định thuật toán chọn mốc |
| C8 | `IF(OR(AND(VLOOKUP(A19,'TC tang'!D17:E26,2,FALSE)="Dương",B2="Nam"), AND(...="Âm",B2="Nữ")), "Thuận", "Nghịch")` | **Chiều Đại Vận**: Dương Can + Nam, hoặc Âm Can + Nữ ⇒ Thuận (đi theo chiều tăng dần Can/Chi); ngược lại ⇒ Nghịch |
| D8 | `ROUND(B8/3,0)` | giá trị quy đổi gần đúng ngày/3; workbook gọi là năm bắt đầu tính Đại Vận |

Hàng 25/30 hiển thị `tuổi = 10 × n + D8 − 1`, với `n=0..9`. Mẫu `D8=5` vì vậy hiện `4, 14, ..., 94 tuổi`. Workbook không giải thích đây là tuổi mụ, tuổi hoàn thành hay chỉ số zero-based; phải chốt quy ước tuổi trước khi port, không mặc định D8 và nhãn `D8−1` cùng mang một nghĩa.

Hàng 27/32 sinh **Can-Chi của từng vận**, bắt đầu từ Can-Chi trụ Tháng (`A27=D19`, `B27=E19`) rồi cộng/trừ dần theo chiều Thuận/Nghịch (`$C$8`):

```
C27 = IF($C$8="Thuận",
        INDEX(ListThienCan2, MATCH(A27,ListThienCan,0)+1),   ' Can kế tiếp
        IF(A27="Giáp","Quý", INDEX(ListThienCan2, MATCH(A27,ListThienCan,0)-1)))  ' Can trước đó, xử lý riêng biên Giáp→Quý
D27 = tương tự cho Địa Chi (biên Tí→Hợi xử lý riêng)
```

Slot đầu A27:B27 sao chép nguyên trụ Tháng; chỉ các slot sau mới tiến/lùi. Đây là hành vi thực tế của workbook, chưa đủ để kết luận slot đầu là Đại Vận thứ nhất đúng về nghiệp vụ.

`ListThienCan2`/`ListDiaChi2` lặp hai vòng để công thức `MATCH(...)+1` quay vòng. Khi code hóa nên dùng modulo 10/modulo 12 thay cho nhân đôi mảng.

Hàng 26/31 tính Thập Thần và trạng thái Trường Sinh của Can mỗi slot theo Chi tháng cố định `$E$19`. B8 vẫn phải được tính bên ngoài workbook và phần lẻ tháng/ngày khởi vận đã bị `ROUND` loại bỏ.

## h) Niên vận 100 năm — vùng A68:AP168

Đây là khối lớn nhất của `HQ (2)` với 3.889/4.340 công thức. Nó tạo dòng thời gian 1–100 tuổi nhưng đang chứa nhiều lỗi; cần tách **rule dự kiến** khỏi **implementation Excel hỏng**.

| Cột | Rule đang thể hiện |
|---|---|
| A/B | `năm = B3 + tuổi - 1`; tuổi 1–100 |
| C/D | Can–Chi Đại Vận; rỗng trước D8, sau đó dùng `floor((tuổi-D8)/10)+1` |
| E | Thập Thần của Can Đại Vận so với Nhật Chủ |
| F/G | Can–Chi Lưu niên, bắt đầu từ C3/D3 rồi tiến tuần tự |
| H | Trường Sinh của Can Lưu niên theo Chi tháng E19 |
| I/J | Tiểu vận, bắt đầu từ Can–Chi kế tiếp của trụ Giờ rồi luôn tiến thuận; cần xác nhận nghiệp vụ trước khi port |
| K | Trường Sinh của Can Tiểu vận theo Chi tháng E19 |
| L/M | quan hệ Can khắc/Chi xung giữa Lưu niên và trụ Năm |
| N/O | có tiêu đề nhưng hoàn toàn không có công thức; không suy diễn thành rule |
| P/Q | quan hệ Can khắc/Chi xung giữa Lưu niên và trụ Ngày |
| R | Đại Vận trùng hoàn toàn Can–Chi Lưu niên ⇒ `"Nguy hiem"` |
| S | báo `"3 Xung 1"` khi hai phía của một cặp xung đều có mặt và chênh số lượng ít nhất 2 |
| T:AE | đếm 12 Địa Chi trong bốn trụ natal và dòng vận hiện hành |
| AG:AP | số Thập Thần natal K3:K12 cộng Thập Thần Đại Vận ở E; không cộng Lưu niên/Tiểu vận |

Rule Đại Vận chuẩn hóa cần dùng dữ liệu của **chính lá số**:

```text
if tuoi < tuoiKhoiVan:
    daiVan = null
else:
    index = floor((tuoi - tuoiKhoiVan) / 10) + 1
    daiVan = generateFromOwnMonthPillar(index, thuanNghich)
```

### Lỗi workbook không được port

1. `C69:D168` dùng global name `DaiVan = Duong!H2:J14`, nên lấy Can–Chi Đại Vận của người ở sheet `Duong`.
2. `C77` dùng nhầm `HLOOKUP(...,3)` thay vì lookup Can Đại Vận, gây `#N/A` lan sang E77/R77.
3. `M69:M78` thiếu công thức; N/O không được triển khai.
4. `V69:V168` chứa 100 `#REF!`; `W69:W168` dùng tiêu chí V68 (Mão) thay vì W68 (Dậu), làm hỏng cặp Mão–Dậu và cảnh báo cột S.
5. `L/P` và `M/Q` bị lệch một hàng/cột: vùng MATCH đã bỏ header nhưng mảng INDEX `TCNguHop`/`Quanhediachi` vẫn chứa header.
6. `M/Q` chỉ so đúng toàn chuỗi `"xung"`, nên bỏ sót ô có nhiều quan hệ như `"hình xung"`.

Khi migrate, tra quan hệ bằng khóa Can/Chi hoặc enum, không mô phỏng offset bảng Excel; một ô quan hệ Chi phải được tách thành tập token (`hình`, `xung`, `hại`, `phá`, `hợp`).

## i) Thần Sát — vùng A171:S216 và A44:K66

### Khối input dùng chung (A171:C175)

`A171 = "Tính cát, hung thần"`. Bốn hàng bên dưới (172–175) là **bản sao gọn** của 4 trụ Can-Chi, xếp theo hàng thay vì theo cột như hàng 19 — dùng làm input thống nhất cho toàn bộ công thức Thần Sát:

| Hàng | A (nhãn) | B (Can, `=Cx`) | C (Chi, `=Dx`) |
|---|---|---|---|
| 172 | Năm | `=C3` | `=D3` |
| 173 | Tháng | `=C4` | `=D4` |
| 174 | Ngày | `=C5` | `=D5` |
| 175 | Giờ | `=C6` | `=D6` |

### Cơ chế và rule được trích xuất (hàng 178–216)

Mỗi hàng **đã triển khai** hard-code một rule bằng `IF/AND/OR`; không có bảng tra dùng chung. Bảng dưới tóm tắt mapping nhất quán suy ra từ các công thức lặp. Các literal/reference lệch đơn lẻ được giữ dấu vết ở bảng lỗi bên dưới và không được coi là rule chuẩn. Đây là **rule được trích xuất**, chưa phải xác nhận độc lập rằng mọi mapping phù hợp tất cả trường phái Bát Tự.

| Hàng | Thần Sát | Neo và mapping |
|---:|---|---|
| 178 | Thiên Ất | Can Năm và Can Ngày: Giáp/Mậu→Sửu,Mùi; Ất/Kỷ→Tí,Thân; Bính/Đinh→Hợi,Dậu; Nhâm/Quý→Mão,Tị; Canh/Tân→Dần,Ngọ |
| 179 | Thái Cực | Can Năm và Can Ngày: Giáp/Ất→Tí,Ngọ; Bính/Đinh→Dậu,Mão; Mậu/Kỷ→Thìn,Tuất,Sửu,Mùi; Canh/Tân→Dần,Hợi; Nhâm/Quý→Tị,Thân |
| 180 | Thiên Đức | Chi Tháng: Dần→Đinh; Mão→Thân; Thìn→Nhâm; Tị→Tân; Ngọ→Hợi; Mùi→Giáp; Thân→Quý; Dậu→Dần; Tuất→Bính; Hợi→Ất; Tí→Tị; Sửu→Canh. Mục tiêu có thể là Can hoặc Chi theo từng nhánh |
| 181 | Nguyệt Đức | Chi Tháng theo nhóm: Dần/Ngọ/Tuất→Bính; Thân/Tí/Thìn→Nhâm; Hợi/Mão/Mùi→Tân; Tị/Dậu/Sửu→Canh |
| 183 | Phúc Tinh | Can Năm và Can Ngày: Giáp/Bính→Dần,Tí; Ất/Quý→Mão,Sửu; Mậu→Thân; Kỷ→Mùi; Đinh→Hợi; Canh→Ngọ; Tân→Tị; Nhâm→Thìn |
| 184 | Văn Xương | Can Năm và Can Ngày: Giáp→Tị; Ất→Ngọ; Mậu→Thân; Đinh→Dậu; Canh→Hợi; Tân→Tí; Nhâm→Dần; Quý→Thìn; workbook không có nhánh Bính/Kỷ |
| 185 | Khôi Canh | Nhật trụ thuộc Nhâm–Thìn, Canh–Tuất, Canh–Thìn, Mậu–Tuất |
| 186 | Quốc Ấn | Can Năm và Can Ngày: Giáp→Tuất; Ất→Hợi; Bính/Mậu→Sửu; Đinh/Kỷ→Dần; Canh→Thìn; Tân→Tị; Nhâm→Mùi; Quý→Thân |
| 189 | Tú quý nhân | Chi Tháng: Dần/Ngọ/Tuất→Mậu,Quý; Thân/Tí/Thìn→Bính,Tân,Giáp,Kỷ; Tị/Dậu/Sửu→Ất,Canh; Hợi/Mão/Mùi→Đinh,Nhâm |
| 190 | Đức quý nhân | Chi Tháng: Dần/Ngọ/Tuất→Bính,Đinh; Thân/Tí/Thìn→Nhâm,Quý,Mậu,Kỷ; Tị/Dậu/Sửu→Canh,Tân; Hợi/Mão/Mùi→Giáp,Ất |
| 191 | Trạch mã | Nhóm Chi Năm và Chi Ngày: Dần/Ngọ/Tuất→Thân; Thân/Tí/Thìn→Dần; Hợi/Mão/Mùi→Tị; Tị/Dậu/Sửu→Hợi |
| 192 | Hoa cái | Nhóm Chi Năm và Chi Ngày: Dần/Ngọ/Tuất→Tuất; Thân/Tí/Thìn→Thìn; Hợi/Mão/Mùi→Mùi; Tị/Dậu/Sửu→Sửu |
| 193 | Tướng tinh | Nhóm Chi Năm và Chi Ngày: Dần/Ngọ/Tuất→Ngọ; Thân/Tí/Thìn→Tí; Hợi/Mão/Mùi→Mão; Tị/Dậu/Sửu→Dậu |
| 194 | Kim dư | Can Ngày: Giáp→Thìn; Ất→Tị; Bính/Mậu→Mùi; Đinh/Kỷ→Thân; Canh→Tuất; Tân→Hợi; Nhâm→Sửu; Quý→Dần |
| 195 | Kim thần | Nhật trụ hoặc trụ Giờ là Ất–Sửu, Kỷ–Tị, Quý–Dậu |
| 196 | Thiên y | Chi Tháng→Chi liền trước trong mapping: Dần→Sửu, Mão→Dần, …, Sửu→Tí; kiểm tra Năm/Ngày/Giờ, không kiểm tra chính trụ Tháng |
| 197 | Lộc thần | Can Ngày: Giáp→Dần; Ất→Mão; Bính/Mậu→Tị; Đinh/Kỷ→Ngọ; Canh→Thân; Tân→Dậu; Nhâm→Hợi; Quý→Tí |
| 199 | Thiên xá | Chi Tháng Dần/Mão/Thìn + ngày Mậu–Dần; Tị/Ngọ/Mùi + Giáp–Ngọ; Thân/Dậu/Tuất + Mậu–Thân; Hợi/Tí/Sửu + Giáp–Tí |
| 203 | Kình dương | Can Ngày: Giáp→Mão; Ất→Dần; Bính/Mậu→Ngọ; Đinh/Kỷ→Tị; Canh→Dậu; Tân→Thân; Nhâm→Tí; Quý→Hợi |
| 204 | Kiếp sát | Nhóm Chi Năm và Chi Ngày: Dần/Ngọ/Tuất→Hợi; Thân/Tí/Thìn→Tị; Hợi/Mão/Mùi→Thân; Tị/Dậu/Sửu→Dần |
| 205 | Tai sát | Nhóm Chi Năm và Chi Ngày: Dần/Ngọ/Tuất→Tí; Thân/Tí/Thìn→Ngọ; Hợi/Mão/Mùi→Dậu; Tị/Dậu/Sửu→Mão |
| 207 | Cô Thần | **Chỉ neo Chi Năm**: Hợi/Tí/Sửu→Dần; Dần/Mão/Thìn→Tị; Tị/Ngọ/Mùi→Thân; Thân/Dậu/Tuất→Hợi |
| 208 | Quả tú | **Chỉ neo Chi Năm**: Hợi/Tí/Sửu→Tuất; Dần/Mão/Thìn→Sửu; Tị/Ngọ/Mùi→Thìn; Thân/Dậu/Tuất→Mùi |
| 213 | Hàm trì | Nhóm Chi Năm và Chi Ngày: Dần/Ngọ/Tuất→Mão; Thân/Tí/Thìn→Dậu; Hợi/Mão/Mùi→Tí; Tị/Dậu/Sửu→Ngọ |
| 215 | Âm dương lệch | Nhật trụ thuộc Bính–Tí, Đinh–Sửu, Mậu–Dần, Tân–Mão, Nhâm–Thìn, Quý–Tị, Bính–Ngọ, Đinh–Mùi, Mậu–Thân, Tân–Dậu, Nhâm–Tuất, Quý–Hợi |

13 tên chỉ là placeholder, không có công thức: `Tam Kỳ`, `Từ quán`, `Học đường`, `Củng lộc`, `Thiên la`, `Địa võng`, `Cấu Giảo`, `Vong thần`, `Nguyên thần`, `Không, vong`, `Thập ác đại bại`, `Cô Loan`, `Tứ phế`.

### Lỗi hard-code phải sửa trước khi port

| Loại lỗi | Ô | Sửa chuẩn hóa |
|---|---|---|
| Dùng Thiên Can ở vị trí Địa Chi | K/Q/R/S189 và K/Q/R/S190 | literal workbook `Tân` → `Hợi`; giá trị `Hợi` được suy ra từ bộ Tam Hợp `Hợi–Mão–Mùi` đang được mã hoá ở cùng rule |
| Sai chính tả Chi | C/D/E/F/G/J205 | `Mẵo` → `Mão` |
| Sai chính tả Can | I215 | `Qúy` → `Quý`; ca bị mất là **Nhật trụ Quý–Hợi**, không phải Nhâm ngày/Hợi giờ |
| Copy sai Can neo | J179 | B175 (Can Giờ) → B174 (Can Ngày) |
| Copy sai Can neo | G183 | B173 (Can Tháng) → B174 (Can Ngày) |
| Copy sai Can neo | J186 | B175 (Can Giờ) → B174 (Can Ngày) |
| Sai nhãn output | S181 | `giờ phù trợ` |
| Sai nhãn output | J192 | `giờ phù trợ` |
| Sai nhãn output | I197 | `ngày phù trợ` |
| Sai định dạng output | I203 | `ngày khắc` |
| Sai nhãn output | J204 | `giờ khắc` |
| Sai nhãn output | G213 | `tháng phù trợ` |

Tổng cộng có 15 literal Can/Chi không hợp lệ, 3 reference sai nguồn và 6 nhãn sai/không chuẩn. Lỗi nhãn không làm mất tên sao ở bảng tổng hợp vì lớp hiển thị chỉ kiểm tra ô rỗng; lỗi literal/reference làm kết quả nhận diện sai thực sự.

### Bảng tổng hợp hiển thị theo trụ (A44:K66)

Vùng đúng là A44:K66, không phải A44:K76. Nó ghép **khối 1 (hàng 178:200)** với **khối 2 (hàng 201:223)** và chỉ hiện tên sao khi ô kết quả tương ứng khác rỗng; workbook không có header đủ rõ để khẳng định hai khối lần lượt là cát thần/hung thần. Sheet chỉ có dữ liệu tới hàng 216; các tham chiếu tới 217:223 trỏ vào nguồn trống/không tồn tại, chưa đủ bằng chứng để coi là placeholder có chủ ý.

### Sheet `Cát Thần` — không được dùng

Workbook có sẵn một sheet riêng tên `Cát Thần` (45 hàng × 13 cột, 126 công thức), chủ yếu cũng hard-code điều kiện `IF/AND/OR` và liên kết về `HQ`; đây **không phải** một bảng tra `VLOOKUP`. Không có công thức nào trong toàn bộ workbook tham chiếu tới sheet này, nên chỉ có thể coi nó là một nhánh tính toán không hoạt động/bản nháp cũ. Bỏ qua khi migrate cho tới khi có bằng chứng nghiệp vụ khác.

## Phụ lục — các bảng tra cứu dùng chung (named range trong workbook)

| Tên | Vùng | Nội dung |
|---|---|---|
| `NguhanhThiencan` | `'TC tang'!D17:F36` | Can → Âm/Dương + Ngũ Hành; D17:F26 là chu kỳ gốc, D27:F36 lặp lại. F26/F36 có hai khoảng trắng trong `Âm  thủy`, cần trim khi import |
| `Diachi` | `'TC tang'!A2:A13` | Danh sách 12 Chi; không được công thức trong `HQ (2)` dùng trực tiếp |
| `ListThienCan` / `ListThienCan2` | `'TC tang'!D17:D26` / `D17:D36` | 10 Can và bản lặp hai vòng, dùng cho chu kỳ Đại Vận/Lưu niên/Tiểu vận |
| `ListDiaChi` / `ListDiaChi2` | `'TC tang'!A17:A28` / `A17:A40` | 12 Chi và bản lặp hai vòng |
| `vongtruongsinh` | `'NN-TC'!A26:K38` | Vòng Trường Sinh — trạng thái của 10 Can trên 12 Chi |
| `MuoiThienThanCan` | `'NN-TC'!A14:A23` | Danh sách 10 tên Thập Thần; không được `HQ (2)` dùng trực tiếp |
| `TCNguHop` | `'NN-TC'!A41:K51` | Ma trận Can gồm hành của năm cặp Ngũ Hợp, chuỗi `khắc` và ô trống; dùng ở mục f và bảng niên vận |
| `TCNguHopCot` / `TCNguHopHang` | `'NN-TC'!A42:A51` / `B41:K41` | helper không chứa header góc; các công thức L/P của bảng niên vận đang dùng lệch với mảng `TCNguHop` có header |
| `Quanhediachi` | `'NN-TC'!A54:M66` | Ma trận Hình/Xung/Hại/Phá/Hợp; được dùng 190 lần tại M79:M168 và Q69:Q168 |
| `BangTuongXungCot` / `BangTuongXungHang` | `'NN-TC'!A55:A66` / `B54:M54` | helper hàng/cột của `Quanhediachi`, không đồng nghĩa với toàn ma trận |
| `DaiVan` | global `Duong!$H$2:$J$14` | được C69:D168 dùng 200 lần; đây là dependency chéo sai người và phải loại bỏ |
| `DuongAm` | local `'HQ (2)'!K89:K90`; global `HQ!K89:K90` | không có công thức `HQ (2)` dùng; global name còn làm nguồn validation stale ở `TC tang` |

**Bảng `'NN-TC'!A1:K11` (Thập Thần)** và **`'TC tang'!A2:D13` (Tàng Can)** không có tên vùng riêng nhưng được tham chiếu trực tiếp bằng địa chỉ tuyệt đối ở khắp mục (e).

## Tổng kết mức độ hoàn thiện của workbook (để tham khảo khi migrate)

| Khối | Trạng thái |
|---|---|
| a) Input cá nhân | Nhập tay; validation B3:B6 chỉ là prompt và các số có thể không nhất quán với C3:D6 |
| b) Bốn trụ Can Chi | C3:D6 là input tay độc lập; cần lớp tính Tứ Trụ riêng, không tái dùng trực tiếp Can Chi năm/tháng của `tinhAmLich()` |
| c) Tiết chính/khởi vận | B7 không được dùng; B8 nhập tay; thiếu phút, múi giờ và thuật toán chọn Tiết trước/sau |
| d) Thống kê Thập Thần | Có phép đếm thô nhưng thiếu Tàng Can thứ ba của trụ Giờ; không phải phép tính vượng suy |
| e) Bảng Tứ Trụ | Lookup đúng một phần; trụ Giờ thiếu slot 3, B22/C22 đang `#N/A`, C34 là hard-code |
| f) Quan hệ Can | Sáu cặp có lookup, nhưng ma trận trộn kết quả Ngũ Hợp, `khắc` và ô trống; không xét điều kiện hóa |
| f) Tam Hợp/Tam Hội/Bán Hợp | Ba công thức `#NAME?`, thiếu tổ hợp Năm–Ngày–Giờ; Tam Hội/Bán Hợp chưa triển khai |
| g) Đại Vận hiển thị | Có rule Thuận/Nghịch và chuỗi Can–Chi; B8 nhập tay, nhãn tuổi `D8−1` chưa được giải thích, slot đầu là trụ Tháng natal |
| h) Niên vận 100 năm | Có thiết kế nhưng hiện không dùng được do dependency `DaiVan` chéo người, lookup lệch, `#REF!` và cột thiếu |
| i) Thần Sát | 25/38 tên có công thức, 13 placeholder; có 15 literal sai, 3 reference sai nguồn và 6 nhãn sai/không chuẩn |

Kết luận: workbook là nguồn tham khảo để trích rule và test case, **không phải oracle đúng tuyệt đối**. Implementation mới chỉ được coi là hoàn tất khi từng nhóm rule có bảng dữ liệu canonical, test vector độc lập và ca biên cho Lập Xuân/Tiết chính/giờ Chi; không được giữ lại lỗi layout, named range hoặc cache của Excel.
