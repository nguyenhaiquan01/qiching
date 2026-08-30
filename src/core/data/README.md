# Dữ liệu tra cứu — trạng thái & hướng dẫn lấy dữ liệu thật

Xem `project-brain/05-ke-hoach-migrate-web.md` (Giai đoạn 2) và `06-deployment.md` trong
repo `nhq-iching/trunk` để biết bối cảnh đầy đủ. Tóm tắt trạng thái từng file trong thư mục
này:

| File | Trạng thái | Ghi chú |
|---|---|---|
| `nguHanh.ts` | ✅ Đã điền | Ngũ Hành tương sinh/tương khắc — kiến thức cổ điển cố định, không mơ hồ. |
| `canChi.ts` | ✅ Đã điền | Ngũ Hành/Âm Dương của Can/Chi/quái, Lục Thần khởi theo Can ngày — cố định, không mơ hồ. |
| `lucThan.ts` | ⚠️ Đã điền, CHƯA đối chiếu | Chỉ là text hiển thị (không ảnh hưởng tính toán), nhưng cách diễn đạt có thể khác bản gốc. |
| `que6Hao.ts` | ✅ Đã điền, đối chiếu bytes thật | Cung + Quẻ Thượng/Hạ + Hào Thế của 64 quẻ — xem phương pháp bên dưới. |
| `napAm.ts` | ✅ Đã điền, 23/30 tên đối chiếu bytes thật | Chỉ trường `nguHanh` (dùng để tô màu) được dùng trong tính toán; `tenNapAm` là hiển thị. |
| `queKinhDich.ts` | ❌ STUB rỗng — **rủi ro cao nhất còn lại** | Nạp Giáp Bát Quái (8 dòng): Địa Chi gán cho hào 1-6 của mỗi quẻ đơn. Đã thử đối chiếu trực tiếp `KinhDich.sdf` (xem bên dưới) nhưng KHÔNG tìm được vùng heap sạch, đủ tin cậy — khác với `que6Hao`/`napAm`, phần này chưa xác nhận được. |

## `que6Hao.ts` và `napAm.ts` đã được điền như thế nào

Máy dùng để viết code này ban đầu không có `dotnet`/`mono`/`sqlcmd` nên không mở được
`KinhDich.sdf` (SQL Server Compact Edition) theo cách thông thường. Thay vào đó, file được
đọc trực tiếp ở dạng bytes thô (`.sdf` không mã hoá — text bên trong là UTF-16LE xen kẽ với
cấu trúc nhị phân của SQL CE, đọc được bằng `data.decode("utf-16-le", errors="ignore")` rồi
lọc các đoạn in được). Cách này KHÔNG parse được toàn bộ record một cách có hệ thống (không
có tool đọc `.sdf` đúng nghĩa), nhưng đủ để tìm và đối chiếu từng đoạn text cụ thể:

- **`que6Hao.ts`**: nhiều dòng rải đều cả 8 Cung được đối chiếu trực tiếp — ví dụ bytes gốc
  cho thấy "PHONG ĐỊA QUAN" có hậu tố `(Thế)` gắn ở hào thứ 4, khớp đúng suy luận Hào Thế=4.
  Từ các điểm đối chiếu này rút ra công thức chung cho toàn bộ 64 dòng (xem comment đầu file
  `que6Hao.ts`): Cung theo nhóm 8 quẻ liên tiếp trong `Const.que6hao`, Quẻ Thượng/Hạ suy trực
  tiếp từ chính tên quẻ kép, Hào Thế theo vị trí trong nhóm (lý thuyết Bát Cung Quái chuẩn:
  Thuần=6, Nhất/Nhị/Tam/Tứ/Ngũ Thế=1-5, Du Hồn=4, Quy Hồn=3). Có test tự-nhất-quán ở
  `src/core/__tests__/que6Hao.test.ts` xác nhận cấu trúc này đúng trên toàn bộ 64 dòng.
- **`napAm.ts`**: tìm thấy một vùng heap sạch (không có cấu trúc B-tree/index xen giữa) chứa
  23/30 tên Nạp Âm cùng Ngũ Hành, đọc được nguyên văn — bao gồm 3 trường hợp app dùng biến
  thể tên khác với bản phổ biến nhất ("Tuyền trung thủy" không phải "Tỉnh tuyền thủy", "Bích
  lôi hỏa" không phải "Tích lịch hỏa", "Tang thạch mộc" không phải "Tang đố mộc") — chứng tỏ
  việc đối chiếu bytes thật sự có giá trị so với chỉ dùng trí nhớ. 7 dòng còn lại (đánh dấu
  `confirmed: false` trong file) điền theo tên cổ điển phổ biến, rủi ro thấp vì bảng Lục Thập
  Hoa Giáp cố định thứ tự Can Chi, chỉ có thể lệch nhỏ về CÁCH GỌI (không ảnh hưởng `nguHanh`
  — trường duy nhất thật sự dùng để tính toán).

## Vì sao `queKinhDich.ts` (Nạp Giáp Bát Quái) vẫn còn stub

Đã thử tìm vùng heap của bảng `QueKinhDich` bằng cùng phương pháp trên nhưng không thành
công: các đoạn nghi là dữ liệu này (gần byte offset ~55000-56800 của file) nằm trong cấu
trúc lặp lại giống B-tree index (nhiều bản sao gần giống nhau, mỗi bản chỉ có 3 trong 6 giá
trị Địa Chi mong đợi, xen giữa các byte nhị phân không rõ ý nghĩa) — không đủ tin cậy để kết
luận đâu là `NapGiapH1..H6` thật sự của từng quẻ đơn. Đây là bảng có rủi ro sai lệch cao nhất
theo kế hoạch migrate gốc (chiều tăng/giảm Địa Chi khác nhau giữa các quẻ đơn), nên **không
hand-fabricate từ trí nhớ cổ điển** dù có thể tái hiện một bảng "Kinh Phòng nạp giáp" phổ
biến — bảng này thực sự có biến thể giữa các nguồn (khác với `que6Hao`/`napAm` ở trên, vốn
gần như không có tranh cãi về cấu trúc/thứ tự).

### Bước tiếp theo để hoàn thành `queKinhDich.ts`

1. Trên máy Windows có sẵn Visual Studio/.NET Framework để mở được `QueKinhDich.sln`
   (repo `nhq-iching/trunk`), thêm tạm một đoạn code nhỏ (ví dụ trong `frmLoadQue_Load`
   hoặc một unit test tạm trong `VCTest`) gọi TableAdapter **đã có sẵn và hoạt động được**
   trong `dataAccess.cs`: `QueKinhDichTA.GetData(tenque)` cho từng tên trong `Const.TienThien`
   (8 dòng).
2. Serialize kết quả ra JSON theo đúng hình dạng field trong `types.ts` (`QueKinhDichRow`).
3. Copy JSON đó vào `queKinhDich.ts`, thay cho mảng rỗng `[]`.
4. Bắt buộc: chạy bộ test hồi quy (Giai đoạn 5 của kế hoạch) đối chiếu `GiaiQue` end-to-end
   với kết quả bản desktop trên nhiều mốc thời gian mẫu trước khi tin dùng — xem
   `describe.todo` cuối `src/core/__tests__/business.test.ts`.

Nếu sau này có máy Windows/.NET và muốn thử lại việc đọc `.sdf` trực tiếp thay vì bước trên:
công cụ như SQL Server Compact Toolbox hoặc `System.Data.SqlServerCe` (native, chỉ chạy được
trên Windows) sẽ đọc đúng được toàn bộ bảng mà không cần đoán cấu trúc byte như cách trên.
