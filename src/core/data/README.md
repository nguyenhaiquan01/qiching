# Dữ liệu tra cứu — trạng thái & nguồn gốc

Xem `legacy/project-brain/05-ke-hoach-migrate-web.md` (Giai đoạn 2) và `06-deployment.md`
để biết bối cảnh đầy đủ. Toàn bộ dữ liệu trong thư mục này **đã điền xong và đối chiếu với
dữ liệu thật** của `KinhDich.sdf` gốc:

| File | Trạng thái | Nguồn |
|---|---|---|
| `nguHanh.ts` | ✅ Đã điền, đối chiếu | Ngũ Hành tương sinh/tương khắc — khớp `DBexport/NguHanh.csv`. |
| `canChi.ts` | ✅ Đã điền, đối chiếu | Ngũ Hành/Âm Dương Can/Chi/quái, Lục Thần khởi theo Can ngày — khớp `DBexport/CanChi.csv`. |
| `lucThan.ts` | ✅ Đã điền, đối chiếu | Văn bản giải nghĩa nguyên văn — khớp `DBexport/LucThan.csv`. |
| `que6Hao.ts` | ✅ Đã điền, đối chiếu | Cung + Quẻ Thượng/Hạ + Hào Thế của 64 quẻ — khớp `DBexport/Que6Hao.csv`. |
| `napAm.ts` | ✅ Đã điền, đối chiếu | Tên Nạp Âm + Ngũ Hành của 60 dòng Lục Thập Hoa Giáp — khớp `DBexport/NapAm.csv`. |
| `queKinhDich.ts` | ✅ Đã điền, đối chiếu | Nạp Giáp Bát Quái (Địa Chi hào 1-6 của 8 quẻ đơn) — khớp `DBexport/QueKinhDich.csv`. |

**`src/core/__tests__/dbexport.test.ts`** so trực tiếp từng dòng trong các file `.ts` trên
với CSV tương ứng trong `DBexport/` (nếu thư mục đó tồn tại cục bộ — test tự skip nếu không
có, không bắt buộc phải commit `DBexport/` vào git). Đây là bộ test hồi quy Giai đoạn 5 của
kế hoạch migrate: nếu ai sửa nhầm một giá trị trong `data/*.ts`, test sẽ phát hiện ngay vì so
với nguồn gốc, không chỉ tự-nhất-quán nội bộ.

## Quá trình lấy dữ liệu thật

`KinhDich.sdf` là định dạng SQL Server Compact Edition — không có công cụ đọc trên máy không
chạy Windows (native, không có bản Linux/macOS). Quá trình lấy dữ liệu trải qua 3 giai đoạn:

1. **Đọc bytes thô** — trước khi có công cụ export, đọc trực tiếp `.sdf` ở dạng UTF-16LE thô
   (`data.decode("utf-16-le", errors="ignore")`, lọc đoạn in được) để tìm và đối chiếu từng
   đoạn text. Cách này lấy được `que6Hao.ts` (đối chiếu được vị trí Hào Thế qua hậu tố
   `(Thế)` gắn kèm text) và phần lớn `napAm.ts`, nhưng KHÔNG tìm được vùng dữ liệu đủ sạch
   cho `queKinhDich.ts` (Nạp Giáp Bát Quái — bảng rủi ro cao nhất, xem lý do ở Giai đoạn 2
   của kế hoạch migrate).
2. **Thư viện `sqlce` (Python, PyPI)** — một parser SQL CE thuần Python/cross-platform, đọc
   được đúng schema và dữ liệu của `QueKinhDich` (khớp 100% với bytes thô đọc ở bước 1, và
   khớp cấu trúc nhị phân chuẩn của quẻ đơn — xác nhận độc lập). Bảng `Que6Hao` đọc qua thư
   viện này bị lệch cột (giá trị 10 cột chuỗi bị xoay vòng +2 vị trí — có vẻ là bug của thư
   viện khi bảng có nhiều cột `NULL`/`ntext` phía sau) nhưng sau khi tự sửa độ lệch, kết quả
   khớp 100% với suy luận cổ điển đã dùng trước đó.
3. **Export CSV chính thức** (`DBexport/*.csv`) — người dùng tự export toàn bộ `KinhDich.sdf`
   ra CSV bằng công cụ riêng. Đây là nguồn xác thực cuối cùng, khớp hoàn toàn với kết quả của
   bước 2, và là dữ liệu mà `src/core/data/*.ts` hiện dùng.

Việc đối chiếu qua 3 nguồn độc lập này có giá trị thật: phát hiện được vài chỗ tên Nạp Âm của
app khác với bản phổ biến nhất hay thấy ("Lô trung hỏa" không phải "Lư trung hỏa", "Tuyền
trung thủy" không phải "Tỉnh tuyền thủy", "Bích lôi hỏa" không phải "Tích lịch hỏa", "Tang
thạch mộc" không phải "Tang đố mộc", kể cả một chỗ viết hoa không nhất quán trong chính DB
gốc: "Thạch Lựu mộc") — nếu chỉ dùng trí nhớ/kiến thức cổ điển phổ biến sẽ sai các chỗ này.

## Nếu cần export lại từ `.sdf` sau này

Không cần dò bytes thô nữa — dùng thư viện `sqlce` (Python, `pip install sqlce`,
https://github.com/boykopovar/sqlce) hoặc công cụ export CSV đã dùng ở bước 3. Lưu ý bug xoay
cột đã phát hiện ở `Que6Hao` khi dùng thư viện `sqlce` trực tiếp (không xảy ra với cách export
CSV) — nếu đọc lại bằng `sqlce`, đối chiếu chéo với `DBexport/*.csv` hoặc với công thức suy
luận cổ điển trong comment đầu `que6Hao.ts` trước khi tin dùng.
