# QIChing Web (migration)

Repository này chứa cả hai phiên bản của QIChing:

- Source web mới (React + TypeScript) nằm tại thư mục gốc.
- Source desktop cũ (C#/.NET Framework 3.5/WinForms) nằm trong [`legacy/`](legacy/README.md).

Bản viết lại của ứng dụng desktop QIChing ([`legacy/`](legacy/README.md), C#/.NET Framework/WinForms)
thành static SPA — React + TypeScript, không backend/database server. Xem đầy đủ bối cảnh,
quyết định kiến trúc và lý do trong [`legacy/project-brain/`](legacy/project-brain/), đặc biệt:

- [`01-tong-quan-du-an.md`](legacy/project-brain/01-tong-quan-du-an.md) — ứng dụng gốc làm gì
- [`05-ke-hoach-migrate-web.md`](legacy/project-brain/05-ke-hoach-migrate-web.md) — kế hoạch migrate chi tiết theo từng giai đoạn
- [`06-deployment.md`](legacy/project-brain/06-deployment.md) — kế hoạch deploy (Cloudflare Pages/GitHub Pages, static hosting)

## Trạng thái hiện tại

**Đã làm (Giai đoạn 1 — tầng nghiệp vụ TypeScript):**

- `src/core/lunar.ts` — bọc thư viện `lunar-calendar-ts-vi` (cùng gốc thuật toán Hồ Ngọc
  Đức/Meeus 1998 với bản C# gốc) để tính Can Chi Năm/Tháng/Ngày/Giờ, Tiết Khí, Giờ Hoàng
  Đạo. Áp dụng đúng quy tắc đổi ngày 23h của bản gốc.
- `src/core/const.ts` — port nguyên văn `Const.cs`.
- `src/core/business.ts` — port `Business/business.cs` (an quẻ, biến quẻ, Nạp Giáp, Tuần
  Không, tìm ngày tốt...).
- `src/core/queDich.ts` — port class `Business/QueDich.cs` (bao gồm tính điểm vượng suy
  Lục Thân — `GiaiQue`/`GiaiQueCuocDoi`).
- `src/core/types.ts` — port `Hao.cs`, `QueInfo.cs`.
- `src/core/data/` — dữ liệu tra cứu tĩnh, xem trạng thái chi tiết từng bảng ở
  `src/core/data/README.md`. `que6Hao.ts` (64 dòng Cung/Quẻ Thượng-Hạ/Hào Thế) và
  `napAm.ts` (60 dòng) đã điền, đối chiếu trực tiếp với bytes thật của `KinhDich.sdf`.
- `src/core/storage.ts` — lưu trữ "quẻ đã lưu" qua `localStorage` (Giai đoạn 3 của kế
  hoạch), thay cho bảng `InfoQue` (không migrate dữ liệu cũ — xem lý do trong kế hoạch
  migrate). Có thêm export/import JSON thủ công cho nhu cầu đồng bộ nhiều thiết bị.
- `src/core/__tests__/business.test.ts`, `que6Hao.test.ts`, `storage.test.ts` — test cho
  các hàm/dữ liệu đã có, bao gồm test tự-nhất-quán cho toàn bộ 64 dòng Que6Hao (chạy:
  `npm test`).

**CHƯA làm — cần dữ liệu thật trước khi tiếp tục:**

Bảng `queKinhDich.ts` (8 dòng Nạp Giáp Bát Quái — Địa Chi gán cho hào 1-6 mỗi quẻ đơn) vẫn
là **stub rỗng**. Đây là bảng rủi ro cao nhất còn lại (chiều tăng/giảm Địa Chi khác nhau
giữa các quẻ, có biến thể thật giữa các nguồn) — đã thử đối chiếu trực tiếp `KinhDich.sdf`
nhưng không tìm được vùng dữ liệu đủ tin cậy (xem `src/core/data/README.md` để biết chi
tiết và bước tiếp theo: export qua TableAdapter trên máy Windows). **Toàn bộ pipeline an quẻ
(`QueDich.giaiQue`) sẽ throw lỗi rõ ràng cho tới khi bảng này được điền** — đây là chủ đích,
không phải bug.

**Chưa bắt đầu (Giai đoạn 4 theo kế hoạch):**

- Giao diện React (trang chủ xem quẻ, trang Tìm ngày tốt, trang Quẻ đã lưu) — hiện dự án chỉ
  có trang mặc định của Vite, chưa có UI thật nào gọi tới `src/core/`.
- Web Worker cho vòng lặp "Tìm ngày tốt" khi quét khoảng thời gian dài.

## Chạy thử

```bash
npm install
npm test        # chạy bộ test hiện có
npm run dev      # chạy dev server (hiện chỉ có trang mặc định của Vite, chưa có UI thật)
```

## Bước tiếp theo được đề xuất

1. Export dữ liệu thật từ `KinhDich.sdf` theo `src/core/data/README.md`, điền vào
   `queKinhDich.ts` (bảng duy nhất còn thiếu).
2. Viết bộ test hồi quy đối chiếu kết quả `GiaiQue` end-to-end với bản desktop trên nhiều
   mốc thời gian mẫu (Giai đoạn 5 của kế hoạch) — bắt buộc trước khi tin dùng kết quả.
3. Xây tầng `localStorage` cho "quẻ đã lưu" + giao diện React theo mapping form → trang đã
   nêu trong `05-ke-hoach-migrate-web.md`, Giai đoạn 4.
