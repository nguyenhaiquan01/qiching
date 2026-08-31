# 08 – Thiết kế chương trình Tứ Trụ (kiến trúc & thuật toán)

**Chưa tạo code.** Tài liệu này chỉ thiết kế kiến trúc, kiểu dữ liệu và thuật toán dựa trên [`07-tu-tru-tinh-toan.md`](./07-tu-tru-tinh-toan.md); việc lập trình thực tế (kể cả file/thư mục nêu ở mục 1) để cho một bước riêng sau khi thiết kế này được duyệt.

## 0. Phạm vi & nguyên tắc thiết kế

1. **Chỉ port "Rule workbook"** đã được 07 xác nhận đúng (ví dụ Vòng Trường Sinh, Ngũ Hợp Thiên Can, phần lớn mapping Thần Sát). **Không port "Lỗi workbook"** (danh sách đầy đủ ở 07, mục e/f/g/h/i) — mọi chỗ port phải trỏ lại đúng bảng đã sửa trong 07, không lấy lại giá trị cache hay literal sai chính tả từ Excel.
2. **"Rule cần triển khai"** (workbook không tính: đổi lịch dương→Bát Tự, ranh Tiết Khí, thuật toán ngày khởi Đại Vận, Tam Hợp/Tam Hội/Bán Hợp) phải có đặc tả thuật toán rõ ràng + câu hỏi cần chốt (mục 5) trước khi viết test, **không suy đoán rồi code thẳng**.
3. **Tái dùng tối đa hạ tầng đã có** trong `src/core/` thay vì tạo lại bảng trùng lặp — xem mục 1.2 bảng đối chiếu "đã có / cần thêm".
4. **Không mô phỏng giới hạn layout của Excel.** Ví dụ: trụ Giờ trong workbook thiếu tàng can thứ 3 vì hết cột — model mới mọi trụ dùng chung một kiểu `TangCan[]` đầy đủ 1-3 phần tử. Tương tự, không dùng `0`/chuỗi rỗng lẫn lộn làm giá trị "không có" — dùng `undefined`/mảng rỗng nhất quán.
5. **Tách 2 tầng rõ ràng**:
   - **Tầng lịch pháp** ("an trụ"): từ một thời điểm dương lịch → 4 trụ Can-Chi + Tiết Khí. Đây là tầng duy nhất phụ thuộc thời gian thực và có thể kiểm chứng độc lập bằng lịch vạn niên bên ngoài.
   - **Tầng luận** (Tàng Can, Thập Thần, Trường Sinh, Ngũ Hợp/Tam Hợp, thống kê Ngũ Hành, Đại Vận, Thần Sát): thuần hàm suy diễn từ 4 trụ Can-Chi + Giới tính, không phụ thuộc gì khác vào thời gian thực → dễ viết test thuần túy (pure function), không cần mock ngày giờ.

## 1. Kiến trúc module

### 1.1 File/thư mục dự kiến (chưa tạo)

Theo đúng phong cách `src/core/` hiện có của phần Kinh Dịch (`business.ts`, `queDich.ts`, `data/*.ts`):

```
src/core/tuTru/
├── types.ts              # TruCanChi, TangCan, ThapThan, TrangThaiTruongSinh, LaSoTuTru...
├── anTru.ts               # tầng lịch pháp: dương lịch → 4 trụ Can-Chi + Tiết Khí (4.1)
├── data/
│   ├── tangCan.ts         # bảng Tàng Can 12 Địa Chi (4.2, port từ TC tang, đã sửa)
│   ├── vongTruongSinh.ts  # bảng 10 Can × 12 Chi (4.4, port nguyên trạng từ NN-TC)
│   ├── nguHopThienCan.ts  # 5 cặp Ngũ Hợp hóa hành (4.5)
│   ├── tamHopDiaChi.ts    # 4 bộ Tam Hợp + suy Tam Hội/Bán Hợp (4.6, thiết kế mới)
│   └── thanSat.ts         # bảng rule Thần Sát dạng khai báo dữ liệu (4.9, đã sửa lỗi)
├── thapThan.ts            # suy Thập Thần từ Ngũ Hành + Âm Dương (4.3)
├── nguHanhManhYeu.ts       # thống kê/điểm Ngũ Hành theo Thập Thần (4.7)
├── daiVan.ts               # Đại Vận + khung Lưu Niên/Tiểu Vận (4.8)
├── thanSatEngine.ts        # engine chạy bảng rule ở data/thanSat.ts (4.9)
└── laSoTuTru.ts            # orchestrator — ghép tất cả thành 1 lá số, giống vai trò `queDich.ts`
```

### 1.2 Hạ tầng đã có trong `src/core/` — tái dùng thay vì viết lại

| Đã có | File | Dùng cho |
|---|---|---|
| `THIEN_CAN`, `DIA_CHI` (10 Can, 12 Chi) | `core/const.ts` | Toàn bộ enum Can/Chi |
| `NGU_HANH_THIEN_CAN`, `NGU_HANH_DIA_CHI`, `AM_DUONG_THIEN_CAN`, `AM_DUONG_DIA_CHI` | `core/data/canChi.ts` | Chính là nội dung của `NguhanhThiencan` (`'TC tang'!D17:F36`) trong workbook — **không cần port lại bảng này**, chỉ cần thêm `AM_DUONG_DIA_CHI` (đã có sẵn!) cho phần Tàng Can |
| `tuongSinh()`, `tuongKhac()` | `core/data/nguHanh.ts` | Suy luận Thập Thần bằng công thức thay vì hard-code ma trận 10×10 của `NN-TC!A1:K11` (xem 4.3) |
| `tinhAmLich()` | `core/lunar.ts` | Trụ **Ngày** và **Giờ** — xem 4.1, đây là hai trụ duy nhất có thể tái dùng trực tiếp |

**Chú ý chính tả**: `DIA_CHI` trong dự án dùng `"Tý"`, `"Tỵ"`; workbook và tài liệu 07 dùng `"Tí"`, `"Tị"`. Toàn bộ bảng dữ liệu mới (Tàng Can, Trường Sinh, Thần Sát...) phải chuẩn hoá theo chính tả `core/const.ts` đang dùng (`Tý`/`Tỵ`) ngay từ lúc khai báo, không giữ chính tả gốc của Excel.

## 2. Mô hình dữ liệu lõi

```ts
type ThienCan = (typeof THIEN_CAN)[number];   // đã có ở const.ts
type DiaChi = (typeof DIA_CHI)[number];        // đã có ở const.ts
type ViTriTru = "nam" | "thang" | "ngay" | "gio";

interface TruCanChi {
  viTri: ViTriTru;
  can: ThienCan;
  chi: DiaChi;
}

/** Tối đa 3 phần tử — không giới hạn 2 phần tử ở trụ Giờ như bug của Excel (07, mục e). */
interface TangCanCuaChi {
  chi: DiaChi;
  canPhu: ThienCan[];   // 1-3 Can, thứ tự y hệt bảng TC tang gốc (không đặt tên "bản/trung/dư khí" —
                          // 07 đã ghi rõ workbook không có trọng số/tên gọi cho 3 vị trí này)
}

type ThapThan =
  | "Tỉ" | "Kiếp"
  | "Thực" | "Thương"
  | "Thiên tài" | "Chính tài"
  | "Sát" | "Quan"
  | "Kiêu" | "Ấn";

type TrangThaiTruongSinh =
  | "Trường sinh" | "Mộc dục" | "Quan đới" | "Lâm quan" | "Đế vượng"
  | "Suy" | "Bệnh" | "Tử" | "Mộ" | "Tuyệt" | "Thai" | "Dưỡng";

interface LaSoTuTru {
  hoTen: string;
  gioiTinh: "Nam" | "Nữ";
  truNam: TruCanChi;
  truThang: TruCanChi;
  truNgay: TruCanChi;   // = Nhật Chủ / bản mệnh nằm ở truNgay.can
  truGio: TruCanChi;
  tietKhi: string;                 // tiết khí tại thời điểm sinh — xem 4.1
  tangCan: Record<ViTriTru, TangCanCuaChi>;
}
```

Các kiểu còn lại (Thần Sát, Đại Vận, thống kê Ngũ Hành) được mô tả trực tiếp trong từng mục 4.x tương ứng để giữ ngữ cảnh.

## 3. Pipeline tính toán tổng thể

```
Ngày giờ sinh (dương lịch) + Giới tính
        │
        ▼
┌───────────────────────┐
│ 4.1  An 4 trụ Can-Chi  │  ← tầng lịch pháp, phụ thuộc thời gian thực
│      + Tiết Khí        │
└───────────┬────────────┘
            ▼
┌───────────────────────┐
│ 4.2  Tàng Can          │  ← thuần hàm của (truNam..truGio)
└───────────┬────────────┘
            ├──────────────┬───────────────┬────────────────┐
            ▼              ▼               ▼                ▼
      ┌───────────┐  ┌───────────┐  ┌─────────────┐  ┌─────────────┐
      │ 4.3 Thập  │  │ 4.4 Trường│  │ 4.5 Ngũ Hợp │  │ 4.6 Tam Hợp/│
      │ Thần      │  │ Sinh      │  │ Thiên Can   │  │ Hội/Bán Hợp │
      └─────┬─────┘  └─────┬─────┘  └─────────────┘  └─────────────┘
            └──────┬───────┘
                   ▼
          ┌─────────────────┐
          │ 4.7 Thống kê/    │
          │ vượng suy Ngũ    │
          │ Hành             │
          └─────────────────┘

  (truNam..truGio, tietKhi, gioiTinh)
            │
            ▼
      ┌───────────┐        ┌──────────────┐
      │ 4.8 Đại   │───────▶│ 4.9 Thần Sát  │  (dùng 4 trụ + kết quả 4.8 làm input,
      │ Vận       │        │               │   không phụ thuộc 4.3/4.4/4.7)
      └───────────┘        └──────────────┘
```

Mọi nhánh sau bước 4.1 đều là hàm thuần (pure function) nhận 4 trụ Can-Chi làm input — đúng nguyên tắc tách tầng ở mục 0.5.

## 4. Thiết kế từng bước

### 4.1 An 4 trụ Can-Chi + Tiết Khí — tầng lịch pháp

**Trụ Ngày và Giờ**: tái dùng trực tiếp `tinhAmLich(time).thienCanNgay/diaChiNgay` và `.thienCanGio/.diaChiGio`. Hai trụ này đúng theo chu kỳ 60 Can-Chi liên tục, không phụ thuộc ranh giới lịch âm/tiết khí — không có khác biệt giữa "Can Chi ngày Bát Tự" và "Can Chi ngày lịch âm thông thường" mà `tinhAmLich()` đã tính đúng (đã kiểm chứng qua `dbexport.test.ts` của phần Kinh Dịch).

**Trụ Năm và Tháng — KHÔNG tái dùng `lunarYearStr`/`lunarMonthStr` của `tinhAmLich()`** (07, mục b, đã cảnh báo rõ: sai ranh quanh Lập Xuân và các Tiết chính). Cần logic mới:

```
tinhTruNam(time):
  tietKhiHienHanh = tietKhiTaiThoiDiem(time)      # xem bên dưới
  namDungDeTinhCan = year(time)
  if tietKhiHienHanh xảy ra TRƯỚC Lập Xuân của năm dương lịch chứa `time`:
      namDungDeTinhCan -= 1
  can = ((namDungDeTinhCan - 4) mod 10) → THIEN_CAN[...]   # Giáp = năm có (year-4) mod 10 == 0, quy ước chuẩn 60 Giáp Tý
  chi = ((namDungDeTinhCan - 4) mod 12) → DIA_CHI[...]
  return { can, chi }

tinhTruThang(time, truNamCan):
  tietKhiHienHanh = tietKhiTaiThoiDiem(time)
  chiThang = mapTietChinhSangChi[tietKhiHienHanh]   # bảng 12 mục đã có sẵn ở 07 mục c:
                                                      # Lập xuân→Dần, Kinh trập→Mão, ..., Tiểu hàn→Sửu
  canThang = suyCanThangTuCanNamVaChiThang(truNamCan, chiThang)  # công thức "Ngũ Hổ Độn" cổ điển —
                                                                    # CẦN XÁC NHẬN, xem mục 5, câu hỏi #1
  return { can: canThang, chi: chiThang }
```

`tietKhiTaiThoiDiem(time)`: thư viện `lunar-calendar-ts-vi` mà dự án đang dùng đã trả về `block.airRetention` (tiết khí trong ngày, dùng ở `AmLich.tietKhi`) — cần khảo sát thêm xem thư viện có API trả **thời điểm giao tiết chính xác đến phút** hay chỉ tên tiết khí của ngày hiện tại (đủ để xác định ranh trụ Năm/Tháng nếu chỉ cần độ chính xác theo ngày, nhưng không đủ cho bước tính "số ngày cách tiết" ở Đại Vận — mục 4.8). Đây là điểm kỹ thuật cần xác nhận trước khi code (mục 5, câu hỏi #2).

**Bảng chuẩn hoá chính tả** khi lấy input từ `tinhAmLich()` (dùng `Tý`/`Tỵ`) sang các bảng tra Tứ Trụ mới (cũng nên dùng `Tý`/`Tỵ` luôn, không dùng `Tí`/`Tị` của Excel — xem mục 1.2).

### 4.2 Tàng Can — port bảng, sửa lỗi thiếu slot trụ Giờ

Port nguyên bảng 12 Địa Chi → 1-3 Tàng Can từ 07 mục e (đã liệt kê đủ, không dùng VLOOKUP index 2/3/4 riêng lẻ như Excel mà trả thẳng `ThienCan[]`):

```ts
const TANG_CAN: Record<DiaChi, ThienCan[]> = {
  "Tý": ["Quý"],
  "Sửu": ["Kỷ", "Quý", "Tân"],
  "Dần": ["Giáp", "Bính", "Mậu"],
  "Mão": ["Ất"],
  "Thìn": ["Mậu", "Ất", "Quý"],
  "Tỵ": ["Bính", "Mậu", "Canh"],
  "Ngọ": ["Đinh", "Kỷ"],
  "Mùi": ["Kỷ", "Đinh", "Ất"],
  "Thân": ["Canh", "Mậu", "Nhâm"],
  "Dậu": ["Tân"],
  "Tuất": ["Mậu", "Đinh", "Tân"],
  "Hợi": ["Nhâm", "Giáp"],
};
```

Áp dụng cho cả 4 trụ như nhau (`tangCan[viTri] = TANG_CAN[tru[viTri].chi]`) — không có ngoại lệ "chỉ 2 slot cho trụ Giờ" như bug Excel.

### 4.3 Thập Thần — đề xuất **derive bằng công thức**, không hard-code ma trận

Workbook tra 10 Thập Thần từ ma trận tĩnh `'NN-TC'!A1:K11`. Ma trận đó thực chất là hàm của 4 biến đã có sẵn trong `core/data/canChi.ts` (Ngũ Hành + Âm Dương của 2 Can) — nên **thiết kế đề xuất tính bằng công thức thay vì copy 100 ô**, giảm rủi ro chép sai và tự động đúng cho mọi cặp Can:

```ts
function thapThanCuaCan(canCanXet: ThienCan, canNhatChu: ThienCan): ThapThan {
  const hanhXet = NGU_HANH_THIEN_CAN[canCanXet];
  const hanhChu = NGU_HANH_THIEN_CAN[canNhatChu];
  const cungAmDuong = AM_DUONG_THIEN_CAN[canCanXet] === AM_DUONG_THIEN_CAN[canNhatChu];

  if (hanhXet === hanhChu) return cungAmDuong ? "Tỉ" : "Kiếp";
  if (tuongSinh(hanhChu, hanhXet)) return cungAmDuong ? "Thực" : "Thương";       // ta sinh
  if (tuongKhac(hanhChu, hanhXet)) return cungAmDuong ? "Thiên tài" : "Chính tài"; // ta khắc
  if (tuongKhac(hanhXet, hanhChu)) return cungAmDuong ? "Sát" : "Quan";           // khắc ta
  if (tuongSinh(hanhXet, hanhChu)) return cungAmDuong ? "Kiêu" : "Ấn";            // sinh ta
  throw new Error("không xác định được quan hệ Ngũ Hành");
}
```

Quy tắc cùng-âm-dương ↔ "Tỉ/Thực/Thiên tài/Sát/Kiêu" và khác-âm-dương ↔ "Kiếp/Thương/Chính tài/Quan/Ấn" suy trực tiếp từ chính bảng `NN-TC!A1:K11` đã trích ở 07 (ví dụ Giáp so Giáp = Tỉ, Giáp so Ất = Kiếp). **Việc này cần viết test đối chiếu lại toàn bộ 100 ô của bảng gốc** (dùng chính bảng ở 07 mục e làm test vector) trước khi thay thế hoàn toàn bảng tĩnh — nếu có bất kỳ ô nào lệch so với hàm suy diễn, phải điều tra (không mặc định hàm đúng, không mặc định bảng đúng).

Dùng `thapThanCuaCan()` cho: 3 Can lộ (Năm/Tháng/Giờ, không tính Ngày), và toàn bộ Tàng Can của 4 Địa Chi.

### 4.4 Vòng Trường Sinh — port nguyên bảng

07 xác nhận bảng `vongtruongsinh` (`'NN-TC'!A26:K38`) không có lỗi phát hiện được. Port thẳng làm bảng tra `Record<ThienCan, Record<DiaChi, TrangThaiTruongSinh>>` (12×10 = 120 ô, chép nguyên văn từ bảng đã liệt kê ở 07 mục e).

Hàm dùng chung:

```ts
function truongSinhCuaCanTrenChi(can: ThienCan, chi: DiaChi): TrangThaiTruongSinh {
  return VONG_TRUONG_SINH[can][chi];
}
```

Áp dụng cho các trường hợp workbook đã dùng đúng (07 mục e):
- Mỗi trụ "tọa" chính Chi của trụ đó (Can trụ X trên Chi trụ X).
- Nhật Chủ trên Chi Tháng ("được lệnh"/"không được lệnh" — xem 4.7).
- Mỗi Tàng Can trên Chi Tháng.
- Can của mỗi vận Đại Vận trên Chi Tháng (4.8).

**Không port `C34` của workbook** ("Đắc địa" luôn trả `true` — lỗi hard-code đã ghi ở 07). "Đắc địa" (Nhật Chủ có Tàng Can cùng hành với mình ở Chi trụ Ngày/Tháng/Giờ) là **Rule cần triển khai từ đầu**, không có gì để tham khảo từ workbook.

### 4.5 Ngũ Hợp Thiên Can

Port 5 cặp:

```ts
const NGU_HOP_THIEN_CAN: ReadonlyArray<{ cap: [ThienCan, ThienCan]; hoaHanh: string }> = [
  { cap: ["Giáp", "Kỷ"], hoaHanh: "Thổ" },
  { cap: ["Ất", "Canh"], hoaHanh: "Kim" },
  { cap: ["Bính", "Tân"], hoaHanh: "Thủy" },
  { cap: ["Đinh", "Nhâm"], hoaHanh: "Mộc" },
  { cap: ["Mậu", "Quý"], hoaHanh: "Hỏa" },
];
```

Kiểm tra hợp giữa 2 Can bất kỳ bằng `some()` trên bảng này, chạy cho cả 6 cặp trụ (`C(4,2)`) như workbook đã làm đúng — nhưng **tách rõ 2 khái niệm** mà 07 đã lưu ý: "có mặt trong bảng Ngũ Hợp" (luôn đúng nếu đúng 5 cặp Can) khác với "đã đủ điều kiện HÓA thành hành mới" (còn tùy vượng suy môi trường — theo lý thuyết Bát Tự, không phải cứ hợp là hóa). Thiết kế trả về 2 trường riêng: `{ hop: boolean; hoaHanh?: string }`, và **không tự động coi `hoaHanh` đã có nghĩa là đã hóa** — việc xác định "hóa thật" là Rule cần triển khai riêng, ngoài phạm vi tài liệu này.

### 4.6 Tam Hợp / Tam Hội / Bán Hợp Địa Chi — thiết kế mới hoàn toàn (workbook hỏng)

07 xác nhận: cả 3 cơ chế này hỏng hoàn toàn trong Excel (`#NAME?` hoặc chưa triển khai). Đề xuất thiết kế dựa trên 4 bộ Tam Hợp cổ điển mà chính các công thức Thần Sát của workbook đã dùng ngầm (07 mục i) — nên ít nhất phần DỮ LIỆU này có cơ sở đối chiếu chéo, nhưng **thuật toán ghép nhóm thì phải viết mới, chưa có gì để so sánh**:

```ts
const TAM_HOP: ReadonlyArray<{ nhom: [DiaChi, DiaChi, DiaChi]; hoaHanh: string }> = [
  { nhom: ["Dần", "Ngọ", "Tuất"], hoaHanh: "Hỏa" },
  { nhom: ["Thân", "Tý", "Thìn"], hoaHanh: "Thủy" },
  { nhom: ["Tỵ", "Dậu", "Sửu"], hoaHanh: "Kim" },
  { nhom: ["Hợi", "Mão", "Mùi"], hoaHanh: "Mộc" },
];
```

- **Tam Hợp**: 3 trong 4 Chi của lá số trùng đủ 1 bộ trên.
- **Bán Hợp**: 2 trong 3 Chi của một bộ Tam Hợp cùng có mặt, **và** một trong hai Chi đó là Chi "vượng" của bộ (Tý/Ngọ/Mão/Dậu — 4 Chi chính giữa 4 mùa). Đây là quy tắc cổ điển phổ biến nhưng **cần xác nhận với người dùng/nguồn nghiệp vụ** trước khi khoá lại (mục 5, câu hỏi #3) vì có trường phái coi bất kỳ 2/3 cũng là bán hợp.
- **Tam Hội** (hội theo phương, khác Tam Hợp theo cục): `{Dần,Mão,Thìn}→Mộc (Đông)`, `{Tỵ,Ngọ,Mùi}→Hỏa (Nam)`, `{Thân,Dậu,Tuất}→Kim (Tây)`, `{Hợi,Tý,Sửu}→Thủy (Bắc)` — cũng là kiến thức cổ điển phổ biến nhưng **cần xác nhận tương tự** (mục 5, câu hỏi #3) vì workbook không để lại gì để đối chiếu.

Thiết kế hàm trả về danh sách tất cả tổ hợp khớp thay vì chỉ 3 cặp trụ như Excel (Excel thiếu hẳn tổ hợp Năm-Ngày-Giờ — 07 đã ghi nhận là bug), để không lặp lại giới hạn đó:

```ts
function timTamHop(chi4Tru: Record<ViTriTru, DiaChi>): Array<{ viTri: ViTriTru[]; hoaHanh: string }>
```

### 4.7 Thống kê / vượng suy Ngũ Hành

**Bước 1 — port nguyên bản đếm thô của workbook** (07 mục d, đã xác nhận công thức đúng nhưng là phép đếm, không phải vượng suy đầy đủ): với mỗi Thập Thần trong {Tỉ,Kiếp,Thực,Thương,Thiên tài,Chính tài,Sát,Quan,Kiêu,Ấn}, đếm số lần xuất hiện trong {3 Can lộ Năm/Tháng/Giờ} ∪ {toàn bộ Tàng Can 4 trụ}, gộp theo 5 cặp. **Sửa lỗi đã phát hiện**: dùng đủ Tàng Can thứ 3 của trụ Giờ (workbook làm rơi mất — 07 mục d), nên tổng số đếm của lá số mẫu sẽ là 13, không phải 12 như cache Excel.

**Bước 2 (Rule cần triển khai, không có trong workbook) — vượng suy có trọng số**, để bổ khuyết giới hạn "đếm thô" đã ghi ở 07: thiết kế interface mở để cắm dần từng trọng số mà KHÔNG bắt buộc phải có ngay ở bản đầu:

```ts
interface TrongSoDiemNguHanh {
  theoViTriTangCan?: (viTri: 0 | 1 | 2) => number;      // Can lộ + tàng can vị trí 1 nặng hơn vị trí 2/3
  theoVuongSuyThangLenh?: (hanh: string, chiThang: DiaChi) => number; // Vượng/Tướng/Hưu/Tù/Tử theo lệnh tháng
}
```

Không tự chọn công thức cụ thể ở đây — cần nguồn nghiệp vụ xác nhận trọng số (mục 5, câu hỏi #4). "Được lệnh"/"Không được lệnh" (workbook ô `A34`, dựa trên `truongSinhCuaCanTrenChi(nhatChu, chiThang)` ∈ {Trường sinh, Mộc dục, Quan đới, Lâm quan, Đế vượng}) **có thể port thẳng** vì đây là công thức đã xác nhận đúng, không phải bug.

### 4.8 Đại Vận (và khung Lưu Niên/Tiểu Vận thay thế mục "Niên vận 100 năm" đã hỏng)

**Phần port được (07 mục g, xác nhận đúng)**:

```ts
function chieuDaiVan(canNam: ThienCan, gioiTinh: "Nam" | "Nữ"): "Thuận" | "Nghịch" {
  const duongCan = AM_DUONG_THIEN_CAN[canNam] === "Dương";
  return (duongCan && gioiTinh === "Nam") || (!duongCan && gioiTinh === "Nữ") ? "Thuận" : "Nghịch";
}

function sinhChuoiDaiVan(truThang: TruCanChi, chieu: "Thuận" | "Nghịch", soVan = 10): TruCanChi[] {
  // bắt đầu từ can-chi trụ Tháng, +1/-1 mỗi vận theo chỉ số trong THIEN_CAN/DIA_CHI, dùng modulo
  // thay cho "danh sách lặp 2 vòng" ListThienCan2/ListDiaChi2 của Excel (07 đã đề xuất điều này)
}
```

**Phần Rule cần triển khai (07 mục c/g đã cảnh báo, KHÔNG suy đoán công thức)**: thuật toán tính "số ngày từ lúc sinh tới Tiết Khí gần nhất" (nhập tay ở `B8` trong workbook) và quy đổi ra tuổi/tháng khởi vận chính xác (không chỉ `ROUND(ngày/3)` theo năm mà còn phần dư tháng/ngày). Cần: (a) xác định thời điểm giao tiết chính xác đến phút quanh ngày sinh (phụ thuộc câu hỏi #2 ở mục 5), (b) chốt quy ước "tuổi" đang dùng là tuổi mụ hay tuổi tây (07 mục g đã nêu, workbook không giải thích) — câu hỏi #5.

**Thay thế mục "Niên vận 100 năm" đã hỏng nặng của workbook (07 mục h)**: không port lại bảng 100 dòng đó (dependency chéo người, `#REF!`, lookup lệch). Dùng lại đúng công thức đã được 07 xác nhận là rule chuẩn hoá đúng (07, dòng ~254-262), viết thành hàm thuần:

```ts
function daiVanTaiTuoi(tuoi: number, tuoiKhoiVan: number, chuoiDaiVan: TruCanChi[]): TruCanChi | null {
  if (tuoi < tuoiKhoiVan) return null;
  const index = Math.floor((tuoi - tuoiKhoiVan) / 10);
  return chuoiDaiVan[index] ?? null;
}
```

Lưu Niên (Can-Chi của năm dương lịch bất kỳ) và Tiểu Vận đều tính được từ hàm thuần tương tự (chu kỳ 60 Can-Chi năm liên tục cho Lưu Niên; công thức Tiểu Vận cần xác nhận lại từ nguồn khác vì 07 ghi nhận cột I/J của workbook "cần xác nhận nghiệp vụ trước khi port" — câu hỏi #6). Quan hệ Can khắc/Chi xung giữa Lưu Niên và trụ Năm/Ngày (cột L/M/P/Q của workbook) tái dùng thẳng bảng `Quanhediachi` (07 đã liệt kê, chỉ cần tách thành tập token `hình/xung/hại/phá/hợp` thay vì so chuỗi nguyên văn như bug đã ghi ở 07 mục h, lỗi #6).

### 4.9 Thần Sát — rule engine khai báo dữ liệu, thay cho 38 công thức hard-code

07 đã trích xuất mapping của 25 Thần Sát chạy đúng (mục i, bảng "Hàng | Thần Sát | Neo và mapping") kèm 15 lỗi literal/3 lỗi tham chiếu/6 lỗi nhãn cần sửa. Thay vì hard-code từng `IF/AND/OR` như Excel, thiết kế một bảng khai báo dữ liệu + 1 engine chạy chung:

```ts
type KieuNeo =
  | "canNam" | "canNgay"                 // so Can neo với Chi của cả 4 trụ
  | "chiThang"                            // so Chi Tháng với Can/Chi của trụ khác
  | "nhomTamHopNam" | "nhomTamHopNgay"    // Chi Năm/Ngày thuộc nhóm Tam Hợp nào → suy 1 Chi mục tiêu
  | "canChiTruNgay";                      // Can-Chi trụ Ngày là 1 tổ hợp đặc biệt (Khôi Canh, Kim thần...)

interface RuleThanSat {
  ten: string;
  loai: "cát" | "hung";
  neo: KieuNeo;
  mapping: Record<string, DiaChi | DiaChi[] | ThienCan>;  // cụ thể hoá theo từng kieuNeo
}

const BANG_THAN_SAT: RuleThanSat[] = [
  { ten: "Thiên Ất", loai: "cát", neo: "canNam", mapping: {
      "Giáp": ["Sửu","Mùi"], "Mậu": ["Sửu","Mùi"],
      "Ất": ["Tý","Thân"], "Kỷ": ["Tý","Thân"],
      "Bính": ["Hợi","Dậu"], "Đinh": ["Hợi","Dậu"],
      "Nhâm": ["Mão","Tỵ"], "Quý": ["Mão","Tỵ"],
      "Canh": ["Dần","Ngọ"], "Tân": ["Dần","Ngọ"],
    } },
  // ... 24 rule còn lại, chép nguyên `mapping` đã sửa lỗi từ 07 mục i, KHÔNG chép lại literal sai
  //     ("Mẵo"→"Mão", "Qúy"→"Quý", 3 lỗi copy sai Can neo, 6 lỗi nhãn output — xem 07 mục i)
];

function chayRuleThanSat(rule: RuleThanSat, boTru: Record<ViTriTru, TruCanChi>): ViTriTru[] {
  // trả về danh sách trụ nào "trúng" sao này, dựa theo `neo` và `mapping`
}
```

Ưu điểm so với cách của Excel: (1) sửa lỗi một lần trong dữ liệu thay vì rải rác 38 công thức; (2) tự động phủ đủ 4 trụ neo × 4 trụ mục tiêu thay vì phải chép tay từng ô như Excel; (3) dễ viết test — mỗi rule là 1 test case độc lập, dùng chính bảng mapping đã trích ở 07 làm oracle.

**13 tên Thần Sát chưa có công thức trong workbook** (07 mục i: Tam Kỳ, Từ quán, Học đường, Củng lộc, Thiên la, Địa võng, Cấu Giảo, Vong thần, Nguyên thần, Không vong, Thập ác đại bại, Cô Loan, Tứ phế) — **không tự suy đoán mapping**, để trống trong `BANG_THAN_SAT` cho tới khi có nguồn nghiệp vụ khác (câu hỏi #7).

## 5. Câu hỏi nghiệp vụ cần chốt trước khi viết code

| # | Câu hỏi | Vì sao chưa tự quyết |
|---|---|---|
| 1 | Công thức suy Can trụ Tháng từ Can trụ Năm + Chi trụ Tháng ("Ngũ Hổ Độn") — dùng bảng cố định nào? | Không thấy trong workbook (Can Tháng ở đó là input tay) |
| 2 | Thư viện `lunar-calendar-ts-vi` có trả được **thời điểm giao tiết chính xác đến phút** không, hay chỉ tên tiết khí theo ngày? | Quyết định việc có tự động hoá được ranh Năm/Tháng và bước "số ngày cách tiết" của Đại Vận hay vẫn phải nhập tay một phần |
| 3 | Quy tắc Bán Hợp và Tam Hội dùng đúng bản nào (có trường phái khác nhau)? | Workbook không để lại gì để đối chiếu (07 mục f) |
| 4 | Có cần trọng số vượng suy theo lệnh tháng (Vượng/Tướng/Hưu/Tù/Tử) và theo vị trí Tàng Can (bản/trung/dư khí) ở bản đầu, hay chấp nhận đếm thô như workbook trước? | Ảnh hưởng trực tiếp độ chính xác của phần "luận", cần biết mức ưu tiên |
| 5 | "Tuổi khởi Đại Vận" hiển thị là tuổi mụ hay tuổi tây? | Workbook không giải thích (07 mục g) |
| 6 | Công thức Tiểu Vận (cột I/J của mục "Niên vận 100 năm") lấy từ nguồn nào? | 07 ghi rõ "cần xác nhận nghiệp vụ trước khi port", không tự suy diễn từ code hỏng |
| 7 | 13 Thần Sát chưa có công thức trong workbook — có cần bổ sung ở bản đầu không, và lấy mapping từ nguồn nào? | Không có gì trong workbook để tham khảo |

## 6. Chiến lược kiểm thử (khi tới bước viết code)

Theo đúng cách phần Kinh Dịch đã làm (`core/__tests__/dbexport.test.ts` đối chiếu trực tiếp với dữ liệu gốc):

1. **Test vector từ chính workbook** cho mọi phần đã xác nhận đúng ở 07 (Tàng Can, Vòng Trường Sinh, Ngũ Hợp, 25 rule Thần Sát đã sửa) — dùng lá số mẫu "Tam" (sinh Can Chi Giáp Tý/Đinh Sửu/Ất Tỵ/Canh Thìn) làm ca đầu tiên, kỳ vọng khớp đúng kết quả 07 đã liệt kê (sau khi áp fix).
2. **Test riêng cho hàm `thapThanCuaCan()`** (4.3) đối chiếu đủ 100 ô của bảng `NN-TC!A1:K11` — không tin hàm đúng chỉ vì "logic nghe hợp lý".
3. **Ca biên lịch pháp** (4.1) độc lập với workbook: sinh đúng thời điểm giao tiết Lập Xuân (trước/sau vài phút), giờ Tý (23h, đổi ngày), năm nhuận âm lịch — đối chiếu với lịch vạn niên bên ngoài vì workbook không cho ca nào loại này.
4. **Không dùng lại các ca đã xác nhận hỏng ở 07** (Niên vận 100 năm, Tam Hợp `#NAME?`) làm test oracle — với các phần này phải tự tạo test vector từ nguồn nghiệp vụ khác sau khi trả lời xong mục 5.

## 7. Thứ tự triển khai đề xuất

1. `types.ts` + `anTru.ts` (4.1) — cần trả lời câu hỏi #1, #2 trước.
2. `data/tangCan.ts` (4.2) — không phụ thuộc câu hỏi nào, làm được ngay.
3. `thapThan.ts` (4.3) + `data/vongTruongSinh.ts` (4.4) — làm song song, không phụ thuộc nhau.
4. `nguHanhManhYeu.ts` bước 1 (4.7, bản đếm thô) — làm được ngay sau 4.2-4.4.
5. `daiVan.ts` phần chuỗi 10 vận (4.8, phần port được) — cần câu hỏi #5 để hiển thị tuổi đúng quy ước.
6. `data/nguHopThienCan.ts` (4.5) và `data/tamHopDiaChi.ts` (4.6) — 4.6 cần câu hỏi #3.
7. `thanSatEngine.ts` + `data/thanSat.ts` (4.9) — 25 rule đầu làm được ngay, 13 rule còn lại chờ câu hỏi #7.
8. Lưu Niên/Tiểu Vận (mở rộng 4.8) — Tiểu Vận chờ câu hỏi #6.
9. `nguHanhManhYeu.ts` bước 2 (4.7, trọng số vượng suy) — chờ câu hỏi #4, có thể làm sau cùng vì không chặn các phần khác.
