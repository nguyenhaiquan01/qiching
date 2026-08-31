Bạn đang chỉnh sửa ứng dụng web QIChing.

Mục tiêu của thay đổi này là điều chỉnh lại Information Architecture và UX của phần “Xem quẻ”, sao cho đúng với mental model của người dùng và đúng với domain model hiện tại.

BỐI CẢNH SẢN PHẨM

QIChing có một chức năng chính là “Xem quẻ”.

Hiện tại có hai cách để khởi quẻ:

1. Theo thời gian
2. Gieo đồng xu

Sau khi có Quẻ Chính / Hào Động / Quẻ Biến, cả hai cách đều dùng chung engine luận quẻ Lục Hào Nạp Giáp hiện tại.

Điểm quan trọng:

- “Theo thời gian” và “Gieo đồng xu” là hai CÁCH KHỞI QUẺ.
- “Gieo trên màn hình” và “Tôi tự gieo” KHÔNG phải là hai cách khởi quẻ ngang cấp.
- Chúng chỉ là hai CÁCH GIEO bên trong phương pháp “Gieo đồng xu”.
- Phần luận quẻ sau khi lập được quẻ là dùng chung.
- Không duplicate engine Lục Hào.

========================================
1. MỤC TIÊU UX
========================================

Mental model cần đạt được là:

“Tôi muốn xem quẻ
→ Tôi chọn cách khởi quẻ
→ Nếu chọn gieo đồng xu, tôi chọn cách gieo
→ Tôi thực hiện việc khởi quẻ
→ Tôi xem kết quả
→ Hệ thống luận quẻ bằng engine chung.”

Không để người dùng có cảm giác:

“Xem quẻ” và “Gieo đồng xu” là hai chức năng độc lập.

Không để ba lựa chọn này ngang cấp:

- Theo thời gian
- Gieo trên màn hình
- Tôi tự gieo

Hierarchy đúng phải là:

XEM QUẺ
  └── CÁCH KHỞI QUẺ
       ├── Theo thời gian
       └── Gieo đồng xu
            └── CÁCH GIEO
                 ├── Gieo trên màn hình
                 └── Tôi tự gieo

========================================
2. ĐIỀU CHỈNH TOP NAVIGATION
========================================

Hiện tại top navigation có thể đang có item riêng:

- Xem quẻ
- Gieo đồng xu

Hãy bỏ “Gieo đồng xu” khỏi top-level navigation.

Top navigation sau thay đổi chỉ nên là:

- Xem quẻ
- Tìm ngày tốt
- 64 Quẻ Kinh Dịch
- Quẻ đã lưu
- Giới thiệu

“Gieo đồng xu” trở thành một lựa chọn bên trong màn “Xem quẻ”.

Không tạo thêm top-level navigation item cho “Gieo trên màn hình” hoặc “Tôi tự gieo”.

========================================
3. CẤU TRÚC MỚI CỦA MÀN XEM QUẺ
========================================

Màn “Xem quẻ” phải có thứ tự thông tin:

A. Cách khởi quẻ
B. Câu hỏi / loại xem
C. Nội dung nhập tương ứng với cách khởi quẻ
D. Thực hiện khởi quẻ
E. Kết quả

Không để phần “Câu hỏi” là section đầu tiên rồi mới giấu cách khởi quẻ ở nơi khác.

Suggested structure:

XEM QUẺ

CÁCH KHỞI QUẺ

[ Theo thời gian ] [ Gieo đồng xu ]

Sau đó render phần nội dung tương ứng.

========================================
4. CONTROL CHỌN CÁCH KHỞI QUẺ
========================================

Dùng segmented control, tabs hoặc 2 selectable options ngang cấp.

Label user-facing:

- Theo thời gian
- Gieo đồng xu

Có thể có subtitle:

Theo thời gian
Mai Hoa Dịch Số

Gieo đồng xu
Ba đồng xu · Sáu lần

Không dùng các label:

- Xem theo thời gian
- Xem theo đồng xu

vì màn cha đã là “Xem quẻ”.

Không dùng:

- Gieo bằng máy tính

Label chuẩn cho digital coin casting là:

- Gieo trên màn hình

========================================
5. KHI CHỌN “THEO THỜI GIAN”
========================================

Hiển thị flow hiện tại của “Xem quẻ theo thời gian”.

Giữ lại các thành phần nghiệp vụ hiện có như:

- Loại xem:
  - Xem một việc
  - Xem tổng quan
  - Quẻ Cuộc Đời
- Chủ đề
- Câu hỏi
- Ngày lập quẻ
- Giờ
- CTA lập quẻ

Suggested structure:

CÁCH KHỞI QUẺ
[ Theo thời gian ACTIVE ] [ Gieo đồng xu ]

CÂU HỎI

○ Xem một việc
○ Xem tổng quan
○ Quẻ Cuộc Đời

Chủ đề
[...]

Câu hỏi (không bắt buộc)
[...]

THÔNG TIN KHỞI QUẺ

Ngày lập quẻ
[...]

Giờ
[...]

[LẬP QUẺ]

Không thay đổi engine lập quẻ theo thời gian nếu không cần thiết.

========================================
6. KHI CHỌN “GIEO ĐỒNG XU”
========================================

Ẩn hoàn toàn Date/Time input dùng cho khởi quẻ theo thời gian.

Không hiển thị:

- Ngày lập quẻ
- Giờ
- CTA “Lập quẻ” của flow theo thời gian

Thay vào đó hiển thị:

CÁCH KHỞI QUẺ
[ Theo thời gian ] [ Gieo đồng xu ACTIVE ]

CÂU HỎI

○ Xem một việc
○ Xem tổng quan
○ Quẻ Cuộc Đời

Chủ đề
[...]

Câu hỏi (không bắt buộc)
[...]

CÁCH GIEO

Sau đó cho user chọn một trong hai sub-mode:

1. Gieo trên màn hình
2. Tôi tự gieo

========================================
7. THIẾT KẾ “CÁCH GIEO”
========================================

Không dùng một segmented control giống hệt “Cách khởi quẻ” nếu điều đó làm hai tầng hierarchy trông ngang nhau.

Ưu tiên dùng 2 selectable cards hoặc radio cards.

Ví dụ:

CÁCH GIEO

┌─────────────────────────────┐
│ Gieo trên màn hình          │
│                             │
│ QIChing mô phỏng ba đồng xu │
│ cho từng hào.               │
└─────────────────────────────┘

┌─────────────────────────────┐
│ Tôi tự gieo                 │
│                             │
│ Gieo ba đồng xu thật và     │
│ nhập kết quả Ngửa/Sấp.      │
└─────────────────────────────┘

Chỉ một card được selected tại một thời điểm.

Có selected state rõ ràng nhưng tinh tế.

Không dùng style mang cảm giác casino/game.

========================================
8. LABEL VÀ TERMINOLOGY PHẢI THỐNG NHẤT
========================================

Dùng đúng bộ từ sau trong toàn UI:

Mục tiêu:
- Xem quẻ

Cấp 1:
- Cách khởi quẻ

Option cấp 1:
- Theo thời gian
- Gieo đồng xu

Cấp 2:
- Cách gieo

Option cấp 2:
- Gieo trên màn hình
- Tôi tự gieo

Không dùng lẫn lộn các từ:

- Phương pháp xem
- Chế độ xem
- Xem theo đồng xu
- Gieo bằng máy tính
- Gieo tự động
- Manual
- Automatic

nếu không có lý do rõ ràng.

========================================
9. BUSINESS BOUNDARY
========================================

Không thay đổi domain logic Coin Casting đã chốt.

Coin Casting gồm:

- 3 đồng xu
- 6 lần gieo
- Hào 1 là hào dưới cùng
- Hào được lập từ dưới lên
- 3 Sấp:
  - Lão Dương
  - Dương động
  - Dương → Âm
- 2 Sấp + 1 Ngửa:
  - Thiếu Dương
  - Dương tĩnh
- 2 Ngửa + 1 Sấp:
  - Thiếu Âm
  - Âm tĩnh
- 3 Ngửa:
  - Lão Âm
  - Âm động
  - Âm → Dương

Không đưa hệ điểm 2/3 vào primary UX.

========================================
10. SCREEN MODE
========================================

Khi user chọn:

Gieo trên màn hình

UI đi vào flow screen casting.

Behavior:

- Mỗi lần gieo tạo 3 mặt xu độc lập.
- Mỗi xu là Ngửa hoặc Sấp.
- Không random trực tiếp loại hào.
- Mỗi xu phải có xác suất độc lập 50/50.
- Sau khi kết quả của một hào đã được tạo:
  - không có nút Gieo lại
  - không có reroll
  - không có retry vì không thích kết quả
- User chỉ có:
  - Tiếp tục
  - hoặc thoát cả phiên nếu muốn

Flow:

Hào 1 / 6
→ Gieo
→ Hiển thị 3 mặt xu
→ Hiển thị loại hào
→ Hiển thị hào trên quẻ đang hình thành
→ Tiếp tục
→ Hào 2 / 6
...
→ Hào 6 / 6
→ Review
→ Xem quẻ

========================================
11. PHYSICAL MODE
========================================

Khi user chọn:

Tôi tự gieo

UI phải cho user nhập 3 mặt xu vật lý.

Mỗi đồng xu:

- Ngửa
- Sấp

Quy ước:

- Ngửa = mặt có chữ
- Sấp = mặt không chữ hoặc hoa văn

User-facing helper text phải làm rõ quy ước này.

Không yêu cầu user nhập:

- 6
- 7
- 8
- 9

Không yêu cầu user tự xác định:

- Âm/Dương
- Động/Tĩnh
- Lão/Thiếu

Hệ thống tự tính sau khi đủ 3 mặt xu.

CTA:

XÁC NHẬN HÀO

Disabled khi chưa chọn đủ 3 đồng xu.

User được sửa Ngửa/Sấp trước khi xác nhận.

========================================
12. CÂU HỎI VÀ CHỦ ĐỀ
========================================

Phần:

- Xem một việc
- Xem tổng quan
- Quẻ Cuộc Đời
- Chủ đề
- Câu hỏi

là concern chung của “Xem quẻ”.

Không duplicate component giữa Time Casting và Coin Casting nếu logic giống nhau.

Nếu code hiện tại đang có hai bản form riêng, hãy refactor để shared component được tái sử dụng khi hợp lý.

Ví dụ:

<ReadingContext />

sau đó:

<TimeCastingInput />

hoặc:

<CoinCastingInput />

========================================
13. COMPONENT ARCHITECTURE ĐỀ XUẤT
========================================

Không bắt buộc đúng tên component, nhưng architecture nên tương tự:

ReadingPage
├── CastingMethodSelector
├── ReadingContext
└── CastingMethodContent
     ├── TimeCastingFlow
     └── CoinCastingFlow
          ├── CoinModeSelector
          ├── ScreenCoinCasting
          └── PhysicalCoinCasting

Kết quả cuối cùng:

Casting result
→ normalize thành shared Hexagram input
→ existing Liu Yao engine
→ existing result UI

Không duplicate:

- Nạp Giáp
- Lục Thân
- Thế/Ứng
- Quẻ biến
- logic luận Lục Hào

trong CoinCastingFlow.

========================================
14. ROUTING
========================================

UX phải trông như cùng một feature “Xem quẻ”.

Implementation vẫn có thể dùng route/query riêng.

Ưu tiên một trong hai:

/xem-que?method=time
/xem-que?method=coin

hoặc:

/xem-que/theo-thoi-gian
/xem-que/gieo-dong-xu

Không để “Gieo đồng xu” tiếp tục tồn tại như một top-level IA độc lập.

Nếu route cũ /gieo-dong-xu đang tồn tại:

- có thể redirect sang /xem-que?method=coin
- không phá deep link cũ nếu tránh được

========================================
15. STATE MANAGEMENT
========================================

Casting method state:

TIME
COIN

Coin mode state:

SCREEN
PHYSICAL

Coin mode chỉ meaningful khi:

castingMethod === COIN

Không giữ state invalid như:

castingMethod = TIME
coinMode = PHYSICAL

nếu architecture có thể tránh được.

Có thể dùng discriminated union, ví dụ:

type CastingState =
  | {
      method: "TIME"
    }
  | {
      method: "COIN"
      coinMode: "SCREEN" | "PHYSICAL"
    }

========================================
16. UX STATE PERSISTENCE
========================================

Có thể nhớ lựa chọn gần nhất của user, nhưng không bắt buộc cho MVP.

Nếu nhớ:

- lưu castingMethod
- lưu coinMode

không lưu dở kết quả random theo cách khiến refresh tự sinh kết quả mới.

Screen casting result đã committed không được thay đổi chỉ vì component re-render.

========================================
17. RESPONSIVE
========================================

Desktop:

Cách khởi quẻ:
- 2 option ngang hàng

Cách gieo:
- 2 cards cạnh nhau nếu đủ không gian

Mobile:

Cách khởi quẻ:
- segmented control full width hoặc 2 stacked options

Cách gieo:
- 2 cards xếp dọc

Không horizontal scroll.

Không làm user mất context đang ở:

Xem quẻ
→ Gieo đồng xu
→ Tôi tự gieo

========================================
18. VISUAL HIERARCHY
========================================

Hierarchy phải nhìn rõ:

LEVEL 1:
XEM QUẺ

LEVEL 2:
CÁCH KHỞI QUẺ

LEVEL 3 khi chọn coin:
CÁCH GIEO

Không để “Cách gieo” visually ngang cấp với “Cách khởi quẻ”.

Suggested typography:

Page title:
Xem quẻ

Section label:
Cách khởi quẻ

Secondary section:
Cách gieo

Selected method:
visual state rõ nhưng không quá mạnh.

========================================
19. STYLE DIRECTION
========================================

Giữ visual identity hiện tại của QIChing nếu có thể.

Phong cách:

- trang nghiêm
- tĩnh
- tối giản
- warm neutral
- không casino
- không mystical overload
- không glowing coin
- không confetti
- không bright gold effects
- không animation phô trương

Không redesign toàn bộ design system chỉ vì thay IA.

========================================
20. COPY ĐỀ XUẤT
========================================

CÁCH KHỞI QUẺ

Theo thời gian
“Lập quẻ dựa trên thời điểm được chọn.”

Gieo đồng xu
“Gieo ba đồng xu sáu lần để lập sáu hào.”

Nếu chọn coin:

CÁCH GIEO

Gieo trên màn hình
“QIChing mô phỏng ba đồng xu cho từng hào.”

Tôi tự gieo
“Gieo ba đồng xu thật và nhập kết quả Ngửa/Sấp.”

Helper:

“Ngửa là mặt có chữ. Sấp là mặt không chữ hoặc hoa văn.”

========================================
21. KHÔNG LÀM
========================================

Không:

- để “Gieo đồng xu” ở top nav
- biến “Theo thời gian”, “Gieo trên màn hình”, “Tôi tự gieo” thành 3 tab ngang cấp
- duplicate phần Câu hỏi/Chủ đề nếu có thể tái sử dụng
- duplicate engine Lục Hào
- giữ Date/Time input khi user chọn Gieo đồng xu
- dùng “Gieo bằng máy tính”
- dùng “Gieo lại” sau khi đã có kết quả screen cast
- làm lại toàn bộ UI ngoài phạm vi này
- thay business rule Coin Casting
- đưa 6/7/8/9 vào primary UX
- tự invent thêm logic phong thủy/Kinh Dịch

========================================
22. ACCEPTANCE CRITERIA
========================================

AC01
Top navigation không còn item “Gieo đồng xu”.

AC02
“Gieo đồng xu” nằm bên trong màn “Xem quẻ”.

AC03
Màn “Xem quẻ” có section “Cách khởi quẻ”.

AC04
“Cách khởi quẻ” chỉ có hai option:
- Theo thời gian
- Gieo đồng xu

AC05
Khi chọn Theo thời gian:
- hiện Date
- hiện Time
- hiện CTA lập quẻ theo flow hiện tại
- không hiện Coin Mode Selector

AC06
Khi chọn Gieo đồng xu:
- không hiện Date/Time input dùng cho khởi quẻ
- hiện “Cách gieo”

AC07
“Cách gieo” chỉ có:
- Gieo trên màn hình
- Tôi tự gieo

AC08
Gieo trên màn hình và Tôi tự gieo không xuất hiện ngang cấp với Theo thời gian.

AC09
Câu hỏi/Chủ đề được tái sử dụng giữa hai casting methods khi logic giống nhau.

AC10
Coin Casting hoàn thành 6 hào từ dưới lên.

AC11
Screen mode không có reroll.

AC12
Physical mode nhập Ngửa/Sấp cho từng xu.

AC13
Sau khi có quẻ, cả Time Casting và Coin Casting đi vào cùng existing Liu Yao engine.

AC14
Không duplicate interpretation logic.

AC15
Result provenance có thể xác định:
- castingMethod = TIME
hoặc
- castingMethod = COIN
- coinMode = SCREEN / PHYSICAL

AC16
Mobile không có horizontal scroll.

AC17
UI vẫn giữ phong cách hiện tại của QIChing, không redesign ngoài phạm vi.

========================================
23. REFACTORING GUIDELINE
========================================

Trước khi code:

1. Inspect code hiện tại.
2. Xác định:
   - component của Xem quẻ
   - component Gieo đồng xu
   - routing
   - shared question/topic form
   - existing Liu Yao engine entry point
3. Không rewrite nếu không cần.
4. Ưu tiên move/refactor existing code.
5. Giữ behavior nghiệp vụ hiện tại.
6. Chỉ thay IA + composition + state flow cần thiết.
7. Nếu có duplicated logic giữa hai pages, extract shared component.
8. Nếu có route cũ, giữ backward compatibility bằng redirect nếu hợp lý.

========================================
24. OUTPUT YÊU CẦU
========================================

Sau khi implement, hãy trả về:

1. Tóm tắt UX/architecture đã thay đổi.
2. Danh sách file đã sửa.
3. Danh sách component mới.
4. Danh sách component được refactor.
5. Routing trước/sau.
6. State model.
7. Các business rule được giữ nguyên.
8. Các test đã thêm/sửa.
9. Các điểm chưa chắc chắn hoặc cần PO xác nhận.

Nếu codebase có test framework, hãy thêm test cho:

- switching TIME ↔ COIN
- hidden Date/Time in COIN mode
- visible Coin Mode Selector only in COIN
- SCREEN vs PHYSICAL
- preserving shared question/topic behavior
- navigation no longer contains top-level Coin item
- existing interpretation engine still used by both flows

QUAN TRỌNG:

Đừng chỉ thay label.

Mục tiêu chính là sửa hierarchy UX và component composition để sản phẩm phản ánh đúng mô hình:

XEM QUẺ
→ CÁCH KHỞI QUẺ
→ CÁCH GIEO nếu chọn đồng xu
→ QUẺ
→ LUẬN LỤC HÀO CHUNG