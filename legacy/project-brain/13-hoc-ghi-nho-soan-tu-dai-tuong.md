# 13 – Học và ghi nhớ Soán Từ / Đại Tượng Truyện (Spaced Repetition)

> **Trạng thái:** Đặc tả tính năng, thống nhất qua trao đổi với owner ngày 2026-09-21. Chưa có code.

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
  [02-tinh-nang.md mục 10](./02-tinh-nang.md#10-chưa-triển-khai-hoặc-chỉ-thuộc-legacy)).
- Chọn bản dịch khác (Ngô Tất Tố / Nguyễn Hiến Lê) làm nguồn học — MVP cố định bản Phan Bội Châu vì
  đây là bản duy nhất hiện có field Đại Tượng Truyện tách riêng khỏi Soán Từ.

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

## 4. Đơn vị thẻ (card)

- Mỗi quẻ tách thành 2 thẻ độc lập: **"Soán Từ"** và **"Đại Tượng Truyện"**.
- Mặt trước (gợi nhớ): tên quẻ (ví dụ "Thuần Càn"), có thể kèm hình quẻ 6 hào.
- Mặt sau (đáp án): nội dung Hán tự + phiên âm + dịch nghĩa + giảng, lấy từ field tương ứng.
- Field `soanTu`/`daiTuongTruyen` trong `noiDungQuePhanBoiChau.json` hiện là **một chuỗi gộp**
  (Hán tự, phiên âm, dịch, giảng nằm chung). Muốn ẩn/hiện Hán tự độc lập theo mức độ ôn tập (đã
  chốt ở mục 2) cần parse tách các phần này ra trước — xem rủi ro ở mục 10.

## 5. Thuật toán ôn tập (Leitner box, 2 mức)

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

## 7. Vị trí trong điều hướng

- Thêm mục mới vào danh sách 5 mục hiện có ở `src/App.tsx`
  (xem [02-tinh-nang.md mục 1](./02-tinh-nang.md#1-điều-hướng)), ví dụ đặt tên "Học Kinh Dịch" hoặc
  "Ôn tập".
- Liên kết chéo với "64 Quẻ Kinh Dịch": từ thẻ ôn tập có link mở sang trang tra cứu chi tiết quẻ đó
  (`Que64.tsx`) nếu người học muốn xem thêm Giảng đầy đủ hoặc đối chiếu bản Nguyễn Hiến Lê.

## 8. Lưu trữ

- `localStorage` key mới, độc lập với hai kho hiện có (`qiching.queInfo.v1`,
  `qiching.coinCasting.v1` — xem [02-tinh-nang.md mục 7](./02-tinh-nang.md#7-quẻ-đã-lưu)), ví dụ
  `qiching.srs.soanDaiTuong.v1`.
- Cấu trúc: mảng trạng thái từng thẻ
  `{ queId, loaiThe: 'soanTu' | 'daiTuong', box, lastReviewed, nextReview }`.
- Không có backend, không đồng bộ nhiều thiết bị — nhất quán với hạn chế hiện tại toàn app.

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

- **Chưa audit** chất lượng trích xuất `soanTu`/`daiTuongTruyen` trong
  `noiDungQuePhanBoiChau.json` cho đủ 64 quẻ (tương tự audit đã làm ở tài liệu 11 cho bản Ngô Tất
  Tố) — cần làm trước khi coi dữ liệu sẵn sàng dùng làm nguồn học chính thức.
- **Chưa quyết định cách tách Hán tự khỏi phần dịch/giảng** trong field text hiện tại (một chuỗi
  gộp) — cần để hỗ trợ ẩn/hiện Hán tự độc lập theo mức độ ôn tập đã chốt ở mục 2.
- **Chưa quyết định "mặt trước" thẻ hiển thị gì** để không quá dễ đoán — chỉ tên quẻ có thể quá dễ
  nếu người học đã quen mặt chữ; có thể cần thêm hình 6 hào hoặc ẩn tên quẻ ở mức ôn nâng cao.
- **Chưa quyết định tên gọi cụ thể** cho tab mới trong navigation.
