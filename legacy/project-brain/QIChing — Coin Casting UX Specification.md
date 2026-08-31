# QIChing — Coin Casting UX Specification

**Version:** 1.0  
**Feature:** Khởi quẻ bằng Ba Đồng Xu  
**Audience:** Product / UX / UI / Frontend / QA  
**Dependency:** Coin Casting Feature Specification v1.0

---

# 1. UX Goal

Thiết kế một trải nghiệm gieo quẻ bằng ba đồng xu:

- dễ hiểu với người mới;
- không làm mất chiều sâu với người đã biết Kinh Dịch;
- trang nghiêm, tĩnh, tối giản;
- thể hiện rõ quẻ được hình thành từng hào từ dưới lên;
- giúp user hiểu hào động mà không cần học hệ điểm trung gian;
- không tạo cảm giác casino hoặc trò chơi may rủi.

---

# 2. Primary User Flow

```text
XEM QUẺ
   │
   ▼
CÁCH KHỞI QUẺ
   │
   ├── Theo thời gian
   │
   └── Gieo đồng xu
           │
           ▼
      Chọn cách gieo
        /        \
       /          \
      ▼            ▼
Trên màn hình    Tôi tự gieo
      │            │
      └──────┬─────┘
             ▼
       Chủ đề/Câu hỏi
             │
             ▼
          Hào 1
             │
          Hào 2
             │
           ...
             │
          Hào 6
             │
             ▼
       Review 6 hào
             │
             ▼
         XEM QUẺ
             │
             ▼
      Existing Result
             │
             ▼
       Lục Hào Nạp Giáp
```

---

# 3. Screen 1 — Cách khởi quẻ

## Objective

Cho user hiểu rằng QIChing hỗ trợ nhiều cách lập quẻ.

## Proposed UI

```text
CÁCH KHỞI QUẺ

┌────────────────────────────┐
│ ◷  THEO THỜI GIAN          │
│                            │
│ Mai Hoa Dịch Số            │
└────────────────────────────┘

┌────────────────────────────┐
│ ◎  GIEO ĐỒNG XU            │
│                            │
│ Ba đồng xu · Sáu lần       │
└────────────────────────────┘
```

## Behavior

Chọn `Gieo đồng xu`:

- không hiển thị Date/Time picker;
- chuyển sang lựa chọn casting mode.

---

# 4. Screen 2 — Chọn cách gieo

## Header

**Gieo quẻ bằng đồng xu**

## Supporting copy

> Gieo ba đồng xu sáu lần để lập sáu hào của quẻ, theo thứ tự từ dưới lên.

## Mode cards

```text
┌───────────────────────────────┐
│ ◎  GIEO TRÊN MÀN HÌNH        │
│                               │
│ QIChing sẽ gieo ba đồng xu    │
│ cho từng hào.                 │
│                               │
│          [ Bắt đầu ]          │
└───────────────────────────────┘


┌───────────────────────────────┐
│ ◉  TÔI TỰ GIEO               │
│                               │
│ Gieo ba đồng xu thật và nhập  │
│ kết quả Ngửa/Sấp.             │
│                               │
│          [ Bắt đầu ]          │
└───────────────────────────────┘
```

Secondary help:

> `ⓘ Cách gieo ba đồng xu`

---

# 5. Educational help

Không bắt user đọc tutorial trước mỗi lần gieo.

Help panel/modal:

## Cách gieo

> Mỗi lần gieo sử dụng ba đồng xu. QIChing quy ước mặt có chữ là **Ngửa**, mặt không chữ hoặc hoa văn là **Sấp**.

> Gieo tổng cộng sáu lần. Lần đầu tạo Hào 1 ở dưới cùng; các hào tiếp theo được lập dần lên trên.

Table:

| Kết quả | Hào |
|---|---|
| 3 Sấp | Lão Dương · Động |
| 2 Sấp + 1 Ngửa | Thiếu Dương · Tĩnh |
| 2 Ngửa + 1 Sấp | Thiếu Âm · Tĩnh |
| 3 Ngửa | Lão Âm · Động |

Không cần giải thích hệ điểm 6/7/8/9 trong primary UX.

---

# 6. Screen 3 — Context

Tái sử dụng pattern hiện tại của QIChing.

```text
TRƯỚC KHI GIEO QUẺ

Chủ đề
[ Công việc                         ▼ ]

Câu hỏi
┌──────────────────────────────────────┐
│ Tôi có nên nhận công việc mới...?   │
└──────────────────────────────────────┘

Hãy giữ câu hỏi trong tâm trí
trong quá trình gieo sáu hào.

                              [ Tiếp tục ]
```

Không dùng copy mang tính khẳng định siêu nhiên.

---

# 7. Mode A — Gieo trên màn hình

## 7.1 Initial state

```text
GIEO TRÊN MÀN HÌNH

              HÀO 1 / 6
           Hào dưới cùng


         ◯       ◯       ◯


               [ GIEO ]


         QUẺ ĐANG HÌNH THÀNH

Hào 6               ·
Hào 5               ·
Hào 4               ·
Hào 3               ·
Hào 2               ·
Hào 1               ·
```

Primary focus phải là ba đồng xu và nút `Gieo`.

---

# 8. Screen casting interaction

User nhấn:

**GIEO**

Interaction sequence:

```text
Idle
 ↓
Casting
 ↓
Result
 ↓
Continue
```

Không có:

```text
Result
 ↓
Reroll
```

---

# 9. Animation

## Requirement

Animation:

- nhẹ;
- khoảng 600–1000 ms;
- không quá nhiều bounce;
- không particle;
- không confetti;
- không casino sound;
- không flashing.

Animation không quyết định kết quả.

Kết quả đã được xác định ở domain layer.

---

# 10. Screen result — Hào tĩnh

Ví dụ:

```text
              HÀO 1 / 6


       SẤP       NGỬA       SẤP


         ●          ◎          ●


          2 Sấp · 1 Ngửa

            THIẾU DƯƠNG

               ━━━━━

              Hào tĩnh


                          [ Tiếp tục ]
```

User cần thấy ba tầng:

1. Kết quả đồng xu.
2. Loại hào.
3. Hình hào.

Không bắt user tự suy luận.

---

# 11. Screen result — Dương động

```text
              HÀO 4 / 6


       SẤP        SẤP        SẤP

         ●           ●           ●


              3 mặt Sấp

              LÃO DƯƠNG

               ━━━━━ O

               HÀO ĐỘNG


            Dương  →  Âm

           ━━━━━      ━━ ━━


                          [ Tiếp tục ]
```

Hào động được emphasis bằng:

- typography;
- badge;
- icon;
- dedicated accent color.

Không phụ thuộc duy nhất vào màu sắc.

---

# 12. Screen result — Âm động

```text
              HÀO 5 / 6


       NGỬA       NGỬA       NGỬA

          ◎           ◎           ◎


              3 mặt Ngửa

                LÃO ÂM

               ━━ X ━━

               HÀO ĐỘNG


             Âm  →  Dương

           ━━ ━━      ━━━━━


                          [ Tiếp tục ]
```

---

# 13. Quẻ đang hình thành

Component luôn hiện trong casting flow.

```text
QUẺ ĐANG HÌNH THÀNH

Hào 6              ·
Hào 5              ·
Hào 4          ━━━━━ O     Động
Hào 3            ━━━━━
Hào 2            ━━ ━━
Hào 1            ━━━━━
                  ↑
              dưới cùng
```

## Behavior

Sau mỗi lần gieo:

- hào mới xuất hiện phía trên hào trước;
- progress tăng `1/6 → 6/6`;
- moving line giữ visual marker.

---

# 14. Không cho gieo lại

Screen mode không có:

- Gieo lại;
- Undo result;
- Change coins;
- Retry this line.

Sau khi kết quả được sinh:

> `Tiếp tục`

là primary action.

Nếu user cố quay Back sau khi đã bắt đầu phiên, UX phải tránh vô tình tạo lại kết quả.

Nếu user chủ động thoát phiên, có thể hiển thị confirmation:

> Bạn chưa hoàn thành sáu hào. Nếu rời khỏi phiên gieo, quá trình hiện tại sẽ không được tiếp tục.

Chi tiết persistence draft có thể được quyết định ở implementation.

---

# 15. Mode B — Tôi tự gieo

## Initial state

```text
TÔI TỰ GIEO

              HÀO 1 / 6
           Hào dưới cùng

Hãy gieo ba đồng xu thật,
sau đó chọn mặt của từng đồng xu.


XU 1              XU 2              XU 3

[ NGỬA ]          [ NGỬA ]          [ NGỬA ]
[ SẤP  ]          [ SẤP  ]          [ SẤP  ]


                         [ Xác nhận hào ]
```

`Xác nhận hào` disabled khi chưa nhập đủ ba đồng xu.

---

# 16. Coin selection component

Mỗi đồng xu có hai mutually-exclusive states:

```text
NGỬA
SẤP
```

Có helper:

> **Ngửa = mặt có chữ**

> **Sấp = mặt không chữ/hoa văn**

Không chỉ dùng hình minh họa mà không có text label.

---

# 17. Live calculation

Ngay khi user chọn đủ ba đồng xu, hệ thống hiển thị kết quả.

Ví dụ:

```text
Bạn đã gieo

SẤP · NGỬA · SẤP

2 Sấp · 1 Ngửa

THIẾU DƯƠNG
━━━━━

Hào tĩnh


                    [ XÁC NHẬN HÀO ]
```

User không phải nhấn nút `Tính`.

---

# 18. Sửa input

Trước `Xác nhận hào`:

- user có thể thay đổi bất kỳ đồng xu nào;
- kết quả hào cập nhật ngay.

Sau `Xác nhận hào`:

- hào được thêm vào quẻ;
- chuyển sang hào tiếp theo.

Nếu hỗ trợ sửa hào đã xác nhận, action label:

> `Sửa kết quả đã nhập`

Không sử dụng:

> `Gieo lại`

---

# 19. Progress

Cả hai mode sử dụng cùng một progress pattern:

```text
HÀO 1 / 6
HÀO 2 / 6
...
HÀO 6 / 6
```

Có thể bổ sung progress indicator nhẹ:

```text
● ○ ○ ○ ○ ○
```

Không sử dụng progress bar mang cảm giác checkout/task completion quá mạnh.

---

# 20. Completion screen

Sau Hào 6:

```text
QUẺ ĐÃ LẬP


Hào 6          ━━ ━━
Hào 5          ━━━━━ O       Động
Hào 4          ━━━━━
Hào 3          ━━ X ━━       Động
Hào 2          ━━━━━
Hào 1          ━━ ━━


2 HÀO ĐỘNG

Hào 3     Âm → Dương
Hào 5     Dương → Âm


Cách khởi quẻ
Ba đồng xu · Gieo trên màn hình


                           [ XEM QUẺ ]
```

Đây là checkpoint trước khi vào màn Result hiện tại.

---

# 21. Physical completion

Physical mode:

```text
Cách khởi quẻ
Ba đồng xu · Tôi tự gieo
```

Không gọi:

`Manual mode`

trong user-facing Vietnamese UI.

---

# 22. No moving lines

Nếu không có hào động:

```text
QUẺ ĐÃ LẬP

...

KHÔNG CÓ HÀO ĐỘNG

Sáu hào đều ở trạng thái tĩnh.


                           [ XEM QUẺ ]
```

Không:

- warning;
- màu đỏ;
- error icon;
- yêu cầu gieo lại.

---

# 23. Result provenance

Màn kết quả chung phải cho biết quẻ đến từ đâu.

Ví dụ:

```text
Cách khởi quẻ
Ba đồng xu

Chế độ
Gieo trên màn hình

Luận quẻ
Lục Hào Nạp Giáp
```

Hoặc compact:

```text
Ba đồng xu · Gieo trên màn hình
Luận quẻ: Lục Hào Nạp Giáp
```

---

# 24. Saved reading

Card trong `Quẻ đã lưu`:

```text
ĐỊA SƠN KHIÊM → ...

31/08/2026 · 10:53

◎ Ba đồng xu · Tôi tự gieo

“Tôi có nên...?”

Hào động: 3, 5
```

Ngày giờ ở đây là metadata lịch sử, không phải input của Coin Casting.

---

# 25. Casting history

Trong chi tiết quẻ:

> `Xem lịch sử gieo`

Expanded:

```text
LỊCH SỬ GIEO

Hào 6    Ngửa · Sấp · Ngửa
          Thiếu Âm

Hào 5    Sấp · Sấp · Sấp
          Lão Dương · Động

...

Hào 1    Sấp · Ngửa · Sấp
          Thiếu Dương
```

History render Hào 6 → Hào 1 để tương ứng hình quẻ.

---

# 26. Visual language

## Direction

- warm neutral;
- ivory / paper-like background;
- dark charcoal text;
- subtle bronze/brown accent;
- generous whitespace;
- restrained borders;
- minimal shadows.

## Avoid

- saturated gold everywhere;
- bright red as universal state color;
- cosmic gradient;
- glowing symbols;
- dragons;
- mystical particles;
- casino coins;
- slot-machine motion.

---

# 27. Moving-line color

Moving line cần accent riêng.

Không dùng màu Ngũ Hành làm status color nếu có thể gây semantic collision.

Hào động phải nhận biết được ngay cả khi:

- màn hình grayscale;
- user color-blind;
- print.

Do đó luôn có:

```text
O / X
+
label “Động”
```

---

# 28. Coin visual

Coin visual phải làm rõ hai mặt.

### Ngửa

- mặt có chữ;
- label `NGỬA`.

### Sấp

- mặt hoa văn/không chữ;
- label `SẤP`.

Không yêu cầu người mới tự suy từ hình đồng xu cổ.

---

# 29. Desktop layout

Recommended:

```text
┌─────────────────────────────────────────────────────┐
│ Header                                              │
├─────────────────────────────────────────────────────┤
│                                                     │
│            HÀO 3 / 6                               │
│                                                     │
│        [coin]    [coin]    [coin]                  │
│                                                     │
│              Result                                │
│                                                     │
│               [CTA]                                │
│                                                     │
│      ─────────────────────────────────────          │
│                                                     │
│           QUẺ ĐANG HÌNH THÀNH                      │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Không cần chia hai column nếu làm giảm cảm giác tập trung.

---

# 30. Mobile layout

Mobile là use case quan trọng, đặc biệt với physical casting.

Layout:

```text
HÀO 3 / 6

   COIN 1
[Ngửa] [Sấp]

   COIN 2
[Ngửa] [Sấp]

   COIN 3
[Ngửa] [Sấp]

────────────

KẾT QUẢ

Thiếu Dương
━━━━━

[XÁC NHẬN HÀO]

────────────

QUẺ ĐANG HÌNH THÀNH
...
```

Touch target tối thiểu phải đủ lớn.

Không horizontal scroll.

---

# 31. Responsive behavior

### Desktop

Ba đồng xu có thể nằm ngang.

### Tablet

Ba đồng xu vẫn ưu tiên nằm ngang nếu đủ không gian.

### Mobile

Có thể:

- ba coin selector xếp dọc; hoặc
- ba coin visual nằm ngang nhưng control Ngửa/Sấp nằm gọn bên dưới.

Designer cần prototype trên viewport nhỏ trước khi freeze.

---

# 32. Loading / processing

Không dùng generic spinner trong lúc gieo nếu animation đang diễn ra.

State:

```text
CASTING
```

Button disabled.

Sau animation:

```text
RESULT
```

Nếu computation engine sau `XEM QUẺ` cần thời gian:

> `Đang lập quẻ…`

Không dùng:

> `Đang dự đoán tương lai…`

---

# 33. Error states

## Physical mode incomplete

> Vui lòng chọn mặt Ngửa hoặc Sấp cho đủ ba đồng xu.

## Unexpected system error

> Không thể hoàn tất lần gieo này. Vui lòng thử lại.

Nếu error xảy ra sau khi screen-mode random result đã được committed, retry rendering/network không được tạo một random result mới.

---

# 34. Refresh / navigation

Frontend cần xác định state rõ:

```text
NOT_STARTED
CASTING_LINE
LINE_RESULT
COMPLETED
RESULT
```

Screen-mode result đã committed không được random lại chỉ vì component re-render.

---

# 35. State machine — Screen mode

```text
SELECT_MODE
    ↓
CONTEXT
    ↓
READY_LINE_1
    ↓
CASTING
    ↓
LINE_1_RESULT
    ↓
READY_LINE_2
    ↓
CASTING
    ↓
...
    ↓
LINE_6_RESULT
    ↓
COMPLETED
    ↓
VIEW_READING
```

Không có transition:

```text
LINE_RESULT → RECAST_SAME_LINE
```

---

# 36. State machine — Physical mode

```text
SELECT_MODE
    ↓
CONTEXT
    ↓
ENTER_LINE_1
    ↓
PREVIEW_LINE_1
    ↕
EDIT_COIN_FACES
    ↓
CONFIRM_LINE_1
    ↓
ENTER_LINE_2
    ↓
...
    ↓
CONFIRM_LINE_6
    ↓
COMPLETED
    ↓
VIEW_READING
```

---

# 37. Microcopy

Recommended:

### Primary actions

- Bắt đầu
- Gieo
- Tiếp tục
- Xác nhận hào
- Xem quẻ

### Secondary actions

- Cách gieo ba đồng xu
- Sửa kết quả đã nhập
- Xem lịch sử gieo

### Avoid

- Thử vận may
- Gieo may mắn
- Xin quẻ đẹp
- Gieo lại quẻ xấu
- Dự đoán chính xác
- Kết quả chắc chắn

---

# 38. Accessibility

Coin state không được biểu diễn chỉ bằng màu/hình.

Luôn có text:

```text
Ngửa
Sấp
```

Moving state:

```text
Hào động
```

Screen reader label ví dụ:

```text
Đồng xu 1: Ngửa
Đồng xu 2: Sấp
Đồng xu 3: Sấp
Kết quả: Thiếu Dương, hào Dương tĩnh.
```

Animation cần tôn trọng `prefers-reduced-motion`.

---

# 39. Interaction acceptance criteria

### UX-AC-01

Người mới có thể xác định đâu là `Ngửa`, đâu là `Sấp` mà không cần kiến thức trước.

### UX-AC-02

User hiểu rằng cần gieo sáu lần.

### UX-AC-03

User hiểu Hào 1 là hào dưới cùng.

### UX-AC-04

Sau mỗi lần gieo, user thấy ngay:

- ba mặt xu;
- loại hào;
- Âm/Dương;
- Động/Tĩnh;
- hình hào.

### UX-AC-05

Hào động dễ nhận biết mà không phụ thuộc màu.

### UX-AC-06

Screen mode không có affordance reroll.

### UX-AC-07

Physical mode không thể xác nhận nếu thiếu mặt xu.

### UX-AC-08

Physical mode cho sửa input trước confirmation.

### UX-AC-09

Sau mỗi hào, hình quẻ đang hình thành được cập nhật.

### UX-AC-10

Sau sáu hào, user được review trước khi `Xem quẻ`.

### UX-AC-11

No-moving-line state không bị trình bày như lỗi.

### UX-AC-12

Result screen ghi rõ casting provenance.

---

# 40. Usability test

Trước production nên test tối thiểu:

### 5 novice users

Không giải thích trước.

Yêu cầu họ:

1. Khởi quẻ bằng đồng xu.
2. Chọn screen mode.
3. Hoàn thành sáu hào.
4. Giải thích bằng lời của họ hào động là gì.
5. Thử physical mode.

Success criteria:

- ≥ 4/5 hiểu lần gieo đầu tiên tạo hào dưới cùng.
- ≥ 4/5 hiểu Ngửa/Sấp.
- ≥ 4/5 hoàn thành physical input không cần trợ giúp.
- ≥ 4/5 nhận biết hào động.
- Không user nào tìm kiếm nút reroll như primary expected behavior.

### 2 experienced users

Kiểm tra:

- terminology;
- thứ tự hào;
- moving-line representation;
- history;
- khả năng trace từ kết quả đồng xu → hào → quẻ.

---

# 41. Designer deliverables

UI/UX Designer cần cung cấp:

1. User flow.
2. Desktop wireframes.
3. Mobile wireframes.
4. Hi-fi Screen Mode.
5. Hi-fi Physical Mode.
6. Coin states Ngửa/Sấp.
7. Static-line states.
8. Moving-line states.
9. Six-line progress state.
10. Completion state.
11. No-moving-line state.
12. Error/incomplete states.
13. Reduced-motion behavior.
14. Responsive specification.
15. Clickable prototype.

---

# 42. Required design states

Designer không chỉ thiết kế happy path.

Bắt buộc có:

```text
Mode selection

Screen mode:
- Before cast
- Casting
- Static result
- Moving result
- Line 1
- Intermediate line
- Line 6
- Complete

Physical:
- Empty
- 1 coin selected
- 2 coins selected
- 3 coins selected
- Static result
- Moving result
- Edit
- Complete

Shared:
- No moving lines
- One moving line
- Multiple moving lines
- Error
- Exit confirmation
```

---

# 43. Product experience principle

Trải nghiệm cần tạo cảm giác:

> **Đặt câu hỏi → Tập trung → Gieo từng hào → Quan sát quẻ hình thành → Xem và chiêm nghiệm kết quả.**

Không phải:

> **Nhấn nút → nhận kết quả ngẫu nhiên → thử lại nếu không thích.**

Đây là distinction quan trọng nhất của Coin Casting UX trong QIChing.

---

# 44. Handoff rule

Designer không được tự thay đổi:

- mapping Ngửa/Sấp;
- mapping Âm/Dương;
- hào động;
- thứ tự sáu hào;
- khả năng reroll;
- cách sinh quẻ biến.

Nếu cần thay đổi các yếu tố trên phải quay lại Product/Domain Spec.

Designer được quyền đề xuất thay đổi:

- layout;
- animation;
- visual treatment;
- spacing;
- typography;
- component composition;
- responsive behavior;
- microcopy không làm thay đổi nghiệp vụ.

---

## UX North Star

> Sau lần gieo đầu tiên, một người chưa từng học phương pháp ba đồng xu vẫn phải hiểu mình vừa gieo ra loại hào nào và thấy được hào đó đang được đặt ở đâu trong quẻ.

> Sau sáu lần gieo, một người đã biết Lục Hào phải có khả năng kiểm tra lại toàn bộ kết quả gieo và truy vết từ ba mặt đồng xu đến sáu hào trước khi bước vào phần luận quẻ.