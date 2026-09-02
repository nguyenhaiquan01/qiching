# 08 – Thiết kế chương trình Tứ Trụ (kiến trúc & thuật toán)

> **Trạng thái sau code review 2026-08-31:** chưa có code Tứ Trụ trong `src/`. Thiết kế này chỉ là proposal dựa trên [`07-tu-tru-tinh-toan.md`](./07-tu-tru-tinh-toan.md), chưa đủ điều kiện triển khai end-to-end. Có thể làm độc lập các bảng/hàm thuần Tàng Can, Thập Thần, Vòng Trường Sinh và nhận diện Ngũ Hợp; `anTru`, mốc khởi Đại Vận, Bán Hợp, vượng suy có trọng số và nhiều rule Thần Sát vẫn cần contract hoặc nguồn nghiệp vụ được chốt. (Cập nhật 2026-09-02: quy tắc Tam Hội — hội theo phương — đã được người dùng xác nhận, xem mục 4.6; vẫn chưa có code.)

Mức sẵn sàng hiện tại:

| Nhóm | Đánh giá |
|---|---|
| Kiểu Can/Chi, Tàng Can, Thập Thần, Vòng Trường Sinh, nhận diện cặp Ngũ Hợp | Có thể triển khai theo test table-driven; vẫn phải giữ provenance của bảng nguồn |
| An bốn trụ từ ngày giờ dương lịch | **Chặn** bởi contract múi giờ, giờ Tý, giờ mặt trời và dữ liệu giao Tiết chính chính xác |
| Đại Vận | Chiều thuận/nghịch và chuỗi Can-Chi có thể thiết kế; mốc khởi vận chính xác chưa đủ đặc tả |
| Tam Hợp/Tam Hội/Bán Hợp, vượng suy | Một phần là thiết kế mới, không có oracle từ workbook |
| Thần Sát | Chỉ có rule trích xuất; phân loại cát/hung, các rule thiếu và các sửa lỗi cần nguồn xác nhận độc lập |

## 0. Phạm vi & nguyên tắc thiết kế

1. **Chỉ port có kiểm soát “Rule workbook”** mà 07 đã trích xuất và không phát hiện lỗi nội bộ (ví dụ bảng Vòng Trường Sinh, Ngũ Hợp Thiên Can). “Khớp workbook” chỉ là parity với nguồn tham khảo, không đồng nghĩa đúng nghiệp vụ Bát Tự. **Không port “Lỗi workbook”** (danh sách ở 07, mục e/f/g/h/i); mọi sửa lỗi hoặc rule suy diễn phải mang provenance và test riêng.
2. **"Rule cần triển khai"** (workbook không tính: đổi lịch dương→Bát Tự, ranh Tiết Khí, thuật toán ngày khởi Đại Vận, Tam Hợp/Tam Hội/Bán Hợp) phải có đặc tả thuật toán rõ ràng + câu hỏi cần chốt (mục 5) trước khi viết test, **không suy đoán rồi code thẳng**.
3. **Tái dùng tối đa hạ tầng đã có** trong `src/core/` thay vì tạo lại bảng trùng lặp — xem mục 1.2 bảng đối chiếu "đã có / cần thêm".
4. **Không mô phỏng giới hạn layout của Excel.** Ví dụ: trụ Giờ trong workbook thiếu tàng can thứ 3 vì hết cột — model mới mọi trụ dùng chung một kiểu `TangCan[]` đầy đủ 1-3 phần tử. Tương tự, không dùng `0`/chuỗi rỗng lẫn lộn làm giá trị "không có" — dùng `undefined`/mảng rỗng nhất quán.
5. **Tách 2 tầng rõ ràng**:
   - **Tầng lịch pháp** (“an trụ”): từ `BirthContext` đã chuẩn hóa → bốn trụ, thời điểm Tiết chính trước/sau và policy đã dùng. Tầng này phụ thuộc múi giờ/dữ liệu thiên văn và phải kiểm chứng bằng oracle độc lập.
   - **Tầng suy diễn**: Tàng Can, Thập Thần, Trường Sinh, quan hệ Can/Chi và phần lớn Thần Sát là hàm thuần từ bốn trụ. Riêng **mốc khởi Đại Vận** còn phụ thuộc thời điểm sinh và thời điểm giao Tiết chính, nên không được xếp là hàm chỉ nhận bốn trụ + giới tính.

## 1. Kiến trúc module

### 1.1 File/thư mục dự kiến (chưa tạo)

Theo đúng phong cách `src/core/` hiện có của phần Kinh Dịch (`business.ts`, `queDich.ts`, `data/*.ts`):

```
src/core/tuTru/
├── types.ts              # BirthContext, policy, TruCanChi, LaSoTuTru, provenance...
├── solarTerms.ts         # adapter thời điểm 24 tiết khí; không dùng chuỗi tiết-khí-theo-ngày làm ranh
├── anTru.ts              # BirthContext + solar-term instants → 4 trụ Can-Chi (4.1)
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
| `tinhAmLich()` | `core/lunar.ts` | Chỉ là **candidate adapter** cho Can-Chi Ngày/Giờ. Không tái dùng trực tiếp trước khi chốt timezone/giờ Tý và có test Bát Tự; `dbexport.test.ts` không kiểm thử lịch pháp |

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

interface BirthContext {
  localDateTime: string;             // ISO local, ví dụ 1985-01-06T06:00:00; chưa mang offset
  timeZone: string;                  // IANA, ví dụ Asia/Ho_Chi_Minh
  gioiTinh: "Nam" | "Nữ";
  kinhDo?: number;                   // bắt buộc nếu policy dùng giờ mặt trời
  chinhSachGioTy: "GIU_NGAY" | "DOI_NGAY_LUC_23H";
  chinhSachThoiGian: "GIO_DAN_SU" | "GIO_MAT_TROI_THUC";
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
  hoTen?: string;                    // metadata, không tham gia tính toán
  input: BirthContext;
  truNam: TruCanChi;
  truThang: TruCanChi;
  truNgay: TruCanChi;   // = Nhật Chủ / bản mệnh nằm ở truNgay.can
  truGio: TruCanChi;
  tietKhi: string;
  mocTietChinhTruoc: string;        // instant ISO dùng để audit ranh trụ/mốc Đại Vận
  mocTietChinhSau: string;
  tangCan: Record<ViTriTru, TangCanCuaChi>;
  ruleSetVersion: string;           // tránh kết quả cũ đổi âm thầm khi sửa rule
}
```

`BirthContext` phải được validate trước khi tính: datetime phải tồn tại trong timezone đã chọn (kể cả giờ DST không tồn tại/trùng lặp nếu hỗ trợ ngoài Việt Nam), kinh độ phải có khi dùng giờ mặt trời, và mọi policy phải được lưu cùng kết quả. Các kiểu còn lại (Thần Sát, Đại Vận, thống kê Ngũ Hành) được mô tả trực tiếp trong từng mục 4.x tương ứng để giữ ngữ cảnh.

## 3. Pipeline tính toán tổng thể

```
BirthContext đã validate + bộ thời điểm Tiết chính
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

  (bốn trụ)                      (BirthContext + mốc Tiết chính + bốn trụ)
            │
            ▼
      ┌──────────────┐            ┌───────────┐
      │ 4.9 Thần Sát │            │ 4.8 Đại   │
      │ theo lá số   │            │ Vận       │
      └──────────────┘            └───────────┘
```

Các module vẫn được viết như hàm thuần, nhưng “thuần” không có nghĩa mọi module chỉ nhận bốn trụ. Hàm Đại Vận phải nhận tường minh `BirthContext`, mốc Tiết chính và policy; không đọc `Date.now()`, timezone máy hoặc state UI ngầm.

## 4. Thiết kế từng bước

### 4.1 An 4 trụ Can-Chi + Tiết Khí — tầng lịch pháp

**Trụ Ngày và Giờ**: có thể khảo sát tái dùng primitive của `tinhAmLich()`, nhưng chưa được gọi trực tiếp từ Tứ Trụ. Hàm hiện dùng `Date` theo timezone môi trường và tự đổi ngày từ 23:00; đó là policy legacy Kinh Dịch, chưa mặc nhiên là policy Bát Tự. Ngoài ra, `dbexport.test.ts` chỉ đối chiếu bảng dữ liệu Kinh Dịch, **không** chứng minh Can-Chi Ngày/Giờ. Cần test riêng hai phía ranh 23:00/00:00, timezone và quy ước giờ Tý trước khi chọn adapter.

**Trụ Năm và Tháng — KHÔNG tái dùng `lunarYearStr`/`lunarMonthStr` của `tinhAmLich()`** (07, mục b, đã cảnh báo rõ: sai ranh quanh Lập Xuân và các Tiết chính). Cần logic mới:

```text
tinhTruNam(instantSinh, timeZone, solarTerms):
  localYear = năm dân sự của instantSinh trong timeZone
  lapXuan = solarTerms.instant("Lập xuân", localYear, timeZone)
  namDungDeTinhCan = instantSinh < lapXuan ? localYear - 1 : localYear
  can = ((namDungDeTinhCan - 4) mod 10) → THIEN_CAN[...]   # Giáp = năm có (year-4) mod 10 == 0, quy ước chuẩn 60 Giáp Tý
  chi = ((namDungDeTinhCan - 4) mod 12) → DIA_CHI[...]
  return { can, chi }

tinhTruThang(instantSinh, truNamCan, solarTerms):
  tietChinhGanNhat = Tiết chính cuối cùng có instant <= instantSinh
  chiThang = mapTietChinhSangChi[tietChinhGanNhat.ten]
  canThang = suyCanThangTuCanNamVaChiThang(truNamCan, chiThang)  # công thức "Ngũ Hổ Độn" cổ điển —
                                                                    # CẦN XÁC NHẬN, xem mục 5, câu hỏi #1
  return { can: canThang, chi: chiThang }
```

`lunar-calendar-ts-vi` hiện được wrapper lấy `block.airRetention`, tức nhãn tiết khí của ngày. Dữ liệu cấp ngày **không đủ** cho người sinh đúng ngày giao tiết và không đủ tính mốc khởi Đại Vận. `solarTerms.ts` vì vậy phải cung cấp instant của ít nhất 24 tiết khí (12 Tiết chính để an tháng, mốc trước/sau theo rule Đại Vận) với timezone rõ ràng; nếu thư viện hiện tại không có API đó thì cần một thuật toán/thư viện thiên văn khác và bộ fixture chuẩn, không được suy phút giao tiết từ chuỗi `airRetention`.

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

07 không phát hiện lỗi nội bộ trong bảng `vongtruongsinh` (`'NN-TC'!A26:K38`). Có thể port làm bảng tra `Record<ThienCan, Record<DiaChi, TrangThaiTruongSinh>>` (12×10 = 120 ô), nhưng test phải đối chiếu đủ 120 ô và ghi rõ đây là parity workbook, chưa phải thẩm định độc lập theo trường phái.

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
- **Tam Hội** (hội theo phương, khác Tam Hợp theo cục): `{Dần,Mão,Thìn}→Mộc (Đông)`, `{Tỵ,Ngọ,Mùi}→Hỏa (Nam)`, `{Thân,Dậu,Tuất}→Kim (Tây)`, `{Hợi,Tý,Sửu}→Thủy (Bắc)`. **Đã chốt (2026-09-02):** người dùng xác nhận Tam Hội tính theo phương như trên (khác Tam Hợp theo cục) — không còn nằm trong câu hỏi #3 ở mục 5. Bán Hợp vẫn còn mở.

> **Chưa áp dụng:** toàn bộ mục 4.6 (Tam Hợp/Tam Hội/Bán Hợp) vẫn chỉ là thiết kế trên giấy — chưa có dòng code nào trong `src/`. Việc chốt quy tắc Tam Hội ở trên chỉ giải quyết câu hỏi nghiệp vụ, chưa phải triển khai; `timTamHop()` và các hàm liên quan còn phải chờ Bán Hợp được chốt (và các block khác của Tứ Trụ theo mục "Mức sẵn sàng hiện tại" ở đầu tài liệu) trước khi viết code.

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

Không tự chọn công thức cụ thể ở đây — cần nguồn nghiệp vụ xác nhận trọng số (mục 5, câu hỏi #4). “Được lệnh”/“Không được lệnh” ở ô `A34` có thể được port thành **chỉ số parity workbook** vì 07 không phát hiện lỗi trong công thức; không được coi chỉ số đó là kết luận thân vượng/nhược đầy đủ nếu chưa có nguồn độc lập.

### 4.8 Đại Vận (và khung Lưu Niên/Tiểu Vận thay thế mục "Niên vận 100 năm" đã hỏng)

**Phần có thể port để giữ parity workbook (07 mục g)**:

```ts
function chieuDaiVan(canNam: ThienCan, gioiTinh: "Nam" | "Nữ"): "Thuận" | "Nghịch" {
  const duongCan = AM_DUONG_THIEN_CAN[canNam] === "Dương";
  return (duongCan && gioiTinh === "Nam") || (!duongCan && gioiTinh === "Nữ") ? "Thuận" : "Nghịch";
}

function sinhChuoiDaiVan(truThang: TruCanChi, chieu: "Thuận" | "Nghịch", soVan = 10): TruCanChi[] {
  // Vận thực thứ nhất là trụ Tháng +1 hoặc -1; không trả chính trụ Tháng ở index 0.
  // Dùng modulo Can 10/Chi 12 và test qua biên Giáp/Quý, Tý/Hợi.
}
```

Workbook đặt chính trụ Tháng ở slot đầu rồi mới tăng/giảm; 07 đã ghi rõ chưa đủ bằng chứng coi slot đó là Đại Vận thứ nhất. Model chuẩn hóa ở đây dùng vận thực thứ nhất `±1`; nếu sản phẩm cần hiển thị “trụ tháng gốc”, lưu nó ở trường riêng, không trộn vào `chuoiDaiVan`.

**Phần Rule cần triển khai (07 mục c/g đã cảnh báo, KHÔNG suy đoán công thức)**: thuật toán chọn **Tiết chính kế tiếp khi Thuận / Tiết chính trước khi Nghịch** (không phải “tiết gần nhất”), tính khoảng thời gian từ lúc sinh và quy đổi thành tuổi/tháng/ngày khởi vận. Cần: (a) thời điểm giao tiết chính xác, (b) công thức quy đổi phần dư, (c) quy ước tuổi hiển thị. `ROUND(số ngày/3)` và nhãn `D8-1` của workbook chỉ là hành vi tham khảo, không phải contract mới.

**Thay thế mục “Niên vận 100 năm” đã hỏng nặng của workbook (07 mục h)**: không port lại bảng 100 dòng đó (dependency chéo người, `#REF!`, lookup lệch). Chỉ sau khi có `MocKhoiVan` đã xác minh mới ánh xạ một thời điểm/tuổi sang vận:

```ts
interface MocKhoiVan {
  batDauTai: string;       // instant ISO tính từ rule đã chốt
  tuoiNam: number;
  tuoiThang: number;
  tuoiNgay?: number;
  ruleSetVersion: string;
}

function daiVanTaiTuoi(tuoiLienTuc: number, tuoiKhoiVan: number, chuoiDaiVan: TruCanChi[]): TruCanChi | null {
  if (tuoiLienTuc < tuoiKhoiVan) return null;
  const index = Math.floor((tuoiLienTuc - tuoiKhoiVan) / 10);
  return chuoiDaiVan[index] ?? null;
}
```

Không truyền “tuổi” mơ hồ từ UI. Tầng application phải quy đổi ngày cần xem sang `tuoiLienTuc` theo contract tuổi đã chốt, hoặc tốt hơn dùng trực tiếp `batDauTai` và khoảng 10 năm theo policy lịch được xác nhận.

Lưu Niên (Can-Chi của năm dương lịch bất kỳ) và Tiểu Vận đều tính được từ hàm thuần tương tự (chu kỳ 60 Can-Chi năm liên tục cho Lưu Niên; công thức Tiểu Vận cần xác nhận lại từ nguồn khác vì 07 ghi nhận cột I/J của workbook "cần xác nhận nghiệp vụ trước khi port" — câu hỏi #6). Quan hệ Can khắc/Chi xung giữa Lưu Niên và trụ Năm/Ngày (cột L/M/P/Q của workbook) tái dùng thẳng bảng `Quanhediachi` (07 đã liệt kê, chỉ cần tách thành tập token `hình/xung/hại/phá/hợp` thay vì so chuỗi nguyên văn như bug đã ghi ở 07 mục h, lỗi #6).

### 4.9 Thần Sát — rule engine khai báo dữ liệu, thay cho 38 công thức hard-code

07 đã trích xuất 25 rule Thần Sát có công thức chạy trong workbook (mục i) kèm 15 lỗi literal, 3 lỗi tham chiếu và 6 lỗi nhãn. “Có công thức chạy” không có nghĩa mapping đã được thẩm định độc lập. Thay vì hard-code từng `IF/AND/OR`, dùng rule khai báo có discriminant, provenance và trạng thái xác minh:

```ts
interface RuleMetadata {
  ten: string;
  phanLoai?: "cát" | "hung"; // chỉ điền khi nguồn xác nhận; workbook không có header đủ rõ
  nguon: { workbookCells: string[]; externalReference?: string };
  trangThai: "workbook-parity" | "domain-verified";
}

type RuleThanSat = RuleMetadata & (
  | { kieu: "can-to-chi"; neo: Array<"canNam" | "canNgay">;
      mapping: Partial<Record<ThienCan, readonly DiaChi[]>> }
  | { kieu: "chi-thang-to-target";
      mapping: Partial<Record<DiaChi, readonly ({ loai: "can"; giaTri: ThienCan } | { loai: "chi"; giaTri: DiaChi })[]>> }
  | { kieu: "can-chi-pair"; viTri: Array<"ngay" | "gio">; cap: readonly [ThienCan, DiaChi][] }
  | { kieu: "tam-hop-anchor"; neo: Array<"chiNam" | "chiNgay">;
      mapping: Partial<Record<DiaChi, readonly DiaChi[]>> }
);

const BANG_THAN_SAT: RuleThanSat[] = [
  { ten: "Thiên Ất", kieu: "can-to-chi", neo: ["canNam", "canNgay"],
    nguon: { workbookCells: ["HQ (2)!178"] }, trangThai: "workbook-parity", mapping: {
      "Giáp": ["Sửu","Mùi"], "Mậu": ["Sửu","Mùi"],
      "Ất": ["Tý","Thân"], "Kỷ": ["Tý","Thân"],
      "Bính": ["Hợi","Dậu"], "Đinh": ["Hợi","Dậu"],
      "Nhâm": ["Mão","Tỵ"], "Quý": ["Mão","Tỵ"],
      "Canh": ["Dần","Ngọ"], "Tân": ["Dần","Ngọ"],
    } },
  // ... các rule còn lại; mỗi correction phải có test + provenance, không sửa âm thầm.
];

function chayRuleThanSat(rule: RuleThanSat, boTru: Record<ViTriTru, TruCanChi>): ViTriTru[] {
  // trả về danh sách trụ nào "trúng" sao này, dựa theo `neo` và `mapping`
}
```

Engine chỉ kiểm tra đúng những vị trí mà từng rule khai báo; **không tự động mở rộng mọi rule thành 4 trụ neo × 4 trụ mục tiêu**, vì việc mở rộng đó có thể đổi nghiệp vụ so với workbook. Test workbook bảo vệ parity; chỉ test từ nguồn độc lập mới được nâng `trangThai` thành `domain-verified`.

**13 tên Thần Sát chưa có công thức trong workbook** (07 mục i: Tam Kỳ, Từ quán, Học đường, Củng lộc, Thiên la, Địa võng, Cấu Giảo, Vong thần, Nguyên thần, Không vong, Thập ác đại bại, Cô Loan, Tứ phế) — **không tự suy đoán mapping**, để trống trong `BANG_THAN_SAT` cho tới khi có nguồn nghiệp vụ khác (câu hỏi #7).

## 5. Câu hỏi nghiệp vụ cần chốt trước khi viết code

| # | Câu hỏi | Vì sao chưa tự quyết |
|---|---|---|
| 1 | Công thức suy Can trụ Tháng từ Can trụ Năm + Chi trụ Tháng ("Ngũ Hổ Độn") — dùng bảng cố định nào? | Không thấy trong workbook (Can Tháng ở đó là input tay) |
| 2 | Chọn nguồn/thuật toán nào trả **instant giao 24 tiết khí** và bộ fixture chuẩn nào để kiểm chứng? | Wrapper hiện tại chỉ dùng nhãn tiết khí theo ngày; dữ liệu đó không đủ cho ca sinh trong ngày giao tiết và Đại Vận |
| 3 | Quy tắc Bán Hợp dùng đúng bản nào (có trường phái khác nhau: bất kỳ 2/3 Chi hay bắt buộc có Chi vượng)? | Workbook không để lại gì để đối chiếu (07 mục f). ~~Tam Hội~~ đã chốt 2026-09-02: tính theo phương (mục 4.6). |
| 4 | Có cần trọng số vượng suy theo lệnh tháng (Vượng/Tướng/Hưu/Tù/Tử) và theo vị trí Tàng Can (bản/trung/dư khí) ở bản đầu, hay chấp nhận đếm thô như workbook trước? | Ảnh hưởng trực tiếp độ chính xác của phần "luận", cần biết mức ưu tiên |
| 5 | Công thức quy đổi khoảng cách tới Tiết chính thành năm/tháng/ngày khởi vận và cách hiển thị tuổi là gì? | Workbook chỉ `ROUND(ngày/3)` rồi hiển thị `D8-1`, không đủ làm contract |
| 6 | Công thức Tiểu Vận (cột I/J của mục "Niên vận 100 năm") lấy từ nguồn nào? | 07 ghi rõ "cần xác nhận nghiệp vụ trước khi port", không tự suy diễn từ code hỏng |
| 7 | 13 Thần Sát chưa có công thức, phân loại cát/hung và 25 mapping hiện có lấy nguồn chuẩn nào? | Workbook không đủ bằng chứng để bổ sung/phân loại hoặc xác nhận các correction |
| 8 | Bản đầu cố định `Asia/Ho_Chi_Minh` hay cho chọn timezone/nơi sinh; dùng giờ dân sự hay giờ mặt trời thực? | Thay đổi instant và có thể đổi cả bốn trụ ở ca biên |
| 9 | Quy ước giờ Tý là giữ ngày hay đổi ngày lúc 23:00? | `tinhAmLich()` đang áp policy legacy đổi ngày; chưa được xác nhận cho Tứ Trụ |

## 6. Chiến lược kiểm thử (khi tới bước viết code)

Áp dụng mô hình table-driven của phần Kinh Dịch, nhưng không coi `core/__tests__/dbexport.test.ts` là test lịch pháp Tứ Trụ:

1. **Parity workbook** cho Tàng Can, 100 ô Thập Thần, 120 ô Vòng Trường Sinh, 5 cặp Ngũ Hợp và 25 rule Thần Sát. Fixture phải được đưa vào repo ở dạng dữ liệu tối giản có version/checksum; lá số mẫu chỉ là một ca, không đủ phủ bảng.
2. **Test riêng cho hàm `thapThanCuaCan()`** (4.3) đối chiếu đủ 100 ô của bảng `NN-TC!A1:K11` — không tin hàm đúng chỉ vì "logic nghe hợp lý".
3. **Oracle lịch pháp độc lập**: test trước/đúng/sau Lập Xuân và mỗi Tiết chính vài giây/phút, hai phía 23:00/00:00, nhiều timezone, leap day và thời điểm DST nếu hỗ trợ. Kỳ vọng phải gồm instant Tiết khí và đủ bốn trụ, không chỉ tên tiết của ngày.
4. **Đại Vận**: fixture phải có ngày giờ sinh, giới tính, chiều, Tiết chính được chọn, khoảng cách, mốc khởi vận và ít nhất ba vận đầu; test rõ vận thứ nhất là `±1` từ trụ Tháng.
5. **Property/invariant**: Tàng Can luôn 1–3 phần tử hợp lệ; chuỗi Đại Vận tiến/lùi đồng thời Can và Chi; rule engine không đọc vị trí ngoài `neo`; serialize/deserialize giữ nguyên policy + `ruleSetVersion`.
6. **Không dùng vùng đã hỏng** (Niên vận 100 năm, Tam Hợp `#NAME?`) làm oracle. Rule thiết kế mới chỉ được release sau khi có nguồn và fixture độc lập.

## 7. Thứ tự triển khai đề xuất

1. `types.ts` + validation cho `BirthContext`, policy và provenance; chưa cần viết `anTru`.
2. `data/tangCan.ts`, `thapThan.ts`, `data/vongTruongSinh.ts`, `data/nguHopThienCan.ts` cùng test phủ toàn bảng.
3. `nguHanhManhYeu.ts` bước đếm thô; đặt tên rõ là thống kê, không quảng bá thành đánh giá thân vượng/nhược.
4. Chốt câu hỏi #1, #2, #8, #9 rồi mới làm `solarTerms.ts` + `anTru.ts` và oracle lịch pháp.
5. `daiVan.ts`: tách `chieuDaiVan`, `sinhChuoiDaiVan` khỏi `tinhMocKhoiVan`; chỉ phần sau bị chặn bởi câu hỏi #2/#5.
6. `tamHopDiaChi.ts` sau khi chốt #3; không gộp rule đề xuất vào nhóm đã xác minh.
7. `thanSatEngine.ts` + dữ liệu đã có provenance; rule/phân loại thiếu chờ #7.
8. Lưu Niên/Tiểu Vận sau khi chốt #6 và có test riêng.
9. Vượng suy có trọng số sau khi chốt #4; đây là một model versioned riêng, không thay âm thầm kết quả đếm thô.
