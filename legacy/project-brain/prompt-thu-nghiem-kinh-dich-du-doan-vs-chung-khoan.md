# Prompt: Thử nghiệm kiểm định khả năng dự đoán của Kinh Dịch đối với thị trường chứng khoán

## Mục tiêu

Kiểm tra bằng thực nghiệm xem việc khởi quẻ Kinh Dịch theo **thời gian thật** (Mai Hoa Dịch Số) có cho ra dự đoán chiều tăng/giảm của chỉ số Dow Jones Industrial Average (DJIA) tốt hơn mức ngẫu nhiên 50/50 hay không.

Đây **không phải** kiểm định tâm linh/siêu hình — đây là câu hỏi thống kê thuần túy: *"chuỗi số sinh ra từ công thức khởi quẻ theo ngày-tháng-năm-giờ có tương quan thống kê với chuỗi biến động giá thực tế hay không?"*

---

## Dữ liệu đầu vào

- **Nguồn**: chỉ số Dow Jones (DJIA), dữ liệu lịch sử hằng ngày.
- Repo tham khảo đã dùng: `https://github.com/fja05680/dow-sp500-100-years` (file `DJA.csv`), nguồn gốc trích từ measuringworth.com — dữ liệu từ 1885-05-02 đến 2019-12-24, khoảng 36.863 phiên.
- Có thể thay bằng nguồn khác đáng tin cậy hơn (FRED: `https://fred.stlouisfed.org/series/DJIA`) nếu muốn đối chiếu.
- Mỗi ngày cần: **ngày giao dịch (năm-tháng-ngày)** và **giá đóng cửa (Close)**.

## Định nghĩa "thực tế tăng/giảm"

Với mỗi phiên `i` (i > 0):
- `thực_tế = "tang"` nếu `Close[i] > Close[i-1]`
- `thực_tế = "giam"` nếu `Close[i] < Close[i-1]`
- Bỏ qua nếu `Close[i] == Close[i-1]` (thị trường đứng yên)

---

## Phương pháp khởi quẻ: dùng thẳng code hiện thời của qiching

Khởi quẻ theo thời gian bằng đúng module TypeScript mà QIChing.org đang chạy thật — không port lại
công thức bằng tay, không dùng thư viện ngoài nào để tính Mai Hoa Dịch Số, nhằm loại trừ khả năng
lệch thuật toán giữa bản thử nghiệm và bản sản phẩm thật.

Dùng đúng class/hàm sau (đã đọc trực tiếp trong repo, không suy đoán):

```ts
import { QueDich } from "src/core/queDich";

const dt = new Date(nam, thang - 1, ngay, 10, 0, 0); // xem mục "10h00 sáng" bên dưới
const que = new QueDich(dt); // gọi business.xacDinhQueKinhDich(dt, amLich) bên trong
que.giaiQue(); // tính điểm vượng suy cho từng Lục Thân — bắt buộc gọi trước khi đọc diemLucThan
```

`new QueDich(dt)` tự làm toàn bộ phần chuyển đổi/tính toán cần thiết (đổi sang âm lịch, tính quẻ
thượng/hạ theo Tiên Thiên Bát Quái, xác định hào động) — xem `business.xacDinhQueKinhDich` và
`business.tinhSoQueTuTong` nếu cần đối chiếu chi tiết thuật toán. Hai điểm kỹ thuật cần biết khi đọc
lại thuật toán này:

- QIChing có xử lý riêng năm nhuận quanh tiết Đại Hàn (`amLich.tietKhi.includes("Đại hàn")`) khi
  tính chỉ số năm dùng cho công thức.
- Giờ được quy về canh giờ qua `tinhSoQueTuTong`, không phải một phép chia/tra bảng đơn giản.

**Yêu cầu khi viết script chạy thử nghiệm**: với mỗi ngày, chỉ cần lấy đúng một con số —
`que.diemLucThan["Thê Tài"]` (điểm vượng suy của Lục Thân Thê Tài, xem mục quy tắc dịch quẻ bên
dưới).

---

## Quy tắc dịch quẻ ra dự đoán tăng/giảm (quy ước cố định — PHẢI định trước, không đổi sau khi biết kết quả)

**Cập nhật 2026-09-05**: bỏ quy tắc đếm âm-dương cũ, thay bằng điểm vượng suy Thê Tài mà QIChing tự
tính — Thê Tài là Lục Thân đại diện tiền tài/của cải trong Lục Hào (xem
`src/core/data/lucThan.ts`), nên hợp lý hơn để kiểm định tương quan với chỉ số chứng khoán so với
việc đếm hào âm/dương thuần túy không gắn với "chủ đề" nào.

```
que = new QueDich(dt); que.giaiQue()
diem = que.diemLucThan["Thê Tài"]   // số nguyên, có thể âm — xem giải thích thang điểm bên dưới

nếu diem > 4: dự_đoán = "tang"
ngược lại:    không đưa ra dự đoán — bỏ qua ngày này, không tính vào mẫu so sánh
```

**Cập nhật 2026-09-05 (4) — quy tắc một chiều:** chỉ phát tín hiệu khi có bằng chứng mạnh, và
**không còn dự đoán "giam" cho bất kỳ ngày nào** — mọi ngày dưới ngưỡng đều bị loại khỏi mẫu so sánh
(coi như "không đủ bằng chứng để phán đoán", không phải "dự đoán giảm rồi tính sai/đúng"). Cách tính
"tỷ lệ đúng" cũng đổi theo: chỉ còn đúng một phe dự đoán ("tang"), nên tỷ lệ đúng = tỷ lệ những ngày
đạt ngưỡng mà thực tế THẬT SỰ tăng — vẫn dùng chung công thức z-test so với kỳ vọng 50% ở mục "Thống
kê cần tính" bên dưới, chỉ khác là cỡ mẫu giờ nhỏ hơn nhiều.

**Cập nhật 2026-09-05 (5):** nâng ngưỡng từ `diem > 3` lên `diem > 4`. Ở mức `>3`, ngưỡng còn trùng
với mức "RẤT CÁT" có sẵn ở `src/ui/giaiThich.ts` (`diemso > 3`); từ mức `>4` trở lên KHÔNG còn khớp
với ngưỡng nghiệp vụ có sẵn nào trong code hiển thị của app nữa — đây thuần là ngưỡng chọn riêng cho
thử nghiệm (siết chặt thêm để chỉ giữ lại các phiên có bằng chứng Ngũ Hành mạnh nhất), cần nêu rõ
điều này khi báo cáo, không nói nhầm là "theo đúng ngưỡng RẤT CÁT của QIChing".

**Cập nhật 2026-09-05 (6):** nâng tiếp lên `diem > 5`, cùng lý do (siết chặt thêm để xem tín hiệu
có mạnh lên khi chỉ giữ các phiên vượng cực điểm hay không). Thang điểm `diemLucThan` chỉ nhận vài
giá trị rời rạc quanh các mốc cộng dồn ±1/±2 — cỡ mẫu ở ngưỡng `>5` do đó nhỏ hơn nhiều so với `>4`,
cần đọc z-test cẩn thận hơn vì mẫu nhỏ dễ dao động mạnh giữa các lần đổi ngưỡng.

**Cập nhật 2026-09-05 (9) — quy tắc hiện hành:** quay lại `diem > 4` sau khi thử `>5` (bản 6) cho
cỡ mẫu quá nhỏ (~1.100-1.600 phiên tuỳ giờ khởi quẻ) và kết quả dao động thất thường giữa các giờ
khởi quẻ khác nhau (xem `KET-QUA.md` của các lần chạy 0h00/8h00/10h00) — dấu hiệu của nhiễu ngẫu
nhiên hơn là tín hiệu thật.

*(Lịch sử các quy tắc trước — không còn dùng, giữ lại để đối chiếu: (1) `diem > 1` tăng / `diem < 1`
giảm / `==1` bỏ qua — ngưỡng `>1` khi đó khớp đúng mức "CÁT" ở `giaiThich.ts`; (2) đổi thành `diem >=
1` tăng / `<1` giảm, không còn bỏ qua `==1` — nhưng khi đó `==1` rơi vào mức "BÌNH" (trung tính) theo
`giaiThich.ts`, không còn khớp ngưỡng nghiệp vụ nào 1-1 nữa.)*

*(Lưu ý: đây vẫn là một quy ước đơn giản hóa để có tiêu chí đo lường được — một người luận Lục Hào
thực thụ còn xét thêm quan hệ với Thế/Ứng, hào động/hào biến của riêng Thê Tài, Tuần Không, và quan
trọng nhất là "sự việc cụ thể đang hỏi" — ở đây không có câu hỏi cụ thể nào ngoài "chỉ số DJIA ngày
mai tăng hay giảm", nên đây là một cách dùng công cụ Lục Hào ngoài đúng bối cảnh thiết kế của nó.
Nếu module qiching của bạn có thêm logic Thế/Ứng theo chủ đề "tài lộc/kinh doanh"
(`src/ui/luanQue.ts`, `CHU_DE` → Lục Thân "Thê Tài"), có thể cân nhắc dùng `dungThanTuChuDe` +
`mucDoThuanLoi` — nhưng đó là một biến thể khác, cần định trước và ghi rõ, không trộn với quy tắc
`diemLucThan["Thê Tài"] > 4` ở trên trong cùng một lần chạy.)*

---

## Thống kê cần tính

1. Tổng số ngày dự đoán đúng / sai.
2. Tỷ lệ đúng (%) trên tổng số ngày so sánh hợp lệ.
3. **z-test một mẫu so với tỷ lệ kỳ vọng 50%**:
   ```
   p_hat = số_đúng / tổng_số
   se = sqrt(0.5 * 0.5 / tổng_số)
   z = (p_hat - 0.5) / se
   ```
   Nếu `|z| > 1.96` → có ý nghĩa thống kê ở mức tin cậy 95%.
4. (Khuyến nghị thêm) Chạy lại với **nhiều seed/nhiều biến thể quy tắc dịch quẻ khác nhau** để kiểm tra độ ổn định, tránh kết luận vội từ một lần chạy.

---

## Việc cần làm khi dùng module qiching thật

1. Viết một script (khuyến nghị Node/TypeScript, chạy thẳng trong repo qiching để import trực tiếp
   `src/core/queDich.ts` — không cần cài thêm phụ thuộc ngoài hay port lại thuật toán) — xem mẫu gọi
   ở mục "Phương pháp khởi quẻ" bên trên.
2. Với mỗi ngày trong dữ liệu DJIA: tạo `dt = new Date(năm, tháng - 1, ngày, 10, 0, 0)` (giờ địa
   phương 10h00 sáng — cập nhật 2026-09-05 (8), sau khi đã thử 0h00 và 8h00 sáng; đúng cách
   `XemQue.tsx` dựng `thoiDiem` — KHÔNG dùng `Date.UTC`/ISO string có `Z`, vì `QueDich` đọc
   giờ qua `time.getHours()` theo giờ hệ thống chạy script), gọi
   `new QueDich(dt).giaiQue()`, lấy `diemLucThan["Thê Tài"]`, áp quy tắc `>4` ở trên (chỉ phát tín
   hiệu "tang", không phát "giam") so với thực tế `Close[i]` vs `Close[i-1]`.
3. Tính lại tỷ lệ đúng và z-test — loại khỏi mẫu CẢ HAI loại ngày: `Close[i]==Close[i-1]` (đứng yên)
   VÀ `diemLucThan["Thê Tài"] <= 4` (không đủ bằng chứng để phát tín hiệu "tang"). Cỡ mẫu còn lại sẽ
   nhỏ hơn nhiều so với các lần chạy trước — ghi rõ con số cụ thể trong báo cáo.
4. Chạy thêm một đường baseline ngẫu nhiên (ví dụ tung đồng xu 50/50 cho từng ngày, không dùng ngày
   tháng thật) trên cùng bộ dữ liệu và cùng thống kê — để có mốc "không có tín hiệu" tự chạy được,
   thay vì dựa vào kết quả của một lần chạy khác trước đó.
5. Báo cáo trung thực dù kết quả ra sao — kể cả khi ra "có ý nghĩa thống kê", cần chạy thêm kiểm định chéo (ví dụ chia dữ liệu thành 2 nửa, chạy riêng từng nửa) trước khi kết luận, vì với hơn 36.000 điểm dữ liệu, một kết quả "có ý nghĩa thống kê" (p<0.05) đôi khi vẫn có thể là ngẫu nhiên nếu thử nhiều quy tắc dịch quẻ khác nhau rồi chỉ báo cáo quy tắc "trúng" nhất (vấn đề "p-hacking").

---

## Giới hạn cần nêu rõ khi báo cáo kết quả (dù bằng module nào)

- Đây là thử nghiệm minh họa, tự thiết kế, **chưa qua bình duyệt khoa học**.
- Quy tắc dịch quẻ → tăng/giảm là quy ước đơn giản hóa, không phản ánh đầy đủ cách luận giải của một người hành nghề Mai Hoa/Lục Hào thực thụ (thiếu yếu tố thể-dụng, câu hỏi cụ thể, ngữ cảnh).
- Không kiểm định được vai trò của **con người diễn giải quẻ** — chỉ kiểm định được phần thuật toán/công thức thuần túy.
- Dữ liệu DJIA lấy từ nguồn cộng đồng (GitHub), nên đối chiếu lại với nguồn chính thức (FRED, measuringworth.com) trước khi công bố kết quả chính thức.
