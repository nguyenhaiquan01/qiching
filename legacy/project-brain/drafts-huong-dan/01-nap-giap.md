---
trang: /huong-dan/nap-giap
trang_thai: BẢN NHÁP — chưa qua G2 (domain review), chưa qua G1 (rights review cho phần trích
  dẫn Tăng San Bốc Dịch nếu có), chưa publish. Bảng Địa Chi + Ngũ Hành + Lục Thân của quẻ Thuần
  Càn trong bài đã đối chiếu trực tiếp với dữ liệu/logic thật của QIChing (`queKinhDich.ts`,
  `business.ts`) — độ tin cậy cao. Phần lịch sử/thuật ngữ Thiên Can dựa trên hiểu biết chung,
  KHÔNG đối chiếu được với code vì QIChing không tính Thiên Can — cần domain reviewer xác nhận.
tac_gia_nhap: Claude (Sonnet 5) theo yêu cầu người dùng, dựa trên hiểu biết chung về hệ Bốc Dịch/
  Kinh Phòng — CẦN người có chuyên môn Dịch học đối chiếu trước khi đưa vào site chính thức
---

# Nạp Giáp là gì? Cách gán Địa Chi vào quẻ Kinh Dịch theo Kinh Phòng

Nếu chỉ đọc Thoán Từ và Hào Từ của một quẻ, bạn đang đọc quẻ theo lối **nghĩa lý** — cách hiểu Kinh
Dịch qua văn bản triết học, kiểu Chu Dịch mà Khổng Tử và các nhà chú giải đời sau (Trình Di, Chu
Hy...) truyền lại. Nhưng khi người xưa **bốc quẻ để đoán việc** (hỏi hôm nay có nên xuất hành, việc
này có thành hay không), họ dùng một hệ thống khác hẳn: **Bốc Dịch**, hay còn gọi Lục Hào — nơi mỗi
hào của quẻ được gán một Địa Chi và một vai trò Lục Thân, rồi luận đoán bằng quan hệ sinh khắc Ngũ
Hành giữa các hào đó với ngày tháng hiện tại. **Nạp Giáp** chính là bước đầu tiên và là nền tảng của
toàn bộ hệ thống này.

## Nguồn gốc: từ Kinh Phòng đến Tăng San Bốc Dịch

Phép Nạp Giáp được cho là do **Kinh Phòng** (京房, thời Tây Hán) sáng lập, gán Thiên Can và Địa Chi
vào từng hào của 64 quẻ để có thể dùng lý Ngũ Hành sinh khắc mà đoán việc — thay vì chỉ dựa vào lời
quẻ. Đây là bước ngoặt biến Kinh Dịch từ một hệ thống triết lý thuần túy thành một công cụ chiêm bốc
thực hành, với quy tắc rõ ràng, có thể kiểm tra lại.

Đến đời Thanh, **Dã Hạc Lão Nhân** (野鶴老人) hệ thống hoá lại toàn bộ cách luận Bốc Dịch — bao gồm
Nạp Giáp, cách xác định Dụng Thần, các loại thần sát, và rất nhiều án lệ thực tế — trong bộ sách
**Tăng San Bốc Dịch** (增删卜易, "Bốc Dịch được tăng bổ và cắt gọt"). Đây là một trong những tài liệu
nền tảng mà người học Bốc Dịch ngày nay vẫn tham khảo, vì sách không chỉ nêu quy tắc mà còn giảng qua
rất nhiều ví dụ đoán việc thật.

Điểm cần nói rõ ngay: Nạp Giáp là một **hệ thống riêng**, tách biệt với văn bản Thoán Từ/Hào Từ theo
nghĩa lý. Một quẻ có thể có Thoán Từ nói về "hanh thông", nhưng phần Nạp Giáp/Lục Thân của quẻ đó khi
đối chiếu với ngày giờ hỏi việc lại cho ra kết quả khác — vì hai hệ thống trả lời hai câu hỏi khác
nhau: nghĩa lý nói về đạo lý tổng quát của quẻ, Bốc Dịch nói về việc cụ thể bạn đang hỏi vào đúng thời
điểm bạn hỏi.

## Vì sao gọi là "Nạp Giáp"?

**Giáp** (甲) là can đầu tiên trong Thập Thiên Can. **Nạp** nghĩa là đưa vào, gán vào. "Nạp Giáp" —
theo nghĩa hẹp là "đưa can Giáp vào quẻ Càn", quẻ đứng đầu trong 8 quẻ đơn — được dùng làm tên gọi
chung cho toàn bộ phép gán Can Chi vào 8 quẻ đơn của Kinh Phòng, dù phần vận dụng thực tế trong luận
đoán chủ yếu xoay quanh **Địa Chi** chứ không phải Thiên Can.

Đây cũng là điều bạn sẽ thấy nếu dùng công cụ QIChing: phần "Nạp Giáp" hiển thị cho mỗi hào chỉ gồm
Lục Thân + Địa Chi + Ngũ Hành (ví dụ "Tử Tôn Tý Thủy"), không có Thiên Can. Điều này khớp với thực
hành phổ biến của Bốc Dịch hiện đại: Thiên Can là quy ước lịch sử để gọi tên phép Nạp Giáp, còn phần
thực sự dùng để tính sinh khắc, vượng suy với ngày/tháng là Địa Chi.

## Mỗi quẻ đơn nạp một dãy Địa Chi cố định

64 quẻ Kinh Dịch đều được ghép từ 2 trong 8 quẻ đơn (nội quái ở dưới — hào 1-3, ngoại quái ở trên —
hào 4-6). Với mỗi quẻ đơn trong 8 quẻ đơn (Càn, Đoài, Ly, Chấn, Tốn, Khảm, Cấn, Khôn), có một dãy 6
Địa Chi cố định gán sẵn cho hào 1 đến hào 6 khi quẻ đơn đó xuất hiện (dãy này vốn được định nghĩa đầy
đủ cho trường hợp quẻ thuần — quẻ đơn đó lặp lại ở cả nội lẫn ngoại — rồi áp dụng nửa tương ứng khi
quẻ đơn đó chỉ nằm ở nội hoặc ngoại của một quẻ ghép khác). Ghép Địa Chi với Ngũ Hành của nó, so với
Ngũ Hành của Cung mà quẻ thuộc về, ta tính ra được vai trò **Lục Thân** của từng hào (xem bài kế).

## Ví dụ: quẻ Thuần Càn (☰☰), Cung Càn

Quẻ Thuần Càn — nội quái và ngoại quái đều là Càn, đồng thời cũng là quẻ đứng đầu Cung Càn — là ví dụ
kinh điển nhất để minh hoạ Nạp Giáp:

| Hào | Địa Chi | Ngũ Hành | Lục Thân (so với Cung Càn — Kim) | Thế/Ứng |
|---|---|---|---|---|
| 6 (trên cùng) | Tuất | Thổ | Phụ Mẫu | Thế |
| 5 | Thân | Kim | Huynh Đệ | — |
| 4 | Ngọ | Hỏa | Quan Quỷ | — |
| 3 | Thìn | Thổ | Phụ Mẫu | Ứng |
| 2 | Dần | Mộc | Thê Tài | — |
| 1 (dưới cùng) | Tý | Thủy | Tử Tôn | — |

Vị trí Thế/Ứng ở đây theo đúng quy tắc Bát Cung (Thuần Càn là quẻ mở đầu Cung Càn nên Thế đặt ở hào
6, Ứng cách 3 hào nên ở hào 3) — xem chi tiết ở bài [Thế Ứng](/huong-dan/the-ung).

Từ bảng này, người luận quẻ đã có đủ dữ liệu để đi bước tiếp theo: biết hào nào là Dụng Thần ứng với
câu hỏi của mình (xem bài [Lục Thân](/huong-dan/luc-than)), rồi mới xét hào đó đang vượng hay suy theo
ngày tháng hỏi việc.

## Vì sao Nạp Giáp quan trọng, không chỉ là chi tiết kỹ thuật

Nạp Giáp không phải là bước "cho có" — nó là điều kiện bắt buộc để làm hai việc mà cách đọc quẻ theo
nghĩa lý không làm được:

1. **Xác định vai trò Lục Thân của từng hào** (Phụ Mẫu, Huynh Đệ, Quan Quỷ, Thê Tài, Tử Tôn) — từ đó
   chọn đúng hào nào đại diện cho việc bạn đang hỏi (Dụng Thần).
2. **Xét vượng suy của hào đó theo Nhật–Nguyệt** (ngày, tháng hỏi việc) — vì mỗi Địa Chi có quan hệ
   sinh, khắc, vượng, suy khác nhau với Địa Chi của ngày/tháng hiện tại.

Đây đúng là phần QIChing tự tính cho mọi quẻ, không phải tra bảng thủ công — bạn có thể
[thử gieo một quẻ](/) và xem trực tiếp bảng Nạp Giáp mà công cụ tính ra.

---

*Ghi chú biên tập (không đưa lên bản publish): bảng Địa Chi/Ngũ Hành/Lục Thân/Thế-Ứng của Thuần Càn
đã tính tay theo đúng logic `business.napGiapLucThan`/`napGiapQueThuong`/`napGiapQueHa`,
`queDich.ts` (map Thế-Ứng) và dữ liệu thật ở `queKinhDich.ts`/`que6Hao.ts` — độ tin cậy cao, nhưng
vẫn nên domain reviewer tính tay lại một lần độc lập trước khi publish, không chỉ tin bản nháp AI.
Phần lịch sử Thiên Can/Kinh Phòng/Tăng San Bốc Dịch chưa có nguồn trích dẫn cụ thể — domain reviewer
nên đối chiếu với một ấn bản đáng tin cậy trước khi publish, đặc biệt nếu muốn trích nguyên văn.*
