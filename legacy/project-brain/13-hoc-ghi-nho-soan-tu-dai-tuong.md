# 13 – Học và ghi nhớ Soán Từ / Đại Tượng Truyện (Spaced Repetition)

> **Trạng thái đặc tả ban đầu (2026-09-21):** thống nhất qua trao đổi với owner cùng ngày. Lúc đó
> chưa có code.

> **Trạng thái triển khai (2026-09-21, review sau khi code đã lên UAT):** tính năng đã được code
> và deploy thử ở `https://uat.qiching.org/hoc-ghi-nho`, nhưng **lệch khá nhiều** so với đặc tả
> Spaced Repetition gốc bên dưới — các mục có ghi chú "**Trạng thái thực tế**" là phần lệch. Tóm
> tắt các điểm lệch chính:
>
> - **Không có thuật toán ôn tập** (khác mục 5): không Leitner box, không field `box`/
>   `nextReview`, không khái niệm thẻ "đến hạn". Thực tế chỉ là trình duyệt thẻ tuần tự
>   (flashcard browser) với bộ đếm Nhớ/Quên tồn tại trong phiên hiện tại.
> - **Không có lưu trữ** (khác mục 8): không dùng `localStorage` ở đâu trong
>   `HocGhiNho.tsx`/`LearnCard.tsx` — rời trang hoặc reload là mất hết lựa chọn nội dung, quẻ đã
>   chọn và kết quả Nhớ/Quên; không có key `qiching.srs.*` nào tồn tại trong code.
> - Luồng người dùng thực tế có thêm một **màn hình chọn nội dung** trước khi vào phiên ôn: chọn
>   loại (Soán Từ/Đại Tượng Truyện, mặc định cả hai) và chọn quẻ cụ thể qua lưới 8×8 (mặc định
>   chọn cả 64, có nút Random 5/10/20) — không có trong đặc tả gốc (khác mục 6).
> - Mức độ khó là **3 mức Dễ / Trung bình / Khó** (`DifficultyLevel` ở `src/core/types.ts`, dùng
>   trong `LearnCard.tsx`), không phải toggle nhị phân ẩn/hiện Hán tự như mục 2/4 mô tả. Mặc định
>   là **Trung bình** (đã đổi từ Dễ theo yêu cầu owner sau khi review).
> - Đã audit dữ liệu `soanTu`/`daiTuongTruyen` (rủi ro nêu ở mục 3, 10 bên dưới): phát hiện 7/64
>   quẻ (6, 9, 23, 27, 31, 49, 53) bị lệch field `hanViet`/`hanTu` do lỗi script trích xuất gốc —
>   đã sửa, xem comment "Audit đối chiếu ngược (2026-09, đợt 2)" đầu
>   `src/core/data/noiDungQuePhanBoiChau.ts`.
> - Đã sửa thêm nhiều bug UI phát sinh trong lúc review code: hexagram/tên quẻ sai ở màn chọn quẻ
>   (`QueSelectionGrid.tsx` tự vẽ hexagram + suy tên quẻ sai thay vì dùng lại `HinhQue`), hexagram
>   vẽ không đều ở màn ôn tập (`HexagramDisplay.tsx`, cùng nguyên nhân), layout tràn ngang phải
>   cuộn mới thấy hết quẻ đầu/cuối hàng, font lệch khỏi theme chung "EB Garamond" của site, và
>   route `/hoc-ghi-nho` bị 404 thật khi tải trực tiếp/F5 (thiếu trong danh sách prerender
>   `DUONG_DAN_TINH` ở `src/ui/duongDan.ts` — xem
>   [02-tinh-nang.md mục 1](./02-tinh-nang.md#1-điều-hướng)).
> - Tab điều hướng đã thêm, tên thực tế là **"🧠 Học ghi nhớ"** (đường dẫn `/hoc-ghi-nho`), không
>   phải "Học Kinh Dịch"/"Ôn tập" như gợi ý ở mục 7.
>
> Các mục 1-10 bên dưới giữ nguyên làm baseline đặc tả gốc (để biết ý định ban đầu khác thực tế
> ra sao); không tự sửa lại nội dung baseline theo code, chỉ thêm ghi chú "Trạng thái thực tế" ở
> chỗ lệch. Mô tả đầy đủ tính năng như đã triển khai nằm ở
> [02-tinh-nang.md mục 8](./02-tinh-nang.md#8-học-ghi-nhớ).

## 1. Mục tiêu

Giúp người học **ghi nhớ chủ động** Soán Từ và Đại Tượng Truyện của 64 quẻ Kinh Dịch, thông qua
ôn tập lặp lại ngắt quãng (spaced repetition), thay vì chỉ tra cứu một lần rồi quên.

Tính năng này khác với "Tra cứu 64 quẻ" hiện có (`Que64.tsx`, xem
[02-tinh-nang.md mục 6](./02-tinh-nang.md#6-tra-cứu-64-quẻ)): trang tra cứu hiển thị nội dung theo
yêu cầu, không có cơ chế lặp lại có chủ đích, không tự lên lịch ôn tập, và không theo dõi mức độ
ghi nhớ của người dùng theo thời gian.

Giai đoạn đầu (MVP) chỉ bao phủ Soán Từ và Đại Tượng Truyện. Hào Từ (384 hào) sẽ hỗ trợ ở giai
đoạn sau — xem mục 9.

## 2. Phạm vi MVP

### In scope

- 64 quẻ × 2 thẻ (Soán Từ, Đại Tượng Truyện) = 128 thẻ ban đầu.
- Nội dung mỗi thẻ lấy từ bản dịch **Phan Bội Châu**
  (`src/core/data/noiDungQuePhanBoiChau.json`, field `soanTu` và `daiTuongTruyen`) — dữ liệu này
  **đã có sẵn trong repo cho đủ 64 quẻ**, không cần thu thập/nhập liệu mới (xem mục 3).
- Người học bật/tắt hiển thị phần Hán tự khi ôn tập (mức độ khó tùy chọn).
- Thuật toán ôn tập kiểu Leitner box đơn giản, thang tự đánh giá 2 mức: **Nhớ / Quên** (không phải
  SM-2/Anki 4 mức — xem mục 5).
- Mỗi quẻ có 2 thẻ độc lập với lịch ôn riêng (Soán Từ và Đại Tượng có thể nhớ/quên khác nhau).
- Màn hình ôn tập hằng ngày: số thẻ đến hạn, ôn lần lượt, tự đánh giá sau khi xem đáp án.
- Theo dõi tiến độ mỗi thẻ: box hiện tại, ngày ôn gần nhất, ngày ôn tiếp theo.
- Tab điều hướng riêng, mới, thêm vào danh sách hiện có ở `src/App.tsx`
  (xem [02-tinh-nang.md mục 1](./02-tinh-nang.md#1-điều-hướng)).
- Lưu tiến độ bằng `localStorage`, theo đúng pattern hiện có của app (`qiching.*`), vì app chưa có
  backend/tài khoản người dùng.

### Out of scope (MVP)

- **Hào Từ** (384 hào) — để giai đoạn sau, xem mục 9.
- SRS nâng cao kiểu SM-2/FSRS với nhiều mức đánh giá (Lại/Khó/Nhớ/Dễ) — MVP chỉ 2 mức.
- Quiz trắc nghiệm, gamification, streak, leaderboard, huy hiệu.
- Đồng bộ tiến độ học nhiều thiết bị — nhất quán với hạn chế chung hiện tại của app (xem
  [02-tinh-nang.md mục 11](./02-tinh-nang.md#11-chưa-triển-khai-hoặc-chỉ-thuộc-legacy)).
- Chọn bản dịch khác (Ngô Tất Tố / Nguyễn Hiến Lê) làm nguồn học — MVP cố định bản Phan Bội Châu vì
  đây là bản duy nhất hiện có field Đại Tượng Truyện tách riêng khỏi Soán Từ.

> **Trạng thái thực tế:** 128 thẻ, nguồn Phan Bội Châu, tab điều hướng riêng — **đúng** như đặc
> tả. Toggle Hán tự và thuật toán Leitner 2 mức — **không đúng**: thay vào đó là 3 mức độ khó cố
> định (Dễ/Trung bình/Khó, xem mục 4) và không có thuật toán ôn tập nào (xem mục 5). Lưu
> `localStorage` — **không có**, xem mục 8.

## 3. Nội dung học tập & nguồn dữ liệu

Khảo sát dữ liệu hiện có trong repo (2026-09-21):

| File | Có Soán Từ? | Có Đại Tượng Truyện riêng? |
|---|---|---|
| `src/core/data/noiDungQue.json` (Nguyễn Hiến Lê, đang dùng cho tra cứu) | Có (`thoanTu`) | **Không** |
| `src/core/data/noiDungQueNgoTatTo.json` | Không có field riêng | Không |
| `src/core/data/noiDungQuePhanBoiChau.json` | Có (`soanTu`, `soanTruyen`) | **Có** (`daiTuongTruyen`) |

→ Bản **Phan Bội Châu** là nguồn duy nhất hiện đã có sẵn cả hai nội dung cần thiết cho MVP, tách
riêng field, đủ cho cả 64 quẻ. Đây là phát hiện quan trọng: **không cần trích xuất dữ liệu mới**
để làm MVP.

Rủi ro cần xử lý trước khi dùng làm nguồn học chính thức: tài liệu
[11-ke-hoach-ban-dich-ngo-tat-to-phan-boi-chau.md](./11-ke-hoach-ban-dich-ngo-tat-to-phan-boi-chau.md)
đã ghi nhận một số lỗi trích xuất đã biết ở bản Ngô Tất Tố (nội dung rơi nhầm field, thiếu Hào Từ ở
quẻ 32). Chưa rõ bản Phan Bội Châu có lỗi tương tự với `soanTu`/`daiTuongTruyen` hay không — cần
audit riêng cho đủ 64 quẻ trước khi coi dữ liệu là sẵn sàng dùng cho tính năng học tập (sai dữ liệu
ở đây ảnh hưởng trực tiếp tới việc người học ghi nhớ sai nội dung).

> **Trạng thái thực tế (2026-09-21):** đã audit — người dùng báo lỗi ở quẻ 53 (`daiTuongTruyen`),
> rà lại toàn bộ 64 quẻ phát hiện thêm 6 quẻ cùng lỗi (6, 9, 23, 27, 31, 49): field `hanViet` bị
> gán nhầm thành chữ Hán, `hanTu` bị gán nhầm thành câu đầu của phần giảng, dòng phiên âm Hán
> Việt thật bị rơi mất hoàn toàn. Đã sửa cho cả 7 quẻ (đối chiếu HTML gốc từng trang bằng `curl`
> trước khi sửa) — xem comment "Audit đối chiếu ngược (2026-09, đợt 2)" đầu
> `src/core/data/noiDungQuePhanBoiChau.ts`. `soanTu` đã audit cùng đợt, không phát hiện lỗi tương
> tự.

## 4. Đơn vị thẻ (card)

- Mỗi quẻ tách thành 2 thẻ độc lập: **"Soán Từ"** và **"Đại Tượng Truyện"**.
- Mặt trước (gợi nhớ): tên quẻ (ví dụ "Thuần Càn"), có thể kèm hình quẻ 6 hào.
- Mặt sau (đáp án): nội dung Hán tự + phiên âm + dịch nghĩa + giảng, lấy từ field tương ứng.
- Field `soanTu`/`daiTuongTruyen` trong `noiDungQuePhanBoiChau.json` hiện là **một chuỗi gộp**
  (Hán tự, phiên âm, dịch, giảng nằm chung). Muốn ẩn/hiện Hán tự độc lập theo mức độ ôn tập (đã
  chốt ở mục 2) cần parse tách các phần này ra trước — xem rủi ro ở mục 10.

> **Trạng thái thực tế:** field đã được tách từ trước khi tính năng này code (schema
> `{ hanViet, hanTu, dichGiang }`, xem comment "Schema 2026-09" đầu `noiDungQuePhanBoiChau.ts`),
> nên rủi ro "cần parse tách" nêu trên đã không còn là vấn đề. Vẫn có cơ chế lật thẻ (bấm để xem
> đáp án, giống mô tả), nhưng tên quẻ + hình hexagram (`HexagramDisplay`) hiện **luôn hiển thị**
> phía trên, kể cả trước khi lật — không phải một phần của "mặt sau". Nội dung sau khi lật hiển
> thị theo 3 mức độ khó (`DifficultyLevel`, xem mục 2) chứ không phải luôn đủ cả Hán tự + phiên
> âm + dịch + giảng cùng lúc như mô tả gốc.

## 5. Thuật toán ôn tập (Leitner box, 2 mức)

> **Trạng thái thực tế: TOÀN BỘ mục này chưa triển khai.** Không có khái niệm `box`, không tính
> `nextReview`, không phân biệt thẻ mới/thẻ đến hạn. `HocGhiNho.tsx` chỉ giữ hai state trong bộ
> nhớ của phiên hiện tại — `results: Record<cardId, "remember" | "forget">` và
> `stats: { remember, forget }` — dùng để hiển thị thanh thống kê, không ảnh hưởng thứ tự hay tần
> suất xuất hiện của thẻ nào cả. Đóng tab hoặc bấm "Thay đổi nội dung" là mất sạch, không có gì
> được lên lịch ôn lại.

- Nhiều box theo thứ tự, mỗi box ứng với một khoảng cách ôn tăng dần, ví dụ:
  `box 0: 1 ngày`, `box 1: 3 ngày`, `box 2: 7 ngày`, `box 3: 14 ngày`, `box 4: 30 ngày`.
- Đánh giá **"Nhớ"** → thẻ chuyển lên box kế tiếp (khoảng ôn xa hơn).
- Đánh giá **"Quên"** → thẻ quay về box 0 (ôn lại sớm).
- Trạng thái lưu cho mỗi thẻ: `box` hiện tại, `lastReviewed`, `nextReview`.
- Thẻ mới (chưa học lần nào) coi như ở box khởi đầu, đến hạn ngay khi người học chọn học thêm.

## 6. Luồng người dùng

1. Vào tab mới, thấy tổng quan: số thẻ đến hạn hôm nay, số thẻ mới, số thẻ đã thuộc (box cao nhất).
2. Bấm "Bắt đầu ôn tập" → hiển thị lần lượt từng thẻ đến hạn.
3. Xem mặt trước (tên quẻ) → bấm để lật xem đáp án (Soán Từ hoặc Đại Tượng) → tự đánh giá Nhớ/Quên.
4. Hết danh sách thẻ đến hạn → màn hình hoàn thành, gợi ý học thêm thẻ mới nếu muốn.
5. Duyệt/học thẻ mới: MVP học theo thứ tự số thứ tự quẻ 1→64; chưa hỗ trợ chọn tùy ý theo Bát Cung
   hay theo chủ đề.

> **Trạng thái thực tế:** luồng thực tế khác hẳn — không có khái niệm "đến hạn" (vì không có
> thuật toán ôn tập, xem mục 5). Vào tab mới → **màn chọn nội dung** trước (chọn loại Soán
> Từ/Đại Tượng, chọn quẻ cụ thể qua lưới 8×8 hoặc Random 5/10/20/Tất cả 64) → bấm "🚀 Bắt đầu học"
> → phiên ôn hiển thị lần lượt các thẻ đã chọn theo đúng thứ tự đã build (không random, không ưu
> tiên theo mức nhớ/quên). Có thêm điều hướng "← Quay lại"/"Tiếp theo →" và ô nhập số để nhảy
> thẳng tới thẻ bất kỳ — không có trong đặc tả gốc. Hết thẻ → màn hoàn thành hiện % chính xác, có
> nút "↻ Học lại" (reset lại đúng phiên đang chọn, không phải "học thêm thẻ mới"/thẻ đến hạn kế
> tiếp).

## 7. Vị trí trong điều hướng

- Thêm mục mới vào danh sách 5 mục hiện có ở `src/App.tsx`
  (xem [02-tinh-nang.md mục 1](./02-tinh-nang.md#1-điều-hướng)), ví dụ đặt tên "Học Kinh Dịch" hoặc
  "Ôn tập".
- Liên kết chéo với "64 Quẻ Kinh Dịch": từ thẻ ôn tập có link mở sang trang tra cứu chi tiết quẻ đó
  (`Que64.tsx`) nếu người học muốn xem thêm Giảng đầy đủ hoặc đối chiếu bản Nguyễn Hiến Lê.

> **Trạng thái thực tế:** đã thêm tab, nhưng tên thực tế là **"🧠 Học ghi nhớ"**
> (`/hoc-ghi-nho`), và `src/App.tsx` lúc thêm tab này đã có sẵn 6 mục (đã có thêm "Hướng dẫn" từ
> trước, không phải 5 như baseline ghi) — xem danh sách đủ 7 mục hiện tại ở
> [02-tinh-nang.md mục 1](./02-tinh-nang.md#1-điều-hướng). **Chưa có** liên kết chéo sang trang
> tra cứu chi tiết quẻ (`ChiTietQue.tsx`) từ thẻ ôn tập.

## 8. Lưu trữ

- `localStorage` key mới, độc lập với hai kho hiện có (`qiching.queInfo.v1`,
  `qiching.coinCasting.v1` — xem [02-tinh-nang.md mục 7](./02-tinh-nang.md#7-quẻ-đã-lưu)), ví dụ
  `qiching.srs.soanDaiTuong.v1`.
- Cấu trúc: mảng trạng thái từng thẻ
  `{ queId, loaiThe: 'soanTu' | 'daiTuong', box, lastReviewed, nextReview }`.
- Không có backend, không đồng bộ nhiều thiết bị — nhất quán với hạn chế hiện tại toàn app.

> **Trạng thái thực tế: TOÀN BỘ mục này chưa triển khai.** `HocGhiNho.tsx` không gọi
> `localStorage` ở bất kỳ đâu. Lựa chọn nội dung/quẻ, vị trí thẻ đang xem và kết quả Nhớ/Quên chỉ
> tồn tại trong React state — rời trang, F5, hay đóng tab là mất sạch, phải chọn lại từ đầu mỗi
> lần vào `/hoc-ghi-nho`.

## 9. Roadmap: Hào Từ (giai đoạn sau)

- 64 quẻ × 6 hào = 384 Hào Từ — khối lượng lớn hơn nhiều so với 128 thẻ ở MVP.
- Cần thiết kế riêng trước khi triển khai, ví dụ:
  - Học Hào Từ của một quẻ chỉ mở khóa sau khi đã học xong Soán Từ + Đại Tượng của quẻ đó
    (progressive unlock), hoặc
  - Cho học độc lập, không ràng buộc thứ tự.
- Dữ liệu Hào Từ đã có sẵn ở cả `noiDungQue.json` (`haoTu[].noiDung`) và
  `noiDungQuePhanBoiChau.json` (`haoTu`) — cũng cần audit chất lượng trích xuất trước khi dùng,
  tương tự mục 3.

## 10. Câu hỏi / rủi ro còn mở

- ~~**Chưa audit** chất lượng trích xuất `soanTu`/`daiTuongTruyen`...~~ **Đã audit và sửa**
  (2026-09-21) — xem ghi chú "Trạng thái thực tế" ở mục 3.
- ~~**Chưa quyết định cách tách Hán tự khỏi phần dịch/giảng**...~~ **Không còn vấn đề** — field đã
  tách sẵn từ trước khi code (xem mục 4), nhưng tính năng thực tế không dùng cách tách này để
  toggle nhị phân như dự tính, mà dùng 3 mức độ khó cố định (xem mục 2).
- **Vẫn chưa quyết định "mặt trước" thẻ hiển thị gì** để không quá dễ đoán — thực tế hiện tại
  luôn hiện cả tên quẻ lẫn hình hexagram trước khi lật thẻ (xem mục 6), nên gần như không có tính
  "đố" nào; đúng như lo ngại ban đầu.
- ~~**Chưa quyết định tên gọi cụ thể** cho tab mới...~~ **Đã chốt** — "🧠 Học ghi nhớ" (xem mục 7).
- **Mới phát sinh — chưa có trong đặc tả gốc:** tính năng hiện tự nhận là "Spaced Repetition"
  trong tiêu đề/subtitle (`HocGhiNho.tsx`, `HocGhiNho.css`) dù không có thuật toán SRS nào đứng
  sau (mục 5) và không lưu tiến độ qua lần vào sau (mục 8) — cần quyết định: (a) đổi tên/mô tả
  cho khớp thực tế ("Ôn tập thẻ" thay vì "Spaced Repetition"), hay (b) triển khai tiếp phần
  Leitner box + `localStorage` như đặc tả gốc để tên gọi đúng nghĩa. Chưa có quyết định của owner
  về hướng nào.
