# QIChing — Coin Casting Feature Specification

**Version:** 1.0  
**Status:** Approved baseline  
**Feature:** Khởi quẻ bằng Ba Đồng Xu  
**Product:** QIChing  
**Casting Method:** Three-Coin Casting  
**Interpretation Method:** Lục Hào Nạp Giáp

---

## 1. Mục tiêu

Cho phép người dùng khởi quẻ Kinh Dịch bằng phương pháp gieo ba đồng xu.

QIChing hỗ trợ hai hình thức:

1. **Gieo trên màn hình** — QIChing mô phỏng việc gieo ba đồng xu.
2. **Tôi tự gieo** — người dùng gieo ba đồng xu thật và nhập kết quả Ngửa/Sấp vào QIChing.

Hai hình thức chỉ khác nhau ở cách thu nhận kết quả gieo.

Sau khi hoàn thành sáu hào, cả hai phải tạo ra cùng một domain input để tái sử dụng engine **Lục Hào Nạp Giáp** hiện có.

---

## 2. Phạm vi MVP

### In scope

- Chọn phương pháp `Gieo đồng xu`.
- Chọn `Gieo trên màn hình` hoặc `Tôi tự gieo`.
- Chủ đề/câu hỏi theo flow hiện tại của QIChing.
- Gieo/nhập ba đồng xu cho từng hào.
- Thực hiện đủ sáu lần.
- Lập hào từ dưới lên trên.
- Xác định Âm/Dương.
- Xác định Động/Tĩnh.
- Xác định hào động.
- Sinh Quẻ Chính.
- Sinh Quẻ Biến khi có hào động.
- Tái sử dụng engine Lục Hào hiện tại.
- Lưu raw casting data.
- Lưu phương pháp khởi quẻ.
- Hiển thị lịch sử gieo khi xem lại quẻ.

### Out of scope

- Shake-to-cast bằng cảm biến điện thoại.
- 3D physics phức tạp.
- Skin đồng xu.
- Nhiều loại đồng xu.
- Âm thanh mặc định.
- Gamification.
- “Thử vận may”.
- “Gieo lại vì quẻ không mong muốn”.
- Phương pháp Hai Số.
- Thay đổi engine luận Lục Hào.

---

# 3. Nguyên tắc kiến trúc

## 3.1 Casting Method ≠ Interpretation Method

QIChing phải tách:

```text
CÁCH KHỞI QUẺ
      ↓
KẾT QUẢ 6 HÀO
      ↓
QUẺ CHÍNH
HÀO ĐỘNG
QUẺ BIẾN
      ↓
ENGINE HIỆN TẠI
      ↓
LỤC HÀO NẠP GIÁP
      ↓
LUẬN QUẺ
```

Coin Casting module không chứa hoặc duplicate business logic luận Lục Hào.

---

## 3.2 Không sử dụng thời gian để khởi quẻ

Đối với phương pháp Ba Đồng Xu:

- Không yêu cầu ngày/giờ làm input khởi quẻ.
- Không dùng timestamp để xác định kết quả sáu hào.
- Không dùng timestamp như một phần của thuật toán Coin Casting.

Timestamp hệ thống vẫn có thể được lưu dưới dạng metadata:

```text
createdAt
```

Mục đích:

- lịch sử;
- sắp xếp quẻ đã lưu;
- audit;
- hiển thị thời điểm tạo.

`createdAt` không phải `casting input`.

---

# 4. Quy ước mặt đồng xu của QIChing

QIChing sử dụng:

- **Ngửa:** mặt có chữ.
- **Sấp:** mặt không chữ hoặc mặt hoa văn.

UI phải giải thích quy ước này trước lần gieo đầu tiên hoặc qua trợ giúp ngữ cảnh.

Không sử dụng hệ điểm 2/3 trong UX chính.

---

# 5. Quy tắc xác định hào

Mỗi lần gieo sử dụng chính xác ba đồng xu.

QIChing đếm số mặt Ngửa/Sấp và xác định hào theo bảng sau.

| Kết quả | Loại hào | Âm/Dương | Động/Tĩnh | Ký hiệu | Biến |
|---|---|---|---|---|---|
| 3 Sấp | Lão Dương | Dương | Động | O | Dương → Âm |
| 2 Sấp + 1 Ngửa | Thiếu Dương | Dương | Tĩnh | — | Không đổi |
| 2 Ngửa + 1 Sấp | Thiếu Âm | Âm | Tĩnh | - - | Không đổi |
| 3 Ngửa | Lão Âm | Âm | Động | X | Âm → Dương |

### Domain invariant

```text
0 mặt Ngửa → Dương động
1 mặt Ngửa → Dương tĩnh
2 mặt Ngửa → Âm tĩnh
3 mặt Ngửa → Âm động
```

Thứ tự Xu 1/Xu 2/Xu 3 không ảnh hưởng loại hào.

---

# 6. Quy tắc sáu hào

Một quẻ phải có chính xác sáu hào.

Các hào được tạo **từ dưới lên trên**.

| Lần gieo | Hào |
|---:|---|
| 1 | Hào 1 — dưới cùng |
| 2 | Hào 2 |
| 3 | Hào 3 |
| 4 | Hào 4 |
| 5 | Hào 5 |
| 6 | Hào 6 — trên cùng |

Domain model nên giữ:

```text
lines[0] = Hào 1
lines[5] = Hào 6
```

UI có thể render theo thứ tự Hào 6 → Hào 1 khi hiển thị quẻ.

---

# 7. Mode A — Gieo trên màn hình

## BR-SCREEN-01

Mỗi lần user nhấn `Gieo`, hệ thống sinh kết quả cho chính xác ba đồng xu.

## BR-SCREEN-02

Mỗi đồng xu có hai trạng thái:

```text
HEADS = Ngửa
TAILS = Sấp
```

## BR-SCREEN-03

Mỗi đồng xu phải được random độc lập.

## BR-SCREEN-04

Xác suất mỗi mặt:

```text
P(Ngửa) = 0.5
P(Sấp)  = 0.5
```

Do đó phân phối tự nhiên:

| Loại hào | Xác suất |
|---|---:|
| Dương động | 1/8 |
| Dương tĩnh | 3/8 |
| Âm tĩnh | 3/8 |
| Âm động | 1/8 |

Hệ thống **không được random trực tiếp bốn loại hào với xác suất 25% mỗi loại**.

## BR-SCREEN-05

Kết quả phải được xác định bởi business logic/random source, không bởi animation.

Animation chỉ là presentation layer.

## BR-SCREEN-06

Sau khi một lần gieo hoàn thành, user **không được gieo lại hào đó**.

Không cung cấp:

- Gieo lại;
- Reroll;
- Thử lại;
- Đổi kết quả.

## BR-SCREEN-07

Sau kết quả, user chỉ tiếp tục sang hào kế tiếp.

---

# 8. Mode B — Tôi tự gieo

User sử dụng ba đồng xu vật lý.

QIChing chỉ ghi nhận kết quả.

## BR-PHYSICAL-01

User nhập mặt của từng đồng xu:

```text
Xu 1: Ngửa | Sấp
Xu 2: Ngửa | Sấp
Xu 3: Ngửa | Sấp
```

## BR-PHYSICAL-02

Không yêu cầu user tự xác định:

- Âm/Dương;
- Lão/Thiếu;
- Động/Tĩnh;
- Quẻ biến.

QIChing tự tính.

## BR-PHYSICAL-03

Chỉ enable `Xác nhận hào` khi đủ ba đồng xu.

## BR-PHYSICAL-04

User được sửa Ngửa/Sấp trước khi xác nhận.

## BR-PHYSICAL-05

Sau khi xác nhận, kết quả được ghi nhận là một hào.

Nếu sản phẩm cho phép sửa lại hào đã xác nhận, action phải mang nghĩa:

> Sửa kết quả đã nhập

không phải:

> Gieo lại

Mục đích là sửa lỗi nhập liệu, không thay đổi kết quả gieo vật lý.

---

# 9. Hào động

Hai trường hợp tạo hào động:

### Lão Dương

```text
Sấp + Sấp + Sấp
→ Dương
→ Động
→ O
→ Dương biến Âm
```

### Lão Âm

```text
Ngửa + Ngửa + Ngửa
→ Âm
→ Động
→ X
→ Âm biến Dương
```

Các tổ hợp hỗn hợp là hào tĩnh.

---

# 10. Quẻ Chính

Quẻ Chính được tạo từ trạng thái Âm/Dương ban đầu của sáu hào.

Hào động vẫn sử dụng trạng thái **trước khi biến** khi xác định Quẻ Chính.

---

# 11. Quẻ Biến

Chỉ các hào động thay đổi:

```text
Dương tĩnh → Dương
Âm tĩnh    → Âm

Lão Dương → Âm
Lão Âm    → Dương
```

Nếu không có hào động:

- trạng thái hoàn toàn hợp lệ;
- không hiển thị lỗi;
- UI ghi `Không có hào động`;
- không cần tạo một “Quẻ Biến” giả chỉ để giống Quẻ Chính.

---

# 12. Chủ đề và câu hỏi

Coin Casting tái sử dụng behavior hiện tại của QIChing đối với:

- chủ đề;
- câu hỏi;
- context phục vụ luận quẻ.

Coin Casting feature không định nghĩa lại taxonomy chủ đề trong MVP.

---

# 13. Data model đề xuất

```typescript
type CoinFace = "HEADS" | "TAILS";

type CoinCastingMode =
  | "SCREEN"
  | "PHYSICAL";

type YinYang =
  | "YIN"
  | "YANG";

type LineType =
  | "OLD_YANG"
  | "YOUNG_YANG"
  | "YOUNG_YIN"
  | "OLD_YIN";

interface CoinLine {
  position: 1 | 2 | 3 | 4 | 5 | 6;

  coins: [
    CoinFace,
    CoinFace,
    CoinFace
  ];

  headsCount: number;

  yinYang: YinYang;

  lineType: LineType;

  moving: boolean;
}

interface CoinCasting {
  castingMethod: "THREE_COINS";

  castingMode: CoinCastingMode;

  question?: string;

  topic?: string;

  lines: CoinLine[];

  createdAt: string;
}
```

`createdAt` là metadata, không tham gia thuật toán khởi quẻ.

---

# 14. Mapping function

Business logic có thể quy về:

```typescript
function resolveCoinLine(headsCount: number) {
  switch (headsCount) {
    case 0:
      return {
        lineType: "OLD_YANG",
        yinYang: "YANG",
        moving: true
      };

    case 1:
      return {
        lineType: "YOUNG_YANG",
        yinYang: "YANG",
        moving: false
      };

    case 2:
      return {
        lineType: "YOUNG_YIN",
        yinYang: "YIN",
        moving: false
      };

    case 3:
      return {
        lineType: "OLD_YIN",
        yinYang: "YIN",
        moving: true
      };

    default:
      throw new Error("Invalid coin result");
  }
}
```

Đây nên là single source of truth ở domain layer.

---

# 15. Integration với engine hiện tại

Kiến trúc mong muốn:

```text
Coin Casting UI
      ↓
Coin Casting Domain
      ↓
6 CoinLine
      ↓
CoinCastingAdapter
      ↓
Hexagram Input
      ↓
Existing Liu Yao Engine
      ↓
Existing Result / Interpretation
```

Không copy logic Lục Hào vào Coin Casting module.

---

# 16. Persistence

Khi lưu quẻ, lưu tối thiểu:

```text
castingMethod
castingMode
question
topic
lines
primaryHexagram
movingLines
changedHexagram
createdAt
```

Raw coin faces phải được giữ để có thể reconstruct lịch sử gieo.

Ví dụ:

```text
Hào 1: Sấp · Ngửa · Sấp
Hào 2: Ngửa · Ngửa · Sấp
...
```

---

# 17. Terminology

Sử dụng nhất quán:

| Product term | Meaning |
|---|---|
| Gieo đồng xu | Casting method |
| Gieo trên màn hình | System-generated coin casting |
| Tôi tự gieo | User uses physical coins |
| Ngửa | Mặt có chữ |
| Sấp | Mặt không chữ/hoa văn |
| Hào động | Lão Dương hoặc Lão Âm |
| Quẻ Chính | Hexagram before moving-line transformation |
| Quẻ Biến | Hexagram after moving-line transformation |
| Lục Hào Nạp Giáp | Interpretation method |

Không gọi phương pháp Ba Đồng Xu là `Mai Hoa Dịch Số`.

---

# 18. UX principles

Feature phải tạo cảm giác:

- trang nghiêm;
- tĩnh;
- tối giản;
- rõ ràng;
- có tính chiêm nghiệm;
- không thần bí hóa quá mức.

Không sử dụng:

- casino visual;
- confetti;
- “good luck”;
- “thử vận may”;
- jackpot effects;
- animation phô trương;
- khuyến khích reroll.

---

# 19. Acceptance Criteria

### AC-01

User chọn được `Gieo đồng xu` làm cách khởi quẻ.

### AC-02

User chọn được:

- `Gieo trên màn hình`;
- `Tôi tự gieo`.

### AC-03

Một quẻ luôn có chính xác sáu hào.

### AC-04

Lần gieo đầu tiên luôn là Hào 1 — hào dưới cùng.

### AC-05

`Sấp + Sấp + Sấp` tạo Dương động / Lão Dương / O.

### AC-06

Hai Sấp + một Ngửa tạo Dương tĩnh / Thiếu Dương.

### AC-07

Hai Ngửa + một Sấp tạo Âm tĩnh / Thiếu Âm.

### AC-08

`Ngửa + Ngửa + Ngửa` tạo Âm động / Lão Âm / X.

### AC-09

Lão Dương biến từ Dương sang Âm.

### AC-10

Lão Âm biến từ Âm sang Dương.

### AC-11

Gieo trên màn hình không cho reroll hào đã gieo.

### AC-12

Screen mode random ba đồng xu độc lập.

### AC-13

Physical mode yêu cầu nhập đủ ba mặt xu trước khi xác nhận.

### AC-14

Physical mode cho sửa mặt xu trước khi xác nhận.

### AC-15

Không có hào động là trạng thái hợp lệ.

### AC-16

Coin Casting không yêu cầu Date/Time làm input khởi quẻ.

### AC-17

Timestamp nếu được lưu chỉ là metadata.

### AC-18

Raw coin results được lưu cùng quẻ.

### AC-19

Kết quả ghi rõ provenance:

```text
Cách khởi quẻ: Ba đồng xu
Chế độ: Gieo trên màn hình
```

hoặc:

```text
Cách khởi quẻ: Ba đồng xu
Chế độ: Tôi tự gieo
```

### AC-20

Sau khi lập đủ sáu hào, hệ thống tái sử dụng engine Lục Hào hiện tại.

---

# 20. QA decision table

| Ngửa | Sấp | Expected |
|---:|---:|---|
| 0 | 3 | Lão Dương · Dương · Động · O |
| 1 | 2 | Thiếu Dương · Dương · Tĩnh |
| 2 | 1 | Thiếu Âm · Âm · Tĩnh |
| 3 | 0 | Lão Âm · Âm · Động · X |

Permutation test:

```text
Sấp Sấp Ngửa
Sấp Ngửa Sấp
Ngửa Sấp Sấp
```

phải cho cùng kết quả `Thiếu Dương`.

```text
Ngửa Ngửa Sấp
Ngửa Sấp Ngửa
Sấp Ngửa Ngửa
```

phải cho cùng kết quả `Thiếu Âm`.

---

# 21. Definition of Done

Feature được coi là hoàn thành khi:

- business rules trên có automated tests;
- cả hai casting modes hoạt động;
- sáu hào được lập đúng thứ tự;
- hào động và quẻ biến chính xác;
- không thể reroll trong screen mode;
- physical mode xử lý được lỗi nhập;
- raw casting data được persist;
- existing Liu Yao engine được tái sử dụng;
- desktop và mobile hoàn thành;
- accessibility cơ bản đạt yêu cầu;
- QA pass toàn bộ decision table;
- UX không tạo cảm giác game/casino.

---

## Product rule

> QIChing xem việc gieo đồng xu là phương thức khởi quẻ. Kết quả gieo cung cấp sáu hào; việc luận giải sau đó thuộc engine Lục Hào Nạp Giáp. Hai trách nhiệm này phải được tách biệt trong cả kiến trúc sản phẩm lẫn cách trình bày cho người dùng.